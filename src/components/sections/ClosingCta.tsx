import copy from '@content/copy.config';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { AmbientVideo } from '@/components/ui/AmbientVideo';
import { Sentences } from '@/components/ui/Sentences';

/**
 * The closing call to action on every page. By default, a twilight flyover of a completed Haley
 * home (poster: the same house's twilight still); `still` replaces the film with a photograph,
 * for a page whose hero already uses the flyover (Process). 30% overlay (50% over a still),
 * centered content.
 */
export function ClosingCta({ still }: { still?: string } = {}) {
  const { closingCta } = copy;
  const section = (
    <section className="relative flex min-h-[70svh] w-full items-center justify-center overflow-hidden bg-ink text-white">
      <SmartImage
        src={still ?? '/images/sections/cta-twilight.jpg'}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      {!still && (
        <AmbientVideo src="/video/cta-flyover.mp4" poster="/images/sections/cta-twilight.jpg" />
      )}
      {/* A daylight-brighter still needs a deeper overlay than the twilight film. */}
      <div
        className={`absolute inset-0 ${still ? 'bg-black/50' : 'bg-black/30'}`}
        aria-hidden="true"
      />
      <Reveal className="section-x section-y relative flex flex-col items-center text-center">
        <Badge>{closingCta.scarcity}</Badge>
        <h2 className="mt-8 max-w-[20em] font-serif text-section font-normal">
          <Sentences text={closingCta.headline} />
        </h2>
        <div className="mt-10">
          <ButtonLink href={closingCta.button.href} variant="primary" surface="dark" magnetic>
            {closingCta.button.label}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
  return section;
}
