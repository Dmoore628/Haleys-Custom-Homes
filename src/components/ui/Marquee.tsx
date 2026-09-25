import { Fragment, type ReactNode } from 'react';

// React 18's types don't include `inert`; an empty string renders the boolean attribute.
const INERT = { inert: '' } as Record<string, string>;

interface MarqueeProps {
  /** ltr for the awards strip, rtl for testimonials. */
  direction: 'ltr' | 'rtl';
  /** Seconds for one full loop (Design System: roughly 45 to 60). */
  duration?: number;
  label: string;
  /**
   * How many times the content repeats inside each half of the track, so a short list still
   * fills the widest expected viewport (2560px) on first paint, with no half-empty strip.
   */
  repeat?: number;
  /** Cross-axis alignment of items: testimonial cards top-align at their natural heights. */
  align?: 'start' | 'center';
  children: ReactNode;
  className?: string;
}

/**
 * Continuous-loop strip. The content is rendered twice back to back so the loop point is
 * invisible; the second copy is hidden from assistive tech. Pauses on hover or focus, and
 * becomes a static wrapped row under prefers-reduced-motion.
 */
export function Marquee({
  direction,
  duration = 52,
  label,
  repeat = 1,
  align = 'center',
  children,
  className = '',
}: MarqueeProps) {
  const items = align === 'start' ? 'items-start' : 'items-center';
  const set = Array.from({ length: repeat }, (_, i) => <Fragment key={i}>{children}</Fragment>);
  return (
    <section
      aria-label={label}
      className={`marquee ${className}`}
      data-direction={direction}
      style={{ ['--marquee-duration' as string]: `${duration * repeat}s` }}
    >
      <div className={`marquee-track ${items}`}>
        <div className={`flex shrink-0 ${items}`}>
          {children}
          {repeat > 1 && (
            <div
              className={`marquee-duplicate flex shrink-0 ${items}`}
              aria-hidden="true"
              {...INERT}
            >
              {set.slice(1)}
            </div>
          )}
        </div>
        <div className={`marquee-duplicate flex shrink-0 ${items}`} aria-hidden="true" {...INERT}>
          {set}
        </div>
      </div>
    </section>
  );
}
