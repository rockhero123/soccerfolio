import type { NextConfig } from "next";

/**
 * GitHub Pages build: static export served from a sub-path
 * (https://rockhero123.github.io/soccerfolio/). Only active when the deploy
 * workflow sets GITHUB_PAGES=true, so `npm run dev`, tests and other hosts
 * keep the default config.
 */
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? (process.env.PAGES_BASE_PATH ?? "") : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
    // The image optimizer needs a server; a static export serves files as-is.
    images: { unoptimized: true },
  }),
  env: {
    // next/image does not add basePath to `src`, so content files prefix it.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
