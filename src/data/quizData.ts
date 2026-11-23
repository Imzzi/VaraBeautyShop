import { QuizQuestion, UserSkinProfile, RoutineStepRecommendation, Product, SkinType, SkinConcern } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    titleFa: 'پوستت معمولاً در طول روز چه حسی داره؟',
    subtitleFa: 'تشخیص نوع پوست برای انتخاب بافت و پایه‌ی محصولات روتین شما',
    options: [
      {
        labelFa: 'خشک و کشیده (بدون چربی، نیازمند آبرسانی فوری)',
        subtitleFa: 'نیازمند روتین سرشار از مرطوب‌کننده غنی، کرم مغذی و سد دفاعی قوی',
        value: 'dry',
        iconName: 'Droplets'
      },
      {
        labelFa: 'مختلط (ناحیه T چرب، گونه‌ها خشک یا معمولی)',
        subtitleFa: 'نیازمند روتین هوشمند متعادل‌کننده برای کنترل چربی و آبرسانی همزمان',
        value: 'combination',
        iconName: 'Sparkles'
      },
      {
        labelFa: 'چرب و براق با منافذ قابل مشاهده',
        subtitleFa: 'نیازمند روتین با بافت‌های فلوئیدی سبک، ژل‌کرم و کنترل سبوم',
        value: 'oily',
        iconName: 'Zap'
      },
      {
        labelFa: 'حساس، تحریک‌پذیر و مستعد قرمزی',
        subtitleFa: 'نیازمند روتین التیام‌بخش با فرمول‌های آرامش‌بخش، ضدالتهاب و بدون عطر',
        value: 'sensitive',
        iconName: 'Heart'
      },
      {
        labelFa: 'معمولی، راحت و بدون چربی یا خشکی مفرط',
        subtitleFa: 'نیازمند روتین مراقبت پیشگیرانه جهت حفظ طراوت، درخشش و سد پوستی',
        value: 'normal',
        iconName: 'Smile'
      }
    ]
  },
  {
    id: 2,
    titleFa: 'اصلی‌ترین هدف و اولویتت از این روتین چیه؟',
    subtitleFa: 'انتخاب سرم‌های درمانی و ترکیبات فعال اصلی متناسب با نیاز پوست شما',
    options: [
      {
        labelFa: 'آبرسانی عمیق و رفع خشکی و خطوط ناشی از کم‌آبی',
        subtitleFa: 'روتین آبرسانی ۷۲ ساعته با هیالورونیک اسید گیاهی و شیره کاکتوس',
        value: 'hydration',
        iconName: 'Droplets'
      },
      {
        labelFa: 'شفافیت، درخشش چهره و رفع لک و تیرگی',
        subtitleFa: 'روتین روشن‌کننده با آنتی‌اکسیدان‌های گل لادن و ویتامین‌های گیاهی',
        value: 'brightening',
        iconName: 'Sun'
      },
      {
        labelFa: 'جوانسازی، لیفتینگ و کاهش چین و چروک',
        subtitleFa: 'روتین ضدپیری با پپتیدهای کلاژن‌ساز و اکسیر آرگان و لایلاک',
        value: 'anti-aging',
        iconName: 'Award'
      },
      {
        labelFa: 'کنترل چربی، کاهش جوش و پاکسازی منافذ',
        subtitleFa: 'روتین ضدجوش با خاک رس سفید، چای سبز و اسید لاکتیک نیشکر',
        value: 'acne-blemish',
        iconName: 'ShieldAlert'
      },
      {
        labelFa: 'ترمیم سد دفاعی آسیب‌دیده و التیام قرمزی و سوزش',
        subtitleFa: 'روتین تقویت‌کننده سد لیپیدی با بابونه، گل یاس و موم گیاهی',
        value: 'barrier-repair',
        iconName: 'ShieldCheck'
      }
    ]
  },
  {
    id: 3,
    titleFa: 'چه سبک روتینی برای زمان و لایف‌استایل شما مناسب‌تر است؟',
    subtitleFa: 'تعیین تعداد مراحل روتین متناسب با عادت روزانه شما',
    options: [
      {
        labelFa: 'روتین سریع و مینیمال (۳ مرحله‌ای در کمتر از ۳ دقیقه)',
        subtitleFa: 'شوینده ملایم + آبرسان سبک + ضدآفتاب در صبح / بالم مغذی در شب',
        value: 'minimal',
        iconName: 'Feather'
      },
      {
        labelFa: 'روتین استاندارد و متمرکز (۴ مرحله‌ای هدفمند)',
        subtitleFa: 'شوینده + سرم درمان هدفمند + مرطوب‌کننده سد دفاعی + محافظ روزانه',
        value: 'balanced',
        iconName: 'Sparkles'
      },
      {
        labelFa: 'روتین کامل و حرفه‌ای شب و روز (۵ الی ۶ مرحله‌ای تخصصی)',
        subtitleFa: 'شوینده، تونر آرامش‌بخش، سرم فعال، کرم دور چشم، مرطوب‌کننده و ماسک شب',
        value: 'complete',
        iconName: 'Layers'
      }
    ]
  },
  {
    id: 4,
    titleFa: 'در حال حاضر چه محصولاتی در روتین روزانه‌تان استفاده می‌کنید؟',
    subtitleFa: 'شناخت عادت فعلی برای ساخت روتینی هماهنگ و بدون تداخل',
    options: [
      {
        labelFa: 'هیچ روتین منظمی ندارم، می‌خوام از پایه شروع کنم',
        subtitleFa: 'پیشنهاد یک روتین هماهنگ و اصولی از شوینده تا مرطوب‌کننده',
        value: 'none',
        iconName: 'RefreshCw'
      },
      {
        labelFa: 'فقط شوینده و یک مرطوب‌کننده ساده دارم',
        subtitleFa: 'ارتقای روتین با اضافه کردن سرم درمانی هدفمند و ضدآفتاب مینرال',
        value: 'basic',
        iconName: 'Droplets'
      },
      {
        labelFa: 'از روتین چندمرحله‌ای استفاده می‌کنم اما به دنبال نتایج بهتر هستم',
        subtitleFa: 'جایگزینی فرمولاسیون‌های گیاهی خالص و تخصصی با اثرگذاری بالاتر',
        value: 'experienced',
        iconName: 'Layers'
      }
    ]
  },
  {
    id: 5,
    titleFa: 'پوستت چقدر به ترکیبات و محصولات جدید حساسیت نشون میده؟',
    subtitleFa: 'انتخاب ایمن‌ترین فرمولاسیون برای حفظ سلامت کامل پوست',
    options: [
      {
        labelFa: 'خیلی حساس و واکنش‌پذیر',
        subtitleFa: 'سریع قرمز یا ملتهب می‌شود؛ نیازمند محصولات هایپوآلرژنیک و فوق‌العاده تسکین‌دهنده',
        value: 'high',
        iconName: 'ShieldAlert'
      },
      {
        labelFa: 'حساسیت متوسط یا مقطعی',
        subtitleFa: 'گاهی نسبت به تغییر فصل یا اسانس‌ها واکنش نشان می‌دهد',
        value: 'medium',
        iconName: 'ShieldCheck'
      },
      {
        labelFa: 'مقاوم و با تحمل بالا',
        subtitleFa: 'به‌خوبی انواع عصاره‌ها، سرم‌های فعال و اسیدهای گیاهی را جذب می‌کند',
        value: 'low',
        iconName: 'CheckCircle2'
      }
    ]
  }
];

