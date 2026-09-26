import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to `out/`, hosted as plain files on Cloudflare.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
