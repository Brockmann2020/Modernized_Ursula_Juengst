import type { ReactNode } from 'react';

import { SiteNavigation } from '../SiteNavigation/SiteNavigation';
import { Footer, Header, HeaderBar, LanguageLink, Wordmark } from './SiteLayout.styles';
import navigation from '../../data/site/navigation.json';
import { homePath, pagePath, type Locale } from '../../lib/routes';

interface SiteLayoutProps {
  children: ReactNode;
  locale: Locale;
  page: string;
  headerTone?: 'light' | 'contrast';
}

export function SiteLayout({ children, locale, page, headerTone = 'light' }: SiteLayoutProps) {
  const otherLocale = locale === 'de' ? 'en' : 'de';

  return (
    <>
      <Header data-tone={headerTone}>
        <HeaderBar>
          <Wordmark href={homePath(locale)} aria-current={page === 'home' ? 'page' : undefined}>
            Ursula Jüngst
          </Wordmark>

          <SiteNavigation locale={locale} page={page} />

          <LanguageLink
            href={pagePath(otherLocale, page)}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={otherLocale === 'de' ? 'Deutsch' : 'English'}
          >
            {otherLocale.toUpperCase()}
          </LanguageLink>
        </HeaderBar>
      </Header>

      <main>{children}</main>

      <Footer>
        <a href={pagePath(locale, 'impressum')}>{navigation.text[locale].footer}</a>
        <a href={pagePath(locale, 'artka-2017')}>
          {locale === 'de' ? 'Archiv' : 'Archive'} · Art Karlsruhe 2017
        </a>
      </Footer>
    </>
  );
}
