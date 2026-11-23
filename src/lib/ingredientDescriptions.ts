export interface IngredientDetail {
  nameFa: string;
  nameEn?: string;
  description?: string;
}

const GENERIC_PLACEHOLDERS = new Set([
  '',
  'تغذیه عمیق و تقویت ساختار طبیعی پوست',
  'تغذیه عمیق پوست',
  'ترکیب فعال مراقبت از پوست',
  'ماده موثره فعال جهت بهبود بافت و سلامت پوست',
]);

export function isGenericIngredientDescription(desc?: string): boolean {
  if (!desc) return true;
  const trimmed = desc.trim().replace(/\.$/, '');
  return GENERIC_PLACEHOLDERS.has(trimmed);
}

interface ClinicalEntry {
  keywords: string[];
  nameEn: string;
  description: string;
}

const CLINICAL_INGREDIENT_DICTIONARY: ClinicalEntry[] = [
  {
    keywords: ['نیاسینامید', 'niacinamide', 'ویتامین b3', 'vitamin b3'],
    nameEn: 'Niacinamide (Vitamin B3)',
    description: 'تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره.'
  },
  {
    keywords: ['هیالورونیک اسید', 'اسید هیالورونیک', 'hyaluronic acid', 'سدیم هیالورونات', 'sodium hyaluronate', 'هیالورونیک'],
    nameEn: 'Hyaluronic Acid',
    description: 'جذب و نگهداری رطوبت تا ۱۰۰۰ برابر وزن مولکولی خود در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی.'
  },
  {
    keywords: ['سنتلا آسیاتیکا', 'عصاره سنتلا', 'سنتلا', 'سیکا', 'centella', 'cica', 'مادکاسوساید', 'مادکاسیک', 'آسیاتیکوزاید', 'آسیاتیک اسید'],
    nameEn: 'Centella Asiatica (Cica)',
    description: 'تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده.'
  },
  {
    keywords: ['سرامید np', 'سرامید ap', 'سرامید eop', 'سرامید', 'ceramide'],
    nameEn: 'Ceramides (NP/AP/EOP)',
    description: 'بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب (TEWL) و نفوذ عوامل محرک محیطی.'
  },
  {
    keywords: ['پانتنول', 'دکسپانتنول', 'panthenol', 'پرو ویتامین b5', 'ویتامین b5', 'vitamin b5'],
    nameEn: 'Panthenol (Pro-Vitamin B5)',
    description: 'مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند.'
  },
  {
    keywords: ['سالیسیلیک اسید', 'اسید سالیسیلیک', 'salicylic acid', 'bha', 'بتائین سالیسیلات', 'betaine salicylate'],
    nameEn: 'Salicylic Acid (BHA)',
    description: 'لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش‌های سرسیاه و آکنه.'
  },
  {
    keywords: ['رتینول', 'retinol', 'رتینال', 'retinal', 'رتینوئید'],
    nameEn: 'Retinol (Vitamin A)',
    description: 'تحریک نوسازی سلولی و کلاژن‌سازی در لایه درم، کاهش چین‌وچروک‌های ظریف، بهبود بافت پوست و کمرنگ کردن لک‌های تیره.'
  },
  {
    keywords: ['باکوچیول', 'bakuchiol'],
    nameEn: 'Bakuchiol',
    description: 'جایگزین گیاهی و ملایم رتینول که بدون ایجاد حساسیت یا پوسته‌ریزی، تولید کلاژن را تحریک کرده و خاصیت ارتجاعی پوست را افزایش می‌دهد.'
  },
  {
    keywords: ['ویتامین c', 'ویتامین سی', 'vitamin c', 'اسکوربیک اسید', 'ascorbic acid'],
    nameEn: 'Vitamin C (Ascorbic Acid)',
    description: 'آنتی‌اکسیدان قدرتمند جهت خنثی‌سازی رادیکال‌های آزاد، مهار آنزیم تیروزیناز برای کاهش لک و افزایش درخشش و کلاژن‌سازی پوست.'
  },
  {
    keywords: ['ویتامین e', 'ویتامین ای', 'vitamin e', 'توکوفرول', 'tocopherol'],
    nameEn: 'Tocopherol (Vitamin E)',
    description: 'آنتی‌اکسیدان محلول در چربی که از غشای سلولی در برابر استرس اکسیداتیو و اشعه UV محافظت کرده و نرمی پوست را حفظ می‌کند.'
  },
  {
    keywords: ['آزلائیک اسید', 'اسید آزلائیک', 'azelaic acid'],
    nameEn: 'Azelaic Acid',
    description: 'ترکیب ضدالتهاب و آنتی‌باکتریال که قرمزی ناشی از روزاسه و آکنه را کاهش داده و لک‌های جای جوش (PIH) را به طور هدفمند روشن می‌کند.'
  },
  {
    keywords: ['گلیکولیک اسید', 'اسید گلیکولیک', 'glycolic acid', 'aha'],
    nameEn: 'Glycolic Acid (AHA)',
    description: 'آلفا هیدروکسی اسید با وزن مولکولی پایین که پیوند سلول‌های مرده سطح پوست را حل کرده و باعث شفافیت، صافی و نوسازی اپیدرم می‌شود.'
  },
  {
    keywords: ['لاکتیک اسید', 'اسید لاکتیک', 'lactic acid'],
    nameEn: 'Lactic Acid (AHA)',
    description: 'لایه‌بردار ملایم و آبرسان که ضمن حذف سلول‌های کدر سطحی، فاکتورهای مرطوب‌کننده طبیعی پوست (NMF) را تقویت می‌کند.'
  },
  {
    keywords: ['پپتید', 'پپتاید', 'peptide', 'ماتریکسیل', 'آرجیرلین'],
    nameEn: 'Bio-Active Peptides',
    description: 'زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط 표정 کمک می‌کنند.'
  },
  {
    keywords: ['موسین حلزون', 'ترشحات حلزون', 'حلزون', 'snail mucin', 'snail'],
    nameEn: 'Snail Secretion Filtrate',
    description: 'سرشار از گلیکوپروتئین‌ها، هیالورونیک اسید و گلیکولیک اسید طبیعی جهت ترمیم بافت آسیب‌دیده، آبرسانی عمیق و افزایش الاستیسیته پوست.'
  },
  {
    keywords: ['زینک pca', 'zinc pca', 'زینک اکساید', 'zinc oxide', 'زینک'],
    nameEn: 'Zinc PCA / Zinc Oxide',
    description: 'کنترل‌کننده ترشح غدد چربی و مهارکننده باکتری‌های مولد آکنه همراه با خاصیت ضدالتهاب و التیام‌بخشی پوست.'
  },
  {
    keywords: ['آربوتین', 'آلفا آربوتین', 'arbutin', 'alpha arbutin'],
    nameEn: 'Alpha-Arbutin',
    description: 'روشن‌کننده ایمن و هدفمند که با مهار تدریجی آنزیم تیروزیناز، تولید ملانین اضافی، ملاسما و لک‌های آفتاب را کاهش می‌دهد.'
  },
  {
    keywords: ['ترانگزامیک اسید', 'ترانکسامیک اسید', 'tranexamic acid'],
    nameEn: 'Tranexamic Acid',
    description: 'مهارکننده مسیرهای التهابی تولید رنگدانه که در درمان لک‌های مقاوم، ملاسما و تیرگی‌های پس از جوش اثربخشی بالینی دارد.'
  },
  {
    keywords: ['آلانتوئین', 'allantoin'],
    nameEn: 'Allantoin',
    description: 'ترکیب التیام‌بخش و ضدتحریک که ضمن نرم کردن لایه شاخی، بازسازی بافتی را تسریع کرده و قرمزی پوست را آرام می‌کند.'
  },
  {
    keywords: ['بتاگلوکان', 'بتا گلوکان', 'beta-glucan', 'beta glucan'],
    nameEn: 'Beta-Glucan',
    description: 'پلی‌ساکارید آبرسان و ترمیم‌کننده که رطوبت‌رسانی عمیق‌تر از هیالورونیک اسید فراهم کرده و سیستم ایمنی سد دفاعی پوست را تقویت می‌کند.'
  },
  {
    keywords: ['اسکوالان', 'اسکوالن', 'squalane'],
    nameEn: 'Plant-Derived Squalane',
    description: 'امولینت بیومیمتیک و غیرکومدوژنیک مشابه سبوم طبیعی پوست که بدون ایجاد حس سنگینی، رطوبت را قفل و نرمی پوست را بازیابی می‌کند.'
  },
  {
    keywords: ['کافئین', 'caffeine'],
    nameEn: 'Caffeine',
    description: 'بهبود گردش خون مویرگی، کاهش احتباس مایعات و پف زیر چشم، و محافظت آنتی‌اکسیدانی در برابر خستگی و کدری پوست.'
  },
  {
    keywords: ['چای سبز', 'green tea', 'کاتچین', 'egcg'],
    nameEn: 'Camellia Sinensis (Green Tea) Extract',
    description: 'سرشار از پلی‌فنول‌ها و آنتی‌اکسیدان EGCG جهت مهار التهاب، تنظیم چربی و محافظت از سلول‌ها در برابر استرس محیطی.'
  },
  {
    keywords: ['روغن آرگان', 'آرگان', 'argan'],
    nameEn: 'Argania Spinosa Kernel Oil',
    description: 'غنی از اسیدهای چرب ضروری امگا و ویتامین E برای تغذیه عمیق، رفع خشکی و افزایش لطافت و انعطاف‌پذیری پوست و مو.'
  },
  {
    keywords: ['جوجوبا', 'jojoba'],
    nameEn: 'Simmondsia Chinensis (Jojoba) Seed Oil',
    description: 'تنظیم‌کننده چربی با ساختار مومی شبیه سبوم طبیعی پوست که رطوبت را حفظ کرده و بدون مسدود کردن منافذ پوست را تغذیه می‌کند.'
  },
  {
    keywords: ['کلاژن', 'collagen'],
    nameEn: 'Hydrolyzed Collagen',
    description: 'ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و شادابی پوست و کاهش نمای ظاهری خطوط ریز.'
  },
  {
    keywords: ['گلیسیرین', 'گلیسرین', 'glycerin'],
    nameEn: 'Glycerin',
    description: 'هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند.'
  },
  {
    keywords: ['اکتوئین', 'ectoin'],
    nameEn: 'Ectoin',
    description: 'مولکول محافظت‌کننده سلولی (اکسترمولیت) که با ایجاد سپر آبی پیرامون سلول‌ها، از پوست در برابر آلودگی هوا، نور آبی و دهیدراتگی محافظت می‌کند.'
  },
  {
    keywords: ['برنج', 'سبوس برنج', 'rice'],
    nameEn: 'Oryza Sativa (Rice) Bran Extract',
    description: 'غنی از آمینواسیدها، فرولیک اسید و اینوزیتول جهت روشن‌کنندگی طبیعی، تغذیه ملایم و ایجاد درخشش شیشه‌ای در پوست.'
  },
  {
    keywords: ['جینسینگ', 'جینسنگ', 'ginseng'],
    nameEn: 'Panax Ginseng Root Extract',
    description: 'سرشار از جینسنوزیدهای انرژی‌بخش و آنتی‌اکسیدان که گردش خون سطحی و استحکام پوست را تقویت کرده و علائم خستگی را رفع می‌کند.'
  },
  {
    keywords: ['شیرین بیان', 'شیرین‌بیان', 'licorice', 'گلابریدین'],
    nameEn: 'Glycyrrhiza Glabra (Licorice) Root Extract',
    description: 'حاوی گلابریدین با خاصیت ضدلک و ضدالتهاب قوی که تیرگی‌ها و قرمزی پوست را به شکلی ملایم و موثر کاهش می‌دهد.'
  },
  {
    keywords: ['درخت چای', 'تی تری', 'tea tree'],
    nameEn: 'Melaleuca Alternifolia (Tea Tree) Leaf Oil',
    description: 'ترکیب آنتی‌باکتریال و ضدالتهاب طبیعی که باکتری‌های مولد آکنه را کنترل کرده و التهاب جوش‌های فعال را به سرعت تسکین می‌دهد.'
  },
  {
    keywords: ['آلوئه ورا', 'آلوئه‌ورا', 'aloe vera', 'آلوئه'],
    nameEn: 'Aloe Barbadensis Leaf Extract',
    description: 'آبرسان، خنک‌کننده و التیام‌بخش فوری پوست‌های ملتهب و آفتاب‌سوخته به واسطه پلی‌ساکاریدها و ویتامین‌های طبیعی.'
  },
  {
    keywords: ['بابونه', 'chamomile', 'بیزابولول', 'bisabolol'],
    nameEn: 'Chamomilla Recutita / Bisabolol',
    description: 'آرام‌بخش قوی پوست‌های حساس و واکنش‌پذیر که التهاب، قرمزی و تحریکات پوستی را مهار می‌کند.'
  },
  {
    keywords: ['بره موم', 'بره‌موم', 'پروپولیس', 'propolis'],
    nameEn: 'Propolis Extract',
    description: 'ترکیب آنتی‌اکسیدان، آنتی‌باکتریال و مغذی که به بازسازی سد پوستی، بهبود جوش‌ها و ایجاد درخشندگی سالم کمک می‌کند.'
  },
  {
    keywords: ['هارت لیف', 'هارت‌لیف', '어가성초', 'heartleaf', 'houttuynia'],
    nameEn: 'Houttuynia Cordata (Heartleaf) Extract',
    description: 'تسکین‌دهنده تخصصی قرمزی و التهاب، متعادل‌کننده چربی و آرام‌بخش پوست‌های مستعد آکنه و حساس.'
  },
  {
    keywords: ['گل سرخ', 'رز', 'گلاب', 'rose'],
    nameEn: 'Rosa Damascena Flower Water / Oil',
    description: 'طراوت‌بخش، متعادل‌کننده pH و سرشار از آنتی‌اکسیدان‌های طبیعی جهت شادابی و لطافت بافت پوست.'
  },
  {
    keywords: ['شی باتر', 'کره شی', 'shea butter'],
    nameEn: 'Butyrospermum Parkii (Shea) Butter',
    description: 'تغذیه‌کننده غنی از اسیدهای چرب و ویتامین‌های A و E که خشکی شدید را برطرف کرده و سد لیپیدی پوست را نرم و مقاوم می‌سازد.'
  }
];

