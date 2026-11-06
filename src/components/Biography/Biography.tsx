import type { Locale } from '../../lib/routes';
import { SiteLayout } from '../SiteLayout/SiteLayout';

import biography from '../../data/profile/biography.json';
import { ProfileImage, ProfileIntro, Timeline } from '../Profile/Profile.styles';

const labels = {
  de: { title: 'Biografie', timeline: 'Stationen', image: 'Ursula Jüngst beim Malen im Atelier' },
  en: { title: 'Biography', timeline: 'Career highlights', image: 'Ursula Jüngst painting in her studio' },
};

export function Biography({ locale }: { locale: Locale }) {
  const text = labels[locale];

  return (
    <SiteLayout locale={locale} page="biografie">
      <ProfileIntro data-profile="biography">
        <div>
          <span data-eyebrow>{text.title}</span>
          <h1>Ursula Jüngst</h1>
          <p>{biography.summary[locale]}</p>
        </div>

        <ProfileImage src="/profile/biografie.webp" alt={text.image} width={1100} height={733} />
      </ProfileIntro>

      <Timeline aria-labelledby="timeline-title">
        <h2 id="timeline-title">{text.timeline}</h2>
        <ol>
          {biography.milestones.map((entry) => (
            <li key={entry.de}>
              <span>{entry.year}</span>
              <div>{entry[locale]}</div>
            </li>
          ))}
        </ol>
      </Timeline>
    </SiteLayout>
  );
}
