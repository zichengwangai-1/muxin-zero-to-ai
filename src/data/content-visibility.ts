import settings from '../content/managed/settings.json';
export const legacyVisible = (module: string, id: string | number) => !(settings.hiddenLegacyIds as string[]).includes(`${module}/${id}`);
