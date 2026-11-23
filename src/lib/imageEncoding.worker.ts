import { encodeImage, scaledDimensions, type ImageEncodingOptions } from './imageEncoding';

self.addEventListener('message', async (event: MessageEvent<{ file: File; options: ImageEncodingOptions }>) => {
  const { file, options } = event.data;
  let image: ImageBitmap | undefined;
  try {
    image = await createImageBitmap(file);
    const { width, height } = scaledDimensions(image.width, image.height, options.maxDimension);
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image canvas is unavailable.');
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);
    const blob = await encodeImage((type, quality) => canvas.convertToBlob({ type, quality }), options);
    self.postMessage({ blob, width, height });
  } catch {
    self.postMessage({ error: 'تصویر خوانده یا فشرده نشد.' });
  } finally {
    image?.close();
  }
});
