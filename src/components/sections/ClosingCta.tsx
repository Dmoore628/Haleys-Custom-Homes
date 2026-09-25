import copy from '@content/copy.config';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';

/** Identical on Home, Process and About. Twilight exterior, 30% overlay, centered content. */
export function ClosingCta() {
  const { closingCta } = copy;
  return (
    <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden text-bone">
      <SmartImage
        src="/images/sections/cta-twilight.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <Reveal className="section-x section-y relative flex flex-col items-center text-center">
        <Badge>{closingCta.scarcity}</Badge>
        <h2 className="mt-8 max-w-[18em] font-serif text-section font-normal">{closingCta.headline}</h2>
        <div className="mt-10">
          <ButtonLink href={closingCta.button.href} variant="primary" surface="dark">
            {closingCta.button.label}
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
