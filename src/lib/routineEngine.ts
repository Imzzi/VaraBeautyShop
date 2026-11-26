import type {
  Product,
  RoutineStepRecommendation,
  SkinConcern,
  SkinType,
  UserSkinProfile,
} from '../types';

export type RoutineStepRole =
  | 'cleanser'
  | 'toner'
  | 'serum'
  | 'eye-care'
  | 'moisturizer'
  | 'sunscreen'
  | 'night-treatment'
  | 'lip-care';

export interface RoutineBuildParams {
  style: 'minimal' | 'balanced' | 'complete';
  skinType: SkinType;
  primaryConcern: SkinConcern;
  sensitivityLevel?: string;
  currentRoutine?: string;
  products: Product[];
  preferredOverrides?: Record<string, string>;
}

export interface AdvisorRetrievalOptions {
  query: string;
  historyText?: string;
  skinProfile?: Partial<UserSkinProfile> | null;
  limit?: number;
}

const SKIN_TYPE_LABELS_FA: Record<SkinType, string> = {
  dry: 'خشک',
  oily: 'چرب',
  combination: 'مختلط',
  sensitive: 'حساس',
  normal: 'نرمال',
};

const CONCERN_LABELS_FA: Record<string, string> = {
  hydration: 'آبرسانی عمیق و تقویت رطوبت',
  brightening: 'شفافیت و کاهش لک و تیرگی',
  'anti-aging': 'جوانسازی و کاهش خطوط',
  'acne-blemish': 'کنترل چربی، منافذ و جوش',
  'barrier-repair': 'ترمیم سد دفاعی و تسکین قرمزی',
  sensitive: 'کاهش حساسیت و التیام التهاب',
  soothing: 'تسکین و آرامش‌بخش پوست',
  sunscreen: 'محافظت روزانه در برابر آفتاب',
};

const CONCERN_TO_CATEGORY: Record<string, string[]> = {
  'acne-blemish': ['acne-blemishes', 'cleanser'],
  hydration: ['hydration'],
  brightening: ['brightening'],
  'anti-aging': ['anti-aging'],
  'barrier-repair': ['sensitive-skin', 'hydration'],
  sensitive: ['sensitive-skin'],
  soothing: ['sensitive-skin'],
  sunscreen: ['sunscreen'],
};

const ROLE_META: Record<
  RoutineStepRole,
  {
    morningTitleFa: string;
    nightTitleFa: string;
    morningTitleEn: string;
    nightTitleEn: string;
    actionSummaryFa: string;
  }
> = {
  cleanser: {
    morningTitleFa: 'پاکسازی ملایم صبحگاهی',
    nightTitleFa: 'پاکسازی عمیق شبانه',
    morningTitleEn: 'Gentle Morning Cleansing',
    nightTitleEn: 'Deep Night Cleansing',
    actionSummaryFa: 'پاکسازی آلودگی‌ها و چربی اضافه بدون آسیب به سد طبیعی پوست',
  },
  toner: {
    morningTitleFa: 'تونر متعادل‌کننده و آماده‌ساز',
    nightTitleFa: 'تونر تنظیم pH و آبرسان',
    morningTitleEn: 'Balancing Facial Toner',
    nightTitleEn: 'Soothing Balance Toner',
    actionSummaryFa: 'تنظیم pH پوست و افزایش جذب ترکیبات درمانی مراحل بعد',
  },
  serum: {
    morningTitleFa: 'سرم درمانی هدفمند',
    nightTitleFa: 'سرم تخصصی درمان',
    morningTitleEn: 'Targeted Treatment Serum',
    nightTitleEn: 'Night Repair Serum',
    actionSummaryFa: 'رساندن دوز متمرکز ترکیبات مؤثر متناسب با دغدغه اصلی پوست شما',
  },
  'eye-care': {
    morningTitleFa: 'مراقبت و آبرسانی دور چشم',
    nightTitleFa: 'ترمیم و تغذیه دور چشم',
    morningTitleEn: 'Morning Eye Care',
    nightTitleEn: 'Night Eye Repair',
    actionSummaryFa: 'مراقبت تخصصی از پوست ظریف اطراف چشم برای کاهش پف، تیرگی و خطوط',
  },
  moisturizer: {
    morningTitleFa: 'مرطوب‌کننده و محافظ سد دفاعی',
    nightTitleFa: 'مرطوب‌کننده و بازسازی شبانه',
    morningTitleEn: 'Barrier Lock Moisturizer',
    nightTitleEn: 'Overnight Moisture Seal',
    actionSummaryFa: 'قفل کردن رطوبت و تقویت لایه محافظ پوست',
  },
  sunscreen: {
    morningTitleFa: 'ضدآفتاب محافظ روزانه',
    nightTitleFa: 'محافظت روزانه UV',
    morningTitleEn: 'Daily UV Sunscreen',
    nightTitleEn: 'Daily UV Sunscreen',
    actionSummaryFa: 'محافظت کامل در برابر اشعه‌های UVA/UVB و پیشگیری از لک و پیری زودرس',
  },
  'night-treatment': {
    morningTitleFa: 'درمان تکمیلی هدفمند',
    nightTitleFa: 'مراقبت و بازسازی تخصصی شب',
    morningTitleEn: 'Targeted Care',
    nightTitleEn: 'Overnight Targeted Treatment',
    actionSummaryFa: 'بازسازی و رسیدگی متمرکز به پوست در زمان استراحت شبانه',
  },
  'lip-care': {
    morningTitleFa: 'بالم محافظ لب',
    nightTitleFa: 'تغذیه و ترمیم شبانه لب',
    morningTitleEn: 'Lip Barrier Balm',
    nightTitleEn: 'Overnight Lip Recovery',
    actionSummaryFa: 'نرم‌کنندگی و جلوگیری از خشکی و ترک‌خوردگی لب‌ها در طول خواب',
  },
};

