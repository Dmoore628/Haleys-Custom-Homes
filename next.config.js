/** @type {import('next').NextConfig} */
const isDemo = process.env.SITE_ENV !== 'production';

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    // The Vercel live demo is staging, not production: keep it out of search indexes.
    if (!isDemo) return [];
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

module.exports = nextConfig;
