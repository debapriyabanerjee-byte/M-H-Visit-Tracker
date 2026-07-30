import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    // Lint is run as a separate CI step; do not fail production builds on lint.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
