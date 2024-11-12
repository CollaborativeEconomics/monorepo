//const { withSentryConfig } = require('@sentry/nextjs');
const { default: next } = require('next');
const path = require('node:path');

const webpackConfig = (config, { isServer }) => {
  if (isServer) {
    config.ignoreWarnings = [
      { module: /opentelemetry/, },  // remove annoying warnings in terminal - ref: https://github.com/open-telemetry/opentelemetry-js/issues/4173
    ]
  } else {
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
    //esmExternals: true,  //The "esmExternals" option has been modified. experimental.esmExternals is not recommended to be modified as it may disrupt module resolution. It should be removed from your next.config.js.
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

/*
const sentryfulConfig = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  unstable_sentryWebpackPluginOptions: webpackConfig,

  org: 'center-for-collaborative-econ',
  project: 'giving-universe',

  // Only print logs for uploading source maps in CI
  // silent: false,
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,

  telemetry: false,
});
*/

// TODO: sentry is timing out, so I disabled it for now
// module.exports = sentryfulConfig;
module.exports = nextConfig;
