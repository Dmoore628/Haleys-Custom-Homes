import { Children, type ReactNode } from 'react';
import { Pinned } from './Pinned';

/**
 * Wraps each child section of a page in the cover transition, so every section slides up over
 * the one before it, and the footer over the last. Children must be the page's top-level
 * sections, each with an opaque background.
 */
export function CoverStack({ children }: { children: ReactNode }) {
  return (
    <>
      {/* On navigation Next scrolls to the page's first element that isn't sticky or fixed.
          Every section here is sticky, so without this marker it found the footer spacer at
          the bottom and scrolled there: this zero-height anchor keeps it at the top. */}
      <div aria-hidden="true" data-scroll-anchor className="h-0" />
      {Children.toArray(children).map((child, i) => (
        <Pinned key={i} first={i === 0}>
          {child}
        </Pinned>
      ))}
    </>
  );
}
