import type { CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'blog'>;

const getSupabaseConfig = () => {
	const url = (import.meta.env.PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
	const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
	return { url, key, enabled: Boolean(url && key) };
};

const request = async (path: string) => {
	const { url, key } = getSupabaseConfig();
	const response = await fetch(`${url}/rest/v1/${path}`, {
		headers: {
			apikey: key,
			Authorization: `Bearer ${key}`,
		},
	});
	if (!response.ok) {
		throw new Error(`Supabase request failed: ${response.status}`);
	}
	return response.json();
};

const buildInFilter = (postIds: string[]) => {
	const escaped = postIds.map((id) => `"${id.replace(/"/g, '')}"`).join(',');
	return `in.(${escaped})`;
};

export const getViewCounts = async (postIds: string[]) => {
	const { enabled } = getSupabaseConfig();
	if (!enabled || postIds.length === 0) {
		return new Map<string, number>();
	}

	try {
		const params = new URLSearchParams({ select: 'post_id' });
		params.set('post_id', buildInFilter(postIds));
		const rows = (await request(`post_views?${params.toString()}`)) as Array<{ post_id: string }>;
		const counts = new Map<string, number>();
		for (const row of rows) {
			counts.set(row.post_id, (counts.get(row.post_id) ?? 0) + 1);
		}
		return counts;
	} catch {
		return new Map<string, number>();
	}
};

export const sortPostsByViews = async (posts: ArticleEntry[]) => {
	const counts = await getViewCounts(posts.map((post) => post.id));
	return posts
		.slice()
		.sort((a, b) => {
			const viewDiff = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
			if (viewDiff !== 0) {
				return viewDiff;
			}
			return b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
		});
};

export const buildPostRouteMap = (posts: ArticleEntry[]) => {
	return Object.fromEntries(posts.map((post) => [post.id, `/${post.data.column}/${post.id}/`]));
};

export interface TagItem {
	name: string;
	count: number;
	href: string;
	sizeLevel: 1 | 2 | 3;
}

interface BuildTagOptions {
	limit?: number;
}

const resolveSizeLevel = (count: number, min: number, max: number): 1 | 2 | 3 => {
	if (max <= min) return 2;
	const ratio = (count - min) / (max - min);
	if (ratio >= 0.66) return 3;
	if (ratio >= 0.33) return 2;
	return 1;
};

export const buildTagItems = (posts: ArticleEntry[], options: BuildTagOptions = {}): TagItem[] => {
	const limit = options.limit ?? Number.POSITIVE_INFINITY;
	const tagCounter = new Map<string, number>();
	const tagColumnCounter = new Map<string, Map<string, number>>();

	for (const post of posts) {
		for (const rawTag of post.data.tags ?? []) {
			const tag = rawTag.trim();
			if (!tag) continue;
			tagCounter.set(tag, (tagCounter.get(tag) ?? 0) + 1);

			if (!tagColumnCounter.has(tag)) {
				tagColumnCounter.set(tag, new Map());
			}
			const columnCounter = tagColumnCounter.get(tag)!;
			columnCounter.set(post.data.column, (columnCounter.get(post.data.column) ?? 0) + 1);
		}
	}

	const sorted = [...tagCounter.entries()]
		.sort((a, b) => {
			if (b[1] !== a[1]) return b[1] - a[1];
			return a[0].localeCompare(b[0], 'zh-CN');
		})
		.slice(0, limit);

	const counts = sorted.map(([, count]) => count);
	const maxCount = counts.length ? Math.max(...counts) : 0;
	const minCount = counts.length ? Math.min(...counts) : 0;

	return sorted
		.map(([name, count]) => {
			const columnCounter = tagColumnCounter.get(name) ?? new Map<string, number>();
			const primaryColumn = [...columnCounter.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'yuanwei';
			return {
				name,
				count,
				href: `/${primaryColumn}/`,
				sizeLevel: resolveSizeLevel(count, minCount, maxCount),
			};
		});
};
