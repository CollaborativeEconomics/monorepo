import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfiguration from "~/chainConfig"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Stark (Staging)",
  description: "Make tax-deductible donations on Starknet",
}

const apis: AppConfig["apis"] = {
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
  ipfs: {
    ...appConfig.apis.ipfs,
    buckets: {
      nfts: "kuyawa-public",
      avatars: "kuyawa-avatars",
      media: "kuyawa-media",
    },
  },
}

const chains: AppConfig["chains"] = {
  starknet: {
    ...chainConfiguration.starknet.networks.testnet,
    contracts: {
      ...chainConfiguration.starknet.networks.testnet.contracts,
      Credits: "",
    },
    wallet:
      "0x063783605f5f8a4c716ec82453815ac5a5d9bb06fe27c0df022495a137a5a74f",
    enabledWallets: ["argent"],
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet" as Network,
  defaultAddress:
    "0x023345e38d729e39128c0cF163e6916a343C18649f07FcC063014E63558B20f3",
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
