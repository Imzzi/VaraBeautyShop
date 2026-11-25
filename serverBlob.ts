import { put, del, list, get } from '@vercel/blob';

export interface BlobUploadResult {
  success: boolean;
  url: string;
  rawUrl?: string;
  pathname?: string;
  contentType?: string;
  size?: number;
  provider: 'vercel-blob' | 'inline-fallback';
  isBlobConfigured: boolean;
  isPrivateStore?: boolean;
  message?: string;
}

export interface BlobFileItem {
  url: string;
  rawUrl?: string;
  pathname: string;
  size: number;
  sizeFormatted: string;
  uploadedAt: string;
  downloadUrl?: string;
  isPrivate?: boolean;
}

export interface BlobFolderStat {
  folder: string;
  count: number;
  sizeBytes: number;
  sizeFormatted: string;
  percentage: number;
}

export interface BlobDiagnosticsResult {
  configured: boolean;
  provider: 'vercel-blob' | 'inline-fallback';
  isPrivateStore: boolean;
  totalBlobs: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  foldersBreakdown: BlobFolderStat[];
  recentBlobs: BlobFileItem[];
  checkedAt: string;
  error?: string;
}

/**
 * Format bytes into human-readable string (KB, MB, GB)
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getBlobStoreId(): string {
  return process.env.VARA_MEDIA_STORE_ID?.trim() || '';
}

export function isBlobConfigured(): boolean {
  return Boolean(getBlobStoreId());
}

export function getBlobConfigStatus() {
  return {
    configured: isBlobConfigured(),
    provider: 'vercel-blob',
    authMode: 'oidc',
  };
}

// Only accept simple paths or private URLs issued by the configured store.
export function blobPath(reference: string): string | null {
  try {
    if (reference.startsWith('/api/blob/view?')) {
      reference = new URL(reference, 'https://internal.invalid').searchParams.get('url') || '';
    }
    if (reference.startsWith('https://')) {
      const url = new URL(reference);
      const store = getBlobStoreId().replace(/^store_/, '').toLowerCase();
      if (url.host !== `${store}.private.blob.vercel-storage.com` || url.username || url.password) return null;
      reference = url.pathname.slice(1);
    }
    const pathname = decodeURIComponent(reference);
    return /^[a-z]+\/[A-Za-z0-9][A-Za-z0-9_.-]{0,255}$/.test(pathname) ? pathname : null;
  } catch {
    return null;
  }
}

/**
 * Strictly inspect magic bytes to ensure only safe raster images (WebP, JPEG, PNG) are processed.
 * Blocks all executable scripts, SVG/XML documents, HTML, and unauthorized payloads.
 */
export function detectSafeRasterImage(buffer: Buffer): { valid: boolean; mime: string; ext: string } {
  if (!buffer || buffer.length < 4) return { valid: false, mime: '', ext: '' };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mime: 'image/jpeg', ext: 'jpg' };
  }

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return { valid: true, mime: 'image/png', ext: 'png' };
  }

  // WebP: RIFF (52 49 46 46) ... WEBP (57 45 42 50)
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { valid: true, mime: 'image/webp', ext: 'webp' };
  }

  // Reject SVG, XML, HTML, and unknown binaries
  return { valid: false, mime: '', ext: '' };
}

/**
 * Validates binary magic bytes for proxied external images.
 * Permits only safe raster formats (JPEG, PNG, WebP, GIF, AVIF) and rejects SVG/HTML/XML/scripts.
 */
export function detectSafeProxyImage(buffer: Buffer): { valid: boolean; mime: string } {
  const raster = detectSafeRasterImage(buffer);
  if (raster.valid) {
    return { valid: true, mime: raster.mime };
  }
  if (!buffer || buffer.length < 6) return { valid: false, mime: '' };

  // GIF87a / GIF89a
  const head6 = buffer.subarray(0, 6).toString('ascii');
  if (head6 === 'GIF87a' || head6 === 'GIF89a') {
    return { valid: true, mime: 'image/gif' };
  }

  // AVIF ISO BMFF container (ftypavif / ftypavis)
  if (buffer.length >= 12) {
    const boxType = buffer.subarray(4, 12).toString('ascii');
    if (boxType === 'ftypavif' || boxType === 'ftypavis') {
      return { valid: true, mime: 'image/avif' };
    }
  }

  return { valid: false, mime: '' };
}

/**
 * Upload an image buffer or base64 to Vercel Blob
 */
