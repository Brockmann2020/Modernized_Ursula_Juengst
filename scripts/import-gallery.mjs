import { constants } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join, parse, resolve } from 'node:path';

import { parse as parseHtml } from 'parse5';

import { parseGallery } from '../src/gallery/content.mjs';

const profiles = {
  Primavera: {
    titleCorrections: {
      'Krokusbraut lI': 'Krokusbraut II',
      'Krokusbraut Il': 'Krokusbraut II',
      'Krokusbraut lIl': 'Krokusbraut III',
    },
    coverFile: 'image3.JPG',
  },
};

function descendants(node, matches) {
  const children = node.childNodes ?? [];
  return children.flatMap((child) => [
    ...(matches(child) ? [child] : []),
    ...descendants(child, matches),
  ]);
}

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value ?? '';
}

function text(node, ignored = new Set()) {
  if (ignored.has(node) || node.tagName === 'script' || node.tagName === 'style') return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map((child) => text(child, ignored)).join(' ');
}

function clean(value) {
  return value.trim().replace(/\s+/g, ' ');
}

function slug(value) {
  return value.normalize('NFKD').replace(/\p{Mark}/gu, '').toLowerCase()
    .replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractGallery(html, directory, profile) {
  const document = parseHtml(html);
  const [body] = descendants(document, (node) => node.tagName === 'body');
  const headings = descendants(body, (node) => node.tagName === 'h1');
  if (headings.length !== 1) throw new Error('Expected exactly one page heading.');

  const series = { title: clean(text(headings[0])) };
  const isImage = (node) => node.tagName === 'img';
  const allImages = descendants(body, isImage);
  const rows = descendants(body, (node) => attribute(node, 'class').split(/\s+/).includes('row'));
  if (clean(text(body, new Set(rows))) !== '') {
    throw new Error('Text outside gallery rows requires review.');
  }

  const works = [];
  const entries = [];
  const seenImages = new Set();
  const titleOf = (title) => profile.titleCorrections?.[title] ?? title;

  for (const row of rows) {
    const images = descendants(row, isImage);
    if (images.length === 0 && (clean(text(row)) === '' || descendants(row, (node) => node === headings[0]).length === 1)) continue;
    if (images.length !== 1 || seenImages.has(images[0])) {
      throw new Error('Only one image per row is supported. Text blocks and nested rows require review.');
    }

    const [image] = images;
    const source = decodeURIComponent(attribute(image, 'src'));
    const filename = basename(source);
    if (source !== `${directory}/${filename}` || !/^[^/\\]+\.jpe?g$/i.test(filename)) {
      throw new Error(`Unsupported image path: ${source}`);
    }

    const captions = descendants(row, (node) => /_(?:snippet\d+|caption(?:_|$))/.test(attribute(node, 'id')));
    const caption = clean(text(row));
    if (captions.length !== 1 || clean(text(captions[0])) !== caption) {
      throw new Error(`Expected a single caption without extra text: ${source}`);
    }
    const detail = /^Ausschnitt aus\s+[„"](.+?)[“"](?:\s*,\s*(\d{4}))?$/i.exec(caption);
    if (detail) {
      const work = works.at(-1);
      if (!work || work.title !== titleOf(detail[1]) || (detail[2] && work.year !== Number(detail[2]))) {
        throw new Error(`Unclear detail-to-work assignment: ${source} (${caption})`);
      }
      entries.push({ id: `detail-${slug(parse(filename).name)}`, work: work.id, source: filename, view: 'detail' });
    } else {
      const match = /^(.+?),\s*(\d{4})[.,]?\s+Öl\s*(?:\/\s*Lw|auf Leinwand),\s*(\d+)\s*(?:cm\s*)?[x×]\s*(\d+)\s*cm$/i.exec(caption);
      if (!match) throw new Error(`Unsupported caption: ${source} (${caption})`);

      const [, title, year, height, width] = match;
      const work = {
        id: slug(titleOf(title)),
        title: titleOf(title),
        year: Number(year),
        material: 'oil-on-canvas',
        heightCm: Number(height),
        widthCm: Number(width),
      };
      works.push(work);
      entries.push({ id: work.id, work: work.id, source: filename, view: 'full' });
    }
    seenImages.add(image);
  }

  if (seenImages.size !== allImages.length) throw new Error('Some images are outside supported gallery rows.');
  if (profile.coverFile) {
    const cover = entries.find((entry) => entry.source === profile.coverFile);
    if (!cover) throw new Error(`Cover image not found: ${profile.coverFile}`);
    series.coverImageId = cover.id;
  }

  const content = { series, works, entries };
  parseGallery(content);
  return content;
}

async function existingFile(path) {
  try {
    return await readFile(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  }
}

async function importGallery(legacyDirectory, page, write) {
  const directory = parse(page).name;
  const gallery = slug(directory);
  if (!gallery) throw new Error('The page filename needs a usable gallery slug.');
  const legacyMedia = join(legacyDirectory, directory);
  const html = await readFile(join(legacyDirectory, page), 'utf8');
  const profile = Object.hasOwn(profiles, directory) ? profiles[directory] : {};
  const content = extractGallery(html, directory, profile);
  const sourceFiles = new Set(await readdir(legacyMedia, { withFileTypes: true })
    .then((files) => files.filter((file) => file.isFile()).map((file) => file.name)));
  for (const { source } of content.entries) {
    if (!sourceFiles.has(source)) throw new Error(`Missing original with exact spelling: ${source}`);
  }

  const json = JSON.stringify(content, null, 2) + '\n';
  if (!write) {
    process.stdout.write(json);
    return;
  }

  const destination = new URL(`../media/${gallery}/`, import.meta.url);
  const dataFile = new URL(`../src/gallery/${gallery}.json`, import.meta.url);
  const existingJson = await existingFile(dataFile);
  if (existingJson && JSON.stringify(JSON.parse(existingJson.toString())) !== JSON.stringify(content)) {
    throw new Error(`Existing gallery data differs: src/gallery/${gallery}.json`);
  }

  const pendingFiles = [];
  for (const source of new Set(content.entries.map((entry) => entry.source))) {
    const input = join(legacyMedia, source);
    const output = new URL(encodeURIComponent(source), destination);
    const existing = await existingFile(output);
    if (!existing) pendingFiles.push({ input, output });
    else if (!existing.equals(await readFile(input))) throw new Error(`Existing media differs: ${source}`);
  }

  await mkdir(destination, { recursive: true });
  for (const { input, output } of pendingFiles) await copyFile(input, output, constants.COPYFILE_EXCL);
  if (!existingJson) await writeFile(dataFile, json, { flag: 'wx' });

  console.log(`${content.series.title}: ${content.works.length} works, ${content.entries.length} images.`);
}

const [legacyDirectory, page, mode, ...extra] = process.argv.slice(2);
if (!legacyDirectory || !/^[\w-]+\.html$/i.test(page ?? '') || extra.length || (mode && mode !== '--write')) {
  console.error('Usage: node scripts/import-gallery.mjs <legacy-directory> <page.html> [--write]');
  process.exitCode = 1;
} else {
  try {
    await importGallery(resolve(legacyDirectory), page, mode === '--write');
  } catch (error) {
    console.error(`Gallery import stopped: ${error.message}`);
    process.exitCode = 1;
  }
}
