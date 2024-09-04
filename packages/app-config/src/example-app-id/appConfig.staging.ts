import type { AppConfig } from "../appConfigTypes"
import appConfig from "./appConfig.production"

const appConfigStaging: AppConfig = {
  ...appConfig,
  siteInfo: {
    ...appConfig.siteInfo,
    title: "App Name (Staging)",
  },
}

export default appConfigStaging
