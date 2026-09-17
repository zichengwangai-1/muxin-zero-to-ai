import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { promptCategories, type PromptEntry } from '../data/prompt-library';

function PromptCard({ entry }: { entry: PromptEntry }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.prompt);
      setStatus('copied');
    } catch { setStatus('error'); }
  }
  return (
    <article className="prompt-card" id={entry.id}>
      <header><h3>{entry.title}</h3></header>
      <p>{entry.description}</p>
      {entry.tips && <div className="prompt-card__tips"><strong>使用要点</strong><p>{entry.tips}</p></div>}
      <details>
        <summary>查看完整 Prompt</summary>
        <div className="prompt-code">
          <div className="prompt-code__toolbar">
            <button className="prompt-copy" type="button" onClick={copy} aria-label={`复制 ${entry.title} Prompt`}>
              {status === 'copied' ? <Check size={16} /> : <Copy size={16} />} {status === 'copied' ? '已复制' : '复制 Prompt'}
            </button>
          </div>
          <pre tabIndex={0}>{entry.prompt}</pre>
          <span className="prompt-feedback" role="status">{status === 'error' ? '复制未成功，请手动选择下方提示词正文复制。' : status === 'copied' ? '已复制完整提示词，可粘贴到 AI 对话中使用。' : ''}</span>
        </div>
      </details>
    </article>
  );
}

export function PromptLibrary() {
  return (
    <section className="prompt-library section-shell" aria-label="Prompt 分类与内容">
      <nav className="prompt-nav" aria-label="Prompt 分类">
        <p>按你想解决的问题选择</p>
        {promptCategories.map(category => <a key={category.id} href={`#${category.id}`}>{category.name}<span>{category.entries.length}</span></a>)}
      </nav>
      <div className="prompt-library__content">
        <div className="prompt-intro">先选一个场景，复制提示词，把【括号里的内容】换成你的实际情况，再发送给 AI。</div>
        {promptCategories.map(category => <section className="prompt-category" id={category.id} key={category.id} aria-labelledby={`${category.id}-title`}>
          <h2 id={`${category.id}-title`}>{category.name}<span>{category.entries.length} 个 Prompt</span></h2>
          {category.entries.map(entry => <PromptCard entry={entry} key={entry.id} />)}
        </section>)}
        <p className="prompt-source">首批内容来自《prompt精选》，整理于 2026-09-13。<a href="https://mp.weixin.qq.com/s/NAdhdFrUq9-BKelqzqpwBQ" target="_blank" rel="noreferrer">阅读原文</a> · <a href="https://waytoagi.feishu.cn/wiki/UbVKwWbnviXI4CkmCMncdNgJnBf" target="_blank" rel="noreferrer">WayToAGI 整理来源</a></p>
      </div>
    </section>
  );
}
