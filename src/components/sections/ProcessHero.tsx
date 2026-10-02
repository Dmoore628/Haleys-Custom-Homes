'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { intro } = copy.process;

const WHITE = '#FFFFFF';
const CHAMPAGNE = '#C6BAAC';
const GLOW = '#E4C79F';

/**
 * When each of the six stages begins drawing, on the drawing's own timeline. Every delay and
 * duration below is multiplied by SPEED, so the stages keep their order and rhythm and the whole
 * drawing plays in about DONE * SPEED seconds (4.5s).
 */
const T = [0.3, 1.9, 3.3, 5.2, 7.0, 8.7];
const DONE = 10;
const SPEED = 0.45;
const sec = (t: number) => t * SPEED;

// The elevation, in a 1200 x 720 drawing space. A modern farmhouse: a low gabled wing, the
// tall main gable with a two-storey window wall, and a flat-roofed wing with a chimney.
const GROUND = 600;
const SILHOUETTE =
  'M150 600 L150 410 L275 300 L380 390 L380 330 L570 170 L760 330 L760 430 L1070 430 L1070 600 Z';
const MAIN = 'M380 600 L380 330 L570 170 L760 330 L760 600 Z';
const WINDOWS = [
  { x: 480, y: 390, w: 180, h: 210, mullX: [540, 600], mullY: [470] },
  { x: 540, y: 235, w: 60, h: 60, mullX: [570], mullY: [] },
  { x: 185, y: 460, w: 60, h: 100, mullX: [215], mullY: [] },
  { x: 290, y: 460, w: 60, h: 100, mullX: [320], mullY: [] },
  { x: 795, y: 480, w: 165, h: 90, mullX: [850, 905], mullY: [] },
];
const CORNERS = [150, 380, 760, 1070];

/**
 * The Process page hero: the headline beside an architectural elevation that builds itself in
 * the six stages of the Accelerated Precision Building System, in order. Design: the drafting
 * grid and dimension lines. Pre-construction: ground line, survey stakes, footings. Framing:
 * studs rise across the silhouette. Trade sequencing: the envelope, roofs, chimney and openings
 * close in as the framing recedes. Finish work: siding and mullions. Move-in: the windows light
 * up. It plays once, then rests lit, the glow breathing
 * slowly. The whole drawing plays in about 4.5s. Reduced motion shows the finished, lit drawing.
 */
