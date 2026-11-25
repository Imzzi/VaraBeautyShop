import type {
  CategoryId,
  Product,
  RoutineType,
  ShopDepartment,
  ShopFilterPreset,
  SkincareProductType,
} from '../types';

export const CANONICAL_ORIGIN = 'https://varabeauty.ir';

const VALID_CATEGORIES = new Set<CategoryId>([
  'all',
  'cleanser',
  'anti-aging',
  'hydration',
  'sensitive-skin',
  'acne-blemishes',
  'sunscreen',
  'brightening',
  'hair-body',
  'makeup',
]);

const VALID_DEPARTMENTS = new Set<ShopDepartment>(['skincare', 'body', 'lip', 'hair']);

const VALID_PRODUCT_TYPES = new Set<SkincareProductType>([
  'cleanser',
  'toner',
  'serum',
  'moisturizer',
  'exfoliator',
  'eye-care',
  'sunscreen',
  'mask',
  'lip-care',
  'hair-body',
  'makeup',
  'device',
]);

const VALID_ROUTINES = new Set<RoutineType>([
  'morning',
  'night',
  'anti-aging',
  'hydration',
  'brightening',
  'acne-blemish',
  'barrier-repair',
  'soothing',
  'minimal',
]);

export const CALCULATOR_FAQS: Array<{ question: string; answer: string }> = [
  {
    question: 'چطور می‌توانم از سفورا دبی (Sephora UAE) و آمازون امارات در ایران خرید کنم؟',
    answer:
      'کافی است لینک صفحه محصول مورد نظر خود را از سایت sephora.ae یا amazon.ae کپی کرده و در کادر محاسبه‌گر قیمت ورا بیوتی وارد کنید. سیستم به‌صورت آنی قیمت ارزی، هزینه حمل هوایی و ترخیص را به تومان محاسبه می‌کند و می‌توانید سفارش خود را آنلاین ثبت نمایید.',
  },
  {
    question: 'آیا امکان سفارش مستقیم از ترندیول ترکیه (Trendyol) و لوک‌فنتستیک (Lookfantastic) وجود دارد؟',
    answer:
      'بله، محاسبه‌گر ورا بیوتی از فروشگاه‌های ترندیول (ارز لیر یا درهم) و لوک‌فنتستیک (پوند، یورو یا درهم) پشتیبانی می‌کند و مبلغ نهایی را با نرخ لحظه‌ای ارز محاسبه می‌نماید.',
  },
  {
    question: 'قیمت نهایی سفارش‌های بین‌المللی در ورا بیوتی چگونه محاسبه می‌شود؟',
    answer:
      'قیمت نهایی شامل تبدیل نرخ ارزی کالا با نرخ روز تتر/ارز جهانی، هزینه حمل هوایی بر اساس وزن کالا، درصد ترخیص گمرکی و بیمه مرسوله، کارمزد خرید و کسر تخفیف ورا بیوتی است و تمامی هزینه‌ها پیش از پرداخت به‌صورت شفاف نمایش داده می‌شوند.',
  },
  {
    question: 'مدت زمان تحویل سفارش‌های خرید مستقیم از دبی و ترکیه چقدر است؟',
    answer:
      'سفارش‌های ثبت‌شده بلافاصله توسط تیم خرید ورا تهیه شده و به‌طور معمول بین ۵ تا ۸ روز کاری پس از ترخیص و بسته‌بندی امن از طریق پست پیشتاز یا پیک تهران درب منزل تحویل داده می‌شوند.',
  },
  {
    question: 'آیا اصالت و تاریخ انقضای محصولات خریداری‌شده از فروشگاه‌های خارجی تضمین می‌شود؟',
    answer:
      'بله، تمامی کالاها مستقیماً از فروشگاه‌های رسمی مبدا تهیه شده و با پلمپ اورجینال، بچ‌کد معتبر و ضمانت ۱۰۰٪ اصالت کالا تحویل می‌گردند.',
  },
];

