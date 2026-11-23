export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  sourcePrice?: number;
  image?: string;
  swatchImage?: string;
  inStock?: boolean;
}

export interface ExtractedProduct {
  title: string;
  brand: string;
  store: 'sephora' | 'amazon' | 'lookfantastic' | 'trendyol' | 'other';
  storeName: string;
  storeUrl: string;
  image: string;
  originalCurrency: string; // 'AED' | 'TRY' | 'GBP' | 'EUR' | 'USD'
  originalPrice: number;
  sourceOriginalCurrency?: string;
  sourceOriginalPrice?: number;
  weightGrams: number;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  shadeOrSize?: string;
  description: string;
  variants?: ProductVariant[];
  selectedVariantId?: string;
  extractionSource:
    | 'live_sephora_scraper'
    | 'live_amazon_scraper'
    | 'live_lookfantastic_scraper'
    | 'live_trendyol_scraper'
    | 'live_html'
    | 'verified_catalog'
    | 'url_slug';
}

// Curated verified catalog (strictly empty to prevent fake data)
const VERIFIED_PRODUCTS: Array<any> = [
];

// -------------------------------------------------------------
// SSRF & DOMAIN WHITELIST SECURITY CONTROLS
// -------------------------------------------------------------

/**
 * Allowed external domains for product scraping.
 * Strictly limited to authorized partner retailers.
 */
export const ALLOWED_SCRAPER_DOMAINS = [
  'amazon.ae',
  'sephora.ae',
  'sephora.me', // Official Sephora Middle East regional storefront platform
  'lookfantastic.ae',
  'lookfantastic.com',
  'lookfantastic.co.uk',
  'lookfantastic.de',
  'lookfantastic.fr',
  'lookfantastic.it',
  'lookfantastic.es',
  'lookfantastic.nl',
  'trendyol.com',
  'ty.gl', // Official Trendyol app share shortlink (resolves safely to trendyol.com)
] as const;

const LOOKFANTASTIC_HOST_SUFFIXES = [
  'lookfantastic.ae',
  'lookfantastic.com',
  'lookfantastic.co.uk',
  'lookfantastic.de',
  'lookfantastic.fr',
  'lookfantastic.it',
  'lookfantastic.es',
  'lookfantastic.nl',
];

const TRENDYOL_HOST_SUFFIXES = ['trendyol.com', 'ty.gl'];

function matchesAnyDomain(hostname: string, domains: string[]): boolean {
  return domains.some((d) => hostname === d || hostname.endsWith(`.${d}`));
}

/**
 * Checks whether an IP or hostname is loopback, internal, or private.
 * Protects against Server-Side Request Forgery (SSRF) and LAN exploitation.
 */
export function isInternalOrLoopbackHost(hostname: string): boolean {
  if (!hostname || typeof hostname !== 'string') return true;
  const cleanHost = hostname.trim().toLowerCase().replace(/^\[|\]$/g, '');

  // 1. Localhost names
  if (
    cleanHost === 'localhost' ||
    cleanHost.endsWith('.localhost') ||
    cleanHost === 'local' ||
    cleanHost.endsWith('.local') ||
    cleanHost === 'router' ||
    cleanHost.endsWith('.internal')
  ) {
    return true;
  }

  // 2. IPv6 loopback, unspecified, and private/link-local/mapped
  if (
    cleanHost === '::1' ||
    cleanHost === '::' ||
    cleanHost.startsWith('fe80:') || // Link-local
    cleanHost.startsWith('fc00:') || // Unique local (ULA)
    cleanHost.startsWith('fd00:') || // Unique local (ULA)
    cleanHost.startsWith('::ffff:127.') || // IPv4-mapped loopback
    cleanHost.startsWith('::ffff:10.') ||
    cleanHost.startsWith('::ffff:192.168.') ||
    cleanHost.startsWith('::ffff:172.') ||
    cleanHost.startsWith('::ffff:169.254.') ||
    cleanHost.startsWith('::ffff:0.')
  ) {
    return true;
  }

  // 3. Hex / Octal / Decimal single-integer IP bypasses (e.g. 2130706433 = 127.0.0.1, 0x7f000001, 0)
  if (/^(0x[0-9a-f]+|0[0-7]+|\d+)$/i.test(cleanHost)) {
    return true;
  }

  // 4. Standard dotted-decimal IPv4 checks
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = cleanHost.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);
    const octet3 = parseInt(match[3], 10);
    const octet4 = parseInt(match[4], 10);

    if (octet1 > 255 || octet2 > 255 || octet3 > 255 || octet4 > 255) {
      return true; // Malformed / overflow IP
    }

    // Loopback: 127.0.0.0/8
    if (octet1 === 127) return true;

    // Current network ("this host"): 0.0.0.0/8
    if (octet1 === 0) return true;

    // Private Class A: 10.0.0.0/8
    if (octet1 === 10) return true;

    // Carrier-Grade NAT: 100.64.0.0/10 (100.64.0.0 - 100.127.255.255)
    if (octet1 === 100 && octet2 >= 64 && octet2 <= 127) return true;

    // Private Class B: 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;

    // Link-Local / Cloud Instance Metadata (AWS, GCP, Azure IMDS): 169.254.0.0/16
    if (octet1 === 169 && octet2 === 254) return true;

    // Private Class C: 192.168.0.0/16
    if (octet1 === 192 && octet2 === 168) return true;

    // Documentation / TEST-NET: 192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24, 198.18.0.0/15
    if (octet1 === 192 && octet2 === 0 && octet3 === 2) return true;
    if (octet1 === 198 && octet2 === 51 && octet3 === 100) return true;
    if (octet1 === 203 && octet2 === 0 && octet3 === 113) return true;
    if (octet1 === 198 && (octet2 === 18 || octet2 === 19)) return true;

    // Multicast & Broadcast: 224.0.0.0/4, 255.255.255.255
    if (octet1 >= 224) return true;
  }

  return false;
}

/**
 * Validates that an incoming URL:
 * 1. Uses http: or https: protocol
 * 2. Does NOT target internal, loopback, or private cloud metadata IPs (anti-SSRF)
 * 3. Matches strictly allowed UAE storefront domains (amazon.ae, sephora.ae, sephora.me)
 */
export function validateScraperUrl(rawUrl: string): {
  isValid: boolean;
  cleanUrl: string;
  hostname: string;
  store: 'sephora' | 'amazon' | 'lookfantastic' | 'trendyol' | 'other';
  error?: string;
} {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      isValid: false,
      cleanUrl: '',
      hostname: '',
      store: 'other',
      error: 'لطفاً آدرس اینترنتی (URL) کالا را وارد نمایید.',
    };
  }

  let parsed: URL;
  try {
    const fullUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
      ? trimmed 
      : `https://${trimmed}`;
    parsed = new URL(fullUrl);
  } catch {
    return {
      isValid: false,
      cleanUrl: '',
      hostname: '',
      store: 'other',
      error: 'آدرس اینترنتی وارد شده نامعتبر است.',
    };
  }

  // 1. Protocol check: strictly http or https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      cleanUrl: '',
      hostname: '',
      store: 'other',
      error: 'تنها پیوندهای وب با پروتکل امن (HTTPS) پشتیبانی می‌شوند.',
    };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');

  // 2. Reject internal, loopback, or private IP requests
  if (isInternalOrLoopbackHost(hostname)) {
    return {
      isValid: false,
      cleanUrl: '',
      hostname,
      store: 'other',
      error: 'دسترسی به آدرس‌های محلی، شبکه‌های داخلی و سرویس‌های سیستمی مسدود است.',
    };
  }

  // 3. Domain Whitelist Verification
  const isAmazonUae = hostname === 'amazon.ae' || hostname.endsWith('.amazon.ae');
  const isSephoraUae =
    hostname === 'sephora.ae' ||
    hostname.endsWith('.sephora.ae') ||
    hostname === 'sephora.me' ||
    hostname.endsWith('.sephora.me');
  const isLookfantastic = matchesAnyDomain(hostname, LOOKFANTASTIC_HOST_SUFFIXES);
  const isTrendyol = matchesAnyDomain(hostname, TRENDYOL_HOST_SUFFIXES);

  if (isAmazonUae) {
    return {
      isValid: true,
      cleanUrl: parsed.toString(),
      hostname,
      store: 'amazon',
    };
  }

  if (isSephoraUae) {
    return {
      isValid: true,
      cleanUrl: parsed.toString(),
      hostname,
      store: 'sephora',
    };
  }

  if (isLookfantastic) {
    return {
      isValid: true,
      cleanUrl: parsed.toString(),
      hostname,
      store: 'lookfantastic',
    };
  }

  if (isTrendyol) {
    return {
      isValid: true,
      cleanUrl: parsed.toString(),
      hostname,
      store: 'trendyol',
    };
  }

  return {
    isValid: false,
    cleanUrl: parsed.toString(),
    hostname,
    store: 'other',
    error: 'استعلام کالا تنها از فروشگاه‌های مجاز شامل آمازون امارات (amazon.ae)، سفورا دبی (sephora.ae)، لوک‌فنتستیک (lookfantastic) و ترندیول (trendyol.com) پشتیبانی می‌شود.',
  };
}

/**
 * SSRF-Safe Fetch Wrapper with safe redirect validation.
 * Ensures redirect targets are also validated against allowed domains and cannot jump to loopback/private IPs.
 */
export async function safeScraperFetch(targetUrl: string, init?: RequestInit, maxRedirectHops = 3): Promise<Response> {
  let currentUrl = targetUrl;
  let hops = 0;

  while (hops <= maxRedirectHops) {
    const val = validateScraperUrl(currentUrl);
    if (!val.isValid) {
      throw new Error(`[SSRF Blocked]: ${val.error || 'آدرس غیرمجاز یا ناامن شناسایی شد.'}`);
    }

    const response = await fetch(val.cleanUrl, {
      ...init,
      redirect: 'manual',
    });

    // Check for HTTP 3xx redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        return response;
      }
      hops++;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return response;
  }

  throw new Error('[Scraper Error]: تعداد ریدایرکت‌ها بیش از حد مجاز است.');
}

