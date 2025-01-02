import type { AuthTypes } from "./Auth"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "./BlockchainTools"

type ContractType =
  | "credits" // default carbon credit contract, deprecated in favor of DB-based contracts
  | "creditsFactory" // deploy credits contract through partner portal
  | "creditsHash"
  | "factory"
  | "receiptFactory" // deploy NFTReceipt contract through partner portal
  | "receiptMintbotERC721" // automatically mint receipt NFTs
  | "receiptMintbotERC721Hash"
  | "storyERC1155" // story NFT contract
  | "xlmNativeCoin"

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
