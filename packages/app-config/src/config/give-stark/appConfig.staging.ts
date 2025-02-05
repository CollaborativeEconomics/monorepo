import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import appConfig from "./appConfig.production"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Stark (Staging)",
  description: "Make tax-deductible donations on Starknet",
}

const apis: AppConfig["apis"] = {
  registry: {
    apiUrl: "https://registry.staging.cfce.io/api",
  },
  ipfs: {
    ...appConfig.apis.ipfs,
    buckets: {
      nfts: "kuyawa-public",
      avatars: "kuyawa-avatars",
      media: "kuyawa-media",
    },
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
        "0x3cfdb23c07a9a059090c871df3f2a242c6738e25351749be334f2b23d764368",
    },
    wallet:
      "0x063783605f5f8a4c716ec82453815ac5a5d9bb06fe27c0df022495a137a5a74f",
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

const auth = appConfig.auth as AuthTypes[]

const appConfigStaging: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigStaging
