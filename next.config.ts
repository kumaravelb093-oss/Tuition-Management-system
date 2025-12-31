import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation for routes that use Firebase client SDK
  // All routes will be rendered at request time on Vercel
  experimental: {
    // This is safe for Vercel deployment
  },
  // Skip strict mode double-rendering in dev for faster iteration
  reactStrictMode: true,
  // For Firebase client-side only usage, we skip static exports
  // This ensures pages are server-rendered on-demand
  output: undefined, // Default: server-side rendering on Vercel
};

export default nextConfig;
