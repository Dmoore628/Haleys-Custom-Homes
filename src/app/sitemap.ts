import type { MetadataRoute } from 'next';
import siteConfig from '@content/site.config';
import { getPublishedProjects } from '@/lib/projects/repo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const pages = ['', '/portfolio', '/process', '/eco-building', '/about', '/contact'];
  return [
    ...pages.map((p) => ({ url: `${siteConfig.url}${p}` })),
    ...projects.map((p) => ({ url: `${siteConfig.url}/portfolio/${p.slug}` })),
  ];
}
