import { getCollection, type CollectionEntry } from 'astro:content';
import { readingMinutes } from '../lib/format';
import type { ImageSlot } from '../lib/types';
import { blogCategories, getBlogCategory, type BlogCategory } from './blog-categories';

export type Post = CollectionEntry<'blog'>;

/** Newest first; posts published the same day are ordered by title so the order is stable. */
const byNewest = (a: Post, b: Post) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.title.localeCompare(b.data.title);

/**
 * Posts ready for the public. `draft: true` hides a post completely: it's excluded
 * from every listing (home, /blog, related articles, /site-map) and from the
 * sitemap, and because `blog/[slug].astro` no longer builds a page for it, visiting
 * its URL directly returns a 404. Sorted newest first.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort(byNewest);
}

/** Estimated reading time in minutes. */
export const readingTime = (post: Post) => readingMinutes(post.body ?? '');

export const postCategory = (post: Post): BlogCategory => getBlogCategory(post.data.category) ?? blogCategories[0];

/** The post's cover photo framed at `ratio`, or undefined when it has none. */
export const postImage = (post: Post, ratio: string): ImageSlot | undefined =>
  post.data.image ? { ...post.data.image, ratio, width: 1600, height: 1000 } : undefined;

/** The same posts with the lead story first: the `featured` post, else the newest. */
export function leadFirst(posts: Post[]): Post[] {
  const i = posts.findIndex((p) => p.data.featured);
  return i <= 0 ? posts : [posts[i], ...posts.slice(0, i), ...posts.slice(i + 1)];
}

/** Up to `limit` other posts: same topic first, then posts about the same services, then the newest. */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const score = (p: Post) =>
    (p.data.category === post.data.category ? 2 : 0) + (p.data.services.some((s) => post.data.services.includes(s)) ? 1 : 0);
  return posts
    .filter((p) => p.id !== post.id)
    .map((p, i) => ({ p, s: score(p), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, limit)
    .map((x) => x.p);
}
