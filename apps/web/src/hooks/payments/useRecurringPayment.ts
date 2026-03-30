import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSmartAccountContext } from "@/lib/SmartAccountProvider";
import { encodeFunctionData, parseEther, bytesToHex } from "viem";
import { IntentRegistryABI } from "@/lib/abi/IntentRegistryABI";
import { RegistryAddress } from "@/lib/CA";
import { RecurringPaymentParams } from "./types";
import { checkSufficientBalance } from "./utils";
import { getFhevmInstance } from "@/lib/fhevm";

const ZAMA_CONTRACT_ADDRESS = "0x231Fcd3ae69f723B3AeFfe7B9B876Bb37C4Db4D6";

export function useRecurringPayment(availableEthBalance?: string) {
    const { getClient } = useSmartAccountContext();
    const { wallets } = useWallets();
    const owner = wallets?.find((wallet) => wallet.walletClientType === "privy");
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: RecurringPaymentParams) => {

            try {
                // Calculate total commitment
                const amountPerPayment = params.amounts.reduce((sum, amount) => sum + parseFloat(amount), 0);
                const totalPayments = Math.floor(params.duration / params.interval);
                const totalCommitment = (amountPerPayment * totalPayments).toString();

                const smartAccountClient = await getClient();
                if (!smartAccountClient) {
                    throw new Error("Smart Account Client is not initialized");
                }
                if (!owner?.address) {
                    throw new Error("No connected wallet found");
                }

                const amountsInWei = params.amounts.map((amount) => parseEther(amount));
                const proxyAddress = smartAccountClient.account!.address;

                // 1. Client-side Next/Dynamic FHEVM Encryption (SSR-safe)
                let encryptedData = null;
                const hasComplianceData = params.compliance && (params.compliance.categories?.length || params.compliance.jurisdictions?.length);
                const statusUpdate = (s: string) => params.onStatusUpdate?.(s);

                if (hasComplianceData) {
                    statusUpdate("Encrypting...");
                    const loadingId = toast.loading("Encrypting recurring compliance rules...");
                    try {
                        const fhevm = await getFhevmInstance();
                        const categories = params.compliance?.categories || [];
                        const jurisdictions = params.compliance?.jurisdictions || [];

                        const handles: { categories: string[], jurisdictions: string[] } = { categories: [], jurisdictions: [] };
                        const proofs: { categories: string[], jurisdictions: string[] } = { categories: [], jurisdictions: [] };

                        // The caller address for proof generation must be the smart wallet (proxy account)
                        // NOT the keeper or another hardcoded address
                        const callerAddress = proxyAddress;

                        const encryptionPromises = params.recipients.map(async (recipient, i) => {
                            const catValue = categories[i] !== undefined ? categories[i] : 0;
                            const jurValue = jurisdictions[i] !== undefined ? jurisdictions[i] : 0;

                            const catInput = fhevm.createEncryptedInput(ZAMA_CONTRACT_ADDRESS, callerAddress);
                            catInput.add8(catValue);
                            const catEnc = await catInput.encrypt();

                            const jurInput = fhevm.createEncryptedInput(ZAMA_CONTRACT_ADDRESS, callerAddress);
                            jurInput.add8(jurValue);
                            const jurEnc = await jurInput.encrypt();

                            return {
                                category: { handle: bytesToHex(catEnc.handles[0]), proof: bytesToHex(catEnc.inputProof) },
                                jurisdiction: { handle: bytesToHex(jurEnc.handles[0]), proof: bytesToHex(jurEnc.inputProof) }
                            };
                        });

                        const results = await Promise.all(encryptionPromises);

                        results.forEach(res => {
                            handles.categories.push(res.category.handle);
                            proofs.categories.push(res.category.proof);
                            handles.jurisdictions.push(res.jurisdiction.handle);
                            proofs.jurisdictions.push(res.jurisdiction.proof);
                        });

                        encryptedData = { handles, proofs };
                        toast.dismiss(loadingId);
                    } catch (e) {
                        console.error(e);
                        toast.dismiss(loadingId);
                        statusUpdate("Error");
                        throw new Error("Failed to encrypt compliance parameters.");
                    }
                }

                // If no compliance data, fallback to dummy arrays
                const len = params.recipients.length;
                const categoryHandles = encryptedData ? encryptedData.handles.categories : Array(len).fill("0x0000000000000000000000000000000000000000000000000000000000000000");
                const categoryProofs = encryptedData ? encryptedData.proofs.categories : Array(len).fill("0x");
                const jurisdictionHandles = encryptedData ? encryptedData.handles.jurisdictions : Array(len).fill("0x0000000000000000000000000000000000000000000000000000000000000000");
                const jurisdictionProofs = encryptedData ? encryptedData.proofs.jurisdictions : Array(len).fill("0x");

                // 2. Prepare Intent Registry call 
                const callData = encodeFunctionData({
                    abi: IntentRegistryABI,
                    functionName: "createIntent",
                    args: [
                        params.name,
                        params.recipients,
                        amountsInWei,
                        BigInt(params.duration),
                        BigInt(params.interval),
                        BigInt(params.transactionStartTime),
                        categoryHandles,
                        categoryProofs,
                        jurisdictionHandles,
                        jurisdictionProofs
                    ],
                });

                // 3. Send Base Flow Transaction
                statusUpdate("Signing...");
                const txLoading = toast.loading("Indexing recurring payment...");
                const hash = await smartAccountClient.sendUserOperation({
                    account: smartAccountClient.account,
                    calls: [
                        {
                            to: RegistryAddress,
                            data: callData,
                            value: 0n,
                        },
                    ],
                });

                statusUpdate("Confirming...");
                const receipt = await smartAccountClient.waitForUserOperationReceipt({
                    hash,
                });
                toast.dismiss(txLoading);
                const txHash = receipt.receipt.transactionHash;

                // 4. Relay directly to Zama
                if (encryptedData) {
                    statusUpdate("Anchoring...");
                    toast.loading("Recording recurring intent on Zama...", { id: "relay-toast" });

                    try {
                        const relayRes = await fetch("/api/relay/compliance-record", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                flowTxHash: txHash,
                                proxyAccount: proxyAddress,
                                recipients: params.recipients,
                                amounts: amountsInWei.map(a => a.toString()),
                                categoryHandles: categoryHandles,
                                categoryProofs: categoryProofs,
                                jurisdictionHandles: jurisdictionHandles,
                                jurisdictionProofs: jurisdictionProofs,
                            }),
                        });

                        const relayData = await relayRes.json();
                        if (!relayData.success) {
                            console.warn("[relay] Compliance recording did not succeed:", relayData.error);
                            statusUpdate("Partial Success");
                            toast.error("Intent ok, compliance anchoring failed.", { id: "relay-toast" });
                        } else {
                            statusUpdate("Complete");
                            toast.success("Recurring intent & compliance recorded!", { id: "relay-toast" });
                        }
                    } catch (relayErr) {
                        console.error("[relay] Relay API call failed:", relayErr);
                        statusUpdate("Partial Success");
                        toast.error("Intent ok, relay failed.", { id: "relay-toast" });
                    }
                } else {
                    statusUpdate("Complete");
                    toast.success("Recurring payment intent created!");
                }

                return receipt;
            } catch (error) {
                console.error("Error creating recurring FLOW payment intent:", error);
                const errorMessage = error instanceof Error ? error.message : "Failed to create recurring payment intent";
                toast.error(errorMessage);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
        },
    });
}
