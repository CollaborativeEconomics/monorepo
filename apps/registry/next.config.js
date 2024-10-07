// const path = require('node:path');
const { join } = require('node:path');

function webpack(config, { isServer }) {
  if (!isServer) {
    config.externals = config.externals || [];
    config.devtool = 'source-map';
    // the below resolves default exports
    config.externals.push(({ context, request }, callback) => {
      if (/^node:/.test(request)) {
        return callback(null, `commonjs ${request}`);
      }
      callback();
    });
  }
  return config;
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  productionBrowserSourceMaps: true,
  // output: 'standalone',
  experimental: {
    // instrumentationHook: true,
    serverSourceMaps: true,
    outputFileTracingRoot: join(process.cwd(), '../../'),
    // The below packages have barrel files that cause server/client mismatch errors
    optimizePackageImports: [
      '@cfce/universe-components',
      '@cfce/blockchain-tools',
      '@cfce/utils',
      '@cfce/universe-pages',
      '@cfce/universe-api',
    ],
  },
  webpack,
};
module.exports = nextConfig;
// export default nextConfig;
