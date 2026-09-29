/** @type {import('next').NextConfig} */
const isDemo = process.env.SITE_ENV !== 'production';

// Uploaded project photos are served from the configured storage (docs/ADMIN.md).
const remotePatterns = [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }];
if (process.env.S3_PUBLIC_URL) {
  const u = new URL(process.env.S3_PUBLIC_URL);
  remotePatterns.push({ protocol: u.protocol.replace(':', ''), hostname: u.hostname });
}

// The portfolio's first six projects were published under their Houzz titles; they now use the
// names on Haley's own project pages. Old links keep working.
const renamed = {
  'cherry-creek-historical-remodel': 'curated-house',
  'modern-farm-house-in-cherry-hills': 'naturally-modern',
  'denver-modern': 'modern-elevated',
  'cherry-hills-transitional': 'tradition-reimagined',
  'cherry-hills-traditional': 'timeless-estate',
  modern: 'simplicity-perfected',
};

const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns,
  },
  experimental: {
    // Photo uploads go to /api/admin/upload; server actions only carry form fields.
    serverActions: { bodySizeLimit: '2mb' },
  },
  async redirects() {
    return [
      ...Object.entries(renamed).map(([from, to]) => ({
        source: `/portfolio/${from}`,
        destination: `/portfolio/${to}`,
        permanent: true,
      })),
      // The old site's client login address, bookmarked by current clients.
      { source: '/client-login', destination: '/client-portal', permanent: true },
      // Common addresses for the legal pages.
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-use', destination: '/terms', permanent: true },
      { source: '/terms-and-conditions', destination: '/terms', permanent: true },
    ];
  },
  async headers() {
    // Baseline security headers on every response: HTTPS only (two years), no MIME sniffing,
    // no framing by other sites, a private referrer, and no camera, microphone or location.
    const security = [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
    ];
    // The Vercel live demo is staging, not production: keep it out of search indexes.
    if (isDemo) security.push({ key: 'X-Robots-Tag', value: 'noindex, nofollow' });
    return [{ source: '/:path*', headers: security }];
  },
};

module.exports = nextConfig;
