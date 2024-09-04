import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"

export type AuthTypes = ClientInterfaces | "github" | "google"

type ContractType = "receiptMintbotERC721"
export interface ChainConfig {
  name: string
  slug: ChainSlugs
  network: string
  contracts: Partial<Record<ContractType, string>>
  wallets: ClientInterfaces[]
  tokens: TokenTickerSymbol[]
  destinationTag?: string
}

export interface AppConfig {
  siteInfo: {
    title: string
    description: string
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
  chains: ChainConfig[]
  chainDefaults: {
    network: Network
    wallet: ClientInterfaces
    chain: ChainSlugs
    coin: TokenTickerSymbol
  }
}
