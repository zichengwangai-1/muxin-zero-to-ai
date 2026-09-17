import { legacyVisible } from './content-visibility';

export interface PromptEntry {
  id: string;
  title: string;
  description: string;
  tips: string;
  prompt: string;
}
export interface PromptCategory { id: string; name: string; entries: PromptEntry[] }

// Read headings only outside fenced blocks: prompts can contain their own Markdown.
export function parsePromptCollection(markdown: string, collectionId: string): PromptCategory[] {
  const categories: PromptCategory[] = [];
  let category: PromptCategory | undefined;
  let entry: PromptEntry | undefined;
  let fence = '';
  let code: string[] = [];
  for (const line of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const delimiter = line.match(/^(`{3,}|~{3,})/);
    if (fence) {
      if (delimiter && delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length) {
        if (entry) entry.prompt += (entry.prompt ? '\n\n' : '') + code.join('\n');
        fence = ''; code = [];
      } else code.push(line);
      continue;
    }
    if (delimiter) { fence = delimiter[1]; continue; }
    if (line.startsWith('## ')) {
      category = { id: `${collectionId}-${categories.length + 1}`, name: line.slice(3).replace(/^[一二三四五六七八九十]+、/, '').replace(/（\d+\s*个）\s*$/, '').trim(), entries: [] };
      categories.push(category); entry = undefined;
    } else if (line.startsWith('### ') && category) {
      entry = { id: `${category.id}-${category.entries.length + 1}`, title: line.slice(4).replace(/^[①-⑳]\s*/, ''), description: '', tips: '', prompt: '' };
      category.entries.push(entry);
    } else if (entry && line.startsWith('**简介**')) {
      entry.description = line.replace(/^\*\*简介\*\*[：:]\s*/, '').replace(/\*\*/g, '');
    } else if (entry && line.startsWith('**使用要点**')) {
      entry.tips = line.replace(/^\*\*使用要点\*\*[：:]\s*/, '').replace(/\*\*/g, '');
    }
  }
  return categories.map(category => ({ ...category, entries: category.entries.filter(entry => entry.prompt.trim()) })).filter(category => category.entries.length);
}

const collections = import.meta.glob('../content/practice/prompts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
export const promptCategories = Object.entries(collections).sort(([a], [b]) => a.localeCompare(b)).flatMap(([path, content]) => parsePromptCollection(content, path.split('/').pop()!.replace(/\.md$/, ''))).map(category => ({ ...category, entries: category.entries.filter(entry => legacyVisible('prompts', entry.id)) })).filter(category => category.entries.length);
export const promptCount = promptCategories.reduce((sum, category) => sum + category.entries.length, 0);
