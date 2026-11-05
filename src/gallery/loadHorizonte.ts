import { readFile } from 'node:fs/promises';

import type { Locale } from '../site/routes';
import { dimensionsSchema, parseHorizonte } from './content.mjs';
import content from './horizonte.json';

const text = {
  de: { material: 'Öl auf Leinwand', detail: 'Ausschnitt aus' },
  en: { material: 'Oil on canvas', detail: 'Detail from' },
};

const { series, entries, worksById } = parseHorizonte(content);
export const horizonteSeries = series;
export type GallerySeries = typeof series;

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

export async function loadHorizonte(locale: Locale): Promise<GalleryImage[]> {
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
    const workFacts = `${work.year}, ${labels.material}, ${measurements}`;
    const caption = isDetail ? alt : `${work.title}, ${workFacts}`;

    return {
      id: entry.id,
      workId: work.id,
      workTitle: work.title,
      workFacts,
      src: `/horizonte/${entry.id}.webp`,
      alt,
      caption,
      width: size.width,
      height: size.height,
      isDetail,
    };
  });
}
