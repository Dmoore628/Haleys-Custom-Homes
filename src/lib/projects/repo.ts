import 'server-only';
import { unstable_cache } from 'next/cache';
import { ensureDatabase, hasDatabase, sql } from '@/lib/db';
import { seedProjects } from '@/lib/seed';
import type { Credit, Project, ProjectFields, ProjectImage } from './types';

/** Cache tag for everything the public site reads about projects; the admin revalidates it. */
export const PROJECTS_TAG = 'projects';

interface Row {
  id: string;
  slug: string;
  name: string;
  category: Project['category'];
  location: string | null;
  completion_year: string | null;
  square_footage: string | null;
  build_duration: string | null;
  tagline: string | null;
  description: string;
  credits: Credit[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  cover: ProjectImage | null;
  images: ProjectImage[];
  hero_video: string | null;
  updated_at: Date;
}

const EMPTY_IMAGE: ProjectImage = {
  src: '',
  width: 1600,
  height: 1067,
  color: '#cfc6b8',
  blurDataURL: '',
};

function toProject(r: Row): Project {
  const images = r.images ?? [];
  return {
    id: String(r.id),
    slug: r.slug,
    name: r.name,
    category: r.category,
    location: r.location ?? undefined,
    completionYear: r.completion_year ?? undefined,
    squareFootage: r.square_footage ?? undefined,
    buildDuration: r.build_duration ?? undefined,
    tagline: r.tagline ?? undefined,
    description: r.description,
    credits: r.credits ?? [],
    featured: r.featured,
    published: r.published,
    sortOrder: r.sort_order,
    cover: r.cover ?? images[0] ?? EMPTY_IMAGE,
    images,
    heroVideo: r.hero_video,
    updatedAt: r.updated_at?.toISOString(),
  };
}

async function allProjects(): Promise<Project[]> {
  if (!hasDatabase()) return seedProjects;
  await ensureDatabase();
  const rows = await sql()<Row[]>`SELECT * FROM projects ORDER BY sort_order, id`;
  return rows.map(toProject);
}

/**
 * Published projects, in display order. Cached until the admin changes something (the admin
 * calls revalidateTag(PROJECTS_TAG)), so the public site never waits on the database.
 */
export const getPublishedProjects = unstable_cache(
  async () =>
    (await allProjects()).filter((p) => p.published && p.images.length > 0 && p.cover.src),
  ['published-projects'],
  { tags: [PROJECTS_TAG] },
);

export async function getFeaturedProjects(): Promise<Project[]> {
  return (await getPublishedProjects()).filter((p) => p.featured);
}

export async function getPublishedProject(slug: string): Promise<Project | undefined> {
  return (await getPublishedProjects()).find((p) => p.slug === slug);
}

// ---- Admin (uncached, database required) -------------------------------------------------

export async function listAllProjects(): Promise<Project[]> {
  return allProjects();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  if (!hasDatabase()) return seedProjects.find((p) => p.id === id);
  await ensureDatabase();
  const rows = await sql()<Row[]>`SELECT * FROM projects WHERE id = ${id}`;
  return rows[0] ? toProject(rows[0]) : undefined;
}

export async function slugTaken(slug: string, exceptId?: string): Promise<boolean> {
  await ensureDatabase();
  const rows = await sql()`
    SELECT 1 FROM projects WHERE slug = ${slug} AND (${exceptId ?? null}::bigint IS NULL OR id <> ${exceptId ?? null}::bigint)`;
  return rows.length > 0;
}

const nullIfEmpty = (v: string) => (v.trim() ? v.trim() : null);

export async function createProject(f: ProjectFields): Promise<string> {
  await ensureDatabase();
  const db = sql();
  const [{ id }] = await db<{ id: string }[]>`
    INSERT INTO projects (slug, name, category, location, completion_year, square_footage,
      build_duration, tagline, description, credits, featured, published, sort_order)
    VALUES (${f.slug}, ${f.name.trim()}, ${f.category}, ${nullIfEmpty(f.location)},
      ${nullIfEmpty(f.completionYear)}, ${nullIfEmpty(f.squareFootage)},
      ${nullIfEmpty(f.buildDuration)}, ${nullIfEmpty(f.tagline)}, ${f.description.trim()},
      ${db.json(f.credits)}, ${f.featured}, ${f.published},
      (SELECT COALESCE(MIN(sort_order), 1) - 1 FROM projects))
    RETURNING id::text`;
  return id;
}

export async function updateProject(id: string, f: ProjectFields): Promise<void> {
  await ensureDatabase();
  const db = sql();
  await db`
    UPDATE projects SET slug = ${f.slug}, name = ${f.name.trim()}, category = ${f.category},
      location = ${nullIfEmpty(f.location)}, completion_year = ${nullIfEmpty(f.completionYear)},
      square_footage = ${nullIfEmpty(f.squareFootage)},
      build_duration = ${nullIfEmpty(f.buildDuration)}, tagline = ${nullIfEmpty(f.tagline)},
      description = ${f.description.trim()}, credits = ${db.json(f.credits)},
      featured = ${f.featured}, published = ${f.published}, updated_at = now()
    WHERE id = ${id}`;
}

export async function setImages(id: string, images: ProjectImage[], cover: ProjectImage | null) {
  await ensureDatabase();
  const db = sql();
  await db`
    UPDATE projects SET images = ${db.json(images as never)}, cover = ${cover ? db.json(cover as never) : null},
      updated_at = now()
    WHERE id = ${id}`;
}

export async function setFlags(id: string, flags: { published?: boolean; featured?: boolean }) {
  await ensureDatabase();
  const db = sql();
  if (flags.published !== undefined)
    await db`UPDATE projects SET published = ${flags.published}, updated_at = now() WHERE id = ${id}`;
  if (flags.featured !== undefined)
    await db`UPDATE projects SET featured = ${flags.featured}, updated_at = now() WHERE id = ${id}`;
}

/** Saves a new display order: ids in the order they should appear. */
export async function reorderProjects(ids: string[]) {
  await ensureDatabase();
  const db = sql();
  await db.begin(async (tx) => {
    for (let i = 0; i < ids.length; i++) {
      await tx`UPDATE projects SET sort_order = ${i + 1} WHERE id = ${ids[i]}`;
    }
  });
}

/** Deletes a project and returns its images, so uploaded files can be removed from storage. */
export async function deleteProject(id: string): Promise<ProjectImage[]> {
  await ensureDatabase();
  const rows = await sql()<Pick<Row, 'images' | 'cover'>[]>`
    DELETE FROM projects WHERE id = ${id} RETURNING images, cover`;
  if (!rows[0]) return [];
  const { images, cover } = rows[0];
  return cover ? [...images, cover] : images;
}
