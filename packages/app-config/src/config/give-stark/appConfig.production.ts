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
  starknet: { ...appConfig.chains.starknet, network: "testnet" },
  xdc: { ...appConfig.chains.xdc, network: "testnet" },
} satisfies AppConfig["chains"]

// Override auth
appConfig.auth = ["argent" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "argent",
  chain: "starknet",
  coin: "ETH",
}

export default appConfig
