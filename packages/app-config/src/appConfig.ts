import type { AppConfig } from "./appConfigTypes"
import appConfigProd from "./example-app-id/appConfig.production"

let appConfig = appConfigProd

export function setAppConfig(config: AppConfig) {
  appConfig = config
}

export default appConfig
