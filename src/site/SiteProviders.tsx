import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import SiteTheme from './SiteTheme';

export function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <SiteTheme>{children}</SiteTheme>
    </AppRouterCacheProvider>
  );
}
