import copy from '@content/copy.config';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { MoveInTimeline } from './MoveInTimeline';
import { PunchList } from './PunchList';

/**
 * Home: the Accelerated Precision Building System. The punch list beside the method in brief,
 * then, beneath both, the move-in timeline and the family it happened to.
 */
export function ProcessHighlight() {
  const { processHighlight } = copy.home;
  return (
    <section className="section-x section-y bg-bone">
      <Reveal>
        <Eyebrow>{processHighlight.eyebrow}</Eyebrow>
      </Reveal>
      <div className="mt-10 flex flex-col gap-12 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-grid lg:gap-y-0">
        <Reveal className="lg:col-span-7">
          <PunchList />
        </Reveal>
        <Reveal className="max-w-text lg:col-span-4 lg:col-start-9 lg:max-w-none" delay={0.1}>
          <p className="text-body">{processHighlight.body}</p>
          <div className="mt-8">
            <ButtonLink href={processHighlight.button.href} variant="ghost">
              {processHighlight.button.label}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
      <div className="mt-[clamp(4rem,8vw,7rem)]">
        <MoveInTimeline />
      </div>
    </section>
  );
}
