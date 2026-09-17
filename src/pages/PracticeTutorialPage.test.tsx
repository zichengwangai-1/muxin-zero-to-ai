import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';

function visit(path: string) { render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }

describe('实战教程阅读', () => {
  it('从网站目录进入教程并复制完整中文 Prompt', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    visit('/practice/development');
    fireEvent.click(screen.getByRole('link', { name: /用 Kimi 制作个人作品集/ }));
    expect(screen.getByRole('heading', { level: 1, name: '用 Kimi 制作个人作品集' })).toBeInTheDocument();
    expect(screen.getByText('中文改编 · 尚未实测')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /阅读原教程/ })).toHaveAttribute('href', 'https://www.kimi.ai/zh-hans/resources/create-websites-with-ai');
    fireEvent.click(screen.getByRole('button', { name: '复制完整 Prompt' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('已复制'));
    expect(writeText.mock.calls[0][0]).toContain('请创建中文个人作品集“林间设计”');
    expect(writeText.mock.calls[0][0]).toContain('联系按钮');
  });

  it('游戏详情可直接访问，复制失败仍保留全文', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    visit('/practice/games/star-breaker');
    expect(screen.getByRole('heading', { level: 1, name: '用 Claude 制作打砖块小游戏' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '复制完整 Prompt' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('请手动选择'));
    expect(screen.getByText(/生成可直接游玩的中文网页小游戏/)).toBeInTheDocument();
  });

  it('教程不能通过错误模块地址访问', () => {
    visit('/practice/development/star-breaker');
    expect(screen.getByRole('heading', { name: '没有找到这篇教程' })).toBeInTheDocument();
  });
});
