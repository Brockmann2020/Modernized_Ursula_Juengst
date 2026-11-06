import type { Locale } from '../../lib/routes';
import { SiteLayout } from '../SiteLayout/SiteLayout';

import contact from '../../data/profile/contact.json';
import { ContactAction, ContactDetails, ContactImage, ProfileImage, ProfileIntro } from '../Profile/Profile.styles';

const labels = {
  de: { title: 'Kontakt', headline: 'In Kontakt kommen.', action: 'E-Mail schreiben', address: 'Adresse', phone: 'Telefon', email: 'E-Mail', image: 'Atelierraum mit hohen Fenstern' },
  en: { title: 'Contact', headline: 'Get in touch.', action: 'Send an email', address: 'Address', phone: 'Phone', email: 'Email', image: 'Studio space with tall windows' },
};

export function Contact({ locale }: { locale: Locale }) {
  const text = labels[locale];

  return (
    <SiteLayout locale={locale} page="kontakt">
      <ProfileIntro data-profile="contact">
        <div>
          <span data-eyebrow>{text.title}</span>
          <h1>{text.headline}</h1>

          <ContactAction href={`mailto:${contact.email}`}>
            {text.action} <span aria-hidden="true">↗</span>
          </ContactAction>
        </div>

        <ContactDetails>
          <div>
            <strong>{text.address}</strong>
            {contact.name}<br />
            {contact.street}<br />
            {contact.floor[locale]}<br />
            {contact.city}
          </div>

          <div>
            <strong>{text.phone}</strong>
            <ul>
              {contact.phones.map(({ number, label }) => (
                <li key={number}><a href={`tel:${number}`}>{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <strong>{text.email}</strong>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>

          <a href={contact.instagram}>Instagram · @ursula_juengst</a>
        </ContactDetails>
      </ProfileIntro>

      <ContactImage>
        <ProfileImage src="/profile/kontakt.webp" alt={text.image} width={1920} height={435} />
      </ContactImage>
    </SiteLayout>
  );
}
