const path = require('node:path');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  productionBrowserSourceMaps: true,
  serverSourceMaps: true,
  experimental: {
    // instrumentationHook: true,
    serverSourceMaps: true,
    outputFileTracingRoot: path.join(process.cwd(), '../../'),
    // The below packages have barrel files that cause server/client mismatch errors
    optimizePackageImports: [
      '@cfce/universe-components',
      '@cfce/blockchain-tools',
      '@cfce/utils',
      '@cfce/universe-pages',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.devtool = 'source-map';
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
