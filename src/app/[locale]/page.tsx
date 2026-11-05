import { HomePage, homeMetadata } from '../../home/HomePage';
import { getLocale } from './locale';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  return homeMetadata(await getLocale(params));
}

export default async function LocalizedStartPage({ params }: PageProps) {
  return <HomePage locale={await getLocale(params)} />;
}
