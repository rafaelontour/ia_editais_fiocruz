import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
