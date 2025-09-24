/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, '@prisma/client'];
    
    // Fix for browser-only libraries on server side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'm3roodi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm3roodi.com',
      },
      {
        protocol: 'https',
        hostname: 'www.m3roodi.com',
      },
    ],
  },
  output: 'standalone',
  trailingSlash: false,
  assetPrefix: '',
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Optimize bundle size
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
    optimizePackageImports: ['@prisma/client'],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://m3roodi.com',
  },
  
  // Redirects for production only (not during build)
  async redirects() {
    // Only apply redirects in production, not during Vercel build
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.m3roodi.com',
          },
        ],
        destination: 'https://m3roodi.com/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
