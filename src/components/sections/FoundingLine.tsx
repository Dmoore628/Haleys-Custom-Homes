'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SmartImage } from '@/components/ui/SmartImage';

const FOUNDED = 1998;

/**
 * The founding line drawn rather than restated: the founder's portrait at 1998, a rule that
 * draws out to the present with a tick for every year (taller every fifth), and a node at the
 * present. The year figures are the only text. It draws once on scroll into view, then rests.
 */
export function FoundingLine() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const play = reduced || inView;
  const now = new Date().getFullYear();
  const years = now - FOUNDED;
  const ticks = Array.from({ length: years + 1 }, (_, i) => i);
  const DRAW = 1.8;

  return (
    <div ref={ref} className="flex items-center gap-4" data-testid="founding-line">
      <motion.span
        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-accent ring-offset-4 ring-offset-bone"
        initial={reduced ? false : { opacity: 0, scale: 0.8 }}
        animate={play ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <SmartImage
          src={copy.about.founder.image}
          alt=""
          fill
          sizes="56px"
          quality={90}
          className="object-cover object-[50%_12%]"
        />
      </motion.span>

      <div className="relative min-w-0 flex-1 pt-6">
        <div className="label absolute inset-x-0 top-0 flex justify-between tabular-nums text-ink/70">
          <motion.span
            initial={reduced ? false : { opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {FOUNDED}
          </motion.span>
          <motion.span
            suppressHydrationWarning
            className="text-accent"
            initial={reduced ? false : { opacity: 0 }}
            animate={play ? { opacity: 1 } : undefined}
            transition={{ delay: DRAW, duration: 0.6 }}
          >
            {now}
          </motion.span>
        </div>
        <svg
          viewBox={`0 0 ${years * 10 + 12} 24`}
          preserveAspectRatio="none"
          className="h-6 w-full overflow-visible"
          aria-hidden="true"
        >
          {ticks.map((i) => {
            const tall = i % 5 === 0 || i === years;
            return (
              <motion.line
                key={i}
                x1={i * 10 + 1}
                x2={i * 10 + 1}
                y1={tall ? 4 : 8}
                y2={12}
                stroke="#7A6250"
                strokeOpacity={tall ? 0.9 : 0.45}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                initial={reduced ? false : { opacity: 0 }}
                animate={play ? { opacity: 1 } : undefined}
                transition={{ delay: 0.3 + (i / years) * DRAW, duration: 0.25 }}
              />
            );
          })}
          <motion.line
            x1="1"
            x2={years * 10 + 1}
            y1="12"
            y2="12"
            stroke="#1A1815"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0 }}
            animate={play ? { pathLength: 1 } : undefined}
            transition={{ delay: 0.3, duration: DRAW, ease: EASE }}
          />
        </svg>
        <span
          className="absolute right-0 top-[calc(1.5rem+12px)] -translate-y-1/2 translate-x-1/2"
          aria-hidden="true"
        >
          <motion.span
            className="block h-2.5 w-2.5 bg-accent"
            initial={reduced ? { rotate: 45 } : { opacity: 0, scale: 0, rotate: 45 }}
            animate={play ? { opacity: 1, scale: 1, rotate: 45 } : undefined}
            transition={{ delay: 0.3 + DRAW, duration: 0.5, ease: EASE }}
          />
        </span>
      </div>
    </div>
  );
}
