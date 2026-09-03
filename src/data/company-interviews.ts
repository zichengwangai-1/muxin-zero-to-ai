import {
  companyInterviewSources,
  type CompanyInterviewSource,
} from './company-interview-sources';

export interface CompanyInterviewEntry {
  id: string;
  title: string;
  company: string;
  position: string;
  round: string;
  platform: string;
  author?: string;
  sourceUrl?: string;
  content: string;
}

export interface CompanyInterviewGroup {
  company: string;
  entries: CompanyInterviewEntry[];
}

type InterviewIdentity = Pick<CompanyInterviewEntry, 'company' | 'position' | 'round'>;

const genericIdentity: InterviewIdentity = {
  company: '通用面经与求职经验',
  position: 'AI产品经理',
  round: '未说明',
};

const sourceIdentities: Record<string, Partial<InterviewIdentity>> = {
  '笔记01_小红书AI产品实习面经': { company: '小红书', position: 'AI与数据方向产品实习', round: '一面、二面、三面' },
  '笔记03_2天8面拿字节校招offer': { company: '字节跳动', position: 'AI产品经理', round: '多轮面试' },
  '笔记04_Kimi产品岗一面面经': { company: 'Kimi / 月之暗面', position: '产品实习', round: '一面' },
  '笔记09_美团AI产品二面面经': { company: '美团', position: '到店 AI 产品经理', round: '二面' },
  '笔记10_其实面字节产品就是要表现出你足够聪明': { company: '字节跳动' },
  '笔记12_字节面试不管问你啥记住一个原则': { company: '字节跳动' },
  '笔记13_鹅厂AI产品岗OC猝不及防': { company: '腾讯', position: 'AI产品经理', round: '终面' },
  '笔记14_Shopee_AI产品经理一面面经': { company: 'Shopee', position: 'AI策略产品经理', round: '一面' },
  '笔记15_入职MiniMax产品岗38k': { company: 'MiniMax', position: '产品经理' },
  '笔记16_26岁面了6家AI公司基本都过了': { company: '多家AI公司', round: '多轮面试' },
  'douyin-7': { company: '多家AI公司', round: '多轮面试' },
  'douyin-9': { position: 'AI车企产品经理', round: '全流程' },
  'douyin-16': { company: '字节跳动', round: '面试题集' },
  'douyin-17': { company: '字节跳动', position: 'TikTok Shop AI产品经理', round: '自我介绍' },
  'douyin-18': { company: '字节跳动', position: 'AI产品实习', round: '面试要点' },
  'douyin-19': { company: '字节跳动' },
  'douyin-20': { company: '阿里巴巴', round: '需求评审案例' },
  'douyin-21': { company: '阿里巴巴', position: '产品经理', round: '面试官标准' },
  'douyin-22': { company: '腾讯', position: 'AI产品经理', round: '需求评审案例' },
  'douyin-23': { round: '压力面' },
};

const companyOrder = [
  '字节跳动',
  '小红书',
  'Kimi / 月之暗面',
  '美团',
  '腾讯',
  'Shopee',
  'MiniMax',
  '阿里巴巴',
  '多家AI公司',
  '通用面经与求职经验',
];

function plainMarkdown(value: string) {
  return value.replace(/[*_`]/g, '').trim();
}

function extractAuthor(raw: string) {
  const match = raw.match(/^(?:>\s*)?(?:-\s*)?(?:\*\*)?作者(?:\*\*)?[:：]\s*(.+)$/m);
  return match ? plainMarkdown(match[1]).replace(/^@/, '') : undefined;
}

function extractSourceUrl(raw: string) {
  const sourceLine = raw.match(/^(?:>\s*)?(?:-\s*)?(?:\*\*)?(?:笔记链接|链接|来源)(?:\*\*)?[:：]\s*.*?(https?:\/\/\S+)/m);
  return sourceLine?.[1]?.replace(/[)）；;]+$/, '');
}

function headingLevel(line: string) {
  return line.match(/^(#{1,6})\s+/)?.[1].length;
}

function headingText(line: string) {
  return line.replace(/^#{1,6}\s+/, '').trim();
}

const skippedSection = /(?:offer|录用意向书|录用通知|意向书|图片说明|调研方法说明|附录)/i;
const droppedHeadingOnly = /^(?:正文|笔记信息|时间线|图片内容(?::|：)?.*|视频封面文字|封面图文字|目录)$/i;
const droppedLine = [
  /^(?:>\s*)?\*\*笔记信息\*\*$/i,
  /^(?:>\s*)?(?:-\s*)?(?:\*\*)?(?:作者|赞|点赞|日期|发布时间|图片数|形式|笔记链接|链接|来源|收藏|评论|调研时间|内容构成|筛选标准|共筛选视频|共\d+条视频|文字获取方式|整理时间)(?:\*\*)?[:：]/i,
  /^#\S+(?:\s+#\S+)+$/,
  /^-\s*\d{1,2}[.\/-]\d{1,2}\s+/,
  /^按钮[:：]/,
  /(?:篇幅问题|详细内容).*(?:图片里|图中)/,
];

export function cleanCompanyInterviewContent(raw: string) {
  const result: string[] = [];
  let skipLevel: number | undefined;

  raw.split('\n').forEach((rawLine, index) => {
    const line = rawLine.trim();
    const level = headingLevel(line);

    if (level && skipLevel && level <= skipLevel) skipLevel = undefined;
    if (skipLevel) return;

    if (level) {
      const text = headingText(line);
      if (index === 0) return;
      if (skippedSection.test(text)) {
        skipLevel = level;
        return;
      }
      if (droppedHeadingOnly.test(text) || /^第\d+张[:：]?封面/.test(text)) return;
    }

    if (line === '---' || droppedLine.some((pattern) => pattern.test(line))) return;
    if (/https?:\/\//i.test(line)) return;
    if (/^图片\d*[:：]/.test(line) && /(?:照片|截图|封面)/.test(line)) return;
    result.push(rawLine);
  });

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function identityFor(source: CompanyInterviewSource): InterviewIdentity {
  return { ...genericIdentity, ...sourceIdentities[source.id] };
}

async function buildEntry(source: CompanyInterviewSource): Promise<CompanyInterviewEntry> {
  const raw = await source.loadOriginal();
  return {
    id: source.id,
    title: source.title,
    platform: source.platform,
    ...identityFor(source),
    author: extractAuthor(raw),
    sourceUrl: extractSourceUrl(raw),
    content: cleanCompanyInterviewContent(raw),
  };
}

let companyLibraryPromise: Promise<CompanyInterviewGroup[]> | undefined;

export function loadCompanyInterviewLibrary() {
  companyLibraryPromise ??= Promise.all(companyInterviewSources.map(buildEntry)).then((entries) => {
    const grouped = new Map<string, CompanyInterviewEntry[]>();
    entries.forEach((entry) => {
      const current = grouped.get(entry.company) ?? [];
      current.push(entry);
      grouped.set(entry.company, current);
    });

    return [...grouped.entries()]
      .map(([company, companyEntries]) => ({
        company,
        entries: companyEntries.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')),
      }))
      .sort((a, b) => companyOrder.indexOf(a.company) - companyOrder.indexOf(b.company));
  });

  return companyLibraryPromise;
}
