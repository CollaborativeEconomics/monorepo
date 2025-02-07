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
  title: "Give Credit (Staging)",
  featuredInitiatives: ["30c0636f-b0f1-40d5-bb9c-a531dc4d69e2"],
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains = {
  ...appConfig.chains,
  stellar: {
    ...appConfig.chains.stellar,
    contracts: {
      ...appConfig.chains.stellar?.contracts,
      credits: "CAGENCA7RDSBTGL7OJUC3XHPMGE43AXAZ3RVFFH5E3P22COOG7TUPDPN",
    },
    network: "testnet" as Network,
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
