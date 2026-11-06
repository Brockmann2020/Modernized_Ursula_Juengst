import type { Metadata } from 'next';

import { Contact } from '../../../components/Contact/Contact';
import { pagePath } from '../../../lib/routes';
import { getLocale } from '../locale';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const title = locale === 'de' ? 'Kontakt' : 'Contact';

  return {
    title: `${title} | Ursula Jüngst`,
    robots: { index: false, follow: false },
    alternates: { languages: { de: pagePath('de', 'kontakt'), en: pagePath('en', 'kontakt') } },
  };
}

export default async function ContactPage({ params }: PageProps) {
  return <Contact locale={await getLocale(params)} />;
}
