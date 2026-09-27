import type { z } from 'zod';
import projectsJson from '@content/projects.json';
import testimonialsJson from '@content/testimonials.json';
import awardsJson from '@content/awards.json';
import faqJson from '@content/faq.json';
import pressJson from '@content/press.json';
import communityJson from '@content/community.json';
import mediaJson from './media.generated.json';
import {
  awardsSchema,
  communitySchema,
  pressSchema,
  faqSchema,
  mediaManifestSchema,
  projectsSchema,
  testimonialsSchema,
  type MediaEntry,
} from './schema';

/**
 * Validates a content file at module load (which happens during `next build`), so a
 * broken edit fails the build with the exact file and field instead of shipping.
 */
export function validate<T extends z.ZodTypeAny>(
  file: string,
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${file} › ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid content in ${file}:\n${issues}`);
  }
  return result.data;
}

export const projects = validate('content/projects.json', projectsSchema, projectsJson);
export const testimonials = validate(
  'content/testimonials.json',
  testimonialsSchema,
  testimonialsJson,
);
export const awards = validate('content/awards.json', awardsSchema, awardsJson);
export const faq = validate('content/faq.json', faqSchema, faqJson);
export const press = validate('content/press.json', pressSchema, pressJson);
export const community = validate('content/community.json', communitySchema, communityJson);
const media = validate('src/lib/media.generated.json', mediaManifestSchema, mediaJson);

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

const FALLBACK: MediaEntry = { width: 1600, height: 1067, color: '#cfc6b8', blurDataURL: '' };

export function getMedia(src: string): MediaEntry {
  return media[src] ?? FALLBACK;
}

/** Every image referenced from content must exist in the generated media manifest. */
export function missingMedia(): string[] {
  const refs = projects.flatMap((p) => [p.heroImage, p.coverImage, ...p.images]);
  awards.forEach((a) => a.mark && refs.push(a.mark));
  press.forEach((p) => refs.push(p.mark));
  community.causes.forEach((c) => refs.push(c.mark));
  community.partners.marks.forEach((m) => refs.push(m.mark));
  return refs.filter((r) => !media[r]);
}
