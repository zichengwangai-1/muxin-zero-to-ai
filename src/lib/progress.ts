const STORAGE_KEY = 'muxin-ai-progress-v1';

type ProgressMap = Record<string, string[]>;

function readMap(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const value = JSON.parse(raw) as unknown;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return value as ProgressMap;
  } catch {
    return {};
  }
}

function writeMap(progress: ProgressMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function readProgress(projectId: string): string[] {
  const steps = readMap()[projectId];
  return Array.isArray(steps) ? steps.filter((step) => typeof step === 'string') : [];
}

export function toggleStep(projectId: string, stepId: string): string[] {
  const progress = readMap();
  const current = new Set(readProgress(projectId));

  if (current.has(stepId)) current.delete(stepId);
  else current.add(stepId);

  const next = [...current];
  progress[projectId] = next;
  writeMap(progress);
  return next;
}

export function resetProgress(projectId: string) {
  const progress = readMap();
  delete progress[projectId];
  writeMap(progress);
}
