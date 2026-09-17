import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createConfig } from './cms-config.mjs';
import { parseDocument, validateEntries } from '../src/lib/cms-format.mjs';
import { globSync } from 'node:fs';

const imageData = JSON.parse(await readFile('src/content/practice/image/精选案例.json', 'utf8'));
const options = imageData.entries.map(entry => ({ label: `图片 · ${entry.title}`, value: `image/${entry.id}` }));
for (const module of ['development', 'games']) for (const file of globSync(`src/content/practice/${module}/*/index.json`)) {
  const entry = JSON.parse(await readFile(file, 'utf8'));
  options.push({ label: `教程 · ${entry.title}`, value: `${module}/${entry.id}` });
}
// Legacy heading IDs match the existing reader, without altering original Markdown.
for (const file of globSync('src/content/practice/prompts/*.md')) {
  const text = await readFile(file, 'utf8');
  let category = 0, index = 0, fence = '';
  for (const line of text.split('\n')) {
    const delimiter = line.match(/^(`{3,}|~{3,})/);
    if (delimiter) { if (!fence) fence = delimiter[1]; else if (delimiter[1][0] === fence[0] && delimiter[1].length >= fence.length) fence = ''; continue; }
    if (fence) continue;
    if (line.startsWith('## ')) { category++; index = 0; }
    if (line.startsWith('### ') && category) { index++; options.push({ label: `Prompt · ${line.slice(4)}`, value: `prompts/${file.split('/').pop().replace(/\.md$/, '')}-${category}-${index}` }); }
  }
}
const entries = [];
for (const file of globSync('src/content/managed/*/*.md')) {
  const entry = parseDocument(await readFile(file, 'utf8'));
  if (!file.endsWith(`/${entry.module}/${entry.id}.md`)) throw new Error(`文件名与 ID 不符：${file}`);
  if (options.some(option => option.value === `${entry.module}/${entry.id}`)) throw new Error(`新内容与已有内容 ID 重复：${entry.id}`);
  entries.push(entry);
}
validateEntries(entries);
await mkdir('public/admin', { recursive: true });
for (const collection of createConfig({ branch: 'validation' }).collections) if (collection.folder) await mkdir(collection.folder, { recursive: true });
await writeFile('public/admin/legacy-options.json', JSON.stringify(options, null, 2));
await build({ entryPoints: ['scripts/cms-admin.mjs'], bundle: true, format: 'esm', outfile: 'public/admin/runtime.js', minify: true, target: 'es2022' });
console.log(`后台准备完成：6 个模块，${options.length} 个已有条目，${entries.length} 个新增条目。`);
