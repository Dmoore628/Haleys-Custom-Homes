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
      <div className="mt-10 flex flex-col gap-12 md:grid md:grid-cols-12 md:items-start md:gap-x-grid md:gap-y-0">
        <div className="md:col-span-7">
          <SequencingLedger />
        </div>
        <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
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
