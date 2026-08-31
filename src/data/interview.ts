export type InterviewCategoryId =
  | 'personal'
  | 'project'
  | 'concepts'
  | 'sense'
  | 'agent'
  | 'rag'
  | 'prompt'
  | 'evaluation'
  | 'model'
  | 'safety';

export interface InterviewCategory {
  id: InterviewCategoryId;
  index: string;
  title: string;
  shortTitle: string;
  summary: string;
  questions: string[];
  mnemonic: string;
  mnemonicMeaning: string;
  memoryMethod: string;
  answerStructure: string[];
  tone: 'blue' | 'violet' | 'cyan' | 'green' | 'orange' | 'pink';
}

export interface InterviewSource {
  id: string;
  title: string;
  platform: string;
  preview: string;
  categories: InterviewCategoryId[];
  note?: string;
  loadOriginal: () => Promise<string>;
}

export const interviewCategories: InterviewCategory[] = [
  {
    id: 'personal', index: '01', title: '个人表达与岗位动机', shortTitle: '个人表达', tone: 'blue',
    summary: '让面试官快速听懂：你是谁、为什么转AI、你与岗位为什么匹配。',
    questions: ['请做一个3分钟自我介绍', '为什么选择AI产品经理？', '为什么选择我们公司？', '你的优势、短板和职业规划是什么？'],
    mnemonic: '岗—我—证—愿', mnemonicMeaning: '岗位需要什么 → 我是谁 → 经历证据 → 加入意愿',
    memoryMethod: '把四个字想成一封求职信：先写收件岗位，再介绍自己，用项目盖章，最后写下加入理由。',
    answerStructure: ['先复述岗位最需要的能力', '只讲与岗位相关的经历', '每个判断都补一个项目证据', '说明选择这家公司而非泛泛选择AI'],
  },
  {
    id: 'project', index: '02', title: '项目深挖、AI PRD与协作', shortTitle: '项目深挖', tone: 'violet',
    summary: '把“参与过项目”讲成一条有判断、有行动、有数据的完整证据链。',
    questions: ['为什么做这个项目？', '你具体负责什么？', '方案为什么这样取舍？', '如何证明项目有效？', '重新做一次会改什么？'],
    mnemonic: '需—策—行—数—复', mnemonicMeaning: '需求 → 决策 → 行动 → 数据 → 复盘',
    memoryMethod: '用五格电影分镜回忆项目：问题出现、做出选择、推动落地、看到数字、回头复盘。',
    answerStructure: ['用一句话交代用户问题', '说清自己的关键判断', '突出个人动作与协作难点', '用前后对比或指标证明', '补充失败与下一步'],
  },
  {
    id: 'concepts', index: '03', title: 'AI技术概念与岗位认知', shortTitle: '技术概念', tone: 'cyan',
    summary: '不背术语，用产品语言讲清技术怎么工作、什么时候使用、边界在哪里。',
    questions: ['RAG和微调有什么区别？', 'Workflow和Agent有什么区别？', 'AI产品经理需要懂代码吗？', '大模型为什么会产生不确定输出？'],
    mnemonic: '是什么—怎么跑—何时用—边界', mnemonicMeaning: '定义 → 运行过程 → 使用场景 → 能力限制',
    memoryMethod: '费曼学习法：假装向完全不懂AI的同事解释；出现术语时，必须马上换成一个日常例子。',
    answerStructure: ['先用一句白话下定义', '再讲最短运行链路', '给一个合适和不合适的场景', '最后落回产品决策'],
  },
  {
    id: 'sense', index: '04', title: 'AI需求判断与商业价值', shortTitle: '需求判断', tone: 'green',
    summary: '判断一个需求是否真的值得用AI，而不是为了追热点强行增加AI。',
    questions: ['这个需求为什么一定要用AI？', '如何判断是真需求还是伪需求？', 'MVP先验证什么？', '如何判断商业价值和ROI？'],
    mnemonic: '真—值—数—险', mnemonicMeaning: '真实需求 → 用户/业务价值 → 数据条件 → 风险边界',
    memoryMethod: '想象四道闸门：需求不真、价值不足、数据不够或风险不可控，任何一道没通过都不急着做。',
    answerStructure: ['先找用户原本怎样解决', '判断AI是否带来数量级改善', '检查模型和数据条件', '设计最小验证与停止条件'],
  },
  {
    id: 'agent', index: '05', title: 'Agent产品设计与落地', shortTitle: 'Agent设计', tone: 'violet',
    summary: '从自主边界到工具调用、记忆、状态和兜底，讲完整一个可运行的Agent。',
    questions: ['如何从零设计一个Agent？', 'Agent的自主边界怎么定？', '工具调用失败怎么办？', '如何评估Agent是否可靠？'],
    mnemonic: '判—链—控—验', mnemonicMeaning: '判断真需求 → 设计能力链 → 控制风险 → 验证结果',
    memoryMethod: '控制塔图片记忆：眼睛负责感知，大脑负责规划，双手调用工具，笔记本保存记忆，红色刹车负责兜底。',
    answerStructure: ['判断是否需要自主执行', '画出任务、工具、记忆和状态链', '标出确认点、重试和人工接管', '用结果与过程双重评测'],
  },
  {
    id: 'rag', index: '06', title: 'RAG与企业知识库', shortTitle: 'RAG知识库', tone: 'blue',
    summary: '围绕“找得准、找得全、答得有依据”，讲清检索与生成的完整链路。',
    questions: ['RAG检索策略怎么设计？', '向量检索为什么不够？', '召回差和生成差怎么区分？', '什么时候用RAG，什么时候微调？'],
    mnemonic: '切—改—召—融—排—生—测', mnemonicMeaning: '切分 → 改写 → 召回 → 融合 → 重排 → 生成 → 评测',
    memoryMethod: '漏斗图片记忆：文档先切成小块，多路捞上来，合并去重，再精排，只把最有用的证据交给模型。',
    answerStructure: ['先说业务目标是“准和全”', '按检索链路逐层说明', '补充权限、时效和成本限制', '分开评测召回质量与回答质量'],
  },
  {
    id: 'prompt', index: '07', title: 'Prompt与AI交互设计', shortTitle: 'Prompt设计', tone: 'pink',
    summary: '把Prompt当成可测试、可迭代的产品功能，而不是一段神秘咒语。',
    questions: ['如何设计一个稳定Prompt？', 'Few-shot什么时候有用？', 'Prompt如何测试和迭代？', '哪些问题不能只靠Prompt解决？'],
    mnemonic: '角—任—背—要—限—例', mnemonicMeaning: '角色 → 任务 → 背景 → 要求 → 限制 → 示例',
    memoryMethod: '把Prompt想象成给新同事的任务单：他是谁、做什么、拿什么材料、按什么标准、不能做什么、参考什么。',
    answerStructure: ['把模糊需求拆成显性标准', '用结构化输入输出降低歧义', '用示例而非形容词定义风格', '通过Bad Case单变量迭代'],
  },
  {
    id: 'evaluation', index: '08', title: 'AI评测体系与Bad Case', shortTitle: 'AI评测', tone: 'orange',
    summary: '把“感觉回答不错”变成可比较、可归因、能推动迭代的质量标准。',
    questions: ['AI产品经理怎么做评测？', '测试集从哪里来？', '评测指标如何设计？', 'Bad Case如何归因和排序？', 'Agent过程应该怎么评？'],
    mnemonic: '目—集—尺—跑—闭', mnemonicMeaning: '目标 → 数据集 → 评分尺子 → 执行评测 → 迭代闭环',
    memoryMethod: '考试现场图片记忆：目标是考试目的，题库是测试集，Rubric是评分尺，执行是考试，错题本推动下一轮改进。',
    answerStructure: ['明确产品阶段与评测边界', '覆盖真实、边界和高风险样本', '把“好”拆成可执行Rubric', '自动评测结合人工复核', '归因、排优先级并回归验证'],
  },
  {
    id: 'model', index: '09', title: '模型选型、成本与性能', shortTitle: '模型选型', tone: 'cyan',
    summary: '不背模型排行榜，从业务测试集出发平衡质量、速度、成本和隐私。',
    questions: ['模型选型看哪些维度？', '为什么不能只看Benchmark？', '质量、速度和成本如何权衡？', '什么时候需要大小模型路由？'],
    mnemonic: '业—测—取—迭', mnemonicMeaning: '业务目标 → 业务评测 → 权衡取舍 → 线上迭代',
    memoryMethod: '天平图片记忆：四个托盘分别放质量、速度、成本和隐私；不存在永远最好的模型，只有当前业务下的平衡。',
    answerStructure: ['明确场景与不可妥协项', '构建小型真实业务测试集', '横向比较质量、延迟、成本和部署', '灰度上线并持续路由优化'],
  },
  {
    id: 'safety', index: '10', title: '幻觉、安全、稳定性与兜底', shortTitle: '安全兜底', tone: 'orange',
    summary: '承认模型不确定性，通过证据、约束、验证、降级和监控控制风险。',
    questions: ['幻觉为什么不能只改Prompt？', '如何设计拒答和降级？', 'Agent越权怎么办？', '线上Bad Case如何监控？'],
    mnemonic: '边—证—控—验—监', mnemonicMeaning: '能力边界 → 引用证据 → 生成约束 → 独立验证 → 线上监控',
    memoryMethod: '五层盾牌图片记忆：先圈边界，再给证据，约束生成，独立核验，最后用监控捕捉漏网问题。',
    answerStructure: ['先按严重性划分风险', '尽量让回答基于可追溯证据', '关键动作增加确认和权限校验', '失败时拒答、降级或转人工', '把线上问题沉淀回评测集'],
  },
];

