import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfig from "../../chainConfig"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Base (Staging)",
  description: "Make tax-deductible donations with crypto",
  options: {
    ...appConfig.siteInfo.options,
    enableFetchBalance: true,
  },
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
    ...chainConfig.base.networks.testnet,
    enabledWallets: ["metamask"],
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet" as Network,
  defaultAddress: "0x2f033661Aca76816d9f729D1F5f190597E539C3f",
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
