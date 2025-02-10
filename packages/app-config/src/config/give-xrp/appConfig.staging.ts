import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfiguration from "~/chainConfig"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give XRP (Staging)",
  description: "Make tax-deductible donations with XRP",
}

const apis: AppConfig["apis"] = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains: AppConfig["chains"] = {
  xrpl: {
    ...chainConfiguration.xrpl.networks.testnet,
    enabledWallets: ["xaman", "gemwallet"],
    destinationTag: "77777777",
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
