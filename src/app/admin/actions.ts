'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { changePassword, requireAdmin, signIn, signOut, type SignInResult } from '@/lib/auth/admin';
import {
  PROJECTS_TAG,
  createProject,
  deleteProject,
  getProjectById,
  reorderProjects,
  setFlags,
  setImages,
  slugTaken,
  updateProject,
} from '@/lib/projects/repo';
import type { ProjectFields, ProjectImage } from '@/lib/projects/types';
import { slugify } from '@/lib/slug';
import { removeUploaded } from '@/lib/storage';

/** Refreshes every public page that shows projects. */
function publish() {
  revalidateTag(PROJECTS_TAG);
  revalidatePath('/', 'layout');
}

export async function signInAction(_: SignInResult | null, form: FormData): Promise<SignInResult> {
  const result = await signIn(String(form.get('email') ?? ''), String(form.get('password') ?? ''));
  if (!result.ok) return result;
  const next = String(form.get('next') ?? '');
  redirect(next.startsWith('/admin') ? next : '/admin');
}

export async function signOutAction() {
  signOut();
  redirect('/admin/login');
}

const fieldsSchema = z.object({
  name: z.string().trim().min(1, 'Give the project a name.').max(120),
  slug: z.string().trim().max(80).optional(),
  category: z.enum(['new-build', 'remodel']),
  location: z.string().trim().max(120).default(''),
  completionYear: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{4}$/.test(v), 'Use a four-digit year, or leave it blank.')
    .default(''),
  squareFootage: z.string().trim().max(40).default(''),
  buildDuration: z.string().trim().max(40).default(''),
  tagline: z.string().trim().max(160).default(''),
  description: z.string().trim().max(4000).default(''),
  credits: z
    .array(z.object({ role: z.string().trim().max(80), name: z.string().trim().max(120) }))
    .max(12)
    .default([]),
  featured: z.boolean(),
  published: z.boolean(),
});

export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export async function saveProjectAction(id: string | null, input: unknown): Promise<SaveResult> {
  await requireAdmin();
  const parsed = fieldsSchema.safeParse(input);
  if (!parsed.success)
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Check the form.' };
  const f = parsed.data;
  const slug = slugify(f.slug || f.name);
  if (!slug) return { ok: false, error: 'The web address needs at least one letter or number.' };
  if (await slugTaken(slug, id ?? undefined)) {
    return { ok: false, error: `Another project already uses the address /portfolio/${slug}.` };
  }
  const credits = f.credits.filter((c) => c.role && c.name);
  const fields: ProjectFields = { ...f, slug, credits };

  if (id) {
    const existing = await getProjectById(id);
    if (!existing) return { ok: false, error: 'This project no longer exists.' };
    if (fields.published && existing.images.length === 0) {
      return { ok: false, error: 'Add at least one photo before publishing.' };
    }
    await updateProject(id, fields);
  } else {
    // A new project has no photos yet, so it starts as a draft.
    id = await createProject({ ...fields, published: false });
  }
  publish();
  return { ok: true, id };
}

export async function setFlagsAction(
  id: string,
  flags: { published?: boolean; featured?: boolean },
) {
  await requireAdmin();
  if (flags.published) {
    const project = await getProjectById(id);
    if (!project?.images.length)
      return { ok: false as const, error: 'Add photos before publishing.' };
  }
  await setFlags(id, flags);
  publish();
  return { ok: true as const };
}

export async function reorderAction(ids: string[]) {
  await requireAdmin();
  if (!Array.isArray(ids) || ids.some((i) => typeof i !== 'string')) return;
  await reorderProjects(ids);
  publish();
}

export async function deleteProjectAction(id: string) {
  await requireAdmin();
  const images = await deleteProject(id);
  await removeUploaded(images.map((i) => i.src));
  publish();
  redirect('/admin');
}

const imageSchema = z.object({
  src: z.string().min(1).max(2000),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  color: z.string().max(20),
  blurDataURL: z.string().max(4000),
});

/** Saves the gallery order and cover; deletes the storage files of images that were removed. */
export async function saveImagesAction(
  id: string,
  images: ProjectImage[],
  coverSrc: string | null,
) {
  await requireAdmin();
  const list = z.array(imageSchema).max(60).parse(images);
  const project = await getProjectById(id);
  if (!project) return { ok: false as const, error: 'This project no longer exists.' };
  const cover = list.find((i) => i.src === coverSrc) ?? list[0] ?? null;
  await setImages(id, list, cover);
  const kept = new Set(list.map((i) => i.src));
  await removeUploaded(
    [...project.images, project.cover].map((i) => i.src).filter((src) => !kept.has(src)),
  );
  if (!list.length && project.published) await setFlags(id, { published: false });
  publish();
  return { ok: true as const };
}

export async function changePasswordAction(
  _: SignInResult | null,
  form: FormData,
): Promise<SignInResult> {
  const admin = await requireAdmin();
  const next = String(form.get('next') ?? '');
  if (next !== String(form.get('confirm') ?? ''))
    return { ok: false, error: 'The new passwords don’t match.' };
  return changePassword(admin.sub, String(form.get('current') ?? ''), next);
}
