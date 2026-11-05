export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const legacySite = 'https://www.ursula-juengst.com';

export function horizontePath(locale: Locale) {
  return `/${locale}/horizonte/`;
}
