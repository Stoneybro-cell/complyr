// packages/contracts-zama/script/DeployComplianceReceiver.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ComplianceReceiver} from "../src/ComplianceReceiver.sol";

contract DeployComplianceReceiver is Script {
    address constant LZ_ENDPOINT_ZAMA = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    function run() external {
        // You'll need to provide your ComplianceRegistry address here
        address registry = vm.envAddress("COMPLIANCE_REGISTRY");
        address owner = msg.sender;

        vm.startBroadcast();
        ComplianceReceiver receiver = new ComplianceReceiver(
            LZ_ENDPOINT_ZAMA,
            owner,
            registry
        );
        vm.stopBroadcast();

        console.log("ComplianceReceiver deployed at:", address(receiver));
    }
}
