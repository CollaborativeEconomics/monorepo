import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfiguration from "~/chainConfig"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Credit (Staging)",
  featuredInitiatives: ["30c0636f-b0f1-40d5-bb9c-a531dc4d69e2"],
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains: AppConfig["chains"] = {
  stellar: {
    ...chainConfiguration.stellar.networks.testnet,
    contracts: {
      ...chainConfiguration.stellar.networks.testnet.contracts,
      Credits: "CAGENCA7RDSBTGL7OJUC3XHPMGE43AXAZ3RVFFH5E3P22COOG7TUPDPN",
    },
    network: "testnet",
    enabledWallets: ["freighter"],
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
