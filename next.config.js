/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    // TODO: does prisma need to go here?
    serverComponentsExternalPackages: ['bcrypt'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
