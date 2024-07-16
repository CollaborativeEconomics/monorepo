import { chain } from "lodash"

export const ChainSlugs = [
  "arbitrum",
  "avalanche",
  "base",
  "binance",
  "celo",
  "eos",
  "ethereum",
  "filecoin",
  "flare",
  "optimism",
  "polygon",
  "starknet",
  "stellar",
  "xinfin",
  "xrpl",
] as const
export type ChainSlugs = (typeof ChainSlugs)[number]

export const ChainNames = [
  "Arbitrum",
  "Avalanche",
  "Base",
  "Binance",
  "Celo",
  "EOS",
  "Ethereum",
  "Filecoin",
  "Flare",
  "Optimism",
  "Polygon",
  "Starknet",
  "Stellar",
  "XinFin",
  "XRPL",
] as const
export type ChainNames = (typeof ChainNames)[number]

export type Network = "mainnet" | "testnet" | "horizon" | string
export interface NetworkConfig {
  id: number
  name: string
  symbol: string
  decimals: number
  gasprice: string
  explorer: string
  rpcUrl: string
  wssurl: string
  tokens?: Partial<Record<TokenTickerSymbol, TokenConfig>>
  networkPassphrase?: string
}

export const TokenTickerSymbol = [
  "ARB",
  "AVAX",
  "BASE",
  "BNB",
  "CELO",
  "EOS",
  "ETH",
  "FIL",
  "FLR",
  "OP",
  "MATIC",
  "PGN",
  "STRK",
  "XLM",
  "XDC",
  "XRP",
  "USDT",
  "USDC",
  "DAI",
] as const
export type TokenTickerSymbol = (typeof TokenTickerSymbol)[number]

interface TokenConfig {
  contract: string
  name: string
  symbol: string
  decimals: number
  logo: string
}

export interface ChainConfig {
  slug: ChainSlugs
  chain: ChainNames
  symbol: TokenTickerSymbol
  logo: string
  networks: Record<Network, NetworkConfig>
}

export type Chains = Record<ChainSlugs, ChainConfig>

const chainConfiguration: Chains = {
  arbitrum: {
    slug: "arbitrum",
    chain: "Arbitrum",
    symbol: "ARB",
    logo: "arb.svg",
    networks: {},
  },
  avalanche: {
    slug: "avalanche",
    chain: "Avalanche",
    symbol: "AVAX",
    logo: "avax.svg",
    networks: {},
  },
  base: {
    slug: "base",
    chain: "Base",
    symbol: "BASE",
    logo: "base.svg",
    networks: {},
  },
  binance: {
    slug: "binance",
    chain: "Binance",
    symbol: "BNB",
    logo: "bnb.svg",
    networks: {},
  },
  celo: {
    slug: "celo",
    chain: "Celo",
    symbol: "CELO",
    logo: "celo.svg",
    networks: {},
  },
  eos: {
    slug: "eos",
    chain: "EOS",
    symbol: "EOS",
    logo: "eos.svg",
    networks: {},
  },
  ethereum: {
    slug: "ethereum",
    chain: "Ethereum",
    symbol: "ETH",
    logo: "eth.svg",
    networks: {},
  },
  filecoin: {
    slug: "filecoin",
    chain: "Filecoin",
    symbol: "FIL",
    logo: "fil.svg",
    networks: {},
  },
  flare: {
    slug: "flare",
    chain: "Flare",
    symbol: "FLR",
    logo: "flr.svg",
    networks: {},
  },
  optimism: {
    slug: "optimism",
    chain: "Optimism",
    symbol: "OP",
    logo: "op.svg",
    networks: {},
  },
  polygon: {
    slug: "polygon",
    chain: "Polygon",
    symbol: "MATIC",
    logo: "matic.svg",
    networks: {},
  },
  starknet: {
    slug: "starknet",
    chain: "Starknet",
    symbol: "STRK",
    logo: "strk.svg",
    networks: {},
  },
  stellar: {
    slug: "stellar",
    chain: "Stellar",
    symbol: "XLM",
    logo: "xlm.svg",
    networks: {},
  },
  xinfin: {
    slug: "xinfin",
    chain: "XinFin",
    symbol: "XDC",
    logo: "xdc.svg",
    networks: {},
  },
  xrpl: {
    slug: "xrpl",
    chain: "XRPL",
    symbol: "XRP",
    logo: "xrp.svg",
    networks: {},
  },
} as const

