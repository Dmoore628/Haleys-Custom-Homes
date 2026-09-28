'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Signature Motion Accent: single-stroke line art of a real building-trade tool, used once,
 * sized clamp(8rem, 14vw, 16rem), ink at 9%, static at rest, animating once on first view.
 * (The Process page's framing square was replaced by the drawn elevation in ProcessHero.)
 */

const SIZE = 'clamp(8rem, 14vw, 16rem)';

/**
 * About page: a plumb bob on its line. At rest it hangs slightly off true vertical (7deg);
 * on first view it swings through, overshoots a touch, and settles plumb over 900ms.
 */
export function PlumbBob() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const settled = inView || reduced;
  return (
    <svg
      ref={ref}
      viewBox="0 0 60 160"
      fill="none"
      aria-hidden="true"
      style={{ height: SIZE, width: 'auto', overflow: 'visible' }}
      data-testid="accent-plumb-bob"
      data-played={settled}
    >
      <motion.g
        stroke="rgba(26, 24, 21, 0.1)"
        strokeWidth="1"
        style={{ originX: '30px', originY: '2px' }}
        initial={{ rotate: reduced ? 0 : 7 }}
        animate={settled ? { rotate: reduced ? 0 : [7, -1.4, 0] } : { rotate: 7 }}
        transition={reduced ? { duration: 0 } : { duration: 0.9, times: [0, 0.72, 1], ease: EASE }}
      >
        <path d="M30 2v96" />
        <path d="M26 98h8v6h-8z" strokeLinejoin="round" />
        <path d="M22 104h16l-2 14L30 156l-6-38z" strokeLinejoin="round" />
        <path d="M24 118h12" />
      </motion.g>
    </svg>
  );
}
