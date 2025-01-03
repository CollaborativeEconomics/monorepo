import type { AppConfig, AuthTypes } from "@cfce/types"
import appConfig from "./appConfig.staging"

const siteInfo: AppConfig["siteInfo"] = {
  ...appConfig.siteInfo,
  title: "Giving Universe (Development)",
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
    slug: "arbitrum",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0x2c647e44003f403bb3e483ff810279efb136c304",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
  },
  avalanche: {
    slug: "avalanche",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xadc5b1b42f366215525bae1f0d81ad485c60c75e",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
  },
  base: {
    slug: "base",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xde0015317c273298503cf7fef681ed50d5c58048",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["ETH"],
  },
  binance: {
    slug: "binance",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xb7c157a81f6ddb0c65e9de5a4ff31f84b4af22a3",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["BNB"],
  },
  celo: {
    slug: "celo",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xf9f861b4fca89628d3b9b7f7b6cd4ba4073a3d93",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["CELO"],
  },
  flare: {
    slug: "flare",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xeea9557589cfff5dd3d849da94201fa8cb782c12",
    },
    wallet: "0x1ac546d21473062f3c3b16b6392a2ec26f4539f0",
    enabledWallets: ["metamask"],
    tokens: ["FLR"],
  },
  stellar: {
    slug: "stellar",
    network: "testnet",
    contracts: {},
    wallet: "GDDMYQEROCEBL75ZHJYLSEQMRTVT6BSXQHPEBITCXXQ5GGW65ETQAU5C",
    enabledWallets: ["freighter"],
    tokens: ["XLM", "USDC"],
  },
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
  xrpl: {
    slug: "xrpl",
    wallet: "r3qr25QnANd8RRT9NYtgUrrty3yTfpGx9c",
    network: "testnet",
    contracts: {
      receiptMintbotERC721: "0xNotNeeded",
    },
    enabledWallets: ["gemwallet", "xaman"],
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
