import { ArrowRight, BrainCircuit, FileText, Presentation, Table2, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NeedCard } from '../components/NeedCard';
import { contentItems, needEntries, projects } from '../data/content';

const officePicks = contentItems.filter((item) => item.category === 'office').slice(0, 3);

export function HomePage() {
  return (
    <main>
      <section className="hero section-shell">
        <div className="hero__copy">
          <div className="hero__author"><span aria-hidden="true">木</span><p>作者：木辛</p></div>
          <h1 aria-label="几周内学好AI，而不是几个月">几周内学好AI，<br />而不是几个月</h1>
          <p className="hero__lead">即使零基础用户，也能在这里提升职场竞争力</p>
          <div className="hero-principles" aria-label="网站学习特点">
            <div className="principle-card principle-card--blue">
              <span className="principle-card__icon"><Target size={20} /></span>
              <div><strong>以目标导向</strong><small>先选结果，再学习</small></div>
            </div>
            <div className="principle-card principle-card--violet">
              <span className="principle-card__icon"><BrainCircuit size={20} /></span>
              <div><strong>大师记忆法</strong><small>理解、复述、马上应用</small></div>
            </div>
          </div>
          <div className="hero__actions">
            <Link className="button button--primary" to="/learn">查看全部学习内容<ArrowRight size={17} /></Link>
            <Link className="button button--quiet" to="/projects">查看两个实战项目</Link>
          </div>
        </div>

        <div className="path-cabin" aria-label="学习路径：学会、做出、说清">
          <div className="path-cabin__header">
            <span>你的学习路径</span>
            <span className="path-cabin__live"><i /> 3个可验证结果</span>
          </div>
          <div className="path-stage path-stage--active">
            <span className="path-stage__number">01</span>
            <div><strong>学会</strong><p>用简单例子理解方法</p></div>
            <span className="path-stage__status">从这里开始</span>
          </div>
          <div className="path-connector"><span /></div>
          <div className="path-stage">
            <span className="path-stage__number">02</span>
            <div><strong>做出</strong><p>完成模板或AI项目</p></div>
            <span className="path-stage__status">留下成果</span>
          </div>
          <div className="path-connector"><span /></div>
          <div className="path-stage">
            <span className="path-stage__number">03</span>
            <div><strong>说清</strong><p>讲明白你的判断</p></div>
            <span className="path-stage__status">用于面试</span>
          </div>
          <div className="path-cabin__note">今天建议：先完成一个25分钟的办公任务</div>
        </div>
      </section>

      <section className="needs-section section-shell" aria-labelledby="needs-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">按你的当前需求开始</span>
            <h2 id="needs-title">不用测评，直接选一件想完成的事</h2>
          </div>
          <p>每个入口都会告诉你要花多久、最后能得到什么。</p>
        </div>
        <div className="needs-grid">{needEntries.map((entry) => <NeedCard entry={entry} key={entry.id} />)}</div>
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
