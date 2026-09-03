import { ArrowLeft, Building2, ChevronDown, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OriginalMarkdown } from '../components/OriginalMarkdown';
import {
  loadCompanyInterviewLibrary,
  type CompanyInterviewEntry,
  type CompanyInterviewGroup,
} from '../data/company-interviews';

function CompanyInterviewCard({ entry, index }: { entry: CompanyInterviewEntry; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`company-interview-card ${open ? 'is-open' : ''}`}>
      <button
        className="company-interview-card__toggle"
        type="button"
        aria-expanded={open}
        aria-label={`查看${entry.company} ${entry.position} ${entry.round}原文：${entry.title}`}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="company-interview-card__number">面经 {String(index + 1).padStart(2, '0')}</span>
        <span className="company-interview-card__title">
          <strong>{entry.company}</strong>
          <small>{entry.position} · {entry.round}</small>
        </span>
        <ChevronDown size={19} aria-hidden="true" />
      </button>
      {open && (
        <div className="company-interview-card__content">
          <dl className="company-interview-card__facts">
            <div><dt>公司</dt><dd>公司：{entry.company}</dd></div>
            <div><dt>岗位</dt><dd>岗位：{entry.position}</dd></div>
            <div><dt>面试轮次</dt><dd>轮次：{entry.round}</dd></div>
          </dl>
          <section className="company-interview-card__original" aria-label="原文内容">
            <span>原文内容</span>
            <OriginalMarkdown content={entry.content} />
          </section>
          {(entry.author || entry.sourceUrl) && (
            <footer className="company-interview-card__source">
              {entry.author && <span>原作者：{entry.author}</span>}
              {entry.sourceUrl && (
                <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                  查看原链接 <ExternalLink size={13} />
                </a>
              )}
            </footer>
          )}
        </div>
      )}
    </article>
  );
}

export function CompanyInterviewLibraryPage() {
  const [groups, setGroups] = useState<CompanyInterviewGroup[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('');

  useEffect(() => {
    let active = true;
    loadCompanyInterviewLibrary().then((loadedGroups) => {
      if (!active) return;
      setGroups(loadedGroups);
      setSelectedCompany(loadedGroups[0]?.company ?? '');
    });
    return () => { active = false; };
  }, []);

  const activeGroup = groups.find((group) => group.company === selectedCompany) ?? groups[0];

  return (
    <main className="company-library-page">
      <section className="company-library-page__hero section-shell">
        <Link className="aipm-back-link" to="/aipm/04-interview"><ArrowLeft size={16} />返回面试题库</Link>
        <div className="company-library-page__title">
          <span><Building2 size={22} /></span>
          <div><p>04 面试题库</p><h1>公司面经库</h1></div>
        </div>
        <p>按公司查看真实面试记录。页面只保留岗位、轮次、有效原文和真实存在的来源。</p>
      </section>

      <section className="company-library section-shell">
        {groups.length === 0 ? (
          <div className="source-loading">正在整理公司面经…</div>
        ) : (
          <>
            <div className="company-library__filters" aria-label="公司筛选">
              {groups.map((group) => (
                <button
                  className={group.company === activeGroup?.company ? 'is-active' : ''}
                  key={group.company}
                  type="button"
                  aria-pressed={group.company === activeGroup?.company}
                  onClick={() => setSelectedCompany(group.company)}
                >
                  <span>{group.company}</span><small>{group.entries.length}</small>
                </button>
              ))}
            </div>

            {activeGroup && (
              <div className="company-library__result">
                <div className="company-library__result-heading">
                  <strong>{activeGroup.company}</strong>
                  <span>{activeGroup.entries.length} 份有效内容</span>
                </div>
                <div className="company-interview-list">
                  {activeGroup.entries.map((entry, index) => (
                    <CompanyInterviewCard entry={entry} index={index} key={entry.id} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
