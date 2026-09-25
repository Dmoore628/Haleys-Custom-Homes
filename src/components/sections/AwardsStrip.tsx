import Image from 'next/image';
import copy from '@content/copy.config';
import { awards, getMedia } from '@/lib/content';
import { Marquee } from '@/components/ui/Marquee';

/**
 * The quietest section on the page: a slow left-to-right marquee of award marks, equal
 * 32px height, flattened to one muted tone. Not links; hover only pauses the strip.
 * Energy Star has no mark file in the asset library, so its name is set in type.
 */
export function AwardsStrip() {
  return (
    <section className="overflow-hidden bg-bone py-section-quiet">
      <Marquee direction="ltr" duration={48} label="Awards and recognition">
        {awards.map((a) => {
          const media = a.mark ? getMedia(a.mark) : null;
          return (
            <div key={a.id} className="mx-[clamp(2.5rem,6vw,6rem)] flex h-8 shrink-0 items-center opacity-70">
              {a.mark && media ? (
                <Image
                  src={a.mark}
                  alt={a.markAlt}
                  width={Math.round((media.width / media.height) * 32)}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="label whitespace-nowrap text-[1rem] tracking-[0.2em]">{a.markAlt}</span>
              )}
            </div>
          );
        })}
      </Marquee>
      <p className="label section-x mt-10 text-center">{copy.home.awards.caption}</p>
    </section>
  );
}
