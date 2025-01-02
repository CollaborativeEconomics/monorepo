import type { AppConfig, AuthTypes } from "@cfce/types"
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
    slug: "xdc",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
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
