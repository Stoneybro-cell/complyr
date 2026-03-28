import type { PrivyClientConfig } from "@privy-io/react-auth";
import { flowTestnet, sepolia } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: "off",
    },
  },
  defaultChain: flowTestnet,
  supportedChains: [flowTestnet, sepolia],
  loginMethods: ["email", "google", "github"],
  appearance: {
    accentColor: "#000000",
    theme: "light",
    logo: "/complyrlogo-dark.svg",
    walletChainType: "ethereum-only",
  },
};