export function buildRoutineStepsByStyle(
  style: 'minimal' | 'balanced' | 'complete',
  primaryConcern: SkinConcern,
  skinType: SkinType,
  products: Product[]
): { morningSteps: RoutineStepRecommendation[]; nightSteps: RoutineStepRecommendation[] } {
  // Find available catalog products with safe fallbacks
  const cleanser = products.find(p => p.id === 'product-8') || products[0];
  const toner = products.find(p => p.id === 'product-3') || products[0];
  const youthElixir = products.find(p => p.id === 'product-1') || products[0];
  const radianceOil = products.find(p => p.id === 'product-2') || products[0];
  const moisturizer = products.find(p => p.id === 'product-4') || products[0];
  const sleepingMask = products.find(p => p.id === 'product-5') || products[0];
  const lipBalm = products.find(p => p.id === 'product-6') || products[0];
  const eyeSerum = products.find(p => p.id === 'product-7') || products[0];
  const sunscreen = products.find(p => p.id === 'product-9') || products[0];

  // Select target serum based on primary concern
  const targetSerum = primaryConcern === 'brightening' 
    ? radianceOil 
    : youthElixir;

  const targetSerumReasonFa = primaryConcern === 'brightening'
    ? 'سرم آنتی‌اکسیدان گل لادن و جوجوبا برای روشن‌کنندگی ملایم و یکدست‌سازی رنگ پوست'
    : primaryConcern === 'anti-aging'
    ? 'اکسیر لایلاک و آرگان با پپتیدهای گیاهی برای افزایش کلاژن‌سازی و رفع خطوط اولیه'
    : primaryConcern === 'acne-blemish'
    ? 'سرم تنظیمی حاوی ترکیبات سبک برای پاکسازی منافذ و تعدیل ترشح چربی پوست'
    : 'سرم تغذیه‌کننده عمیق با هیالورونیک اسید گیاهی جهت هیدراتاسیون ماندگار سلولی';

  let morningSteps: RoutineStepRecommendation[] = [];
  let nightSteps: RoutineStepRecommendation[] = [];

  if (style === 'minimal') {
    // 3-step rapid routine
    morningSteps = [
      {
        stepNumber: 1,
        stepTitleFa: '۱. پاکسازی ملایم با شوینده گیاهی',
        stepTitleEn: '1. Gentle Cleansing',
        timeOfDay: 'morning',
        productId: cleanser.id,
        product: cleanser,
        reasonFa: 'شستشوی پوست بدون صابون و سولفات برای آماده‌سازی پوست و پاک‌کردن چربی‌های شبانه.'
      },
      {
        stepNumber: 2,
        stepTitleFa: '۲. آبرسانی و تقویت سد دفاعی',
        stepTitleEn: '2. Barrier Hydration',
        timeOfDay: 'morning',
        productId: moisturizer.id,
        product: moisturizer,
        reasonFa: 'کرم شیره کاکتوس و نیلوفر آبی برای قفل کردن رطوبت در طول روز و محافظت از دهیدراتگی.'
      },
      {
        stepNumber: 3,
        stepTitleFa: '۳. محافظت روزانه (ضدآفتاب مینرال)',
        stepTitleEn: '3. Daily SPF Protection',
        timeOfDay: 'morning',
        productId: sunscreen.id,
        product: sunscreen,
        reasonFa: 'فلوئید ضدآفتاب سبک زینک و چای سفید برای محافظت کامل از پرتوهای مضر UV و نور آبی.'
      }
    ];

    nightSteps = [
      {
        stepNumber: 1,
        stepTitleFa: '۱. پاکسازی پوست از آلودگی روزمره',
        stepTitleEn: '1. Night Cleansing',
        timeOfDay: 'night',
        productId: cleanser.id,
        product: cleanser,
        reasonFa: 'پاکسازی عمیق پوست از آلودگی‌های محیطی و گردوغبار روز با پایه خاک رس سفید و چای سبز.'
      },
      {
        stepNumber: 2,
        stepTitleFa: '۲. سرم بازسازی و درمان هدفمند شبانه',
        stepTitleEn: '2. Overnight Target Serum',
        timeOfDay: 'night',
        productId: targetSerum.id,
        product: targetSerum,
        reasonFa: targetSerumReasonFa
      },
      {
        stepNumber: 3,
        stepTitleFa: '۳. بالم بازسازی و تغذیه لب‌ها',
        stepTitleEn: '3. Restorative Night Balm',
        timeOfDay: 'night',
        productId: lipBalm.id,
        product: lipBalm,
        reasonFa: 'بالم گل سرخ و موم عسل طبیعی برای التیام و رفع پوسته‌پوسته شدن لب‌ها در طول خواب.'
      }
    ];
  } else if (style === 'balanced') {
    // 4-step balanced clinical routine
    morningSteps = [
      {
        stepNumber: 1,
        stepTitleFa: '۱. شوینده گیاهی ملایم',
        stepTitleEn: '1. Gentle Botanical Cleanser',
        timeOfDay: 'morning',
        productId: cleanser.id,
        product: cleanser,
        reasonFa: 'پاکسازی منافذ با خاک رس سفید بدون از بین بردن چربی‌های محافظ طبیعی پوست.'
      },
      {
        stepNumber: 2,
        stepTitleFa: '۲. سرم درمانی و اکتیو هدفمند',
        stepTitleEn: '2. Targeted Active Serum',
        timeOfDay: 'morning',
        productId: targetSerum.id,
        product: targetSerum,
        reasonFa: targetSerumReasonFa
      },
      {
        stepNumber: 3,
        stepTitleFa: '۳. کرم آبرسان و مرطوب‌کننده سد دفاعی',
        stepTitleEn: '3. Barrier Moisture Lock Cream',
        timeOfDay: 'morning',
        productId: moisturizer.id,
        product: moisturizer,
        reasonFa: 'آبرسانی عمیق با شیره کاکتوس و نیلوفر آبی برای قفل رطوبت و افزایش انعطاف‌پذیری پوست.'
      },
      {
        stepNumber: 4,
        stepTitleFa: '۴. فلوئید ضدآفتاب مینرال SPF 50+',
        stepTitleEn: '4. Mineral SPF 50+ Protection',
        timeOfDay: 'morning',
        productId: sunscreen.id,
        product: sunscreen,
        reasonFa: 'سپر فیزیکی زینک و چای سفید برای محافظت کامل در برابر آفتاب بدون ایجاد حس چربی و سفیدی.'
      }
    ];

    nightSteps = [
      {
        stepNumber: 1,
        stepTitleFa: '۱. پاکسازی پوست با شوینده ملایم',
        stepTitleEn: '1. Night Cleanser',
        timeOfDay: 'night',
        productId: cleanser.id,
        product: cleanser,
        reasonFa: 'پاکسازی چربی اضافه و آلودگی‌های انباشته شده روز با حفظ لطافت طبیعی.'
      },
      {
        stepNumber: 2,
        stepTitleFa: '۲. تونر آرامش‌بخش و تنظیم pH',
        stepTitleEn: '2. Soothing Balance Toner',
        timeOfDay: 'night',
        productId: toner.id,
        product: toner,
        reasonFa: 'تونر یاس و بابونه جهت تعادل اسیدیته طبیعی پوست و آماده‌سازی برای جذب حداکثری سرم.'
      },
      {
        stepNumber: 3,
        stepTitleFa: '۳. سرم احیاکننده و درمان تخصصی شبانه',
        stepTitleEn: '3. Target Active Night Serum',
        timeOfDay: 'night',
        productId: targetSerum.id,
        product: targetSerum,
        reasonFa: targetSerumReasonFa
      },
      {
        stepNumber: 4,
        stepTitleFa: '۴. ماسک خواب احیاکننده با اسید لاکتیک',
        stepTitleEn: '4. Overnight Renewal Mask',
        timeOfDay: 'night',
        productId: sleepingMask.id,
        product: sleepingMask,
        reasonFa: 'لایه‌برداری بسیار ملایم و بازسازی سلولی در خواب شبانه برای پوستی درخشان در صبحگاه.'
      }
    ];
  } else {
    // 6-step complete luxury routine
    morningSteps = [
      {
        stepNumber: 1,
        stepTitleFa: '۱. ژل شوینده ملایم خاک رس و چای سبز',
        stepTitleEn: '1. Gentle Botanical Cleanser',
        timeOfDay: 'morning',
        productId: cleanser.id,
        product: cleanser,
        reasonFa: 'پاکسازی سبک پوست از ترشحات چربی شبانه با حفظ فلور میکروبی مفید پوست.'
      },
      {
        stepNumber: 2,
        stepTitleFa: '۲. تونر التیام‌بخش گل یاس و بابونه',
        stepTitleEn: '2. Balancing Jasmine Toner',
        timeOfDay: 'morning',
        productId: toner.id,
        product: toner,
        reasonFa: 'آرامش‌بخشی به بافت پوست، انقباض منافذ و آبرسانی مقدماتی فوری.'
      },
      {
        stepNumber: 3,
        stepTitleFa: '۳. سرم درمانی و اکتیو متمرکز',
        stepTitleEn: '3. Youth & Target Treatment Serum',
        timeOfDay: 'morning',
        productId: targetSerum.id,
        product: targetSerum,
        reasonFa: targetSerumReasonFa
      },
      {
        stepNumber: 4,
        stepTitleFa: '۴. سرم دور چشم کافئین و پپتید',
        stepTitleEn: '4. Peptide Eye Contour Serum',
        timeOfDay: 'morning',
        productId: eyeSerum.id,
        product: eyeSerum,
        reasonFa: 'کاهش پف صبحگاهی، رفع تیرگی دور چشم و جلوگیری از خطوط پنجه‌کلاغی.'
      },
      {
        stepNumber: 5,
        stepTitleFa: '۵. کرم آبرسان و مرطوب‌کننده سد پوستی',
        stepTitleEn: '5. Barrier Lock Moisturizer',
        timeOfDay: 'morning',
        productId: moisturizer.id,
        product: moisturizer,
        reasonFa: 'تقویت لایه لیپیدی پوست و ایجاد لایه محافظ مخملی در برابر آلودگی هوا.'
      },
      {
        stepNumber: 6,
        stepTitleFa: '۶. فلوئید ضدآفتاب مینرال SPF 50+',
        stepTitleEn: '6. Mineral Sunscreen Shield',
        timeOfDay: 'morning',
        productId: sunscreen.id,
        product: sunscreen,
        reasonFa: 'محافظت قطعی در برابر اشعه‌های UVA/UVB و پرتوهای آبی وسایل دیجیتال.'
      }
    ];

    nightSteps = [
      {
        stepNumber: 1,
        stepTitleFa: '۱. پاکسازی عمیق شبانه',
        stepTitleEn: '1. Deep Night Cleansing',
        timeOfDay: 'night',
        productId: cleanser.id,
        product: cleanser,
        reasonFa: 'زدودن ذرات معلق، چربی اکسیدشده و باقی‌مانده ضدآفتاب از تمام منافذ صورت.'
      },
      {
        stepNumber: 2,
        stepTitleFa: '۲. تونر تسکین‌دهنده و آماده‌ساز',
        stepTitleEn: '2. Soothing Balance Toner',
        timeOfDay: 'night',
        productId: toner.id,
        product: toner,
        reasonFa: 'بازگرداندن تعادل هیدرولیپیدی پوست و تسکین التهابات ناشی از تنش‌های روزانه.'
      },
      {
        stepNumber: 3,
        stepTitleFa: '۳. سرم بازسازی عمقی و درمان اختصاصی',
        stepTitleEn: '3. Intensive Night Elixir',
        timeOfDay: 'night',
        productId: targetSerum.id,
        product: targetSerum,
        reasonFa: targetSerumReasonFa
      },
      {
        stepNumber: 4,
        stepTitleFa: '۴. سرم مراقبت دور چشم قهوه سبز',
        stepTitleEn: '4. Green Coffee Eye Repair',
        timeOfDay: 'night',
        productId: eyeSerum.id,
        product: eyeSerum,
        reasonFa: 'تغذیه بافت نازک اطراف چشم در زمان اوج تکثیر و بازسازی سلولی در خواب.'
      },
      {
        stepNumber: 5,
        stepTitleFa: '۵. ماسک خواب احیاکننده با اسید نیشکر',
        stepTitleEn: '5. Overnight Renewal Mask',
        timeOfDay: 'night',
        productId: sleepingMask.id,
        product: sleepingMask,
        reasonFa: 'ترمیم لایه شاخی پوست، شفاف‌سازی رنگ چهره و لطافت مخملی شگفت‌انگیز در صبح.'
      },
      {
        stepNumber: 6,
        stepTitleFa: '۶. بالم ارگانیک گل سرخ و موم عسل لب',
        stepTitleEn: '6. Nourishing Lip Recovery Balm',
        timeOfDay: 'night',
        productId: lipBalm.id,
        product: lipBalm,
        reasonFa: 'نرم‌کنندگی عمیق و احیای لب‌های خشک و آسیب‌دیده با ترکیبات ۱۰۰٪ طبیعی.'
      }
    ];
  }

  return { morningSteps, nightSteps };
}

