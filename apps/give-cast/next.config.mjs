import { fileURLToPath } from "node:url"
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin"
import createJiti from "jiti"
const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build. Using jiti we can import .ts files :)
jiti("./src/env")

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // instrumentationHook: true,
    // The below packages have barrel files that cause server/client mismatch errors
    optimizePackageImports: [
      "@cfce/components",
      "@cfce/blockchain-tools",
      "@cfce/utils",
      "@cfce/pages",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    if (!isServer) {
      config.externals = config.externals || []
      config.externals.push(({ context, request }, callback) => {
        if (/^node:/.test(request)) {
          return callback(null, `commonjs ${request}`)
        }
        callback()
      })
    }
    return config
  },
}

export default nextConfig
