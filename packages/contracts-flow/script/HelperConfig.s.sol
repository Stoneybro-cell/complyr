// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    /*//////////////////////////////////////////////////////////////
                                 TYPES
    //////////////////////////////////////////////////////////////*/
    struct NetworkConfig {
        address implementation;
        address registry;
        address complianceBridge;
        address owner;
        address verifyingSigner;
        address entryPoint;
        address lzEndpoint;
        uint32 targetEid;
    }

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    NetworkConfig public localNetwork;
    uint256 constant FLOW_CHAIN_ID = 545;
    uint256 constant LOCAL_CHAIN_ID = 31337;
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    error HelperConfig__UnsupportedNetwork();

    /*CONSTRUCTOR*/

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function getConfig() external returns (NetworkConfig memory) {
        return getConfigByChainId(block.chainid);
    }

    function getConfigByChainId(uint256 chainId) public returns (NetworkConfig memory) {
        if (chainId == LOCAL_CHAIN_ID) {
            return getAnvilEthConfig();
        } else if (chainId == FLOW_CHAIN_ID) {
            return getFlowEthConfig();
        } else {
            revert HelperConfig__UnsupportedNetwork();
        }
    }

    function getFlowEthConfig() public pure returns (NetworkConfig memory) {
        return NetworkConfig({
            implementation: 0x8EcC0e5B6e37b91EFdD7323603731A59073173a7, // SmartWalletImplementation
            registry: 0xd9eB514fE43eEc5455883d213Db12Fd6AF145aFe,       // IntentRegistry
            complianceBridge: 0x33156Bf5Dc961d5AFf26b1e4fc65623ef36BC352, 
            owner: 0x0D96081998fd583334fd1757645B40fdD989B267,
            verifyingSigner: 0xb1640Df792f8549e545023c3f298E7af90532642,
            entryPoint: 0x0000000071727De22E5E9d8BAf0edAc6f37da032,
            lzEndpoint: 0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff, // LayerZero V2 Testnet Endpoint
            targetEid: 40161 // Sepolia Target
        });
    }

    function getAnvilEthConfig() public returns (NetworkConfig memory) {
        if (localNetwork.implementation != address(0)) {
            return localNetwork;
        }

        localNetwork = NetworkConfig({
            implementation: address(0), 
            registry: address(0), 
            complianceBridge: address(0),
            owner: msg.sender,
            verifyingSigner: msg.sender,
            entryPoint: 0x0000000071727De22E5E9d8BAf0edAc6f37da032,
            lzEndpoint: address(0),
            targetEid: 0
        });

        return localNetwork;
    }
}
