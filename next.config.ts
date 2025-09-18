import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true, // set to true if you want a 308 permanent redirect
            },
        ]
    },

  webpack: (config) => {
    config.resolve.alias["./lzma_worker.js"] = path.resolve(
      __dirname,
      "node_modules/lzma/src/lzma_worker.js"
    );
    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
