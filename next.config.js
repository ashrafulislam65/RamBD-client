/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    compiler: {
        styledComponents: true
    },
    images: {
        formats: ["image/webp"],
        minimumCacheTTL: 3600,
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 64, 128, 256, 384],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "rambd.com"
            },
            {
                protocol: "https",
                hostname: "admin.unicodeconverter.info"
            },
            {
                protocol: "https",
                hostname: "admin.felnatech.com"
            }
            // Add other image domains if needed
        ]
    },
    async rewrites() {
        return [
            {
                source: "/remote-api/:path*",
                destination: "https://admin.unicodeconverter.info/:path*",
            },
        ];
    },
};

module.exports = nextConfig;
