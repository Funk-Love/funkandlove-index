import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
