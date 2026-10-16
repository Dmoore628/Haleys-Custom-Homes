'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { DURATION, EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ButtonLink } from '@/components/ui/Button';
import { Sentences } from '@/components/ui/Sentences';

/** Portrait screens (phones, upright tablets) get the tall film; everything else the wide one. */
const TALL = '(max-aspect-ratio: 4/5)';
const FILM = {
  wide: { src: '/video/hero-wide.mp4', poster: '/video/hero-poster.jpg' },
  tall: { src: '/video/hero-tall.mp4', poster: '/video/hero-poster-tall.jpg' },
};

/**
 * Video hero: the film fills the screen at every size, with the headline and buttons laid over
 * its lower part. The film is Haley's own photography with slow camera moves
 * (scripts/hero_film.py), rendered twice, 1920x1080 and 1080x1920, so each screen shape plays a
 * version framed for it and nothing is stretched. The matching first frame sits underneath as
 * a poster (chosen by CSS media query, so it is right before any script runs), and the video's
 * source is chosen once mounted, and again if the screen is rotated. A 25% black overlay plus a
 * gradient rising from the bottom keeps the copy legible. `svh` keeps it to the visible screen
 * on iPhone, toolbar included. No scroll reveal: the content fades in the instant the page is
 * ready.
 */
export function Hero() {
  const { hero } = copy.home;
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [indicatorVisible, setIndicatorVisible] = useState(true);
  const [film, setFilm] = useState<'wide' | 'tall' | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(TALL);
    const pick = () => setFilm(mq.matches ? 'tall' : 'wide');
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, []);

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
  }, [reduced, film]);

  return (
    <>
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white lg:h-[100vh]">
        {/* The footage, filling the screen. */}
        <div className="absolute inset-0 overflow-hidden">
          <picture>
            <source media={TALL} srcSet={FILM.tall.poster} />
            {/* eslint-disable-next-line @next/next/no-img-element -- a poster frame, not content */}
            <img
              src={FILM.wide.poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
              fetchPriority="high"
            />
          </picture>
          <video
            ref={videoRef}
            key={film ?? 'none'}
            className="absolute inset-0 h-full w-full object-cover object-center"
            src={film ? FILM[film].src : undefined}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
          <div
            className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/35 to-black/75 lg:h-1/2 lg:via-black/10 lg:to-black/45"
            aria-hidden="true"
          />
        </div>

        <motion.div
          className="section-x absolute inset-x-0 bottom-[max(2.5rem,env(safe-area-inset-bottom))] text-center lg:bottom-16 lg:text-left"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.heroFade, ease: EASE }}
        >
          <p className="label">{hero.eyebrow}</p>
          <h1 className="mx-auto mt-5 max-w-[16em] font-serif text-hero font-normal lg:mx-0">
            <Sentences text={hero.headline} />
          </h1>
          <div className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start">
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
