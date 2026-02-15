/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true
    },
    images: {
        unoptimized: true,
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
