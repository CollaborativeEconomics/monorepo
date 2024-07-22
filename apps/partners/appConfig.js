const siteInfo = {
  title: 'Partners Portal',
  description: 'Access and manage your non-profit organizations',
};

const apis = {
  registry: {
    apiUrl: 'https://registry.cfce.io/api',
  },
  ipfs: {
    endpoint: 'https://s3.filebase.com/',
    region: 'us-east-1',
    gateway: 'https://ipfs.filebase.io/ipfs/',
    pinning: 'https://api.filebase.io/v1/ipfs',
    buckets: {
      nfts: 'cfce-give-nfts',
      avatars: 'cfce-profiles',
      media: 'cfce-media',
    },
  },
};

const chains = {
  defaults: {
    network: 'mainnet',
    wallet: 'metamask',
    chain: 'xinfin',
    coin: 'xdc',
  },
  xinfin: {
    network: 'mainnet',
    contracts: {
      CCreceiptMintbotERC721: '0x4b3a0c6d668b43f3f07904e125cc234a00a1f9ab',
    },
    wallets: [],
    coins: [],
  },
};

const appConfig = {
  siteInfo,
  apis,
  chains,
};

export default appConfig;
