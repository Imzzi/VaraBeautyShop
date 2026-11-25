import type { Express, Request, Response } from 'express';
import { ProductsDb } from './serverDb';
import { CANONICAL_ORIGIN, resolveAbsoluteUrl } from './src/lib/seoMetadata';
import type { CategoryId, Product } from './src/types';

const PAGE_SIZE = 100;

const CATEGORY_LABELS_FA: Record<CategoryId, string> = {
  all: 'مراقبت از پوست و زیبایی',
  cleanser: 'شوینده و پاک‌کننده صورت',
  'anti-aging': 'ضدچروک و جوانساز',
  hydration: 'آبرسان و مرطوب‌کننده',
  'sensitive-skin': 'پوست حساس و ترمیم‌کننده',
  'acne-blemishes': 'ضدجوش و کنترل چربی',
  sunscreen: 'ضدآفتاب',
  brightening: 'روشن‌کننده و ضدلک',
  'hair-body': 'مراقبت مو و بدن',
  makeup: 'لوازم آرایشی',
};

export interface TorobProductItem {
  title: string;
  subtitle: string;
  page_unique: string;
  current_price: number;
  old_price: number;
  availability: 'instock' | 'outofstock';
  category_name: string;
  image_link: string;
  image_links: string[];
  page_url: string;
  short_desc: string;
  spec: Record<string, string>;
  registry: string;
  guarantee: string;
}

function getTorobOrigin(): string {
  const configured = (process.env.CANONICAL_URL || process.env.SITE_URL || '').trim().replace(/\/+$/, '');
  return configured || CANONICAL_ORIGIN;
}

function cleanSingleLine(text: string | undefined, maxLen = 400): string {
  if (!text) return '';
  return text.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, maxLen);
}

function resolveTorobPricingAndStock(product: Product): {
  currentPrice: number;
  oldPrice: number;
  inStock: boolean;
  optionSummary: string;
} {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    const validVariants = product.variants.filter((v) => Number(v.price) > 0);
    const inStockVariants = validVariants.filter((v) => v.stockCount > 0 && product.inStock);
    const pool = inStockVariants.length > 0 ? inStockVariants : validVariants;

    if (pool.length > 0) {
      const best = pool.reduce((min, cur) => (cur.price < min.price ? cur : min), pool[0]);
      const currentPrice = Math.max(0, Math.round(Number(best.price) || 0));
      const rawOld = Number(best.originalPrice || product.originalPrice || 0);
      const oldPrice = rawOld > currentPrice ? Math.round(rawOld) : 0;
      const inStock = Boolean(product.inStock && currentPrice > 0 && inStockVariants.length > 0);
      const optionSummary = product.variants
        .slice(0, 4)
        .map((v) => v.name)
        .filter(Boolean)
        .join('، ');
      return { currentPrice, oldPrice, inStock, optionSummary };
    }
  }

  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    const validSizes = product.sizes.filter((s) => Number(s.price) > 0);
    if (validSizes.length > 0) {
      const best = validSizes.reduce((min, cur) => (cur.price < min.price ? cur : min), validSizes[0]);
      const currentPrice = Math.max(0, Math.round(Number(best.price) || 0));
      const rawOld = Number(best.originalPrice || product.originalPrice || 0);
      const oldPrice = rawOld > currentPrice ? Math.round(rawOld) : 0;
      const stockCount = product.stockCount !== undefined ? Number(product.stockCount) : product.inStock ? 1 : 0;
      const inStock = Boolean(product.inStock && currentPrice > 0 && stockCount > 0);
      const optionSummary = product.sizes
        .slice(0, 4)
        .map((s) => s.label)
        .filter(Boolean)
        .join('، ');
      return { currentPrice, oldPrice, inStock, optionSummary };
    }
  }

  const currentPrice = Math.max(0, Math.round(Number(product.price) || 0));
  const rawOld = Number(product.originalPrice || 0);
  const oldPrice = rawOld > currentPrice ? Math.round(rawOld) : 0;
  const stockCount = product.stockCount !== undefined ? Number(product.stockCount) : product.inStock ? 1 : 0;
  const inStock = Boolean(product.inStock && currentPrice > 0 && stockCount > 0);
  return { currentPrice, oldPrice, inStock, optionSummary: '' };
}

