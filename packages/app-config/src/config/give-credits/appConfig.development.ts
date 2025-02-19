import type { AppConfig, AuthTypes } from "@cfce/types"
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

const chains = appConfig.chains

const chainDefaults = appConfig.chainDefaults

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigStaging
