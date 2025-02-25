import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfiguration from "../../chainConfig"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Staging)",
  description: "Make tax-deductible donations with crypto",
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

// use testnet
const chains: AppConfig["chains"] = {
  tron: {
    ...chainConfiguration.tron.networks.testnet,
    contracts: {
      // ...chainConfiguration.tron.networks.testnet.contracts,
      ReceiptNFT: "",
    },
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
