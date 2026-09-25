'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * A muted background loop that only loads and plays while near the viewport, layered over a
 * still image of the same scene. Under prefers-reduced-motion it never loads: the still stays.
 */
export function AmbientVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          void v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { rootMargin: '200px 0px' },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  if (reduced) return null;
  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={load ? src : undefined}
      poster={poster}
      muted
      autoPlay
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
