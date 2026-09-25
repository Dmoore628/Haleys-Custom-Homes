import { z } from 'zod';

export const categorySchema = z.enum(['new-build', 'remodel']);

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase letters, numbers and dashes'),
  name: z.string().min(1),
  category: categorySchema,
  categoryConfirmed: z.boolean(),
  location: z.string().min(1),
  squareFootage: z.string().min(1),
  buildDuration: z.string().min(1),
  completionYear: z.string().min(1),
  description: z.string().min(1),
  heroImage: z.string().startsWith('/images/'),
  heroVideo: z.string().startsWith('/video/').nullable(),
  coverImage: z.string().startsWith('/images/'),
  images: z.array(z.string().startsWith('/images/')).min(1),
  featured: z.boolean(),
});

export const projectsSchema = z
  .array(projectSchema)
  .min(1)
  .refine((list) => new Set(list.map((p) => p.slug)).size === list.length, {
    message: 'project slugs must be unique',
  });

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  name: z.string().min(1),
  projectType: z.string().min(1),
});
export const testimonialsSchema = z.array(testimonialSchema).min(1);

export const awardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  year: z.string().nullable(),
  description: z.string().min(1),
  mark: z.string().startsWith('/images/').nullable(),
  markAlt: z.string().min(1),
});
export const awardsSchema = z.array(awardSchema).min(1);

export const faqSchema = z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) }));

export const mediaEntrySchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  color: z.string(),
  blurDataURL: z.string(),
});
export const mediaManifestSchema = z.record(z.string(), mediaEntrySchema);

// Contact form: shared by the client form and the /api/contact route.
export const PROJECT_TYPES = ['New Custom Home', 'Remodel'] as const;
export const BUDGETS = ['Under $600k', '$600k to $1M', '$1M to $4M', '$4M+'] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  phone: z.string().trim().min(7).max(40),
  projectType: z.enum(PROJECT_TYPES),
  budget: z.enum(BUDGETS),
  location: z.string().trim().max(200).optional().default(''),
  message: z.string().trim().max(5000).optional().default(''),
  // Honeypot: real visitors never see or fill this.
  company: z.string().max(0).optional().default(''),
});

export type Project = z.infer<typeof projectSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type Award = z.infer<typeof awardSchema>;
export type FaqItem = z.infer<typeof faqSchema>[number];
export type MediaEntry = z.infer<typeof mediaEntrySchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
