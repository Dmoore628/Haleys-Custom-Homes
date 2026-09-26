'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/** Hero- and section-scale Bodoni headlines. */
const SELECTOR = '.font-serif.text-hero, .font-serif.text-section';

/**
 * Bodoni Moda weight rule: its hairlines hold up in a one- or two-line display headline but
 * fade when the same weight runs three lines or more. Every headline at hero or section scale
 * is measured where it actually renders, at the current viewport width; three lines or more
 * sets `data-long`, which switches it to Medium (see globals.css). Heavier type only ever
 * adds width, so the result can't flip back and forth.
 */
export function HeadlineWeights() {
  const pathname = usePathname();

  useEffect(() => {
    const measure = (el: HTMLElement) => {
      const lh = parseFloat(getComputedStyle(el).lineHeight);
      if (!lh) return;
      const lines = Math.round(el.getBoundingClientRect().height / lh);
      el.dataset.long = String(lines >= 3);
    };
    const ro = new ResizeObserver((entries) =>
      entries.forEach((e) => measure(e.target as HTMLElement)),
    );
    const observe = () =>
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
        if (el.dataset.weighed) return;
        el.dataset.weighed = 'true';
        measure(el);
        ro.observe(el);
      });
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
      document
        .querySelectorAll<HTMLElement>('[data-weighed]')
        .forEach((el) => delete el.dataset.weighed);
    };
  }, [pathname]);

  return null;
}
