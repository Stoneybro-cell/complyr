const { createPublicClient, http } = require('viem');
const { flowTestnet } = require('viem/chains');
const client = createPublicClient({ chain: flowTestnet, transport: http('https://testnet.evm.nodes.onflow.org') });
const PROXY = '0xc39f34b0f76a484fC0D9eD9d696c22b8a31f6c2C';
const REGISTRY = '0x8Bd539Be7554752DC16B4d96AC857F3752B39cc1';
const EP = '0x0000000071727De22E5E9d8BAf0edAc6f37da032';

const swAbi = [
  { type:'function',name:'sCommittedFunds',inputs:[],outputs:[{type:'uint256'}],stateMutability:'view' },
  { type:'function',name:'getAvailableBalance',inputs:[],outputs:[{type:'uint256'}],stateMutability:'view' },
];
const regAbi = [
  { type:'function',name:'getActiveIntents',inputs:[{type:'address'}],outputs:[{type:'bytes32[]'}],stateMutability:'view' },
  { type:'function',name:'isWalletRegistered',inputs:[{type:'address'}],outputs:[{type:'bool'}],stateMutability:'view' },
  { type:'function',name:'getRegisteredWalletsCount',inputs:[],outputs:[{type:'uint256'}],stateMutability:'view' },
  { type:'function',name:'walletCommittedFunds',inputs:[{type:'address'}],outputs:[{type:'uint256'}],stateMutability:'view' },
];
const epAbi = [
  { type:'function',name:'getNonce',inputs:[{type:'address'},{type:'uint192'}],outputs:[{type:'uint256'}],stateMutability:'view' },
];

(async()=>{
  const [committed, available, bal, registered, regCount, regCommitted, nonce, intents] = await Promise.all([
    client.readContract({address:PROXY,abi:swAbi,functionName:'sCommittedFunds'}),
    client.readContract({address:PROXY,abi:swAbi,functionName:'getAvailableBalance'}),
    client.getBalance({address:PROXY}),
    client.readContract({address:REGISTRY,abi:regAbi,functionName:'isWalletRegistered',args:[PROXY]}),
    client.readContract({address:REGISTRY,abi:regAbi,functionName:'getRegisteredWalletsCount'}),
    client.readContract({address:REGISTRY,abi:regAbi,functionName:'walletCommittedFunds',args:[PROXY]}),
    client.readContract({address:EP,abi:epAbi,functionName:'getNonce',args:[PROXY,0n]}),
    client.readContract({address:REGISTRY,abi:regAbi,functionName:'getActiveIntents',args:[PROXY]}),
  ]);
  console.log('=== Smart Wallet ===');
  console.log('Balance:', (Number(bal)/1e18).toFixed(4), 'FLOW');
  console.log('Committed funds:', (Number(committed)/1e18).toFixed(4), 'FLOW');
  console.log('Available balance:', (Number(available)/1e18).toFixed(4), 'FLOW');
  console.log('\\n=== IntentRegistry ===');
  console.log('Wallet registered:', registered);
  console.log('Registered wallets count:', regCount.toString());
  console.log('Wallet committed funds on registry:', (Number(regCommitted)/1e18).toFixed(4), 'FLOW');
  console.log('Active intents:', intents.length, intents);
  console.log('\\n=== EntryPoint ===');
  console.log('Nonce:', nonce.toString());
})().catch(console.error);
