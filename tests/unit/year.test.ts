import { describe, expect, it } from 'vitest';
import copy from '@content/copy.config';
import { FOUNDED, withYear } from '@/lib/year';

describe('withYear', () => {
  it('fills the current year and the years since the founding', () => {
    expect(withYear('© {year}', 2031)).toBe('© 2031');
    expect(withYear('{years} years', 2031)).toBe(`${2031 - FOUNDED} years`);
  });

  it('leaves no dated line in the copy hard-coded', () => {
    expect(withYear(copy.footer.copyright, 2031)).toBe(
      '© 2031 Haley Custom Homes. All rights reserved.',
    );
    expect(withYear(copy.home.reviews.bestOf, 2031)).toBe('Best of Houzz, every year 2016 to 2031');
    expect(withYear(copy.home.positioning.supporting, 2031)).toContain('has spent 33 years');
  });
});
