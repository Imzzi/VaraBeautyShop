import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'product-1',
    nameFa: 'سرم بازسازی‌کننده لایلاک و آرگان خالص',
    nameEn: 'Lilac & Moroccan Argan Youth Elixir',
    brand: 'VARA',
    productType: 'serum',
    category: 'anti-aging',
    skinTypes: ['dry', 'sensitive', 'normal', 'combination'],
    concerns: ['anti-aging', 'hydration', 'barrier-repair'],
    routines: ['morning', 'night', 'anti-aging', 'hydration', 'barrier-repair'],
    ingredientTags: ['argan', 'hyaluronic-acid', 'lilac', 'antioxidants'],
    descriptionFa: 'اکسیر فاخر جوان‌کننده حاوی روغن آرگان خالص فشردگی سرد مراکش، عصاره گل لایلاک بنفش و اسید هیالورونیک گیاهی. این سرم با نفوذ به لایه‌های عمقی پوست، بافت را ترمیم کرده و شفافیتی درخشان می‌بخشد.',
    descriptionEn: 'A luxury youth-regenerating serum with cold-pressed Moroccan Argan oil, wild lilac flower extract, and botanical hyaluronic acid for intense radiance.',
    price: 1480000,
    originalPrice: 1750000,
    rating: 4.9,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۳۰ میلی‌لیتر', labelEn: '30 ml', price: 1480000, originalPrice: 1750000 },
      { label: '۵۰ میلی‌لیتر (سایز اقتصادی)', labelEn: '50 ml', price: 2150000, originalPrice: 2450000 }
    ],
    keyIngredients: [
      {
        nameFa: 'روغن آرگان مراکشی (Cold-Pressed)',
        nameEn: 'Moroccan Argan Oil',
        description: 'غنی از ویتامین E و اسیدهای چرب ضروری برای آبرسانی و ترمیم سد دفاعی پوست.'
      },
      {
        nameFa: 'عصاره خالص گل لایلاک',
        nameEn: 'Wild Lilac Botanical Extract',
        description: 'آنتی‌اکسیدان قوی جهت کاهش التهاب و محافظت در برابر رادیکال‌های آزاد.'
      },
      {
        nameFa: 'هیالورونیک اسید گیاهی',
        nameEn: 'Botanical Hyaluronic Acid',
        description: 'جذب ۱۰۰۰ برابری رطوبت و پرکننده خطوط ریز پوستی.'
      }
    ],
    usageRoutine: {
      morning: '۴ الی ۵ قطره روی پوست تمیز صورت و گردن ماساژ داده شود قبل از مرطوب‌کننده.',
      night: 'به عنوان آخرین مرحله روتین شب، ۶ قطره با حرکات دورانی آرام جذب پوست گردد.'
    },
    badges: ['۱۰۰٪ گیاهی', 'پرفروش‌ترین', 'تست‌شده توسط متخصصین', 'ارگانیک'],
    isBestSeller: true,
    inStock: true,
    stockCount: 24,
    authenticity: 'ضمانت اصالت ۱۰۰٪ اورجینال آزمایشگاهی با تأییدیه رسمی ECOCERT اروپا و گواهی کرولتی‌فری',
    sourcingOrigin: 'مزارع بیودینامیک لایلاک در پرووانس فرانسه و باغات آرگان ارگانیک آگادیر مراکش',
    expiryDate: '۲۴ ماه پس از تولید (۱۲ ماه پس از باز شدن درب شیشه‌ای) - تاریخ انقضا: ۲۰۲۷/۰۹',
    targetAudience: 'پوست‌های کدر، دهیدراته، دارای خطوط ریز، سد دفاعی آسیب‌دیده و سنین بالای ۲۲ سال',
    unsuitableFor: 'نامناسب برای پوست‌های فوق‌العاده چرب با آکنه فعال قارچی (Malassezia Folliculitis) و منافذ شدیداً مسدود.'
  },
  {
    id: 'product-2',
    nameFa: 'روغن اکسیر صحرا و گل لادن',
    nameEn: 'Sahara Botanica & Nasturtium Radiance Oil',
    brand: 'VARA',
    productType: 'serum',
    category: 'brightening',
    skinTypes: ['dry', 'combination', 'normal'],
    concerns: ['brightening', 'anti-aging'],
    routines: ['night', 'brightening', 'anti-aging'],
    ingredientTags: ['botanical-oils', 'jojoba', 'nasturtium', 'vitamin-e'],
    descriptionFa: 'روغن سبک و زودجذب حاوی عصاره گیاهان مقاوم صحرا، گل لادن و روغن جوجوبای کوهی. تغذیه‌کننده عمیق با بوی ملایم و طبیعی گل‌های وحشی.',
    descriptionEn: 'Fast-absorbing botanical face oil blending Sahara desert flora and Nasturtium flower extract for soft, velvety skin.',
    price: 1290000,
    originalPrice: 1490000,
    rating: 4.8,
    reviewCount: 94,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228724-4da0339a7776?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۳۰ میلی‌لیتر', labelEn: '30 ml', price: 1290000, originalPrice: 1490000 }
    ],
    keyIngredients: [
      {
        nameFa: 'عصاره گل لادن وحشی',
        nameEn: 'Wild Nasturtium Flower',
        description: 'افزایش اکسیژن‌رسانی سلولی و ایجاد درخشش طبیعی در پوست‌های خسته.'
      },
      {
        nameFa: 'روغن جوجوبای خام',
        nameEn: 'Organic Jojoba Oil',
        description: 'تعادل‌بخش چربی طبیعی پوست بدون مسدود کردن منافذ.'
      }
    ],
    usageRoutine: {
      morning: '۲ الی ۳ قطره همراه با ماساژور گواشا یا انگشتان به صورت ضربه‌ای استفاده شود.',
      night: '۴ قطره همراه با مرطوب‌کننده مخلوط و روی صورت پخش شود.'
    },
    badges: ['۱۰۰٪ ارگانیک', 'فاقد چربی سنگین', 'بدون پارابن'],
    isBestSeller: true,
    inStock: true,
    stockCount: 18,
    authenticity: '۱۰۰٪ اصل و دست‌چین شده با برگه آنالیز آزمایشگاهی GC-MS خلوص روغن‌های گیاهی',
    sourcingOrigin: 'فلورای وحشی صحرای آتاکاما و گیاهان دارویی کوهپایه‌های زاگرس و مراکش',
    expiryDate: '۱۸ ماه پس از تولید (۶ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۷/۰۶',
    targetAudience: 'پوست‌های خسته و کدر، افراد با لک ناشی از خستگی، هوای آلوده یا استرس روزمره',
    unsuitableFor: 'نامناسب برای پوست‌های مستعد جوش‌های سرسیاه و چربی مفرط؛ ترجیحاً افراد دارای جوش فعال کیستیک استفاده نکنند.'
  },
  {
    id: 'product-3',
    nameFa: 'تونر پاک‌کننده شکوفه یاس و بابونه کوهی',
    nameEn: 'Jasmine & Chamomile Botanical Hydrating Toner',
    brand: 'VARA',
    productType: 'toner',
    category: 'sensitive-skin',
    skinTypes: ['sensitive', 'dry', 'normal', 'combination', 'oily'],
    concerns: ['soothing', 'hydration', 'barrier-repair'],
    routines: ['morning', 'night', 'hydration', 'barrier-repair', 'minimal'],
    ingredientTags: ['jasmine', 'chamomile', 'aloe-vera', 'soothing'],
    descriptionFa: 'تونر تسکین‌دهنده و متعادل‌کننده pH پوست با عصاره تقطیر شده شکوفه‌های یاس، بابونه ارگانیک و آلوئه‌ورا. بدون الکل و بدون خستگی پوستی.',
    descriptionEn: 'Alcohol-free hydrating toner infused with steam-distilled jasmine blossoms and organic mountain chamomile.',
    price: 890000,
    originalPrice: 1050000,
    rating: 4.9,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512290900672-1f413a968652?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۱۵۰ میلی‌لیتر', labelEn: '150 ml', price: 890000, originalPrice: 1050000 },
      { label: '۲۵۰ میلی‌لیتر', labelEn: '250 ml', price: 1250000 }
    ],
    keyIngredients: [
      {
        nameFa: 'تقطیر گل یاس سفید',
        nameEn: 'White Jasmine Distillate',
        description: 'آبرسان ملایم با عطر تسکین‌دهنده اعصاب و پوست.'
      },
      {
        nameFa: 'بابونه ارگانیک کوهستان',
        nameEn: 'Mountain Chamomile',
        description: 'کاهش‌دهنده فوری قرمزی و التهاب‌های پوستی.'
      }
    ],
    usageRoutine: {
      morning: 'پس از شستشوی صورت، به صورت اسپری مستقیم یا روی پد پنبه‌ای استفاده شود.',
      night: 'جهت پاکسازی نهایی صورت و آماده‌سازی برای جذب بهتر سرم‌ها.'
    },
    badges: ['بدون الکل', 'مناسب پوست حساس', '۱۰۰٪ گیاهی'],
    isBestSeller: false,
    isNew: true,
    inStock: true,
    stockCount: 32,
    authenticity: 'فرموله شده در آزمایشگاه‌های درماتولوژی فرانسه با استاندارد ایزو ۲۲۷۱۶ کیفیت آرایشی',
    sourcingOrigin: 'مزارع تقطیر بخار بابونه آلپ سوئیس و شکوفه‌های یاس شیراز و دمشق',
    expiryDate: '۲۴ ماه پس از تولید (۹ ماه پس از باز شدن پلمپ) - تاریخ انقضا: ۲۰۲۷/۱۱',
    targetAudience: 'پوست‌های حساس، مستعد قرمزی، رزاسه و افرادی که پس از شوینده احساس کشیدگی دارند',
    unsuitableFor: 'نامناسب برای افرادی که سابقه حساسیت شناخته‌شده به اسانس‌های تقطیری گل‌های معطر طبیعی دارند.'
  },
  {
    id: 'product-4',
    nameFa: 'کرم آبرسان عمقی شیره کاکتوس و هیالورونیک',
    nameEn: 'Desert Cactus Nectar Deep Hydration Cream',
    brand: 'VARA',
    productType: 'moisturizer',
    category: 'hydration',
    skinTypes: ['dry', 'sensitive', 'combination', 'normal'],
    concerns: ['hydration', 'barrier-repair'],
    routines: ['morning', 'night', 'hydration', 'barrier-repair', 'minimal'],
    ingredientTags: ['cactus', 'hyaluronic-acid', 'shea-butter', 'ceramide'],
    descriptionFa: 'کرم مخملی و غنی شده با عصاره شیره کاکتوس خاردار صحرا و ۳ وزن مولکولی هیالورونیک اسید. آبرسانی ۷۲ ساعته بدون حس سنگینی.',
    descriptionEn: 'Velvety ultra-moisturizing cream infused with desert prickly pear cactus nectar and triple-molecular hyaluronic acid.',
    price: 1650000,
    originalPrice: 1890000,
    rating: 5.0,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۵۰ میلی‌لیتر', labelEn: '50 ml', price: 1650000, originalPrice: 1890000 }
    ],
    keyIngredients: [
      {
        nameFa: 'شیره کاکتوس صحرا',
        nameEn: 'Prickly Pear Cactus Nectar',
        description: 'حفظ ماندگار رطوبت در سخت‌ترین شرایط آب و هوایی خشک.'
      },
      {
        nameFa: 'کره شی‌باتر تصفیه نشده',
        nameEn: 'Raw Shea Butter',
        description: 'ترمیم بافت آسیب‌دیده و ایجاد نرمی مخملی روی پوست.'
      }
    ],
    usageRoutine: {
      morning: 'مقداری به اندازه یک نخود روی پوست مرطوب ماساژ داده شود.',
      night: 'لایه‌ای سخاوتمندانه روی صورت و گردن قرار گیرد.'
    },
    badges: ['آبرسانی ۷۲ ساعته', 'بافت مخملی', 'مناسب اقلیم خشک'],
    isBestSeller: true,
    inStock: true,
    stockCount: 15,
    authenticity: 'ضمانت اصالت ۱۰۰٪ اورجینال تحت لیسانس ورا بیوتی پاریس با کد رهگیری سامانه سلامت',
    sourcingOrigin: 'عصاره خالص میوه کاکتوس اپونتیا از بیابان‌های تونس و شی‌باتر غنا',
    expiryDate: '۳۰ ماه پس از تولید (۱۲ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۸/۰۲',
    targetAudience: 'افراد با پوست‌های شدیداً دهیدراته، پوسته پوسته شونده و ساکنین اقلیم‌های خشک و کویری',
    unsuitableFor: 'نامناسب برای پوست‌های شدیداً مستعد آکنه سرسیاه و افراد با منافذ به شدت مسدود به دلیل غلظت شی‌باتر طبیعی.'
  },
  {
    id: 'product-5',
    nameFa: 'ماسک شبانه ترمیم‌کننده اسید لاکتیک نیشکر',
    nameEn: 'Sugarcane Lactic Sleeping Glow Mask',
    brand: 'VARA',
    productType: 'mask',
    category: 'brightening',
    skinTypes: ['combination', 'oily', 'normal'],
    concerns: ['brightening', 'anti-aging'],
    routines: ['night', 'brightening', 'acne-blemish'],
    ingredientTags: ['lactic-acid', 'aha-bha', 'papaya', 'exfoliant'],
    descriptionFa: 'ماسک لایه‌بردار ملایم شبانه بر پایه اسید لاکتیک نیشکر طبیعی و آنزیم‌های آناناس و لایلاک. لایه‌برداری ملایم در طول خواب شبانه.',
    descriptionEn: 'Overnight resurfacing gel mask powered by natural sugarcane lactic acid and papaya enzyme for smooth morning glow.',
    price: 1350000,
    originalPrice: 1550000,
    rating: 4.7,
    reviewCount: 62,
    images: [
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۶۰ میلی‌لیتر', labelEn: '60 ml', price: 1350000, originalPrice: 1550000 }
    ],
    keyIngredients: [
      {
        nameFa: 'اسید لاکتیک طبیعی نیشکر',
        nameEn: 'Sugarcane Lactic Acid',
        description: 'جداسازی سلول‌های مرده بدون ایجاد سوزش یا خشکی.'
      },
      {
        nameFa: 'آنزیم عصاره پاپایا و لایلاک',
        nameEn: 'Papaya & Lilac Enzymes',
        description: 'شفاف‌کننده طراوت‌بخش برای منافذ خسته.'
      }
    ],
    usageRoutine: {
      morning: 'صبح‌ها حتماً از ضدآفتاب استفاده شود.',
      night: '۲ الی ۳ شب در هفته قبل از خواب روی پوست تمیز زده شود و صبح شسته شود.'
    },
    badges: ['لایه‌بردار گیاهی', 'درخشش فوری', 'فاقد عطر مصنوعی'],
    isNew: true,
    inStock: true,
    stockCount: 10,
    authenticity: 'فرمولاسیون استاندارد کلینیکال و بدون اسیدهای خشن صنعتی با تأییدیه وگان',
    sourcingOrigin: 'نیشکر ارگانیک جزایر کارائیب و آنزیم‌های میوه‌ای بیولوژیک برزیل',
    expiryDate: '۲۴ ماه پس از تولید (۶ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۷/۰۸',
    targetAudience: 'افراد با بافت ناهموار پوستی، منافذ کدر، لک‌های سطحی جای جوش و کدری پوست',
    unsuitableFor: 'نامناسب برای پوست‌های با سد دفاعی تخریب‌شده، اگزمای ملتهب فعال، آفتاب‌سوختگی شدید و مصرف همزمان با رتینول.'
  },
  {
    id: 'product-6',
    nameFa: 'بالسام مغذی و ترمیم‌کننده لب لایلاک و رز',
    nameEn: 'Lilac Rose Nourishing Lip Elixir Balm',
    brand: 'VARA',
    productType: 'lip-care',
    category: 'hydration',
    skinTypes: ['dry', 'sensitive', 'normal', 'combination', 'oily'],
    concerns: ['hydration', 'soothing'],
    routines: ['morning', 'night', 'hydration', 'minimal'],
    ingredientTags: ['rose', 'beeswax', 'vitamin-e'],
    descriptionFa: 'بالسام لب فاخر غنی از موم عسل ارگانیک، عصاره گل رز سرخ محمدی و روغن لایلاک. برطرف‌کننده پوسته پوسته شدن و ایجاد رنگ صورتی نرم طبیعی.',
    descriptionEn: 'Luxurious rose and lilac petal lip balm enriched with organic beeswax and damask rose oil.',
    price: 520000,
    originalPrice: 620000,
    rating: 4.9,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۱۵ گرم', labelEn: '15 g', price: 520000, originalPrice: 620000 }
    ],
    keyIngredients: [
      {
        nameFa: 'روغن گل رز محمدی ایرانی',
        nameEn: 'Damask Rose Essential Oil',
        description: 'نرم‌کننده و ترمیم‌کننده عمیق بافت حساس لب.'
      },
      {
        nameFa: 'موم کاملاً طبیعی عسل',
        nameEn: 'Natural Organic Beeswax',
        description: 'محافظت در برابر باد و سرمای خشک.'
      }
    ],
    usageRoutine: {
      morning: 'در طول روز هر زمان نیاز بود روی لب‌ها استفاده شود.',
      night: 'قبل از خواب لایه‌ای ضخیم‌تر به عنوان ماسک شبانه لب زده شود.'
    },
    badges: ['۱۰۰٪ طبیعی', 'بدون مواد شیمیایی', 'طعم ملایم گیاهی'],
    isBestSeller: true,
    inStock: true,
    stockCount: 45,
    authenticity: '۱۰۰٪ خوراکی و ارگانیک بدون سرب، پترولاتوم، رنگ یا اسانس شیمیایی سنتتیک',
    sourcingOrigin: 'گلستان‌های قمصر کاشان و کندوهای ارگانیک سبلان و گلبرگ لایلاک فرانسه',
    expiryDate: '۱۸ ماه پس از تولید (۸ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۷/۰۵',
    targetAudience: 'تمام سنین با لب‌های خشک، ترک‌خورده و علاقه‌مند به مراقبت طبیعی و بدون مواد نفتی',
    unsuitableFor: 'نامناسب برای افراد دارای حساسیت به فرآورده‌های زنبور عسل (موم و بیزواکس طبیعی).'
  },
  {
    id: 'product-7',
    nameFa: 'سرم دور چشم ضد پف و تیرگی قهوه سبز و لایلاک',
    nameEn: 'Green Coffee & Lilac Awakening Eye Serum',
    brand: 'VARA',
    productType: 'eye-care',
    category: 'anti-aging',
    skinTypes: ['dry', 'sensitive', 'normal', 'combination', 'oily'],
    concerns: ['anti-aging', 'brightening', 'soothing'],
    routines: ['morning', 'night', 'anti-aging', 'brightening'],
    ingredientTags: ['caffeine', 'peptides', 'green-coffee', 'antioxidants'],
    descriptionFa: 'سرم تخصصی دور چشم با غلتک خنک‌کننده استیل، حاوی کافئین عصاره قهوه سبز ارگانیک و پپتیدهای گیاهی. کاهش‌دهنده فوری پف و تیرگی زیر چشم.',
    descriptionEn: 'Cooling metal applicator eye serum with organic green coffee caffeine and plant peptides to depuff and brighten dark circles.',
    price: 1180000,
    originalPrice: 1380000,
    rating: 4.8,
    reviewCount: 75,
    images: [
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۱۵ میلی‌لیتر', labelEn: '15 ml', price: 1180000, originalPrice: 1380000 }
    ],
    keyIngredients: [
      {
        nameFa: 'کافئین قهوه سبز ارگانیک',
        nameEn: 'Organic Green Coffee Extract',
        description: 'انقباض مویرگ‌ها و کاهش تیرگی و پف دور چشم.'
      },
      {
        nameFa: 'پپتیدهای سویا و نخود گیاهی',
        nameEn: 'Plant Peptides',
        description: 'تقویت کلاژن‌سازی اطراف چشم.'
      }
    ],
    usageRoutine: {
      morning: 'با غلتک استیل از داخل به سمت بیرون پلک پایین ماساژ دهید.',
      night: 'یک قطره با ضربات بسیار آرام انگشت حلقه‌ای دور چشم پخش شود.'
    },
    badges: ['دارای رولر استیل', 'کاهش فوری پف', 'تست چشم‌پزشکی شده'],
    inStock: true,
    stockCount: 12,
    authenticity: 'تست شده از نظر چشم‌پزشکی و درماتولوژی در لابراتوار بیوپل فرانسه بدون سوزش چشم',
    sourcingOrigin: 'دانه‌های قهوه سبز کشت ارتفاعات کلمبیا و پپتیدهای سویای غیرتراریخته آلمان',
    expiryDate: '۲۴ ماه پس از تولید (۶ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۷/۱۰',
    targetAudience: 'افراد دارای پف صبحگاهی، حلقه‌های تیره دور چشم، خطوط پنجه‌کلاغی و خستگی ناشی از کار با مانیتور',
    unsuitableFor: 'نامناسب برای مصرف مستقیم داخل چشم یا روی پلک‌های مبتلا به بلفاریت و اگزمای شدید چشم.'
  },
  {
    id: 'product-8',
    nameFa: 'ژل شوینده ملایم روزانه عصاره اسطوخودوس و لایلاک',
    nameEn: 'Lavender & Lilac Soothing Gentle Cleanser',
    brand: 'VARA',
    productType: 'cleanser',
    category: 'cleanser',
    skinTypes: ['sensitive', 'dry', 'normal', 'combination', 'oily'],
    concerns: ['soothing', 'barrier-repair', 'hydration'],
    routines: ['morning', 'night', 'barrier-repair', 'minimal', 'acne-blemish'],
    ingredientTags: ['lavender', 'panthenol', 'pro-vitamin-b5'],
    descriptionFa: 'شوینده غیرصابونی و ملایم با فوم کم، حاوی عصاره اسطوخودوس تسکین‌دهنده و پروویتامین B5. پاک‌سازی کامل آلودگی‌ها بدون کشیدگی و خشکی.',
    descriptionEn: 'Soap-free low-foam botanical gel cleanser with lavender extract and provitamin B5 that respects skin lipid barrier.',
    price: 790000,
    originalPrice: 920000,
    rating: 4.9,
    reviewCount: 142,
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228722-d0b71941656b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۲۰۰ میلی‌لیتر', labelEn: '200 ml', price: 790000, originalPrice: 920000 }
    ],
    keyIngredients: [
      {
        nameFa: 'اسطوخودوس وحشی',
        nameEn: 'Wild Lavender',
        description: 'تسکین خارش و حساسیت‌های پوستی روزانه.'
      },
      {
        nameFa: 'پروویتامین B5 (پانتنول)',
        nameEn: 'Pro-Vitamin B5',
        description: 'حفظ نرمی و لطافت پوست پس از شستشو.'
      }
    ],
    usageRoutine: {
      morning: 'یک پمپ روی پوست مرطوب صورت ماساژ داده و با آب ولرم شسته شود.',
      night: 'پس از پاک کردن آرایش اولیه جهت پاکسازی کامل صورت استفاده شود.'
    },
    badges: ['بدون سولفات (SLS-Free)', 'بدون صابون', 'PH کاملاً سازگار'],
    inStock: true,
    stockCount: 28,
    authenticity: 'دارای فرمولاسیون پاک (Clean Beauty)، فاقد سولفات، پارابن و سورفکتانت‌های تهاجمی',
    sourcingOrigin: 'روغن اسطوخودوس کوهستانی ناحیه گراس فرانسه و پانتنول دارویی سوئیس',
    expiryDate: '۳۶ ماه پس از تولید (۱۲ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۸/۰۳',
    targetAudience: 'شستشوی روزمره انواع پوست، به خصوص پوست‌های حساس، مستعد جوش و جوش‌های ناشی از خشکی',
    unsuitableFor: 'نامناسب برای پاکسازی مستقیم آرایش غلیظ و ریمل ضدآب دور چشم بدون مرحله میسلار واتر اولیه.'
  },
  {
    id: 'product-9',
    nameFa: 'فلوئید ضدآفتاب مینرال بی‌رنگ SPF 50+ چای سفید و لایلاک',
    nameEn: 'White Tea & Lilac Invisible Mineral Sunscreen SPF 50+',
    brand: 'VARA',
    productType: 'sunscreen',
    category: 'sunscreen',
    skinTypes: ['sensitive', 'dry', 'normal', 'combination', 'oily'],
    concerns: ['sunscreen', 'anti-aging', 'sensitive', 'soothing'],
    routines: ['morning', 'anti-aging', 'barrier-repair', 'minimal'],
    ingredientTags: ['zinc-oxide', 'white-tea', 'mineral-filter', 'antioxidants'],
    descriptionFa: 'ضدآفتاب مینرال ۱۰۰٪ فیزیکال با بافت فلوئید بسیار سبک، بدون رد سفیدی و فاقد چربی. حاوی زینک اکساید دارویی، آنتی‌اکسیدان چای سفید و عصاره لایلاک برای محافظت همه‌جانبه در برابر UVA، UVB و نور آبی مانیتور.',
    descriptionEn: 'Invisible featherlight 100% mineral sunscreen with broad spectrum SPF 50+, pharmaceutical zinc oxide, white tea, and blue light defense.',
    price: 1150000,
    originalPrice: 1350000,
    rating: 4.9,
    reviewCount: 98,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۵۰ میلی‌لیتر', labelEn: '50 ml', price: 1150000, originalPrice: 1350000 }
    ],
    keyIngredients: [
      {
        nameFa: 'زینک اکساید غیرنانو (Non-Nano Zinc Oxide)',
        nameEn: 'Non-Nano Zinc Oxide',
        description: 'سپر فیزیکی ملایم در برابر اشعه‌های مخرب خورشید بدون تحریک پوست حساس.'
      },
      {
        nameFa: 'عصاره چای سفید خالص',
        nameEn: 'Organic White Tea Extract',
        description: 'خنثی‌کننده قوی رادیکال‌های آزاد و مانع ایجاد لک و پیری ناشی از آفتاب.'
      }
    ],
    usageRoutine: {
      morning: 'آخرین مرحله روتین صبح (۱۵ دقیقه قبل از خروج)، به اندازه ۲ بند انگشت روی صورت و گردن پخش شود.',
      night: 'در طول شب نیازی به مصرف ضدآفتاب نیست؛ صورت با شوینده ملایم پاکسازی شود.'
    },
    badges: ['۱۰۰٪ مینرال فیزیکال', 'بدون رد سفیدی', 'محافظت نور آبی', 'ضد حساسیت'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockCount: 20,
    authenticity: 'تست شده با گواهی سنجش فاکتور محافظتی Broad Spectrum SPF 50+ و PA++++ در کلینیک درماتولوژی',
    sourcingOrigin: 'برگ‌های چای سفید ارگانیک فوجیان و زینک اکساید دارویی درجه ۱ آلمان',
    expiryDate: '۲۴ ماه پس از تولید (۹ ماه پس از باز شدن پلمپ) - تاریخ انقضا: ۲۰۲۷/۰۷',
    targetAudience: 'افراد باردار، پوست‌های حساس، مستعد لک ملاسما و افرادی که ساعاتی طولانی در معرض نور یا مانیتور هستند',
    unsuitableFor: 'نامناسب برای استفاده مستقیم روی سوختگی‌های حاد درجه دو، تاول‌های باز و پوست پس از پیلینگ عمیق شیمیایی.'
  },
  {
    id: 'product-10',
    nameFa: 'روغن اکسیر مو و بدن گل مغربی و رزماری وحشی',
    nameEn: 'Evening Primrose & Rosemary Botanical Hair & Body Nectar',
    brand: 'VARA',
    productType: 'hair-body',
    category: 'hair-body',
    skinTypes: ['dry', 'sensitive', 'normal', 'combination', 'oily'],
    concerns: ['hair-body', 'hydration', 'barrier-repair', 'soothing'],
    routines: ['night', 'hydration', 'barrier-repair'],
    ingredientTags: ['evening-primrose', 'rosemary', 'almond-oil'],
    descriptionFa: 'اکسیر مغذی چندمنظوره برای ساقه مو و پوست بدن غنی از روغن گل مغربی، رزماری کوهی و روغن بادام شیرین. ایجاد لطافت ابریشمی، رفع خشکی پوست و جلوگیری از موخوره و شکنندگی مو.',
    descriptionEn: 'Multi-purpose dry body & hair nectar formulated with wild rosemary and cold-pressed evening primrose for velvety softness.',
    price: 1320000,
    originalPrice: 1550000,
    rating: 4.8,
    reviewCount: 67,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۱۰۰ میلی‌لیتر', labelEn: '100 ml', price: 1320000, originalPrice: 1550000 }
    ],
    keyIngredients: [
      {
        nameFa: 'روغن گل مغربی (Evening Primrose)',
        nameEn: 'Organic Evening Primrose Oil',
        description: 'سرشار از گاما لینولنیک اسید (GLA) جهت بازسازی سد رطوبتی پوست بدن.'
      },
      {
        nameFa: 'عصاره رزماری وحشی تقطیری',
        nameEn: 'Wild Rosemary Distillate',
        description: 'تقویت‌کننده کوتیکول‌های مو و درخشش‌بخش طبیعی.'
      }
    ],
    usageRoutine: {
      morning: 'چند قطره روی نوک موهای نم‌دار یا نقاط خشک بدن ماساژ داده شود.',
      night: 'به عنوان حمام روغن ساقه مو قبل از شستشو یا بعد از دوش شبانه روی پوست مرطوب.'
    },
    badges: ['چندمنظوره مو و بدن', 'زودجذب بدون چربی', '۱۰۰٪ گیاهی'],
    isNew: true,
    inStock: true,
    stockCount: 16,
    authenticity: '۱۰۰٪ خالص گیاهی فشردگی سرد، بدون روغن‌های معدنی نفتی (Mineral Oil-Free) و سیلیکون',
    sourcingOrigin: 'گل مغربی ارگانیک دشت‌های هلند و رزماری وحشی تقطیری کوه‌های البرز',
    expiryDate: '۲۴ ماه پس از تولید (۱۲ ماه پس از باز شدن) - تاریخ انقضا: ۲۰۲۷/۱۲',
    targetAudience: 'موهای آسیب‌دیده و وز، ساقه‌های خشک، پوست خشک بدن و افراد نیازمند رطوبت‌رسانی عمیق بعد از حمام',
    unsuitableFor: 'نامناسب برای ریشه مو و کف سر چرب دارای شوره سبورئیک، و نباید به عنوان روغن پوست صورت مصرف شود.'
  },
  {
    id: 'product-11',
    nameFa: 'اسنس جینسینگ و برنج روشن‌کننده بیوتی آف جوسان',
    nameEn: 'Beauty of Joseon Ginseng Essence Water',
    brand: 'Beauty of Joseon',
    productType: 'toner',
    category: 'brightening',
    skinTypes: ['dry', 'combination', 'normal', 'sensitive', 'oily'],
    concerns: ['brightening', 'anti-aging', 'hydration'],
    routines: ['morning', 'night', 'brightening', 'hydration', 'anti-aging'],
    ingredientTags: ['ginseng', 'rice-extract', 'niacinamide', 'hyaluronic-acid'],
    descriptionFa: 'اسنس مغذی ۸۰٪ آب جینسینگ و نیاسینامید ۲٪ ساخت کره جنوبی. افزایش‌دهنده فوری شفافیت، طراوت‌بخش و شاداب‌کننده سلول‌های پوست.',
    descriptionEn: 'Formulated with 80% Ginseng root water and Niacinamide 2% to energize fatigued skin and provide intense hydration.',
    price: 1390000,
    originalPrice: 1590000,
    rating: 4.9,
    reviewCount: 184,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۱۵۰ میلی‌لیتر', labelEn: '150 ml', price: 1390000, originalPrice: 1590000 }
    ],
    keyIngredients: [
      {
        nameFa: 'آب ریشه جینسینگ ارگانیک ۸۰٪',
        nameEn: 'Panax Ginseng Root Water',
        description: 'اکسیژن‌رسانی و بهبود الاستیسیته و کاهش خستگی پوست.'
      },
      {
        nameFa: 'نیاسینامید ۲٪ خالص',
        nameEn: 'Niacinamide',
        description: 'روشن‌کننده لک‌ها و یکدست‌کننده رنگ چهره.'
      }
    ],
    usageRoutine: {
      morning: 'بعد از شوینده روی کف دست ریخته و با ضربات آرام جذب شود.',
      night: 'چند لایه به روش ۷-Skin Method روی پوست ماساژ داده شود.'
    },
    badges: ['ساخت کره جنوبی (K-Beauty)', '۸۰٪ جینسینگ خالص', 'پرفروش‌ترین کره‌ای'],
    isBestSeller: true,
    isNew: true,
    inStock: true,
    stockCount: 22,
    authenticity: 'ضمانت ۱۰۰٪ اصالت کالای وارداتی اصل کره با بچ‌کد معتبر و هولوگرام اصالت',
    sourcingOrigin: 'سئول، کره جنوبی',
    expiryDate: '۲۰۲۷/۱۱',
    targetAudience: 'پوست‌های کدر، دهیدراته، مستعد چروک ریز و علاقه‌مندان به روتین شیشه‌ای کره‌ای',
    unsuitableFor: 'نامناسب برای پوست‌های به شدت ملتهب با درماتیت حاد تماسی یا حساسیت شدید به ریشه جینسینگ.'
  },
  {
    id: 'product-12',
    nameFa: 'اسنس حلزون پیشرفته ۹۶٪ کوزارکس',
    nameEn: 'COSRX Advanced Snail 96 Mucin Power Essence',
    brand: 'COSRX',
    productType: 'serum',
    category: 'hydration',
    skinTypes: ['dry', 'sensitive', 'combination', 'oily', 'normal'],
    concerns: ['hydration', 'barrier-repair', 'soothing'],
    routines: ['morning', 'night', 'hydration', 'barrier-repair', 'acne-blemish'],
    ingredientTags: ['snail-mucin', 'hyaluronic-acid', 'panthenol', 'allantoin'],
    descriptionFa: 'اسنس معجزه‌گر ۹۶٪ موسین حلزون تصفیه‌شده جهت آبرسانی عمیق، ترمیم جای جوش، التیام التهابات و بازسازی سد دفاعی آسیب‌دیده.',
    descriptionEn: 'Enriched with 96.3% Snail Secretion Filtrate, this lightweight essence nourishes, repairs and plumps the skin.',
    price: 1450000,
    originalPrice: 1680000,
    rating: 4.9,
    reviewCount: 320,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556228722-d0b71941656b?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۱۰۰ میلی‌لیتر', labelEn: '100 ml', price: 1450000, originalPrice: 1680000 }
    ],
    keyIngredients: [
      {
        nameFa: 'ترشح موسین حلزون ۹۶.۳٪',
        nameEn: 'Snail Secretion Filtrate',
        description: 'تغذیه عمقی، آبرسانی بدون انسداد منافذ و بازسازی کلاژن.'
      },
      {
        nameFa: 'هیالورونات سدیم و آلانتوئین',
        nameEn: 'Sodium Hyaluronate',
        description: 'تسکین قرمزی و حفظ رطوبت درون سلول‌ها.'
      }
    ],
    usageRoutine: {
      morning: '۲ پمپ روی پوست کمی مرطوب پخش شود.',
      night: 'قبل از کرم مرطوب‌کننده برای قفل رطوبت استفاده شود.'
    },
    badges: ['پرفروش‌ترین جهانی', 'کرولتی فری (بدون آسیب به حیوانات)', 'ساخت کره'],
    isBestSeller: true,
    inStock: true,
    stockCount: 30,
    authenticity: 'تأییدیه ۱۰۰٪ اصالت شرکتی با هولوگرام لیزری COSRX کره جنوبی',
    sourcingOrigin: 'کره جنوبی',
    expiryDate: '۲۰۲۸/۰۱',
    targetAudience: 'انواع پوست به‌ویژه پوست‌های دهیدراته، جای جوش دار، حساس و نیازمند ترمیم',
    unsuitableFor: 'نامناسب برای افراد دارای حساسیت متقاطع به صدف‌های دریایی یا غشای موسین حلزون.'
  },
  {
    id: 'product-13',
    nameFa: 'بالم ترمیم‌کننده سیکاپلاست B5+ لاروش پوزای',
    nameEn: 'La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing',
    brand: 'La Roche-Posay',
    productType: 'moisturizer',
    category: 'sensitive-skin',
    skinTypes: ['sensitive', 'dry', 'normal', 'combination'],
    concerns: ['soothing', 'barrier-repair', 'sensitive'],
    routines: ['night', 'barrier-repair', 'soothing', 'minimal'],
    ingredientTags: ['panthenol', 'madecassoside', 'ceramide', 'zinc'],
    descriptionFa: 'بالم ترمیم‌کننده فوق‌العاده سد دفاعی پوست حاوی ۵٪ پانتنول، مادکاسوساید (عصاره سنتلا) و کمپلکس پری‌بیوتیک ترایبیوما. التیام فوری سوختگی، لیزر، قرمزی و خشکی مفرط.',
    descriptionEn: 'Multi-purpose soothing balm for irritated or compromised skin with 5% Panthenol, Madecassoside and Tribioma prebiotic complex.',
    price: 1580000,
    originalPrice: 1790000,
    rating: 5.0,
    reviewCount: 265,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۴۰ میلی‌لیتر', labelEn: '40 ml', price: 1580000, originalPrice: 1790000 },
      { label: '۱۰۰ میلی‌لیتر', labelEn: '100 ml', price: 2350000 }
    ],
    keyIngredients: [
      {
        nameFa: 'پانتنول ویتامین B5 خالص ۵٪',
        nameEn: 'Panthenol 5%',
        description: 'التیام‌بخش فوری سوزش و قرمزی پوست.'
      },
      {
        nameFa: 'مادکاسوساید (عصاره فعال سنتلا آسیاتیکا)',
        nameEn: 'Madecassoside',
        description: 'ترمیم بافت اپیدرم و افزایش مقاومت لایه دفاعی.'
      }
    ],
    usageRoutine: {
      morning: 'روی نواحی ملتهب یا بسیار خشک ۲ بار در روز زده شود.',
      night: 'به عنوان لایه محافظ نهایی (Sluging سبک) روی پوست شب‌ها استفاده شود.'
    },
    badges: ['شماره ۱ ترمیم‌کننده در فرانسه', 'توصیه متخصصان پوست', 'بدون عطر'],
    isBestSeller: true,
    inStock: true,
    stockCount: 19,
    authenticity: 'اصل فرانسه با بچ کد و تاریخ معتبر رسمی آزمایشگاه لاروش پوزای',
    sourcingOrigin: 'فرانسه',
    expiryDate: '۲۰۲۷/۰۹',
    targetAudience: 'پوست‌های آسیب‌دیده، بعد از لایه‌برداری یا لیزر، رزاسه، خشکی شدید و کودکان و بزرگسالان',
    unsuitableFor: 'نامناسب برای زخم‌های ترشح‌دار باز و عفونی، و پوست‌های شدیداً چرب و جوش‌دار به عنوان کرم روزمره تمام‌صورت.'
  },
  {
    id: 'product-14',
    nameFa: 'سرم نیاسینامید ۱۰٪ + زینک ۱٪ دی اوردینری',
    nameEn: 'The Ordinary Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    productType: 'serum',
    category: 'acne-blemishes',
    skinTypes: ['oily', 'combination', 'normal'],
    concerns: ['acne-blemish', 'brightening'],
    routines: ['morning', 'night', 'acne-blemish', 'brightening'],
    ingredientTags: ['niacinamide', 'zinc', 'pore-minimizer'],
    descriptionFa: 'سرم پرفروش ضدجوش و کنترل‌کننده سبوم دی اوردینری کانادا. کوچک‌کننده منافذ باز، یکدست‌کننده بافت پوست و رفع لک‌های ناشی از جوش.',
    descriptionEn: 'High-strength vitamin and mineral blemish formula to reduce blemishes, balance sebum activity and refine pores.',
    price: 980000,
    originalPrice: 1150000,
    rating: 4.8,
    reviewCount: 410,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: '۳۰ میلی‌لیتر', labelEn: '30 ml', price: 980000, originalPrice: 1150000 },
      { label: '۶۰ میلی‌لیتر', labelEn: '60 ml', price: 1550000 }
    ],
    keyIngredients: [
      {
        nameFa: 'نیاسینامید (ویتامین B3) ۱۰٪',
        nameEn: 'Niacinamide 10%',
        description: 'کاهش تیرگی، تقویت سد دفاعی و تنظیم منافذ.'
      },
      {
        nameFa: 'زینک PCA ۱٪',
        nameEn: 'Zinc PCA 1%',
        description: 'کنترل ترشح چربی اضافی و ضدباکتری جوش‌زا.'
      }
    ],
    usageRoutine: {
      morning: '۲ الی ۳ قطره قبل از مرطوب‌کننده استفاده شود.',
      night: 'همراه با روتین شبانه ضدجوش استفاده گردد.'
    },
    badges: ['پرفروش‌ترین سرم ضدجوش دنیا', 'وگان و بدون تست حیوانی', 'اصل کانادا'],
    isBestSeller: true,
    inStock: true,
    stockCount: 35,
    authenticity: '۱۰۰٪ اورجینال دسیِم (Deciem) کانادا با تضمین بازگشت وجه',
    sourcingOrigin: 'کانادا',
    expiryDate: '۲۰۲۷/۱۲',
    targetAudience: 'پوست‌های چرب، مختلط، دارای منافذ باز و لک‌های به جا مانده از آکنه',
    unsuitableFor: 'نامناسب برای پوست‌های حساس با اگزما و استفاده همزمان در یک نوبت با ویتامین C خالص (Ascorbic Acid).'
  },
  {
    id: 'product-15',
    nameFa: 'ماساژور سنگ گواشا و رولر جید طبیعی',
    nameEn: 'Natural Green Jade Roller & Gua Sha Sculpting Set',
    brand: 'VARA',
    productType: 'device',
    category: 'anti-aging',
    skinTypes: ['dry', 'sensitive', 'normal', 'combination', 'oily'],
    concerns: ['anti-aging', 'soothing'],
    routines: ['morning', 'night', 'anti-aging'],
    ingredientTags: ['jade-stone', 'crystal', 'lymphatic-drainage'],
    descriptionFa: 'ست دوتایی دست‌تراش سنگ جید (یشم سبز اصل). بهبود جریان لنفاوی صورت، زاویه‌سازی فک و گونه، جذب ۳ برابری سرم‌ها و تسکین استرس و پف صورت.',
    descriptionEn: '100% natural authentic jade facial roller and gua sha stone for facial sculpting, lymphatic drainage, and lifting.',
    price: 680000,
    originalPrice: 850000,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=800&auto=format&fit=crop'
    ],
    sizes: [
      { label: 'ست کامل با جعبه مخملی', labelEn: 'Complete Set', price: 680000, originalPrice: 850000 }
    ],
    keyIngredients: [
      {
        nameFa: 'سنگ یشم طبیعی ۱۰۰٪ معدنی',
        nameEn: 'Authentic Mineral Jade Stone',
        description: 'حفظ خنکی طبیعی و ایجاد جریان انرژی مثبت در پوست.'
      }
    ],
    usageRoutine: {
      morning: 'برای رفع پف صبحگاهی با زاویه ۱۵ درجه از مرکز صورت به بیرون کشیده شود.',
      night: 'همراه با روغن اکسیر جوانسازی برای ماساژ آرامش‌بخش شبانه.'
    },
    badges: ['سنگ طبیعی ۱۰۰٪', 'جعبه کادویی لوکس', 'زاویه‌سازی صورت'],
    isNew: true,
    inStock: true,
    stockCount: 14,
    authenticity: 'سنگ جید طبیعی معدنی بدون رزین و رنگ شیمیایی با شناسنامه سنگ‌شناسی',
    sourcingOrigin: 'برمه و کوهستان‌های هیمالیا',
    expiryDate: 'مادام‌العمر',
    targetAudience: 'افراد علاقه‌مند به زاویه‌سازی طبیعی صورت، لیفت بدون جراحی، ماساژ و یوگای صورت',
    unsuitableFor: 'نامناسب برای نواحی دارای آکنه التهابی برجسته کیستیک، مویرگ‌های عنکبوتی پاره‌شده و تا ۲ هفته پس از تزریق بوتاکس یا ژل.'
  }
];
