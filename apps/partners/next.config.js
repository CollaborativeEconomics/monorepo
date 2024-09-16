const path = require('node:path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose',
    outputFileTracingRoot: path.join(process.cwd(), '../../'),
    optimizePackageImports: [
      '@cfce/universe-components',
      '@cfce/utils',
      '@cfce/universe-pages',
    ],
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
};

module.exports = nextConfig;
