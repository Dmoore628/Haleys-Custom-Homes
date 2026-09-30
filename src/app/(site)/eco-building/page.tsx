import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { CoverStack } from '@/components/ui/CoverStack';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { MarkImage } from '@/components/ui/MarkImage';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { EcoMarks } from '@/components/sections/EcoMarks';
import { FeatureIcon } from '@/components/sections/EcoIcons';
import { sharePreview } from '@/lib/seo';

const { eco } = copy;

export const metadata: Metadata = {
  title: eco.meta.title,
  description: eco.meta.description,
  openGraph: sharePreview('/eco-building', { url: '/og/eco-building.jpg' }),
};

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-[0.2em] h-4 w-4 shrink-0 text-accent" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M6 10.4l2.6 2.6L14 7.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Eco-building: Haley's energy-efficient practice, from the old site's eco-building page,
 * as a sequence of sections that each cover one commitment: eco framing, Indoor airPLUS, net
 * zero, the green features, and Boulder County BuildSmart.
 */
export default function EcoBuildingPage() {
  return (
    <CoverStack>
      {/* Hero */}
      <section className="relative flex min-h-[80vh] w-full items-end overflow-hidden bg-ink text-bone">
        <SmartImage
          src={eco.hero.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10"
          aria-hidden="true"
        />
        <div className="section-x relative w-full pb-10 pt-40 md:pb-16">
          <p className="label">{eco.hero.eyebrow}</p>
          <h1 className="mt-4 max-w-[14em] font-serif text-hero font-normal">
            {eco.hero.headline}
          </h1>
          <p className="mt-6 max-w-[34rem] text-body text-bone/90">{eco.hero.intro}</p>
        </div>
      </section>

      {/* Eco framing */}
      <section className="section-x section-y bg-bone" aria-labelledby="framing-heading">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:items-center md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-5">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-[26rem] overflow-hidden rounded-tile md:mx-0">
              <SmartImage
                src={eco.framing.image}
                alt={eco.framing.imageAlt}
                fill
                sizes="(min-width: 768px) 35vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <Eyebrow>{eco.framing.eyebrow}</Eyebrow>
            <h2 id="framing-heading" className="mt-4 font-serif text-section font-normal">
              {eco.framing.headline}
            </h2>
            {eco.framing.body.map((para) => (
              <p key={para.slice(0, 20)} className="mt-6 max-w-text text-body">
                {para}
              </p>
            ))}
            <div className="mt-10 flex items-baseline gap-5 border-t border-ink/15 pt-6">
              <span className="font-serif text-[clamp(3rem,6vw,4.5rem)] leading-none text-accent">
                {eco.framing.stat.value}
              </span>
              <span className="label max-w-[16rem] leading-snug text-ink/70">
                {eco.framing.stat.label}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Indoor airPLUS */}
      <section className="section-x section-y bg-bone" aria-labelledby="airplus-heading">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-5">
            <MarkImage
              src="/images/eco/epa-indoor-airplus.png"
              alt="EPA Indoor airPLUS"
              base="clamp(80px, 8vw, 112px)"
            />
            <Eyebrow className="mt-8">{eco.airplus.eyebrow}</Eyebrow>
            <h2 id="airplus-heading" className="mt-4 font-serif text-section font-normal">
              {eco.airplus.headline}
            </h2>
            <p className="mt-6 max-w-text text-body">{eco.airplus.body}</p>
          </Reveal>
          <Reveal className="md:col-span-6 md:col-start-7 md:self-end" delay={0.1}>
            <ul className="grid gap-x-8 gap-y-5 border-t border-ink/15 pt-8 md:grid-cols-2">
              {eco.airplus.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-body">
                  <Check />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Net zero */}
      <section className="section-x section-y bg-ink text-bone" aria-labelledby="netzero-heading">
        <div className="flex flex-col gap-12 md:grid md:grid-cols-12 md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-6">
            <p className="label text-bone/80">{eco.netZero.eyebrow}</p>
            <h2 id="netzero-heading" className="mt-4 font-serif text-section font-normal">
              {eco.netZero.headline}
            </h2>
            <p className="mt-6 max-w-text text-body text-bone/85">{eco.netZero.body}</p>
            <ul className="mt-8 space-y-3">
              {eco.netZero.benefits.map((b) => (
                <li key={b} className="flex gap-3 text-body text-bone/90">
                  <span className="mt-[0.7em] h-px w-4 shrink-0 bg-[#C6BAAC]" aria-hidden="true" />
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal
            className="flex flex-col justify-center gap-10 md:col-span-5 md:col-start-8"
            delay={0.1}
          >
            {eco.netZero.stats.map((st) => (
              <div key={st.label} className="border-t border-bone/15 pt-6">
                <p className="font-serif text-[clamp(3rem,6vw,4.75rem)] leading-none text-[#C6BAAC]">
                  {st.value}
                </p>
                <p className="label mt-4 max-w-[20rem] leading-snug text-bone/80">{st.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Green features */}
      <section className="section-x section-y bg-bone" aria-labelledby="features-heading">
        <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-5">
            <Eyebrow>{eco.features.eyebrow}</Eyebrow>
            <h2 id="features-heading" className="mt-4 font-serif text-section font-normal">
              {eco.features.headline}
            </h2>
            <p className="mt-6 max-w-text text-body">{eco.features.intro}</p>
            <div className="relative mt-10 hidden aspect-[3/4] max-w-[22rem] overflow-hidden rounded-tile md:block">
              <SmartImage
                src={eco.features.image}
                alt={eco.features.imageAlt}
                fill
                sizes="30vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <ul className="grid gap-px overflow-hidden rounded-tile border border-ink/10 bg-ink/10 md:col-span-6 md:col-start-7 md:grid-cols-2 md:self-center">
            {eco.features.items.map((f, i) => (
              <Reveal
                as="li"
                key={f.id}
                delay={i * 0.06}
                className="bg-bone p-[clamp(1.5rem,3vw,2.25rem)]"
              >
                <FeatureIcon id={f.id} />
                <h3 className="mt-6 font-serif text-[1.375rem] leading-tight">{f.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/80">{f.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Boulder County BuildSmart and the programs */}
      <section className="section-x section-y bg-bone" aria-labelledby="buildsmart-heading">
        <Reveal className="mx-auto flex max-w-[46rem] flex-col items-center text-center">
          <EcoMarks className="justify-center" />
          <Eyebrow className="mt-12">{eco.buildSmart.eyebrow}</Eyebrow>
          <h2 id="buildsmart-heading" className="mt-4 font-serif text-section font-normal">
            {eco.buildSmart.headline}
          </h2>
          <p className="mt-6 text-body">{eco.buildSmart.body}</p>
          <p className="mt-10 font-serif text-statement italic text-ink">{eco.closing}</p>
        </Reveal>
      </section>

      <ClosingCta />
    </CoverStack>
  );
}
