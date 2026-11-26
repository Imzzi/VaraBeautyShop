import {
  Product,
  QuizQuestion,
  RoutineStepRecommendation,
  SkinConcern,
  SkinType,
  UserSkinProfile,
} from '../types';
import {
  buildPersonalizedRoutine,
  isFacialSkincareProduct,
  isProductInStock,
  RoutineStepRole,
} from '../lib/routineEngine';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    titleFa: 'پوستت معمولاً در طول روز چه حسی داره؟',
    subtitleFa: 'تشخیص نوع پوست برای انتخاب بافت و پایه‌ی محصولات روتین شما',
    options: [
      {
        labelFa: 'خشک و کشیده (بدون چربی، نیازمند آبرسانی فوری)',
        subtitleFa: 'نیازمند روتین سرشار از مرطوب‌کننده غنی، سرامید و تقویت سد دفاعی',
        value: 'dry',
        iconName: 'Droplets',
      },
      {
        labelFa: 'مختلط (ناحیه T چرب، گونه‌ها خشک یا معمولی)',
        subtitleFa: 'نیازمند روتین متعادل‌کننده برای کنترل چربی و آبرسانی همزمان',
        value: 'combination',
        iconName: 'CheckCircle2',
      },
      {
        labelFa: 'چرب و براق با منافذ قابل مشاهده',
        subtitleFa: 'نیازمند روتین با بافت‌های فلوئیدی سبک، ژل‌کرم و کنترل سبوم',
        value: 'oily',
        iconName: 'Zap',
      },
      {
        labelFa: 'حساس، تحریک‌پذیر و مستعد قرمزی',
        subtitleFa: 'نیازمند روتین التیام‌بخش با فرمول‌های آرامش‌بخش، ضدالتهاب و ملایم',
        value: 'sensitive',
        iconName: 'Heart',
      },
      {
        labelFa: 'معمولی، راحت و بدون چربی یا خشکی مفرط',
        subtitleFa: 'نیازمند روتین مراقبت پیشگیرانه جهت حفظ طراوت، درخشش و سد پوستی',
        value: 'normal',
        iconName: 'Smile',
      },
    ],
  },
  {
    id: 2,
    titleFa: 'اصلی‌ترین هدف و اولویتت از این روتین چیه؟',
    subtitleFa: 'انتخاب سرم‌های درمانی و ترکیبات فعال متناسب با نیاز پوست شما',
    options: [
      {
        labelFa: 'آبرسانی عمیق و رفع خشکی و خطوط ناشی از کم‌آبی',
        subtitleFa: 'روتین آبرسانی و تقویت رطوبت با هیالورونیک اسید، پانتنول و سرامید',
        value: 'hydration',
        iconName: 'Droplets',
      },
      {
        labelFa: 'شفافیت، درخشش چهره و رفع لک و تیرگی',
        subtitleFa: 'روتین روشن‌کننده و ضدلک با ویتامین C، نیاسینامید و آربوتین',
        value: 'brightening',
        iconName: 'Sun',
      },
      {
        labelFa: 'جوانسازی، لیفتینگ و کاهش چین و چروک',
        subtitleFa: 'روتین ضدپیری و سفت‌کننده با پپتیدها، رتینول ملایم و کلاژن',
        value: 'anti-aging',
        iconName: 'Award',
      },
      {
        labelFa: 'کنترل چربی، کاهش جوش و پاکسازی منافذ',
        subtitleFa: 'روتین ضدجوش و تنظیم سبوم با نیاسینامید، سالیسیلیک اسید و سنتلا',
        value: 'acne-blemish',
        iconName: 'ShieldAlert',
      },
      {
        labelFa: 'ترمیم سد دفاعی آسیب‌دیده و التیام قرمزی و سوزش',
        subtitleFa: 'روتین بازسازی‌کننده سد پوستی با سرامید، سیکا و پانتنول',
        value: 'barrier-repair',
        iconName: 'ShieldCheck',
      },
    ],
  },
  {
    id: 3,
    titleFa: 'چه سبک روتینی برای زمان و لایف‌استایل شما مناسب‌تر است؟',
    subtitleFa: 'تعیین تعداد مراحل روتین متناسب با عادت روزانه شما',
    options: [
      {
        labelFa: 'روتین سریع و مینیمال (۳ مرحله‌ای در کمتر از ۳ دقیقه)',
        subtitleFa: 'شوینده ملایم + مرطوب‌کننده + ضدآفتاب در صبح / سرم درمانی در شب',
        value: 'minimal',
        iconName: 'Feather',
      },
      {
        labelFa: 'روتین استاندارد و متمرکز (۴ مرحله‌ای هدفمند)',
        subtitleFa: 'شوینده + سرم/درمان هدفمند + مرطوب‌کننده + محافظ روزانه یا تونر شب',
        value: 'balanced',
        iconName: 'CheckCircle2',
      },
      {
        labelFa: 'روتین کامل و حرفه‌ای شب و روز (۶ مرحله‌ای تخصصی)',
        subtitleFa: 'شوینده، تونر، سرم یا درمان شب، کرم دور چشم، مرطوب‌کننده، ضدآفتاب و بالم لب',
        value: 'complete',
        iconName: 'Layers',
      },
    ],
  },
  {
    id: 4,
    titleFa: 'در حال حاضر چه محصولاتی در روتین روزانه‌تان استفاده می‌کنید؟',
    subtitleFa: 'شناخت عادت فعلی برای ساخت روتینی هماهنگ و بدون تداخل',
    options: [
      {
        labelFa: 'هیچ روتین منظمی ندارم، می‌خوام از پایه شروع کنم',
        subtitleFa: 'پیشنهاد یک روتین هماهنگ، ملایم و اصولی بدون اکتیوهای تهاجمی',
        value: 'none',
        iconName: 'RefreshCw',
      },
      {
        labelFa: 'فقط شوینده و یک مرطوب‌کننده ساده دارم',
        subtitleFa: 'ارتقای روتین با اضافه کردن سرم درمانی هدفمند و ضدآفتاب مناسب',
        value: 'basic',
        iconName: 'Droplets',
      },
      {
        labelFa: 'از روتین چندمرحله‌ای استفاده می‌کنم اما به دنبال نتایج بهتر هستم',
        subtitleFa: 'چیدمان تخصصی با سرم‌ها و درمان‌های هدفمند و مؤثرتر',
        value: 'experienced',
        iconName: 'Layers',
      },
    ],
  },
  {
    id: 5,
    titleFa: 'پوستت چقدر به ترکیبات و محصولات جدید حساسیت نشون میده؟',
    subtitleFa: 'انتخاب ایمن‌ترین فرمولاسیون برای حفظ سلامت کامل پوست',
    options: [
      {
        labelFa: 'خیلی حساس و واکنش‌پذیر',
        subtitleFa: 'سریع قرمز یا ملتهب می‌شود؛ نیازمند فرمول‌های ملایم، التیام‌بخش و فاقد اسید قوی',
        value: 'high',
        iconName: 'ShieldAlert',
      },
      {
        labelFa: 'حساسیت متوسط یا مقطعی',
        subtitleFa: 'گاهی نسبت به تغییر فصل یا ترکیبات قوی واکنش نشان می‌دهد',
        value: 'medium',
        iconName: 'ShieldCheck',
      },
      {
        labelFa: 'مقاوم و با تحمل بالا',
        subtitleFa: 'به‌خوبی انواع سرم‌های فعال، رتینول و لایه‌بردارهای ملایم را تحمل می‌کند',
        value: 'low',
        iconName: 'CheckCircle2',
      },
    ],
  },
];

