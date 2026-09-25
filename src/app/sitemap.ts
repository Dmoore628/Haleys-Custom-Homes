import type { MetadataRoute } from 'next';
import siteConfig from '@content/site.config';
import { projects } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', '/portfolio', '/process', '/about', '/contact'];
  return [
    ...pages.map((p) => ({ url: `${siteConfig.url}${p}` })),
    ...projects.map((p) => ({ url: `${siteConfig.url}/portfolio/${p.slug}` })),
  ];
}
