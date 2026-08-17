import type { NextConfig } from "next";

const isDev = process?.env?.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export", // static export for GitHub Pages
  devIndicators: false,
  ...(!isDev && {
    basePath: "/Hong",
    assetPrefix: "/Hong/",
    env: {
      BASE_PATH: "/Hong",
    },
  }),
  trailingSlash: true, // generate URLs and file paths with a trailing slash
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true, // GitHub Pages can't run Next's image optimizer
  },
};

export default nextConfig;
