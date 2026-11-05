import type { Metadata } from 'next';

import { Biography } from '../../../profile/Biography';
import { pagePath } from '../../../site/routes';
import { getLocale } from '../locale';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const title = locale === 'de' ? 'Biografie' : 'Biography';

  return {
    title: `${title} | Ursula Jüngst`,
    robots: { index: false, follow: false },
    alternates: { languages: { de: pagePath('de', 'biografie'), en: pagePath('en', 'biografie') } },
  };
}

export default async function BiographyPage({ params }: PageProps) {
  return <Biography locale={await getLocale(params)} />;
}
