'use client';

import { motion, useScroll } from 'framer-motion';

/** A 2px accent line across the top of the viewport that fills with page scroll progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[75] h-0.5 origin-left bg-accent"
      style={{ scaleX: scrollYProgress }}
      data-testid="scroll-progress"
    />
  );
}
