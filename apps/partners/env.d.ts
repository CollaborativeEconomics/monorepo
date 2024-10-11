declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IPFS_GATEWAY_URL
      IPFS_API_ENDPOINT: string
      IPFS_API_PINNING: string
      IPFS_API_KEY: string
      IPFS_API_SECRET: string
      IPFS_DEFAULT_REGION: string
      IPFS_DEFAULT_BUCKET: string
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string // this is the line you want
      NODE_ENV: "development" | "production"
      PORT?: string
      PWD: string
    }
  }
}
