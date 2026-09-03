import { describe, expect, it } from 'vitest';
import {
  aipmModules,
  getArticleByRoute,
  getModuleById,
} from './aipm-content';

describe('AI 产品求职区内容索引', () => {
  it('严格使用六个一级内容板块', () => {
    expect(aipmModules.map((item) => item.id)).toEqual([
      '00-roadmap',
      '01-ai-basics',
      '02-pm-skills',
      '03-case-studies',
      '04-interview',
      '05-resources',
    ]);
  });

  it('每个板块都有来自内容快照的文章且文章 id 不重复', () => {
    const articles = aipmModules.flatMap((item) => item.articles);

    expect(aipmModules.every((item) => item.articles.length > 0)).toBe(true);
    expect(articles.length).toBeGreaterThan(100);
    expect(new Set(articles.map((article) => article.id)).size).toBe(articles.length);
    expect(articles.every((article) => article.content.length > 100)).toBe(true);
  });

  it('能按模块和文章路径找到真实文章', () => {
    const basics = getModuleById('01-ai-basics');
    const article = getArticleByRoute('01-ai-basics', 'llm/how-llm-works');

    expect(basics?.name).toBe('AI 基础知识');
    expect(article?.title).toContain('大模型');
    expect(article?.content).toContain('预测下一个');
  });

  it('索引中不再出现旧十类能力地图', () => {
    const moduleNames = aipmModules.map((item) => item.name).join('');

    expect(moduleNames).not.toContain('个人表达与岗位动机');
    expect(moduleNames).not.toContain('RAG与企业知识库');
    expect(moduleNames).not.toContain('Prompt与AI交互设计');
  });
});
