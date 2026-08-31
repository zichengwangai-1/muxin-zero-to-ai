# 木辛-零基础学AI初版网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可本地运行、响应式、支持目录筛选和本地进度的“木辛-零基础学AI”前台初版，真实呈现PRD中的办公提效与转行AIPM两类内容。

**Architecture:** 使用React单页应用承载首页、统一学习目录、内容详情、面试题和项目页；内容先由本地TypeScript数据提供，后续可替换为CMS API。用户无需登录，学习进度使用localStorage保存。V1初版不实现后台、RAG、账号和个性化展示。

**Tech Stack:** React 19、TypeScript、Vite、React Router、Lucide React、Vitest、Testing Library、原生CSS。

**Spec:** `docs/superpowers/specs/2026-08-30-muxin-zero-to-ai-prd-v1.1.md`

## Global Constraints

- 产品名称固定为“木辛-零基础学AI”。
- 核心用户固定为零基础AI学习者。
- 所有用户看到相同首页、目录和内容；不出现测评、用户分层和个性化推荐。
- 首页提供AI入门、办公提效、了解AIPM、AI产品知识、AI项目、作品集与面试六个入口。
- 视觉方向为iOS式高级简约：克制的玻璃层次、大留白、清晰层级、系统化动效。
- 主要内容使用真实中文演示文案，不使用Lorem ipsum或无意义占位卡片。
- 初版只实现前台；后台、账号、RAG和多智能体不在本计划范围。
- 必须支持桌面端和375px宽移动端。
- 必须支持键盘焦点、语义化标签和`prefers-reduced-motion`。
- 当前目录不是Git仓库，因此计划中的提交步骤记录为可选，不执行提交命令。

## Visual System

- **Palette:** 墨色`#111318`、次级文字`#667085`、冰雾背景`#F4F7FB`、品牌蓝`#0A84FF`、浅蓝`#64D2FF`、成功绿`#34C759`、卡片白`#FFFFFF`。
- **Type:** 标题使用`ui-rounded, "SF Pro Rounded"`，正文使用`-apple-system, BlinkMacSystemFont, "SF Pro Text"`，数据标签使用`ui-monospace`。
- **Layout:** 1200px内容宽度；桌面端卡片网格，移动端单列；主要操作始终保持在自然阅读顺序中。
- **Signature:** 首页使用“学会 → 做出 → 说清”的三段式学习路径舱，既是品牌记忆点，也是全站信息结构说明。
- **Restraint:** 玻璃效果只用于顶部导航和路径舱，普通内容卡使用实体白色，避免整页玻璃化导致廉价感。

---

### Task 1: 项目脚手架与测试基线

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `src/main.tsx`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: Vite应用入口、`npm run dev`、`npm run build`、`npm test`。

- [ ] **Step 1: 编写失败的应用冒烟测试**

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

it('展示品牌名和六个需求入口', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByText('木辛-零基础学AI')).toBeInTheDocument();
  expect(screen.getAllByTestId('need-entry')).toHaveLength(6);
});
```

- [ ] **Step 2: 安装依赖并运行测试，确认因App不存在而失败**

Run: `npm install && npm test -- --run`
Expected: FAIL，提示无法解析`./App`。

- [ ] **Step 3: 创建Vite配置和最小App入口**

创建React入口、Vitest的`jsdom`环境和Testing Library setup，使测试能够运行。

- [ ] **Step 4: 再次运行测试**

Run: `npm test -- --run`
Expected: FAIL，仅因尚未渲染六个入口。

### Task 2: 内容类型、本地数据与筛选逻辑

**Files:**
- Create: `src/types/content.ts`
- Create: `src/data/content.ts`
- Create: `src/lib/content.ts`
- Test: `src/lib/content.test.ts`

**Interfaces:**
- Produces: `ContentItem`、`NeedEntry`、`Project`类型；`contentItems`、`needEntries`、`projects`数据；`filterContent(items, query, category)`函数。
- Consumes: 无。

- [ ] **Step 1: 编写筛选逻辑测试**

```ts
expect(filterContent(items, '会议', 'all').map(item => item.id)).toEqual(['office-meeting']);
expect(filterContent(items, '', 'aipm').every(item => item.category === 'aipm')).toBe(true);
```

- [ ] **Step 2: 运行测试，确认函数不存在**

Run: `npm test -- --run src/lib/content.test.ts`
Expected: FAIL，提示`filterContent`未定义。

- [ ] **Step 3: 实现内容模型和演示数据**

加入6个需求入口、12个办公任务、8篇AIPM知识示例、8道无虚构来源的演示面试题、2个完整项目摘要。面试题明确标注“演示内容，等待导入真实来源”。

- [ ] **Step 4: 实现大小写不敏感的关键词和分类筛选**

筛选范围包括标题、摘要、标签和产出；空查询返回分类内全部内容。

- [ ] **Step 5: 运行测试**

Run: `npm test -- --run src/lib/content.test.ts`
Expected: PASS。

### Task 3: 全站骨架与首页

**Files:**
- Create: `src/App.tsx`
- Create: `src/components/AppShell.tsx`
- Create: `src/components/BrandMark.tsx`
- Create: `src/components/NeedCard.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: `/`首页和全站Header；`NeedCard`接收`NeedEntry`并导航到对应目录。
- Consumes: `needEntries`。

