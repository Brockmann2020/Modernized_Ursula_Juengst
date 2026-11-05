import { constants } from 'node:fs';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import { parse, parseFragment } from 'parse5';

const profiles = [
  { id: 'tiepolo-wuerzburg', heading: 41, rows: [41], title: 1, featured: true },
  { id: 'horizont-miltenberg', heading: 31, rows: [32], title: 1, featured: true },
  { id: 'esperanza', heading: 3, rows: [2], title: 1 },
  { id: 'auferstehen-finissage', heading: 1, rows: [8], title: 1 },
  { id: 'auferstehen-bernried', heading: 5, rows: [4], title: 1 },
  { id: 'kraft-der-zaertlichkeit', heading: 7, rows: [28], title: 1 },
  { id: 'aufgefaechert', heading: 20, rows: [30, 19], title: 1 },
  { id: 'neue-gemaelde-spanien', heading: 18, rows: [17], title: 0 },
  { id: 'malen-paderborn', heading: 6, rows: [29], title: 1 },
  { id: 'kunstraum-heilsbronn', heading: 9, rows: [15], title: 0 },
  { id: 'ariadnefaeden-monografie', heading: 21, rows: [25], title: 1 },
  { id: 'farbabstimmung-monografie', heading: 10, rows: [26, 27], title: 1 },
  { id: 'begegnungsspuren-spanien', heading: 16, rows: [14], title: 0 },
  { id: 'codaaward-2021', heading: 12, rows: [22, 11, 13, 23], title: 0 },
];

const captionIds = new Map([
  ['MvWM-Ecksaal-Beispiel_260625_klein.jpg', 'Aktuell_snippet84'],
  ['image16.JPG', 'Aktuell_snippet44'],
  ['image75.JPG', 'Aktuell_snippet78'],
  ['image45.JPG', 'Aktuell_snippet47'],
  ['image46.JPG', 'Aktuell_snippet49'],
]);

function descendants(node) {
  return (node.childNodes ?? []).flatMap((child) => [child, ...descendants(child)]);
}

function attribute(node, name) {
  return node.attrs?.find((attr) => attr.name === name)?.value ?? '';
}

function plainText(node) {
  if (node.nodeName === '#text') return node.value.replace(/\s+/g, ' ');
  if (node.tagName === 'br') return '\n';
  return (node.childNodes ?? []).map(plainText).join('');
}

function text(node) {
  return plainText(node).split('\n').map((line) => line.trim()).join('\n').trim();
}

function translationFor(id, article, translations) {
  if (['Aktuell_snippet91', 'Aktuell_snippet93', 'Aktuell_snippet93b', 'Aktuell_snippet94'].includes(id)
    && article !== 'horizont-miltenberg') return undefined;
  if (id === 'Aktuell_snippet84' && article !== 'esperanza') return undefined;
  const translation = translations[id];
  return translation ? text(parseFragment(translation)) : undefined;
}

