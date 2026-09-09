import { sanitizePublicCopy } from '../utils/public-copy';

export type AipmModuleId =
  | '00-roadmap'
  | '01-ai-basics'
  | '02-pm-skills'
  | '03-case-studies'
  | '04-interview'
  | '05-resources'
  | '06-product-experience'
  | '07-paper-insights';

export interface AipmArticle {
  id: string;
  moduleId: AipmModuleId;
  articlePath: string;
  groupId: string;
  groupName: string;
  title: string;
  summary: string;
  duration: number;
  content: string;
}

export interface AipmModule {
  id: AipmModuleId;
  index: string;
  name: string;
  description: string;
  outcome: string;
  groupOrder: string[];
  articles: AipmArticle[];
}

type ModuleDefinition = Omit<AipmModule, 'articles'>;

const moduleDefinitions: ModuleDefinition[] = [
  {
    id: '00-roadmap',
    index: '00',
    name: '学习路线',
    description: '先看岗位需要什么，再决定自己应该学什么。',
    outcome: '选出适合自己的入门与转行路线',
    groupOrder: ['核心内容'],
  },
  {
    id: '01-ai-basics',
    index: '01',
    name: 'AI 基础知识',
    description: '用产品经理能听懂、也能讲清楚的方式补齐技术基础。',
    outcome: '听懂技术讨论，也能回答基础面试题',
    groupOrder: ['machine-learning', 'llm', 'prompt-engineering', '核心内容'],
  },
  {
    id: '02-pm-skills',
    index: '02',
    name: 'AI 产品经理核心技能',
    description: '学习 PRD、评测、数据、成本和产品上线的实际方法。',
    outcome: '能把 AI 能力变成可落地的产品方案',
    groupOrder: ['prd-and-design', 'model-evaluation', 'data-annotation', 'cost-and-tech', 'ai-product-operations', 'vibe-coding'],
  },
  {
    id: '03-case-studies',
    index: '03',
    name: 'AI 应用案例拆解',
    description: '通过真实产品理解需求、功能、商业模式与设计取舍。',
    outcome: '建立产品感，并积累面试案例',
    groupOrder: ['chatbot-assistant', 'aigc', 'search-and-rec', 'vertical'],
  },
  {
    id: '04-interview',
    index: '04',
    name: '面试题库',
    description: '把知识转成能在面试中说清楚的答案和项目证据。',
    outcome: '知道面试官在考什么，并形成回答框架',
    groupOrder: ['basics', 'product-design', 'case-analysis', 'behavioral', 'preparation', 'experiences'],
  },
  {
    id: '05-resources',
    index: '05',
    name: '资源导航',
    description: '按目标选择书籍、课程、文章与常用工具。',
    outcome: '少走弯路，只补充当前真正需要的材料',
    groupOrder: ['核心内容'],
  },
  {
    id: '06-product-experience',
    index: '06',
    name: '产品体验',
    description: '体验近期上线的小团队 AI 产品，既讲亮点，也讲问题和改进思路。',
    outcome: '积累有观点、有证据的产品体验案例',
    groupOrder: ['workflow', 'developer-tools', 'content-creation', 'vertical-ai'],
  },
  {
    id: '07-paper-insights',
    index: '07',
    name: '论文解读',
    description: '只看近两个月值得产品经理关注的论文，把研究结论变成产品判断。',
    outcome: '能讲清论文发现，并提出自己的产品思考',
    groupOrder: ['evaluation-reliability', 'memory-context', 'agent-systems'],
  },
];

const groupNames: Record<string, string> = {
  '核心内容': '核心内容',
  'machine-learning': '机器学习基础',
  llm: '大模型基础',
  'prompt-engineering': 'Prompt 与上下文',
  'prd-and-design': 'AI PRD 与产品设计',
  'model-evaluation': '模型评测',
  'data-annotation': '数据标注与合规',
  'cost-and-tech': '模型选型、成本与商业化',
  'ai-product-operations': 'AI 产品运营与上线',
  'vibe-coding': 'Vibe Coding',
  'chatbot-assistant': '对话与助手',
  aigc: 'AIGC 与开发工具',
  'search-and-rec': '搜索与推荐',
  vertical: '垂直行业',
  basics: 'AI 基础概念题',
  'product-design': 'AI 产品与系统设计题',
  'case-analysis': '商业分析与估算题',
  behavioral: '行为面试与项目表达',
  preparation: '求职准备',
  experiences: '真实面试经验',
  workflow: '效率与个人工作流',
  'developer-tools': 'AI 开发与产品工具',
  'content-creation': '内容与创作工具',
  'vertical-ai': '垂直场景产品',
  'evaluation-reliability': '评测与可靠性',
  'memory-context': '记忆与上下文',
  'agent-systems': 'Agent 系统设计',
};

