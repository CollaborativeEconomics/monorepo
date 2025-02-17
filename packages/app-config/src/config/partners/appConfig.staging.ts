import type { AppConfig } from "@cfce/types"
import chainConfig from "../../chainConfig"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (Staging)",
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
  ipfs: {
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    gateway: "https://ipfs.filebase.io/ipfs/",
    pinning: "https://api.filebase.io/v1/ipfs",
    buckets: {
      nfts: "kuyawa-public",
      avatars: "kuyawa-avatars",
      media: "kuyawa-media",
    },
  },
}

const chains: AppConfig["chains"] = {
  arbitrum: {
    ...chainConfig.arbitrum.networks.testnet,
    enabledWallets: ["metamask"],
  },
  stellar: {
    ...chainConfig.stellar.networks.testnet,
    contracts: {
      ...chainConfig.stellar.networks.testnet.contracts,
      CreditsFactory:
        "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
      ReceiptFactory:
        "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
    },
    enabledWallets: ["freighter"],
  },
  xdc: {
    ...chainConfig.xdc.networks.testnet,
    enabledWallets: ["freighter"],
  },
  xrpl: {
    ...chainConfig.xrpl.networks.testnet,
    enabledWallets: ["gemwallet", "xaman"],
  },
}

export default {
  ...appConfig,
  apis,
  siteInfo,
  chains,
}