export function parseShopFilterFromSearch(search: string): ShopFilterPreset | null {
  if (!search || typeof search !== 'string') return null;
  const query = search.startsWith('?') ? search.slice(1) : search;
  if (!query.trim()) return null;

  const params = new URLSearchParams(query);
  const preset: ShopFilterPreset = {};
  let hasAny = false;

  const rawCategory = params.get('category')?.trim() as CategoryId | undefined;
  if (rawCategory && rawCategory !== 'all' && VALID_CATEGORIES.has(rawCategory)) {
    preset.category = rawCategory;
    hasAny = true;
  }

  const rawDept = params.get('department')?.trim() as ShopDepartment | undefined;
  if (rawDept && VALID_DEPARTMENTS.has(rawDept)) {
    preset.department = rawDept;
    hasAny = true;
  }

  const rawType = params.get('productType')?.trim() as SkincareProductType | undefined;
  if (rawType && VALID_PRODUCT_TYPES.has(rawType)) {
    preset.productType = rawType;
    hasAny = true;
  }

  const rawRoutine = params.get('routine')?.trim() as RoutineType | undefined;
  if (rawRoutine && VALID_ROUTINES.has(rawRoutine)) {
    preset.routine = rawRoutine;
    hasAny = true;
  }

  const rawBrand = params.get('brand')?.trim().slice(0, 100);
  if (rawBrand && rawBrand !== 'all') {
    preset.brand = rawBrand;
    hasAny = true;
  }

  const rawQuery = params.get('q')?.trim().slice(0, 100);
  if (rawQuery) {
    preset.searchQuery = rawQuery;
    hasAny = true;
  }

  return hasAny ? preset : null;
}

export function buildShopUrl(preset?: ShopFilterPreset | null): string {
  if (!preset) return '/shop';
  const params = new URLSearchParams();

  if (preset.brand && preset.brand !== 'all') {
    params.set('brand', preset.brand);
  } else if (preset.department && preset.department !== 'all') {
    params.set('department', preset.department);
  } else if (preset.category && preset.category !== 'all') {
    params.set('category', preset.category);
  } else if (preset.productType && preset.productType !== 'all') {
    params.set('productType', preset.productType);
  } else if (preset.routine && preset.routine !== 'all') {
    params.set('routine', preset.routine);
  }

  if (preset.searchQuery && preset.searchQuery.trim()) {
    params.set('q', preset.searchQuery.trim());
  }

  const qs = params.toString();
  return qs ? `/shop?${qs}` : '/shop';
}

export function resolveAbsoluteUrl(urlOrPath: string | undefined, origin = CANONICAL_ORIGIN): string {
  const cleanOrigin = origin.replace(/\/+$/, '');
  if (!urlOrPath || !urlOrPath.trim()) return `${cleanOrigin}/og-image.jpg`;
  const trimmed = urlOrPath.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
    return trimmed;
  }
  return `${cleanOrigin}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

export function buildOrganizationSchema(origin = CANONICAL_ORIGIN) {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return {
    '@type': 'Organization',
    '@id': `${cleanOrigin}/#organization`,
    name: 'Vara Beauty - ورا بیوتی',
    alternateName: 'Vara Luxury Skincare',
    url: cleanOrigin,
    logo: `${cleanOrigin}/vara-logo.svg`,
    description: 'فروشگاه تخصصی مراقبت پوست، آرایشی و مو لوکس ورا بیوتی با ضمانت اصالت ۱۰۰٪ و مشاوره تخصصی',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-903-794-3125',
      contactType: 'customer service',
      availableLanguage: ['Persian', 'English'],
    },
  };
}

