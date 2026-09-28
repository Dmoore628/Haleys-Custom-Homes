import copy from '@content/copy.config';
import { affiliations } from '@/lib/content';
import { MarkImage } from '@/components/ui/MarkImage';
import { Reveal } from '@/components/ui/Reveal';

/**
 * About: Dan Fuller's board service and the company's professional associations, as listed on
 * Haley's own About page. Two evenly spaced tiers, each organization's mark above its name; an
 * organization without a verifiable mark is set in type alone.
 */
export function Affiliations() {
  const { heading, boards, associations } = copy.about.affiliations;
  const tiers = [
    { label: boards, items: affiliations.boards },
    { label: associations, items: affiliations.associations },
  ];
  return (
    <section className="section-x section-y bg-bone" aria-labelledby="affiliations-heading">
      <Reveal>
        <h2 id="affiliations-heading" className="font-serif text-section font-normal">
          {heading}
        </h2>
      </Reveal>
      <div className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-col gap-[clamp(3rem,6vw,5rem)]">
        {tiers.map((tier) => (
          <Reveal key={tier.label}>
            <div className="flex items-center gap-6">
              <h3 className="label text-ink/70">{tier.label}</h3>
              <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-grid">
              {tier.items.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col items-center text-center"
                  data-testid="affiliation"
                >
                  <div className="flex h-[clamp(64px,7vw,88px)] items-center justify-center">
                    {a.mark ? (
                      <MarkImage src={a.mark} alt="" base="clamp(52px, 5.5vw, 72px)" />
                    ) : (
                      <span
                        className="font-serif text-[clamp(2rem,3.4vw,2.75rem)] leading-none tracking-[0.08em]"
                        aria-hidden="true"
                      >
                        {a.name.split(/[\s,]/)[0]}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 max-w-[18rem] text-[0.9375rem] leading-snug">{a.name}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
