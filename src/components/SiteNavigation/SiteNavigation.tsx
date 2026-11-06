'use client';

import { useRef, type KeyboardEvent } from 'react';

import navigation from '../../data/site/navigation.json';
import { horizontePath, pagePath, type Locale } from '../../lib/routes';
import { Menu, MenuPanel, Navigation, QuickLinks } from './SiteNavigation.styles';

type NavigationLink = Record<Locale, string> & { page: string };

const labels = {
  de: { menu: 'Menü', painting: 'Malerei', biography: 'Biografie', contact: 'Kontakt', more: 'Weitere Seiten' },
  en: { menu: 'Menu', painting: 'Painting', biography: 'Biography', contact: 'Contact', more: 'More pages' },
};

export function SiteNavigation({ locale, page }: { locale: Locale; page: string }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const text = labels[locale];

  function closeOnEscape(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== 'Escape' || !menu.current?.open) return;

    menu.current.open = false;
    menu.current.querySelector('summary')?.focus();
  }

  function renderLink(link: NavigationLink) {
    const isCurrent = link.page === page;
    const href = pagePath(locale, link.page);

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
      <QuickLinks>
        <a href={horizontePath(locale)} aria-current={page === 'horizonte' ? 'page' : undefined}>
          {text.painting}
        </a>
        <a href={pagePath(locale, 'biografie')} aria-current={page === 'biografie' ? 'page' : undefined}>
          {text.biography}
        </a>
        <a href={pagePath(locale, 'kontakt')} aria-current={page === 'kontakt' ? 'page' : undefined}>
          {text.contact}
        </a>
      </QuickLinks>

      <Menu ref={menu} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
      }}>
        <summary>
          <span>{text.menu}</span>
          <span className="menu-icon" aria-hidden="true" />
        </summary>

        <MenuPanel>
          {navigation.groups.map((group) => (
            <div key={group.de}>
              <p>{group[locale]}</p>
              <ul>{group.items.map(renderLink)}</ul>
            </div>
          ))}

          <div>
            <p>{text.more}</p>
            <ul>{navigation.links.map(renderLink)}</ul>
          </div>
        </MenuPanel>
      </Menu>
    </Navigation>
  );
}
