// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OApp, Origin, MessagingFee} from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import {MessagingReceipt} from "@layerzerolabs/oapp-evm/contracts/oapp/OAppSender.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {IComplianceBridge} from "./IComplianceBridge.sol";

interface ISmartWalletFactory {
    function getUserClone(address user) external view returns (address);
}

interface ISmartWalletOwner {
    function sOwner() external view returns (address);
}

/**
 * @title ComplianceBridge
 * @author zion livingstone
 * @notice Self-funded OApp on Flow EVM that sends compliance data cross-chain to Zama fhEVM.
 * @dev The bridge uses its own balance to pay all LayerZero fees.
 *      Callers never need to send msg.value.
 * @custom:security-contact zionlivingstone4@gmail.com
 */
contract ComplianceBridge is OApp, IComplianceBridge {
    using OptionsBuilder for bytes;

    /*//////////////////////////////////////////////////////////////
                           MESSAGE TYPES
    //////////////////////////////////////////////////////////////*/

    uint8 public constant MSG_REGISTER = 1;
    uint8 public constant MSG_REPORT = 2;

    /*//////////////////////////////////////////////////////////////
                           STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    /// @notice The LayerZero Endpoint ID for the destination chain (Zama Sepolia fhEVM)
    uint32 public targetEid;

    /// @notice Address of the IntentRegistry authorized to send reports
    address public intentRegistry;

    /// @notice Address of the SmartWalletFactory for proxy verification
    address public smartWalletFactory;

    /*//////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    event CompliancePayloadSent(
        bytes32 indexed flowTxHash,
        address indexed proxyAccount,
        uint256 recipientCount
    );

    event RegistrationSent(address indexed proxyAccount, address indexed masterEOA);

    /*//////////////////////////////////////////////////////////////
                               ERRORS
    //////////////////////////////////////////////////////////////*/

    error ComplianceBridge__Unauthorized();
    error ComplianceBridge__InsufficientBridgeBalance();

    /*//////////////////////////////////////////////////////////////
                             CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    /**
     * @param _endpoint The LayerZero Endpoint address on Flow EVM
     * @param _owner The delegate/owner of the OApp
     * @param _targetEid The Endpoint ID for Zama Sepolia
     * @param _intentRegistry The IntentRegistry authorized to call sendComplianceReport
     * @param _smartWalletFactory The SmartWalletFactory for verifying proxy callers
     */
    constructor(
        address _endpoint,
        address _owner,
        uint32 _targetEid,
        address _intentRegistry,
        address _smartWalletFactory
    ) OApp(_endpoint, _owner) Ownable(_owner) {
        targetEid = _targetEid;
        intentRegistry = _intentRegistry;
        smartWalletFactory = _smartWalletFactory;
    }

    /*//////////////////////////////////////////////////////////////
                          ADMIN FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function setIntentRegistry(address _registry) external onlyOwner {
        intentRegistry = _registry;
    }

    function setSmartWalletFactory(address _factory) external onlyOwner {
        smartWalletFactory = _factory;
    }

    /*//////////////////////////////////////////////////////////////
                         ACCESS CONTROL
    //////////////////////////////////////////////////////////////*/

    /**
     * @dev Verifies the caller is authorized: owner, IntentRegistry, or a legitimate SmartWallet proxy.
     */
    modifier onlyAuthorized() {
        if (msg.sender != owner() && msg.sender != intentRegistry) {
            // Check if caller is a legitimate SmartWallet proxy deployed by the factory
            if (smartWalletFactory == address(0)) revert ComplianceBridge__Unauthorized();
            address callerOwner = ISmartWalletOwner(msg.sender).sOwner();
            address registeredClone = ISmartWalletFactory(smartWalletFactory).getUserClone(callerOwner);
            if (registeredClone != msg.sender) revert ComplianceBridge__Unauthorized();
        }
        _;
    }

    /*//////////////////////////////////////////////////////////////
                       REGISTRATION (Factory calls this)
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Sends a one-time registration mapping across the bridge.
     * @dev Self-funded: uses the bridge's own balance for LayerZero fees.
     * @param proxyAccount The business' Smart Wallet Proxy deployed on Flow EVM.
     * @param masterEOA The personal wallet (MetaMask) that owns the proxy.
     * @param _options Optional gas execution settings on destination.
     */
    function registerBusiness(
        address proxyAccount,
        address masterEOA,
        bytes calldata _options
    ) external override {
        bytes memory payload = abi.encode(MSG_REGISTER, proxyAccount, masterEOA);

        MessagingFee memory fee = _quote(targetEid, payload, _options, false);
        if (address(this).balance < fee.nativeFee) revert ComplianceBridge__InsufficientBridgeBalance();

        _lzSend(
            targetEid,
            payload,
            _options,
            fee,
            payable(address(this)) // refund excess to bridge treasury
        );

        emit RegistrationSent(proxyAccount, masterEOA);
    }

    /*//////////////////////////////////////////////////////////////
                     COMPLIANCE REPORTING
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Sends a per-recipient compliance report cross-chain to Zama.
     * @dev Self-funded: uses the bridge's own balance for LayerZero fees.
     *      Access restricted to IntentRegistry, owner, or verified SmartWallet proxies.
     * @param report The ComplianceReport with per-recipient encrypted metadata.
     * @param _options LayerZero execution options.
     */
    function sendComplianceReport(
        ComplianceReport calldata report,
        bytes calldata _options
    ) external override onlyAuthorized {
        bytes memory payload = abi.encode(MSG_REPORT, report);

        MessagingFee memory fee = _quote(targetEid, payload, _options, false);
        if (address(this).balance < fee.nativeFee) revert ComplianceBridge__InsufficientBridgeBalance();

        _lzSend(
            targetEid,
            payload,
            _options,
            fee,
            payable(address(this)) // refund excess to bridge treasury
        );

        emit CompliancePayloadSent(report.flowTxHash, report.proxyAccount, report.recipients.length);
    }

    /*//////////////////////////////////////////////////////////////
                           LZ RECEIVE (no-op)
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice The bridge only sends, it never receives.
     */
    function _lzReceive(
        Origin calldata,
        bytes32,
        bytes calldata,
        address,
        bytes calldata
    ) internal override {
        // No-op: Flow bridge doesn't accept incoming messages.
    }

    /// @notice Accept FLOW to fund the bridge treasury.
    receive() external payable {}
}
