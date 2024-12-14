import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Give Arbitrum (Development)",
}

const apis: AppConfig["apis"] = {
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
  xdc: {
    slug: "xdc",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xfeceaea75565961b805e2dbe58e00488f5bc1495",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["XDC"],
  },
  arbitrum: {
    slug: "arbitrum",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0x55e3f6e2abe8443047ec5f70875791a2463c8137c07001c3f279d4f0e0cb62f",
    },
    wallet: "0x023345e38d729e39128c0cF163e6916a343C18649f07FcC063014E63558B20f3",
    enabledWallets: ["metamask"],
    tokens: ["ARB"],
  },
}

const chainDefaults: AppConfig["chainDefaults"] = {
  network: "testnet",
  wallet: "metamask",
  chain: "arbitrum",
  coin: "ARB",
  defaultAddress: "0x2f033661Aca76816d9f729D1F5f190597E539C3f",
}

const auth = appConfig.auth as AuthTypes[]

const appConfigDevelopment: AppConfig = {
  apis,
  auth,
  chains,
  chainDefaults,
  siteInfo,
}

export default appConfigDevelopment

