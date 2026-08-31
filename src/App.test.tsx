import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('首页', () => {
  it('展示品牌名和六个需求入口', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('木辛-零基础学AI').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId('need-entry')).toHaveLength(6);
    expect(
      screen.getByRole('heading', { name: '几周内学好AI，而不是几个月' }),
    ).toBeInTheDocument();
    expect(screen.getByText('作者：木辛')).toBeInTheDocument();
    expect(screen.getByText('即使零基础用户，也能在这里提升职场竞争力')).toBeInTheDocument();
    expect(screen.getByText('以目标导向')).toBeInTheDocument();
    expect(screen.getByText('大师记忆法')).toBeInTheDocument();
    expect(screen.getByText('学会')).toBeInTheDocument();
    expect(screen.getByText('做出')).toBeInTheDocument();
    expect(screen.getByText('说清')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /查看全部学习内容/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /查看两个实战项目/ })).toBeInTheDocument();
  });
});
