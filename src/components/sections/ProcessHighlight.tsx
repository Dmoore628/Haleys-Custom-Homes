import copy from '@content/copy.config';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { SequencingLedger } from './SequencingLedger';

/** Home: the compact Sequencing Ledger. 7 columns device, 4 columns text offset 1. */
export function ProcessHighlight() {
  const { processHighlight } = copy.home;
  return (
    <section className="section-x section-y bg-bone">
      <Reveal>
        <Eyebrow>{processHighlight.eyebrow}</Eyebrow>
      </Reveal>
      <div className="mt-10 flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-grid lg:gap-y-0">
        <div className="lg:col-span-7">
          <SequencingLedger />
        </div>
        <Reveal
          className="max-w-text lg:sticky lg:top-32 lg:col-span-4 lg:col-start-9 lg:max-w-none"
          delay={0.1}
        >
          <p className="text-body">{processHighlight.body}</p>
          <div className="mt-8">
            <ButtonLink href={processHighlight.button.href} variant="ghost">
              {processHighlight.button.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
