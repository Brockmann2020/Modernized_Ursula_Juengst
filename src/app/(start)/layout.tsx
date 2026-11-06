import type { ReactNode } from 'react';

import { SiteProviders } from '../../components/SiteProviders/SiteProviders';

export default function StartLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}
