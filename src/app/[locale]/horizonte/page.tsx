import type { Metadata } from 'next';

import { Gallery } from '../../../gallery/Gallery';
import { loadHorizonte } from '../../../gallery/loadHorizonte';
import { SiteLayout } from '../../../site/SiteLayout';
import { horizontePath } from '../../../site/routes';
import { getLocale } from '../locale';

interface PageProps {
  params: Promise<{ locale: string }>;
}

const descriptions = {
  de: 'Horizonte, Malerei von Ursula Jüngst',
  en: 'Horizonte, paintings by Ursula Jüngst',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);

  return {
    title: 'Horizonte | Ursula Jüngst',
    description: descriptions[locale],
    robots: { index: false, follow: false },
    alternates: { languages: { de: horizontePath('de'), en: horizontePath('en') } },
  };
}

export default async function HorizontePage({ params }: PageProps) {
  const locale = await getLocale(params);
  const images = await loadHorizonte(locale);

  return (
    <SiteLayout locale={locale} title="Horizonte">
      <Gallery images={images} />
    </SiteLayout>
  );
}
