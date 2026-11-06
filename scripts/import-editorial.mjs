import { constants } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

import { parse, parseFragment } from 'parse5';

const pages = [
  ['Arbeitssituationen', 'arbeitssituationen', 'Arbeitssituationen', 'Work Situations', 'photo-essay'],
  ['Ausstellungen', 'ausstellungen', 'Ausstellungen', 'Exhibitions', 'timeline'],
  ['Literatur', 'literatur', 'Bücher und Kataloge', 'Books and Catalogues', 'cards'],
  ['Flyer', 'flyer', 'Flyer', 'Flyers', 'cards'],
  ['Kunst_am_Bau', 'kunst-am-bau', 'Kunst am Bau', 'Art in Architecture', 'essay'],
  ['Presse', 'presse', 'Presse', 'Press', 'cards'],
  ['Filme', 'filme', 'Filme', 'Films', 'cards'],
  ['Statement', 'statement', 'Statement', 'Statement', 'essay'],
  ['Impressum', 'impressum', 'Impressum & Datenschutz', 'Legal Notice & Data Protection', 'legal'],
  ['ArtKa_2017', 'artka-2017', 'Art Karlsruhe 2017', 'Art Karlsruhe 2017', 'archive'],
];

const headings = new Map([
  ['Kunst_am_Bau_snippet25', 'glasfenster'],
  ['Kunst_am_Bau_tableGrid60snippet0', 'codaaward'],
  ['Kunst_am_Bau_snippet39', 'herstellung'],
  ['Kunst_am_Bau_snippet40', 'gemaelde'],
  ['Statement_snippet34', 'horizont'],
  ['Statement_snippet33', 'malen-wider-dem-wahnsinn'],
  ['Statement_snippet32', 'malen-gegen-die-dunkelheit'],
  ['Statement_snippet23', 'malerei-am-nerv-der-zeit'],
  ['Statement_snippet16', 'malerei-ist-aktuell'],
  ['Impressum_snippet8', 'datenschutz'],
  ['ArtKa_2017_snippet62', 'filmbericht'],
  ['ArtKa_2017_snippet64', 'bilder'],
  ['ArtKa_2017_snippet68', 'literatur'],
]);

function attribute(node, key) {
  return node.attrs?.find((attr) => attr.name === key)?.value ?? '';
}

function children(node) {
  return node.childNodes ?? [];
}

function collect(node, matches) {
  if (matches(node)) return [node];
  return children(node).flatMap((child) => collect(child, matches));
}

function plain(node) {
  if (node.nodeName === '#text') return node.value.replace(/\s+/g, ' ');
  if (node.tagName === 'br') return '\n';
  return children(node).map(plain).join('');
}

function text(node) {
  return plain(node).split('\n').map((line) => line.trim()).join('\n').trim();
}

function localized(node, translations) {
  const en = translations[attribute(node, 'id')];
  return { de: text(node), ...(en && { en: text(parseFragment(en)) }) };
}

