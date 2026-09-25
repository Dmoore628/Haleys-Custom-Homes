import type { SocialId } from '@content/site.config';

/**
 * Custom single-stroke line-art glyphs for the footer's social links (Fixes spec item 19).
 * Drawn on a 24px grid at the same 1.25 stroke weight as the Signature Motion Accents, in
 * currentColor: no platform brand colors, no background chip.
 */
const PATHS: Record<SocialId, JSX.Element> = {
  pinterest: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10.6 19.5l1.7-7.4" />
      <path d="M11.2 9.2c2.9-1.4 5.8-.1 5.8 2.5 0 2.5-1.9 4.2-3.9 4.2-1 0-1.7-.5-1.9-1" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.75" y="5.75" width="18.5" height="12.5" rx="3.5" />
      <path d="M10.25 9.25v5.5l4.75-2.75z" strokeLinejoin="round" />
    </>
  ),
  facebook: (
    <path
      d="M13.5 21v-8.25h2.6l.4-3h-3V8.1c0-.9.3-1.5 1.6-1.5h1.5V3.9a19 19 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.2H8.2v3h2.5V21"
      strokeLinejoin="round"
    />
  ),
  linkedin: (
    <>
      <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="3" />
      <path d="M8 10.5v6" />
      <circle cx="8" cy="7.6" r=".55" />
      <path d="M11.5 16.5v-6M11.5 13.2c0-1.7 1-2.9 2.4-2.9 1.3 0 2.1.9 2.1 2.6v3.6" />
    </>
  ),
  houzz: <path d="M6.5 3v18h4.25v-5.75h2.5V21h4.25V10.25L10.75 8V3z" strokeLinejoin="round" />,
  x: (
    <>
      <path d="M4.5 4h4.1l10.9 16h-4.1z" strokeLinejoin="round" />
      <path d="M19.4 4l-6.1 7M10.7 13L4.6 20" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.1" cy="6.9" r=".55" />
    </>
  ),
};

export function SocialGlyph({ id }: { id: SocialId }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {PATHS[id]}
    </svg>
  );
}
