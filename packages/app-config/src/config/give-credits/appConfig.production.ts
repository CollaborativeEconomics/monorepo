import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Give Credit",
  description: "Make tax-deductible donations of carbon credits",
  options: {
    ...appConfig.siteInfo.options,
    showCarbonCreditDisplay: true,
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
    wallets: [],
    tokens: [],
  },
  stellar: {
    slug: "stellar",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721:
        "CDCTS77MPY6GXTGMFFIOWINMPBX4G7DELFEV34KTX5N2DZH43TGHMNU3",
    },
    wallets: ["freighter"],
    tokens: ["XLM", "USDC"],
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
