import { createSmartAccountClient } from "permissionless";
import { http } from "viem";
import { flowTestnet } from "viem/chains";
import { bundlerTransport, publicClient } from "./bundler";
import { CustomSmartAccount } from "./customSmartAccount";

export async function getSmartAccountClient(
  customSmartAccount: CustomSmartAccount
) {
  return createSmartAccountClient({
    account: customSmartAccount,
    chain: flowTestnet,
    client: publicClient,
    bundlerTransport: bundlerTransport,
    userOperation: {
      estimateFeesPerGas: async () => {
        const fees = await publicClient.estimateFeesPerGas();
        return {
          maxFeePerGas: fees.maxFeePerGas ?? 1000000000n,
          maxPriorityFeePerGas: fees.maxPriorityFeePerGas ?? 1000000000n,
        };
      },
    },
  });
}