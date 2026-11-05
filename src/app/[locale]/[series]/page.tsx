import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BlockGallery } from '../../../gallery/BlockGallery';
import { Gallery } from '../../../gallery/Gallery';
import { loadBlockGallery, loadGallery, readGallery } from '../../../gallery/loadGallery';
import gallerySeries from '../../../gallery/series.json';
import { SiteLayout } from '../../../site/SiteLayout';
import { galleryPath } from '../../../site/routes';
import { getLocale } from '../locale';

interface PageProps {
  params: Promise<{ locale: string; series: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return gallerySeries.map((series) => ({ series }));
}

async function getGalleryRoute(params: PageProps['params']) {
  const { series } = await params;
  if (!gallerySeries.includes(series)) notFound();

  return { slug: series, locale: await getLocale(params) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await getGalleryRoute(params);
  const data = await readGallery(slug);
  const title = data.kind === 'blocks' && locale === 'en' ? data.series.titleEn ?? data.series.title : data.series.title;

  return {
    title: `${title} | Ursula Jüngst`,
    description: locale === 'de'
      ? `${title}, Malerei von Ursula Jüngst`
      : `${title}, paintings by Ursula Jüngst`,
    robots: { index: false, follow: false },
    alternates: { languages: { de: galleryPath('de', slug), en: galleryPath('en', slug) } },
  };
}

export default async function GalleryPage({ params }: PageProps) {
  const { slug, locale } = await getGalleryRoute(params);
  const data = await readGallery(slug);
  if (data.kind === 'blocks') {
    const gallery = await loadBlockGallery(slug, locale, data);

    return (
      <SiteLayout locale={locale} page={slug} headerTone="contrast">
        <BlockGallery gallery={gallery} locale={locale} />
      </SiteLayout>
    );
  }

  const { series, images } = await loadGallery(slug, locale);

  return (
    <SiteLayout locale={locale} page={slug} headerTone="contrast">
      <Gallery locale={locale} series={series} images={images} />
    </SiteLayout>
  );
}
