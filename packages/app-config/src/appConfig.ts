import type { AppConfig } from "@cfce/types"
// base/default
import base from "./config/appConfigBase"
// give-credits
import giveCreditsDev from "./config/give-credits/appConfig.development"
import giveCreditsProd from "./config/give-credits/appConfig.production"
import giveCreditsStaging from "./config/give-credits/appConfig.staging"
// give-stark
import giveStarkDev from "./config/give-stark/appConfig.development"
import giveStarkProd from "./config/give-stark/appConfig.production"
import giveStarkStaging from "./config/give-stark/appConfig.staging"
// Give tron
import giveTronDev from "./config/give-tron/appConfig.development"
import giveTronProd from "./config/give-tron/appConfig.production"
import giveTronStaging from "./config/give-tron/appConfig.staging"
// Giving universe
import givingUniverseDev from "./config/giving-universe/appConfig.development"
import givingUniverseProd from "./config/giving-universe/appConfig.production"
import givingUniverseStaging from "./config/giving-universe/appConfig.staging"

// Give Arbitrum
import giveArbitrumDev from "./config/give-arbitrum/appConfig.development"
import giveArbitrumProd from "./config/give-arbitrum/appConfig.production"
import giveArbitrumStaging from "./config/give-arbitrum/appConfig.staging"

// Give XRP
import giveXrpDev from "./config/give-xrp/appConfig.development"
import giveXrpProd from "./config/give-xrp/appConfig.production"
import giveXrpStaging from "./config/give-xrp/appConfig.staging"

// partners
import partnersDev from "./config/partners/appConfig.development"
import partnersProd from "./config/partners/appConfig.production"
import partnersStaging from "./config/partners/appConfig.staging"

import testsStaging from "./config/partners/appConfig.staging"
// tests
import testsDev from "./config/tests/appConfig.development"
import testsProd from "./config/tests/appConfig.production"

type Environment = "development" | "production" | "staging"
type AppId =
  | "give-credits"
  | "give-stark"
  | "give-tron"
  | "giving-universe"
  | "give-arbitrum"
  | "give-xrp"
  | "partners"
  | "registry"
  | "tests"

const appConfigs: Record<AppId, Record<Environment, AppConfig>> = {
  "give-credits": {
    development: giveCreditsDev,
    production: giveCreditsProd,
    staging: giveCreditsStaging,
  },
  "give-stark": {
    development: giveStarkDev,
    production: giveStarkProd,
    staging: giveStarkStaging,
  },
  "give-tron": {
    development: giveTronDev,
    production: giveTronProd,
    staging: giveTronStaging,
  },
  "giving-universe": {
    development: givingUniverseDev,
    production: givingUniverseProd,
    staging: givingUniverseStaging,
  },
  "give-arbitrum": {
    development: giveArbitrumDev,
    production: giveArbitrumProd,
    staging: giveArbitrumStaging,
  },
  "give-xrp": {
    development: giveXrpDev,
    production: giveXrpProd,
    staging: giveXrpStaging,
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
  tests: {
    development: testsDev,
    production: testsProd,
    staging: testsStaging,
  },
}

const appId = process.env.NEXT_PUBLIC_APP_ID as AppId
const env = process.env.NEXT_PUBLIC_APP_ENV as Environment

if (!appId) {
  console.warn("NEXT_PUBLIC_APP_ID not defined")
}

if (!appConfigs[appId]) {
  console.warn(`App config not found for appId ${appId}`)
}

if (!env) {
  console.warn("NEXT_PUBLIC_APP_ENV not defined")
}

const envConfig = appConfigs[appId][env]
if (!envConfig) {
  console.warn(`App config not found for appId ${appId} and env ${env}`)
}

export default envConfig
