'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/schema';
import { DURATION, REVEAL_VIEWPORT, revealVariants, transition } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectTile } from '@/components/ui/ProjectTile';

/**
 * The defined asymmetric module, repeating every five projects:
 * row 1 = one large tile (8 cols, tall) beside one tile (4 cols, same height);
 * row 2 = three even 4-col tiles at a standard aspect ratio.
 * Below 768px every tile stacks full width.
 */
const MODULE = [
  { span: 'md:col-span-8', frame: 'aspect-[4/3] md:aspect-auto md:h-[clamp(28rem,48vw,46rem)]', sizes: '(min-width: 768px) 66vw, 100vw' },
  { span: 'md:col-span-4', frame: 'aspect-[4/3] md:aspect-auto md:h-[clamp(28rem,48vw,46rem)]', sizes: '(min-width: 768px) 33vw, 100vw' },
  { span: 'md:col-span-4', frame: 'aspect-[4/3]', sizes: '(min-width: 768px) 33vw, 100vw' },
  { span: 'md:col-span-4', frame: 'aspect-[4/3]', sizes: '(min-width: 768px) 33vw, 100vw' },
  { span: 'md:col-span-4', frame: 'aspect-[4/3]', sizes: '(min-width: 768px) 33vw, 100vw' },
];

export function ProjectGrid({ projects, priorityFirst = false }: { projects: Project[]; priorityFirst?: boolean }) {
  const reduced = useReducedMotion();
  return (
    <ul className="grid grid-cols-1 gap-grid md:grid-cols-12">
      {projects.map((project, i) => {
        const slot = MODULE[i % MODULE.length];
        return (
          <motion.li
            key={project.slug}
            className={slot.span}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            variants={revealVariants(reduced)}
            transition={transition(DURATION.reveal, (i % MODULE.length) * 0.05)}
          >
            <ProjectTile
              project={project}
              frameClassName={slot.frame}
              sizes={slot.sizes}
              priority={priorityFirst && i < 2}
            />
          </motion.li>
        );
      })}
    </ul>
  );
}