export function buildRoutineStepsByStyle(
  style: 'minimal' | 'balanced' | 'complete',
  primaryConcern: SkinConcern,
  skinType: SkinType,
  products: Product[],
  options?: {
    sensitivityLevel?: string;
    currentRoutine?: string;
    preferredOverrides?: Record<string, string>;
  }
): { morningSteps: RoutineStepRecommendation[]; nightSteps: RoutineStepRecommendation[] } {
  return buildPersonalizedRoutine({
    style,
    primaryConcern,
    skinType,
    sensitivityLevel: options?.sensitivityLevel,
    currentRoutine: options?.currentRoutine,
    products,
    preferredOverrides: options?.preferredOverrides,
  });
}

/**
 * Checks whether a cached localStorage skin profile has missing, out-of-stock,
 * non-facial (body/makeup/lash-serum), or cross-role duplicated product IDs.
 */
export function isSkinProfileStaleOrInvalid(
  profile: UserSkinProfile | null | undefined,
  products: Product[]
): boolean {
  if (!profile) return false;
  if (!Array.isArray(products) || products.length === 0) return false;

  const allSteps = [...(profile.morningSteps || []), ...(profile.nightSteps || [])];
  if (allSteps.length === 0) return true;

  const byId = new Map(products.map((p) => [p.id, p]));
  const productRoles = new Map<string, Set<string>>();

  for (const step of allSteps) {
    const prod = byId.get(step.productId);
    if (!prod || !isProductInStock(prod)) return true;

    const inferredRole = (step.role || inferRoleFromStepTitle(step.stepTitleEn, step.stepTitleFa)) as RoutineStepRole;
    if (inferredRole !== 'lip-care' && !isFacialSkincareProduct(prod)) {
      return true;
    }

    if (!productRoles.has(step.productId)) {
      productRoles.set(step.productId, new Set());
    }
    productRoles.get(step.productId)!.add(inferredRole);
  }

  // Flag legacy broken profiles where the exact same product was duplicated across different roles
  for (const rolesSet of productRoles.values()) {
    if (rolesSet.size > 1) return true;
  }

  return false;
}

