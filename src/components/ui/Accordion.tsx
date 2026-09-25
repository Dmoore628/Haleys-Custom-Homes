'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import { EASE } from '@/lib/animation';
import type { FaqItem } from '@/lib/schema';

function PlusMark({ open }: { open: boolean }) {
  // Functional expand mark: rotates 45 degrees into an X when open, 200ms.
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-200 ease-brand"
      style={{ transform: open ? 'rotate(45deg)' : 'none' }}
    >
      <path d="M8 1v14M1 8h14" stroke="#1A1815" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

/** One row open at a time; auto-height expand, 300ms, the shared curve. */
export function Accordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const base = useId();
  return (
    <ul>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q-${i}`;
        const panelId = `${base}-a-${i}`;
        return (
          <li key={item.question} className="border-b border-ink/10">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-body text-ink"
              >
                {item.question}
                <PlusMark open={isOpen} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-body">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
