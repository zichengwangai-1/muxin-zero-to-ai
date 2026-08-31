import { RotateCcw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ContentCard } from '../components/ContentCard';
import { FilterBar } from '../components/FilterBar';
import { contentItems } from '../data/content';
import { filterContent, type ContentFilter } from '../lib/content';
import type { ContentCategory } from '../types/content';

const validCategories = new Set<ContentFilter>(['all', 'intro', 'office', 'aipm', 'interview']);

export function LearnPage() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('category') ?? 'all';
  const category: ContentFilter = validCategories.has(rawCategory as ContentFilter)
    ? (rawCategory as ContentFilter)
    : 'all';
  const query = params.get('q') ?? '';
  const results = filterContent(contentItems, query, category);

  function updateParams(nextCategory: ContentFilter, nextQuery: string) {
    const next = new URLSearchParams();
    if (nextCategory !== 'all') next.set('category', nextCategory);
    if (nextQuery.trim()) next.set('q', nextQuery);
    setParams(next, { replace: true });
  }

  function clearSearch() {
    updateParams(category, '');
  }

  const categoryName: Record<ContentFilter, string> = {
    all: '全部学习内容',
    intro: 'AI入门',
    office: 'AI办公提效',
    aipm: 'AI产品经理',
    interview: '作品集与面试',
  };

  return (
    <main className="directory-page section-shell">
      <header className="page-hero">
        <span className="section-kicker">统一学习目录</span>
        <h1>今天想完成什么？</h1>
        <p>不用先学完整套课程。选择一个当前任务，完成后再沿着关联内容继续。</p>
      </header>

      <FilterBar
        category={category}
        query={query}
        onCategoryChange={(next) => updateParams(next, query)}
        onQueryChange={(next) => updateParams(category, next)}
      />

      <div className="results-heading">
        <div><strong>{categoryName[category]}</strong><span>{results.length}项内容</span></div>
        <p>所有内容都标明用时和最终产出</p>
      </div>

      {results.length > 0 ? (
        <div className="content-grid">
          {results.map((item) => <ContentCard item={item} key={item.id} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state__mark">?</span>
          <h2>没有找到匹配内容</h2>
          <p>试试更短的关键词，例如“会议”“RAG”或“面试”。</p>
          <button className="button button--quiet" type="button" onClick={clearSearch}>
            <RotateCcw size={16} /> 清除搜索
          </button>
        </div>
      )}
    </main>
  );
}

export const categoryIds: ContentCategory[] = ['intro', 'office', 'aipm', 'interview'];
