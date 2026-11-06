'use client';

import { useState } from 'react';

import type { Locale } from '../../lib/routes';
import { CarouselControls, NewsFigure } from '../NewsPage/NewsPage.styles';
import { newsCaption, newsImagePath, type NewsImage } from '../../lib/news/newsMedia';

const labels = {
  de: { previous: 'Vorheriges Bild', next: 'Nächstes Bild', image: 'Bild' },
  en: { previous: 'Previous image', next: 'Next image', image: 'Image' },
};

export function NewsCarousel({ images, locale, title }: {
  images: NewsImage[];
  locale: Locale;
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const text = labels[locale];
  const image = images[index];
  const caption = newsCaption(image, locale);
  const position = `${text.image} ${index + 1} / ${images.length}`;

  function move(offset: number) {
    setIndex((current) => (current + offset + images.length) % images.length);
  }

  return (
    <div role="group" aria-label={title}>
      <NewsFigure data-carousel>
        <img src={newsImagePath(image)} alt={caption.text ?? `${title} · ${position}`} loading="lazy" />
        {caption.text && <figcaption lang={caption.lang}>{caption.text}</figcaption>}
      </NewsFigure>

      <CarouselControls>
        <button type="button" aria-label={text.previous} onClick={() => move(-1)}>←</button>
        <span aria-live="polite">{position}</span>
        <button type="button" aria-label={text.next} onClick={() => move(1)}>→</button>
      </CarouselControls>
    </div>
  );
}
