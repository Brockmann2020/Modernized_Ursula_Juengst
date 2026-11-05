export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];

export const legacySite = 'https://www.ursula-juengst.com';

export function homePath(locale: Locale) {
  return locale === 'de' ? '/' : '/en/';
}

export function galleryPath(locale: Locale, slug: string) {
  return `/${locale}/${slug}/`;
}

export function horizontePath(locale: Locale) {
  return galleryPath(locale, 'horizonte');
}

export function pagePath(locale: Locale, page: string) {
  return page === 'home' ? homePath(locale) : galleryPath(locale, page);
}
