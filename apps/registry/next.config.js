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
  outputFileTracingRoot: join(process.cwd(), '../../'),
  experimental: {
    // instrumentationHook: true,
    serverSourceMaps: true,
    // The below packages have barrel files that cause server/client mismatch errors
    optimizePackageImports: [
      '@cfce/components',
      '@cfce/blockchain-tools',
      '@cfce/utils',
      '@cfce/pages',
      '@cfce/api',
    ],
  },
  webpack,
};
module.exports = nextConfig;
// export default nextConfig;
