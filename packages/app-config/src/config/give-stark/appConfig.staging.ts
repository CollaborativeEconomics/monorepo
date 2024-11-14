// import type { AppConfig, AuthTypes } from "@cfce/types"
// import appConfig from "./appConfig.production"

// const siteInfo: AppConfig["siteInfo"] = {
//   ...appConfig.siteInfo,
//   title: "Giving Universe (Staging)",
//   description: "Make tax-deductible donations with crypto",
// }

// const apis: AppConfig["apis"] = {
//   ...appConfig.apis,
//   registry: {
//     apiUrl: "https://registry.staging.cfce.io/api",
//   },
// }

// const chains: AppConfig["chains"] = {


// const chainDefaults = {
//   ...appConfig.chainDefaults,
//   network: "testnet",
// }

// const auth = appConfig.auth as AuthTypes[]

// const appConfigStaging: AppConfig = {
//   apis,
//   auth,
//   chains,
//   chainDefaults,
//   siteInfo,
// }

// export default appConfigStaging

import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Staging)",
  description: "Make tax-deductible donations with crypto",
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
  stellar: {
    slug: "stellar",
    network: "testnet",
    contracts: {},
    wallet: "GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C",
    enabledWallets: ["freighter"],
    tokens: ["XLM", "USDC"],
  },
  xrpl: {
    slug: "xrpl",
    wallet: "rptMtpnyen12V45z6Fhtj797kkhG7u3Rnp",
    network: "testnet",
    contracts: {},
    enabledWallets: ["xaman"],
    tokens: ["XRP"],
    destinationTag: "77777777",
  },
  starknet: {
    slug: "starknet",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0x045d8da8227be85fec28cd4ba98b33bb1fba0408e1d78947a2d628c34e06ed4c",
    },
    enabledWallets: ["argent"],
    tokens: ["ETH", "STRK"],
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
