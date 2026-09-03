import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  FolderKanban,
  Library,
  Map,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { aipmModules, type AipmModuleId } from '../data/aipm-content';

const moduleIcons: Record<AipmModuleId, ComponentType<{ size?: number }>> = {
  '00-roadmap': Map,
  '01-ai-basics': BrainCircuit,
  '02-pm-skills': BriefcaseBusiness,
  '03-case-studies': FolderKanban,
  '04-interview': BookOpen,
  '05-resources': Library,
};

export function AipmHubPage() {
  const articleCount = aipmModules.reduce((total, module) => total + module.articles.length, 0);

  return (
    <main className="aipm-hub">
      <section className="aipm-hub__hero section-shell">
        <div>
          <span className="section-kicker">木辛 · 零基础转行 AI 产品经理</span>
          <h1>AI 产品求职区</h1>
          <p>不用先做测评。按你的当前需求，直接选择一个板块开始学。</p>
        </div>
        <aside className="aipm-hub__summary" aria-label="内容说明">
          <span>完整学习内容</span>
          <strong>{articleCount} 篇</strong>
          <p>从学习路线、技术基础，到产品实操、案例和面试准备。</p>
        </aside>
      </section>

      <section className="aipm-module-section section-shell" aria-labelledby="aipm-modules-title">
        <header className="aipm-module-section__heading">
          <div>
            <span>六个内容板块</span>
            <h2 id="aipm-modules-title">从你最需要的地方开始</h2>
          </div>
          <p>每个知识点只放在一个主目录中，避免重复学习。</p>
        </header>

        <div className="aipm-module-cards">
          {aipmModules.map((module) => {
            const Icon = moduleIcons[module.id];
            return (
              <Link
                className={`aipm-module-card aipm-module-card--${module.index}`}
                data-testid="aipm-module-card"
                key={module.id}
                to={`/aipm/${module.id}`}
              >
                <div className="aipm-module-card__top">
                  <span className="aipm-module-card__icon"><Icon size={23} /></span>
                  <span className="aipm-module-card__count">{module.articles.length} 篇</span>
                </div>
                <div className="aipm-module-card__body">
                  <span>{module.index}</span>
                  <h3>{module.index} {module.name}</h3>
                  <p>{module.description}</p>
                </div>
                <div className="aipm-module-card__footer">
                  <span>{module.outcome}</span>
                  <ArrowUpRight size={18} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
