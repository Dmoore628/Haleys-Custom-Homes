'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { DURATION, EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Footer } from '@/components/layout/Footer';

/**
 * Route change: a 300ms opacity cross-fade. No slides, no wipes.
 *
 * On Home the closing CTA is pinned and the footer slides up over it (Fixes spec item 2).
 * A sticky element can't outlive its parent, so <main> is padded by the footer's height and
 * the footer is pulled up over that padding: the CTA stays pinned inside <main> while the
 * footer, a sibling landmark, covers it.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const footerRef = useRef<HTMLDivElement>(null);
  const [footerH, setFooterH] = useState(0);
  const overlap = pathname === '/' && !reduced;

  useEffect(() => {
    const el = footerRef.current;
    if (!el || !overlap) return;
    const ro = new ResizeObserver(() => setFooterH(el.offsetHeight));
    ro.observe(el);
    setFooterH(el.offsetHeight);
    return () => ro.disconnect();
  }, [overlap]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.pageFade, ease: EASE }}
    >
      <main
        id="main"
        tabIndex={-1}
        className="outline-none"
        style={overlap ? { paddingBottom: footerH } : undefined}
      >
        {children}
      </main>
      <div
        ref={footerRef}
        className="relative z-10"
        style={overlap ? { marginTop: -footerH } : undefined}
      >
        <Footer />
      </div>
    </motion.div>
  );
}
