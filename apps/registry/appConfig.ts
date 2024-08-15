import type { Interfaces } from "@cfce/blockchain-tools"
import type {
  ChainSlugs,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"

const siteInfo = {
  title: "Give Credit",
  description: "Make tax-deductible donations of carbon credits",
}

const apis = {
  registry: {
    apiUrl: "https://registry.cfce.io/api",
  },
  ipfs: {
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    gateway: "https://ipfs.filebase.io/ipfs/",
    pinning: "https://api.filebase.io/v1/ipfs",
    buckets: {
      nfts: "cfce-give-nfts",
      avatars: "cfce-profiles",
      media: "cfce-media",
    },
  },
}

type ContractType = "receiptMintbotERC721"
interface ChainConfig {
  slug: ChainSlugs
  network: string
  contracts: Partial<Record<ContractType, string>>
  wallets: Interfaces[]
  tokens: TokenTickerSymbol[]
}
const chains: ChainConfig[] = [
  {
    slug: "xinfin",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallets: [],
    tokens: [],
  },
]

const auth = ["github"]

interface ChainDefaults {
  network: Network
  wallet: string
  chain: ChainSlugs
  coin: TokenTickerSymbol
}
const chainDefaults: ChainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "stellar",
  coin: "XLM",
}

const appConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfig
