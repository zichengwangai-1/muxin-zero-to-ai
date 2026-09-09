import { describe, expect, it } from 'vitest';
import {
  articlesByGroup,
  aipmModules,
  getArticleByRoute,
  getModuleById,
} from './aipm-content';

describe('AI 产品求职区内容索引', () => {
  it('在原有六个板块后增加产品体验与论文解读', () => {
    expect(aipmModules.map((item) => item.id)).toEqual([
      '00-roadmap',
      '01-ai-basics',
      '02-pm-skills',
      '03-case-studies',
      '04-interview',
      '05-resources',
      '06-product-experience',
      '07-paper-insights',
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

  it('能找到近期产品体验和近两个月论文解读', () => {
    const product = getArticleByRoute('06-product-experience', 'workflow/taku-ai');
    const paper = getArticleByRoute('07-paper-insights', 'evaluation-reliability/earlyeval');

    expect(product?.title).toContain('Taku AI');
    expect(product?.content).toContain('产品经理拆解');
    expect(paper?.title).toContain('EarlyEval');
    expect(paper?.content).toContain('对 AI 产品经理的五层启发');
    expect(paper?.content).toContain('面试参考答案');
  });

  it('论文解读收录推荐源筛选并经原文核对的 15 篇内容', () => {
    const module = getModuleById('07-paper-insights');
    const judge = getArticleByRoute(
      '07-paper-insights',
      'evaluation-reliability/llm-judge-lifecycle',
    );
    const context = getArticleByRoute(
      '07-paper-insights',
      'memory-context/context-as-environment',
    );
    const skills = getArticleByRoute(
      '07-paper-insights',
      'agent-systems/demystifying-agent-skills',
    );

    expect(module?.articles).toHaveLength(15);
    expect(judge?.content).toContain('对 AI 产品经理的五层启发');
    expect(judge?.content).toContain('推荐来源');
    expect(context?.content).toContain('面试参考答案');
    expect(skills?.content).toContain('一句话记忆');
  });

  it('索引中不再出现旧十类能力地图', () => {
    const moduleNames = aipmModules.map((item) => item.name).join('');

    expect(moduleNames).not.toContain('个人表达与岗位动机');
    expect(moduleNames).not.toContain('RAG与企业知识库');
    expect(moduleNames).not.toContain('Prompt与AI交互设计');
  });

  it('把用户收集的真实面试笔记放在 06 真实面试经验顶部', () => {
    const interview = getModuleById('04-interview');
    expect(interview).toBeDefined();

    const experienceGroup = articlesByGroup(interview!).find((group) => group.id === 'experiences');
    expect(experienceGroup?.articles.slice(0, 8).map((article) => article.title)).toEqual([
      '真实 AI 产品面试高频题：先从这份总览开始',
      '字节 AI 产品面试：项目深挖、岗位动机与产品判断',
      'Kimi 产品岗一面：项目产品化、搜索与 Memory 设计',
      'Shopee AI 产品一面：企业知识库 Agent 如何讲完整',
      'Agent 高频面试题：从真假需求到上线评测',
      'AI 产品评测面试：从评测目标到 Bad Case 闭环',
      'RAG、微调与模型选型：面试时如何做技术决策',
      'Prompt 与幻觉治理：不要把所有问题都推给提示词',
    ]);
  });

  it('真实面试笔记使用统一答题结构并剔除无关信息', () => {
    const article = getArticleByRoute('04-interview', 'experiences/00-collected-interview-overview');

    expect(article?.content).toContain('## 考察点');
    expect(article?.content).toContain('## 参考答案');
    expect(article?.content).toContain('## 小白怎么理解');
    expect(article?.content).toContain('## 追问延伸');
    expect(article?.content).toContain('## 一句话记忆');
    expect(article?.content).not.toMatch(/点赞数|图片数|Offer截图|识别图片/);
  });
});
