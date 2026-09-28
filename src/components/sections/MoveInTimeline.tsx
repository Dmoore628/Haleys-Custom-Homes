'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { rows } = copy.ledger;
const { moveIn } = copy;
const STAGES = rows.map((row, i) => ({ name: row.name, milestones: moveIn.milestones[i] }));

/** Move-in lands here on the horizontal line; the scheduled date sits at the far end. */
const MOVED = 0.86;
const SEG = MOVED / STAGES.length;
/** Seconds to glide between stops, and to hold at each. */
const GLIDE = 0.62;
const HOLD = 0.42;

/**
 * Stops along the line, in order: 0 is the start, then every milestone, then move-in.
 * `at` is the horizontal position (0 to 1) on the wide layout.
 */
const STOPS: { at: number; stage: number; label: string | null }[] = [
  { at: 0, stage: 0, label: null },
];
STAGES.forEach((stage, s) => {
  stage.milestones.forEach((label, k) => {
    STOPS.push({ at: s * SEG + ((k + 1) / (stage.milestones.length + 1)) * SEG, stage: s, label });
  });
});
STOPS.push({ at: MOVED, stage: STAGES.length - 1, label: null });
const LAST = STOPS.length - 1;
const firstStopOf = (s: number) => STOPS.findIndex((st) => st.stage === s && st.label);

/** Piecewise-linear lookup of stop index (fractional) into a list of coordinates. */
function along(values: number[], p: number) {
  const i = Math.max(0, Math.min(values.length - 2, Math.floor(p)));
  const t = Math.max(0, Math.min(1, p - i));
  return values[i] + (values[i + 1] - values[i]) * t;
}

/**
 * The payoff of the punch list: an illustrative build schedule. The six stages sit under the
 * line, each with two example milestones. When it comes into view a dot works through the
 * schedule one milestone at a time, gliding to each, pausing, and lighting it, so the
 * sequencing reads in order. It comes to rest at move-in, short of the scheduled date, and a
 * bracket closes the gap: one month early. Beneath, the family it happened to, in their own
 * words. Wide screens run it left to right; narrower screens run it top to bottom. Reduced
 * motion shows the finished schedule.
 */
