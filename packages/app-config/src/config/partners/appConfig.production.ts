import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Partner's Portal",
  description: "Manage your organizations blockchain donations",
}

// Override chains (empty in this case)
appConfig.chains = []

// Override auth
appConfig.auth = ["google" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "xinfin",
  coin: "XDC",
}

export default appConfig
