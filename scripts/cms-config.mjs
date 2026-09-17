const modules = [['prompts', '01 高频精华 Prompt 库'], ['image', '02 AI图片创作'], ['video', '03 AI视频创作'], ['office', '04 AI办公提效'], ['development', '05 AI网站与产品开发'], ['games', '06 AI游戏与互动创作']];
const field = (name, label, widget = 'string', extra = {}) => ({ name, label, widget, required: false, ...extra });
const required = (name, label, widget = 'string', extra = {}) => field(name, label, widget, { required: true, ...extra });
const image = (name, label) => field(name, label, 'image', { media_library: { config: { max_file_size: 10485760 } } });
const sourceFields = [field('author', '原作者'), field('source', '原文链接（HTTPS）'), field('date', '来源日期（未知留空）', 'string', { hint: 'YYYY-MM-DD，不要用录入日期替代' })];
export function createConfig({ branch, local = false, legacyOptions = [] }) {
  const collections = modules.map(([id, label]) => ({
    name: id, label, label_singular: '案例', folder: `src/content/managed/${id}`, create: true, delete: false,
    slug: '{{id}}', identifier_field: 'title', format: 'frontmatter', extension: 'md', preview_path: 'practice/{{module}}/{{id}}',
    summary: '{{title}} · {{category}}', sortable_fields: ['order', 'title'],
    view_filters: [{ label: '已展示', field: 'visible', pattern: true }, { label: '已下架', field: 'visible', pattern: false }],
    fields: [
      required('id', '固定内容 ID', 'stable-id', { hint: '首次填写小写英文，例如 excel-monthly-report；保存后不可修改' }),
      field('module', '所属模块', 'hidden', { default: id }),
      required('title', '案例标题'), required('category', '分类'), required('summary', '一句话介绍', 'text'),
      field('visible', '发布后在网站展示', 'boolean', { default: false, hint: '草稿不会上线；下架时关闭此开关再发布' }),
      field('order', '排序（越小越靠前）', 'number', { default: 100, value_type: 'int' }),
      field('importMarkdown', '导入 Markdown（可选）', 'md-import', { hint: '先填固定 ID。导入后先保存草稿，导入字段会填入表单；不会自动上架。' }),
      { ...image('cover', '成品截图'), required: id === 'image' }, field('tools', '使用工具与模型'),
      field('reference', '参考图要求'), field('result', '你将做出什么', 'text'),
      field('prepare', '准备材料', 'markdown'), field('steps', '操作步骤 SOP', 'markdown'),
      required('prompt', '完整 Prompt（原样复制）', 'text'), field('checks', '结果检查方法', 'markdown'),
      field('body', '补充说明', 'markdown'),
      field('attachments', '练习文件与附件', 'list', { fields: [required('label', '附件名称'), required('file', '文件', 'file', { media_library: { config: { max_file_size: 10485760 } } })] }),
      ...(id === 'video' ? [field('video', '成片链接（HTTPS）')] : []),
      field('tested', '实测状态', 'select', { default: '尚未实测', options: ['尚未实测', '本站已实测', '仅核对原始来源'] }),
      ...sourceFields,
    ],
  }));
  // Entry validation runs after applying imports. Requiring these controls first
  // would prevent a complete Markdown import from being saved into an empty form.
  for (const collection of collections) for (const item of collection.fields) {
    if (['title', 'category', 'summary', 'prompt', 'cover'].includes(item.name)) {
      if (item.required) item.hint = '必填，可手动填写，也可由 Markdown 导入；保存时统一检查。';
      item.required = false;
    }
  }
  const imageFields = [required('id', '原案例编号', 'number'), required('title', '标题'), required('category', '分类'), required('description', '简介', 'text'), field('instructions', '使用说明', 'text'), field('reference', '需参考图', 'boolean'), image('image', '原图'), field('width', '图片宽度', 'number'), field('height', '图片高度', 'number'), required('prompt', '完整 Prompt', 'text'), field('sourceLabel', '作者'), field('sourceUrl', '来源链接'), field('githubUrl', '仓库链接'), field('sourceDate', '来源日期'), field('dateEvidence', '日期依据', 'text'), field('imageSource', '原图下载来源')];
  const tutorialFields = [required('id', '固定 ID', 'stable-id'), field('module', '模块', 'stable-id'), required('title', '标题'), field('summary', '简介', 'text'), field('level', '原有内容标签'), field('tools', '工具', 'list'), ...sourceFields, field('result', '成品说明', 'text'), ...['prepare', 'steps', 'checks'].map((name, i) => field(name, ['准备材料', '步骤', '检查项'][i], 'list')), field('limits', '限制说明', 'text'), field('preview', '原图说明', 'text'), field('demo', '原有链接'), required('prompt', '完整 Prompt', 'text'), field('promptOrigin', '提示词来源'), field('testedAt', '实测日期')];
  collections.push({ name: 'legacy', label: '已有资料 · 原格式编辑', delete: false, files: [
    { name: 'images', label: '20 个图片案例', file: 'src/content/practice/image/精选案例.json', fields: [field('repository', '仓库'), field('importedAt', '整理日期'), field('notes', '备注', 'text'), field('entries', '图片案例（拖动排序）', 'list', { summary: '{{fields.title}}', fields: imageFields })] },
    { name: 'prompts-original', label: '原有 Prompt 精选', file: 'src/content/practice/prompts/精选.md', format: 'frontmatter', fields: [required('body', '原文 Markdown（保留分类与代码块格式）', 'markdown')] },
    ...[['development', 'kimi-portfolio', '个人网站教程'], ['development', 'lovable-wordpress', 'WordPress 迁移教程'], ['games', 'star-breaker', '打砖块教程'], ['games', 'godot-targets', 'Godot 游戏教程']].map(([module, id, label]) => ({ name: id, label, file: `src/content/practice/${module}/${id}/index.json`, fields: tutorialFields })),
    { name: 'visibility', label: '已有资料下架管理', file: 'src/content/managed/settings.json', fields: [field('hiddenLegacyIds', '暂不展示的条目（取消选择可恢复）', 'select', { multiple: true, options: legacyOptions })] },
  ] });
  return {
    load_config_file: false, locale: 'zh_Hans', backend: { name: 'github', repo: 'zichengwangai-1/muxin-zero-to-ai', branch, auth_scope: 'public_repo', squash_merges: true },
    site_url: 'https://muxin-zero-to-ai.netlify.app', display_url: '/practice', site_domain: 'muxin-zero-to-ai.netlify.app',
    logo_url: '/admin/logo.svg', publish_mode: 'editorial_workflow', media_folder: 'public/uploads', public_folder: '/uploads',
    ...(local ? { local_backend: { url: 'http://127.0.0.1:8081/api/v1' } } : {}), collections,
  };
}
