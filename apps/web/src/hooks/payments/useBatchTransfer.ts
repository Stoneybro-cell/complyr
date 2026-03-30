import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSmartAccountContext } from "@/lib/SmartAccountProvider";
import { parseEther, bytesToHex } from "viem";
import { BatchTransferParams } from "./types";
import { checkSufficientBalance } from "./utils";
import { getFhevmInstance } from "@/lib/fhevm";

const ZAMA_CONTRACT_ADDRESS = "0x231Fcd3ae69f723B3AeFfe7B9B876Bb37C4Db4D6";
const RELAY_ADDRESS = "0x0D96081998fd583334fd1757645B40fdD989B267";

export function useBatchTransfer(availableEthBalance?: string) {
    const { getClient } = useSmartAccountContext();
    const { wallets } = useWallets();
    const owner = wallets?.find((wallet) => wallet.walletClientType === "privy");
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (params: BatchTransferParams) => {

            try {
                // Calculate total amount
                const totalAmount = params.amounts.reduce((sum, amount) => sum + parseFloat(amount), 0).toString();

                // Balance check
                if (availableEthBalance) {
                    const balanceCheck = checkSufficientBalance({
                        availableBalance: availableEthBalance,
                        requiredAmount: totalAmount,
                        token: "FLOW"
                    });

                    if (!balanceCheck.sufficient) {
                        throw new Error(balanceCheck.message);
                    }
                }

                const smartAccountClient = await getClient();
                if (!smartAccountClient) {
                    throw new Error("Smart Account Client is not initialized");
                }
                if (!owner?.address) {
                    throw new Error("No connected wallet found");
                }

                const amountsInWei = params.amounts.map((amount) => parseEther(amount));
                const proxyAddress = smartAccountClient.account!.address;

                // 1. Prepare standard transfer calls
                const calls = params.recipients.map((recipient, index) => ({
                    to: recipient,
                    data: "0x" as `0x${string}`,
                    value: amountsInWei[index],
                }));

                // 2. Client-side FHEVM Dynamic Import
                let encryptedData = null;
                const hasComplianceData = params.compliance && (params.compliance.categories?.length || params.compliance.jurisdictions?.length);
                const statusUpdate = (s: string) => params.onStatusUpdate?.(s);

                if (hasComplianceData) {
                    statusUpdate("Encrypting...");
                    const loadingId = toast.loading("Encrypting batch compliance payload...");
                    try {
                        const fhevm = await getFhevmInstance();
                        const categories = params.compliance?.categories || [];
                        const jurisdictions = params.compliance?.jurisdictions || [];

                        const handles: { categories: string[], jurisdictions: string[] } = { categories: [], jurisdictions: [] };
                        const proofs: { categories: string[], jurisdictions: string[] } = { categories: [], jurisdictions: [] };

                        const encryptionPromises = params.recipients.map(async (recipient, i) => {
                            const catValue = categories[i] !== undefined ? categories[i] : 0;
                            const jurValue = jurisdictions[i] !== undefined ? jurisdictions[i] : 0;

                            const catInput = fhevm.createEncryptedInput(ZAMA_CONTRACT_ADDRESS, RELAY_ADDRESS);
                            catInput.add8(catValue);
                            const catEnc = await catInput.encrypt();

                            const jurInput = fhevm.createEncryptedInput(ZAMA_CONTRACT_ADDRESS, RELAY_ADDRESS);
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
                        throw new Error("Failed to encrypt batch compliance parameters.");
                    }
                }

                // 3. Send Base Flow Transaction
                statusUpdate("Signing...");
                const txLoading = toast.loading(`Sending batch FLOW transfer (${params.recipients.length})...`);
                let hash = await smartAccountClient.sendUserOperation({
                    account: smartAccountClient.account,
                    calls,
                });

                statusUpdate("Confirming...");
                const receipt = await smartAccountClient.waitForUserOperationReceipt({ hash });
                toast.dismiss(txLoading);
                const txHash = receipt.receipt.transactionHash;

                // 4. Relay directly to Zama
                if (encryptedData) {
                    statusUpdate("Anchoring...");
                    toast.loading("Recording batch compliance on Zama...", { id: "relay-toast" });

                    try {
                        const relayRes = await fetch("/api/relay/compliance-record", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                flowTxHash: txHash,
                                proxyAccount: proxyAddress,
                                recipients: params.recipients,
                                amounts: amountsInWei.map(a => a.toString()),
                                categoryHandles: encryptedData.handles.categories,
                                categoryProofs: encryptedData.proofs.categories,
                                jurisdictionHandles: encryptedData.handles.jurisdictions,
                                jurisdictionProofs: encryptedData.proofs.jurisdictions,
                            }),
                        });

                        const relayData = await relayRes.json();
                        if (!relayData.success) {
                            console.warn("[relay] Compliance recording did not succeed:", relayData.error);
                            statusUpdate("Partial Success");
                            toast.error("Batch transfer ok, compliance failed.", { id: "relay-toast" });
                        } else {
                            statusUpdate("Complete");
                            toast.success(`Batch transfer & compliance recorded!`, { id: "relay-toast" });
                        }
                    } catch (relayErr) {
                        console.error("[relay] Relay API call failed:", relayErr);
                        statusUpdate("Partial Success");
                        toast.error("Batch transfer ok, relay failed.", { id: "relay-toast" });
                    }
                } else {
                    statusUpdate("Complete");
                    toast.success("Batch FLOW transfer completed!");
                }

                return receipt;
            } catch (error) {
                console.error("Error sending batch FLOW transfer:", error);
                const errorMessage = error instanceof Error ? error.message : "Failed to send batch transfer";
                toast.error(errorMessage);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["walletBalance"] });
        },
    });
}
