// Import an explicitly selected upstream snapshot. Never execute upstream code.
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
const run = promisify(execFile);
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/import-image-gallery.mjs /path/to/cases.json');
const upstream = JSON.parse(await fs.readFile(input, 'utf8'));
const selection = [
  [532,'电商与产品','把柠檬饮料做成六宫格微缩广告，练习同一品牌的系列视觉。','将 LIMORA 替换为你的品牌名，按需调整饮料与配色。',false],
  [544,'海报与信息图','用水果与局部拆解制作幼儿词汇卡，兼顾图片和清晰文字。','替换 [FRUIT]、[PART / SLICE / SEGMENT] 和对应名称。',false],
  [543,'品牌与创意','将旅行照片转成珐琅纪念徽章，保留地标和人物的空间关系。','上传一张旅行照片，保留提示词中的景物主次与珐琅材质要求。',true],
  [540,'角色与插画','用柔和色彩和超现实建筑，制作未来城市艺术海报。','把城市、建筑和植物描述替换成你想表现的场景。',false],
  [536,'人像与摄影','制作樱花小径上的回眸人像，练习自然光与电影氛围。','按需调整场景、人物服装和光线，保留 JSON 结构。',false],
  [527,'海报与信息图','让旅行票据延伸成城市纸雕，用地标构建微缩旅行场景。','把 Rio de Janeiro 及其地标替换为目标城市，保持手工纸雕构图。',false],
  [542,'海报与信息图','将侧脸肖像、粗粝墨迹和大字排版结合成黑白海报。','替换 [HUMAN]、[FEATURE]、[TEXT] 和 [LOGO]，文字尽量简短。',false],
  [535,'人像与摄影','同一张脸展示十二种发型，适合发型对比和个人形象探索。','上传清晰正面人像；按需修改发型清单，保留同一人物约束。',true],
  [519,'电商与产品','保留香水瓶原貌，搭配薄荷色玫瑰制作电商展示图。','上传香水产品图；若更换产品，请同步修改瓶身与颜色描述。',true],
  [523,'角色与插画','用水彩与细线稿表现城市公园，制作温暖的旅行插画。','替换城市天际线与公园活动描述，保留水彩纸张质感。',false],
  [516,'品牌与创意','把标志或物体转译成工业橡胶管造型，练习材质设计。','将 {Object} 替换为要表现的字母、标志或物体。',false],
  [533,'角色与插画','把照片人物转为松弛的手绘涂鸦，保留发型和穿搭特征。','上传人物照片，保留身份、衣服和配饰描述，按需调整画面背景。',true],
  [531,'海报与信息图','将国家地标放入水晶展示框，制作精致旅行广告。','将 [COUNTRY] 替换为目标国家，并检查生成的地标是否正确。',false],
  [541,'品牌与创意','照片与蜡笔画各占一半，制作纸张质感的旅行回忆卡。','上传一张照片，按需指定底部手写短句与配色。',true],
  [539,'海报与信息图','用粗线条与有限配色，创作人物和动物搭档的个性海报。','替换 [HUMAN]、[CLOTHING]、[ANIMAL]、[SCENERY] 和 [COLORS]。',false],
  [522,'角色与插画','把日常照片转成儿童故事书头像，保留人物的辨识度。','上传一张人物照片，检查发型、肤色、衣服和配饰是否保留。',true],
  [534,'海报与信息图','用红光、干扰色和克制排版制作实验性人像海报。','填写 Subject、Interference、Title、Palette 和 Mood 的方括号内容。',false],
  [520,'电商与产品','制作月面宇航员主题 T 恤图形，组合地球、角色与留白。','可替换宇航员动作和服装颜色，保留中心图形与 T 恤构图。',false],
  [521,'海报与信息图','把照片转成青花、敦煌和刺绣风格的四层拼图海报。','上传一张照片，按原图、青花、敦煌、刺绣顺序生成，检查四层比例。',true],
  [537,'角色与插画','通过地下档案馆与孤独人物，练习暗色叙事场景构图。','可更换中央人物与故事主题，保留档案馆的尺度和视觉焦点。',false],
];
const dest = path.resolve('public/images/practice/image');
await fs.mkdir(dest, {recursive:true});
const entries = [];
for (let start = 0; start < selection.length; start += 4) {
  const batch = await Promise.all(selection.slice(start,start+4).map(async ([id, category, description, instructions, reference]) => {
    const item = upstream.cases.find(item => item.id === id);
    if (!item?.prompt || !item.sourceUrl || !/^\/images\/case\d+\.jpg$/.test(item.image)) throw new Error(`Invalid case ${id}`);
    const file = path.join(dest, path.basename(item.image));
    const imageUrl = `https://api.github.com/repos/freestylefly/awesome-gpt-image-2/contents/data${item.image}`;
    try { await fs.access(file); } catch {
      await run('curl',['-L','--fail','--silent','--show-error','--retry','2','--max-time','180','-H','Accept: application/vnd.github.raw+json',imageUrl,'-o',`${file}.download`],{maxBuffer:1024*1024});
      const data = await fs.readFile(`${file}.download`);
      if (data[0] !== 0xff || data[1] !== 0xd8) throw new Error(`Not a JPEG: ${id}`);
      await fs.rename(`${file}.download`,file);
    }
    const {stdout} = await run('sips',['-g','pixelWidth','-g','pixelHeight',file]);
    const width = Number(stdout.match(/pixelWidth:\s*(\d+)/)?.[1]);
    const height = Number(stdout.match(/pixelHeight:\s*(\d+)/)?.[1]);
    if (!width || !height) throw new Error(`Invalid dimensions ${id}`);
    const postId = item.sourceUrl.match(/status\/(\d+)/)?.[1];
    if (!postId) throw new Error(`Missing date evidence ${id}`);
    const sourceDate = new Date(Number((BigInt(postId)>>22n)+1288834974657n)).toISOString().slice(0,10);
    if (sourceDate < '2026-07-01') throw new Error(`Outside requested date range: ${id}`);
    console.log(`Imported #${id}: ${width}×${height}, source ID date ${sourceDate}`);
    return {id,title:item.title,category,description,instructions,reference,image:`/images/practice/image/${path.basename(item.image)}`,width,height,prompt:item.prompt,sourceLabel:item.sourceLabel,sourceUrl:item.sourceUrl,githubUrl:item.githubUrl,sourceDate,dateEvidence:'原始 X 帖子 Snowflake ID 解码时间（UTC），非仓库更新时间；未逐一读取原帖日期',imageSource:imageUrl};
  }));
  entries.push(...batch);
}
const result = {repository:upstream.repository,importedAt:'2026-09-16',notes:'仓库原图与提示词原文；中文使用说明为本站整理。尚未逐例复刻。第三方素材权利归原作者；保留原始来源。',entries};
await fs.writeFile('src/content/practice/image/精选案例.json',JSON.stringify(result,null,2)+'\n');
