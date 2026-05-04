import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'funkandlove-main.s3.bitiful.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
