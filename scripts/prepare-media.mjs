import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { prepareEditorialMedia } from './prepare-editorial-media.mjs';
import { prepareImage } from './prepare-image.mjs';

import { parseBlockGallery } from '../src/gallery/blockContent.mjs';
import { parseGallery } from '../src/gallery/content.mjs';
import newsArticles from '../src/news/news.json' with { type: 'json' };
import gallerySeries from '../src/gallery/series.json' with { type: 'json' };

const manifestDir = new URL('../.generated/', import.meta.url);

async function prepareProfileImages() {
  const originals = new URL('../media/profile/', import.meta.url);
  const output = new URL('../public/profile/', import.meta.url);
  await mkdir(output, { recursive: true });

  for (const name of ['biografie', 'kontakt']) {
    await prepareImage(
      fileURLToPath(new URL(name + '.JPG', originals)),
      fileURLToPath(new URL(name + '.webp', output)),
    );
  }
}

async function prepareNewsMedia() {
  const originals = new URL('../media/news/', import.meta.url);
  const output = new URL('../public/news/', import.meta.url);
  await mkdir(output, { recursive: true });

  const photos = new Set(newsArticles.flatMap((article) => article.images.map((image) => image.source)));
  for (const name of photos) {
    if (!/^[\w.-]+\.jpe?g$/i.test(name)) throw new Error('Invalid news image: ' + name);
    const input = fileURLToPath(new URL(encodeURIComponent(name), originals));
    const target = fileURLToPath(new URL(encodeURIComponent(name.replace(/\.jpe?g$/i, '.webp')), output));
    await prepareImage(input, target);
  }

  const downloads = new Set(newsArticles.flatMap((article) =>
    article.links.filter((link) => link.download).map((link) => link.href),
  ));
  for (const href of downloads) {
    const match = /^\/news\/([\w.-]+\.pdf)$/i.exec(href);
    if (!match) throw new Error('Invalid news download: ' + href);
    await copyFile(new URL(match[1], originals), new URL(match[1], output));
  }
}

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

    const { width, height } = await prepareImage(input, output);

    dimensions.set(id, { width, height });
  }

  await writeFile(
    new URL(`${slug}.json`, manifestDir),
    JSON.stringify(Object.fromEntries(dimensions), null, 2) + '\n',
  );
}

await mkdir(manifestDir, { recursive: true });
await prepareProfileImages();
await prepareNewsMedia();
await prepareEditorialMedia();
for (const slug of gallerySeries) await prepareGallery(slug);
