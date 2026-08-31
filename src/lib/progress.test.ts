import { beforeEach, describe, expect, it } from 'vitest';
import { readProgress, resetProgress, toggleStep } from './progress';

describe('project progress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores progress for each project independently', () => {
    toggleStep('project-a', 'step-1');

    expect(readProgress('project-a')).toEqual(['step-1']);
    expect(readProgress('project-b')).toEqual([]);
  });

  it('can complete, uncomplete and reset steps', () => {
    toggleStep('project-a', 'step-1');
    toggleStep('project-a', 'step-2');
    toggleStep('project-a', 'step-1');

    expect(readProgress('project-a')).toEqual(['step-2']);
    resetProgress('project-a');
    expect(readProgress('project-a')).toEqual([]);
  });

  it('recovers safely from damaged local data', () => {
    localStorage.setItem('muxin-ai-progress-v1', '{not-json');

    expect(readProgress('project-a')).toEqual([]);
  });
});
