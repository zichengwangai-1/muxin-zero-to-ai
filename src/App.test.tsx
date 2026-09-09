import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('首页', () => {
  it('用两个清晰模块承接零基础用户的学习目标', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('木辛-零基础学AI').length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole('heading', { name: '几周内学好AI，而不是几个月' }),
    ).toBeInTheDocument();
    expect(screen.getByText('作者：木辛')).toBeInTheDocument();
    expect(screen.getByText('即使零基础用户，也能在这里提升职场竞争力')).toBeInTheDocument();
    expect(screen.getByText('干中学')).toBeInTheDocument();
    expect(screen.getByText('以目标导向')).toBeInTheDocument();
    expect(screen.getByText('避免100个小时的AI大模型专业课，不如学30%的关键内容。')).toBeInTheDocument();
    expect(screen.getByText('大师记忆法')).toBeInTheDocument();
    expect(screen.getByText('学了记不住？用记忆大师方法帮你记忆。')).toBeInTheDocument();
    expect(screen.getByText('TIME = MONEY')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '省下80%的资料收集时间' })).toBeInTheDocument();
    expect(screen.getByText('从筛选、收集到面试，只留下真正需要学的内容。')).toBeInTheDocument();
    const featureCards = screen.getAllByTestId('feature-card');
    expect(featureCards).toHaveLength(3);
    featureCards.forEach((card) => {
      expect(card.querySelector('.feature-card__content')).toBeInTheDocument();
    });
    expect(screen.getByText('提升职场竞争力')).toBeInTheDocument();
    expect(screen.getByText('转行AI类岗位')).toBeInTheDocument();
    expect(screen.getByText('做AI副业')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /查看全部学习内容/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /查看两个实战项目/ })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { name: '帮你省时省力的达成目的' })).toBeInTheDocument();
    expect(screen.getAllByTestId('learning-module')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'AI产品求职区' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /AI产品求职区/ }).some((link) => link.getAttribute('href') === '/aipm')).toBe(true);
    expect(screen.getByText('技术知识学习')).toBeInTheDocument();
    expect(screen.getByText('面试训练')).toBeInTheDocument();
    expect(screen.getAllByText('论文解读').length).toBeGreaterThan(0);
    expect(screen.getByText('模型动态')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AI实战教学区' })).toBeInTheDocument();
    expect(screen.getByText('努力开发中')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /AI实战教学区/ })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { name: '省下80%的资料搜集时间' })).toBeInTheDocument();
    expect(screen.getByText('8个专业目录')).toBeInTheDocument();
    expect(screen.getAllByTestId('home-aipm-directory-link')).toHaveLength(8);
    expect(screen.queryByRole('heading', { name: '从日常办公中最常见的任务开始' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /不只说“我学过”/ })).not.toBeInTheDocument();
    expect(screen.queryByText('今天只做一件事')).not.toBeInTheDocument();
  });

  it('空搜索留在首页，有关键词时只搜索 AI 产品求职区', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    const header = screen.getByRole('banner');
    expect(within(header).queryByRole('navigation')).not.toBeInTheDocument();
    expect(within(header).queryByText('从目录开始')).not.toBeInTheDocument();
    expect(within(header).getAllByRole('searchbox')).toHaveLength(1);

    fireEvent.click(within(header).getByRole('button', { name: '搜索' }));
    expect(screen.getByRole('heading', { name: '几周内学好AI，而不是几个月' })).toBeInTheDocument();

    fireEvent.change(within(header).getByRole('searchbox'), { target: { value: 'RAG' } });
    fireEvent.click(within(header).getByRole('button', { name: '搜索' }));

    expect(screen.getByRole('heading', { name: 'AI产品求职区搜索结果' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /什么是 RAG:检索增强生成入门/ })).toBeInTheDocument();
    expect(screen.queryByText('小白也能理解RAG：先查资料，再回答')).not.toBeInTheDocument();
  });
});
