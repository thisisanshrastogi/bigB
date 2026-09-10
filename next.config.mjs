/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'statements-lookup.s3.us-west-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
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
