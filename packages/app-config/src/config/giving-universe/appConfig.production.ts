import type { AppConfig } from "@cfce/types"
import chainConfiguration from "~/chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Giving Universe",
  description: "Make tax-deductible donations with crypto",
  logo: {
    light: "/newui/logo.svg",
    dark: "/newui/logoWhite.svg",
  },
}

// Override chains
appConfig.chains = {
  xdc: {
    ...chainConfiguration.xdc.networks.mainnet,
    enabledWallets: ["metamask"],
  },
  stellar: {
    ...chainConfiguration.stellar.networks.mainnet,
    enabledWallets: ["freighter"],
  },
  xrpl: {
    ...chainConfiguration.xrpl.networks.mainnet,
    enabledWallets: ["gemwallet", "xaman"],
    destinationTag: "77777777",
  },
}

// Override auth
appConfig.auth = ["freighter", "metamask", "xaman"]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "xaman",
  chain: "xrpl",
  coin: "XRP",
}

export default appConfig
