import type { AppConfig } from "@cfce/types"
import chainConfig from "../../chainConfig"
import appConfig from "./appConfig.production"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (Staging)",
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
  arbitrum: {
    ...chainConfig.arbitrum.networks.testnet,
    enabledWallets: ["metamask"],
  },
  xdc: {
    ...chainConfig.xdc.networks.testnet,
    enabledWallets: ["freighter"],
  },
  xrpl: {
    ...chainConfig.xrpl.networks.testnet,
    enabledWallets: ["gemwallet", "xaman"],
  },
  stellar: {
    slug: "stellar",
    network: "testnet",
    contracts: {
      CreditsFactory: "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
      Credits: "CDHYT3A4XGBNSWP2P7XQTS2AT5XICKD5KOAZ7S2Y2APJMXRDIENP2LZR",
      CreditsHash: "8c850c8ad832e8fcba395dc89009dad9b68c78902b275a5da565c55fe0091c7f",
      ReceiptFactory: "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
      Receipt_NFT: "CA7PQJ3N4GZL3GBAZNSDDQQGJ4ROW35FCX646JVVBU42K2DSMIFTA7QE",
      Receipt_NFTHash: "7accc502baa0b8c5356b79babefc1a1ff502b5ff2ca5b1230476497f475e474c",
      xlmNativeCoin: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
    },
    wallet: "GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C",
    enabledWallets: ["freighter"],
    //tokens: ["XLM"],
  },
}

export default {
  ...appConfig,
  apis,
  siteInfo,
  chains,
}
