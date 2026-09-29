/** The year Dan Haley Fuller founded Haley Custom Homes. */
export const FOUNDED = 1998;

export const currentYear = () => new Date().getFullYear();

/**
 * Fills the year tokens in copy: `{year}` is the current year and `{years}` the years since
 * the founding, so dated lines ("© {year}", "2016 to {year}", "{years} years") never go stale.
 */
export function withYear(text: string, year: number = currentYear()) {
  return text.replaceAll('{year}', String(year)).replaceAll('{years}', String(year - FOUNDED));
}
