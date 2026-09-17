import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PromptLibrary } from './PromptLibrary';
import { parsePromptCollection, promptCategories, promptCount } from '../data/prompt-library';

describe('Prompt 内容与复制', () => {
  it('完整载入原文分类并保留提示词内部的标题', () => {
    expect(promptCategories.map(category => category.entries.length)).toEqual([1, 5, 3, 2, 2, 2]);
    expect(promptCount).toBe(15);
    expect(promptCategories.flatMap(category => category.entries).find(entry => entry.title === '人生设计术')?.prompt).toContain('### 第一阶段：你在这里');
    expect(parsePromptCollection('## 结语\n说明', 'test')).toEqual([]);
  });

  it('展开提示词后复制完整正文，并显示成功反馈', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<PromptLibrary />);
    screen.getByRole('heading', { name: '人生设计术' }).closest('article')!.querySelector('details')!.open = true;
    fireEvent.click(screen.getByRole('button', { name: '复制 人生设计术 Prompt' }));
    const prompt = promptCategories.flatMap(category => category.entries).find(entry => entry.title === '人生设计术')!.prompt;
    expect(writeText).toHaveBeenCalledWith(prompt);
    await waitFor(() => expect(screen.getByText('已复制')).toBeInTheDocument());
  });

  it('剪贴板不可用时保留可手动复制的原文并提示失败', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    render(<PromptLibrary />);
    screen.getByRole('heading', { name: '苏格拉底式提问' }).closest('article')!.querySelector('details')!.open = true;
    fireEvent.click(screen.getByRole('button', { name: '复制 苏格拉底式提问 Prompt' }));
    await waitFor(() => expect(screen.getByText('复制未成功，请手动选择下方提示词正文复制。')).toBeInTheDocument());
  });
});
