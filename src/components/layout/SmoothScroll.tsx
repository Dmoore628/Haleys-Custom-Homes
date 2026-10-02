'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

/** useLayoutEffect in the browser (before paint), useEffect during server rendering. */
const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Lenis momentum scrolling for mouse and trackpad. Off on touch devices, which keep native
 * scrolling (smooth already, and Lenis could fight it at the ends of the page), and off
 * entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
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

  // Every page opens at its hero, however it was reached: links, the back and forward buttons,
  // and on every device (touch devices don't run Lenis, so the reset can't depend on it). The
  // browser's own scroll restoration is turned off, and the reset runs again on the next frame
  // so the pinned sections' layout can't carry the old position over.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  }, []);

  useBrowserLayoutEffect(() => {
    const toTop = () => {
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    toTop();
    const raf = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // A link to the page already open (the logo on Home, Start the Conversation on Contact)
  // doesn't change the route, so the reset above can't fire: send it to the top here. In-page
  // anchors (#section), new tabs and modified clicks are left alone.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest('a[href]') as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.hash) return;
      if (url.pathname !== window.location.pathname) return;
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    };
    // Capture phase: Next's <Link> marks its clicks handled (preventDefault) before a
    // bubbling listener would see them.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
