// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.28;

import "forge-fhevm/FhevmTest.sol";
import {CoprocessorConfig} from "@fhevm/solidity/lib/Impl.sol";
import {aclAdd, fhevmExecutorAdd, kmsVerifierAdd} from "@fhevm/host-contracts/addresses/FHEVMHostAddresses.sol";
import "../src/ComplianceRegistry.sol";

contract ComplianceRegistryTest is FhevmTest {
    ComplianceRegistry registry;
    address dev = makeAddr("dev");
    address lzReceiver = makeAddr("lzReceiver");
    address proxyAccount = makeAddr("proxyAccount");
    address masterEOA = makeAddr("masterEOA");

    function setUp() public override {
        super.setUp();
        registry = new ComplianceRegistry(dev);
        
        // Ensure the registry uses the test coprocessor addresses from FhevmTest
        FHE.setCoprocessor(CoprocessorConfig({
            ACLAddress: aclAdd,
            CoprocessorAddress: fhevmExecutorAdd,
            KMSVerifierAddress: kmsVerifierAdd
        }));

        vm.prank(dev);
        registry.setLzReceiver(lzReceiver);
    }

    function test_RegisterAccount() public {
        vm.prank(lzReceiver);
        registry.registerAccount(proxyAccount, masterEOA);
        
        assertEq(registry.companyMasters(proxyAccount), masterEOA);
    }

    function test_ManageAuditors() public {
        // First register account
        vm.prank(lzReceiver);
        registry.registerAccount(proxyAccount, masterEOA);
        
        address auditor = makeAddr("auditor");
        
        vm.prank(masterEOA);
        registry.addAuditor(proxyAccount, auditor);
        
        assertTrue(registry.isAuditorActive(proxyAccount, auditor));
        
        address[] memory auditors = registry.getAuditors(proxyAccount);
        assertEq(auditors.length, 1);
        assertEq(auditors[0], auditor);
        
        vm.prank(masterEOA);
        registry.removeAuditor(proxyAccount, auditor);
        assertFalse(registry.isAuditorActive(proxyAccount, auditor));
    }

    function test_RecordTransaction() public {
        vm.prank(lzReceiver);
        registry.registerAccount(proxyAccount, masterEOA);
        
        address[] memory recipients = new address[](1);
        recipients[0] = makeAddr("recipient");
        
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 100;
        
        // Mock encrypted inputs for 1 recipient
        externalEuint8[] memory catHandles = new externalEuint8[](1);
        bytes[] memory catProofs = new bytes[](1);
        externalEuint8[] memory jurHandles = new externalEuint8[](1);
        bytes[] memory jurProofs = new bytes[](1);
        
        // Encrypt some test values (e.g. category 1, jurisdiction 2)
        // Note: the user address in encrypt must match msg.sender (lzReceiver) in the call
        (catHandles[0], catProofs[0]) = encryptUint8(1, lzReceiver, address(registry));
        (jurHandles[0], jurProofs[0]) = encryptUint8(2, lzReceiver, address(registry));
        
        bytes32 txHash = keccak256("tx1");
        
        vm.prank(lzReceiver);
        registry.recordTransaction(
            txHash,
            proxyAccount,
            recipients,
            amounts,
            catHandles,
            catProofs,
            jurHandles,
            jurProofs
        );
        
        assertEq(registry.getCompanyRecordCount(proxyAccount), 1);
        assertEq(registry.totalGlobalRecords(), 1);
        
        (bytes32 retHash, , , ) = registry.getRecordMetadata(proxyAccount, 0);
        assertEq(retHash, txHash);
    }
}
