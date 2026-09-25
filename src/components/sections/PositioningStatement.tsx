import copy from '@content/copy.config';
import { Reveal } from '@/components/ui/Reveal';
import { WordReveal } from './WordReveal';

/** Restraint itself is the device: a confident claim stated plainly. */
export function PositioningStatement() {
  const { positioning } = copy.home;
  return (
    <section className="section-x section-y bg-bone">
      <div className="grid-12">
        <div className="col-span-12 max-w-statement md:col-span-10 md:col-start-2">
          <WordReveal text={positioning.main} className="font-serif text-section font-normal" />
          <Reveal as="p" className="mt-8 text-block text-body">
            {positioning.supporting}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
