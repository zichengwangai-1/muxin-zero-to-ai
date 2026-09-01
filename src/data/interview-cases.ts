import {
  interviewSources,
  type InterviewCategoryId,
  type InterviewSource,
} from './interview';
import {
  buildBeginnerCaseExplanation,
  buildProfessionalAnswer,
  type BeginnerCaseExplanation,
  type ProfessionalAnswer,
} from './interview-answers';

interface QuestionBlueprint {
  id: string;
  categoryId: InterviewCategoryId;
  title: string;
  keywords: string[];
  focus: string;
}

export interface InterviewCaseExcerpt {
  sourceId: string;
  platform: string;
  content: string;
  note?: string;
  beginnerExplanation: BeginnerCaseExplanation;
}

export interface InterviewCaseQuestion {
  id: string;
  categoryId: InterviewCategoryId;
  title: string;
  focus: string;
  answer: ProfessionalAnswer;
  cases: InterviewCaseExcerpt[];
}

type RawInterviewCaseExcerpt = Omit<InterviewCaseExcerpt, 'beginnerExplanation'>;

const blueprints: QuestionBlueprint[] = [
  { id: 'self-intro', categoryId: 'personal', title: '请做一个有岗位匹配度的自我介绍', keywords: ['自我介绍', '介绍一下自己', '个人介绍'], focus: '不是复述简历，而是用经历证明你适合这个岗位。' },
  { id: 'why-ai-pm', categoryId: 'personal', title: '为什么想做AI产品经理？', keywords: ['为什么想做产品', '为什么选择ai产品', '转到ai产品', '转行ai', '岗位动机'], focus: '讲清转行动机、能力迁移与长期选择。' },
  { id: 'why-company', categoryId: 'personal', title: '为什么选择这家公司和这个岗位？', keywords: ['为什么选择', '为什么想来', '选择我们公司', '岗位理解'], focus: '把公司业务、岗位要求和个人证据连起来。' },
  { id: 'strength-weakness', categoryId: 'personal', title: '你的优势、短板和差异化是什么？', keywords: ['优势', '缺点', '短板', '差异化', '其他候选人', '如何评价你'], focus: '优势要有证据，短板要有改进动作。' },
  { id: 'career-plan', categoryId: 'personal', title: '你的职业规划是什么？为什么现在转型？', keywords: ['职业规划', '长期规划', '未来工作', '为什么跳槽'], focus: '展示选择的连续性和稳定性。' },
  { id: 'behavior', categoryId: 'personal', title: '讲一次失败、压力或冲突经历', keywords: ['失败', '挫折', '压力', '挑战', '冲突', '最难'], focus: '用STAR说明判断、行动和复盘。' },
  { id: 'reverse-question', categoryId: 'personal', title: '面试结束时应该如何反问？', keywords: ['反问', '想进一步了解', '团队规划', '有什么问题'], focus: '用反问确认岗位目标、团队阶段和成功标准。' },

  { id: 'project-intro', categoryId: 'project', title: '请介绍一个你最有代表性的AI项目', keywords: ['介绍一下', '项目经历', '项目做了什么', '项目背景', '实践最深'], focus: '先讲用户问题，再讲你的关键贡献。' },
  { id: 'project-role', categoryId: 'project', title: '你在项目中具体负责什么？', keywords: ['具体负责', '主要负责', '个人贡献', '哪些工作', '独立完成'], focus: '区分团队成果和个人动作。' },
  { id: 'project-why', categoryId: 'project', title: '为什么要做这个项目？需求是怎么发现的？', keywords: ['为什么做', '需求背景', '业务痛点', '用户问题', '需求分析'], focus: '从真实问题和现有替代方案讲起。' },
  { id: 'project-priority', categoryId: 'project', title: '项目方案如何拆解和排优先级？', keywords: ['优先级', '拆解', '逻辑链', '取舍', 'mvp'], focus: '说出取舍标准，而不是只罗列功能。' },
  { id: 'project-metric', categoryId: 'project', title: '项目指标如何设计和验证？', keywords: ['项目指标', '核心指标', '北极星指标', '指标改善', '效果验证', 'ab测试', '因果'], focus: '说明指标、基线、实验与结果。' },
  { id: 'project-blocker', categoryId: 'project', title: '项目最大的卡点是什么？你如何解决？', keywords: ['最大卡点', '困难', '如何解决', '跨部门', '合作方', '推动'], focus: '重点讲判断和推动过程。' },
  { id: 'project-review', categoryId: 'project', title: '如果重做一次项目，你会改什么？', keywords: ['再做一次', '重新做', '复盘', '可以优化', '改进'], focus: '用复盘证明你能形成下一轮行动。' },
  { id: 'ai-prd', categoryId: 'project', title: 'AI产品PRD和传统PRD有什么不同？', keywords: ['ai产品prd', '传统prd', 'prd', '验收标准', '概率性需求'], focus: '补充模型边界、评测、兜底和数据闭环。' },

  { id: 'ai-pm-difference', categoryId: 'concepts', title: 'AI产品经理和传统产品经理有什么区别？', keywords: ['ai产品跟传统产品', 'ai产品经理的底层逻辑', '传统产品经理', '概率性'], focus: '从不确定性、评测与协作对象回答。' },
  { id: 'rag-finetune-concept', categoryId: 'concepts', title: 'RAG和Fine-tuning有什么区别？', keywords: ['rag和fine', 'rag与fine', 'rag和微调', 'rag与微调'], focus: '比较知识更新、成本、适用场景和能力边界。' },
  { id: 'workflow-agent', categoryId: 'concepts', title: 'Workflow和Agent有什么区别？', keywords: ['workflow和agent', 'workflow与agent', '工作流', '自主决策'], focus: '一个偏确定流程，一个强调动态规划与执行。' },
  { id: 'llm-basics', categoryId: 'concepts', title: '大模型为什么会产生不确定输出？', keywords: ['概率', '不确定', 'temperature', '温度', 'token', '上下文窗口'], focus: '用产品语言解释生成机制和参数影响。' },
  { id: 'coding-requirement', categoryId: 'concepts', title: 'AI产品经理需要懂代码吗？', keywords: ['需要手撕代码', '需要懂代码', 'ai coding', 'vibe coding', '开发模式'], focus: '重点是能理解技术边界并完成快速验证。' },
  { id: 'agent-chatbot', categoryId: 'concepts', title: 'Agent和传统对话机器人有什么本质区别？', keywords: ['传统对话机器人', 'agent的核心架构', '智能体的核心架构'], focus: '从目标、规划、工具和状态说明。' },
  { id: 'multimodal-memory', categoryId: 'concepts', title: '多模态和Memory会怎样影响AI产品？', keywords: ['多模态', 'memory', '记忆', '长期记忆'], focus: '说明输入方式、个性化和隐私边界。' },

  { id: 'real-ai-need', categoryId: 'sense', title: '这个需求真的需要AI吗？', keywords: ['值不值得做', '能不能做', '一定要用ai', '伪需求', '真实需求'], focus: '先验证问题，再判断AI是否带来明显增益。' },
  { id: 'favorite-product', categoryId: 'sense', title: '你最喜欢哪款AI产品？为什么？', keywords: ['喜欢什么ai产品', '最常使用的ai', '用过的ai产品', '产品体验'], focus: '从用户价值、优缺点和行业趋势回答。' },
  { id: 'ai-business', categoryId: 'sense', title: 'AI与具体业务可以怎样结合？', keywords: ['业务结合', '落地方向', '应用场景', '业务场景', '赋能价值'], focus: '从业务链路和可量化价值寻找机会。' },
  { id: 'mvp-sense', categoryId: 'sense', title: 'AI产品的MVP应该先验证什么？', keywords: ['mvp', '最小可行', '技术实现周期', '先验证'], focus: '优先验证价值假设和最高风险。' },
  { id: 'product-critique', categoryId: 'sense', title: '如何分析并优化一款AI产品？', keywords: ['优化建议', '怎么改', '产品分析', '历史搜索页', '体验好吗'], focus: '从目标用户、核心链路、问题和验证指标回答。' },
  { id: 'moat', categoryId: 'sense', title: 'AI产品的核心壁垒是什么？', keywords: ['核心壁垒', '护城河', '竞争优势'], focus: '模型之外还要看数据、场景、工作流与反馈飞轮。' },
  { id: 'retention', categoryId: 'sense', title: '如何提升AI产品的留存和活跃？', keywords: ['用户留存', '活跃度', '留存', '复访'], focus: '回到持续价值、信任和使用习惯。' },

  { id: 'agent-design', categoryId: 'agent', title: '如果让你从零设计一个Agent，你会怎么做？', keywords: ['设计一个agent', '搭建agent', '如何设计一个agent', '从零设计', '场景题'], focus: '从需求判断、自主边界、能力链和验证展开。' },
  { id: 'agent-architecture', categoryId: 'agent', title: 'Agent的核心架构包含哪些模块？', keywords: ['核心架构', '任务分解', '规划工具记忆状态', '核心模块', 'node'], focus: '感知、规划、工具、记忆、状态与反馈。' },
  { id: 'agent-boundary', categoryId: 'agent', title: 'Agent的自主边界应该怎么确定？', keywords: ['自主性边界', '落地边界', '哪些任务适合', '人工干预'], focus: '根据风险、可逆性和置信度确定确认点。' },
  { id: 'tool-call', categoryId: 'agent', title: 'Agent的工具调用应该怎么设计？', keywords: ['工具调用', 'tool schema', '调用模板', 'api', '参数缺失'], focus: '定义工具、参数、权限、结果和失败处理。' },
  { id: 'agent-memory', categoryId: 'agent', title: 'Agent的记忆和状态如何设计？', keywords: ['记忆层', '工作记忆', '长期记忆', '状态', 'memory'], focus: '区分会话状态、用户偏好与可删除的长期记忆。' },
  { id: 'agent-failure', categoryId: 'agent', title: 'Agent调用失败或陷入循环怎么办？', keywords: ['失败', '重试', '卡住', '循环', '降级', '人工接管'], focus: '必须设计超时、重试、降级和人工接管。' },
  { id: 'bc-agent', categoryId: 'agent', title: 'B端Agent和C端Agent设计有什么区别？', keywords: ['b端agent', 'c端agent', '内部团队', '普通用户'], focus: '比较流程复杂度、权限、解释性和容错。' },
  { id: 'agent-evaluation', categoryId: 'agent', title: '如何判断一个Agent是否靠谱？', keywords: ['agent靠不靠谱', '评价一个agent', 'agent的好坏', '任务成功率'], focus: '结果对不对与过程稳不稳都要评。' },

  { id: 'rag-strategy', categoryId: 'rag', title: 'RAG的整体策略应该怎么设计？', keywords: ['rag策略', 'rag整体', 'rag链路', '知识库'], focus: '从文档进入系统到生成带证据答案。' },
  { id: 'rag-retrieval', categoryId: 'rag', title: 'RAG为什么要做多路召回和Rerank？', keywords: ['多路召回', '召回层', '融合层', '精排层', 'rerank', '向量检索'], focus: '平衡“准”和“全”，再控制噪声与成本。' },
  { id: 'rag-chunk-query', categoryId: 'rag', title: '文档切分和Query改写应该怎么做？', keywords: ['文档切分', 'chunk', 'query改写', '查询改写', '动态召回'], focus: '切分服务于检索，改写服务于理解真实意图。' },
  { id: 'rag-embedding', categoryId: 'rag', title: 'Embedding、向量库和Top K怎么选？', keywords: ['embedding', '向量存储', '向量库', 'top k', 'topk'], focus: '选型和参数必须通过业务评测集验证。' },
  { id: 'rag-or-finetune', categoryId: 'rag', title: '什么场景用RAG，什么场景用微调？', keywords: ['哪些场景用微调', '优先选择rag', 'rag和微调', 'fine-tuning'], focus: '知识更新优先RAG，行为能力改变再考虑微调。' },
  { id: 'rag-debug', categoryId: 'rag', title: 'RAG效果下降时如何排查？', keywords: ['怎么排查', '召回错误', '检索不行', '生成不行', '效果下降'], focus: '拆开解析、检索、重排与生成逐层定位。' },
  { id: 'rag-permission', categoryId: 'rag', title: '企业知识库如何处理权限和时效？', keywords: ['权限', '知识过时', '定时推送', '版本', '企业知识库'], focus: '证据必须满足用户权限并可追溯版本。' },

  { id: 'prompt-logic', categoryId: 'prompt', title: 'Prompt的撰写逻辑是什么？', keywords: ['prompt设计框架', '撰写prompt', '写好prompt', '角色设定', '任务界定', '格式规范'], focus: '把角色、任务、背景、要求、限制和示例写清楚。' },
  { id: 'prompt-optimize', categoryId: 'prompt', title: '如何优化Prompt？', keywords: ['优化prompt', '迭代prompt', 'prompt迭代', '单变量', 'bad case'], focus: '基于Bad Case分类，每次只改一个变量并回归测试。' },
  { id: 'prompt-hallucination', categoryId: 'prompt', title: '幻觉为什么不能只改Prompt？', keywords: ['幻觉为什么不能只改prompt', '不能只改prompt', '幻觉', '事实错误'], focus: 'Prompt只能约束生成，无法修复错误知识和检索证据。' },
  { id: 'prompt-example', categoryId: 'prompt', title: 'Few-shot、输出格式和负面清单怎么用？', keywords: ['few-shot', '示例驱动', '负面清单', '输出格式', '示例'], focus: '用例子定义“好”，用结构和禁区提高稳定性。' },
  { id: 'prompt-test', categoryId: 'prompt', title: 'Prompt如何测试和持续迭代？', keywords: ['测试prompt', 'prompt测试', '反馈机制', '版本管理', '回归'], focus: '建立测试集、版本记录与用户反馈闭环。' },
  { id: 'prompt-product', categoryId: 'prompt', title: '如何把Prompt做成产品能力？', keywords: ['prompt当成', '产品功能', '产品化', '用户反馈机制'], focus: '把输入、参数、反馈和版本变成可运营的系统。' },
  { id: 'prompt-model', categoryId: 'prompt', title: '同一Prompt在不同模型和参数下有什么差异？', keywords: ['不同的模型', '温度调高', '系统提示', '输出质量有什么差异'], focus: '通过对照实验理解模型和参数边界。' },

  { id: 'eval-system', categoryId: 'evaluation', title: 'AI产品经理如何搭建完整评测体系？', keywords: ['怎么做评测', '评测体系', '评估体系', '质量飞轮'], focus: '目标、数据集、Rubric、执行、归因和闭环。' },
  { id: 'eval-dataset', categoryId: 'evaluation', title: '评测数据集应该如何构建？', keywords: ['评测数据集', '评测集', '真实case', '红队测试集', '样本'], focus: '覆盖真实、高频、边界、历史错例和高风险场景。' },
  { id: 'eval-rubric', categoryId: 'evaluation', title: '评测维度和Rubric如何设计？', keywords: ['评测维度', 'rubric', '评分细则', '准确性', '相关性', '完整性'], focus: '把“好”拆成可执行、可校准的评分标准。' },
  { id: 'eval-method', categoryId: 'evaluation', title: '人工评测、规则评测和模型评测怎么选？', keywords: ['人工评测', '自动评测', 'llm-as-a-judge', '评测方式', '红蓝对抗'], focus: '分层组合，而不是迷信单一方法。' },
  { id: 'bad-case', categoryId: 'evaluation', title: 'Bad Case如何分类、归因和排优先级？', keywords: ['bad case', 'badcase', '分类归因', '问题根源', '影响面', '严重程度'], focus: '先归因，再按影响面和严重度推动迭代。' },
  { id: 'eval-agent', categoryId: 'evaluation', title: 'Agent应该评结果还是评过程？', keywords: ['结果还是过程', '工具调用次数', '任务成功率', '过程稳不稳', 'agent评估'], focus: '同时评最终结果、轨迹效率、稳定性和安全性。' },
  { id: 'eval-rag', categoryId: 'evaluation', title: 'RAG如何分开评测检索和生成？', keywords: ['rag评测', '召回质量', '生成质量', '检索问题'], focus: '先看证据是否找对，再看答案是否忠于证据。' },
  { id: 'eval-gate', categoryId: 'evaluation', title: '如何设置上线门槛和回归验证？', keywords: ['上线门槛', '验收阈值', '回归验证', '质量门禁'], focus: '上线标准必须在评测前定义并持续回归。' },

  { id: 'model-selection', categoryId: 'model', title: '业务中应该如何选择大模型？', keywords: ['模型选型', '选择大模型', '用的是什么大模型', '模型选择'], focus: '从业务目标和真实测试集出发。' },
  { id: 'benchmark', categoryId: 'model', title: '为什么模型选型不能只看排行榜？', keywords: ['benchmark', '排行榜', '公开数据集', '业务评测'], focus: '通用高分不等于你的业务场景更好。' },
  { id: 'model-tradeoff', categoryId: 'model', title: '质量、速度、成本和隐私如何权衡？', keywords: ['质量', '速度', '成本', '隐私', '延迟', '并发'], focus: '先确定不可妥协项，再比较综合收益。' },
  { id: 'model-cost', categoryId: 'model', title: '模型推理成本过高、ROI打不平怎么办？', keywords: ['推理成本', 'roi', 'token消耗', 'api调用', '降本'], focus: '通过路由、缓存、上下文压缩和产品限制降本。' },
  { id: 'model-routing', categoryId: 'model', title: '什么时候需要大小模型路由？', keywords: ['大小模型', '模型路由', '路由策略', '小模型'], focus: '简单任务走小模型，复杂高价值任务再升级。' },
  { id: 'model-deploy', categoryId: 'model', title: '什么时候需要私有化部署？', keywords: ['私有化部署', '本地部署', '数据安全', '合规'], focus: '结合隐私、延迟、成本和维护能力判断。' },

  { id: 'hallucination', categoryId: 'safety', title: 'AI幻觉是什么？应该如何治理？', keywords: ['幻觉', '事实错误', '认真胡说', '可信'], focus: '边界、证据、约束、验证与监控缺一不可。' },
  { id: 'guardrail', categoryId: 'safety', title: 'AI产品的安全边界和Guardrail怎么设计？', keywords: ['安全边界', 'guardrail', '高危场景', '风险场景', '违规'], focus: '按风险分级，限制输入、输出和可执行动作。' },
  { id: 'permission-risk', categoryId: 'safety', title: 'Agent越权执行时怎么办？', keywords: ['越权', '权限校验', '资金风险', '执行风险'], focus: '最小权限、关键确认、审计和可回滚。' },
  { id: 'fallback', categoryId: 'safety', title: '什么时候应该拒答、降级或转人工？', keywords: ['拒答', '降级', '转人工', '人工接管', '置信度阈值'], focus: '根据风险、置信度和任务可逆性选择兜底。' },
  { id: 'wrong-rag', categoryId: 'safety', title: '如果RAG召回了错误资料怎么办？', keywords: ['召回了错误资料', '错误资料', '知识过时', '错误证据'], focus: '校验证据质量、版本、权限和引用一致性。' },
  { id: 'monitoring', categoryId: 'safety', title: '线上Bad Case如何监控和闭环？', keywords: ['线上监控', '用户投诉', '新case', '监控', '线上反馈'], focus: '监控异常、沉淀错例、归因并加入回归集。' },
  { id: 'privacy', categoryId: 'safety', title: 'AI产品如何处理隐私和合规风险？', keywords: ['隐私', '合规', '敏感数据', '数据权限'], focus: '遵循最少数据、明确授权、可删除和可审计。' },
];

