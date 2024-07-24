import type { Interfaces } from "@cfce/blockchain-tools"
import type {
  ChainSlugs,
  Network,
  TokenTickerSymbol,
} from "@cfce/blockchain-tools/dist/chains/chainConfig"

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

type ContractType = "CCreceiptMintbotERC721" | "receiptMintbotERC721"
interface ChainConfig {
  network: string
  contracts: Partial<Record<ContractType, string>>
  wallets: Interfaces[]
  coins: TokenTickerSymbol[]
}
const chains: Partial<Record<ChainSlugs, ChainConfig>> = {
  xinfin: {
    network: "mainnet",
    contracts: {
      CCreceiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallets: [],
    coins: [],
  },
  stellar: {
    network: "mainnet",
    contracts: {
      receiptMintbotERC721:
        "CDCTS77MPY6GXTGMFFIOWINMPBX4G7DELFEV34KTX5N2DZH43TGHMNU3",
    },
    wallets: ["freighter"],
    coins: ["XLM", "USDC"],
  },
}

const auth = Object.keys(chains)

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
