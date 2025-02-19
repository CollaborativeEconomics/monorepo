import type { AppConfig, AuthTypes } from "@cfce/types"
import chainConfig from "../../chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Tests",
  description: "Tests",
  logo: {
    light: "/newui/logo.svg",
    dark: "/newui/logoWhite.svg",
  },
}

// Override chains
appConfig.chains = {
  xdc: {
    ...chainConfig.xdc.networks.mainnet,
    enabledWallets: ["metamask"],
  },
}

// Override auth
appConfig.auth = ["metamask" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "metamask",
  chain: "xdc",
  coin: "XDC",
}

export default appConfig
