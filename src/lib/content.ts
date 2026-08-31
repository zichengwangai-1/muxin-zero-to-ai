import type { ContentCategory, ContentItem } from '../types/content';

export type ContentFilter = ContentCategory | 'all';

export function filterContent(
  items: ContentItem[],
  query: string,
  category: ContentFilter,
): ContentItem[] {
  const normalized = query.trim().toLocaleLowerCase('zh-CN');

  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    if (!matchesCategory) return false;
    if (!normalized) return true;

    const haystack = [item.title, item.summary, item.output, ...item.tags]
      .join(' ')
      .toLocaleLowerCase('zh-CN');
    return haystack.includes(normalized);
  });
}
