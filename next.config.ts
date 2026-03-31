import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "rmhjnljlatmtlwilrvuz.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "c0.lestechnophiles.com",
      },
      {
        protocol: "https",
        hostname: "*.numerama.com",
      },
      {
        protocol: "https",
        hostname: "www.numerama.com",
      },
    ],
  },
};

export default nextConfig;
