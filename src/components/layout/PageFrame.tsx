'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Footer } from './Footer';

/**
 * <main> plus the footer, arranged so the footer slides up over the page's last (pinned)
 * section. A sticky element can't outlive its parent, so <main> is padded by the footer's
 * height and the footer is pulled up over that padding: the last section stays pinned inside
 * <main> while the footer, a sibling landmark, covers it.
 */
export function PageFrame({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerH, setFooterH] = useState(0);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || reduced) return;
    const ro = new ResizeObserver(() => setFooterH(el.offsetHeight));
    ro.observe(el);
    setFooterH(el.offsetHeight);
    return () => ro.disconnect();
  }, [reduced]);

  return (
    <>
      <main
        id="main"
        tabIndex={-1}
        className="outline-none"
        style={reduced ? undefined : { paddingBottom: footerH }}
      >
        {children}
      </main>
      <div
        ref={footerRef}
        id="site-footer"
        className="relative z-10 shadow-[0_-28px_56px_-28px_rgba(26,24,21,0.35)]"
        style={reduced ? undefined : { marginTop: -footerH }}
      >
        <Footer />
      </div>
    </>
  );
}