function extractArticle(profile, rows, translations, mediaSources) {
  const heading = descendants(rows.get(profile.heading)[0])
    .filter((node) => /Aktuell_tableGrid\d+snippet\d+/.test(attribute(node, 'class')))
    .map((node) => text(node).replace(/\s+/g, ' '));
  if (!heading[profile.title]) throw new Error(`Missing heading: ${profile.id}`);

  const nodes = profile.rows.flatMap((number) => {
    const matches = rows.get(number);
    if (!matches) throw new Error(`Missing source section: ${number}`);
    return (number === profile.heading ? matches.slice(1) : matches).flatMap(descendants);
  });

  const captions = new Set();
  const images = nodes.filter((node) => node.tagName === 'img').map((node) => {
    const source = decodeURIComponent(attribute(node, 'src'));
    if (!/^(Aktuell|Flyer)\/[\w.-]+\.jpe?g$/i.test(source)) throw new Error(`Unsupported image: ${source}`);
    const name = basename(source);
    mediaSources.set(name, source);

    const captionId = captionIds.get(name);
    const captionNode = captionId && nodes.find((item) => attribute(item, 'id') === captionId);
    if (!captionNode) return { source: name };

    captions.add(captionNode);
    const en = translationFor(captionId, profile.id, translations);
    return { source: name, caption: { de: text(captionNode), ...(en && { en }) } };
  });

  const links = new Map();
  for (const node of nodes.filter((item) => item.tagName === 'a')) {
    const href = attribute(node, 'href');
    const pdf = /^(?:https?:\/\/www\.ursula-juengst\.com\/)?(Flyer\/[\w.-]+\.pdf)$/i.exec(href);
    if (pdf) {
      const filename = basename(pdf[1]);
      mediaSources.set(filename, pdf[1]);
      links.set(`/news/${filename}`, { href: `/news/${filename}`, label: text(node), download: true });
    } else if (/^(https:\/\/|mailto:|tel:)/i.test(href)) {
      links.set(href, { href, label: text(node) || href });
    }
  }

  const paragraphs = nodes.flatMap((node) => {
    const id = attribute(node, 'id');
    if (!/_snippet\d+[a-z]?$|tableGrid\d+snippet\d+$/.test(id) || captions.has(node)) return [];
    const de = text(node);
    if (!de || Array.from(links.values()).some((link) => link.label === de)) return [];
    const en = translationFor(id, profile.id, translations);
    return [{ de, ...(en && { en }) }];
  });

  return {
    id: profile.id,
    title: heading[profile.title],
    context: heading.filter((_, index) => index !== profile.title),
    featured: profile.featured ?? false,
    carousel: nodes.some((node) => /^Aktuell_carousel\d+$/.test(attribute(node, 'id'))),
    images,
    paragraphs,
    links: Array.from(links.values()),
  };
}

const [legacy, mode, ...extra] = process.argv.slice(2);
if (!legacy || extra.length || (mode && mode !== '--write')) {
  console.error('Usage: node scripts/import-news.mjs <legacy-directory> [--write]');
  process.exit(1);
}

const root = resolve(legacy);
const source = parse(await readFile(join(root, 'Aktuell.html'), 'utf8'));
const { content: translations } = JSON.parse((await readFile(join(root, 'Textressourcen', 'en.json'), 'utf8')).trim());
const rows = new Map();
for (const node of descendants(source)) {
  const classes = attribute(node, 'class').split(/\s+/);
  if (!classes.includes('row')) continue;
  const section = classes.find((item) => /^Aktuell_section\d+$/.test(item));
  if (!section) continue;
  const number = Number(section.slice('Aktuell_section'.length));
  rows.set(number, [...(rows.get(number) ?? []), node]);
}

const mediaSources = new Map();
const articles = profiles.map((profile) => extractArticle(profile, rows, translations, mediaSources));
const originalImageCount = descendants(source).filter((node) => node.tagName === 'img').length;
if (articles.reduce((count, article) => count + article.images.length, 0) !== originalImageCount) {
  throw new Error('Image count differs from Aktuell.html.');
}

if (mode === '--write') {
  const dataFile = new URL('../src/news/news.json', import.meta.url);
  const json = JSON.stringify(articles, null, 2) + '\n';
  const existing = await readFile(dataFile, 'utf8').catch((error) => {
    if (error.code !== 'ENOENT') throw error;
    return undefined;
  });
  if (existing && existing !== json) throw new Error('Existing news data differs. Review changes before importing.');
  const destination = new URL('../media/news/', import.meta.url);
  await mkdir(destination, { recursive: true });
  for (const [name, sourcePath] of mediaSources) {
    const input = join(root, sourcePath);
    const output = new URL(encodeURIComponent(name), destination);
    try {
      await copyFile(input, output, constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code !== 'EEXIST' || !(await readFile(input)).equals(await readFile(output))) throw error;
    }
  }
  if (!existing) await writeFile(dataFile, json, { flag: 'wx' });
}

console.log(`${articles.length} articles, ${originalImageCount} images, ${[...mediaSources.keys()].filter((name) => name.endsWith('.pdf')).length} PDFs.`);
