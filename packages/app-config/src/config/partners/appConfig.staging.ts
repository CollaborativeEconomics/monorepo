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
  ipfs: {
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    gateway: "https://ipfs.filebase.io/ipfs/",
    pinning: "https://api.filebase.io/v1/ipfs",
    buckets: {
      nfts: "kuyawa-public",
      avatars: "kuyawa-avatars",
      media: "kuyawa-media",
    },
  },
}

const chains: AppConfig["chains"] = {
  ...appConfig.chains,
  xdc: {
    slug: "xdc",
    network: "testnet",
    contracts: {
      // receiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
      storyERC1155: "0xc917ff4128525a65639d18f1d240a788081f022d",
    },
    wallet: "0x1AC546d21473062F3c3B16B6392A2EC26F4539f0",
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
