const siteInfo = {
  title: "Give Credit",
  description: "Make tax-deductible donations of carbon credits",
}

const apis = {
  registry: {
    apiUrl: "https://registry.cfce.io/api",
  },
  ipfs: {
    endpoint: "https://s3.filebase.com/",
    region: "us-east-1",
    gateway: "https://ipfs.filebase.io/ipfs/",
    pinning: "https://api.filebase.io/v1/ipfs",
    buckets: {
      nfts: "kuyawa-test-ipfs",
      avatars: "kuyawa-avatars",
      media: "kuyawa-media",
    },
  },
}

const chains = {
  defaults: {
    network: "mainnet",
    wallet: "freighter",
    chain: "stellar",
    coin: "xlm",
  },
  xinfin: {
    network: "mainnet",
    contracts: {
      CCreceiptMintbotERC721: "0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab",
    },
    wallets: [],
    coins: [],
  },
  stellar: {
    network: "mainnet",
    contracts: {
      receiptMintbotERC721:
        "CDCTS77MPY6GXTGMFFIOWINMPBX4G7DELFEV34KTX5N2DZH43TGHMNU3",
    },
    wallets: ["freighter"],
    coins: ["xlm", "usdc"],
  },
}

const config = {
  siteInfo,
  apis,
  chains,
}

export default config
