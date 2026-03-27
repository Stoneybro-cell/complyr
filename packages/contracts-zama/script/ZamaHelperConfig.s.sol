// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";

contract ZamaHelperConfig is Script {
    struct NetworkConfig {
        address lzEndpoint;
        address owner;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaConfig();
        } else {
            activeNetworkConfig = getAnvilConfig();
        }
    }

    function getSepoliaConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            lzEndpoint: 0x6EDCE65403992e310A62460808c4b910D972f10f, // LZ V2 Testnet Endpoint
            owner: 0x0D96081998fd583334fd1757645B40fdD989B267
        });
    }

    function getAnvilConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            lzEndpoint: address(0),
            owner: msg.sender
        });
    }
}
