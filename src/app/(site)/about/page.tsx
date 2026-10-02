import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { awards } from '@/lib/content';
import { MarkImage } from '@/components/ui/MarkImage';
import { Reveal } from '@/components/ui/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { YearText } from '@/components/providers/YearProvider';
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
      {/* Founder intro. Desktop: 7/5 split, the text centered in its column beside the
          portrait; phones stack the portrait first. The portrait sits in a fine offset frame,
          the site's drawing-line motif; the text runs eyebrow, name, rule, a serif lede, the
          story, a row of facts, and a closing personal line. */}
      <section className="section-x bg-white pb-section pt-[calc(6.5rem+clamp(3rem,7vw,7rem))]">
        <div className="flex flex-col gap-14 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0">
          <Reveal className="md:order-2 md:col-span-5 md:col-start-8">
            <div className="relative mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-none">
              <span
                aria-hidden="true"
                className="absolute inset-0 translate-x-[clamp(0.75rem,1.5vw,1.25rem)] translate-y-[clamp(0.75rem,1.5vw,1.25rem)] rounded-tile border border-accent/40"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-tile">
                <SmartImage
                  src={founder.image}
                  alt={founder.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 768px) 40vw, 90vw"
                  className="object-cover object-top"
                />
              </div>
            </div>
          </Reveal>

          <Reveal
            className="flex flex-col items-center text-center md:order-1 md:col-span-7 md:pr-[clamp(0rem,4vw,4rem)]"
            delay={0.1}
          >
            <Eyebrow>{founder.eyebrow}</Eyebrow>
            <h1 className="mt-5 font-serif text-[clamp(2.75rem,5.2vw,4.5rem)] font-normal leading-[1.05]">
              {founder.headline}
            </h1>
            <span aria-hidden="true" className="mt-7 block h-px w-12 bg-accent" />
            <p className="mt-7 max-w-[30rem] font-serif text-statement font-normal italic text-ink">
              {keepTogether(founder.lede)}
            </p>
            <p className="mt-6 max-w-text text-body text-ink/75">{keepTogether(founder.body)}</p>

            <dl
              className="mt-10 grid w-full max-w-[34rem] grid-cols-1 border-y border-ink/10 md:grid-cols-3"
              data-testid="founder-facts"
            >
              {founder.facts.map((f, i) => (
                <div
                  key={f.label}
                  className={`flex flex-col items-center gap-2 px-2 py-5 ${i > 0 ? 'border-t border-ink/10 md:border-l md:border-t-0' : ''}`}
                >
                  <dt className="label order-2 text-[0.6875rem] leading-snug text-ink/60">
                    {f.label}
                  </dt>
                  <dd className="order-1 whitespace-nowrap font-serif text-[clamp(1.375rem,2.2vw,1.75rem)] leading-none text-accent">
                    <YearText text={f.value} />
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-8 text-[0.9375rem] text-ink/60">{founder.personal}</p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy: Home's large statement treatment over a quiet full-bleed detail shot. */}
      <section className="relative z-10 overflow-hidden text-white">
        <SmartImage src={philosophy.image} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
        <div className="section-x section-y relative">
          <div className="grid-12 py-[clamp(2rem,6vw,6rem)]">
            <div className="col-span-12 mx-auto max-w-statement text-center md:col-span-10 md:col-start-2 md:mx-0 md:text-left">
              <Reveal as="h2" className="font-serif text-section font-normal">
                <Sentences text={philosophy.statement} />
              </Reveal>
              <Reveal as="p" className="text-block mx-auto mt-8 text-body md:mx-0" delay={0.1}>
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
        {/* Four equal rows, a quarter of the section each. The marks are set jumbo and
            alternate sides (Houzz left, Luxury right, Energy Star left, LUXE right), each
            award's name and description on the opposite side. Phones stack and center. */}
        <ul className="relative mx-auto max-w-[76rem] border-t border-ink/10">
          {awards.map((a, i) => {
            const markLeft = i % 2 === 0;
            return (
              <Reveal
                as="li"
                key={a.id}
                delay={i * 0.05}
                className="flex flex-col items-center gap-8 border-b border-ink/10 py-[clamp(3rem,6vw,4.5rem)] text-center md:grid md:min-h-[clamp(20rem,28vw,26rem)] md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0 md:py-10 md:text-left"
                data-testid="award-row"
                data-side={markLeft ? 'left' : 'right'}
              >
                <div
                  className={`flex w-full items-center justify-center md:col-span-6 ${
                    markLeft
                      ? 'md:order-1 md:justify-start'
                      : 'md:order-2 md:col-start-7 md:justify-end'
                  }`}
                >
                  {a.mark && (
                    <MarkImage
                      src={a.mark}
                      alt={a.markAlt}
                      base="clamp(96px, 12vw, 176px)"
                      className="max-h-[clamp(9rem,20vw,16rem)]"
                    />
                  )}
                </div>
                <div
                  className={`md:col-span-5 ${markLeft ? 'md:order-2 md:col-start-8' : 'md:order-1 md:col-start-1'}`}
                >
                  <h3 className="font-serif text-statement font-normal">
                    {a.name}
                    {a.year ? ` (${a.year})` : ''}
                  </h3>
                  <p className="mx-auto mt-4 max-w-text text-body text-ink/75 md:mx-0">
                    {keepTogether(a.description)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      <Affiliations />

      <Community />

      <ClosingCta />
    </CoverStack>
  );
}
