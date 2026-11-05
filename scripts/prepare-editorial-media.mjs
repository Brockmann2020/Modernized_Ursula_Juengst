import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

import pages from '../src/editorial/pages.json' with { type: 'json' };
import { prepareImage } from './prepare-image.mjs';

function mediaFor(part) {
  if (part.type === 'excerpt') return part.parts.flatMap(mediaFor);
  return [...(part.source ? [part.source] : []), ...(part.poster ? [part.poster] : [])];
}

function assetUrl(source, root) {
  return new URL(source.split('/').map(encodeURIComponent).join('/'), root);
}

export async function prepareEditorialMedia() {
  const sourceRoot = new URL('../media/editorial/', import.meta.url);
  const outputRoot = new URL('../public/editorial/', import.meta.url);
  const manifestRoot = new URL('../.generated/', import.meta.url);
  const dimensions = {};
  const files = new Set(pages.flatMap((page) =>
    page.sections.flatMap((section) => section.parts.flatMap(mediaFor)),
  ));

  for (const source of files) {
    if (!/^[\w-]+\/[\w.@ -]+\.(?:jpe?g|png|pdf|mp4)$/i.test(source)) {
      throw new Error(`Invalid editorial media: ${source}`);
    }

    const image = /\.(?:jpe?g|png)$/i.test(source);
    const optimize = image && !source.startsWith('Presse/');
    const input = assetUrl(source, sourceRoot);
    const output = assetUrl(optimize ? source.replace(/\.[^.]+$/, '.webp') : source, outputRoot);
    await mkdir(new URL('./', output), { recursive: true });

    if (optimize) {
      const { width, height } = await prepareImage(
        fileURLToPath(input), fileURLToPath(output), { failOn: 'error' },
      ).catch((error) => {
        throw new Error(`Could not prepare editorial image ${source}`, { cause: error });
      });
      dimensions[source] = { width, height };
    } else {
      await copyFile(input, output);
      if (image) {
        const { width, height } = await sharp(fileURLToPath(input)).metadata();
        dimensions[source] = { width, height };
      }
    }
  }

  await mkdir(manifestRoot, { recursive: true });
  await writeFile(new URL('editorial.json', manifestRoot), JSON.stringify(dimensions) + '\n');
}
