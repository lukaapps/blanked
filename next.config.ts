import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
        search: "?v=3",
      },
      {
        pathname: "/images/**",
        search: "?v=4",
      },
      {
        pathname: "/images/logo-blanked.png",
        search: "?v=1",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
