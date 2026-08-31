export type ContentCategory = 'intro' | 'office' | 'aipm' | 'interview';
export type ContentType = 'knowledge' | 'task' | 'interview';
export type Accent = 'blue' | 'cyan' | 'violet' | 'green' | 'orange' | 'pink';

export interface ContentDetail {
  plain: string;
  why: string;
  steps: string[];
  prompt?: string;
  checks: string[];
  pitfalls: string[];
  answer?: string;
  followUps?: string[];
  relatedProjectId?: string;
}

export interface ContentItem {
  id: string;
  category: ContentCategory;
  type: ContentType;
  title: string;
  eyebrow: string;
  summary: string;
  duration: string;
  level: string;
  output: string;
  tags: string[];
  accent: Accent;
  detail: ContentDetail;
  sourceStatus?: string;
}

export interface NeedEntry {
  id: string;
  title: string;
  description: string;
  duration: string;
  output: string;
  href: string;
  icon: 'sparkles' | 'briefcase' | 'map' | 'brain' | 'blocks' | 'message';
  accent: Accent;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  deliverable: string;
}

export interface Project {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  duration: string;
  level: string;
  accent: Accent;
  skills: string[];
  outputs: string[];
  steps: ProjectStep[];
  portfolio: string[];
  interview: string[];
}
