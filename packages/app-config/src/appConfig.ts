import type { AppConfig } from "@cfce/types"
// give-credits
import giveCreditsDev from "./config/give-credits/appConfig.development"
import giveCreditsProd from "./config/give-credits/appConfig.production"
import giveCreditsStaging from "./config/give-credits/appConfig.staging"
// partners
import partnersDev from "./config/partners/appConfig.development"
import partnersProd from "./config/partners/appConfig.production"
import partnersStaging from "./config/partners/appConfig.staging"

type Environment = "development" | "production" | "staging"
type AppId = "give-credits" | "partners" | "registry"

const appConfigs: Record<AppId, Record<Environment, AppConfig>> = {
  "give-credits": {
    development: giveCreditsDev,
    production: giveCreditsProd,
    staging: giveCreditsStaging,
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

if (!appId) {
  throw new Error("NEXT_PUBLIC_APP_ID not defined")
}
if (!appConfigs[appId]) {
  throw new Error(`App config not found for appId ${appId}`)
}

if (!env) {
  throw new Error("NEXT_PUBLIC_APP_ENV not defined")
}
if (!appConfigs[appId][env]) {
  throw new Error(`App config not found for appId ${appId} and env ${env}`)
}

const appConfig = appConfigs[appId][env] as AppConfig

export default appConfig
