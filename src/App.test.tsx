import { render, screen } from '@testing-library/react';
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
    expect(screen.getByText('提升职场竞争力')).toBeInTheDocument();
    expect(screen.getByText('转行AI类岗位')).toBeInTheDocument();
    expect(screen.getByText('做AI副业')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /查看全部学习内容/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /查看两个实战项目/ })).not.toBeInTheDocument();

    expect(screen.getByRole('heading', { name: '帮你省时省力的达成目的' })).toBeInTheDocument();
    expect(screen.getAllByTestId('learning-module')).toHaveLength(2);
    expect(screen.getByRole('heading', { name: 'AI产品求职区' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /AI产品求职区/ })).toHaveAttribute('href', '/aipm');
    expect(screen.getByText('技术知识学习')).toBeInTheDocument();
    expect(screen.getByText('面试训练')).toBeInTheDocument();
    expect(screen.getByText('论文解读')).toBeInTheDocument();
    expect(screen.getByText('模型动态')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'AI实战教学区' })).toBeInTheDocument();
    expect(screen.getByText('努力开发中')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /AI实战教学区/ })).not.toBeInTheDocument();
  });
});
