import { describe, expect, it } from 'vitest';
import type { ContentItem } from '../types/content';
import { filterContent } from './content';

const items: ContentItem[] = [
  {
    id: 'office-meeting',
    category: 'office',
    type: 'task',
    title: '把会议录音变成行动清单',
    eyebrow: 'AI办公',
    summary: '从会议内容中提取负责人和截止时间。',
    duration: '25分钟',
    level: '零基础',
    output: '会议行动清单',
    tags: ['会议', '整理'],
    accent: 'blue',
    detail: {
      plain: '让AI按固定格式整理会议重点。',
      why: '减少人工遗漏。',
      steps: ['准备会议文字', '提取行动项'],
      checks: ['负责人是否明确'],
      pitfalls: ['没有提供原文'],
    },
  },
  {
    id: 'aipm-rag',
    category: 'aipm',
    type: 'knowledge',
    title: '小白也能理解RAG',
    eyebrow: 'AI产品',
    summary: '理解知识库问答为什么需要先检索资料。',
    duration: '18分钟',
    level: '零基础',
    output: '一张RAG流程图',
    tags: ['RAG', '知识库'],
    accent: 'violet',
    detail: {
      plain: '让AI先查资料再回答。',
      why: '让答案有依据。',
      steps: ['切分资料', '检索相关内容'],
      checks: ['答案是否有引用'],
      pitfalls: ['一次塞入全部资料'],
    },
  },
];

describe('filterContent', () => {
  it('按关键词搜索标题、摘要、标签和产出', () => {
    expect(filterContent(items, '会议', 'all').map((item) => item.id)).toEqual([
      'office-meeting',
    ]);
  });

  it('按分类返回内容', () => {
    expect(filterContent(items, '', 'aipm').every((item) => item.category === 'aipm')).toBe(
      true,
    );
  });

  it('忽略关键词大小写与两端空格', () => {
    expect(filterContent(items, '  rag  ', 'all').map((item) => item.id)).toEqual(['aipm-rag']);
  });
});
