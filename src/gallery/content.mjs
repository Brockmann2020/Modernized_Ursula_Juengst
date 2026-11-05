import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9-]+$/);
const positiveInteger = z.number().int().positive();

const schema = z.object({
  series: z.object({
    title: z.string().trim().min(1),
    introduction: z.object({
      de: z.string().trim().min(1),
      en: z.string().trim().min(1),
    }).optional(),
    coverImageId: id.optional(),
  }),
  works: z.array(z.object({
    id,
    title: z.string().trim().min(1),
    year: positiveInteger,
    material: z.literal('oil-on-canvas'),
    heightCm: positiveInteger,
    widthCm: positiveInteger,
  })).min(1),
  entries: z.array(z.object({
    id,
    work: id,
    source: z.string().regex(/^[^/\\\\]+\.jpe?g$/i),
    view: z.enum(['full', 'detail']),
  })).min(1),
});

export const dimensionsSchema = z.record(id, z.object({
  width: positiveInteger,
  height: positiveInteger,
}));

/** @param {unknown} input */
export function parseGallery(input) {
  const { series, works, entries } = schema.parse(input);
  const worksById = new Map(works.map((work) => [work.id, work]));
  const imageIds = new Set(entries.map((entry) => entry.id));

  if (worksById.size !== works.length) throw new Error('Duplicate gallery work ID.');
  if (imageIds.size !== entries.length) throw new Error('Duplicate gallery image ID.');

  for (const entry of entries) {
    if (!worksById.has(entry.work)) {
      throw new Error(`Image "${entry.id}" refers to unknown work "${entry.work}".`);
    }
  }

  if (series.coverImageId && !imageIds.has(series.coverImageId)) {
    throw new Error(`Unknown cover image: ${series.coverImageId}.`);
  }

  return { series, worksById, entries };
}
