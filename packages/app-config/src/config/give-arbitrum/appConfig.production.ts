import type { AppConfig } from "@cfce/types"
import chainConfig from "~/chainConfig"
import appConfigBase from "~/config/appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Arbitrum",
  description: "Make tax-deductible donations with crypto",
  logo: {
    light: "/newui/logo.svg",
    dark: "/newui/logo-white.svg",
  },
  options: {
    ...appConfig.siteInfo.options,
    enableFetchBalance: true,
  },
}

// Override chains
appConfig.chains = {
  arbitrum: {
    ...chainConfig.arbitrum.networks.mainnet,
    enabledWallets: ["metamask"],
  },
}

// Override auth
appConfig.auth = ["metamask"]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "metamask",
  chain: "arbitrum",
  coin: "ETH",
}

export default appConfig
