import type { AppConfig, AuthTypes } from "@cfce/types"
import chainConfiguration from "../../chainConfig"
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
  options: {
    ...appConfig.siteInfo.options,
    enableFetchBalance: true,
    enableGaslessTransactions: true,
  },
}

// Override chains
appConfig.chains = {
  starknet: {
    ...chainConfiguration.starknet.networks.mainnet,
    contracts: {
      ...chainConfiguration.starknet.networks.mainnet.contracts,
      Credits:
        "0x1a35e6a801710eddfa9071eb27e4fc702c81b1b609efb34d46d419035275a38",
    },
    enabledWallets: ["argent"],
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
