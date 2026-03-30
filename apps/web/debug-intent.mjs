import { createPublicClient, http, encodeFunctionData, parseEther, keccak256, toBytes } from 'viem';
import { flowTestnet } from 'viem/chains';

const client = createPublicClient({ chain: flowTestnet, transport: http('https://testnet.evm.nodes.onflow.org') });
const REGISTRY = '0x8Bd539Be7554752DC16B4d96AC857F3752B39cc1';
const PROXY = '0xc39f34b0f76a484fC0D9eD9d696c22b8a31f6c2C';

const abi = [
  { type: 'function', name: 'createIntent', inputs: [
    { name: 'name', type: 'string' },
    { name: 'recipients', type: 'address[]' },
    { name: 'amounts', type: 'uint256[]' },
    { name: 'duration', type: 'uint256' },
    { name: 'interval', type: 'uint256' },
    { name: 'transactionStartTime', type: 'uint256' },
    { name: 'categoryHandles', type: 'bytes32[]' },
    { name: 'categoryProofs', type: 'bytes[]' },
    { name: 'jurisdictionHandles', type: 'bytes32[]' },
    { name: 'jurisdictionProofs', type: 'bytes[]' },
  ], outputs: [{ type: 'bytes32' }], stateMutability: 'nonpayable' },
  { type: 'function', name: 'walletCommittedFunds', inputs: [{ type: 'address' }], outputs: [{ type: 'uint256' }], stateMutability: 'view' },
];

// All IntentRegistry errors for decoding
const errors = [
  'IntentRegistry__ArrayLengthMismatch()',
  'IntentRegistry__InsufficientFunds()',
  'IntentRegistry__IntentNotActive()',
  'IntentRegistry__IntentNotExecutable()',
  'IntentRegistry__IntentNotFound()',
  'IntentRegistry__InvalidAmount()',
  'IntentRegistry__InvalidDuration()',
  'IntentRegistry__InvalidInterval()',
  'IntentRegistry__InvalidRecipient()',
  'IntentRegistry__InvalidTotalTransactionCount()',
  'IntentRegistry__NoRecipients()',
  'IntentRegistry__StartTimeInPast()',
  'IntentRegistry__TooManyRecipients()',
  'IntentRegistry__Unauthorized()',
  'ReentrancyGuardReentrantCall()',
];

const errorSelectors = {};
errors.forEach(e => {
  const sel = keccak256(toBytes(e)).slice(0, 10);
  errorSelectors[sel] = e;
});

const ZERO_HANDLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

const startTime = Math.floor(Date.now() / 1000) + 60; // 1 min in the future

async function main() {
  // Check committed funds
  const committed = await client.readContract({ address: REGISTRY, abi, functionName: 'walletCommittedFunds', args: [PROXY] });
  console.log('Proxy committed funds:', committed.toString(), 'wei');
  
  // Check contract balance
  const bal = await client.getBalance({ address: REGISTRY });
  console.log('Contract balance:', (Number(bal) / 1e18).toFixed(4), 'FLOW');

  // Simulate createIntent from proxy
  const callData = encodeFunctionData({
    abi,
    functionName: 'createIntent',
    args: [
      'Test Intent',
      ['0x4C28A32D4C083dE6B21bF2B653D8610d60B57c94'],
      [parseEther('0.001')],
      300n,
      60n,
      BigInt(startTime),
      [ZERO_HANDLE],
      ['0x'],
      [ZERO_HANDLE],
      ['0x'],
    ],
  });

  console.log('\nSimulating createIntent from proxy...');
  try {
    const result = await client.call({
      to: REGISTRY,
      data: callData,
      account: PROXY,
    });
    console.log('SUCCESS:', result);
  } catch (err) {
    const revertData = err?.cause?.data || err?.data;
    if (revertData) {
      const selector = typeof revertData === 'string' ? revertData.slice(0, 10) : null;
      console.log('Revert selector:', selector);
      console.log('Decoded error:', errorSelectors[selector] || 'UNKNOWN');
      console.log('Full revert data:', revertData);
    } else {
      console.log('Error:', err.message?.slice(0, 500));
    }
  }
}

main().catch(console.error);
