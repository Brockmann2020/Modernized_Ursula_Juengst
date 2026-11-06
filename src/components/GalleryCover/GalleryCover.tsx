import type { ViewerImage } from '../../lib/gallery/loadGallery';

import { Cover } from '../Gallery/Gallery.styles';
import { ImageTrigger } from '../GalleryViewer/GalleryViewer.styles';

export function GalleryCover({ image, zoomLabel, contain = false }: {
  image: ViewerImage;
  zoomLabel: string;
  contain?: boolean;
}) {
  return (
    <Cover data-contain={contain}>
      <ImageTrigger
        type="button"
        data-image-id={image.id}
        aria-haspopup="dialog"
        aria-label={`${zoomLabel}: ${image.alt}`}
      >
        <img
          src={image.src}
          alt={image.alt}
          lang={image.captionLang}
          width={image.width}
          height={image.height}
          fetchPriority="high"
        />
      </ImageTrigger>

      <figcaption lang={image.captionLang}>{contain ? image.alt : image.caption}</figcaption>
    </Cover>
  );
}