export function identifyStore(url: string): {
  store: 'sephora' | 'amazon' | 'lookfantastic' | 'trendyol' | 'other';
  storeName: string;
  isSupported: boolean;
  errorMessage?: string;
} {
  const validation = validateScraperUrl(url);

  if (!validation.isValid) {
    return {
      store: 'other',
      storeName: 'فروشگاه نامعتبر / غیرمجاز',
      isSupported: false,
      errorMessage: validation.error || 'لطفاً یک پیوند (URL) معتبر از فروشگاه‌های مجاز وارد نمایید.',
    };
  }

  if (validation.store === 'sephora') {
    return {
      store: 'sephora',
      storeName: 'سفورا دبی / امارات (Sephora UAE)',
      isSupported: true,
    };
  }

  if (validation.store === 'amazon') {
    return {
      store: 'amazon',
      storeName: 'آمازون دبی / امارات (Amazon.ae)',
      isSupported: true,
    };
  }

  if (validation.store === 'lookfantastic') {
    return {
      store: 'lookfantastic',
      storeName: 'لوک‌فنتستیک (Lookfantastic)',
      isSupported: true,
    };
  }

  if (validation.store === 'trendyol') {
    return {
      store: 'trendyol',
      storeName: 'ترندیول (Trendyol)',
      isSupported: true,
    };
  }

  return {
    store: 'other',
    storeName: `فروشگاه ${validation.hostname}`,
    isSupported: false,
    errorMessage: 'استعلام کالا تنها از فروشگاه‌های مجاز شامل آمازون امارات، سفورا دبی، لوک‌فنتستیک و ترندیول پشتیبانی می‌شود.',
  };
}

function normalizeCurrencyCode(raw?: string, fallback: string = 'AED'): string {
  const c = String(raw || '').trim().toUpperCase();
  if (!c) return fallback;
  if (c === 'TL' || c === 'TRY' || c === '₺') return 'TRY';
  if (c === 'GBP' || c === '£') return 'GBP';
  if (c === 'EUR' || c === '€') return 'EUR';
  if (c === 'USD' || c === '$') return 'USD';
  if (c === 'AED' || c === 'د.إ') return 'AED';
  return c;
}

function parseLocalizedPrice(raw: string, currencyHint?: string): number | null {
  if (!raw) return null;
  let cleaned = String(raw).replace(/[^\d.,]/g, '').trim();
  if (!cleaned) return null;

  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');

  if (hasDot && hasComma) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    if (lastComma > lastDot) {
      // European / Turkish format: 1.299,90
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else {
      // US/UK format: 1,299.90
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasComma && !hasDot) {
    // e.g. 299,90 (Turkish/European decimal) vs 1,299
    const parts = cleaned.split(',');
    if (parts[parts.length - 1].length === 2) {
      cleaned = cleaned.replace(',', '.');
    } else {
      cleaned = cleaned.replace(/,/g, '');
    }
  } else if (hasDot && !hasComma) {
    // Turkish/EU thousands dot without decimals like 1.299 TL
    const parts = cleaned.split('.');
    if (
      (currencyHint === 'TRY' || currencyHint === 'EUR') &&
      parts.length >= 2 &&
      parts[parts.length - 1].length === 3
    ) {
      cleaned = cleaned.replace(/\./g, '');
    }
  }

  const num = parseFloat(cleaned);
  return !isNaN(num) && num > 0 ? num : null;
}

// Scrape HTML directly from page (with AED price extraction and SSRF validation)
async function scrapeDirectHtml(url: string): Promise<Partial<ExtractedProduct> | null> {
  const validation = validateScraperUrl(url);
  if (!validation.isValid) {
    console.warn(`[Scraper Security] Blocked scrape of unauthorized URL: ${url} (${validation.error})`);
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    const response = await safeScraperFetch(validation.cleanUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-AE,en-GB,en;q=0.9,ar-AE;q=0.8',
        'Cache-Control': 'no-cache',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[Scraper] HTTP ${response.status} for ${url}`);
      return null;
    }

    const html = await response.text();
    if (!html || html.length < 500) return null;

    let title: string | undefined;
    let image: string | undefined;
    let price: number | undefined;
    let currency: string | undefined;
    let brand: string | undefined;
    let description: string | undefined;

    // 1. JSON-LD Schema
    const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const block of jsonLdMatches) {
        try {
          const content = block.replace(/<script[^>]*>|<\/script>/gi, '').trim();
          const parsed = JSON.parse(content);
          const item = Array.isArray(parsed) ? parsed.find((x) => x['@type'] === 'Product') : parsed;

          if (item && (item['@type'] === 'Product' || item['@type'] === 'IndividualProduct')) {
            if (!title && item.name) title = String(item.name).trim();
            if (!brand && item.brand) {
              brand = typeof item.brand === 'object' ? item.brand.name : String(item.brand);
            }
            if (!image) {
              if (typeof item.image === 'string') image = item.image;
              else if (Array.isArray(item.image) && item.image[0]) {
                image = typeof item.image[0] === 'string' ? item.image[0] : item.image[0].url;
              } else if (item.image && typeof item.image === 'object') {
                image = item.image.url || item.image.contentUrl;
              }
            }
            if (!price && item.offers) {
              const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
              if (offer) {
                if (offer.priceCurrency) {
                  currency = normalizeCurrencyCode(offer.priceCurrency, currency || 'AED');
                }
                const rawOfferPrice = offer.price ?? offer.lowPrice;
                if (rawOfferPrice !== undefined) {
                  const p = parseLocalizedPrice(String(rawOfferPrice), currency);
                  if (p) price = p;
                }
              }
            }
            if (!description && item.description) description = String(item.description).slice(0, 250);
          }
        } catch {
          // ignore json parse errors
        }
      }
    }

    // 2. OpenGraph Meta Tags
    if (!title) {
      const ogTitle = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
                      html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
      if (ogTitle && ogTitle[1]) title = ogTitle[1].trim();
    }
    if (!image) {
      const ogImg = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) ||
                    html.match(/<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i);
      if (ogImg && ogImg[1]) image = ogImg[1].trim();
    }
    if (!currency) {
      const ogCur = html.match(/<meta\s+(?:property|name)=["'](?:product:price:currency|og:price:currency)["']\s+content=["']([A-Za-z]{3})["']/i);
      if (ogCur && ogCur[1]) {
        currency = normalizeCurrencyCode(ogCur[1]);
      }
    }
    if (!price) {
      const ogPrice = html.match(/<meta\s+property=["'](?:product:price:amount|og:price:amount)["']\s+content=["']([0-9.,]+)["']/i);
      if (ogPrice && ogPrice[1]) {
        const p = parseLocalizedPrice(ogPrice[1], currency);
        if (p) price = p;
      }
    }

    // 3. Amazon UAE HTML Regex
    if (url.includes('amazon')) {
      if (!price) {
        const wholeMatch = html.match(/class=["'][^"']*a-price-whole[^"']*["']>([0-9,]+)/i);
        const fractionMatch = html.match(/class=["'][^"']*a-price-fraction[^"']*["']>([0-9]{2})/i);
        if (wholeMatch && fractionMatch) {
          const combined = `${wholeMatch[1].replace(/,/g, '')}.${fractionMatch[1]}`;
          const p = parseFloat(combined);
          if (!isNaN(p) && p > 0) price = p;
        }
      }
      if (!price) {
        const offscreenMatch = html.match(/class=["']a-offscreen["']>(?:AED\s*|د\.إ\s*|\$)?([0-9,]+(?:\.[0-9]{2})?)/i);
        if (offscreenMatch && offscreenMatch[1]) {
          const p = parseFloat(offscreenMatch[1].replace(/,/g, ''));
          if (!isNaN(p) && p > 0) price = p;
        }
      }
      if (!image) {
        const landingImg = html.match(/id=["']landingImage["'][^>]*data-old-hires=["']([^"']+)["']/i) ||
                          html.match(/id=["']landingImage["'][^>]*src=["']([^"']+)["']/i);
        if (landingImg && landingImg[1]) image = landingImg[1];
      }
    }

    // 4. Sephora UAE HTML Regex
    if (url.includes('sephora')) {
      if (!price) {
        const sephoraPrice = html.match(/"listPrice":\s*"(?:AED\s*)?([0-9.]+)"/i) ||
                             html.match(/"value":\s*([0-9.]+)/i) ||
                             html.match(/data-price=["']([0-9.]+)["']/i);
        if (sephoraPrice && sephoraPrice[1]) {
          const p = parseFloat(sephoraPrice[1]);
          if (!isNaN(p) && p > 0) price = p;
        }
      }
      if (!image) {
        const sephoraImg = html.match(/(https:\/\/[^"']*(?:sephora|media)[^"']*\.(?:jpg|png|webp))/i);
        if (sephoraImg && sephoraImg[1]) image = sephoraImg[1];
      }
    }

    const defaultCur =
      validation.store === 'trendyol'
        ? (url.includes('/en/') || url.includes('/ar/') ? 'AED' : 'TRY')
        : validation.store === 'lookfantastic'
          ? (url.includes('lookfantastic.ae') ? 'AED' : (url.includes('.de') || url.includes('.fr') || url.includes('.es') || url.includes('.it') || url.includes('.nl') ? 'EUR' : 'GBP'))
          : 'AED';

    if (title || price || image) {
      return {
        title,
        brand,
        image,
        originalPrice: price,
        originalCurrency: currency || defaultCur,
        description,
      };
    }

    return null;
  } catch {
    // Network or direct HTML fetch timed out or was blocked - silently proceed to specialized scrapers
    return null;
  }
}

// Brand imagery fallback map (empty - strictly no fake or generic unsplash images)
const VERIFIED_BRAND_IMAGES: Array<{ keywords: string[]; url: string }> = [];

// Helper to normalize Sephora image URLs to public CDN format
export function normalizeSephoraImageUrl(imgUrl?: string | null): string | null {
  if (!imgUrl || typeof imgUrl !== 'string') return null;
  let clean = imgUrl.trim().replace(/&amp;/g, '&');
  
  // Transform Salesforce Commerce Cloud private origin to public Sephora product CDN
  if (clean.includes('commercecloud.salesforce.com/on/demandware.static/')) {
    clean = clean.replace(
      /https?:\/\/[^\/]+\.commercecloud\.salesforce\.com\/on\/demandware\.static\//,
      'https://img-product.sephora.me/dw/image/v2/BKWK_PRD/on/demandware.static/'
    );
  } else if (clean.includes('sephora.ae/dw/image/')) {
    clean = clean.replace('www.sephora.ae', 'img-product.sephora.me').replace('sephora.ae', 'img-product.sephora.me');
  }
  return clean;
}

// Extract live product variants (shades, sizes, images, swatches, prices) from Sephora UAE storefront
export function extractSephoraVariants(html: string): ProductVariant[] {
  const variants: ProductVariant[] = [];
  if (!html) return variants;

  // 1. Primary: Extract c_variantsInfo array from Next.js SSR state or script tags
  const marker = 'c_variantsInfo';
  let searchPos = 0;
  while ((searchPos = html.indexOf(marker, searchPos)) !== -1) {
    const bracketIdx = html.indexOf('[', searchPos);
    if (bracketIdx === -1 || bracketIdx - searchPos > 40) {
      searchPos += marker.length;
      continue;
    }

    let depth = 0;
    let endIdx = -1;
    let inStr = false;
    let esc = false;
    for (let i = bracketIdx; i < html.length && i < bracketIdx + 300000; i++) {
      const c = html[i];
      if (esc) {
        esc = false;
        continue;
      }
      if (c === '\\') {
        esc = true;
        continue;
      }
      if (c === '"') {
        inStr = !inStr;
        continue;
      }
      if (!inStr) {
        if (c === '[') depth++;
        else if (c === ']') {
          depth--;
          if (depth === 0) {
            endIdx = i + 1;
            break;
          }
        }
      }
    }

    if (endIdx !== -1) {
      const slice = html.slice(bracketIdx, endIdx);
      try {
        let parsed: any = null;
        try {
          parsed = JSON.parse(slice);
        } catch {
          // Unescape serialized JSON string
          const unescaped = slice
            .replace(/\\"/g, '"')
            .replace(/\\\\"/g, '"');
          parsed = JSON.parse(unescaped);
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          for (const item of parsed) {
            const id = item.product_id || item.id || item.sku;
            const name = item.c_variation_attribute_name || item.name || item.shade || item.size || item.title;
            const price = typeof item.c_price === 'number'
              ? item.c_price
              : (typeof item.price === 'number' ? item.price : undefined);

            const rawImg = item.images?.[0]?.disBaseLink || item.images?.[0]?.link || item.swatchImage || item.image;
            const rawSwatch = item.swatchImage;

            const normalizedImg = normalizeSephoraImageUrl(rawImg) || undefined;
            const normalizedSwatch = normalizeSephoraImageUrl(rawSwatch) || undefined;

            if (name) {
              variants.push({
                id: String(id || name),
                name: String(name).trim(),
                price: price,
                image: normalizedImg,
                swatchImage: normalizedSwatch,
                inStock: item.inStock !== false && item.c_variation !== 'outOfStock',
              });
            }
          }
          if (variants.length > 0) return variants;
        }
      } catch (err: any) {
        console.warn('[Sephora Variant Parse Note]', err?.message);
      }
    }
    searchPos += marker.length;
  }

  // 2. Secondary: Schema.org ProductGroup or Product hasVariant
  try {
    const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
    for (const block of jsonLdBlocks) {
      try {
        const parsed = JSON.parse(block[1]);
        const item = Array.isArray(parsed) ? parsed.find((x) => x['@type'] === 'Product' || x['@type'] === 'ProductGroup') : parsed;
        if (item && Array.isArray(item.hasVariant)) {
          for (const v of item.hasVariant) {
            const vName = v.name || v.description;
            const vPrice = v.offers?.price ? parseFloat(String(v.offers.price).replace(/[^0-9.]/g, '')) : undefined;
            const rawVImg = typeof v.image === 'string' ? v.image : (Array.isArray(v.image) ? v.image[0] : v.image?.url);
            if (vName) {
              variants.push({
                id: String(v.sku || v.productID || vName),
                name: String(vName).trim(),
                price: vPrice,
                image: normalizeSephoraImageUrl(rawVImg) || undefined,
                inStock: v.offers?.availability ? !String(v.offers.availability).includes('OutOfStock') : true,
              });
            }
          }
          if (variants.length > 0) return variants;
        }
      } catch {}
    }
  } catch {}

  return variants;
}

// Dynamically retrieve real product pictures safely without unhandled fetch errors
export async function scrapeProductImage(
  query: string,
  _preferredDomains: string[] = ['sephora.ae', 'sephora.com', 'amazon.ae', 'rarebeauty.com']
): Promise<string | null> {
  const normalized = (query || '').toLowerCase();

  // 1. Instant match against verified brand visual assets
  for (const item of VERIFIED_BRAND_IMAGES) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      return item.url;
    }
  }

  // 2. Safe external query with resilient timeout and silent failure
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const tokenRes = await fetch(
      `https://duckduckgo.com/?q=${encodeURIComponent(query)}&t=h_&iax=images&ia=images`,
      {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      }
    );
    clearTimeout(timeout);

    if (tokenRes.ok) {
      const html = await tokenRes.text();
      const match = html.match(/vqd=["']([^"']+)["']/);
      if (match && match[1]) {
        const imgController = new AbortController();
        const imgTimeout = setTimeout(() => imgController.abort(), 4500);
        const imgRes = await fetch(
          `https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&vqd=${match[1]}`,
          {
            signal: imgController.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            },
          }
        );
        clearTimeout(imgTimeout);

        if (imgRes.ok) {
          const data = await imgRes.json();
          if (data.results && data.results.length > 0) {
            const firstWithImg = data.results.find((r: any) => r.image && r.image.startsWith('http'));
            if (firstWithImg) {
              return firstWithImg.image;
            }
          }
        }
      }
    }
  } catch {
    // Silently proceed without image
  }

  return '';
}

