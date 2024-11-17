import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
} from "@cfce/types"
import appConfig from "./appConfig.staging"


const siteInfo = {
  ...appConfig.siteInfo,
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
}

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains: appConfig.chains,
  chainDefaults,
  siteInfo,
}

export default appConfigStaging