const KNOWN_PERSIAN_BRAND_ALIASES: Array<[RegExp, string[]]> = [
  [/بیودرما|bioderma/i, ['bioderma']],
  [/سراوی|سراوه|cerave/i, ['cerave']],
  [/اوردینری|ordinary/i, ['ordinary', 'the ordinary']],
  [/لاروش\s*پوزای|لاروش|la\s*roche/i, ['la roche-posay', 'la roche']],
  [/کوزارکس|cosrx/i, ['cosrx']],
  [/اسکین\s*[۱1][۰0][۰0][۴4]|skin1004|skin\s*1004/i, ['skin1004']],
  [/مدیکوب|medicube/i, ['medicube']],
  [/مری\s*اند\s*می|mary\s*&\s*may|mary\s*and\s*may/i, ['mary & may', 'mary and may']],
  [/آنوا|anua/i, ['anua']],
  [/بیوتی\s*آف\s*جوزان|جوزان|joseon/i, ['beauty of joseon']],
  [/ایزدین|isdin/i, ['isdin']],
  [/کلینیک|clinique/i, ['clinique']],
  [/شیگلم|sheglam/i, ['sheglam']],
  [/لور[آا]ل|loreal|l'oreal/i, ['loreal', "l'oréal", "l'oreal"]],
  [/گارنیه|garnier/i, ['garnier']],
  [/اوسرین|eucerin/i, ['eucerin']],
  [/نوتروژینا|neutrogena/i, ['neutrogena']],
  [/وی\s*تی|vt\b|ریدل\s*شات|reedle/i, ['vt']],
  [/آون|avene|avène/i, ['avene', 'avène']],
  [/سنت\s*ایوز|st\.?\s*ives/i, ['st. ives', 'st ives']],
];

function getCombinedText(product: Product): string {
  const ingredientNames = (product.keyIngredients || [])
    .map((ing) =>
      typeof ing === 'string'
        ? ing
        : `${ing?.nameFa || ''} ${ing?.nameEn || ''} ${ing?.description || ''}`
    )
    .join(' ');
  const tags = (product.ingredientTags || []).join(' ');
  return [
    product.nameFa || '',
    product.nameEn || '',
    product.brand || '',
    product.descriptionFa || '',
    ingredientNames,
    tags,
  ]
    .join(' ')
    .toLowerCase();
}

function getTitleText(product: Product): string {
  return `${product.nameFa || ''} ${product.nameEn || ''}`.toLowerCase();
}

export function isProductInStock(product: Product): boolean {
  if (!product || !product.id) return false;
  if (product.inStock === false) return false;
  if (typeof product.stockCount === 'number' && product.stockCount <= 0) return false;
  if (typeof product.price === 'number' && product.price <= 0) return false;
  return true;
}

export function isLashOrBrowProduct(product: Product): boolean {
  const title = getTitleText(product);
  return /(^|[\s\u200c])(مژه|ابرو|lash|eyelash|brow)([\s\u200c]|$)/i.test(title);
}

export function isBodyOrHairOnlyProduct(product: Product): boolean {
  if (product.category === 'hair-body' || product.productType === 'hair-body') {
    const title = getTitleText(product);
    if (/(صورت و بدن|face\s*(and|&)\s*body)/i.test(title)) {
      return false;
    }
    return true;
  }

  if ((product.concerns || []).includes('hair-body')) {
    const title = getTitleText(product);
    if (!/(صورت و بدن|face\s*(and|&)\s*body)/i.test(title)) {
      return true;
    }
  }

  const title = getTitleText(product);
  if (/(صورت و بدن|face\s*(and|&)\s*body)/i.test(title)) {
    return false;
  }

  return /بادی واش|شوینده بدن|شامپو|نرم[\u200c ]?کننده مو|ماسک مو|سرم مو|کرم دست|کرم پا|اسپری بدن|دئودورانت|بادی لوشن|لوسیون بدن|اسکراب بدن|نواحی حساس بدن|لایه[\u200c ]?بردار بدن|body wash|body lotion|body scrub|shampoo|conditioner|hand cream|foot cream/i.test(
    title
  );
}

export function isFacialSkincareProduct(
  product: Product,
  options?: { allowLipCare?: boolean }
): boolean {
  if (!isProductInStock(product)) return false;
  if (
    product.category === 'makeup' ||
    product.productType === 'makeup' ||
    product.productType === 'device'
  ) {
    return false;
  }
  if (isLashOrBrowProduct(product)) return false;
  if (isBodyOrHairOnlyProduct(product)) return false;

  const isLipProduct =
    product.productType === 'lip-care' ||
    /بالم لب|اسکراب لب|ماسک لب|lip balm|lip scrub|lip mask/i.test(getTitleText(product));
  if (isLipProduct && !options?.allowLipCare) {
    return false;
  }

  return true;
}

export function isStrongActiveProduct(product: Product): boolean {
  const combined = getCombinedText(product);
  return /رتینول|retinol|ریدل شات|reedle|میکرونیدل|microneedle|aha\s*30|پیلینگ|peeling|لایه[\u200c ]?بردار قوی|سالیسیلیک|salicylic|bha\s*2|گلیکولیک|glycolic/i.test(
    combined
  );
}

export function isSoothingBarrierProduct(product: Product): boolean {
  if (
    (product.concerns || []).some((c) =>
      c === 'sensitive' || c === 'soothing' || c === 'barrier-repair'
    )
  ) {
    return true;
  }
  if (product.category === 'sensitive-skin') return true;
  const combined = getCombinedText(product);
  return /سنتلا|centella|سیکا|cica|پانتنول|panthenol|سرامید|ceramide|آلوئه|aloe|آرامش[\u200c ]?بخش|التیام|تسکین|مادکاسوساید|madecassoside|barrier/i.test(
    combined
  );
}

export function matchesStepRole(product: Product, role: RoutineStepRole): boolean {
  if (role === 'lip-care') {
    if (!isProductInStock(product)) return false;
    if (
      product.category === 'makeup' ||
      product.productType === 'makeup' ||
      product.productType === 'device' ||
      isBodyOrHairOnlyProduct(product) ||
      isLashOrBrowProduct(product)
    ) {
      return false;
    }
    const title = getTitleText(product);
    return (
      product.productType === 'lip-care' ||
      /بالم لب|ماسک لب|اسکراب لب|lip balm|lip mask|lip care/i.test(title)
    );
  }

  if (!isFacialSkincareProduct(product)) return false;
  const title = getTitleText(product);

  switch (role) {
    case 'cleanser': {
      if (product.productType === 'exfoliator' && !/شوینده|فوم|ژل شستشو/i.test(title)) {
        return false;
      }
      return (
        product.productType === 'cleanser' ||
        product.category === 'cleanser' ||
        /شوینده|فوم|ژل شستشو|میسلار|پاک[\u200c ]?کننده|cleanser|wash|foam|micellar/i.test(title)
      );
    }
    case 'toner': {
      return (
        product.productType === 'toner' ||
        /تونر|پد تونر|اسنس|toner|essence/i.test(title)
      );
    }
    case 'serum': {
      if (
        product.productType === 'eye-care' ||
        /دور چشم|eye\s*(serum|cream|patch)/i.test(title)
      ) {
        return false;
      }
      return (
        product.productType === 'serum' ||
        /سرم|آمپول|serum|ampoule/i.test(title)
      );
    }
    case 'eye-care': {
      return (
        product.productType === 'eye-care' ||
        /دور چشم|eye\s*(cream|serum|gel|patch)|پچ ژلی.*چشم/i.test(title)
      );
    }
    case 'moisturizer': {
      if (
        product.productType === 'sunscreen' ||
        product.productType === 'eye-care' ||
        product.productType === 'cleanser' ||
        product.category === 'sunscreen' ||
        /ضدآفتاب|ضد آفتاب|sunscreen|spf|دور چشم|eye/i.test(title)
      ) {
        return false;
      }
      return (
        product.productType === 'moisturizer' ||
        /مرطوب[\u200c ]?کننده|آبرسان|ژل کرم|کرم ترمیم|لوسیون صورت|moisturizer|gel cream|cream|lotion/i.test(
          title
        )
      );
    }
    case 'sunscreen': {
      return (
        product.productType === 'sunscreen' ||
        product.category === 'sunscreen' ||
        /ضدآفتاب|ضد آفتاب|sunscreen|sun\s*cream|spf/i.test(title)
      );
    }
    case 'night-treatment': {
      if (
        product.productType === 'eye-care' ||
        /دور چشم|پچ ژلی.*چشم|eye\s*(cream|serum|patch)/i.test(title)
      ) {
        return false;
      }
      return (
        product.productType === 'mask' ||
        product.productType === 'exfoliator' ||
        product.productType === 'serum'
      );
    }
    default:
      return false;
  }
}

export function scoreProductForProfile(
  product: Product,
  opts: {
    skinType: SkinType;
    primaryConcern: SkinConcern;
    sensitivityLevel?: string;
    currentRoutine?: string;
    role: RoutineStepRole;
  }
): number {
  let score = 0;
  const { skinType, primaryConcern, sensitivityLevel, currentRoutine, role } = opts;
  const combined = getCombinedText(product);
  const title = getTitleText(product);
  const skinTypes = product.skinTypes || [];
  const concerns = product.concerns || [];

  // 1. Skin type fit (prefer targeted skin types over catch-all 5-type tags)
  if (skinTypes.includes(skinType)) {
    if (skinTypes.length <= 2) score += 28;
    else if (skinTypes.length <= 4) score += 18;
    else score += 10;
  } else if (skinTypes.length > 0 && skinTypes.length < 5) {
    score -= 8;
  }

  // Texture suitability by skin type
  if (skinType === 'oily') {
    if (/فاقد چربی|مات|کنترل چربی|سبک|ژل|فلوئید|سبوم|oil-free|sebum|ضدجوش/i.test(combined)) {
      score += 14;
    }
    if (/خیلی خشک|بالم غلیظ|بسیار مغذی|atoderm/i.test(combined)) {
      score -= 22;
    }
  } else if (skinType === 'dry') {
    if (/خشک|آبرسان|مرطوب|سرامید|هیالورونیک|مغذی|التیام|atoderm|hydrating|rich/i.test(combined)) {
      score += 14;
    }
    if (/مات[\u200c ]?کننده|ضد براقی|پوست چرب/i.test(combined) && !skinTypes.includes('dry')) {
      score -= 16;
    }
  } else if (skinType === 'combination') {
    if (/متعادل|سبک|ژل کرم|آبرسان|نیاسینامید|منافذ/i.test(combined)) {
      score += 10;
    }
  } else if (skinType === 'sensitive') {
    if (/حساس|التیام|آرامش|بدون عطر|سنتلا|سرامید|سیکا|پانتنول|soothing|sensitive/i.test(combined)) {
      score += 16;
    }
  }

  // 2. Primary concern & category alignment
  if (concerns.includes(primaryConcern)) {
    score += concerns.length <= 2 ? 26 : 18;
  }
  const expectedCategories = CONCERN_TO_CATEGORY[primaryConcern] || [];
  if (expectedCategories.includes(product.category)) {
    score += 14;
  }

  if (primaryConcern === 'acne-blemish') {
    if (/نیاسینامید|niacinamide|سالیسیلیک|salicylic|bha|زینک|zinc|درخت چای|tea tree|سنتلا|centella|جوش|آکنه|منافذ/i.test(combined)) {
      score += 16;
    }
  } else if (primaryConcern === 'hydration') {
    if (/هیالورونیک|hyaluronic|پانتنول|panthenol|سرامید|ceramide|آبرسان|رطوبت|گلیسیرین|اسکوآلان|squalane/i.test(combined)) {
      score += 16;
    }
  } else if (primaryConcern === 'brightening') {
    if (/ویتامین\s*(c|سی)|vitamin\s*c|آربوتین|arbutin|گلوتاتیون|glutathione|نیاسینامید|niacinamide|ترانگزامیک|tranexamic|لک|روشن[\u200c ]?کننده/i.test(combined)) {
      score += 16;
    }
  } else if (primaryConcern === 'anti-aging') {
    if (/پپتید|peptide|رتینول|retinol|کلاژن|collagen|آدنوزین|adenosine|باکوچیول|bakuchiol|pdrn|ضدچروک|جوانساز|لیفت/i.test(combined)) {
      score += 16;
    }
  } else if (
    primaryConcern === 'barrier-repair' ||
    primaryConcern === 'sensitive' ||
    primaryConcern === 'soothing'
  ) {
    if (isSoothingBarrierProduct(product)) {
      score += 18;
    }
  }

  // 3. Sensitivity safety & experience level
  const isHighSensitivity = sensitivityLevel === 'high' || skinType === 'sensitive';
  if (isHighSensitivity) {
    if (isStrongActiveProduct(product)) {
      score -= 45;
    }
    if (isSoothingBarrierProduct(product)) {
      score += 20;
    }
  } else if (sensitivityLevel === 'medium') {
    if (/ریدل شات\s*300|aha\s*30%|پیلینگ قوی/i.test(combined)) {
      score -= 15;
    }
  }

  if (currentRoutine === 'none') {
    if (isStrongActiveProduct(product)) {
      score -= 18;
    }
    if (isSoothingBarrierProduct(product)) {
      score += 6;
    }
  } else if (currentRoutine === 'experienced' && !isHighSensitivity) {
    if ((role === 'serum' || role === 'night-treatment') && isStrongActiveProduct(product)) {
      score += 8;
    }
  }

  // 4. Role-specific clinical polish
  if (role === 'cleanser') {
    if (/میسلار|micellar/i.test(title) && !/ژل|فوم|شستشو/i.test(title)) {
      score -= 10; // Prefer wash-off cleanser as step 1 over micellar water
    }
    if (/ژل شستشو|فوم|شوینده/i.test(title)) {
      score += 8;
    }
  } else if (role === 'night-treatment') {
    if (product.productType === 'mask' || product.productType === 'exfoliator') {
      score += 6;
    }
    if (/پچ ضدجوش|pimple patch/i.test(title) && primaryConcern !== 'acne-blemish') {
      score -= 22;
    }
    if (isHighSensitivity && product.productType === 'exfoliator') {
      score -= 25;
    }
  } else if (role === 'lip-care') {
    if (/اسکراب لب|lip scrub/i.test(title)) {
      score -= 15;
    }
    if (/بالم|ماسک|balm|mask/i.test(title)) {
      score += 10;
    }
  }

  // 5. Rating & popularity tie-breaker
  score += (product.rating || 4.5) * 1.5;
  if (product.isBestSeller) score += 3;

  return score;
}

export function buildStepReasonFa(
  product: Product,
  role: RoutineStepRole,
  skinType: SkinType,
  primaryConcern: SkinConcern
): string {
  const brandLabel = product.brand ? ` از برند ${product.brand}` : '';
  const ingredientList = (product.keyIngredients || [])
    .map((ing) => (typeof ing === 'string' ? ing : ing?.nameFa || ing?.nameEn || ''))
    .filter(Boolean)
    .slice(0, 2);

  const ingredientPhrase =
    ingredientList.length > 0 ? ` با بهره‌گیری از ${ingredientList.join(' و ')}` : '';
  const skinLabel = SKIN_TYPE_LABELS_FA[skinType] || 'شما';
  const concernLabel = CONCERN_LABELS_FA[primaryConcern] || 'مراقبت هدفمند';
  const roleSummary = ROLE_META[role]?.actionSummaryFa || '';

  return `محصول${brandLabel}${ingredientPhrase} متناسب با پوست ${skinLabel} انتخاب شده است تا در این مرحله به ${concernLabel} کمک کند و ${roleSummary} را انجام دهد.`;
}

interface RankedCandidate {
  product: Product;
  score: number;
}

function getRankedForRole(
  products: Product[],
  role: RoutineStepRole,
  params: {
    skinType: SkinType;
    primaryConcern: SkinConcern;
    sensitivityLevel?: string;
    currentRoutine?: string;
  }
): RankedCandidate[] {
  return products
    .filter((p) => matchesStepRole(p, role))
    .map((product) => ({
      product,
      score: scoreProductForProfile(product, { ...params, role }),
    }))
    .sort((a, b) => b.score - a.score);
}

export function buildPersonalizedRoutine(params: RoutineBuildParams): {
  morningSteps: RoutineStepRecommendation[];
  nightSteps: RoutineStepRecommendation[];
} {
  const {
    style,
    skinType,
    primaryConcern,
    sensitivityLevel = 'medium',
    currentRoutine = 'basic',
    products,
    preferredOverrides = {},
  } = params;

  const amRoles: RoutineStepRole[] =
    style === 'minimal'
      ? ['cleanser', 'moisturizer', 'sunscreen']
      : style === 'balanced'
      ? ['cleanser', 'serum', 'moisturizer', 'sunscreen']
      : ['cleanser', 'toner', 'serum', 'eye-care', 'moisturizer', 'sunscreen'];

  const pmRoles: RoutineStepRole[] =
    style === 'minimal'
      ? ['cleanser', 'serum', 'moisturizer']
      : style === 'balanced'
      ? ['cleanser', 'toner', 'night-treatment', 'moisturizer']
      : ['cleanser', 'toner', 'night-treatment', 'eye-care', 'moisturizer', 'lip-care'];

  const chosenByRole = new Map<RoutineStepRole, Product>();
  const usedIdsByOtherRoles = new Set<string>();
  const rankedCache = new Map<RoutineStepRole, RankedCandidate[]>();

  const getRanked = (role: RoutineStepRole): RankedCandidate[] => {
    if (!rankedCache.has(role)) {
      rankedCache.set(
        role,
        getRankedForRole(products, role, {
          skinType,
          primaryConcern,
          sensitivityLevel,
          currentRoutine,
        })
      );
    }
    return rankedCache.get(role) || [];
  };

  const pickProductFor = (
    timeOfDay: 'morning' | 'night',
    role: RoutineStepRole
  ): { product: Product; alternatives: string[] } | null => {
    const ranked = getRanked(role);
    if (ranked.length === 0) return null;

    const overrideKey = `${timeOfDay}:${role}`;
    const roleOverrideKey = role;
    const overrideId = preferredOverrides[overrideKey] || preferredOverrides[roleOverrideKey];

    // Prefer reuse for identical role across AM/PM (e.g. cleanser, toner, eye-care, moisturizer) unless overridden
    if (!overrideId && chosenByRole.has(role)) {
      const sameRoleProduct = chosenByRole.get(role)!;
      const alts = ranked
        .filter(
          (c) =>
            c.product.id !== sameRoleProduct.id && !usedIdsByOtherRoles.has(c.product.id)
        )
        .slice(0, 3)
        .map((c) => c.product.id);
      return { product: sameRoleProduct, alternatives: alts };
    }

    // Try explicit user swap override first if valid and not used by another role
    if (overrideId) {
      const overrideCandidate = ranked.find(
        (c) =>
          c.product.id === overrideId &&
          (!usedIdsByOtherRoles.has(c.product.id) || chosenByRole.get(role)?.id === overrideId)
      );
      if (overrideCandidate) {
        chosenByRole.set(role, overrideCandidate.product);
        const alts = ranked
          .filter(
            (c) =>
              c.product.id !== overrideCandidate.product.id &&
              !usedIdsByOtherRoles.has(c.product.id)
          )
          .slice(0, 3)
          .map((c) => c.product.id);
        return { product: overrideCandidate.product, alternatives: alts };
      }
    }

    // Otherwise pick top ranked candidate NOT already assigned to a different role
    const primary = ranked.find((c) => !usedIdsByOtherRoles.has(c.product.id));
    if (!primary) return null;

    chosenByRole.set(role, primary.product);
    const alts = ranked
      .filter(
        (c) =>
          c.product.id !== primary.product.id && !usedIdsByOtherRoles.has(c.product.id)
      )
      .slice(0, 3)
      .map((c) => c.product.id);

    return { product: primary.product, alternatives: alts };
  };

  const buildTimeSteps = (
    timeOfDay: 'morning' | 'night',
    roles: RoutineStepRole[]
  ): RoutineStepRecommendation[] => {
    const steps: RoutineStepRecommendation[] = [];
    for (const role of roles) {
      // Mark all products already chosen by OTHER roles before picking for this role
      usedIdsByOtherRoles.clear();
      for (const [otherRole, prod] of chosenByRole.entries()) {
        if (otherRole !== role) {
          usedIdsByOtherRoles.add(prod.id);
        }
      }

      const selection = pickProductFor(timeOfDay, role);
      if (!selection) continue; // Never pad with unrelated products like products[0]

      const stepNumber = steps.length + 1;
      const meta = ROLE_META[role];
      const titleFa =
        timeOfDay === 'morning' ? meta.morningTitleFa : meta.nightTitleFa;
      const titleEn =
        timeOfDay === 'morning' ? meta.morningTitleEn : meta.nightTitleEn;

      steps.push({
        stepNumber,
        stepTitleFa: `${stepNumber}. ${titleFa}`,
        stepTitleEn: `${stepNumber}. ${titleEn}`,
        timeOfDay,
        productId: selection.product.id,
        product: selection.product,
        reasonFa: buildStepReasonFa(
          selection.product,
          role,
          skinType,
          primaryConcern
        ),
        role,
        alternativeProductIds: selection.alternatives,
      });
    }
    return steps;
  };

  // Build AM first, then PM (preserving shared cleanser/moisturizer/toner/eye-care across same role while preventing cross-role dupes)
  const morningSteps = buildTimeSteps('morning', amRoles);
  const nightSteps = buildTimeSteps('night', pmRoles);

  return { morningSteps, nightSteps };
}

interface ParsedAdvisorIntent {
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  roles: RoutineStepRole[];
  wantsMakeup: boolean;
  wantsHairBody: boolean;
  wantsDevice: boolean;
  wantsLipCare: boolean;
  wantsRoutine: boolean;
  mentionedBrands: string[];
  ingredientTokens: string[];
}

function parseAdvisorIntent(
  text: string,
  skinProfile?: Partial<UserSkinProfile> | null
): ParsedAdvisorIntent {
  const lower = (text || '').toLowerCase();

  const skinTypes: SkinType[] = [];
  if (/چرب|براق|سبوم|oily/i.test(lower)) skinTypes.push('oily');
  if (/خشک|کم[\u200c ]?آب|دهیدراته|پوسته|dry|dehydrated/i.test(lower)) skinTypes.push('dry');
  if (/مختلط|combination/i.test(lower)) skinTypes.push('combination');
  if (/حساس|قرمزی|التهاب|سوزش|sensitive/i.test(lower)) skinTypes.push('sensitive');
  if (/معمولی|نرمال|normal/i.test(lower)) skinTypes.push('normal');
  if (skinTypes.length === 0 && skinProfile?.skinType) {
    skinTypes.push(skinProfile.skinType);
  }

  const concerns: SkinConcern[] = [];
  if (/جوش|آکنه|منافذ|کومدون|سرسیاه|acne|blemish|pore/i.test(lower)) concerns.push('acne-blemish');
  if (/لک|تیرگی|روشن|شفاف|کدر|ویتامین\s*c|آربوتین|bright|spot|pigment/i.test(lower)) concerns.push('brightening');
  if (/چروک|خطوط|جوان|لیفت|افتادگی|پپتید|رتینول|anti-aging|wrinkle|aging/i.test(lower)) concerns.push('anti-aging');
  if (/آبرسان|هیدرات|خشک|رطوبت|هیالورونیک|hydrat/i.test(lower)) concerns.push('hydration');
  if (/ترمیم|سد دفاعی|حساس|التیام|سیکا|سرامید|barrier|sooth/i.test(lower)) concerns.push('barrier-repair');
  if (concerns.length === 0 && skinProfile?.primaryConcern) {
    concerns.push(skinProfile.primaryConcern);
  }

  const roles: RoutineStepRole[] = [];
  if (/شوینده|شستشو|فوم|میسلار|پاک[\u200c ]?کننده|cleanser|wash|micellar/i.test(lower)) roles.push('cleanser');
  if (/تونر|اسنس|toner|essence/i.test(lower)) roles.push('toner');
  if (/سرم|آمپول|ریدل|serum|ampoule/i.test(lower)) roles.push('serum');
  if (/دور چشم|تیرگی چشم|پف چشم|eye/i.test(lower)) roles.push('eye-care');
  if (/مرطوب|آبرسان|کرم|لوسیون|ژل کرم|moisturizer|cream/i.test(lower)) roles.push('moisturizer');
  if (/ضدآفتاب|ضد آفتاب|آفتاب|spf|sunscreen/i.test(lower)) roles.push('sunscreen');
  if (/ماسک|لایه[\u200c ]?بردار|اسکراب|پیلینگ|پچ|mask|exfoliat|peel/i.test(lower)) roles.push('night-treatment');
  if (/لب|بالم لب|lip/i.test(lower)) roles.push('lip-care');

  const wantsMakeup = /آرایش|میکاپ|رژ\s*گونه|رژگونه|رژ\s*لب|کرم[\u200c ]?پودر|کانسیلر|ریمل|هایلایتر|تینت|پرایمر|پودر فیکس|برنزر|کانتور|خط چشم|سایه|makeup|concealer|blush|lipstick|mascara|foundation/i.test(
    lower
  );
  const wantsHairBody = /شامپو|مو|بدن|بادی|بادی واش|دست|پا|مژه|ابرو|hair|shampoo|body|lash|brow/i.test(
    lower
  );
  const wantsDevice = /دستگاه|براش|درمارولر|گواشا|device|gua\s*sha/i.test(lower);
  const wantsLipCare = roles.includes('lip-care');
  const wantsRoutine =
    /روتین|پیشنهاد|بهترین محصول|چند محصول|صبح و شب|routine|recommend/i.test(lower) ||
    roles.length === 0;

  const mentionedBrands: string[] = [];
  for (const [pattern, aliases] of KNOWN_PERSIAN_BRAND_ALIASES) {
    if (pattern.test(lower)) {
      mentionedBrands.push(...aliases);
    }
  }

  const ingredientTokens: string[] = [];
  const tokenRegexes: Array<[RegExp, string]> = [
    [/نیاسینامید|niacinamide/i, 'نیاسینامید|niacinamide'],
    [/سالیسیلیک|salicylic|bha/i, 'سالیسیلیک|salicylic|bha'],
    [/هیالورونیک|hyaluronic/i, 'هیالورونیک|hyaluronic'],
    [/ویتامین\s*(c|سی)|vitamin\s*c/i, 'ویتامین|vitamin c'],
    [/رتینول|retinol/i, 'رتینول|retinol'],
    [/سنتلا|centella/i, 'سنتلا|centella'],
    [/سرامید|ceramide/i, 'سرامید|ceramide'],
    [/پپتید|peptide/i, 'پپتید|peptide'],
    [/کلاژن|collagen/i, 'کلاژن|collagen'],
    [/حلزون|snail|موسین/i, 'حلزون|snail'],
    [/آزلائیک|azelaic/i, 'آزلائیک|azelaic'],
    [/ریدل|reedle/i, 'ریدل|reedle'],
    [/کافئین|caffeine/i, 'کافئین|caffeine'],
    [/پانتنول|panthenol/i, 'پانتنول|panthenol'],
  ];
  for (const [rx, group] of tokenRegexes) {
    if (rx.test(lower)) ingredientTokens.push(group);
  }

  return {
    skinTypes,
    concerns,
    roles,
    wantsMakeup,
    wantsHairBody,
    wantsDevice,
    wantsLipCare,
    wantsRoutine,
    mentionedBrands,
    ingredientTokens,
  };
}

export function selectRelevantAdvisorProducts(
  products: Product[],
  options: AdvisorRetrievalOptions
): Product[] {
  const limit = options.limit ?? 36;
  const combinedQueryText = `${options.query || ''} ${options.historyText || ''}`.trim();
  const intent = parseAdvisorIntent(combinedQueryText, options.skinProfile);

  const inStockProducts = products.filter((p) => isProductInStock(p));
  if (inStockProducts.length === 0) return [];

  const eligible = inStockProducts.filter((p) => {
    const isMakeup = p.category === 'makeup' || p.productType === 'makeup';
    const isDevice = p.productType === 'device';
    const isBodyOrLash = isBodyOrHairOnlyProduct(p) || isLashOrBrowProduct(p);
    const isLip =
      p.productType === 'lip-care' ||
      /بالم لب|اسکراب لب|ماسک لب|lip balm|lip scrub|lip mask/i.test(getTitleText(p));

    if (isMakeup && !intent.wantsMakeup) return false;
    if (isDevice && !intent.wantsDevice) return false;
    if (isBodyOrLash && !intent.wantsHairBody) return false;
    if (isLip && !intent.wantsLipCare && !intent.wantsMakeup) return false;
    return true;
  });

  const pool = eligible.length > 0 ? eligible : inStockProducts;

  const queryWords = combinedQueryText
    .toLowerCase()
    .split(/[\s،,.;:!?؟()\[\]"'/+\-]+/)
    .filter((w) => w.length >= 2);

  const scored = pool.map((product) => {
    let score = 0;
    const text = getCombinedText(product);
    const brandLower = (product.brand || '').toLowerCase();

    // Strong boost for matching brand query
    if (
      intent.mentionedBrands.some(
        (b) => brandLower.includes(b) || text.includes(b)
      )
    ) {
      score += 45;
    }

    // Ingredient keyword matches
    for (const ingGroup of intent.ingredientTokens) {
      const parts = ingGroup.split('|');
      if (parts.some((pt) => text.includes(pt))) {
        score += 32;
      }
    }

    // Raw query keyword overlap with product title & description
    for (const w of queryWords) {
      if (getTitleText(product).includes(w)) score += 12;
      else if (text.includes(w)) score += 4;
    }

    // Skin type & concern alignment (reusing profile scoring logic)
    const primarySkin = intent.skinTypes[0] || options.skinProfile?.skinType || 'combination';
    const primaryConcern =
      intent.concerns[0] || options.skinProfile?.primaryConcern || 'hydration';
    const inferredRole: RoutineStepRole =
      (product.productType as RoutineStepRole) &&
      ['cleanser', 'toner', 'serum', 'eye-care', 'moisturizer', 'sunscreen', 'lip-care'].includes(
        product.productType || ''
      )
        ? (product.productType as RoutineStepRole)
        : product.productType === 'mask' || product.productType === 'exfoliator'
        ? 'night-treatment'
        : 'serum';

    score += scoreProductForProfile(product, {
      skinType: primarySkin,
      primaryConcern,
      sensitivityLevel: options.skinProfile?.sensitivityLevel,
      currentRoutine: options.skinProfile?.currentRoutine,
      role: inferredRole,
    });

    // Role match boost
    if (intent.roles.length > 0) {
      if (intent.roles.some((r) => matchesStepRole(product, r))) {
        score += 34;
      } else if (!intent.wantsRoutine) {
        score -= 10;
      }
    }

    // Explicit specialty match boost when requested
    if (intent.wantsMakeup && (product.category === 'makeup' || product.productType === 'makeup')) {
      score += 38;
    }
    if (intent.wantsHairBody && (isBodyOrHairOnlyProduct(product) || isLashOrBrowProduct(product))) {
      score += 38;
    }

    return { product, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: Product[] = [];
  const selectedIds = new Set<string>();
  const addUnique = (p: Product) => {
    if (!selectedIds.has(p.id) && selected.length < limit) {
      selectedIds.add(p.id);
      selected.push(p);
    }
  };

  // Guarantee balanced category coverage for multi-step/routine questions
  if (!intent.wantsMakeup && !intent.wantsHairBody && intent.wantsRoutine) {
    const coreRoles: RoutineStepRole[] = [
      'cleanser',
      'toner',
      'serum',
      'moisturizer',
      'sunscreen',
      'eye-care',
      'night-treatment',
    ];
    const perRoleQuota = Math.max(2, Math.floor(limit / (coreRoles.length + 2)));
    for (const role of coreRoles) {
      let count = 0;
      for (const item of scored) {
        if (count >= perRoleQuota) break;
        if (matchesStepRole(item.product, role)) {
          if (!selectedIds.has(item.product.id)) {
            addUnique(item.product);
            count++;
          }
        }
      }
    }
  }

  for (const item of scored) {
    if (selected.length >= limit) break;
    addUnique(item.product);
  }

  return selected;
}

export function extractValidatedProductIds(
  responseText: string,
  catalog: Product[],
  maxCount = 5
): string[] {
  if (!responseText || !Array.isArray(catalog) || catalog.length === 0) return [];

  const validById = new Map<string, Product>();
  for (const p of catalog) {
    if (p?.id && isProductInStock(p)) {
      validById.set(p.id, p);
    }
  }

  const picked: string[] = [];
  const addId = (rawId: string) => {
    const clean = rawId.trim().replace(/^["']|["']$/g, '');
    if (validById.has(clean) && !picked.includes(clean) && picked.length < maxCount) {
      picked.push(clean);
    }
  };

  // Pass 1: Strict [ID: ...] tags in order of appearance
  const idTagRegex = /\[ID:\s*["']?([^"'\]]+)["']?\s*\]/gi;
  let match: RegExpExecArray | null;
  while ((match = idTagRegex.exec(responseText)) !== null) {
    addId(match[1]);
    if (picked.length >= maxCount) return picked;
  }

  if (picked.length > 0) return picked;

  // Pass 2 (Fallback only if no [ID: ...] tags were emitted): exact ID strings in text
  for (const [id] of validById.entries()) {
    if (responseText.includes(id)) {
      addId(id);
      if (picked.length >= maxCount) return picked;
    }
  }

  if (picked.length > 0) return picked;

  // Pass 3 (Last resort): exact nameFa on non-negated lines
  const lines = responseText.split(/\n+/);
  for (const line of lines) {
    if (/پرهیز|اجتناب|استفاده نکنید|مناسب نیست|ندارد|ممنوع/i.test(line)) continue;
    for (const p of validById.values()) {
      if (p.nameFa && line.includes(p.nameFa)) {
        addId(p.id);
        if (picked.length >= maxCount) return picked;
      }
    }
  }

  return picked;
}

export function buildAdvisorFallbackReply(
  products: Product[],
  options: { query: string; skinProfile?: Partial<UserSkinProfile> | null }
): { reply: string; suggestedProductIds: string[] } {
  const intent = parseAdvisorIntent(options.query, options.skinProfile);
  const skinType: SkinType =
    intent.skinTypes[0] || options.skinProfile?.skinType || 'combination';
  const primaryConcern: SkinConcern =
    intent.concerns[0] || options.skinProfile?.primaryConcern || 'hydration';

  const relevant = selectRelevantAdvisorProducts(products, {
    query: options.query,
    skinProfile: options.skinProfile,
    limit: 12,
  });

  if (relevant.length === 0) {
    return {
      reply:
        'در حال حاضر دسترسی به کاتالوگ محصولات برقرار نشد. لطفاً صفحه را تازه‌سازی کنید یا کمی بعد مجدداً تلاش فرمایید.',
      suggestedProductIds: [],
    };
  }

  // If user asked for a specialty category (makeup/hair-body) or a single specific role
  if (intent.wantsMakeup || intent.wantsHairBody) {
    const topPicks = relevant.slice(0, 3);
    const lines = topPicks.map(
      (p, idx) =>
        `**${idx + 1}. ${p.nameFa}**${p.brand ? ` (${p.brand})` : ''} — قیمت: ${(p.price || 0).toLocaleString('fa-IR')} تومان [ID: ${p.id}]`
    );
    return {
      reply: `بر اساس درخواست شما، محصولات موجود و پرفروش زیر را از فروشگاه ورا بیوتی پیشنهاد می‌کنم:\n\n${lines.join('\n')}`,
      suggestedProductIds: topPicks.map((p) => p.id),
    };
  }

  // Build coherent non-repeating facial routine picks
  const { morningSteps, nightSteps } = buildPersonalizedRoutine({
    style: 'balanced',
    skinType,
    primaryConcern,
    sensitivityLevel: options.skinProfile?.sensitivityLevel || (skinType === 'sensitive' ? 'high' : 'medium'),
    currentRoutine: options.skinProfile?.currentRoutine || 'basic',
    products,
  });

  const skinLabel = SKIN_TYPE_LABELS_FA[skinType] || 'مختلط';
  const concernLabel = CONCERN_LABELS_FA[primaryConcern] || 'مراقبت روزانه';

  // Pick up to 4 distinct core products (prefer requested roles first if user asked about specific steps)
  const candidates: Array<{ roleLabel: string; product: Product }> = [];
  const seenIds = new Set<string>();

  if (intent.roles.length > 0 && !intent.wantsRoutine) {
    for (const p of relevant) {
      if (candidates.length >= 3) break;
      if (!seenIds.has(p.id) && intent.roles.some((r) => matchesStepRole(p, r))) {
        seenIds.add(p.id);
        candidates.push({ roleLabel: p.productType || 'پیشنهاد تخصصی', product: p });
      }
    }
  }

  for (const step of [...morningSteps, ...nightSteps]) {
    if (candidates.length >= 4) break;
    if (step.product && !seenIds.has(step.product.id)) {
      seenIds.add(step.product.id);
      candidates.push({ roleLabel: step.stepTitleFa.replace(/^\d+\.\s*/, ''), product: step.product });
    }
  }

  if (candidates.length === 0) {
    for (const p of relevant.slice(0, 3)) {
      if (!seenIds.has(p.id)) {
        seenIds.add(p.id);
        candidates.push({ roleLabel: 'پیشنهاد فروشگاه', product: p });
      }
    }
  }

  const bulletLines = candidates.map(
    ({ roleLabel, product }, i) =>
      `**${i + 1}. ${roleLabel}:** ${product.nameFa}${product.brand ? ` (${product.brand})` : ''} [ID: ${product.id}]`
  );

  const reply = `برای پوست **${skinLabel}** با تمرکز بر **${concernLabel}**، محصولات اورجینال و موجود زیر در فروشگاه ورا بیوتی بهترین هماهنگی را با نیاز شما دارند:\n\n${bulletLines.join('\n')}\n\nاگر درباره تداخل ترکیبات، ترتیب مصرف یا جایگزین هر مرحله سوالی دارید، با کمال میل راهنمایی می‌کنم.`;

  return {
    reply,
    suggestedProductIds: candidates.map((c) => c.product.id),
  };
}
