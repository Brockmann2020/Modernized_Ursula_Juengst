import type { Locale } from '../site/routes';
import type { LoadedBlockGallery } from './loadGallery';

import { GalleryCover } from './GalleryCover';
import { GalleryViewer } from './GalleryViewer';
import { ImageTrigger } from './GalleryViewer.styles';
import { Index, IndexInner, Intro, IntroInner } from './Gallery.styles';
import { Chapter, GalleryBand, GalleryRow, GalleryText, GalleryTile, TextBox } from './BlockGallery.styles';

const labels = {
  de: { index: 'Galerie im Überblick', start: 'Erste Bilder', chapter: 'Kapitel', zoom: 'Vollbild öffnen' },
  en: { index: 'Explore the gallery', start: 'First images', chapter: 'Chapter', zoom: 'Open full screen' },
};

function imageLabel(caption: string) {
  const [first, second] = caption.split('\n');
  const label = first.endsWith(':') && second ? `${first} ${second}` : first;
  return label.replace(/,\s*\d{4}\b.*$/, '').trim();
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
    return [{ href: `#${first.id}`, label: imageLabel(first.caption) + (extra ? ` +${extra}` : ''), lang: first.captionLang }];
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
          <GalleryText lang={note.lang}>
            {note.title && <h2 lang={note.titleLang}>{note.title}</h2>}
            {note.lines.map((line, index) => <p key={index}>{line}</p>)}
          </GalleryText>
        </TextBox>
      ))}

      <div>
        {gallery.blocks.map((block) => {
          if (block.type === 'images') {
            return (
              <GalleryBand key={block.images[0].id} data-gallery-row>
                <GalleryRow data-columns={block.images.length}>
                  {block.images.map((image) => (
                    <GalleryTile key={image.id} id={image.id}>
                      <ImageTrigger
                        type="button"
                        data-image-id={image.id}
                        style={{ width: image.width }}
                        aria-haspopup="dialog"
                        aria-label={`${text.zoom}: ${image.alt}`}
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

                      <figcaption lang={image.captionLang}>{image.caption}</figcaption>
                    </GalleryTile>
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
