/** @type {import('next').NextConfig} */
const nextConfig = {
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
