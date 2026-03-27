import { toast } from "sonner";
import { useWallets } from "@privy-io/react-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSmartAccountContext } from "@/lib/SmartAccountProvider";
import { encodeFunctionData, parseEther, zeroAddress } from "viem";
import { IntentRegistryABI } from "@/lib/abi/IntentRegistryABI";
import { RegistryAddress } from "@/lib/CA";
import { RecurringPaymentParams } from "./types";
import { checkSufficientBalance } from "./utils";

import { bytesToHex } from "viem";

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

                // Initialize Dummy Compliance Data
                const compliance = params.compliance || {};
                const len = params.recipients.length;

                const categoryHandles: `0x${string}`[] = [];
                const categoryProofs: `0x${string}`[] = [];
                const jurisdictionHandles: `0x${string}`[] = [];
                const jurisdictionProofs: `0x${string}`[] = [];

                for (let i = 0; i < len; i++) {
                    categoryHandles.push("0x0000000000000000000000000000000000000000000000000000000000000000");
                    categoryProofs.push("0x");
                    jurisdictionHandles.push("0x0000000000000000000000000000000000000000000000000000000000000000");
                    jurisdictionProofs.push("0x");
                }

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

                const receipt = await smartAccountClient.waitForUserOperationReceipt({
                    hash,
                });

                toast.success("Recurring FLOW payment intent created successfully!");
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
