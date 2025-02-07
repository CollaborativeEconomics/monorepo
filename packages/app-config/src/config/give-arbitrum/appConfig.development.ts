import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Arbitrum (Development)",
  options: {
    ...appConfig.siteInfo.options,
    enableFetchBalance: true,
  },
}

const apis: AppConfig["apis"] = {
  ...appConfig.apis,
}

const chains: AppConfig["chains"] = {
  arbitrum: {
    slug: "arbitrum",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xb430c12668789F97F03695cEc53240451105C12C",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
  },
}

const chainDefaults: AppConfig["chainDefaults"] = {
  ...appConfig.chainDefaults,
}

const auth = appConfig.auth as AuthTypes[]

const appConfigDevelopment: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigDevelopment
