'use client';

import type { KeyboardEvent } from 'react';

import navigation from './navigation.json';
import { horizontePath, legacySite, type Locale } from './routes';
import { Navigation } from './SiteNavigation.styles';

type NavigationDestination =
  | { page: string; legacyFile?: never }
  | { legacyFile: string; page?: never };

type NavigationLink = Record<Locale, string> & NavigationDestination;

function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Escape' || !(event.target instanceof HTMLElement)) return;

  const disclosure = event.target.closest<HTMLDetailsElement>('details[open]');
  if (!disclosure) return;

  disclosure.open = false;
  disclosure.querySelector('summary')?.focus();
}

export function SiteNavigation({ locale }: { locale: Locale }) {
  function renderLink(link: NavigationLink) {
    const isCurrent = link.page === 'horizonte';
    const href = isCurrent ? horizontePath(locale) : `${legacySite}/${link.legacyFile}`;

    return (
      <li key={href}>
        <a href={href} aria-current={isCurrent ? 'page' : undefined}>
          {link[locale]}
        </a>
      </li>
    );
  }

  return (
    <Navigation aria-label={navigation.text[locale].navigation} onKeyDown={closeOnEscape}>
      <ul>
        {navigation.groups.map((group) => {
          const isCurrent = group.items.some((link) => link.page === 'horizonte');

          return (
            <li key={group.de}>
              <details name="navigation-group">
                <summary data-active={isCurrent || undefined}>{group[locale]}</summary>

                <ul>{group.items.map(renderLink)}</ul>
              </details>
            </li>
          );
        })}

        {navigation.links.map(renderLink)}
      </ul>
    </Navigation>
  );
}
