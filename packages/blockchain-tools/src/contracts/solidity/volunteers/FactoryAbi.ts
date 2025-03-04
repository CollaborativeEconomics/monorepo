export const VolunteersFactoryAbi = [
  {
    type: "function",
    name: "deployTokenDistributor",
    inputs: [
      {
        name: "_token",
        type: "address",
        internalType: "address",
      },
      {
        name: "_nftContract",
        type: "address",
        internalType: "contract ERC1155",
      },
      {
        name: "_baseFee",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "deployVolunteerNFT",
    inputs: [
      {
        name: "uri",
        type: "string",
        internalType: "string",
      },
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    "type": "function",
    "name": "deployedTokenDistributors",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    outputs: [
      {
        "name": "tokenDistributor",
        "type": "address",
        "internalType": "address"
      }
    ],
    stateMutability: "view",
  },
  {
    "type": "function",
    "name": "deployedVolunteersNFT",
    "inputs": [
      {
        "name": "deployer",
        "type": "address",
        "internalType": "address"
      }
    ],
    outputs: [
      {
        "name": "NFTAddress",
        "type": "address",
        "internalType": "address"
      }
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDeployedTokenDistributor",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDeployedVolunteerNFT",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "VolunteerDeployed",
    inputs: [
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "volunteerAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    "anonymous": false
  }
] as const;
