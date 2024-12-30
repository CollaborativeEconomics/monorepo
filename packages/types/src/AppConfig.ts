import type { AuthTypes } from "./Auth"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "./BlockchainTools"

type ContractType =
  | "receiptMintbotERC721"
  | "credits"
  | "storyERC1155"
  | "creditsFactory"

export interface AppChainConfig {
  slug: ChainSlugs
  network: string
  contracts: Partial<Record<ContractType, string>>
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
    }
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
