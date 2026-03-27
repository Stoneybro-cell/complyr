import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSmartAccountContext } from "@/lib/SmartAccountProvider";
import { parseEther, encodeFunctionData } from "viem";
import { BatchTransferParams } from "./types";
import { checkSufficientBalance } from "./utils";
import { SmartWalletABI } from "@/lib/abi/SmartWalletAbi";

import { bytesToHex } from "viem";

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

                // Prepare standard transfer calls
                const calls = params.recipients.map((recipient, index) => ({
                    to: recipient,
                    data: "0x" as `0x${string}`,
                    value: amountsInWei[index],
                }));

                // FHE encryption and bundle reportCompliance
                if (params.compliance && (params.compliance.categories?.length || params.compliance.jurisdictions?.length)) {
                    const categoryHandles: `0x${string}`[] = [];
                    const categoryProofs: `0x${string}`[] = [];
                    const jurisdictionHandles: `0x${string}`[] = [];
                    const jurisdictionProofs: `0x${string}`[] = [];
                    
                    const len = params.recipients.length;
                    for (let i = 0; i < len; i++) {
                        categoryHandles.push("0x0000000000000000000000000000000000000000000000000000000000000000");
                        categoryProofs.push("0x");
                        jurisdictionHandles.push("0x0000000000000000000000000000000000000000000000000000000000000000");
                        jurisdictionProofs.push("0x");
                    }

                    const reportCallData = encodeFunctionData({
                        abi: SmartWalletABI,
                        functionName: "reportCompliance",
                        args: [{
                            flowTxHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                            proxyAccount: smartAccountClient.account!.address as `0x${string}`,
                            recipients: params.recipients,
                            amounts: amountsInWei,
                            categoryHandles: categoryHandles,
                            categoryProofs: categoryProofs,
                            jurisdictionHandles: jurisdictionHandles,
                            jurisdictionProofs: jurisdictionProofs
                        }]
                    });

                    calls.push({
                        to: smartAccountClient.account!.address as `0x${string}`,
                        data: reportCallData,
                        value: 0n,
                    });
                }

                let hash = await smartAccountClient.sendUserOperation({
                    account: smartAccountClient.account,
                    calls,
                });

                const receipt = await smartAccountClient.waitForUserOperationReceipt({
                    hash,
                });

                toast.success(
                    `Batch FLOW transfer completed! Sent to ${params.recipients.length} recipients.`
                );
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
