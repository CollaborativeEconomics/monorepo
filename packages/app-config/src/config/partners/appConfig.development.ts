import type {
  AppChainConfig,
  AppConfig,
  AuthTypes,
  ChainSlugs,
} from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (DEV)",
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
  arbitrum: {
    slug: "arbitrum",
    network: "testnet",
    contracts: {
      factory: "0x0???",
      credits: "0x0???",
      receiptMintbotERC721: "0x2c647e44003f403bb3e483ff810279efb136c304",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
  },
  stellar: {
    slug: "stellar",
    network: "testnet",
    contracts: {
      factory: "CDQLMKKGLL3RR2ZQJJW6LO4JUFCRJRT337CAXHAYHN2DSH4RPKEV576N",
      credits: "CDHYT3A4XGBNSWP2P7XQTS2AT5XICKD5KOAZ7S2Y2APJMXRDIENP2LZR",
      receiptMintbotERC721: "CA7PQJ3N4GZL3GBAZNSDDQQGJ4ROW35FCX646JVVBU42K2DSMIFTA7QE",
    },
    wallet: "GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C",
    enabledWallets: ["freighter"],
    tokens: ["XLM"],
  },
  xdc: appConfig.chains.xdc,
  xrpl: appConfig.chains.xrpl,
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
