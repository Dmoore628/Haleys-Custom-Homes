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
import { keepTogether } from '@/lib/text';
import { Sentences } from '@/components/ui/Sentences';

const { rows } = copy.ledger;
const { moveIn } = copy;
const STAGES = rows.map((row, i) => ({ name: row.name, milestones: moveIn.milestones[i] }));

/** Move-in: the end of the line. */
const MOVED = 1;
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
 * sequencing reads in order, and comes to rest at move-in. Beneath, a family who moved in a
 * month early, in their own words. Wide screens run it left to right; narrower screens run it
 * top to bottom. Reduced motion shows the finished schedule. `align="center"` centers the
 * label and the quote beneath the schedule.
 */
export function MoveInTimeline({ align = 'start' }: { align?: 'start' | 'center' }) {
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
      <p className={`label text-ink/70 ${align === 'center' ? 'text-center' : ''}`}>
        {moveIn.sequenceNote}
      </p>

      <Horizontal p={p} reached={reached} arrived={arrived} reduced={reduced} />
      <Vertical p={p} reached={reached} arrived={arrived} reduced={reduced} />
      <Centered p={p} reached={reached} arrived={arrived} reduced={reduced} />

      {/* In their words. */}
      <motion.figcaption
        className={
          align === 'center'
            ? 'mx-auto mt-16 max-w-[44rem] text-center'
            : 'mt-14 max-w-[46rem] border-l-2 border-accent pl-6'
        }
        initial={false}
        animate={{ opacity: arrived ? 1 : 0.0001, y: arrived ? 0 : 10 }}
        transition={{ duration: 0.9, delay: reduced ? 0 : 0.7, ease: EASE }}
      >
        <blockquote className="font-serif text-[clamp(1.25rem,2.2vw,1.75rem)] italic leading-snug text-ink">
          <Sentences text={`“${moveIn.quote}”`} />
        </blockquote>
        {align === 'center' && (
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-10 bg-accent" />
        )}
        <p className="label mt-5 text-ink">
          {moveIn.attribution}
          <span className="hidden text-ink/70 md:inline"> · </span>
          <span className="mt-1 block text-ink/70 md:mt-0 md:inline">{moveIn.projectType}</span>
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
      {keepTogether(label)}
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
      {/* Above the line: "Moved in", at the end, when the dot arrives. */}
      <div className="relative h-[3.75rem]">
        <motion.span
          className="absolute bottom-4 right-0 whitespace-nowrap font-serif text-[2rem] leading-none text-ink"
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
        {/* Move-in: the end mark, closing the last stage. */}
        <span
          className={`absolute right-0 top-1/2 h-4 w-px -translate-y-1/2 transition-colors duration-500 ${
            arrived ? 'bg-accent' : 'bg-ink/30'
          }`}
        />
        <motion.span
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left }}
        >
          <Dot arrived={arrived} reduced={reduced} />
        </motion.span>
      </div>

      {/* Below the line: the six stages and their milestones. */}
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
                <span className="label leading-snug">{keepTogether(stage.name)}</span>
              </p>
              <div className="mt-3 space-y-2.5">
                {stage.milestones.map((m, k) => (
                  <Milestone key={m} label={m} lit={reached >= firstIdx + k} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The vertical position of each stop (elements marked data-stop) within a list, kept current as
 * the layout changes, for the dot to travel between.
 */
function useStopPositions() {
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

  return { listRef, ys, height };
}

/** Tablets: the same schedule top to bottom, the dot travelling down a rail on the left. */
function Vertical({ p, reached, arrived, reduced }: LayoutProps) {
  const { listRef, ys, height } = useStopPositions();
  const y = useTransform(p, (v) => along(ys, v));
  const fill = useTransform(y, (v) => (height ? v / height : 0));

  return (
    <div className="relative mt-8 hidden md:block xl:hidden" aria-hidden="true">
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
                <span className="label">{keepTogether(stage.name)}</span>
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
        <motion.span className="absolute left-[6.5px] top-0" style={{ y }}>
          <span className="block -translate-x-1/2 -translate-y-1/2">
            <Dot arrived={arrived} reduced={reduced} />
          </span>
        </motion.span>
      </div>
    </div>
  );
}

/**
 * Phones: the line runs down the center and the stages alternate either side of it, each
 * milestone beside its mark on the line. The line ends at move-in, and "Moved in" sits centered
 * beneath it once the dot arrives.
 */
function Centered({ p, reached, arrived, reduced }: LayoutProps) {
  const { listRef, ys, height } = useStopPositions();
  const y = useTransform(p, (v) => along(ys, v));
  const fill = useTransform(y, (v) => (height ? v / height : 0));

  return (
    <div className="relative mt-8 md:hidden" aria-hidden="true">
      <div ref={listRef} className="relative">
        {/* The line, and its travelled length. */}
        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-ink/15" />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[2px] origin-top -translate-x-1/2 bg-accent"
          style={{ scaleY: fill }}
        />
        <span data-stop={0} className="block h-0" />
        {STAGES.map((stage, s) => {
          const lit = reached >= firstStopOf(s);
          const firstIdx = firstStopOf(s);
          const left = s % 2 === 0;
          const side = left ? 'col-start-1 text-right' : 'col-start-3 text-left';
          return (
            <div key={stage.name} className="grid grid-cols-[1fr_1.75rem_1fr] pb-8">
              <p
                className={`${side} row-start-1 transition-colors duration-500 ${lit ? 'text-ink' : 'text-ink/45'}`}
              >
                <span className="block font-serif text-[1rem] tabular-nums">
                  {String(s + 1).padStart(2, '0')}
                </span>
                <span className="label mt-1 block leading-snug">{keepTogether(stage.name)}</span>
              </p>
              {stage.milestones.map((m, k) => {
                const on = reached >= firstIdx + k;
                return (
                  <div key={m} className="contents">
                    <span
                      className="col-start-2 mt-3 flex justify-center pt-[0.45em]"
                      style={{ gridRow: k + 2 }}
                    >
                      <span
                        className={`block h-[7px] w-[7px] rounded-full border transition-colors duration-500 ${
                          on ? 'border-accent bg-accent' : 'border-ink/35 bg-bone'
                        }`}
                      />
                    </span>
                    <span
                      data-stop={firstIdx + k}
                      className={`${side} mt-3`}
                      style={{ gridRow: k + 2 }}
                    >
                      <Milestone label={m} lit={on} />
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
        {/* The end of the line: move-in. */}
        <span data-stop={LAST} className="block h-0" />
        <motion.span className="absolute left-1/2 top-0" style={{ y }}>
          <span className="block -translate-x-1/2 -translate-y-1/2">
            <Dot arrived={arrived} reduced={reduced} />
          </span>
        </motion.span>
      </div>
      <motion.p
        className="mt-8 text-center font-serif text-[1.75rem] leading-none text-ink"
        initial={false}
        animate={{ opacity: arrived ? 1 : 0.25, y: arrived ? 0 : 6 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {moveIn.moved}
      </motion.p>
    </div>
  );
}
