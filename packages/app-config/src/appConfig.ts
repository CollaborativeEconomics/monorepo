import type { AppConfig } from "./appConfigTypes"
import giveCreditsDev from "./config/give-credits/appConfig.development"
import giveCreditsProd from "./config/give-credits/appConfig.production"
import giveCreditsStaging from "./config/give-credits/appConfig.staging"

type Environment = "development" | "production" | "staging"
type AppId = "give-credits" | "partners" | "registry"

const appConfigs: Record<AppId, Record<Environment, AppConfig>> = {
  "give-credits": {
    development: giveCreditsDev,
    production: giveCreditsProd,
    staging: giveCreditsStaging,
  },
  partners: {
    // TODO: add partners app config
    development: giveCreditsDev,
    production: giveCreditsProd,
    staging: giveCreditsStaging,
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

if (!appId || !appConfigs[appId]) {
  throw new Error(`App config not found for appId ${appId}`)
}

if (!env || !appConfigs[appId][env]) {
  throw new Error(`App config not found for appId ${appId} and env ${env}`)
}

const appConfig = appConfigs[appId][env]

export default appConfig
