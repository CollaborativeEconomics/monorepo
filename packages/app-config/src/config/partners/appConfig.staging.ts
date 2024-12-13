import type { AppConfig } from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (Staging)",
  description: "Make tax-deductible donations with crypto",
}

const apis = {
  ...appConfig.apis,
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
}

const chains: AppConfig["chains"] = {
  ...appConfig.chains,
  xdc: {
    slug: "xdc",
    network: "testnet",
    contracts: {
      // receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
      storyERC1155:
        "0x5c4c3dcdbf2ac19c5e04a790becc603f89e188b67204b5cb25889ce3858acf9a",
    },
    wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
  },
}

export default {
  ...appConfig,
  apis,
  siteInfo,
  chains,
}