export async function uploadImageToVercelBlob(params: {
  base64Data?: string;
  buffer?: Buffer;
  filename?: string;
  folder?: string;
  contentType?: string;
}): Promise<BlobUploadResult> {
  const { base64Data, filename = 'image.webp', folder = 'products' } = params;

  // Determine buffer and content type
  let buffer: Buffer;

  if (params.buffer) {
    buffer = params.buffer;
  } else if (base64Data) {
    // Parse data URL if format is "data:image/xxx;base64,..."
    const matches = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data.replace(/^data:[^;]+;base64,/, ''), 'base64');
    }
  } else {
    throw new Error('تصویر جهت بارگذاری ارسال نشده است (No image data provided)');
  }

  // Safety guard against oversized uncompressed uploads to protect serverless memory
  if (buffer.length > 8 * 1024 * 1024) {
    throw new Error('فایل ارسالی بیش از ۸ مگابایت است. لطفاً پیش از ارسال، تصویر را فشرده کنید.');
  }

  // Enforce strict magic bytes check: block SVG, HTML, and unauthorized MIME types
  const magic = detectSafeRasterImage(buffer);
  if (!magic.valid) {
    throw new Error(
      'فرمت فایل نامعتبر یا ناامن است. فقط تصاویر وب استاندارد (WebP, JPG, PNG) مجاز می‌باشند. فایل‌های برداری (SVG) به دلایل امنیتی مسدود شده‌اند.'
    );
  }

  const contentType = magic.mime;
  const ext = magic.ext;

  const cleanBasename = (filename || 'image')
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 40);

  const pathname = `${folder}/${cleanBasename}-${Date.now()}.${ext}`;

  // If Vercel Blob is not configured, fallback gracefully to inline base64
  const storeId = getBlobStoreId();
  if (!storeId) {
    console.warn(
      '[Vercel Blob Notice] VARA_MEDIA_STORE_ID is not set. Using compressed inline fallback.'
    );
    const mime = contentType || 'image/jpeg';
    const inlineDataUrl = base64Data?.startsWith('data:')
      ? base64Data
      : `data:${mime};base64,${buffer.toString('base64')}`;

    return {
      success: true,
      url: inlineDataUrl,
      pathname,
      contentType,
      size: buffer.length,
      provider: 'inline-fallback',
      isBlobConfigured: false,
      message:
        'Vercel Blob token is not configured yet. Connect Vercel Blob in your Vercel Dashboard to enable cloud storage.',
    };
  }

  const blob = await put(pathname, buffer, {
    access: 'private',
    storeId,
    contentType,
    addRandomSuffix: true,
  });

  return {
    success: true,
    url: `/api/blob/view?url=${encodeURIComponent(blob.url)}`,
    rawUrl: blob.url,
    pathname: blob.pathname,
    contentType,
    size: buffer.length,
    provider: 'vercel-blob',
    isBlobConfigured: true,
    isPrivateStore: true,
  };
}

export async function getPrivateBlobStream(pathname: string, ifNoneMatch?: string) {
  const storeId = getBlobStoreId();
  if (!storeId) throw new Error('Vercel Blob store is not configured');

  return get(pathname, { access: 'private', storeId, ifNoneMatch });
}

export async function deleteBlobFile(url: string): Promise<boolean> {
  const storeId = getBlobStoreId();
  const pathname = blobPath(url);
  if (!storeId || !pathname) return false;

  try {
    await del(pathname, { storeId });
    return true;
  } catch (error) {
    console.warn('[Vercel Blob] Error deleting blob:', error);
    return false;
  }
}

/**
 * Fetch storage diagnostics, metrics, and recent files from Vercel Blob
 */
export async function getBlobDiagnostics(limit = 100): Promise<BlobDiagnosticsResult> {
  const storeId = getBlobStoreId();
  const checkedAt = new Date().toISOString();

  if (!storeId) {
    return {
      configured: false,
      provider: 'vercel-blob',
      isPrivateStore: false,
      totalBlobs: 0,
      totalSizeBytes: 0,
      totalSizeFormatted: '0 B',
      foldersBreakdown: [],
      recentBlobs: [],
      checkedAt,
      error: 'متغیر VARA_MEDIA_STORE_ID تنظیم نشده است.',
    };
  }

  try {
    const listResult = await list({
      storeId,
      limit: Math.min(Math.max(limit, 10), 500),
    });

    const blobs = listResult.blobs || [];
    let totalSizeBytes = 0;
    const folderMap = new Map<string, { count: number; sizeBytes: number }>();

    const mappedBlobs: BlobFileItem[] = blobs.map((b) => {
      totalSizeBytes += b.size;
      const folder = b.pathname.includes('/') ? b.pathname.split('/')[0] : 'root';
      const current = folderMap.get(folder) || { count: 0, sizeBytes: 0 };
      folderMap.set(folder, {
        count: current.count + 1,
        sizeBytes: current.sizeBytes + b.size,
      });

      const isPrivate = b.url.includes('.private.blob.vercel-storage.com');

      const viewUrl = isPrivate
        ? `/api/blob/view?url=${encodeURIComponent(b.url)}`
        : b.url;

      return {
        url: viewUrl,
        rawUrl: b.url,
        pathname: b.pathname,
        size: b.size,
        sizeFormatted: formatBytes(b.size),
        uploadedAt: b.uploadedAt ? new Date(b.uploadedAt).toISOString() : new Date().toISOString(),
        downloadUrl: b.downloadUrl,
        isPrivate,
      };
    });

    // Sort newest first
    mappedBlobs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    const foldersBreakdown: BlobFolderStat[] = Array.from(folderMap.entries()).map(([folder, data]) => ({
      folder,
      count: data.count,
      sizeBytes: data.sizeBytes,
      sizeFormatted: formatBytes(data.sizeBytes),
      percentage: totalSizeBytes > 0 ? Math.round((data.sizeBytes / totalSizeBytes) * 100) : 0,
    }));

    return {
      configured: true,
      provider: 'vercel-blob',
      isPrivateStore: true,
      totalBlobs: blobs.length,
      totalSizeBytes,
      totalSizeFormatted: formatBytes(totalSizeBytes),
      foldersBreakdown,
      recentBlobs: mappedBlobs,
      checkedAt,
    };
  } catch (err: any) {
    console.error('[Vercel Blob Diagnostics Error]:', err);
    return {
      configured: true,
      provider: 'vercel-blob',
      isPrivateStore: true,
      totalBlobs: 0,
      totalSizeBytes: 0,
      totalSizeFormatted: '0 B',
      foldersBreakdown: [],
      recentBlobs: [],
      checkedAt,
      error: err?.message || 'خطا در دریافت لیست فایل‌ها از سرور Vercel Blob',
    };
  }
}
