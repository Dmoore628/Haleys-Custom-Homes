import copy from '@content/copy.config';
import { testimonials } from '@/lib/content';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Marquee } from '@/components/ui/Marquee';
import { Reveal } from '@/components/ui/Reveal';

/**
 * Continuous right-to-left marquee of the three real testimonials. Cards keep their natural
 * heights (height: auto, top-aligned row), so a short quote reads as a short card.
 */
export function Testimonials() {
  return (
    <section className="section-y overflow-hidden bg-bone">
      <Reveal className="section-x">
        <Eyebrow>{copy.home.testimonials.eyebrow}</Eyebrow>
      </Reveal>
      <Marquee
        direction="rtl"
        duration={56}
        repeat={2}
        align="start"
        label="Client testimonials"
        className="mt-10"
      >
        {testimonials.map((t) => (
          <figure
            key={t.name}
            // Focusable so keyboard users can pause the strip on a card to read it.
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0}
            className="mr-grid flex h-auto w-[clamp(320px,30vw,440px)] shrink-0 flex-col bg-ink/[0.04] p-[clamp(1.5rem,3vw,3rem)]"
          >
            <blockquote className="font-serif text-card italic">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="label mt-6">
              {t.name}
              <span className="mt-1 block text-ink/70">{t.projectType}</span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