export function lookupClinicalIngredient(rawNameFa: string): { nameEn: string; description: string } | null {
  if (!rawNameFa) return null;
  const normalized = rawNameFa
    .toLowerCase()
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim();

  for (const entry of CLINICAL_INGREDIENT_DICTIONARY) {
    for (const kw of entry.keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        return {
          nameEn: entry.nameEn,
          description: entry.description
        };
      }
    }
  }
  return null;
}

export function enrichIngredientsLocally(
  ingredients: IngredientDetail[]
): { enriched: IngredientDetail[]; needsAiNames: string[] } {
  const needsAiNames: string[] = [];
  const enriched = ingredients.map((item) => {
    const cleanName = (item.nameFa || '').trim();
    if (!cleanName) return item;

    const hasCustomDesc = !isGenericIngredientDescription(item.description);
    const hasEn = Boolean(item.nameEn && item.nameEn.trim());

    if (hasCustomDesc && hasEn) {
      return item;
    }

    const dictMatch = lookupClinicalIngredient(cleanName);
    if (dictMatch) {
      return {
        nameFa: cleanName,
        nameEn: hasEn ? item.nameEn : dictMatch.nameEn,
        description: hasCustomDesc ? item.description : dictMatch.description,
      };
    }

    if (!hasCustomDesc) {
      needsAiNames.push(cleanName);
    }

    return {
      ...item,
      nameFa: cleanName,
    };
  });

  return { enriched, needsAiNames };
}
