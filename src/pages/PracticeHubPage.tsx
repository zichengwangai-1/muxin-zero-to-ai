import { ArrowUpRight, Clapperboard, Code2, FileText, Gamepad2, Image, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { practiceModules } from '../data/practice-content';
import { promptCount } from '../data/prompt-library';
import { getPracticeTutorials } from '../data/practice-tutorials';
import { getManagedEntries } from '../data/managed-content';
import { imagePromptCount } from '../components/ImagePromptLibrary';

const icons = { prompts: Sparkles, image: Image, video: Clapperboard, office: FileText, development: Code2, games: Gamepad2 };

export function PracticeHubPage() {
  return (
    <main className="aipm-hub">
      <section className="aipm-hub__hero section-shell">
        <div>
          <span className="section-kicker">木辛 · 零基础把 AI 用起来</span>
          <h1>AI 实战教学区</h1>
          <p>从一个真实任务开始，用 Prompt 和操作方法，把想法变成作品。</p>
        </div>
        <aside className="aipm-hub__summary" aria-label="内容说明">
          <span>按创作目标选择</span>
          <strong>六个方向</strong>
          <p>从高频 Prompt 到图片、视频、办公与开发，教程正在陆续整理。</p>
        </aside>
      </section>
      <section className="aipm-module-section section-shell" aria-labelledby="practice-modules-title">
        <header className="aipm-module-section__heading">
          <div><span>六个内容板块</span><h2 id="practice-modules-title">从你想完成的任务开始</h2></div>
          <p>选择一个方向，查看实用 Prompt 与分步教程。</p>
        </header>
        <div className="aipm-module-cards">
          {practiceModules.map((module) => {
            const Icon = icons[module.id];
            const tutorialCount = getPracticeTutorials(module.id).length;
            const total = getManagedEntries(module.id).length + (module.id === 'prompts' ? promptCount : module.id === 'image' ? imagePromptCount : tutorialCount);
            return (
              <Link className={`aipm-module-card aipm-module-card--${module.index}`} key={module.id} to={`/practice/${module.id}`}>
                <div className="aipm-module-card__top">
                  <span className="aipm-module-card__icon"><Icon size={23} /></span>
                  <span className="aipm-module-card__count">{total ? `${total} 个案例 · 含 Prompt` : '内容准备中'}</span>
                </div>
                <div className="aipm-module-card__body">
                  <span>{module.index}</span><h3>{module.index} {module.name}</h3><p>{module.description}</p>
                </div>
                <div className="aipm-module-card__footer"><span>查看模块</span><ArrowUpRight size={18} /></div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
