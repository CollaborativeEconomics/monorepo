import { z } from "zod"

// Shared environment variable schemas
export const sharedEnvSchema = {
  cfce: {
    OFFICIAL_CFCE_API_KEY: z.string(),
    CFCE_REGISTRY_API_URL: z.string().url(),
    CFCE_REGISTRY_API_KEY: z.string(),
  },
  storage: {
    IPFS_API_KEY: z.string(),
    IPFS_API_SECRET: z.string(),
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
  },
  mail: {
    MAILGUN_API_KEY: z.string(),
  },
  blockchain: {
    XDC_WALLET_SECRET: z.string(),
  },
  auth: {
    AUTH_URL: z.string().url(),
    AUTH_SECRET: z.string(),
  },
  database: {
    POSTGRES_PRISMA_URL: z.string().url(),
  },
  api: {
    MOBULA_API_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_ID: z.string(),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]),
  },
}

// Helper type for environment configurations
export type EnvConfig = {
  server: Record<string, z.ZodType>
  client?: Record<string, z.ZodType>
}

// Helper function to create process.env mappings for a schema section
const createEnvMapping = <T extends Record<string, z.ZodType>>(
  schema: T,
): Record<keyof T, string | undefined> => {
  const entries = Object.keys(schema).map((key) => [key, process.env[key]])
  return Object.fromEntries(entries) as Record<keyof T, string | undefined>
}

// Export runtime mappings for each schema section
export const runtimeEnv = {
  cfce: createEnvMapping(sharedEnvSchema.cfce),
  storage: createEnvMapping(sharedEnvSchema.storage),
  mail: createEnvMapping(sharedEnvSchema.mail),
  blockchain: createEnvMapping(sharedEnvSchema.blockchain),
  auth: createEnvMapping(sharedEnvSchema.auth),
  database: createEnvMapping(sharedEnvSchema.database),
  api: createEnvMapping(sharedEnvSchema.api),
  client: createEnvMapping(sharedEnvSchema.client),
}

// Helper to spread all runtime env mappings
export const createFullRuntimeEnv = (
  additionalEnv: Record<string, string | undefined> = {},
) => ({
  ...runtimeEnv.cfce,
  ...runtimeEnv.storage,
  ...runtimeEnv.mail,
  ...runtimeEnv.blockchain,
  ...runtimeEnv.auth,
  ...runtimeEnv.database,
  ...runtimeEnv.api,
  ...runtimeEnv.client,
  ...additionalEnv,
})
