import type { AppConfig, AuthTypes } from "@cfce/types"
import chainConfiguration from "../../chainConfig"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Tron",
  description: "Make tax-deductible donations with Tron",
  // logo: {
  //   light: "/newui/logo.svg",
  //   dark: "/newui/logoWhite.svg",
  // },
}

// Override chains
appConfig.chains = {
  tron: {
    ...chainConfiguration.tron.networks.mainnet,
    contracts: {
      ...chainConfiguration.tron.networks.mainnet.contracts,
      Receipt_NFT: "",
    },
    enabledWallets: ["freighter"],
  },
}

// Override auth
appConfig.auth = ["metamask" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "stellar",
  coin: "XLM",
}

export default appConfig
