import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LearnPage } from './LearnPage';

function renderLearn(entry = '/learn') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/learn" element={<LearnPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AI产品求职区搜索结果', () => {
  it('只展示新版 AI 产品求职区的目录与文章', () => {
    renderLearn('/learn?q=RAG');

    expect(screen.getByRole('heading', { name: 'AI产品求职区搜索结果' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /什么是 RAG:检索增强生成入门/ })).toHaveAttribute(
      'href',
      '/aipm/01-ai-basics/llm/what-is-rag',
    );
    const articleResults = screen.getByRole('region', { name: '相关文章' });
    expect(within(articleResults).getAllByRole('link')[0]).toHaveAttribute(
      'href',
      '/aipm/01-ai-basics/llm/what-is-rag',
    );
    expect(screen.queryByText('小白也能理解RAG：先查资料，再回答')).not.toBeInTheDocument();
    expect(screen.queryByText('把会议内容变成行动清单')).not.toBeInTheDocument();
    expect(screen.queryByText('今天想完成什么？')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('搜索任务、知识或面试题')).not.toBeInTheDocument();
  });

  it('没有匹配的 AI 产品求职内容时给出明确提示', () => {
    renderLearn('/learn?q=完全不存在的内容');
    expect(screen.getByText('没有找到匹配内容')).toBeInTheDocument();
    expect(screen.getByText('试试更短的关键词，例如“RAG”“评测”或“面试”。')).toBeInTheDocument();
  });

  it('搜索结果包含 AI 产品求职区的目录和完整文章', () => {
    const { unmount } = renderLearn('/learn?q=AI%20基础知识');

    expect(screen.getByRole('link', { name: /AI 基础知识/ })).toHaveAttribute(
      'href',
      '/aipm/01-ai-basics',
    );

    unmount();
    renderLearn('/learn?q=大模型是怎么');
    expect(screen.getByRole('link', { name: /大模型是怎么/ })).toHaveAttribute(
      'href',
      '/aipm/01-ai-basics/llm/how-llm-works',
    );
  });
});
