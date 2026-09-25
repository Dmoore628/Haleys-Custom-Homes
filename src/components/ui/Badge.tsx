import type { ReactNode } from 'react';

/**
 * The site's one badge: 1px accent border, transparent fill, accent text, label type.
 * Reserved for the closing CTA's build-slot scarcity indicator. Never reuse it elsewhere.
 */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <p className="label inline-block max-w-text rounded-btn border border-accent px-4 py-2 text-accent">
      {children}
    </p>
  );
}
