# AI 产品求职区六大板块重建 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 删除旧十类面试能力地图，把 `/aipm` 重建为六个内容板块，并让用户可进入真实目录与完整文章阅读。

**Architecture:** 将参考仓库的六个知识目录作为只读 Markdown 内容快照放入 `src/content/aipm`，用一个集中式内容索引解析路径、标题和摘要。页面拆为六模块首页、模块目录、文章详情和公司面经库四层；已有公司面经清洗逻辑保留但不再与旧十类目录耦合。

**Tech Stack:** React 19、TypeScript、React Router 7、Vite `import.meta.glob`、Vitest、Testing Library、Lucide React。

**Spec:** `docs/superpowers/specs/2026-09-03-aipm-six-module-rebuild-design.md`

## Global Constraints

- `/aipm` 只展示 `00 学习路线`、`01 AI 基础知识`、`02 AI 产品经理核心技能`、`03 AI 应用案例拆解`、`04 面试题库`、`05 资源导航`。
- 旧十类目录及其页面布局必须删除。
- 内容目录和正文均来自参考仓库快照；不凭空生成知识结论。
- `01 AI 基础知识` 使用“必须记住 / 想深入再看”两层阅读。
- 其他文章先显示结论摘要，再显示完整正文。
- 公司面经只保留公司、岗位、轮次、有效原文、作者和原链接；缺失内容不编造。
- 首页的 AI 实战教学区继续只显示“努力开发中”。
- 不修改用户无关文件 `遗书_PRD_v3_AI生命记忆版.md`。

---

### Task 1: 导入并索引六模块内容

**Files:**
- Create: `src/content/aipm/**`
- Create: `src/data/aipm-content.ts`
- Test: `src/data/aipm-content.test.ts`

**Interfaces:**
- Produces: `AipmModule`, `AipmArticle`, `aipmModules`, `getModuleById(id)`, `getArticleByRoute(moduleId, articlePath)`。

- [ ] **Step 1: 写内容索引失败测试**

```ts
expect(aipmModules.map((item) => item.id)).toEqual([
  '00-roadmap', '01-ai-basics', '02-pm-skills',
  '03-case-studies', '04-interview', '05-resources',
]);
expect(aipmModules.every((item) => item.articles.length > 0)).toBe(true);
expect(new Set(aipmModules.flatMap((item) => item.articles.map((article) => article.id))).size)
  .toBe(aipmModules.flatMap((item) => item.articles).length);
```

- [ ] **Step 2: 运行测试并确认因内容索引不存在而失败**

Run: `npm test -- src/data/aipm-content.test.ts --run`

- [ ] **Step 3: 导入六个知识目录和许可文件**

将 `/tmp/aipm-wiki-source/docs/00-roadmap` 到 `05-resources` 机械复制到 `src/content/aipm`，保留每篇 Markdown 的完整正文和原目录结构；不导入仓库脚本、页面模板或指令文件。

- [ ] **Step 4: 实现内容索引**

```ts
const rawArticles = import.meta.glob('../content/aipm/**/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;
```

索引忽略 `README.md`，从第一个一级标题提取标题，从“一句话说清”“参考答案”或首个正文段落提取摘要，并按路径映射到唯一模块与分组。

- [ ] **Step 5: 运行索引测试并提交**

Run: `npm test -- src/data/aipm-content.test.ts --run`

```bash
git add src/content/aipm src/data/aipm-content.ts src/data/aipm-content.test.ts
git commit -m "feat: add six-module AIPM content index"
```

### Task 2: 用六大板块替换旧 `/aipm` 页面

**Files:**
- Replace: `src/pages/AipmInterviewPage.tsx`
- Create: `src/pages/AipmHubPage.tsx`
- Modify: `src/pages/AipmInterviewPage.test.tsx`

**Interfaces:**
- Consumes: `aipmModules`。
- Produces: `AipmHubPage` 六模块入口。

- [ ] **Step 1: 将旧页面测试改成六模块验收测试**

```tsx
expect(screen.getAllByTestId('aipm-module-card')).toHaveLength(6);
expect(screen.getByRole('heading', { name: '00 学习路线' })).toBeInTheDocument();
expect(screen.getByRole('heading', { name: '05 资源导航' })).toBeInTheDocument();
expect(screen.queryByText('个人表达与岗位动机')).not.toBeInTheDocument();
expect(screen.queryByText('RAG与企业知识库')).not.toBeInTheDocument();
```

- [ ] **Step 2: 运行测试并确认旧十类页面导致失败**

Run: `npm test -- src/pages/AipmInterviewPage.test.tsx --run`

- [ ] **Step 3: 实现六模块首页**

页面只显示标题、用途说明和六张模块卡。每张卡链接到 `/aipm/:moduleId`；04 卡片额外显示“公司面经库”次入口。

- [ ] **Step 4: 运行页面测试并提交**

Run: `npm test -- src/pages/AipmInterviewPage.test.tsx --run`

```bash
git add src/pages/AipmHubPage.tsx src/pages/AipmInterviewPage.tsx src/pages/AipmInterviewPage.test.tsx
git commit -m "feat: replace interview map with six-module hub"
```

### Task 3: 增加模块目录和文章详情

