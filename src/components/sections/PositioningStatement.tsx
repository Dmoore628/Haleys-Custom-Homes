import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { YearText } from '@/components/providers/YearProvider';
import { TopoBackdrop } from '@/components/ui/TopoBackdrop';
import { FoundingLine } from './FoundingLine';
import { HouzzReviews } from './HouzzReviews';
import { ServiceMap } from './ServiceMap';
import { WordReveal } from './WordReveal';

/**
 * The first thing after the hero: who Haley is, where Haley builds, what clients say.
 * Left, the statement, the founding line and its drawn timeline; right, the Colorado service
 * map (two columns from xl, stacked below). Beneath both, centered, Haley's Houzz standing and
 * a marquee of client reviews (the old site also put its reviews right after the hero). A
 * faint contour backdrop drifts behind it all for depth.
 *
 * `relative z-10` and an opaque background so it slides up over the pinned hero. The phrase
 * "three to five homes" is the statement's one use of the accent color.
 */
export function PositioningStatement() {
  const { positioning } = copy.home;
  return (
    <section
      className="section-y relative isolate z-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(55% 45% at 12% 18%, rgba(122,98,80,0.09) 0%, rgba(122,98,80,0) 100%), radial-gradient(50% 40% at 85% 88%, rgba(122,98,80,0.08) 0%, rgba(122,98,80,0) 100%), #EFE9DE',
      }}
      aria-labelledby="positioning-heading"
    >
      <TopoBackdrop />
      <div className="section-x">
        <div className="grid-12 items-center gap-y-16">
          <div className="relative col-span-12 max-w-statement xl:col-span-5 xl:max-w-none">
            {/* Signature Motion Accent 1 of 3: an oversized Newsreader italic opening quotation
                mark, ink at 15%, overlapping the heading's top-left corner so mark and statement
                read as one composed object. Static. */}
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
                <YearText text={positioning.supporting} />
              </Reveal>
              <div className="mt-12 max-w-[28rem]">
                <FoundingLine />
              </div>
            </div>
          </div>

          <Reveal className="col-span-12 xl:col-span-6 xl:col-start-7" delay={0.1}>
            <ServiceMap />
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-[clamp(5rem,10vw,9rem)]" delay={0.05}>
        <HouzzReviews />
      </Reveal>
    </section>
  );
}
