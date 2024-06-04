/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: '*.giving-universe.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'partners.cfce.io',
        port: '',
        pathname: '/_next/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};

module.exports = nextConfig;
