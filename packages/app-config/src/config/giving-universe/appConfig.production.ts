import type {
  AppChainConfig,
  ChainSlugs,
  ClientInterfaces,
  Network,
  TokenTickerSymbol,
} from "@cfce/types"
import type { AppConfig, AuthTypes } from "@cfce/types"

const siteInfo = {
  title: "Giving Universe",
  description: "Make tax-deductible donations with crypto",
  logo: {
    light: "/newui/logo.svg",
    dark: "/newui/logoWhite.svg",
  },
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

const chains: AppChainConfig[] = [
  {
    slug: "xinfin",
    name: "XinFin",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallets: ["metamask"],
    tokens: ["XDC"],
  },
  {
    slug: "stellar",
    name: "Stellar",
    network: "mainnet",
    contracts: {},
    wallets: ["freighter"],
    tokens: ["XLM", "USDC"],
  },
  {
    slug: "xrpl",
    name: "XRP Ledger",
    network: "mainnet",
    contracts: {},
    wallets: ["xaman"],
    tokens: ["XRP"],
  },
]

const auth = ["freighter"] as AuthTypes[]

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
