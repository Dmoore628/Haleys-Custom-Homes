'use client';

import { motion, useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { keepTogether } from '@/lib/text';
import { Sentences } from '@/components/ui/Sentences';

const t = copy.buildTimeline;
const STAGES = t.stages;
const LAST_STAGE = STAGES.length - 1;
/** Stages 1 to 5 close; Move-In is left open for the visitor. */
const TO_CLOSE = LAST_STAGE;
/** Where the scrubber sits in the viewport, as a fraction of its height. */
const ANCHOR = 0.6;
const CHECK = 'M6 12.5l3.8 3.8L18 8';

const pad = (n: number) => String(n).padStart(2, '0');
/** The calendar month (1 to months) a point on the schedule falls in. */
const monthOf = (m: number) => Math.min(t.months, Math.floor(m) + 1);

/**
 * Every point the scrubber passes, in order down the rail: each stage's node, then each of its
 * milestones. `month` is where the point sits on the schedule.
 */
type Checkpoint = { stage: number; milestone: number | null; month: number };
const CHECKPOINTS: Checkpoint[] = STAGES.flatMap((stage, s) => [
  { stage: s, milestone: null, month: s === 0 ? 0 : stage.milestones[0].month },
  ...stage.milestones.map((m, k) => ({ stage: s, milestone: k, month: m.month })),
]);
const nodeIndex = (s: number) =>
  CHECKPOINTS.findIndex((c) => c.stage === s && c.milestone === null);
const milestoneIndex = (s: number, k: number) =>
  CHECKPOINTS.findIndex((c) => c.stage === s && c.milestone === k);
const lastOfStage = (s: number) => milestoneIndex(s, STAGES[s].milestones.length - 1);
const ALL = CHECKPOINTS.length;

/**
 * The Haley build process as one vertical, scroll-scrubbed timeline: the architect's punch list
 * laid along an illustrative build schedule, each stage with Haley's commitment for it. Scrolling
 * moves a scrubber down the rail; as it passes a stage the stage and its commitment light, each
 * on-site milestone lights with its month, and when the stage's last milestone is passed its box
 * takes a drawn check and it flips to Closed. Scrolling back reopens
 * them. Move-In alone stays open, its box breathing, with the way to close it. A status card
 * (pinned beside the rail on wide screens, a pill pinned to the bottom of the screen on narrow
 * ones) keeps the live count and the month. Reduced motion shows the finished schedule.
 * `intro` is the section's own heading and text, set above the status card.
 */
export function BuildTimeline({ intro }: { intro?: ReactNode }) {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  /** Checkpoint positions down the rail, in px from the top of the list. */
  const [ys, setYs] = useState<number[]>(() => CHECKPOINTS.map((_, i) => i * 80));
  const ysRef = useRef(ys);
  /** How many checkpoints the scrubber has passed. */
  const [passed, setPassed] = useState(reduced ? ALL : 0);
  const [month, setMonth] = useState(1);
  const tip = useMotionValue(0);
  const smooth = useSpring(tip, { stiffness: 220, damping: 38, mass: 0.6 });

  // Measure every checkpoint (elements marked data-cp) whenever the layout changes.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      const top = list.getBoundingClientRect().top;
      const next = CHECKPOINTS.map((_, i) => {
        const el = list.querySelector<HTMLElement>(`[data-cp="${i}"]`);
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        return r.top - top + r.height / 2;
      });
      ysRef.current = next;
      setYs(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  const apply = useCallback(
    (y: number) => {
      const pts = ysRef.current;
      const clamped = Math.max(pts[0], Math.min(pts[ALL - 1], y));
      tip.set(clamped);
      let n = 0;
      while (n < ALL && pts[n] <= y + 0.5) n++;
      setPassed(n);
      // The month: interpolated between the checkpoints either side of the scrubber.
      let m = 0;
      if (n >= ALL) m = t.months;
      else if (n > 0) {
        const a = pts[n - 1];
        const b = pts[n];
        const f = b > a ? (clamped - a) / (b - a) : 0;
        m = CHECKPOINTS[n - 1].month + (CHECKPOINTS[n].month - CHECKPOINTS[n - 1].month) * f;
      }
      setMonth(n >= ALL ? t.months : monthOf(m));
    },
    [tip],
  );

  // Scrub: the scrubber sits at ANCHOR of the viewport; its depth into the list is the progress.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    if (reduced) {
      const pts = ysRef.current;
      tip.set(pts[ALL - 1]);
      smooth.jump(pts[ALL - 1]);
      setPassed(ALL);
      setMonth(t.months);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      apply(window.innerHeight * ANCHOR - list.getBoundingClientRect().top);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reduced, apply, tip, smooth, ys]);

  const closedCount = Array.from({ length: TO_CLOSE }, (_, s) => passed > lastOfStage(s)).filter(
    Boolean,
  ).length;
  const arrived = passed >= ALL;
  const status = { closedCount, month, arrived };

  return (
    <div
      data-testid="build-timeline"
      data-arrived={arrived}
      className="flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:gap-x-grid lg:gap-y-0"
    >
      <p className="sr-only">{t.label}</p>

      {/* Left: the section's intro and the status card, pinned while the rail scrolls. */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="lg:sticky lg:top-[12vh]">
          {intro}
          <div className="mt-8 hidden lg:block xl:mt-10">
            <StatusCard {...status} />
          </div>
        </div>
      </div>

      {/* Right: the rail. */}
      <div className="relative lg:col-span-7 lg:col-start-6 xl:col-span-7 xl:col-start-6">
        <div className="relative">
          <Rail ys={ys} tip={smooth} arrived={arrived} reduced={reduced} />
          <ol ref={listRef} className="relative">
            {STAGES.map((stage, s) => (
              <Stage key={stage.name} s={s} passed={passed} arrived={arrived} reduced={reduced} />
            ))}
          </ol>
          {/* Narrow screens: the status, pinned to the bottom of the screen while the rail is in view. */}
          <div className="pointer-events-none sticky bottom-5 z-30 mt-6 flex justify-center lg:hidden">
            <StatusPill {...status} />
          </div>
        </div>

        {/* In their words. At least 42vh tall, so the scrubber (at 60% of the viewport) always
            reaches Move-In before the section pins. */}
        <div className="min-h-[42vh]">
          <motion.figure
            className="mt-16 max-w-[40rem] border-l-2 border-accent pl-6 md:ml-[3.75rem]"
            initial={false}
            animate={{ opacity: arrived ? 1 : 0.0001, y: arrived ? 0 : 12 }}
            transition={{ duration: 0.9, delay: reduced ? 0 : 0.2, ease: EASE }}
          >
            <blockquote className="font-serif text-[clamp(1.25rem,2.2vw,1.625rem)] italic leading-snug text-ink">
              <Sentences text={`“${t.quote}”`} />
            </blockquote>
            <figcaption className="label mt-5 text-ink">
              {t.attribution}
              <span className="hidden text-ink/70 md:inline"> · </span>
              <span className="mt-1 block text-ink/70 md:mt-0 md:inline">{t.projectType}</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </div>
  );
}

interface Status {
  closedCount: number;
  month: number;
  arrived: boolean;
}

/** Wide screens: the punch list's title block, live, on a dark sheet. */
function StatusCard({ closedCount, month }: Status) {
  return (
    <div
      className="relative isolate overflow-hidden rounded-[6px] px-6 pb-6 pt-5 text-white shadow-[0_40px_80px_-36px_rgba(26,24,21,0.55),0_16px_32px_-18px_rgba(26,24,21,0.35)] xl:px-7 xl:pb-7 xl:pt-6"
      style={{
        background:
          'radial-gradient(90% 80% at 100% 0%, rgba(122,98,80,0.45) 0%, rgba(122,98,80,0) 62%), #1A1815',
      }}
      aria-hidden="true"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="flex items-end justify-between gap-4">
        <p className="font-serif text-[1.75rem] italic leading-none xl:text-[2rem]">{t.title}</p>
        <p className="label flex items-baseline gap-2 text-white/70">
          <span className="font-serif text-[1.5rem] normal-case tabular-nums tracking-normal text-white">
            {pad(closedCount)}
          </span>
          <span className="tabular-nums">/ {pad(STAGES.length)}</span>
          <span>{t.closed}</span>
        </p>
      </div>
      <div className="mt-5 h-px bg-white/15">
        <motion.div
          className="h-px origin-left bg-[#C6BAAC]"
          initial={false}
          animate={{ scaleX: closedCount / STAGES.length }}
          transition={{ duration: 0.5, ease: EASE }}
        />
      </div>
      <div className="mt-6 flex items-end justify-between gap-4">
        <p className="label min-w-0 max-w-[11rem] leading-snug text-white/60">{t.note}</p>
        <p className="flex shrink-0 items-baseline gap-2 whitespace-nowrap">
          <span className="label text-white/60">{t.month}</span>
          <span className="font-serif text-[2.75rem] tabular-nums leading-none text-[#C6BAAC] xl:text-[3.25rem]">
            {pad(month)}
          </span>
          <span className="label tabular-nums text-white/45">/ {t.months}</span>
        </p>
      </div>
    </div>
  );
}

/** Narrow screens: the same status, compact, pinned to the bottom of the screen. */
function StatusPill({ closedCount, month }: Status) {
  return (
    <p
      className="label flex items-center gap-3 whitespace-nowrap rounded-full bg-ink/95 px-5 py-3 text-white/70 shadow-[0_18px_40px_-16px_rgba(26,24,21,0.6)] backdrop-blur"
      aria-hidden="true"
    >
      <span>
        {t.month}{' '}
        <span className="font-serif text-[1.0625rem] normal-case tabular-nums tracking-normal text-[#C6BAAC]">
          {pad(month)}
        </span>
      </span>
      <span className="h-3 w-px bg-white/25" />
      <span>
        <span className="font-serif text-[1.0625rem] normal-case tabular-nums tracking-normal text-white">
          {pad(closedCount)}
        </span>{' '}
        / {pad(STAGES.length)} {t.closed}
      </span>
    </p>
  );
}

/** The rail: a hairline, its travelled length, and the scrubber at the tip. */
function Rail({
  ys,
  tip,
  arrived,
  reduced,
}: {
  ys: number[];
  tip: MotionValue<number>;
  arrived: boolean;
  reduced: boolean;
}) {
  const top = ys[0];
  const bottom = ys[ALL - 1];
  const span = Math.max(1, bottom - top);
  return (
    <div
      className="pointer-events-none absolute left-[11px] top-0 z-0 w-px"
      style={{ top, height: span }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-ink/15" />
      <motion.div
        className="absolute left-[-0.5px] top-0 h-full w-[2px] origin-top bg-accent"
        style={{ scaleY: useSpanScale(tip, top, span) }}
      />
      <motion.span className="absolute left-0 top-0 z-10" style={{ y: useOffset(tip, top) }}>
        <span className="relative block h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgba(122,98,80,0.16)]">
          {arrived && !reduced && (
            <span className="punch-breathe absolute -inset-[7px] rounded-full border border-accent" />
          )}
        </span>
      </motion.span>
    </div>
  );
}

function useSpanScale(tip: MotionValue<number>, top: number, span: number) {
  const v = useMotionValue(0);
  useEffect(() => {
    const set = (y: number) => v.set(Math.max(0, Math.min(1, (y - top) / span)));
    set(tip.get());
    return tip.on('change', set);
  }, [tip, top, span, v]);
  return v;
}

function useOffset(tip: MotionValue<number>, top: number) {
  const v = useMotionValue(0);
  useEffect(() => {
    const set = (y: number) => v.set(y - top);
    set(tip.get());
    return tip.on('change', set);
  }, [tip, top, v]);
  return v;
}

/** One stage: its box on the rail, its name and status, Haley's commitment, its milestones. */
function Stage({
  s,
  passed,
  arrived,
  reduced,
}: {
  s: number;
  passed: number;
  arrived: boolean;
  reduced: boolean;
}) {
  const stage = STAGES[s];
  const isMoveIn = s === LAST_STAGE;
  const active = passed > nodeIndex(s);
  const closed = !isMoveIn && passed > lastOfStage(s);

  return (
    <li
      data-testid="build-stage"
      data-status={closed ? 'closed' : 'open'}
      className="relative grid grid-cols-[1.5rem_1fr] gap-x-5 pb-[clamp(3rem,6vw,4.5rem)] last:pb-0 md:gap-x-9"
    >
      {/* The box on the rail: fills and takes a drawn check when the stage closes. */}
      <span
        data-cp={nodeIndex(s)}
        className="relative z-20 mt-[0.35rem] h-[22px] w-[22px]"
        aria-hidden="true"
      >
        {isMoveIn && arrived && !reduced && (
          <span className="punch-breathe absolute -inset-[5px] rounded-[7px] border border-accent" />
        )}
        <motion.span
          className="absolute inset-0 rounded-[5px] border"
          initial={false}
          animate={{
            backgroundColor: closed ? '#7A6250' : '#FFFFFF',
            borderColor:
              closed || (isMoveIn && active)
                ? '#7A6250'
                : active
                  ? 'rgba(26,24,21,0.5)'
                  : 'rgba(26,24,21,0.22)',
          }}
          transition={{ duration: 0.3, ease: EASE }}
        />
        <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full">
          <motion.path
            d={CHECK}
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: closed ? 1 : 0, opacity: closed ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: closed ? 0.08 : 0, ease: EASE }}
          />
        </svg>
      </span>

      <div className="min-w-0 max-w-[40rem]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3
            className={`flex items-baseline gap-3 font-serif text-[clamp(1.375rem,2.4vw,1.875rem)] font-normal leading-tight transition-colors duration-500 ${
              active ? 'text-ink' : 'text-ink/40'
            }`}
          >
            <span className="text-[0.6em] tabular-nums text-accent">{pad(s + 1)}</span>
            <span>{keepTogether(stage.name)}</span>
          </h3>
          <span
            className={`label shrink-0 rounded-full px-3 py-1 text-[0.6875rem] transition-colors duration-300 ${
              closed
                ? 'bg-accent text-white'
                : isMoveIn
                  ? 'border border-accent text-accent'
                  : 'border border-ink/20 text-ink/55'
            }`}
          >
            {closed ? t.closed : t.open}
          </span>
        </div>

        {/* Haley's commitment for the stage, brightening as the stage is reached. */}
        <p
          className={`mt-3 max-w-[34rem] text-[0.9375rem] leading-relaxed transition-colors duration-500 ${
            active ? 'text-ink/80' : 'text-ink/45'
          }`}
        >
          {keepTogether(stage.commitment)}
        </p>

        {/* The stage's milestones, each with its month, and a tick on the rail. */}
        <ul className="mt-6 space-y-3">
          {stage.milestones.map((m, k) => {
            const lit = passed > milestoneIndex(s, k);
            return (
              <li
                key={m.label}
                className="relative grid grid-cols-[5rem_1fr] items-baseline gap-x-4"
              >
                <span
                  data-cp={milestoneIndex(s, k)}
                  className="absolute left-[calc(-2.75rem+11px)] top-[0.55em] h-[7px] w-[7px] -translate-x-1/2 md:left-[calc(-3.75rem+11px)]"
                  aria-hidden="true"
                >
                  <span
                    className={`absolute inset-0 rounded-full border transition-colors duration-500 ${
                      lit ? 'border-accent bg-accent' : 'border-ink/30 bg-white'
                    }`}
                  />
                </span>
                <span
                  className={`label text-[0.6875rem] tabular-nums transition-colors duration-500 ${lit ? 'text-accent' : 'text-ink/35'}`}
                >
                  {t.month} {monthOf(m.month)}
                </span>
                <span
                  className={`text-[0.9375rem] leading-snug transition-colors duration-500 ${lit ? 'text-ink' : 'text-ink/40'}`}
                >
                  {keepTogether(m.label)}
                </span>
              </li>
            );
          })}
        </ul>

        {isMoveIn && (
          <motion.div
            className="mt-7"
            initial={false}
            animate={{ opacity: arrived ? 1 : 0, y: arrived ? 0 : 6 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href={t.cta.href}
              tabIndex={arrived ? 0 : -1}
              className="label group inline-flex items-center gap-2 text-accent underline decoration-accent/40 underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:decoration-ink"
            >
              {t.cta.label}
              <span
                aria-hidden="true"
                className="transition-transform duration-300 ease-brand group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </li>
  );
}
