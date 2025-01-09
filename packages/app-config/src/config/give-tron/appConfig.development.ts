import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
  Network,
} from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Development)",
  description: "Make tax-deductible donations with crypto",
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
      network: "testnet",
    }
    return obj
  },
  {} as Record<ChainSlugs, AppChainConfig>,
)

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet" as Network,
}

const networkConfig = appConfig.networkConfig

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
  networkConfig,
}

export default appConfigStaging
