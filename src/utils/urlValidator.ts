export interface UrlCheckResult {
  isValidUae: boolean;
  isOutsideUae: boolean;
  store: 'sephora' | 'amazon' | 'lookfantastic' | 'trendyol' | 'other';
  detectedDomain: string;
  detectedRegionName?: string;
  extractedKeywords?: string;
  suggestedUaeSearchUrl?: string;
  suggestedUaeStoreName?: string;
  userMessage: string;
}

const LOOKFANTASTIC_DOMAINS = [
  'lookfantastic.ae',
  'lookfantastic.com',
  'lookfantastic.co.uk',
  'lookfantastic.de',
  'lookfantastic.fr',
  'lookfantastic.it',
  'lookfantastic.es',
  'lookfantastic.nl',
];

const TRENDYOL_DOMAINS = [
  'trendyol.com',
  'ty.gl',
];

function matchesDomainList(hostname: string, domains: string[]): boolean {
  return domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

/**
 * Validates whether an incoming URL belongs to supported stores:
 * Sephora UAE, Amazon UAE, Lookfantastic, or Trendyol.
 * Checks before network fetch to prevent processing unsupported branches.
 */
export function validateUaeStoreUrl(rawUrl: string): UrlCheckResult {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return {
      isValidUae: false,
      isOutsideUae: false,
      store: 'other',
      detectedDomain: '',
      userMessage: 'لطفاً لینک کالا از سفورا دبی، آمازون امارات، لوک‌فنتستیک یا ترندیول را وارد فرمایید.',
    };
  }

  let cleanUrl = trimmed;
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  let hostname = '';
  let pathname = '';
  try {
    const parsed = new URL(cleanUrl);
    hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    pathname = parsed.pathname;
  } catch {
    const lower = cleanUrl.toLowerCase();
    if (lower.includes('amazon')) hostname = 'amazon';
    else if (lower.includes('sephora')) hostname = 'sephora';
    else if (lower.includes('lookfantastic')) hostname = 'lookfantastic';
    else if (lower.includes('trendyol') || lower.includes('ty.gl')) hostname = 'trendyol';
  }

  // Helper to extract product name keywords from path for 1-click UAE search bridge
  const extractKeywordsFromPath = (path: string): string => {
    try {
      const decoded = decodeURIComponent(path);
      const withoutExt = decoded.replace(/\.(html|htm|php|aspx)$/i, '');
      const segments = withoutExt.split('/').filter(Boolean);

      for (const seg of segments) {
        if (seg.includes('-') && !seg.startsWith('ref=') && seg.length > 5) {
          const cleaned = seg
            .replace(/-[pP]-?\d+.*$/, '')
            .replace(/\b(dp|gp|product|item)\b/gi, '')
            .replace(/[-_]+/g, ' ')
            .trim();
          if (cleaned.length > 3) return cleaned;
        }
      }

      const dpIdx = segments.indexOf('dp');
      if (dpIdx > 0 && segments[dpIdx - 1]) {
        return segments[dpIdx - 1].replace(/[-_]+/g, ' ').trim();
      }
    } catch {
      // ignore
    }
    return '';
  };

  const keywords = extractKeywordsFromPath(pathname);

  // 1. Sephora Detection
  if (hostname.includes('sephora')) {
    const isUaeSephora =
      hostname === 'sephora.ae' ||
      hostname.endsWith('.sephora.ae') ||
      hostname === 'sephora.me' ||
      hostname.endsWith('.sephora.me');

    if (isUaeSephora) {
      return {
        isValidUae: true,
        isOutsideUae: false,
        store: 'sephora',
        detectedDomain: hostname,
        suggestedUaeStoreName: 'سفورا امارات (sephora.ae)',
        userMessage: '',
      };
    }

    // Sephora outside UAE
    let regionName = 'خارج از امارات';
    if (hostname.includes('.com') && !hostname.includes('.tr')) regionName = 'آمریکا / بین‌المللی';
    else if (hostname.includes('.fr')) regionName = 'فرانسه';
    else if (hostname.includes('.co.uk') || hostname.includes('.uk')) regionName = 'انگلستان';
    else if (hostname.includes('.de')) regionName = 'آلمان';
    else if (hostname.includes('.it')) regionName = 'ایتالیا';
    else if (hostname.includes('.es')) regionName = 'اسپانیا';
    else if (hostname.includes('.tr')) regionName = 'ترکیه';
    else if (hostname.includes('.ca')) regionName = 'کانادا';
    else if (hostname.includes('.sa')) regionName = 'عربستان';

    const searchUrl = keywords
      ? `https://www.sephora.ae/en/search?q=${encodeURIComponent(keywords)}`
      : 'https://www.sephora.ae';

    return {
      isValidUae: false,
      isOutsideUae: true,
      store: 'sephora',
      detectedDomain: hostname,
      detectedRegionName: regionName,
      extractedKeywords: keywords,
      suggestedUaeSearchUrl: searchUrl,
      suggestedUaeStoreName: 'سفورا امارات (sephora.ae)',
      userMessage: `سفارش سفورا منحصراً از شعبه دبی انجام می‌شود. لینک ارسالی شما مربوط به سفورا ${regionName} (${hostname}) است؛ لطفاً لینک کالا را از سفورا امارات (sephora.ae) یا فروشگاه‌های مجاز دیگر وارد فرمایید.`,
    };
  }

  // 2. Amazon Detection
  if (hostname.includes('amazon') || hostname.includes('amzn.')) {
    const isUaeAmazon = hostname === 'amazon.ae' || hostname.endsWith('.amazon.ae');

    if (isUaeAmazon) {
      return {
        isValidUae: true,
        isOutsideUae: false,
        store: 'amazon',
        detectedDomain: hostname,
        suggestedUaeStoreName: 'آمازون امارات (amazon.ae)',
        userMessage: '',
      };
    }

    // Amazon outside UAE
    let regionName = 'خارج از امارات';
    if (
      hostname.includes('.com') &&
      !hostname.includes('.tr') &&
      !hostname.includes('.au') &&
      !hostname.includes('.sa')
    ) {
      regionName = 'آمریکا';
    } else if (hostname.includes('.co.uk') || hostname.includes('.uk')) {
      regionName = 'انگلستان';
    } else if (hostname.includes('.de')) {
      regionName = 'آلمان';
    } else if (hostname.includes('.fr')) {
      regionName = 'فرانسه';
    } else if (hostname.includes('.ca')) {
      regionName = 'کانادا';
    } else if (hostname.includes('.it')) {
      regionName = 'ایتالیا';
    } else if (hostname.includes('.es')) {
      regionName = 'اسپانیا';
    } else if (hostname.includes('.com.tr') || hostname.includes('.tr')) {
      regionName = 'ترکیه';
    } else if (hostname.includes('.in')) {
      regionName = 'هند';
    } else if (hostname.includes('.sa')) {
      regionName = 'عربستان';
    } else if (hostname.includes('.co.jp') || hostname.includes('.jp')) {
      regionName = 'ژاپن';
    }

    const searchUrl = keywords
      ? `https://www.amazon.ae/s?k=${encodeURIComponent(keywords)}`
      : 'https://www.amazon.ae';

    return {
      isValidUae: false,
      isOutsideUae: true,
      store: 'amazon',
      detectedDomain: hostname,
      detectedRegionName: regionName,
      extractedKeywords: keywords,
      suggestedUaeSearchUrl: searchUrl,
      suggestedUaeStoreName: 'آمازون امارات (amazon.ae)',
      userMessage: `سفارش آمازون منحصراً از شعبه دبی انجام می‌شود. لینک ارسالی شما مربوط به آمازون ${regionName} (${hostname}) است؛ لطفاً لینک کالا را از آمازون امارات (amazon.ae) وارد فرمایید.`,
    };
  }

  // 3. Lookfantastic Detection
  if (matchesDomainList(hostname, LOOKFANTASTIC_DOMAINS)) {
    return {
      isValidUae: true,
      isOutsideUae: false,
      store: 'lookfantastic',
      detectedDomain: hostname,
      suggestedUaeStoreName: 'لوک‌فنتستیک (Lookfantastic)',
      userMessage: '',
    };
  }

  // 4. Trendyol Detection
  if (matchesDomainList(hostname, TRENDYOL_DOMAINS)) {
    return {
      isValidUae: true,
      isOutsideUae: false,
      store: 'trendyol',
      detectedDomain: hostname,
      suggestedUaeStoreName: 'ترندیول (Trendyol)',
      userMessage: '',
    };
  }

  // 5. Other store
  return {
    isValidUae: false,
    isOutsideUae: false,
    store: 'other',
    detectedDomain: hostname || 'سایت متفرقه',
    userMessage:
      'در حال حاضر سرویس استعلام و خرید اختصاصی ورا، از فروشگاه‌های سفورا امارات (sephora.ae)، آمازون امارات (amazon.ae)، لوک‌فنتستیک (lookfantastic) و ترندیول (trendyol.com) پشتیبانی می‌نماید. لطفاً لینک کالا را از یکی از این فروشگاه‌ها وارد نمایید.',
  };
}

