import Image from 'next/image';
import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { awards, getMedia } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { ClosingCta } from '@/components/sections/ClosingCta';

export const metadata: Metadata = {
  title: copy.about.meta.title,
  description: copy.about.meta.description,
};

export default function AboutPage() {
  const { founder, philosophy } = copy.about;
  const portrait = getMedia(founder.image);

  return (
    <>
      {/* Founder intro: real photo beside one flowing narrative paragraph. */}
      <section className="section-x bg-bone pb-section pt-[calc(6.5rem+clamp(4rem,9vw,9rem))]">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-end md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-5">
            {/* The only photo of Dan in the asset library is 218x275; shown near its native size so it stays sharp. */}
            <div className="relative w-full max-w-[22rem] overflow-hidden rounded-tile">
              <SmartImage
                src={founder.image}
                alt={founder.imageAlt}
                sizes="352px"
                className="h-auto w-full"
                style={{ aspectRatio: `${portrait.width} / ${portrait.height}` }}
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <h1 className="font-serif text-section font-normal">{founder.headline}</h1>
            <p className="mt-8 max-w-text text-body">{founder.body}</p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy: Home's large statement treatment, over a quiet full-bleed detail shot. */}
      <section className="relative overflow-hidden text-bone">
        <SmartImage src={philosophy.image} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <div className="section-x section-y relative">
          <div className="grid-12 py-[clamp(2rem,6vw,6rem)]">
            <div className="col-span-12 max-w-statement md:col-span-10 md:col-start-2">
              <Reveal as="h2" className="font-serif text-section font-normal">
                {philosophy.statement}
              </Reveal>
              <Reveal as="p" className="mt-8 text-block text-body" delay={0.1}>
                {philosophy.supporting}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Awards, expanded: one row per award with its real mark and a line of context. */}
      <section className="section-x section-y bg-bone" aria-labelledby="awards-heading">
        <h2 id="awards-heading" className="sr-only">
          {copy.about.awardsHeading}
        </h2>
        <ul className="border-t border-ink/10">
          {awards.map((a, i) => {
            const media = a.mark ? getMedia(a.mark) : null;
            return (
              <Reveal
                as="li"
                key={a.id}
                delay={i * 0.05}
                className="grid grid-cols-1 gap-6 border-b border-ink/10 py-10 md:grid-cols-12 md:items-center md:gap-x-grid"
              >
                <div className="flex h-12 items-center opacity-70 md:col-span-3">
                  {a.mark && media ? (
                    <Image
                      src={a.mark}
                      alt={a.markAlt}
                      width={Math.round((media.width / media.height) * 48)}
                      height={48}
                      className="h-12 w-auto"
                    />
                  ) : (
                    <span className="label text-[1rem] tracking-[0.2em]">{a.markAlt}</span>
                  )}
                </div>
                <div className="md:col-span-8 md:col-start-5">
                  <h3 className="font-serif text-statement font-normal">
                    {a.name}
                    {a.year ? ` (${a.year})` : ''}
                  </h3>
                  <p className="mt-3 max-w-text text-body">{a.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <ClosingCta />
    </>
  );
}
