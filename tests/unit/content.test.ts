import { describe, expect, it } from 'vitest';
import projectsJson from '../../content/projects.json';
import { awards, faq, getMedia, missingMedia, testimonials, validate } from '@/lib/content';
import { seedProjects } from '@/lib/seed';
import { inquirySchema, projectsSchema } from '@/lib/schema';

const projects = seedProjects;
const published = seedProjects.filter((p) => p.published);

describe('content files', () => {
  it('all validate against their schemas', () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(testimonials).toHaveLength(3);
    expect(awards.length).toBeGreaterThan(0);
    expect(faq).toHaveLength(10);
  });

  it('publishes every verified project, new builds and remodels, with no placeholders', () => {
    expect(published.map((p) => p.name).sort()).toEqual(
      [
        'Curated House',
        'Endlessly Charming',
        'Heaven at Sunset',
        'House of Tranquility',
        'Modern Elevated',
        'Naturally Modern',
        'Simplicity Perfected',
        'Striking Modern Sanctuary',
        'Timeless Estate',
        'Tradition Reimagined',
      ].sort(),
    );
    expect(
      published
        .filter((p) => p.category === 'remodel')
        .map((p) => p.name)
        .sort(),
    ).toEqual(['Curated House', 'Endlessly Charming']);
    const values = [
      ...published.flatMap((p) => [
        p.name,
        p.location ?? '',
        p.description,
        p.completionYear ?? '',
        p.tagline ?? '',
      ]),
      ...faq.flatMap((f) => [f.question, f.answer]),
    ];
    for (const v of values) expect(v).not.toMatch(/PLACEHOLDER|\[|\]|TBD/);
    // Every published project has a cover and at least one gallery photo.
    for (const p of published) expect(p.images.length).toBeGreaterThan(0);
  });

  it('every referenced image exists in the generated media manifest', () => {
    expect(missingMedia()).toEqual([]);
    for (const p of projects) {
      for (const img of [p.cover, ...p.images])
        expect(getMedia(img.src).blurDataURL, img.src).not.toBe('');
    }
  });

  it('featured projects fill exactly one five-tile module', () => {
    expect(published.filter((p) => p.featured)).toHaveLength(5);
  });

  it('fails with the exact file and field when a required field is missing', () => {
    const broken = structuredClone(projectsJson) as Record<string, unknown>[];
    delete broken[0].name;
    expect(() => validate('content/projects.json', projectsSchema, broken)).toThrow(
      /content\/projects\.json › 0\.name/,
    );
  });

  it('rejects duplicate project slugs', () => {
    const dup = [projectsJson[0], projectsJson[0]];
    expect(() => validate('content/projects.json', projectsSchema, dup)).toThrow(/unique/);
  });
});

describe('inquiry schema', () => {
  const valid = {
    name: 'A Visitor',
    email: 'a@example.com',
    phone: '303-555-0100',
    projectType: 'Remodel',
    budget: '$1M to $4M',
  };

  it('accepts a complete inquiry and defaults the optional fields', () => {
    const parsed = inquirySchema.parse(valid);
    expect(parsed.location).toBe('');
    expect(parsed.message).toBe('');
  });

  it('rejects a budget outside the four real options', () => {
    expect(inquirySchema.safeParse({ ...valid, budget: '$250k' }).success).toBe(false);
  });

  it('accepts the optional lot field only with one of its three options', () => {
    expect(inquirySchema.parse({ ...valid, lot: 'Still deciding' }).lot).toBe('Still deciding');
    expect(inquirySchema.parse(valid).lot).toBe('');
    expect(inquirySchema.safeParse({ ...valid, lot: 'Maybe' }).success).toBe(false);
  });

  it('rejects a bad email and a filled honeypot', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, company: 'spam co' }).success).toBe(false);
  });
});
