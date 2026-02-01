const nextConfig = {
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
  }
};

export default nextConfig;
