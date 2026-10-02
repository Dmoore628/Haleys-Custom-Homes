import type { ReactNode } from 'react';

/**
 * The site's one badge: 1px border, transparent fill, label type, in champagne (the accent's
 * light tint, which reads on the dark surface the badge sits on; the accent itself is too dark
 * there). Reserved for the closing CTA's build-slot scarcity indicator. Never reuse it elsewhere.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <p className="label inline-block max-w-text rounded-btn border border-[#C6BAAC]/70 bg-black/20 px-4 py-2 text-[#C6BAAC]">
      {children}
    </p>
  );
}
