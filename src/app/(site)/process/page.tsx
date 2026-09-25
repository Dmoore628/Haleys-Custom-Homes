import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { FramingSquare } from '@/components/ui/SignatureAccents';
import { SequencingLedger } from '@/components/sections/SequencingLedger';
import { PhaseSequence } from '@/components/sections/PhaseSequence';
import { ClosingCta } from '@/components/sections/ClosingCta';

export const metadata: Metadata = {
  title: copy.process.meta.title,
  description: copy.process.meta.description,
  openGraph: { images: [{ url: '/og/process.jpg', width: 1200, height: 630 }] },
};

export default function ProcessPage() {
  const { intro, hook, concierge } = copy.process;
  return (
    <>
      {/* Intro: same restrained treatment as Home's positioning statement. */}
      <section className="section-x bg-bone pb-section pt-[calc(6.5rem+clamp(4rem,9vw,9rem))]">
        <div className="grid-12 items-center">
          <Reveal className="col-span-12 max-w-statement md:col-span-8 md:col-start-2">
            <Eyebrow>{intro.eyebrow}</Eyebrow>
            <h1 className="mt-4 font-serif text-section font-normal">{intro.headline}</h1>
            <p className="text-block mt-8 text-body">{intro.supporting}</p>
          </Reveal>
          {/* Signature Motion Accent: the framing square, opposite the intro text on desktop. */}
          <div className="hidden justify-center md:col-span-3 md:col-start-10 md:flex">
            <FramingSquare />
          </div>
        </div>
      </section>

      {/* The Sequencing Ledger: the primary, roomier presentation of the Home device. */}
      <section className="section-x bg-bone pb-section">
        <Reveal>
          <h2 className="font-serif text-section font-normal">{hook.headline}</h2>
        </Reveal>
        <div className="mt-10 md:mt-14">
          <SequencingLedger spacious />
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
    </>
  );
}
