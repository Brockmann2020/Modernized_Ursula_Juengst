import type { Locale } from '../../lib/routes';
import type { LoadedBlockGallery, ViewerImage } from '../../lib/gallery/loadGallery';

import { GalleryCover } from '../GalleryCover/GalleryCover';
import { GalleryViewer } from '../GalleryViewer/GalleryViewer';
import { ImageTrigger } from '../GalleryViewer/GalleryViewer.styles';
import { DetailGrid, GalleryImageFrame, Index, IndexInner, Intro, IntroInner, WorkInfo } from '../Gallery/Gallery.styles';
import { Chapter, GalleryBand, GalleryRow, GalleryText, GalleryTile, TextBox } from './BlockGallery.styles';

const labels = {
  de: { index: 'Galerie im Überblick', start: 'Erste Bilder', chapter: 'Kapitel', zoom: 'Vollbild öffnen' },
  en: { index: 'Explore the gallery', start: 'First images', chapter: 'Chapter', zoom: 'Open full screen' },
};

function imageHeading(caption: string) {
  const [first, ...remaining] = caption.split('\n');
  const heading = first.endsWith(':') && remaining.length ? first + ' ' + remaining.shift() : first;
  const year = heading.search(/,\s*\d{4}\b/);

  return {
    title: year < 0 ? heading : heading.slice(0, year),
    details: (year < 0 ? remaining : [heading.slice(year + 1).trim(), ...remaining]).join('\n'),
  };
}

export function BlockGallery({ gallery, locale }: {
  gallery: LoadedBlockGallery;
  locale: Locale;
}) {
  const text = labels[locale];
  const notes = gallery.blocks.flatMap((block) => block.type === 'text' && block.placement === 'intro' ? [block] : []);
  const chapters = gallery.blocks.filter((block) => block.type === 'heading');
  const cover = gallery.images.find((image) => image.id === gallery.coverImageId);
  const imageLinks = gallery.blocks.flatMap((block) => {
    if (block.type !== 'images') return [];

    const [first] = block.images;
    const extra = block.images.length - 1;
    return [{ href: `#${first.id}`, label: imageHeading(first.caption).title + (extra ? ` +${extra}` : ''), lang: first.captionLang }];
  });
  const links = chapters.length > 0
    ? [
        { href: imageLinks[0].href, label: text.start, lang: locale },
        ...chapters.map((chapter) => ({ href: `#chapter-${chapter.index}`, label: chapter.lines.join(' '), lang: chapter.lang })),
      ]
    : imageLinks;

  return (
    <GalleryViewer images={gallery.images} locale={locale}>
      <Intro aria-labelledby="series-title">
        <IntroInner data-has-cover={Boolean(cover)}>
          <div>
            <span>Ursula Jüngst</span>
            <h1 id="series-title">{gallery.title}</h1>
          </div>

          {cover && <GalleryCover image={cover} zoomLabel={text.zoom} contain />}
        </IntroInner>
      </Intro>

      <Index aria-label={text.index}>
        <IndexInner>
          <div><strong>{text.index}</strong></div>

          <ul>
            {links.map((link) => (
              <li key={link.href}><a href={link.href} lang={link.lang}>{link.label}</a></li>
            ))}
          </ul>
        </IndexInner>
      </Index>

      {notes.map((note) => (
        <TextBox key={note.index}>
          <GalleryText lang={note.lang} style={{ width: gallery.images[0].width }}>
            {note.title && <h2 lang={note.titleLang}>{note.title}</h2>}
            {note.lines.map((line, index) => <p key={index}>{line}</p>)}
          </GalleryText>
        </TextBox>
      ))}

      <div>
        {gallery.blocks.map((block) => {
          if (block.type === 'images') {
            const [first] = block.images;
            const single = block.images.length === 1;

            return (
              <GalleryBand
                key={first.id}
                id={single ? first.id : undefined}
                aria-labelledby={single ? `work-${first.id}` : undefined}
                data-gallery-row
              >
                <GalleryRow data-columns={block.images.length}>
                  {block.images.map((image) => (
                    <ArtworkTile key={image.id} image={image} zoomLabel={text.zoom} single={single} />
                  ))}
                </GalleryRow>
              </GalleryBand>
            );
          }

          if (block.type === 'heading') {
            return (
              <Chapter key={block.index} id={`chapter-${block.index}`}>
                <div>
                  <span>{text.chapter} {chapters.indexOf(block) + 1}</span>
                  <h2 lang={block.lang}>{block.lines.join(' ')}</h2>
                </div>
              </Chapter>
            );
          }

          if (block.placement === 'intro') return null;

          return (
            <GalleryText key={block.index} lang={block.lang}>
              {block.title && <h2 lang={block.titleLang}>{block.title}</h2>}
              {block.lines.map((line, index) => <p key={index}>{line}</p>)}
            </GalleryText>
          );
        })}
      </div>
    </GalleryViewer>
  );
}

function ArtworkTile({ image, zoomLabel, single }: {
  image: ViewerImage & { details: ViewerImage[] };
  zoomLabel: string;
  single: boolean;
}) {
  const { title, details } = imageHeading(image.caption);
  const headingId = `work-${image.id}`;
  const heading = (
    <WorkInfo lang={image.captionLang}>
      <h2 id={headingId}>{title}</h2>
      {details && <p>{details}</p>}
    </WorkInfo>
  );

  return (
    <>
      {single && heading}
      <GalleryTile id={single ? undefined : image.id} aria-labelledby={headingId}>
        {!single && <figcaption>{heading}</figcaption>}

        <div>
          <ArtworkTrigger image={image} zoomLabel={zoomLabel} width={image.width} />

          {image.details.length > 0 && (
            <DetailGrid data-gallery-details>
              {image.details.map((detail) => (
                <GalleryImageFrame key={detail.id} id={detail.id}>
                  <ArtworkTrigger
                    image={detail}
                    zoomLabel={zoomLabel}
                    width={`min(${detail.width}px, calc(85svh * ${detail.width / detail.height}))`}
                  />
                  <figcaption lang={detail.captionLang}>{detail.caption}</figcaption>
                </GalleryImageFrame>
              ))}
            </DetailGrid>
          )}
        </div>
      </GalleryTile>
    </>
  );
}

function ArtworkTrigger({ image, zoomLabel, width }: {
  image: ViewerImage;
  zoomLabel: string;
  width: number | string;
}) {
  return (
    <ImageTrigger
      type="button"
      data-image-id={image.id}
      style={{ width }}
      aria-haspopup="dialog"
      aria-label={`${zoomLabel}: ${image.alt}`}
    >
      <img
        src={image.src}
        alt={image.alt}
        lang={image.captionLang}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
    </ImageTrigger>
  );
}
