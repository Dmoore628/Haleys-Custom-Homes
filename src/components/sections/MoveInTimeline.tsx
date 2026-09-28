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

const { moveIn } = copy;
const MONTHS = moveIn.months;
const SCHEDULE = moveIn.schedule;

/**
 * Stops along the line, in order: the start (month 0), every milestone, then move-in at the
 * last month. The dot glides stop to stop, taking longer where more time passes.
 */
const STOP_MONTHS = [0, ...SCHEDULE.map((m) => m.month), MONTHS];
const LAST = STOP_MONTHS.length - 1;
/** Stop index of milestone i. */
const stopOf = (i: number) => i + 1;
/** Seconds of travel per month, the minimum glide, and the pause at each milestone. */
const PER_MONTH = 0.17;
const MIN_GLIDE = 0.35;
const HOLD = 0.45;

/** Piecewise-linear lookup of stop index (fractional) into a list of values. */
function along(values: number[], p: number) {
  const i = Math.max(0, Math.min(values.length - 2, Math.floor(p)));
  const t = Math.max(0, Math.min(1, p - i));
  return values[i] + (values[i + 1] - values[i]) * t;
}

const pad = (n: number) => String(n).padStart(2, '0');
/** The calendar month (1 to MONTHS) a point on the ruler falls in. */
const monthOf = (m: number) => Math.min(MONTHS, Math.floor(m) + 1);

/**
 * The payoff of the punch list: where the punch list shows the system's stages, this shows the
 * calendar. An illustrative build schedule on a month ruler, from the permit application to
 * move-in, with the on-site milestones a client actually waits for. When it comes into view a
 * dot works along the schedule, pausing at each milestone and lighting it, while the month
 * counter runs, and comes to rest at move-in. Beneath, a family who moved in a month early, in
 * their own words. Wide screens run it left to right with milestones alternating above and
 * below the line; tablets run it down a rail; phones down a centered line with milestones
 * alternating either side. Spacing on every layout is proportional to time. Reduced motion
 * shows the finished schedule.
 */
export function MoveInTimeline({ align = 'start' }: { align?: 'start' | 'center' }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const p = useMotionValue(reduced ? LAST : 0);
  const [reached, setReached] = useState(reduced ? LAST : 0);
  const [month, setMonth] = useState(reduced ? MONTHS : 1);
  const arrived = reached >= LAST;

  useMotionValueEvent(p, 'change', (v) => {
    setReached(Math.floor(v + 0.001));
    setMonth(monthOf(along(STOP_MONTHS, v) + 0.001));
  });

  useEffect(() => {
    if (reduced) {
      p.set(LAST);
      setReached(LAST);
      setMonth(MONTHS);
      return;
    }
    if (!inView) return;
    let cancelled = false;
    let current: ReturnType<typeof animate> | undefined;
    const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
    (async () => {
      await wait(0.4);
      for (let k = 1; k <= LAST && !cancelled; k++) {
        const span = STOP_MONTHS[k] - STOP_MONTHS[k - 1];
        current = animate(p, k, {
          duration: Math.max(MIN_GLIDE, span * PER_MONTH),
          ease: [0.45, 0, 0.25, 1],
        });
        await current;
        if (k < LAST) await wait(HOLD);
      }
    })();
    return () => {
      cancelled = true;
      current?.stop();
    };
  }, [inView, reduced, p]);

  const layout = { p, reached, arrived, reduced };

  return (
    <figure ref={ref} data-testid="move-in-timeline" data-arrived={arrived}>
      <figcaption className="sr-only">
        {moveIn.label}
        <ol>
          {SCHEDULE.map((m) => (
            <li key={m.label}>
              {moveIn.month} {monthOf(m.month)}: {m.label}
            </li>
          ))}
          <li>
            {moveIn.month} {MONTHS}: {moveIn.moved}
          </li>
        </ol>
      </figcaption>

      {/* The heading row: what this is, and the month the dot has reached. */}
      <div
        className={`flex items-baseline gap-6 ${align === 'center' ? 'justify-center md:justify-between' : 'justify-between'}`}
        aria-hidden="true"
      >
        <p className="label text-ink/70">{moveIn.sequenceNote}</p>
        <p className="label hidden items-baseline gap-2 text-ink/70 md:flex">
          {moveIn.month}
          <span className="inline-block min-w-[2ch] font-serif text-[1.125rem] normal-case tabular-nums tracking-normal text-accent">
            {pad(month)}
          </span>
        </p>
      </div>

      <Horizontal {...layout} />
      <Vertical {...layout} />
      <Centered {...layout} />

      {/* In their words. */}
      <motion.div
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
      </motion.div>
    </figure>
  );
}

