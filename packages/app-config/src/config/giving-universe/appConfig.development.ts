import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Development)",
  description: "Make tax-deductible donations with crypto",
}

appConfig.apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

// Override chains
appConfig.chains = {
  xdc: {
    slug: "xdc",
    network: "testnet",
    contracts: {
      //receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
      receiptMintbotERC721: "0xfeceaea75565961b805e2dbe58e00488f5bc1495",
    },
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
  },
  stellar: appConfig.chains.stellar,
  xrpl: appConfig.chains.xrpl,
}

// Override auth
appConfig.auth = ["metamask" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "testnet",
  wallet: "metamask",
  chain: "xdc",
  coin: "XDC",
}

export default appConfig

