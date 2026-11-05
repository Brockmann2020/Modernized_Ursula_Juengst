import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import { locales } from '../../site/routes';
import SiteTheme from '../../site/SiteTheme';
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
        <AppRouterCacheProvider>
          <SiteTheme>{children}</SiteTheme>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
