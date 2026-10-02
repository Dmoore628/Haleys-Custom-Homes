'use client';

import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { Sentences } from '@/components/ui/Sentences';
import { keepTogether } from '@/lib/text';

const schedule = copy.processSchedule;
const phases = copy.process.phases;
const LAST = phases.length - 1;
const CHECK = 'M4 8.4l2.6 2.6L12 5.6';

/** The calendar month (1 to months) a point on the schedule falls in. */
const monthOf = (m: number) => Math.min(schedule.months, Math.floor(m) + 1);

/** "Month 1" or "Months 3–6", from a phase's milestones. */
function monthSpan(milestones: readonly { month: number }[]) {
  const first = monthOf(milestones[0].month);
  const last = monthOf(milestones[milestones.length - 1].month);
  return first === last ? `${schedule.month} ${first}` : `${schedule.monthsLabel} ${first}–${last}`;
}

/**
 * The one place the blueprint-line motif appears: a 1px architectural dimension line
 * (a run with 45-degree end ticks and extension marks), used as a quiet divider.
 */
function BlueprintLine() {
  return (
    <svg
      className="my-[clamp(3rem,7vw,6rem)] h-6 w-full text-ink/40"
      viewBox="0 0 1000 24"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 12H1000"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M1 2v20M999 2v20"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M-5 18 7 6M993 18l12-12"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * A rail marker as a punch-list box: it fills and takes a check once the visitor scrolls past
 * its phase. Move-In alone stays open, its box breathing once reached.
 */
function RailBox({ done, isLast, reduced }: { done: boolean; isLast: boolean; reduced: boolean }) {
  const checked = done && !isLast;
  return (
    <span className="relative block h-4 w-4">
      {isLast && done && !reduced && (
        <span className="punch-breathe absolute -inset-[4px] rounded-[5px] border border-accent" />
      )}
      <span
        className={`absolute inset-0 rounded-[4px] border transition-colors duration-300 ease-brand ${
          checked ? 'border-accent bg-accent' : 'border-accent bg-white'
        }`}
      />
      <svg viewBox="0 0 16 16" className="absolute inset-0 h-full w-full">
        <motion.path
          d={CHECK}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : 0.35 }}
        />
      </svg>
    </span>
  );
}

/**
 * The Haley build process, phase by phase: six photographic blocks in alternating 7/5 splits,
 * each with its number, title, its months on an illustrative schedule (said once), what Haley
 * does in that phase, and the on-site milestones a client waits for. A scroll-linked rail runs down the left margin (4px
 * ink-at-10% track, accent fill tied to scroll progress), its markers punch-list boxes that tick
 * off as each phase is passed; Move-In stays open, with the way to close it. The McDonalds'
 * words close the sequence.
 */
export function PhaseSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [markers, setMarkers] = useState<number[]>([]);
  const [passed, setPassed] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start center', 'end center'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  // Marker positions as fractions of the section height, at each block's top.
  useEffect(() => {
    const measure = () => {
      const section = sectionRef.current;
      if (!section) return;
      const h = section.offsetHeight;
      setMarkers(blockRefs.current.map((b) => (b ? (b.offsetTop + 8) / h : 0)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) setPassed(phases.length);
  }, [reduced]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!reduced) setPassed(markers.filter((m) => v >= m).length);
  });

  return (
    <div>
      <div ref={sectionRef} className="relative pl-10 md:pl-20" data-testid="phase-sequence">
        {/* Rail */}
        <div className="absolute bottom-0 left-0 top-0 w-1 bg-ink/10 md:left-4" aria-hidden="true">
          {!reduced && (
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
              style={{ scaleY: fill }}
            />
          )}
          {markers.map((m, i) => (
            <span
              key={i}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${m * 100}%` }}
              data-testid="rail-marker"
              data-passed={i < passed}
              data-status={i < passed && i < LAST ? 'closed' : 'open'}
            >
              <RailBox done={i < passed} isLast={i === LAST} reduced={reduced} />
            </span>
          ))}
        </div>

        <ol>
          {phases.map((phase, i) => {
            const imageLeft = i % 2 === 0;
            const isMoveIn = i === LAST;
            return (
              <li key={phase.title}>
                {i > 0 && <BlueprintLine />}
                <article
                  ref={(el) => {
                    blockRefs.current[i] = el;
                  }}
                  className="flex flex-col gap-8 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0"
                  data-testid="phase"
                >
                  <Reveal className={`md:col-span-7 ${imageLeft ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-tile">
                      <SmartImage
                        src={phase.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 55vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>
                  <Reveal
                    className={`text-center md:col-span-5 md:text-left ${imageLeft ? 'md:order-2' : 'md:order-1'}`}
                    delay={0.1}
                  >
                    {/* Number, title, then the phase's months once, as its subheading. */}
                    <div className="flex items-end justify-center gap-4 md:justify-between">
                      <span className="font-serif text-[clamp(2.75rem,4.5vw,3.75rem)] font-light tabular-nums leading-none text-accent">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {isMoveIn && (
                        <span className="label mb-1 rounded-full border border-accent px-3 py-0.5 text-[0.6875rem] text-accent">
                          {schedule.open}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-6 font-serif text-[clamp(1.75rem,2.8vw,2.375rem)] font-normal leading-[1.15]">
                      {keepTogether(phase.title)}
                    </h3>
                    <p className="label mt-3 text-ink/60" data-testid="phase-months">
                      {monthSpan(phase.milestones)}
                    </p>
                    <p className="mx-auto mt-6 max-w-[30rem] text-body text-ink/80 md:mx-0">
                      {keepTogether(phase.body)}
                    </p>

                    {/* What happens on site in this phase. */}
                    <ul
                      className="mx-auto mt-8 flex max-w-[30rem] flex-wrap justify-center gap-x-6 gap-y-2 border-t border-ink/10 pt-5 md:mx-0 md:justify-start"
                      data-testid="milestones"
                    >
                      {phase.milestones.map((m) => (
                        <li
                          key={m.label}
                          className="flex items-center gap-2.5 text-[0.9375rem] text-ink/75"
                        >
                          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
                          {keepTogether(m.label)}
                        </li>
                      ))}
                    </ul>

                    {isMoveIn && (
                      <Link
                        href={schedule.cta.href}
                        className="label group mt-7 inline-flex items-center gap-2 text-accent underline decoration-accent/40 underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:decoration-ink"
                      >
                        {schedule.cta.label}
                        <span
                          aria-hidden="true"
                          className="transition-transform duration-300 ease-brand group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    )}
                  </Reveal>
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      {/* In their words, then the schedule's footnote. */}
      <Reveal className="mx-auto mt-[clamp(4rem,8vw,7rem)] max-w-[44rem] text-center">
        <figure>
          <blockquote className="font-serif text-[clamp(1.25rem,2.2vw,1.75rem)] italic leading-snug text-ink">
            <Sentences text={`“${schedule.quote}”`} />
          </blockquote>
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-10 bg-accent" />
          <figcaption className="label mt-5 text-ink">
            {schedule.attribution}
            <span className="hidden text-ink/70 md:inline"> · </span>
            <span className="mt-1 block text-ink/70 md:mt-0 md:inline">{schedule.projectType}</span>
          </figcaption>
        </figure>
        <p className="mt-12 text-[0.8125rem] text-ink/70">{schedule.note}</p>
      </Reveal>
    </div>
  );
}
