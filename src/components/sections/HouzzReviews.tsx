'use client';

import { motion, useInView } from 'framer-motion';
import { useId, useRef, useState } from 'react';
import copy from '@content/copy.config';
import { testimonials } from '@/lib/content';
import { EASE } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const { reviews } = copy.home;
/** Seconds each review stays up while playing. */
const DWELL = 12;
const STAR =
  'M12 2.6l2.82 5.72 6.31.92-4.57 4.45 1.08 6.29L12 17.02l-5.64 2.96 1.08-6.29-4.57-4.45 6.31-.92z';

// Pause and play drawn with the same path commands, so one morphs smoothly into the other.
const PAUSE = 'M7 5 L10 5 L10 19 L7 19 Z M14 5 L17 5 L17 19 L14 19 Z';
const PLAY = 'M7 5 L12.5 8.5 L12.5 15.5 L7 19 Z M12.5 8.5 L18 12 L18 12 L12.5 15.5 Z';

/** One star: its outline draws, then an accent fill wipes across it. */
function Star({ index, play, reduced }: { index: number; play: boolean; reduced: boolean }) {
  const clip = `${useId().replace(/:/g, '')}-clip`;
  const delay = 0.15 + index * 0.12;
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <motion.rect
            x="0"
            y="0"
            height="24"
            initial={reduced ? false : { width: 0 }}
            animate={play ? { width: 24 } : undefined}
            transition={{ delay: delay + 0.35, duration: 0.5, ease: EASE }}
            width={reduced ? 24 : 0}
          />
        </clipPath>
      </defs>
      <motion.path
        d={STAR}
        fill="none"
        stroke="#7A6250"
        strokeWidth="1.25"
        strokeLinejoin="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={play ? { pathLength: 1 } : undefined}
        transition={{ delay, duration: 0.6, ease: EASE }}
      />
      <path d={STAR} fill="#7A6250" clipPath={`url(#${clip})`} />
    </svg>
  );
}

/**
 * Haley's standing on Houzz, then the three client reviews, one at a time: the stars draw in
 * and fill, and the reviews cross-fade on a steady cycle with a progress line per review.
 * The cycle runs only while the block is on screen, pauses on hover or focus and with the
 * pause control, and never runs under reduced motion. Every quote stays in the layout (stacked
 * in one grid cell), so the block is as tall as the longest review and nothing jumps.
 */
export function HouzzReviews() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const running = !reduced && !paused && !hovering && inView;
  const next = () => setIndex((i) => (i + 1) % testimonials.length);

  return (
    <div
      ref={ref}
      className="border-t border-ink/15 pt-8"
      role="region"
      aria-roledescription="carousel"
      aria-label={reviews.label}
      data-testid="houzz-reviews"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div
          className="flex items-center gap-1"
          role="img"
          aria-label={`${reviews.rating} out of 5 stars`}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} index={i} play={reduced || seen} reduced={reduced} />
          ))}
        </div>
        <p className="flex items-baseline gap-3">
          <span className="font-serif text-[1.5rem] leading-none">{reviews.rating}</span>
          <a
            href={reviews.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label text-ink/70 underline decoration-ink/25 underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
          >
            {reviews.count} {reviews.countLabel}
          </a>
        </p>
      </div>
      <p className="label mt-2 text-ink/70">{reviews.bestOf}</p>

      {/* The reviews, stacked in one cell. */}
      <div className="mt-8 grid" aria-live={running ? 'off' : 'polite'}>
        {testimonials.map((t, i) => {
          const on = i === index;
          return (
            <motion.figure
              key={t.name}
              className="col-start-1 row-start-1"
              aria-hidden={!on}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${testimonials.length}`}
              initial={false}
              animate={
                reduced
                  ? { opacity: on ? 1 : 0 }
                  : {
                      opacity: on ? 1 : 0,
                      y: on ? 0 : 10,
                      filter: on ? 'blur(0px)' : 'blur(6px)',
                    }
              }
              transition={{ duration: on ? 0.8 : 0.45, delay: on ? 0.2 : 0, ease: EASE }}
              style={{ pointerEvents: on ? 'auto' : 'none' }}
            >
              <blockquote className="font-serif text-[clamp(1.0625rem,1.3vw,1.25rem)] italic leading-[1.6] text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3">
                <span className="label">{t.name}</span>
                <span className="label text-ink/70">{t.projectType}</span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      {/* Progress: one line per review. The active line fills over the dwell time. */}
      <div className="mt-8 flex items-center gap-4">
        <div className="flex flex-1 gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show review from ${t.name}`}
              aria-current={i === index}
              className="group relative flex-1 py-3"
            >
              <span className="block h-px w-full bg-ink/20 transition-colors duration-200 group-hover:bg-ink/40">
                <span
                  key={`${i}-${index}`}
                  className={`review-progress block h-px w-full origin-left bg-ink ${
                    i < index ? 'scale-x-100' : i > index ? 'scale-x-0' : ''
                  }`}
                  style={
                    i === index
                      ? reduced
                        ? { transform: 'scaleX(1)' }
                        : {
                            animation: `review-progress ${DWELL}s linear forwards`,
                            animationPlayState: running ? 'running' : 'paused',
                          }
                      : undefined
                  }
                  onAnimationEnd={i === index ? next : undefined}
                />
              </span>
            </button>
          ))}
        </div>
        <span className="label tabular-nums text-ink/70" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
        </span>
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play reviews' : 'Pause reviews'}
            aria-pressed={paused}
            className="-m-2 p-2 text-ink transition-colors duration-200 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <motion.path
                initial={false}
                animate={{ d: paused ? PLAY : PAUSE }}
                transition={{ duration: 0.35, ease: EASE }}
                fill="currentColor"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
