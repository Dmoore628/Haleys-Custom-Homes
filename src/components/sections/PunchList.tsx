'use client';

import { AnimatePresence, motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { rows } = copy.ledger;
const { punchList } = copy;
/** Stages 1 to 5 close; the last stage, Move-In, is left open for the visitor. */
const TO_CLOSE = rows.length - 1;
const STEP_MS = 650;
const CHECK = 'M6 12.5l3.8 3.8L18 8';

/**
 * The Accelerated Precision Building System as an architect's punch list: a dark sheet with a
 * title block, a live count and a progress rule, and one line item per stage, each with the
 * wait a typical build risks at that stage. When the sheet comes into view the items close one
 * by one: the box fills, the check draws, the risk is struck through and the status flips from
 * Open to Closed. Move-In alone stays open, its box breathing, with the way to close it: start
 * the conversation. Reduced motion shows the finished sheet.
 */
export function PunchList() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduced = useReducedMotion();
  const [closed, setClosed] = useState(0);
  const count = reduced ? TO_CLOSE : closed;

  useEffect(() => {
    if (!inView || reduced) return;
    const timers = Array.from({ length: TO_CLOSE }, (_, i) =>
      setTimeout(() => setClosed(i + 1), 450 + i * STEP_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const allClosed = count === TO_CLOSE;

  return (
    <div
      ref={ref}
      data-testid="punch-list"
      className="relative isolate overflow-hidden rounded-[6px] text-bone shadow-[0_40px_80px_-36px_rgba(26,24,21,0.55),0_16px_32px_-18px_rgba(26,24,21,0.35)] @container"
      style={{
        background:
          'radial-gradient(90% 70% at 100% 0%, rgba(122,98,80,0.42) 0%, rgba(122,98,80,0) 60%), #1A1815',
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bone/30 to-transparent"
      />

      {/* Title block. */}
      <div className="flex items-end justify-between gap-6 px-[clamp(1.25rem,4.5cqw,2.75rem)] pb-5 pt-[clamp(1.5rem,4.5cqw,2.5rem)]">
        <h3 className="font-serif text-[clamp(1.75rem,4.5cqw,2.5rem)] italic leading-none">
          {punchList.title}
        </h3>
        <p className="label flex items-baseline gap-2 text-bone/70" aria-live="polite">
          <span className="font-serif text-[1.5rem] normal-case tabular-nums tracking-normal text-bone">
            {String(count).padStart(2, '0')}
          </span>
          <span className="tabular-nums">/ {String(rows.length).padStart(2, '0')}</span>
          <span>{punchList.closed}</span>
        </p>
      </div>
      <div className="mx-[clamp(1.25rem,4.5cqw,2.75rem)] h-px bg-bone/15">
        <motion.div
          className="h-px origin-left bg-[#C6BAAC]"
          initial={false}
          animate={{ scaleX: count / rows.length }}
          transition={{ duration: 0.6, ease: EASE }}
        />
      </div>

      <ol className="mt-2 pb-3">
        {rows.map((row, i) => {
          const isLast = i === rows.length - 1;
          const done = i < count;
          return (
            <li
              key={row.name}
              data-testid="punch-row"
              data-status={done ? 'closed' : 'open'}
              className={`group grid grid-cols-[1.75rem_1.5rem_1fr] items-start gap-x-4 border-b border-bone/10 px-[clamp(1.25rem,4.5cqw,2.75rem)] py-[clamp(1rem,2.6cqw,1.4rem)] transition-colors duration-300 last:border-b-0 hover:bg-bone/[0.03] @xl:grid-cols-[2.25rem_1.5rem_1fr_auto] @xl:gap-x-5 ${
                isLast
                  ? 'bg-[linear-gradient(90deg,rgba(198,186,172,0.08),rgba(198,186,172,0))]'
                  : ''
              }`}
            >
              <span className="pt-[3px] font-serif text-[1.0625rem] tabular-nums leading-none text-bone/60">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* The box: fills and takes a drawn check when closed; breathes while open. */}
              <span className="relative mt-[1px] h-[22px] w-[22px]" aria-hidden="true">
                {isLast && !reduced && allClosed && (
                  <span className="punch-breathe absolute -inset-[5px] rounded-[7px] border border-[#C6BAAC]" />
                )}
                <motion.span
                  className="absolute inset-0 rounded-[4px] border"
                  initial={false}
                  animate={{
                    backgroundColor: done ? '#7A6250' : 'rgba(122,98,80,0)',
                    borderColor: done ? '#7A6250' : isLast ? '#C6BAAC' : 'rgba(239,233,222,0.35)',
                  }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
                <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full">
                  <motion.path
                    d={CHECK}
                    fill="none"
                    stroke="#EFE9DE"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
                    transition={{
                      duration: reduced ? 0 : 0.45,
                      delay: done ? 0.12 : 0,
                      ease: EASE,
                    }}
                  />
                </svg>
              </span>

              <div className="min-w-0">
                <p className="text-[1.0625rem] font-medium leading-snug">{row.name}</p>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-bone/60">
                  {/* The strike draws along the text, line by line, when the item closes. */}
                  <span
                    className="bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_58%] bg-no-repeat transition-[background-size] duration-700 ease-brand"
                    style={{ backgroundSize: done ? '100% 1px' : '0% 1px' }}
                  >
                    {row.annotation}
                  </span>
                </p>
                {isLast && (
                  <AnimatePresence>
                    {allClosed && (
                      <motion.div
                        initial={reduced ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                        className="mt-4"
                      >
                        <Link
                          href={punchList.cta.href}
                          className="label inline-flex items-center gap-2 text-[#C6BAAC] underline decoration-[#C6BAAC]/40 underline-offset-[6px] transition-colors duration-200 hover:text-bone hover:decoration-bone"
                        >
                          {punchList.cta.label}
                          <span
                            aria-hidden="true"
                            className="transition-transform duration-300 ease-brand group-hover:translate-x-1"
                          >
                            →
                          </span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Status tag. */}
              <span className="col-start-3 mt-3 @xl:col-start-4 @xl:mt-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={done ? 'closed' : 'open'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className={`label inline-block rounded-full px-3 py-1 text-[0.6875rem] ${
                      done
                        ? 'bg-[#C6BAAC] text-ink'
                        : isLast
                          ? 'border border-[#C6BAAC] text-[#C6BAAC]'
                          : 'border border-bone/25 text-bone/70'
                    }`}
                  >
                    {done ? punchList.closed : punchList.open}
                  </motion.span>
                </AnimatePresence>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
