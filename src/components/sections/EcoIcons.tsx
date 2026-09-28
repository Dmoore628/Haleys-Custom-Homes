/**
 * Single-stroke line icons for the eco-building features, drawn at the same weight as the site's
 * other line art: a rain tank, a roof garden under the sun, the sun's path over a house, and a
 * house wrapped in its envelope.
 */
export function FeatureIcon({ id }: { id: string }) {
  const common = {
    viewBox: '0 0 48 48',
    className: 'h-11 w-11 text-accent',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (id) {
    case 'rain':
      return (
        <svg {...common}>
          <path d="M24 5c-3 4.5-5 7.3-5 9.5a5 5 0 0 0 10 0c0-2.2-2-5-5-9.5z" />
          <rect x="12" y="24" width="24" height="19" rx="3" />
          <path d="M12 30h24M12 37h24M18 24v-3h12v3" />
        </svg>
      );
    case 'roof':
      return (
        <svg {...common}>
          <circle cx="36" cy="10" r="4" />
          <path d="M36 2v2M44 10h-2M41.7 4.3l-1.4 1.4" />
          <path d="M6 40L22 18l16 22z" />
          <path d="M12 32l6 3M16 26.5l6 3M20 21l5 2.5" />
          <path d="M26 40c0-3 2-5 4-5s4 2 4 5" />
        </svg>
      );
    case 'passive':
      return (
        <svg {...common}>
          <path d="M4 26a20 20 0 0 1 40 0" strokeDasharray="2 3" />
          <circle cx="12" cy="15" r="3" />
          <path d="M14 43V31l10-8 10 8v12z" />
          <path d="M21 43v-7h6v7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M8 22L24 9l16 13v21H8z" />
          <path d="M13 24.5L24 15.5l11 9V38H13z" strokeDasharray="2 2.5" />
          <path d="M21 38v-6h6v6" />
        </svg>
      );
  }
}
