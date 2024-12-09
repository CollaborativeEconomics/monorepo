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
}

const chainDefaults: AppConfig["chainDefaults"] = {
  network: "testnet",
  wallet: "metamask",
  chain: "xdc",
  coin: "XDC",
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

