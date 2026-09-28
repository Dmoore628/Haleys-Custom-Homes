'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/lib/projects/types';
import { DURATION, REVEAL_VIEWPORT, revealVariants, transition } from '@/lib/animation';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectTile } from '@/components/ui/ProjectTile';

type Slot = { span: string; frame: string; sizes: string };

const TALL = 'aspect-[4/3] md:aspect-auto md:h-[clamp(26rem,46vw,46rem)]';
const LARGE: Slot = { span: 'md:col-span-8', frame: TALL, sizes: '(min-width: 768px) 66vw, 100vw' };
const SIDE: Slot = { span: 'md:col-span-4', frame: TALL, sizes: '(min-width: 768px) 33vw, 100vw' };
const THIRD: Slot = {
  span: 'md:col-span-4',
  frame: 'aspect-[4/3]',
  sizes: '(min-width: 768px) 33vw, 100vw',
};
const HALF: Slot = {
  span: 'md:col-span-6',
  frame: 'aspect-[4/3]',
  sizes: '(min-width: 768px) 50vw, 100vw',
};
const FULL: Slot = {
  span: 'md:col-span-12',
  frame: 'aspect-[4/3] md:aspect-auto md:h-[clamp(26rem,46vw,46rem)]',
  sizes: '100vw',
};

/**
 * The defined asymmetric module, repeating every five projects:
 * row 1 = one large tile (8 cols, tall) beside one tile (4 cols, same height);
 * row 2 = three even 4-col tiles at a standard aspect ratio.
 * A final partial module never leaves a hole in the 12-column grid: 1 left over spans the full
 * width, 2 form the 8/4 pair, 3 form the 8/4 pair plus one full-width tile, 4 form the pair
 * plus two halves. Below 768px every tile stacks full width.
 */
export function layoutSlots(count: number): Slot[] {
  const slots: Slot[] = [];
  const full = Math.floor(count / 5);
  for (let i = 0; i < full; i++) slots.push(LARGE, SIDE, THIRD, THIRD, THIRD);
  const rest = count % 5;
  if (rest === 1) slots.push(FULL);
  if (rest === 2) slots.push(LARGE, SIDE);
  if (rest === 3) slots.push(LARGE, SIDE, FULL);
  if (rest === 4) slots.push(LARGE, SIDE, HALF, HALF);
  return slots;
}

export function ProjectGrid({
  projects,
  priorityFirst = false,
}: {
  projects: Project[];
  priorityFirst?: boolean;
}) {
  const reduced = useReducedMotion();
  const slots = layoutSlots(projects.length);
  return (
    <ul className="grid grid-cols-1 gap-grid md:grid-cols-12">
      {projects.map((project, i) => {
        const slot = slots[i];
        return (
          <motion.li
            key={project.slug}
            className={slot.span}
            initial="hidden"
            whileInView="visible"
            viewport={REVEAL_VIEWPORT}
            variants={revealVariants(reduced)}
            transition={transition(DURATION.reveal, (i % 5) * 0.05)}
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
