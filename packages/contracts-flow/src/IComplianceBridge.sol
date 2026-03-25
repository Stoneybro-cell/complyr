// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IComplianceBridge {
    struct ComplianceReport {
        bytes32 flowTxHash;
        address proxyAccount;
        address[] recipients;
        uint256[] amounts;
        bytes32 categoryHandle;
        bytes categoryProof;
        bytes32 jurisdictionHandle;
        bytes jurisdictionProof;
    }

    /**
     * @notice Sends a one-time registration mapping across the bridge.
     */
    function registerBusiness(
        address proxyAccount,
        address masterEOA,
        bytes calldata _options
    ) external payable;

    /**
     * @notice Returns the required native fee for a business registration.
     */
    function quoteComplianceCheck(
        address proxyAccount,
        address masterEOA,
        bytes calldata _options
    ) external view returns (uint256 nativeFee);

    /**
     * @notice Sends a cross-chain compliance report over LayerZero V2.
     */
    function sendComplianceReport(
        ComplianceReport calldata report,
        bytes calldata _options
    ) external payable;

    /**
     * @notice Checks the required cross-chain native fee to send the compliance report.
     */
    function quoteComplianceCheck(
        ComplianceReport calldata report,
        bytes calldata _options
    ) external view returns (uint256 nativeFee);
}