interface LayoutProps {
  p: MotionValue<number>;
  reached: number;
  arrived: boolean;
  reduced: boolean;
}

/** The travelling dot; once it arrives it breathes, unless motion is reduced. */
function Dot({ arrived, reduced }: { arrived: boolean; reduced: boolean }) {
  return (
    <span className="relative block h-3.5 w-3.5 rounded-full bg-accent shadow-[0_0_0_6px_rgba(122,98,80,0.16)]">
      {arrived && !reduced && (
        <span className="punch-breathe absolute -inset-[7px] rounded-full border border-accent" />
      )}
    </span>
  );
}

/** A milestone's mark on the line: a small ring that fills when the dot reaches it. */
function Mark({ on, stop, className = '' }: { on: boolean; stop?: number; className?: string }) {
  return (
    <span
      data-stop={stop}
      className={`block h-[7px] w-[7px] rounded-full border transition-colors duration-500 ${
        on ? 'border-accent bg-accent' : 'border-ink/35 bg-bone'
      } ${className}`}
    />
  );
}

/** A milestone's text: faint until the dot reaches it, then full ink. */
function Label({ text, on }: { text: string; on: boolean }) {
  return (
    <span
      className={`block text-[0.875rem] leading-snug transition-colors duration-700 ease-brand ${
        on ? 'text-ink' : 'text-ink/35'
      }`}
    >
      {keepTogether(text)}
    </span>
  );
}

/**
 * Wide screens: a month ruler left to right, a tick a month. Milestones alternate above and below the line on
 * hairline leaders, like dimensions on a drawing; "Moved in" closes the line at the right.
 */
