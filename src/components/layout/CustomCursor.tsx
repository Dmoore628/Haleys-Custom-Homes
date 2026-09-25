'use client';

import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], label, select, img, video, [data-cursor="expand"]';

/**
 * A small filled dot follows the pointer; over any link or image it expands into a 40px
 * outlined ring (1px border, transparent fill), 200ms. Fine pointers with hover only,
 * and never under prefers-reduced-motion. Difference blending keeps it visible on both
 * bone and ink surfaces without introducing a new color.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const update = () => setEnabled(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      setVisible(true);
      const target = e.target as Element | null;
      setExpanded(Boolean(target?.closest?.(INTERACTIVE)));
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] mix-blend-difference"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full transition-[width,height,background-color,border-color] duration-200 ease-brand ${
          expanded ? 'h-10 w-10 border border-bone bg-transparent' : 'h-2 w-2 border border-transparent bg-bone'
        }`}
      />
    </div>
  );
}
