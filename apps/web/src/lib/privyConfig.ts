import type { PrivyClientConfig } from "@privy-io/react-auth";
import { flowTestnet } from "viem/chains";

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
  },
  defaultChain: flowTestnet,
  supportedChains: [flowTestnet],
  loginMethods: ["email", "google", "github"],
  appearance: {
    accentColor: "#38CCCD",
    theme: "light",
    landingHeader: "Complyr",
    walletChainType: "ethereum-only",
    walletList: ["detected_wallets"],
  },
};
