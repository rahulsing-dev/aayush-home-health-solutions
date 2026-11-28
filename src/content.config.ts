import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blogCategoryIds } from './content/blog-categories';
import { services } from './content/services';

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** Shown as "Blog by <author>" on the article (owner's choice, Nov 2026); set per post to override. */
    author: z.string().default('Rahul'),
    /** true hides the post everywhere (listings, sitemap, direct link = 404). */
    draft: z.boolean().default(false),
    /** Topic id from src/content/blog-categories.ts (badge, /blog filter, related articles). */
    category: z.enum(blogCategoryIds),
    /**
     * Cover photo: a file name in src/assets/images/ or src/assets/gallery/ (a missing file fails the build).
     * Without one, cards and the article show the topic's icon instead.
     */
    image: z
      .object({ src: z.string(), alt: z.string().min(10), position: z.string().optional() })
      .optional(),
    /** Slugs of services the article relates to, shown as "Care that can help" (an unknown slug fails the build). */
    services: z.array(z.enum(serviceSlugs)).default([]),
    /** Lead story on /blog. Without one, the newest post leads. */
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
