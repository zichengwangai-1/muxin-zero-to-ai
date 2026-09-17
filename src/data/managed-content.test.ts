import { describe, expect, it } from 'vitest';
import { parseDocument, importDocument, validateEntries, safeUrl, validateUpload, applyImport } from '../lib/cms-format.mjs';

const sample = '---\nid: report\ntitle: 工作汇报\nmodule: office\ncategory: 汇报\nsummary: 整理记录\nprompt: 请根据记录整理\nvisible: true\n---\n## 操作\n上传工作记录';
describe('后台内容格式', () => {
  it('保留原始提示词和 Markdown，默认不展示未明确发布的内容', () => {
    expect(parseDocument(sample)).toMatchObject({ id: 'report', module: 'office', visible: true, body: '## 操作\n上传工作记录' });
    expect(parseDocument(sample.replace('visible: true', 'visible: false')).visible).toBe(false);
    expect(parseDocument(sample.replace('visible: true', '')).visible).toBe(false);
  });
  it('普通 Markdown 只导入正文，不虚构元数据', () => {
    expect(importDocument('# 我的教程\n步骤')).toEqual({ body: '# 我的教程\n步骤' });
  });
  it('拒绝非法结构、路径和重复条目', () => {
    expect(() => parseDocument(sample.replace('id: report', 'id: ../bad'))).toThrow();
    expect(() => importDocument('---\na: [\n---\n正文')).toThrow();
    expect(() => importDocument('---\ntitle: 一\ntitle: 二\n---')).toThrow();
    const entry = parseDocument(sample);
    expect(() => validateEntries([entry, entry])).toThrow(/重复/);
  });
  it('导入不会跨模块、换 ID 或自动上架，且保留未导入字段', () => {
    const current = { ...parseDocument(sample), id: 'existing', visible: false };
    expect(applyImport(current, sample)).toMatchObject({ id: 'existing', visible: false, title: '工作汇报' });
    expect(() => applyImport(current, sample.replace('module: office', 'module: games'))).toThrow(/模块/);
  });
  it('禁止危险链接与可执行附件，但允许本地媒体和 HTTPS', () => {
    expect(safeUrl('javascript:alert(1)')).toBe('');
    expect(safeUrl('//evil.example')).toBe('');
    expect(safeUrl('/uploads/report.pdf')).toBe('/uploads/report.pdf');
    expect(safeUrl('https://example.com')).toBe('https://example.com');
    expect(() => validateUpload({ name: 'x.html', size: 12 })).toThrow();
    expect(() => validateUpload({ name: 'x.pdf', size: 20_000_000 })).toThrow();
    expect(() => validateUpload({ name: 'x.png', size: 1024 })).not.toThrow();
  });
});
