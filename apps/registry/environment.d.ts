import "next";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;

      GITHUB_ID: string;
      GITHUB_SECRET: string;

      POSTGRES_URL: string;
      POSTGRES_URL_NON_POOLING: string;
      POSTGRES_PRISMA_URL: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_DATABASE: string;

      XINFIN_MINTER_SECRET: string;
      XINFIN_NFT721_CONTRACT: string;
      XINFIN_NFT1155_CONTRACT: string;
      XINFIN_NETWORK: string;
      XINFIN_MINTER_WALLET: string;

      IPFS_GATEWAY_URL: string;
      IPFS_API_ENDPOINT: string;
      IPFS_API_PINNING: string;
      IPFS_API_KEY: string;
      IPFS_API_SECRET: string;
      IPFS_DEFAULT_REGION: string;
      IPFS_DEFAULT_BUCKET: string;

      // @deprecated 
      MONGODB_URI: string;
    }
  }
}