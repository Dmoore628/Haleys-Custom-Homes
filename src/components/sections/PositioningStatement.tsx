import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { WordReveal } from './WordReveal';

/**
 * Restraint itself is the device: a confident claim stated plainly. `relative z-10` and an
 * opaque background so it slides up over the pinned hero.
 *
 * The phrase "three to five homes" is the section's one use of the accent color.
 */
export function PositioningStatement() {
  const { positioning } = copy.home;
  return (
    <section className="section-x section-y relative z-10 flex min-h-[min(100vh,720px)] items-center overflow-hidden bg-bone md:min-h-screen">
      <div className="grid-12 relative w-full">
        <div className="relative col-span-12 max-w-statement md:col-span-7 md:col-start-2">
          {/* Signature Motion Accent 1 of 3: an oversized Newsreader italic opening quotation mark,
              ink at 15%, overlapping the text block's top-left corner so mark and statement read
              as one composed object. The small optical size gives it its full ball-and-teardrop
              form. Static. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-[0.18em] -top-[0.32em] select-none font-serif italic leading-none text-ink/[0.15]"
            style={{ fontSize: 'clamp(12rem, 20vw, 24rem)', fontVariationSettings: "'opsz' 6" }}
            data-testid="accent-quote"
          >
            &ldquo;
          </span>
          <div className="relative">
            <WordReveal
              text={positioning.main}
              highlight={positioning.highlight}
              className="font-serif text-section font-normal"
            />
            <Reveal as="p" className="text-block mt-8 text-body">
              {positioning.supporting}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
