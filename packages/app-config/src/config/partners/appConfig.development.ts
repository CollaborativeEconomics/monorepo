import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (DEV)",
  description: "Make tax-deductible donations with crypto",
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
  ...appConfig.apis.ipfs,
  // ipfs: {
  //   endpoint: "https://s3.filebase.com/",
  //   region: "us-east-1",
  //   gateway: "https://ipfs.filebase.io/ipfs/",
  //   pinning: "https://api.filebase.io/v1/ipfs",
  //   buckets: {
  //     nfts: "kuyawa-public",
  //     avatars: "kuyawa-avatars",
  //     media: "kuyawa-media",
  //   },
  // },
}

const chains: AppConfig["chains"] = {
  arbitrum: appConfig.chains.arbitrum,
  stellar: appConfig.chains.stellar,
  xdc: appConfig.chains.xdc,
  xrpl: appConfig.chains.xrpl,
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
