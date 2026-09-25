import type { Transition, Variants } from 'framer-motion';

/** The one easing curve used everywhere on the site. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

export const DURATION = {
  micro: 0.2,
  reveal: 0.6,
  heroFade: 0.4,
  pageFade: 0.3,
  crossfade: 0.4,
  layout: 0.3,
} as const;

export const transition = (duration: number, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE,
});

/** Standard section reveal: 24px rise and fade, once. Reduced motion drops the movement. */
export function revealVariants(reduced: boolean): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  };
}

/** Viewport options: trigger once at roughly 20% visibility. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.2 } as const;

/** Progress (0-1) of scrolling through a section, measured against a viewport anchor line. */
export function sectionProgress(
  top: number,
  height: number,
  viewportHeight: number,
  anchor = 0.5,
): number {
  if (height <= 0) return 0;
  const line = viewportHeight * anchor;
  return Math.min(1, Math.max(0, (line - top) / height));
}
