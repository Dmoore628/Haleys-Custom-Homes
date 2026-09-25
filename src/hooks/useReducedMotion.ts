'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/** True when the visitor has prefers-reduced-motion enabled. */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