export function MoveInTimeline() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const p = useMotionValue(reduced ? LAST : 0);
  const [reached, setReached] = useState(reduced ? LAST : 0);
  const arrived = reached >= LAST;

  useMotionValueEvent(p, 'change', (v) => setReached(Math.floor(v + 0.001)));

  useEffect(() => {
    if (reduced) {
      p.set(LAST);
      setReached(LAST);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    let current: ReturnType<typeof animate> | undefined;
    const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
    (async () => {
      await wait(0.4);
      for (let k = 1; k <= LAST && !cancelled; k++) {
        current = animate(p, k, { duration: GLIDE, ease: [0.45, 0, 0.25, 1] });
        await current;
        if (k < LAST) await wait(HOLD);
      }
    })();
    return () => {
      cancelled = true;
      current?.stop();
    };
  }, [inView, reduced, p]);

  return (
    <figure ref={ref} data-testid="move-in-timeline" data-arrived={arrived}>
      <p className="sr-only">{moveIn.label}</p>
      <p className="label text-ink/70">{moveIn.sequenceNote}</p>

      <Horizontal p={p} reached={reached} arrived={arrived} reduced={reduced} />
      <Vertical p={p} reached={reached} arrived={arrived} reduced={reduced} />

      {/* In their words. */}
      <motion.figcaption
        className="mt-14 max-w-[46rem] border-l-2 border-accent pl-6"
        initial={false}
        animate={{ opacity: arrived ? 1 : 0.0001, y: arrived ? 0 : 10 }}
        transition={{ duration: 0.9, delay: reduced ? 0 : 0.7, ease: EASE }}
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

interface LayoutProps {
  p: MotionValue<number>;
  reached: number;
  arrived: boolean;
  reduced: boolean;
}

/** A milestone line of text: faint until the dot reaches it, then full ink. */
function Milestone({ label, lit }: { label: string; lit: boolean }) {
  return (
    <span
      className={`block text-[0.875rem] leading-snug transition-colors duration-700 ease-brand ${
        lit ? 'text-ink' : 'text-ink/35'
      }`}
    >
      {label}
    </span>
  );
}

function Dot({ arrived, reduced }: { arrived: boolean; reduced: boolean }) {
  return (
    <span className="relative block h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(122,98,80,0.16)]">
      {arrived && !reduced && (
        <span className="punch-breathe absolute -inset-[7px] rounded-full border border-accent" />
      )}
    </span>
  );
}

/** Wide screens: the line left to right, stages as columns beneath it. */
function Horizontal({ p, reached, arrived, reduced }: LayoutProps) {
  const xs = STOPS.map((s) => s.at);
  const x = useTransform(p, (v) => along(xs, v));
  const left = useTransform(x, (v) => `${v * 100}%`);

  return (
    <div className="relative mt-10 hidden xl:block" aria-hidden="true">
      {/* Above the line: the scheduled date, then "Moved in" when the dot arrives. */}
      <div className="relative h-[5.5rem]">
        <span className="label absolute right-0 top-0 whitespace-nowrap text-ink/70">
          {moveIn.scheduled}
        </span>
        <motion.span
          className="absolute bottom-3 whitespace-nowrap font-serif text-[2rem] leading-none text-ink"
          style={{ right: `${(1 - MOVED) * 100}%` }}
          initial={false}
          animate={{ opacity: arrived ? 1 : 0, y: arrived ? 0 : 8 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {moveIn.moved}
        </motion.span>
      </div>

      {/* The line. */}
      <div className="relative h-px">
        <div className="absolute inset-0 bg-ink/15" />
        <motion.div
          className="absolute left-0 top-[-0.5px] h-[2px] w-full origin-left bg-accent"
          style={{ scaleX: x }}
        />
        {/* Stage boundaries: short upright marks. */}
        {STAGES.map((_, s) => (
          <span
            key={`b${s}`}
            className={`absolute top-1/2 h-4 w-px -translate-y-1/2 transition-colors duration-500 ${
              reached >= firstStopOf(s) ? 'bg-accent' : 'bg-ink/30'
            }`}
            style={{ left: `${s * SEG * 100}%` }}
          />
        ))}
        {/* Milestones: small rings that fill when reached. */}
        {STOPS.map((st, i) =>
          st.label ? (
            <span
              key={i}
              className={`absolute top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-500 ${
                reached >= i ? 'border-accent bg-accent' : 'border-ink/35 bg-bone'
              }`}
              style={{ left: `${st.at * 100}%` }}
            />
          ) : null,
        )}
        {/* The scheduled date: a hollow ring at the end. */}
        <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full border border-ink/50 bg-bone" />
        <motion.span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left }}
        >
          <Dot arrived={arrived} reduced={reduced} />
        </motion.span>
      </div>

      {/* Below the line: the six stages and their milestones, then the gap to the date. */}
      <div className="relative mt-8 min-h-[9.5rem]">
        {STAGES.map((stage, s) => {
          const lit = reached >= firstStopOf(s);
          const firstIdx = firstStopOf(s);
          return (
            <div
              key={stage.name}
              className="absolute top-0 pr-5"
              style={{ left: `${s * SEG * 100}%`, width: `${SEG * 100}%` }}
            >
              <p
                className={`flex min-h-[2.9em] items-baseline gap-2 transition-colors duration-500 ${lit ? 'text-ink' : 'text-ink/45'}`}
              >
                <span className="font-serif text-[1rem] tabular-nums">
                  {String(s + 1).padStart(2, '0')}
                </span>
                <span className="label leading-snug">{stage.name}</span>
              </p>
              <div className="mt-3 space-y-2.5">
                {stage.milestones.map((m, k) => (
                  <Milestone key={m} label={m} lit={reached >= firstIdx + k} />
                ))}
              </div>
            </div>
          );
        })}
        <Gap arrived={arrived} reduced={reduced} />
      </div>
    </div>
  );
}

/** The bracket from move-in to the scheduled date: one month early. */
function Gap({ arrived, reduced }: { arrived: boolean; reduced: boolean }) {
  return (
    <div className="absolute right-0 top-[-1.5rem]" style={{ left: `${MOVED * 100}%` }}>
      <motion.div
        className="h-2 origin-left border-x border-b border-accent"
        initial={false}
        animate={{ scaleX: arrived ? 1 : 0, opacity: arrived ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
      />
      <motion.p
        className="mt-4 text-right font-serif text-[1.375rem] italic leading-tight text-accent"
        initial={false}
        animate={{ opacity: arrived ? 1 : 0, y: arrived ? 0 : 6 }}
        transition={{ duration: 0.7, delay: reduced ? 0 : 0.4, ease: EASE }}
      >
        {moveIn.early}
      </motion.p>
    </div>
  );
}

/** Narrower screens: the same schedule top to bottom, the dot travelling down a rail. */
function Vertical({ p, reached, arrived, reduced }: LayoutProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [ys, setYs] = useState<number[]>(STOPS.map((_, i) => i * 40));
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const top = list.getBoundingClientRect().top;
      const next = STOPS.map((_, i) => {
        const el = list.querySelector<HTMLElement>(`[data-stop="${i}"]`);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top - top + Math.min(r.height / 2, 11);
      });
      setYs(next);
      setHeight(list.offsetHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  const y = useTransform(p, (v) => along(ys, v));
  const fill = useTransform(y, (v) => (height ? v / height : 0));

  return (
    <div className="relative mt-8 xl:hidden" aria-hidden="true">
      <div ref={listRef} className="relative pl-9">
        {/* The rail, and its travelled length. */}
        <div className="absolute bottom-0 left-[6px] top-0 w-px bg-ink/15" />
        <motion.div
          className="absolute left-[5.5px] top-0 h-full w-[2px] origin-top bg-accent"
          style={{ scaleY: fill }}
        />
        <span data-stop={0} className="block h-0" />
        {STAGES.map((stage, s) => {
          const lit = reached >= firstStopOf(s);
          const firstIdx = firstStopOf(s);
          return (
            <div key={stage.name} className="pb-7">
              <p
                className={`flex items-baseline gap-2 transition-colors duration-500 ${lit ? 'text-ink' : 'text-ink/45'}`}
              >
                <span className="font-serif text-[1rem] tabular-nums">
                  {String(s + 1).padStart(2, '0')}
                </span>
                <span className="label">{stage.name}</span>
              </p>
              <div className="mt-3 space-y-2.5">
                {stage.milestones.map((m, k) => (
                  <div key={m} data-stop={firstIdx + k} className="relative">
                    <span
                      className={`absolute -left-9 top-[0.45em] ml-[3px] h-[7px] w-[7px] rounded-full border transition-colors duration-500 ${
                        reached >= firstIdx + k
                          ? 'border-accent bg-accent'
                          : 'border-ink/35 bg-bone'
                      }`}
                    />
                    <Milestone label={m} lit={reached >= firstIdx + k} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div data-stop={LAST} className="relative">
          <motion.p
            className="font-serif text-[1.75rem] leading-none text-ink"
            initial={false}
            animate={{ opacity: arrived ? 1 : 0.25 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {moveIn.moved}
          </motion.p>
        </div>
        <div className="relative mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 pb-1">
          <span className="absolute -left-9 top-1/2 ml-[0.5px] h-3 w-3 -translate-y-1/2 rounded-full border border-ink/50 bg-bone" />
          <span className="label text-ink/70">{moveIn.scheduled}</span>
          <motion.span
            className="font-serif text-[1.125rem] italic text-accent"
            initial={false}
            animate={{ opacity: arrived ? 1 : 0 }}
            transition={{ duration: 0.7, delay: reduced ? 0 : 0.4, ease: EASE }}
          >
            · {moveIn.early}
          </motion.span>
        </div>
        <motion.span className="absolute left-[6.5px] top-0" style={{ y }}>
          <span className="block -translate-x-1/2 -translate-y-1/2">
            <Dot arrived={arrived} reduced={reduced} />
          </span>
        </motion.span>
      </div>
    </div>
  );
}
