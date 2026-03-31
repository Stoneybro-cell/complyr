const { createPublicClient, http, encodeFunctionData, parseEther, keccak256, toBytes } = require('viem');
const { flowTestnet } = require('viem/chains');
const client = createPublicClient({ chain: flowTestnet, transport: http('https://testnet.evm.nodes.onflow.org') });
const PROXY = '0xc39f34b0f76a484fC0D9eD9d696c22b8a31f6c2C';
const ENTRY_POINT = '0x0000000071727De22E5E9d8BAf0edAc6f37da032';
const REGISTRY = '0x8Bd539Be7554752DC16B4d96AC857F3752B39cc1';

const smartWalletAbi = [{ type: 'function', name: 'execute', inputs: [{ name: 'target', type: 'address' }, { name: 'value', type: 'uint256' }, { name: 'data', type: 'bytes' }], outputs: [], stateMutability: 'payable' }];
const registryAbi = [{ type: 'function', name: 'createIntent', inputs: [{ name: 'name', type: 'string' }, { name: 'recipients', type: 'address[]' }, { name: 'amounts', type: 'uint256[]' }, { name: 'duration', type: 'uint256' }, { name: 'interval', type: 'uint256' }, { name: 'transactionStartTime', type: 'uint256' }, { name: 'categoryHandles', type: 'bytes32[]' }, { name: 'categoryProofs', type: 'bytes[]' }, { name: 'jurisdictionHandles', type: 'bytes32[]' }, { name: 'jurisdictionProofs', type: 'bytes[]' }], outputs: [{ type: 'bytes32' }], stateMutability: 'nonpayable' }];

const errors = [
  'IntentRegistry__ArrayLengthMismatch()', 'IntentRegistry__InsufficientFunds()', 'IntentRegistry__IntentNotActive()', 'IntentRegistry__IntentNotExecutable()', 'IntentRegistry__IntentNotFound()', 'IntentRegistry__InvalidAmount()', 'IntentRegistry__InvalidDuration()', 'IntentRegistry__InvalidInterval()', 'IntentRegistry__InvalidRecipient()', 'IntentRegistry__InvalidTotalTransactionCount()', 'IntentRegistry__NoRecipients()', 'IntentRegistry__StartTimeInPast()', 'IntentRegistry__TooManyRecipients()', 'IntentRegistry__Unauthorized()', 'ReentrancyGuardReentrantCall()', 'SmartWallet__InsufficientUncommittedFunds()', 'SmartWallet__NotFromEntryPoint()', 'SmartWallet__NotFromRegistry()', 'SmartWallet__Unauthorized()', 'SmartWallet__OwnerIsZeroAddress()', 'SmartWallet__InvalidBatchInput()', 'SmartWallet__InvalidCommitmentDecrease()', 'SmartWallet__ComplianceBridgeZeroAddress()', 'SmartWallet__IntentRegistryZeroAddress()', 'Error(string)'
];
const errorSelectors = {};
errors.forEach(e => { errorSelectors[keccak256(toBytes(e)).slice(0, 10)] = e; });

async function check() {
  const startTime = Math.floor(Date.now() / 1000) + 120;
  const amounts = [parseEther('5'), parseEther('5')];
  const innerCallData = encodeFunctionData({
    abi: registryAbi,
    functionName: 'createIntent',
    args: ['Test', ['0x4C28A32D4C083dE6B21bF2B653D8610d60B57c94', '0x0D96081998fd583334fd1757645B40fdD989B267'], amounts, 300n, 60n, BigInt(startTime),
    ['0x8715d172747e423debfb6ca151efce01f29aa5b847000000000000aa36a70200', '0x2e8517d9104249f9e67aaa59ebbbc3a4e6fb2e1957000000000000aa36a70200'],
    ['0x01018715d172747e423debfb6ca151efce01f29aa5b847000000000000aa36a70200707271054473345758aef0ffac8be69299084ca9d799770dc10e4dc803f2d75f0afb66b88747198eb78e4075fcc876e732e3a837e5cb2f40d002d04f29ea2abe1b00', '0x01012e8517d9104249f9e67aaa59ebbbc3a4e6fb2e1957000000000000aa36a70200a759af8aeabf13faabc14bef7d11d5e76cde61c7f3b330b5bf35afe917432d25694f46423c11e85a00aca85f065255db4c0058cc2156cc5ed8a17ebc963d47061b00'],
    ['0x3f24ab584702bba514ab5b8e0f4ccc3b12989bd46b000000000000aa36a70200', '0x7f125097b156deb9bab4c91c8819a9ef3fddf46e51000000000000aa36a70200'],
    ['0x01013f24ab584702bba514ab5b8e0f4ccc3b12989bd46b000000000000aa36a702003ece609feef67b575e299bfb75f262b1405f1434e07a8fc07c8a0dc5733c89d43bf88399c6d395668f60e63810c526652eceed5e14eccba9efd459d7168ebfdc1c00', '0x01017f125097b156deb9bab4c91c8819a9ef3fddf46e51000000000000aa36a7020061de8609bcf1b1980f1ff76c8021385db46eea24701110911df652400aab244b4bdbaa6d140822042ed732004a65d4f4ca6c5ba860ba0ecfec2d050d37670fdb1b00']],
  });
  const data = encodeFunctionData({ abi: smartWalletAbi, functionName: 'execute', args: [REGISTRY, 0n, innerCallData] });
  try {
    const gas = await client.estimateGas({ to: PROXY, data, account: ENTRY_POINT });
    console.log('Simulation SUCCESS, gas used:', gas.toString());
  } catch (err) {
    const revertData = err?.cause?.data || err?.data;
    if (revertData) {
        const sel = typeof revertData === 'string' ? revertData.slice(0,10) : null;
        console.log('Simulation REVERT:', errorSelectors[sel] || sel);
    } else { console.error('Sim error:', err); }
  }
}
check().catch(console.error);
