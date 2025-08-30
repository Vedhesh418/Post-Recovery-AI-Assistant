/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
}

export default nextConfig