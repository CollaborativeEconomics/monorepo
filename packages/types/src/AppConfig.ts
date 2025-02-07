import type { AuthTypes } from "./Auth"
import type {
  ChainSlugs,
  ClientInterfaces,
  Contract,
  Network,
  TokenTickerSymbol,
} from "./BlockchainTools"

export interface AppChainConfig {
  slug: ChainSlugs
  network: Network
  contracts: Partial<Record<Contract, string>>
  wallet?: string
  enabledWallets: ClientInterfaces[]
  tokens: TokenTickerSymbol[]
  destinationTag?: string
  defaultAddress?: string
}

export interface AppConfig {
  siteInfo: {
    title: string
    description: string
    logo?: {
      light: string
      dark: string
    }
    options: {
      showCarbonCreditDisplay: boolean
      enableGaslessTransactions: boolean
      enableFetchBalance: boolean
    }
    featuredInitiatives?: string[]
  }
  apis: {
    registry: {
      apiUrl: string
    }
    ipfs: {
      endpoint: string
      region: string
      gateway: string
      pinning: string
      buckets: {
        nfts: string
        avatars: string
        media: string
      }
    }
  }
  auth: AuthTypes[]
  chains: Partial<Record<ChainSlugs, AppChainConfig>>
  chainDefaults: {
    network: Network
    wallet: ClientInterfaces
    chain: ChainSlugs
    coin: TokenTickerSymbol
    defaultAddress?: string
  }
}