const metadataPatterns = [
  /^>\s*\*\*笔记信息\*\*/i,
  /^>\s*-\s*(作者|点赞|发布时间|日期|图片数|笔记链接|链接|收藏|评论)[:：]/i,
  /^-\s*\*\*(作者|日期|赞|点赞|链接|发布时间|图片数|平台)\*\*[:：]/i,
  /^(作者|点赞|发布时间|日期|图片数|笔记链接|链接|收藏|评论)[:：]/i,
  /^>\s*(调研时间|内容构成|筛选标准|共\d+条)/i,
  /^#{1,6}\s*(正文|图片内容|目录)\s*$/i,
  /^#{1,6}\s*第\d+张[:：]/i,
  /^#\S+\s*(#\S+\s*)+$/,
  /https?:\/\//i,
];

export function removePlatformMetadata(raw: string) {
  const lines = raw.split('\n');
  return lines
    .filter((rawLine, index) => {
      const line = rawLine.trim();
      if (!line) return true;
      if (index === 0 && /^#{1,6}\s+/.test(line)) return false;
      return !metadataPatterns.some((pattern) => pattern.test(line));
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitIntoBlocks(content: string) {
  return content
    .split(/\n\s*\n/g)
    .map((block) => block.trim())
    .filter((block) => block.length > 10)
    .filter((block) => block !== '---')
    .filter((block) => !/^\|?[-:|\s]+\|?$/.test(block));
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[\s*_`#>"'“”‘’（）()，。；：、？！?!.\-|]/g, '');
}

function keywordScore(text: string, blueprint: QuestionBlueprint) {
  const normalized = normalize(text);
  return blueprint.keywords.reduce((score, keyword) => {
    const key = normalize(keyword);
    if (!key || !normalized.includes(key)) return score;
    return score + Math.max(1, Math.min(4, key.length / 2));
  }, 0);
}

function pickBlueprint(block: string, allowedCategories: InterviewCategoryId[]) {
  const candidates = blueprints.filter((blueprint) => allowedCategories.includes(blueprint.categoryId));
  return candidates
    .map((blueprint) => ({ blueprint, score: keywordScore(block, blueprint) }))
    .sort((a, b) => b.score - a.score)[0];
}

function sourceFallback(source: InterviewSource) {
  return blueprints.find((blueprint) => blueprint.categoryId === source.categories[0]) ?? blueprints[0];
}

let allQuestionsPromise: Promise<InterviewCaseQuestion[]> | undefined;

async function buildAllQuestions() {
  const grouped = new Map<string, Map<string, RawInterviewCaseExcerpt>>();

  await Promise.all(interviewSources.map(async (source) => {
    const cleaned = removePlatformMetadata(await source.loadOriginal());
    const blocks = splitIntoBlocks(cleaned);
    let activeBlueprint = sourceFallback(source);

    blocks.forEach((block) => {
      const match = pickBlueprint(block, source.categories);
      if (match && match.score > 0) activeBlueprint = match.blueprint;
      const bySource = grouped.get(activeBlueprint.id) ?? new Map<string, RawInterviewCaseExcerpt>();
      const existing = bySource.get(source.id);
      bySource.set(source.id, {
        sourceId: source.id,
        platform: source.platform,
        note: source.note,
        content: existing ? `${existing.content}\n\n${block}` : block,
      });
      grouped.set(activeBlueprint.id, bySource);
    });

    if (blocks.length === 0 && cleaned) {
      const bySource = grouped.get(activeBlueprint.id) ?? new Map<string, RawInterviewCaseExcerpt>();
      bySource.set(source.id, {
        sourceId: source.id,
        platform: source.platform,
        note: source.note,
        content: cleaned,
      });
      grouped.set(activeBlueprint.id, bySource);
    }
  }));

  return blueprints
    .map((blueprint) => ({
      id: blueprint.id,
      categoryId: blueprint.categoryId,
      title: blueprint.title,
      focus: blueprint.focus,
      answer: buildProfessionalAnswer(blueprint),
      cases: [...(grouped.get(blueprint.id)?.values() ?? [])].map((item) => ({
        ...item,
        beginnerExplanation: buildBeginnerCaseExplanation(blueprint, item.content),
      })),
    }))
    .filter((question) => question.cases.length > 0);
}

export function loadInterviewCaseQuestions(categoryId: InterviewCategoryId) {
  allQuestionsPromise ??= buildAllQuestions();
  return allQuestionsPromise.then((questions) =>
    questions.filter((question) => question.categoryId === categoryId),
  );
}

export async function loadAllInterviewCaseQuestions() {
  allQuestionsPromise ??= buildAllQuestions();
  return allQuestionsPromise;
}
