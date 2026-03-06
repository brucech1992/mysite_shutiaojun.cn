import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { COLUMN_KEYS } from './lib/columns';

const blog = defineCollection({
	loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			column: z.enum(COLUMN_KEYS),
			tags: z.array(z.string()).min(1),
			resources: z
				.array(
					z.object({
						title: z.string(),
						url: z.string().url(),
						note: z.string().optional(),
					}),
				)
				.optional(),
		}),
});

export const collections = { blog };
