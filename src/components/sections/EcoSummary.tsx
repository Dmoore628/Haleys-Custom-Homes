import copy from '@content/copy.config';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { EcoMarks } from './EcoMarks';

/** Process: the eco-building practice in brief, with the way to the full page. */
export function EcoSummary() {
  const { eco } = copy.process;
  return (
    <section className="section-x section-y bg-bone" aria-labelledby="eco-summary-heading">
      <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0">
        <Reveal className="md:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-tile">
            <SmartImage
              src={eco.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal className="md:col-span-5 md:col-start-8" delay={0.1}>
          <Eyebrow>{eco.eyebrow}</Eyebrow>
          <h2 id="eco-summary-heading" className="mt-4 font-serif text-section font-normal">
            {eco.headline}
          </h2>
          <p className="mt-6 text-body">{eco.body}</p>
          <EcoMarks className="mt-8" base="clamp(44px, 4vw, 56px)" />
          <div className="mt-10">
            <ButtonLink href={eco.button.href} variant="ghost">
              {eco.button.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
