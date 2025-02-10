import type { AppConfig, AuthTypes } from "@cfce/types"
import chainConfiguration from "~/chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Partner's Portal",
  description: "Manage your organizations blockchain donations",
}

appConfig.apis = {
  ...appConfig.apis,
}

appConfig.chains = {
  xdc: {
    ...chainConfiguration.xdc.networks.mainnet,
    enabledWallets: ["metamask"],
  },
}

// Override auth
appConfig.auth = ["google" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "metamask",
  chain: "xdc",
  coin: "XDC",
}

export default appConfig
