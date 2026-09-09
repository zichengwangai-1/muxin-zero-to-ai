import { ArrowRight, ArrowUpRight, BadgeDollarSign, BrainCircuit, BriefcaseBusiness, Rocket, Route, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aipmModules } from '../data/aipm-content';

const learningModules = [
  {
    title: 'AI产品求职区',
    description: '从看懂AI产品，到能讲项目、答面试，围绕求职结果学习。',
    items: ['技术知识学习', '面试训练', '论文解读', '模型动态'],
    href: '/aipm',
    icon: BriefcaseBusiness,
    tone: 'violet',
    action: '开始准备AI产品求职',
  },
  {
    title: 'AI实战教学区',
    description: '',
    items: [],
    href: null,
    icon: Rocket,
    tone: 'blue',
    action: '努力开发中',
  },
] as const;

export function HomePage() {
  return (
    <main>
      <section className="hero section-shell">
        <div className="hero__copy">
          <div className="hero__author"><span aria-hidden="true">木</span><p>作者：木辛</p></div>
          <div className="hero-title-lockup">
            <h1 aria-label="几周内学好AI，而不是几个月">几周内学好AI，<br />而不是几个月</h1>
            <div className="learn-by-doing-mark" aria-label="干中学，Learn by doing">
              <span aria-hidden="true">DO</span>
              <strong>干中学</strong>
              <small>LEARN BY DOING</small>
            </div>
          </div>
          <p className="hero__lead">即使零基础用户，也能在这里提升职场竞争力</p>
          <div className="hero-principles" aria-label="网站学习特点">
            <div className="principle-card principle-card--blue" data-testid="feature-card">
              <span className="principle-card__icon"><Target size={22} /></span>
              <div className="feature-card__content"><strong>以目标导向</strong><small>避免100个小时的AI大模型专业课，不如学30%的关键内容。</small></div>
            </div>
            <div className="principle-card principle-card--violet" data-testid="feature-card">
              <span className="principle-card__icon"><BrainCircuit size={22} /></span>
              <div className="feature-card__content"><strong>大师记忆法</strong><small>学了记不住？用记忆大师方法帮你记忆。</small></div>
            </div>
          </div>
          <div className="time-value-card" aria-label="时间价值" data-testid="feature-card">
            <span className="time-value-card__mark" aria-hidden="true">
              <BadgeDollarSign size={25} />
            </span>
            <div className="time-value-card__copy feature-card__content">
              <span>TIME = MONEY</span>
              <h2>省下80%的资料收集时间</h2>
              <p>从筛选、收集到面试，只留下真正需要学的内容。</p>
            </div>
          </div>
        </div>

        <div className="outcome-panel" aria-label="网站可以帮助你实现的三个目标">
          <div className="outcome-panel__header">
            <div><span>你来这里，可以为了</span><strong>把AI变成真实结果</strong></div>
            <span className="outcome-panel__count"><i />3个方向</span>
          </div>
          <div className="outcome-list">
            <article className="outcome-item outcome-item--dark">
              <span className="outcome-item__icon"><BriefcaseBusiness size={22} /></span>
              <div><h2>提升职场竞争力</h2><p>用AI处理真实办公任务，提升效率与表达。</p></div>
              <span className="outcome-item__index">01</span>
            </article>
            <article className="outcome-item outcome-item--violet">
              <span className="outcome-item__icon"><Route size={22} /></span>
              <div><h2>转行AI类岗位</h2><p>学习产品知识，完成项目、作品集与面试准备。</p></div>
              <span className="outcome-item__index">02</span>
            </article>
            <article className="outcome-item outcome-item--orange">
              <span className="outcome-item__icon"><Rocket size={22} /></span>
              <div><h2>做AI副业</h2><p>做出AI内容、小工具和可交付成果。</p></div>
              <span className="outcome-item__index">03</span>
            </article>
          </div>
          <div className="outcome-panel__footer"><span>从一个目标开始</span><strong>边学边做，留下成果</strong></div>
        </div>
      </section>

      <section className="needs-section section-shell" aria-labelledby="needs-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">按你的当前需求开始</span>
            <h2 id="needs-title">帮你省时省力的达成目的</h2>
          </div>
          <p>只保留两条清晰路径：为求职做准备，或把AI真正用起来。</p>
        </div>
        <div className="learning-module-grid">
          {learningModules.map((module) => {
            const Icon = module.icon;
            const content = (
              <>
                <div className="learning-module__top">
                  <span className="learning-module__icon"><Icon size={24} /></span>
                  {module.href && <ArrowUpRight className="learning-module__arrow" size={21} />}
                </div>
                <div className="learning-module__body">
                  <h3>{module.title}</h3>
                  {module.description && <p>{module.description}</p>}
                  {module.items.length > 0 && (
                    <ul aria-label={`${module.title}包含内容`}>
                      {module.items.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </div>
                <div className="learning-module__footer">
                  <span>{module.action}</span>
                  {module.href && <ArrowRight size={17} />}
                </div>
              </>
            );
            return module.href ? (
              <Link
                className={`learning-module learning-module--${module.tone}`}
                data-testid="learning-module"
                key={module.title}
                to={module.href}
              >
                {content}
              </Link>
            ) : (
              <article
                className={`learning-module learning-module--${module.tone} learning-module--coming-soon`}
                data-testid="learning-module"
                key={module.title}
              >
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="value-proof section-shell" aria-labelledby="value-proof-title">
        <div className="value-proof__copy">
          <span className="section-kicker">把时间用在真正有结果的地方</span>
          <h2 id="value-proof-title">省下80%的资料搜集时间</h2>
          <p>不用在几十个平台之间反复筛选。这里先按求职目标整理内容，再告诉你哪些必须会、哪些可以以后再学。</p>
          <div className="value-proof__logic" aria-label="目标导向学习方法">
            <div><i>01</i><span><strong>先确定目的</strong><small>面试、转行或完成真实项目</small></span></div>
            <div><i>02</i><span><strong>只学关键内容</strong><small>减少重复、过时和用不到的信息</small></span></div>
            <div><i>03</i><span><strong>转成可用结果</strong><small>能理解、能复述，也能在面试中回答</small></span></div>
          </div>
          <Link className="value-proof__action" to="/aipm">进入 AI 产品求职区 <ArrowRight size={17} /></Link>
        </div>

        <div className="home-directory" aria-label="AI产品求职区目录">
          <div className="home-directory__header">
            <div><span>AI 产品求职区</span><strong>完整学习地图</strong></div>
            <small>8个专业目录</small>
          </div>
          <div className="home-directory__list">
            {aipmModules.map((module) => (
              <Link
                data-testid="home-aipm-directory-link"
                key={module.id}
                to={`/aipm/${module.id}`}
              >
                <i>{module.index}</i>
                <span><strong>{module.name}</strong><small>{module.description}</small></span>
                <em>{module.articles.length}篇</em>
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
