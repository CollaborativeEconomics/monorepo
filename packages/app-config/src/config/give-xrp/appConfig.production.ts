import type { AppConfig, AuthTypes } from "@cfce/types"
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
  xdc: {
    slug: "xdc",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
  },
  xrpl: {
    slug: "xrpl",
    network: "mainnet",
    contracts: {},
    enabledWallets: ["gemwallet", "xaman"],
    wallet: "r3qr25QnANd8RRT9NYtgUrrty3yTfpGx9c",
    tokens: ["XRP"],
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
