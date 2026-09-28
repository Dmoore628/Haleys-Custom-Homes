import type { z } from 'zod';
import type { categorySchema, creditSchema } from '@/lib/schema';

export type Category = z.infer<typeof categorySchema>;
export type Credit = z.infer<typeof creditSchema>;

/** An image with what the site needs to render it without layout shift. */
export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  /** A muted tone sampled from the photo, shown while it loads. */
  color: string;
  /** A tiny blurred preview (data URL), or '' when none. */
  blurDataURL: string;
}

/** A portfolio project as the site renders it, whether it comes from the database or the seed. */
export interface Project {
  id: string;
  slug: string;
  name: string;
  category: Category;
  location?: string;
  completionYear?: string;
  squareFootage?: string;
  buildDuration?: string;
  tagline?: string;
  description: string;
  credits: Credit[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  cover: ProjectImage;
  images: ProjectImage[];
  heroVideo: string | null;
  updatedAt?: string;
}

/** What the admin form edits. Images are managed separately. */
export interface ProjectFields {
  slug: string;
  name: string;
  category: Category;
  location: string;
  completionYear: string;
  squareFootage: string;
  buildDuration: string;
  tagline: string;
  description: string;
  credits: Credit[];
  featured: boolean;
  published: boolean;
}
