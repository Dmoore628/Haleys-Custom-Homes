'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const DAYS = 30;
const EXPECTED = 24; // four-fifths of the way along the strip
const ACTUAL = EXPECTED - 6; // one-fifth of the strip earlier: about a month
const pct = (day: number) => `${((day + 0.5) / DAYS) * 100}%`;

/** A small flag on a pole, single-stroke, drawn in currentColor. */
function Flag({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden="true">
      <path d="M1.5 21V1.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M1.5 2h10l-2.6 3.4L11.5 9h-10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

/**
 * The Early Move-In Marker (Sequencing Ledger spec, section 8), directly beneath the Move-In row.
 * A single-stroke calendar strip of 30 day-tiles. The "Expected" flag sits four-fifths along;
 * a second flag starts on top of it and, once scrolled into view, slides about a month
 * earlier (900ms), where "Move-In" fades in. Hovering or focusing the strip replays it.
 * Beside it (below on narrow screens): the McDonalds' own words at pull-quote scale.
 */
export function EarlyMoveInMarker() {
  const { moveIn } = copy;
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const flag = useAnimationControls();
  const label = useAnimationControls();
  const [played, setPlayed] = useState(false);
  const busy = useRef(false);

  const play = async () => {
    if (reduced || busy.current) return;
    busy.current = true;
    label.set({ opacity: 0 });
    flag.set({ left: pct(EXPECTED) });
    await flag.start({ left: pct(ACTUAL), transition: { duration: 0.9, ease: EASE } });
    await label.start({ opacity: 1, transition: { duration: 0.3, ease: EASE } });
    busy.current = false;
    setPlayed(true);
  };

  useEffect(() => {
    if (reduced) {
      flag.set({ left: pct(ACTUAL) });
      label.set({ opacity: 1 });
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void play();
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
    // play is stable enough for a one-time observer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      className="grid grid-cols-1 gap-10 pb-2 pt-8 @2xl:grid-cols-12 @2xl:items-center @2xl:gap-x-grid"
      data-testid="early-move-in"
      data-played={played || reduced}
    >
      <button
        ref={ref}
        type="button"
        onMouseEnter={() => void play()}
        onFocus={() => void play()}
        onClick={() => void play()}
        aria-label={moveIn.calendarLabel}
        className="relative block w-full pb-16 pt-8 text-left @2xl:col-span-7"
      >
        {/* Day tiles */}
        <span className="flex w-full" aria-hidden="true">
          {Array.from({ length: DAYS }, (_, i) => (
            <span
              key={i}
              className={`h-5 flex-1 border-y border-l border-ink/40 last:border-r ${
                i === EXPECTED || i === ACTUAL ? 'bg-ink/[0.06]' : ''
              }`}
            />
          ))}
        </span>

        {/* Expected: accent outline flag with its label beneath the strip */}
        <span
          aria-hidden="true"
          className="absolute top-0 -translate-x-[1.5px] text-accent"
          style={{ left: pct(EXPECTED) }}
        >
          <Flag filled={false} />
        </span>
        <span
          aria-hidden="true"
          className="label absolute bottom-1 -translate-x-1/2 whitespace-nowrap text-ink/70"
          style={{ left: pct(EXPECTED) }}
        >
          {moveIn.expected}
        </span>

        {/* The moving marker: starts on top of Expected, settles a month earlier */}
        <motion.span
          aria-hidden="true"
          className="absolute top-0 -translate-x-[1.5px] text-accent"
          initial={{ left: reduced ? pct(ACTUAL) : pct(EXPECTED) }}
          animate={flag}
        >
          <Flag filled />
        </motion.span>
        <motion.span
          aria-hidden="true"
          className="label absolute bottom-7 -translate-x-1/2 whitespace-nowrap text-accent"
          style={{ left: pct(ACTUAL) }}
          initial={{ opacity: reduced ? 1 : 0 }}
          animate={label}
        >
          {moveIn.actual}
        </motion.span>
      </button>

      <figure className="text-center @2xl:col-span-5">
        <blockquote className="font-serif text-statement italic">
          &ldquo;{moveIn.quote}&rdquo;
        </blockquote>
        <figcaption className="label mt-4">{moveIn.attribution}</figcaption>
      </figure>
    </div>
  );
}
