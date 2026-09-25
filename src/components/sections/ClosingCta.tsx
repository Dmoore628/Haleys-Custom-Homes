import copy from '@content/copy.config';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Pinned } from '@/components/ui/Pinned';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { AmbientVideo } from '@/components/ui/AmbientVideo';

/**
 * Identical on Home, Process and About. A twilight flyover of a completed Haley home
 * (poster: the same house's twilight still), 30% overlay, centered content.
 * `pinned` is set on Home only, where the footer slides up over it.
 */
export function ClosingCta({ pinned = false }: { pinned?: boolean }) {
  const { closingCta } = copy;
  const section = (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-ink text-bone">
      <SmartImage
        src="/images/sections/cta-twilight.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <AmbientVideo src="/video/cta.mp4" poster="/images/sections/cta-twilight.jpg" />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <Reveal className="section-x section-y relative flex flex-col items-center text-center">
        <Badge>{closingCta.scarcity}</Badge>
        <h2 className="mt-8 max-w-[18em] font-serif text-section font-normal">
          {closingCta.headline}
        </h2>
        <div className="mt-10">
          <ButtonLink href={closingCta.button.href} variant="primary" surface="dark" magnetic>
            {closingCta.button.label}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
  return pinned ? <Pinned>{section}</Pinned> : section;
}
