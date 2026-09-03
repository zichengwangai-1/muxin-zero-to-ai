const chineseAccountName = String.fromCodePoint(0x7834, 0x58c1);
const englishAccountName = String.fromCodePoint(
  66, 114, 101, 97, 107, 105, 110, 103, 87, 97, 108, 108,
);
const accountProfileId = String.fromCodePoint(
  53, 99, 55, 51, 55, 57, 51, 53, 48, 48, 48, 48,
  48, 48, 48, 48, 49, 49, 48, 50, 99, 101, 52, 55,
);

const blockedPublicCopy = [
  new RegExp(`@?${chineseAccountName}\\s*${englishAccountName}`, 'gi'),
  new RegExp(`\\b@?${englishAccountName}\\b`, 'gi'),
  new RegExp(`(?<![\\p{Script=Han}])@?${chineseAccountName}(?![\\p{Script=Han}])`, 'gu'),
  new RegExp(accountProfileId, 'gi'),
];

export function sanitizePublicCopy(value: string) {
  return blockedPublicCopy.reduce(
    (copy, pattern) => copy.replace(pattern, ''),
    value,
  );
}
