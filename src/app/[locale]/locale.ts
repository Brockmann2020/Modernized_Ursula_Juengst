import { notFound } from 'next/navigation';

import type { Locale } from '../../site/routes';

export async function getLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;

  if (locale !== 'de' && locale !== 'en') notFound();

  return locale;
}
