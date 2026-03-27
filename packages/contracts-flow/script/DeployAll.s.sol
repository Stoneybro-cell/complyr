// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

import {IntentRegistry} from "../src/IntentRegistry.sol";
import {ComplianceBridge} from "../src/ComplianceBridge.sol";
import {SmartWallet} from "../src/SmartWallet.sol";
import {SmartWalletFactory} from "../src/SmartWalletFactory.sol";
import {VerifyingPaymaster} from "../src/VerifyingPaymaster.sol";
import {IEntryPoint} from "@account-abstraction/contracts/interfaces/IEntryPoint.sol";

/**
 * @title DeployAll
 * @notice Master deploy script. Deploys all Flow-side contracts in the correct
 *         dependency order and wires them together atomically.
 *
 * Usage:
 *   forge script script/DeployAll.s.sol:DeployAll \
 *     --rpc-url https://testnet.evm.nodes.onflow.org \
 *     --account sepoliakey \
 *     --broadcast
 *
 * After running, paste the printed addresses into:
 *   - apps/web/src/lib/CA.ts
 *   - HelperConfig.s.sol (for future partial re-deployments)
 */
contract DeployAll is Script {
    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        vm.startBroadcast();

        // ── Phase 1: Core Registry ───────────────────────────────────────────
        // IntentRegistry must come first — everything else depends on it.
        IntentRegistry registry = new IntentRegistry(config.owner);
        console.log("1. IntentRegistry:       ", address(registry));

        // ── Phase 2: Cross-Chain Bridge ──────────────────────────────────────
        // Bridge needs the registry. Factory address is address(0) for now —
        // we patch it at the end of this script once we know the factory address.
        ComplianceBridge bridge = new ComplianceBridge(
            config.lzEndpoint,
            config.owner,
            config.targetEid,
            address(registry),
            address(0) // factory — patched below
        );
        console.log("2. ComplianceBridge:     ", address(bridge));

        // ── Phase 3: Smart Wallet Implementation ─────────────────────────────
        // Immutably binds registry and bridge into the implementation bytecode.
        SmartWallet implementation = new SmartWallet(address(registry), address(bridge));
        console.log("3. SmartWallet Impl:     ", address(implementation));

        // ── Phase 4: Factory ─────────────────────────────────────────────────
        SmartWalletFactory factory = new SmartWalletFactory(address(implementation), address(bridge));
        console.log("4. SmartWalletFactory:   ", address(factory));

        // ── Phase 5: Verifying Paymaster ─────────────────────────────────────
        VerifyingPaymaster paymaster = new VerifyingPaymaster(
            IEntryPoint(config.entryPoint),
            config.verifyingSigner
        );
        console.log("5. VerifyingPaymaster:   ", address(paymaster));

        // ── Phase 6: Wire Everything Together ────────────────────────────────

        // 6a. Tell the registry where to send compliance reports
        registry.setComplianceBridge(address(bridge));
        console.log("6a. Registry -> Bridge wired");

        // 6b. Patch the bridge with the now-known factory address
        bridge.setSmartWalletFactory(address(factory));
        console.log("6b. Bridge -> Factory wired");

        // 6c. Optionally fund the paymaster if the deployer has enough balance
        if (address(msg.sender).balance > 0.2 ether) {
            paymaster.deposit{value: 0.1 ether}();
            console.log("6c. Paymaster funded with 0.1 FLOW");
        }

        vm.stopBroadcast();

        // ── Summary ───────────────────────────────────────────────────────────
        console.log("=== DEPLOYMENT COMPLETE - Paste into CA.ts ===");
        console.log("RegistryAddress:        ", address(registry));
        console.log("ComplianceBridgeAddress: ", address(bridge));
        console.log("SmartWalletImplAddress: ", address(implementation));
        console.log("SmartWalletFactoryAddress:", address(factory));
        console.log("VerifyingPaymasterAddress:", address(paymaster));
        console.log("==============================================");
        console.log("Remember: also run setPeer on both OApp sides!");
    }
}
