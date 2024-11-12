import type { AppConfig, ClientInterfaces } from "@cfce/types"

const siteInfo: AppConfig["siteInfo"] = {
  title: "Name",
  description: "Description",
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
      nfts: "kuyawa-public", // TODO: revert back to cfce-give-nfts
      avatars: "kuyawa-avatars", // cfce-profiles
      media: "kuyawa-media", // cfce-media
    },
  },
}

const chains: AppConfig["chains"] = {}

const auth: AppConfig["auth"] = []

const chainDefaults: AppConfig["chainDefaults"] = {
  network: "testnet",
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
