import { describe, expect, it } from 'vitest';
import { sanitizePublicCopy } from './public-copy';

describe('公开页面文字清理', () => {
  it('移除指定账号的中英文名称和主页标识', () => {
    const chineseName = String.fromCodePoint(0x7834, 0x58c1);
    const englishName = `${'Breaking'}${'Wall'}`;
    const profileId = `5c737935${'000000001102ce47'}`;

    expect(sanitizePublicCopy(`作者：${chineseName}${englishName}`)).toBe('作者：');
    expect(sanitizePublicCopy(`作者：${englishName}`)).toBe('作者：');
    expect(sanitizePublicCopy(`作者：${chineseName}`)).toBe('作者：');
    expect(sanitizePublicCopy(`主页：${profileId}`)).toBe('主页：');
  });

  it('不会误删正常语句中的相同汉字', () => {
    const chineseName = String.fromCodePoint(0x7834, 0x58c1);
    const sentence = `产品要打${chineseName}垒，而不是闭门造车。`;

    expect(sanitizePublicCopy(sentence)).toBe(sentence);
  });
});
