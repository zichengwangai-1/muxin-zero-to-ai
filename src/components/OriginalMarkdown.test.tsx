import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OriginalMarkdown } from './OriginalMarkdown';

describe('OriginalMarkdown', () => {
  it('保留正文信息，同时把仓库说法改成站内说法并生成可点击链接', () => {
    render(
      <OriginalMarkdown
        content={'本仓库的 **重点** 见 [RAG 文章](../rag.md)，外部资料见 [官方文档](https://example.com)。'}
        resolveLink={(href) => (href === '../rag.md' ? '/aipm/01-ai-basics/rag' : href)}
      />,
    );

    expect(screen.queryByText(/本仓库/)).not.toBeInTheDocument();
    expect(screen.getByText(/本站的/)).toBeInTheDocument();
    expect(screen.getByText('重点')).toHaveClass('source-keyword');
    expect(screen.getByRole('link', { name: 'RAG 文章' })).toHaveAttribute('href', '/aipm/01-ai-basics/rag');
    expect(screen.getByRole('link', { name: '官方文档' })).toHaveAttribute('target', '_blank');
  });

  it('把原文中的配图作为真实图片展示', () => {
    render(
      <OriginalMarkdown
        content="![Transformer 示意图](assets/transformer.png)"
        resolveImage={(href) => `/content/${href}`}
      />,
    );

    expect(screen.getByRole('img', { name: 'Transformer 示意图' })).toHaveAttribute(
      'src',
      '/content/assets/transformer.png',
    );
  });
});
