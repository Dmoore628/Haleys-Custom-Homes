import type { z } from 'zod';
import projectsJson from '@content/projects.json';
import testimonialsJson from '@content/testimonials.json';
import awardsJson from '@content/awards.json';
import faqJson from '@content/faq.json';
import mediaJson from './media.generated.json';
import {
  awardsSchema,
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
export function validate<T extends z.ZodTypeAny>(file: string, schema: T, data: unknown): z.infer<T> {
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
export const testimonials = validate('content/testimonials.json', testimonialsSchema, testimonialsJson);
export const awards = validate('content/awards.json', awardsSchema, awardsJson);
export const faq = validate('content/faq.json', faqSchema, faqJson);
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
  return refs.filter((r) => !media[r]);
}
