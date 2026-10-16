'use client';

import { motion } from 'framer-motion';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { HeroVideo } from '@/components/ui/HeroVideo';

const { intro } = copy.process;

/**
 * The Process page hero: a film of finished Haley homes, filling the screen, built from Haley's
 * professional photography with slow camera moves (scripts/hero_film.py) and rendered twice,
 * 1920x1080 and 1080x1920, so each screen shape plays a version framed for it. A 30% overlay
 * and a gradient rising from the bottom hold the headline, set low on the left as on Home.
 */
export function ProcessHero() {
  const reduced = useReducedMotion();
  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white lg:h-[100vh]"
      data-testid="process-hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <HeroVideo
          wide={{ src: '/video/hero-wide.mp4', poster: '/video/hero-poster.jpg' }}
          tall={{ src: '/video/hero-tall.mp4', poster: '/video/hero-poster-tall.jpg' }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/30 to-black/70 lg:h-1/2 lg:via-black/10 lg:to-black/50" />
      </div>

      <motion.div
        className="section-x absolute inset-x-0 bottom-[max(2.5rem,env(safe-area-inset-bottom))] text-center lg:bottom-16 lg:text-left"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="label text-white/85">{intro.eyebrow}</p>
        <h1 className="mx-auto mt-5 max-w-[14em] font-serif text-hero font-normal lg:mx-0">
          {intro.headline}
        </h1>
        <p className="mx-auto mt-8 max-w-text text-body text-white/90 lg:mx-0">
          {intro.supporting}
        </p>
      </motion.div>
    </section>
  );
}
