import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Stark",
  description: "Make tax-deductible donations on Starknet",
  // logo: {
  //   light: "/newui/logo.svg",
  //   dark: "/newui/logoWhite.svg",
  // },
}

// Override chains
appConfig.chains = {
  starknet: {
    slug: "starknet",
    network: "mainnet",
    contracts: {},
    enabledWallets: ["argent"],
    tokens: ["ETH", "STRK"],
  },
  xinfin: {
    slug: "xinfin",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    enabledWallets: [],
    tokens: [],
  },
} satisfies AppConfig["chains"]

// Override auth
appConfig.auth = ["freighter" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "xaman",
  chain: "xrpl",
  coin: "XRP",
}

export default appConfig
