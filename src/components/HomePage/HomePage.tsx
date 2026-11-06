import type { Metadata } from 'next';

import { loadGallery } from '../../lib/gallery/loadGallery';
import { SiteLayout } from '../SiteLayout/SiteLayout';
import { homePath, horizontePath, pagePath, type Locale } from '../../lib/routes';
import {
  ArtworkGrid, ArtworkLink, Collection, CollectionHeader, ContactBand, ContactInner,
  Eyebrow, Hero, HeroActions, HeroCopy, HeroImage, HeroWork, NewsLink, PrimaryLink,
} from './HomePage.styles';

const copy = {
  de: {
    description: 'Meg in die Werkreihe Horizonte.',
    headline: ['Kunst, die', 'in Bewegung', 'bleibt.'],
    intro: 'Farbe, Rhythmus und Bewegung. Ein Blick in die Malerei von Ursula Jüngst.',
    explore: 'Horizonte entdecken',
    news: 'Aktuell',
    featured: 'Ausgewählte Arbeiten',
    allWorks: 'Zur Werkreihe',
    contactTitle: 'Kontakt zu Ursula Jüngst',
    contact: 'Kontakt aufnehmen',
  },
  en: {
    description: 'Paintings by Ursula Jüngst. An introduction to the Horizonte series.',
    headline: ['Painting', 'in constant', 'motion.'],
    intro: 'Colour, rhythm and movement. A glimpse into the paintings of Ursula Jüngst.',
    explore: 'Explore Horizonte',
    news: 'News',
    featured: 'Selected works',
    allWorks: 'View the series',
    contactTitle: 'Contact Ursula Jüngst',
    contact: 'Get in touch',
  },
};

const featuredIds = ['slide', 'freiheit', 'hoffnung'];

export function homeMetadata(locale: Locale): Metadata {
  return {
    title: 'Ursula Jüngst | Malerei',
    description: copy[locale].description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: homePath(locale),
      languages: { de: homePath('de'), en: homePath('en') },
    },
  };
}

export async function HomePage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const gallery = horizontePath(locale);
  const { images } = await loadGallery('horizonte', locale);
  const byId = new Map(images.map((image) => [image.id, image]));

  const hero = byId.get('golem-detail');
  if (!hero) throw new Error('The home page requires the Golem detail.');

  return (
    <SiteLayout locale={locale} page="home">
      <Hero aria-labelledby="home-title">
        <HeroCopy>
          <Eyebrow>Ursula Jüngst <span aria-hidden="true">/</span> {locale === 'de' ? 'Malerei' : 'Painting'}</Eyebrow>

          <h1 id="home-title">
            {text.headline.map((line) => <span key={line}>{line} </span>)}
          </h1>

          <p>{text.intro}</p>

          <HeroActions>
            <PrimaryLink href={gallery}>
              {text.explore} <span aria-hidden="true">↗</span>
            </PrimaryLink>

            <NewsLink href={pagePath(locale, 'aktuell')}>
              {text.news} <span aria-hidden="true">↗</span>
            </NewsLink>
          </HeroActions>
        </HeroCopy>

        <HeroWork>
          <HeroImage src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} fetchPriority="high" />
          <figcaption>{hero.caption}</figcaption>
        </HeroWork>
      </Hero>

      <Collection aria-labelledby="selected-works">
        <CollectionHeader>
          <div>
            <Eyebrow>Horizonte</Eyebrow>
            <h2 id="selected-works">{text.featured}</h2>
          </div>

          <a href={gallery}>{text.allWorks} <span aria-hidden="true">↗</span></a>
        </CollectionHeader>

        <ArtworkGrid>
          {featuredIds.map((id) => {
            const image = byId.get(id);
            if (!image) throw new Error(`Missing featured work: ${id}`);

            return (
              <ArtworkLink key={id} href={`${gallery}#${id}`}>
                <img src={image.src} alt="" width={image.width} height={image.height} loading="lazy" />
                <span>{image.caption}</span>
                <span aria-hidden="true">↗</span>
              </ArtworkLink>
            );
          })}
        </ArtworkGrid>
      </Collection>

      <ContactBand aria-labelledby="contact-title">
        <ContactInner>
          <h2 id="contact-title">{text.contactTitle}</h2>
          <a href={pagePath(locale, 'kontakt')}>{text.contact} <span aria-hidden="true">↗</span></a>
        </ContactInner>
      </ContactBand>
    </SiteLayout>
  );
}