**Files:**
- Create: `src/pages/AipmModulePage.tsx`
- Create: `src/pages/AipmArticlePage.tsx`
- Create: `src/pages/AipmModulePage.test.tsx`
- Create: `src/pages/AipmArticlePage.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/OriginalMarkdown.tsx`

**Interfaces:**
- Consumes: `getModuleById`, `getArticleByRoute`。
- Produces: `/aipm/:moduleId` 与 `/aipm/:moduleId/*` 可刷新访问的路由。

- [ ] **Step 1: 写目录页与文章页失败测试**

```tsx
expect(screen.getByRole('heading', { name: 'AI 基础知识' })).toBeInTheDocument();
expect(screen.getAllByTestId('aipm-article-link').length).toBeGreaterThan(10);
expect(screen.getByText('必须记住')).toBeInTheDocument();
expect(screen.getByText('想深入再看')).toBeInTheDocument();
```

- [ ] **Step 2: 运行测试并确认缺少路由和页面而失败**

Run: `npm test -- src/pages/AipmModulePage.test.tsx src/pages/AipmArticlePage.test.tsx --run`

- [ ] **Step 3: 实现分组目录和全文详情**

目录按仓库子目录分组。文章页对 `01-ai-basics` 显示源文抽取的一句话摘要和完整正文两层；其他模块显示结论摘要和完整正文。相对 Markdown 链接改写为站内路由，外部链接以新窗口打开。

- [ ] **Step 4: 实现找不到内容的返回入口**

模块或文章不存在时显示“没有找到这篇内容”，并提供返回 AI 产品求职区的按钮。

- [ ] **Step 5: 运行页面测试并提交**

Run: `npm test -- src/pages/AipmModulePage.test.tsx src/pages/AipmArticlePage.test.tsx --run`

```bash
git add src/App.tsx src/pages/AipmModulePage.tsx src/pages/AipmArticlePage.tsx src/pages/AipmModulePage.test.tsx src/pages/AipmArticlePage.test.tsx src/components/OriginalMarkdown.tsx
git commit -m "feat: add AIPM catalogs and article reading"
```

### Task 4: 将公司面经库迁入 04 面试题库

**Files:**
- Create: `src/pages/CompanyInterviewLibraryPage.tsx`
- Create: `src/pages/CompanyInterviewLibraryPage.test.tsx`
- Modify: `src/App.tsx`
- Reuse: `src/data/company-interviews.ts`

**Interfaces:**
- Consumes: `loadCompanyInterviewLibrary()`。
- Produces: `/aipm/04-interview/company-experiences`。

- [ ] **Step 1: 写公司筛选和来源字段失败测试**

```tsx
expect(await screen.findByRole('heading', { name: '公司面经库' })).toBeInTheDocument();
fireEvent.click(screen.getByRole('button', { name: /字节跳动/ }));
expect(await screen.findByText('公司：字节跳动')).toBeInTheDocument();
expect(screen.queryByText(/点赞：|发布时间：|图片数：/)).not.toBeInTheDocument();
```

- [ ] **Step 2: 运行测试并确认独立路由不存在而失败**

Run: `npm test -- src/pages/CompanyInterviewLibraryPage.test.tsx --run`

- [ ] **Step 3: 从旧页面提取公司面经组件并接入 04 模块**

保留现有 44 份去重材料及清洗规则，不保留旧十类问题卡、自动补写答案或未经来源支持的小白解释。

- [ ] **Step 4: 运行测试并提交**

Run: `npm test -- src/pages/CompanyInterviewLibraryPage.test.tsx --run`

```bash
git add src/App.tsx src/pages/CompanyInterviewLibraryPage.tsx src/pages/CompanyInterviewLibraryPage.test.tsx
git commit -m "feat: move company interviews into interview module"
```

### Task 5: 完成响应式视觉替换和全站验收

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/AppShell.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: 六模块首页、目录、文章与公司面经页面的 class names。
- Produces: 与现有 iOS 风格一致的桌面和移动端体验。

- [ ] **Step 1: 增加导航文案和关键可访问性测试**

```tsx
expect(screen.getByRole('link', { name: 'AI产品求职区' })).toHaveAttribute('href', '/aipm');
expect(screen.getByText('努力开发中')).toBeInTheDocument();
```

- [ ] **Step 2: 运行测试并确认旧导航文案导致失败**

Run: `npm test -- src/App.test.tsx --run`

- [ ] **Step 3: 完成页面样式与手机端布局**

六模块卡片使用现有圆角、半透明背景、灰蓝色层级和 Lucide 图标；禁止新增 emoji、手绘 SVG 或占位图。手机端卡片和目录为单列，正文宽度和字号保证长文可读。

- [ ] **Step 4: 执行完整测试和生产构建**

Run: `npm test -- --run`

Expected: 所有测试通过且无未处理异常。

Run: `npm run build`

Expected: TypeScript 与 Vite 构建成功。

- [ ] **Step 5: 启动本地站点并人工检查核心路径**

检查 `/aipm`、六个目录页、至少一篇基础知识文章、至少一篇案例文章和公司面经库；确认旧十类目录完全消失、链接可点击、刷新不白屏。

- [ ] **Step 6: 提交最终视觉和验收修改**

```bash
git add src/styles/global.css src/components/AppShell.tsx src/App.test.tsx
git commit -m "feat: finish responsive six-module AIPM experience"
```
