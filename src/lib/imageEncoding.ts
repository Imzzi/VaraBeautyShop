export interface ImageEncodingOptions {
  maxDimension: number;
  quality: number;
  targetMaxBytes: number;
}

export function scaledDimensions(width: number, height: number, maxDimension: number) {
  const scale = Math.min(1, maxDimension / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function encodeImage(
  encode: (type: 'image/webp' | 'image/jpeg', quality: number) => Promise<Blob>,
  { quality, targetMaxBytes }: ImageEncodingOptions,
) {
  let blob = await encode('image/webp', quality).catch(() => encode('image/jpeg', quality));
  if (blob.type !== 'image/webp' && blob.type !== 'image/jpeg') {
    blob = await encode('image/jpeg', quality);
  }
  if (blob.size > targetMaxBytes && quality > 0.65) {
    const smaller = await encode(blob.type === 'image/webp' ? 'image/webp' : 'image/jpeg', Math.max(0.62, quality - 0.15))
      .catch(() => blob);
    if (smaller.size < blob.size) blob = smaller;
  }
  return blob;
}
