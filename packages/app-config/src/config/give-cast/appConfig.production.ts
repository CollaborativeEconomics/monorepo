import type { AppConfig } from "@cfce/types"
import chainConfiguration from "../../chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  logo: {
    light: "/GiveCast.svg",
    dark: "/GiveCastWhite.svg",
  },
  title: "Give Cast",
  description:
    "Make tax-deductible donations with crypto in a farcaster frame.",
}

// Override chains
appConfig.chains = {
  base: {
    ...chainConfiguration.base.networks.mainnet,
    enabledWallets: ["metamask"],
  },
  arbitrum: {
    ...chainConfiguration.arbitrum.networks.mainnet,
    enabledWallets: ["metamask"],
  },
}

// Override auth
appConfig.auth = ["freighter", "metamask", "xaman"]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "metamask",
  chain: "arbitrum",
  coin: "ETH",
}

export default appConfig
