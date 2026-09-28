import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { ProcessHero } from '@/components/sections/ProcessHero';
import { MoveInTimeline } from '@/components/sections/MoveInTimeline';
import { PunchList } from '@/components/sections/PunchList';
import { PhaseSequence } from '@/components/sections/PhaseSequence';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { CoverStack } from '@/components/ui/CoverStack';

export const metadata: Metadata = {
  title: copy.process.meta.title,
  description: copy.process.meta.description,
  openGraph: { images: [{ url: '/og/process.jpg', width: 1200, height: 630 }] },
};

export default function ProcessPage() {
  const { hook, concierge } = copy.process;
  return (
    <CoverStack>
      <ProcessHero />

      {/* The punch list, then the move-in timeline it leads to. */}
      <section className="section-x bg-bone py-section">
        <Reveal>
          <h2 className="font-serif text-section font-normal">{hook.headline}</h2>
        </Reveal>
        <Reveal className="mt-10 max-w-[56rem] md:mt-14">
          <PunchList />
        </Reveal>
        <div className="mt-[clamp(4rem,8vw,7rem)]">
          <MoveInTimeline />
        </div>
      </section>

      {/* Six-phase sequence with the progress rail. */}
      <section className="section-x section-y bg-bone" aria-label="The six phases">
        <PhaseSequence />
      </section>

      {/* Concierge: photo and plain text, asymmetric split. */}
      <section className="section-x section-y bg-bone">
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

      <ClosingCta />
    </CoverStack>
  );
}
