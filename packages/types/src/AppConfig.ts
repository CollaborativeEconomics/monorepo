import type { AuthTypes } from "./Auth"
import type {
  ChainConfig,
  ChainSlugs,
  ClientInterfaces,
  Contract,
  Network,
  NetworkConfig,
  TokenTickerSymbol,
} from "./BlockchainTools"

// App-specific chain settings
// Can override/merge anything from the NetworkConfig
export interface AppChainSettings extends NetworkConfig {
  enabledWallets: ClientInterfaces[]
  defaultAddress?: string
  destinationTag?: string
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
  chains: Partial<Record<ChainSlugs, AppChainSettings>>
  chainDefaults: {
    network: Network
    wallet: ClientInterfaces
    chain: ChainSlugs
    coin: TokenTickerSymbol
    defaultAddress?: string
  }
}

// Helper type to access combined chain configuration
export type RuntimeChainConfig = ChainConfig & {
  appSettings: AppChainSettings
}
