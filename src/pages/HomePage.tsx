import { ArrowRight, ArrowUpRight, BrainCircuit, BriefcaseBusiness, FileText, Presentation, Rocket, Route, Table2, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contentItems, projects } from '../data/content';

const officePicks = contentItems.filter((item) => item.category === 'office').slice(0, 3);

const learningModules = [
  {
    title: 'AI产品求职区',
    description: '从看懂AI产品，到能讲项目、答面试，围绕求职结果学习。',
    items: ['技术知识学习', '面试训练', '论文解读', '模型动态'],
    href: '/learn?category=aipm',
    icon: BriefcaseBusiness,
    tone: 'violet',
    action: '开始准备AI产品求职',
  },
  {
    title: 'AI实战教学区',
    description: '不只看教程，跟着步骤做出能直接使用的AI成果。',
    items: ['办公效率提升', '网站制作', '必备prompt'],
    href: '/learn?category=office',
    icon: Rocket,
    tone: 'blue',
    action: '开始动手做项目',
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
            <div className="principle-card principle-card--blue">
              <span className="principle-card__icon"><Target size={22} /></span>
              <div><strong>以目标导向</strong><small>避免100个小时的AI大模型专业课，不如学30%的关键内容。</small></div>
            </div>
            <div className="principle-card principle-card--violet">
              <span className="principle-card__icon"><BrainCircuit size={22} /></span>
              <div><strong>大师记忆法</strong><small>学了记不住？用记忆大师方法帮你记忆。</small></div>
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
            return (
              <Link
                className={`learning-module learning-module--${module.tone}`}
                data-testid="learning-module"
                key={module.title}
                to={module.href}
              >
                <div className="learning-module__top">
                  <span className="learning-module__icon"><Icon size={24} /></span>
                  <ArrowUpRight className="learning-module__arrow" size={21} />
                </div>
                <div className="learning-module__body">
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <ul aria-label={`${module.title}包含内容`}>
                    {module.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="learning-module__footer">
                  <span>{module.action}</span>
                  <ArrowRight size={17} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="showcase-section section-shell">
        <div className="section-heading section-heading--compact">
          <div><span className="section-kicker">先让AI真的帮上忙</span><h2>从日常办公中最常见的任务开始</h2></div>
          <Link className="text-link" to="/learn?category=office">查看12个办公任务 <ArrowRight size={16} /></Link>
        </div>
        <div className="office-grid">
          {officePicks.map((item, index) => {
            const icons = [FileText, Table2, Presentation];
            const Icon = icons[index];
            return (
              <Link className="office-card" to={`/content/${item.id}`} key={item.id}>
                <div className={`office-card__icon accent-${item.accent}`}><Icon size={23} /></div>
                <div className="office-card__body"><span>{item.duration} · {item.level}</span><h3>{item.title}</h3><p>{item.summary}</p></div>
                <div className="office-card__output"><small>你会得到</small><strong>{item.output}</strong></div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="project-section section-shell" aria-labelledby="projects-title">
        <div className="project-section__intro">
          <span className="section-kicker">想转行AI产品经理</span>
          <h2 id="projects-title">不只说“我学过”，而是拿出真正做过的项目</h2>
          <p>两个项目从用户问题开始，完整走到评测、作品集和面试表达。第一个跟着做，第二个由你做关键决策。</p>
          <Link className="button button--light" to="/projects">查看项目路径 <ArrowRight size={17} /></Link>
        </div>
        <div className="project-stack">
          {projects.map((project, index) => (
            <Link className="project-preview" to={`/projects/${project.id}`} key={project.id}>
              <div className="project-preview__index">0{index + 1}</div>
              <div className="project-preview__content">
                <span>{project.eyebrow}</span><h3>{project.title}</h3><p>{project.summary}</p>
                <div className="tag-row">{project.skills.slice(0, 3).map((skill) => <i key={skill}>{skill}</i>)}</div>
              </div>
              <ArrowRight className="project-preview__arrow" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="closing-cta section-shell">
        <div><span className="section-kicker">今天只做一件事</span><h2>选一个25分钟任务，得到第一个可复用成果</h2></div>
        <Link className="button button--primary" to="/learn?category=office">现在开始 <ArrowRight size={17} /></Link>
      </section>
    </main>
  );
}
