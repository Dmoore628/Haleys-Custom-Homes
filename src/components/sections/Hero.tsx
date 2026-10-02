'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { DURATION, EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ButtonLink } from '@/components/ui/Button';
import { Sentences } from '@/components/ui/Sentences';

/**
 * Video hero: the footage fills the screen at every size, with the headline and buttons laid
 * over its lower part. The footage is a wide panorama (about 2.3:1, 1920x838), so on phones the
 * fill is a centered crop; a 20% black overlay plus a gradient rising from the bottom (deeper
 * on narrow screens, where more of the frame sits behind the text) keeps the copy legible.
 * `svh` keeps it to the visible screen on iPhone, toolbar included. No scroll reveal: the
 * content fades in together (400ms) the instant the page is ready.
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
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white lg:h-[100vh]">
        {/* The footage, filling the screen. */}
        <div className="absolute inset-0 overflow-hidden">
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
            className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/35 to-black/75 lg:h-1/2 lg:via-black/10 lg:to-black/45"
            aria-hidden="true"
          />
        </div>

        <motion.div
          className="section-x absolute inset-x-0 bottom-[max(2.5rem,env(safe-area-inset-bottom))] lg:bottom-16"
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
          className="absolute bottom-6 left-1/2 hidden h-6 w-px -translate-x-1/2 bg-white/60 transition-opacity duration-300 ease-brand lg:block"
          style={{ opacity: indicatorVisible ? 1 : 0 }}
        />
      </section>
    </>
  );
}
