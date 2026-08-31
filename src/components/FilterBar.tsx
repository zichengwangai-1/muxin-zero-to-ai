import { Search, X } from 'lucide-react';
import type { ContentFilter } from '../lib/content';

const filters: { id: ContentFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'intro', label: 'AI入门' },
  { id: 'office', label: '办公提效' },
  { id: 'aipm', label: 'AI产品经理' },
  { id: 'interview', label: '作品集与面试' },
];

interface FilterBarProps {
  category: ContentFilter;
  query: string;
  onCategoryChange: (category: ContentFilter) => void;
  onQueryChange: (query: string) => void;
}

export function FilterBar({ category, query, onCategoryChange, onQueryChange }: FilterBarProps) {
  return (
    <div className="filter-panel">
      <label className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          aria-label="搜索学习内容"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜索任务、知识或面试题"
        />
        {query && (
          <button type="button" aria-label="清空输入" onClick={() => onQueryChange('')}>
            <X size={15} />
          </button>
        )}
      </label>
      <div className="filter-tabs" aria-label="内容分类">
        {filters.map((filter) => (
          <button
            className={category === filter.id ? 'is-active' : ''}
            key={filter.id}
            type="button"
            onClick={() => onCategoryChange(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
