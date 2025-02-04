import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo = {
  ...appConfig.siteInfo,
  title: "Partners Portal (DEV)",
}

const apis = {
  ...appConfig.apis,
}

const chains: AppConfig["chains"] = {
  arbitrum: {
    slug: "arbitrum",
    network: "testnet",
    contracts: {
      creditsFactory: "0x0???",
      credits: "0x0???",
      receiptMintbotERC721: "0x2c647e44003f403bb3e483ff810279efb136c304",
      storyERC1155: "0xc917ff4128525a65639d18f1d240a788081f022d",
      volunteersFactory: "0xD4E47912a12f506843F522Ea58eA31Fd313eB2Ee",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
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
  xdc: appConfig.chains.xdc,
  xrpl: appConfig.chains.xrpl,
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
