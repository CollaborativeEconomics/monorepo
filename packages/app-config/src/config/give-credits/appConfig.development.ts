import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
  Network,
} from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Credit (Development)",
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains = Object.entries(appConfig.chains).reduce(
  (obj, [key, chain]) => {
    obj[key as ChainSlugs] = {
      ...chain,
      network: "testnet" as Network,
    }
    return obj
  },
  {} as Record<ChainSlugs, AppChainConfig>,
)
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
