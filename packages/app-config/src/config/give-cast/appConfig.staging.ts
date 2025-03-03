import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfiguration from "../../chainConfig"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Cast (Staging)",
}

const apis: AppConfig["apis"] = {
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
  base: {
    ...chainConfiguration.base.networks.testnet,
    enabledWallets: ["metamask"],
  },
  arbitrum: {
    ...chainConfiguration.arbitrum.networks.testnet,
    enabledWallets: ["metamask"],
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet" as Network,
}

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigStaging
