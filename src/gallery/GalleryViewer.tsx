'use client';

import { useState, type MouseEvent, type ReactNode } from 'react';

import type { Locale } from '../site/routes';
import type { GalleryImage } from './loadHorizonte';
import { FullscreenDialog, ViewerClose, ViewerFigure, ViewerToolbar } from './GalleryViewer.styles';

const labels = {
  de: { dialog: 'Vollbildansicht', close: 'Schließen' },
  en: { dialog: 'Full-screen image', close: 'Close' },
};

interface GalleryViewerProps {
  children: ReactNode;
  images: GalleryImage[];
  locale: Locale;
}

export function GalleryViewer({ children, images, locale }: GalleryViewerProps) {
  const [activeImage, setActiveImage] = useState<GalleryImage>();
  const text = labels[locale];

  function openImage(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;

    const trigger = event.target.closest<HTMLButtonElement>('button[data-image-id]');
    if (!trigger || !event.currentTarget.contains(trigger)) return;

    const image = images.find(({ id }) => id === trigger.dataset.imageId);
    if (image) {
      trigger.focus();
      setActiveImage(image);
    }
  }

  return (
    <>
      <div onClick={openImage}>{children}</div>

      <FullscreenDialog
        fullScreen
        open={Boolean(activeImage)}
        onClose={() => setActiveImage(undefined)}
        aria-label={text.dialog}
      >
        <ViewerToolbar>
          <ViewerClose autoFocus type="button" onClick={() => setActiveImage(undefined)}>
            {text.close} <span aria-hidden="true">×</span>
          </ViewerClose>
        </ViewerToolbar>

        {activeImage && (
          <ViewerFigure>
            <img src={activeImage.src} alt={activeImage.alt} />
            <figcaption>{activeImage.caption}</figcaption>
          </ViewerFigure>
        )}
      </FullscreenDialog>
    </>
  );
}
