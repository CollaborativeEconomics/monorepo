const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // config.resolve.fallback = {
      //   ...config.resolve.fallback,
      //   fs: false,
      //   net: false,
      //   tls: false,
      //   crypto: false,
      //   os: false,
      //   path: false,
      //   stream: false,
      //   zlib: false,
      //   http: false,
      //   https: false,
      //   assert: false,
      //   util: false,
      //   'node:fs': false,
      //   'node:path': false,
      //   'node:crypto': false,
      //   'node:net': false,
      //   'node:stream': false,
      //   'node:http': false,
      //   'node:https': false,
      //   'node:assert': false,
      //   'node:util': false,
      // };
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

export default nextConfig;
