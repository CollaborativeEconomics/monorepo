import type { AppConfig } from "../appConfigTypes"
import appConfig from "./appConfig.production"

const appConfigDevelopment: AppConfig = {
  ...appConfig,
  siteInfo: {
    ...appConfig.siteInfo,
    title: "App Name (Development)",
  },
}

export default appConfigDevelopment
