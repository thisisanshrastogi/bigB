/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Pass-through for studio and API routes so they are not affected
      {
        source: '/studio/:path*',
        destination: '/studio/:path*',
      },
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      // Rewrite the root to the blog index
      {
        source: '/',
        destination: '/blog',
      },
      // Rewrite category paths
      {
        source: '/category/:path*',
        destination: '/blog/category/:path*',
      },
      // Rewrite root slugs to the blog slug route
      {
        source: '/:slug',
        destination: '/blog/:slug',
      },
    ];
  },
};

export default nextConfig;
