import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('AI 产品求职区板块目录', () => {
  it('展示 AI 基础知识的真实分组与文章', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/01-ai-basics']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'AI 基础知识' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '机器学习基础' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '大模型基础' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Prompt 与上下文' })).toBeInTheDocument();
    expect(screen.getAllByTestId('aipm-article-link').length).toBeGreaterThan(20);
    expect(screen.getByRole('link', { name: /大模型是怎么/ })).toHaveAttribute(
      'href',
      '/aipm/01-ai-basics/llm/how-llm-works',
    );
  });

  it('不存在的板块显示明确返回入口', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/not-a-module']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('没有找到这个内容板块')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回 AI 产品求职区' })).toHaveAttribute('href', '/aipm');
  });

  it('论文解读目录沿用原目录样式并能进入详情', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/07-paper-insights']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '论文解读' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '评测与可靠性' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '记忆与上下文' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Agent 系统设计' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /EarlyEval/ })).toHaveAttribute(
      'href',
      '/aipm/07-paper-insights/evaluation-reliability/earlyeval',
    );
  });
});
