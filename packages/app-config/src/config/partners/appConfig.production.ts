import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfigBase from "../appConfigBase"

const appConfig: AppConfig = {
  ...appConfigBase,
}

appConfig.siteInfo = {
  ...appConfig.siteInfo,
  title: "Partner's Portal",
  description: "Manage your organizations blockchain donations",
}

appConfig.apis = {
  ...appConfig.apis,
  ipfs: {
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    gateway: "https://ipfs.filebase.io/ipfs/",
    pinning: "https://api.filebase.io/v1/ipfs",
    buckets: {
      nfts: "cfce-give-nfts",
      avatars: "cfce-profiles",
      media: "cfce-media",
    },
  },
}

appConfig.chains = {
  xdc: {
    slug: "xdc",
    network: "mainnet",
    contracts: {
      receiptMintbotERC721: "0xD218A3C26DeEFa93eb74a785463B6bbF48A5a1b4",
      storyERC1155: "0x013da344B34447360aE4A01E86a4a4c2aAd3CEbb",
      volunteersFactory: "0x0eD50ddEE2c561016A9aaB9DaFC891DB3Afe554d",
    },
    wallet: "0x1540026E002b09bc1720D130d90CB674b06121e2",
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
