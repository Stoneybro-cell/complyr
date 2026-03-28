import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["fhevmjs"],
  // Vercel / Next.js 16 defaults to Turbopack, failing if a custom webpack config 
  // without a corresponding turbopack config is provided.
  turbopack: {},
};

export default nextConfig;
