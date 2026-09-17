import portfolio from '../content/practice/development/kimi-portfolio/index.json';
import migration from '../content/practice/development/lovable-wordpress/index.json';
import breaker from '../content/practice/games/star-breaker/index.json';
import targets from '../content/practice/games/godot-targets/index.json';
import { legacyVisible } from './content-visibility';

export interface PracticeTutorial {
  id: string;
  module: string;
  title: string;
  summary: string;
  level: string;
  tools: string[];
  date: string;
  author: string;
  source: string;
  result: string;
  prepare: string[];
  steps: string[];
  checks: string[];
  limits: string;
  preview: string;
  demo?: string;
  prompt: string;
  promptOrigin: string;
  testedAt: string | null;
}

export const practiceTutorials: PracticeTutorial[] = [portfolio, migration, breaker, targets].filter(entry => legacyVisible(entry.module, entry.id));
export const getPracticeTutorials = (moduleId?: string) => practiceTutorials.filter(tutorial => tutorial.module === moduleId);
export const getPracticeTutorial = (moduleId?: string, tutorialId?: string) => practiceTutorials.find(tutorial => tutorial.module === moduleId && tutorial.id === tutorialId);
