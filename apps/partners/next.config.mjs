import path from "node:path"
import { fileURLToPath } from "node:url"
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin"
import createJiti from "jiti"
const jiti = createJiti(fileURLToPath(import.meta.url))

// Import env here to validate during build
jiti("./src/env")

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), "../../"),
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    optimizePackageImports: [
      "@cfce/components",
      "@cfce/blockchain-tools",
      "@cfce/utils",
      "@cfce/pages",
      "@cfce/api",
    ],
    serverSourceMaps: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cfce.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "partners.cfce.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
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
    config.externals.push("pino-pretty")
    return config
  },
}

export default nextConfig
