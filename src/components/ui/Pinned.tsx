'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Sticky-pinned cover transition (Fixes spec item 2): this section pins while the next
 * section, which must be `relative z-10` with an opaque background, slides up over it.
 *
 * A section taller than the viewport pins by its bottom edge (top = viewport - height), so
 * all of it is seen before it is covered. Under prefers-reduced-motion it scrolls normally.
 * Only used at the four specified boundaries: Home hero, Home closing CTA, project hero,
 * and About founder intro.
 */
export function Pinned({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
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

  return (
    <div
      ref={ref}
      className={`relative z-0 ${className}`}
      style={reduced ? undefined : { position: 'sticky', top }}
      data-pinned={reduced ? 'false' : 'true'}
    >
      {children}
    </div>
  );
}
