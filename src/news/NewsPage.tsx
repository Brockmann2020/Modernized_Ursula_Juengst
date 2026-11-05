import type { Locale } from '../site/routes';
import { SiteLayout } from '../site/SiteLayout';

import { NewsCarousel } from './NewsCarousel';
import { NewsArticle, NewsFigure, NewsImages, NewsIntro, NewsKicker, NewsLinks, NewsSection } from './NewsPage.styles';
import { newsCaption, newsImagePath, type NewsImage } from './newsMedia';
import articles from './news.json';

interface Article {
  id: string;
  title: string;
  context: string[];
  featured: boolean;
  carousel: boolean;
  images: NewsImage[];
  paragraphs: Array<{ de: string; en?: string }>;
  links: Array<{ href: string; label: string; download?: boolean }>;
}

const labels = {
  de: { title: 'Aktuell', kicker: 'Ursula Jüngst', intro: 'Ausstellungen, Einblicke ins Atelier und Veröffentlichungen.', featured: 'Im Fokus', archive: 'Rückblick', download: 'PDF herunterladen', image: 'Abbildung' },
  en: { title: 'News', kicker: 'Ursula Jüngst', intro: 'Exhibitions, glimpses of the studio and publications.', featured: 'In focus', archive: 'Archive', download: 'Download PDF', image: 'Image' },
};

const featured = articles.filter((article) => article.featured);
const archive = articles.filter((article) => !article.featured);

export function NewsPage({ locale }: { locale: Locale }) {
  const text = labels[locale];

  return (
    <SiteLayout locale={locale} page="aktuell">
      <NewsIntro>
        <NewsKicker>{text.kicker}</NewsKicker>
        <h1>{text.title}</h1>
        <p>{text.intro}</p>

        <nav aria-label={text.title}>
          {featured.map((article) => (
            <a key={article.id} href={`#${article.id}`} lang="de">{article.context[0] ?? article.title}</a>
          ))}
          <a href="#rueckblick">{text.archive}</a>
        </nav>
      </NewsIntro>

      <NewsSection aria-labelledby="im-fokus">
        <h2 id="im-fokus">{text.featured}</h2>
        {featured.map((article) => <NewsEntry key={article.id} article={article} locale={locale} />)}
      </NewsSection>

      <NewsSection aria-labelledby="rueckblick">
        <h2 id="rueckblick">{text.archive}</h2>
        {archive.map((article) => <NewsEntry key={article.id} article={article} locale={locale} />)}
      </NewsSection>
    </SiteLayout>
  );
}

function NewsEntry({ article, locale }: { article: Article; locale: Locale }) {
  const text = labels[locale];

  return (
    <NewsArticle id={article.id} data-featured={article.featured}>
      <div>
        <NewsKicker lang="de">{article.context.join(' · ')}</NewsKicker>
        <h3 lang="de">{article.title}</h3>

        {article.paragraphs.map((paragraph, index) => {
          const english = locale === 'en' && paragraph.en;

          return <p key={index} lang={english ? 'en' : 'de'}>{english || paragraph.de}</p>;
        })}

        {article.links.length > 0 && (
          <NewsLinks>
            {article.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} download={link.download || undefined}>
                  {link.download && (locale === 'en' || !link.label) ? text.download : link.label}
                  {' '}<span aria-hidden="true">{link.download ? '↓' : '↗'}</span>
                </a>
              </li>
            ))}
          </NewsLinks>
        )}
      </div>

      {article.carousel ? (
        <NewsCarousel images={article.images} locale={locale} title={article.title} />
      ) : (
        <NewsImages data-pair={article.images.length === 2}>
          {article.images.map((image, index) => {
            const caption = newsCaption(image, locale);

            return (
              <NewsFigure key={image.source}>
                <img
                  src={newsImagePath(image)}
                  alt={caption.text ?? `${article.title} · ${text.image} ${index + 1}`}
                  loading={article.featured ? 'eager' : 'lazy'}
                />
                {caption.text && <figcaption lang={caption.lang}>{caption.text}</figcaption>}
              </NewsFigure>
            );
          })}
        </NewsImages>
      )}
    </NewsArticle>
  );
}
