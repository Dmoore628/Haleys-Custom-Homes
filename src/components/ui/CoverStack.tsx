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
      {Children.toArray(children).map((child, i) => (
        <Pinned key={i} first={i === 0}>
          {child}
        </Pinned>
      ))}
    </>
  );
}
