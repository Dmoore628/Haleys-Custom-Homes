'use client';

import { LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import copy from '@content/copy.config';
import type { Category, Project } from '@/lib/schema';
import { DURATION, EASE } from '@/lib/animation';
import { ProjectGrid } from './ProjectGrid';

const CATEGORIES: Category[] = ['new-build', 'remodel'];

/**
 * Two tabs. The active tab's 2px accent underline slides to the new tab (shared layout
 * animation, 300ms). The grid re-filters instantly; newly visible tiles play the standard reveal.
 */
export function PortfolioBrowser({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Category>('new-build');
  const visible = projects.filter((p) => p.category === active);

  return (
    <>
      <LayoutGroup>
        <div role="tablist" aria-label="Project category" className="flex gap-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              id={`tab-${c}`}
              aria-selected={active === c}
              aria-controls="portfolio-grid"
              tabIndex={active === c ? 0 : -1}
              onClick={() => setActive(c)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  const next = CATEGORIES[(CATEGORIES.indexOf(c) + 1) % CATEGORIES.length];
                  setActive(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
              className="label relative pb-3"
            >
              {copy.portfolio.tabs[c]}
              {active === c && (
                <motion.span
                  layoutId="portfolio-tab-underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                  transition={{ duration: DURATION.layout, ease: EASE }}
                />
              )}
            </button>
          ))}
        </div>
      </LayoutGroup>

      <p className="mt-10 max-w-text text-body">{copy.portfolio.intro}</p>

      <div
        id="portfolio-grid"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="mt-12 md:mt-16"
      >
        {visible.length > 0 ? (
          // Keyed by category so a filter change remounts the tiles and replays their reveal.
          <ProjectGrid key={active} projects={visible} priorityFirst />
        ) : (
          <p className="py-24 text-center text-body">{copy.portfolio.empty}</p>
        )}
      </div>
    </>
  );
}
