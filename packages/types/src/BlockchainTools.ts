// copy of database/src/prisma/schema.prisma Chain enum
// importing here would cause a circular dependency
type Chain =
  | "Arbitrum"
  | "Avalanche"
  | "Base"
  | "Binance"
  | "Celo"
  | "EOS"
  | "Ethereum"
  | "Filecoin"
  | "Flare"
  | "Optimism"
  | "Polygon"
  | "Starknet"
  | "Stellar"
  | "Tron"
  | "XDC"
  | "XRPL"

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
  "tron",
  "xdc",
  "xrpl",
] as const
export type ChainSlugs = (typeof ChainSlugs)[number]

export const ChainNames: Chain[] = [
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
  "XDC",
  "XRPL",
] as const

export type Network = "mainnet" | "testnet" | "horizon" | string
export interface NetworkConfig {
  id: number | string
  name: string
  slug: Network
  symbol: string
  decimals: number
  gasprice: string
  explorer: string
  rpcUrls: {
    main: string
    [key: string]: string
  }
  wssurl: string
  tokens?: Partial<Record<TokenTickerSymbol, TokenConfig>>
  networkPassphrase?: string
  contracts?: Record<string, string>
  wallet?: string
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
  "TRX",
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
  icon: string
}

export interface ChainConfig {
  slug: ChainSlugs
  name: Chain
  symbol: string
  icon: string // This should be a string path to the icon
  networks: Record<string, NetworkConfig>
}

export type Interfaces =
  | "argent"
  | "crossmark"
  | "freighter"
  | "gemwallet"
  | "metamask"
  | "stellar"
  | "web3"
  | "xaman"
  | "xrpl"

export type ClientInterfaces = Exclude<Interfaces, "web3" | "xrpl" | "stellar">

export type Chains = Record<ChainSlugs, ChainConfig>
