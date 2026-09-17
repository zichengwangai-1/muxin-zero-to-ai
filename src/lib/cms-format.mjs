import { parseDocument as yamlDocument, stringify } from 'yaml';

export const MODULE_IDS = ['prompts', 'image', 'video', 'office', 'development', 'games'];
const textFields = ['id', 'title', 'module', 'category', 'summary', 'prompt', 'body', 'tools', 'author', 'source', 'date', 'cover', 'video', 'result', 'prepare', 'steps', 'checks', 'tested', 'reference'];
export function safeUrl(value) {
  if (typeof value !== 'string' || /[\s\\\u0000-\u001f]/.test(value)) return '';
  if (/^\/(?!\/)/.test(value) && !value.split('/').includes('..')) return value;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? value : ''; } catch { return ''; }
}
export function importDocument(text) {
  if (typeof text !== 'string' || text.length > 1_000_000) throw new Error('Markdown 文件需小于 1 MB');
  const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) return { body: normalized };
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) throw new Error('Markdown 开头的字段区缺少结束分隔线 ---');
  const doc = yamlDocument(match[1], { schema: 'core', uniqueKeys: true });
  if (doc.errors.length) throw new Error(`字段格式有误：${doc.errors[0].message}`);
  const raw = doc.toJS({ maxAliasCount: 0 });
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('字段区必须是名称与内容的对应关系');
  const data = {};
  for (const key of [...textFields, 'visible', 'order', 'attachments']) if (Object.hasOwn(raw, key)) data[key] = raw[key];
  return { ...data, body: match[2] };
}
export function normalizeEntry(raw) {
  const data = {};
  for (const key of textFields) {
    if (raw[key] != null && typeof raw[key] !== 'string') throw new Error(`${key} 必须填写文字`);
    data[key] = raw[key] ?? '';
  }
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(data.id)) throw new Error('内容 ID 请使用小写英文、数字和连字符（最多 80 字符）');
  if (!MODULE_IDS.includes(data.module)) throw new Error('请选择正确的模块');
  for (const key of ['title', 'category', 'summary', 'prompt']) if (!data[key].trim()) throw new Error(`请补充 ${key} 字段`);
  if (raw.visible != null && typeof raw.visible !== 'boolean') throw new Error('是否展示必须是 true 或 false');
  data.visible = raw.visible === true;
  data.order = raw.order ?? 100;
  if (typeof data.order !== 'number' || !Number.isFinite(data.order)) throw new Error('排序必须是数字');
  for (const key of ['cover', 'source', 'video']) if (data[key] && !safeUrl(data[key])) throw new Error(`${key} 请使用 HTTPS 链接或站内路径`);
  if (data.module === 'image' && !data.cover) throw new Error('图片创作案例需要成品图');
  if (data.date && (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date)) throw new Error('来源日期请使用有效的 YYYY-MM-DD，未知可留空');
  data.attachments = raw.attachments ?? [];
  if (!Array.isArray(data.attachments)) throw new Error('附件必须是列表');
  data.attachments = data.attachments.map(item => {
    if (!item || typeof item.label !== 'string' || !item.label.trim() || !safeUrl(item.file)) throw new Error('附件需要名称和有效地址');
    return { label: item.label, file: item.file };
  });
  return data;
}
export const parseDocument = text => normalizeEntry(importDocument(text));
export function applyImport(current, markdown) {
  const imported = importDocument(markdown);
  if (imported.module && imported.module !== current.module) throw new Error('导入文件所属模块与当前模块不同，请切换模块后新建');
  const merged = { ...current, ...imported, id: current.id, module: current.module, visible: current.visible === true };
  delete merged.importMarkdown;
  return normalizeEntry(merged);
}
export function validateEntries(entries) {
  const seen = new Set();
  for (const entry of entries) {
    const key = `${entry.module}/${entry.id}`;
    if (seen.has(key)) throw new Error(`内容 ID 重复：${key}`);
    seen.add(key);
  }
  return entries.filter(entry => entry.visible).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}
export function validateUpload(file) {
  if (!/\.(png|jpe?g|webp|gif|pdf|docx|xlsx|pptx|csv|txt|md)$/i.test(file.name)) throw new Error('仅支持图片、PDF、Office、CSV、TXT 和 Markdown；不支持脚本、HTML、压缩包或视频');
  if (file.size > 10 * 1024 * 1024) throw new Error('单个文件不能超过 10 MB，视频请填写链接');
}
export function serializeDocument(data) {
  const { body, ...fields } = data;
  return `---\n${stringify(fields)}---\n${body ?? ''}`;
}
