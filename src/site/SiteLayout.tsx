import type { ReactNode } from 'react';

import { SiteNavigation } from './SiteNavigation';
import { Footer, Header, Title } from './SiteLayout.styles';
import navigation from './navigation.json';
import { horizontePath, legacySite, type Locale } from './routes';

interface SiteLayoutProps {
  children: ReactNode;
  locale: Locale;
  title: string;
}

export function SiteLayout({ children, locale, title }: SiteLayoutProps) {
  const otherLocale = locale === 'de' ? 'en' : 'de';

  return (
    <>
      <Header>
        <a href="/">Ursula Jüngst</a>

        <SiteNavigation locale={locale} />

        <a href={horizontePath(otherLocale)} hrefLang={otherLocale} lang={otherLocale}>
          {otherLocale === 'de' ? 'Deutsch' : 'English'}
        </a>
      </Header>

      <main>
        <Title>{title}</Title>

        {children}
      </main>

      <Footer>
        <a href={`${legacySite}/Impressum.html`}>{navigation.text[locale].footer}</a>
      </Footer>
    </>
  );
}
