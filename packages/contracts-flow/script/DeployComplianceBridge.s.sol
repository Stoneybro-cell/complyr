
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ComplianceBridge} from "../src/ComplianceBridge.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

contract DeployComplianceBridge is Script {
    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory config = helperConfig.getConfig();

        vm.startBroadcast();
        ComplianceBridge bridge = new ComplianceBridge(
            config.lzEndpoint,
            config.owner,
            config.targetEid,
            config.registry,
            address(0) // smartWalletFactory (set this later or re-deploy after factory)
        );
        vm.stopBroadcast();

        console.log("ComplianceBridge deployed at:", address(bridge));
    }
}
