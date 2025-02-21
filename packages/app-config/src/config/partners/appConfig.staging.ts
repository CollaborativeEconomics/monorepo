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
  arbitrum: {
    slug: "arbitrum",
    network: "testnet",
    contracts: {
      volunteersFactory: "0xd96E5542C1fb269b959C36f6F331EbBd6C1EDB61",
    },
    wallet: "0x1AC546d21473062F3c3B16B6392A2EC26F4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH", "USDC"],
  },
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
  stellar: {
    slug: "stellar",
    network: "testnet",
    contracts: {
      creditsFactory:
        "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
      credits: "CDHYT3A4XGBNSWP2P7XQTS2AT5XICKD5KOAZ7S2Y2APJMXRDIENP2LZR",
      creditsHash:
        "8c850c8ad832e8fcba395dc89009dad9b68c78902b275a5da565c55fe0091c7f",
      receiptFactory:
        "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
      receiptMintbotERC721:
        "CA7PQJ3N4GZL3GBAZNSDDQQGJ4ROW35FCX646JVVBU42K2DSMIFTA7QE",
      receiptMintbotERC721Hash:
        "7accc502baa0b8c5356b79babefc1a1ff502b5ff2ca5b1230476497f475e474c",
      xlmNativeCoin: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    },
    wallet: "GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C",
    enabledWallets: ["freighter"],
    tokens: ["XLM"],
  },
}

export default {
  ...appConfig,
  apis,
  siteInfo,
  chains,
}
