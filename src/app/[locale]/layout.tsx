import type { ReactNode } from 'react';

import { locales } from '../../site/routes';
import { SiteProviders } from '../../site/SiteProviders';
import { getLocale } from './locale';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const locale = await getLocale(params);

  return (
    <html lang={locale}>
      <body>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
