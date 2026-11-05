import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { parseBlockGallery } from '../src/gallery/blockContent.mjs';
import { parseGallery } from '../src/gallery/content.mjs';
import gallerySeries from '../src/gallery/series.json' with { type: 'json' };

const manifestDir = new URL('../.generated/', import.meta.url);

async function prepareGallery(slug) {
  const dataFile = new URL(`../src/gallery/${slug}.json`, import.meta.url);
  const sourceDir = new URL(`../media/${slug}/`, import.meta.url);
  const outputDir = new URL(`../public/${slug}/`, import.meta.url);
  const data = JSON.parse(await readFile(dataFile, 'utf8'));
  const { entries } = 'blocks' in data ? parseBlockGallery(data) : parseGallery(data);
  const sourceFiles = await readdir(sourceDir).catch((error) => {
    if (error.code !== 'ENOENT') throw error;

    throw new Error(`Add the originals under media/${slug}/ before building.`);
  });

  const missing = entries.filter((entry) => !sourceFiles.includes(entry.source));
  if (missing.length > 0) {
    throw new Error(`Missing originals in media/${slug}/: ${missing.map((entry) => entry.source).join(', ')}`);
  }

  await mkdir(outputDir, { recursive: true });
  const dimensions = new Map();

  for (const { id, source } of entries) {
    const input = fileURLToPath(new URL(encodeURIComponent(source), sourceDir));
    const output = fileURLToPath(new URL(`${id}.webp`, outputDir));

    const { width, height } = await sharp(input)
      .autoOrient()
      .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 })
      .toFile(output);

    dimensions.set(id, { width, height });
  }

  await writeFile(
    new URL(`${slug}.json`, manifestDir),
    JSON.stringify(Object.fromEntries(dimensions), null, 2) + '\n',
  );
}

await mkdir(manifestDir, { recursive: true });
for (const slug of gallerySeries) await prepareGallery(slug);