const rawArticles = import.meta.glob('../content/aipm/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const contentAssets = import.meta.glob('../content/aipm/**/*.{png,jpg,jpeg,webp}', {
  query: '?url',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function stripMarkdown(value: string) {
  return sanitizePublicCopy(value)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#|]/g, '')
    .replace(/\bAIPM-Wiki\b/g, '本站')
    .replace(/本仓库/g, '本站')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(content: string, fallback: string) {
  const heading = content.match(/^#\s+(.+)$/m)?.[1];
  return stripMarkdown(heading ?? fallback);
}

function extractSummary(content: string) {
  const preferredSection = content.match(
    /^##\s+(?:一句话说清|一句话总结|参考答案|核心结论)[^\n]*\n+([\s\S]*?)(?=\n##\s|$)/m,
  )?.[1];
  const source = preferredSection ?? content.replace(/^#\s+.+$/m, '');
  const paragraph = source
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .find((item) => (
      item.length > 20
      && !item.startsWith('#')
      && !item.startsWith('|')
      && !item.startsWith('![')
      && !/^\*\*(?:难度|出现频率|分类|体验时间)/.test(item)
    ));
  const summary = stripMarkdown(paragraph ?? '打开文章查看完整内容。');
  return summary.length > 116 ? `${summary.slice(0, 116)}…` : summary;
}

function toArticle(sourcePath: string, content: string): AipmArticle | null {
  const relativePath = sourcePath.split('/content/aipm/')[1];
  if (!relativePath || relativePath.endsWith('/README.md')) return null;
  const segments = relativePath.split('/');
  const moduleId = segments[0] as AipmModuleId;
  if (!moduleDefinitions.some((item) => item.id === moduleId)) return null;

  const filename = segments.at(-1)?.replace(/\.md$/, '') ?? '';
  const articlePath = segments.slice(1).join('/').replace(/\.md$/, '');
  const groupId = segments.length > 2 ? segments[1] : '核心内容';
  const publicContent = sanitizePublicCopy(content);

  return {
    id: `${moduleId}/${articlePath}`,
    moduleId,
    articlePath,
    groupId,
    groupName: groupNames[groupId] ?? groupId,
    title: extractTitle(publicContent, filename),
    summary: extractSummary(publicContent),
    duration: Math.max(4, Math.ceil(stripMarkdown(publicContent).length / 420)),
    content: publicContent,
  };
}

const indexedArticles = Object.entries(rawArticles)
  .map(([sourcePath, content]) => toArticle(sourcePath, content))
  .filter((article): article is AipmArticle => article !== null)
  .sort((a, b) => {
    if (a.moduleId !== b.moduleId) return a.moduleId.localeCompare(b.moduleId);
    return a.articlePath.localeCompare(b.articlePath, 'zh-CN');
  });

export const aipmModules: AipmModule[] = moduleDefinitions.map((definition) => ({
  ...definition,
  articles: indexedArticles.filter((article) => article.moduleId === definition.id),
}));

export function getModuleById(id?: string) {
  return aipmModules.find((module) => module.id === id);
}

export function getArticleByRoute(moduleId?: string, articlePath?: string) {
  if (!moduleId || !articlePath) return undefined;
  const decodedPath = articlePath.split('/').map(decodeURIComponent).join('/');
  return indexedArticles.find((article) => (
    article.moduleId === moduleId && article.articlePath === decodedPath
  ));
}

export function getContentAssetUrl(moduleId: string, articlePath: string, href: string) {
  const segments = `${moduleId}/${articlePath}`.split('/');
  segments.pop();
  href.split('/').forEach((segment) => {
    if (!segment || segment === '.') return;
    if (segment === '..') segments.pop();
    else segments.push(segment);
  });
  return contentAssets[`../content/aipm/${segments.join('/')}`];
}

export function articlesByGroup(module: AipmModule) {
  const groups = new Map<string, AipmArticle[]>();
  module.articles.forEach((article) => {
    const entries = groups.get(article.groupId) ?? [];
    entries.push(article);
    groups.set(article.groupId, entries);
  });

  return [...groups.entries()]
    .sort(([groupA], [groupB]) => {
      const indexA = module.groupOrder.indexOf(groupA);
      const indexB = module.groupOrder.indexOf(groupB);
      return (indexA < 0 ? 99 : indexA) - (indexB < 0 ? 99 : indexB);
    })
    .map(([id, articles]) => ({
      id,
      name: groupNames[id] ?? id,
      articles,
    }));
}