chainConfiguration.arbitrum.networks.mainnet = {
  id: 42161,
  name: "Arbitrum Mainnet",
  symbol: "ARB",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://arbiscan.io",
  rpcUrl: "https://arb1.arbitrum.io/rpc",
  wssurl: "",
}
chainConfiguration.arbitrum.networks.testnet = {
  id: 421614,
  name: "Arbitrum Testnet",
  symbol: "ARB",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://sepolia.arbiscan.io",
  rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
  wssurl: "",
}
chainConfiguration.avalanche.networks.mainnet = {
  id: 43114,
  name: "Avalanche Mainnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://snowtrace.io",
  rpcUrl: "https://ethereum.publicnode.com",
  wssurl: "",
}
chainConfiguration.avalanche.networks.testnet = {
  id: 43113,
  name: "Avalanche Testnet",
  symbol: "AVAX",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://testnet.snowtrace.io",
  rpcUrl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
}
chainConfiguration.base.networks.mainnet = {
  id: 8453,
  name: "Base Mainnet",
  symbol: "BASE",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://basescan.org",
  rpcUrl: "https://mainnet.base.org",
  wssurl: "",
}
chainConfiguration.base.networks.testnet = {
  id: 84532,
  name: "Base Testnet",
  symbol: "BASE",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://testnet.basescan.org",
  rpcUrl: "https://testnet.base.org",
  wssurl: "",
}
chainConfiguration.binance.networks.mainnet = {
  id: 56,
  name: "Binance Mainnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: "https://bscscan.com",
  rpcUrl: "https://bsc-dataseed.binance.org",
  wssurl: "",
}
chainConfiguration.binance.networks.testnet = {
  id: 97,
  name: "Binance Testnet",
  symbol: "BNB",
  decimals: 18,
  gasprice: "9000000000",
  explorer: "https://testnet.bscscan.com",
  rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545",
  wssurl: "",
}
chainConfiguration.celo.networks.mainnet = {
  id: 42220,
  name: "Celo Mainnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: "https://explorer.celo.org",
  rpcUrl: "https://forno.celo.org",
  wssurl: "",
}
chainConfiguration.celo.networks.testnet = {
  id: 44787,
  name: "Celo Testnet",
  symbol: "CELO",
  decimals: 18,
  gasprice: "10000000000",
  explorer: "https://alfajores-blockscout.celo-testnet.org",
  rpcUrl: "https://alfajores-forno.celo-testnet.org",
  wssurl: "",
}
chainConfiguration.eos.networks.mainnet = {
  id: 17777,
  name: "EOS Mainnet",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://explorer.eos.io",
  rpcUrl: "https://api.eos.io",
  wssurl: "",
}
chainConfiguration.eos.networks.testnet = {
  id: 15557,
  name: "EOS Testnet Goerli",
  symbol: "EOS",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://explorer.testnet.eos.io",
  rpcUrl: "https://api.testnet.eos.io",
  wssurl: "",
}
chainConfiguration.ethereum.networks.mainnet = {
  id: 1,
  name: "Ethereum Mainnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://etherscan.io",
  rpcUrl: "https://ethereum.publicnode.com",
  wssurl: "",
}
chainConfiguration.ethereum.networks.testnet = {
  id: 5,
  name: "Ethereum Testnet",
  symbol: "ETH",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
}
chainConfiguration.filecoin.networks.mainnet = {
  id: 31415790,
  name: "Filecoin Mainnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://filscan.io",
  rpcUrl: "https://api.node.glif.io",
  wssurl: "",
}
chainConfiguration.filecoin.networks.testnet = {
  id: 314159,
  name: "Filecoin Testnet",
  symbol: "FIL",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://calibration.filscan.io",
  rpcUrl: "https://api.calibration.node.glif.io",
  wssurl: "",
}
chainConfiguration.flare.networks.mainnet = {
  id: 14,
  name: "Flare Mainnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: "https://flare-explorer.flare.network",
  rpcUrl: "https://mainnet.flare.network",
  wssurl: "",
}
chainConfiguration.flare.networks.testnet = {
  id: 16,
  name: "Flare Testnet",
  symbol: "FLR",
  decimals: 18,
  gasprice: "25000000000",
  explorer: "https://coston-explorer.flare.network",
  rpcUrl: "https://coston-api.flare.network/ext/bc/C/rpc",
  wssurl: "",
}
chainConfiguration.optimism.networks.mainnet = {
  id: 10,
  name: "Optimism Mainnet",
  symbol: "OP",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
}
chainConfiguration.optimism.networks.testnet = {
  id: 5,
  name: "Optimism Testnet",
  symbol: "OP",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
}
chainConfiguration.polygon.networks.mainnet = {
  id: 137,
  name: "Polygon Mainnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "20000000000",
  explorer: "https://polygonscan.com",
  rpcUrl: "https://ethereum.publicnode.com",
  wssurl: "",
}
chainConfiguration.polygon.networks.testnet = {
  id: 80001,
  name: "Polygon Testnet",
  symbol: "MATIC",
  decimals: 18,
  gasprice: "20000000000",
  explorer: "https://mumbai.polygonscan.com",
  rpcUrl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
}
chainConfiguration.starknet.networks.mainnet = {
  id: 0,
  name: "Starknet Mainnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrl:
    "https://starknet-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  wssurl: "",
  tokens: {
    USDT: {
      contract:
        "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
      name: "Tether USD",
      symbol: "USDT",
      decimals: 6,
      logo: "usdt.svg",
    },
    USDC: {
      contract:
        "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      logo: "usdc.svg",
    },
  },
}
chainConfiguration.starknet.networks.testnet = {
  id: 0,
  name: "Starknet Testnet",
  symbol: "STRK",
  decimals: 18,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrl:
    "https://starknet-goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  wssurl: "",
  tokens: {
    USDT: {
      contract: "",
      name: "Tether",
      symbol: "USDT",
      decimals: 6,
      logo: "usdt.svg",
    },
    USDC: {
      contract: "",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      logo: "usdc.svg",
    },
  },
}
chainConfiguration.stellar.networks.mainnet = {
  id: 0,
  name: "Stellar Mainnet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://stellarchain.io",
  rpcUrl: "https://horizon.stellar.org",
  wssurl: "",
  networkPassphrase: "Public Global Stellar Network ; September 2015",
  tokens: {
    USDC: {
      contract: "CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      logo: "usdc.svg",
    },
  },
}
chainConfiguration.stellar.networks.testnet = {
  id: 0,
  name: "Stellar Testnet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://stellarchain.io",
  rpcUrl: "https://horizon-testnet.stellar.org",
  wssurl: "",
  networkPassphrase: "Test SDF Network ; September 2015",
  tokens: {
    USDC: {
      contract: "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA",
      name: "USDC",
      symbol: "USDC",
      decimals: 6,
      logo: "usdc.svg",
    },
  },
}
chainConfiguration.stellar.networks.futurenet = {
  id: 0,
  name: "Stellar Futurenet",
  symbol: "XLM",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://stellarchain.io",
  rpcUrl: "https://horizon-futurenet.stellar.org",
  wssurl: "",
  networkPassphrase: "Test SDF Future Network ; October 2022",
}
chainConfiguration.xinfin.networks.mainnet = {
  id: 50,
  name: "XinFin Mainnet",
  symbol: "XDC",
  decimals: 18,
  gasprice: "12500000000",
  explorer: "https://explorer.xinfin.network",
  rpcUrl: "https://rpc.xinfin.network",
  wssurl: "",
}
chainConfiguration.xinfin.networks.testnet = {
  id: 51,
  name: "XinFin Testnet",
  symbol: "XDC",
  decimals: 18,
  gasprice: "12500000000",
  explorer: "https://explorer.apothem.network",
  rpcUrl: "https://rpc.apothem.network",
  wssurl: "",
}
chainConfiguration.xrpl.networks.mainnet = {
  id: 0,
  name: "XRP Mainnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://etherscan.io",
  rpcUrl: "https://ethereum.publicnode.com",
  wssurl: "",
}
chainConfiguration.xrpl.networks.testnet = {
  id: 0,
  name: "XRP Testnet",
  symbol: "XRP",
  decimals: 6,
  gasprice: "250000000",
  explorer: "https://goerli.etherscan.io",
  rpcUrl: "https://ethereum-goerli.publicnode.com",
  wssurl: "",
}

export default chainConfiguration