const standaloneCategoryMap: Record<string, InterviewCategoryId[]> = {
  '笔记01_小红书AI产品实习面经.md': ['personal', 'concepts', 'sense', 'agent', 'rag', 'evaluation', 'safety'],
  '笔记02_分享AI产品面试出彩回答思路.md': ['sense'],
  '小红书面经_AI产品面试出彩回答思路.md': ['sense'],
  '笔记03_2天8面拿字节校招offer.md': ['personal', 'project'],
  '笔记04_Kimi产品岗一面面经.md': ['personal', 'project', 'sense'],
  '笔记05_AI产品经理怎么做评测.md': ['rag', 'evaluation', 'model'],
  '笔记06_转行AI产品经理真正要学的7件事.md': ['concepts', 'agent', 'rag', 'prompt'],
  '笔记07_如何写好并迭代你的prompt.md': ['prompt'],
  '笔记08_幻觉为什么不能只改Prompt.md': ['rag', 'prompt', 'evaluation', 'safety'],
  '笔记09_美团AI产品二面面经.md': ['personal', 'project', 'concepts', 'sense', 'rag', 'evaluation'],
  '笔记10_其实面字节产品就是要表现出你足够聪明.md': ['personal', 'sense', 'agent', 'rag', 'prompt', 'evaluation', 'safety'],
  '笔记11_一个狠但能让你5天拿下AI产品面试的方法.md': ['concepts', 'agent', 'rag', 'prompt', 'evaluation'],
  '笔记12_字节面试不管问你啥记住一个原则.md': ['personal'],
  '笔记13_鹅厂AI产品岗OC猝不及防.md': ['project', 'agent', 'rag', 'safety'],
  '笔记14_Shopee_AI产品经理一面面经.md': ['project', 'agent', 'rag', 'prompt', 'evaluation', 'safety'],
  '笔记15_入职MiniMax产品岗38k.md': ['concepts', 'agent', 'rag', 'model'],
  '笔记16_26岁面了6家AI公司基本都过了.md': ['sense', 'evaluation', 'model', 'safety'],
  '笔记17_今天上午面了六个AI产品全是半吊子.md': ['project', 'sense', 'evaluation', 'model', 'safety'],
  '笔记18_一下午面6个AI产品经理全是半吊子.md': ['agent', 'rag', 'evaluation', 'safety'],
  '笔记20_211本投200份AI产品经理0面试.md': ['project', 'agent', 'rag'],
  '笔记21_AI产品经理面试情景题如何设计一个Agent.md': ['sense', 'agent', 'evaluation', 'safety'],
  '笔记23_面试官问RAG策略说清这三层检索.md': ['rag'],
};

