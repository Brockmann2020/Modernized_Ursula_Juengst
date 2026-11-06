import type { Locale } from '../routes';

import pages from '../../data/editorial/pages.json';

export interface LocalizedText {
  de: string;
  en?: string;
}

export type Part =
  | { type: 'heading'; value: LocalizedText; anchor: string }
  | { type: 'text'; value: LocalizedText }
  | { type: 'image'; source: string; caption?: LocalizedText }
  | { type: 'video'; source: string; poster?: string }
  | { type: 'youtube'; videoId: string }
  | { type: 'download'; source: string; label: string }
  | { type: 'link'; href: string; label: string }
  | { type: 'page-link'; page: string; label: string }
  | { type: 'excerpt'; label: LocalizedText; parts: Part[] };

export interface EditorialPageData {
  slug: string;
  title: { de: string; en: string };
  layout: 'cards' | 'timeline' | 'essay' | 'photo-essay' | 'legal' | 'archive';
  sections: Array<{ title?: LocalizedText; anchor?: string; parts: Part[] }>;
}

const editorialPages = pages as EditorialPageData[];

export const editorialSlugs = editorialPages.map(({ slug }) => slug);

export function findEditorialPage(slug: string) {
  return editorialPages.find((page) => page.slug === slug);
}

export function localize(value: LocalizedText, locale: Locale) {
  return locale === 'en' && value.en
    ? { text: value.en, lang: 'en' as const }
    : { text: value.de, lang: 'de' as const };
}

export function assetPath(source: string) {
  const file = source.startsWith('Presse/') ? source : source.replace(/\.(?:jpe?g|png)$/i, '.webp');

  return `/editorial/${file.split('/').map(encodeURIComponent).join('/')}`;
}
