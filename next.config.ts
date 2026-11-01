import type { NextConfig } from "next";

// Static export: the site is plain HTML, CSS and JS in `out/`, so it runs on
// any Hostinger plan with no Node server or database.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
