import { ArrowLeft, Check, CircleCheck, PackageCheck, RotateCcw, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findProject } from '../data/content';
import { readProgress, resetProgress, toggleStep } from '../lib/progress';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const project = findProject(id);
  const [completed, setCompleted] = useState<string[]>(() => readProgress(id));

  if (!project) {
    return (
      <main className="not-found section-shell">
        <h1>没有找到这个项目</h1>
        <p>它可能被移动了，回到项目列表重新选择吧。</p>
        <Link className="button button--primary" to="/projects">返回项目实战</Link>
      </main>
    );
  }

  const percent = Math.round((completed.length / project.steps.length) * 100);
  const reset = () => {
    resetProgress(project.id);
    setCompleted([]);
  };

  return (
    <main className="project-detail-page section-shell">
      <Link className="back-link" to="/projects"><ArrowLeft size={15} />返回项目实战</Link>

      <section className={`project-detail-hero project-detail-hero--${project.accent}`}>
        <div className="project-detail-hero__copy">
          <span>{project.eyebrow} · {project.level}</span>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
          <div className="skill-row">{project.skills.map((skill) => <i key={skill}>{skill}</i>)}</div>
        </div>
        <div className="progress-orbit" aria-label={`项目完成度${percent}%`}>
          <div className="progress-orbit__ring" style={{ background: `conic-gradient(var(--project-accent) ${percent}%, rgba(255,255,255,.12) 0)` }}>
            <div><strong>{percent}%</strong><span>已完成</span></div>
          </div>
          <p>{completed.length === 0 ? '完成第一步，留下你的第一个项目证据。' : completed.length === project.steps.length ? '项目步骤已完成，接下来整理作品集表达。' : `还剩 ${project.steps.length - completed.length} 步，继续保持。`}</p>
        </div>
      </section>

      <section className="project-outputs" aria-labelledby="outputs-title">
        <div><span className="section-kicker">最终成果</span><h2 id="outputs-title">做完后，你能拿出这些</h2></div>
        <div className="output-chips">
          {project.outputs.map((output) => <span key={output}><PackageCheck size={17} />{output}</span>)}
        </div>
      </section>

      <div className="project-workspace">
        <section className="project-steps" aria-labelledby="steps-title">
          <div className="project-steps__heading">
            <div><span className="section-kicker">跟着做</span><h2 id="steps-title">{project.steps.length}步完成项目</h2></div>
            <button type="button" onClick={reset} aria-label="重置项目进度"><RotateCcw size={14} />重置</button>
          </div>
          <div className="step-list">
            {project.steps.map((step, index) => {
              const isDone = completed.includes(step.id);
              return (
                <label className={`project-step${isDone ? ' is-done' : ''}`} key={step.id}>
                  <input
                    type="checkbox"
                    checked={isDone}
                    onChange={() => setCompleted(toggleStep(project.id, step.id))}
                    aria-label={`${step.title}：${step.deliverable}`}
                  />
                  <span className="project-step__check">{isDone ? <Check size={16} /> : index + 1}</span>
                  <span className="project-step__body">
                    <strong>{step.title}</strong>
                    <p>{step.description}</p>
                    <small><CircleCheck size={13} />本步产出：{step.deliverable}</small>
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        <aside className="project-guide">
          <section>
            <Sparkles size={18} />
            <span>小白提示</span>
            <p>先完成，再优化。第一遍不用追求完整术语，重点是保留你做判断的过程和证据。</p>
          </section>
          <section>
            <span>作品集需要呈现</span>
            <ul>{project.portfolio.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul>
          </section>
          <section className="project-guide__dark">
            <span>面试官可能会问</span>
            <ol>{project.interview.map((item) => <li key={item}>{item}</li>)}</ol>
          </section>
        </aside>
      </div>
    </main>
  );
}
