import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give XRP (Staging)",
  description: "Make tax-deductible donations with XRP",
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
    tokens: [],
  },
  xrpl: {
    slug: "xrpl",
    wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
    network: "testnet",
    contracts: {},
    enabledWallets: ["xaman", "gemwallet"],
    tokens: ["XRP"],
    destinationTag: "77777777",
  },
}

const chainDefaults = {
  ...appConfig.chainDefaults,
  network: "testnet" as Network,
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
