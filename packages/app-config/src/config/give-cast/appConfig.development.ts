import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Development)",
}

const apis: AppConfig["apis"] = {
  ...appConfig.apis,
}

const chains = appConfig.chains

const chainDefaults: AppConfig["chainDefaults"] = appConfig.chainDefaults

const auth = appConfig.auth as AuthTypes[]

const appConfigDevelopment: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigDevelopment
