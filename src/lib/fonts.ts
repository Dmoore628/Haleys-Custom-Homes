import { Fraunces, Inter } from 'next/font/google';

// next/font downloads these at build time and serves them from this site's own origin:
// no Google Fonts CDN request at runtime, no flash of unstyled text.
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
