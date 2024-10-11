import type { AppConfig } from "@cfce/types"
// base/default
import base from "./config/appConfigBase"
// give-credits
import giveCreditsDev from "./config/give-credits/appConfig.development"
import giveCreditsProd from "./config/give-credits/appConfig.production"
import giveCreditsStaging from "./config/give-credits/appConfig.staging"
// Give tron
import giveTronDev from "./config/give-tron/appConfig.development"
import giveTronProd from "./config/give-tron/appConfig.production"
import giveTronStaging from "./config/give-tron/appConfig.staging"
// Giving universe
import givingUniverseDev from "./config/giving-universe/appConfig.development"
import givingUniverseProd from "./config/giving-universe/appConfig.production"
import givingUniverseStaging from "./config/giving-universe/appConfig.staging"
// partners
import partnersDev from "./config/partners/appConfig.development"
import partnersProd from "./config/partners/appConfig.production"
import partnersStaging from "./config/partners/appConfig.staging"

type Environment = "development" | "production" | "staging"
type AppId =
  | "give-credits"
  | "giving-universe"
  | "give-tron"
  | "partners"
  | "registry"

const appConfigs: Record<AppId, Record<Environment, AppConfig>> = {
  "give-tron": {
    development: giveTronDev,
    production: giveTronProd,
    staging: giveTronStaging,
  },
  "give-credits": {
    development: giveCreditsDev,
    production: giveCreditsProd,
    staging: giveCreditsStaging,
  },
  "giving-universe": {
    development: givingUniverseDev,
    production: givingUniverseProd,
    staging: givingUniverseStaging,
  },
  partners: {
    development: partnersDev,
    production: partnersProd,
    staging: partnersStaging,
  },
  registry: {
    // TODO: add registry app config
    development: giveCreditsDev,
    production: giveCreditsProd,
    staging: giveCreditsStaging,
  },
}

const appId = process.env.NEXT_PUBLIC_APP_ID as AppId | undefined
const env = process.env.NEXT_PUBLIC_APP_ENV as Environment | undefined

const getAppConfig = (): AppConfig => {
  if (!appId) {
    console.warn("NEXT_PUBLIC_APP_ID not defined")
    return base
  }

  if (!appConfigs[appId]) {
    console.warn(`App config not found for appId ${appId}`)
    return base
  }

  if (!env) {
    console.warn("NEXT_PUBLIC_APP_ENV not defined")
    return base
  }

  const envConfig = appConfigs[appId][env]
  if (!envConfig) {
    console.warn(`App config not found for appId ${appId} and env ${env}`)
    return base
  }

  return envConfig
}

const appConfig = getAppConfig()

export default appConfig
