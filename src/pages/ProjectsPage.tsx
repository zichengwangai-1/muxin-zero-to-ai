import { ArrowRight, CheckCircle2, Clock3, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/content';
import { readProgress } from '../lib/progress';

export function ProjectsPage() {
  return (
    <main className="projects-page section-shell">
      <section className="page-hero projects-hero">
        <span className="section-kicker">AI产品经理项目实战</span>
        <h1>做完项目，再把你的判断讲清楚</h1>
        <p>这里不是照抄一份标准答案。你会从用户问题开始，完成产品方案、原型、评测与作品集，让面试官看到你真正做过什么。</p>
      </section>

      <div className="project-path-note">
        <span>建议顺序</span>
        <strong>先跟做项目 01</strong>
        <i />
        <strong>再独立完成项目 02</strong>
        <p>每完成一步，页面会自动记住进度。</p>
      </div>

      <section className="project-gallery" aria-label="项目列表">
        {projects.map((project, index) => {
          const completed = readProgress(project.id).length;
          const percent = Math.round((completed / project.steps.length) * 100);
          return (
            <Link className={`project-card project-card--${project.accent}`} to={`/projects/${project.id}`} key={project.id}>
              <div className="project-card__top">
                <span className="project-card__index">0{index + 1}</span>
                <span className="project-card__type">{project.eyebrow}</span>
                <ArrowRight size={20} />
              </div>
              <div className="project-card__main">
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
                <div className="project-card__meta">
                  <span><Clock3 size={14} />{project.duration}</span>
                  <span><Layers3 size={14} />{project.steps.length}个步骤</span>
                  <span><CheckCircle2 size={14} />{project.outputs.length}份成果</span>
                </div>
              </div>
              <div className="project-card__footer">
                <div>
                  <span>你的进度</span>
                  <strong>{completed}/{project.steps.length}</strong>
                </div>
                <div className="project-card__progress" aria-label={`已完成${percent}%`}><i style={{ width: `${percent}%` }} /></div>
                <span>{percent}%</span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
