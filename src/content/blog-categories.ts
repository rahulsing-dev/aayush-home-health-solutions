/**
 * Blog topics: the badge on each article, the /blog topic filter and the "related articles" ranking.
 * Framework-free so the content schema (src/content.config.ts) can validate each post's `category`
 * against this list: an unknown topic fails the build. Topics with no published posts are not shown.
 */
import type { IconName, Tone } from '../lib/types';

export interface BlogCategory {
  id: string;
  label: string;
  icon: IconName;
  /** Colour family (`.tone-*` in global.css). */
  tone: Tone;
}

export const blogCategories = [
  { id: 'home-care-basics', label: 'Home care explained', icon: 'home-plus', tone: 'blue' },
  { id: 'recovery', label: 'Recovery at home', icon: 'person-standing', tone: 'sun' },
  { id: 'elder-care', label: 'Elder care', icon: 'heart', tone: 'teal' },
  { id: 'memory-care', label: 'Memory care', icon: 'brain', tone: 'plum' },
  { id: 'family-caregivers', label: 'For family caregivers', icon: 'users', tone: 'blue' },
] as const satisfies readonly BlogCategory[];

export type BlogCategoryId = (typeof blogCategories)[number]['id'];

export const blogCategoryIds = blogCategories.map((c) => c.id) as [BlogCategoryId, ...BlogCategoryId[]];

export const getBlogCategory = (id: string): BlogCategory | undefined => blogCategories.find((c) => c.id === id);
