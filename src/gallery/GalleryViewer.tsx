'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';

import type { Locale } from '../site/routes';
import type { ViewerImage } from './loadGallery';
import { FullscreenDialog, ViewerClose, ViewerFigure, ViewerStage, ViewerToolbar } from './GalleryViewer.styles';

const labels = {
  de: { dialog: 'Vollbildansicht', close: 'Schließen' },
  en: { dialog: 'Full-screen image', close: 'Close' },
};

interface GalleryViewerProps {
  children: ReactNode;
  images: ViewerImage[];
  locale: Locale;
}

export function GalleryViewer({ children, images, locale }: GalleryViewerProps) {
  const [activeImage, setActiveImage] = useState<ViewerImage>();
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
        onClick={(event) => {
          if (event.target instanceof Element && !event.target.closest('img, button, figcaption')) {
            setActiveImage(undefined);
          }
        }}
      >
        <ViewerToolbar>
          <ViewerClose autoFocus type="button" onClick={() => setActiveImage(undefined)}>
            {text.close} <span aria-hidden="true">×</span>
          </ViewerClose>
        </ViewerToolbar>

        {activeImage && (
          <ViewerFigure>
            <ZoomableImage key={activeImage.id} image={activeImage} />

            <figcaption lang={activeImage.captionLang}>{activeImage.caption}</figcaption>
          </ViewerFigure>
        )}
      </FullscreenDialog>
    </>
  );
}

function ZoomableImage({ image }: { image: ViewerImage }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const img = imageRef.current;
    if (!stage || !img) return;

    let zoom = 1;

    function zoomWithWheel(event: WheelEvent) {
      if (!stage || !img || event.ctrlKey || event.metaKey) return;

      event.preventDefault();

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
      const nextZoom = Math.min(4, Math.max(1, zoom * Math.exp(-event.deltaY * unit / 500)));
      if (nextZoom === zoom) return;

      const before = img.getBoundingClientRect();
      const x = (event.clientX - before.left) / before.width;
      const y = (event.clientY - before.top) / before.height;

      zoom = nextZoom;
      img.style.setProperty('--image-zoom', String(zoom));

      const after = img.getBoundingClientRect();
      stage.scrollLeft += after.left + x * after.width - event.clientX;
      stage.scrollTop += after.top + y * after.height - event.clientY;
    }

    stage.addEventListener('wheel', zoomWithWheel, { passive: false });
    return () => stage.removeEventListener('wheel', zoomWithWheel);
  }, []);

  return (
    <ViewerStage ref={stageRef}>
      <img
        ref={imageRef}
        src={image.src}
        alt={image.alt}
        lang={image.captionLang}
        width={image.width}
        height={image.height}
        style={{ width: `calc(min(${image.width}px, 100cqw, 100cqh * ${image.width / image.height}) * var(--image-zoom, 1))` }}
      />
    </ViewerStage>
  );
}
