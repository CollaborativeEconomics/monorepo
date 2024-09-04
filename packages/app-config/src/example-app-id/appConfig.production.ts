import type { AppConfig } from "../appConfigTypes"

const appConfig = {} as AppConfig

appConfig.siteInfo = {
  title: "App Name",
  description: "Tagline or something",
}

appConfig.apis = {
  registry: {
    apiUrl: "",
  },
  ipfs: {
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    gateway: "https://ipfs.filebase.io/ipfs/",
    pinning: "https://api.filebase.io/v1/ipfs",
    buckets: {
      nfts: "",
      avatars: "",
      media: "",
    },
  },
}

appConfig.chains = [
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
]

appConfig.auth = ["freighter"]

appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "stellar",
  coin: "XLM",
}

export default appConfig
