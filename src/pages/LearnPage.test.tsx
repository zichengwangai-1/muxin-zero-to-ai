import { fireEvent, render, screen } from '@testing-library/react';
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

describe('学习目录', () => {
  it('输入关键词后只展示匹配内容', () => {
    renderLearn();
    fireEvent.change(screen.getByPlaceholderText('搜索任务、知识或面试题'), {
      target: { value: '会议' },
    });

    expect(screen.getByText('把会议内容变成行动清单')).toBeInTheDocument();
    expect(screen.queryByText('小白也能理解RAG：先查资料，再回答')).not.toBeInTheDocument();
  });

  it('从URL读取AI产品分类', () => {
    renderLearn('/learn?category=aipm');
    expect(screen.getByText('小白也能理解RAG：先查资料，再回答')).toBeInTheDocument();
    expect(screen.queryByText('把会议内容变成行动清单')).not.toBeInTheDocument();
  });

  it('没有结果时告诉用户如何恢复', () => {
    renderLearn();
    fireEvent.change(screen.getByPlaceholderText('搜索任务、知识或面试题'), {
      target: { value: '完全不存在的内容' },
    });
    expect(screen.getByText('没有找到匹配内容')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '清除搜索' })).toBeInTheDocument();
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
