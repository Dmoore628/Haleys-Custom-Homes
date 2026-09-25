import type { ReactNode } from 'react';

// React 18's types don't include `inert`; an empty string renders the boolean attribute.
const INERT = { inert: '' } as Record<string, string>;

interface MarqueeProps {
  /** ltr for the awards strip, rtl for testimonials. */
  direction: 'ltr' | 'rtl';
  /** Seconds for one full loop (Design System: roughly 45 to 60). */
  duration?: number;
  label: string;
  children: ReactNode;
  className?: string;
}

/**
 * Continuous-loop strip. The content is rendered twice back to back so the loop point
 * is invisible; the second copy is hidden from assistive tech. Pauses on hover or focus,
 * and becomes a static wrapped row under prefers-reduced-motion.
 */
export function Marquee({ direction, duration = 52, label, children, className = '' }: MarqueeProps) {
  return (
    <section
      aria-label={label}
      className={`marquee ${className}`}
      data-direction={direction}
      style={{ ['--marquee-duration' as string]: `${duration}s` }}
    >
      <div className="marquee-track">
        <div className="flex shrink-0">{children}</div>
        <div className="marquee-duplicate flex shrink-0" aria-hidden="true" {...INERT}>
          {children}
        </div>
      </div>
    </section>
  );
}