export function ProcessHero() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduced = useReducedMotion();
  const play = reduced || inView;
  const [done, setDone] = useState(reduced);
  const uid = useId().replace(/:/g, '');
  const id = (n: string) => `${uid}-${n}`;

  useEffect(() => {
    if (reduced) {
      setDone(true);
      return;
    }
    if (!inView) return;
    const timer = setTimeout(() => setDone(true), sec(DONE) * 1000);
    return () => clearTimeout(timer);
  }, [inView, reduced]);

  /** A stroke that draws itself at `at` seconds, over `dur`, to `opacity`. */
  const draw = (at: number, dur = 1, opacity = 1) => ({
    initial: reduced ? false : { pathLength: 0, opacity: 0 },
    animate: play ? { pathLength: 1, opacity } : undefined,
    transition: reduced
      ? { duration: 0 }
      : {
          pathLength: { delay: sec(at), duration: sec(dur), ease: EASE },
          opacity: { delay: sec(at), duration: 0.2 },
        },
  });
  const fade = (at: number, opacity = 1, dur = 0.9) => ({
    initial: reduced ? false : { opacity: 0 },
    animate: play ? { opacity } : undefined,
    transition: reduced ? { duration: 0 } : { delay: sec(at), duration: sec(dur), ease: EASE },
  });

  const studs = Array.from({ length: Math.floor((1070 - 150) / 20) + 1 }, (_, i) => 150 + i * 20);
  const battens = Array.from({ length: Math.floor((760 - 380) / 14) + 1 }, (_, i) => 380 + i * 14);

  return (
    <section
      className="relative isolate overflow-hidden bg-ink text-white"
      style={{
        background:
          'radial-gradient(70% 60% at 72% 55%, rgba(122,98,80,0.30) 0%, rgba(122,98,80,0) 70%), #1A1815',
      }}
      data-testid="process-hero"
    >
      <div className="section-x grid-12 min-h-[100svh] items-center gap-y-12 pb-[clamp(3rem,6vw,5rem)] pt-[calc(6.5rem+clamp(2rem,4vw,3rem))]">
        <motion.div
          className="col-span-12 max-w-[34rem] lg:col-span-5"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <p className="label text-white/80">{intro.eyebrow}</p>
          <h1 className="mt-5 font-serif text-hero font-normal">{intro.headline}</h1>
          <p className="mt-8 max-w-text text-body text-white/85">{intro.supporting}</p>
        </motion.div>

        <div ref={ref} className="col-span-12 lg:col-span-7" data-done={done}>
          {/* Re-mounted once the reduced-motion preference is known, so it then renders finished. */}
          <svg
            key={reduced ? 'still' : 'motion'}
            viewBox="0 0 1200 720"
            className="h-auto w-full"
            role="img"
            aria-label="An architectural elevation of a home drawing itself in six stages, from the design grid and survey stakes through framing, the envelope and finishes, to lit windows at move-in."
          >
            <defs>
              <pattern id={id('grid')} width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke={WHITE} strokeWidth="0.6" />
              </pattern>
              <clipPath id={id('shell')}>
                <path d={SILHOUETTE} />
              </clipPath>
              <clipPath id={id('main')}>
                <path d={MAIN} />
              </clipPath>
              <linearGradient id={id('glow')} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={GLOW} stopOpacity="0.95" />
                <stop offset="100%" stopColor="#B98C5E" stopOpacity="0.9" />
              </linearGradient>
              <radialGradient id={id('spill')}>
                <stop offset="0%" stopColor={GLOW} stopOpacity="0.35" />
                <stop offset="100%" stopColor={GLOW} stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 01 Design: the drafting grid, center line and dimension lines. */}
            <motion.rect
              width="1200"
              height="720"
              fill={`url(#${id('grid')})`}
              {...fade(T[0], 0.07, 1.4)}
            />
            <motion.path
              d="M570 110 V640"
              stroke={CHAMPAGNE}
              strokeWidth="1"
              strokeDasharray="14 5 3 5"
              fill="none"
              {...fade(T[0] + 0.3, 0.45)}
            />
            <motion.path
              d="M150 120 H1070 M150 108 V132 M1070 108 V132 M144 126 L156 114 M1064 126 L1076 114"
              stroke={CHAMPAGNE}
              strokeWidth="1"
              fill="none"
              {...draw(T[0] + 0.2, 1.2, 0.8)}
            />
            <motion.path
              d="M1120 170 V600 M1108 170 H1132 M1108 600 H1132 M1114 176 L1126 164 M1114 606 L1126 594"
              stroke={CHAMPAGNE}
              strokeWidth="1"
              fill="none"
              {...draw(T[0] + 0.5, 1.1, 0.8)}
            />
            <motion.path
              d="M150 132 V300 M1070 132 V420 M760 330 H1100 M1070 600 H1100"
              stroke={CHAMPAGNE}
              strokeWidth="0.8"
              strokeDasharray="3 5"
              fill="none"
              {...fade(T[0] + 0.9, 0.4)}
            />

            {/* 02 Pre-construction: ground line, string line, survey stakes, footings. */}
            <motion.path
              d={`M40 ${GROUND} H1160`}
              stroke={WHITE}
              strokeWidth="1.5"
              fill="none"
              {...draw(T[1], 1.1, 0.9)}
            />
            <motion.path
              d={`M150 ${GROUND + 14} H1070 ${CORNERS.map((x) => `M${x} ${GROUND} V${GROUND + 34}`).join(' ')}`}
              stroke={WHITE}
              strokeWidth="1"
              strokeDasharray="5 5"
              fill="none"
              {...fade(T[1] + 0.5, 0.45)}
            />
            {CORNERS.map((x, i) => (
              <motion.path
                key={x}
                d={`M${x - 9} ${GROUND} H${x + 9} M${x} ${GROUND - 9} V${GROUND + 9}`}
                stroke={CHAMPAGNE}
                strokeWidth="1.5"
                fill="none"
                {...fade(T[1] + 0.3 + i * 0.12, 1, 0.4)}
              />
            ))}

            {/* 03 Framing: studs rise across the silhouette, then recede once it is closed in. */}
            <motion.g
              clipPath={`url(#${id('shell')})`}
              initial={reduced ? false : { opacity: 1 }}
              animate={play ? { opacity: [1, 1, 0.14] } : undefined}
              transition={{ duration: sec(T[3] + 1.2), times: [0, (T[3] + 0.2) / (T[3] + 1.2), 1] }}
            >
              {studs.map((x, i) => (
                <motion.path
                  key={x}
                  d={`M${x} ${GROUND} V160`}
                  stroke={WHITE}
                  strokeWidth="1"
                  fill="none"
                  {...draw(T[2] + i * 0.022, 0.7, 0.42)}
                />
              ))}
              <motion.path
                d="M150 410 H380 M380 330 H760 M760 430 H1070"
                stroke={WHITE}
                strokeWidth="1.25"
                fill="none"
                {...draw(T[2] + 0.9, 0.8, 0.6)}
              />
            </motion.g>

            {/* 04 Trade sequencing: the envelope, roofs with overhangs, chimney, openings. */}
            <motion.path
              d={SILHOUETTE}
              stroke={WHITE}
              strokeWidth="1.75"
              fill="none"
              {...draw(T[3], 1.6)}
            />
            <motion.path
              d="M130 425 L275 300 L380 390 M358 349 L570 165 L782 349 M745 422 H1085 M745 430 H1085"
              stroke={WHITE}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              {...draw(T[3] + 0.4, 1.3)}
            />
            <motion.path
              d="M990 422 V350 H1035 V422 M982 350 H1043 M982 343 H1043"
              stroke={WHITE}
              strokeWidth="1.5"
              fill="none"
              {...draw(T[3] + 0.9, 0.9)}
            />
            {WINDOWS.map((w, i) => (
              <motion.rect
                key={i}
                x={w.x}
                y={w.y}
                width={w.w}
                height={w.h}
                stroke={WHITE}
                strokeWidth="1.5"
                fill="none"
                {...draw(T[3] + 0.8 + i * 0.12, 0.8)}
              />
            ))}

            {/* 05 Finish work: board-and-batten on the main gable, mullions, a door. */}
            <g clipPath={`url(#${id('main')})`}>
              {battens.map((x, i) =>
                x > 470 && x < 670 ? null : (
                  <motion.path
                    key={x}
                    d={`M${x} ${GROUND} V160`}
                    stroke={WHITE}
                    strokeWidth="0.8"
                    fill="none"
                    {...draw(T[4] + i * 0.018, 0.7, 0.22)}
                  />
                ),
              )}
            </g>
            <motion.path
              d="M992 600 V510 H1034 V600"
              stroke={WHITE}
              strokeWidth="1.25"
              fill="none"
              {...draw(T[4] + 0.2, 0.7, 0.8)}
            />

            {/* 06 Move-in: the windows light, and light spills onto the ground. */}
            <motion.ellipse
              cx="570"
              cy={GROUND + 6}
              rx="260"
              ry="40"
              fill={`url(#${id('spill')})`}
              {...fade(T[5] + 0.3, 1, 1.4)}
            />
            <motion.g
              initial={reduced ? false : { opacity: 0 }}
              animate={
                done && !reduced ? { opacity: [0.88, 1, 0.88] } : play ? { opacity: 1 } : undefined
              }
              transition={
                done && !reduced
                  ? { duration: 5, repeat: Infinity, ease: 'easeInOut' }
                  : { delay: sec(T[5]), duration: sec(1.4), ease: EASE }
              }
            >
              {WINDOWS.map((w, i) => (
                <rect
                  key={i}
                  x={w.x}
                  y={w.y}
                  width={w.w}
                  height={w.h}
                  fill={`url(#${id('glow')})`}
                />
              ))}
            </motion.g>
            {/* Mullions draw last so they sit over the glow. */}
            {WINDOWS.map((w, i) => (
              <motion.path
                key={i}
                d={[
                  ...w.mullX.map((x) => `M${x} ${w.y} V${w.y + w.h}`),
                  ...w.mullY.map((y) => `M${w.x} ${y} H${w.x + w.w}`),
                ].join(' ')}
                stroke="#1A1815"
                strokeOpacity="0.55"
                strokeWidth="2"
                fill="none"
                {...draw(T[4] + 0.4 + i * 0.1, 0.6)}
              />
            ))}
            {/* The window frames, redrawn over the glow so the openings stay crisp. */}
            {WINDOWS.map((w, i) => (
              <motion.rect
                key={`f${i}`}
                x={w.x}
                y={w.y}
                width={w.w}
                height={w.h}
                stroke={WHITE}
                strokeWidth="1.5"
                fill="none"
                {...fade(T[5], 1, 0.4)}
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
