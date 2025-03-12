import type { Chains } from "@cfce/types"
import { constants } from "starknet"

const chainConfiguration = {
  arbitrum: {
    slug: "arbitrum",
    name: "Arbitrum",
    symbol: "ETH",
    icon: "/icons/arb.webp",
    networks: {
      mainnet: {
        id: 42161,
        name: "Arbitrum",
        slug: "arbitrum",
        network: "mainnet",
        symbol: "ARB",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/arb.webp",
        explorer: {
          url: "https://arbiscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://arb1.arbitrum.io/rpc",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            contract: "0x912CE59144191C1204E64559FE8253a0e49E6548",
            name: "Arbitrum",
            symbol: "ARB",
            decimals: 18,
            icon: "icons/arb.webp",
          },
          {
            isNative: false,
            contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
            name: "USDC",
            symbol: "USDC",
            decimals: 6,
            icon: "icons/usdc.webp",
          },
        ],
        contracts: {
          ReceiptNFT: "0x42919FaFA756e2bd36A94fED5f19aab79D5221F4",
          VolunteersFactory: "0x4d624D65040A69021522318FF7b879571c52Eb61",
        },
        wallet: "0x1540026E002b09bc1720D130d90CB674b06121e2",
        wssurl: "",
      },
      testnet: {
        id: 421614,
        name: "Arbitrum",
        slug: "arbitrum",
        network: "testnet",
        symbol: "ARB",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/arb.webp",
        explorer: {
          url: "https://sepolia.arbiscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://sepolia-rollup.arbitrum.io/rpc",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            contract: "0xc275B23C035a9d4EC8867b47f55427E0bDCe14cB",
            name: "Arbitrum",
            symbol: "ARB",
            decimals: 18,
            icon: "icons/arb.webp",
          },
          // CFCE-controlled contract
          {
            isNative: false,
            contract: "0x80C2f901ABA1F95e5ddb2A5024E7Df6a366a3AB0",
            name: "USDC",
            symbol: "USDC",
            decimals: 18,
            icon: "icons/usdc.webp",
          },
        ],
        contracts: {
          // Receipt_NFT: "0xd5D9defAe9b60FBD0f7E9c7Be361f462d8715eef",
          // Receipt_NFT: "0xeea9557589cFff5Dd3D849dA94201FA8Cb782C12",
          ReceiptNFT: "0x5465D45A11F468DB302d72Fd337745D8fdb4727A",
          VolunteersFactory: "0x1869c194155cbE4efA99a010BA6eE7db8eB32fbB",
        },
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  avalanche: {
    slug: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    icon: "/icons/avax.webp",
    networks: {
      mainnet: {
        id: 43114,
        name: "Avalanche",
        slug: "avalanche",
        network: "mainnet",
        symbol: "AVAX",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/avax.webp",
        contracts: {
          ReceiptNFT: "0x6c50278D100425E8772EEbAC60515768Ee3A9aD2",
        },
        explorer: {
          url: "https://snowtrace.io",
          nftPath: "/nft/{{contractId}}/{{tokenId}}?chainid={{chainId}}",
        },
        rpcUrls: {
          default: "https://avalanche-mainnet.infura.io",
        },
        tokens: [
          {
            isNative: true,
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18,
            icon: "icons/avax.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 43113,
        name: "Avalanche",
        slug: "avalanche",
        network: "testnet",
        symbol: "AVAX",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/avax.webp",
        contracts: {
          ReceiptNFT: "0x47E8183e14AD2683B7e5Ec5Ea0a1179Ef522e4F9",
        },
        explorer: {
          url: "https://testnet.snowtrace.io",
          nftPath:
            "/nft/{{contractId}}/{{tokenId}}?chainid={{chainId}}&type=erc721",
        },
        rpcUrls: {
          default: "https://api.avax-test.network/ext/bc/C/rpc",
          //default: "https://ethereum-goerli.publicnode.com",
        },
        tokens: [
          {
            isNative: true,
            name: "Avalanche",
            symbol: "AVAX",
            decimals: 18,
            icon: "icons/avax.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  base: {
    slug: "base",
    name: "Base",
    symbol: "BASE",
    icon: "/icons/base.webp",
    networks: {
      mainnet: {
        id: 8453,
        name: "Base",
        slug: "base",
        network: "mainnet",
        symbol: "BASE",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/base.webp",
        contracts: {
          ReceiptNFT: "0x6c50278D100425E8772EEbAC60515768Ee3A9aD2",
        },
        explorer: {
          url: "https://basescan.org",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://mainnet.base.org",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            name: "Degen",
            contract: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
            decimals: 18,
            icon: "icons/degen.webp",
            symbol: "DEGEN",
          },
          {
            isNative: false,
            name: "Moxie",
            contract: "0x8C9037D1Ef5c6D1f6816278C7AAF5491d24CD527",
            decimals: 18,
            icon: "icons/moxie.webp",
            symbol: "MOXIE",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 84532,
        name: "Base",
        slug: "base",
        network: "testnet",
        symbol: "BASE",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/base.webp",
        contracts: {
          ReceiptNFT: "0x81F6fa8b6FD288b26e748978Eb9Ab9F9F0C77C45",
        },
        explorer: {
          url: "https://sepolia.basescan.org",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://sepolia.base.org",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            name: "Degen",
            // CFCE-controlled contract
            contract: "0x36cC61EFb1426F0D4b89144dde16085e537e2568",
            decimals: 18,
            icon: "icons/degen.webp",
            symbol: "DEGEN",
          },
          {
            isNative: false,
            name: "Moxie",
            // CFCE-controlled contract
            contract: "0x8563168D164802448667b61B8b73F25fE208d520",
            decimals: 18,
            icon: "icons/moxie.webp",
            symbol: "MOXIE",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  binance: {
    slug: "binance",
    name: "Binance",
    symbol: "BNB",
    icon: "/icons/bnb.webp",
    networks: {
      mainnet: {
        id: 56,
        name: "Binance",
        slug: "binance",
        network: "mainnet",
        symbol: "BNB",
        decimals: 18,
        gasprice: "9000000000",
        icon: "/icons/bnb.webp",
        // TODO: add NFT contract, BNB is expensive
        // contracts: {
        //   ReceiptNFT: "",
        // },
        explorer: {
          url: "https://bscscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://bsc-dataseed.binance.org",
        },
        tokens: [
          {
            isNative: true,
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
            icon: "icons/bnb.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 97,
        name: "Binance",
        slug: "binance",
        network: "testnet",
        symbol: "BNB",
        decimals: 18,
        gasprice: "9000000000",
        icon: "/icons/bnb.webp",
        contracts: {
          ReceiptNFT: "0x45b59b55DF3532C9Bd7C1a5f2a96c82A1Bb1aa03",
        },
        explorer: {
          url: "https://testnet.bscscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://data-seed-prebsc-1-s1.binance.org:8545",
        },
        tokens: [
          {
            isNative: true,
            name: "Binance Coin",
            symbol: "BNB",
            decimals: 18,
            icon: "icons/bnb.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  celo: {
    slug: "celo",
    name: "Celo",
    symbol: "CELO",
    icon: "/icons/celo.webp",
    networks: {
      mainnet: {
        id: 42220,
        name: "Celo",
        slug: "celo",
        network: "mainnet",
        symbol: "CELO",
        decimals: 18,
        gasprice: "10000000000",
        icon: "/icons/celo.webp",
        contracts: {
          ReceiptNFT: "0xb4b4DA6c737065E4391872b255863ABaF71D2742",
        },
        explorer: {
          url: "https://explorer.celo.org",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          default: "https://forno.celo.org",
        },
        tokens: [
          {
            isNative: true,
            name: "Celo",
            symbol: "CELO",
            decimals: 18,
            icon: "icons/celo.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 44787,
        name: "Celo",
        slug: "celo",
        network: "testnet",
        symbol: "CELO",
        decimals: 18,
        gasprice: "27500000000",
        icon: "/icons/celo.webp",
        contracts: {
          ReceiptNFT: "0x1AC546d21473062F3c3B16B6392A2EC26F4539f0",
        },
        explorer: {
          url: "https://celo-alfajores.blockscout.com",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          default: "https://alfajores-forno.celo-testnet.org",
        },
        tokens: [
          {
            isNative: true,
            name: "Celo",
            symbol: "CELO",
            decimals: 18,
            icon: "icons/celo.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  eos: {
    slug: "eos",
    name: "EOS",
    symbol: "EOS",
    icon: "/icons/eos.webp",
    networks: {
      mainnet: {
        id: 17777,
        name: "EOS",
        slug: "eos",
        network: "mainnet",
        symbol: "EOS",
        decimals: 4,
        gasprice: "250000000",
        icon: "/icons/eos.webp",
        explorer: {
          url: "https://eosauthority.com",
          // NOTE: it's unclear whether EOS has NFTs, but this is the best we can do for now
          nftPath: "/transaction/{{transactionId}}?network=eos",
        },
        rpcUrls: {
          default: "https://api.eos.io",
        },
        tokens: [
          {
            isNative: true,
            name: "EOS",
            symbol: "EOS",
            decimals: 4,
            icon: "icons/eos.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 15557,
        name: "EOS",
        slug: "eos",
        network: "testnet",
        symbol: "EOS",
        decimals: 4,
        gasprice: "250000000",
        icon: "/icons/eos.webp",
        explorer: {
          url: "https://eosauthority.com",
          // NOTE: it's unclear whether EOS has NFTs, but this is the best we can do for now
          nftPath: "/transaction/{{transactionId}}?network=eosiotest",
        },
        rpcUrls: {
          default: "https://api.testnet.eos.io",
        },
        tokens: [
          {
            isNative: true,
            name: "EOS",
            symbol: "EOS",
            decimals: 4,
            icon: "icons/eos.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  ethereum: {
    slug: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "/icons/eth.webp",
    networks: {
      mainnet: {
        id: 1,
        name: "Ethereum",
        slug: "ethereum",
        network: "mainnet",
        symbol: "ETH",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/eth.webp",
        explorer: {
          url: "https://etherscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://ethereum.publicnode.com",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 5,
        name: "Ethereum",
        slug: "ethereum",
        network: "testnet",
        symbol: "ETH",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/eth.webp",
        explorer: {
          url: "https://sepolia.etherscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://ethereum-sepolia-rpc.publicnode.com",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  filecoin: {
    slug: "filecoin",
    name: "Filecoin",
    symbol: "FIL",
    icon: "/icons/fil.webp",
    networks: {
      mainnet: {
        id: 31415790,
        name: "Filecoin",
        slug: "filecoin",
        network: "mainnet",
        symbol: "FIL",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/fil.webp",
        contracts: {
          ReceiptNFT: "0x24265D9042d8602Ba26607750894CFC5718d7FC0 ",
        },
        explorer: {
          url: "https://filscan.io",
          nftPath: "/en/message/{{transactionId}}/",
        },
        rpcUrls: {
          default: "https://api.node.glif.io",
        },
        tokens: [
          {
            isNative: true,
            name: "Filecoin",
            symbol: "FIL",
            decimals: 18,
            icon: "icons/fil.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 314159,
        name: "Filecoin",
        slug: "filecoin",
        network: "testnet",
        symbol: "FIL",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/fil.webp",
        contracts: {
          ReceiptNFT: "0xa3a3d70Ec57bC30472CD687F3D530b3431292989 ",
        },
        explorer: {
          url: "https://calibration.filscan.io",
          nftPath: "/en/message/{{transactionId}}/",
        },
        rpcUrls: {
          default: "https://api.calibration.node.glif.io",
        },
        tokens: [
          {
            isNative: true,
            name: "Filecoin",
            symbol: "FIL",
            decimals: 18,
            icon: "icons/fil.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  flare: {
    slug: "flare",
    name: "Flare",
    symbol: "FLR",
    icon: "/icons/flr.webp",
    networks: {
      mainnet: {
        id: 14,
        name: "Flare",
        slug: "flare",
        network: "mainnet",
        symbol: "FLR",
        decimals: 18,
        gasprice: "25000000000",
        icon: "/icons/flr.webp",
        contracts: {
          ReceiptNFT: "0xA503e5EF51A3dEf3099CCa81C8334C4635B1761f",
        },
        explorer: {
          url: "https://flare-explorer.flare.network",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          default: "https://mainnet.flare.network",
        },
        tokens: [
          {
            isNative: true,
            name: "Flare",
            symbol: "FLR",
            decimals: 18,
            icon: "icons/flr.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 114,
        name: "Flare",
        slug: "flare",
        network: "testnet",
        symbol: "FLR",
        decimals: 18,
        gasprice: "25000000000",
        icon: "/icons/flr.webp",
        contracts: {
          // too much trouble to verify, TODO later
          ReceiptNFT: "0xeea9557589cfff5dd3d849da94201fa8cb782c12",
        },
        explorer: {
          url: "https://coston2-explorer.flare.network",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          default: "https://coston2-api.flare.network/ext/C/rpc",
          //default: "https://coston2-api.flare.network/ext/bc/C/rpc",
        },
        tokens: [
          {
            isNative: true,
            name: "Flare",
            symbol: "FLR",
            decimals: 18,
            icon: "icons/flr.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  optimism: {
    slug: "optimism",
    name: "Optimism",
    symbol: "OP",
    icon: "/icons/op.webp",
    networks: {
      mainnet: {
        id: 10,
        name: "Optimism",
        slug: "optimism",
        network: "mainnet",
        symbol: "OP",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/op.webp",
        contracts: {
          ReceiptNFT: "0x42919FaFA756e2bd36A94fED5f19aab79D5221F4",
        },
        explorer: {
          url: "https://optimistic.etherscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://mainnet.optimism.io",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            contract: "0x4200000000000000000000000000000000000042",
            name: "Optimism",
            symbol: "OP",
            decimals: 18,
            icon: "icons/op.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 11155420,
        name: "Optimism",
        slug: "optimism",
        network: "testnet",
        symbol: "OP",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/op.webp",
        contracts: {
          ReceiptNFT: "0x6750eA8Ff1f2afE7179d300be052C8D161D1F003",
        },
        explorer: {
          url: "https://sepolia-optimism.etherscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://sepolia.optimism.io",
        },
        tokens: [
          {
            isNative: true,
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            contract: "0x4200000000000000000000000000000000000042",
            name: "Optimism",
            symbol: "OP",
            decimals: 18,
            icon: "icons/op.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  polygon: {
    slug: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    icon: "/icons/matic.webp",
    networks: {
      mainnet: {
        id: 137,
        name: "Polygon",
        slug: "polygon",
        network: "mainnet",
        symbol: "MATIC",
        decimals: 18,
        gasprice: "20000000000",
        icon: "/icons/matic.webp",
        contracts: {
          ReceiptNFT: "0xb4b4DA6c737065E4391872b255863ABaF71D2742",
        },
        explorer: {
          url: "https://polygonscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://polygon-rpc.com",
        },
        tokens: [
          {
            isNative: true,
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
            icon: "icons/matic.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
      testnet: {
        id: 80002,
        name: "Polygon",
        slug: "polygon",
        network: "testnet",
        symbol: "MATIC",
        decimals: 18,
        gasprice: "20000000000",
        icon: "/icons/matic.webp",
        contracts: {
          ReceiptNFT: "0xeea9557589cFff5Dd3D849dA94201FA8Cb782C12",
        },
        explorer: {
          url: "https://amoy.polygonscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          default: "https://rpc-amoy.polygon.technology/",
        },
        tokens: [
          {
            isNative: true,
            name: "Polygon",
            symbol: "MATIC",
            decimals: 18,
            icon: "icons/matic.webp",
          },
        ],
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  starknet: {
    slug: "starknet",
    name: "Starknet",
    symbol: "STRK",
    icon: "/icons/strk.webp",
    networks: {
      mainnet: {
        id: Number(constants.StarknetChainId.SN_MAIN),
        name: "Starknet",
        slug: "starknet",
        network: "mainnet",
        symbol: "STRK",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/strk.webp",
        explorer: {
          url: "https://starkscan.co",
          nftPath: "/nft/{{contractId}}/{{tokenId}}",
        },
        rpcUrls: {
          default:
            "https://starknet-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        },
        tokens: [
          {
            isNative: true,
            name: "Starknet",
            symbol: "STRK",
            decimals: 18,
            icon: "icons/strk.webp",
          },
          {
            isNative: true,
            contract:
              "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            // starkgate contract
            contract:
              "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
            name: "Tether USD",
            symbol: "USDT",
            decimals: 6,
            icon: "icons/usdt.webp",
          },
          {
            isNative: false,
            // starkgate contract
            contract:
              "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            icon: "icons/usdc.webp",
          },
        ],
        contracts: {
          ReceiptNFT:
            "0x032d27a295ddb4d41197494fe5ec06188edcfcc3cebf3faf0dd6c4bab6146e16",
        },
        wallet:
          "0x004F83aDfFf854e6337505728bD61c34D829f0f28F9040AE1C533be512A46A15", // TODO: add wallet
        wssurl: "",
      },
      testnet: {
        id: Number(constants.StarknetChainId.SN_SEPOLIA),
        name: "Starknet",
        slug: "starknet",
        network: "testnet",
        symbol: "STRK",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/strk.webp",
        explorer: {
          url: "https://sepolia.starkscan.co/",
          nftPath: "/nft/{{contractId}}/{{tokenId}}",
        },
        rpcUrls: {
          default: "https://free-rpc.nethermind.io/sepolia-juno/",
        },
        tokens: [
          {
            isNative: true,
            name: "Starknet",
            symbol: "STRK",
            decimals: 18,
            icon: "icons/strk.webp",
          },
          {
            isNative: true,
            contract:
              "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
            icon: "icons/eth.webp",
          },
          {
            isNative: false,
            // some random contract; TODO: use CFCE contract
            contract:
              "0x033974439adbe7961f52e60d05f5ee79c80024481deb88ecff83a7078dd1d53e",
            name: "Tether",
            symbol: "USDT",
            decimals: 6,
            icon: "icons/usdt.webp",
          },
          {
            isNative: false,
            // some random contract; TODO: use CFCE contract
            contract:
              "0x07b5be4ebf7c50f67d54d328c45ee21b06de8e39240c7943b25ab811c07c43e4",
            name: "USDC",
            symbol: "USDC",
            decimals: 6,
            icon: "icons/usdc.webp",
          },
        ],
        contracts: {
          ReceiptNFT:
            "0x3cfdb23c07a9a059090c871df3f2a242c6738e25351749be334f2b23d764368",
        },
        wallet:
          "0x01f6B30cd3c82a56ea6428B5906284D1797a26eA8F03FCd1F56b7A83cf94Cc34",
        wssurl: "",
      },
    },
  },
  stellar: {
    slug: "stellar",
    name: "Stellar",
    symbol: "XLM",
    icon: "/icons/xlm.webp",
    networks: {
      mainnet: {
        id: 0,
        name: "Stellar",
        slug: "stellar",
        network: "mainnet",
        symbol: "XLM",
        decimals: 6,
        gasprice: "250000000",
        icon: "/icons/xlm.webp",
        explorer: {
          url: "https://stellarchain.io",
          nftPath: "/accounts/{{contractId}}",
        },
        contracts: {
          ReceiptNFT:
            "CDOWTLX7NE5ZUM6JRVFPROIW2URA7733XKALB57IT4OLTMYODWIVNOXB",
          ReceiptNFTHash:
            "e8bf985b6e949ae21e618e04cdc924eda863c9226205a64afe35c9dd7f14a9ff",
          Credits: "xxx",
          CreditsHash: "xxx",
        },
        rpcUrls: {
          default: "https://horizon.stellar.org",
          soroban:
            "https://mainnet.stellar.validationcloud.io/v1/QW6tYBRenqUwP8d9ZJds44Dm-txH1497oDXcdC07xDo",
          // You can add more RPC URLs here as needed
        },
        networkPassphrase: "Public Global Stellar Network ; September 2015",
        tokens: [
          {
            isNative: true,
            name: "Stellar",
            symbol: "XLM",
            decimals: 7,
            icon: "icons/xlm.webp",
          },
          {
            isNative: false,
            contract:
              "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
            name: "USDC",
            symbol: "USDC",
            decimals: 6,
            icon: "icons/usdc.webp",
          },
        ],
        wallet: "GAL5DBXSUYCWI326DCIO7Z2O7GUCHATJUBURZ7JDI2D6ICAK62OZZLSI",
        wssurl: "",
      },
      testnet: {
        id: 0,
        name: "Stellar",
        slug: "stellar",
        network: "testnet",
        symbol: "XLM",
        decimals: 6,
        gasprice: "250000000",
        icon: "/icons/xlm.webp",
        explorer: {
          url: "https://stellarchain.io",
          nftPath: "/accounts/{{contractId}}",
        },
        rpcUrls: {
          default: "https://horizon-testnet.stellar.org",
          soroban: "https://soroban-testnet.stellar.org",
        },
        networkPassphrase: "Test SDF Network ; September 2015",
        tokens: [
          {
            isNative: true,
            name: "Stellar",
            symbol: "XLM",
            decimals: 7,
            icon: "icons/xlm.webp",
          },
          {
            isNative: false,
            contract:
              "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
            name: "USDC",
            symbol: "USDC",
            decimals: 6,
            icon: "icons/usdc.webp",
          },
        ],
        contracts: {
          Credits: "CDHYT3A4XGBNSWP2P7XQTS2AT5XICKD5KOAZ7S2Y2APJMXRDIENP2LZR",
          CreditsHash:
            "8c850c8ad832e8fcba395dc89009dad9b68c78902b275a5da565c55fe0091c7f",
          ReceiptNFT:
            "CA7PQJ3N4GZL3GBAZNSDDQQGJ4ROW35FCX646JVVBU42K2DSMIFTA7QE",
          ReceiptNFTHash:
            "7accc502baa0b8c5356b79babefc1a1ff502b5ff2ca5b1230476497f475e474c",
        },
        wallet: "GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C",
        wssurl: "",
      },
    },
  },
  tron: {
    slug: "tron",
    name: "Tron",
    symbol: "TRX",
    icon: "/icons/trx.webp",
    networks: {
      mainnet: {
        id: 728126428,
        name: "Tron",
        slug: "tron",
        network: "mainnet",
        symbol: "TRX",
        decimals: 6, // TODO: verify
        gasprice: "250000000", // TODO: verify
        icon: "/icons/trx.webp",
        explorer: {
          url: "https://tronscan.io",
          nftPath: "/#/transaction/{{transactionId}}",
        },
        rpcUrls: {
          default: "https://api.trongrid.io/jsonrpc",
        },
        tokens: [
          {
            isNative: true,
            name: "Tron",
            symbol: "TRX",
            decimals: 6,
            icon: "icons/trx.webp",
          },
        ],
        wallet: "TRR8FCQtJMiwYDWVhrSurGyMTLGTxYJbSw",
        wssurl: "",
      },
      testnet: {
        id: 2494104990,
        name: "Tron",
        slug: "tron",
        network: "testnet",
        symbol: "TRX",
        decimals: 6,
        gasprice: "250000000",
        icon: "/icons/trx.webp",
        explorer: {
          url: "https://shasta.tronscan.io",
          nftPath: "/#/transaction/{{transactionId}}",
        },
        rpcUrls: {
          default: "https://api.shasta.trongrid.io/jsonrpc",
        },
        tokens: [
          {
            isNative: true,
            name: "Tron",
            symbol: "TRX",
            decimals: 6,
            icon: "icons/trx.webp",
          },
        ],
        wallet: "TTidpZfw6nvMe3bLhYSWZF8c241RwiS6Jp",
        wssurl: "",
      },
    },
  },
  xdc: {
    slug: "xdc",
    name: "XDC",
    symbol: "XDC",
    icon: "/icons/xdc.webp",
    networks: {
      mainnet: {
        id: 50,
        name: "XDC",
        slug: "xdc",
        network: "mainnet",
        symbol: "XDC",
        decimals: 18,
        icon: "/icons/xdc.webp",
        explorer: {
          url: "https://xdcscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        gasprice: "15000000000",
        rpcUrls: {
          default: "https://rpc.apothem.network",
        },
        contracts: {
          TokenBoundRegistry: "0xCD4C114E31E909Cc589836596E206D837c9cb00a",
          TokenBoundImplementation:
            "0x2b4ac04B9feB82C7529f2B17db5a441FCB3c05D4",
          TokenBoundNFT: "0xb7e30f0e9feE9b77f617EbEC16156b46A8e19908",
          ReceiptNFT: "0xD218A3C26DeEFa93eb74a785463B6bbF48A5a1b4",
          StoryNFT: "0xf6eD42f808DfD4034aE3485Bf1ae72cba6ED8AE3",
          VolunteersFactory: "0x0eD50ddEE2c561016A9aaB9DaFC891DB3Afe554d",
        },
        tokens: [
          {
            isNative: true,
            name: "XDC",
            symbol: "XDC",
            decimals: 18,
            icon: "icons/xdc.webp",
          },
        ],
        wallet: "0x1540026E002b09bc1720D130d90CB674b06121e2",
        wssurl: "",
      },
      testnet: {
        id: 51,
        name: "XDC",
        slug: "xdc",
        network: "testnet",
        symbol: "XDC",
        decimals: 18,
        icon: "/icons/xdc.webp",
        gasprice: "15000000000",
        explorer: {
          url: "https://explorer.apothem.network",
          nftPath: "/nft/{{contractId}}/{{tokenId}}",
        },
        rpcUrls: {
          default: "https://rpc.apothem.network",
        },
        tokens: [
          {
            isNative: true,
            contract: "xdc7849f6ba978188ce97bb02bdaba673af65cbd269",
            name: "TXDC",
            symbol: "XDC",
            decimals: 18,
            icon: "icons/xdc.webp",
          },
        ],
        contracts: {
          TokenBoundRegistry: "0x000000006551c19487814612e58fe06813775758",
          TokenBoundImplementation:
            "0x41c8f39463a868d3a88af00cd0fe7102f30e44ec",
          TokenBoundNFT: "0x88Bb2D04f180631BdC4Cd6129106665A0B6790D8", // 0xcbbb500f1cf1d6c44b0d7c9ff40292f8a0e756d7
          ReceiptNFT: "0xfd92E8Ae8FC075C15375f2F57BE54ADd717c1085",
          StoryNFT: "0xcA942Ca2817A2688788e88958918D3f93A9E85F5",
          VolunteersFactory: "0x05AD83eD27a45c8c2b9D01217370690B17987641",
        },
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
        wssurl: "",
      },
    },
  },
  xrpl: {
    slug: "xrpl",
    name: "XRPL",
    symbol: "XRP",
    icon: "/icons/xrp.webp",
    networks: {
      mainnet: {
        id: 0,
        name: "XRPL",
        slug: "xrpl",
        network: "mainnet",
        symbol: "XRP",
        decimals: 6,
        gasprice: "250000000",
        icon: "/icons/xrp.webp",
        explorer: {
          url: "https://livenet.xrpl.org",
          nftPath: "/transactions/{{transactionId}}",
        },
        rpcUrls: {
          default: "https://xrplcluster.com",
        },
        tokens: [
          {
            isNative: true,
            name: "XRP",
            symbol: "XRP",
            decimals: 6,
            icon: "icons/xrp.webp",
          },
        ],
        wallet: "rEzcJJqT5KwZYfv2Vfwqan2sEDthuW2JS7",
        wssurl: "",
      },
      testnet: {
        id: 0,
        name: "XRPL",
        slug: "xrpl",
        network: "testnet",
        symbol: "XRP",
        decimals: 6,
        gasprice: "250000000",
        icon: "/icons/xrp.webp",
        explorer: {
          url: "https://testnet.xrpl.org",
          nftPath: "/transactions/{{transactionId}}",
        },
        rpcUrls: {
          default: "https://s.altnet.rippletest.net:51234",
        },
        tokens: [
          {
            isNative: true,
            name: "XRP",
            symbol: "XRP",
            decimals: 6,
            icon: "icons/xrp.webp",
          },
        ],
        wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
        wssurl: "wss://s.altnet.rippletest.net:51233",
      },
    },
  },
} satisfies Chains

export default chainConfiguration
