import { NextConfig } from "next";
import { env as envClient } from "@/env/client";
import { env as envServer } from "@/env/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const envs = [envClient, envServer];


const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image-galery-compressed-images.s3.sa-east-1.amazonaws.com",
                pathname: "/**",
            },
        ],
    },
    eslint: {
        dirs: ["components", "app", "actions", "context", "db", "hooks", "lib", "utils"],
    },
}

export default nextConfig