export function mapProductToTorobItem(product: Product, origin = CANONICAL_ORIGIN): TorobProductItem {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const { currentPrice, oldPrice, inStock, optionSummary } = resolveTorobPricingAndStock(product);
  const images = (product.images || [])
    .filter((img) => typeof img === 'string' && img.trim().length > 0)
    .slice(0, 6)
    .map((img) => resolveAbsoluteUrl(img, cleanOrigin));

  const primaryImage = images[0] || `${cleanOrigin}/og-image.jpg`;
  const categoryName = CATEGORY_LABELS_FA[product.category] || 'مراقبت از پوست و زیبایی';
  const ingredientsText = (product.keyIngredients || [])
    .slice(0, 4)
    .map((i) => i.nameFa)
    .filter(Boolean)
    .join('، ');

  const spec: Record<string, string> = {};
  if (product.brand) spec['برند'] = String(product.brand);
  if (optionSummary) spec['تنوع / حجم'] = optionSummary;
  if (product.targetAudience) spec['مناسب نوع پوست'] = cleanSingleLine(product.targetAudience, 120);
  if (ingredientsText) spec['ترکیبات کلیدی'] = ingredientsText;
  spec['اصالت کالا'] = 'اورجینال با ضمانت بچ‌کد';

  return {
    title: cleanSingleLine(product.nameFa || product.nameEn || 'محصول ورا بیوتی', 500),
    subtitle: cleanSingleLine(product.nameEn || '', 500),
    page_unique: String(product.id),
    current_price: currentPrice,
    old_price: oldPrice,
    availability: inStock ? 'instock' : 'outofstock',
    category_name: categoryName,
    image_link: primaryImage,
    image_links: images.length > 0 ? images : [primaryImage],
    page_url: `${cleanOrigin}/product/${encodeURIComponent(product.id)}`,
    short_desc: cleanSingleLine(product.descriptionFa || product.nameEn || '', 400),
    spec,
    registry: '',
    guarantee: 'ضمانت اصالت ۱۰۰٪ کالا و بچ‌کد معتبر ورا بیوتی',
  };
}

function readParam(req: Request, key: string): string {
  const bodyVal = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>)[key] : undefined;
  const queryVal = req.query ? (req.query as Record<string, unknown>)[key] : undefined;
  const val = bodyVal !== undefined && bodyVal !== null ? bodyVal : queryVal;
  if (Array.isArray(val)) return String(val[0] || '').trim();
  if (typeof val === 'string' || typeof val === 'number') return String(val).trim();
  return '';
}

function readPageUniquesParam(req: Request): string[] {
  const bodyVal = req.body && typeof req.body === 'object' ? (req.body as Record<string, unknown>).page_uniques : undefined;
  const queryVal = req.query ? (req.query as Record<string, unknown>).page_uniques : undefined;
  const raw = bodyVal !== undefined && bodyVal !== null ? bodyVal : queryVal;
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return raw.map((item) => String(item || '').trim()).filter(Boolean).slice(0, PAGE_SIZE);
  }
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item || '').trim()).filter(Boolean).slice(0, PAGE_SIZE);
        }
      } catch {
        // Fall through to comma-separated split
      }
    }
    return trimmed
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, PAGE_SIZE);
  }
  return [];
}

function extractProductIdFromUrl(rawPageUrl: string): string {
  if (!rawPageUrl) return '';
  try {
    const parsed = new URL(rawPageUrl, CANONICAL_ORIGIN);
    const match = /\/product\/([^/?#]+)/i.exec(parsed.pathname);
    return match ? decodeURIComponent(match[1]).trim() : '';
  } catch {
    const match = /\/product\/([^/?#]+)/i.exec(rawPageUrl);
    return match ? decodeURIComponent(match[1]).trim() : '';
  }
}

async function handleTorobProductsRequest(req: Request, res: Response) {
  try {
    const origin = getTorobOrigin();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

    const routeId = typeof req.params?.id === 'string' ? req.params.id.trim() : '';
    const pageUnique = routeId || readParam(req, 'page_unique');
    const pageUrl = readParam(req, 'page_url');
    const pageUniques = readPageUniquesParam(req);

    // 1. Single product lookup via page_unique or URL path param
    const lookupId = pageUnique || (pageUrl ? extractProductIdFromUrl(pageUrl) : '');
    if (pageUnique || pageUrl) {
      if (!lookupId || !/^[a-zA-Z0-9_-]{1,128}$/.test(lookupId)) {
        return res.status(200).json({ count: 0, max_pages: 0, products: [] });
      }
      const product = await ProductsDb.getById(lookupId);
      if (!product) {
        return res.status(200).json({ count: 0, max_pages: 0, products: [] });
      }
      return res.status(200).json({
        count: 1,
        max_pages: 1,
        products: [mapProductToTorobItem(product, origin)],
      });
    }

    const allProducts = await ProductsDb.getAllFresh();

    // 2. Batch lookup via page_uniques
    if (pageUniques.length > 0) {
      const wanted = new Set(pageUniques);
      const matched = allProducts
        .filter((p) => wanted.has(p.id))
        .map((p) => mapProductToTorobItem(p, origin));
      return res.status(200).json({
        count: matched.length,
        max_pages: matched.length > 0 ? 1 : 0,
        products: matched,
      });
    }

    // 3. Full catalog pagination (100 items per page)
    const rawPage = Number(readParam(req, 'page') || '1');
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1;
    const count = allProducts.length;
    const maxPages = count > 0 ? Math.ceil(count / PAGE_SIZE) : 0;
    const start = (page - 1) * PAGE_SIZE;
    const pageItems =
      start >= count
        ? []
        : allProducts.slice(start, start + PAGE_SIZE).map((p) => mapProductToTorobItem(p, origin));

    return res.status(200).json({
      count,
      max_pages: maxPages,
      products: pageItems,
    });
  } catch (err) {
    console.error('[Torob Feed Error]:', err);
    return res.status(500).json({
      count: 0,
      max_pages: 0,
      products: [],
      error: 'Internal feed error',
    });
  }
}

export function registerTorobRoutes(app: Express) {
  app.post('/api/torob/products', handleTorobProductsRequest);
  app.get('/api/torob/products', handleTorobProductsRequest);
  app.get('/api/torob/products/:id', handleTorobProductsRequest);
}
