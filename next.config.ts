import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // !! WARN !!
    // Dangerously allow production builds to successfully complete 
    // even if your project has TypeScript errors.
    // !! WARN !!
    ignoreBuildErrors: true,
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