import type { Locale } from '../site/routes';

export interface NewsImage {
  source: string;
  caption?: { de: string; en?: string };
}

export function newsImagePath(image: NewsImage) {
  return `/news/${encodeURIComponent(image.source.replace(/\.jpe?g$/i, '.webp'))}`;
}

export function newsCaption(image: NewsImage, locale: Locale) {
  if (locale === 'en' && image.caption?.en) return { text: image.caption.en, lang: 'en' };

  return { text: image.caption?.de, lang: 'de' };
}
