// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ISmartWallet
 * @author zion livingstone
 * @notice Interface for Smart Wallet that the Intent Registry interacts with.
 * @custom:security-contact zionlivingstone4@gmail.com
 */
interface ISmartWallet {
    /*//////////////////////////////////////////////////////////////
                                FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Increases the committed funds for intents.
     * @param amount The amount to add to committed funds.
     */
    function increaseCommitment(uint256 amount) external;

    /**
     * @notice Decreases the committed funds after intent execution/cancellation.
     * @param amount The amount to subtract from committed funds.
     */
    function decreaseCommitment(uint256 amount) external;

    /**
     * @notice Executes a batch of transfers as part of an intent.
     * @param recipients The array of recipient addresses.
     * @param amounts The array of amounts corresponding to each recipient.
     * @param intentId The unique identifier for the intent being executed.
     * @param transactionCount The current transaction number within the intent.
     * @return failedAmount The total amount that failed to transfer (in skip mode)
     */
    function executeBatchIntentTransfer(
        address[] calldata recipients,
        uint256[] calldata amounts,
        bytes32 intentId,
        uint256 transactionCount
    ) external returns (uint256 failedAmount);

    /**
     * @notice Returns the available (uncommitted) balance.
     * @return The available balance.
     */
    function getAvailableBalance() external view returns (uint256);
}
