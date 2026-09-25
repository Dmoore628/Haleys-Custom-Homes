import { describe, expect, it } from 'vitest';
import projectsJson from '../../content/projects.json';
import { awards, faq, missingMedia, projects, testimonials, validate } from '@/lib/content';
import { inquirySchema, projectsSchema } from '@/lib/schema';

describe('content files', () => {
  it('all validate against their schemas', () => {
    expect(projects.length).toBeGreaterThan(0);
    expect(testimonials).toHaveLength(3);
    expect(awards.length).toBeGreaterThan(0);
    expect(faq).toHaveLength(5);
  });

  it('every referenced image exists in the generated media manifest', () => {
    expect(missingMedia()).toEqual([]);
  });

  it('featured projects fill exactly one five-tile module', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(5);
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

  it('rejects a bad email and a filled honeypot', () => {
    expect(inquirySchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
    expect(inquirySchema.safeParse({ ...valid, company: 'spam co' }).success).toBe(false);
  });
});
