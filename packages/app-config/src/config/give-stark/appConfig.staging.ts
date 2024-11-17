import type { AppConfig, AuthTypes } from "@cfce/types"
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
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
  },
  starknet: {
    slug: "starknet",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0x2e5b08fc000756e043f8701f73886f9f76497f996f9a94b657b6d2b59c57dad",
    },
    enabledWallets: ["argent"],
    tokens: ["STRK"],
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet",
}

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigStaging
