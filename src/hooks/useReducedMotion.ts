'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * True when the visitor has prefers-reduced-motion enabled. The server can't know the
 * preference, so this reports false until the page has hydrated and then the real value;
 * reading it during the first render would make the server and client markup disagree.
 */
export function useReducedMotion(): boolean {
  const prefers = useFramerReducedMotion() ?? false;
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && prefers;
}
