export interface CompanyInterviewSource {
  id: string;
  title: string;
  platform: '小红书' | '抖音';
  loadOriginal: () => Promise<string>;
}

const rawModules = import.meta.glob('./interview-sources/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

const standaloneFiles = [
  '小红书面经_AI产品面试出彩回答思路.md',
  '笔记01_小红书AI产品实习面经.md',
  '笔记03_2天8面拿字节校招offer.md',
  '笔记04_Kimi产品岗一面面经.md',
  '笔记05_AI产品经理怎么做评测.md',
  '笔记06_转行AI产品经理真正要学的7件事.md',
  '笔记07_如何写好并迭代你的prompt.md',
  '笔记08_幻觉为什么不能只改Prompt.md',
  '笔记09_美团AI产品二面面经.md',
  '笔记10_其实面字节产品就是要表现出你足够聪明.md',
  '笔记11_一个狠但能让你5天拿下AI产品面试的方法.md',
  '笔记12_字节面试不管问你啥记住一个原则.md',
  '笔记13_鹅厂AI产品岗OC猝不及防.md',
  '笔记14_Shopee_AI产品经理一面面经.md',
  '笔记15_入职MiniMax产品岗38k.md',
  '笔记16_26岁面了6家AI公司基本都过了.md',
  '笔记17_今天上午面了六个AI产品全是半吊子.md',
  '笔记18_一下午面6个AI产品经理全是半吊子.md',
  '笔记20_211本投200份AI产品经理0面试.md',
  '笔记21_AI产品经理面试情景题如何设计一个Agent.md',
  '笔记23_面试官问RAG策略说清这三层检索.md',
] as const;

function loadRaw(filename: string) {
  const loader = rawModules[`./interview-sources/${filename}`];
  if (!loader) return Promise.reject(new Error(`找不到原始笔记：${filename}`));
  return loader();
}

function titleFromFilename(filename: string) {
  return filename
    .replace(/\.md$/, '')
    .replace(/^笔记\d+_/, '')
    .replace(/^小红书面经_/, '');
}

function splitDouyinCollection(raw: string) {
  const matches = [...raw.matchAll(/^###\s+(\d+)\.\s+(.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? raw.length;
    return raw.slice(start, end).trim();
  });
}

const standaloneSources: CompanyInterviewSource[] = standaloneFiles.map((filename) => ({
  id: filename.replace(/\.md$/, ''),
  title: titleFromFilename(filename),
  platform: '小红书',
  loadOriginal: () => loadRaw(filename),
}));

const douyinSources: CompanyInterviewSource[] = Array.from({ length: 23 }, (_, index) => ({
  id: `douyin-${index + 1}`,
  title: `抖音面经 ${String(index + 1).padStart(2, '0')}`,
  platform: '抖音',
  loadOriginal: async () => {
    const raw = await loadRaw('抖音AI产品经理面试_完整文案合集_23条.md');
    return splitDouyinCollection(raw)[index] ?? '';
  },
}));

export const companyInterviewSources = [...standaloneSources, ...douyinSources];
