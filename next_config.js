/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // This ensures API routes work properly
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig