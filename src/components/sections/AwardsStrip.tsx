import Image from 'next/image';
import copy from '@content/copy.config';
import { awards, getMedia } from '@/lib/content';
import { Marquee } from '@/components/ui/Marquee';

/**
 * The quietest section on the page: a slow left-to-right marquee of the real award and
 * credential marks in their original colors, jumbo height clamp(48px, 6vw, 96px), centered
 * vertically in the section. The mark list repeats enough times to fill a 2560px viewport
 * on first paint. Marks are not links; hover only pauses the strip.
 */
export function AwardsStrip() {
  const { awards: copyAwards } = copy.home;
  return (
    <section className="flex min-h-[clamp(20rem,34vw,32rem)] flex-col justify-center overflow-hidden bg-bone py-section-quiet">
      <Marquee direction="ltr" duration={48} repeat={3} label="Awards and recognition">
        {awards.map((a) => {
          if (!a.mark) return null;
          const media = getMedia(a.mark);
          return (
            <div
              key={a.id}
              className="mx-[clamp(2.5rem,5vw,5rem)] flex shrink-0 items-center"
              style={{ height: 'clamp(48px, 6vw, 96px)' }}
            >
              <Image
                src={a.mark}
                alt={a.markAlt}
                width={media.width}
                height={media.height}
                unoptimized={a.mark.endsWith('.svg')}
                quality={90}
                sizes="400px"
                className="h-full w-auto"
              />
            </div>
          );
        })}
      </Marquee>
      <div className="section-x mt-10 flex flex-col items-center gap-3 text-center">
        <p className="label">{copyAwards.caption}</p>
        <p className="label text-ink/70">{copyAwards.asSeenIn}</p>
      </div>
    </section>
  );
}
