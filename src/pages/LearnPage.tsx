import { ArrowLeft, ArrowRight, BookOpenText, FolderOpen, Search } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { aipmModules } from '../data/aipm-content';

function containsKeyword(source: string, keyword: string) {
  const normalizedSource = source.toLocaleLowerCase('zh-CN');
  return keyword
    .toLocaleLowerCase('zh-CN')
    .split(/\s+/)
    .filter(Boolean)
    .every((part) => normalizedSource.includes(part));
}

function articleRelevance(
  article: { title: string; summary: string; groupName: string },
  keyword: string,
) {
  const query = keyword.toLocaleLowerCase('zh-CN');
  const title = article.title.toLocaleLowerCase('zh-CN');
  if (title === query || title.includes(`什么是 ${query}`) || title.includes(`${query}是什么`)) return 0;
  if (title.startsWith(query)) return 1;
  if (containsKeyword(article.title, keyword)) return 2;
  if (containsKeyword(`${article.groupName} ${article.summary}`, keyword)) return 3;
  return 4;
}

export function LearnPage() {
  const [params] = useSearchParams();
  const query = params.get('q')?.trim() ?? '';
  const moduleResults = query
    ? aipmModules.filter((module) => containsKeyword(
      `${module.name} ${module.description} ${module.outcome}`,
      query,
    ))
    : [];
  const articleResults = query
    ? aipmModules
      .flatMap((module) => module.articles)
      .filter((article) => containsKeyword(
        `${article.title} ${article.summary} ${article.groupName} ${article.content}`,
        query,
      ))
      .sort((a, b) => articleRelevance(a, query) - articleRelevance(b, query))
      .slice(0, 40)
    : [];
  const resultCount = moduleResults.length + articleResults.length;

  return (
    <main className="aipm-search-page section-shell">
      <Link className="aipm-search-page__back" to="/aipm">
        <ArrowLeft size={16} /> 返回 AI 产品求职区
      </Link>

      <header className="aipm-search-page__hero">
        <span className="section-kicker">只搜索最新的 AI 产品求职内容</span>
        <h1>AI产品求职区搜索结果</h1>
        {query ? (
          <p>关键词“{query}”找到 <strong>{resultCount}</strong> 项相关内容。</p>
        ) : (
          <p>请在页面顶部输入想了解的知识、技能或面试问题。</p>
        )}
      </header>

      {query && resultCount > 0 && (
        <div className="aipm-search-groups">
          {moduleResults.length > 0 && (
            <section className="aipm-search-results" aria-labelledby="module-results-title">
              <header>
                <span>学习入口</span>
                <h2 id="module-results-title">相关目录</h2>
                <em>{moduleResults.length}项</em>
              </header>
              <div>
                {moduleResults.map((module) => (
                  <Link className="aipm-search-result" key={module.id} to={`/aipm/${module.id}`}>
                    <span className="aipm-search-result__icon"><FolderOpen size={18} /></span>
                    <span><small>内容板块</small><strong>{module.name}</strong><p>{module.description}</p></span>
                    <em>{module.articles.length}篇</em><ArrowRight size={17} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {articleResults.length > 0 && (
            <section className="aipm-search-results" aria-labelledby="article-results-title">
              <header>
                <span>完整内容</span>
                <h2 id="article-results-title">相关文章</h2>
                <em>{articleResults.length}项</em>
              </header>
              <div>
                {articleResults.map((article) => (
                  <Link className="aipm-search-result" key={article.id} to={`/aipm/${article.moduleId}/${article.articlePath}`}>
                    <span className="aipm-search-result__icon"><BookOpenText size={18} /></span>
                    <span><small>{article.groupName}</small><strong>{article.title}</strong><p>{article.summary}</p></span>
                    <em>约{article.duration}分钟</em><ArrowRight size={17} />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {!query && (
        <div className="aipm-search-empty">
          <Search size={22} />
          <h2>输入关键词开始搜索</h2>
          <p>搜索范围包括六大专业目录及其中的完整文章。</p>
        </div>
      )}

      {query && resultCount === 0 && (
        <div className="aipm-search-empty">
          <span className="empty-state__mark">?</span>
          <h2>没有找到匹配内容</h2>
          <p>试试更短的关键词，例如“RAG”“评测”或“面试”。</p>
        </div>
      )}
    </main>
  );
}
