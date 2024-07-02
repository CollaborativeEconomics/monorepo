/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'give.staging.cfce.io',
        port: '',
        pathname: '/media/**'
      },
      {
        protocol: 'https',
        hostname: 'ipfs.filebase.io',
        port: '',
        pathname: '/ipfs/**'
      },
      {
        protocol: 'https',
        hostname: 'v8tqm1jlovjfn4gd.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
