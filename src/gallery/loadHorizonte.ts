import { readFile } from 'node:fs/promises';

import type { Locale } from '../site/routes';
import { dimensionsSchema, parseHorizonte } from './content.mjs';
import content from './horizonte.json';

const text = {
  de: { material: 'Öl auf Leinwand', detail: 'Ausschnitt aus' },
  en: { material: 'Oil on canvas', detail: 'Detail from' },
};

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  isDetail: boolean;
}

export async function loadHorizonte(locale: Locale): Promise<GalleryImage[]> {
  const { entries, worksById } = parseHorizonte(content);
  const manifest = await readFile('.generated/horizonte.json', 'utf8');
  const sizes = dimensionsSchema.parse(JSON.parse(manifest));
  const labels = text[locale];

  return entries.map((entry) => {
    const work = worksById.get(entry.work);
    const size = sizes[entry.id];

    if (!work || !size) throw new Error(`Incomplete Horizonte image: ${entry.id}`);

    const isDetail = entry.view === 'detail';
    const alt = isDetail ? `${labels.detail} ${work.title}` : work.title;
    const measurements = `${work.heightCm} × ${work.widthCm} cm`;
    const caption = isDetail
      ? alt
      : `${work.title}, ${work.year}, ${labels.material}, ${measurements}`;

    return {
      id: entry.id,
      src: `/horizonte/${entry.id}.webp`,
      alt,
      caption,
      width: size.width,
      height: size.height,
      isDetail,
    };
  });
}
