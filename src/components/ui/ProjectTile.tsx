'use client';

import Link from 'next/link';
import { useRef, type PointerEvent } from 'react';
import type { Project } from '@/lib/schema';
import { SmartImage } from './SmartImage';
import { keepTogether } from '@/lib/text';

const MAX_TILT = 4; // degrees on each axis

interface ProjectTileProps {
  project: Pick<Project, 'slug' | 'name' | 'location' | 'coverImage'>;
  /** Tailwind aspect-ratio / height classes for the tile module. */
  frameClassName: string;
  sizes: string;
  priority?: boolean;
}

/**
 * Shared portfolio tile (Portfolio grid and Home Featured Portfolio only).
 * Hover or focus: image scales 1.0 to 1.04 over 600ms, overlay fades to 15%, caption slides
 * up 8px 100ms later. On fine pointers the tile also tilts up to 4 degrees per axis toward
 * the cursor (CSS 3D transform) and eases back to flat on leave, 200ms. Touch devices see the
 * caption by default and never tilt.
 */
export function ProjectTile({ project, frameClassName, sizes, priority }: ProjectTileProps) {
  const ref = useRef<HTMLDivElement>(null);

  const canTilt = () =>
    typeof window !== 'undefined' &&
    window.matchMedia(
      '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    ).matches;

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || !canTilt()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1200px) rotateX(${(-py * 2 * MAX_TILT).toFixed(2)}deg) rotateY(${(px * 2 * MAX_TILT).toFixed(2)}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="tile group block rounded-tile"
      data-cursor="expand"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
    >
      {/* The tilt lives on an inner wrapper so the link's own box never moves. */}
      <div
        ref={ref}
        className="rounded-tile transition-transform duration-200 ease-out will-change-transform"
        data-tilt="true"
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
            <p className="font-serif text-statement font-normal">{keepTogether(project.name)}</p>
            <p className="label mt-2">{project.location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
