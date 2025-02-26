import { runtimeEnv, sharedEnvSchema } from "@cfce/app-config"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

// App-specific schema for all chain wallets
const appSchema = {
  ARBITRUM_WALLET_SECRET: z.string(),
  AVALANCHE_WALLET_SECRET: z.string(),
  BASE_WALLET_SECRET: z.string(),
  BINANCE_WALLET_SECRET: z.string(),
  CELO_WALLET_SECRET: z.string(),
  FLARE_WALLET_SECRET: z.string(),
  XDC_WALLET_SECRET: z.string(),
  STELLAR_WALLET_SECRET: z.string(),
  XRPL_WALLET_SECRET: z.string(),
} as const

// App-specific runtime env
const appRuntimeEnv = Object.fromEntries(
  Object.keys(appSchema).map((key) => [key, process.env[key]]),
) as Record<keyof typeof appSchema, string | undefined>

export const env = createEnv({
  server: {
    ...appSchema,
    ...sharedEnvSchema.cfce,
    ...sharedEnvSchema.storage,
    ...sharedEnvSchema.mail,
    ...sharedEnvSchema.auth,
    ...sharedEnvSchema.database,
    ...sharedEnvSchema.api,
  },
  client: sharedEnvSchema.client,
  runtimeEnv: {
    ...runtimeEnv.cfce,
    ...runtimeEnv.storage,
    ...runtimeEnv.mail,
    ...runtimeEnv.auth,
    ...runtimeEnv.database,
    ...runtimeEnv.api,
    ...runtimeEnv.client,
    ...appRuntimeEnv,
  },
})
