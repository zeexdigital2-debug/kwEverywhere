/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:48920/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:48920/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
