import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  Building2,
  Check,
  ChevronDown,
  CircleAlert,
  Crosshair,
  ExternalLink,
  Library,
  MessageCircleQuestion,
  Search,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { OriginalMarkdown } from '../components/OriginalMarkdown';
import {
  loadCompanyInterviewLibrary,
  type CompanyInterviewEntry,
  type CompanyInterviewGroup,
} from '../data/company-interviews';
import {
  loadInterviewCaseQuestions,
  type InterviewCaseQuestion,
} from '../data/interview-cases';
import {
  interviewCategories,
  interviewSources,
  type InterviewCategoryId,
} from '../data/interview';

function CompanyInterviewCard({ entry }: { entry: CompanyInterviewEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`company-interview-card ${open ? 'is-open' : ''}`}>
      <button
        className="company-interview-card__toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="company-interview-card__platform">{entry.platform}</span>
        <span className="company-interview-card__title">
          <strong>{entry.title}</strong>
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

function CompanyInterviewLibraryView({ groups }: { groups: CompanyInterviewGroup[] }) {
  const [selectedCompany, setSelectedCompany] = useState(groups[0]?.company ?? '');
  const activeGroup = groups.find((group) => group.company === selectedCompany) ?? groups[0];

  useEffect(() => {
    if (!groups.some((group) => group.company === selectedCompany)) {
      setSelectedCompany(groups[0]?.company ?? '');
    }
  }, [groups, selectedCompany]);

  if (!activeGroup) return <div className="source-loading">正在整理公司面经…</div>;

  return (
    <div className="company-library">
      <header className="company-library__intro">
        <div className="content-heading">
          <Building2 size={18} />
          <div><span>真实面试记录</span><h3>按公司查看真实面经</h3></div>
        </div>
        <p>选公司，再看岗位和轮次。未提及公司的内容统一放在“通用面经与求职经验”。</p>
      </header>
      <div className="company-library__filters" aria-label="公司筛选">
        {groups.map((group) => (
          <button
            className={group.company === activeGroup.company ? 'is-active' : ''}
            key={group.company}
            type="button"
            aria-pressed={group.company === activeGroup.company}
            onClick={() => setSelectedCompany(group.company)}
          >
            <span>{group.company}</span><small>{group.entries.length}</small>
          </button>
        ))}
      </div>
      <div className="company-library__result">
        <div className="company-library__result-heading">
          <strong>{activeGroup.company}</strong>
          <span>{activeGroup.entries.length}份内容</span>
        </div>
        <div className="company-interview-list">
          {activeGroup.entries.map((entry) => <CompanyInterviewCard entry={entry} key={entry.id} />)}
        </div>
      </div>
    </div>
  );
}

function QuestionCaseCard({ question, number }: { question: InterviewCaseQuestion; number: number }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`interview-source ${open ? 'is-open' : ''}`}>
      <button
        className="interview-source__toggle"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="case-question__index">Q{String(number).padStart(2, '0')}</span>
        <span className="interview-source__title">
          <strong>{question.title}</strong>
          <small>{question.focus}</small>
        </span>
        <span className="case-question__count">{question.cases.length}个案例</span>
        <ChevronDown size={19} aria-hidden="true" />
      </button>
      {open && (
        <div className="interview-source__content">
          <section className="professional-answer" aria-label={`${question.title}的专业标准答案`}>
            <div className="answer-focus">
              <div className="answer-block__title"><Crosshair size={16} /><strong>面试官在考什么</strong></div>
              <p>{question.answer.examinerFocus}</p>
            </div>

            <div className="answer-summary">
              <span>30秒先说结论</span>
              <p>{question.answer.shortAnswer}</p>
            </div>

            <div className="answer-deep-dive">
              <div className="answer-block__title"><BrainCircuit size={16} /><strong>2分钟完整回答</strong></div>
              <ol>
                {question.answer.deepDive.map((item, index) => (
                  <li key={item.label}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><strong>{item.label}</strong><p>{item.detail}</p></div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="answer-memory">
              <Sparkles size={16} />
              <div><strong>记忆钩子</strong><p>{question.answer.memoryHook}</p></div>
            </div>

            <div className="answer-review-grid">
              <section>
                <div className="answer-block__title"><MessageCircleQuestion size={16} /><strong>面试官可能追问</strong></div>
                <ul>{question.answer.followUps.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
              <section className="answer-pitfalls">
                <div className="answer-block__title"><TriangleAlert size={16} /><strong>容易失分的说法</strong></div>
                <ul>{question.answer.pitfalls.map((item) => <li key={item}>{item}</li>)}</ul>
              </section>
            </div>

            <div className="answer-references">
              <span>内容校准依据</span>
              {question.answer.references.map((item) => (
                <a href={item.url} target="_blank" rel="noreferrer" key={item.url}>
                  {item.label}<ExternalLink size={12} />
                </a>
              ))}
            </div>
          </section>

          <div className="source-reading-note">
            <span><Library size={14} />下面是面经原始案例</span>
            <p>用于补充真实表达；平台元信息已剔除，未经核验的数据请勿直接照搬。</p>
          </div>
          {question.cases.map((item, index) => (
            <section className="case-excerpt" key={item.sourceId}>
              <header className="case-excerpt__header">
                <strong>真实案例 {String(index + 1).padStart(2, '0')}</strong>
                <div className="case-excerpt__badges">
                  <span>原文摘录 · 未经核验</span>
                  <span>{item.platform}面经</span>
                </div>
              </header>
              {item.note && <div className="source-caution"><CircleAlert size={16} />{item.note}</div>}
              <OriginalMarkdown content={item.content} />
              <aside className="beginner-breakdown">
                <header><Sparkles size={17} /><div><span>小白解释</span><strong>木辛帮你讲人话</strong></div></header>
                <p className="beginner-breakdown__summary">{item.beginnerExplanation.summary}</p>
                <section className="beginner-breakdown__logic">
                  <strong>这段回答是怎么组织的？</strong>
                  <ol>{item.beginnerExplanation.logic.map((step) => <li key={step}>{step}</li>)}</ol>
                </section>
                {item.beginnerExplanation.glossary.length > 0 && (
                  <section className="beginner-breakdown__glossary">
                    <strong>先把这些词弄懂</strong>
                    <dl>
                      {item.beginnerExplanation.glossary.map((item) => (
                        <div key={item.term}><dt>{item.term}</dt><dd>{item.meaning}</dd></div>
                      ))}
                    </dl>
                  </section>
                )}
                <section className="beginner-breakdown__caution">
                  <strong>别直接照搬</strong>
                  {item.beginnerExplanation.cautions.map((caution) => <p key={caution}>{caution}</p>)}
                </section>
              </aside>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}

export function AipmInterviewPage() {
  const [selectedId, setSelectedId] = useState<InterviewCategoryId>('personal');
  const [query, setQuery] = useState('');
  const [libraryView, setLibraryView] = useState<'questions' | 'companies'>('questions');
  const [caseQuestions, setCaseQuestions] = useState<InterviewCaseQuestion[]>([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [companyGroups, setCompanyGroups] = useState<CompanyInterviewGroup[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const category = interviewCategories.find((item) => item.id === selectedId) ?? interviewCategories[0];

  useEffect(() => {
    let active = true;
    setCasesLoading(true);
    loadInterviewCaseQuestions(selectedId).then((questions) => {
      if (!active) return;
      setCaseQuestions(questions);
      setCasesLoading(false);
    });
    return () => { active = false; };
  }, [selectedId]);

  useEffect(() => {
    if (libraryView !== 'companies' || companyGroups.length > 0) return;
    let active = true;
    setCompaniesLoading(true);
    loadCompanyInterviewLibrary().then((groups) => {
      if (!active) return;
      setCompanyGroups(groups);
      setCompaniesLoading(false);
    });
    return () => { active = false; };
  }, [companyGroups.length, libraryView]);

  const filteredQuestions = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return caseQuestions;
    return caseQuestions.filter((question) =>
      `${question.title}${question.focus}${question.cases.map((item) => item.content).join('')}`
        .toLowerCase()
        .includes(keyword),
    );
  }, [caseQuestions, query]);

  return (
    <main className="interview-hub">
      <section className="interview-hero section-shell">
        <div className="interview-hero__copy">
          <span className="section-kicker">AI产品求职区 · 面试知识库</span>
          <h1 aria-label="AI产品经理面试，从会看变成会答">AI产品经理面试，<br />从会看变成会答</h1>
          <p>按真实面试问题学习。先记住回答骨架，再展开原始笔记理解案例，不用在几十篇内容里反复找重点。</p>
          <div className="interview-hero__meta" aria-label="内容规模">
            <span><strong>10</strong>类核心问题</span>
            <span><strong>{interviewSources.length}</strong>份原始内容</span>
            <span><strong>1</strong>套记忆方法</span>
          </div>
        </div>
        <aside className="interview-hero__method">
          <div className="method-orbit" aria-hidden="true"><BrainCircuit size={28} /></div>
          <span>这里怎么学</span>
          <ol>
            <li><i>1</i><div><strong>先看高频题</strong><small>知道面试官在考什么</small></div></li>
            <li><i>2</i><div><strong>再记回答骨架</strong><small>用口诀建立提取线索</small></div></li>
            <li><i>3</i><div><strong>最后看案例</strong><small>补充真实回答与表达细节</small></div></li>
          </ol>
        </aside>
      </section>

      <section className="interview-workspace section-shell">
        <aside className="interview-track" aria-label="面试问题分类">
          <div className="interview-track__intro"><span>能力地图</span><strong>选择一类开始</strong></div>
          <div className="interview-track__list">
            {interviewCategories.map((item) => (
              <button
                className={`interview-category ${item.id === selectedId ? 'is-active' : ''}`}
                data-testid="interview-category"
                key={item.id}
                type="button"
                aria-pressed={item.id === selectedId}
                onClick={() => { setSelectedId(item.id); setQuery(''); }}
              >
                <span>{item.index}</span>
                <strong>{item.title}</strong>
                <ArrowRight size={15} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="interview-track__tags">
            <small>内容可再按产品类型理解</small>
            <div><span>Agent</span><span>知识库</span><span>对话</span><span>生图</span><span>硬件</span></div>
          </div>
        </aside>

        <div className="interview-main">
          <header className={`category-hero category-hero--${category.tone}`}>
            <div className="category-hero__top">
              <span>{category.index} / 10</span>
              <span>{category.shortTitle}</span>
            </div>
            <h2>{category.title}</h2>
            <p>{category.summary}</p>
          </header>

          <div className="category-primer">
            <section className="frequent-questions">
              <div className="content-heading"><BookOpenText size={18} /><div><span>先知道考什么</span><h3>高频问题</h3></div></div>
              <ul>{category.questions.map((question) => <li key={question}><span>Q</span>{question}</li>)}</ul>
            </section>
            <aside className={`memory-card memory-card--${category.tone}`}>
              <div className="content-heading"><BrainCircuit size={18} /><div><span>大师记忆法</span><h3>先记住这几个字</h3></div></div>
              <strong className="memory-card__mnemonic">{category.mnemonic}</strong>
              <p className="memory-card__meaning">{category.mnemonicMeaning}</p>
              <div className="memory-card__method"><Sparkles size={15} /><p>{category.memoryMethod}</p></div>
            </aside>
          </div>

          <section className="answer-framework">
            <div className="content-heading"><Check size={18} /><div><span>面试时照着说</span><h3>回答骨架</h3></div></div>
            <ol>{category.answerStructure.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
          </section>

          <section className="source-library" aria-labelledby="source-title">
            <div className="source-library__heading">
              <div className="content-heading"><Library size={18} /><div><span>按问题归类</span><h3 id="source-title">面经真实案例面</h3></div></div>
              <div className="source-library__tabs" role="group" aria-label="面经浏览方式">
                <button
                  className={libraryView === 'questions' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={libraryView === 'questions'}
                  onClick={() => setLibraryView('questions')}
                >按问题练习</button>
                <button
                  className={libraryView === 'companies' ? 'is-active' : ''}
                  type="button"
                  aria-pressed={libraryView === 'companies'}
                  onClick={() => setLibraryView('companies')}
                >公司面经库</button>
              </div>
            </div>
            {libraryView === 'questions' ? (
              <>
                <p className="source-library__lead">每张卡片就是一道面试题。展开后可以对照不同面经中的有效回答，不再需要先理解博主原标题。</p>
                <label className="source-search">
                  <Search size={17} />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="搜索真实面试问题"
                  />
                </label>
                <div className="interview-source-list">
                  {casesLoading && <div className="source-loading">正在整理真实面试问题…</div>}
                  {!casesLoading && filteredQuestions.map((question, index) => (
                    <QuestionCaseCard key={question.id} question={question} number={index + 1} />
                  ))}
                  {!casesLoading && filteredQuestions.length === 0 && <div className="source-empty">没有找到相关问题，试试更短的关键词。</div>}
                </div>
              </>
            ) : (
              companiesLoading
                ? <div className="source-loading">正在整理公司面经…</div>
                : <CompanyInterviewLibraryView groups={companyGroups} />
            )}
          </section>

          <section className="prep-center">
            <div><span className="section-kicker">面试备战中心</span><h2>知识学完，还要把它变成你的表达</h2></div>
            <div className="prep-center__steps">
              {['整理项目证据', '写成3分钟表达', '模拟连续追问', '建立个人错题本'].map((step, index) => (
                <span key={step}><i>0{index + 1}</i>{step}</span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
