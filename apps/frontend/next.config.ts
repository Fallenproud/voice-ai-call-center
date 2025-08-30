import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://velora-voice-api.mrevensen94.workers.dev',
    NEXT_PUBLIC_LICENSE_SERVER_URL: process.env.NEXT_PUBLIC_LICENSE_SERVER_URL || 'https://velora-voice-license.mrevensen94.workers.dev',
  },
};

export default nextConfig;
