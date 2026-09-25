import { describe, expect, it } from 'vitest';
import { sectionProgress } from '@/lib/animation';
import { createRateLimiter } from '@/lib/rateLimit';

describe('progress rail scroll math', () => {
  it('is 0 before the section reaches the anchor line and 1 after it passes', () => {
    expect(sectionProgress(1000, 2000, 800)).toBe(0);
    expect(sectionProgress(-3000, 2000, 800)).toBe(1);
  });
  it('is proportional in between', () => {
    expect(sectionProgress(-600, 2000, 800)).toBeCloseTo(0.5);
  });
});

describe('contact rate limiter', () => {
  it('allows the limit per window, then blocks, then resets', () => {
    const allow = createRateLimiter(2, 1000);
    expect(allow('ip', 0)).toBe(true);
    expect(allow('ip', 10)).toBe(true);
    expect(allow('ip', 20)).toBe(false);
    expect(allow('other', 20)).toBe(true);
    expect(allow('ip', 1500)).toBe(true);
  });
});
