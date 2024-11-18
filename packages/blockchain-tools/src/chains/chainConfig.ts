import appConfig from "@cfce/app-config"
import type { ChainConfig, ChainSlugs, Chains } from "@cfce/types"

const chainConfiguration: Chains = {
  arbitrum: {
    slug: "arbitrum",
    name: "Arbitrum",
    symbol: "ARB",
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
  decimals: 18, // decimals shouldn't be a bigint, will never exceed 18
  gasprice: "250000000",
  explorer: "https://arbiscan.io",
  rpcUrls: {
    main: "https://arb1.arbitrum.io/rpc",
  },
  wssurl: "",
}
chainConfiguration.arbitrum.networks.testnet = {
  id: 421614,
  name: "Arbitrum Testnet",
  slug: "testnet",
  symbol: "ARB",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://sepolia.arbiscan.io",
  rpcUrls: {
    main: "https://sepolia-rollup.arbitrum.io/rpc",
  },
  wssurl: "",
}
chainConfiguration.avalanche.networks.mainnet = {
  id: 43114,
  name: "Avalanche Mainnet",
  slug: "mainnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://snowtrace.io",
  rpcUrls: {
    main: "https://ethereum.publicnode.com",
  },
  wssurl: "",
}
chainConfiguration.avalanche.networks.testnet = {
  id: 43113,
  name: "Avalanche Testnet",
  slug: "testnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://testnet.snowtrace.io",
  rpcUrls: {
    main: "https://ethereum-goerli.publicnode.com",
  },
  wssurl: "",
}
chainConfiguration.base.networks.mainnet = {
  id: 8453,
  name: "Base Mainnet",
  slug: "mainnet",
  symbol: "BASE",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://basescan.org",
  rpcUrls: {
    main: "https://mainnet.base.org",
  },
  wssurl: "",
}
chainConfiguration.base.networks.testnet = {
  id: 84532,
  name: "Base Testnet",
  slug: "testnet",
  symbol: "BASE",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://testnet.basescan.org",
  rpcUrls: {
    main: "https://testnet.base.org",
  },
  wssurl: "",
}
chainConfiguration.binance.networks.mainnet = {
  id: 56,
  name: "Binance Mainnet",
  slug: "mainnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: "https://bscscan.com",
  rpcUrls: {
    main: "https://bsc-dataseed.binance.org",
  },
  wssurl: "",
}
chainConfiguration.binance.networks.testnet = {
  id: 97,
  name: "Binance Testnet",
  slug: "testnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: "https://testnet.bscscan.com",
  rpcUrls: {
    main: "https://data-seed-prebsc-1-s1.binance.org:8545",
  },
  wssurl: "",
}
chainConfiguration.celo.networks.mainnet = {
  id: 42220,
  name: "Celo Mainnet",
  slug: "mainnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: "https://explorer.celo.org",
  rpcUrls: {
    main: "https://forno.celo.org",
  },
  wssurl: "",
}
chainConfiguration.celo.networks.testnet = {
  id: 44787,
  name: "Celo Testnet",
  slug: "testnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: "https://alfajores-blockscout.celo-testnet.org",
  rpcUrls: {
    main: "https://alfajores-forno.celo-testnet.org",
  },
  wssurl: "",
}
chainConfiguration.eos.networks.mainnet = {
  id: 17777,
  name: "EOS Mainnet",
  slug: "mainnet",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://explorer.eos.io",
  rpcUrls: {
    main: "https://api.eos.io",
  },
  wssurl: "",
}
chainConfiguration.eos.networks.testnet = {
  id: 15557,
  name: "EOS Testnet Goerli",
  slug: "testnet",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://explorer.testnet.eos.io",
  rpcUrls: {
    main: "https://api.testnet.eos.io",
  },
  wssurl: "",
}
chainConfiguration.ethereum.networks.mainnet = {
  id: 1,
  name: "Ethereum Mainnet",
  slug: "mainnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://etherscan.io",
  rpcUrls: {
    main: "https://ethereum.publicnode.com",
  },
  wssurl: "",
}
chainConfiguration.ethereum.networks.testnet = {
  id: 5,
  name: "Ethereum Testnet",
  slug: "testnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrls: {
    main: "https://ethereum-goerli.publicnode.com",
  },
  wssurl: "",
}
chainConfiguration.filecoin.networks.mainnet = {
  id: 31415790,
  name: "Filecoin Mainnet",
  slug: "mainnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://filscan.io",
  rpcUrls: {
    main: "https://api.node.glif.io",
  },
  wssurl: "",
}
chainConfiguration.filecoin.networks.testnet = {
  id: 314159,
  name: "Filecoin Testnet",
  slug: "testnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://calibration.filscan.io",
  rpcUrls: {
    main: "https://api.calibration.node.glif.io",
  },
  wssurl: "",
}
chainConfiguration.flare.networks.mainnet = {
  id: 14,
  name: "Flare Mainnet",
  slug: "mainnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: "https://flare-explorer.flare.network",
  rpcUrls: {
    main: "https://mainnet.flare.network",
  },
  wssurl: "",
}
chainConfiguration.flare.networks.testnet = {
  id: 16,
  name: "Flare Testnet",
  slug: "testnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: "https://coston-explorer.flare.network",
  rpcUrls: {
    main: "https://coston-api.flare.network/ext/bc/C/rpc",
  },
  wssurl: "",
}
chainConfiguration.optimism.networks.mainnet = {
  id: 10,
  name: "Optimism Mainnet",
  slug: "mainnet",
  symbol: "OP",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://optimistic.etherscan.io",
  rpcUrls: {
    main: "https://mainnet.optimism.io",
  },
  wssurl: "",
}
chainConfiguration.optimism.networks.testnet = {
  id: 420,
  name: "Optimism Testnet",
  slug: "testnet",
  symbol: "OP",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli-optimism.etherscan.io",
  rpcUrls: {
    main: "https://goerli.optimism.io",
  },
  wssurl: "",
}
chainConfiguration.polygon.networks.mainnet = {
  id: 137,
  name: "Polygon Mainnet",
  slug: "mainnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "20000000000",
  explorer: "https://polygonscan.com",
  rpcUrls: {
    main: "https://polygon-rpc.com",
  },
  wssurl: "",
}
chainConfiguration.polygon.networks.testnet = {
  id: 80001,
  name: "Polygon Testnet",
  slug: "testnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "20000000000",
  explorer: "https://mumbai.polygonscan.com",
  rpcUrls: {
    main: "https://rpc-mumbai.maticvigil.com",
  },
  wssurl: "",
}
chainConfiguration.starknet.networks.mainnet = {
  id: 0,
  name: "Starknet Mainnet",
  slug: "mainnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://starkscan.co",
  rpcUrls: {
    main: "https://starknet-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  },
  wssurl: "",
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
}
chainConfiguration.starknet.networks.testnet = {
  id: 0,
  name: "Starknet Sepolia",
  slug: "testnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://sepolia.starkscan.co/",
  rpcUrls: {
    main: "https://starknet-sepolia.public.blastapi.io",
  },
  wssurl: "",
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
}
chainConfiguration.stellar.networks.mainnet = {
  id: 0,
  name: "Stellar Mainnet",
  slug: "mainnet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://stellarchain.io",
  rpcUrls: {
    main: "https://horizon.stellar.org",
    soroban:
      "https://mainnet.stellar.validationcloud.io/v1/QW6tYBRenqUwP8d9ZJds44Dm-txH1497oDXcdC07xDo",
    // You can add more RPC URLs here as needed
  },
  wssurl: "",
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
}
chainConfiguration.stellar.networks.testnet = {
  id: 0,
  name: "Stellar Testnet",
  slug: "testnet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://stellarchain.io",
  rpcUrls: {
    main: "https://horizon-testnet.stellar.org",
    soroban: "https://soroban-testnet.stellar.org",
  },
  wssurl: "",
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
    credits: "CAIRWEYKTLVRQBXQGYNLDUAKWIUV4NO6WPTCMVHH2BOMUUUBTXRJF43R",
    NFToken: "CCUOIXOK4BIV2O7ANQ2JKUCMQS7JUQW3XISWNZTEQUIUGPHX7I5KV5UD",
  },
}
chainConfiguration.stellar.networks.futurenet = {
  id: 0,
  name: "Stellar Futurenet",
  slug: "futurenet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://stellarchain.io",
  rpcUrls: {
    main: "https://horizon-futurenet.stellar.org",
    soroban: "https://horizon-futurenet.stellar.org",
  },
  wssurl: "",
  networkPassphrase: "Test SDF Future Network ; October 2022",
}
chainConfiguration.tron.networks.mainnet = {
  id: 728126428,
  name: "Tron Mainnet",
  slug: "mainnet",
  symbol: "TRX",
  decimals: 6, // TODO: verify
  gasprice: "250000000", // TODO: verify
  explorer: "https://tronscan.io",
  rpcUrls: {
    main: "https://api.trongrid.io/jsonrpc",
  },
  wssurl: "",
}
chainConfiguration.tron.networks.testnet = {
  id: 2494104990,
  name: "Tron Shasta Testnet",
  slug: "testnet",
  symbol: "TRX",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://shasta.tronscan.io",
  rpcUrls: {
    main: "https://api.shasta.trongrid.io/jsonrpc",
  },
  wssurl: "",
}
chainConfiguration.xdc.networks.mainnet = {
  id: 50,
  name: "XDC Mainnet",
  slug: "mainnet",
  symbol: "XDC",
  decimals: 18,
  gasprice: "12500000000",
  explorer: "https://xdcscan.com",
  rpcUrls: {
    main: "https://rpc.xdcrpc.com",
  },
  wssurl: "",
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  contracts: {
    tba6551RegistryAddress: "0x000000006551c19487814612e58fe06813775758",
    tba6551ImplementationAddress: "0x41c8f39463a868d3a88af00cd0fe7102f30e44ec",
    tba721TokenContract: "0x0",
    nft721TokenContract: "0x0",
    nft1155TokenContract: "0x0",
  },
}
chainConfiguration.xdc.networks.testnet = {
  id: 51,
  name: "XDC Testnet",
  slug: "testnet",
  symbol: "XDC",
  decimals: 18,
  gasprice: "12500000000",
  explorer: "https://testnet.xdcscan.com",
  rpcUrls: {
    main: "https://erpc.apothem.network",
  },
  wssurl: "",
  wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
  contracts: {
    tba6551RegistryAddress: "0x000000006551c19487814612e58fe06813775758",
    tba6551ImplementationAddress: "0x41c8f39463a868d3a88af00cd0fe7102f30e44ec",
    tba721TokenContract: "0xcbbb500f1cf1d6c44b0d7c9ff40292f8a0e756d7",
    nft721TokenContract: "0xa3a3d70Ec57bC30472CD687F3D530b3431292989",
    nft1155TokenContract: "0xc917ff4128525a65639d18f1d240a788081f022d",
  },
}
chainConfiguration.xrpl.networks.mainnet = {
  id: 0,
  name: "XRP Mainnet",
  slug: "mainnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://xrpscan.com",
  rpcUrls: {
    main: "https://xrplcluster.com",
  },
  wssurl: "",
}
chainConfiguration.xrpl.networks.testnet = {
  id: 0,
  name: "XRP Testnet",
  slug: "testnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://testnet.xrpl.org",
  rpcUrls: {
    main: "https://s.altnet.rippletest.net:51234",
  },
  wssurl: "",
}

export const getChainConfiguration = (): Record<ChainSlugs, ChainConfig> => {
  const chainKeys = Object.keys(
    appConfig.chains,
  ) as (keyof typeof appConfig.chains)[]

  return chainKeys.reduce(
    (obj, key) => {
      obj[key] = chainConfiguration[key]
      return obj
    },
    {} as Record<ChainSlugs, ChainConfig>,
  )
}

export const getRpcUrl = (
  chain: ChainSlugs,
  network: string,
  rpcType = "main",
): string => {
  const chainConfig = chainConfiguration[chain]
  if (!chainConfig) {
    throw new Error(`Chain configuration not found for ${chain}`)
  }

  const networkConfig = chainConfig.networks[network]
  if (!networkConfig) {
    throw new Error(`Network configuration not found for ${chain} ${network}`)
  }

  const rpcUrl = networkConfig.rpcUrls[rpcType]
  if (!rpcUrl) {
    throw new Error(`RPC URL not found for ${chain} ${network} ${rpcType}`)
  }

  return rpcUrl
}

export default chainConfiguration
