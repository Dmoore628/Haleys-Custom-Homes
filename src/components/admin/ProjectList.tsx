'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { reorderAction, setFlagsAction } from '@/app/admin/actions';
import type { Project } from '@/lib/projects/types';

const CATEGORY = { 'new-build': 'New build', remodel: 'Remodel' } as const;

/**
 * Every project, drafts included, in site order. Reorder by dragging a row or with the arrow
 * buttons (keyboard friendly); publish and feature with one tap. Each change saves at once.
 */
export function ProjectList({ initial, editable }: { initial: Project[]; editable: boolean }) {
  const [projects, setProjects] = useState(initial);
  const [dragging, setDragging] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  const saveOrder = (next: Project[]) => {
    setProjects(next);
    start(() => reorderAction(next.map((p) => p.id)));
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= projects.length || from === to) return;
    const next = [...projects];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    saveOrder(next);
  };
  const toggle = (p: Project, key: 'published' | 'featured') => {
    const value = !p[key];
    setError('');
    setProjects((list) => list.map((x) => (x.id === p.id ? { ...x, [key]: value } : x)));
    start(async () => {
      const res = await setFlagsAction(p.id, { [key]: value });
      if (!res.ok) {
        setError(`${p.name}: ${res.error}`);
        setProjects((list) => list.map((x) => (x.id === p.id ? { ...x, [key]: !value } : x)));
      }
    });
  };

  return (
    <div className="mt-8">
      {error && (
        <p role="alert" className="mb-4 text-[0.9375rem] text-[#8a2c1d]">
          {error}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {pending ? 'Saving…' : ''}
      </p>
      <ol
        className="divide-y divide-ink/10 border-y border-ink/10"
        data-testid="admin-project-list"
      >
        {projects.map((p, i) => (
          <li
            key={p.id}
            draggable={editable}
            onDragStart={() => setDragging(p.id)}
            onDragEnd={() => setDragging(null)}
            onDragOver={(e) => {
              e.preventDefault();
              if (!dragging || dragging === p.id) return;
              const from = projects.findIndex((x) => x.id === dragging);
              const next = [...projects];
              const [item] = next.splice(from, 1);
              next.splice(i, 0, item);
              setProjects(next);
            }}
            onDrop={() => saveOrder(projects)}
            className={`flex flex-wrap items-center gap-4 py-4 md:flex-nowrap ${dragging === p.id ? 'opacity-50' : ''}`}
            data-testid="admin-project-row"
          >
            {editable && (
              <span className="flex flex-col" aria-hidden={false}>
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label={`Move ${p.name} up`}
                  className="px-2 text-ink/60 hover:text-ink disabled:opacity-20"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === projects.length - 1}
                  aria-label={`Move ${p.name} down`}
                  className="px-2 text-ink/60 hover:text-ink disabled:opacity-20"
                >
                  ▼
                </button>
              </span>
            )}
            <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[3px] bg-ink/10">
              {p.cover.src && (
                <Image src={p.cover.src} alt="" fill sizes="96px" className="object-cover" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <Link
                href={`/admin/projects/${p.id}`}
                className="font-serif text-[1.25rem] leading-tight hover:text-accent"
              >
                {p.name}
              </Link>
              <span className="mt-1 block text-[0.875rem] text-ink/70">
                {CATEGORY[p.category]}
                {p.location ? ` · ${p.location}` : ''} · {p.images.length} photo
                {p.images.length === 1 ? '' : 's'}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <Toggle
                on={p.published}
                disabled={!editable}
                onClick={() => toggle(p, 'published')}
                label="Published"
              />
              <Toggle
                on={p.featured}
                disabled={!editable}
                onClick={() => toggle(p, 'featured')}
                label="On home page"
              />
              <Link
                href={`/admin/projects/${p.id}`}
                className="admin-btn admin-btn-ghost ml-2 px-4 py-2.5"
              >
                Edit
              </Link>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Toggle({
  on,
  label,
  onClick,
  disabled,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[0.75rem] font-medium uppercase tracking-[0.06em] transition-colors disabled:opacity-60 ${
        on ? 'border-ink bg-ink text-bone' : 'border-ink/25 text-ink/70 hover:border-ink'
      }`}
    >
      {label}
    </button>
  );
}