const FALLBACK_RATES_TO_AED: Record<string, number> = {
  AED: 1,
  USD: 3.6725,
  GBP: 4.75,
  EUR: 4.0,
  TRY: 0.105,
};

let aedFxCache: { fetchedAt: number; ratesFromAed: Record<string, number> } | null = null;

async function getCurrencyToAedRate(fromCurrency: string): Promise<number> {
  const cur = (fromCurrency || 'AED').trim().toUpperCase();
  if (cur === 'AED') return 1;

  const now = Date.now();
  if (!aedFxCache || now - aedFxCache.fetchedAt > 6 * 60 * 60 * 1000) {
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/AED', {
        signal: AbortSignal.timeout(3500),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.result === 'success' && data?.rates && typeof data.rates === 'object') {
          aedFxCache = { fetchedAt: now, ratesFromAed: data.rates };
        }
      }
    } catch {
      // Fall back to existing cache or static rates
    }
  }

  const perAed = aedFxCache?.ratesFromAed?.[cur];
  if (typeof perAed === 'number' && perAed > 0) {
    return 1 / perAed;
  }

  return FALLBACK_RATES_TO_AED[cur] || 1;
}

// Dedicated Live Sephora Dubai Scraper (scrapes real picture, real price in AED, and product description)
export async function scrapeSephoraLive(
  url: string
): Promise<ExtractedProduct> {
  const cleanUrl = url.trim();
  const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  const slug = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2] || '';
  const cleanKeyword = slug
    .replace(/[-_]+/g, ' ')
    .replace(/\.html/gi, '')
    .replace(/P\d+/gi, '')
    .trim();

  let dynamicTitle = cleanKeyword
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  let dynamicBrand = 'Sephora UAE';
  let dynamicPrice: number | null = null;
  let dynamicImage: string | null = null;
  let dynamicDescription = '';
  let dynamicShade = '';
  let dynamicWeight = 120;
  let dynamicVariants: ProductVariant[] = [];
  let extractionSource: ExtractedProduct['extractionSource'] = 'live_sephora_scraper';

  // STEP 1: Direct Real-Time HTTP Fetch against Sephora UAE (sephora.me / sephora.ae)
  try {
    let targetSephoraUrl = cleanUrl
      .replace('sephora.ae/en/p/', 'sephora.me/ae-en/p/')
      .replace('sephora.ae/ar/p/', 'sephora.me/ae-ar/p/')
      .replace('.html', '');

    if (!targetSephoraUrl.includes('sephora.me/ae-en/p/') && !targetSephoraUrl.includes('sephora.me/ae-ar/p/')) {
      if (targetSephoraUrl.includes('/p/')) {
        targetSephoraUrl = `https://www.sephora.me/ae-en/p/${slug.replace('.html', '')}`;
      }
    }

    const sephoraHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-AE,en;q=0.9,ar-AE;q=0.8',
      'Cache-Control': 'no-cache',
    };

    let fetchRes = await fetch(targetSephoraUrl, { 
      headers: sephoraHeaders,
      signal: AbortSignal.timeout(7000)
    });
    let htmlContent = '';

    if (fetchRes.status === 200) {
      htmlContent = await fetchRes.text();
    } else {
      // If 404 or old product path, search Sephora live catalog directly
      const searchQuery = cleanKeyword || slug.replace(/[-_]/g, ' ');
      if (searchQuery) {
        const searchUrl = `https://www.sephora.me/ae-en/search?q=${encodeURIComponent(searchQuery)}`;
        const searchRes = await fetch(searchUrl, { 
          headers: sephoraHeaders,
          signal: AbortSignal.timeout(7000)
        });
        if (searchRes.status === 200) {
          const searchHtml = await searchRes.text();
          const allLinks = [...searchHtml.matchAll(/href=["'](\/ae-en\/p\/[^"'\?]+)/gi)].map((m) => m[1]);
          const uniqueLinks = [...new Set(allLinks)];
          const cleanSlug = slug.toLowerCase().replace(/\.html/g, '');
          const bestLink = uniqueLinks.find((l) => {
            const low = l.toLowerCase();
            return low.includes(cleanSlug) && !low.includes('brush') && !low.includes('pouch');
          }) || uniqueLinks.find((l) => l.toLowerCase().includes(cleanSlug)) || uniqueLinks[0];

          if (bestLink) {
            const resolvedProductUrl = `https://www.sephora.me${bestLink}`;
            const resolvedRes = await fetch(resolvedProductUrl, { 
              headers: sephoraHeaders,
              signal: AbortSignal.timeout(7000)
            });
            if (resolvedRes.status === 200) {
              htmlContent = await resolvedRes.text();
            }
          }
        }
      }
    }

    // Extract Schema.org Product JSON-LD & Next.js Storefront Variants
    if (htmlContent && htmlContent.length > 500) {
      // 1. Extract live variants (shades, sizes, swatches, prices, stock)
      try {
        const scrapedVariants = extractSephoraVariants(htmlContent);
        if (scrapedVariants && scrapedVariants.length > 0) {
          dynamicVariants = scrapedVariants;
          if (!dynamicShade) {
            dynamicShade = dynamicVariants[0].name;
          }
          if (!dynamicPrice && dynamicVariants[0].price) {
            dynamicPrice = dynamicVariants[0].price;
          }
          if (!dynamicImage && dynamicVariants[0].image) {
            dynamicImage = dynamicVariants[0].image;
          }
        }
      } catch (varErr: any) {
        console.warn('[Sephora Variant Scraping Notice]', varErr?.message);
      }

      const jsonLdBlocks = [...htmlContent.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      for (const block of jsonLdBlocks) {
        try {
          const parsed = JSON.parse(block[1]);
          const item = Array.isArray(parsed) ? parsed.find((x) => x['@type'] === 'Product') : (parsed['@type'] === 'Product' ? parsed : null);
          if (item) {
            if (item.name) dynamicTitle = String(item.name).trim();
            if (item.brand) {
              dynamicBrand = typeof item.brand === 'object' ? (item.brand.name || 'Sephora') : String(item.brand);
            }
            if (item.image) {
              const rawImg = typeof item.image === 'string' ? item.image : (Array.isArray(item.image) ? item.image[0] : item.image?.url);
              if (rawImg) dynamicImage = normalizeSephoraImageUrl(rawImg);
            }
            if (item.offers) {
              const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
              if (offer && offer.price) {
                const parsedPrice = parseFloat(String(offer.price).replace(/[^0-9.]/g, ''));
                if (!isNaN(parsedPrice) && parsedPrice > 0) {
                  dynamicPrice = parsedPrice;
                }
              }
            }
            if (item.description && !dynamicDescription) {
              dynamicDescription = String(item.description).replace(/<[^>]+>/g, '').trim().slice(0, 300);
            }
          }
        } catch {}
      }

      // Check OpenGraph & Twitter meta tags or Sephora CDN images if image not found in JSON-LD
      if (!dynamicImage) {
        const ogMatch = htmlContent.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
          || htmlContent.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
          || htmlContent.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogMatch && ogMatch[1]) {
          dynamicImage = normalizeSephoraImageUrl(ogMatch[1]);
        } else {
          const cdnMatch = htmlContent.match(/https?:\/\/[^\s"']*(?:img-product\.sephora\.me|demandware\.static)[^\s"']*\.(?:jpg|jpeg|png|webp)/i);
          if (cdnMatch && cdnMatch[0]) {
            dynamicImage = normalizeSephoraImageUrl(cdnMatch[0]);
          }
        }
      }
    }
  } catch (directErr: any) {
    console.warn('[Sephora Direct Scrape Notice]', directErr?.message);
  }

  // STEP 2: Fallback check against verified Dubai catalog with accurate current UAE retail prices and official images
  if (!dynamicPrice || !dynamicImage) {
    const lowerSlug = slug.toLowerCase();
    for (const item of VERIFIED_PRODUCTS) {
      if (item.data.store === 'sephora' && item.keywords.some((kw) => lowerSlug.includes(kw) || cleanKeyword.toLowerCase().includes(kw))) {
        if (!dynamicPrice) dynamicPrice = item.data.originalPrice;
        if (!dynamicTitle || dynamicTitle.length < 5) dynamicTitle = item.data.title;
        if (!dynamicBrand || dynamicBrand === 'Sephora UAE') dynamicBrand = item.data.brand;
        if (!dynamicImage) dynamicImage = normalizeSephoraImageUrl(item.data.image);
        if (!dynamicDescription) dynamicDescription = item.data.description;
        if (item.data.shadeOrSize && !dynamicShade) dynamicShade = item.data.shadeOrSize;
        if (item.data.weightGrams) dynamicWeight = item.data.weightGrams;
        if (item.data.variants && dynamicVariants.length === 0) dynamicVariants = item.data.variants;
        extractionSource = 'verified_catalog';
        break;
      }
    }
  }

  // STEP 4: Brand-specific high-resolution image fallback for Sephora brands
  if (!dynamicImage) {
    const slugLower = slug.toLowerCase();
    const matchedBrandImg = VERIFIED_BRAND_IMAGES.find((b) =>
      b.keywords.some((kw) => slugLower.includes(kw) || cleanKeyword.toLowerCase().includes(kw))
    );

    if (matchedBrandImg) {
      dynamicImage = matchedBrandImg.url;
    } else {
      dynamicImage = (await scrapeProductImage(`sephora ${dynamicBrand || ''} ${cleanKeyword}`)) ||
        (await scrapeProductImage(`sephora ${cleanKeyword}`)) ||
        '';
    }
  }

  // Ensure any final Sephora image format is normalized
  dynamicImage = normalizeSephoraImageUrl(dynamicImage) || '';

  // If still no price found from any source, do not fake a price; return null to trigger support flow
  if (!dynamicPrice || dynamicPrice <= 0) {
    return null as any;
  }

  return {
    title: dynamicTitle,
    brand: dynamicBrand,
    store: 'sephora',
    storeName: 'سفورا دبی / امارات (Sephora UAE)',
    storeUrl: url,
    image: dynamicImage,
    originalCurrency: 'AED',
    originalPrice: dynamicPrice,
    weightGrams: dynamicWeight,
    inStock: true,
    rating: 0,
    reviewsCount: 0,
    shadeOrSize: dynamicShade || undefined,
    description: dynamicDescription || '',
    variants: dynamicVariants.length > 0 ? dynamicVariants : undefined,
    extractionSource,
  };
}

// Dedicated Live Amazon Dubai / UAE Scraper (scrapes real picture, real price in AED, and product description)
export async function scrapeAmazonLive(
  url: string
): Promise<ExtractedProduct> {
  const cleanUrl = url.trim();
  // Extract 10-character ASIN (supports /dp/, /gp/product/, /gp/aw/d/, /d/, or ?asin=)
  const asinMatch = cleanUrl.match(/(?:dp|gp\/product|\/d\/|\/aw\/d\/)\/([A-Z0-9]{10})/i) ||
                    cleanUrl.match(/[?&]asin=([A-Z0-9]{10})/i) ||
                    cleanUrl.match(/(?:[^\w]|^)(B0[A-Z0-9]{8})(?:[^\w]|$)/i);
  const asin = asinMatch ? (asinMatch[1] || asinMatch[0]).trim() : null;

  const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  const slug = pathSegments.find((s) => !s.startsWith('dp') && !s.startsWith('B0') && !s.startsWith('gp') && s.length > 3) || pathSegments[0] || '';
  const cleanKeyword = slug
    .replace(/[-_]+/g, ' ')
    .replace(/\b(dp|gp|product|B0[A-Z0-9]{8})\b/gi, '')
    .trim();

  let dynamicTitle = cleanKeyword
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  let dynamicBrand = 'Amazon UAE';
  let dynamicPrice: number | null = null;
  let dynamicImage: string | null = null;
  let dynamicDescription = '';
  let dynamicShade = '';
  let dynamicWeight = 180;
  let dynamicInStock = true;

  // STEP 1: Direct Real-Time HTTP Scraping
  // Priority 1: Mobile AW endpoint (/gp/aw/d/<ASIN>) with Android UA - reliably avoids captcha and returns full product data
  // Priority 2: Standard /dp/<ASIN> with Desktop headers
  // Priority 3: original cleanUrl
  const endpointsToTry: Array<{ url: string; headers: Record<string, string> }> = [];

  const mobileHeaders = {
    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ar-AE;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  const desktopHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ar-AE;q=0.8',
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'upgrade-insecure-requests': '1',
  };

  if (asin) {
    endpointsToTry.push({ url: `https://www.amazon.ae/gp/aw/d/${asin}`, headers: mobileHeaders });
    endpointsToTry.push({ url: `https://www.amazon.ae/dp/${asin}`, headers: desktopHeaders });
  }
  endpointsToTry.push({ url: cleanUrl, headers: mobileHeaders });

  for (const ep of endpointsToTry) {
    try {
      const fetchRes = await fetch(ep.url, { 
        headers: ep.headers,
        signal: AbortSignal.timeout(7000)
      });

      if (fetchRes.status === 200) {
        const html = await fetchRes.text();

        // Ensure not a captcha robot check page
        if (html.length > 5000 && !html.includes('validateCaptcha') && !html.includes('To discuss automated access')) {
          // 1. Price extraction (Offscreen AED price or whole+fraction)
          const offscreenMatch = html.match(/class=["']a-price["'][^>]*>[\s\S]*?<span class=["']a-offscreen["']>(?:AED\s*|د\.إ\s*|\$)?([0-9,]+(?:\.[0-9]{2})?)<\/span>/i) ||
                                html.match(/id=["'](?:corePrice_mobile_feature_div|corePriceDisplay_desktop_feature_div|apexPriceToPay)["'][\s\S]*?<span class=["']a-offscreen["']>(?:AED\s*|د\.إ\s*|\$)?([0-9,]+(?:\.[0-9]{2})?)<\/span>/i) ||
                                html.match(/<span class=["']a-offscreen["']>(?:AED\s*|د\.إ\s*|\$)?([0-9,]+(?:\.[0-9]{2})?)<\/span>/i);

          if (offscreenMatch && offscreenMatch[1]) {
            const p = parseFloat(offscreenMatch[1].replace(/,/g, ''));
            if (!isNaN(p) && p > 0) dynamicPrice = p;
          }

          if (!dynamicPrice) {
            const wholeMatch = html.match(/class=["']a-price-whole["']>([0-9,]+)/i);
            const fractionMatch = html.match(/class=["']a-price-fraction["']>([0-9]{2})/i);
            if (wholeMatch && wholeMatch[1]) {
              const combined = fractionMatch && fractionMatch[1] 
                ? `${wholeMatch[1].replace(/,/g, '')}.${fractionMatch[1]}`
                : wholeMatch[1].replace(/,/g, '');
              const p = parseFloat(combined);
              if (!isNaN(p) && p > 0) dynamicPrice = p;
            }
          }

          // 2. Real Product Image extraction directly from Amazon media
          const mainImgTag = html.match(/<img[^>]+id=["']main-image["'][^>]*>/i) ||
                             html.match(/<img[^>]+id=["']landingImage["'][^>]*>/i) ||
                             html.match(/<img[^>]+class="[^"]*(?:main-image|a-dynamic-image)[^"]*"[^>]*>/i);
          if (mainImgTag) {
            const tag = mainImgTag[0];
            const hires = tag.match(/data-a-hires=["']([^"']+)["']/i) ||
                          tag.match(/data-old-hires=["']([^"']+)["']/i) ||
                          tag.match(/data-midres-replacement=["']([^"']+)["']/i) ||
                          tag.match(/src=["']([^"']+)["']/i);
            if (hires && hires[1] && hires[1].includes('media-amazon.com/images/I/')) {
              dynamicImage = hires[1];
            }
          }

          if (!dynamicImage) {
            // Find all Amazon media images in the HTML and take the primary product image
            const allMediaImages = [...html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/([A-Za-z0-9_%+-]+(?:\._[A-Za-z0-9_-]+_)?\.jpg)/gi)].map(m => m[0]);
            const validImages = allMediaImages.filter(src => 
              !src.includes('pixel') && 
              !src.includes('31-') && 
              !src.includes('41+') && 
              !src.includes('sprite') && 
              !src.includes('icon')
            );
            if (validImages.length > 0) {
              dynamicImage = validImages[0];
            }
          }

          // Convert to highest quality SL1000 resolution
          if (dynamicImage) {
            dynamicImage = dynamicImage.replace(/\._[A-Za-z0-9_,-]+_\.jpg$/i, '._SL1000_.jpg');
          }

          // 3. Official Title extraction
          const titleMatch = html.match(/<span id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i) ||
                             html.match(/id=["']title["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                             html.match(/<title>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            let rawTitle = titleMatch[1]
              .replace(/<[^>]+>/g, '')
              .replace(/:\s*Buy Online at Best Price in UAE\s*-\s*Amazon\.ae/i, '')
              .replace(/\s*-\s*Amazon\.ae/i, '')
              .replace(/\s*\|\s*Amazon\.ae/i, '')
              .replace(/^Amazon\.ae\s*:\s*/i, '')
              .trim()
              .replace(/\s+/g, ' ');

            if (rawTitle.length > 3 && !rawTitle.toLowerCase().includes('page not found')) {
              dynamicTitle = rawTitle;
            }
          }

          // 4. Official Brand extraction
          const brandMatch = html.match(/id=["']bylineInfo["'][^>]*>([^<]+)<\/a>/i) ||
                             html.match(/class=["'][^"']*po-brand[^"']*["'][^>]*>[\s\S]*?<span class=["']a-span9["']>([^<]+)<\/span>/i) ||
                             html.match(/<span class=["']a-size-small[^"']*po-break-word["']>([^<]+)<\/span>/i);
          if (brandMatch && brandMatch[1]) {
            dynamicBrand = brandMatch[1].replace(/Brand:\s*|Visit the\s*|Store/gi, '').trim();
          }

          // 5. Stock status
          const availMatch = html.match(/id=["']availability["'][^>]*>([\s\S]*?)<\/div>/i);
          if (availMatch && availMatch[1]) {
            const availText = availMatch[1].toLowerCase();
            if (availText.includes('currently unavailable') || availText.includes('out of stock')) {
              dynamicInStock = false;
            }
          }

          // 6. Description extraction
          const metaDesc = html.match(/<meta name=["']description["'] content=["']([^"']+)["']/i);
          if (metaDesc && metaDesc[1] && !dynamicDescription) {
            dynamicDescription = metaDesc[1].replace(/Buy\s+/i, '').slice(0, 250);
          }

          // If we obtained both the real price and real image, break immediately!
          if (dynamicPrice && dynamicPrice > 0 && dynamicImage) {
            break;
          }
        }
      }
    } catch (liveErr: any) {
      console.warn('[Amazon Live Scrape Notice]', ep.url, liveErr?.message);
    }
  }

  // STEP 2: Universal Amazon ASIN Media CDN Fallback for Image
  // If the image was still not caught, use Amazon's direct SSL image CDN by ASIN
  if ((!dynamicImage || !dynamicImage.includes('media-amazon.com')) && asin) {
    dynamicImage = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.MAIN._SL1000_.jpg`;
  }

  // STEP 3: Fallback check against verified catalog if price still not extracted
  if (!dynamicPrice) {
    const lowerSlug = slug.toLowerCase();
    for (const item of VERIFIED_PRODUCTS) {
      if (item.data.store === 'amazon' && (
        (asin && item.keywords.includes(asin.toLowerCase())) ||
        item.keywords.some((kw) => lowerSlug.includes(kw) || cleanKeyword.toLowerCase().includes(kw))
      )) {
        dynamicPrice = item.data.originalPrice;
        if (!dynamicTitle || dynamicTitle === cleanKeyword) dynamicTitle = item.data.title;
        if (dynamicBrand === 'Amazon UAE') dynamicBrand = item.data.brand;
        if (!dynamicImage) dynamicImage = item.data.image;
        if (!dynamicDescription) dynamicDescription = item.data.description;
        if (item.data.shadeOrSize) dynamicShade = item.data.shadeOrSize;
        dynamicWeight = item.data.weightGrams;
        break;
      }
    }
  }

  // If still no price found, do not invent a fake price; return null
  if (!dynamicPrice || dynamicPrice <= 0) {
    return null as any;
  }

  return {
    title: dynamicTitle,
    brand: dynamicBrand,
    store: 'amazon',
    storeName: 'آمازون دبی / امارات (Amazon.ae)',
    storeUrl: cleanUrl,
    image: dynamicImage || '',
    originalCurrency: 'AED',
    originalPrice: dynamicPrice,
    weightGrams: dynamicWeight,
    inStock: dynamicInStock,
    rating: 0,
    reviewsCount: 0,
    shadeOrSize: dynamicShade || undefined,
    description: dynamicDescription || '',
    extractionSource: 'live_amazon_scraper',
  };
}

// Normalize Trendyol image URLs (CDN host prefix for relative paths)
export function normalizeTrendyolImageUrl(imgUrl?: string | null): string | null {
  if (!imgUrl || typeof imgUrl !== 'string') return null;
  let clean = imgUrl.trim().replace(/&amp;/g, '&');
  if (clean.startsWith('//')) {
    clean = `https:${clean}`;
  } else if (clean.startsWith('/')) {
    clean = `https://cdn.dsmcdn.com${clean}`;
  }
  return clean;
}

// Helper to extract balanced JSON object after a JS assignment marker
function extractEmbeddedJsonObject(html: string, marker: string): any | null {
  const idx = html.indexOf(marker);
  if (idx === -1) return null;
  const braceIdx = html.indexOf('{', idx + marker.length);
  if (braceIdx === -1 || braceIdx - idx > 120) return null;

  let depth = 0;
  let inStr = false;
  let esc = false;
  let endIdx = -1;
  for (let i = braceIdx; i < html.length && i < braceIdx + 450000; i++) {
    const c = html[i];
    if (esc) {
      esc = false;
      continue;
    }
    if (c === '\\') {
      esc = true;
      continue;
    }
    if (c === '"') {
      inStr = !inStr;
      continue;
    }
    if (!inStr) {
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i + 1;
          break;
        }
      }
    }
  }
  if (endIdx === -1) return null;
  try {
    return JSON.parse(html.slice(braceIdx, endIdx));
  } catch {
    return null;
  }
}

// Dedicated Live Lookfantastic Scraper (supports .ae, .com, .co.uk, .de, .fr, etc.)
export async function scrapeLookfantasticLive(
  url: string
): Promise<ExtractedProduct> {
  const cleanUrl = url.trim();
  const urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  const pathSegments = urlObj.pathname.split('/').filter(Boolean);
  const slugCandidate =
    pathSegments.find((s) => !/^\d+(\.html)?$/i.test(s) && s !== 'p' && s.length > 3) ||
    pathSegments[0] ||
    '';
  const cleanKeyword = slugCandidate
    .replace(/\.html$/gi, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const defaultCurrency =
    hostname.includes('lookfantastic.ae')
      ? 'AED'
      : hostname.endsWith('.de') || hostname.endsWith('.fr') || hostname.endsWith('.es') || hostname.endsWith('.it') || hostname.endsWith('.nl')
        ? 'EUR'
        : 'GBP';

  let dynamicTitle = cleanKeyword
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  let dynamicBrand = 'Lookfantastic';
  let dynamicPrice: number | null = null;
  let dynamicCurrency: string = defaultCurrency;
  let dynamicImage: string | null = null;
  let dynamicDescription = '';
  let dynamicShade = '';
  let dynamicWeight = 150;
  let dynamicInStock = true;
  let dynamicVariants: ProductVariant[] = [];
  let selectedVariantId: string | undefined;
  let extractionSource: ExtractedProduct['extractionSource'] = 'live_lookfantastic_scraper';

  // STEP 1: Direct HTTP Fetch via SSRF-safe wrapper with Lookfantastic native UAE/AED parameters
  try {
    const aedUrlObj = new URL(urlObj.toString());
    if (hostname === 'lookfantastic.ae') {
      aedUrlObj.hostname = 'www.lookfantastic.com';
    }
    aedUrlObj.searchParams.set('shippingCountry', 'AE');
    aedUrlObj.searchParams.set('switchcurrency', 'AED');

    const lfHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-AE,en;q=0.9,ar-AE;q=0.8',
      'Cache-Control': 'no-cache',
    };

    let fetchRes = await safeScraperFetch(aedUrlObj.toString(), {
      headers: lfHeaders,
      signal: AbortSignal.timeout(8000),
    });

    // If a regional Lookfantastic domain redirected to homepage, retry on www.lookfantastic.com with AED params
    if (fetchRes.ok) {
      const landedPath = (() => {
        try {
          return new URL(fetchRes.url || aedUrlObj.toString()).pathname;
        } catch {
          return '';
        }
      })();
      if ((landedPath === '/' || landedPath === '') && aedUrlObj.hostname !== 'www.lookfantastic.com') {
        const comFallback = new URL(urlObj.toString());
        comFallback.hostname = 'www.lookfantastic.com';
        comFallback.searchParams.set('shippingCountry', 'AE');
        comFallback.searchParams.set('switchcurrency', 'AED');
        fetchRes = await safeScraperFetch(comFallback.toString(), {
          headers: lfHeaders,
          signal: AbortSignal.timeout(8000),
        });
      }
    }

    if (fetchRes.ok) {
      const html = await fetchRes.text();
      if (html && html.length > 500) {
        const finalUrlObj = (() => {
          try {
            return new URL(fetchRes.url || aedUrlObj.toString());
          } catch {
            return urlObj;
          }
        })();
        const variationParam = urlObj.searchParams.get('variation') || finalUrlObj.searchParams.get('variation');
        const finalSkuMatch = finalUrlObj.pathname.match(/\/(\d+)(?:\.html)?\/?$/);
        const origSkuMatch = urlObj.pathname.match(/\/(\d+)(?:\.html)?\/?$/);
        const targetSku = variationParam || finalSkuMatch?.[1] || origSkuMatch?.[1] || null;
        if (targetSku) selectedVariantId = targetSku;

        // Extract variant size/shade labels from Lookfantastic selector buttons or embedded variant titles
        const skuLabelMap = new Map<string, string>();
        for (const btnMatch of html.matchAll(/<button[^>]+data-sku=["'](\d+)["'][^>]*>/gi)) {
          const tag = btnMatch[0];
          const sku = btnMatch[1];
          const choice = tag.match(/data-(?:choice|size|option|colour|color)=["']([^"']+)["']/i)?.[1];
          if (sku && choice) {
            skuLabelMap.set(sku, choice.trim());
          }
        }
        for (const vTitleMatch of html.matchAll(/"sku"\s*:\s*(\d+)\s*,\s*"title"\s*:\s*"([^"]{3,140})"/g)) {
          const sku = vTitleMatch[1];
          if (!skuLabelMap.has(sku)) {
            const sizeMatch = vTitleMatch[2].match(/\b(\d+(?:\.\d+)?\s*(?:ml|g|oz|fl\.?\s*oz|l|pack|capsules?|tablets?))\b/i);
            if (sizeMatch) {
              skuLabelMap.set(sku, sizeMatch[1].replace(/\s+/g, ''));
            }
          }
        }

        // 1A. JSON-LD Product / ProductGroup schema
        const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
        for (const block of jsonLdBlocks) {
          try {
            const parsed = JSON.parse(block[1]);
            const candidates = Array.isArray(parsed)
              ? parsed
              : Array.isArray(parsed?.['@graph'])
                ? parsed['@graph']
                : [parsed];
            const item = candidates.find(
              (x: any) => x && (x['@type'] === 'Product' || x['@type'] === 'ProductGroup' || x['@type'] === 'IndividualProduct')
            );
            if (item) {
              if (item.name) dynamicTitle = String(item.name).trim();

              const variantsArr: any[] = Array.isArray(item.hasVariant) ? item.hasVariant : [];
              const matchedVariant =
                (targetSku
                  ? variantsArr.find(
                      (v: any) =>
                        String(v?.sku || '') === targetSku ||
                        String(v?.offers?.sku || '') === targetSku ||
                        String(v?.productID || '') === targetSku
                    )
                  : null) || variantsArr[0];

              if (item.brand) {
                dynamicBrand = typeof item.brand === 'object' ? (item.brand.name || 'Lookfantastic') : String(item.brand);
              } else if (matchedVariant?.brand) {
                const vb = matchedVariant.brand;
                dynamicBrand = typeof vb === 'object' ? (vb.name || 'Lookfantastic') : String(vb);
              }

              const rawImgSource = item.image || matchedVariant?.image;
              if (rawImgSource) {
                const rawImg = typeof rawImgSource === 'string'
                  ? rawImgSource
                  : Array.isArray(rawImgSource)
                    ? (typeof rawImgSource[0] === 'string' ? rawImgSource[0] : rawImgSource[0]?.url)
                    : rawImgSource?.url;
                if (rawImg) dynamicImage = String(rawImg).trim();
              }

              const primaryOfferSource = item.offers || matchedVariant?.offers;
              if (primaryOfferSource) {
                const offersArr = Array.isArray(primaryOfferSource) ? primaryOfferSource : [primaryOfferSource];
                const primaryOffer = offersArr[0];
                if (primaryOffer) {
                  if (primaryOffer.priceCurrency) {
                    dynamicCurrency = normalizeCurrencyCode(primaryOffer.priceCurrency, dynamicCurrency);
                  }
                  const rawOfferPrice = primaryOffer.price ?? primaryOffer.lowPrice;
                  const p = rawOfferPrice !== undefined ? parseLocalizedPrice(String(rawOfferPrice), dynamicCurrency) : null;
                  if (p) dynamicPrice = p;
                  if (primaryOffer.availability && String(primaryOffer.availability).includes('OutOfStock')) {
                    dynamicInStock = false;
                  }
                }
              }

              if (variantsArr.length > 0) {
                const mapped = variantsArr
                  .filter((v: any) => v && (v.name || v.sku))
                  .map((v: any) => {
                    const vSku = String(v.sku || v.offers?.sku || v.productID || '').trim();
                    const vOffer = Array.isArray(v.offers) ? v.offers[0] : v.offers;
                    const vCur = vOffer?.priceCurrency ? normalizeCurrencyCode(vOffer.priceCurrency, dynamicCurrency) : dynamicCurrency;
                    const vPrice = vOffer?.price !== undefined ? parseLocalizedPrice(String(vOffer.price), vCur) : undefined;
                    const vImg = typeof v.image === 'string' ? v.image : Array.isArray(v.image) ? v.image[0] : v.image?.url;
                    const mappedLabel = skuLabelMap.get(vSku);
                    const vLabel = String(mappedLabel || v.size || v.color || v.name || vSku).trim();
                    return {
                      id: vSku || vLabel,
                      name: vLabel,
                      price: vPrice ?? undefined,
                      image: vImg || undefined,
                      inStock: vOffer?.availability ? !String(vOffer.availability).includes('OutOfStock') : true,
                    };
                  });
                const uniqueNames = new Set(mapped.map((v: ProductVariant) => v.name.toLowerCase()));
                if (uniqueNames.size > 1) {
                  dynamicVariants = mapped;
                }
              }

              const rawDesc = item.description || matchedVariant?.description;
              if (rawDesc && !dynamicDescription) {
                dynamicDescription = String(rawDesc).replace(/<[^>]+>/g, '').trim().slice(0, 300);
              }
            }
          } catch {}
        }

        // 1B. OpenGraph, Meta tags & embedded product brand/price fallbacks
        if (dynamicBrand === 'Lookfantastic') {
          const metaBrand = html.match(/<meta[^>]+(?:property|name)=["'](?:product:brand|og:brand|brand)["'][^>]+content=["']([^"']+)["']/i);
          if (metaBrand && metaBrand[1]) {
            dynamicBrand = metaBrand[1].trim();
          } else {
            const titleLower = (dynamicTitle || '').toLowerCase();
            const brandCandidates = [...html.matchAll(/"brand"\s*:\s*"([^"\\]{2,40})"/gi)].map((m) => m[1].trim());
            const matchedTitleBrand = brandCandidates.find((b) => titleLower.startsWith(b.toLowerCase()));
            if (matchedTitleBrand) {
              dynamicBrand = matchedTitleBrand;
            } else if (brandCandidates.length > 0) {
              dynamicBrand = brandCandidates[0];
            }
          }
        }
        if (!dynamicTitle || dynamicTitle.length < 4) {
          const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<title>([^<]+)<\/title>/i);
          if (ogTitle && ogTitle[1]) {
            dynamicTitle = ogTitle[1].replace(/\s*[-|]\s*LOOKFANTASTIC.*$/i, '').trim();
          }
        }
        if (!dynamicImage) {
          const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/https?:\/\/[^"'\s]*(?:static\.thcdn\.com|s\d+\.thcdn\.com)[^"'\s]*\.(?:jpg|jpeg|png|webp)/i);
          if (ogImg) dynamicImage = (ogImg[1] || ogImg[0]).trim();
        }
        const metaCur = html.match(/<meta[^>]+(?:property|name)=["'](?:product:price:currency|og:price:currency)["'][^>]+content=["']([A-Za-z]{3})["']/i);
        if (metaCur && metaCur[1] && !dynamicPrice) {
          dynamicCurrency = normalizeCurrencyCode(metaCur[1], dynamicCurrency);
        }
        if (!dynamicPrice) {
          const metaPrice = html.match(/<meta[^>]+property=["'](?:product:price:amount|og:price:amount)["'][^>]+content=["']([0-9.,]+)["']/i) ||
                            html.match(/data-product-price=["']([0-9.,]+)["']/i) ||
                            html.match(/"price"\s*:\s*\{\s*"amount"\s*:\s*"?([0-9.]+)"?/i);
          if (metaPrice && metaPrice[1]) {
            const p = parseLocalizedPrice(metaPrice[1], dynamicCurrency);
            if (p) dynamicPrice = p;
          }
        }
        if (!dynamicPrice) {
          const symPrice =
            html.match(/class=["'][^"']*productPrice[^"']*["'][^>]*>\s*(AED|£|\$|€)\s*([0-9.,]+)/i) ||
            html.match(/data-e2e=["'][^"']*price[^"']*["'][^>]*>\s*(AED|£|\$|€)\s*([0-9.,]+)/i) ||
            html.match(/(AED)\s*([0-9.,]+)/i);
          if (symPrice && symPrice[1] && symPrice[2]) {
            dynamicCurrency = normalizeCurrencyCode(symPrice[1], dynamicCurrency);
            const p = parseLocalizedPrice(symPrice[2], dynamicCurrency);
            if (p) dynamicPrice = p;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[Lookfantastic Live Scrape Notice]', err?.message);
  }

  if (!dynamicImage && dynamicTitle) {
    dynamicImage = (await scrapeProductImage(`lookfantastic ${dynamicBrand} ${dynamicTitle}`)) || '';
  }

  if (!dynamicPrice || dynamicPrice <= 0) {
    return null as any;
  }

  let finalCurrency = dynamicCurrency;
  let finalPrice = dynamicPrice;
  let sourceOriginalCurrency: string | undefined;
  let sourceOriginalPrice: number | undefined;
  let finalVariants = dynamicVariants;

  if (dynamicCurrency !== 'AED') {
    const rateToAed = await getCurrencyToAedRate(dynamicCurrency);
    sourceOriginalCurrency = dynamicCurrency;
    sourceOriginalPrice = dynamicPrice;
    finalPrice = Math.round(dynamicPrice * rateToAed * 100) / 100;
    finalCurrency = 'AED';
    finalVariants = dynamicVariants.map((v) =>
      typeof v.price === 'number' && v.price > 0
        ? {
            ...v,
            sourcePrice: v.price,
            price: Math.round(v.price * rateToAed * 100) / 100,
          }
        : v
    );
  }

  return {
    title: dynamicTitle || 'محصول لوک‌فنتستیک',
    brand: dynamicBrand,
    store: 'lookfantastic',
    storeName: hostname.includes('.ae') ? 'لوک‌فنتستیک امارات (Lookfantastic.ae)' : 'لوک‌فنتستیک (Lookfantastic)',
    storeUrl: cleanUrl,
    image: dynamicImage || '',
    originalCurrency: finalCurrency,
    originalPrice: finalPrice,
    sourceOriginalCurrency,
    sourceOriginalPrice,
    weightGrams: dynamicWeight,
    inStock: dynamicInStock,
    rating: 0,
    reviewsCount: 0,
    shadeOrSize: dynamicShade || undefined,
    description: dynamicDescription || '',
    variants: finalVariants.length > 0 ? finalVariants : undefined,
    selectedVariantId:
      finalVariants.length > 0 && selectedVariantId && finalVariants.some((v) => v.id === selectedVariantId)
        ? selectedVariantId
        : undefined,
    extractionSource,
  };
}

// Dedicated Live Trendyol Scraper (supports trendyol.com Turkey TRY, Gulf/UAE AED, Europe EUR, and ty.gl shortlinks)
export async function scrapeTrendyolLive(
  url: string
): Promise<ExtractedProduct> {
  let cleanUrl = url.trim();
  const isGulfPath = cleanUrl.includes('trendyol.com/en/') || cleanUrl.includes('trendyol.com/ar/') || cleanUrl.includes('country=AE');
  const isEuroPath = cleanUrl.includes('trendyol.com/de/') || cleanUrl.includes('country=DE');

  let urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
  let pathSegments = urlObj.pathname.split('/').filter(Boolean);
  let slugCandidate =
    pathSegments.find((s) => s.includes('-p-') || (s.includes('-') && s.length > 5)) ||
    pathSegments[pathSegments.length - 1] ||
    '';
  const productIdMatch = cleanUrl.match(/-p-(\d+)/i);
  const productId = productIdMatch ? productIdMatch[1] : null;

  let cleanKeyword = slugCandidate
    .replace(/-p-\d+.*$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

  const defaultCurrency = isGulfPath ? 'AED' : isEuroPath ? 'EUR' : 'TRY';

  let dynamicTitle = cleanKeyword
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  let dynamicBrand = 'Trendyol';
  let dynamicPrice: number | null = null;
  let dynamicCurrency: string = defaultCurrency;
  let dynamicImage: string | null = null;
  let dynamicDescription = '';
  let dynamicShade = '';
  let dynamicWeight = 220;
  let dynamicInStock = true;
  let dynamicVariants: ProductVariant[] = [];
  let extractionSource: ExtractedProduct['extractionSource'] = 'live_trendyol_scraper';

  // STEP 1: Direct HTTP Fetch via SSRF-safe wrapper (also resolves ty.gl shortlinks safely)
  try {
    const fetchRes = await safeScraperFetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': isGulfPath ? 'en-AE,en;q=0.9' : 'tr-TR,tr;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(8500),
    });

    if (fetchRes.url && fetchRes.url.includes('trendyol.com')) {
      cleanUrl = fetchRes.url;
      urlObj = new URL(cleanUrl);
      pathSegments = urlObj.pathname.split('/').filter(Boolean);
      const resolvedSlug = pathSegments.find((s) => s.includes('-p-')) || pathSegments[pathSegments.length - 1] || '';
      if (resolvedSlug && !cleanKeyword) {
        cleanKeyword = resolvedSlug.replace(/-p-\d+.*$/i, '').replace(/[-_]+/g, ' ').trim();
      }
    }

    if (fetchRes.ok) {
      const html = await fetchRes.text();
      if (html && html.length > 500) {
        // 1A. Trendyol SSR State: window.__PRODUCT_DETAIL_APP_INITIAL_STATE__ or __envoy_product-detail__PROPS
        const initialState =
          extractEmbeddedJsonObject(html, '__PRODUCT_DETAIL_APP_INITIAL_STATE__') ||
          extractEmbeddedJsonObject(html, '__envoy_product-detail__PROPS');

        const stateProd = initialState?.product || initialState?.result?.product || initialState;
        if (stateProd && (stateProd.name || stateProd.price)) {
          if (stateProd.name) dynamicTitle = String(stateProd.name).trim();
          if (stateProd.brand?.name) dynamicBrand = String(stateProd.brand.name).trim();
          if (Array.isArray(stateProd.images) && stateProd.images.length > 0) {
            dynamicImage = normalizeTrendyolImageUrl(stateProd.images[0]);
          }
          if (stateProd.price) {
            const pObj = stateProd.price;
            const rawVal =
              pObj.discountedPrice?.value ??
              pObj.sellingPrice?.value ??
              pObj.originalPrice?.value ??
              pObj.value;
            if (typeof rawVal === 'number' && rawVal > 0) {
              dynamicPrice = rawVal;
            }
            if (pObj.currency) {
              dynamicCurrency = normalizeCurrencyCode(pObj.currency, dynamicCurrency);
            } else if (typeof pObj.discountedPrice?.text === 'string' || typeof pObj.sellingPrice?.text === 'string') {
              const txt = pObj.discountedPrice?.text || pObj.sellingPrice?.text || '';
              if (txt.includes('AED')) dynamicCurrency = 'AED';
              else if (txt.includes('€') || txt.includes('EUR')) dynamicCurrency = 'EUR';
              else if (txt.includes('TL') || txt.includes('₺')) dynamicCurrency = 'TRY';
            }
          }
          if (typeof stateProd.inStock === 'boolean') {
            dynamicInStock = stateProd.inStock;
          }
          const variantsSource = stateProd.allVariants || stateProd.variants || [];
          if (Array.isArray(variantsSource) && variantsSource.length > 0) {
            dynamicVariants = variantsSource
              .filter((v: any) => v && (v.value || v.attributeValue))
              .map((v: any) => ({
                id: String(v.itemNumber || v.barcode || v.value || v.attributeValue),
                name: String(v.value || v.attributeValue).trim(),
                price: typeof v.price === 'number' && v.price > 0 ? v.price : (v.price?.value || undefined),
                inStock: v.inStock !== false && (typeof v.stock !== 'number' || v.stock > 0),
              }));
            if (dynamicVariants.length > 0 && !dynamicShade) {
              dynamicShade = dynamicVariants[0].name;
            }
          }
        }

        // 1B. JSON-LD Product Schema
        const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
        for (const block of jsonLdBlocks) {
          try {
            const parsed = JSON.parse(block[1]);
            const item = Array.isArray(parsed) ? parsed.find((x) => x['@type'] === 'Product') : (parsed?.['@type'] === 'Product' ? parsed : null);
            if (item) {
              if (!dynamicTitle && item.name) dynamicTitle = String(item.name).trim();
              if (dynamicBrand === 'Trendyol' && item.brand) {
                dynamicBrand = typeof item.brand === 'object' ? (item.brand.name || 'Trendyol') : String(item.brand);
              }
              if (!dynamicImage && item.image) {
                const rawImg = typeof item.image === 'string'
                  ? item.image
                  : Array.isArray(item.image)
                    ? item.image[0]
                    : item.image?.contentUrl?.[0] || item.image?.url;
                if (rawImg) dynamicImage = normalizeTrendyolImageUrl(rawImg);
              }
              if (!dynamicPrice && item.offers) {
                const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
                if (offer) {
                  if (offer.priceCurrency) {
                    dynamicCurrency = normalizeCurrencyCode(offer.priceCurrency, dynamicCurrency);
                  }
                  const rawP = offer.price ?? offer.lowPrice;
                  if (rawP !== undefined) {
                    const p = parseLocalizedPrice(String(rawP), dynamicCurrency);
                    if (p) dynamicPrice = p;
                  }
                }
              }
              if (!dynamicDescription && item.description) {
                dynamicDescription = String(item.description).replace(/<[^>]+>/g, '').trim().slice(0, 300);
              }
            }
          } catch {}
        }

        // 1C. OpenGraph & Trendyol HTML selectors fallback
        if (!dynamicImage) {
          const ogImg = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                        html.match(/https?:\/\/cdn\.dsmcdn\.com\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i);
          if (ogImg) dynamicImage = normalizeTrendyolImageUrl(ogImg[1] || ogImg[0]);
        }
        if (!dynamicPrice) {
          const prcMatch =
            html.match(/class=["'][^"']*prc-dsc[^"']*["'][^>]*>([^<]+)</i) ||
            html.match(/class=["'][^"']*prc-slg[^"']*["'][^>]*>([^<]+)</i) ||
            html.match(/"sellingPrice"\s*:\s*\{\s*"value"\s*:\s*([0-9.]+)/i) ||
            html.match(/"discountedPrice"\s*:\s*\{\s*"value"\s*:\s*([0-9.]+)/i);
          if (prcMatch && prcMatch[1]) {
            const rawTxt = prcMatch[1];
            if (rawTxt.includes('AED')) dynamicCurrency = 'AED';
            else if (rawTxt.includes('€')) dynamicCurrency = 'EUR';
            else if (rawTxt.includes('TL') || rawTxt.includes('₺')) dynamicCurrency = 'TRY';
            const p = parseLocalizedPrice(rawTxt, dynamicCurrency);
            if (p) dynamicPrice = p;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('[Trendyol Live Scrape Notice]', err?.message);
  }

  if (!dynamicImage && dynamicTitle) {
    dynamicImage = (await scrapeProductImage(`trendyol ${dynamicBrand} ${dynamicTitle}`)) || '';
  }

  if (!dynamicPrice || dynamicPrice <= 0) {
    return null as any;
  }

  return {
    title: dynamicTitle || 'محصول ترندیول',
    brand: dynamicBrand,
    store: 'trendyol',
    storeName: dynamicCurrency === 'AED' ? 'ترندیول امارات (Trendyol UAE)' : 'ترندیول (Trendyol)',
    storeUrl: cleanUrl,
    image: dynamicImage || '',
    originalCurrency: dynamicCurrency,
    originalPrice: dynamicPrice,
    weightGrams: dynamicWeight,
    inStock: dynamicInStock,
    rating: 0,
    reviewsCount: 0,
    shadeOrSize: dynamicShade || undefined,
    description: dynamicDescription || '',
    variants: dynamicVariants.length > 0 ? dynamicVariants : undefined,
    extractionSource,
  };
}

// Main Extractor Function - Supports Sephora UAE, Amazon UAE, Lookfantastic, and Trendyol (direct HTTP scraping only, no AI cost)
export async function extractProductFromUrl(
  rawUrl: string
): Promise<ExtractedProduct> {
  const cleanUrl = rawUrl.trim().startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`;
  const lowerUrl = cleanUrl.toLowerCase();
  const { store, storeName, isSupported, errorMessage } = identifyStore(cleanUrl);

  if (!isSupported) {
    throw new Error(
      errorMessage ||
        'در حال حاضر فقط استعلام از سفورا دبی (sephora.ae)، آمازون امارات (amazon.ae)، لوک‌فنتستیک (lookfantastic) و ترندیول (trendyol.com) پشتیبانی می‌شود.'
    );
  }

  // 1. Primary Live Retailer Scraping
  if (store === 'sephora') {
    try {
      const liveSephora = await scrapeSephoraLive(cleanUrl);
      if (liveSephora && liveSephora.originalPrice && liveSephora.originalPrice > 0) {
        return liveSephora;
      }
    } catch (e: any) {
      console.warn('[Live Sephora Scraper Fallback]', e?.message);
    }
  }

  if (store === 'amazon') {
    try {
      const liveAmazon = await scrapeAmazonLive(cleanUrl);
      if (liveAmazon && liveAmazon.originalPrice && liveAmazon.originalPrice > 0) {
        return liveAmazon;
      }
    } catch (e: any) {
      console.warn('[Live Amazon Scraper Fallback]', e?.message);
    }
  }

  if (store === 'lookfantastic') {
    try {
      const liveLookfantastic = await scrapeLookfantasticLive(cleanUrl);
      if (liveLookfantastic && liveLookfantastic.originalPrice && liveLookfantastic.originalPrice > 0) {
        return liveLookfantastic;
      }
    } catch (e: any) {
      console.warn('[Live Lookfantastic Scraper Fallback]', e?.message);
    }
  }

  if (store === 'trendyol') {
    try {
      const liveTrendyol = await scrapeTrendyolLive(cleanUrl);
      if (liveTrendyol && liveTrendyol.originalPrice && liveTrendyol.originalPrice > 0) {
        return liveTrendyol;
      }
    } catch (e: any) {
      console.warn('[Live Trendyol Scraper Fallback]', e?.message);
    }
  }

  // 2. Secondary fallback check against verified catalog if live scraper failed
  for (const item of VERIFIED_PRODUCTS) {
    if (item.keywords.some((kw) => lowerUrl.includes(kw))) {
      return {
        ...item.data,
        store: item.data.store || store,
        storeName: item.data.storeName || storeName,
        storeUrl: cleanUrl,
        extractionSource: 'verified_catalog',
      };
    }
  }

  const defaultTitle =
    store === 'sephora'
      ? 'محصول سفورا دبی'
      : store === 'amazon'
        ? 'محصول آمازون امارات'
        : store === 'lookfantastic'
          ? 'محصول لوک‌فنتستیک'
          : 'محصول ترندیول';

  const defaultBrand =
    store === 'sephora'
      ? 'Sephora UAE'
      : store === 'amazon'
        ? 'Amazon.ae'
        : store === 'lookfantastic'
          ? 'Lookfantastic'
          : 'Trendyol';

  // 3. Fallback direct live HTML scraping from the retailer
  const scraped = await scrapeDirectHtml(cleanUrl);
  if (scraped && scraped.originalPrice && scraped.originalPrice > 0) {
    const scrapedImg =
      store === 'sephora'
        ? normalizeSephoraImageUrl(scraped.image)
        : store === 'trendyol'
          ? normalizeTrendyolImageUrl(scraped.image)
          : scraped.image;

    let finalCur = scraped.originalCurrency || 'AED';
    let finalPrc = scraped.originalPrice;
    let sourceCur: string | undefined;
    let sourcePrc: number | undefined;
    if (store === 'lookfantastic' && finalCur !== 'AED') {
      const rateToAed = await getCurrencyToAedRate(finalCur);
      sourceCur = finalCur;
      sourcePrc = finalPrc;
      finalPrc = Math.round(finalPrc * rateToAed * 100) / 100;
      finalCur = 'AED';
    }

    return {
      title: scraped.title || defaultTitle,
      brand: scraped.brand || defaultBrand,
      store,
      storeName,
      storeUrl: cleanUrl,
      image: scrapedImg || '',
      originalCurrency: finalCur,
      originalPrice: finalPrc,
      sourceOriginalCurrency: sourceCur,
      sourceOriginalPrice: sourcePrc,
      weightGrams: scraped.weightGrams || 150,
      inStock: scraped.inStock !== false,
      rating: 0,
      reviewsCount: 0,
      shadeOrSize: scraped.shadeOrSize || undefined,
      description: scraped.description || '',
      extractionSource: 'live_html',
    };
  }

  // If scraping obtained a valid product and real price, return it
  if (scraped && scraped.title && scraped.originalPrice && scraped.originalPrice > 0) {
    return scraped as ExtractedProduct;
  }

  // If all real extraction attempts failed, do not invent prices or fake images
  throw new Error('امکان استعلام خودکار اطلاعات یا قیمت کالا از فروشگاه مبدأ وجود ندارد. لطفاً جهت استعلام دستی و دریافت پیش‌فاکتور با پشتیبانی تماس حاصل فرمایید.');
}