export function buildWebSiteSchema(origin = CANONICAL_ORIGIN) {
  const cleanOrigin = origin.replace(/\/+$/, '');
  return {
    '@type': 'WebSite',
    '@id': `${cleanOrigin}/#website`,
    url: `${cleanOrigin}/`,
    name: 'Vara Beauty - ورا بیوتی',
    publisher: { '@id': `${cleanOrigin}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${cleanOrigin}/shop?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

const DEPARTMENT_SEO: Record<
  ShopDepartment,
  { h1: string; title: string; description: string; subtitle: string }
> = {
  skincare: {
    h1: 'محصولات تخصصی مراقبت از پوست',
    title: 'خرید محصولات مراقبت از پوست اصل | سرم، آبرسان و ضدآفتاب | ورا بیوتی',
    description:
      'خرید آنلاین بهترین محصولات مراقبت از پوست اورجینال شامل شوینده، تونر، سرم، مرطوب‌کننده و ضدآفتاب از برندهای معتبر جهانی با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'روتین کامل پاکسازی، آبرسانی و درمان تخصصی پوست از معتبرترین برندهای کلینیکال دنیا',
  },
  body: {
    h1: 'محصولات مراقبت از بدن اصل',
    title: 'خرید محصولات مراقبت از بدن اورجینال | لوسیون، شوینده و اسکراب | ورا بیوتی',
    description:
      'خرید اینترنتی شوینده بدن، لوسیون، کره بدن، اسکراب و کرم دست و پا اورجینال از برندهای برتر مراقبتی با ارسال سریع در ورا بیوتی.',
    subtitle: 'شوینده‌ها، لوسیون‌های آبرسان و اسکراب‌های تخصصی برای لطافت و تغذیه پوست بدن',
  },
  lip: {
    h1: 'محصولات مراقبت از لب اصل',
    title: 'خرید بالم، ماسک و روغن لب اورجینال | مراقبت تخصصی لب | ورا بیوتی',
    description:
      'خرید انواع بالم لب، ماسک شب لب، اسکراب و روغن تقویت‌کننده لب اورجینال از برندهای معتبر بین‌المللی با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'بالم‌ها، ماسک‌های ترمیم‌کننده و روغن‌های مغذی برای نرمی و رفع خشکی لب',
  },
  hair: {
    h1: 'محصولات تخصصی مراقبت از مو',
    title: 'خرید محصولات مراقبت از مو اصل | شامپو، سرم و ماسک مو | ورا بیوتی',
    description:
      'خرید آنلاین شامپو، نرم‌کننده، ماسک مو، سرم و روغن ترمیم‌کننده مو اورجینال از برندهای جهانی با ضمانت اصالت در فروشگاه ورا بیوتی.',
    subtitle: 'فرمولاسیون‌های تخصصی تقویت‌کننده ریشه، ساقه و درخشش طبیعی مو',
  },
};

const CATEGORY_SEO: Record<
  Exclude<CategoryId, 'all'>,
  { h1: string; title: string; description: string; subtitle: string }
> = {
  cleanser: {
    h1: 'شوینده و پاک‌کننده صورت اصل',
    title: 'خرید شوینده و پاک‌کننده صورت اورجینال | ژل، فوم و میسلار | ورا بیوتی',
    description:
      'خرید بهترین ژل شستشو، فوم پاک‌کننده، بالم پاک‌کننده و میسلار واتر اورجینال مناسب انواع پوست خشک، چرب و حساس با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'پاکسازی عمقی منافذ بدون آسیب به سد دفاعی و رطوبت طبیعی پوست',
  },
  'anti-aging': {
    h1: 'محصولات ضدپیری و جوانساز پوست',
    title: 'خرید محصولات ضدچروک و جوانساز اصل | رتینول و پپتید | ورا بیوتی',
    description:
      'خرید آنلاین سرم و کرم‌های ضدپیری، رتینول، پپتید و لیفتینگ پوست اورجینال برای کاهش خطوط و افزایش استحکام پوست با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'فرمولاسیون‌های کلینیکال کلاژن‌ساز، رتینول و پپتید برای طراوت و جوانی پوست',
  },
  hydration: {
    h1: 'آبرسان و مرطوب‌کننده عمقی پوست',
    title: 'خرید کرم آبرسان و مرطوب‌کننده اصل | هیالورونیک اسید | ورا بیوتی',
    description:
      'خرید انواع کرم آبرسان، ژل کرم و سرم هیالورونیک اسید اورجینال مناسب پوست‌های خشک، مختلط و چرب با ضمانت اصالت و قیمت روز در ورا بیوتی.',
    subtitle: 'بازسازی سد رطوبتی و تامین آب سلولی پوست برای نرمی و شادابی ماندگار',
  },
  'sensitive-skin': {
    h1: 'محصولات پوست حساس و التیام‌بخش',
    title: 'خرید محصولات پوست حساس و ترمیم‌کننده اصل | سنتلا و سرامید | ورا بیوتی',
    description:
      'خرید آنلاین محصولات تخصصی التیام‌بخش، رفع قرمزی و تقویت سد دفاعی مخصوص پوست‌های حساس و تحریک‌شده با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'ترکیبات آرام‌بخش و ضدالتهاب بدون الکل و عطرهای محرک برای پوست‌های حساس',
  },
  'acne-blemishes': {
    h1: 'محصولات ضدجوش، کنترل چربی و لک',
    title: 'خرید محصولات ضدجوش و کنترل چربی پوست اصل | سالیسیلیک و نیاسینامید | ورا بیوتی',
    description:
      'خرید آنلاین شوینده، سرم و کرم‌های ضدجوش، رفع آکنه، کنترل سبوم و جای جوش اورجینال با ضمانت اصالت ۱۰۰٪ در فروشگاه ورا بیوتی.',
    subtitle: 'تنظیم ترشح چربی، پاکسازی منافذ و کمک به درمان سریع جوش و جای لک',
  },
  sunscreen: {
    h1: 'ضدآفتاب اصل و محافظت تخصصی پوست',
    title: 'خرید ضدآفتاب اصل خارجی | سبک و بدون رد سفیدی | ورا بیوتی',
    description:
      'خرید انواع ضدآفتاب فلوئیدی، استیکی، مینرال و بی‌رنگ اورجینال از برندهای کره‌ای، اروپایی و آمریکایی با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'محافظت کامل در برابر اشعه UVA/UVB با بافت سبک و جذب فوری بدون ایجاد سنگینی',
  },
  brightening: {
    h1: 'محصولات روشن‌کننده و ضدلک اصل',
    title: 'خرید سرم روشن‌کننده و ضدلک اصل | ویتامین C و نیاسینامید | ورا بیوتی',
    description:
      'خرید آنلاین سرم ویتامین C، آلفا آربوتین، ترانگزامیک اسید و کرم‌های روشن‌کننده و ضدلک اورجینال با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'کاهش تیرگی‌ها، یکنواخت‌سازی تناژ پوست و بازگرداندن شفافیت طبیعی چهره',
  },
  'hair-body': {
    h1: 'محصولات مراقبت مو و بدن اصل',
    title: 'خرید محصولات مراقبت مو و بدن اورجینال | شامپو، سرم و لوسیون | ورا بیوتی',
    description:
      'خرید آنلاین شامپو، ماسک مو، سرم مو، لوسیون و شوینده بدن اورجینال از برترین برندهای بین‌المللی با ضمانت اصالت در ورا بیوتی.',
    subtitle: 'مجموعه‌ای کامل از محصولات تقویت مو و مراقبت روزانه بدن',
  },
  makeup: {
    h1: 'لوازم آرایشی اورجینال',
    title: 'خرید لوازم آرایشی اصل خارجی | صورت، چشم و لب | ورا بیوتی',
    description:
      'خرید آنلاین بهترین لوازم آرایشی اصل شامل کرم‌پودر، کانسیلر، رژگونه، ریمل، رژ لب و ابزار آرایشی از برندهای معتبر جهانی در ورا بیوتی.',
    subtitle: 'محصولات آرایشی اورجینال با فرمولاسیون سبک، ماندگاری بالا و سازگار با پوست',
  },
};

const PRODUCT_TYPE_SEO: Record<
  SkincareProductType,
  { h1: string; title: string; description: string }
> = {
  cleanser: CATEGORY_SEO.cleanser,
  toner: {
    h1: 'تونر و اسنس‌های تخصصی پوست',
    title: 'خرید تونر و اسنس اصل | آبرسان، متعادل‌کننده و ضدجوش | ورا بیوتی',
    description:
      'خرید آنلاین انواع تونر و اسنس اورجینال کره‌ای و اروپایی برای تنظیم pH، آبرسانی و پاکسازی منافذ پوست با ضمانت اصالت در ورا بیوتی.',
  },
  serum: {
    h1: 'سرم‌های تخصصی و درمانی پوست',
    title: 'خرید سرم پوستی اصل | ویتامین C، نیاسینامید، هیالورونیک و رتینول | ورا بیوتی',
    description:
      'خرید آنلاین سرم‌های درمانی و تقویتی پوست اصل از معتبرترین برندهای دنیا با ضمانت اصالت و قیمت به‌روز در ورا بیوتی.',
  },
  moisturizer: CATEGORY_SEO.hydration,
  exfoliator: {
    h1: 'لایه‌بردار و اسکراب تخصصی پوست',
    title: 'خرید لایه‌بردار شیمیایی و اسکراب صورت اصل | AHA و BHA | ورا بیوتی',
    description:
      'خرید آنلاین لایه‌بردار و اسکراب صورت اورجینال برای رفع سلول‌های مرده، پاکسازی منافذ و شفافیت پوست در ورا بیوتی.',
  },
  'eye-care': {
    h1: 'کرم و سرم دور چشم اصل',
    title: 'خرید کرم و سرم دور چشم اصل | ضدتیرگی و ضدچروک | ورا بیوتی',
    description:
      'خرید آنلاین کرم دور چشم کافئین، پپتید و رتینول اورجینال برای کاهش پف، تیرگی و خطوط اطراف چشم در ورا بیوتی.',
  },
  sunscreen: CATEGORY_SEO.sunscreen,
  mask: {
    h1: 'ماسک صورت و ترمیم‌کننده پوست',
    title: 'خرید ماسک صورت اصل | آبرسان، خاک رسی و ورقه‌ای | ورا بیوتی',
    description:
      'خرید انواع ماسک صورت اورجینال آبرسان، پاکسازی‌کننده منافذ و شبانه با ضمانت اصالت کالا در فروشگاه ورا بیوتی.',
  },
  'lip-care': DEPARTMENT_SEO.lip,
  'hair-body': CATEGORY_SEO['hair-body'],
  makeup: CATEGORY_SEO.makeup,
  device: {
    h1: 'دستگاه‌ها و ابزارهای مراقبت زیبایی',
    title: 'خرید ابزارهای زیبایی و مراقبت خانگی پوست اصل | ورا بیوتی',
    description:
      'خرید آنلاین ابزارهای زیبایی، گواشا، جید رولر و تجهیزات تخصصی مراقبت خانگی پوست اورجینال با ضمانت اصالت در ورا بیوتی.',
  },
};

export interface ResolvedShopSeo {
  h1: string;
  subtitle: string;
  title: string;
  description: string;
  canonical: string;
  breadcrumbLabel: string;
}

export function resolveShopSeo(
  preset: ShopFilterPreset | null | undefined,
  brands: Array<{ id: string; labelFa: string; labelEn: string }> = [],
  origin = CANONICAL_ORIGIN
): ResolvedShopSeo {
  const cleanOrigin = origin.replace(/\/+$/, '');

  if (preset?.brand && preset.brand !== 'all') {
    const normalizedBrand = preset.brand.trim().toLowerCase();
    const matched = brands.find((b) => {
      const idLow = b.id.toLowerCase();
      const enLow = b.labelEn.toLowerCase();
      return (
        idLow === normalizedBrand ||
        enLow === normalizedBrand ||
        b.labelFa.toLowerCase() === normalizedBrand ||
        idLow.replace(/\s+/g, '-') === normalizedBrand ||
        enLow.replace(/\s+/g, '-') === normalizedBrand
      );
    });
    const labelFa = matched?.labelFa || preset.brand;
    const labelEn = matched?.labelEn || preset.brand;
    const displayName = labelFa && labelEn && labelFa !== labelEn ? `${labelFa} (${labelEn})` : labelEn || labelFa;
    const brandId = matched?.id || preset.brand;
    return {
      h1: `محصولات اصل برند ${displayName}`,
      subtitle: `مجموعه کامل محصولات اورجینال برند ${displayName} با ضمانت اصالت ۱۰۰٪، تاریخ انقضای معتبر و ارسال سریع`,
      title: `خرید محصولات اصل ${displayName} | قیمت روز و ضمانت اصالت | ورا بیوتی`,
      description: `مشاهده و خرید آنلاین محصولات اورجینال برند ${displayName} با ضمانت اصالت ۱۰۰٪، بسته‌بندی امن و قیمت به‌روز در فروشگاه تخصصی ورا بیوتی.`,
      canonical: `${cleanOrigin}/shop?brand=${encodeURIComponent(brandId)}`,
      breadcrumbLabel: labelFa || labelEn,
    };
  }

  if (preset?.department && preset.department !== 'all' && DEPARTMENT_SEO[preset.department]) {
    const info = DEPARTMENT_SEO[preset.department];
    return {
      h1: info.h1,
      subtitle: info.subtitle,
      title: info.title,
      description: info.description,
      canonical: `${cleanOrigin}/shop?department=${encodeURIComponent(preset.department)}`,
      breadcrumbLabel: info.h1,
    };
  }

  if (preset?.category && preset.category !== 'all' && CATEGORY_SEO[preset.category]) {
    const info = CATEGORY_SEO[preset.category];
    return {
      h1: info.h1,
      subtitle: info.subtitle,
      title: info.title,
      description: info.description,
      canonical: `${cleanOrigin}/shop?category=${encodeURIComponent(preset.category)}`,
      breadcrumbLabel: info.h1,
    };
  }

  if (preset?.productType && preset.productType !== 'all' && PRODUCT_TYPE_SEO[preset.productType]) {
    const info = PRODUCT_TYPE_SEO[preset.productType];
    return {
      h1: info.h1,
      subtitle: info.description,
      title: info.title,
      description: info.description,
      canonical: `${cleanOrigin}/shop?productType=${encodeURIComponent(preset.productType)}`,
      breadcrumbLabel: info.h1,
    };
  }

  return {
    h1: 'فروشگاه محصولات مراقبت پوست، مو و آرایشی اصل',
    subtitle: 'انتخاب و خرید آنلاین محصولات اورجینال از معتبرترین برندهای جهانی با ضمانت اصالت و تاریخ انقضای معتبر',
    title: 'فروشگاه محصولات پوستی، آرایشی و مراقبت مو اورجینال | ورا بیوتی',
    description:
      'خرید آنلاین انواع ضدآفتاب، سرم پوستی، مرطوب‌کننده، شوینده، محصولات مراقبت مو و لوازم آرایشی اصل از برترین برندهای جهانی با ضمانت اصالت در ورا بیوتی.',
    canonical: `${cleanOrigin}/shop`,
    breadcrumbLabel: 'فروشگاه محصولات',
  };
}

export function buildProductSeo(product: Product, origin = CANONICAL_ORIGIN) {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const canonical = `${cleanOrigin}/product/${encodeURIComponent(product.id)}`;
  const brandPart = product.brand ? ` ${product.brand}` : '';
  const title = `خرید ${product.nameFa}${brandPart} اصل | قیمت و مشخصات | ورا بیوتی`;
  const cleanDesc = (product.descriptionFa || '').replace(/\s+/g, ' ').trim();
  const description = cleanDesc
    ? (cleanDesc.length > 155 ? `${cleanDesc.slice(0, 152)}...` : cleanDesc)
    : `خرید آنلاین ${product.nameFa}${brandPart} اصل با ضمانت ۱۰۰٪ اصالت، تاریخ انقضای معتبر و ارسال سریع از فروشگاه تخصصی ورا بیوتی.`;

  const images = (product.images || [])
    .filter((img) => typeof img === 'string' && img.trim().length > 0)
    .map((img) => resolveAbsoluteUrl(img, cleanOrigin));
  const ogImage = images[0] || `${cleanOrigin}/og-image.jpg`;
  const priceIrr = Math.max(0, Math.round((Number(product.price) || 0) * 10));

  const productSchema = {
    '@type': 'Product',
    '@id': `${canonical}#product`,
    name: product.nameFa,
    ...(product.nameEn ? { alternateName: product.nameEn } : {}),
    image: images.length ? images : [ogImage],
    description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Vara Beauty',
    },
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'IRR',
      price: priceIrr,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@id': `${cleanOrigin}/#organization`,
      },
    },
    ...(product.rating && product.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: Math.max(1, product.reviewCount || 15),
          },
        }
      : {}),
  };

  return {
    title,
    description,
    canonical,
    ogImage,
    productSchema,
  };
}

export function buildCalculatorSeo(origin = CANONICAL_ORIGIN) {
  const cleanOrigin = origin.replace(/\/+$/, '');
  const canonical = `${cleanOrigin}/calculator`;
  const faqSchema = {
    '@type': 'FAQPage',
    mainEntity: CALCULATOR_FAQS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return {
    title: 'محاسبه‌گر قیمت خرید از سفورا دبی، آمازون امارات و ترندیول | ورا بیوتی',
    description:
      'محاسبه آنی و شفاف قیمت تمام‌شده خرید مستقیم از سفورا دبی (sephora.ae)، آمازون امارات (amazon.ae)، ترندیول ترکیه و لوک‌فنتستیک با نرخ لحظه‌ای ارز در ورا بیوتی.',
    canonical,
    faqSchema,
  };
}
