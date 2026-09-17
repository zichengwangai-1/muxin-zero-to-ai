import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Search, X, ZoomIn } from 'lucide-react';
import rawCollection from '../content/practice/image/精选案例.json';
import { legacyVisible } from '../data/content-visibility';
import './ImagePromptLibrary.css';
const collection = { ...rawCollection, entries: rawCollection.entries.filter(entry => legacyVisible('image', entry.id)) };

type Entry = typeof collection.entries[number];

function ImageCard({ entry, onPreview }: { entry: Entry; onPreview: (entry: Entry) => void }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.prompt);
      setCopied(true); setError(false);
    } catch { setError(true); setCopied(false); }
  }
  return <article className="image-prompt-card" id={`image-case-${entry.id}`}>
    <button className="image-prompt-card__picture" onClick={() => onPreview(entry)} aria-label={`放大图片：${entry.title}`}>
      <img src={entry.image} alt={entry.title} loading="lazy" width={entry.width} height={entry.height} />
      <span><ZoomIn size={15} />查看大图</span>
    </button>
    <div className="image-prompt-card__body">
      <div className="image-prompt-card__eyebrow">{entry.category} <span>#{entry.id}</span></div>
      <h3>{entry.title}</h3>
      <p className="image-prompt-card__description">{entry.description}</p>
      <div className="image-prompt-card__tags"><span>GPT Image 2</span><span>{entry.reference ? '需上传参考图' : '文字生成图片'}</span></div>
      <details className="image-prompt-card__instructions"><summary>使用方法</summary><ol>
        <li>打开支持图片生成的 AI 工具，选择相应模型。{entry.reference ? '先上传自己的参考照片。' : ''}</li>
        <li>{entry.instructions}</li>
        <li>复制下方完整提示词，发送生成；检查文字、构图和细节，再提出具体修改要求。</li>
      </ol></details>
      <div className="image-prompt-card__prompt">
        <div className="image-prompt-card__toolbar"><strong>完整 Prompt</strong><button type="button" onClick={copy} aria-label={`复制 ${entry.title} Prompt`}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? '已复制' : '复制'}</button></div>
        <pre tabIndex={0}>{entry.prompt}</pre>
        <span role="status">{error ? '复制失败，请选择提示词正文手动复制。' : copied ? '完整提示词已复制。' : ''}</span>
      </div>
      <footer><a href={entry.sourceUrl} target="_blank" rel="noreferrer">{entry.sourceLabel} ↗</a><a href={entry.githubUrl} target="_blank" rel="noreferrer">仓库案例 ↗</a></footer>
    </div>
  </article>;
}

export const imagePromptCount = collection.entries.length;

export function ImagePromptLibrary() {
  const [category, setCategory] = useState('全部');
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(12);
  const [preview, setPreview] = useState<Entry | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const categories = [...new Set(collection.entries.map(entry => entry.category))];
  const filtered = collection.entries.filter(entry => (category === '全部' || entry.category === category) && `${entry.title} ${entry.category} ${entry.description} ${entry.prompt}`.toLowerCase().includes(query.trim().toLowerCase()));
  useEffect(() => {
    if (!preview) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal(); document.body.style.overflow = 'hidden';
    return () => { element?.close(); document.body.style.overflow = previousOverflow; };
  }, [preview]);
  return <section className="image-library section-shell" aria-label="图片创作案例库">
    <div className="image-library__intro"><span>看见效果，再动手创作</span><p>选一张喜欢的作品，替换提示词中的主题，做出自己的版本。</p></div>
    <label className="image-library__search"><Search size={20} /><input type="search" aria-label="搜索图片案例" placeholder="搜索案例、风格或 Prompt…" value={query} onChange={event => { setQuery(event.target.value); setLimit(12); }} />{query && <button aria-label="清空搜索" onClick={() => { setQuery(''); setLimit(12); }}><X size={18} /></button>}</label>
    <nav className="image-library__categories" aria-label="图片案例分类">{['全部', ...categories].map(name => <button key={name} aria-pressed={category === name} onClick={() => { setCategory(name); setLimit(12); }}><strong>{name}</strong><span>{name === '全部' ? collection.entries.length : collection.entries.filter(entry => entry.category === name).length} 个案例</span></button>)}</nav>
    <div className="image-library__heading"><h2>{category === '全部' ? '精选图片案例' : category}</h2><span aria-live="polite">{filtered.length} 个案例</span></div>
    {filtered.length ? <div className="image-library__grid">{filtered.slice(0, limit).map(entry => <ImageCard key={entry.id} entry={entry} onPreview={setPreview} />)}</div> : <div className="image-library__empty"><h3>没有找到相关案例</h3><p>换个关键词，或查看全部分类。</p><button onClick={() => { setCategory('全部'); setQuery(''); setLimit(12); }}>查看全部案例</button></div>}
    {filtered.length > 0 && <div className="image-library__more"><p>已显示 {Math.min(limit, filtered.length)} / {filtered.length}</p>{limit < filtered.length && <button onClick={() => setLimit(value => value + 12)}>加载更多 · 剩余 {filtered.length - limit} 个</button>}</div>}
    <p className="image-library__source">图片与提示词整理自 <a href={collection.repository} target="_blank" rel="noreferrer">awesome-gpt-image-2</a>，各案例保留原始来源。使用说明由本站整理，尚未逐例复刻；生成效果会随模型、参数及参考图变化。</p>
    {preview && <dialog className="image-library__dialog" ref={dialog} aria-labelledby="image-preview-title" onCancel={() => setPreview(null)} onClick={event => { if (event.target === event.currentTarget) setPreview(null); }}>
      <div className="image-library__dialog-heading"><h2 id="image-preview-title">{preview.title}</h2><button autoFocus aria-label="关闭大图" onClick={() => setPreview(null)}><X /></button></div><img src={preview.image} alt={preview.title} /><p>仓库案例 #{preview.id} · {preview.sourceLabel}</p>
    </dialog>}
  </section>;
}
