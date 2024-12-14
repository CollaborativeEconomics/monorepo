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
    dark: "/newui/logo.png",
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
  stellar: {
    slug: "stellar",
    network: "mainnet",
    contracts: {},
    enabledWallets: ["freighter"],
    tokens: ["XLM", "USDC"],
  },
  xrpl: {
    slug: "xrpl",
    network: "mainnet",
    contracts: {},
    enabledWallets: ["xaman"],
    wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
    tokens: ["XRP"],
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
