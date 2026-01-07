import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/pos',
  assetPrefix: '/pos',
  images: {
    remotePatterns: [
      // Cho phép HTTP (local development và Docker)
      {
        protocol: 'http',
        hostname: '**',
      },
      // Cho phép HTTPS (production)
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
