'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteProjectAction, saveProjectAction } from '@/app/admin/actions';
import type { Credit, Project, ProjectFields } from '@/lib/projects/types';
import { slugify } from '@/lib/slug';
import { PhotoManager } from './PhotoManager';
import { Field, inputClass } from './ui';

function initialFields(p?: Project): ProjectFields {
  return {
    slug: p?.slug ?? '',
    name: p?.name ?? '',
    category: p?.category ?? 'new-build',
    location: p?.location ?? '',
    completionYear: p?.completionYear ?? '',
    squareFootage: p?.squareFootage ?? '',
    buildDuration: p?.buildDuration ?? '',
    tagline: p?.tagline ?? '',
    description: p?.description ?? '',
    credits: p?.credits ?? [],
    featured: p?.featured ?? false,
    published: p?.published ?? false,
  };
}

/**
 * Create or edit one project. Details save with the Save button; photos (on an existing project)
 * save the moment they're uploaded, reordered or removed. A new project is created as a draft and
 * opens straight into this editor to add photos.
 */
export function ProjectEditor({ project }: { project?: Project }) {
  const router = useRouter();
  const [f, setF] = useState<ProjectFields>(() => initialFields(project));
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const [photoCount, setPhotoCount] = useState(project?.images.length ?? 0);

  const set = <K extends keyof ProjectFields>(key: K, value: ProjectFields[K]) =>
    setF((prev) => ({ ...prev, [key]: value }));

  const save = () =>
    start(async () => {
      setMessage(null);
      const res = await saveProjectAction(project?.id ?? null, f);
      if (!res.ok) return setMessage({ ok: false, text: res.error });
      if (!project) {
        router.push(`/admin/projects/${res.id}?created=1`);
        return;
      }
      setMessage({
        ok: true,
        text: f.published ? 'Saved and live on the site.' : 'Saved as a draft.',
      });
      router.refresh();
    });

  const setCredit = (i: number, key: keyof Credit, value: string) =>
    set(
      'credits',
      f.credits.map((c, j) => (j === i ? { ...c, [key]: value } : c)),
    );

  return (
    <div>
      <Link href="/admin" className="label text-ink/70 hover:text-ink">
        ← All projects
      </Link>
      <h1 className="mt-4 font-serif text-[2.25rem] leading-tight">
        {project ? project.name : 'New project'}
      </h1>

      <form
        className="mt-8 grid gap-x-10 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
      >
        <div>
          <Field label="Project name">
            <input
              required
              value={f.name}
              onChange={(e) => {
                set('name', e.target.value);
                if (!slugEdited) set('slug', slugify(e.target.value));
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Web address" hint="haleycustomhomes.com/portfolio/…">
            <input
              value={f.slug}
              onChange={(e) => {
                setSlugEdited(true);
                set('slug', e.target.value);
              }}
              onBlur={() => set('slug', slugify(f.slug || f.name))}
              className={inputClass}
            />
          </Field>
          <fieldset className="mt-5">
            <legend className="label">Type</legend>
            <div className="mt-2 flex gap-2">
              {(
                [
                  ['new-build', 'New build'],
                  ['remodel', 'Remodel'],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-[4px] border px-4 py-2.5 text-[0.9375rem] ${
                    f.category === value ? 'border-ink bg-ink text-bone' : 'border-ink/25'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={value}
                    checked={f.category === value}
                    onChange={() => set('category', value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Tagline" hint="optional, one line">
            <input
              value={f.tagline}
              onChange={(e) => set('tagline', e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={7}
              value={f.description}
              onChange={(e) => set('description', e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-x-4">
            <Field label="Location" hint="optional">
              <input
                value={f.location}
                placeholder="Denver, CO"
                onChange={(e) => set('location', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Year completed" hint="optional">
              <input
                value={f.completionYear}
                inputMode="numeric"
                placeholder="2024"
                onChange={(e) => set('completionYear', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Square footage" hint="optional">
              <input
                value={f.squareFootage}
                placeholder="6,800 sq ft"
                onChange={(e) => set('squareFootage', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Build duration" hint="optional">
              <input
                value={f.buildDuration}
                placeholder="14 months"
                onChange={(e) => set('buildDuration', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <fieldset className="mt-6">
            <legend className="label">Credits</legend>
            {f.credits.map((c, i) => (
              <div key={i} className="mt-2 flex items-center gap-2">
                <div className="w-2/5">
                  <input
                    aria-label="Role"
                    value={c.role}
                    placeholder="Architecture"
                    onChange={(e) => setCredit(i, 'role', e.target.value)}
                    className={`${inputClass} mt-0`}
                  />
                </div>
                <div className="flex-1">
                  <input
                    aria-label="Name"
                    value={c.name}
                    placeholder="Firm or person"
                    onChange={(e) => setCredit(i, 'name', e.target.value)}
                    className={`${inputClass} mt-0`}
                  />
                </div>
                <button
                  type="button"
                  aria-label="Remove credit"
                  onClick={() =>
                    set(
                      'credits',
                      f.credits.filter((_, j) => j !== i),
                    )
                  }
                  className="px-2 text-ink/60 hover:text-[#8a2c1d]"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => set('credits', [...f.credits, { role: '', name: '' }])}
              className="label mt-3 text-accent hover:text-ink"
            >
              + Add a credit
            </button>
          </fieldset>

          <div className="mt-8 space-y-3 rounded-[4px] border border-ink/15 p-4">
            <div className="flex items-start gap-3">
              <input
                id="project-published"
                type="checkbox"
                checked={f.published}
                disabled={!project}
                onChange={(e) => set('published', e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#1A1815]"
              />
              <label htmlFor="project-published">
                <span className="font-medium">Published</span>
                <span className="block text-[0.875rem] text-ink/70">
                  {project
                    ? photoCount
                      ? 'Shown on the website.'
                      : 'Add at least one photo first.'
                    : 'Save the project, add photos, then publish.'}
                </span>
              </label>
            </div>
            <div className="flex items-start gap-3">
              <input
                id="project-featured"
                type="checkbox"
                checked={f.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#1A1815]"
              />
              <label htmlFor="project-featured">
                <span className="font-medium">Feature on the home page</span>
                <span className="block text-[0.875rem] text-ink/70">
                  Shown in “A Sample of What We’ve Built” (five look best).
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 lg:col-span-2">
          <button type="submit" disabled={pending} className="admin-btn admin-btn-primary">
            {pending ? 'Saving…' : project ? 'Save changes' : 'Create project'}
          </button>
          {project?.published && (
            <a
              href={`/portfolio/${project.slug}`}
              target="_blank"
              rel="noreferrer"
              className="label hover:text-accent"
            >
              View on site ↗
            </a>
          )}
          {message && (
            <p
              role="status"
              className={
                message.ok ? 'text-[0.9375rem] text-[#2f5d3a]' : 'text-[0.9375rem] text-[#8a2c1d]'
              }
            >
              {message.text}
            </p>
          )}
        </div>
      </form>

      {project && (
        <>
          <section className="mt-14 border-t border-ink/10 pt-10" aria-labelledby="photos-heading">
            <PhotoManager project={project} onCountChange={setPhotoCount} />
          </section>
          <section className="mt-14 border-t border-ink/10 pt-8">
            <DeleteProject id={project.id} name={project.name} />
          </section>
        </>
      )}
    </div>
  );
}

function DeleteProject({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, start] = useTransition();
  return confirming ? (
    <div className="flex flex-wrap items-center gap-3">
      <p className="text-[0.9375rem]">
        Delete <strong>{name}</strong> and its uploaded photos? This can’t be undone.
      </p>
      <button
        type="button"
        disabled={pending}
        onClick={() => start(() => deleteProjectAction(id))}
        className="admin-btn admin-btn-danger"
      >
        {pending ? 'Deleting…' : 'Yes, delete'}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="admin-btn admin-btn-ghost"
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="admin-btn admin-btn-danger"
    >
      Delete project
    </button>
  );
}
