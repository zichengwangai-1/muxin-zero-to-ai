import { createConfig } from './cms-config.mjs';
import { importDocument, applyImport, normalizeEntry, safeUrl, validateUpload } from '../src/lib/cms-format.mjs';

const { CMS, h, createClass } = window;
const local = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).get('local') === '1';
const mode = document.getElementById('admin-mode');
const fail = message => { const box = document.getElementById('admin-error'); box.hidden = false; box.textContent = message; mode.textContent = '尚未连接'; };

CMS.registerWidget('stable-id', createClass({
  getInitialState() { return { locked: Boolean(this.props.value) }; },
  render() { return h('input', { id: this.props.forID, className: this.props.classNameWrapper, value: this.props.value || '', readOnly: this.state.locked, onChange: e => this.props.onChange(e.target.value), 'aria-label': this.props.field.get('label') }); },
}));

CMS.registerWidget('md-import', createClass({
  getInitialState() { return { error: '', preview: '' }; },
  async read(event) {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      if (!/\.md$/i.test(file.name) || file.size > 1_000_000) throw new Error('请选择小于 1 MB 的 .md 文件');
      const text = await file.text(); const parsed = importDocument(text);
      this.props.onChange(text);
      this.setState({ error: '', preview: JSON.stringify(parsed, null, 2) });
    } catch (error) { this.props.onChange(''); this.setState({ error: error.message, preview: '' }); }
    event.target.value = '';
  },
  render() { return h('div', { className: 'cms-import' },
    h('p', {}, '导入预览 → 保存草稿 → 字段自动填入。固定 ID、所属模块和展示开关不会被导入覆盖。再次保存前可修改表单。'),
    h('label', {}, '选择 Markdown 文件', h('input', { id: this.props.forID, type: 'file', accept: '.md', onChange: this.read })),
    this.state.error && h('p', { role: 'alert' }, this.state.error),
    this.props.value && h('div', {}, h('strong', {}, '待导入内容（将替换对应字段）'), h('pre', {}, this.state.preview || this.props.value), h('button', { type: 'button', onClick: () => { this.props.onChange(''); this.setState({ preview: '', error: '' }); } }, '取消本次导入')),
    h('a', { href: '/admin/内容模板.md', download: true }, '下载标准模板'));
  },
}));

const Preview = createClass({
  render() {
    const raw = this.props.entry.get('data').toJS();
    let entry = raw;
    try { if (raw.importMarkdown) entry = applyImport(raw, raw.importMarkdown); } catch (error) { return h('p', { style: { color: '#a22' } }, error.message); }
    const cover = safeUrl(entry.cover);
    return h('article', { style: { padding: '28px', fontFamily: 'system-ui', lineHeight: 1.8, color: '#172033', overflowWrap: 'anywhere' } },
      h('small', {}, `${entry.category || '未分类'} · ${entry.visible ? '发布后展示' : '不在网站展示'}`), h('h1', {}, entry.title || '未填写标题'), h('p', {}, entry.summary),
      cover && h('img', { src: String(this.props.getAsset(cover)), alt: entry.title || '成品图', style: { maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' } }),
      ...[['成果', entry.result], ['准备材料', entry.prepare], ['操作步骤', entry.steps], ['完整 Prompt', entry.prompt], ['结果检查', entry.checks], ['补充说明', entry.body]].filter(([, content]) => content).map(([title, content]) => h('section', { key: title }, h('h2', {}, title), h('pre', { style: { whiteSpace: 'pre-wrap', font: 'inherit', background: '#f5f7fa', padding: '16px', borderRadius: '12px' } }, content))),
      entry.attachments?.length ? h('ul', {}, ...entry.attachments.map((a, i) => h('li', { key: i }, a.label))) : null,
      h('p', {}, `${entry.author || ''} ${entry.date || ''} · ${entry.tested || '尚未实测'}`));
  },
});

function preparedEntry(entry) {
  const raw = entry.get('data').toJS();
  const next = raw.importMarkdown ? applyImport(raw, raw.importMarkdown) : normalizeEntry(raw);
  const path = entry.get('path');
  if (path && !path.endsWith(`/${next.id}.md`)) throw new Error('已保存内容的固定 ID 不可修改，请新建案例');
  return entry.get('data').merge(next).delete('importMarkdown');
}
for (const name of ['preSave', 'prePublish']) CMS.registerEventListener({ name, handler: ({ entry }) => {
  if (entry.get('collection') !== 'legacy') return preparedEntry(entry);
  return entry.get('data');
} });
CMS.registerEventListener({ name: 'postPublish', handler: () => { mode.textContent = local ? '已保存到本机文件 · 未提交 GitHub，未更新线上网站' : '内容已提交；请查看部署状态，构建成功后网站更新。'; } });
// Imports normalize multiple fields in preSave. Re-open the saved record so the
// editor's dirty-state baseline matches what was persisted (including booleans).
for (const name of ['postSave', 'postPublish']) CMS.registerEventListener({ name, handler: ({ entry }) => {
  const collection = entry.get('collection');
  const id = entry.getIn(['data', 'id']);
  if (collection !== 'legacy' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(id || '')) {
    setTimeout(() => { location.replace(`${location.pathname}${location.search}#/collections/${encodeURIComponent(collection)}/entries/${id}`); location.reload(); }, 100);
  }
} });

function checkFiles(event) {
  const files = event.type === 'drop' ? event.dataTransfer?.files : event.target.files;
  if (!files?.length) return;
  try { for (const file of files) validateUpload(file); }
  catch (error) { event.preventDefault(); event.stopImmediatePropagation(); alert(error.message); }
}
document.addEventListener('change', checkFiles, true);
document.addEventListener('drop', checkFiles, true);

try {
  if (!CMS) throw new Error('编辑器资源未加载，请刷新页面');
  const [settings, options] = await Promise.all([fetch('/admin/site-settings.json').then(r => r.json()), fetch('/admin/legacy-options.json').then(r => r.json())]);
  if (!local && !settings.publishBranch) throw new Error('在线后台尚未启用：需要先核验 Netlify 生产分支并配置 GitHub 登录。请查看录入指南中的上线步骤。本地检查可使用 /admin/?local=1（仅开发人员）。');
  mode.textContent = local ? '本地测试 · 保存会写入本机文件，不会更新线上网站' : '草稿不影响线上 · 发布后等待构建完成';
  const config = createConfig({ branch: settings.publishBranch || 'local-validation', local, legacyOptions: options });
  if (local) config.site_url = location.origin;
  for (const collection of config.collections.filter(c => c.name !== 'legacy')) CMS.registerPreviewTemplate(collection.name, Preview);
  CMS.init({ config });
} catch (error) { fail(error.message); }
