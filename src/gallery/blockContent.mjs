import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9-]+$/);
const title = z.string().trim().min(1);
const lines = z.array(title).min(1);
const localizedLines = z.object({ de: lines, en: lines.optional() });
const image = z.object({
  id,
  source: z.string().regex(/^[^/\\]+\.jpe?g$/i),
  caption: localizedLines,
});

const schema = z.object({
  series: z.object({ title, titleEn: title.optional(), coverImageId: id.optional() }),
  blocks: z.array(z.discriminatedUnion('type', [
    z.object({ type: z.literal('images'), images: z.array(image).min(1).max(3) }),
    z.object({
      type: z.literal('text'),
      text: localizedLines,
      placement: z.enum(['intro', 'inline']).optional(),
      title: z.object({ de: title, en: title.optional() }).optional(),
    }),
    z.object({ type: z.literal('heading'), text: localizedLines }),
  ])).min(1),
});

/** @param {unknown} input */
export function parseBlockGallery(input) {
  const { series, blocks } = schema.parse(input);
  const entries = blocks.flatMap((block) => block.type === 'images' ? block.images : []);

  if (entries.length === 0) throw new Error('A gallery must have at least one image.');
  if (new Set(entries.map((entry) => entry.id)).size !== entries.length) {
    throw new Error('Duplicate gallery image ID.');
  }

  if (series.coverImageId && !entries.some((entry) => entry.id === series.coverImageId)) {
    throw new Error(`Unknown gallery cover: ${series.coverImageId}`);
  }

  return { series, blocks, entries };
}
