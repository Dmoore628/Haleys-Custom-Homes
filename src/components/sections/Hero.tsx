'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import copy from '@content/copy.config';
import { DURATION, EASE } from '@/lib/animation';
import { ButtonLink } from '@/components/ui/Button';
import { Sentences } from '@/components/ui/Sentences';
import { HeroVideo } from '@/components/ui/HeroVideo';

/**
 * Video hero: a film of finished Haley homes, the same film as the Process hero, built from
 * Haley's professional photography with slow camera moves (scripts/hero_film.py) and rendered
 * twice, 1920x1080 and 1080x1920, so each screen shape plays a version framed for it. It fills
 * the screen at every size, with the headline and buttons laid over its lower part. A 25% black
 * overlay plus a gradient rising from the bottom keeps the copy legible. `svh` keeps it to the
 * visible screen on iPhone, toolbar included. No scroll reveal: the content fades in the
 * instant the page is ready.
 */
export function Hero() {
  const { hero } = copy.home;
  const [indicatorVisible, setIndicatorVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setIndicatorVisible(window.scrollY <= window.innerHeight * 0.1);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white lg:h-[100vh]">
        {/* The footage, filling the screen. */}
        <div className="absolute inset-0 overflow-hidden">
          <HeroVideo
            wide={{ src: '/video/hero-wide.mp4', poster: '/video/hero-poster.jpg' }}
            tall={{ src: '/video/hero-tall.mp4', poster: '/video/hero-poster-tall.jpg' }}
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
