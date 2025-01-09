import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Stark (Staging)",
  description: "Make tax-deductible donations on Starknet",
}

const apis: AppConfig["apis"] = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains: AppConfig["chains"] = {
  xdc: {
    slug: "xdc",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
    enabledWallets: [],
    tokens: ["XDC"],
  },
  starknet: {
    slug: "starknet",
    network: "testnet",
    contracts: {
      receiptMintbotERC721:
        "0x55e3f6e2abe8443047ec5f70875791a2463c8137c07001c3f279d4f0e0cb62f",
    },
    wallet:
      "0x023345e38d729e39128c0cF163e6916a343C18649f07FcC063014E63558B20f3",
    enabledWallets: ["argent"],
    tokens: ["STRK"],
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet" as Network,
  defaultAddress:
    "0x023345e38d729e39128c0cF163e6916a343C18649f07FcC063014E63558B20f3",
}

const networkConfig = appConfig.networkConfig

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
  networkConfig,
}

export default appConfigStaging
