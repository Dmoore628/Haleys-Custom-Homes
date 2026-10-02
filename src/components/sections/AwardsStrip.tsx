'use client';

import { motion } from 'framer-motion';
import copy from '@content/copy.config';
import { awards, press } from '@/lib/content';
import { EASE, REVEAL_VIEWPORT } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MarkImage } from '@/components/ui/MarkImage';

/**
 * Recognition, in two evenly spaced tiers: the award and credential marks, then the
 * publications Haley has appeared in. Every mark appears once, in its own colors, balanced for
 * optical size. Each tier rises in as it enters view, marks staggered left to right.
 */
export function AwardsStrip() {
  const labels = copy.home.awards;
  const reduced = useReducedMotion();
  const tiers = [
    {
      label: labels.recognition,
      marks: awards.filter((a) => a.mark).map((a) => ({ id: a.id, src: a.mark!, alt: a.markAlt })),
    },
    { label: labels.asSeenIn, marks: press.map((p) => ({ id: p.id, src: p.mark, alt: p.name })) },
  ];
  return (
    <section
      className="section-x section-y bg-white"
      aria-label="Awards, recognition and press"
      data-testid="recognition"
    >
      <div className="mx-auto flex max-w-[76rem] flex-col gap-[clamp(3.5rem,7vw,6rem)]">
        {tiers.map((tier) => (
          <motion.div
            key={tier.label}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            transition={{ staggerChildren: 0.08 }}
          >
            <div className="flex items-center gap-6">
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
              <h2 className="label text-ink/70">{tier.label}</h2>
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
            </div>
            {/* A centered wrap, so any count sits balanced: an odd last row centers. */}
            <ul className="mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center justify-center gap-y-10">
              {tier.marks.map((m) => (
                <motion.li
                  key={m.id}
                  className={`flex basis-1/2 items-center justify-center px-[clamp(0.5rem,1vw,1rem)] ${
                    tier.marks.length >= 5 ? 'md:basis-1/3 xl:basis-1/5' : 'md:basis-1/4'
                  }`}
                  variants={{
                    hidden: { opacity: 0, y: reduced ? 0 : 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <MarkImage src={m.src} alt={m.alt} />
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
