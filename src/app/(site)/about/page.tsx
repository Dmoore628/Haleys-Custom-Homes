import Image from 'next/image';
import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { awards, getMedia } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { PlumbBob } from '@/components/ui/SignatureAccents';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { Community } from '@/components/sections/Community';
import { CoverStack } from '@/components/ui/CoverStack';
import { Sentences } from '@/components/ui/Sentences';
import { keepTogether } from '@/lib/text';

export const metadata: Metadata = {
  title: copy.about.meta.title,
  description: copy.about.meta.description,
  openGraph: { images: [{ url: '/og/about.jpg', width: 1200, height: 630 }] },
};

export default function AboutPage() {
  const { founder, philosophy } = copy.about;

  return (
    <CoverStack>
      {/* Founder intro. Desktop: 7/5 split, text left and vertically centered on the portrait. */}
      <section className="section-x bg-bone pb-section pt-[calc(6.5rem+clamp(3rem,7vw,7rem))]">
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
          <Reveal className="md:order-1 md:col-span-7 md:pr-[clamp(0rem,4vw,4rem)]" delay={0.1}>
            <h1 className="font-serif text-section font-normal">{founder.headline}</h1>
            <p className="mt-8 max-w-text text-body">{founder.body}</p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy: Home's large statement treatment over a quiet full-bleed detail shot. */}
      <section className="relative z-10 overflow-hidden text-bone">
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
      <section className="section-x section-y relative bg-bone" aria-labelledby="awards-heading">
        <div className="pointer-events-none absolute right-[clamp(1.5rem,8vw,8rem)] top-0 hidden md:block">
          <PlumbBob />
        </div>
        <h2 id="awards-heading" className="sr-only">
          {copy.about.awardsHeading}
        </h2>
        <ul className="relative border-t border-ink/10 md:mr-[clamp(10rem,18vw,20rem)]">
          {awards.map((a, i) => {
            const media = a.mark ? getMedia(a.mark) : null;
            return (
              <Reveal
                as="li"
                key={a.id}
                delay={i * 0.05}
                className="grid grid-cols-1 gap-6 border-b border-ink/10 py-10 md:grid-cols-12 md:items-center md:gap-x-grid"
              >
                <div className="flex h-14 items-center md:col-span-4">
                  {a.mark && media && (
                    <Image
                      src={a.mark}
                      alt={a.markAlt}
                      width={media.width}
                      height={media.height}
                      unoptimized={a.mark.endsWith('.svg')}
                      quality={90}
                      sizes="240px"
                      className="h-full w-auto max-w-[12rem] object-contain object-left"
                    />
                  )}
                </div>
                <div className="md:col-span-8">
                  <h3 className="font-serif text-statement font-normal">
                    {a.name}
                    {a.year ? ` (${a.year})` : ''}
                  </h3>
                  <p className="mt-3 max-w-text text-body">{keepTogether(a.description)}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <Community />

      <ClosingCta />
    </CoverStack>
  );
}
