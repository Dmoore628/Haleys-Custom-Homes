'use client';

import { useEffect, useRef, type ReactNode } from 'react';

const REACH = 40; // px beyond the button edge where the pull begins
const MAX_SHIFT = 6; // px the label can travel

/**
 * Magnetic label (Fixes spec item 24): only for the "Start the Conversation" and
 * "Send Inquiry" primary buttons. As the pointer comes within ~40px of the button's edge the
 * label drifts a few pixels toward it, and settles back to center when the pointer leaves
 * or the button is pressed. Fine pointers only; off under prefers-reduced-motion.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const label = labelRef.current;
    const button = label?.closest('a, button') as HTMLElement | null;
    if (!label || !button) return;
    const ok = window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    );
    if (!ok.matches) return;

    let raf = 0;
    const set = (x: number, y: number) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        label.style.transform =
          x || y ? `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)` : '';
      });
    };
    const onMove = (e: PointerEvent) => {
      const r = button.getBoundingClientRect();
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) > REACH) return set(0, 0);
      const cx = e.clientX - (r.left + r.width / 2);
      const cy = e.clientY - (r.top + r.height / 2);
      const pull = (v: number, half: number) =>
        Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, (v / (half + REACH)) * MAX_SHIFT));
      set(pull(cx, r.width / 2), pull(cy, r.height / 2));
    };
    const release = () => set(0, 0);
    window.addEventListener('pointermove', onMove, { passive: true });
    button.addEventListener('pointerdown', release);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      button.removeEventListener('pointerdown', release);
    };
  }, []);

  return (
    <span
      ref={labelRef}
      className="relative inline-block transition-transform duration-200 ease-brand"
      data-magnetic="true"
    >
      {children}
    </span>
  );
}
