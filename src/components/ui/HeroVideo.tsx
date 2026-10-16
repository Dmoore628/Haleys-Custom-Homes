'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Film = { src: string; poster: string };

/** Portrait screens (phones, upright tablets) use the tall film when there is one. */
const TALL = '(max-aspect-ratio: 4/5)';

/**
 * A full-screen hero video. The poster sits underneath (chosen by CSS media query when there
 * is a tall film, so it is right before any script runs); the video's source is chosen once
 * mounted, and again on rotation. Autoplay is made robust for iPhone Safari: muted as property
 * and attribute, a retry once it can play, and one on the first touch (Low Power Mode blocks
 * autoplay until the visitor interacts). Reduced motion keeps the poster.
 */
export function HeroVideo({ wide, tall }: { wide: Film; tall?: Film }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);
  const [film, setFilm] = useState<Film | null>(null);

  useEffect(() => {
    if (!tall) {
      setFilm(wide);
      return;
    }
    const mq = window.matchMedia(TALL);
    const pick = () => setFilm(mq.matches ? tall : wide);
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, [wide, tall]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    if (reduced) {
      v.pause();
      return;
    }
    const tryPlay = () => {
      if (v.paused) void v.play().catch(() => undefined);
    };
    tryPlay();
    v.addEventListener('canplay', tryPlay);
    window.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    return () => {
      v.removeEventListener('canplay', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
    };
  }, [reduced, film]);

  return (
    <>
      <picture>
        {tall && <source media={TALL} srcSet={tall.poster} />}
        {/* eslint-disable-next-line @next/next/no-img-element -- a poster frame, not content */}
        <img
          src={wide.poster}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
      </picture>
      {!reduced && (
        <video
          ref={ref}
          key={film?.src ?? 'none'}
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={film?.src}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
    </>
  );
}
