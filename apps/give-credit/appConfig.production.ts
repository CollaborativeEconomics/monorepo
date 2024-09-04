import type {
  AppConfig,
  ChainConfig,
} from "@cfce/app-config/dist/appConfigTypes"
import type {
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools"
import type { AuthTypes } from "@cfce/utils"

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

const chains: ChainConfig[] = [
  {
    slug: "xinfin",
    name: "XinFin",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallets: [],
    tokens: [],
  },
  {
    slug: "stellar",
    name: "Stellar",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721:
        "CDCTS77MPY6GXTGMFFIOWINMPBX4G7DELFEV34KTX5N2DZH43TGHMNU3",
    },
    wallets: ["freighter"],
    tokens: ["XLM", "USDC"],
  },
]

const auth = Object.keys(chains) as AuthTypes[]

interface ChainDefaults {
  network: Network
  wallet: ClientInterfaces
  chain: ChainSlugs
  coin: TokenTickerSymbol
}
const chainDefaults: ChainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "stellar",
  coin: "XLM",
}

const appConfig: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfig
