import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '../src/data/products';
import { BRANDS_DATA } from '../src/data/brands';
import { BUYING_GUIDES } from '../src/data/guides';
import { Product } from '../src/types';
import { createClient } from '@libsql/client/web';

// Default canonical domain: prioritizes production domain https://varabeauty.ir unless CANONICAL_URL / SITE_URL is specified
const BASE_URL = (process.env.CANONICAL_URL || process.env.SITE_URL || 'https://varabeauty.ir').replace(/\/+$/, '');

// Static public pages
interface StaticPage {
  path: string;
  priority: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

const STATIC_PAGES: StaticPage[] = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/shop', priority: '0.9', changefreq: 'daily' },
  { path: '/calculator', priority: '0.9', changefreq: 'weekly' },
  { path: '/guides', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/return-policy', priority: '0.6', changefreq: 'monthly' },
  { path: '/terms', priority: '0.6', changefreq: 'monthly' },
];

const DEPARTMENTS: { id: string; nameFa: string }[] = [
  { id: 'skincare', nameFa: 'مراقبت از پوست' },
  { id: 'body', nameFa: 'مراقبت از بدن' },
  { id: 'lip', nameFa: 'مراقبت از لب' },
  { id: 'hair', nameFa: 'مراقبت از مو' },
];

// Available skincare, hair & makeup categories
const CATEGORIES: { id: string; nameFa: string; nameEn: string }[] = [
  { id: 'cleanser', nameFa: 'شوینده و پاک‌کننده', nameEn: 'Cleansers' },
  { id: 'anti-aging', nameFa: 'ضد پیری و جوانساز', nameEn: 'Anti-Aging' },
  { id: 'hydration', nameFa: 'آبرسانی عمیق', nameEn: 'Hydration' },
  { id: 'sensitive-skin', nameFa: 'پوست حساس و التیام‌بخش', nameEn: 'Sensitive Skin' },
  { id: 'acne-blemishes', nameFa: 'ضد جوش و رفع آکنه', nameEn: 'Acne & Blemishes' },
  { id: 'sunscreen', nameFa: 'ضد آفتاب و محافظت پوست', nameEn: 'Sunscreen' },
  { id: 'brightening', nameFa: 'روشن‌کننده و ضد لک', nameEn: 'Brightening' },
  { id: 'hair-body', nameFa: 'مراقبت مو و بدن', nameEn: 'Hair & Body' },
  { id: 'makeup', nameFa: 'لوازم آرایشی', nameEn: 'Makeup' },
];

// Explicitly excluded private / internal admin paths
export const EXCLUDED_ADMIN_PATHS = [
  '/admin',
  '/cms',
  '/api',
  '/profile',
  '/account',
  '/checkout',
  ...(process.env.VITE_ADMIN_PATH ? [process.env.VITE_ADMIN_PATH.trim().toLowerCase()] : ['/vara-admin-panel']),
];

/**
 * Escape special XML characters for safe XML output
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate full sitemap XML string
 */
export function generateSitemapXml(
  products: Pick<Product, 'id' | 'images' | 'nameFa' | 'nameEn' | 'brand'>[] = PRODUCTS,
  baseUrl: string = BASE_URL,
  brands: Array<{ id: string }> = BRANDS_DATA
): string {
  const today = new Date().toISOString().split('T')[0];
  const urls: string[] = [];

  // 1. Static Core Public Pages
  for (const page of STATIC_PAGES) {
    urls.push(`  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // 2. Department Landing Pages
  for (const dept of DEPARTMENTS) {
    urls.push(`  <url>
    <loc>${baseUrl}/shop?department=${encodeURIComponent(dept.id)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // 3. Product Category Pages
  for (const cat of CATEGORIES) {
    urls.push(`  <url>
    <loc>${baseUrl}/shop?category=${encodeURIComponent(cat.id)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  // 4. Featured Brand Catalog Pages
  const activeBrands = brands.slice(0, 60);
  for (const brand of activeBrands) {
    urls.push(`  <url>
    <loc>${baseUrl}/shop?brand=${encodeURIComponent(brand.id)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  // 5. Buying Guides & Educational Articles
  for (const guide of BUYING_GUIDES) {
    urls.push(`  <url>
    <loc>${baseUrl}/guides/${encodeURIComponent(guide.slug)}</loc>
    <lastmod>${guide.updatedAt || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`);
  }

  // 4. Product Detail Pages with Google Image Sitemap metadata
  for (const product of products) {
    if (!product || !product.id) continue;
    const productUrl = `${baseUrl}/product/${encodeURIComponent(product.id)}`;
    
    let imageTags = '';
    if (product.images && product.images.length > 0) {
      for (const img of product.images.slice(0, 3)) {
        if (!img || (!img.startsWith('http://') && !img.startsWith('https://'))) continue;
        imageTags += `
      <image:image>
        <image:loc>${escapeXml(img)}</image:loc>
        <image:title>${escapeXml(product.nameFa || product.nameEn || 'محصول ورا بیوتی')}</image:title>
        <image:caption>${escapeXml(product.nameEn || product.brand || 'Vara Beauty Luxury Skincare')}</image:caption>
      </image:image>`;
      }
    }

    urls.push(`  <url>
    <loc>${productUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTags}
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
<!--
  Vara Beauty (ورا بیوتی) Sitemap
  Automated SEO Discovery & Performance
  NOTE: Admin CMS Dashboard (/admin, /cms), Profile, and API endpoints are strictly EXCLUDED for security & crawl budget optimization.
-->
${urls.join('\n')}
</urlset>
`;
}

/**
 * Main execution function
 */
export async function runSitemapGenerator() {
  console.log('----------------------------------------------------');
  console.log('🚀 Generating sitemap.xml for Vara Beauty...');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('🔒 Security Rule: Admin CMS dashboard (/admin, /cms) is EXCLUDED.');

  let productsToUse: Parameters<typeof generateSitemapXml>[0] = PRODUCTS;
  let brandsToUse: Array<{ id: string }> = BRANDS_DATA;
  const url = (process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || '').trim();
  if (url) {
    let client: ReturnType<typeof createClient> | undefined;
    try {
      client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
      const result = await client.execute(`SELECT id, nameFa, nameEn, brand,
        CASE WHEN json_valid(data) THEN json_extract(data, '$.images') END AS images FROM products`);
      productsToUse = result.rows.map((row) => ({
        id: String(row.id), nameFa: String(row.nameFa ?? ''),
        nameEn: String(row.nameEn ?? ''), brand: String(row.brand ?? ''),
        images: row.images ? JSON.parse(String(row.images)) : [],
      }));
      const brandsRow = await client.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: ['brands'] });
      if (brandsRow.rows.length && brandsRow.rows[0].value) {
        const parsedBrands = JSON.parse(String(brandsRow.rows[0].value));
        if (Array.isArray(parsedBrands) && parsedBrands.length > 0) {
          brandsToUse = parsedBrands;
        }
      }
    } catch {
      console.warn('Sitemap catalog read failed. Using the bundled catalog.');
    } finally {
      client?.close();
    }
  }

  const xml = generateSitemapXml(productsToUse, BASE_URL, brandsToUse);

  // Write to public/sitemap.xml
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xml, 'utf-8');
  console.log(`✅ Saved sitemap to: ${publicSitemapPath}`);

  // Also write to dist/sitemap.xml if dist directory exists
  const distDir = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distDir)) {
    const distSitemapPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distSitemapPath, xml, 'utf-8');
    console.log(`✅ Synced sitemap to: ${distSitemapPath}`);
  }

  // Summary
  const urlCount = (xml.match(/<url>/g) || []).length;
  console.log(`📊 Total URLs indexed in sitemap.xml: ${urlCount}`);
  console.log(`   - Static core pages: ${STATIC_PAGES.length}`);
  console.log(`   - Product categories: ${CATEGORIES.length}`);
  console.log(`   - Brand catalog filters: ${Math.min(BRANDS_DATA.length, 30)}`);
  console.log(`   - Individual product detail pages: ${productsToUse.length}`);
  console.log('----------------------------------------------------');

  return { success: true, urlCount, publicSitemapPath };
}

// Execute directly if run via CLI (tsx scripts/generate-sitemap.ts)
const isDirectRun = process.argv[1] && (process.argv[1].endsWith('generate-sitemap.ts') || process.argv[1].endsWith('generate-sitemap.js'));
if (isDirectRun) {
  runSitemapGenerator()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Sitemap generation error:', err);
      process.exit(1);
    });
}
