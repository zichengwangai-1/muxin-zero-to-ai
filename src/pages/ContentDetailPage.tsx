import { ArrowLeft, Check, Copy, Lightbulb, TriangleAlert } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { findContent } from '../data/content';

export function ContentDetailPage() {
  const { id = '' } = useParams();
  const item = findContent(id);

  if (!item) {
    return (
      <main className="not-found section-shell">
        <h1>这项内容还不存在</h1>
        <p>返回目录，选择一个已经准备好的任务。</p>
        <Link className="button button--primary" to="/learn">返回学习目录</Link>
      </main>
    );
  }

  async function copyPrompt() {
    if (item?.detail.prompt) await navigator.clipboard?.writeText(item.detail.prompt);
  }

  return (
    <main className="detail-page section-shell">
      <Link className="back-link" to="/learn"><ArrowLeft size={16} /> 返回学习目录</Link>
      <header className="detail-hero">
        <div className="detail-hero__main">
          <span className="section-kicker">{item.eyebrow}</span>
          <h1>{item.title}</h1>
          <p>{item.summary}</p>
          <div className="detail-meta">
            <span>{item.level}</span><span>{item.duration}</span><strong>完成后得到：{item.output}</strong>
          </div>
        </div>
        <aside className="plain-card">
          <small>先用一句话理解</small>
          <p>{item.detail.plain}</p>
        </aside>
      </header>

      {item.sourceStatus && <div className="source-banner"><TriangleAlert size={17} />{item.sourceStatus}。正式发布前需补充真实来源并人工审核。</div>}

      <div className="detail-layout">
        <article className="lesson-content">
          <section>
            <span className="lesson-number">01</span>
            <div><h2>为什么要学这个？</h2><p>{item.detail.why}</p></div>
          </section>
          <section>
            <span className="lesson-number">02</span>
            <div><h2>跟着这几步做</h2><ol>{item.detail.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
          </section>
          {item.detail.prompt && (
            <section>
              <span className="lesson-number">03</span>
              <div className="lesson-wide">
                <h2>可以直接使用的Prompt</h2>
                <div className="prompt-box"><pre>{item.detail.prompt}</pre><button type="button" onClick={copyPrompt}><Copy size={15} />复制</button></div>
              </div>
            </section>
          )}
          {item.detail.answer && (
            <section>
              <span className="lesson-number">答</span>
              <div><h2>参考回答</h2><blockquote>{item.detail.answer}</blockquote></div>
            </section>
          )}
          <section>
            <span className="lesson-number">检</span>
            <div><h2>怎样判断做得好不好？</h2><ul className="check-list">{item.detail.checks.map((check) => <li key={check}><Check size={16} />{check}</li>)}</ul></div>
          </section>
          <section>
            <span className="lesson-number">!</span>
            <div><h2>小白最容易踩的坑</h2><ul className="pitfall-list">{item.detail.pitfalls.map((pitfall) => <li key={pitfall}><TriangleAlert size={16} />{pitfall}</li>)}</ul></div>
          </section>
          {item.detail.followUps && (
            <section>
              <span className="lesson-number">追</span>
              <div><h2>面试官可能继续追问</h2><ul>{item.detail.followUps.map((question) => <li key={question}>{question}</li>)}</ul></div>
            </section>
          )}
        </article>

        <aside className="detail-aside">
          <div className="aside-card"><Lightbulb size={19} /><div><small>学习提示</small><p>先照着完成一次，再换成自己的真实材料。</p></div></div>
          {item.detail.relatedProjectId && <Link className="aside-project" to={`/projects/${item.detail.relatedProjectId}`}><small>关联实战项目</small><strong>把这个知识用进项目</strong><span>去看看 →</span></Link>}
        </aside>
      </div>
    </main>
  );
}
