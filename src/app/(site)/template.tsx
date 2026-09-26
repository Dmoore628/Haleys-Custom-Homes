'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { DURATION, EASE } from '@/lib/animation';
import { PageFrame } from '@/components/layout/PageFrame';

/** Route change: a 300ms opacity cross-fade. No slides, no wipes. */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.pageFade, ease: EASE }}
    >
      <PageFrame>{children}</PageFrame>
    </motion.div>
  );
}
