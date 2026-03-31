// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SmartWalletFactory.sol";
import "../src/SmartWallet.sol";

contract SmartWalletFactoryTest is Test {
    SmartWalletFactory factory;
    SmartWallet implementation;
    address dummyBridge = address(0x2222);

    function setUp() public {
        // Label the addresses for easier debugging
        vm.label(dummyBridge, "ComplianceBridge");
        
        implementation = new SmartWallet(makeAddr("registry"), dummyBridge);
        
        vm.etch(dummyBridge, "1"); // Dummy code
        
        factory = new SmartWalletFactory(address(implementation), dummyBridge);
    }

    function test_CreateSmartAccount() public {
        address owner = makeAddr("owner");
        
        // Fund factory for dripping
        vm.deal(address(factory), 100 ether);
        
        address account = factory.createSmartAccount(owner);
        assertTrue(account != address(0));
        
        // Verify owner is correct
        SmartWallet wallet = SmartWallet(payable(account));
        assertEq(wallet.sOwner(), owner);
        
        // Verify drip
        assertEq(account.balance, 100 ether);
    }

    function test_GetPredictedAddress() public {
        address owner = makeAddr("owner");
        address predicted = factory.getPredictedAddress(owner);
        address account = factory.createSmartAccount(owner);
        assertEq(predicted, account);
    }

    function test_GetUserClone() public {
        address owner = makeAddr("owner");
        address account = factory.createSmartAccount(owner);
        address retrievedAccount = factory.getUserClone(owner);
        assertEq(account, retrievedAccount);
    }

    function test_MultipleWallets() public {
        address owner1 = makeAddr("owner1");
        address owner2 = makeAddr("owner2");
        
        address account1 = factory.createSmartAccount(owner1);
        address account2 = factory.createSmartAccount(owner2);
        
        assertTrue(account1 != account2);
    }

    function test_DeploymentWithNoFunds() public {
        address owner = makeAddr("owner-no-funds");
        // Ensure factory has 0 balance
        vm.deal(address(factory), 0);
        
        address account = factory.createSmartAccount(owner);
        assertTrue(account != address(0));
        assertEq(account.balance, 0); // No drip
    }
}
