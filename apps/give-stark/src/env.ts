import { runtimeEnv, sharedEnvSchema } from "@cfce/app-config"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

// App-specific schema
const appSchema = {
  STARKNET_WALLET_SECRET: z.string(),
} as const

const clientSchema = {
  NEXT_PUBLIC_AVNU_PUBLIC_KEY: z.string(),
  NEXT_PUBLIC_AVNU_KEY: z.string(),
} as const

// App-specific runtime env
const appRuntimeEnv = Object.fromEntries(
  Object.keys(appSchema).map((key) => [key, process.env[key]]),
) as Record<keyof typeof appSchema, string | undefined>

const clientRuntimeEnv = Object.fromEntries(
  Object.keys(clientSchema).map((key) => [key, process.env[key]]),
) as Record<keyof typeof clientSchema, string | undefined>

export const env = createEnv({
  server: {
    ...appSchema,
    ...sharedEnvSchema.cfce,
    ...sharedEnvSchema.storage,
    ...sharedEnvSchema.mail,
    ...sharedEnvSchema.auth,
    ...sharedEnvSchema.database,
    ...sharedEnvSchema.api,
    ...sharedEnvSchema.blockchain,
  },
  client: {
    ...clientSchema,
    ...sharedEnvSchema.client,
  },
  runtimeEnv: {
    ...runtimeEnv.cfce,
    ...runtimeEnv.storage,
    ...runtimeEnv.mail,
    ...runtimeEnv.auth,
    ...runtimeEnv.database,
    ...runtimeEnv.api,
    ...runtimeEnv.client,
    ...runtimeEnv.blockchain,
    ...clientRuntimeEnv,
    ...appRuntimeEnv,
  },
})
