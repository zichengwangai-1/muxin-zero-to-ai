import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('AI 产品求职区首页', () => {
  it('只展示六个新的内容板块', () => {
    render(
      <MemoryRouter initialEntries={['/aipm']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'AI 产品求职区' })).toBeInTheDocument();
    expect(screen.getAllByTestId('aipm-module-card')).toHaveLength(6);
    expect(screen.getByRole('heading', { name: '00 学习路线' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '01 AI 基础知识' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '02 AI 产品经理核心技能' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '03 AI 应用案例拆解' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '04 面试题库' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '05 资源导航' })).toBeInTheDocument();
  });

  it('彻底移除旧十类能力地图', () => {
    render(
      <MemoryRouter initialEntries={['/aipm']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByText('能力地图')).not.toBeInTheDocument();
    expect(screen.queryByText('个人表达与岗位动机')).not.toBeInTheDocument();
    expect(screen.queryByText('RAG与企业知识库')).not.toBeInTheDocument();
    expect(screen.queryByText('Prompt与AI交互设计')).not.toBeInTheDocument();
    expect(screen.queryByText('AI评测体系与Bad Case')).not.toBeInTheDocument();
  });

  it('六个板块都进入自己的目录页', () => {
    render(
      <MemoryRouter initialEntries={['/aipm']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /00 学习路线/ })).toHaveAttribute('href', '/aipm/00-roadmap');
    expect(screen.getByRole('link', { name: /04 面试题库/ })).toHaveAttribute('href', '/aipm/04-interview');
    expect(screen.getByRole('link', { name: /05 资源导航/ })).toHaveAttribute('href', '/aipm/05-resources');
  });
});
