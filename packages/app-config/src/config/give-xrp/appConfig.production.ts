import type { AppConfig, AuthTypes } from "@cfce/types"
import chainConfiguration from "~/chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give XRP",
  description: "Make tax-deductible donations with XRP",
  logo: {
    light: "/newui/logo.svg",
    dark: "/newui/logoWhite.svg",
  },
}

// Override chains
appConfig.chains = {
  xrpl: {
    ...chainConfiguration.xrpl.networks.mainnet,
    enabledWallets: ["gemwallet", "xaman"],
    destinationTag: "77777777",
  },
}

// Override auth
appConfig.auth = ["xaman"]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "xaman",
  chain: "xrpl",
  coin: "XRP",
}

export default appConfig
