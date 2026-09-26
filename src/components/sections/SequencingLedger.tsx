'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';
import { EarlyMoveInMarker } from './EarlyMoveInMarker';
import { HandStrike } from './HandStrike';

const ACCENT = '#7A6250';
const INK_40 = 'rgba(26, 24, 21, 0.4)';

/**
 * State mark, hand-drawn rather than rendered: a short left stroke and a longer right one
 * (unequal lengths), the vertex sitting a few degrees off a mathematically centered angle.
 * (A literal 130-degree, left-longer mark read as a smile at this size, so the angle is
 * closed to ~98 degrees while keeping the hand-drawn asymmetry.) Unchecked: an ink-at-40% circle
 * outline. Checked: the outline turns solid accent (still unfilled) and the accent strokes
 * draw in inside it, left 150ms then right 150ms.
 */
function CheckMark({ checked, instant }: { checked: boolean; instant: boolean }) {
  const t = (delay: number) => ({
    duration: instant ? 0 : 0.15,
    delay: instant ? 0 : delay,
    ease: EASE,
  });
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <motion.circle
        cx="10"
        cy="10"
        r="9.25"
        strokeWidth="1"
        initial={false}
        animate={{ stroke: checked ? ACCENT : INK_40 }}
        transition={{ duration: instant ? 0 : 0.3, ease: EASE }}
      />
      <motion.path
        d="M5.6 10.4L8.6 13.5"
        stroke={ACCENT}
        strokeWidth="1.35"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={t(0)}
      />
      <motion.path
        d="M8.6 13.5L14.4 6.9"
        stroke={ACCENT}
        strokeWidth="1.35"
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
  reduced: boolean;
  spacious: boolean;
}

function LedgerRow({ index, name, annotation, reduced, spacious }: RowProps) {
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

    // The section pins (and is then covered) once its bottom reaches the viewport bottom, so
    // rows near its end may never reach the 60% line. When the section has scrolled to its
    // end, any row still unchecked but on screen checks in turn, in list order.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      const pin = el.closest('[data-pinned="true"]');
      if (!pin || timer) return;
      const end = pin.getBoundingClientRect().bottom <= window.innerHeight + 2;
      if (end && el.getBoundingClientRect().bottom <= window.innerHeight) {
        timer = setTimeout(() => setChecked(true), index * 140);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [reduced, checked, index]);

  const rowBody = (
    <div
      className={`grid grid-cols-[3.25rem_1fr] items-start gap-x-4 @2xl:grid-cols-[5rem_minmax(10rem,13rem)_auto_1fr] @2xl:gap-x-6 ${
        spacious ? 'py-9 @2xl:py-12' : 'py-6 @2xl:py-8'
      }`}
    >
      {/* Folio number on the spine. The bone backing interrupts the spine behind each numeral. */}
      <p
        className="relative z-10 row-span-2 justify-self-center bg-bone py-1 font-serif leading-none text-ink/50 @2xl:row-span-1"
        style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
      >
        {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="pt-1 text-body font-bold leading-snug text-ink @2xl:pt-2">{name}</h3>
      {/* In a narrow container the check and annotation share a row under the name; wider, they are grid columns. */}
      <div className="col-start-2 mt-3 flex items-start gap-4 @2xl:contents">
        <span className="shrink-0 @2xl:col-start-3 @2xl:row-start-1 @2xl:pt-2">
          <CheckMark checked={done} instant={reduced} />
        </span>
        <p className="text-label italic text-ink/[0.65] @2xl:col-start-4 @2xl:row-start-1 @2xl:pt-2.5">
          <HandStrike struck={done} instant={reduced} delay={0.3} seed={index * 13 + 5}>
            {annotation}
          </HandStrike>
        </p>
      </div>
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
 * its check draws in and the wait a typical build risks at that phase is struck through by
 * hand. A 1px accent spine runs behind the numeral column from row 1 to row 6. Beneath the
 * Move-In row sits the Early Move-In Marker. `spacious` (Process) adds ~50% row spacing.
 */
export function SequencingLedger({ spacious = false }: { spacious?: boolean }) {
  const reduced = useReducedMotion();
  const { rows } = copy.ledger;
  return (
    <div className="@container" data-testid="sequencing-ledger">
      <div className="relative">
        {/* The spine: centered on the numeral column, from the first numeral to the last. */}
        <span
          aria-hidden="true"
          className={`absolute left-[1.625rem] w-px bg-accent @2xl:left-[2.5rem] ${
            spacious
              ? 'bottom-12 top-11 @2xl:bottom-16 @2xl:top-14'
              : 'bottom-8 top-8 @2xl:bottom-10 @2xl:top-10'
          }`}
          data-testid="ledger-spine"
        />
        <ol className="relative">
          {rows.map((row, i) => (
            <LedgerRow
              key={row.name}
              index={i}
              name={row.name}
              annotation={row.annotation}
              reduced={reduced}
              spacious={spacious}
            />
          ))}
        </ol>
      </div>
      <EarlyMoveInMarker />
    </div>
  );
}
