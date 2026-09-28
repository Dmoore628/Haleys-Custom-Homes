import type { MetadataRoute } from 'next';
import siteConfig from '@content/site.config';

export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
