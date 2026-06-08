import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds to successfully complete 
    // even if your project has ESLint warnings/errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;