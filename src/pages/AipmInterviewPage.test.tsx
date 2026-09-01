import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { loadAllInterviewCaseQuestions, removePlatformMetadata } from '../data/interview-cases';
import { interviewCategories, interviewSources, sourcesForCategory } from '../data/interview';

function renderInterviewPage() {
  return render(
    <MemoryRouter initialEntries={['/aipm']}>
      <App />
    </MemoryRouter>,
  );
}

describe('AI产品求职区', () => {
  it('完整载入22份独立笔记和拆分后的23条抖音内容', async () => {
    expect(interviewSources).toHaveLength(45);
    expect(new Set(interviewSources.map((source) => source.id))).toHaveLength(45);
    expect(interviewSources.every((source) => source.categories.length > 0)).toBe(true);
    expect(interviewCategories.every((category) => sourcesForCategory(category.id).length > 0)).toBe(true);
    const originals = await Promise.all(interviewSources.map((source) => source.loadOriginal()));
    expect(originals.every((original) => original.length > 100)).toBe(true);
  });

  it('用10类问题和记忆框架呈现面试知识', () => {
    renderInterviewPage();

    expect(screen.getByRole('heading', { name: 'AI产品经理面试，从会看变成会答' })).toBeInTheDocument();
    expect(screen.getAllByTestId('interview-category')).toHaveLength(10);
    expect(screen.getByRole('button', { name: /AI评测体系与Bad Case/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /AI评测体系与Bad Case/ }));

    expect(screen.getByText('目—集—尺—跑—闭')).toBeInTheDocument();
    expect(screen.getByText('目标 → 数据集 → 评分尺子 → 执行评测 → 迭代闭环')).toBeInTheDocument();
  });

  it('按真实问题聚合案例，而不是展示博主原标题', async () => {
    renderInterviewPage();
    fireEvent.click(screen.getByRole('button', { name: /Prompt与AI交互设计/ }));

    expect(await screen.findByRole('heading', { name: '面经真实案例面' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /幻觉为什么不能只改Prompt/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /如何优化Prompt/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Prompt的撰写逻辑是什么/ })).toBeInTheDocument();
    expect(screen.queryByText('其实面字节产品就是要表现出你足够聪明')).not.toBeInTheDocument();
  });

  it('案例只保留有效回答内容并剔除平台元信息', async () => {
    renderInterviewPage();
    fireEvent.click(screen.getByRole('button', { name: /Prompt与AI交互设计/ }));

    const questionToggle = await screen.findByRole('button', { name: /幻觉为什么不能只改Prompt/ });
    fireEvent.click(questionToggle);

    expect(await screen.findByText(/真实案例 01/)).toBeInTheDocument();
    expect(screen.queryByText(/作者：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/点赞：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/发布时间：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/图片数：/)).not.toBeInTheDocument();
    expect(screen.queryByText(/笔记链接：/)).not.toBeInTheDocument();
  });

  it('拆解后仍覆盖全部45份面经素材', async () => {
    const questions = await loadAllInterviewCaseQuestions();
    const representedSourceIds = new Set(
      questions.flatMap((question) => question.cases.map((item) => item.sourceId)),
    );

    expect(representedSourceIds.size).toBe(interviewSources.length);
    expect(new Set(questions.map((question) => question.categoryId)).size).toBe(interviewCategories.length);
  });

  it('每道真实问题都有可追问的专业标准答案', async () => {
    const questions = await loadAllInterviewCaseQuestions();

    questions.forEach((question) => {
      expect(question.answer.examinerFocus.length).toBeGreaterThan(20);
      expect(question.answer.shortAnswer.length).toBeGreaterThan(60);
      expect(question.answer.deepDive).toHaveLength(4);
      expect(question.answer.deepDive.every((item) => item.detail.length > 30)).toBe(true);
      expect(question.answer.followUps.length).toBeGreaterThanOrEqual(2);
      expect(question.answer.pitfalls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('问题卡先展示标准答案再展示真实面经', async () => {
    renderInterviewPage();
    fireEvent.click(screen.getByRole('button', { name: /Prompt与AI交互设计/ }));

    const questionToggle = await screen.findByRole('button', { name: /幻觉为什么不能只改Prompt/ });
    fireEvent.click(questionToggle);

    expect(await screen.findByText('面试官在考什么')).toBeInTheDocument();
    expect(screen.getByText('30秒先说结论')).toBeInTheDocument();
    expect(screen.getByText('2分钟完整回答')).toBeInTheDocument();
    expect(screen.getByText('面试官可能追问')).toBeInTheDocument();
    expect(screen.getByText('容易失分的说法')).toBeInTheDocument();
    expect(screen.getByText(/真实案例 01/)).toBeInTheDocument();
  });

  it('每个真实案例都有小白解释，并明确原文未经核验', async () => {
    const questions = await loadAllInterviewCaseQuestions();
    const cases = questions.flatMap((question) => question.cases);

    expect(cases.length).toBeGreaterThan(0);
    cases.forEach((item) => {
      expect(item.beginnerExplanation.summary.length).toBeGreaterThan(20);
      expect(item.beginnerExplanation.logic.length).toBeGreaterThanOrEqual(2);
    });

    renderInterviewPage();
    fireEvent.click(screen.getByRole('button', { name: /Prompt与AI交互设计/ }));
    const questionToggle = await screen.findByRole('button', { name: /幻觉为什么不能只改Prompt/ });
    fireEvent.click(questionToggle);

    expect(await screen.findAllByText('木辛帮你讲人话')).not.toHaveLength(0);
    expect(screen.getAllByText('原文摘录 · 未经核验').length).toBeGreaterThan(0);
  });

  it('明确解释Chunk案例里的经验数字不能照搬', async () => {
    const questions = await loadAllInterviewCaseQuestions();
    const chunkCase = questions
      .flatMap((question) => question.cases)
      .find((item) => item.content.includes('Chunk没有银弹大小'));

    expect(chunkCase).toBeDefined();
    expect(chunkCase?.beginnerExplanation.summary).toMatch(/没有统一|不能固定/);
    expect(chunkCase?.beginnerExplanation.cautions.join('')).toMatch(/300|三百|经验范围|照搬/);
    expect(chunkCase?.beginnerExplanation.cautions.join('')).toMatch(/召回率.*准确率/);
  });

  it('清理平台元信息但保留面试回答', () => {
    const cleaned = removePlatformMetadata([
      '### 博主原标题',
      '作者：某博主',
      '点赞：128',
      '发布时间：2026-08-01',
      '图片数：9',
      '笔记链接：https://example.com/post',
      '**核心回答**：应先拆解Bad Case，再做单变量优化。',
    ].join('\n'));

    expect(cleaned).toContain('应先拆解Bad Case');
    expect(cleaned).not.toMatch(/作者：|点赞：|发布时间：|图片数：|笔记链接：|https?:\/\//);
  });
});
