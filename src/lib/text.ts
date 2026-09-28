/**
 * Joins the last two words with a non-breaking space, so a wrapped line never ends on a
 * single word ("...to install on / schedule.", "Cherry Hills / Transitional"). Text of
 * fewer than three words is returned as is.
 */
export function keepTogether(text: string): string {
  const i = text.lastIndexOf(' ');
  if (i < 0 || text.indexOf(' ') === i) return text;
  return `${text.slice(0, i)} ${text.slice(i + 1)}`;
}