function inferRoleFromStepTitle(titleEn?: string, titleFa?: string): string {
  const txt = `${titleEn || ''} ${titleFa || ''}`.toLowerCase();
  if (/cleans|شوینده|پاکسازی/.test(txt)) return 'cleanser';
  if (/toner|تونر/.test(txt)) return 'toner';
  if (/sunscreen|spf|ضدآفتاب|ضد آفتاب/.test(txt)) return 'sunscreen';
  if (/eye|دور چشم/.test(txt)) return 'eye-care';
  if (/lip|بالم.*لب|لب/.test(txt)) return 'lip-care';
  if (/moistur|barrier.*cream|مرطوب|آبرسان و محافظ/.test(txt)) return 'moisturizer';
  if (/mask|night.*treatment|بازسازی.*شب/.test(txt)) return 'night-treatment';
  if (/serum|elixir|سرم/.test(txt)) return 'serum';
  return txt.slice(0, 24);
}

/**
 * Computes a personalized UserSkinProfile based on quiz answers and live product catalog.
 */
export function generateSkinProfile(
  answers: { [key: number]: string },
  products: Product[]
): UserSkinProfile {
  const rawSkinType = answers[1] || 'combination';
  const rawConcern = answers[2] || 'hydration';
  const routineStyleRaw = answers[3] || 'balanced';
  const currentRoutine = answers[4] || 'basic';
  const sensitivity = answers[5] || 'medium';

  const skinType: SkinType = (
    ['dry', 'oily', 'combination', 'sensitive', 'normal'].includes(rawSkinType)
      ? rawSkinType
      : 'combination'
  ) as SkinType;

  const primaryConcern: SkinConcern = (rawConcern as SkinConcern) || 'hydration';

  const routineStyle: 'minimal' | 'balanced' | 'complete' =
    routineStyleRaw === 'minimal' || routineStyleRaw === 'complete'
      ? routineStyleRaw
      : 'balanced';

  const skinTypeLabelsFa: Record<SkinType, string> = {
    dry: 'خشک',
    oily: 'چرب',
    combination: 'مختلط',
    sensitive: 'حساس',
    normal: 'نرمال',
  };

  const concernLabelsFa: Record<string, string> = {
    hydration: 'آبرسانی عمیق و رفع کم‌آبی',
    brightening: 'شفاف‌کننده و ضدلک',
    'anti-aging': 'جوانساز و ضدچروک',
    'acne-blemish': 'ضدجوش و کنترل چربی',
    'barrier-repair': 'ترمیم سد دفاعی و التیام',
  };

  const styleLabelsFa: Record<string, string> = {
    minimal: 'روتین سریع ۳ مرحله‌ای',
    balanced: 'روتین استاندارد ۴ مرحله‌ای',
    complete: 'روتین تخصصی و کامل شب و روز',
  };

  const skinTypeLabelsEn: Record<SkinType, string> = {
    dry: 'Dry',
    oily: 'Oily',
    combination: 'Combination',
    sensitive: 'Sensitive',
    normal: 'Normal',
  };

  const concernLabelsEn: Record<string, string> = {
    hydration: 'Deep Hydration',
    brightening: 'Radiance & Dark Spots',
    'anti-aging': 'Youth & Firming',
    'acne-blemish': 'Blemish & Pore Control',
    'barrier-repair': 'Barrier Recovery',
  };

  const routineGoalTitleFa = `روتین تخصصی ${concernLabelsFa[rawConcern] || 'آبرسانی'} (ویژه پوست ${skinTypeLabelsFa[skinType]})`;
  const summaryLabelFa = `پوست ${skinTypeLabelsFa[skinType]} · هدف: ${concernLabelsFa[rawConcern] || 'آبرسانی'} · ${styleLabelsFa[routineStyle]}`;
  const summaryLabelEn = `${skinTypeLabelsEn[skinType]} Skin · Focus: ${concernLabelsEn[rawConcern] || 'Hydration'} · ${routineStyle.toUpperCase()} Routine`;

  const usageTipsFa = [
    'همیشه ترتیب اعمال محصولات را بر اساس غلظت بافت رعایت کنید: از رقیق‌ترین (تونر/سرم) به غلیظ‌ترین (کرم مرطوب‌کننده).',
    'ضدآفتاب را در آخرین مرحله روتین صبحگاه، ۲۰ دقیقه قبل از خروج از منزل به اندازه دو بند انگشت روی صورت و گردن بزنید.',
    'بین مصرف سرم و کرم مرطوب‌کننده ۱ الی ۲ دقیقه فاصله بگذارید تا ترکیبات فعال به خوبی جذب شوند.',
    ...(sensitivity === 'high' || skinType === 'sensitive'
      ? [
          'به دلیل حساسیت بالای پوست، هر محصول جدید را ابتدا ۲۴ ساعت روی بخش کوچکی از خط فک یا پشت گوش تست کنید و از معرفی هم‌زمان چند اکتیو جدید پرهیز نمایید.',
        ]
      : [
          'محصولات حاوی رتینول یا اسیدهای لایه‌بردار را فقط در روتین شبانه و با تعداد دفعات تدریجی (۲ تا ۳ شب در هفته) شروع کنید.',
        ]),
  ];

  const { morningSteps, nightSteps } = buildRoutineStepsByStyle(
    routineStyle,
    primaryConcern,
    skinType,
    products,
    { sensitivityLevel: sensitivity, currentRoutine }
  );

  const recommendedProductIds = Array.from(
    new Set([
      ...morningSteps.map((s) => s.productId),
      ...nightSteps.map((s) => s.productId),
    ])
  );

  return {
    skinType,
    primaryConcern,
    ageGroup: 'all',
    sensitivityLevel: sensitivity,
    currentRoutine,
    routineStyle,
    routineGoalTitleFa,
    usageTipsFa,
    summaryLabelEn,
    summaryLabelFa,
    morningSteps,
    nightSteps,
    recommendedProductIds,
    createdAt: new Date().toISOString(),
  };
}

const STORAGE_KEY = 'vara_user_skin_profile';

export function getSavedSkinProfile(): UserSkinProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserSkinProfile;
  } catch {
    return null;
  }
}

export function saveSkinProfile(profile: UserSkinProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(
      new CustomEvent('vara-skin-profile-updated', { detail: profile })
    );
  } catch (err) {
    console.error('Failed to save skin profile', err);
  }
}
