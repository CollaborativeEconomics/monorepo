import type { Chains } from "@cfce/types"

const chainConfiguration: Chains = {
  arbitrum: {
    slug: "arbitrum",
    name: "Arbitrum",
    symbol: "ETH",
    icon: "/icons/arb.webp",
    networks: {},
  },
  avalanche: {
    slug: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    icon: "/icons/avax.webp",
    networks: {},
  },
  base: {
    slug: "base",
    name: "Base",
    symbol: "BASE",
    icon: "/icons/base.webp",
    networks: {},
  },
  binance: {
    slug: "binance",
    name: "Binance",
    symbol: "BNB",
    icon: "/icons/bnb.webp",
    networks: {},
  },
  celo: {
    slug: "celo",
    name: "Celo",
    symbol: "CELO",
    icon: "/icons/celo.webp",
    networks: {},
  },
  eos: {
    slug: "eos",
    name: "EOS",
    symbol: "EOS",
    icon: "/icons/eos.webp",
    networks: {},
  },
  ethereum: {
    slug: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    icon: "/icons/eth.webp",
    networks: {},
  },
  filecoin: {
    slug: "filecoin",
    name: "Filecoin",
    symbol: "FIL",
    icon: "/icons/fil.webp",
    networks: {},
  },
  flare: {
    slug: "flare",
    name: "Flare",
    symbol: "FLR",
    icon: "/icons/flr.webp",
    networks: {},
  },
  optimism: {
    slug: "optimism",
    name: "Optimism",
    symbol: "OP",
    icon: "/icons/op.webp",
    networks: {},
  },
  polygon: {
    slug: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    icon: "/icons/matic.webp",
    networks: {},
  },
  starknet: {
    slug: "starknet",
    name: "Starknet",
    symbol: "STRK",
    icon: "/icons/strk.webp",
    networks: {},
  },
  stellar: {
    slug: "stellar",
    name: "Stellar",
    symbol: "XLM",
    icon: "/icons/xlm.webp",
    networks: {},
  },
  tron: {
    slug: "tron",
    name: "Tron",
    symbol: "TRX",
    icon: "/icons/trx.webp",
    networks: {},
  },
  xdc: {
    slug: "xdc",
    name: "XDC",
    symbol: "XDC",
    icon: "/icons/xdc.webp",
    networks: {},
  },
  xrpl: {
    slug: "xrpl",
    name: "XRPL",
    symbol: "XRP",
    icon: "/icons/xrp.webp",
    networks: {},
  },
} as const

