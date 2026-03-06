export const COLUMN_KEYS = ['yuanwei', 'fanqiejiang', 'haiou-kanguo'] as const;

export type ColumnKey = (typeof COLUMN_KEYS)[number];

export interface ColumnMeta {
	slug: ColumnKey;
	name: string;
	summary: string;
	description: string;
	accent: string;
	soft: string;
}

export const COLUMNS: ColumnMeta[] = [
	{
		slug: 'yuanwei',
		name: '原味薯条',
		summary: '世界发生什么事，实事评论思考，商业财经政治民生。',
		description:
			'关注新闻背后的结构性变化，记录对经济、产业与公共议题的持续观察。',
		accent: '#5e90ab',
		soft: '#edf4f8',
	},
	{
		slug: 'fanqiejiang',
		name: '蕃茄酱',
		summary: '让文字更有味道，分享深度思考、根本逻辑与长期价值。',
		description: '通过长线视角拆解关键问题，让复杂议题回到第一性原理。',
		accent: '#b86f67',
		soft: '#fbefec',
	},
	{
		slug: 'haiou-kanguo',
		name: '海鸥看过',
		summary: '好书、好网站推荐，读后感，以及正在经营的自媒体链接。',
		description: '把输入变成可复用的索引，让内容消费沉淀成行动建议。',
		accent: '#6e8294',
		soft: '#eef3f7',
	},
];

export const columnMap = new Map<ColumnKey, ColumnMeta>(COLUMNS.map((item) => [item.slug, item]));

export const getColumnMeta = (slug: ColumnKey) => {
	const meta = columnMap.get(slug);
	if (!meta) {
		throw new Error(`Unknown column slug: ${slug}`);
	}
	return meta;
};
