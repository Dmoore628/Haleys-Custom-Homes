'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { DURATION, EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ButtonLink } from '@/components/ui/Button';

/**
 * Full-viewport video hero. No scroll reveal: the content fades in together (400ms)
 * the instant the page is ready. 20% black overlay for legibility.
 */
export function Hero() {
  const { hero } = copy.home;
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [indicatorVisible, setIndicatorVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setIndicatorVisible(window.scrollY <= window.innerHeight * 0.1);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Respect reduced motion: hold the first frame instead of looping footage.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reduced) v.pause();
    else void v.play().catch(() => undefined);
  }, [reduced]);

  return (
    <>
      {/* Below md the hero caps at 720px tall and biases the crop to the upper frame. */}
      <section className="relative h-[min(100vh,720px)] min-h-[560px] w-full overflow-hidden bg-ink text-bone md:h-[100vh]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover object-[50%_30%] md:object-center"
          src="/video/hero.mp4"
          poster="/video/hero-poster.jpg"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="absolute inset-0 bg-black/20" aria-hidden="true" />

        <motion.div
          className="section-x absolute inset-x-0 bottom-6 md:bottom-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.heroFade, ease: EASE }}
        >
          <p className="label">{hero.eyebrow}</p>
          <h1 className="mt-5 max-w-[15em] font-serif text-hero font-normal">{hero.headline}</h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={hero.primary.href} variant="primary" surface="dark">
              {hero.primary.label}
            </ButtonLink>
            <ButtonLink href={hero.ghost.href} variant="ghost" surface="dark">
              {hero.ghost.label}
            </ButtonLink>
          </div>
        </motion.div>

        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 h-6 w-px -translate-x-1/2 bg-bone/60 transition-opacity duration-300 ease-brand"
          style={{ opacity: indicatorVisible ? 1 : 0 }}
        />
      </section>
    </>
  );
}
