import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
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

const chains: AppConfig['chains'] = {
  starknet: { ...appConfig.chains.starknet, network: 'testnet' } as AppChainConfig,
  xinfin: { ...appConfig.chains.xinfin, network: 'testnet' } as AppChainConfig,
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
