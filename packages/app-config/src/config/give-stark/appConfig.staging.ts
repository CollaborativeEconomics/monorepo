import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Staging)",
  description: "Make tax-deductible donations with crypto",
}

const apis: AppConfig["apis"] = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains: AppConfig["chains"] = {
  starknet: {
    slug: "starknet",
    network: "mainnet",
    contracts: {},
    enabledWallets: ["argent"],
    tokens: ["ETH", "STRK"],
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet",
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
