import copy from '@content/copy.config';
import { ButtonLink } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { BuildTimeline } from './BuildTimeline';

/**
 * Home: the Accelerated Precision Building System. The method in brief, pinned beside the
 * scroll-scrubbed build timeline.
 */
export function ProcessHighlight() {
  const { processHighlight } = copy.home;
  return (
    <section className="section-x section-y bg-bone">
      <BuildTimeline
        intro={
          <>
            <Eyebrow>{processHighlight.eyebrow}</Eyebrow>
            <p className="mt-6 max-w-text text-body">{processHighlight.body}</p>
            <div className="mt-8">
              <ButtonLink href={processHighlight.button.href} variant="ghost">
                {processHighlight.button.label}
              </ButtonLink>
            </div>
          </>
        }
      />
    </section>
  );
}
