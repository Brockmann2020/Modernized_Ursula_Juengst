import type { Metadata } from 'next';

import { NewsPage } from '../../../news/NewsPage';
import { pagePath } from '../../../site/routes';
import { getLocale } from '../locale';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const title = locale === 'de' ? 'Aktuell' : 'News';

  return {
    title: `${title} | Ursula Jüngst`,
    robots: { index: false, follow: false },
    alternates: { languages: { de: pagePath('de', 'aktuell'), en: pagePath('en', 'aktuell') } },
  };
}

export default async function CurrentPage({ params }: PageProps) {
  return <NewsPage locale={await getLocale(params)} />;
}
