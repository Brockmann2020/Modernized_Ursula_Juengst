import type { GalleryImage } from './loadHorizonte';
import { Band, Figure, Image } from './Gallery.styles';

export function Gallery({ images }: { images: GalleryImage[] }) {
  return (
    <div>
      {images.map((image, index) => (
        <Band key={image.id}>
          <Figure>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              data-detail={image.isDetail}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />

            <figcaption>{image.caption}</figcaption>
          </Figure>
        </Band>
      ))}
    </div>
  );
}
