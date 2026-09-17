export const practiceModules = [
  { id: 'prompts', index: '01', name: '高频精华prompt库', description: '收集常用场景的优质 Prompt，了解如何提问、调整与复用。' },
  { id: 'image', index: '02', name: 'AI图片创作', description: '从海报复刻到风格创作，学习图片生成的 Prompt 与方法。' },
  { id: 'video', index: '03', name: 'AI视频创作', description: '从分镜到成片，拆解视频复刻的 Prompt 与制作流程。' },
  { id: 'office', index: '04', name: 'AI办公提效', description: '围绕文档、资料整理与日常办公，学习可复用的操作方法。' },
  { id: 'development', index: '05', name: 'AI网站与产品开发', description: '从想法到可用产品，学习网站与产品开发的 SOP 和 Prompt。' },
  { id: 'games', index: '06', name: 'AI游戏与互动创作', description: '把创意变成可玩的作品，学习游戏与互动体验的开发流程。' },
] as const;

export type PracticeModuleId = typeof practiceModules[number]['id'];

export function getPracticeModule(id: string | undefined) {
  return practiceModules.find((module) => module.id === id);
}
