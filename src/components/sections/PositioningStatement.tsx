import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { WordReveal } from './WordReveal';

/**
 * Restraint itself is the device: a confident claim stated plainly. `relative z-10` and an
 * opaque background so it slides up over the pinned hero.
 *
 * Signature Motion Accent 1 of 3: an oversized Bodoni italic opening quotation mark fills
 * the empty columns beside the text, ink at 7%, static.
 */
export function PositioningStatement() {
  const { positioning } = copy.home;
  return (
    <section className="section-x section-y relative z-10 flex min-h-[min(100vh,720px)] items-center overflow-hidden bg-bone md:min-h-screen">
      <div className="grid-12 relative w-full">
        <div className="relative z-10 col-span-12 max-w-statement md:col-span-7 md:col-start-2">
          <WordReveal text={positioning.main} className="font-serif text-section font-normal" />
          <Reveal as="p" className="text-block mt-8 text-body">
            {positioning.supporting}
          </Reveal>
        </div>
        {/* Signature Motion Accent: fills the empty columns beside the text. The small optical
            size gives the Bodoni quote its full ball-and-teardrop form at this scale. */}
        <span
          aria-hidden="true"
          className="pointer-events-none hidden select-none self-start text-center font-serif italic leading-[0.75] text-ink/[0.07] md:col-span-3 md:col-start-10 md:block"
          style={{ fontSize: 'clamp(12rem, 20vw, 24rem)', fontVariationSettings: "'opsz' 6" }}
          data-testid="accent-quote"
        >
          &ldquo;
        </span>
      </div>
    </section>
  );
}