- [ ] **Step 1: 扩展首页测试**

验证品牌、主标题、“学会/做出/说清”路径、6个需求入口、办公提效和AIPM实战两块内容均存在。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/App.test.tsx`
Expected: FAIL，缺少首页结构。

- [ ] **Step 3: 实现视觉令牌和全局基础样式**

定义颜色、圆角、阴影、间距、字体、焦点态、选择文本样式和减少动画规则。

- [ ] **Step 4: 实现Header、品牌标记和首页Hero**

Hero主文案为“从一个真实任务开始，把AI学会、做出、说清”，不使用空泛宣传语。

- [ ] **Step 5: 实现六入口目录与路径舱**

入口卡显示任务、预计时长和产出；三段路径舱用单一克制动画突出“学会 → 做出 → 说清”。

- [ ] **Step 6: 运行测试**

Run: `npm test -- --run src/App.test.tsx`
Expected: PASS。

### Task 4: 统一学习目录与搜索筛选

**Files:**
- Create: `src/components/ContentCard.tsx`
- Create: `src/components/FilterBar.tsx`
- Create: `src/pages/LearnPage.tsx`
- Create: `src/pages/ContentDetailPage.tsx`
- Modify: `src/App.tsx`
- Test: `src/pages/LearnPage.test.tsx`

**Interfaces:**
- Produces: `/learn`、`/content/:id`路由；分类为`all | intro | office | aipm | interview`。
- Consumes: `contentItems`与`filterContent`。

- [ ] **Step 1: 编写目录筛选测试**

测试输入“会议”只保留会议任务；点击“AI产品经理”筛选后不展示办公卡片；无结果时展示明确恢复建议。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/pages/LearnPage.test.tsx`
Expected: FAIL，页面不存在。

- [ ] **Step 3: 实现目录、分类胶囊和搜索框**

分类选择不代表用户身份，只改变当前目录内容；URL查询参数保存`category`和`q`。

- [ ] **Step 4: 实现内容卡与详情页**

详情展示小白解释、步骤、Prompt、检查方法、常见错误、最终产出和关联项目。

- [ ] **Step 5: 运行测试**

Run: `npm test -- --run src/pages/LearnPage.test.tsx`
Expected: PASS。

### Task 5: 项目页与本地进度

**Files:**
- Create: `src/lib/progress.ts`
- Create: `src/hooks/useLocalProgress.ts`
- Create: `src/pages/ProjectsPage.tsx`
- Create: `src/pages/ProjectDetailPage.tsx`
- Modify: `src/App.tsx`
- Test: `src/lib/progress.test.ts`
- Test: `src/pages/ProjectDetailPage.test.tsx`

**Interfaces:**
- Produces: `/projects`、`/projects/:id`；`readProgress(projectId)`、`toggleStep(projectId, stepId)`、`resetProgress(projectId)`。
- Consumes: `projects`。

- [ ] **Step 1: 编写localStorage进度测试**

验证勾选、刷新读取和重置均只影响当前项目。

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- --run src/lib/progress.test.ts`
Expected: FAIL，进度函数不存在。

- [ ] **Step 3: 实现安全的本地进度读写**

数据键固定为`muxin-ai-progress-v1`；遇到损坏JSON时返回空进度而不是中断页面。

- [ ] **Step 4: 实现项目列表和项目详情**

两个项目均展示目标、能力、交付物、步骤、进度、作品集和面试表达；用户可以勾选和重置。

- [ ] **Step 5: 运行进度和页面测试**

Run: `npm test -- --run src/lib/progress.test.ts src/pages/ProjectDetailPage.test.tsx`
Expected: PASS。

### Task 6: 响应式、可访问性与视觉精修

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/components/AppShell.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/LearnPage.tsx`
- Modify: `src/pages/ProjectDetailPage.tsx`

**Interfaces:**
- Consumes: 已完成的页面与组件。
- Produces: 375px至1440px均可用的最终前台体验。

- [ ] **Step 1: 增加移动端布局和触控尺寸**

按钮和入口最小触控高度44px；375px下无横向滚动；卡片改为单列；Header保留品牌与主入口。

- [ ] **Step 2: 增加键盘焦点和减少动画支持**

所有链接、按钮、筛选和勾选项有可见焦点；`prefers-reduced-motion: reduce`关闭非必要位移和渐变动画。

- [ ] **Step 3: 执行视觉自检并移除一个非必要装饰**

检查玻璃效果是否只出现在Header和路径舱；如果任一装饰不能帮助理解层级，则删除。

- [ ] **Step 4: 运行完整测试和构建**

Run: `npm test -- --run && npm run build`
Expected: 所有测试PASS，构建退出码0。

- [ ] **Step 5: 启动真实页面并检查交互**

Run: `npm run dev -- --host 127.0.0.1`
检查：首页六入口、搜索筛选、内容详情、两个项目、进度保存、移动端布局和控制台错误。

