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
          main: "https://arb1.arbitrum.io/rpc",
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
          Receipt_NFT: "0x0535D460955bAa8a373053FD7C225675A9D1fA16",
          VolunteersFactory: "0xb4b4DA6c737065E4391872b255863ABaF71D2742",
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
          main: "https://sepolia-rollup.arbitrum.io/rpc",
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
            decimals: 6,
            icon: "icons/usdc.webp",
          },
        ],
        contracts: {
          Receipt_NFT: "0xeea9557589cFff5Dd3D849dA94201FA8Cb782C12",
          VolunteersFactory: "0xfbB261eADa2b1D881715984222De161F3F3E914e",
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
          Receipt_NFT: "0x39d1d1FD5660D4D892a859BD53212f8b580c55Ea",
        },
        explorer: {
          url: "https://snowtrace.io",
          nftPath: "/nft/{{contractId}}/{{tokenId}}?chainid={{chainId}}",
        },
        rpcUrls: {
          main: "https://avalanche-mainnet.infura.io",
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
          Receipt_NFT: "0xadc5b1b42f366215525bae1f0d81ad485c60c75e",
        },
        explorer: {
          url: "https://testnet.snowtrace.io",
          nftPath:
            "/nft/{{contractId}}/{{tokenId}}?chainid={{chainId}}&type=erc721",
        },
        rpcUrls: {
          main: "https://api.avax-test.network/ext/bc/C/rpc",
          //main: "https://ethereum-goerli.publicnode.com",
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
          Receipt_NFT: "0xf1956D22B0A36f9088B1a7c3A1b6a0E7ccad361F",
        },
        explorer: {
          url: "https://basescan.org",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://mainnet.base.org",
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
        id: 84532,
        name: "Base",
        slug: "base",
        network: "testnet",
        symbol: "BASE",
        decimals: 18,
        gasprice: "250000000",
        icon: "/icons/base.webp",
        contracts: {
          Receipt_NFT: "0xde0015317c273298503cf7fef681ed50d5c58048",
        },
        explorer: {
          url: "https://sepolia.basescan.org",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://sepolia.base.org",
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
        contracts: {
          Receipt_NFT: "0xA4F55421608c012d03D92abeec8543397FD99ADe",
        },
        explorer: {
          url: "https://bscscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://bsc-dataseed.binance.org",
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
          Receipt_NFT: "0xb7c157a81f6ddb0c65e9de5a4ff31f84b4af22a3",
        },
        explorer: {
          url: "https://testnet.bscscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://data-seed-prebsc-1-s1.binance.org:8545",
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
          Receipt_NFT: "0x96E4bf46dFb0Fc888DeFE6F893A90b78E8be023C",
        },
        explorer: {
          url: "https://explorer.celo.org",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          main: "https://forno.celo.org",
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
          Receipt_NFT: "0xf9f861b4fca89628d3b9b7f7b6cd4ba4073a3d93",
        },
        explorer: {
          url: "https://celo-alfajores.blockscout.com",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          main: "https://alfajores-forno.celo-testnet.org",
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
          main: "https://api.eos.io",
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
          main: "https://api.testnet.eos.io",
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
          main: "https://ethereum.publicnode.com",
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
          main: "https://ethereum-sepolia-rpc.publicnode.com",
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
          Receipt_NFT: "0x42919FaFA756e2bd36A94fED5f19aab79D5221F4 ",
        },
        explorer: {
          url: "https://filscan.io",
          nftPath: "/en/message/{{transactionId}}/",
        },
        rpcUrls: {
          main: "https://api.node.glif.io",
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
          Receipt_NFT: "0x0ff170753fA7B1ADa5f120b52c8F4903fe066090 ",
        },
        explorer: {
          url: "https://calibration.filscan.io",
          nftPath: "/en/message/{{transactionId}}/",
        },
        rpcUrls: {
          main: "https://api.calibration.node.glif.io",
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
          Receipt_NFT: "0x08E1cc1EcD7A5Cb9B33B5173BF63c2e8BD4e59d0",
        },
        explorer: {
          url: "https://flare-explorer.flare.network",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          main: "https://mainnet.flare.network",
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
          Receipt_NFT: "0xeea9557589cfff5dd3d849da94201fa8cb782c12",
        },
        explorer: {
          url: "https://coston2-explorer.flare.network",
          nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
        },
        rpcUrls: {
          main: "https://coston2-api.flare.network/ext/C/rpc",
          //main: "https://coston2-api.flare.network/ext/bc/C/rpc",
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
          Receipt_NFT: "0x0eD50ddEE2c561016A9aaB9DaFC891DB3Afe554d",
        },
        explorer: {
          url: "https://optimistic.etherscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://mainnet.optimism.io",
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
          Receipt_NFT: "0xADC5b1B42F366215525Bae1f0d81aD485c60C75e",
        },
        explorer: {
          url: "https://sepolia-optimism.etherscan.io",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://sepolia.optimism.io",
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
          Receipt_NFT: "0x1540026E002b09bc1720D130d90CB674b06121e2",
        },
        explorer: {
          url: "https://polygonscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://polygon-rpc.com",
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
          Receipt_NFT: "0xeea9557589cFff5Dd3D849dA94201FA8Cb782C12",
        },
        explorer: {
          url: "https://amoy.polygonscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://rpc-amoy.polygon.technology/",
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
          main: "https://starknet-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
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
          Receipt_NFT: "",
        },
        wallet: "", // TODO: add wallet
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
          main: "https://free-rpc.nethermind.io/sepolia-juno/",
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
          Receipt_NFT:
            "0x3cfdb23c07a9a059090c871df3f2a242c6738e25351749be334f2b23d764368",
        },
        wallet:
          "0x063783605f5f8a4c716ec82453815ac5a5d9bb06fe27c0df022495a137a5a74f",
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
          Receipt_NFT:
            "CDOWTLX7NE5ZUM6JRVFPROIW2URA7733XKALB57IT4OLTMYODWIVNOXB",
          Receipt_NFTHash:
            "e8bf985b6e949ae21e618e04cdc924eda863c9226205a64afe35c9dd7f14a9ff",
          Credits: "xxx",
          CreditsHash: "xxx",
        },
        rpcUrls: {
          main: "https://horizon.stellar.org",
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
          main: "https://horizon-testnet.stellar.org",
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
          Receipt_NFT:
            "CA7PQJ3N4GZL3GBAZNSDDQQGJ4ROW35FCX646JVVBU42K2DSMIFTA7QE",
          Receipt_NFTHash:
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
          main: "https://api.trongrid.io/jsonrpc",
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
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
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
          main: "https://api.shasta.trongrid.io/jsonrpc",
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
        wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
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
          main: "https://rpc.xdcrpc.com",
        },
        contracts: {
          TBA_Registry: "0xCD4C114E31E909Cc589836596E206D837c9cb00a",
          TBA_Implementation: "0x2b4ac04B9feB82C7529f2B17db5a441FCB3c05D4",
          TBA_NFT: "0xb7e30f0e9feE9b77f617EbEC16156b46A8e19908",
          Receipt_NFT: "0xD218A3C26DeEFa93eb74a785463B6bbF48A5a1b4",
          Story_NFT: "0x013da344B34447360aE4A01E86a4a4c2aAd3CEbb",
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
          url: "https://testnet.xdcscan.com",
          nftPath: "/token/{{contractId}}?a={{tokenId}}",
        },
        rpcUrls: {
          main: "https://rpc.apothem.network",
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
          TBA_Registry: "0x000000006551c19487814612e58fe06813775758",
          TBA_Implementation: "0x41c8f39463a868d3a88af00cd0fe7102f30e44ec",
          TBA_NFT: "0x88Bb2D04f180631BdC4Cd6129106665A0B6790D8", // 0xcbbb500f1cf1d6c44b0d7c9ff40292f8a0e756d7
          Receipt_NFT: "0xa3a3d70Ec57bC30472CD687F3D530b3431292989",
          Story_NFT: "0xc917ff4128525a65639d18f1d240a788081f022d",
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
          main: "https://xrplcluster.com",
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
        wallet: "rDnRVpHyefiph7rkHm8xPakXu9BMuH5eKz",
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
          main: "https://s.altnet.rippletest.net:51234",
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
