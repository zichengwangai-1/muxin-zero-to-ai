import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ManagedContentList, ManagedContentDetail } from './ManagedPracticeContent';
import { parseDocument } from '../lib/cms-format.mjs';

const entry = parseDocument('---\nid: report\ntitle: 周报整理\nmodule: office\ncategory: 文档\nsummary: 用记录写周报\nprompt: 原样复制\\n保留细节\nvisible: true\n---\n[危险](javascript:alert)\n<script>alert(1)</script>');
describe('后台内容前台展示', () => {
  it('分类搜索能找到案例，详情链接稳定', () => {
    render(<MemoryRouter><ManagedContentList entries={[entry]} /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /周报整理/ })).toHaveAttribute('href', '/practice/office/report');
    fireEvent.change(screen.getByRole('searchbox', { name: '搜索新增教程' }), { target: { value: '不存在' } });
    expect(screen.queryByRole('link', { name: /周报整理/ })).not.toBeInTheDocument();
  });
  it('展示真实状态、完整复制并不执行正文脚本', async () => {
    let copied = '';
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn(async (text: string) => { copied = text; }) } });
    render(<ManagedContentDetail entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: '复制完整 Prompt' }));
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('已复制'));
    expect(copied).toBe('原样复制\\n保留细节');
    expect(screen.getByText('尚未实测')).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
    expect(screen.getByRole('link', { name: '危险' })).not.toHaveAttribute('href', 'javascript:alert');
  });
});
