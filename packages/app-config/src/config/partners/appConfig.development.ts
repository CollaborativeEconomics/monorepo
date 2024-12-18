import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
} from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (DEV)",
  description: "Make tax-deductible donations with crypto",
}

const apis = {
  ...appConfig.apis,
}

const chains = {
  xdc: appConfig.chains.xdc,
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
