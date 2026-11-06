import { readFile } from 'node:fs/promises';

import type { Locale } from '../site/routes';
import { parseBlockGallery } from './blockContent.mjs';
import { dimensionsSchema, parseGallery } from './content.mjs';

const text = {
  de: { material: 'Öl auf Leinwand', detail: 'Ausschnitt aus' },
  en: { material: 'Oil on canvas', detail: 'Detail from' },
};

export type GallerySeries = ReturnType<typeof parseGallery>['series'];

async function readGalleryData(slug: string) {
  return JSON.parse(await readFile(`src/gallery/${slug}.json`, 'utf8'));
}

export async function readGallery(slug: string) {
  const content = await readGalleryData(slug);

  return 'blocks' in content
    ? { kind: 'blocks' as const, ...parseBlockGallery(content) }
    : { kind: 'works' as const, ...parseGallery(content) };
}

export interface GalleryImage {
  workId: string;
  workTitle: string;
  workFacts: string;
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  isDetail: boolean;
}

export async function loadGallery(slug: string, locale: Locale) {
  const { series, entries, worksById } = parseGallery(await readGalleryData(slug));
  const manifest = await readFile(`.generated/${slug}.json`, 'utf8');
  const sizes = dimensionsSchema.parse(JSON.parse(manifest));
  const labels = text[locale];

  const images: GalleryImage[] = entries.map((entry) => {
    const work = worksById.get(entry.work);
    const size = sizes[entry.id];

    if (!work || !size) throw new Error(`Incomplete gallery image: ${entry.id}`);

    const isDetail = entry.view === 'detail';
    const alt = isDetail ? `${labels.detail} ${work.title}` : work.title;
    const measurements = `${work.heightCm} × ${work.widthCm} cm`;
    const workFacts = `${work.year}, ${labels.material}, ${measurements}`;
    const caption = isDetail ? alt : `${work.title}, ${workFacts}`;

    return {
      id: entry.id,
      workId: work.id,
      workTitle: work.title,
      workFacts,
      src: `/${slug}/${entry.id}.webp`,
      alt,
      caption,
      width: size.width,
      height: size.height,
      isDetail,
    };
  });
  return { series, images };
}

export type ViewerImage = Pick<GalleryImage, 'id' | 'src' | 'alt' | 'caption' | 'width' | 'height'> & {
  captionLang?: Locale;
};

type BlockGalleryData = ReturnType<typeof parseBlockGallery>;

function localizeLines(value: { de: string[]; en?: string[] }, locale: Locale) {
  return locale === 'en' && value.en
    ? { lines: value.en, lang: 'en' as const }
    : { lines: value.de, lang: 'de' as const };
}

export async function loadBlockGallery(slug: string, locale: Locale, data: BlockGalleryData) {
  const sizes = dimensionsSchema.parse(JSON.parse(await readFile(`.generated/${slug}.json`, 'utf8')));
  const images = data.entries.map((entry): ViewerImage => {
    const size = sizes[entry.id];
    if (!size) throw new Error(`Missing gallery image dimensions: ${slug}/${entry.id}`);

    const caption = localizeLines(entry.caption, locale);
    return {
      id: entry.id,
      src: `/${slug}/${entry.id}.webp`,
      alt: caption.lines[0],
      caption: caption.lines.join('\n'),
      captionLang: caption.lang,
      width: size.width,
      height: size.height,
    };
  });
  const imagesById = new Map(images.map((image) => [image.id, image]));
  function getImage(id: string) {
    const image = imagesById.get(id);
    if (!image) throw new Error(`Missing gallery image: ${slug}/${id}`);
    return image;
  }

  const blocks = data.blocks.map((block, index) => {
    if (block.type === 'heading') {
      return { type: block.type, index, ...localizeLines(block.text, locale) };
    }
    if (block.type === 'text') {
      const titleLang = locale === 'en' && block.title?.en ? 'en' : 'de';
      return {
        type: block.type,
        index,
        placement: block.placement,
        title: block.title?.[titleLang],
        titleLang,
        ...localizeLines(block.text, locale),
      };
    }

    return {
      type: block.type,
      images: block.images.map(({ id, details }) => ({
        ...getImage(id),
        details: details?.map(({ id }) => getImage(id)) ?? [],
      })),
    };
  });

  return { title: locale === 'en' ? data.series.titleEn ?? data.series.title : data.series.title, coverImageId: data.series.coverImageId, images, blocks };
}

export type LoadedBlockGallery = Awaited<ReturnType<typeof loadBlockGallery>>;
