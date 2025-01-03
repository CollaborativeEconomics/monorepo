const path = require("node:path")

const webpackConfig = (config, { isServer }) => {
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
}

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
    domains: ["your-domain.com"], // Replace with your actual domain
  },
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  experimental: {
    //instrumentationHook: true,
    //esmExternals: true,  //The "esmExternals" option has been modified. experimental.esmExternals is not recommended to be modified as it may disrupt module resolution. It should be removed from your next.config.js.
    optimizePackageImports: [
      "@cfce/components",
      "@cfce/blockchain-tools",
      "@cfce/utils",
      "@cfce/pages",
      "@cfce/api",
    ],
  },
  webpack: webpackConfig,
}

module.exports = nextConfig
