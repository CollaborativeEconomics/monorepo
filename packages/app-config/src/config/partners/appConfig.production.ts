import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

// Override siteInfo
appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Partner's Portal",
  description: "Manage your organizations blockchain donations",
}

// Override chains (empty in this case)
appConfig.chains = {
  xdc: {
    slug: "xdc",
    network: "mainnet",
    contracts: {
      // receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
      // storyERC1155: "0x0000000000000000000000000000000000000000",
    },
    // wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
  },
}

// Override auth
appConfig.auth = ["google" as AuthTypes]

// Override chainDefaults
appConfig.chainDefaults = {
  network: "mainnet",
  wallet: "metamask",
  chain: "xdc",
  coin: "XDC",
}

export default appConfig
