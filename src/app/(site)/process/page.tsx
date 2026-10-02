import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProcessHero } from '@/components/sections/ProcessHero';
import { BuildTimeline } from '@/components/sections/BuildTimeline';
import { ApbMark } from '@/components/ui/ApbMark';
import { PhaseSequence } from '@/components/sections/PhaseSequence';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { EcoSummary } from '@/components/sections/EcoSummary';
import { CoverStack } from '@/components/ui/CoverStack';
import { sharePreview } from '@/lib/seo';

export const metadata: Metadata = {
  title: copy.process.meta.title,
  description: copy.process.meta.description,
  openGraph: sharePreview('/process', { url: '/og/process.jpg' }),
};

export default function ProcessPage() {
  const { hook, concierge } = copy.process;
  return (
    <CoverStack>
      <ProcessHero />

      {/* The build timeline: the punch list along the schedule, scrubbed by scroll. */}
      <section className="section-x bg-white py-section" aria-labelledby="difference-heading">
        <BuildTimeline
          intro={
            <>
              <ApbMark />
              <h2 id="difference-heading" className="mt-8 font-serif text-section font-normal">
                {hook.headline}
              </h2>
            </>
          }
        />
      </section>

      {/* Six-phase sequence with the progress rail. */}
      <section className="section-x section-y bg-white" aria-label="The six phases">
        <PhaseSequence />
      </section>

      {/* Concierge: photo and plain text, asymmetric split. */}
      <section className="section-x section-y bg-white">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tile md:aspect-[4/3]">
              <SmartImage
                src={concierge.image}
                alt=""
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <h2 className="font-serif text-section font-normal">{concierge.headline}</h2>
            <p className="mt-6 text-body">{concierge.body}</p>
          </Reveal>
        </div>
      </section>

      <EcoSummary />

      {/* The hero already uses the flyover; close on a different home. */}
      <ClosingCta still="/images/projects/heaven-at-sunset/cover.jpg" />
    </CoverStack>
  );
}
