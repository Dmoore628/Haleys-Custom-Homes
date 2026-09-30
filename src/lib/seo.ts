import type { Metadata } from 'next';
import siteConfig from '@content/site.config';

/**
 * The address the site is actually served from, for absolute share-preview URLs (og:image,
 * og:video). In production it is Haley's domain; on Vercel before launch it is the deployment's
 * own address, so links shared from the demo still show their preview (haleycustomhomes.com
 * serves the old site until the domain moves); locally it is localhost.
 */
export function siteUrl(): string {
  if (process.env.SITE_ENV === 'production') return siteConfig.url;
  const vercel =
    process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

type OpenGraph = NonNullable<Metadata['openGraph']>;

/**
 * A page's share preview. Next replaces the whole openGraph object per page rather than merging
 * it with the layout's, so every page gets the site name, type and locale here, plus its own
 * address, image (1200x630 cards in public/og, made by scripts/process-media.py) and, for the
 * home page, the hero video.
 */
export function sharePreview(
  path: string,
  image: { url: string; width?: number; height?: number; alt?: string } = { url: '/og/home.jpg' },
  extra: Partial<OpenGraph> = {},
): OpenGraph {
  return {
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    url: path,
    images: [{ width: 1200, height: 630, alt: siteConfig.name, ...image }],
    ...extra,
  };
}

/**
 * The hero video at the share size, for platforms that play video in link previews. Absolute:
 * unlike og:image, Next does not resolve og:video against metadataBase.
 */
export const heroShareVideo = {
  url: `${siteUrl()}/video/og-hero.mp4`,
  secureUrl: `${siteUrl()}/video/og-hero.mp4`,
  type: 'video/mp4',
  width: 1200,
  height: 630,
};