const douyinCategoryMap: Record<number, InterviewCategoryId[]> = {
  1: ['agent', 'evaluation', 'model', 'safety'], 2: ['agent', 'safety'], 3: ['rag'], 4: ['prompt'],
  5: ['project', 'concepts'], 6: ['concepts', 'sense'], 7: ['personal', 'concepts', 'sense'],
  8: ['project', 'sense', 'agent', 'evaluation', 'safety'], 9: ['personal', 'project', 'sense'],
  10: ['concepts'], 11: ['personal'], 12: ['project'], 13: ['evaluation'],
  14: ['project', 'prompt', 'evaluation', 'model', 'safety'], 15: ['rag', 'evaluation', 'model'],
  16: ['concepts', 'agent', 'rag', 'model', 'safety'], 17: ['personal', 'project', 'sense'],
  18: ['personal'], 19: ['concepts'], 20: ['sense', 'model'], 21: ['personal', 'project'],
  22: ['sense', 'model', 'safety'], 23: ['project', 'evaluation'],
};

const rawModules = import.meta.glob('./interview-sources/*.md', {
  query: '?raw',
  import: 'default',
}) as Record<string, () => Promise<string>>;

function cleanMarkdown(value: string) {
  return value
    .replace(/^#{1,6}\s*/g, '')
    .replace(/\*\*/g, '')
    .replace(/^>\s*/g, '')
    .trim();
}

function noteFor(filename: string) {
  if (filename === '小红书面经_AI产品面试出彩回答思路.md') return '与“笔记02”来自同一篇小红书内容，保留用于来源核对。';
  if (filename === '笔记11_一个狠但能让你5天拿下AI产品面试的方法.md') return '原文工具调用部分存在截断，未补写缺失内容。';
  if (filename === '笔记14_Shopee_AI产品经理一面面经.md') return '原文结尾存在截断，未推测缺失结论。';
  if (filename === '笔记17_今天上午面了六个AI产品全是半吊子.md') return '原文部分回答存在截断，未推测缺失内容。';
  if (filename.includes('MiniMax') || filename.startsWith('笔记16_') || filename.startsWith('笔记20_')) return '薪资、Offer和效果数字属于个人叙述，阅读时请勿视为行业事实。';
  return undefined;
}

function splitDouyinCollection(raw: string) {
  const matches = [...raw.matchAll(/^###\s+(\d+)\.\s+(.+)$/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = matches[index + 1]?.index ?? raw.length;
    return raw.slice(start, end).trim();
  });
}

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

const douyinTitles = [
  '你怎么评估一个Agent靠不靠谱？', '如何搭建Agent', 'RAG三层检索策略', '高分AI交互设计Prompt答题思路',
  'AI Coding考查点有哪些？', 'AI将如何赋能产品经理', 'BAT AI产品经理面经', '大厂AI产品经理模拟面试',
  'AI车企产品经理面试全流程', 'AI产品经理职业发展和求职方向', '零基础多久拿到AI产品Offer',
  '如何用AI快速画原型', '评测能力如何在面试中加分', 'AI产品PRD和传统产品的区别',
  '模型选型四层回答框架', '字节面经夺命十连问', '字节AI PM自我介绍', '字节面试怎样回答更打动面试官',
  'AI产品经理面试需要手撕代码吗？', '阿里需求评审方法', '阿里国际SVP谈产品能力',
  '腾讯产品经理的需求分析方法', '压力面中的评测追问',
];

const douyinNotes: Record<number, string> = {
  6: '“AI Native PM”等判断属于作者观点，网站不将其包装成行业定论。',
  10: '原文包含数据互动、未核实岗位预测等内容；不当做法仅保留用于识别风险，不作为建议。',
  12: '工具名称和效果描述可能包含转写误差及推广表达，使用前需要核实。',
};

const standaloneSources: InterviewSource[] = Object.entries(standaloneCategoryMap).map(([filename, categories]) => ({
  id: filename.replace(/\.md$/, ''),
  title: titleFromFilename(filename),
  platform: '小红书',
  preview: '保留原始面经、回答思路与案例，点击展开完整阅读。',
  categories,
  note: noteFor(filename),
  loadOriginal: () => loadRaw(filename),
}));

const douyinSources: InterviewSource[] = douyinTitles.map((title, index) => {
  const number = index + 1;
  return {
    id: `douyin-${number}`,
    title,
    platform: '抖音',
    preview: '已从23条合集按实际文案单独拆分，点击展开这一条完整原文。',
    categories: douyinCategoryMap[number] ?? [],
    note: douyinNotes[number],
    loadOriginal: async () => {
      const raw = await loadRaw('抖音AI产品经理面试_完整文案合集_23条.md');
      return splitDouyinCollection(raw)[index] ?? '';
    },
  };
});

export const interviewSources = [...standaloneSources, ...douyinSources]
  .sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));

export function sourcesForCategory(categoryId: InterviewCategoryId) {
  return interviewSources.filter((source) => source.categories.includes(categoryId));
}
