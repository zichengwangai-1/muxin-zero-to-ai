import { ArrowLeft, ArrowUpRight, BookOpenText } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getPracticeModule } from '../data/practice-content';
import { PromptLibrary } from '../components/PromptLibrary';
import { promptCategories, promptCount } from '../data/prompt-library';
import { getPracticeTutorials } from '../data/practice-tutorials';
import { ImagePromptLibrary, imagePromptCount } from '../components/ImagePromptLibrary';
import { getManagedEntries } from '../data/managed-content';
import { ManagedContentList } from '../components/ManagedPracticeContent';

export function PracticeModulePage() {
  const { moduleId } = useParams();
  const module = getPracticeModule(moduleId);
  const tutorials = getPracticeTutorials(moduleId);
  const managed = getManagedEntries(moduleId);
  if (!module) return (
    <main className="aipm-empty section-shell">
      <span>内容不存在</span><h1>没有找到这个内容板块</h1>
      <p>返回教学区重新选择一个方向。</p>
      <Link className="button button--primary" to="/practice">返回 AI 实战教学区</Link>
    </main>
  );
  return (
    <main className="aipm-catalog practice-catalog">
      <section className="aipm-catalog__hero section-shell">
        <Link className="aipm-back-link" to="/practice"><ArrowLeft size={16} />返回 AI 实战教学区</Link>
        <div className="aipm-catalog__title">
          <span>{module.index}</span><div><p>AI 实战教学区</p><h1>{module.name}</h1></div>
        </div>
        <p className="aipm-catalog__lead">{module.description}</p>
        <div className="aipm-catalog__meta"><span><BookOpenText size={15} />{managed.length ? `${managed.length + (module.id === 'image' ? imagePromptCount : module.id === 'prompts' ? promptCount : tutorials.length)} 个案例 · 完整 Prompt · 操作步骤` : module.id === 'image' ? `${imagePromptCount} 个精选案例 · 成品图 · 一键复制` : module.id === 'prompts' ? `${promptCategories.length} 个分类 · ${promptCount} 个 Prompt · 一键复制` : tutorials.length ? `${tutorials.length} 篇教程 · 完整 Prompt · 操作步骤` : '内容准备中'}</span></div>
      </section>
      <ManagedContentList entries={managed} />
      {module.id === 'image' ? <ImagePromptLibrary /> : module.id === 'prompts' ? <PromptLibrary /> : tutorials.length ? <section className="practice-catalog__content section-shell" aria-label="实战教程列表">
        <p className="tutorial-note">从一个作品开始，查看准备材料、操作步骤和中文改编 Prompt。教程来源为 2026 年 7 月起的内容，本站版本尚未实测。</p>
        <div className="aipm-article-list">{tutorials.map((tutorial, index) => <Link key={tutorial.id} className="aipm-article-link" to={`/practice/${module.id}/${tutorial.id}`}>
          <span className="aipm-article-link__index">{String(index + 1).padStart(2, '0')}</span>
          <div><h3>{tutorial.title}</h3><p>{tutorial.summary}</p><small>{tutorial.level} · {tutorial.tools.join(' / ')} · {tutorial.date}</small></div><ArrowUpRight size={18} />
        </Link>)}</div>
      </section> : managed.length ? null : <section className="practice-catalog__content section-shell" aria-labelledby="practice-empty-title">
        <div className="practice-empty">
          <BookOpenText size={28} aria-hidden="true" />
          <h2 id="practice-empty-title">教程正在整理，后续更新</h2>
          <p>这里将分享操作步骤、实用 Prompt 与配套素材。</p>
          <Link className="aipm-back-link" to="/practice"><ArrowLeft size={16} />浏览其他模块</Link>
        </div>
      </section>}
    </main>
  );
}
