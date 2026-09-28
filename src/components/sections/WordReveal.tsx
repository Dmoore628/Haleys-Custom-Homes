'use client';

import { motion } from 'framer-motion';
import { EASE, REVEAL_VIEWPORT } from '@/lib/animation';

/**
 * The Signature Text Treatment. Used exactly once on the site: the Home positioning
 * statement. Each word's opacity animates 0 to 1 in sequence, ~40ms apart, as it scrolls in.
 */
export function WordReveal({
  text,
  highlight,
  id,
  className = '',
}: {
  text: string;
  id?: string;
  /** A phrase within `text` set in the accent color (its first occurrence). */
  highlight?: string;
  className?: string;
}) {
  const words = text.split(' ');
  const hl = highlight ? highlight.split(' ') : [];
  const start = hl.length ? words.findIndex((_, i) => hl.every((h, j) => words[i + j] === h)) : -1;
  const isAccent = (i: number) => start >= 0 && i >= start && i < start + hl.length;
  // Words grouped by sentence, keeping each word's index in the whole text.
  const sentences: { word: string; i: number }[][] = [[]];
  words.forEach((word, i) => {
    sentences[sentences.length - 1].push({ word, i });
    if (/[.!?]$/.test(word) && i < words.length - 1) sentences.push([]);
  });
  return (
    <motion.h2
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      transition={{ staggerChildren: 0.04 }}
      aria-label={text}
    >
      {sentences.map((sentence, si) => (
        // One sentence per line, each wrapped balanced, so no line breaks mid-thought.
        <span key={si} className="block [text-wrap:balance]">
          {sentence.map(({ word, i }) => (
            <motion.span
              key={`${word}-${i}`}
              aria-hidden="true"
              className={isAccent(i) ? 'inline text-accent' : 'inline'}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h2>
  );
}
