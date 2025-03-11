import { runtimeEnv, sharedEnvSchema } from "@cfce/app-config"
import { createEnv } from "@t3-oss/env-nextjs"
import { isAddress } from "ethers"
import { z } from "zod"

// App-specific schema
const appSchema = {
  MINTER_CONTRACT: z.string().refine(isAddress),
  MINTER_PRIVATE: z.string(),
  TICKER_API_KEY: z.string(),
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
    ...sharedEnvSchema.api,
    ...sharedEnvSchema.blockchain,
  },
  client: sharedEnvSchema.client,
  runtimeEnv: {
    ...runtimeEnv.cfce,
    ...runtimeEnv.storage,
    ...runtimeEnv.mail,
    ...runtimeEnv.api,
    ...runtimeEnv.blockchain,
    ...runtimeEnv.client,
    ...appRuntimeEnv,
  },
})
