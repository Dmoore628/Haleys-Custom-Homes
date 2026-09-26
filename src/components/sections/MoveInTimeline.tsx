'use client';

import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { rows } = copy.ledger;
const { moveIn } = copy;
/** Where move-in lands on the line; the scheduled date sits at the end. */
const MOVED = 0.82;
const TRAVEL_S = 5.6;
/** The six stages, evenly spaced from the start of the line to move-in. */
const STOPS = rows.map((_, i) => (i / (rows.length - 1)) * MOVED);

/**
 * The payoff of the punch list, drawn: a line from the first stage to the scheduled move-in
 * date. When it comes into view a dot travels the line, naming each stage above it as it
 * reaches it; it comes to rest at move-in, short of the scheduled date, and a bracket closes
 * the gap: one month early. Beneath, the family it happened to, in their own words.
 * Hovering or focusing a stage mark names it. Reduced motion shows the resting state.
 */
export function MoveInTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const progress = useMotionValue(reduced ? MOVED : 0);
  const [reached, setReached] = useState(reduced ? rows.length - 1 : -1);
  const [arrived, setArrived] = useState(reduced);
  const [hovered, setHovered] = useState<number | null>(null);

  useMotionValueEvent(progress, 'change', (v) => {
    let idx = -1;
    STOPS.forEach((s, i) => {
      if (v >= s - 0.001) idx = i;
    });
    setReached(idx);
  });

  useEffect(() => {
    if (reduced) {
      progress.set(MOVED);
      setReached(rows.length - 1);
      setArrived(true);
      return;
    }
    if (!inView) return;
    const controls = animate(progress, MOVED, {
      duration: TRAVEL_S,
      delay: 0.3,
      ease: [0.45, 0, 0.2, 1],
      onComplete: () => setArrived(true),
    });
    return () => controls.stop();
  }, [inView, reduced, progress]);

  const left = useTransform(progress, (v) => `${v * 100}%`);
  const fill = useTransform(progress, (v) => v);
  // The travelling caption slides from left-aligned at the start to right-aligned at the end,
  // so it never runs off either edge.
  const captionShift = useTransform(progress, (v) => `${-(v / MOVED) * 100}%`);

  const caption = arrived ? moveIn.moved : reached >= 0 ? rows[reached].name : '';

  return (
    <figure ref={ref} data-testid="move-in-timeline" data-arrived={arrived}>
      <p className="sr-only">{moveIn.label}</p>
      <div className="relative h-[9.5rem]">
        {/* Level 1: the travelling caption, then "Moved in". */}
        <motion.div className="absolute top-0" style={{ left }} aria-hidden="true">
          <motion.div className="whitespace-nowrap" style={{ x: captionShift }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={caption}
                className={`block ${
                  arrived
                    ? 'font-serif text-[clamp(1.5rem,3vw,2rem)] leading-none text-ink'
                    : 'label pt-3 text-ink/70'
                }`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: arrived ? 0.5 : 0.16, ease: EASE }}
              >
                {caption}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Level 2: the scheduled date's label, at the far end. */}
        <span className="label absolute right-0 top-[3.1rem] whitespace-nowrap text-ink/70">
          {moveIn.scheduled}
        </span>

        {/* The line: track, travelled length, stage marks, scheduled mark, the dot. */}
        <div className="absolute inset-x-0 top-[5.25rem]">
          <div className="h-px w-full bg-ink/20" />
          <motion.div
            className="absolute left-0 top-[-0.5px] h-[2px] w-full origin-left bg-accent"
            style={{ scaleX: fill }}
          />
          {STOPS.map((s, i) => (
            <button
              key={i}
              type="button"
              aria-label={rows[i].name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="absolute top-0 -translate-x-1/2 -translate-y-1/2 p-2"
              style={{ left: `${s * 100}%` }}
            >
              <span
                className={`block h-2 w-2 rounded-full border transition-colors duration-300 ${
                  i <= reached ? 'border-accent bg-accent' : 'border-ink/40 bg-bone'
                }`}
              />
              <AnimatePresence>
                {hovered === i && arrived && (
                  <motion.span
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="label pointer-events-none absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap text-ink/70"
                  >
                    {rows[i].name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
          {/* Scheduled move-in: a hollow ring at the end of the line. */}
          <span className="absolute right-0 top-0 block h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full border border-ink/50 bg-bone" />
          {/* The dot. */}
          <motion.span
            className="absolute top-0 -translate-x-1/2 -translate-y-1/2"
            style={{ left }}
            aria-hidden="true"
          >
            <span className="relative block h-4 w-4 rounded-full bg-accent shadow-[0_0_0_6px_rgba(122,98,80,0.18)]">
              {arrived && !reduced && (
                <span className="punch-breathe absolute -inset-[7px] rounded-full border border-accent" />
              )}
            </span>
          </motion.span>
        </div>

        {/* The gap, bracketed: one month early. */}
        <div
          className="absolute right-0 top-[6.25rem]"
          style={{ left: `${MOVED * 100}%` }}
          aria-hidden="true"
        >
          <motion.div
            className="h-2 origin-left border-x border-b border-accent"
            initial={false}
            animate={{ scaleX: arrived ? 1 : 0, opacity: arrived ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.7, ease: EASE }}
          />
          <motion.p
            className="absolute right-0 top-5 whitespace-nowrap font-serif text-[clamp(1.0625rem,1.8vw,1.375rem)] italic text-accent"
            initial={false}
            animate={{ opacity: arrived ? 1 : 0, y: arrived ? 0 : 6 }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 0.35, ease: EASE }}
          >
            {moveIn.early}
          </motion.p>
        </div>
      </div>

      {/* In their words. */}
      <motion.figcaption
        className="mt-12 max-w-[46rem] border-l-2 border-accent pl-6"
        initial={false}
        animate={{ opacity: arrived ? 1 : 0.0001, y: arrived ? 0 : 10 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 0.6, ease: EASE }}
      >
        <blockquote className="font-serif text-[clamp(1.25rem,2.2vw,1.75rem)] italic leading-snug text-ink">
          &ldquo;{moveIn.quote}&rdquo;
        </blockquote>
        <p className="label mt-5 text-ink">
          {moveIn.attribution}
          <span className="text-ink/70"> · {moveIn.projectType}</span>
        </p>
      </motion.figcaption>
    </figure>
  );
}
