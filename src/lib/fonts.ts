import { Bodoni_Moda } from 'next/font/google';
import localFont from 'next/font/local';

// Display and headline type. next/font downloads it at build time and serves it from this
// site's own origin: no Google Fonts request at runtime. The optical-size axis keeps the
// hairlines sturdy at small sizes and delicate at hero scale. Italic is the signature
// accent (testimonial quotes, pull-quotes, the Early Move-In quote, the positioning mark).
export const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
  variable: '--font-bodoni',
});

// Body and UI type: Switzer by Indian Type Foundry (Fontshare, ITF Free Font License),
// self-hosted from src/fonts.
export const switzer = localFont({
  src: [
    { path: '../fonts/Switzer-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/Switzer-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/Switzer-500-normal.woff2', weight: '500', style: 'normal' },
    { path: '../fonts/Switzer-600-normal.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/Switzer-700-normal.woff2', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-switzer',
});
