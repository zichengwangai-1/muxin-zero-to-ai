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
});
