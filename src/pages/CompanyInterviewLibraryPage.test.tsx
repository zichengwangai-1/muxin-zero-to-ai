import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { loadCompanyInterviewLibrary } from '../data/company-interviews';

describe('公司面经库', () => {
  it('保留 44 份去重面经且清理无关平台信息', async () => {
    const groups = await loadCompanyInterviewLibrary();
    const entries = groups.flatMap((group) => group.entries);

    expect(entries).toHaveLength(44);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(44);
    entries.forEach((entry) => {
      expect(entry.content.length).toBeGreaterThan(20);
      expect(entry.content).not.toMatch(/图片说明|offer截图|点赞：|发布时间：|图片数：|调研时间：/i);
    });
  });

  it('可以按公司查看岗位、轮次、原文和真实来源', async () => {
    render(
      <MemoryRouter initialEntries={['/aipm/04-interview/company-experiences']}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole('heading', { name: '公司面经库' })).toBeInTheDocument();
    const entry = await screen.findByRole('button', { name: /2天8面拿字节校招offer/ });
    fireEvent.click(entry);

    expect(await screen.findByText('公司：字节跳动')).toBeInTheDocument();
    expect(screen.getByText('岗位：AI产品经理')).toBeInTheDocument();
    expect(screen.getByText('轮次：多轮面试')).toBeInTheDocument();
    expect(screen.getByText('原作者：柔小柔鸭')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看原链接' })).toHaveAttribute(
      'href',
      'https://www.xiaohongshu.com/explore/6a7eda900000000028030f92',
    );
    expect(screen.queryByText(/点赞：|发布时间：|图片数：/)).not.toBeInTheDocument();
  });
});
