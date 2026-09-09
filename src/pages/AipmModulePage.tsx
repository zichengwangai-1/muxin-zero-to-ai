import { ArrowLeft, ArrowRight, BookOpenText, Clock3 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { articlesByGroup, getModuleById } from '../data/aipm-content';

export function AipmModulePage() {
  const { moduleId } = useParams();
  const module = getModuleById(moduleId);

  if (!module) {
    return (
      <main className="aipm-empty section-shell">
        <span>内容不存在</span>
        <h1>没有找到这个内容板块</h1>
        <p>它可能已经移动，返回内容目录重新选择即可。</p>
        <Link className="button button--primary" to="/aipm">返回 AI 产品求职区</Link>
      </main>
    );
  }

  const groups = articlesByGroup(module);

  return (
    <main className="aipm-catalog">
      <section className="aipm-catalog__hero section-shell">
        <Link className="aipm-back-link" to="/aipm"><ArrowLeft size={16} />内容目录</Link>
        <div className="aipm-catalog__title">
          <span>{module.index}</span>
          <div>
            <p>AI 产品求职区</p>
            <h1>{module.name}</h1>
          </div>
        </div>
        <p className="aipm-catalog__lead">{module.description}</p>
        <div className="aipm-catalog__meta">
          <span><BookOpenText size={15} />{module.articles.length} 篇完整内容</span>
          <span>完成后：{module.outcome}</span>
        </div>
      </section>

      <section className="aipm-catalog__content section-shell">
        <nav className="aipm-catalog__nav" aria-label={`${module.name}目录`}>
          <span>本页目录</span>
          {groups.map((group, index) => (
            <a href={`#group-${group.id}`} key={group.id}>
              <i>{String(index + 1).padStart(2, '0')}</i>{group.name}
            </a>
          ))}
        </nav>

        <div className="aipm-catalog__groups">
          {module.id === '04-interview' && (
            <Link className="company-library-entry" to="/aipm/04-interview/company-experiences">
              <span><BookOpenText size={20} /></span>
              <div><small>真实面试记录</small><h2>公司面经库</h2><p>按公司、岗位和面试轮次查看你收集的 44 份有效原文。</p></div>
              <ArrowRight size={19} />
            </Link>
          )}
          {groups.map((group, groupIndex) => (
            <section className="aipm-article-group" id={`group-${group.id}`} key={group.id}>
              <header>
                <span>{String(groupIndex + 1).padStart(2, '0')}</span>
                <div><h2>{group.name}</h2><p>{group.articles.length} 篇</p></div>
              </header>
              <div className="aipm-article-list">
                {group.articles.map((article, articleIndex) => (
                  <Link
                    className="aipm-article-link"
                    data-testid="aipm-article-link"
                    key={article.id}
                    to={`/aipm/${article.moduleId}/${article.articlePath}`}
                  >
                    <span className="aipm-article-link__index">{String(articleIndex + 1).padStart(2, '0')}</span>
                    <div>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                      <small><Clock3 size={13} />约 {article.duration} 分钟</small>
                    </div>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