function Horizontal({ p, reached, arrived, reduced }: LayoutProps) {
  const xs = STOP_MONTHS.map((m) => m / MONTHS);
  const x = useTransform(p, (v) => along(xs, v));
  const left = useTransform(x, (v) => `${v * 100}%`);
  const at = (m: number) => `${(m / MONTHS) * 100}%`;

  return (
    <div className="mt-8 hidden pr-[10rem] xl:block" aria-hidden="true">
      <div className="relative h-[17.5rem]">
        {/* Above the line: milestones 1, 3, 5... */}
        {SCHEDULE.map((m, i) => {
          if (i % 2 === 1) return null;
          const on = reached >= stopOf(i);
          return (
            <div
              key={m.label}
              className="absolute bottom-[calc(50%+0.75rem)] flex w-[6.5rem] flex-col"
              style={{ left: at(m.month) }}
            >
              <MonthTag month={monthOf(m.month)} on={on} />
              <Label text={m.label} on={on} />
              <span
                className={`mt-2 block h-9 w-px transition-colors duration-500 ${on ? 'bg-accent/60' : 'bg-ink/15'}`}
              />
            </div>
          );
        })}

        {/* The line, its ruler, and its travelled length. */}
        <div className="absolute inset-x-0 top-1/2 h-px">
          <div className="absolute inset-0 bg-ink/15" />
          <motion.div
            className="absolute left-0 top-[-0.5px] h-[2px] w-full origin-left bg-accent"
            style={{ scaleX: x }}
          />
          {Array.from({ length: MONTHS + 1 }, (_, m) => (
            <span
              key={`t${m}`}
              className={`absolute top-0 w-px transition-colors duration-500 ${
                m === 0 || m === MONTHS ? 'h-[7px]' : 'h-1'
              } ${m <= STOP_MONTHS[reached] ? 'bg-accent/70' : 'bg-ink/25'}`}
              style={{ left: at(m) }}
            />
          ))}

          {SCHEDULE.map((m, i) => (
            <span
              key={`m${m.label}`}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: at(m.month) }}
            >
              <Mark on={reached >= stopOf(i)} />
            </span>
          ))}
          <motion.span
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left }}
          >
            <Dot arrived={arrived} reduced={reduced} />
          </motion.span>
          {/* Move-in: the end of the line. */}
          <motion.span
            className="absolute left-full top-1/2 ml-7 -translate-y-1/2 whitespace-nowrap font-serif text-[1.875rem] leading-none text-ink"
            initial={false}
            animate={{ opacity: arrived ? 1 : 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {moveIn.moved}
          </motion.span>
        </div>

        {/* Below the line: milestones 2, 4, 6... on longer leaders that clear the ruler. */}
        {SCHEDULE.map((m, i) => {
          if (i % 2 === 0) return null;
          const on = reached >= stopOf(i);
          return (
            <div
              key={m.label}
              className="absolute top-[calc(50%+0.75rem)] flex w-[6.5rem] flex-col"
              style={{ left: at(m.month) }}
            >
              <span
                className={`mb-2 block h-9 w-px transition-colors duration-500 ${on ? 'bg-accent/60' : 'bg-ink/15'}`}
              />
              <MonthTag month={monthOf(m.month)} on={on} />
              <Label text={m.label} on={on} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Space between milestones in a vertical layout, proportional to the months between them. */
const gapFor = (i: number) => `${Math.max(1, (SCHEDULE[i].month - STOP_MONTHS[i]) * 1.1)}rem`;

/**
 * The vertical position of each stop (elements marked data-stop) within a list, kept current as
 * the layout changes, for the dot to travel between.
 */
function useStopPositions() {
  const listRef = useRef<HTMLDivElement>(null);
  const [ys, setYs] = useState<number[]>(STOP_MONTHS.map((_, i) => i * 40));
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const top = list.getBoundingClientRect().top;
      const next = STOP_MONTHS.map((_, i) => {
        const el = list.querySelector<HTMLElement>(`[data-stop="${i}"]`);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top - top + r.height / 2;
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

/** A milestone's month, set small above its text. */
function MonthTag({ month, on }: { month: number; on: boolean }) {
  return (
    <span
      className={`label mb-1 block transition-colors duration-500 ${on ? 'text-accent' : 'text-ink/40'}`}
    >
      {moveIn.month} {month}
    </span>
  );
}

/** Tablets: the schedule top to bottom, the dot travelling down a rail on the left. */
function Vertical({ p, reached, arrived, reduced }: LayoutProps) {
  const { listRef, ys, height } = useStopPositions();
  const y = useTransform(p, (v) => along(ys, v));
  const fill = useTransform(y, (v) => (height ? v / height : 0));

  return (
    <div className="relative mt-8 hidden md:block xl:hidden" aria-hidden="true">
      <div ref={listRef} className="relative pl-9">
        <div className="absolute bottom-0 left-[6px] top-0 w-px bg-ink/15" />
        <motion.div
          className="absolute left-[5.5px] top-0 h-full w-[2px] origin-top bg-accent"
          style={{ scaleY: fill }}
        />
        <span data-stop={0} className="block h-0" />
        {SCHEDULE.map((m, i) => {
          const on = reached >= stopOf(i);
          return (
            <div key={m.label} className="relative" style={{ marginTop: gapFor(i) }}>
              <Mark on={on} stop={stopOf(i)} className="absolute -left-9 top-[0.3em] ml-[3px]" />
              <MonthTag month={monthOf(m.month)} on={on} />
              <Label text={m.label} on={on} />
            </div>
          );
        })}
        <div className="relative pt-8">
          <motion.p
            data-stop={LAST}
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
 * Phones: the line runs down the center and the milestones alternate either side of it, each
 * beside its mark on the line. The line ends at move-in, and "Moved in" sits centered beneath
 * it once the dot arrives.
 */
function Centered({ p, reached, arrived, reduced }: LayoutProps) {
  const { listRef, ys, height } = useStopPositions();
  const y = useTransform(p, (v) => along(ys, v));
  const fill = useTransform(y, (v) => (height ? v / height : 0));

  return (
    <div className="relative mt-8 md:hidden" aria-hidden="true">
      <div ref={listRef} className="relative pb-2">
        <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-ink/15" />
        <motion.div
          className="absolute left-1/2 top-0 h-full w-[2px] origin-top -translate-x-1/2 bg-accent"
          style={{ scaleY: fill }}
        />
        <span data-stop={0} className="block h-0" />
        {SCHEDULE.map((m, i) => {
          const on = reached >= stopOf(i);
          const side = i % 2 === 0 ? 'col-start-1 text-right' : 'col-start-3 text-left';
          return (
            <div
              key={m.label}
              className="grid grid-cols-[1fr_1.75rem_1fr]"
              style={{ marginTop: gapFor(i) }}
            >
              <span className="col-start-2 row-start-1 flex justify-center pt-[1.35rem]">
                <Mark on={on} stop={stopOf(i)} />
              </span>
              <span className={`${side} row-start-1`}>
                <MonthTag month={monthOf(m.month)} on={on} />
                <Label text={m.label} on={on} />
              </span>
            </div>
          );
        })}
        <span data-stop={LAST} className="mt-6 block h-0" />
        <motion.span className="absolute left-1/2 top-0" style={{ y }}>
          <span className="block -translate-x-1/2 -translate-y-1/2">
            <Dot arrived={arrived} reduced={reduced} />
          </span>
        </motion.span>
      </div>
      <motion.p
        className="mt-6 text-center font-serif text-[1.75rem] leading-none text-ink"
        initial={false}
        animate={{ opacity: arrived ? 1 : 0.25, y: arrived ? 0 : 6 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {moveIn.moved}
      </motion.p>
    </div>
  );
}
