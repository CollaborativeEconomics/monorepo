import { createFullRuntimeEnv, sharedEnvSchema } from "@cfce/app-config"
import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    ...sharedEnvSchema.auth,
    ...sharedEnvSchema.database,
    ...sharedEnvSchema.api,
    ...sharedEnvSchema.cfce,
    ...sharedEnvSchema.storage,
    ...sharedEnvSchema.mail,
    ...sharedEnvSchema.blockchain,
    ...sharedEnvSchema.features,
    ARBITRUM_WALLET_SECRET: z.string(),
  },
  client: sharedEnvSchema.client,
  runtimeEnv: {
    ...createFullRuntimeEnv(),
    ARBITRUM_WALLET_SECRET: process.env.ARBITRUM_WALLET_SECRET,
  },
})
