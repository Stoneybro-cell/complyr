// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/IntentRegistry.sol";
import "../src/SmartWallet.sol";
import "../src/SmartWalletFactory.sol";
import "../src/ComplianceBridge.sol";

contract IntentRegistryTest is Test {
    IntentRegistry registry;
    SmartWalletFactory factory;
    SmartWallet implementation;
    address dummyBridge = makeAddr("bridge");

    address owner = makeAddr("owner");
    address recipient1 = makeAddr("recipient1");
    address recipient2 = makeAddr("recipient2");

    function setUp() public {
        registry = new IntentRegistry(address(this));
        
        // Etch bridge code to pass factory check
        vm.etch(dummyBridge, "1");
        
        implementation = new SmartWallet(address(registry), dummyBridge);
        factory = new SmartWalletFactory(address(implementation), dummyBridge);
        
        vm.label(address(registry), "IntentRegistry");
        vm.label(address(factory), "SmartWalletFactory");
    }

    function test_CreateIntent() public {
        address walletAddr = factory.createSmartAccount(owner);
        SmartWallet wallet = SmartWallet(payable(walletAddr));
        
        // Give wallet some funds (100 ether from factory drip + extra)
        vm.deal(walletAddr, 1000 ether);

        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1 ether;
        amounts[1] = 1 ether;

        // Mock FHE inputs (empty for now)
        bytes32[] memory catHandles = new bytes32[](2);
        bytes[] memory catProofs = new bytes[](2);
        bytes32[] memory jurHandles = new bytes32[](2);
        bytes[] memory jurProofs = new bytes[](2);

        vm.prank(walletAddr);
        bytes32 intentId = registry.createIntent(
            "Payroll",
            recipients,
            amounts,
            1 days, // duration
            1 hours, // interval
            0, // start time (now)
            catHandles,
            catProofs,
            jurHandles,
            jurProofs
        );

        assertTrue(intentId != bytes32(0));
        
        // Check commitment (totalCommitment = (1+1) * (24 executions) = 48 ether)
        // because 1 day / 1 hour = 24.
        assertEq(wallet.sCommittedFunds(), 48 ether);
    }

    function test_ExecuteIntentViaUpkeep() public {
        address walletAddr = factory.createSmartAccount(owner);
        vm.deal(walletAddr, 1000 ether);

        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1 ether;
        amounts[1] = 1 ether;

        bytes32[] memory h = new bytes32[](2);
        bytes[] memory p = new bytes[](2);

        vm.prank(walletAddr);
        bytes32 intentId = registry.createIntent("Test", recipients, amounts, 1 days, 1 hours, 0, h, p, h, p);

        // checkUpkeep should be true immediately for the first execution
        (bool upkeepNeeded, bytes memory performData) = registry.checkUpkeep("");
        assertTrue(upkeepNeeded);

        // performUpkeep
        registry.performUpkeep(performData);

        // Verify balances
        assertEq(recipient1.balance, 1 ether);
        assertEq(recipient2.balance, 1 ether);
        
        // verify commitment decreased (48 - 2 = 46)
        assertEq(SmartWallet(payable(walletAddr)).sCommittedFunds(), 46 ether);

        // checkUpkeep should be false now until interval passes
        (upkeepNeeded, ) = registry.checkUpkeep("");
        assertFalse(upkeepNeeded);

        // Time warp 1 hour
        vm.warp(block.timestamp + 1 hours + 1);
        (upkeepNeeded, ) = registry.checkUpkeep("");
        assertTrue(upkeepNeeded);
    }

    function test_CancelIntent() public {
        address walletAddr = factory.createSmartAccount(owner);
        vm.deal(walletAddr, 1000 ether);

        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;

        bytes32[] memory h = new bytes32[](1);
        bytes[] memory p = new bytes[](1);

        vm.prank(walletAddr);
        bytes32 intentId = registry.createIntent("Test", recipients, amounts, 10 hours, 1 hours, 0, h, p, h, p);

        assertEq(SmartWallet(payable(walletAddr)).sCommittedFunds(), 10 ether);

        // Cancel
        vm.prank(walletAddr);
        registry.cancelIntent(intentId);

        assertEq(SmartWallet(payable(walletAddr)).sCommittedFunds(), 0);
    }
}
