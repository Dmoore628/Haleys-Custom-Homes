'use client';

import { motion } from 'framer-motion';
import { EASE, REVEAL_VIEWPORT } from '@/lib/animation';

/**
 * The Signature Text Treatment. Used exactly once on the site: the Home positioning
 * statement. Each word's opacity animates 0 to 1 in sequence, ~40ms apart, as it scrolls in.
 */
export function WordReveal({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.h2
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={{ staggerChildren: 0.04 }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.h2>
  );
}
