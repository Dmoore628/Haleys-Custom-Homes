import type { Config } from 'tailwindcss';
import containerQueries from '@tailwindcss/container-queries';

/**
 * Every value here comes from the Design System document. No ad hoc values
 * live outside this token set.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    // Only the three palette colors (plus overlay black) exist on this site.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      bone: '#EFE9DE',
      ink: '#1A1815',
      accent: '#7A6250',
      black: '#000000',
    },
    fontFamily: {
      serif: ['var(--font-bodoni)', 'Georgia', 'serif'],
      sans: ['var(--font-switzer)', 'system-ui', 'sans-serif'],
    },
    screens: {
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontSize: {
        hero: ['clamp(2.75rem, 6.5vw, 6rem)', { lineHeight: '1.05' }],
        section: ['clamp(1.875rem, 4vw, 3.25rem)', { lineHeight: '1.12' }],
        statement: ['clamp(1.5rem, 2.75vw, 2.125rem)', { lineHeight: '1.35' }],
        body: ['1.125rem', { lineHeight: '1.65' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
        card: ['clamp(1rem, 1.5vw, 1.25rem)', { lineHeight: '1.6' }],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      spacing: {
        section: 'clamp(4rem, 9vw, 9rem)',
        'section-quiet': 'clamp(3rem, 6vw, 6rem)',
        gutter: 'clamp(1.5rem, 5vw, 4rem)',
        grid: 'clamp(1rem, 2vw, 2rem)',
      },
      maxWidth: {
        text: '600px',
        statement: '640px',
      },
      borderRadius: {
        btn: '3px',
        tile: '4px',
      },
      transitionTimingFunction: {
        // The one easing curve used everywhere on the site.
        brand: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        150: '150ms',
        200: '200ms',
        300: '300ms',
        400: '400ms',
        600: '600ms',
      },
    },
  },
  plugins: [containerQueries],
};

export default config;
