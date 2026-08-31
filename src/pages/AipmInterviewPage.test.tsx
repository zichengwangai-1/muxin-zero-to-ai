import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
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

  it('允许用户展开并阅读完整原始笔记', async () => {
    renderInterviewPage();
    fireEvent.click(screen.getByRole('button', { name: /AI评测体系与Bad Case/ }));

    const sourceToggle = screen.getByRole('button', { name: /AI产品经理怎么做评测/ });
    fireEvent.click(sourceToggle);

    expect(await screen.findByText('评测不是打分工具，是把模糊的用户体验，翻译成可衡量、可归因、可优化的工程语言的翻译器。')).toBeInTheDocument();
    expect(screen.getByText('原文重点')).toBeInTheDocument();
  });
});
