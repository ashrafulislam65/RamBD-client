const nextConfig = {
  // output: 'standalone', // Required for cPanel deployment
  compiler: {
    styledComponents: true
  },
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rambd.com"
      },
      {
        protocol: "https",
        hostname: "admin.felnatech.com"
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: "/remote-api/:path*",
        destination: "https://admin.felnatech.com/:path*",
      },
    ];
  },
};

export default nextConfig;
