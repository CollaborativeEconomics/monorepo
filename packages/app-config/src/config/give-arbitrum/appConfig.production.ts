import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

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
    slug: "arbitrum",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x0535D460955bAa8a373053FD7C225675A9D1fA16",
    },
    wallet: "0x1540026E002b09bc1720D130d90CB674b06121e2",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
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
