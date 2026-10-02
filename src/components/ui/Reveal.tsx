'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DURATION, REVEAL_VIEWPORT, revealVariants, transition } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Tag = 'div' | 'section' | 'li' | 'p' | 'h2' | 'figure' | 'span';

interface RevealProps {
  children: ReactNode;
  as?: Tag;
  delay?: number;
  className?: string;
  id?: string;
  /** data-* attributes (test ids, state) pass through to the element. */
  [data: `data-${string}`]: string | number | boolean | undefined;
}

/** Standard scroll reveal: opacity 0 to 1, translateY 24px to 0, 600ms, once at ~20% visibility. */
export function Reveal({ children, as = 'div', delay = 0, className, id, ...data }: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      {...data}
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={revealVariants(reduced)}
      transition={transition(DURATION.reveal, delay)}
    >
      {children}
    </Component>
  );
}
