import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { awards } from '@/lib/content';
import { MarkImage } from '@/components/ui/MarkImage';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { PlumbBob } from '@/components/ui/SignatureAccents';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Community } from '@/components/sections/Community';
import { Affiliations } from '@/components/sections/Affiliations';
import { CoverStack } from '@/components/ui/CoverStack';
import { Sentences } from '@/components/ui/Sentences';
import { keepTogether } from '@/lib/text';
import { sharePreview } from '@/lib/seo';

export const metadata: Metadata = {
  title: copy.about.meta.title,
  description: copy.about.meta.description,
  openGraph: sharePreview('/about', { url: '/og/about.jpg' }),
};

export default function AboutPage() {
  const { founder, philosophy } = copy.about;

  return (
    <CoverStack>
      {/* Founder intro. Desktop: 7/5 split, text left, centered in its column and on the portrait. */}
      <section className="section-x bg-white pb-section pt-[calc(6.5rem+clamp(3rem,7vw,7rem))]">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0">
          <Reveal className="md:order-2 md:col-span-5 md:col-start-8">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[26rem] overflow-hidden rounded-tile md:mx-0 md:max-w-none">
              <SmartImage
                src={founder.image}
                alt={founder.imageAlt}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-cover object-top"
              />
            </div>
          </Reveal>
          <Reveal
            className="text-center md:order-1 md:col-span-7 md:pr-[clamp(0rem,4vw,4rem)]"
            delay={0.1}
          >
            <h1 className="font-serif text-section font-normal">{founder.headline}</h1>
            <p className="mx-auto mt-8 max-w-text text-body">{founder.body}</p>
            <p className="mx-auto mt-5 max-w-text text-body">{founder.more}</p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy: Home's large statement treatment over a quiet full-bleed detail shot. */}
      <section className="relative z-10 overflow-hidden text-white">
        <SmartImage src={philosophy.image} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <div className="section-x section-y relative">
          <div className="grid-12 py-[clamp(2rem,6vw,6rem)]">
            <div className="col-span-12 max-w-statement md:col-span-10 md:col-start-2">
              <Reveal as="h2" className="font-serif text-section font-normal">
                <Sentences text={philosophy.statement} />
              </Reveal>
              <Reveal as="p" className="text-block mt-8 text-body" delay={0.1}>
                {philosophy.supporting}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Awards, expanded. The plumb bob hangs from the philosophy section above it. */}
      <section className="section-x section-y relative bg-white" aria-labelledby="awards-heading">
        <div className="pointer-events-none absolute right-[clamp(1.5rem,8vw,8rem)] top-0 hidden md:block">
          <PlumbBob />
        </div>
        <h2 id="awards-heading" className="sr-only">
          {copy.about.awardsHeading}
        </h2>
        <ul className="relative mx-auto max-w-[64rem] border-t border-ink/10">
          {awards.map((a, i) => (
            <Reveal
              as="li"
              key={a.id}
              delay={i * 0.05}
              className="grid grid-cols-1 gap-6 border-b border-ink/10 py-10 md:grid-cols-12 md:items-center md:gap-x-grid"
            >
              <div className="flex min-h-14 items-center justify-center md:col-span-4">
                {a.mark && (
                  <MarkImage src={a.mark} alt={a.markAlt} base="clamp(44px, 4.4vw, 60px)" />
                )}
              </div>
              <div className="text-center md:col-span-8 md:text-left">
                <h3 className="font-serif text-statement font-normal">
                  {a.name}
                  {a.year ? ` (${a.year})` : ''}
                </h3>
                <p className="mx-auto mt-3 max-w-text text-body md:mx-0">
                  {keepTogether(a.description)}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <Affiliations />

      <Community />

      <ClosingCta />
    </CoverStack>
  );
}