chainConfiguration.arbitrum.networks.mainnet = {
  id: 42161,
  name: "Arbitrum Mainnet",
  slug: "mainnet",
  symbol: "ARB",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://arbiscan.io",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://arb1.arbitrum.io/rpc",
  },
  tokens: {
    USDC: {
      contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      icon: "icons/usdc.webp",
    },
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.arbitrum.networks.testnet = {
  id: 421614,
  name: "Arbitrum Testnet",
  slug: "testnet",
  symbol: "ARB",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://sepolia.arbiscan.io",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://sepolia-rollup.arbitrum.io/rpc",
  },
  tokens: {
    // CFCE-controlled contract
    USDC: {
      contract: "0x80C2f901ABA1F95e5ddb2A5024E7Df6a366a3AB0",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      icon: "icons/usdc.webp",
    },
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.avalanche.networks.mainnet = {
  id: 43114,
  name: "Avalanche Mainnet",
  slug: "mainnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://snowtrace.io",
    nftPath: "/nft/{{contractId}}/{{tokenId}}?chainid={{chainId}}",
  },
  rpcUrls: {
    main: "https://avalanche-mainnet.infura.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.avalanche.networks.testnet = {
  id: 43113,
  name: "Avalanche Testnet",
  slug: "testnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://testnet.snowtrace.io",
    nftPath: "/nft/{{contractId}}/{{tokenId}}?chainid={{chainId}}&type=erc721",
  },
  rpcUrls: {
    main: "https://api.avax-test.network/ext/bc/C/rpc",
    //main: "https://ethereum-goerli.publicnode.com",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.base.networks.mainnet = {
  id: 8453,
  name: "Base Mainnet",
  slug: "mainnet",
  symbol: "BASE",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://basescan.org",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://mainnet.base.org",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.base.networks.testnet = {
  id: 84532,
  name: "Base Testnet",
  slug: "testnet",
  symbol: "BASE",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://sepolia.basescan.org",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://sepolia.base.org",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.binance.networks.mainnet = {
  id: 56,
  name: "Binance Mainnet",
  slug: "mainnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: {
    url: "https://bscscan.com",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://bsc-dataseed.binance.org",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.binance.networks.testnet = {
  id: 97,
  name: "Binance Testnet",
  slug: "testnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: {
    url: "https://testnet.bscscan.com",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.celo.networks.mainnet = {
  id: 42220,
  name: "Celo Mainnet",
  slug: "mainnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: {
    url: "https://explorer.celo.org",
    nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
  },
  rpcUrls: {
    main: "https://forno.celo.org",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.celo.networks.testnet = {
  id: 44787,
  name: "Celo Testnet",
  slug: "testnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "27500000000",
  explorer: {
    url: "https://celo-alfajores.blockscout.com",
    nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
  },
  rpcUrls: {
    main: "https://alfajores-forno.celo-testnet.org",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.eos.networks.mainnet = {
  id: 17777,
  name: "EOS Mainnet",
  slug: "mainnet",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://eosauthority.com",
    // NOTE: it's unclear whether EOS has NFTs, but this is the best we can do for now
    nftPath: "/transaction/{{transactionId}}?network=eos",
  },
  rpcUrls: {
    main: "https://api.eos.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.eos.networks.testnet = {
  id: 15557,
  name: "EOS Testnet Goerli",
  slug: "testnet",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://eosauthority.com",
    // NOTE: it's unclear whether EOS has NFTs, but this is the best we can do for now
    nftPath: "/transaction/{{transactionId}}?network=eosiotest",
  },
  rpcUrls: {
    main: "https://api.testnet.eos.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.ethereum.networks.mainnet = {
  id: 1,
  name: "Ethereum Mainnet",
  slug: "mainnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://etherscan.io",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://ethereum.publicnode.com",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.ethereum.networks.testnet = {
  id: 5,
  name: "Ethereum Testnet",
  slug: "testnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://sepolia.etherscan.io",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://ethereum-sepolia-rpc.publicnode.com",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.filecoin.networks.mainnet = {
  id: 31415790,
  name: "Filecoin Mainnet",
  slug: "mainnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://filscan.io",
    nftPath: "/en/message/{{transactionId}}/",
  },
  rpcUrls: {
    main: "https://api.node.glif.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.filecoin.networks.testnet = {
  id: 314159,
  name: "Filecoin Testnet",
  slug: "testnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://calibration.filscan.io",
    nftPath: "/en/message/{{transactionId}}/",
  },
  rpcUrls: {
    main: "https://api.calibration.node.glif.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.flare.networks.mainnet = {
  id: 14,
  name: "Flare Mainnet",
  slug: "mainnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: {
    url: "https://flare-explorer.flare.network",
    nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
  },
  rpcUrls: {
    main: "https://mainnet.flare.network",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.flare.networks.testnet = {
  id: 114,
  name: "Flare Testnet",
  slug: "testnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: {
    url: "https://coston2-explorer.flare.network",
    nftPath: "/token/{{contractId}}/instance/{{tokenId}}",
  },
  rpcUrls: {
    main: "https://coston2-api.flare.network/ext/C/rpc",
    //main: "https://coston2-api.flare.network/ext/bc/C/rpc",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.optimism.networks.mainnet = {
  id: 10,
  name: "Optimism Mainnet",
  slug: "mainnet",
  symbol: "OP",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://optimistic.etherscan.io",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://mainnet.optimism.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.optimism.networks.testnet = {
  id: 11155420,
  name: "Optimism Testnet",
  slug: "testnet",
  symbol: "OP",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://sepolia-optimism.etherscan.io",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://sepolia.optimism.io",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.polygon.networks.mainnet = {
  id: 137,
  name: "Polygon Mainnet",
  slug: "mainnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "20000000000",
  explorer: {
    url: "https://polygonscan.com",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://polygon-rpc.com",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.polygon.networks.testnet = {
  id: 80002,
  name: "Polygon Testnet",
  slug: "testnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "20000000000",
  explorer: {
    url: "https://amoy.polygonscan.com",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://rpc-amoy.polygon.technology/",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.starknet.networks.mainnet = {
  id: 0,
  name: "Starknet Mainnet",
  slug: "mainnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://starkscan.co",
    nftPath: "/nft/{{contractId}}/{{tokenId}}",
  },
  rpcUrls: {
    main: "https://starknet-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  tokens: {
    USDT: {
      contract:
        "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      icon: "icons/usdt.webp",
    },
    USDC: {
      contract:
        "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      icon: "icons/usdc.webp",
    },
  },
  wallet: "",
  wssurl: "",
}
chainConfiguration.starknet.networks.testnet = {
  id: 0,
  name: "Starknet Sepolia",
  slug: "testnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: {
    url: "https://sepolia.starkscan.co/",
    nftPath: "/nft/{{contractId}}/{{tokenId}}",
  },
  rpcUrls: {
    main: "https://free-rpc.nethermind.io/sepolia-juno/",
  },
  tokens: {
    USDT: {
      contract: "",
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      icon: "icons/usdt.webp",
    },
    USDC: {
      contract: "",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      icon: "icons/usdc.webp",
    },
  },
  wallet: "",
  wssurl: "",
}
chainConfiguration.stellar.networks.mainnet = {
  id: 0,
  name: "Stellar Mainnet",
  slug: "mainnet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: {
    url: "https://stellarchain.io",
    nftPath: "/accounts/{{contractId}}",
  },
  rpcUrls: {
    main: "https://horizon.stellar.org",
    soroban:
      "https://mainnet.stellar.validationcloud.io/v1/QW6tYBRenqUwP8d9ZJds44Dm-txH1497oDXcdC07xDo",
    // You can add more RPC URLs here as needed
  },
  networkPassphrase: "Public Global Stellar Network ; September 2015",
  tokens: {
    USDC: {
      contract: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      icon: "icons/usdc.webp",
    },
  },
  wallet: "",
  wssurl: "",
}
chainConfiguration.stellar.networks.testnet = {
  id: 0,
  name: "Stellar Testnet",
  slug: "testnet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: {
    url: "https://stellarchain.io",
    nftPath: "/accounts/{{contractId}}",
  },
  rpcUrls: {
    main: "https://horizon-testnet.stellar.org",
    soroban: "https://soroban-testnet.stellar.org",
  },
  networkPassphrase: "Test SDF Network ; September 2015",
  tokens: {
    USDC: {
      contract: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      icon: "icons/usdc.webp",
    },
  },
  contracts: {
    Credits: "CAIRWEYKTLVRQBXQGYNLDUAKWIUV4NO6WPTCMVHH2BOMUUUBTXRJF43R",
    Receipt_NFT: "CCUOIXOK4BIV2O7ANQ2JKUCMQS7JUQW3XISWNZTEQUIUGPHX7I5KV5UD",
  },
  wallet: "",
  wssurl: "",
}
// having more than testnet and mainnet currently makes this more complex, so commenting for now
// since we don't use it
// chainConfiguration.stellar.networks.futurenet = {
//   id: 0,
//   name: "Stellar Futurenet",
//   slug: "futurenet",
//   symbol: "XLM",
//   decimals: 6,
//   gasprice: "250000000",
//   explorer: "https://stellarchain.io",
//   networkPassphrase: "Test SDF Future Network ; October 2022",
//   rpcUrls: {
//     main: "https://horizon-futurenet.stellar.org",
//     soroban: "https://horizon-futurenet.stellar.org",
//   },
//   wallet: "",
//   wssurl: "",
// }
chainConfiguration.tron.networks.mainnet = {
  id: 728126428,
  name: "Tron Mainnet",
  slug: "mainnet",
  symbol: "TRX",
  decimals: 6, // TODO: verify
  gasprice: "250000000", // TODO: verify
  explorer: {
    url: "https://tronscan.io",
    nftPath: "/#/transaction/{{transactionId}}",
  },
  rpcUrls: {
    main: "https://api.trongrid.io/jsonrpc",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.tron.networks.testnet = {
  id: 2494104990,
  name: "Tron Shasta Testnet",
  slug: "testnet",
  symbol: "TRX",
  decimals: 6,
  gasprice: "250000000",
  explorer: {
    url: "https://shasta.tronscan.io",
    nftPath: "/#/transaction/{{transactionId}}",
  },
  rpcUrls: {
    main: "https://api.shasta.trongrid.io/jsonrpc",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.xdc.networks.mainnet = {
  id: 50,
  name: "XDC Mainnet",
  slug: "mainnet",
  symbol: "XDC",
  decimals: 18,
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
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.xdc.networks.testnet = {
  id: 51,
  name: "XDC Testnet",
  slug: "testnet",
  symbol: "XDC",
  decimals: 18,
  gasprice: "15000000000",
  explorer: {
    url: "https://testnet.xdcscan.com",
    nftPath: "/token/{{contractId}}?a={{tokenId}}",
  },
  rpcUrls: {
    main: "https://rpc.apothem.network",
  },
  tokens: {
    XDC: {
      contract: "xdc7849f6ba978188ce97bb02bdaba673af65cbd269",
      name: "TXDC",
      symbol: "TXDC",
      decimals: 18,
      icon: "icons/xdc.webp",
    },
  },
  contracts: {
    TBA_Registry: "0x000000006551c19487814612e58fe06813775758",
    TBA_Implementation: "0x41c8f39463a868d3a88af00cd0fe7102f30e44ec",
    TBA_NFT: "0x88Bb2D04f180631BdC4Cd6129106665A0B6790D8", // 0xcbbb500f1cf1d6c44b0d7c9ff40292f8a0e756d7
    Receipt_NFT: "0xa3a3d70Ec57bC30472CD687F3D530b3431292989",
    Story_NFT: "0xc917ff4128525a65639d18f1d240a788081f022d",
  },
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  wssurl: "",
}
chainConfiguration.xrpl.networks.mainnet = {
  id: 0,
  name: "XRP Mainnet",
  slug: "mainnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: {
    url: "https://livenet.xrpl.org",
    nftPath: "/transactions/{{transactionId}}",
  },
  rpcUrls: {
    main: "https://xrplcluster.com",
  },
  wallet: "",
  wssurl: "",
}
chainConfiguration.xrpl.networks.testnet = {
  id: 0,
  name: "XRP Testnet",
  slug: "testnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: {
    url: "https://testnet.xrpl.org",
    nftPath: "/transactions/{{transactionId}}",
  },
  rpcUrls: {
    main: "https://s.altnet.rippletest.net:51234",
  },
  wallet: "r3qr25QnANd8RRT9NYtgUrrty3yTfpGx9c",
  wssurl: "wss://s.altnet.rippletest.net:51233",
}

export default chainConfiguration
