import type { Locale } from '../site/routes';
import type { GalleryImage, GallerySeries } from './loadHorizonte';
import {
  Cover, DetailGrid, GalleryImageFrame, Index, IndexInner, Intro, IntroInner, Work, WorkInfo, WorkInner,
} from './Gallery.styles';

const labels = {
  de: { series: 'Malerei / Werkreihe', index: 'Werke im Überblick', image: ['Abbildung', 'Abbildungen'], work: ['Werk', 'Werke'] },
  en: { series: 'Painting / Series', index: 'Explore the works', image: ['Image', 'Images'], work: ['Work', 'Works'] },
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
    <>
      <Intro aria-labelledby="series-title">
        <IntroInner data-has-cover={Boolean(cover)}>
          <div>
            <span>{text.series}</span>
            <h1 id="series-title">{series.title}</h1>
            {series.introduction && <p>{series.introduction[locale]}</p>}
          </div>

          {cover && (
            <Cover>
              <img
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                fetchPriority="high"
              />
              <figcaption>{cover.caption}</figcaption>
            </Cover>
          )}
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

            <ArtworkImage image={first} isPrimary eager={index === 0} />

            {rest.length > 0 && (
              <DetailGrid>
                {rest.map((image) => <ArtworkImage key={image.id} image={image} />)}
              </DetailGrid>
            )}
          </WorkInner>
        </Work>
      ))}
    </>
  );
}

interface ArtworkImageProps {
  image: GalleryImage;
  isPrimary?: boolean;
  eager?: boolean;
}

function ArtworkImage({ image, isPrimary = false, eager = false }: ArtworkImageProps) {
  return (
    <GalleryImageFrame id={isPrimary ? undefined : image.id}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      {image.isDetail && <figcaption>{image.caption}</figcaption>}
    </GalleryImageFrame>
  );
}
