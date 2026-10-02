'use client';

import { motion } from 'framer-motion';
import copy from '@content/copy.config';
import { awards, press } from '@/lib/content';
import { EASE, REVEAL_VIEWPORT } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { MarkImage } from '@/components/ui/MarkImage';

/**
 * Home: recognition and press, as one composed section. Left, the eyebrow, a serif line and one
 * sentence of fact; right, the awards in a 2x2 grid of hairline cells, each mark over a short
 * caption. Beneath, an "As Seen In" band: the publications in muted ink, coming to full color
 * on hover. Every mark appears once, sized for optical balance; cells and marks rise in,
 * staggered, as they enter view.
 */
export function AwardsStrip() {
  const labels = copy.home.awards;
  const reduced = useReducedMotion();
  const rise = {
    hidden: { opacity: 0, y: reduced ? 0 : 16 },
    visible: { opacity: 1, y: 0 },
  };
  const recognized = awards.filter((a) => a.mark);

  return (
    <section
      className="section-x section-y bg-white"
      aria-labelledby="recognition-heading"
      data-testid="recognition"
    >
      <motion.div
        className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-grid lg:gap-y-0"
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        transition={{ staggerChildren: 0.08 }}
      >
        <motion.div
          className="text-center lg:col-span-4 lg:text-left"
          variants={rise}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Eyebrow>{labels.recognition}</Eyebrow>
          <h2 id="recognition-heading" className="mt-5 font-serif text-section font-normal">
            {labels.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-[26rem] text-body text-ink/75 lg:mx-0">
            {labels.supporting}
          </p>
        </motion.div>

        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-tile border border-ink/10 bg-ink/10 lg:col-span-7 lg:col-start-6">
          {recognized.map((a) => (
            <motion.li
              key={a.id}
              className="flex min-h-[clamp(11rem,18vw,14rem)] flex-col items-center justify-center gap-5 bg-white px-4 py-8 text-center"
              variants={rise}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="flex h-[clamp(64px,7vw,92px)] items-center justify-center">
                <MarkImage src={a.mark!} alt={a.markAlt} base="clamp(44px, 4.6vw, 64px)" />
              </div>
              <p className="label max-w-[14rem] leading-snug text-ink/65">{a.caption}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* The press, as a quiet band. */}
      <motion.div
        className="mt-[clamp(4rem,8vw,6.5rem)] border-t border-ink/10 pt-[clamp(2rem,4vw,3rem)]"
        initial="hidden"
        whileInView="visible"
        viewport={REVEAL_VIEWPORT}
        transition={{ staggerChildren: 0.07 }}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-grid">
          <motion.h2
            className="label shrink-0 text-center text-ink/60 lg:w-[9rem] lg:text-left"
            variants={rise}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {labels.asSeenIn}
          </motion.h2>
          <ul className="flex flex-1 flex-wrap items-center justify-center gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-8 lg:justify-between">
            {press.map((p) => (
              <motion.li
                key={p.id}
                className="opacity-70 grayscale transition duration-300 ease-brand hover:opacity-100 hover:grayscale-0"
                variants={rise}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <MarkImage src={p.mark} alt={p.name} base="clamp(30px, 3vw, 42px)" />
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
