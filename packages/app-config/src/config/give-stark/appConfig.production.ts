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
  logo: {
    light: "/newui/logo.png",
    dark: "/newui/logo.svg",
  },
}

// Override chains
appConfig.chains = {
  starknet: {
    slug: "starknet",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721:"",
      credits: "0x1a35e6a801710eddfa9071eb27e4fc702c81b1b609efb34d46d419035275a38"
    },
    enabledWallets: ["argent"],
    tokens: ["ETH", "STRK"],
  },
  xdc: {
    slug: "xdc",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab"
    },
    enabledWallets: [],
    tokens: [],
  },
} satisfies AppConfig["chains"]

// Override auth
appConfig.auth = ["argent" as AuthTypes]
appConfig.auth = ["argent" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "argent",
  chain: "starknet",
  coin: "STRK",
}

export default appConfig
