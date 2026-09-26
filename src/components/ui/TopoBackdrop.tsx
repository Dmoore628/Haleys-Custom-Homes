'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { contourRing } from '@/lib/topo';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const FIELDS: { at: [number, number]; seed: number; rings: number }[] = [
  { at: [260, 260], seed: 0.7, rings: 9 },
  { at: [1380, 980], seed: 2.9, rings: 8 },
];

/**
 * Faint topographic contour lines behind a section, in ink at a few percent, drifting a little
 * slower than the page as it scrolls so the section reads in layers. Decorative only; static
 * under reduced motion.
 */
export function TopoBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-70, 70]);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <motion.svg
        viewBox="0 0 1600 1200"
        preserveAspectRatio="xMidYMid slice"
        className="absolute -inset-y-[70px] inset-x-0 h-[calc(100%+140px)] w-full text-ink"
        style={{ y }}
      >
        {FIELDS.map(({ at, seed, rings }) =>
          Array.from({ length: rings }, (_, k) => (
            <path
              key={`${seed}-${k}`}
              d={contourRing(at, 60 + k * 58, seed + k * 0.45, 1.3)}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity={0.075 - k * 0.006}
            />
          )),
        )}
      </motion.svg>
    </div>
  );
}
