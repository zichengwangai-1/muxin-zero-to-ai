import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleAlert,
  Library,
  Search,
  Sparkles,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { OriginalMarkdown } from '../components/OriginalMarkdown';
import {
  interviewCategories,
  interviewSources,
  sourcesForCategory,
  type InterviewCategoryId,
  type InterviewSource,
} from '../data/interview';

function SourceCard({ source }: { source: InterviewSource }) {
  const [open, setOpen] = useState(false);
  const [original, setOriginal] = useState('');
  const [loadError, setLoadError] = useState('');

  async function toggleSource() {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (!nextOpen || original) return;
    try {
      setOriginal(await source.loadOriginal());
    } catch {
      setLoadError('原文暂时无法加载，请刷新页面后重试。');
    }
  }

  return (
    <article className={`interview-source ${open ? 'is-open' : ''}`}>
      <button
        className="interview-source__toggle"
        type="button"
        aria-expanded={open}
        onClick={toggleSource}
      >
        <span className="source-platform">{source.platform}</span>
        <span className="interview-source__title">
          <strong>{source.title}</strong>
          <small>{source.preview}</small>
        </span>
        <ChevronDown size={19} aria-hidden="true" />
      </button>
      {open && (
        <div className="interview-source__content">
          <div className="source-reading-note">
            <span><Sparkles size={14} />原文重点</span>
            <p>蓝色标记是原作者强调的重点。数字、观点和经验仍需结合实际岗位判断。</p>
          </div>
          {source.note && <div className="source-caution"><CircleAlert size={16} />{source.note}</div>}
          {!original && !loadError && <div className="source-loading">正在打开完整原文…</div>}
          {loadError && <div className="source-caution"><CircleAlert size={16} />{loadError}</div>}
          {original && <OriginalMarkdown content={original} />}
        </div>
      )}
    </article>
  );
}

export function AipmInterviewPage() {
  const [selectedId, setSelectedId] = useState<InterviewCategoryId>('personal');
  const [query, setQuery] = useState('');
  const category = interviewCategories.find((item) => item.id === selectedId) ?? interviewCategories[0];
  const categorySources = useMemo(() => {
    const sources = sourcesForCategory(selectedId);
    const keyword = query.trim().toLowerCase();
    if (!keyword) return sources;
    return sources.filter((source) => `${source.title}${source.preview}`.toLowerCase().includes(keyword));
  }, [query, selectedId]);

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
            <li><i>3</i><div><strong>最后读原文</strong><small>补充案例与表达细节</small></div></li>
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
              <div className="content-heading"><Library size={18} /><div><span>尽量完整保留</span><h3 id="source-title">原始笔记与面经</h3></div></div>
              <span>{categorySources.length}份相关内容</span>
            </div>
            <p className="source-library__lead">建议先复述上面的回答骨架，再展开原文。原作者的重点会保留标记，存疑内容会单独提醒。</p>
            <label className="source-search">
              <Search size={17} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="在本类原始笔记中搜索"
              />
            </label>
            <div className="interview-source-list">
              {categorySources.map((source) => <SourceCard key={source.id} source={source} />)}
              {categorySources.length === 0 && <div className="source-empty">没有找到相关原文，试试更短的关键词。</div>}
            </div>
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
