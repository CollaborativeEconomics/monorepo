const path = require('node:path');

const webpackConfig = (config, { isServer }) => {
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
};

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'givecredit.cfce.io',
        port: '',
        pathname: '/**',
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
    domains: ['your-domain.com'], // Replace with your actual domain
  },
  outputFileTracingRoot: path.join(process.cwd(), '../../'),
  experimental: {
    //instrumentationHook: false,
    //esmExternals: true,
    optimizePackageImports: [
      '@cfce/universe-components',
      '@cfce/blockchain-tools',
      '@cfce/utils',
      '@cfce/universe-pages',
      '@cfce/universe-api',
    ],
  },
  webpack: webpackConfig,
};

module.exports = nextConfig;
