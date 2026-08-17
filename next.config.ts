import type { NextConfig } from "next";

const isDev = process?.env?.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export", // static export for GitHub Pages
  devIndicators: false,
  // Always define BASE_PATH explicitly (empty in dev, "/Hong" in production)
  // so components can rely on a deterministic value in both modes.
  env: {
    BASE_PATH: isDev ? "" : "/Hong",
  },
  ...(!isDev && {
    basePath: "/Hong",
    assetPrefix: "/Hong/",
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
