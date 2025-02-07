// copy of database/src/prisma/schema.prisma Chain enum
// importing here would cause a circular dependency
export type Chain =
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

export type Network = "mainnet" | "testnet"

type FactoryContract =
  | "CreditsFactory"
  | "ReceiptFactory"
  | "VolunteersFactory"
  | "ReceiptFactory"
  | "VolunteersFactory"

export type Contract =
  | FactoryContract
  | "TBA_Registry"
  | "TBA_Implementation"
  | "TBA_NFT"
  | "Receipt_NFT"
  | "Story_NFT"
  | "Credits"

export interface NetworkConfig {
  id: number
  name: string
  slug: Network
  symbol: string
  decimals: number
  gasprice: string
  explorer: {
    url: string
    nftPath: string
  }
  rpcUrls: {
    main: string
    [key: string]: string
  }
  wssurl: string
  tokens?: Partial<Record<TokenTickerSymbol, TokenConfig>>
  networkPassphrase?: string
  contracts?: Partial<Record<Contract, string>>
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

export type ClientInterfaces =
  | "argent"
  | "crossmark"
  | "freighter"
  | "gemwallet"
  | "metamask"
  | "xaman"
// | "xrpl"
// | "web3"
// | "stellar"
// | "argent"

export type ServerInterfaces = "evm" | "xrpl" | "stellar" | "starknet"

export type Chains = Record<ChainSlugs, ChainConfig>
