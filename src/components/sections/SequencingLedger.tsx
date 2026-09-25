'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';

const ACCENT = '#7A6250';
const INK_40 = 'rgba(26, 24, 21, 0.4)';

/**
 * Functional state mark: a 1px circle holding a two-stroke check (strokes meet at ~127deg).
 * Unchecked: ink-at-40% outline, no strokes. Checked: outline turns solid accent (still
 * unfilled) and the accent strokes draw in, left 150ms then right 150ms.
 */
function CheckMark({ checked, instant }: { checked: boolean; instant: boolean }) {
  const t = (delay: number) => ({
    duration: instant ? 0 : 0.15,
    delay: instant ? 0 : delay,
    ease: EASE,
  });
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <motion.circle
        cx="10"
        cy="10"
        r="9.5"
        strokeWidth="1"
        initial={false}
        animate={{ stroke: checked ? ACCENT : INK_40 }}
        transition={{ duration: instant ? 0 : 0.3, ease: EASE }}
      />
      <motion.path
        d="M5.5 11L8.5 12.5"
        stroke={ACCENT}
        strokeWidth="1.25"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={t(0)}
      />
      <motion.path
        d="M8.5 12.5L14.5 9.5"
        stroke={ACCENT}
        strokeWidth="1.25"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={t(0.15)}
      />
    </svg>
  );
}

interface RowProps {
  index: number;
  name: string;
  annotation: string;
  supporting?: string;
  reduced: boolean;
  spacious: boolean;
}

function LedgerRow({ index, name, annotation, supporting, reduced, spacious }: RowProps) {
  const ref = useRef<HTMLLIElement>(null);
  const [checked, setChecked] = useState(false);
  const done = reduced || checked;

  // Trigger once when the row crosses 60% up the viewport (40% from the top). Never resets.
  useEffect(() => {
    if (reduced || checked) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setChecked(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -60% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, checked]);

  const rowBody = (
    <div
      className={`grid grid-cols-[auto_1fr] items-baseline gap-x-5 gap-y-3 md:grid-cols-[5.5rem_minmax(10rem,13rem)_auto_1fr] md:gap-x-6 ${
        spacious ? 'py-9 md:py-12' : 'py-6 md:py-8'
      }`}
    >
      {/* Spec asks for ink at 40%; 62% is the lowest that meets WCAG AA (4.5:1) at this size. */}
      <p className="label text-ink/[0.62]">Phase {String(index + 1).padStart(2, '0')}</p>
      <h3 className="text-body font-bold text-ink">{name}</h3>
      <span className="self-center md:col-start-3 md:row-start-1">
        <CheckMark checked={done} instant={reduced} />
      </span>
      <p className="text-label italic text-ink/[0.65] md:col-start-4 md:row-start-1">
        {/* Strikethrough draws left to right after the check completes; text never fades. */}
        <span
          className="bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(${INK_40}, ${INK_40})`,
            backgroundPosition: '0 55%',
            backgroundSize: done ? '100% 1px' : '0% 1px',
            transition: reduced
              ? 'none'
              : 'background-size 200ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
          }}
          data-struck={done}
        >
          {annotation}
        </span>
      </p>
      {supporting && (
        <p className="col-span-2 text-body text-ink md:col-span-1 md:col-start-4">{supporting}</p>
      )}
    </div>
  );

  return (
    <li
      ref={ref}
      className="border-b border-ink/10 last:border-b-0"
      data-testid="ledger-row"
      data-checked={done}
    >
      {reduced ? rowBody : <Reveal>{rowBody}</Reveal>}
    </li>
  );
}

/**
 * The Sequencing Ledger: a punch list of the six real phases. As each row crosses the viewport,
 * its check draws in and the wait a typical build risks at that phase is struck through.
 * `spacious` (Process page) adds roughly 50% more space between rows than the Home version.
 */
export function SequencingLedger({ spacious = false }: { spacious?: boolean }) {
  const reduced = useReducedMotion();
  const { rows, supporting } = copy.ledger;
  return (
    <ol data-testid="sequencing-ledger">
      {rows.map((row, i) => (
        <LedgerRow
          key={row.name}
          index={i}
          name={row.name}
          annotation={row.annotation}
          supporting={i === rows.length - 1 ? supporting : undefined}
          reduced={reduced}
          spacious={spacious}
        />
      ))}
    </ol>
  );
}
