import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import siteConfig from '@content/site.config';
import { bodoni, switzer } from '@/lib/fonts';
import { SkipLink } from '@/components/layout/SkipLink';
import { Nav } from '@/components/layout/Nav';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { CookieNotice } from '@/components/layout/CookieNotice';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import './globals.css';

const isProduction = process.env.SITE_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.seo.defaultTitle, template: `%s | ${siteConfig.seo.titleSuffix}` },
  description: siteConfig.seo.defaultDescription,
  // The Vercel demo is staging: never indexed until this is Haley's live domain.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    siteName: siteConfig.name,
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og/home.jpg', width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#EFE9DE' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bodoni.variable} ${switzer.variable}`}>
      <body>
        <SkipLink />
        <ScrollProgress />
        <Nav />
        {/* <main> and the footer are rendered by the (site) template and by not-found. */}
        {children}
        <CookieNotice />
        <CustomCursor />
        <SmoothScroll />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
