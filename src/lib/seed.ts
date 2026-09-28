import projectsJson from '@content/projects.json';
import { getMedia, validate } from '@/lib/content';
import { projectsSchema } from '@/lib/schema';
import type { Project, ProjectImage } from '@/lib/projects/types';

/** content/projects.json, validated at build: the portfolio before a database is connected. */
export const projectsSeed = validate('content/projects.json', projectsSchema, projectsJson);

/** An image shipped with the site, with its size and placeholder from the media manifest. */
export function seedMedia(src: string): ProjectImage {
  const m = getMedia(src);
  return { src, width: m.width, height: m.height, color: m.color, blurDataURL: m.blurDataURL };
}

/** The seed file in the site's project shape. */
export const seedProjects: Project[] = projectsSeed.map((p, i) => ({
  id: p.slug,
  slug: p.slug,
  name: p.name,
  category: p.category,
  location: p.location,
  completionYear: p.completionYear,
  squareFootage: p.squareFootage,
  buildDuration: p.buildDuration,
  tagline: p.tagline,
  description: p.description,
  credits: p.credits,
  featured: p.featured,
  published: p.published,
  sortOrder: i + 1,
  cover: seedMedia(p.coverImage),
  // The cover is one of the project's photos (first); the public gallery leaves it out.
  images: [p.coverImage, ...p.images.filter((src) => src !== p.coverImage)].map(seedMedia),
  heroVideo: p.heroVideo,
}));
