import type { Metadata } from 'next';
import copy from '@content/copy.config';
import { builder20 } from '@/lib/content';
import { CoverStack } from '@/components/ui/CoverStack';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { ClosingCta } from '@/components/sections/ClosingCta';
import { keepTogether } from '@/lib/text';
import { sharePreview } from '@/lib/seo';

const page = copy.builder20;

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  openGraph: sharePreview('/builder20', { url: '/og/builder20.jpg' }),
};

/**
 * Builder 20: the builders Haley knows through the NAHB 20 Clubs and recommends in markets it
 * does not build in (content/builder20.json, from Haley's own /builder20 page). The intro holds
 * on the left while the list runs down the right; phones stack them.
 */
export default function Builder20Page() {
  return (
    <CoverStack>
      <section className="section-x bg-bone pb-section pt-[calc(6.5rem+clamp(3rem,7vw,7rem))]">
        <div className="flex flex-col gap-12 md:grid md:grid-cols-12 md:gap-x-grid md:gap-y-0">
          <Reveal className="md:col-span-5">
            <div className="md:sticky md:top-[18vh]">
              <Eyebrow>{page.eyebrow}</Eyebrow>
              <h1 className="mt-5 font-serif text-section font-normal">{page.headline}</h1>
              <p className="mt-8 max-w-text text-body">{page.intro}</p>
            </div>
          </Reveal>

          <Reveal className="md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7" delay={0.1}>
            <h2 className="label text-ink/70">{page.listLabel}</h2>
            <ol className="mt-6 border-t border-ink/15" data-testid="builder20-list">
              {builder20.builders.map((b, i) => (
                <li
                  key={b.id}
                  className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-4 border-b border-ink/15 py-[clamp(1.25rem,2.5vw,1.75rem)] md:grid-cols-[2.5rem_1fr_auto]"
                >
                  <span className="font-serif text-[1rem] tabular-nums text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif text-[clamp(1.375rem,2.2vw,1.75rem)] leading-tight">
                      {keepTogether(b.name)}
                    </p>
                    <p className="label mt-2 text-ink/70">{b.market}</p>
                  </div>
                  {b.url && (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label group col-start-2 mt-3 inline-flex items-center gap-2 justify-self-start text-accent underline decoration-accent/40 underline-offset-[6px] transition-colors duration-200 hover:text-ink hover:decoration-ink md:col-start-3 md:mt-0"
                      aria-label={`${page.visit}: ${b.name} (opens in a new tab)`}
                    >
                      {page.visit}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      >
                        ↗
                      </span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <ClosingCta />
    </CoverStack>
  );
}
