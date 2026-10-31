import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Aayush Home Health Solutions'),
    /** true while the full article text has not been recovered from the old site */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
