import { constants } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { basename, join, parse, resolve } from 'node:path';

import { parse as parseHtml, parseFragment } from 'parse5';

import { parseBlockGallery } from '../src/gallery/blockContent.mjs';

const pages = {
  Auferstehen: ['auferstehen', 'Auf(er)stehen'],
  Malen_gegen_die_Dunkelheit: ['malen-gegen-die-dunkelheit', 'Malen gegen die Dunkelheit'],
  Noli_me_tangere: ['noli-me-tangere', 'Noli me tangere'],
  Das_Schweigen_brechen: ['das-schweigen-brechen', 'Das Schweigen brechen'],
  Mariupol: ['mariupol', 'Mariupol'],
  Begegnungsspuren: ['begegnungsspuren', 'Begegnungsspuren'],
  Corona: ['corona', 'Corona'],
  Fiesta_de_la_vida: ['fiesta-de-la-vida', 'Fiesta de la vida'],
  Sonnengesang: ['sonnengesang', 'Sonnengesang'],
  Hochzeit_des_Lichts: ['hochzeit-des-lichts', 'Hochzeit des Lichts'],
  Elementare_Akkorde: ['elementare-akkorde', 'Elementare Akkorde'],
  Sternengeburt: ['sternengeburt', 'Sternengeburt'],
  Archaeologie: ['archaeologie', 'Archäologie'],
  Azulen: ['azulen', 'Azulen'],
  Zeichnungen: ['zeichnungen', 'Zeichnungen', 'Drawings'],
};

const proseIds = new Set(['Begegnungsspuren_snippet31', 'Corona_snippet15']);

function attribute(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value ?? '';
}

function findAll(node, matches) {
  return (node.childNodes ?? []).flatMap((child) => [
    ...(matches(child) ? [child] : []),
    ...findAll(child, matches),
  ]);
}

function plainText(node) {
  if (node.nodeName === '#text') return node.value;
  if (node.tagName === 'br') return '\n';
  return (node.childNodes ?? []).map(plainText).join('');
}

function lines(node) {
  return plainText(node).split('\n').map((line) => line.trim().replace(/\s+/g, ' ')).filter(Boolean);
}

function tokens(node) {
  if (node.tagName === 'img') return [{ type: 'image', source: attribute(node, 'src') }];
  if (['style', 'script'].includes(node.tagName)) return [];

  const snippet = attribute(node, 'id');
  if (/^h[1-6]$/.test(node.tagName ?? '')) return [{ type: 'heading', snippet, lines: lines(node) }];
  if (/_snippet\d+$/.test(snippet) || node.nodeName === '#text') {
    const content = lines(node);
    return content.length ? [{ type: 'text', snippet, lines: content }] : [];
  }

  return (node.childNodes ?? []).flatMap(tokens);
}

function localized(token, translations) {
  const en = translations[token.snippet];
  return en ? { de: token.lines, en: lines(parseFragment(en)) } : { de: token.lines };
}

function extractBlocks(html, directory, title, translations) {
  const [body] = findAll(parseHtml(html), (node) => node.tagName === 'body');
  const rows = findAll(body, (node) => attribute(node, 'class').split(/\s+/).includes('row'));
  const blocks = [];
  let skippedPageTitle = false;

  for (const row of rows) {
    const content = tokens(row);
    let group = [];

    function finishGroup() {
      if (group.length) blocks.push({ type: 'images', images: group });
      group = [];
    }

    for (let index = 0; index < content.length; index++) {
      const token = content[index];
      if (token.type !== 'image') {
        finishGroup();
        if (token.type === 'heading' && !skippedPageTitle && token.lines.join(' ') === title) {
          skippedPageTitle = true;
          continue;
        }
        if (token.lines.length) blocks.push({ type: token.type, text: localized(token, translations) });
        continue;
      }

      const path = decodeURIComponent(token.source);
      const source = basename(path);
      if (path !== `${directory}/${source}` || !/^[^/\\]+\.jpe?g$/i.test(source)) {
        throw new Error(`Unsupported media path: ${path}`);
      }

      const caption = content[index + 1];
      if (caption?.type !== 'text' || proseIds.has(caption.snippet)) {
        throw new Error(`Missing caption for ${path}`);
      }

      group.push({
        id: parse(source).name.toLowerCase(),
        source,
        caption: localized(caption, translations),
      });
      index++;
    }

    finishGroup();
  }

  const importedCount = blocks.reduce((count, block) => count + (block.images?.length ?? 0), 0);
  const originalCount = findAll(body, (node) => node.tagName === 'img').length;
  if (importedCount !== originalCount) throw new Error(`Image count mismatch in ${directory}`);

  return blocks;
}

async function existsWithSameContent(path, expected) {
  try {
    const existing = await readFile(path);
    if (!existing.equals(expected)) throw new Error(`Existing file differs: ${path}`);
    return true;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return false;
  }
}

async function importPage(root, directory, [slug, title, titleEn], translations, write) {
  const html = await readFile(join(root, `${directory}.html`), 'utf8');
  const blocks = extractBlocks(html, directory, title, translations);
  const data = { series: { title, ...(titleEn && { titleEn }) }, blocks };
  const dataFile = new URL(`../src/gallery/${slug}.json`, import.meta.url);
  const existing = write ? await readFile(dataFile, 'utf8').catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  }) : undefined;
  const { entries } = parseBlockGallery(existing ? JSON.parse(existing) : data);

  const legacyMedia = join(root, directory);
  const available = new Set((await readdir(legacyMedia, { withFileTypes: true }))
    .filter((file) => file.isFile()).map((file) => file.name));
  for (const { source } of entries) {
    if (!available.has(source)) throw new Error(`Missing original with exact spelling: ${directory}/${source}`);
  }

  if (write) {
    const json = Buffer.from(JSON.stringify(data, null, 2) + '\n');
    const destination = new URL(`../media/${slug}/`, import.meta.url);
    await mkdir(destination, { recursive: true });
    for (const source of new Set(entries.map((entry) => entry.source))) {
      const input = join(legacyMedia, source);
      const output = new URL(encodeURIComponent(source), destination);
      if (!await existsWithSameContent(output, await readFile(input))) {
        await copyFile(input, output, constants.COPYFILE_EXCL);
      }
    }
    if (!existing) await writeFile(dataFile, json, { flag: 'wx' });
  }

  const rows = blocks.filter((block) => block.images?.length > 1).map((block) => block.images.length);
  console.log(`${slug}: ${entries.length} images; groups [${rows.join(', ')}]; ${blocks.filter((block) => block.type === 'text').length} text blocks; ${blocks.filter((block) => block.type === 'heading').length} headings.`);
}

const [legacy, mode, ...extra] = process.argv.slice(2);
if (!legacy || extra.length || (mode && mode !== '--write')) {
  console.error('Usage: node scripts/import-gallery-blocks.mjs <legacy-directory> [--write]');
  process.exitCode = 1;
} else {
  const root = resolve(legacy);
  const catalog = await readFile(join(root, 'Textressourcen', 'en.json'), 'utf8');
  const { content: translations } = JSON.parse(catalog.trim());
  for (const [directory, profile] of Object.entries(pages)) {
    await importPage(root, directory, profile, translations, mode === '--write');
  }
}
