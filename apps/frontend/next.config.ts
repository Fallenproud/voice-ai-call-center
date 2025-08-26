import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_LICENSE_SERVER_URL: process.env.NEXT_PUBLIC_LICENSE_SERVER_URL || 'http://localhost:3002',
  },
};

export default nextConfig;
