'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/*
 * Signature Motion Accents 2 and 3 of exactly three (the third is the Home positioning
 * statement's quotation mark). Single-stroke line art of real building-trade tools, each used
 * once, sized clamp(8rem, 14vw, 16rem), ink at 9%, static at rest, animating once on first view.
 */

const SIZE = 'clamp(8rem, 14vw, 16rem)';

/**
 * Process page: a carpenter's framing square. The long blade stands vertical with inch
 * graduations; the tongue runs along the bottom. On first view an accent tick travels up the
 * blade's long edge from the heel (corner) to the tip in 700ms, then holds.
 */
export function FramingSquare() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const blade = Array.from({ length: 13 }, (_, i) => 140 - i * 10);
  const tongue = Array.from({ length: 8 }, (_, i) => 26 + i * 10);
  return (
    <svg
      ref={ref}
      viewBox="0 0 110 160"
      fill="none"
      aria-hidden="true"
      style={{ height: SIZE, width: 'auto' }}
      data-testid="accent-framing-square"
      data-played={inView || reduced}
    >
      <g stroke="rgba(26, 24, 21, 0.09)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path d="M4 4h14v138h88v14H4z" strokeLinejoin="miter" />
        {blade.map((y, i) => (
          <path key={`b${y}`} d={`M18 ${y}h${i % 2 ? -4 : -7}`} />
        ))}
        {tongue.map((x, i) => (
          <path key={`t${x}`} d={`M${x} 142v${i % 2 ? 4 : 7}`} />
        ))}
      </g>
      {/* The traveling tick, on the blade's outer (long) edge. */}
      <motion.path
        d="M1 0h6"
        stroke="#7A6250"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ y: reduced ? 4 : 156 }}
        animate={inView || reduced ? { y: 4 } : { y: 156 }}
        transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
      />
    </svg>
  );
}

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
