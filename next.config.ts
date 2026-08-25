import type { NextConfig } from "next";

/**
 * Images live in R2 behind a Cloudflare custom domain, so resizing happens
 * there (see `src/lib/image-loader.ts`) instead of in Vercel's optimizer.
 * The loader applies to every `next/image`, and passes local assets through.
 */
const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
  },
};

export default nextConfig;
