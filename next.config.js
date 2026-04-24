/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dify-api/:path*',
        destination: 'http://boss-dify.zenlayer.net/v1/:path*',
      },
    ]
  },
}

module.exports = nextConfig
