import type { NextConfig } from "next";

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
                port: "",
                pathname: "/**",
            },
        ],
    },
    eslint: {
        // Faz com que o eslint seja ignorado durante o build
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
