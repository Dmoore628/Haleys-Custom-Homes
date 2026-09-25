import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import siteConfig from '@content/site.config';
import { fraunces, inter } from '@/lib/fonts';
import { SkipLink } from '@/components/layout/SkipLink';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
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
  openGraph: { siteName: siteConfig.name, type: 'website', locale: 'en_US' },
};

export const viewport: Viewport = { themeColor: '#EFE9DE' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SkipLink />
        <Nav />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <CookieNotice />
        <CustomCursor />
        <SmoothScroll />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
