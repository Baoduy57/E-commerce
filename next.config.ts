import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ✅ Tắt ESLint khi build
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
