import { ArrowUpRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ContentItem } from '../types/content';

export function ContentCard({ item }: { item: ContentItem }) {
  return (
    <Link className="content-card" to={`/content/${item.id}`}>
      <div className="content-card__header">
        <span className={`content-dot accent-${item.accent}`} />
        <span>{item.eyebrow}</span>
        <ArrowUpRight size={16} />
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      {item.sourceStatus && <div className="source-status">{item.sourceStatus}</div>}
      <div className="content-card__tags">
        {item.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <div className="content-card__footer">
        <span><Clock3 size={13} /> {item.duration}</span>
        <span>得到：{item.output}</span>
      </div>
    </Link>
  );
}
