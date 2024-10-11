import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
} from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Credit (Staging)",
  description: "Make tax-deductible donations of carbon credits (Staging)",
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
