import copy from '@content/copy.config';

/** First focusable element on every page. Hidden until focused. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="label fixed left-4 top-4 z-[100] -translate-y-[200%] rounded-btn bg-ink px-4 py-3 text-bone focus:translate-y-0"
    >
      {copy.nav.skip}
    </a>
  );
}
