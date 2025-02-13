const path = require('node:path');

const webpackConfig = (config, { isServer }) => {
  if (isServer) {
    config.ignoreWarnings = [{ module: /opentelemetry/ }];
    config.externals.push('@cfce/database');
    // ^^^ https://github.com/prisma/prisma/issues/6051#issuecomment-831136748
  } else {
    config.externals = config.externals || [];
    config.externals.push(({ request }, callback) => {
      if (/^node:/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    });
  }
  return config;
};

const sharedNextConfig = {
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
        hostname: 'cfce.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'partners.cfce.io',
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
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  outputFileTracingRoot: path.join(process.cwd(), '../../'),
  experimental: {
    optimizePackageImports: [
      '@cfce/components',
      '@cfce/blockchain-tools',
      '@cfce/utils',
      '@cfce/pages',
      '@cfce/api',
    ],
  },
  webpack: webpackConfig,
};

module.exports = sharedNextConfig;