/**
 * Computes a personalized UserSkinProfile based on quiz answers and product catalog.
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

  const skinType: SkinType = (['dry', 'oily', 'combination', 'sensitive', 'normal'].includes(rawSkinType)
    ? rawSkinType
    : 'combination') as SkinType;

  const primaryConcern: SkinConcern = (rawConcern as SkinConcern) || 'hydration';

  const routineStyle: 'minimal' | 'balanced' | 'complete' = 
    (routineStyleRaw === 'minimal' || routineStyleRaw === 'complete') 
      ? routineStyleRaw 
      : 'balanced';

  // Build bilingual summary titles
  const skinTypeLabelsFa: Record<SkinType, string> = {
    dry: 'خشک',
    oily: 'چرب',
    combination: 'مختلط',
    sensitive: 'حساس',
    normal: 'نرمال'
  };

  const concernLabelsFa: Record<string, string> = {
    hydration: 'آبرسانی عمیق و رفع کم‌آبی',
    brightening: 'شفاف‌کننده و ضدلک',
    'anti-aging': 'جوانساز و ضدچروک',
    'acne-blemish': 'ضدجوش و کنترل چربی',
    'barrier-repair': 'ترمیم سد دفاعی و التیام'
  };

  const styleLabelsFa: Record<string, string> = {
    minimal: 'روتین سریع ۳ مرحله‌ای',
    balanced: 'روتین استاندارد ۴ مرحله‌ای',
    complete: 'روتین تخصصی و کامل شب و روز'
  };

  const skinTypeLabelsEn: Record<SkinType, string> = {
    dry: 'Dry',
    oily: 'Oily',
    combination: 'Combination',
    sensitive: 'Sensitive',
    normal: 'Normal'
  };

  const concernLabelsEn: Record<string, string> = {
    hydration: 'Deep Hydration',
    brightening: 'Radiance & Dark Spots',
    'anti-aging': 'Youth & Firming',
    'acne-blemish': 'Blemish & Pore Control',
    'barrier-repair': 'Barrier Recovery'
  };

  const routineGoalTitleFa = `روتین تخصصی ${concernLabelsFa[rawConcern] || 'آبرسانی'} (ویژه پوست ${skinTypeLabelsFa[skinType]})`;

  const summaryLabelFa = `پوست ${skinTypeLabelsFa[skinType]} · هدف: ${concernLabelsFa[rawConcern] || 'آبرسانی'} · ${styleLabelsFa[routineStyle]}`;
  const summaryLabelEn = `${skinTypeLabelsEn[skinType]} Skin · Focus: ${concernLabelsEn[rawConcern] || 'Hydration'} · ${routineStyle.toUpperCase()} Routine`;

  // Golden clinical usage tips
  const usageTipsFa = [
    'همیشه ترتیب اعمال محصولات را بر اساس غلظت بافت رعایت کنید: از رقیق‌ترین (تونر/سرم) به غلیظ‌ترین (کرم آبرسان).',
    'ضدآفتاب را در آخرین مرحله روتین صبحگاه، ۲۰ دقیقه قبل از خروج از منزل به اندازه دو بند انگشت روی صورت و گردن بزنید.',
    'بین مصرف سرم و کرم مرطوب‌کننده ۱ الی ۲ دقیقه فاصله بگذارید تا ترکیبات مغذی عمیقاً جذب پوست شوند.',
    'محصولات حاوی اسیدهای لایه‌بردار یا ماسک شب را فقط در روتین شبانه مصرف کرده و صبح حتماً از ضدآفتاب استفاده نمایید.'
  ];

  const { morningSteps, nightSteps } = buildRoutineStepsByStyle(routineStyle, primaryConcern, skinType, products);

  const recommendedProductIds = Array.from(
    new Set([
      ...morningSteps.map(s => s.productId),
      ...nightSteps.map(s => s.productId)
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
    createdAt: new Date().toISOString()
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
    window.dispatchEvent(new CustomEvent('vara-skin-profile-updated', { detail: profile }));
  } catch (err) {
    console.error('Failed to save skin profile', err);
  }
}
