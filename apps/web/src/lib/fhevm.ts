import { createInstance, FhevmInstance } from 'fhevmjs';
import { JsonRpcProvider } from 'ethers'; // Need ethers to fetch chain info if using fhevmjs 0.5+

let instance: FhevmInstance | null = null;

// Zama Sepolia Devnet RPC
const ZAMA_RPC_URL = "https://devnet.zama.ai";

export const getFhevmInstance = async (): Promise<FhevmInstance> => {
  if (instance) return instance;

  try {
    instance = await createInstance({ 
      networkUrl: ZAMA_RPC_URL,
      gatewayUrl: "https://gateway.zama.ai",
      kmsContractAddress: "0x9D6891A6240D6130c54ae243d8A811eaacDE8A89",
      aclContractAddress: "0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5"
    });
    console.log("fhevmjs instance initialized");
    return instance;
  } catch (error) {
    console.error("Failed to initialize fhevmjs:", error);
    throw new Error("Unable to establish connection to Zama network for encryption.");
  }
};
