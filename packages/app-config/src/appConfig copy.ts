// import appConfigDevelopment from "./appConfig.development"
// import appConfigProduction from "./appConfig.production"
// import appConfigStaging from "./appConfig.staging"
const appId = process.env.APP_ID
if (!appId) {
  throw new Error("APP_ID environment variable not set")
}

const appConfigDevelopment = require(`./${appId}/appConfig.development`).default
const appConfigProduction = require(`./${appId}/appConfig.production`).default
const appConfigStaging = require(`./${appId}/appConfig.staging`).default

if (!appConfigStaging || !appConfigDevelopment || !appConfigProduction) {
  throw new Error(`App config not found for appId ${appId}`)
}

let appConfig = appConfigStaging

if (process.env.APP_ENV === "development") {
  appConfig = appConfigDevelopment
}

if (process.env.APP_ENV === "production") {
  appConfig = appConfigProduction
}

export default appConfig
