// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.28;

import "forge-fhevm/FhevmTest.sol";
import {CoprocessorConfig} from "@fhevm/solidity/lib/Impl.sol";
import {aclAdd, fhevmExecutorAdd, kmsVerifierAdd} from "@fhevm/host-contracts/addresses/FHEVMHostAddresses.sol";
import "../src/ComplianceReceiver.sol";
import "../src/ComplianceRegistry.sol";
import {Origin} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";

contract MockEndpoint {
    function setDelegate(address) external {}
}

contract ComplianceReceiverHarness is ComplianceReceiver {
    constructor(address _endpoint, address _owner, address _registry) ComplianceReceiver(_endpoint, _owner, _registry) {}
    
    function expose_lzReceive(Origin calldata origin, bytes calldata payload, bytes calldata extraData) external {
        _lzReceive(origin, bytes32(0), payload, address(0), extraData);
    }
}

contract ComplianceReceiverTest is FhevmTest {
    ComplianceReceiverHarness receiver;
    ComplianceRegistry registry;
    address endpoint = makeAddr("endpoint");
    address owner = makeAddr("owner");

    function setUp() public override {
        super.setUp();
        registry = new ComplianceRegistry(owner);
        
        // Ensure the registry uses the test coprocessor addresses from FhevmTest
        FHE.setCoprocessor(CoprocessorConfig({
            ACLAddress: aclAdd,
            CoprocessorAddress: fhevmExecutorAdd,
            KMSVerifierAddress: kmsVerifierAdd
        }));

        address mockEndpoint = address(new MockEndpoint());
        receiver = new ComplianceReceiverHarness(mockEndpoint, owner, address(registry));
        
        vm.prank(owner);
        registry.setLzReceiver(address(receiver));
    }

    function test_LzReceive_Register() public {
        address proxyAccount = makeAddr("proxy");
        address masterEOA = makeAddr("master");
        
        // MSG_REGISTER = 1
        bytes memory payload = abi.encode(uint8(1), proxyAccount, masterEOA);
        
        Origin memory origin;
        receiver.expose_lzReceive(origin, payload, "");
        
        assertEq(registry.companyMasters(proxyAccount), masterEOA);
    }

    function test_LzReceive_Report() public {
        address proxyAccount = makeAddr("proxy");
        address masterEOA = makeAddr("master");
        
        // Register first
        vm.prank(address(receiver));
        registry.registerAccount(proxyAccount, masterEOA);

        address[] memory recipients = new address[](1);
        recipients[0] = makeAddr("recipient");
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 500;
        
        bytes32[] memory catH = new bytes32[](1);
        bytes[] memory catP = new bytes[](1);
        
        // Use real FHE encryption for the report
        // User must be lzReceiver, target registry
        (externalEuint8 h1, bytes memory p1) = encryptUint8(1, address(receiver), address(registry));
        catH[0] = externalEuint8.unwrap(h1);
        catP[0] = p1;
        
        ComplianceReceiver.ComplianceReport memory report = ComplianceReceiver.ComplianceReport({
            flowTxHash: keccak256("flow"),
            proxyAccount: proxyAccount,
            recipients: recipients,
            amounts: amounts,
            categoryHandles: catH,
            categoryProofs: catP,
            jurisdictionHandles: catH,
            jurisdictionProofs: catP
        });

        // MSG_REPORT = 2
        bytes memory payload = abi.encode(uint8(2), report);
        
        Origin memory origin;
        receiver.expose_lzReceive(origin, payload, "");
        
        assertEq(registry.getCompanyRecordCount(proxyAccount), 1);
    }
}
