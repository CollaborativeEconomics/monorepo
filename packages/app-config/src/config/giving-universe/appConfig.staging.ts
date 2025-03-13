import type { AppConfig, AuthTypes, Network } from "@cfce/types"
import chainConfiguration from "../../chainConfig"
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
    ...chainConfiguration.arbitrum.networks.testnet,
    enabledWallets: ["metamask"],
  },
  avalanche: {
    ...chainConfiguration.avalanche.networks.testnet,
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
  },
  base: {
    ...chainConfiguration.base.networks.testnet,
    enabledWallets: ["metamask"],
  },
  binance: {
    ...chainConfiguration.binance.networks.testnet,
    enabledWallets: ["metamask"],
  },
  celo: {
    ...chainConfiguration.celo.networks.testnet,
    enabledWallets: ["metamask"],
  },
  flare: {
    ...chainConfiguration.flare.networks.testnet,
    enabledWallets: ["metamask"],
  },
  xdc: {
    ...chainConfiguration.xdc.networks.testnet,
    enabledWallets: ["metamask"],
  },
  stellar: {
    ...chainConfiguration.stellar.networks.testnet,
    enabledWallets: ["freighter"],
  },
  xrpl: {
    ...chainConfiguration.xrpl.networks.testnet,
    enabledWallets: ["xaman", "gemwallet"],
    destinationTag: "77777777",
  },
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
