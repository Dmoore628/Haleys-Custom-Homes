'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/** Lenis momentum scrolling sitewide. Disabled entirely under prefers-reduced-motion. */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: true,
    });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener('lenis:stop', stop);
    window.addEventListener('lenis:start', start);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('lenis:stop', stop);
      window.removeEventListener('lenis:start', start);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // New route: start at the top.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
