import type { AppConfig, AuthTypes } from "@cfce/types"
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

const chains = appConfig.chains.map((chain) => ({
  ...chain,
  network: "testnet",
}))

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
