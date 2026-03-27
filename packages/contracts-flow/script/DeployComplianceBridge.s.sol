// packages/contracts-flow/script/DeployComplianceBridge.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ComplianceBridge} from "../src/ComplianceBridge.sol";

contract DeployComplianceBridge is Script {
    address constant LZ_ENDPOINT_FLOW = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    function run() external {
        // You'll need to provide your IntentRegistry address here after Phase 1 deployment
        address intentRegistry = vm.envAddress("INTENT_REGISTRY");
        address owner = msg.sender;

        vm.startBroadcast();
        ComplianceBridge bridge = new ComplianceBridge(
            LZ_ENDPOINT_FLOW,
            owner,
            intentRegistry
        );
        vm.stopBroadcast();

        console.log("ComplianceBridge deployed at:", address(bridge));
    }
}
