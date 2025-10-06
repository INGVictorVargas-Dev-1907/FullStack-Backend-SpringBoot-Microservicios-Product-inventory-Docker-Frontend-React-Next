/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_PRODUCTS_API_KEY: process.env.NEXT_PUBLIC_PRODUCTS_API_KEY,
    NEXT_PUBLIC_INVENTORY_API_KEY: process.env.NEXT_PUBLIC_INVENTORY_API_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: `${process.env.NEXT_PUBLIC_PRODUCTS_BASE_URL || 'http://localhost:8081'}/api/products/:path*`,
      },
      {
        source: '/api/inventory/:path*',
        destination: `${process.env.NEXT_PUBLIC_INVENTORY_BASE_URL || 'http://localhost:8082'}/api/inventory/:path*`,
      },
    ];
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '**',
        pathname: '**',
      },
    ],
  },
  experimental: {
    // Para micro-frontends futuros
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
