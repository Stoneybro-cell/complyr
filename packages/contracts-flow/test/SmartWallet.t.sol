// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/SmartWallet.sol";
import "../src/SmartWalletFactory.sol";
import "../src/IComplianceBridge.sol";

contract SmartWalletTest is Test {
    SmartWallet implementation;
    SmartWallet wallet;
    SmartWalletFactory factory;
    
    address owner = makeAddr("owner");
    address recipient = makeAddr("recipient");
    address entryPoint = 0x0000000071727De22E5E9d8BAf0edAc6f37da032;
    address dummyRegistry = makeAddr("registry");
    address dummyBridge = makeAddr("bridge");

    function setUp() public {
        // Use a fork if we want to interact with actual EntryPoint, 
        // but for basic unit tests we can just mock or label addresses.
        vm.label(entryPoint, "EntryPoint");
        
        vm.etch(dummyRegistry, "1");
        vm.etch(dummyBridge, "1");

        implementation = new SmartWallet(dummyRegistry, dummyBridge);
        factory = new SmartWalletFactory(address(implementation), dummyBridge);
        
        // Deploy a wallet for testing
        address predicted = factory.getPredictedAddress(owner);
        vm.deal(address(factory), 100 ether); // Factory needs funds if it drips
        
        vm.prank(owner);
        address account = factory.createSmartAccount(owner);
        wallet = SmartWallet(payable(account));
    }

    function test_Initialization() public {
        assertEq(wallet.sOwner(), owner);
        assertEq(wallet.INTENT_REGISTRY(), dummyRegistry);
        assertEq(wallet.COMPLIANCE_BRIDGE(), dummyBridge);
    }

    function test_CannotReinitialize() public {
        vm.expectRevert(); // Initializable: already initialized
        wallet.initialize(makeAddr("newOwner"));
    }

    function test_ReceiveETH() public {
        uint256 amount = 1 ether;
        vm.deal(address(this), amount);
        (bool success, ) = address(wallet).call{value: amount}("");
        assertTrue(success);
        assertEq(address(wallet).balance, amount + 100 ether); // 100 ether from factory drip
    }

    function test_ExecuteSingle() public {
        uint256 amount = 1 ether;
        vm.deal(address(wallet), amount);
        
        bytes memory data = "";
        
        vm.prank(owner);
        wallet.execute(recipient, amount, data);
        
        assertEq(recipient.balance, amount);
    }

    function test_ExecuteBatch() public {
        address recipient2 = makeAddr("recipient2");
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        vm.deal(address(wallet), amount1 + amount2);
        
        SmartWallet.Call[] memory calls = new SmartWallet.Call[](2);
        calls[0] = SmartWallet.Call({target: recipient, value: amount1, data: ""});
        calls[1] = SmartWallet.Call({target: recipient2, value: amount2, data: ""});
        
        vm.prank(owner);
        wallet.executeBatch(calls);
        
        assertEq(recipient.balance, amount1);
        assertEq(recipient2.balance, amount2);
    }

    function test_UnauthorizedExecute() public {
        vm.prank(makeAddr("attacker"));
        vm.expectRevert(SmartWallet.SmartWallet__Unauthorized.selector);
        wallet.execute(recipient, 1 ether, "");
    }

    function test_SignatureValidation() public {
        bytes32 hash = keccak256("test message");
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(1, hash); // Private key 1 for owner (default for makeAddr if not specified, but let's be explicit)
        
        // makeAddr uses different logic, let's use a known private key
        uint256 privateKey = 0x123;
        address signer = vm.addr(privateKey);
        
        // Re-deploy wallet with this signer
        vm.prank(signer);
        address account = factory.createSmartAccount(signer);
        SmartWallet signWallet = SmartWallet(payable(account));
        
        bytes32 messageHash = keccak256("hello");
        bytes32 ethSignedHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        (v, r, s) = vm.sign(privateKey, ethSignedHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        
        bytes4 magicValue = signWallet.isValidSignature(messageHash, signature);
        assertEq(magicValue, bytes4(0x1626ba7e));
    }
}
