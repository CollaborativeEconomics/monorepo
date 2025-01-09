import type {
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
    apiUrl: "http://localhost:3000/api",
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
}

const auth = appConfig.auth as AuthTypes[]

const networkConfig = appConfig.networkConfig

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains: appConfig.chains,
  chainDefaults,
  siteInfo,
  networkConfig,
}

export default appConfigStaging
