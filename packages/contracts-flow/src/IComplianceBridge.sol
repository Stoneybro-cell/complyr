// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IComplianceBridge
 * @author zion livingstone
 * @notice Interface for the LayerZero V2 OApp that sends compliance data cross-chain to Zama fhEVM.
 * @dev The bridge is self-funded — it uses its own balance to pay LayerZero fees.
 *      Callers do NOT need to send msg.value.
 * @custom:security-contact zionlivingstone4@gmail.com
 */
interface IComplianceBridge {
    /// @notice Per-recipient compliance report for cross-chain recording.
    /// @dev Each recipient gets their own encrypted category and jurisdiction.
    struct ComplianceReport {
        /// @notice Deterministic ID linking this report to a Flow payment/intent.
        bytes32 flowTxHash;
        /// @notice The business' smart wallet proxy on Flow EVM.
        address proxyAccount;
        /// @notice The recipient addresses in this payment.
        address[] recipients;
        /// @notice The amounts paid to each recipient.
        uint256[] amounts;
        /// @notice One FHE-encrypted category handle per recipient.
        bytes32[] categoryHandles;
        /// @notice One ZKP per recipient for the category ciphertext.
        bytes[] categoryProofs;
        /// @notice One FHE-encrypted jurisdiction handle per recipient.
        bytes32[] jurisdictionHandles;
        /// @notice One ZKP per recipient for the jurisdiction ciphertext.
        bytes[] jurisdictionProofs;
    }

    /**
     * @notice Sends a one-time business registration across the bridge.
     * @dev Bridge self-funds the LayerZero fee from its own balance.
     * @param proxyAccount The business' Smart Wallet Proxy deployed on Flow EVM.
     * @param masterEOA The personal wallet that owns the proxy.
     * @param _options Optional LayerZero execution gas settings.
     */
    function registerBusiness(
        address proxyAccount,
        address masterEOA,
        bytes calldata _options
    ) external;

    /**
     * @notice Sends a cross-chain compliance report over LayerZero V2.
     * @dev Bridge self-funds the LayerZero fee from its own balance.
     * @param report The ComplianceReport with per-recipient encrypted metadata.
     * @param _options Optional LayerZero execution gas settings.
     */
    function sendComplianceReport(
        ComplianceReport calldata report,
        bytes calldata _options
    ) external;
}
