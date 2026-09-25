import Link from 'next/link';
import type { Project } from '@/lib/schema';
import { SmartImage } from './SmartImage';

interface ProjectTileProps {
  project: Pick<Project, 'slug' | 'name' | 'location' | 'coverImage'>;
  /** Tailwind aspect-ratio / height classes for the tile module. */
  frameClassName: string;
  sizes: string;
  priority?: boolean;
}

/**
 * Shared image tile: overflow hidden, no border, no shadow, max 4px corners.
 * Hover (or keyboard focus): image scales 1.0 to 1.04 over 600ms, overlay fades to 15%,
 * caption slides up 8px and fades in 100ms later. Touch devices see caption by default.
 */
export function ProjectTile({ project, frameClassName, sizes, priority }: ProjectTileProps) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="tile group block rounded-tile"
      data-cursor="expand"
    >
      <div className={`relative overflow-hidden rounded-tile ${frameClassName}`}>
        <SmartImage
          src={project.coverImage}
          alt={project.name}
          fill
          sizes={sizes}
          priority={priority}
          className="tile-img object-cover"
        />
        <div aria-hidden="true" className="tile-overlay absolute inset-0 bg-black" />
        <div className="tile-caption absolute bottom-0 left-0 p-5 text-bone md:p-6">
          <p className="font-serif text-statement font-normal">{project.name}</p>
          <p className="label mt-2">{project.location}</p>
        </div>
      </div>
    </Link>
  );
}
