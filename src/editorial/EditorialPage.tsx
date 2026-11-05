import { readFile } from 'node:fs/promises';

import { GalleryViewer } from '../gallery/GalleryViewer';
import { ImageTrigger } from '../gallery/GalleryViewer.styles';
import type { ViewerImage } from '../gallery/loadGallery';
import { pagePath, type Locale } from '../site/routes';
import { SiteLayout } from '../site/SiteLayout';

import { assetPath, localize, type EditorialPageData, type Part } from './content';
import {
  EditorialBody, EditorialExcerpt, EditorialFigure, EditorialFigures, EditorialIntro,
  EditorialLink, EditorialSection, EditorialText, VideoFrame,
} from './Editorial.styles';
import { YouTube } from './YouTube';

const labels = {
  de: { zoom: 'Vollbild öffnen', pdf: 'PDF öffnen', section: 'Abschnitte', archive: 'Archiv · 2017', prices: 'Die Preisangaben dokumentieren den Stand zur Messe 2017.', contact: 'Kontakt' },
  en: { zoom: 'Open full screen', pdf: 'Open PDF', section: 'Sections', archive: 'Archive · 2017', prices: 'Prices are historical and reflect the 2017 fair.', contact: 'Contact' },
};

function imagesIn(parts: Part[]): Array<Extract<Part, { type: 'image' }>> {
  return parts.flatMap((part) => {
    if (part.type === 'image') return [part];
    return part.type === 'excerpt' ? imagesIn(part.parts) : [];
  });
}

export async function EditorialPage({ page, locale }: { page: EditorialPageData; locale: Locale }) {
  const text = labels[locale];
  const title = page.title[locale];
  const sizes: Record<string, { width: number; height: number }> = JSON.parse(
    await readFile('.generated/editorial.json', 'utf8'),
  );
  const images = new Map<string, ViewerImage>();
  const anchors = [];

  for (const section of page.sections) {
    const heading = section.title && localize(section.title, locale);
    if (section.anchor && heading) anchors.push({ anchor: section.anchor, ...heading });

    for (const part of section.parts) {
      if (part.type === 'heading') anchors.push({ anchor: part.anchor, ...localize(part.value, locale) });
    }

    for (const part of imagesIn(section.parts)) {
      const size = sizes[part.source];
      if (!size) throw new Error(`Missing dimensions: ${part.source}`);

      const caption = part.caption ? localize(part.caption, locale) : heading;
      images.set(part.source, {
        id: part.source,
        src: assetPath(part.source),
        width: size.width,
        height: size.height,
        alt: caption?.text ?? title,
        caption: caption?.text ?? title,
        captionLang: caption?.lang ?? locale,
      });
    }
  }

  return (
    <SiteLayout locale={locale} page={page.slug}>
      <EditorialIntro>
        <span>{page.layout === 'archive' ? text.archive : 'Ursula Jüngst'}</span>
        <h1>{title}</h1>
        {page.layout === 'archive' && <p>{text.prices}</p>}

        {anchors.length > 0 && (
          <nav aria-label={text.section}>
            {anchors.map((anchor) => (
              <EditorialLink key={anchor.anchor} href={`#${anchor.anchor}`} lang={anchor.lang}>
                {anchor.text}
              </EditorialLink>
            ))}
            {page.layout === 'archive' && <EditorialLink href={pagePath(locale, 'kontakt')}>{text.contact}</EditorialLink>}
          </nav>
        )}
      </EditorialIntro>

      <div data-layout={page.layout}>
        <GalleryViewer images={Array.from(images.values())} locale={locale}>
          <EditorialBody>
            {page.sections.map((section, index) => {
              const heading = section.title && localize(section.title, locale);
              const context = { locale, images, title: heading?.text ?? title };

              return (
                <EditorialSection key={section.anchor ?? index} id={section.anchor}>
                  {heading && <h2 lang={heading.lang}>{heading.text}</h2>}

                  <PartList parts={section.parts} context={context} />
                </EditorialSection>
              );
            })}
          </EditorialBody>
        </GalleryViewer>
      </div>
    </SiteLayout>
  );
}

interface PartContext {
  locale: Locale;
  images: Map<string, ViewerImage>;
  title: string;
}

function PartList({ parts, context }: { parts: Part[]; context: PartContext }) {
  const groups: Part[][] = [];
  for (const part of parts) {
    const previous = groups.at(-1);
    if (part.type === 'image' && previous?.[0].type === 'image' && previous.length < 3) previous.push(part);
    else groups.push([part]);
  }

  return groups.map((group, index) => group[0].type === 'image' ? (
    <EditorialFigures key={index} data-columns={group.length}>
      {group.map((part, partIndex) => <PartView key={partIndex} part={part} context={context} />)}
    </EditorialFigures>
  ) : <PartView key={index} part={group[0]} context={context} />);
}

function PartView({ part, context }: { part: Part; context: PartContext }) {
  const { locale, images, title } = context;
  const text = labels[locale];

  switch (part.type) {
    case 'text': {
      const value = localize(part.value, locale);
      return (
        <EditorialText lang={value.lang}>
          {value.text.split(/\n\s*\n/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </EditorialText>
      );
    }
    case 'heading': {
      const value = localize(part.value, locale);
      return <h2 id={part.anchor} lang={value.lang}>{value.text}</h2>;
    }
    case 'image': {
      const image = images.get(part.source);
      if (!image) throw new Error(`Unknown editorial image: ${part.source}`);
      return (
        <EditorialFigure>
          <ImageTrigger
            type="button"
            data-image-id={image.id}
            style={{ width: image.width }}
            aria-haspopup="dialog"
            aria-label={`${text.zoom}: ${image.alt}`}
          >
            <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
          </ImageTrigger>
          {part.caption && <figcaption lang={image.captionLang}>{image.caption}</figcaption>}
        </EditorialFigure>
      );
    }
    case 'video':
      return (
        <VideoFrame>
          <video controls playsInline preload="none" aria-label={title} poster={part.poster && assetPath(part.poster)}>
            <source src={assetPath(part.source)} type="video/mp4" />
          </video>
        </VideoFrame>
      );
    case 'youtube':
      return <YouTube videoId={part.videoId} title={title} locale={locale} />;
    case 'download':
      return <EditorialLink href={assetPath(part.source)}>{part.label || text.pdf} <span aria-hidden="true">↓</span></EditorialLink>;
    case 'link':
      return <EditorialLink href={part.href}>{part.label} <span aria-hidden="true">↗</span></EditorialLink>;
    case 'page-link':
      return <EditorialLink href={pagePath(locale, part.page)}>{part.label} <span aria-hidden="true">↗</span></EditorialLink>;
    case 'excerpt': {
      const label = localize(part.label, locale);
      return (
        <EditorialExcerpt>
          <summary lang={label.lang}>{label.text}</summary>
          <div><PartList parts={part.parts} context={context} /></div>
        </EditorialExcerpt>
      );
    }
  }
}
