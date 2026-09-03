import { ArrowLeft, BrainCircuit, Clock3, Lightbulb, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { OriginalMarkdown } from '../components/OriginalMarkdown';
import { getArticleByRoute, getModuleById } from '../data/aipm-content';

function withoutFirstHeading(content: string) {
  return content.replace(/^#\s+.+\n?/, '').trim();
}

export function AipmArticlePage() {
  const params = useParams();
  const module = getModuleById(params.moduleId);
  const article = getArticleByRoute(params.moduleId, params['*']);

  if (!module || !article) {
    return (
      <main className="aipm-empty section-shell">
        <span>文章不存在</span>
        <h1>没有找到这篇内容</h1>
        <p>它可能已经移动，返回 AI 产品求职区重新选择即可。</p>
        <Link className="button button--primary" to="/aipm">返回 AI 产品求职区</Link>
      </main>
    );
  }

  const isBasics = module.id === '01-ai-basics';

  return (
    <main className="aipm-reading">
      <article className="aipm-reading__article section-shell">
        <Link className="aipm-back-link" to={`/aipm/${module.id}`}>
          <ArrowLeft size={16} />返回{module.name}
        </Link>

        <header className="aipm-reading__header">
          <div className="aipm-reading__crumb">{module.index} {module.name}<span>/</span>{article.groupName}</div>
          <h1>{article.title}</h1>
          <div className="aipm-reading__meta"><Clock3 size={15} />约 {article.duration} 分钟读完</div>
        </header>

        {isBasics ? (
          <>
            <section className="aipm-memory-layer" aria-labelledby="remember-title">
              <div className="aipm-reading__section-title">
                <span><BrainCircuit size={19} /></span>
                <div><small>先建立记忆点</small><h2 id="remember-title">必须记住</h2></div>
              </div>
              <div className="aipm-memory-layer__answer">
                <span>一句话结论</span>
                <p>{article.summary}</p>
              </div>
              <div className="aipm-memory-layer__method">
                <Sparkles size={17} />
                <div><strong>记忆方法</strong><p>先把标题变成问题，再试着只用上面这句话回答。能脱口而出，再继续看完整原理。</p></div>
              </div>
            </section>

            <section className="aipm-deep-layer" aria-labelledby="deep-title">
              <div className="aipm-reading__section-title">
                <span><Lightbulb size={19} /></span>
                <div><small>原理、例子与应用</small><h2 id="deep-title">想深入再看</h2></div>
              </div>
              <OriginalMarkdown content={withoutFirstHeading(article.content)} />
            </section>
          </>
        ) : (
          <>
            <section className="aipm-conclusion-card">
              <span>先说结论</span>
              <p>{article.summary}</p>
            </section>
            <section className="aipm-deep-layer" aria-labelledby="full-content-title">
              <div className="aipm-reading__section-title">
                <span><BookTextIcon /></span>
                <div><small>按原有逻辑完整阅读</small><h2 id="full-content-title">完整内容</h2></div>
              </div>
              <OriginalMarkdown content={withoutFirstHeading(article.content)} />
            </section>
          </>
        )}
      </article>
    </main>
  );
}

function BookTextIcon() {
  return <Lightbulb size={19} />;
}
