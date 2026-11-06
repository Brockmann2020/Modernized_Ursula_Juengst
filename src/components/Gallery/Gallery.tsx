import type { Locale } from '../../lib/routes';
import type { GalleryImage, GallerySeries } from '../../lib/gallery/loadGallery';
import { GalleryCover } from '../GalleryCover/GalleryCover';
import { GalleryViewer } from '../GalleryViewer/GalleryViewer';
import { ImageTrigger } from '../GalleryViewer/GalleryViewer.styles';
import {
  DetailGrid, GalleryImageFrame, Index, IndexInner, Intro, IntroInner, Work, WorkInfo, WorkInner,
} from './Gallery.styles';

const labels = {
  de: { zoom: 'Vollbild öffnen', index: 'Werke im Überblick', image: ['Abbildung', 'Abbildungen'], work: ['Werk', 'Werke'] },
  en: { zoom: 'Open full screen', index: 'Explore the works', image: ['Image', 'Images'], work: ['Work', 'Works'] },
};

interface GalleryProps {
  locale: Locale;
  series: GallerySeries;
  images: GalleryImage[];
}

export function Gallery({ locale, series, images }: GalleryProps) {
  const text = labels[locale];
  const imagesByWork = new Map<string, GalleryImage[]>();

  for (const image of images) {
    const group = imagesByWork.get(image.workId);
    if (group) group.push(image);
    else imagesByWork.set(image.workId, [image]);
  }

  const works = Array.from(imagesByWork.values());
  const cover = images.find((image) => image.id === series.coverImageId);

  return (
    <GalleryViewer images={images} locale={locale}>
      <Intro aria-labelledby="series-title">
        <IntroInner data-has-cover={Boolean(cover)}>
          <div>
            <span>Ursula Jüngst</span>
            <h1 id="series-title">{series.title}</h1>
            {series.introduction && <p>{series.introduction[locale]}</p>}
          </div>

          {cover && <GalleryCover image={cover} zoomLabel={text.zoom} />}
        </IntroInner>
      </Intro>

      <Index aria-label={text.index}>
        <IndexInner>
          <div>
            <strong>{text.index}</strong>
            <span>{works.length} {text.work[works.length === 1 ? 0 : 1]} · {images.length} {text.image[images.length === 1 ? 0 : 1]}</span>
          </div>

          <ul>
            {works.map(([first]) => (
              <li key={first.workId}><a href={`#${first.id}`}>{first.workTitle}</a></li>
            ))}
          </ul>
        </IndexInner>
      </Index>

      {works.map(([first, ...rest], index) => (
        <Work key={first.workId} id={first.id} aria-labelledby={`title-${first.id}`}>
          <WorkInner>
            <WorkInfo>
              <h2 id={`title-${first.id}`}>{first.workTitle}</h2>
              <p>{first.workFacts}</p>
            </WorkInfo>

            <ArtworkImage image={first} zoomLabel={text.zoom} isPrimary eager={index === 0} />

            {rest.length > 0 && (
              <DetailGrid>
                {rest.map((image) => <ArtworkImage key={image.id} image={image} zoomLabel={text.zoom} />)}
              </DetailGrid>
            )}
          </WorkInner>
        </Work>
      ))}
    </GalleryViewer>
  );
}

interface ArtworkImageProps {
  image: GalleryImage;
  zoomLabel: string;
  isPrimary?: boolean;
  eager?: boolean;
}

function ArtworkImage({ image, zoomLabel, isPrimary = false, eager = false }: ArtworkImageProps) {
  return (
    <GalleryImageFrame id={isPrimary ? undefined : image.id}>
      <ImageTrigger type="button" data-image-id={image.id} aria-haspopup="dialog" aria-label={`${zoomLabel}: ${image.alt}`}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          style={{ width: `min(${image.width}px, calc(85svh * ${image.width / image.height}))` }}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </ImageTrigger>
      {image.isDetail && <figcaption>{image.caption}</figcaption>}
    </GalleryImageFrame>
  );
}
