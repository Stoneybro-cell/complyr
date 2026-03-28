// lib/fhevm.ts — globally loaded client-side via UMD bundle

const ZAMA_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const GATEWAY_URL = "https://gateway.sepolia.zama.ai/";

// Sepolia KMS and ACL addresses
const KMS_CONTRACT_ADDRESS = "0x9D6891A6240D6130c54ae243d8A811eaacDE8A89"; 
const ACL_CONTRACT_ADDRESS = "0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5"; 

let instance: any = null;

// Extend Window interface for the global fhevm object injected by the layout script
declare global {
  interface Window {
    fhevm: any;
  }
}

export async function getFhevmInstance() {
    if (instance) return instance;

    // Use Zama's official prebundled CDN to completely bypass Turbopack's WASM trace!
    if (typeof window === "undefined" || !window.fhevm) {
        throw new Error("fhevmjs bundle not loaded. Check the <Script> tag in your layout.");
    }

    instance = await window.fhevm.createInstance({ 
        networkUrl: ZAMA_RPC_URL,
        gatewayUrl: GATEWAY_URL,
        kmsContractAddress: KMS_CONTRACT_ADDRESS,
        aclContractAddress: ACL_CONTRACT_ADDRESS,
        chainId: 11155111
    });

    return instance;
}
