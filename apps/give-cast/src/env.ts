import { createEnv } from "@t3-oss/env-nextjs"
import { isAddress } from "ethers"
import { z } from "zod"

export const env = createEnv({
  server: {
    PROVIDER_URL: z.string().url(),
    MINTER_CONTRACT: z.string().refine(isAddress),
    MINTER_ADDRESS: z.string().refine(isAddress),
    MINTER_PRIVATE: z.string(),
    TICKER_API_KEY: z.string(),
    OFFICIAL_CFCE_API_KEY: z.string(),
    CFCE_REGISTRY_API_URL: z.string(),
    CFCE_REGISTRY_API_KEY: z.string(),
    IPFS_API_KEY: z.string(),
    IPFS_API_SECRET: z.string(),
    CFCE_SECRET_KEY: z.string(),
    MAILGUN_API_KEY: z.string(),
  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  // },
  // For Next.js >= 13.4.4, you can just reference process.env:
  experimental__runtimeEnv: process.env,
})
