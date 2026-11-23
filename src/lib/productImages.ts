import type { Product } from '../types';

export const DEFAULT_PRODUCT_IMAGE = '/vara-logo.svg';

export const HERO_PRODUCT_IDS = ['product-11', 'product-12', 'product-14'];

const catalogPhotography: Record<string, { name: string; images: string[] }> = {
  'product-11': { name: 'Beauty of Joseon Ginseng Essence Water', images: ['joseon-ginseng-150ml', 'joseon-ginseng-150ml-box'] },
  'product-12': { name: 'COSRX Advanced Snail 96 Mucin Power Essence', images: ['cosrx-snail-96-100ml', 'cosrx-snail-96-100ml-front'] },
  'product-14': { name: 'The Ordinary Niacinamide 10% + Zinc 1%', images: ['ordinary-niacinamide-30ml'] },
};

export function packagingImage(source?: string) {
  if (!source || /(^|\/\/)images\.unsplash\.com\//i.test(source)) return '';
  return resolveBlobUrl(source);
}

export function getProductImages(product: Product): string[] {
  const provided = (product.images ?? []).map(packagingImage).filter(Boolean);
  const curated = catalogPhotography[product.id];
  if (provided.length === 0 && curated?.name === product.nameEn) {
    return curated.images.map((name) => `/catalog/${name}.webp`);
  }
  return [...new Set(provided)];
}

export function getProductCover(product: Product) {
  return getProductImages(product)[0] || DEFAULT_PRODUCT_IMAGE;
}

export function isPackShot(source: string) {
  return source.startsWith('/catalog/');
}

export const PRODUCT_COVER_SIZES = '(min-width: 1280px) 560px, (min-width: 768px) 47vw, calc(100vw - 60px)';
export const HERO_IMAGE_SIZES = '(min-width: 1280px) 1216px, calc(100vw - 32px)';

export function resolveBlobUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('/api/blob/view') || url.includes('/api/blob/view')) return url;
  if (url.includes('.private.blob.vercel-storage.com')) {
    return `/api/blob/view?url=${encodeURIComponent(url)}`;
  }
  return url;
}

/** Only resize sources from an image host that supports width variants. */
export function responsiveImageSrcSet(src: string, widths: readonly number[]): string | undefined {
  try {
    const url = new URL(src);
    if (url.origin !== 'https://images.unsplash.com') return;
    return widths.map((width) => {
      url.searchParams.set('w', String(width));
      return `${url.href} ${width}w`;
    }).join(', ');
  } catch {
    return undefined;
  }
}

export const PRODUCT_COVER_WIDTHS = [360, 540, 800, 1200];
export const HERO_IMAGE_WIDTHS = [480, 768, 1200, 1600];
