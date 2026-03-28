// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SmartWalletFactory.sol";
import "../src/SmartWallet.sol";
import "../src/ComplianceBridge.sol";

contract BridgeTest is Test {
    SmartWalletFactory factory;
    ComplianceBridge bridge;
    SmartWallet implementation;

    address flowEndpoint = 0x6C7Ab2202C98C4227C5c46f1417D81144DA716Ff;
    uint32 zamaEid = 40161;

    function setUp() public {
        vm.createSelectFork("https://testnet.evm.nodes.onflow.org");
        
        implementation = new SmartWallet(0x0000000071727De22E5E9d8BAf0edAc6f37da032, address(1));
        
        // Deploy bridge with placeholder registry and factory
        bridge = new ComplianceBridge(
            flowEndpoint,
            address(this),
            zamaEid,
            address(this), // registry
            address(0) // factory (set to 0 for now)
        );
        
        factory = new SmartWalletFactory(address(implementation), address(bridge));
        
        // Give bridge some FLOW
        vm.deal(address(bridge), 10 ether);

        // wire peers so lzSend works (dummy receiver address)
        bytes32 peer = bytes32(uint256(uint160(address(0x1234))));
        bridge.setPeer(zamaEid, peer);
        
        // authorize factory in bridge
        bridge.setSmartWalletFactory(address(factory));
    }

    function testDeployWithAutoRegister() public {
        address owner = vm.addr(1);
        
        // factory create smart account -> calls registerAccount
        // registerAccount quotes and sends lz message with 0 msg.value
        address account = factory.createSmartAccount(owner);
        
        assertTrue(account != address(0));
    }
}
