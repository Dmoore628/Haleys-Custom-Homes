import copy from '@content/copy.config';
import { testimonials } from '@/lib/content';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Marquee } from '@/components/ui/Marquee';
import { Reveal } from '@/components/ui/Reveal';

/** Continuous right-to-left marquee of the three real testimonials. */
export function Testimonials() {
  return (
    <section className="section-y overflow-hidden bg-bone">
      <Reveal className="section-x">
        <Eyebrow>{copy.home.testimonials.eyebrow}</Eyebrow>
      </Reveal>
      <Marquee direction="rtl" duration={56} label="Client testimonials" className="mt-10">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            tabIndex={0}
            className="mr-grid flex w-[clamp(320px,30vw,440px)] shrink-0 flex-col justify-between bg-ink/[0.04] p-[clamp(1.5rem,3vw,3rem)]"
          >
            <blockquote className="text-card">&ldquo;{t.quote}&rdquo;</blockquote>
            <figcaption className="label mt-4">
              {t.name}
              <span className="block text-ink/70">{t.projectType}</span>
            </figcaption>
          </figure>
        ))}
      </Marquee>
    </section>
  );
}
