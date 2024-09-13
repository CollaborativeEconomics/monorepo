import type {
  AppChainConfig,
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/types"
import type { AppConfig, AuthTypes } from "@cfce/types"

const siteInfo = {
  title: "Partner's Portal",
  description: "Manage your organizations blockchain donations",
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

const chains: AppChainConfig[] = []

const auth = ["google"] as AuthTypes[]

interface ChainDefaults {
  network: Network
  wallet: ClientInterfaces
  chain: ChainSlugs
  coin: TokenTickerSymbol
}
const chainDefaults: ChainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "xinfin",
  coin: "XDC",
}

const appConfig: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfig
