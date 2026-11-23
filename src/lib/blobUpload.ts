/**
 * Vercel Blob Client Upload Helper
 * Handles browser-side image compression and cloud upload via /api/upload
 */

import { getAdminAuthHeaders } from './adminAuth';
import { encodeImage, scaledDimensions, type ImageEncodingOptions } from './imageEncoding';

export interface ImageCompressionStats {
  originalSizeBytes: number;
  originalSizeFormatted: string;
  compressedSizeBytes: number;
  compressedSizeFormatted: string;
  savedBytes: number;
  savedPercentage: number;
  savedPercentageFormatted: string;
  width: number;
  height: number;
  format: 'image/webp' | 'image/jpeg' | 'image/png';
}

export interface ClientBlobUploadResult {
  url: string;
  isBlob: boolean;
  provider: 'vercel-blob' | 'inline-fallback';
  pathname?: string;
  size?: number;
  message?: string;
  stats?: ImageCompressionStats;
  compressionSummary?: string;
}

export type UploadFolder = 'products' | 'receipts' | 'banners' | 'avatars' | 'general';

const COMPRESSION_PRESETS: Record<UploadFolder, ImageEncodingOptions> = {
  products: { maxDimension: 1200, quality: 0.80, targetMaxBytes: 280 * 1024 },
  banners: { maxDimension: 1600, quality: 0.82, targetMaxBytes: 450 * 1024 },
  receipts: { maxDimension: 1000, quality: 0.74, targetMaxBytes: 130 * 1024 },
  avatars: { maxDimension: 400, quality: 0.80, targetMaxBytes: 60 * 1024 },
  general: { maxDimension: 1200, quality: 0.80, targetMaxBytes: 280 * 1024 },
};

/**
 * Format bytes into human readable Persian/English format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 بایت';
  if (bytes < 1024) return `${bytes} بایت`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} کیلوبایت`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} مگابایت`;
}

type EncodedImage = { blob: Blob; width: number; height: number };

async function encodeInBrowser(file: File, options: ImageEncodingOptions): Promise<EncodedImage> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const { width, height } = scaledDimensions(image.naturalWidth, image.naturalHeight, options.maxDimension);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('بوم تصویر در دسترس نیست.');
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, width, height);
    const blob = await encodeImage((type, quality) => new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((encoded) => encoded ? resolve(encoded) : reject(new Error('فشرده‌سازی تصویر ناموفق بود.')), type, quality);
    }), options);
    return { blob, width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function compressImage(file: File, options: ImageEncodingOptions): Promise<EncodedImage> {
  if (file.type === 'image/svg+xml' || /\.svgz?$/i.test(file.name)) {
    throw new Error('فقط تصاویر JPG، PNG و WebP مجاز هستند.');
  }
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined' ||
      typeof createImageBitmap === 'undefined' || !OffscreenCanvas.prototype.convertToBlob) {
    return encodeInBrowser(file, options);
  }

  let worker: Worker;
  try {
    worker = new Worker(new URL('./imageEncoding.worker.ts', import.meta.url), { type: 'module' });
  } catch {
    return encodeInBrowser(file, options);
  }
  try {
    return await new Promise<EncodedImage>((resolve, reject) => {
      worker.onmessage = ({ data }: MessageEvent<EncodedImage & { error?: string }>) => {
        if (data.error) reject(new Error(data.error));
        else resolve(data);
      };
      worker.onerror = () => {
        worker.terminate();
        encodeInBrowser(file, options).then(resolve, reject);
      };
      worker.postMessage({ file, options });
    });
  } finally {
    worker.terminate();
  }
}

/** Upload a compressed raster image to durable storage. */
export async function uploadImageFile(file: File, folder: UploadFolder = 'products'): Promise<ClientBlobUploadResult> {
  const { blob, width, height } = await compressImage(file, COMPRESSION_PRESETS[folder]);
  if (!blob.size || blob.size > 512 * 1024 || !['image/webp', 'image/jpeg', 'image/png'].includes(blob.type)) {
    throw new Error('تصویر معتبر نیست یا پس از فشرده‌سازی بیش از ۵۱۲ کیلوبایت حجم دارد.');
  }

  const format = blob.type as ImageCompressionStats['format'];
  const name = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30) || 'image';
  const filename = `${name}.${format === 'image/jpeg' ? 'jpg' : format.slice(6)}`;
  const savedBytes = Math.max(0, file.size - blob.size);
  const savedPercentage = file.size > 0 ? Math.round(savedBytes / file.size * 1000) / 10 : 0;
  const stats: ImageCompressionStats = {
    originalSizeBytes: file.size,
    originalSizeFormatted: formatBytes(file.size),
    compressedSizeBytes: blob.size,
    compressedSizeFormatted: formatBytes(blob.size),
    savedBytes,
    savedPercentage,
    savedPercentageFormatted: `${savedPercentage}%`,
    width,
    height,
    format,
  };

  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'Content-Type': format,
      'X-Vara-Upload-Folder': folder,
      'X-Vara-Upload-Name': filename,
      ...getAdminAuthHeaders(),
    },
    body: blob,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.success !== true || typeof data.url !== 'string' ||
      !data.url.trim() || /^\s*data:/i.test(data.url) || data.provider !== 'vercel-blob') {
    throw new Error(data?.error || 'تصویر در فضای ذخیره‌سازی ثبت نشد.');
  }
  return {
    url: data.url,
    isBlob: Boolean(data.isBlobConfigured),
    provider: 'vercel-blob',
    pathname: data.pathname,
    size: data.size || blob.size,
    message: data.message,
    stats,
    compressionSummary: `حجم بهینه ${stats.compressedSizeFormatted} (${width}x${height})`,
  };
}

/**
 * Check if Vercel Blob is configured on the backend
 */
export async function checkVercelBlobStatus(): Promise<{
  configured: boolean;
  provider: string;
}> {
  try {
    const res = await fetch('/api/upload/status');
    if (!res.ok) return { configured: false, provider: 'none' };
    const data = await res.json();
    return {
      configured: Boolean(data.configured),
      provider: data.provider || 'vercel-blob',
    };
  } catch {
    return { configured: false, provider: 'none' };
  }
}
