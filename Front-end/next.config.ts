import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.NEXT_PUBLIC_CLERK_SECRET_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "https",
        hostname: "t3.ftcdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "heathermitts.com",
      },
      {
        protocol: "https",
        hostname: "e7v7eoh5g4s.exactdn.com",
      },
      {
        protocol: "https",
        hostname: "www.heathermitts.com",
      },
      {
        protocol: "https",
        hostname: "doy-community.sites.uu.nl",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "hips.hearstapps.com",
      },
    ],
  },
};

export default nextConfig;
