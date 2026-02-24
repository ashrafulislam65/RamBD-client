/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    compiler: {
        styledComponents: true
    },
    images: {
        loader: "custom",
        loaderFile: "./src/utils/imageLoader.ts",
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 64, 128, 256, 384],
    },
    serverExternalPackages: ["sharp"],
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
