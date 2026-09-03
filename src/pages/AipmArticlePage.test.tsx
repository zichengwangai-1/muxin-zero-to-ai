import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('AI 产品求职区文章页', () => {
  it('AI 基础知识使用两层阅读并展示完整原文', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/01-ai-basics/llm/how-llm-works']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /大模型是怎么/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '必须记住' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '想深入再看' })).toBeInTheDocument();
    expect(screen.getAllByText(/预测下一个最可能出现的词/).length).toBeGreaterThan(0);
    expect(screen.getByText('Token:模型眼中的世界')).toBeInTheDocument();
  });

  it('其他板块先展示文章结论再展示完整正文', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/04-interview/basics/pretrain-finetune-sft']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '预训练、微调、SFT 的区别与应用场景' })).toBeInTheDocument();
    expect(screen.getByText('先说结论')).toBeInTheDocument();
    expect(screen.getByText('完整内容')).toBeInTheDocument();
    expect(screen.getAllByText(/预训练是"读书学通用知识"/).length).toBeGreaterThan(0);
  });

  it('把内容目录链接改写到可访问的站内板块页', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/00-roadmap/getting-started']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: '01-ai-basics' })).toHaveAttribute(
      'href',
      '/aipm/01-ai-basics',
    );
  });

  it('资源工具页不再展示面试 Skill 和安装命令', () => {
    render(
      <MemoryRouter initialEntries={['/aipm/05-resources/tools']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '值得上手的 AI 工具与平台' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /面试 Skills/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/interview-self-introduce/)).not.toBeInTheDocument();
    expect(screen.queryByText(/interview-assessment/)).not.toBeInTheDocument();
    expect(screen.queryByText(/npx skills add/)).not.toBeInTheDocument();
  });
});
