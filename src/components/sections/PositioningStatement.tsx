import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { HouzzReviews } from './HouzzReviews';
import { ServiceMap } from './ServiceMap';
import { WordReveal } from './WordReveal';

/**
 * The first thing after the hero: who Haley is, what clients say, and where Haley builds.
 * Left, the positioning statement as the heading, the founding line, then Haley's Houzz
 * standing and client reviews (the old site also put its reviews right after the hero).
 * Right, the bespoke Colorado service map. Splits into two columns at xl; below that the map
 * follows at full width.
 *
 * `relative z-10` and an opaque background so it slides up over the pinned hero. The phrase
 * "three to five homes" is the statement's one use of the accent color.
 */
export function PositioningStatement() {
  const { positioning } = copy.home;
  return (
    <section
      className="section-x section-y relative z-10 flex min-h-[min(100vh,720px)] items-center overflow-hidden bg-bone md:min-h-screen"
      aria-labelledby="positioning-heading"
    >
      <div className="grid-12 w-full items-center gap-y-16 md:gap-y-20">
        <div className="relative col-span-12 max-w-statement xl:col-span-6 xl:max-w-none xl:pr-6">
          {/* Signature Motion Accent 1 of 3: an oversized Newsreader italic opening quotation mark,
              ink at 15%, overlapping the heading's top-left corner so mark and statement read
              as one composed object. Static. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -left-[0.18em] -top-[0.32em] select-none font-serif italic leading-none text-ink/[0.15]"
            style={{ fontSize: 'clamp(10rem, 16vw, 19rem)', fontVariationSettings: "'opsz' 6" }}
            data-testid="accent-quote"
          >
            &ldquo;
          </span>
          <div className="relative">
            <WordReveal
              id="positioning-heading"
              text={positioning.main}
              highlight={positioning.highlight}
              className="font-serif text-section font-normal"
            />
            <Reveal as="p" className="text-block mt-8 text-body text-ink/80">
              {positioning.supporting}
            </Reveal>

            <Reveal className="mt-12" delay={0.1}>
              <HouzzReviews />
            </Reveal>
          </div>
        </div>

        <Reveal className="col-span-12 xl:col-span-6 xl:col-start-7" delay={0.1}>
          <ServiceMap />
        </Reveal>
      </div>
    </section>
  );
}
