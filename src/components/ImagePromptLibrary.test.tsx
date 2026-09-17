import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImagePromptLibrary } from './ImagePromptLibrary';
import collection from '../content/practice/image/精选案例.json';

describe('图片案例库', () => {
  it('先展示12项，加载后展示全部20项', () => {
    render(<ImagePromptLibrary />);
    expect(screen.getAllByRole('article')).toHaveLength(12);
    fireEvent.click(screen.getByRole('button', { name: /加载更多/ }));
    expect(screen.getAllByRole('article')).toHaveLength(20);
    expect(screen.queryByRole('button', { name: /加载更多/ })).not.toBeInTheDocument();
  });
  it('组合分类与搜索，支持空结果恢复', () => {
    render(<ImagePromptLibrary />);
    fireEvent.click(screen.getByRole('button', { name: /电商与产品/ }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '香水' } });
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: '薄荷玫瑰香水电商图' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '不存在的案例xyz' } });
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '查看全部案例' }));
    expect(screen.getAllByRole('article')).toHaveLength(12);
  });
  it('复制完整长提示词，并在失败时提供反馈', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<ImagePromptLibrary />);
    const first = collection.entries[0];
    const button = screen.getByRole('button', { name: `复制 ${first.title} Prompt` });
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByText('完整提示词已复制。')).toBeInTheDocument());
    expect(writeText).toHaveBeenCalledWith(first.prompt);
    writeText.mockRejectedValueOnce(new Error('clipboard denied'));
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByText('复制失败，请选择提示词正文手动复制。')).toBeInTheDocument());
  });
});
