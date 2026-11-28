const dateFmt = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** "2020-06-20" -> "20 June 2020" (timezone-stable). */
export const formatDate = (d: Date) => dateFmt.format(d);
export const toISODate = (d: Date) => d.toISOString().slice(0, 10);

const weekdayFmt = new Intl.DateTimeFormat('en-IN', { weekday: 'long', timeZone: 'UTC' });
/** "2026-11-30" -> "30 November 2026 (Monday)"; returns the input unchanged if it is not a yyyy-mm-dd date. */
export function formatISODateLong(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : `${formatDate(d)} (${weekdayFmt.format(d)})`;
}

/**
 * Estimated reading time of a Markdown text, in whole minutes (at least 1).
 * Comments, code blocks and link URLs are ignored; ~200 words a minute suits careful reading of health guidance.
 */
export function readingMinutes(markdown: string, wordsPerMinute = 200): number {
  const text = markdown
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

/**
 * Structured data for a `<script type="application/ld+json">` block. `<` is escaped as `<` (still
 * valid JSON) so no text in the data can ever close the script element early.
 */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

/** "Can I book care online?" -> "can-i-book-care-online" (URL-safe id; curly and straight apostrophes are dropped). */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
