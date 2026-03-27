export const ComplianceRegistryABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addAuditor",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "newAuditor",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "companyAuditors",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "companyMasters",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAuditors",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCompanyRecordCount",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getEncryptedCategory",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recordIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "recipientIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getEncryptedJurisdiction",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recordIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "recipientIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "euint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRecordMetadata",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "index",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "flowTxHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "recipients",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isAuditorActive",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lzReceiver",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "recordTransaction",
    "inputs": [
      {
        "name": "flowTxHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "recipients",
        "type": "address[]",
        "internalType": "address[]"
      },
      {
        "name": "amounts",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
      {
        "name": "categoryHandles",
        "type": "bytes32[]",
        "internalType": "externalEuint8[]"
      },
      {
        "name": "categoryProofs",
        "type": "bytes[]",
        "internalType": "bytes[]"
      },
      {
        "name": "jurisdictionHandles",
        "type": "bytes32[]",
        "internalType": "externalEuint8[]"
      },
      {
        "name": "jurisdictionProofs",
        "type": "bytes[]",
        "internalType": "bytes[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerAccount",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "masterEOA",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "removeAuditor",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "auditor",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setLzReceiver",
    "inputs": [
      {
        "name": "_receiver",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "totalGlobalRecords",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AccountRegistered",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "masterEOA",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AuditorAdded",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "auditor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AuditorRemoved",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "auditor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ReceiverUpdated",
    "inputs": [
      {
        "name": "receiver",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RecordAppended",
    "inputs": [
      {
        "name": "proxyAccount",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "flowTxHash",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "ComplianceRegistry__AlreadyRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ComplianceRegistry__AuditorAlreadyExists",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ComplianceRegistry__NotAuthorized",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ComplianceRegistry__NotRegistered",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ComplianceRegistry__ZeroAddress",
    "inputs": []
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "SenderNotAllowedToUseHandle",
    "inputs": [
      {
        "name": "handle",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "sender",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;
