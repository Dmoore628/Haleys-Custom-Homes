'use client';

import { motion, useInView } from 'framer-motion';
import { useId, useRef } from 'react';
import copy from '@content/copy.config';
import { testimonials } from '@/lib/content';
import { EASE } from '@/lib/animation';
import { contourRing } from '@/lib/topo';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { keepTogether } from '@/lib/text';
import { Marquee } from '@/components/ui/Marquee';
import { YearText } from '@/components/providers/YearProvider';

const { reviews } = copy.home;
const STAR =
  'M12 2.6l2.82 5.72 6.31.92-4.57 4.45 1.08 6.29L12 17.02l-5.64 2.96 1.08-6.29-4.57-4.45 6.31-.92z';

/**
 * Card colorways, all from the palette: the accent, ink, and a champagne tint of the accent
 * (35% accent into bone). Each pairing clears WCAG AA for its text.
 */
const THEMES = [
  { card: 'bg-accent text-bone', mark: '#EFE9DE' },
  { card: 'bg-ink text-bone', mark: '#C6BAAC' },
  { card: 'bg-[#C6BAAC] text-ink', mark: '#1A1815' },
] as const;

/** One star: its outline draws, then a fill wipes across it. */
function Star({ index, play, reduced }: { index: number; play: boolean; reduced: boolean }) {
  const clip = `${useId().replace(/:/g, '')}-clip`;
  const delay = 0.2 + index * 0.12;
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <motion.rect
            x="0"
            y="0"
            height="24"
            initial={reduced ? false : { width: 0 }}
            animate={play ? { width: 24 } : undefined}
            transition={{ delay: delay + 0.35, duration: 0.5, ease: EASE }}
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
 * Haley's standing on Houzz, centered, over a slow marquee of client review cards (the old
 * site also put its reviews right after the hero). The rating's stars draw in and fill once;
 * the cards, in three palette colorways with contour-ring vectors, drift right to left and
 * pause on hover or focus. Under reduced motion the strip is a static row.
 */
export function HouzzReviews() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const reduced = useReducedMotion();
  const play = reduced || seen;

  return (
    <div data-testid="houzz-reviews">
      <div ref={ref} className="section-x flex flex-col items-center text-center">
        <div
          className="flex items-center gap-1.5"
          role="img"
          aria-label={`${reviews.rating} out of 5 stars`}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} index={i} play={play} reduced={reduced} />
          ))}
        </div>
        <p className="mt-5 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-2">
          <span className="font-serif text-[clamp(2.75rem,5vw,4rem)] leading-none">
            {reviews.rating}
          </span>
          <a
            href={reviews.href}
            target="_blank"
            rel="noopener noreferrer"
            className="label underline decoration-ink/30 underline-offset-[6px] transition-colors duration-200 hover:text-accent hover:decoration-accent"
          >
            {reviews.count} {reviews.countLabel}
          </a>
        </p>
        <p className="label mt-3 text-ink/70">
          <YearText text={reviews.bestOf} />
        </p>
      </div>

      <Marquee
        direction="rtl"
        duration={60}
        repeat={2}
        align="start"
        label={reviews.label}
        className="mt-[clamp(2rem,4vw,3rem)] py-10"
      >
        {testimonials.map((t, i) => {
          const theme = THEMES[i % THEMES.length];
          return (
            <figure
              key={t.name}
              // Focusable so keyboard users can pause the strip on a card to read it.
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
              tabIndex={0}
              className={`relative isolate mr-grid flex w-[clamp(300px,32vw,480px)] shrink-0 flex-col overflow-hidden rounded-[6px] p-[clamp(1.75rem,3vw,2.75rem)] shadow-[0_30px_60px_-30px_rgba(26,24,21,0.5),0_12px_24px_-16px_rgba(26,24,21,0.3)] ${theme.card}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64"
              >
                {[26, 44, 62, 80, 98].map((r, k) => (
                  <path
                    key={r}
                    d={contourRing([100, 100], r, i * 1.7 + k * 0.5, 1.1)}
                    fill="none"
                    stroke={theme.mark}
                    strokeWidth="0.8"
                    opacity={0.24 - k * 0.04}
                  />
                ))}
              </svg>
              <div className="flex gap-1" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((s) => (
                  <svg key={s} viewBox="0 0 24 24" className="h-4 w-4">
                    <path d={STAR} fill={theme.mark} />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-6 font-serif text-card italic">
                &ldquo;{keepTogether(`${t.quote}”`)}
              </blockquote>
              <figcaption className="label mt-8">
                {t.name}
                <span className="mt-1 block">{t.projectType}</span>
              </figcaption>
            </figure>
          );
        })}
      </Marquee>
    </div>
  );
}
