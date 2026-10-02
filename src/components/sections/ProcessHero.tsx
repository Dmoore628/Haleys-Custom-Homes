'use client';

import { motion } from 'framer-motion';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SmartImage } from '@/components/ui/SmartImage';
import { AmbientVideo } from '@/components/ui/AmbientVideo';

const { intro } = copy.process;

/**
 * The Process page hero: a completed Haley home on film, filling the screen. The aerial circles
 * the lit house at dusk, then settles at the pool (the Timian flyover, 1280x720, seamless loop),
 * over its own twilight still, which is what shows under reduced motion and while the video
 * loads. A 30% overlay and a gradient rising from the bottom hold the headline, set low on the
 * left as on Home. The Process page's closing section uses a still of a different home, so the
 * footage appears once on the page.
 */
export function ProcessHero() {
  const reduced = useReducedMotion();
  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-white lg:h-[100vh]"
      data-testid="process-hero"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <SmartImage
          src="/images/sections/cta-twilight.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <AmbientVideo src="/video/cta-flyover.mp4" poster="/images/sections/cta-twilight.jpg" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-black/30 to-black/70 lg:h-1/2 lg:via-black/10 lg:to-black/50" />
      </div>

      <motion.div
        className="section-x absolute inset-x-0 bottom-[max(2.5rem,env(safe-area-inset-bottom))] lg:bottom-16"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <p className="label text-white/85">{intro.eyebrow}</p>
        <h1 className="mt-5 max-w-[14em] font-serif text-hero font-normal">{intro.headline}</h1>
        <p className="mt-8 max-w-text text-body text-white/90">{intro.supporting}</p>
      </motion.div>
    </section>
  );
}
