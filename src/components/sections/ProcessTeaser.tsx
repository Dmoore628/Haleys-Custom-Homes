import copy from '@content/copy.config';
import { ApbMark } from '@/components/ui/ApbMark';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SmartImage } from '@/components/ui/SmartImage';
import { keepTogether } from '@/lib/text';

/**
 * Home: the transition into the Process page. A dark band after the client reviews, over a
 * completed Haley home at dusk (Modern Elevated) held back under an ink overlay, deepest on the
 * left behind the copy: the APB System™ lockup, the method in a sentence, the six phases set as
 * a quiet numbered strip, and the way through to the full sequence on the Process page.
 */
export function ProcessTeaser() {
  const { processHighlight } = copy.home;
  const phases = copy.process.phases;
  return (
    <section
      className="section-x section-y relative isolate overflow-hidden bg-ink text-white"
      aria-labelledby="process-teaser-heading"
      data-testid="process-teaser"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <SmartImage
          src="/images/projects/modern-elevated/cover.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[60%_50%]"
        />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
      </div>
      {/* Centered at every size: lockup, line, sentence, then the way through. */}
      <Reveal className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
        <ApbMark tone="light" className="justify-center" />
        <h2 id="process-teaser-heading" className="mt-8 font-serif text-section font-normal">
          {processHighlight.headline}
        </h2>
        <p className="mt-6 max-w-text text-body text-white/85">{processHighlight.body}</p>
        <div className="mt-10 w-full md:w-auto">
          <ButtonLink
            href={processHighlight.button.href}
            variant="primary"
            surface="dark"
            fullWidthMobile
            magnetic
          >
            {processHighlight.button.label}
          </ButtonLink>
        </div>
      </Reveal>

      {/* The six phases, as a numbered strip. */}
      <Reveal delay={0.15}>
        <ol className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-2 gap-x-grid gap-y-6 border-t border-white/15 pt-8 md:grid-cols-3 xl:grid-cols-6">
          {phases.map((p, i) => (
            <li key={p.title} className="flex flex-col items-center gap-2 text-center">
              <span className="font-serif text-[1rem] tabular-nums text-[#C6BAAC]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="label leading-snug text-white/80">{keepTogether(p.title)}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
