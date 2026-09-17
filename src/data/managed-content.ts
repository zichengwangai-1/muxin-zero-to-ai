import { parseDocument, validateEntries } from '../lib/cms-format.mjs';
export type { ManagedEntry } from '../lib/cms-format.mjs';

const documents = import.meta.glob('../content/managed/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const entries = Object.entries(documents).map(([path, markdown]) => {
  try {
    const entry = parseDocument(markdown);
    if (!path.endsWith(`/${entry.module}/${entry.id}.md`)) throw new Error('文件路径与内容 ID 或模块不匹配');
    return entry;
  } catch (error) { throw new Error(`${path}: ${error instanceof Error ? error.message : String(error)}`); }
});
export const managedEntries = validateEntries(entries);
export const getManagedEntries = (module?: string) => managedEntries.filter(entry => entry.module === module);
export const getManagedEntry = (module?: string, id?: string) => managedEntries.find(entry => entry.module === module && entry.id === id);
