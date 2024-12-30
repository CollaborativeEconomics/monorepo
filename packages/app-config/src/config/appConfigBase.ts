import type { AppConfig, ClientInterfaces } from "@cfce/types"

const siteInfo: AppConfig["siteInfo"] = {
  title: "Give Stark",
  description: "Give Stark is a platform for donation on StarkNet.",
  options: {
    showCarbonCreditDisplay: false,
  },
}

const apis: AppConfig["apis"] = {
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

const chains: AppConfig["chains"] = {}

const auth: AppConfig["auth"] = []

const chainDefaults: AppConfig["chainDefaults"] = {
  network: "mainnet",
  wallet: "metamask",
  chain: "xdc",
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
