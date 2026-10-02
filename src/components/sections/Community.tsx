import copy from '@content/copy.config';
import { community } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { MarkImage } from '@/components/ui/MarkImage';
import { keepTogether } from '@/lib/text';

/**
 * About: the causes Haley and Dan Fuller support, each with its own mark and the specific
 * role, then the industry partners who have sponsored alongside Haley. Every entry is
 * verified; sources are recorded in content/community.json and assets/community/SOURCES.md.
 */
export function Community() {
  const { heading, partnersLabel } = copy.about.community;
  return (
    <section className="section-x section-y bg-white" aria-labelledby="community-heading">
      <Reveal>
        <h2 id="community-heading" className="font-serif text-section font-normal">
          {heading}
        </h2>
      </Reveal>

      <ul className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-grid md:grid-cols-2">
        {community.causes.map((c, i) => (
          <Reveal
            as="li"
            key={c.id}
            delay={i * 0.08}
            className="flex flex-col rounded-[6px] border border-ink/10 bg-ink/[0.03] p-[clamp(1.75rem,4vw,3rem)]"
          >
            <div className="flex h-[clamp(72px,8vw,104px)] items-center">
              <MarkImage src={c.mark} alt={c.name} base="clamp(52px, 5.5vw, 72px)" />
            </div>
            <p className="label mt-8 flex items-center gap-2.5">
              <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-accent" />
              {c.role}
            </p>
            <h3 className="mt-3 font-serif text-statement font-normal">{keepTogether(c.name)}</h3>
            <p className="mt-4 max-w-text text-body text-ink/80">{keepTogether(c.detail)}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-[clamp(4rem,8vw,6.5rem)]">
        <div className="flex items-center gap-6">
          <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
          <h3 className="label text-ink/70">{partnersLabel}</h3>
          <span className="h-px flex-1 bg-ink/15" aria-hidden="true" />
        </div>
        <ul className="mt-[clamp(2rem,4vw,3rem)] grid grid-cols-2 items-center gap-x-grid gap-y-10 lg:grid-cols-4">
          {community.partners.marks.map((m) => (
            <li key={m.id} className="flex justify-center">
              <MarkImage src={m.mark} alt={m.name} />
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-[36rem] text-center text-[0.9375rem] leading-relaxed text-ink/70">
          {community.partners.detail}
        </p>
      </Reveal>
    </section>
  );
}
