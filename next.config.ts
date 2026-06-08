import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Safely nests the flag to allow production builds to successfully complete 
    // even if your project has strict TypeScript compilation warnings/errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
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