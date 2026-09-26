'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** How dark a section gets by the time the next one has fully covered it. */
const MAX_DIM = 0.32;

/**
 * The site's section transition: this section pins while whatever follows it (the next
 * section, or the footer after the last one) slides up over it.
 *
 * A section taller than the viewport pins by its bottom edge (top = viewport - height), so
 * all of it is seen before it is covered. While it is being covered it dims toward ink, and
 * every section after the first casts a soft shadow up onto the one beneath, so the layering
 * reads even between two bone sections. Under prefers-reduced-motion it scrolls normally.
 */
export function Pinned({
  children,
  first = false,
  className = '',
}: {
  children: ReactNode;
  /** The first section of the page has nothing beneath it, so no shadow. */
  first?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [top, setTop] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setTop(Math.min(0, window.innerHeight - el.offsetHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    const dim = dimRef.current;
    if (!el || !dim || reduced) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const cover =
        (el.nextElementSibling as HTMLElement | null) ?? document.getElementById('site-footer');
      if (!cover) return;
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, 1 - cover.getBoundingClientRect().top / vh));
      dim.style.opacity = String(p * p * MAX_DIM);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`relative z-0 bg-bone ${
        first || reduced ? '' : 'shadow-[0_-28px_56px_-28px_rgba(26,24,21,0.35)]'
      } ${className}`}
      style={reduced ? undefined : { position: 'sticky', top }}
      data-pinned={reduced ? 'false' : 'true'}
    >
      {children}
      {!reduced && (
        <div
          ref={dimRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[40] bg-ink"
          style={{ opacity: 0 }}
          data-testid="cover-dim"
        />
      )}
    </div>
  );
}
