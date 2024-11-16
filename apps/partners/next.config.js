const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(process.cwd(), '../../'),
  experimental: {
    //esmExternals: 'loose',
    optimizePackageImports: [
      '@cfce/universe-components',
      '@cfce/blockchain-tools',
      '@cfce/utils',
      '@cfce/universe-pages',
      '@cfce/universe-api',
    ],
    serverSourceMaps: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'give.staging.cfce.io',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'v8tqm1jlovjfn4gd.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ context, request }, callback) => {
        if (/^node:/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      });
    }
    return config;
  },
  env: {
    IPFS_API_KEY: process.env.IPFS_API_KEY,
    IPFS_API_SECRET: process.env.IPFS_API_SECRET,
  },
};

module.exports = nextConfig;
