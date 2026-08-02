import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // static export for GitHub Pages
  devIndicators: false,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true, // GitHub Pages can't run Next's image optimizer
  },
};

export default nextConfig;
