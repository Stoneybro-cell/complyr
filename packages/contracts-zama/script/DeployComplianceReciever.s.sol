// packages/contracts-zama/script/DeployComplianceReceiver.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {ComplianceReceiver} from "../src/ComplianceReceiver.sol";

contract DeployComplianceReceiver is Script {
    address constant LZ_ENDPOINT_ZAMA = 0x6EDCE65403992e310A62460808c4b910D972f10f;

    function run() external {
        // You'll need to provide your ComplianceRegistry address here
        address registry = 0x722aD9117477Ad4Cb345F1419bd60FAFEACAfB00;
        address owner = 0x0D96081998fd583334fd1757645B40fdD989B267;

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