function mediaSource(url) {
  const source = decodeURIComponent(url.replace(/^https?:\/\/www\.ursula-juengst\.com\//i, '').replace(/^\//, ''));
  if (!/^[\w-]+\/[\w.@ -]+\.(?:jpe?g|png|pdf|mp4)$/i.test(source)) {
    throw new Error(`Unsupported local media: ${url}`);
  }
  return source;
}

function linkFor(node) {
  const href = attribute(node, 'href');
  if (/\.pdf$/i.test(href)) return { type: 'download', source: mediaSource(href), label: text(node) };
  if (/^https?:\/\/www\.ursula-juengst\.com\/Begegnungsspuren\.html$/i.test(href)) {
    return { type: 'page-link', page: 'begegnungsspuren', label: text(node) };
  }
  if (/^(https:\/\/|mailto:)/i.test(href)) return { type: 'link', href, label: text(node) || href };
  return undefined;
}

function partsFrom(node, translations, excerptLabels) {
  const id = attribute(node, 'id');
  const tag = node.tagName;
  // The empty link in Auf(er)stehen points to a different book's PDF.
  if (id === 'Literatur_snippet107') return [];
  if (['script', 'style'].includes(tag)) return [];
  if (tag === 'h1') {
    return collect(node, (item) => headings.has(attribute(item, 'id')))
      .flatMap((item) => partsFrom(item, translations, excerptLabels));
  }
  if (tag === 'img') {
    if (attribute(node, 'class').split(/\s+/).includes('modal-content')) return [];
    return [{ type: 'image', source: mediaSource(attribute(node, 'src')) }];
  }
  if (tag === 'video') {
    const source = attribute(node, 'src') || attribute(collect(node, (item) => item.tagName === 'source')[0], 'src');
    const poster = attribute(node, 'poster');
    return [{ type: 'video', source: mediaSource(source), ...(poster && { poster: mediaSource(poster) }) }];
  }
  if (tag === 'iframe') {
    const match = /^https:\/\/www\.youtube\.com\/embed\/([\w-]{11})(?:\?|$)/.exec(attribute(node, 'src'));
    if (!match) throw new Error(`Unsupported embed: ${attribute(node, 'src')}`);
    return [{ type: 'youtube', videoId: match[1] }];
  }
  if (excerptLabels.has(id)) {
    return [{
      type: 'excerpt',
      label: excerptLabels.get(id),
      parts: children(node).flatMap((child) => partsFrom(child, translations, excerptLabels)),
    }];
  }
  if (tag === 'a') {
    if (attribute(node, 'data-toggle') === 'collapse') return [];
    const link = linkFor(node);
    const images = collect(node, (item) => item.tagName === 'img')
      .flatMap((item) => partsFrom(item, translations, excerptLabels));
    return link ? [...images, link] : images;
  }
  if (/snippet\d+[a-z]?$/i.test(id) && !collect(node, (item) => ['img', 'video', 'iframe'].includes(item.tagName)).length) {
    const links = collect(node, (item) => item.tagName === 'a').map(linkFor).filter(Boolean);
    const value = localized(node, translations);
    const heading = headings.get(id);
    if (!value.de || links.some((link) => link.label === value.de)) return links;
    return [{ type: heading ? 'heading' : 'text', value, ...(heading && { anchor: heading }) }, ...links];
  }

  return children(node).flatMap((child) => partsFrom(child, translations, excerptLabels));
}

function deduplicateLinks(parts) {
  const labeled = new Set(parts.filter((part) => part.label).map((part) => part.href ?? part.source ?? part.page));
  const seen = new Set();
  return parts.filter((part) => {
    if (!['link', 'download', 'page-link'].includes(part.type)) return true;
    const key = part.href ?? part.source ?? part.page;
    if (seen.has(key) || (!part.label && labeled.has(key))) return false;
    seen.add(key);
    return true;
  });
}

function attachCaptions(parts) {
  const items = [];
  for (const part of parts) {
    const previous = items.at(-1);
    if (part.type === 'text' && previous?.type === 'image' && !previous.caption) {
      previous.caption = part.value;
    } else {
      items.push(part);
    }
  }
  return items;
}

function toTimeline(parts) {
  const body = parts.find((part) => part.type === 'text');
  if (!body) throw new Error('Exhibition list is missing.');
  const sections = [];
  for (const line of body.value.de.split('\n').filter(Boolean)) {
    if (/^\d{4}$/.test(line)) sections.push({ title: { de: line, en: line }, parts: [] });
    else {
      if (sections.length === 0) sections.push({ parts: [] });
      const current = sections.at(-1).parts;
      const paragraph = current[0];
      if (paragraph) paragraph.value.de += '\n' + line;
      else current.push({ type: 'text', value: { de: line } });
    }
  }
  return [...parts.filter((part) => part.type === 'image').map((part) => ({ parts: [part] })), ...sections];
}

async function extract(root, translations, [source, slug, de, en, layout]) {
  const document = parse(await readFile(join(root, source + '.html'), 'utf8'));
  const body = collect(document, (node) => node.tagName === 'body')[0];
  const rows = collect(body, (node) => attribute(node, 'class').split(/\s+/).includes('row'));
  const excerptLabels = new Map(collect(body, (node) => attribute(node, 'data-toggle') === 'collapse')
    .map((node) => [attribute(node, 'href').slice(1), localized(node, translations)]));
  const sections = [];

  for (const row of rows) {
    if (source === 'ArtKa_2017' && attribute(row, 'class').includes('website_shared_header_')) continue;
    let parts = deduplicateLinks(partsFrom(row, translations, excerptLabels));
    if (parts.length === 0) continue;
    if (layout === 'photo-essay' || layout === 'archive' || source === 'Statement') parts = attachCaptions(parts);

    let title;
    if (layout === 'cards') {
      const index = parts.findIndex((part) => part.type === 'text');
      if (index !== -1) title = parts.splice(index, 1)[0].value;
      if (!title) {
        const link = parts.find((part) => part.label);
        if (link) title = { de: link.label };
      }
    }

    if (source === 'Presse' && title) {
      title.de = title.de.replace(/\s*-\s*zum Lesen bitte hier klicken.*$/i, '');
    }

    sections.push({ ...(title && { title }), parts });
  }

  if (layout === 'archive') {
    const blocks = sections.flatMap((section) => section.parts);
    const grouped = [];
    for (const part of blocks) {
      if (part.type === 'text' && grouped.at(-1)?.parts.at(-1)?.type === 'image') {
        grouped.at(-1).parts.at(-1).caption = part.value;
      } else if (part.type === 'heading') {
        const previous = grouped.at(-1);
        if (part.anchor === 'filmbericht' && previous?.parts.some((item) => item.type === 'youtube')) {
          previous.title = part.value;
          previous.anchor = part.anchor;
        } else {
          grouped.push({ title: part.value, anchor: part.anchor, parts: [] });
        }
      } else {
        if (!grouped.length) grouped.push({ parts: [] });
        grouped.at(-1).parts.push(part);
      }
    }
    return { slug, title: { de, en }, layout, sections: grouped };
  }

  return {
    slug,
    title: { de, en },
    layout,
    sections: layout === 'timeline' ? toTimeline(sections.flatMap((section) => section.parts)) : sections,
  };
}

function mediaFor(part) {
  if (part.type === 'excerpt') return part.parts.flatMap(mediaFor);
  return [...(part.source ? [part.source] : []), ...(part.poster ? [part.poster] : [])];
}

async function copyOriginal(root, source, target) {
  const folder = dirname(source);
  const files = await readdir(join(root, folder));
  if (!files.includes(source.slice(folder.length + 1))) throw new Error(`Missing media: ${source}`);
  const output = new URL(source.split('/').map(encodeURIComponent).join('/'), target);
  await mkdir(new URL('./', output), { recursive: true });

  try {
    await copyFile(join(root, source), output, constants.COPYFILE_EXCL);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    if (!(await readFile(output)).equals(await readFile(join(root, source)))) {
      throw new Error(`Existing media differs: ${source}`);
    }
  }
}

const [legacy, mode, ...extra] = process.argv.slice(2);
if (!legacy || extra.length || (mode && mode !== '--write')) {
  console.error('Usage: node scripts/import-editorial.mjs <legacy-directory> [--write]');
  process.exit(1);
}

const root = resolve(legacy);
const { content: translations } = JSON.parse((await readFile(join(root, 'Textressourcen/en.json'), 'utf8')).trim());
const content = await Promise.all(pages.map((page) => extract(root, translations, page)));
const originals = new Set(content.flatMap((page) => page.sections.flatMap((section) => section.parts.flatMap(mediaFor))));

if (mode === '--write') {
  const dataFile = new URL('../src/editorial/pages.json', import.meta.url);
  const json = JSON.stringify(content, null, 2) + '\n';
  const existing = await readFile(dataFile, 'utf8').catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  });
  if (existing && existing !== json) throw new Error('Existing editorial data differs. Review before importing.');
  const media = new URL('../media/editorial/', import.meta.url);
  for (const source of originals) await copyOriginal(root, source, media);
  if (!existing) await writeFile(dataFile, json, { flag: 'wx' });
}

for (const page of content) console.log(`${page.slug}: ${page.sections.length} sections.`);
console.log(`${originals.size} unique media files.`);
