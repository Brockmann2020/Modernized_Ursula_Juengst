export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export type SitePage = 'home' | 'horizonte';

export const legacySite = 'https://www.ursula-juengst.com';

export function homePath(locale: Locale) {
  return locale === 'de' ? '/' : '/en/';
}

export function horizontePath(locale: Locale) {
  return `/${locale}/horizonte/`;
}

export function pagePath(locale: Locale, page: SitePage) {
  return page === 'home' ? homePath(locale) : horizontePath(locale);
}
