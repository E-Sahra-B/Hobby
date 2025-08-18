import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Sadece production build sırasında ESLint hatalarını ignore et
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript hatalarını build sırasında ignore et
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
