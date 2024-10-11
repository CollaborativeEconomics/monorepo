import type { AppConfig, AuthTypes } from "@cfce/types"
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
  xinfin: {
    slug: "xinfin",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallets: ["metamask"],
    tokens: ["XDC"],
  },
  stellar: {
    slug: "stellar",
    network: "mainnet",
    contracts: {},
    wallets: ["freighter"],
    tokens: ["XLM", "USDC"],
  },
  xrpl: {
    slug: "xrpl",
    network: "mainnet",
    contracts: {},
    wallets: ["xaman"],
    tokens: ["XRP"],
  },
}

// Override auth
appConfig.auth = ["freighter" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "freighter",
  chain: "stellar",
  coin: "XLM",
}

export default appConfig
