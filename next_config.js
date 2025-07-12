/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensure API routes work properly
  experimental: {
    esmExternals: false,
  },
  // Handle TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable support for TypeScript and JavaScript files
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
}

module.exports = nextConfig