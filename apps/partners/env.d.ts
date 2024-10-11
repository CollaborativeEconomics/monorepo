declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IPFS_API_KEY: string
      IPFS_API_SECRET: string
      NEXT_PUBLIC_IPFS_GATEWAY_URL: string
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string
      NODE_ENV: "development" | "production"
      PORT?: string
      PWD: string
    }
  }
}
