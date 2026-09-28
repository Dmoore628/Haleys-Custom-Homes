'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { DURATION, EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ButtonLink } from '@/components/ui/Button';
import { Sentences } from '@/components/ui/Sentences';

/**
 * Video hero. The footage is a wide panorama (about 2.3:1) with limited resolution, so it is
 * only cropped to fill the screen where the screen is wide enough to keep it sharp (lg and up:
 * full viewport, content over it). On phones and portrait tablets, where a full-height crop
 * would magnify a thin slice into a blur, it runs as a full-width band across the top that
 * fades into ink, with the headline beneath it. No scroll reveal: the content fades in
 * together (400ms) the instant the page is ready. 20% black overlay for legibility.
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

  // Autoplay, made robust for iPhone Safari: muted set as property and attribute, a retry
  // once the video can play, and one on the first touch (Low Power Mode blocks autoplay until
  // the visitor interacts). Reduced motion holds the first frame instead.
  useEffect(() => {
    const v = videoRef.current;
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
  }, [reduced]);

  return (
    <>
      <section className="relative w-full bg-ink text-bone lg:h-[100vh] lg:min-h-[560px] lg:overflow-hidden">
        {/* The footage: a band across the top below lg, the full viewport from lg. */}
        <div className="relative h-[max(46svh,300px)] w-full overflow-hidden lg:absolute lg:inset-0 lg:h-full">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-center"
            src="/video/hero-30.mp4"
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
          <div
            className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-b from-transparent to-ink lg:hidden"
            aria-hidden="true"
          />
        </div>

        <motion.div
          className="section-x relative pb-12 pt-1 lg:absolute lg:inset-x-0 lg:bottom-16 lg:pb-0 lg:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.heroFade, ease: EASE }}
        >
          <p className="label">{hero.eyebrow}</p>
          <h1 className="mt-5 max-w-[16em] font-serif text-hero font-normal">
            <Sentences text={hero.headline} />
          </h1>
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
          className="absolute bottom-6 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-bone/60 transition-opacity duration-300 ease-brand lg:block"
          style={{ opacity: indicatorVisible ? 1 : 0 }}
        />
      </section>
    </>
  );
}
