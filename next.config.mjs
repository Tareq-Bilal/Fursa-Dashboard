/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for faster builds
  swcMinify: true,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Proxy API requests to backend to avoid CORS issues
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://fursa-api.runasp.net/api/:path*",
      },
    ];
  },

  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Production optimizations
  ...(process.env.NODE_ENV === "production" && {
    reactStrictMode: true,
    poweredByHeader: false,
  }),
};

export default nextConfig;
