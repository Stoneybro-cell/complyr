// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";

interface IEndpoint {
    struct SetConfigParam {
        uint32 eid;
        uint32 configType;
        bytes config;
    }
    function setConfig(address oappAddress, address lib, SetConfigParam[] calldata params) external;
    function setSendLibrary(address oapp, uint32 eid, address lib) external;
    function setReceiveLibrary(address oapp, uint32 eid, address lib, uint256 gracePeriod) external;
}

/**
 * @notice Configures the ULN (Ultra Light Node) send config for ComplianceBridge on Flow Testnet.
 * Run this on Flow Testnet.
 *
 * Usage:
 *   forge script script/SetLzConfig.s.sol:SetSendConfig \
 *     --rpc-url https://testnet.evm.nodes.onflow.org \
 *     --account sepoliakey --broadcast
 */
contract SetSendConfig is Script {
    // Flow Testnet LZ endpoint
    address constant ENDPOINT = 0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff;
    // Flow Testnet Send ULN302 library
    address constant SEND_LIB = 0xd682ECF100f6F4284138AA925348633B0611Ae21;
    // ComplianceBridge on Flow
    address constant OAPP = 0x48898Dc7186b5AbD6028D12810CdeFf8eD8cb46B;
    // Destination: Sepolia EID
    uint32 constant DST_EID = 40161;
    // LayerZero Labs DVN on Flow Testnet (for Sepolia pathway)
    address constant LZ_DVN = 0x88B27057A9e00c5F05DDa29241027afF63f9e6e0;

    // configType 2 = ULN config
    uint32 constant CONFIG_TYPE_ULN = 2;
    // configType 1 = Executor config
    uint32 constant CONFIG_TYPE_EXECUTOR = 1;

    // Executor on Flow Testnet
    address constant EXECUTOR = 0x4Cf1B3Fa61465c2c907f82fC488B43223BA0CF93;

    function run() external {
        vm.startBroadcast();

        // -- Step 1: Explicitly set the send library (in case default isn't applying at app level)
        IEndpoint(ENDPOINT).setSendLibrary(OAPP, DST_EID, SEND_LIB);
        console.log("1. Send library set");

        // -- Step 2: Set ULN Send Config
        // UlnConfig: (confirmations, requiredDVNCount, optionalDVNCount, optionalDVNThreshold, requiredDVNs[], optionalDVNs[])
        address[] memory dvns = new address[](1);
        dvns[0] = LZ_DVN;

        bytes memory ulnConfig = abi.encode(
            uint64(1),   // confirmations
            uint8(1),    // requiredDVNCount
            uint8(0),    // optionalDVNCount
            uint8(0),    // optionalDVNThreshold
            dvns,        // requiredDVNs
            new address[](0) // optionalDVNs
        );

        IEndpoint.SetConfigParam[] memory params = new IEndpoint.SetConfigParam[](1);
        params[0] = IEndpoint.SetConfigParam({
            eid: DST_EID,
            configType: CONFIG_TYPE_ULN,
            config: ulnConfig
        });

        IEndpoint(ENDPOINT).setConfig(OAPP, SEND_LIB, params);
        console.log("2. ULN + Executor send config set on Flow");

        vm.stopBroadcast();
    }
}

/**
 * @notice Configures the ULN receive config for ComplianceReceiver on Sepolia.
 * Run this on Sepolia.
 *
 * Usage:
 *   forge script script/SetLzConfig.s.sol:SetReceiveConfig \
 *     --rpc-url https://ethereum-sepolia-rpc.publicnode.com \
 *     --account sepoliakey --broadcast
 */
contract SetReceiveConfig is Script {
    // Sepolia LZ endpoint
    address constant ENDPOINT = 0x6EDCE65403992e310A62460808c4b910D972f10f;
    // Sepolia Receive ULN302 library
    address constant RECEIVE_LIB = 0xdAf00F5eE2158dD58E0d3857851c432E34A3A851;
    // ComplianceReceiver on Sepolia
    address constant OAPP = 0xE1A3dd302709Fb0f1E957D1F6A68870c50E2c68a;
    // Source: Flow Testnet EID
    uint32 constant SRC_EID = 40321;
    // LayerZero Labs DVN on Sepolia (for Flow Testnet pathway)
    address constant LZ_DVN = 0x8eebf8b423B73bFCa51a1Db4B7354AA0bFCA9193;

    uint32 constant CONFIG_TYPE_ULN = 2;

    function run() external {
        vm.startBroadcast();

        // Step 1: Explicitly set receive library
        IEndpoint(ENDPOINT).setReceiveLibrary(OAPP, SRC_EID, RECEIVE_LIB, 0);
        console.log("1. Receive library set");

        // Step 2: Set ULN Receive Config
        address[] memory dvns = new address[](1);
        dvns[0] = LZ_DVN;

        bytes memory ulnConfig = abi.encode(
            uint64(1),   // confirmations
            uint8(1),    // requiredDVNCount
            uint8(0),    // optionalDVNCount
            uint8(0),    // optionalDVNThreshold
            dvns,        // requiredDVNs
            new address[](0) // optionalDVNs
        );

        IEndpoint.SetConfigParam[] memory params = new IEndpoint.SetConfigParam[](1);
        params[0] = IEndpoint.SetConfigParam({
            eid: SRC_EID,
            configType: CONFIG_TYPE_ULN,
            config: ulnConfig
        });

        IEndpoint(ENDPOINT).setConfig(OAPP, RECEIVE_LIB, params);
        console.log("2. ULN receive config set on Sepolia");

        vm.stopBroadcast();
    }
}
