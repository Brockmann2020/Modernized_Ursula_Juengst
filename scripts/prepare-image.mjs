import sharp from 'sharp';

export function prepareImage(input, output, inputOptions) {
  return sharp(input, inputOptions)
    .autoOrient()
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(output);
}
