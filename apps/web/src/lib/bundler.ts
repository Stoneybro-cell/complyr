import { createPublicClient, http } from "viem";
import { flowTestnet } from "viem/chains";

// Skandha self-hosted bundler on Flow EVM testnet
export const bundlerUrl = `http://localhost:14337/rpc`;
export const bundlerTransport = http(bundlerUrl);

// Public client for standard JSON-RPC calls
export const publicClient = createPublicClient({
  chain: flowTestnet,
  transport: http("https://testnet.evm.nodes.onflow.org"),
});