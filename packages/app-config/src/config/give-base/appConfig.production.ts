import type { AppConfig } from "@cfce/types"
import chainConfig from "../../chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Base",
  description: "Make tax-deductible donations with crypto",
  logo: {
    light: "/GiveBase.svg",
    dark: "/GiveBaseWhite.svg",
  },
  options: {
    ...appConfig.siteInfo.options,
    enableFetchBalance: true,
  },
}

// Override chains
appConfig.chains = {
  base: {
    ...chainConfig.base.networks.mainnet,
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
