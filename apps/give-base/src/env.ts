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
    BASE_WALLET_SECRET: z.string(),
  },
  client: sharedEnvSchema.client,
  runtimeEnv: {
    ...createFullRuntimeEnv(),
    BASE_WALLET_SECRET: process.env.BASE_WALLET_SECRET,
  },
})
