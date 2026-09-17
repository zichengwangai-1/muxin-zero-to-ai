import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Copy } from 'lucide-react';
import { safeUrl, type ManagedEntry } from '../lib/cms-format.mjs';
import { OriginalMarkdown } from './OriginalMarkdown';
import './ManagedPracticeContent.css';

export function ManagedContentList({ entries }: { entries: ManagedEntry[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('全部');
  if (!entries.length) return null;
  const filtered = entries.filter(entry => (category === '全部' || entry.category === category) && `${entry.title} ${entry.summary} ${entry.prompt}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section className="managed-library section-shell" aria-label="新增实战教程">
    <header><h2>实战教程与案例</h2><input type="search" aria-label="搜索新增教程" placeholder="搜索任务、关键词或 Prompt" value={query} onChange={event => setQuery(event.target.value)} /></header>
    <nav aria-label="新增教程分类">{['全部', ...new Set(entries.map(entry => entry.category))].map(name => <button key={name} aria-pressed={name === category} onClick={() => setCategory(name)}>{name}</button>)}</nav>
    <div className="managed-grid">{filtered.map(entry => <Link className="managed-card" key={entry.id} to={`/practice/${entry.module}/${entry.id}`}>
      {entry.cover && <img src={safeUrl(entry.cover)} alt={entry.title} loading="lazy" />}
      <div><small>{entry.category}{entry.tools && ` · ${entry.tools}`}</small><h3>{entry.title}</h3><p>{entry.summary}</p><span>查看步骤与完整 Prompt →</span></div>
    </Link>)}</div>
    {!filtered.length && <p>没有找到相关教程，试试其他关键词。</p>}
  </section>;
}

export function ManagedContentDetail({ entry }: { entry: ManagedEntry }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try { await navigator.clipboard.writeText(entry.prompt); setStatus('已复制完整 Prompt'); }
    catch { setStatus('复制失败，请手动选择正文复制'); }
  }
  const sections = [['准备材料', entry.prepare], ['操作步骤', entry.steps], ['检查结果', entry.checks]];
  return <div className="managed-detail">
    <header className="aipm-reading__header"><small>{entry.category}{entry.tools && ` · ${entry.tools}`}</small><h1>{entry.title}</h1><p>{entry.summary}</p><span>{entry.tested || '尚未实测'}</span></header>
    {entry.cover && <a href={safeUrl(entry.cover)} target="_blank" rel="noreferrer"><img className="managed-result" src={safeUrl(entry.cover)} alt={`${entry.title}成品示例`} /></a>}
    {entry.result && <section className="aipm-conclusion-card"><span>你将做出什么</span><p>{entry.result}</p></section>}
    {entry.reference && <p>参考图要求：{entry.reference}</p>}
    {entry.attachments.length > 0 && <section className="tutorial-section"><h2>练习材料与附件</h2><ul>{entry.attachments.map((attachment, i) => <li key={i}><a href={safeUrl(attachment.file)} target="_blank" rel="noreferrer">{attachment.label} ↗</a></li>)}</ul></section>}
    {sections.map(([title, content]) => content && <section className="tutorial-section" key={title}><h2>{title}</h2><OriginalMarkdown content={content} resolveLink={href => safeUrl(href) || '#'} resolveImage={href => safeUrl(href) || undefined} /></section>)}
    <section className="tutorial-section prompt-card"><h2>完整 Prompt</h2><div className="prompt-code"><div className="prompt-code__toolbar"><button className="prompt-copy" onClick={copy} aria-label="复制完整 Prompt">{status.startsWith('已复制') ? <Check size={16} /> : <Copy size={16} />}复制 Prompt</button></div><pre tabIndex={0}>{entry.prompt}</pre><span role="status">{status}</span></div></section>
    {entry.body && <section className="tutorial-section"><h2>补充说明</h2><OriginalMarkdown content={entry.body} resolveLink={href => safeUrl(href) || '#'} resolveImage={href => safeUrl(href) || undefined} /></section>}
    {entry.video && <p><a href={safeUrl(entry.video)} target="_blank" rel="noreferrer">查看配套视频 ↗</a></p>}
    {(entry.author || entry.date || entry.source) && <section className="tutorial-section"><h2>内容来源</h2><p>{entry.author}{entry.date && ` · 来源日期：${entry.date}`}</p>{entry.source && <a href={safeUrl(entry.source)} target="_blank" rel="noreferrer">阅读原始来源 ↗</a>}</section>}
  </div>;
}
