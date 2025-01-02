const path = require("node:path")

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "givecredit.cfce.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ipfs.filebase.io",
        port: "",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "v8tqm1jlovjfn4gd.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
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

module.exports = nextConfig
