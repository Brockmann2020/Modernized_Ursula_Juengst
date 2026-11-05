import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import { parseHorizonte } from '../src/gallery/content.mjs';

const dataFile = new URL('../src/gallery/horizonte.json', import.meta.url);
const sourceDir = new URL('../media/horizonte/', import.meta.url);
const outputDir = new URL('../public/horizonte/', import.meta.url);
const manifestDir = new URL('../.generated/', import.meta.url);

const { entries } = parseHorizonte(JSON.parse(await readFile(dataFile, 'utf8')));
const sourceFiles = await readdir(sourceDir).catch((error) => {
  if (error.code !== 'ENOENT') throw error;

  throw new Error('Add the Horizonte originals under media/horizonte/ before building.');
});

const missing = entries.filter((entry) => !sourceFiles.includes(entry.source));
if (missing.length > 0) {
  throw new Error(`Missing originals in media/horizonte/: ${missing.map((entry) => entry.source).join(', ')}`);
}

await mkdir(outputDir, { recursive: true });
await mkdir(manifestDir, { recursive: true });

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
  new URL('horizonte.json', manifestDir),
  JSON.stringify(Object.fromEntries(dimensions), null, 2) + '\n',
);
