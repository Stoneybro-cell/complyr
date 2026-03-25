// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import {ComplianceRegistry} from "./ComplianceRegistry.sol";
import "encrypted-types/EncryptedTypes.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ComplianceReceiver
 * @author zion livingstone
 * @notice OApp deployed on Sepolia fhEVM. Receives the cross-chain LayerZero
 *         message from Flow EVM and logs it in the encrypted ComplianceRegistry.
 * @custom:security-contact zionlivingstone4@gmail.com
 */
contract ComplianceReceiver is OApp {
    
    /// @notice Address of the ComplianceRegistry to insert the encrypted profiles
    ComplianceRegistry public registry;

    /// @notice Emitted when a cross-chain payload is successfully decoded and recorded
    event ComplianceDecodedAndRecorded(bytes32 flowTxHash, address sender);

    /**
     * @param _endpoint The LayerZero Endpoint address on Sepolia
     * @param _owner The delegate/owner of the OApp
     * @param _registry The address of the deployed ComplianceRegistry contract
     */
    constructor(
        address _endpoint,
        address _owner,
        address _registry
    ) OApp(_endpoint, _owner) Ownable(_owner) {
        registry = ComplianceRegistry(_registry);
    }

    /**
     * @notice Set or update the registry address
     */
    function setRegistry(address _registry) external onlyOwner {
        registry = ComplianceRegistry(_registry);
    }

    // Message type identifiers
    uint8 public constant MSG_REGISTER = 1;
    uint8 public constant MSG_REPORT = 2;

    /// @notice Per-recipient compliance report mirroring the Flow-side struct.
    struct ComplianceReport {
        bytes32 flowTxHash;
        address proxyAccount;
        address[] recipients;
        uint256[] amounts;
        bytes32[] categoryHandles;
        bytes[] categoryProofs;
        bytes32[] jurisdictionHandles;
        bytes[] jurisdictionProofs;
    }

    /**
     * @notice Implement the core LayerZero receive function.
     * @dev Called automatically by the LayerZero Executor when a message arrives from Flow.
     *      Decodes the payload and pushes it into the Zama fhEVM registry.
     * 
     * @param _origin Details about the sender (source eid, sender address)
     * @param _guid The unique message identifier
     * @param payload The encoded parameters sent from `ComplianceBridge.sol`
     * @param _executor The address of the LayerZero Executor
     * @param _extraData Arbitrary data passed by the relayer
     */
    function _lzReceive(
        Origin calldata _origin, // origin.sender = the ComplianceBridge.sol
        bytes32 _guid,
        bytes calldata payload,
        address _executor,
        bytes calldata _extraData
    ) internal override {
        // First 32 bytes are always the message type padded by abi.encode
        uint8 msgType = abi.decode(payload[:32], (uint8));

        if (msgType == MSG_REGISTER) {
            (
                , // msgType
                address proxyAccount,
                address masterEOA
            ) = abi.decode(payload, (uint8, address, address));

            registry.registerCompany(proxyAccount, masterEOA);
            emit ComplianceDecodedAndRecorded(bytes32(0), proxyAccount);

        } else if (msgType == MSG_REPORT) {
            (, ComplianceReport memory report) = abi.decode(payload, (uint8, ComplianceReport));

            // Convert bytes32[] to externalEuint8[] for the registry
            uint256 recipientCount = report.recipients.length;
            externalEuint8[] memory catHandles = new externalEuint8[](recipientCount);
            externalEuint8[] memory jurHandles = new externalEuint8[](recipientCount);

            for (uint256 i = 0; i < recipientCount; i++) {
                catHandles[i] = externalEuint8.wrap(report.categoryHandles[i]);
                jurHandles[i] = externalEuint8.wrap(report.jurisdictionHandles[i]);
            }

            registry.recordTransaction(
                report.flowTxHash,
                report.proxyAccount,
                report.recipients,
                report.amounts,
                catHandles,
                report.categoryProofs,
                jurHandles,
                report.jurisdictionProofs
            );

            emit ComplianceDecodedAndRecorded(report.flowTxHash, report.proxyAccount);
        }
    }
}
