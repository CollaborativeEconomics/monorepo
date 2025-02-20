import { join } from "node:path"
import { fileURLToPath } from "node:url"
import createJiti from "jiti"

const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build
jiti("./src/env")

function webpack(config, { isServer }) {
  if (!isServer) {
    config.externals = config.externals || []
    config.devtool = "source-map"
    // the below resolves default exports
    config.externals.push(({ context, request }, callback) => {
      if (/^node:/.test(request)) {
        return callback(null, `commonjs ${request}`)
      }
      callback()
    })
  }
  return config
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  outputFileTracingRoot: join(process.cwd(), "../../"),
  experimental: {
    serverSourceMaps: true,
    // The below packages have barrel files that cause server/client mismatch errors
    optimizePackageImports: [
      "@cfce/components",
      "@cfce/blockchain-tools",
      "@cfce/utils",
      "@cfce/pages",
      "@cfce/api",
    ],
  },
  webpack,
}

export default nextConfig
