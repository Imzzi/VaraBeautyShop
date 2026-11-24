import { Product } from '../types';

/**
 * Curated skincare catalog imported and aligned with VaraBeautyShop schema (+5% Toman pricing).
 * Synced once per version into Turso/libSQL via serverDb.ts.
 */
export const IMPORTED_SKINCARE_PRODUCTS: Product[] = [
  {
    "id": "product-pori-652",
    "nameFa": "اسکراب لب بابل باف شیگلم",
    "nameEn": "SHEGLAM Bubble Buff Lip Scrub",
    "brand": "SHEGLAM",
    "productType": "lip-care",
    "category": "cleanser",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination"
    ],
    "concerns": [
      "hydration",
      "soothing"
    ],
    "routines": [
      "night",
      "minimal"
    ],
    "routineStep": "مراقبت تخصصی لب: لایه‌برداری ملایم",
    "howToUse": "مقدار کمی از اسکراب را روی لب‌های مرطوب بمالید، ۳۰ ثانیه به‌آرامی ماساژ دهید تا به فوم ملایم تبدیل شود و سپس با آب ولرم بشویید. هفته‌ای ۲ تا ۳ بار.",
    "ingredientTags": [
      "glycerin",
      "jojoba-plant-oils"
    ],
    "descriptionFa": "تنها در ۳۰ ثانیه لطافت و تمیزی لب‌ها تجربه کنید! این اسکراب لب با بافت ژلی خود به حالت فومی درمی‌آید تا باقی‌مانده آرایش را پاک کرده و به‌آرامی لایه‌برداری کند، در نتیجه لب‌هایی نرم و مرطوب به جا می‌گذارد. با طعم‌های طراوت‌بخش و ترکیبی از عصاره‌های مغذی، این محصول لب‌ها را نرم کرده، خطوط را صاف می‌کند و رطوبتی ماندگار به آن‌ها می‌بخشد\n\n- یکدست سازی پوست لب در 30 ثانیه\n\n- بافت ژلی\n\n- با کف ایجاد شده بقایای آرایش را پاک و به آرامی لایه برداری می کند\n\n- لب ها را صاف و هیدراته می کند\n\n- طعم‌های طراوت‌بخش\n\n- ترکیبی از عصاره‌های مغذی\n\n- خشکی لب را از بین برده و لب را نرم و صاف می‌کند\n\n- رطوبت ماندگار را به ارمغان می‌آورد.\n\n- بدون الکل، کرولتی فری، وگان",
    "descriptionEn": "A 30-second gel-to-foam lip scrub that gently exfoliates dry skin, removes makeup residue, and leaves lips smooth and hydrated.",
    "price": 1072000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1005/58a537c8ed89887fde2c74ffc43a925d.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1006/a3249bcc683c34037a78eb3a0f2776ec.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۸ گرم",
        "labelEn": "8 g",
        "price": 1072000
      }
    ],
    "variants": [
      {
        "id": "var-pori-722",
        "name": "وزن ۸ گرم",
        "nameEn": "8 g",
        "price": 1072000,
        "stockCount": 7,
        "sku": "IN1746142889"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی سبک",
        "nameEn": "Botanical Cleansing Oils Complex",
        "description": "انحلال کامل ضدآفتاب، سبوم و آرایش مقاوم از منافذ بدون ایجاد کدری یا بستن منافذ."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "مقدار کمی از اسکراب را روی لب‌های مرطوب بمالید، ۳۰ ثانیه به‌آرامی ماساژ دهید تا به فوم ملایم تبدیل شود و سپس با آب ولرم بشویید. هفته‌ای ۲ تا ۳ بار."
    },
    "badges": [
      "وگان",
      "بدون الکل",
      "کرولتی‌فری"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 7,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "افراد دارای خشکی، پوسته‌پوسته شدن یا تیرگی سطحی لب و قبل از زدن رژلب مات.",
    "unsuitableFor": "روی لب‌های دارای زخم باز، ترک عمیق یا تبخال فعال استفاده نشود."
  },
  {
    "id": "product-pori-185",
    "nameFa": "کرم ترمیم‌کننده پا اوسرین مدل Advanced Repair",
    "nameEn": "Eucerin Advanced Repair Foot Cream",
    "brand": "Eucerin",
    "productType": "hair-body",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "soothing"
    ],
    "routines": [
      "night",
      "hydration",
      "barrier-repair"
    ],
    "routineStep": "مراقبت تخصصی بدن: ترمیم و آبرسانی پا",
    "howToUse": "روزانه ۱ تا ۲ بار روی پوست تمیز و خشک پا به‌ویژه پاشنه‌ها ماساژ دهید تا کامل جذب شود.",
    "ingredientTags": [
      "ceramide",
      "glycolic-acid",
      "urea"
    ],
    "descriptionFa": "کرم ترمیم کننده پا اوسرین به طور اختصاصی برای پاها طراحی شده است.\n\nاگر پوست پاهایتان خیلی خشک و زبر است این محصول برای شما طراحی شده تا رطوبت بالایی که برای نرم و لطیف شدن پاهایتان لازم است را به آنها برساند.\n\nپوست های خیلی خشک را ترمیم کرده و التهابات پوست حساس و خشک را التیام می بخشد.\n\nاین کرم سرشار از عوامل رطوبت رسانی همچون سرامید-3 و سایر فاکتور های رطوبت رسان طبیعی است که به سرعت سد رطوبتی پوست را ترمیم می کند و سبب حفظ طولانی مدت رطوبت در پوست می شود.\n\nحاوی آلفا هیدروکسی اسید (AHA) است که پوست پا را لایه برداری کرده و موجب جذب بهتر رطوبت می شود.\n\nبه سرعت جذب پوست شده و در عین مرطوب کنندگی بالایی که دارد اما روی پوست احساس سنگینی و چربی ایجاد نمی کند.\n\nفاقد عطر، رنگ و پارابن است و برای پوست های حساس کاملا مناسب است.",
    "descriptionEn": "Fast-absorbing intensive foot cream enriched with Ceramide-3 and gentle AHA to repair severely dry, rough skin on feet.",
    "price": 2501000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/252/94ee73f6b25a46441f9514dd19344683.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۸۵ میلی‌لیتر",
        "labelEn": "85 ml",
        "price": 2501000
      }
    ],
    "variants": [
      {
        "id": "var-pori-206",
        "name": "حجم ۸۵ میلی‌لیتر",
        "nameEn": "85 ml",
        "price": 2501000,
        "stockCount": 6,
        "sku": "IN1714164115"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "آلفا هیدروکسی اسید (AHA)",
        "nameEn": "Glycolic Acid (AHA)",
        "description": "حل کردن پیوند سلول‌های مرده سطح پوست برای شفافیت، یکدست‌سازی بافت و کاهش لک‌ها و جوش‌های سرسفید."
      },
      {
        "nameFa": "اوره (Urea)",
        "nameEn": "Urea",
        "description": "هومکتانت و کراتولیتیک ملایم که ضمن جذب رطوبت، پوست ضخیم و پوسته‌پوسته‌شده را نرم و هموار می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "روزانه ۱ تا ۲ بار روی پوست تمیز و خشک پا به‌ویژه پاشنه‌ها ماساژ دهید تا کامل جذب شود."
    },
    "badges": [
      "فاقد عطر و پارابن",
      "مناسب پوست حساس",
      "جذب سریع"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه / آلمان",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "افراد با پوست خشک، زبر و ترک‌دار پا که به آبرسانی سریع بدون چربی نیاز دارند.",
    "unsuitableFor": "روی زخم‌های باز یا ترک‌های عمیق خون‌ریزی‌دهنده استفاده نشود؛ بیماران دیابتی پیش از مصرف با پزشک مشورت کنند."
  },
  {
    "id": "product-pori-1060",
    "nameFa": "کرم مرطوب‌کننده و آبرسان کاسه‌ای سراوی مناسب پوست خشک",
    "nameEn": "CeraVe Moisturizing Cream for Dry to Very Dry Skin",
    "brand": "CeraVe",
    "productType": "moisturizer",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "sensitive"
    ],
    "routines": [
      "morning",
      "night",
      "hydration",
      "barrier-repair",
      "minimal"
    ],
    "routineStep": "گام ۵: مرطوب‌کننده و آبرسان",
    "howToUse": "صبح و شب پس از شست‌وشو و سرم، مقدار کافی از کرم را روی پوست کمی مرطوب صورت یا بدن ماساژ دهید تا جذب شود.",
    "ingredientTags": [
      "hyaluronic-acid",
      "ceramide",
      "glycerin"
    ],
    "descriptionFa": "کرم آبرسان و مرطوب کننده سراوی کاسه ای پوست خشک\n\nپوست خود را با قدرت احیاکننده کرم مرطوب‌کننده CeraVe بپوشانید. این مرطوب‌کننده قدرتمند که برای انواع پوست خشک تا خیلی خشک ایده‌آل است، برای رفع چین و چروک با یک آبرسانی فوری طراحی شده است.\n\nاین فرمول غنی و بدون چربی که سرشار از خواص محافظتی است، با 3 سرامید ضروری (1، 3 و 6-II) تقویت شده است تا به آبرسانی سد طبیعی پوست کمک کند. این کرم چند منظوره صورت و بدن که با فناوری ثبت اختراع شده MVE ساخته شده است، مواد مغذی را تا 24 ساعت به پوست می‌رساند. اسید هیالورونیک به دلیل فواید آبرسانی خود شناخته شده است و تلاش می‌کند لایه‌ای از رطوبت را در پوست حفظ کرده و از سد پوستی محافظت کند.\n\nاین مرطوب‌کننده با جذب سریع که روزانه استفاده می‌شود، بدون ایجاد لایه‌ای چرب، به راحتی روی پوست پخش می‌شود. این کرم مرطوب‌کننده که با هر بار استفاده نتایج نرم و راحتی را به ارمغان می‌آورد، برای استفاده روی صورت و بدن مناسب است.\n\n- مرطوب کننده و آبرسان\n\n- بهبود خشکی و کم آبی پوست\n\n- تقویت کننده و تغذیه کننده\n\n- افزایش شادابی و سلامت پوست\n\n- دارای بافت سبک و زود جذب\n\n- قابل استفاده روی پوست صورت و بدن\n\n- حاوی هیالورنیک اسید و سرامیدهای ضروری\n\n- بهبود سد دفاعی پوست\n\n- بدون بسته شدن منافذ\n\n- دارای فناوری MVE\n\n- حفظ رطوبت تا طولانی مدت\n\n- افزایش خاصیت انعطاف پذیری پوست\n\n- مناسب پوست نرمال تا خشک\n\n- فاقد چربی و عطر\n\n- تایید شده توسط انجمن اگزما\n\n- غیر کومدون زا",
    "descriptionEn": "Rich non-greasy moisturizing cream with 3 essential ceramides, hyaluronic acid, and MVE technology for 24-hour hydration on face and body.",
    "price": 5732000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1913/503a0b7c89ced2843e7c25048733efae.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1915/ff4c4b4a00b7414882619b0ebeb79bb0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1914/7a8fec55c2f5bbf7658fdee8a69c9e63.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۴۵۴ گرم (کاسه‌ای)",
        "labelEn": "454 g",
        "price": 5732000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1717",
        "name": "وزن ۴۵۴ گرم (کاسه‌ای)",
        "nameEn": "454 g",
        "price": 5732000,
        "stockCount": 5,
        "sku": "IN1792430271"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از شست‌وشو و سرم، مقدار کافی از کرم را روی پوست کمی مرطوب صورت یا بدن ماساژ دهید تا جذب شود.",
      "night": "صبح و شب پس از شست‌وشو و سرم، مقدار کافی از کرم را روی پوست کمی مرطوب صورت یا بدن ماساژ دهید تا جذب شود."
    },
    "badges": [
      "فناوری MVE",
      "فاقد عطر",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 5,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "اسپانیا",
    "expiryDate": "۲۰۲۸/۰۲",
    "targetAudience": "پوست‌های خشک تا خیلی خشک، دهیدراته، حساس و مستعد اگزما برای صورت و بدن.",
    "unsuitableFor": "برای پوست‌های بسیار چرب و مستعد آکنه روی ناحیه T صورت ممکن است بیش از حد غنی باشد."
  },
  {
    "id": "product-pori-1505",
    "nameFa": "کرم ترمیم‌کننده قوی دست سراوی مناسب پوست بسیار خشک",
    "nameEn": "CeraVe Reparative Hand Cream",
    "brand": "CeraVe",
    "productType": "hair-body",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "sensitive"
    ],
    "routines": [
      "morning",
      "night",
      "barrier-repair"
    ],
    "routineStep": "مراقبت تخصصی دست: ترمیم سد دفاعی",
    "howToUse": "پس از هر بار شست‌وشوی دست و هر زمان که احساس خشکی یا کشیدگی داشتید روی دست‌ها ماساژ دهید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "ceramide"
    ],
    "descriptionFa": "کرم ترمیم کننده قوی پوست دست شدیدا خشک سراوی\n\nکرم ترمیم کننده دست سراوی CeraVe Reparative Hand Cream 50ml محصولی مناسب برای مراقبت از پوست خشک، زبر و آسیب‌دیده دست است که به آبرسانی و تقویت سد دفاعی پوست کمک می‌کند. این کرم با فرمولاسیونی حاوی ۳ سرامید ضروری، هیالورونیک اسید و نیاسینامید ، رطوبت مورد نیاز پوست را تأمین کرده و به حفظ نرمی و لطافت دست‌ها کمک می‌کند.\n\nپوست دست به دلیل شست‌وشوی مکرر، استفاده از مواد شوینده، تغییرات آب‌وهوایی و تماس مداوم با عوامل محیطی، بیشتر از بسیاری از قسمت‌های بدن در معرض خشکی و آسیب قرار دارد. استفاده منظم از یک کرم مرطوب‌کننده و ترمیم‌کننده می‌تواند به کاهش خشکی و احساس کشیدگی پوست کمک کرده و ظاهر سالم‌تری به دست‌ها ببخشد.\n\nویژگی‌های کرم ترمیم کننده دست CeraVe\n\nمناسب پوست خشک و خیلی خشک دست\n\nکمک به ترمیم و تقویت سد دفاعی پوست\n\nآبرسان و مرطوب‌کننده پوست\n\nحاوی ۳ سرامید ضروری\n\nحاوی هیالورونیک اسید برای کمک به حفظ رطوبت پوست\n\nحاوی نیاسینامید با خاصیت تسکین‌دهنده\n\nکمک به کاهش احساس خشکی، زبری و کشیدگی پوست\n\nدارای بافت کرمی و مناسب استفاده روزانه\n\nمناسب برای استفاده پس از شست‌وشوی دست\n\nفاقد عطر\n\nغیر کومدون‌زا\n\nمناسب پوست‌های حساس و خشک\n\nترکیبات مؤثر\n\nسرامیدها\n\nسرامیدها از ترکیبات مهم تشکیل‌دهنده سد طبیعی پوست هستند. وجود سرامیدهای ضروری در این محصول به حفظ و تقویت سد دفاعی پوست و جلوگیری از از دست رفتن رطوبت کمک می‌کند.\n\nهیالورونیک اسید\n\nهیالورونیک اسید به جذب و حفظ رطوبت در پوست کمک کرده و باعث می‌شود پوست دست نرم‌تر و لطیف‌تر احساس شود.\n\nنیاسینامید\n\nنیاسینامید یکی از ترکیبات شناخته‌شده در محصولات مراقبت از پوست است که می‌تواند به آرامش پوست و تقویت عملکرد سد پوستی کمک کند.\n\nکرم دست سراوی برای چه افرادی مناسب است؟\n\nکرم دست CeraVe گزینه‌ای مناسب برای افرادی است که پوست دستشان در اثر شست‌وشوی مکرر، استفاده از مواد شوینده، هوای سرد یا خشک و عوامل محیطی دچار خشکی و زبری می‌شود.\n\nهمچنین افرادی که به دنبال یک کرم دست روزانه با تمرکز بر آبرسانی و تقویت سد دفاعی پوست هستند، می‌توانند از این محصول در روتین مراقبت از دست خود استفاده کنند.\n\nنحوه استفاده\n\nمقدار مناسبی از کرم را روی دست‌های تمیز و خشک بزنید و به‌آرامی ماساژ دهید تا جذب شود.\n\nبرای نتیجه بهتر، استفاده از کرم را به‌خصوص پس از شست‌وشوی دست‌ها و هر زمان که احساس خشکی یا کشیدگی داشتید، تکرار کنید.\n\nبافت و حس روی پوست\n\nکرم ترمیم کننده دست سراوی دارای بافتی کرمی و مرطوب‌کننده است و برای استفاده روزانه طراحی شده است. این محصول بدون عطر بوده و به حفظ رطوبت پوست کمک می‌کند، بدون اینکه نیاز به استفاده از محصولات متعدد برای مراقبت از دست داشته باشید.\n\nچرا کرم ترمیم کننده دست سراوی؟\n\nاگر پوست دستتان مرتباً خشک، زبر یا کشیده می‌شود، استفاده از یک محصول حاوی ترکیبات تقویت‌کننده سد پوستی می‌تواند بخش مهمی از مراقبت روزانه باشد. CeraVe Reparative Hand Cream با ترکیب سرامیدهای ضروری، هیال",
    "descriptionEn": "Protective hand cream formulated with 3 essential ceramides, hyaluronic acid, and niacinamide to soothe and restore severely dry hands.",
    "price": 4026000,
    "originalPrice": 4358000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4268/6e6cbc2d9326c41f7d7014ee8e9f6813.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4270/b65f21c3efdb21afc99b260373d83909.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4269/7e02fc4609841e22263e2bc030811857.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 4026000,
        "originalPrice": 4358000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1656",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 4026000,
        "originalPrice": 4358000,
        "stockCount": 4,
        "sku": "IN1790655404"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      }
    ],
    "usageRoutine": {
      "morning": "پس از هر بار شست‌وشوی دست و هر زمان که احساس خشکی یا کشیدگی داشتید روی دست‌ها ماساژ دهید.",
      "night": "پس از هر بار شست‌وشوی دست و هر زمان که احساس خشکی یا کشیدگی داشتید روی دست‌ها ماساژ دهید."
    },
    "badges": [
      "فاقد عطر",
      "غیرکومدوژنیک",
      "تایید متخصصین پوست"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "دست‌های خشک، زبر و آسیب‌دیده در اثر شست‌وشوی مکرر، مواد شوینده یا هوای سرد.",
    "unsuitableFor": "روی بریدگی‌ها و زخم‌های باز عمیق استفاده نشود."
  },
  {
    "id": "product-pori-1503",
    "nameFa": "پچ ضدجوش خیلی قوی کوزارکس مدل Master Patch Intensive",
    "nameEn": "COSRX Master Patch Intensive (36 Patches)",
    "brand": "COSRX",
    "productType": "mask",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "acne-blemish",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "مراقبت هدفمند: پچ موضعی ضدجوش",
    "howToUse": "روی پوست تمیز و کاملاً خشک (قبل از سرم و کرم) پچ را مستقیم روی جوش قرار داده و چند ثانیه فشار دهید. پس از سفید و متورم شدن تعویض کنید.",
    "ingredientTags": [
      "tea-tree",
      "hydrocolloid"
    ],
    "descriptionFa": "مستر پچ ضدجوش خیلی قوی کوزارکس\n\nCOSRX Master Patch Intensive یک پچ ضدجوش هیدروکلوئیدی با عملکرد سریع و هدفمند است که برای کمک به بهبود جوش‌های التهابی و فعال طراحی شده است. این پچ با پوشاندن جوش، از تماس دست، آلودگی و تحریکات محیطی جلوگیری می‌کند و به جذب ترشحات و ناخالصی‌های موجود در جوش کمک می‌کند.\n\nاگر به دنبال محصولی کاربردی برای کنترل جوش‌های ناگهانی، کاهش ظاهر التهاب و جلوگیری از دستکاری جوش هستید، مستر پچ اینتنس کوزارکس می‌تواند گزینه‌ای مناسب برای استفاده در روتین مراقبت از پوست باشد.\n\nویژگی‌های COSRX Master Patch Intensive\n\n- مناسب برای جوش‌های فعال و التهابی\n\n- کمک به جذب ترشحات و ناخالصی‌های جوش\n\n- ایجاد یک لایه محافظ روی جوش\n\n- کمک به کاهش ظاهر قرمزی و التهاب\n\n- جلوگیری از لمس و دستکاری جوش\n\n- مناسب برای استفاده موضعی و هدفمند\n\n- دارای طراحی نازک و چسبندگی مناسب\n\n- قابل استفاده در طول روز یا شب\n\n- مناسب برای انواع پوست، به‌ویژه پوست‌های مستعد جوش\n\nپچ ضدجوش کوزارکس چگونه عمل می‌کند؟\n\nاین محصول از هیدروکلوئید ساخته شده است. هیدروکلوئید با قرار گرفتن روی جوش، محیطی محافظ ایجاد می‌کند و می‌تواند به جذب مایعات و ترشحات سطحی جوش کمک کند.\n\nپچ همچنین مانند یک سد محافظ عمل می‌کند و مانع تماس مستقیم دست با ناحیه جوش می‌شود؛ موضوعی که می‌تواند به کاهش دستکاری جوش و تحریک بیشتر پوست کمک کند.\n\nمناسب چه نوع جوش‌هایی است؟\n\nCOSRX Master Patch Intensive بیشتر برای جوش‌های فعال و سطحی که دارای التهاب یا ترشح هستند کاربرد دارد. این محصول برای جوش‌های زیرپوستی عمیق یا مشکلات گسترده و مزمن آکنه، جایگزین درمان تخصصی پوست نیست.\n\nروش استفاده\n\n1. ابتدا صورت خود را با شوینده مناسب بشویید.\n\n2. پوست ناحیه موردنظر را کاملاً خشک کنید.\n\n3. یک پچ با اندازه مناسب انتخاب کنید.\n\n4. پچ را مستقیماً روی جوش قرار دهید.\n\n5. چند ثانیه به‌آرامی فشار دهید تا کاملاً روی پوست ثابت شود.\n\n6. اجازه دهید پچ روی پوست باقی بماند.\n\n7. پس از جدا شدن یا کدر و متورم شدن پچ، آن را به‌آرامی تعویض کنید.\n\nنکته: بهتر است پچ روی پوست تمیز و خشک و پیش از استفاده از محصولات سنگین یا چرب‌کننده قرار گیرد تا چسبندگی آن بهتر باشد.\n\nچرا از پچ ضدجوش استفاده کنیم؟\n\nیکی از مشکلات رایج هنگام ایجاد جوش، لمس و فشار دادن آن است. این کار می‌تواند باعث تحریک بیشتر پوست و افزایش احتمال ایجاد لک یا جای جوش شود. پچ ضدجوش با ایجاد یک پوشش روی جوش، هم از آن محافظت می‌کند و هم دسترسی به آن را کمتر می‌کند.\n\nبه همین دلیل، پچ‌های ضدجوش گزینه‌ای کاربردی برای زمانی هستند که یک جوش ناگهانی روی صورت ایجاد شده و می‌خواهید به‌صورت موضعی از آن مراقبت کنید.\n\nترکیبات\n\nهیدروکلوئید ماده اصلی این نوع پچ است که با جذب ترشحات سطحی جوش، به محافظت از ناحیه و ایجاد شرایط مناسب برای روند طبیعی ترمیم پوست کمک می‌کند.\n\nبرای اطلاع از فهرست کامل ترکیبات، اندازه‌ها و مشخصات دقیق بسته‌بندی، اطلاعات درج‌شده روی محصول را بررسی کنید؛ فرمولاسیون و مشخصات",
    "descriptionEn": "High-strength hydrocolloid acne patches that absorb impurities, shield active blemishes, and reduce redness.",
    "price": 2292000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4258/7f4d8b71df49e6912e7bd406020dcc7c.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4256/ce57424e7493a2d856024ce7d38d7211.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4259/25d477beab7aae168b71523174c75c9e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4255/f0f54c801118dfc32890a2da4d5d6dea.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4257/60c6bb3315609957ce17e554c66b2627.jpeg"
    ],
    "sizes": [
      {
        "label": "بسته ۳۶ عددی",
        "labelEn": "36 Patches",
        "price": 2292000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1654",
        "name": "بسته ۳۶ عددی",
        "nameEn": "36 Patches",
        "price": 2292000,
        "stockCount": 4,
        "sku": "IN1790567957"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "عصاره درخت چای",
        "nameEn": "Melaleuca Alternifolia (Tea Tree) Extract",
        "description": "ترکیب آنتی‌باکتریال و ضدالتهاب طبیعی که باکتری‌های مولد آکنه را کنترل کرده و جوش‌های فعال را تسکین می‌دهد."
      },
      {
        "nameFa": "ماتریس هیدروکلوئید پزشکی",
        "nameEn": "Medical-Grade Hydrocolloid",
        "description": "ایجاد محیط محافظ مرطوب روی جوش‌های فعال و جذب سریع ترشحات و ناخالصی‌ها برای تسریع بهبود بدون باقی ماندن اسکار."
      }
    ],
    "usageRoutine": {
      "morning": "روی پوست تمیز و کاملاً خشک (قبل از سرم و کرم) پچ را مستقیم روی جوش قرار داده و چند ثانیه فشار دهید. پس از سفید و متورم شدن تعویض کنید.",
      "night": "روی پوست تمیز و کاملاً خشک (قبل از سرم و کرم) پچ را مستقیم روی جوش قرار داده و چند ثانیه فشار دهید. پس از سفید و متورم شدن تعویض کنید."
    },
    "badges": [
      "هیدروکلوئید",
      "جذب سریع",
      "مراقبت موضعی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "پوست‌های مستعد جوش دارای جوش‌های فعال و سرسفید که نیاز به محافظت و جذب ترشحات دارند.",
    "unsuitableFor": "روی زخم باز، عفونت شدید یا آکنه کیستیک عمیق بدون مشاوره پزشک جایگزین درمان نیست."
  },
  {
    "id": "product-pori-1419",
    "nameFa": "پیل شات لایه‌بردار بدن کوجیک اسید و زردچوبه مدیکوب",
    "nameEn": "Medicube Kojic Acid Turmeric Body Peel Shot",
    "brand": "Medicube",
    "productType": "exfoliator",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "brightening",
      "hair-body",
      "acne-blemish"
    ],
    "routines": [
      "night",
      "brightening"
    ],
    "routineStep": "مراقبت هفتگی بدن: لایه‌برداری و روشن‌کنندگی",
    "howToUse": "روی پوست خشک بدن اسپری و به آرامی ماساژ دهید تا سلول‌های مرده به صورت رول جدا شوند، سپس با آب ولرم بشویید و مرطوب‌کننده بزنید. هفته‌ای ۱ تا ۲ بار.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "ceramide",
      "panthenol",
      "salicylic-acid",
      "glycolic-acid",
      "pha",
      "kojic-acid"
    ],
    "descriptionFa": "لایه بردار بدن کوجیک اسید و زردچوبه مدیکوب روشن کننده و ضدلک\n\nلایه بردار بدن کوجیک اسید و زردچوبه مدیکوب محصولی تخصصی برای مراقبت از پوست بدن است که با ترکیبی از کوجیک اسید، عصاره زردچوبه و اسیدهای لایه بردار BHA، LHA و PHA به پاکسازی سلول‌های مرده، بهبود ظاهر پوست کدر و صاف‌تر شدن بافت پوست کمک می‌کند.\n\nاین محصول بافتی سبک و آبکی دارد و هنگام ماساژ روی پوست، سلول‌های مرده و آلودگی‌های سطحی را به شکل رول‌شده از سطح پوست جدا می‌کند. وجود ترکیبات آبرسان و تقویت‌کننده سد پوستی مانند هیالورونیک اسید و سرامید نیز به حفظ رطوبت پوست کمک می‌کند.\n\nمزایای لایه بردار بدن مدیکوب\n\nکمک به حذف سلول‌های مرده پوست\n\nکمک به صاف و نرم شدن پوست بدن\n\nکمک به بهبود ظاهر پوست‌های زبر و ناهموار\n\nکمک به کاهش ظاهر تیرگی و کدری پوست\n\nکمک به یکنواخت‌تر دیده شدن رنگ پوست\n\nکمک به پاکسازی چربی و آلودگی‌های سطح پوست\n\nمناسب برای نواحی مانند آرنج، زانو، بازوها و پاها\n\nکمک به ایجاد ظاهری شفاف‌تر و درخشان‌تر\n\nدارای ترکیبات آبرسان و مراقبت‌کننده از سد پوستی\n\nدارای بافت سبک و آبکی\n\nفرمول غیرکومدون‌زا\n\nترکیبات مؤثر\n\nکوجیک اسید | Kojic Acid\n\nکوجیک اسید یکی از ترکیبات شناخته‌شده در محصولات مراقبت از پوست برای بهبود ظاهر لک و تیرگی است. این ماده در کنار سایر ترکیبات محصول به یکنواخت‌تر دیده شدن رنگ پوست و کاهش ظاهر کدری کمک می‌کند.\n\nعصاره زردچوبه | Turmeric Extract\n\nعصاره زردچوبه سرشار از ترکیبات آنتی‌اکسیدانی است و در محصولات مراقبت از پوست برای کمک به حفظ ظاهر شاداب و سالم پوست مورد استفاده قرار می‌گیرد.\n\nBHA، LHA و PHA\n\nترکیب این اسیدهای لایه بردار به حذف سلول‌های مرده و چربی‌های اضافی از سطح پوست کمک می‌کند و باعث می‌شود بافت پوست صاف‌تر و یکدست‌تر به نظر برسد.\n\nهیالورونیک اسید\n\nهیالورونیک اسید یک ترکیب آبرسان است که به جذب و حفظ رطوبت در پوست کمک کرده و از ایجاد احساس خشکی و کشیدگی بیش از حد جلوگیری می‌کند.\n\nسرامید NP\n\nسرامید NP به حفظ و تقویت سد طبیعی پوست کمک می‌کند و برای مراقبت از پوست در برابر خشکی و از دست رفتن رطوبت اهمیت دارد.\n\nنیاسینامید، پانتنول و آلانتوئین\n\nوجود این ترکیبات در فرمول محصول، مراقبت از پوست را در کنار لایه برداری تکمیل می‌کند و به حفظ ظاهر سالم، نرم و متعادل پوست کمک می‌کند.\n\nبافت محصول\n\nMedicube Kojic Acid Turmeric Body Peel Shot دارای بافتی سبک، آبکی و سرمی است که به راحتی روی پوست پخش می‌شود.\n\nپس از قرار گرفتن محصول روی پوست و ماساژ ملایم، سلول‌های مرده و آلودگی‌های سطحی به صورت رول‌های کوچک جدا می‌شوند. سپس با آبکشی، پوست تمیزتر و نرم‌تر احساس می‌شود.\n\nمناسب برای چه افرادی است؟\n\nاین لایه بردار بدن می‌تواند برای افرادی مناسب باشد که با موارد زیر مواجه هستند:\n\nپوست بدن کدر و بی‌روح\n\nپوست زبر و خشن\n\nبافت ناهموار پوست\n\nتجمع سلول‌های مرده\n\nظاهر دانه‌دانه و ناصاف پوست\n\nتیرگی و ناهماهنگی رنگ پوست\n\nزبری و تیرگی آرنج و زانو\n\nنیاز به لایه برداری و پاکسازی پوست بدن\n\nاین محصو",
    "descriptionEn": "Exfoliating body peel shot combining kojic acid, turmeric, and BHA/LHA/PHA to smooth rough texture and brighten uneven body skin tone.",
    "price": 6627000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3687/47f3880c4cfd4dc25f6fa3c59db2d878.png",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3690/fc342709b8665b26e3a61eefed654561.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3688/93a0ddbeb7fb2cf6facc9b93dc49cac6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3689/dac8ae3e0f74e751251a1d7f2cd6d59e.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۸۰ میلی‌لیتر",
        "labelEn": "280 ml",
        "price": 6627000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1562",
        "name": "حجم ۲۸۰ میلی‌لیتر",
        "nameEn": "280 ml",
        "price": 6627000,
        "stockCount": 4,
        "sku": "IN1788452772"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "آلفا هیدروکسی اسید (AHA)",
        "nameEn": "Glycolic Acid (AHA)",
        "description": "حل کردن پیوند سلول‌های مرده سطح پوست برای شفافیت، یکدست‌سازی بافت و کاهش لک‌ها و جوش‌های سرسفید."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "روی پوست خشک بدن اسپری و به آرامی ماساژ دهید تا سلول‌های مرده به صورت رول جدا شوند، سپس با آب ولرم بشویید و مرطوب‌کننده بزنید. هفته‌ای ۱ تا ۲ بار."
    },
    "badges": [
      "ضدلک بدن",
      "غیرکومدوژنیک",
      "حاوی اسیدهای سه‌گانه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "پوست بدن کدر، ناهموار، دارای تیرگی زانو/آرنج یا پوست مرغی.",
    "unsuitableFor": "روی پوست صورت، پوست تحریک‌شده، زخم باز یا بلافاصله بعد از اصلاح و وکس استفاده نشود."
  },
  {
    "id": "product-pori-1306",
    "nameFa": "شوینده بدن ضدجوش مدیکوب مدل Red Acne Body Wash",
    "nameEn": "Medicube Red Acne Body Wash",
    "brand": "Medicube",
    "productType": "cleanser",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "hair-body",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۱: شوینده تخصصی ضدجوش بدن",
    "howToUse": "حین دوش روی پوست مرطوب بدن (کمر، سینه و شانه) کف کرده، ۱ تا ۲ دقیقه به‌آرامی ماساژ دهید و سپس کاملاً آبکشی کنید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "panthenol",
      "salicylic-acid"
    ],
    "descriptionFa": "شوینده بدن ضدجوش مدیکوب پاکسازی عمیق و کنترل آکنه بدن\n\nاگر از جوش‌های بدن، به‌ویژه در نواحی کمر، شانه و سینه خسته شده‌اید، شوینده بدن Medicube Red Body Wash یک انتخاب حرفه‌ای برای داشتن پوستی صاف، شفاف و سالم است. این شوینده با pH ملایم (5.5 تا 6.5) و ترکیبات مؤثر مانند سالیسیلیک اسید، نیاسینامید، هیالورونیک اسید و پانتنول ضمن پاکسازی عمیق منافذ، به کاهش جوش‌های بدن، کنترل چربی و حفظ رطوبت پوست کمک می‌کند. همچنین ترکیب اختصاصی MEDI-SOL Complex شامل عصاره‌های گیاهی، پوست را تسکین داده و از ایجاد التهاب و تحریک جلوگیری می‌کند.\n\n- کمک به کاهش جوش‌های بدن و جلوگیری از ایجاد مجدد آن‌ها\n\n- پاکسازی عمیق منافذ و حذف آلودگی و چربی اضافی\n\n- کنترل ترشح چربی بدون ایجاد خشکی\n\n- حفظ رطوبت و جلوگیری از کشیدگی پوست\n\n- تسکین قرمزی، التهاب و حساسیت\n\n- دارای pH سازگار با پوست (5.5 تا 6.5)\n\n- مناسب برای استفاده روزانه\n\nترکیبات مؤثر\n\nسالیسیلیک اسید (BHA): لایه‌برداری ملایم، پاکسازی منافذ و کاهش جوش‌های بدن.\n\nنیاسینامید: کمک به کاهش لک‌های ناشی از جوش، تنظیم چربی و افزایش شفافیت پوست.\n\nهیالورونیک اسید: آبرسانی عمیق و جلوگیری از خشکی پوست.\n\nپانتنول (ویتامین B5): تسکین‌دهنده و ترمیم‌کننده پوست.\n\nMEDI-SOL Complex: ترکیبی از عصاره اسطوخودوس، آویشن، کاج کره‌ای، نعناع وحشی و نعناع سیب که به آرامش و محافظت از پوست کمک می‌کند.\n\nمناسب برای\n\nپوست چرب و مستعد جوش بدن\n\nجوش‌های کمر، سینه، بازو و شانه\n\nپوست مختلط و نرمال\n\nافرادی که به دنبال شوینده‌ای ملایم با pH متعادل هستند\n\nروش استفاده\n\nمقدار مناسبی از شوینده را روی پوست مرطوب یا لیف حمام بریزید، کف ایجاد کرده و به‌آرامی روی نواحی موردنظر ماساژ دهید. پس از ۱ تا ۲ دقیقه با آب ولرم آبکشی کنید. برای کسب بهترین نتیجه، به‌صورت روزانه استفاده شود.",
    "descriptionEn": "Low-pH acne-fighting body cleanser with salicylic acid, niacinamide, panthenol, and calming botanical complex for back and chest breakouts.",
    "price": 5316000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3099/160994af0e394f636c7ce47a3e0f8f0e.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3100/6d1567f6d599db42b7d0d5819d228a76.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3101/2eeeffb5503d3c507fb4c2124f376ea3.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3102/5fba6df7ae58025e59fd1f1ef4ac8272.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰۰ میلی‌لیتر",
        "labelEn": "400 ml",
        "price": 5316000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1433",
        "name": "حجم ۴۰۰ میلی‌لیتر",
        "nameEn": "400 ml",
        "price": 5316000,
        "stockCount": 4,
        "sku": "IN1784687854"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      }
    ],
    "usageRoutine": {
      "morning": "حین دوش روی پوست مرطوب بدن (کمر، سینه و شانه) کف کرده، ۱ تا ۲ دقیقه به‌آرامی ماساژ دهید و سپس کاملاً آبکشی کنید.",
      "night": "حین دوش روی پوست مرطوب بدن (کمر، سینه و شانه) کف کرده، ۱ تا ۲ دقیقه به‌آرامی ماساژ دهید و سپس کاملاً آبکشی کنید."
    },
    "badges": [
      "pH ملایم ۵.۵–۶.۵",
      "حاوی BHA",
      "ضدجوش بدن"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های مستعد آکنه و جوش در ناحیه کمر، شانه، بازو و قفسه سینه.",
    "unsuitableFor": "در صورت حساسیت به سالیسیلیک اسید یا خشکی شدید اگزمایی بدن با احتیاط مصرف شود."
  },
  {
    "id": "product-pori-1092",
    "nameFa": "ست بالم لب آبرسان و کرم دست انگور کدلی",
    "nameEn": "Caudalie Lip Conditioner & Hand and Nail Cream Duo",
    "brand": "Caudalie",
    "productType": "lip-care",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "hair-body"
    ],
    "routines": [
      "morning",
      "night",
      "hydration"
    ],
    "routineStep": "مراقبت روزانه لب و دست",
    "howToUse": "کرم دست را پس از شست‌وشو روی دست‌ها و ناخن‌ها ماساژ دهید و بالم لب را در طول روز هر زمان نیاز بود روی لب‌ها استفاده کنید.",
    "ingredientTags": [
      "shea-butter",
      "grape-polyphenols"
    ],
    "descriptionFa": "پک بالم لب آبرسان و کرم دست انگور کدلی LIP CONDITIONER &amp; HAND AND NAIL CREAM CAUDALIE\n\nکرم دست و ناخن کدلی Caudalie Thé des Vignes 30 میلی لیتری برای تغذیه و ترمیم دست های خشک بدون اثر روغنی و در عین حال از آن ها در برابر کم آبی و تهاجمات خارجی محافظت می کند.\n\nاحساس خشکی آرام می شود، پوست نرم تر می شود و ناخن ها و کوتیکول ها تقویت می شوند.\n\nبا رایحه نمادین Thé des Vignes با نت هایی از انگور سفید، نرولی و زنجبیل به پوست رایحه ای لطیف می بخشد.\n\nیک بالم لب مرطوب کننده و آنتی اکسیدانی است که به طور ویژه برای مراقبت از لب های خشک و آسیب دیده شما ساخته شده است و همچنین باعث تغذیه، ترمیم و درخشندگی می شود.\n\nبالم لب کدلی فاقد پارابن، فنوکسی اتانول، فتالات، روغن های معدنی، PEG، سیلیکون، مواد حیوانی بوده و ۹۸ درصد مواد منشا طبیعی دارند.",
    "descriptionEn": "French botanical care duo featuring antioxidant grape seed lip conditioner and non-greasy Thé des Vignes hand and nail cream.",
    "price": 3395000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2022/c913e20bb68523c473f7ac7ee0b763d7.jpeg"
    ],
    "sizes": [
      {
        "label": "کرم دست ۳۰ میل + بالم لب ۴.۵ گرم",
        "labelEn": "30 ml + 4.5 g Set",
        "price": 3395000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1207",
        "name": "کرم دست ۳۰ میل + بالم لب ۴.۵ گرم",
        "nameEn": "30 ml + 4.5 g Set",
        "price": 3395000,
        "stockCount": 4,
        "sku": "IN1775878514"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی (Shea Butter)",
        "nameEn": "Butyrospermum Parkii (Shea) Butter",
        "description": "تغذیه‌کننده غنی از اسیدهای چرب ضروری که خشکی شدید را برطرف کرده و سد لیپیدی پوست را نرم و مقاوم می‌سازد."
      },
      {
        "nameFa": "پلی‌فنول‌های هسته انگور",
        "nameEn": "Grape Seed Polyphenols",
        "description": "آنتی‌اکسیدان طبیعی قوی و مغذی برای محافظت از پوست دست و لب در برابر خشکی و استرس‌های محیطی."
      }
    ],
    "usageRoutine": {
      "morning": "کرم دست را پس از شست‌وشو روی دست‌ها و ناخن‌ها ماساژ دهید و بالم لب را در طول روز هر زمان نیاز بود روی لب‌ها استفاده کنید.",
      "night": "کرم دست را پس از شست‌وشو روی دست‌ها و ناخن‌ها ماساژ دهید و بالم لب را در طول روز هر زمان نیاز بود روی لب‌ها استفاده کنید."
    },
    "badges": [
      "۹۸٪ ترکیبات طبیعی",
      "فاقد پارابن و سیلیکون",
      "آنتی‌اکسیدان انگور"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "دست‌ها و لب‌های خشک، حساس و در معرض کم‌آبی و سرما.",
    "unsuitableFor": "افراد دارای حساسیت شناخته شده به اسانس‌های گیاهی ملایم."
  },
  {
    "id": "product-pori-908",
    "nameFa": "شوینده روغنی کنترل منافذ جومیسو",
    "nameEn": "Jumiso Pore Clearing Cleansing Oil",
    "brand": "Jumiso",
    "productType": "cleanser",
    "category": "cleanser",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "acne-blemish",
      "soothing"
    ],
    "routines": [
      "night",
      "acne-blemish",
      "minimal"
    ],
    "routineStep": "گام ۱: پاکسازی روغنی (مرحله اول دابل کلینز)",
    "howToUse": "شب‌ها روی پوست خشک صورت با دست خشک ماساژ دهید، سپس با کمی آب امولسیونه (شیری) کرده و آبکشی نمایید؛ در صورت تمایل با شوینده فومی ادامه دهید.",
    "ingredientTags": [
      "chamomile",
      "grape-polyphenols",
      "jojoba-plant-oils"
    ],
    "descriptionFa": "شوینده روغنی کنترل منافذ جومیسو Jumiso Pore Clearing Cleansing Oil\n\nروغن پاک کننده جومیسو با نفوذ به عمیق ترین لایه های پوست، تمامی آلودگی و مواد آرایشی را از پوست پاک کرده و از مسدود شدن منافذ جلوگیری می نماید.این روغن پاک کننده دارای بافتی بسیار سبک می باشد.روغن پاک کننده جومیسو با داشتن روغن های طبیعی، آرایش ، چربی و سلول های اضافی را در خود حل کرده و با خاصیت ضد عفونی و آنتی باکتریال خود، از ایجاد جوش و آکنه جلوگیری می نماید.\n\n- پاکسازی منافذ و سطح پوست از آلودگی، سلول های مرده و مواد زائد\n\n- کاهش دهنده التهاب ناشی از ایجاد جوش و کمک به التیام پوست\n\n- محافظت از پوست در برابر رادیکال های آزاد و اشعه های مضر UV\n\n- حاوی روغن دانه ماکادمیا برای نرم شدن و بهبود وضعیت پوست\n\n- کاهش دهنده قرمزی و تحریکات پوست به کمک روغن بابونه\n\n- تغذیه کننده پوست و محافظت از آن به کمک روغن نارگیل\n\n- حاوی روغن هسته انگور جهت تقویت و بازسازی پوست\n\n- ایجاد حس نرمی، رطوبت و لطافت بعد از استفاده\n\n- دارای خواص آنتی اکسیدانی و محافظت از پوست",
    "descriptionEn": "Lightweight cleansing oil with botanical oils and chamomile to dissolve makeup, sunscreen, and excess sebum without clogging pores.",
    "price": 2924000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1550/ba9f2a25233a1f832a8758090afabaad.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1548/0f1cca8fdf2fe0bbeee6341355a10184.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۰۰ میلی‌لیتر",
        "labelEn": "200 ml",
        "price": 2924000
      }
    ],
    "variants": [
      {
        "id": "var-pori-997",
        "name": "حجم ۲۰۰ میلی‌لیتر",
        "nameEn": "200 ml",
        "price": 2924000,
        "stockCount": 4,
        "sku": "IN1761023505"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "عصاره بابونه",
        "nameEn": "Chamomilla Recutita Extract",
        "description": "آرام‌بخش پوست‌های حساس و واکنش‌پذیر که التهاب، قرمزی و تحریکات سطحی را مهار می‌کند."
      },
      {
        "nameFa": "پلی‌فنول‌های هسته انگور",
        "nameEn": "Grape Seed Polyphenols",
        "description": "آنتی‌اکسیدان طبیعی قوی و مغذی برای محافظت از پوست دست و لب در برابر خشکی و استرس‌های محیطی."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی سبک",
        "nameEn": "Botanical Cleansing Oils Complex",
        "description": "انحلال کامل ضدآفتاب، سبوم و آرایش مقاوم از منافذ بدون ایجاد کدری یا بستن منافذ."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "شب‌ها روی پوست خشک صورت با دست خشک ماساژ دهید، سپس با کمی آب امولسیونه (شیری) کرده و آبکشی نمایید؛ در صورت تمایل با شوینده فومی ادامه دهید."
    },
    "badges": [
      "دابل کلینز",
      "پاکسازی منافذ",
      "بافت سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷/۰۶",
    "targetAudience": "پوست‌های دارای آرایش، ضدآفتاب مقاوم، منافذ باز و جوش‌های سرسیاه.",
    "unsuitableFor": "در صورت حساسیت به روغن‌های گیاهی معطر ابتدا تست پچ انجام شود."
  },
  {
    "id": "product-pori-691",
    "nameFa": "کرم دور چشم روشن‌کننده و ضدلک گلوتاتیون مری اند می",
    "nameEn": "Mary & May Tranexamic Acid + Glutathione Eye Cream",
    "brand": "Mary & May",
    "productType": "eye-care",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "anti-aging",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "brightening",
      "anti-aging"
    ],
    "routineStep": "گام ۴: مراقبت دور چشم",
    "howToUse": "صبح و شب مقدار به اندازه یک دانه برنج را با انگشت حلقه به‌آرامی با ضربات ملایم به دور چشم بزنید.",
    "ingredientTags": [
      "vitamin-c",
      "tranexamic-acid",
      "glutathione",
      "collagen",
      "glycerin"
    ],
    "descriptionFa": "کرم دور چشم روشن کننده و ضد لک گلوتاتیون و ترانگزامیک اسید مری اند می\n\nmary&amp;may glutathione eye cream special set\n\nیک محصول تخصصی برای درمان تیرگی، کک و مک و لک اطراف چشم میباشد. این محصول با ppm1000، ترانگزامیک اسید و گلوتاتیون غنی شده که تیرگی دور چشم را روشن کرده و پوست اطراف چشم را احیا میکند. همچنین حاوی ویتامین C برای تحریک تولید کلاژن و بهبود رنگ کدر پوست است.\n\n- روشن کننده یکدست کننده و رفع تیرگی های اطراف چشم\n\n- کاهش و محو کننده خطوط ریز و چروکهای اطراف چشم\n\n- جلوگیری از حس کشیدگی یا خشکی بعد از استفاده\n\n- خنثی کننده اثرات رادیکالهای آزاد و مخرب محیطی\n\n- رفع کم آبی و علائم ناشی از دهیدراتگی این ناحیه\n\n- دارای تاییدیه تست کلینیکال عدم ایجاد حساسیت\n\n- فاقد حس سنگینی و چسبندگی بعد از استفاده\n\n- از بین برنده کک و مک و سیاهی دور چشم\n\n- قابل استفاده بعنوان زیرساز و پایه آرایش\n\n- حاوی گلیسیرین جهت رطوبت رسانی\n\n- درمان کننده تخصصی تیرگی و چروک\n\nدارای بافت کرمی و نسبتا زود جذب\n\n- کاهش حلقه های تیره دور چشم\n\n- مهار کننده تکثیر ملانوسیت\n\n- فاقد سولفات و پارابن\n\n- کمک به تولید کلاژن\n\n- فاقد تست حیوانی",
    "descriptionEn": "Targeted brightening eye cream formulated with tranexamic acid, glutathione, and vitamin C to reduce dark circles and fine lines.",
    "price": 2215000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1086/962cf482cf46a9100660d277ee85adc5.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1085/862f818bcd57f8c2bf983d29e70f8d60.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ گرم (ست ویژه)",
        "labelEn": "30 g",
        "price": 2215000
      }
    ],
    "variants": [
      {
        "id": "var-pori-762",
        "name": "حجم ۳۰ گرم (ست ویژه)",
        "nameEn": "30 g",
        "price": 2215000,
        "stockCount": 4,
        "sku": "IN1747344376"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین C پایدار",
        "nameEn": "Vitamin C (Ascorbic Acid)",
        "description": "آنتی‌اکسیدان قدرتمند جهت خنثی‌سازی رادیکال‌های آزاد، مهار ملانین اضافه برای کاهش لک و افزایش درخشش پوست."
      },
      {
        "nameFa": "ترانگزامیک اسید",
        "nameEn": "Tranexamic Acid",
        "description": "مهارکننده مسیرهای التهابی تولید رنگدانه که در کاهش لک‌های مقاوم، تیرگی دور چشم و جای جوش اثربخشی بالینی دارد."
      },
      {
        "nameFa": "گلوتاتیون",
        "nameEn": "Glutathione",
        "description": "آنتی‌اکسیدان تری‌پپتیدی قوی که با کنترل ملانین‌سازی، تیرگی و کدری پوست را کاهش داده و شفافیت چهره را افزایش می‌دهد."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب مقدار به اندازه یک دانه برنج را با انگشت حلقه به‌آرامی با ضربات ملایم به دور چشم بزنید.",
      "night": "صبح و شب مقدار به اندازه یک دانه برنج را با انگشت حلقه به‌آرامی با ضربات ملایم به دور چشم بزنید."
    },
    "badges": [
      "فاقد سولفات و پارابن",
      "کرولتی‌فری",
      "تست‌شده بالینی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "دور چشم دارای تیرگی، لک، خطوط ریز و نشانه‌های خستگی.",
    "unsuitableFor": "از تماس مستقیم با داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-63",
    "nameFa": "سرم رتینول بازسازی‌کننده سراوی مناسب جای جوش",
    "nameEn": "CeraVe Resurfacing Retinol Serum",
    "brand": "CeraVe",
    "productType": "serum",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "anti-aging",
      "brightening",
      "barrier-repair"
    ],
    "routines": [
      "night",
      "acne-blemish",
      "anti-aging"
    ],
    "routineStep": "گام ۳: سرم درمانی شبانه",
    "howToUse": "فقط شب‌ها ۲ تا ۳ بار در هفته (و بتدریج یک شب در میان) روی پوست خشک بزنید. استفاده از ضدآفتاب در روز بعد الزامی است.",
    "ingredientTags": [
      "niacinamide",
      "ceramide",
      "retinol",
      "licorice"
    ],
    "descriptionFa": "- کاهش دهنده اسکار بعد از آکنه\n\n- کمک به درمان سریعتر جای جوش\n\n- به بازیابی سد محافظ پوستی کمک می کند\n\n- صاف کننده سطح پوست\n\n- دارای رتینول کپسول دار(به بازسازی بافت پوست کمک می کند)\n\n- دارای عصاره ریشه شیرین بیان(برای کمک به روشن شدن ظاهر پوستو کاهش لک)\n\n- دارای سرامیدهای ضروری پوست(به بازیابی و حفظ سد طبیعی پوست کمک می کند)\n\n- دارای نیاسینامید(به آرامش پوست و روشن سازی پوست کمک می کند)\n\n- مناسب برای پوست های مستعد به جوش و آکنه\n\n- دارای فناوری MVE\n\n- غیر کومدون زا\n\n- بدون پارابن و بدون عطر\n\n- ساخته شده توسط متخصصین پوست\n\n- کاهش دهنده لک جای جوش\n\n- کاهش دهنده اسکار جوش\n\n- کاهش دهنده منافذ باز پوست\n\n- یکدست کننده ظاهر پوست و ایجاد ظاهر صاف\n\n- تقویت کننده سد لیپیدی پوست\n\n- کاهش خطوط صورت\n\n- روشن کننده سطح پوست",
    "descriptionEn": "Post-acne resurfacing serum with encapsulated retinol, licorice root extract, niacinamide, and 3 essential ceramides to refine pores and fade marks.",
    "price": 5648000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/102/ab51a34f2c62b47466e5b97b2946e5ab.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 5648000
      }
    ],
    "variants": [
      {
        "id": "var-pori-72",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 5648000,
        "stockCount": 4,
        "sku": "IN1711137725"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "رتینول کپسوله‌شده",
        "nameEn": "Encapsulated Retinol",
        "description": "تحریک نوسازی سلولی و کلاژن‌سازی در لایه درم، کاهش چین‌وچروک‌های ظریف، بهبود بافت پوست و کمرنگ کردن جای جوش."
      },
      {
        "nameFa": "عصاره ریشه شیرین‌بیان",
        "nameEn": "Glycyrrhiza Glabra (Licorice) Root Extract",
        "description": "حاوی گلابریدین با خاصیت ضدلک و ضدالتهاب قوی که تیرگی‌های پس از جوش و قرمزی پوست را به‌طور ملایم کاهش می‌دهد."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "فقط شب‌ها ۲ تا ۳ بار در هفته (و بتدریج یک شب در میان) روی پوست خشک بزنید. استفاده از ضدآفتاب در روز بعد الزامی است."
    },
    "badges": [
      "رتینول کپسوله‌شده",
      "فاقد عطر و پارابن",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های مستعد آکنه، دارای جای جوش، لک پس از التهاب و منافذ باز.",
    "unsuitableFor": "در دوران بارداری و شیردهی و روی پوست بسیار حساس یا آسیب‌دیده هم‌زمان با اسیدهای قوی مصرف نشود."
  },
  {
    "id": "product-pori-830",
    "nameFa": "لوسیون مرطوب‌کننده و آبرسان صورت و بدن ستافیل پوست خشک و حساس",
    "nameEn": "Cetaphil Moisturizing Lotion Dry to Normal Sensitive Skin",
    "brand": "Cetaphil",
    "productType": "moisturizer",
    "category": "sensitive-skin",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "hydration",
      "sensitive",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "hydration",
      "soothing",
      "barrier-repair"
    ],
    "routineStep": "گام ۵: مرطوب‌کننده صورت و بدن",
    "howToUse": "روزانه پس از شست‌وشو روی پوست صورت و بدن بمالید و به‌آرامی ماساژ دهید.",
    "ingredientTags": [
      "niacinamide",
      "panthenol",
      "glycerin",
      "shea-butter"
    ],
    "descriptionFa": "لوسیون و مرطوب کننده و آبرسان صورت و بدن ستافیل پوست خشک و حساس\n\nاین لوسیون روزانه که با 9 مرطوب‌کننده از جمله کره شیا غنی شده است، از نظر بالینی ثابت شده است که پوست خشک را به مدت 48 ساعت ترمیم و بازسازی می‌کند. در برابر 5 نشانه حساسیت پوستی، از جمله تضعیف سد دفاعی پوست، سوزش، زبری، سفتی و خشکی، محافظت می‌کند.\n\nلوسیون مغذی با فرمولی جدید و بهبود یافته حاوی ترکیبی علمی از نیاسینامید، پانتنول و گلیسیرین آبرسان، به طور ویژه فرموله شده است تا به بهبود خاصیت ارتجاعی پوست‌های حساس کمک کند. ا\n\n- اثربخشی سریع\n\n- آبرسانی عمیق ۴۸ ساعته\n\n- غنی از ویتامینهای ضروری پوست\n\n- فاقد چربی، عطر، پارابن و سولفات\n\n- فاقد رنگ، فتالات، فلوراید و آلومینیوم\n\n- محافظت از پوست در برابر ۵ نشانه حساسیت پوستی، از جمله سد پوستی ضعیف، سوزش، زبری، سفتی و خشکی\n\n- جلب ۹۷ درصد رضایت مشتریان\n\nحاوی نیاسینامید (ویتامین B3)، پانتنول (ویتامین B5) و گلیسیرین آبرسانی\n\n- تایید شده توسط متخصصین •پوست برای بهبود انعطاف پذیری پوست حساس\n\n- بهبود قابل توجه سد پوستی در ۳ روز و ترمیم کامل در ۱ هفته\n\n- بهبود و حفظ رطوبت پوست\n\n- کمک به نرمی و لطافت پوست\n\n- غیرکومدوژنیک",
    "descriptionEn": "Clinically proven 48-hour hydrating lotion enriched with niacinamide, panthenol, glycerin, and avocado/shea emollients to defend against 5 signs of sensitivity.",
    "price": 5705000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1977/7e1c813097e4fd1a628be63e6248500e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1362/9bdb5f2ccdf38ad963211cd2e975c22a.png"
    ],
    "sizes": [
      {
        "label": "حجم ۴۷۳ میلی‌لیتر",
        "labelEn": "473 ml",
        "price": 5705000
      }
    ],
    "variants": [
      {
        "id": "var-pori-908",
        "name": "حجم ۴۷۳ میلی‌لیتر",
        "nameEn": "473 ml",
        "price": 5705000,
        "stockCount": 3,
        "sku": "IN1756624396"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      },
      {
        "nameFa": "کره شی (Shea Butter)",
        "nameEn": "Butyrospermum Parkii (Shea) Butter",
        "description": "تغذیه‌کننده غنی از اسیدهای چرب ضروری که خشکی شدید را برطرف کرده و سد لیپیدی پوست را نرم و مقاوم می‌سازد."
      }
    ],
    "usageRoutine": {
      "morning": "روزانه پس از شست‌وشو روی پوست صورت و بدن بمالید و به‌آرامی ماساژ دهید.",
      "night": "روزانه پس از شست‌وشو روی پوست صورت و بدن بمالید و به‌آرامی ماساژ دهید."
    },
    "badges": [
      "آبرسانی ۴۸ ساعته",
      "فاقد عطر و پارابن",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کانادا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های خشک، نرمال و حساس دچار کشیدگی، زبری و ضعف سد دفاعی.",
    "unsuitableFor": "مورد منع خاص ندارد؛ برای پوست خیلی چرب روی صورت ممکن است سبک‌تر از این مدل نیاز باشد."
  },
  {
    "id": "product-pori-531",
    "nameFa": "سرم ریدل شات بوستر قرمز ۱۰۰ وی‌تی کازمتیکس",
    "nameEn": "VT Cosmetics Red Booster Reedle Shot 100",
    "brand": "VT Cosmetics",
    "productType": "serum",
    "category": "anti-aging",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "anti-aging",
      "brightening",
      "barrier-repair"
    ],
    "routines": [
      "night",
      "anti-aging",
      "brightening"
    ],
    "routineStep": "گام ۲/۳: بوستر نفوذ و جوانساز شبانه",
    "howToUse": "در روتین شب پس از شست‌وشو، روی پوست تمیز و خشک مقدار کمی بمالید و با فشار کف دست جذب کنید؛ سپس آبرسان بزنید. احساس سوزن‌سوزن خفیف طبیعی است.",
    "ingredientTags": [
      "ceramide",
      "panthenol",
      "vitamin-e",
      "arbutin",
      "spicules"
    ],
    "descriptionFa": "سرم ریدل‌ شات بوستر قرمز جوانساز و لیفت کننده\n\nجدیدترین نسل سرم‌های پوستی\n\nاین Red Booster Reedle Shot 100 مراقبت آنتی اکسیدانی و تسکین دهنده را با انرژی قرمز پر جنب و جوش برای پوستی سفت و درخشان ارائه می کند.\n\nحاوی خون اژدها برای کمک به تغذیه پوست و بهبود خاصیت ارتجاعی و شفافیت پوست.\n\nتقویت هم افزایی با پانتنول، آربوتین، توکوفرول و سرامید NP به ایجاد پوستی سفت و انعطاف پذیر کمک می کند.\n\nفرمول اسانس قرمز غنی بدون چسبندگی یا باقی مانده به پوست محکم می‌چسبد.\n\n- ضد پیری\n\n- لیفت کننده قوی\n\n- جوانساز فوق‌العاده\n\n- مناسب برای مبارزه با آکنه\n\n- خشکی پوست\n\n- روشن کننده پوست\n\n- پوست حساس\n\n- پوست چرب\n\n- کاهش منافذ\n\n- ترمیم جای زخم و لکه های تیره",
    "descriptionEn": "Antioxidant-rich micro-spicule booster serum with Dragon’s Blood, panthenol, arbutin, tocopherol, and ceramide NP to firm and brighten skin.",
    "price": 6791000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/761/3903ab12fb04986e384723193102b614.png"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 6791000
      }
    ],
    "variants": [
      {
        "id": "var-pori-591",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 6791000,
        "stockCount": 3,
        "sku": "IN1738598892"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محلول در چربی که از غشای سلولی در برابر استرس اکسیداتیو محافظت کرده و نرمی پوست را حفظ می‌کند."
      },
      {
        "nameFa": "آلفا آربوتین",
        "nameEn": "Alpha-Arbutin",
        "description": "روشن‌کننده ایمن و هدفمند که با مهار تدریجی آنزیم تیروزیناز، تولید ملانین اضافی و لک‌های تیره را کاهش می‌دهد."
      },
      {
        "nameFa": "اسپیکول‌های میکرو / اگزوزوم Cica",
        "nameEn": "Hydrolyzed Sponge / Cica Exosome",
        "description": "ساختارهای سوزنی میکرونی طبیعی برای افزایش نفوذ ترکیبات فعال به لایه‌های عمقی و تحریک نوسازی بافت پوست."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "در روتین شب پس از شست‌وشو، روی پوست تمیز و خشک مقدار کمی بمالید و با فشار کف دست جذب کنید؛ سپس آبرسان بزنید. احساس سوزن‌سوزن خفیف طبیعی است."
    },
    "badges": [
      "فناوری میکرواسپیکول",
      "ضدپیری قوی",
      "کره‌ای اورجینال"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های کدر، دارای خطوط ریز، منافذ و کاهش قوام پوست.",
    "unsuitableFor": "روی پوست زخمی، ملتهب شدید یا هم‌زمان با دستگاه‌های زیبایی و اسیدهای لایه‌بردار قوی استفاده نشود."
  },
  {
    "id": "product-pori-434",
    "nameFa": "ژل کرم دور چشم آبرسان ۹۶ ساعته کلینیک",
    "nameEn": "Clinique Moisture Surge Eye 96-Hour Hydro-Filler Concentrate",
    "brand": "Clinique",
    "productType": "eye-care",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hydration",
      "anti-aging",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "hydration"
    ],
    "routineStep": "گام ۴: آبرسان دور چشم",
    "howToUse": "صبح و شب مقدار کمی به اندازه نخود را روی پوست تمیز دور چشم ضربه‌ای پخش کنید؛ می‌توان به عنوان ماسک ۳ دقیقه‌ای دور چشم هم استفاده کرد.",
    "ingredientTags": [
      "hyaluronic-acid",
      "green-tea",
      "aloe-vera",
      "trehalose"
    ],
    "descriptionFa": "دور چشم آبرسان کلینیک 96 ساعته Clinique Moisture Surge Eye\n\nیک ژل فوق‌العاده سبک است که با نفوذ راحت در پوست، آن را شدیدا آبرسانی می‌کند. هیدراتاسیون قوی و موثر آن، به مدت 96 ساعت پوست را مرطوب و شاداب نگهداشته و از خشک و دهیدراته شدن پوست دور چشم جلوگیری می‌کند. خشکی و کم آبی ناحیه دورچشم، سریع‌تر از بقیه قسمت‌های پوست صورت باعث پیدایش خطوط و ایجاد چین و چروک شده و همچنین پوست را با احساس کشیدگی و پوسته پوسته شدن مواجه می‌کند.\n\n- آبرسانی قوی پوست دور چشم و ضد خشکی •حفظ رطوبت در پوست برای مدت زمان 96 ساعت •دارای بافت سبک ژلی و آبکی با جذب بالا •پر کننده خطوط سطحی، ضد چین و چروک‌های عمیق •روشن کننده و محکم کننده پوست دور چشم •قابل استفاده برای هیدراتاسیون انواع پوست •تقویت و بازسازی سد محافظتی پوست •غنی شده با آلوئه ورا، هیالورونیک اسید، عصاره چای سبز، عصاره جلبک و ترهالوز •حاوی آنتی اکسیدان های قوی برای محافظت از پوست •جلوگیری از پیری زودرس آسیب ناشی از رادیکال های آزاد",
    "descriptionEn": "Ultralight water-gel eye concentrate delivering 96 hours of intense hydration with aloe vera, hyaluronic acid, green tea, and antioxidants.",
    "price": 6434000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/591/fa12fa57a47c820e3025ff4759c9dfa5.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵ میلی‌لیتر",
        "labelEn": "15 ml",
        "price": 6434000
      }
    ],
    "variants": [
      {
        "id": "var-pori-485",
        "name": "حجم ۱۵ میلی‌لیتر",
        "nameEn": "15 ml",
        "price": 6434000,
        "stockCount": 3,
        "sku": "IN1731664284"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "عصاره چای سبز",
        "nameEn": "Camellia Sinensis (Green Tea) Extract",
        "description": "سرشار از پلی‌فنول‌های آنتی‌اکسیدان جهت مهار التهاب، کنترل رادیکال‌های آزاد و طراوت پوست حساس."
      },
      {
        "nameFa": "عصاره آلوئه‌ورا",
        "nameEn": "Aloe Barbadensis Leaf Extract",
        "description": "آبرسان، خنک‌کننده و التیام‌بخش فوری پوست‌های حساس و کم‌آب به واسطه پلی‌ساکاریدهای طبیعی."
      },
      {
        "nameFa": "ترهالوز و عصاره جلبک",
        "nameEn": "Trehalose & Algae Extract",
        "description": "قند محافظ سلولی برای حفظ رطوبت پایدار در بافت ظریف دور چشم و پیشگیری از دهیدراتگی."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب مقدار کمی به اندازه نخود را روی پوست تمیز دور چشم ضربه‌ای پخش کنید؛ می‌توان به عنوان ماسک ۳ دقیقه‌ای دور چشم هم استفاده کرد.",
      "night": "صبح و شب مقدار کمی به اندازه نخود را روی پوست تمیز دور چشم ضربه‌ای پخش کنید؛ می‌توان به عنوان ماسک ۳ دقیقه‌ای دور چشم هم استفاده کرد."
    },
    "badges": [
      "آبرسانی ۹۶ ساعته",
      "بافت ژلی سبک",
      "بدون چربی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "دور چشم کم‌آب، خسته و دارای خطوط ناشی از خشکی برای همه انواع پوست.",
    "unsuitableFor": "در صورت حساسیت به عصاره‌های گیاهی و داخل چشم استفاده نشود."
  },
  {
    "id": "product-pori-393",
    "nameFa": "سرم میکرونیدل ریدل شات ۳۰۰ وی‌تی کازمتیکس",
    "nameEn": "VT Cosmetics Reedle Shot 300",
    "brand": "VT Cosmetics",
    "productType": "serum",
    "category": "anti-aging",
    "skinTypes": [
      "normal",
      "combination",
      "oily",
      "dry"
    ],
    "concerns": [
      "anti-aging",
      "brightening",
      "acne-blemish"
    ],
    "routines": [
      "night",
      "anti-aging"
    ],
    "routineStep": "گام ۲/۳: بوستر تخصصی ۳ روز یک‌بار",
    "howToUse": "فقط در روتین شب هر ۳ روز یک بار روی پوست تمیز و خشک ماساژ و با فشار دست جذب شود، سپس سرم یا کرم آبرسان استفاده کنید. روز بعد حتماً ضدآفتاب بزنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "centella",
      "spicules"
    ],
    "descriptionFa": "ریدل شات 300 وی تی کازمتیک VT Cosmetics Reedle Shot 300\n\nنسل جدید سرم‌های پوستی\n\nسرم میکرو نیدل VT Reedle Shot 300، محصولی پیشرفته برای مراقبت از پوست است که با استفاده از فناوری میکرو نیدل، مواد موثر را به عمق پوست نفوذ می‌دهد و نتایج قابل توجهی در جوانسازی و بهبود پوست به همراه دارد.\n\nاین آمپول به عنوان یک درمان تقویتی پوست عمل میکند که به پوست کمک میکند تا سلول‌اای مرده را از بین ببرد و منافذ را تنگ تر کند، در نتیجه پوست صاف و شادابتر به نظر میرسد. همچنین، حاوی عصاره سنتلا آسیاتیکا و اسید هیالورونیک با مولکول های کوچک است که برای مراقبتهای تسکین دهنده و مرطوب کننده پوست موثر هستند.\n\n- نفوذ عمیق به پوست: فرمولاسیون میکرو نیدل این سرم، مواد فعال را به لایه‌های عمیق پوست رسانده و اثربخشی آن‌ها را افزایش می‌دهد.\n\n- حاوی عصاره سانسوریا و هیالورونیک اسید با وزن مولکولی کم: این ترکیبات به آبرسانی، تقویت سد دفاعی پوست و کاهش التهاب کمک می‌کنند.\n\n- مناسب برای انواع پوست: این سرم برای انواع پوست، از جمله پوست‌های حساس، مناسب است.",
    "descriptionEn": "Intensive Cica Reedle micro-spicule booster serum with Centella Asiatica and low-molecular hyaluronic acid for deeper absorption and skin renewal.",
    "price": 6362000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/522/a71c6c31df6f67daa4e7d30d7fec7a19.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/523/d1b96da58c2ebc28a8746f05949f95ba.jpeg"
    ],
    "sizes": [
      {
        "label": "دوز ۳۰۰ (حجم ۵۰ میل)",
        "labelEn": "Reedle Shot 300 - 50 ml",
        "price": 6362000
      }
    ],
    "variants": [
      {
        "id": "var-pori-441",
        "name": "دوز ۳۰۰ (حجم ۵۰ میل)",
        "nameEn": "Reedle Shot 300 - 50 ml",
        "price": 6362000,
        "stockCount": 3,
        "sku": "IN1729831033"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      },
      {
        "nameFa": "اسپیکول‌های میکرو / اگزوزوم Cica",
        "nameEn": "Hydrolyzed Sponge / Cica Exosome",
        "description": "ساختارهای سوزنی میکرونی طبیعی برای افزایش نفوذ ترکیبات فعال به لایه‌های عمقی و تحریک نوسازی بافت پوست."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "فقط در روتین شب هر ۳ روز یک بار روی پوست تمیز و خشک ماساژ و با فشار دست جذب شود، سپس سرم یا کرم آبرسان استفاده کنید. روز بعد حتماً ضدآفتاب بزنید."
    },
    "badges": [
      "Cica Reedle 300",
      "نفوذ عمقی",
      "اصلاح منافذ"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های دارای منافذ باز، بافت ناهموار و نیاز به جذب بیشتر سرم‌های درمانی.",
    "unsuitableFor": "برای استفاده روزانه یا پوست‌های بسیار حساس و ملتهب و همراه با لایه‌بردارهای اسیدی قوی مناسب نیست."
  },
  {
    "id": "product-pori-1464",
    "nameFa": "آمپول لیفتینگ و کلاژن‌ساز پپتاید ابریشم و EGF سانگ بون ادیتور",
    "nameEn": "SUNGBOON EDITOR Deep Collagen Silk Peptide EGF Intensive Ampoule",
    "brand": "SUNGBOON EDITOR",
    "productType": "serum",
    "category": "anti-aging",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "anti-aging",
      "hydration",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "anti-aging"
    ],
    "routineStep": "گام ۳: سرم و آمپول لیفتینگ",
    "howToUse": "صبح و شب پس از تونر، چند قطره روی صورت و گردن زده و به‌آرامی ضربه بزنید تا کامل جذب شود، سپس مرطوب‌کننده بزنید.",
    "ingredientTags": [
      "peptides",
      "egf",
      "collagen",
      "silk-amino"
    ],
    "descriptionFa": "آمپول لیفت کننده و حجم دهنده پپتاید ابریشم و EGF کلاژن‌ساز عمقی سانگ‌ بون ادیتور\n\nآمپول لیفتینگ، آبرسان و کلاژن‌ساز با تمرکز بر بهبود ظاهر خطوط، افتادگی و کمبود حجم پوست\n\nاگر پوستتان به‌دلیل خشکی، کاهش الاستیسیته، خطوط ریز یا از دست دادن شادابی، ظاهری خسته و کم‌حجم پیدا کرده است، SUNGBOON EDITOR Deep Collagen Silk Peptide EGF Ampoule می‌تواند به‌عنوان یک محصول مراقبت پوستی متمرکز، به تقویت ظاهر پوست و افزایش حس لطافت و شادابی آن کمک کند.\n\nاین آمپول با ترکیبی از پپتایدها، ترکیبات مرتبط با کلاژن و EGF طراحی شده و هدف آن حمایت از ظاهر جوان‌تر، صاف‌تر و حجیم‌تر پوست است. بافت پوست پس از استفاده می‌تواند نرم‌تر، مرطوب‌تر و شاداب‌تر به نظر برسد و استفاده منظم از آن به داشتن پوستی با ظاهر سفت‌تر و باطراوت‌تر کمک می‌کند.\n\nویژگی‌های آمپول EDITOR Deep Collagen Silk Peptide EGF\n\n- کمک به بهبود ظاهر خطوط ریز و چین‌وچروک\n\n- کمک به افزایش حس سفتی و لیفت ظاهری پوست\n\n- کمک به حفظ و افزایش رطوبت پوست\n\n- پشتیبانی از ظاهر الاستیک‌تر و انعطاف‌پذیرتر پوست\n\n- کمک به بهبود ظاهر پوست‌های خشک، کدر و خسته\n\n- ایجاد ظاهری نرم، صاف، شاداب و پرتر\n\n- مناسب برای روتین‌های مراقبت ضدپیری و تقویت‌کننده پوست\n\n- قابل استفاده برای صورت و نواحی‌ای که دچار خشکی و کاهش شادابی شده‌اند\n\nترکیبات کلیدی\n\nپپتایدها؛ مراقبت هدفمند از ظاهر پوست\n\nپپتایدها از ترکیبات محبوب در محصولات مراقبت ضدپیری هستند و در فرمولاسیون‌های پوستی با هدف کمک به حفظ ظاهر سفت و جوان پوست مورد استفاده قرار می‌گیرند. حضور پپتایدها در این آمپول، آن را به گزینه‌ای مناسب برای افرادی تبدیل می‌کند که به دنبال تقویت روتین مراقبت از پوست و کاهش نمای ظاهری علائم پیری هستند.\n\nSilk Peptide؛ لطافت و حس ابریشمی پوست\n\nترکیبات مرتبط با پروتئین‌های ابریشم می‌توانند در ایجاد حس نرمی و لطافت روی پوست نقش داشته باشند. این بخش از فرمول به ایجاد ظاهری صاف‌تر و پوستی لطیف‌تر کمک می‌کند.\n\nEGF؛ ترکیبی مورد توجه در مراقبت از پوست\n\nEGF یا Epidermal Growth Factor یکی از ترکیبات مورد توجه در محصولات تخصصی مراقبت پوست است. این ماده در فرمولاسیون‌های زیبایی با هدف حمایت از ظاهر شاداب‌تر و جوان‌تر پوست استفاده می‌شود.\n\nترکیبات کلاژن‌محور\n\nکلاژن یکی از اجزای مهم ساختاری پوست است و با افزایش سن، میزان تولید طبیعی آن کاهش می‌یابد. محصولات کلاژن‌محور با هدف کمک به بهبود ظاهر پوست، افزایش حس انعطاف‌پذیری و کاهش نمای ظاهری خطوط مورد استفاده قرار می‌گیرند.",
    "descriptionEn": "Concentrated anti-aging ampoule powered by hydrolyzed collagen, silk peptides, and EGF to improve elasticity, plumpness, and fine lines.",
    "price": 6999000,
    "originalPrice": 7550000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4254/0f33c2c259970d96dfcd2f975b59e89f.jpg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4253/464ffd97896358bae94823bd5d27ef2f.jpg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3985/c0fe1a55e557402835d33164e4f009cb.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3982/e940a7342975aae0b2ca5cac69c50d76.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3981/cdb09f417c8c0b6b6128a8ee415fee27.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3984/482d4a9942c2c8f80110956f12b0a354.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3983/e478b4bef314d62d8a2cdeb44b2f05aa.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3987/4f63280b7976b198f2817e461e649e46.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3986/28c493d70195a1b4c372b103c8b1a31f.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰ میلی‌لیتر",
        "labelEn": "40 ml",
        "price": 6999000,
        "originalPrice": 7550000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1614",
        "name": "حجم ۴۰ میلی‌لیتر",
        "nameEn": "40 ml",
        "price": 6999000,
        "originalPrice": 7550000,
        "stockCount": 2,
        "sku": "IN1789761502"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پپتایدهای فعال زیستی",
        "nameEn": "Bio-Active Peptides",
        "description": "زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط کمک می‌کنند."
      },
      {
        "nameFa": "فاکتور رشد اپیدرمی (EGF)",
        "nameEn": "Epidermal Growth Factor (EGF)",
        "description": "پپتاید بازسازی‌کننده پیشرفته که نوسازی سلولی و استحکام پوست را تقویت کرده و علائم خستگی و افتادگی را کاهش می‌دهد."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      },
      {
        "nameFa": "پپتایدهای ابریشم",
        "nameEn": "Silk Peptides",
        "description": "ایجاد بافت نرم و لطیف، حفظ رطوبت سطحی و بهبود قوام و یکدستی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از تونر، چند قطره روی صورت و گردن زده و به‌آرامی ضربه بزنید تا کامل جذب شود، سپس مرطوب‌کننده بزنید.",
      "night": "صبح و شب پس از تونر، چند قطره روی صورت و گردن زده و به‌آرامی ضربه بزنید تا کامل جذب شود، سپس مرطوب‌کننده بزنید."
    },
    "badges": [
      "حاوی EGF و پپتاید",
      "کلاژن عمقی",
      "لیفتینگ و سفت‌کننده"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "پوست‌های خشک، خسته، دارای خطوط ریز و کاهش الاستیسیته.",
    "unsuitableFor": "در صورت حساسیت به پروتئین‌های ابریشم با تست پچ مصرف شود."
  },
  {
    "id": "product-pori-1437",
    "nameFa": "فوم شوینده وگان با pH ملایم و هیالورونیک اسید دینسی",
    "nameEn": "Dinsee Premium Vegan Low pH Hyaluronic Acid Foam Cleanser",
    "brand": "Dinsee",
    "productType": "cleanser",
    "category": "cleanser",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hydration",
      "sensitive",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "minimal",
      "hydration"
    ],
    "routineStep": "گام ۱: شوینده ملایم روزانه",
    "howToUse": "صبح و شب مقدار مناسبی را با آب کف کرده، روی پوست مرطوب ماساژ دهید و با آب ولرم آبکشی کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "centella",
      "ceramide",
      "vitamin-e",
      "beta-glucan",
      "glycerin",
      "urea"
    ],
    "descriptionFa": "فوم شوینده وگان «دینسی» (Dinsee) حاوی هیالورونیک اسید و با pH ملایم\n\nفوم شوینده وگان دینسی، یک شوینده روزانه با فرمول Low pH (pH پایین) است که برای پاکسازی پوست بدون ایجاد احساس خشکی و کشیدگی طراحی شده است. این محصول با بهره‌گیری از هیالورونیک اسید و ترکیبات مرطوب‌کننده، ضمن پاک کردن آلودگی‌ها و چربی‌های اضافی، به حفظ حس لطافت و رطوبت پوست بعد از شست‌وشو کمک می‌کند.\n\nفرمول این شوینده حاوی ۱۰ نوع هیالورونیک اسید با ساختارهای مختلف است که برای کمک به حفظ رطوبت پوست در هنگام شست‌وشو به کار رفته‌اند. در کنار آن، ترکیباتی مانند گلیسیرین، بتاگلوکان و سرامید NP نیز در فرمول محصول وجود دارند که از جنبه مراقبت و حفظ رطوبت پوست اهمیت دارند.\n\nویژگی‌های فوم شوینده دینسی\n\n- وگان و دارای فرمول مبتنی بر ترکیبات گیاهی\n\n- دارای pH پایین و ملایم مناسب برای پاکسازی روزانه\n\n- حاوی ۱۰ نوع هیالورونیک اسید\n\n- کمک به پاکسازی آلودگی‌ها، چربی اضافه و ناخالصی‌های سطح پوست\n\n- ایجاد کف نرم و لطیف برای شست‌وشوی راحت‌تر\n\n- کمک به جلوگیری از احساس خشکی و کشیدگی شدید پس از شست‌وشو\n\n- کمک به حفظ رطوبت و لطافت پوست\n\n- حاوی گلیسیرین برای کمک به حفظ رطوبت\n\n- حاوی بتاگلوکان و سرامید NP\n\n- مناسب برای انواع پوست، از جمله پوست‌های خشک، نرمال، مختلط و چرب\n\nچرا pH پایین در شوینده اهمیت دارد؟\n\nپوست به طور طبیعی دارای یک لایه محافظ و تعادل اسیدی ملایم است. استفاده از شوینده‌های بسیار قوی می‌تواند باعث شود پوست بعد از شست‌وشو احساس خشکی یا کشیدگی داشته باشد.\n\nفوم شوینده دینسی با فرمول Low pH طراحی شده تا پاکسازی پوست را به شکل ملایم‌تری انجام دهد و در عین حال برای استفاده روزانه مناسب باشد. بافت کف‌دار و نرم محصول نیز کمک می‌کند هنگام ماساژ دادن شوینده، تماس مستقیم و اصطکاک روی پوست کاهش پیدا کند.\n\nهیالورونیک اسید؛ پاکسازی همراه با رطوبت\n\nیکی از نقاط قوت اصلی این شوینده، استفاده از چندین نوع هیالورونیک اسید در فرمول آن است. هیالورونیک اسید به عنوان یک ماده جاذب رطوبت شناخته می‌شود و می‌تواند به حفظ رطوبت پوست کمک کند.\n\nترکیب انواع هیالورونیک اسید در این محصول با هدف کمک به آبرسانی پوست هنگام پاکسازی استفاده شده است؛ بنابراین پس از شست‌وشو، پوست می‌تواند تمیز و در عین حال نرم و راحت احساس شود.\n\nترکیبات مکمل مراقبت از پوست\n\nفرمول فوم شوینده دینسی تنها به پاک‌کنندگی محدود نمی‌شود. در ترکیبات آن گلیسیرین، بتاگلوکان، سرامید NP، توکوفرول (ویتامین E) و عصاره‌های گیاهی مانند سنتلا آسیاتیکا، انجیر و Saussurea Involucrata نیز دیده می‌شود.\n\nگلیسیرین به حفظ رطوبت پوست کمک می‌کند و سرامید NP از ترکیباتی است که در مراقبت از سد دفاعی پوست مورد استفاده قرار می‌گیرد. وجود این ترکیبات در کنار هیالورونیک اسید، محصول را به گزینه‌ای مناسب برای روتین پاکسازی روزانه تبدیل می‌کند.\n\nمناسب چه نوع پوستی است؟\n\nفوم شوینده دینسی برای انواع پوست مناسب است و می‌تواند در روتین شست‌وشوی روزانه پوست‌های:\n\n- خشک\n\n- نرمال\n\n- مختلط\n\n- چ",
    "descriptionEn": "Gentle vegan low-pH daily foam cleanser with 10 types of hyaluronic acid, beta-glucan, and ceramide NP to cleanse without stripping moisture.",
    "price": 1425000,
    "originalPrice": 3035000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3805/38e988b0464a636f4b9dff445cf8404d.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3807/dc14de2f402848a0c8656ba09d6f8d43.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3806/b44237bde7cc0bae8c48767ec74d58df.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3809/18627663345ee0ce0b7b8345d2988fa2.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3808/3193e28fe37d9671d49cf61c00794ec9.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵۰ میلی‌لیتر",
        "labelEn": "150 ml",
        "price": 1425000,
        "originalPrice": 3035000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1580",
        "name": "حجم ۱۵۰ میلی‌لیتر",
        "nameEn": "150 ml",
        "price": 1425000,
        "originalPrice": 3035000,
        "stockCount": 2,
        "sku": "IN1789014336"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محلول در چربی که از غشای سلولی در برابر استرس اکسیداتیو محافظت کرده و نرمی پوست را حفظ می‌کند."
      },
      {
        "nameFa": "بتاگلوکان",
        "nameEn": "Beta-Glucan",
        "description": "پلی‌ساکارید آبرسان و ترمیم‌کننده که رطوبت‌رسانی عمیق فراهم کرده و سد دفاعی پوست‌های حساس را تقویت می‌کند."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب مقدار مناسبی را با آب کف کرده، روی پوست مرطوب ماساژ دهید و با آب ولرم آبکشی کنید.",
      "night": "صبح و شب مقدار مناسبی را با آب کف کرده، روی پوست مرطوب ماساژ دهید و با آب ولرم آبکشی کنید."
    },
    "badges": [
      "وگان",
      "pH ملایم",
      "۱۰ نوع هیالورونیک اسید"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷/۰۲",
    "targetAudience": "انواع پوست به‌ویژه پوست‌های حساس و مستعد خشکی بعد از شست‌وشو.",
    "unsuitableFor": "مورد منع خاص ندارد؛ از تماس با داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-1205",
    "nameFa": "سرم تقویت‌کننده و احیاکننده مژه لانکوم",
    "nameEn": "Lancôme Lash Revitalizing Serum",
    "brand": "Lancôme",
    "productType": "eye-care",
    "category": "anti-aging",
    "skinTypes": [
      "sensitive",
      "normal",
      "dry",
      "combination",
      "oily"
    ],
    "concerns": [
      "sensitive",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "گام ۴: مراقبت تخصصی مژه",
    "howToUse": "صبح و شب روی خط مژه تمیز و خشک بکشید و پیش از ریمل زدن اجازه دهید کاملاً خشک شود.",
    "ingredientTags": [
      "hyaluronic-acid",
      "centella"
    ],
    "descriptionFa": "سرم تقویت و احیا کننده مژه لانکوم\n\nاین سرم با ترکیبی خلاقانه از مواد منحصر به فرد تهیه شده و هدف آن تقویت و بلندتر کردن مژه های شماست. در فرمولاسیون این محصول از اسید هیالورونیک استفاده شده است که رطوبت ضروری را به عمق فولیکول مو منتقل می کند و انعطاف پذیری و رشد مژه را بهبود می بخشد. همچنین وجود کمپلکس منحصر به فرد Kerasolution با چهار اسید آمینه بکار رفته در آن بخوبی مژه های شما را ترمیم و محافظت می نماید. در نهایت، سیکا به حالت دادن و تغذیه مژه ها کمک می کند و باعث می شود مژه ها ضخیم تر به نظر برسند و حجم بیشتری داشته باشند. ترکیب مواد با کیفیت بکار رفته در این محصول به ترمیم مژه های شما کمک کرده تا مژه های بلند و خوش حالتی را که آرزوی آن را دارید داشته باشید، آسیب را درمان کرده و مژه ها را احیا و به رشد آنها کمک می کند.\n\n- تقویت و احیا کننده مژه ها\n\nکاهش ریزش مژه\n\n- تست شده توسط چشم پزشک\n\n- مناسب چشم هاس حساس\n\n- درمان مژه های آسیب دیده\n\n- افزایش انعطاف پذیری مژه\n\n- ترمیم شکستگی ها",
    "descriptionEn": "Ophthalmologist-tested lash serum enriched with hyaluronic acid, Kerasolution amino acids, and Centella Asiatica to strengthen and thicken lashes.",
    "price": 13941000,
    "originalPrice": 14354000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2488/b46b8ccdd2a5e6e86be53001b2170c1a.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2490/0bc725efd131625457b05713ad74e115.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2493/09ff3849c984739e829ae33278ca6d43.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2489/297f66c2f09e648c4d3e297bb7fa0c1b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2491/fc178a5d5fd1df96f5bc46e243aff12b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2492/6f6836c2b810bed6029bd8bf5b9f0e35.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۴ میلی‌لیتر",
        "labelEn": "4 ml",
        "price": 13941000,
        "originalPrice": 14354000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1330",
        "name": "حجم ۴ میلی‌لیتر",
        "nameEn": "4 ml",
        "price": 13941000,
        "originalPrice": 14354000,
        "stockCount": 2,
        "sku": "IN1781476981"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب روی خط مژه تمیز و خشک بکشید و پیش از ریمل زدن اجازه دهید کاملاً خشک شود.",
      "night": "صبح و شب روی خط مژه تمیز و خشک بکشید و پیش از ریمل زدن اجازه دهید کاملاً خشک شود."
    },
    "badges": [
      "تست چشم‌پزشک",
      "مناسب چشم حساس",
      "ضدریزش مژه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "مژه‌های ضعیف، آسیب‌دیده از اکستنشن یا لیفت و مستعد ریزش.",
    "unsuitableFor": "از ورود مستقیم محلول به داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-1112",
    "nameFa": "شوینده بدن روشن‌کننده کوجیک اسید و زردچوبه مدیکوب",
    "nameEn": "Medicube Kojic Acid Turmeric Brightening Body Wash",
    "brand": "Medicube",
    "productType": "cleanser",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "brightening",
      "hair-body",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "brightening"
    ],
    "routineStep": "گام ۱: شوینده روشن‌کننده بدن",
    "howToUse": "حین استحمام روی پوست مرطوب بدن کف کنید، به‌آرامی روی نواحی تیره یا ناهموار ماساژ دهید و پس از ۱ تا ۲ دقیقه آبکشی کنید.",
    "ingredientTags": [
      "niacinamide",
      "vitamin-c",
      "kojic-acid",
      "turmeric"
    ],
    "descriptionFa": "شوینده بدن روشن کننده زردچوبه با اسید کوجیک مدیکوب\n\nپوستی روشن‌تر و نرم‌\n\nدوش گرفتن روزانه خود را به یک برنامه روشن‌کننده تبدیل کنید. این شوینده بدن غنی اما ملایم که با کوجیک اسید، زردچوبه و نیاسینامید فرموله شده است، به طور قابل مشاهده‌ای به ناهمواری‌های رنگ پوست و بافت صاف ناشی از خشکی، عرق و ناخالصی‌ها کمک می‌کند.\n\nترکیبات مؤثر\n\nغنی شده با نیاسینامید، ویتامین C و زردچوبه برای کمک به تقویت سد رطوبت پوست و حفظ هیدراتاسیون حتی پس از تمیز کردن - پوست شما را نرم، صاف و با طراوت می‌کند، هرگز سفت یا خشک نمی‌شود.\n\n[کف دوستدار پوست]\n\nبا شوینده بدن مدیکوب که نه تنها تمیز می‌کند، بلکه مرطوب نیز می‌کند، از پوست خود لذت ببرید. فرمول میکروژل به حباب باعث می‌شود احساس کنید که هیدراتاسیون با طراوت شما را در بر گرفته و پوست شما را به نرمی یک کودک می‌کند! استفاده آسان اما مؤثر.\n\n[روشن و شفاف کننده]\n\nبا پوست ناهموار، مشکلات بدن در پشت، زیر بغل، داخل ران، خطوط بیکینی و موارد دیگر خداحافظی کنید! این شوینده بدن نه تنها پوست را روشن می‌کند، بلکه لایه‌برداری و آبرسانی نیز انجام می‌دهد و بافت کلی پوست شما را بهبود می‌بخشد.\n\n[رایحه مرکبات طراوت‌بخش]\n\nترکیبی پر جنب و جوش از پرتقال آبدار و لیموی ترش برای طراوت و شادابی دوش گرفتن.",
    "descriptionEn": "Brightening micro-gel body wash with kojic acid, turmeric, niacinamide, and vitamin C to smooth rough skin and target body discoloration.",
    "price": 4836000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2089/4af223fa01b345f14af3f8e638a87b32.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2090/c93d5d99be1b322e74d0fbaa5fb04dfc.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2091/c13b99e19f7277c0c6638181f738aaaf.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2092/6d019ef2fbf0a0be5e65abec582323e5.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰۰ میلی‌لیتر",
        "labelEn": "400 ml",
        "price": 4836000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1227",
        "name": "حجم ۴۰۰ میلی‌لیتر",
        "nameEn": "400 ml",
        "price": 4836000,
        "stockCount": 2,
        "sku": "IN1777150204"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "ویتامین C پایدار",
        "nameEn": "Vitamin C (Ascorbic Acid)",
        "description": "آنتی‌اکسیدان قدرتمند جهت خنثی‌سازی رادیکال‌های آزاد، مهار ملانین اضافه برای کاهش لک و افزایش درخشش پوست."
      },
      {
        "nameFa": "کوجیک اسید",
        "nameEn": "Kojic Acid",
        "description": "ترکیب روشن‌کننده تخصصی برای کاهش تیرگی‌های موضعی، یکدست‌سازی رنگ پوست و بهبود لک‌های سطحی بدن."
      },
      {
        "nameFa": "عصاره زردچوبه",
        "nameEn": "Curcuma Longa (Turmeric) Extract",
        "description": "آنتی‌اکسیدان طبیعی با خاصیت ضدالتهاب و درخشان‌کننده که به بهبود کدری و شفافیت رنگ پوست کمک می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "حین استحمام روی پوست مرطوب بدن کف کنید، به‌آرامی روی نواحی تیره یا ناهموار ماساژ دهید و پس از ۱ تا ۲ دقیقه آبکشی کنید.",
      "night": "حین استحمام روی پوست مرطوب بدن کف کنید، به‌آرامی روی نواحی تیره یا ناهموار ماساژ دهید و پس از ۱ تا ۲ دقیقه آبکشی کنید."
    },
    "badges": [
      "روشن‌کننده بدن",
      "کوجیک اسید + زردچوبه",
      "میکروژل آبرسان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "تیرگی، کدری و ناهمواری بافت پوست در نواحی بدن مانند کمر، زیر بغل و پاها.",
    "unsuitableFor": "روی پوست صورت و نواحی زخم‌دار یا بسیار حساس استفاده نشود."
  },
  {
    "id": "product-pori-1069",
    "nameFa": "تونر شیری نیاسینامید و PDRN صورتی مدیکوب",
    "nameEn": "Medicube PDRN Pink Niacinamide Milky Toner",
    "brand": "Medicube",
    "productType": "toner",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "anti-aging",
      "hydration",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "brightening",
      "hydration"
    ],
    "routineStep": "گام ۲: تونر شیری ترمیم‌کننده و روشن‌کننده",
    "howToUse": "صبح و شب بعد از شست‌وشوی صورت با کف دست یا پد روی پوست صورت و گردن ضربه‌ای جذب کنید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "peptides",
      "pdrn",
      "collagen",
      "glycerin"
    ],
    "descriptionFa": "تونر شیری نیاسینامید صورتی مدیکوب ترمیم کننده و روشن کننده\n\nتونر شیری نیاسینامید صورتی مدیکوب PDRN با قدرت PDRN، یک کمپلکس کلاژن، و پنج نوع پپتید، به طور قابل توجهی خاصیت ارتجاعی پوست را بهبود می‌بخشد، ظاهر لکه‌ها و نقاط تیره را کاهش می‌دهد و درخشندگی را بازیابی می‌کند. این تونر که با گلیسیرین و سدیم هیالورونات غنی شده است، عمیقاً پوست را آبرسانی می‌کند و در عین حال با تقویت سد دفاعی پوست، از هدر رفتن رطوبت آن جلوگیری می‌کند. این تونر با لایه‌برداری ملایم، سلول‌های مرده پوست را از بین می‌برد و پوست خشک و خسته را احیا می‌کند تا ظاهری نرم‌تر، روشن‌تر و جوان‌تر داشته باشد.\n\n- سرشار از پپتیدها، مرطوب‌کننده‌ها و آنتی‌اکسیدان‌ها\n\n- لکه‌های تیره، هایپرپیگمانتاسیون، خطوط ریز و کدری پوست را هدف قرار می‌دهد\n\n- تولید کلاژن را افزایش می‌دهد تا پوست را پر و درخشان کند\n\n- سوزش پوست را تسکین داده و آن را به شدت آبرسانی می‌کند\n\n- حاوی PDRN ماهی سالمون برای بازیابی عملکرد پوست\n\n- بافت سبک و غیرچسبنده",
    "descriptionEn": "Restorative milky toner with salmon PDRN, niacinamide, collagen complex, and 5 peptides to brighten dark spots and improve elasticity.",
    "price": 3963000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1942/b5607972b58e6a93f9f955b3ea660da3.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1943/dc14de2f402848a0c8656ba09d6f8d43.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1944/18627663345ee0ce0b7b8345d2988fa2.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1941/b44237bde7cc0bae8c48767ec74d58df.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵۰ میلی‌لیتر",
        "labelEn": "150 ml",
        "price": 3963000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1184",
        "name": "حجم ۱۵۰ میلی‌لیتر",
        "nameEn": "150 ml",
        "price": 3963000,
        "stockCount": 2,
        "sku": "IN1774553912"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پپتایدهای فعال زیستی",
        "nameEn": "Bio-Active Peptides",
        "description": "زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط کمک می‌کنند."
      },
      {
        "nameFa": "کمپلکس بازسازی‌کننده PDRN",
        "nameEn": "Salmon PDRN Complex",
        "description": "ترکیب بیومیمتیک بازسازی‌کننده بافت که خاصیت ارتجاعی پوست را افزایش داده و روند ترمیم سد پوستی را تسریع می‌کند."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب بعد از شست‌وشوی صورت با کف دست یا پد روی پوست صورت و گردن ضربه‌ای جذب کنید.",
      "night": "صبح و شب بعد از شست‌وشوی صورت با کف دست یا پد روی پوست صورت و گردن ضربه‌ای جذب کنید."
    },
    "badges": [
      "حاوی PDRN",
      "پنج نوع پپتید",
      "بافت شیری سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های کدر، دارای لک، خسته و نیازمند آبرسانی و استحکام.",
    "unsuitableFor": "در صورت حساسیت به فرآورده‌های دریایی با احتیاط تست شود."
  },
  {
    "id": "product-pori-897",
    "nameFa": "مولتی بالم ضدچروک و مرطوب‌کننده کاهی",
    "nameEn": "KAHI Wrinkle Bounce Multi Balm",
    "brand": "KAHI",
    "productType": "moisturizer",
    "category": "anti-aging",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "anti-aging",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "anti-aging",
      "hydration"
    ],
    "routineStep": "گام ۵ / مراقبت فوری: استیک ضدچروک و آبرسان",
    "howToUse": "در پایان روتین یا در طول روز روی نواحی خشک و دارای خط (دور چشم، خط خنده، لب و گردن) بکشید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "peptides",
      "pdrn",
      "collagen",
      "jojoba-plant-oils"
    ],
    "descriptionFa": "مولتی بالم ضدچروک مرطوب کننده کاهی KAHI\n\nفرمول انقلابی KAHI بر اساس آخرین تحقیقات مراقبت از پوست است و در مدت زمان کوتاهی نتایج قابل توجهی را ارائه می‌دهد. ترکیب منحصر به فرد مواد فعال مانند پپتیدها، کلاژن و اسید هیالورونیک به صورت هم‌افزایی عمل می‌کنند تا به پوست شما محافظت و تغذیه بهینه مورد نیاز برای مبارزه با چین و چروک و خطوط ریز را بدهند.\n\nکاهش چین‌وچروک‌ها: با تقویت تولید کلاژن و بازسازی پوست.\n\n- افزایش الاستیسیته: با استفاده از ترکیباتی مانند کلاژن و PDRN.\n\n- آبرسانی طولانی‌مدت: با حفظ رطوبت در پوست تا ۴۸ ساعت.\n\n- افزایش درخشندگی و شادابی پوست: با ترکیب روغن‌های گیاهی و عصاره‌های طبیعی.\n\n- مناسب برای استفاده در نواحی حساس: مانند دور چشم، لب‌ها و گردن.\n\n- قابل استفاده به‌عنوان پرایمر آرایشی: برای ایجاد بافتی نرم و مرطوب قبل از\n\nآرایش.",
    "descriptionEn": "Portable multi-purpose moisturizing stick balm with collagen, PDRN, and fermented oils to smooth fine lines and deliver a dewy glow.",
    "price": 5742000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1528/9a43a9518a90205531fe719e10bfdbf4.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1529/ad109d62a2ffadc2394a7b740ee1092d.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۹ گرم",
        "labelEn": "9 g",
        "price": 5742000
      }
    ],
    "variants": [
      {
        "id": "var-pori-986",
        "name": "وزن ۹ گرم",
        "nameEn": "9 g",
        "price": 5742000,
        "stockCount": 2,
        "sku": "IN1760569771"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پپتایدهای فعال زیستی",
        "nameEn": "Bio-Active Peptides",
        "description": "زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط کمک می‌کنند."
      },
      {
        "nameFa": "کمپلکس بازسازی‌کننده PDRN",
        "nameEn": "Salmon PDRN Complex",
        "description": "ترکیب بیومیمتیک بازسازی‌کننده بافت که خاصیت ارتجاعی پوست را افزایش داده و روند ترمیم سد پوستی را تسریع می‌کند."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی سبک",
        "nameEn": "Botanical Cleansing Oils Complex",
        "description": "انحلال کامل ضدآفتاب، سبوم و آرایش مقاوم از منافذ بدون ایجاد کدری یا بستن منافذ."
      }
    ],
    "usageRoutine": {
      "morning": "در پایان روتین یا در طول روز روی نواحی خشک و دارای خط (دور چشم، خط خنده، لب و گردن) بکشید.",
      "night": "در پایان روتین یا در طول روز روی نواحی خشک و دارای خط (دور چشم، خط خنده، لب و گردن) بکشید."
    },
    "badges": [
      "پرفروش کره‌ای",
      "مناسب دور چشم و لب",
      "آبرسانی ۴۸ ساعته"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "پوست‌های خشک، نرمال و دارای خطوط ظریف نیازمند رطوبت فوری در طول روز.",
    "unsuitableFor": "روی پوست‌های خیلی چرب و مستعد آکنه فعال روی تمام صورت توصیه نمی‌شود."
  },
  {
    "id": "product-pori-834",
    "nameFa": "کرم پاک‌کننده صورت گلیکولیپید اوردینری",
    "nameEn": "The Ordinary Glycolipid Cream Cleanser",
    "brand": "The Ordinary",
    "productType": "cleanser",
    "category": "cleanser",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination",
      "oily"
    ],
    "concerns": [
      "sensitive",
      "barrier-repair",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "minimal",
      "soothing"
    ],
    "routineStep": "گام ۱: پاک‌کننده کرمی ملایم",
    "howToUse": "برای پاک کردن آرایش روی پوست خشک (یا برای شست‌وشوی روزانه روی پوست مرطوب) ماساژ دهید و سپس با آب ولرم آبکشی کنید.",
    "ingredientTags": [
      "glycerin",
      "jojoba-plant-oils"
    ],
    "descriptionFa": "پاک کننده صورت کرمی اوردینری ordinary Glycolipid Cleanser\n\nبا کرم پاک‌کننده‌ی Ordinary Glycolipid، پوست خود را به طور مؤثر پاک کنید. این کرم پاک‌کننده، یک پاک‌کننده‌ی ملایم و در عین حال کامل است که آلودگی‌ها و ناخالصی‌ها را از پوست شما پاک می‌کند و به آن حس تازگی و تمیزی می‌دهد.\n\nاین پاک‌کننده‌ی ملایم با یک پاک‌کننده‌ی گلیکولیپید گیاهی فرموله شده است که به طور مؤثر ناخالصی‌ها را از بین می‌برد و در عین حال سد دفاعی پوست را حفظ می‌کند و از آبرسانی پوست جلوگیری می‌کند. این فرمول به pH طبیعی پوست احترام می‌گذارد و بدون آسیب رساندن به پوست عمل می‌کند.\n\nاین پاک‌کننده نه تنها مراقبت از پوست لوکس و پاک‌کننده‌ای را ارائه می‌دهد، بلکه به عنوان یک پاک‌کننده‌ی آرایش نیز عمل می‌کند. این پاک‌کننده به طور کامل عمل می‌کند و به پاک کردن تمام آثار آرایش، از جمله خط چشم، ریمل و کرم پودر، کمک می‌کند. این پاک‌کننده که برای انواع پوست مناسب است، می‌تواند به یک جزء اصلی در هر برنامه‌ی زیبایی تبدیل شود.\n\n- عملکرد پاک‌کنندگی ملایم\n\n- پاک‌کننده آلودگی، ناخالصی‌ها و آرایش\n\n- حفاظت از پوست\n\n- کمک به حفظ سطح رطوبت پوست\n\n- بدون لایه‌برداری پوست عمل می‌کند",
    "descriptionEn": "Gentle plant-derived glycolipid cream cleanser that effectively removes makeup and impurities while respecting skin barrier pH.",
    "price": 2286000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1369/ec3cfcc42588d4d1651e67641990db09.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵۰ میلی‌لیتر",
        "labelEn": "150 ml",
        "price": 2286000
      }
    ],
    "variants": [
      {
        "id": "var-pori-912",
        "name": "حجم ۱۵۰ میلی‌لیتر",
        "nameEn": "150 ml",
        "price": 2286000,
        "stockCount": 2,
        "sku": "IN1756876933"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی سبک",
        "nameEn": "Botanical Cleansing Oils Complex",
        "description": "انحلال کامل ضدآفتاب، سبوم و آرایش مقاوم از منافذ بدون ایجاد کدری یا بستن منافذ."
      }
    ],
    "usageRoutine": {
      "morning": "برای پاک کردن آرایش روی پوست خشک (یا برای شست‌وشوی روزانه روی پوست مرطوب) ماساژ دهید و سپس با آب ولرم آبکشی کنید.",
      "night": "برای پاک کردن آرایش روی پوست خشک (یا برای شست‌وشوی روزانه روی پوست مرطوب) ماساژ دهید و سپس با آب ولرم آبکشی کنید."
    },
    "badges": [
      "وگان",
      "فاقد سولفات",
      "محافظ سد پوستی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کانادا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "انواع پوست به‌ویژه پوست‌های خشک و حساس که بعد از شست‌وشو دچار کشیدگی می‌شوند.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-612",
    "nameFa": "شوینده صورت و بدن سراوی مدل پسوریازیس با سالیسیلیک اسید ۲٪",
    "nameEn": "CeraVe Psoriasis Cleanser with 2% Salicylic Acid",
    "brand": "CeraVe",
    "productType": "cleanser",
    "category": "sensitive-skin",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal",
      "combination"
    ],
    "concerns": [
      "soothing",
      "barrier-repair",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "barrier-repair",
      "soothing"
    ],
    "routineStep": "گام ۱: شوینده درمانی پوسته‌پوسته و خشک",
    "howToUse": "روی پوست مرطوب صورت یا بدن به‌آرامی ماساژ دهید و با آب ولرم بشویید؛ روزانه یا طبق نیاز پوست.",
    "ingredientTags": [
      "niacinamide",
      "ceramide",
      "salicylic-acid",
      "lactic-acid",
      "glycerin",
      "urea"
    ],
    "descriptionFa": "شوینده صورت و بدن سراوی CeraVe درمان کننده پسوریازیس،\n\nاین ژل برای پاکسازی، لایه‌برداری و تسکین پوست‌های خشک و خارش‌دار فرموله شده است. ژل پاک کننده CeraVe حاوی اسید لاکتیک است که با ملایمت پوست را لایه‌برداری می‌کند. اسید سالیسیلیک 2 درصد موجود در این ژل شست‌وشو، خارش، قرمزی، پوسته پوسته شدن و تحریکات مرتبط با پسوریازیس را تسکین می‌دهد\n\nژل شست‌وشوی صورت و بدن سراوی علائم پسوریازیس را تسکین می‌بخشد و از عود مجدد آن جلوگیری خواهد کرد. این محصول حاوی گلیسیرین بوده و پوست را نرم و لطیف خواهد کرد.\n\n- تسکین دهنده علائم پسوریازیس و جلوگیری از عود مجدد\n\n- لایه برداری ملایم پوست با اسید لاکتیک\n\n- حاوی 2 درصد اسید سالیسیلیک برای درمان خارش، پوسته پوسته شدن، قرمزی و تحریکات پوست مستعد پسوریازیس\n\n- غنی شده با گلیسیرین و اوره برای رطوبت رسانی و نرم کردن پوست\n\n- دارای 3 نوع سرامید ضروری پوست جهت تقویت سد طبیعی پوست\n\n- حاوی نیاسینامید برای آرامش و راحتی پوست",
    "descriptionEn": "Soothing salicylic acid and lactic acid cleanser with urea, niacinamide, and 3 essential ceramides to gently exfoliate and calm flaky skin.",
    "price": 6076000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/908/71f2f30af18260c73d70d1aa06239e50.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۳۷ میلی‌لیتر",
        "labelEn": "237 ml",
        "price": 6076000
      }
    ],
    "variants": [
      {
        "id": "var-pori-678",
        "name": "حجم ۲۳۷ میلی‌لیتر",
        "nameEn": "237 ml",
        "price": 6076000,
        "stockCount": 2,
        "sku": "IN1745013142"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "لاکتیک اسید (AHA)",
        "nameEn": "Lactic Acid (AHA)",
        "description": "لایه‌بردار ملایم و آبرسان که ضمن حذف سلول‌های کدر سطحی، فاکتورهای مرطوب‌کننده طبیعی پوست را تقویت می‌کند."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      },
      {
        "nameFa": "اوره (Urea)",
        "nameEn": "Urea",
        "description": "هومکتانت و کراتولیتیک ملایم که ضمن جذب رطوبت، پوست ضخیم و پوسته‌پوسته‌شده را نرم و هموار می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "روی پوست مرطوب صورت یا بدن به‌آرامی ماساژ دهید و با آب ولرم بشویید؛ روزانه یا طبق نیاز پوست.",
      "night": "روی پوست مرطوب صورت یا بدن به‌آرامی ماساژ دهید و با آب ولرم بشویید؛ روزانه یا طبق نیاز پوست."
    },
    "badges": [
      "۲٪ سالیسیلیک اسید",
      "حاوی سرامید و اوره",
      "بدون عطر"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های خشک، خارش‌دار، پوسته‌پوسته‌شده و مستعد پسوریازیس یا زبری.",
    "unsuitableFor": "روی زخم‌های باز یا در صورت حساسیت به سالیسیلیک اسید استفاده نشود."
  },
  {
    "id": "product-pori-514",
    "nameFa": "سرم آلفا آربوتین ۲٪ ضدلک و روشن‌کننده کوزارکس",
    "nameEn": "COSRX The Alpha-Arbutin 2 Discoloration Care Serum",
    "brand": "COSRX",
    "productType": "serum",
    "category": "brightening",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "acne-blemish"
    ],
    "routines": [
      "morning",
      "night",
      "brightening"
    ],
    "routineStep": "گام ۳: سرم تخصصی ضدلک",
    "howToUse": "صبح و شب ۲ تا ۳ قطره روی پوست تمیز (پس از تونر) بزنید و به‌آرامی پخش کنید؛ در روتین صبح حتماً ضدآفتاب بزنید.",
    "ingredientTags": [
      "niacinamide",
      "pha",
      "arbutin",
      "tranexamic-acid"
    ],
    "descriptionFa": "سرم آلفا آربوتین کوزارکس ضدلک و روشن‌کننده\n\nیک سرم روشن کننده برای درمان و محو شدن علائم آکنه و هایپرپیگمانتاسیون و ترکیبی قدرتمند از مواد اصلی شامل آلفا آربوتین، ترانگزامیک اسید، نیاسینامید و NAG است. می توان گفت این محصول یک راه حل برای چند هدف می باشد. سرم آلفا آربوتین کوزارکس تمام نگرانی های مربوط به تغییر رنگ را برطرف می کند.\n\n- مناسب انواع پوست بویژه پوست مستعد لک و چرب\n\n- حاوی 2٪ آلفا آربوتین\n\n- اسکارهای پس از لک را محو می کند\n\n- رنگدانه ها و لک ها را محو می کند\n\n- رنگ پوست را متعادل و یکنواخت می کند\n\n- تمام نگرانی های مربوط به تغییر رنگ را برطرف می کند\n\n- روشنایی پوست را بهبود می بخشد\n\n- بدون چربی با جذب بالا\n\n- وگان بدون الکی و عطر مصنوعی",
    "descriptionEn": "Multi-targeted discoloration serum combining 2% alpha-arbutin, tranexamic acid, niacinamide, and NAG to fade post-acne marks and hyperpigmentation.",
    "price": 4132000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/727/6221e3a938ddc46e84f0eb3837fca7cf.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/728/19f05e799f614e1fba1c947fa43250d7.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 4132000
      }
    ],
    "variants": [
      {
        "id": "var-pori-574",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 4132000,
        "stockCount": 2,
        "sku": "IN1737237837"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "پلی‌هیدروکسی اسید (PHA)",
        "nameEn": "Polyhydroxy Acid (PHA)",
        "description": "لایه‌بردار ملایم نسل جدید با مولکول بزرگ‌تر که بدون تحریک پوست حساس، سلول‌های مرده را پاکسازی و رطوبت را حفظ می‌کند."
      },
      {
        "nameFa": "آلفا آربوتین",
        "nameEn": "Alpha-Arbutin",
        "description": "روشن‌کننده ایمن و هدفمند که با مهار تدریجی آنزیم تیروزیناز، تولید ملانین اضافی و لک‌های تیره را کاهش می‌دهد."
      },
      {
        "nameFa": "ترانگزامیک اسید",
        "nameEn": "Tranexamic Acid",
        "description": "مهارکننده مسیرهای التهابی تولید رنگدانه که در کاهش لک‌های مقاوم، تیرگی دور چشم و جای جوش اثربخشی بالینی دارد."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب ۲ تا ۳ قطره روی پوست تمیز (پس از تونر) بزنید و به‌آرامی پخش کنید؛ در روتین صبح حتماً ضدآفتاب بزنید.",
      "night": "صبح و شب ۲ تا ۳ قطره روی پوست تمیز (پس از تونر) بزنید و به‌آرامی پخش کنید؛ در روتین صبح حتماً ضدآفتاب بزنید."
    },
    "badges": [
      "۲٪ آلفا آربوتین",
      "وگان و بدون عطر",
      "ضدجای جوش"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های دارای لک قهوه‌ای، جای جوش، ملاسما و ناهماهنگی رنگ چهره.",
    "unsuitableFor": "روی پوست زخمی استفاده نشود."
  },
  {
    "id": "product-pori-497",
    "nameFa": "سرم کنترل منافذ وان دی مدیکوب",
    "nameEn": "Medicube Zero Pore One Day Serum",
    "brand": "Medicube",
    "productType": "serum",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "hydration"
    ],
    "routines": [
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۳: سرم کنترل منافذ",
    "howToUse": "پس از تونر (ترجیحاً شب‌ها) ۲ تا ۳ قطره روی نواحی دارای منافذ باز و جوش سرسیاه ماساژ دهید. روز بعد از ضدآفتاب استفاده کنید.",
    "ingredientTags": [
      "salicylic-acid",
      "glycolic-acid",
      "pha",
      "allantoin"
    ],
    "descriptionFa": "یکی از محصولات محبوب در دنیای مراقبت از پوست است که برای کاهش ظاهر منافذ و درمان مشکلات ناشی از انسداد منافذ و جوش‌های سرسیاه طراحی شده است.\n\nتمرکز اصلی آن بر روی تعادل چربی و رطوبت پوست و کاهش اندازه منافذ می‌باشد. این سرم علاوه بر کاهش منافذ، مزایای دیگری نیز دارد از جمله بهبود رنگ پوست، کاهش جوش‌های سرسیاه و سفید و کنترل تولید چربی اضافی پوست. استفاده از این سرم می‌تواند به کاهش قابل‌مشاهده منافذ و دستیابی به پوستی با رنگ و رطوبت متعادل کمک کند.\n\n- کنترل فوری منافذ\n\n- حاوی AHA+BHA+PHA که جوش های سر سیاه را از بین می برد و منافذ را به حداقل می رساند\n\n- از بین بردن سلول های مرده و چربی های انباشته شده درون منافذ\n\n- حاوی کمپلکس Myosotis جهت •آبرسانی و تسکین پوست\n\n- حاوی الانتوئین جهت جلوگیری از خشکی پوست\n\n- مناسب برای انواع پوست\n\n- کمک به حفظ تعادل رطوبت و چربی\n\nافزایش درخشندگی و صاف تر شدن پوست",
    "descriptionEn": "Pore-refining serum formulated with AHA, BHA, PHA, Myosotis complex, and allantoin to unclog blackheads and balance oil-moisture levels.",
    "price": 3576000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/697/068f2a4729b03e3c2b5b5d1c463220cd.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/698/990b741488f7a3e6a9dca074ff0979f5.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 3576000
      }
    ],
    "variants": [
      {
        "id": "var-pori-557",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 3576000,
        "stockCount": 2,
        "sku": "IN1736494693"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "آلفا هیدروکسی اسید (AHA)",
        "nameEn": "Glycolic Acid (AHA)",
        "description": "حل کردن پیوند سلول‌های مرده سطح پوست برای شفافیت، یکدست‌سازی بافت و کاهش لک‌ها و جوش‌های سرسفید."
      },
      {
        "nameFa": "پلی‌هیدروکسی اسید (PHA)",
        "nameEn": "Polyhydroxy Acid (PHA)",
        "description": "لایه‌بردار ملایم نسل جدید با مولکول بزرگ‌تر که بدون تحریک پوست حساس، سلول‌های مرده را پاکسازی و رطوبت را حفظ می‌کند."
      },
      {
        "nameFa": "آلانتوئین",
        "nameEn": "Allantoin",
        "description": "ترکیب التیام‌بخش و ضدتحریک که ضمن نرم کردن لایه شاخی، بازسازی بافتی را تسریع کرده و قرمزی پوست را آرام می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "پس از تونر (ترجیحاً شب‌ها) ۲ تا ۳ قطره روی نواحی دارای منافذ باز و جوش سرسیاه ماساژ دهید. روز بعد از ضدآفتاب استفاده کنید."
    },
    "badges": [
      "AHA + BHA + PHA",
      "کنترل چربی و منافذ",
      "حاوی آلانتوئین"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های چرب و مختلط با منافذ باز، جوش سرسیاه و ترشح چربی بالا.",
    "unsuitableFor": "هم‌زمان با سایر سرم‌های لایه‌بردار قوی یا رتینول در یک وعده مصرف نشود."
  },
  {
    "id": "product-pori-433",
    "nameFa": "سرم آبرسان هیالورونیک اسید ریدل شات ۱۰۰hL وی‌تی",
    "nameEn": "VT Cosmetics Hydrop Reedle Shot 100hL",
    "brand": "VT Cosmetics",
    "productType": "serum",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "soothing"
    ],
    "routines": [
      "night",
      "hydration"
    ],
    "routineStep": "گام ۲/۳: بوستر آبرسان عمقی شبانه",
    "howToUse": "شب‌ها پس از شست‌وشو روی پوست خشک بزنید و با کف دست فشار ملایم دهید تا جذب شود، سپس کرم آبرسان استفاده کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "centella",
      "spicules"
    ],
    "descriptionFa": "سرم ابرسان هیالورونیک‌ اسید وی‌تی ریدل شات میکرونیدلینگ ۱۰۰hl\n\nنسل جدید سرم‌های پوستی\n\nدرخشندگی شفاف و هیدراته را با Hydrop Riddle Shot 100hL ما تجربه کنید. ترکیب سیکا جذب را افزایش می‌دهد و در عین حال با عوامل درخشنده آبرسان هم‌افزایی می‌کند تا پوستی درخشان و مرطوب داشته باشد.\n\nنسبت ایده آل هیالورونیک اسید و سیکا ریدل™\n\nکپسول HA-Nano: با بهره گیری از فناوری VT Deep Hydration، این کپسول های اندازه نانو رطوبت عمیق و پایدار را تضمین می کنند.\n\nCica Riddle™: بافت پوست را تقویت کرده و به جذب کمک می کند.\n\nهیالورونیک اسید 300Da با وزن مولکولی بسیار کم: به دلیل اندازه مولکولی کوچک، چسبندگی بالا و مراقبت از رطوبت شدید را فراهم می کند.\n\n- نکته 2: ارائه کپسول HA-Nano به پوست با فناوری آبرسانی عمیق VT\n\nفناوری آبرسانی عمیق VT: این فناوری ثبت شده با چسباندن حامل های دوستدار پوست به کپسول های HA-Nano باعث افزایش رطوبت می شود و اسید هیالورونیک را به طور موثر به مناطق خشک منتقل می کند و به طور قابل توجهی هیدراتاسیون را افزایش می دهد.",
    "descriptionEn": "Deep-hydration micro-spicule booster serum combining Cica Reedle™ with ultra-low-molecular 300Da hyaluronic acid nano-capsules.",
    "price": 5705000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/590/121c3d8f565e322bc46ffc588f7b20b7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/589/6e50b648347ee4069d83d2940ae6050d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/587/6888bc0825b380ceee6c1df44f889ba1.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/586/986c1da0e10a7ba898d7f5e8f24ef304.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/588/7ceee6e73a862af333aef9c00b529a31.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 5705000
      }
    ],
    "variants": [
      {
        "id": "var-pori-484",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 5705000,
        "stockCount": 2,
        "sku": "IN1731634604"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      },
      {
        "nameFa": "اسپیکول‌های میکرو / اگزوزوم Cica",
        "nameEn": "Hydrolyzed Sponge / Cica Exosome",
        "description": "ساختارهای سوزنی میکرونی طبیعی برای افزایش نفوذ ترکیبات فعال به لایه‌های عمقی و تحریک نوسازی بافت پوست."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "شب‌ها پس از شست‌وشو روی پوست خشک بزنید و با کف دست فشار ملایم دهید تا جذب شود، سپس کرم آبرسان استفاده کنید."
    },
    "badges": [
      "HA-Nano 300Da",
      "Cica Reedle",
      "آبرسانی عمقی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های کم‌آب، کدر و نیازمند آبرسانی عمقی همراه با بهبود جذب روتین.",
    "unsuitableFor": "روی پوست زخمی و ملتهب حاد یا بلافاصله بعد از لایه‌برداری قوی استفاده نشود."
  },
  {
    "id": "product-pori-363",
    "nameFa": "سرم آبرسان و مرطوب‌کننده هیدرا جنیوس لورال مناسب پوست نرمال تا خشک",
    "nameEn": "L’Oréal Paris Hydra Genius Liquid Care Normal to Dry Skin",
    "brand": "L’Oréal",
    "productType": "moisturizer",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "hydration",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "hydration",
      "minimal"
    ],
    "routineStep": "گام ۵: آبرسان و مرطوب‌کننده سبک",
    "howToUse": "صبح و شب یک تا دو پمپ روی پوست تمیز صورت و گردن ماساژ دهید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "aloe-vera"
    ],
    "descriptionFa": "آبرسان لورال پوست نرمال تا خشک Hydra Genius\n\nL’OREAL HYDRA GENIUS Liquid Care Moisturiser Normal Tot Druge Huid\n\nیک سرم آبرسان و مرطوب‌کننده مناسب پوست‌های نرمال تا خشک است که بلافاصله پوست را رطوبت‌رسانی کرده و این رطوبت را تا 72 ساعت در پوست حفظ می‌کند. بافت سبک، غیر چرب و غیر چسبنده‌ای دارد و به راحتی روی پوست جذب می‌شود. درخشش، لطافت و نرمی را برای پوست به ارمغان می‌آورد و سرشار از ترکیبات رطوبت‌رسان و تغذیه‌رسان پوست است. فرمولاسیون این محصول به گونه‌ای است که برای پوست‌های حساس نیز قابل استفاده است.\n\n- آبرسان قوی\n\n- حفظ رطوبت 72 ساعته\n\n- بافت سبک و زود جذب\n\n- ضد التهاب و التیام بخش\n\n- شفاف کننده و درخشان کننده\n\n- نرم و مرطوب کننده پوست\n\n- غیر چرب و غیر چسبنده\n\n- سرشار از هیالورونیک اسید و آلوئه ورا\n\n- مناسب برای پوست خشک و نرمال",
    "descriptionEn": "72-hour lightweight liquid moisturizer infused with hyaluronic acid and aloe vera water for fast-absorbing hydration and natural radiance.",
    "price": 3328000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/471/4d0861015efdd8e4ecfff0b08b85441f.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۷۰ میلی‌لیتر",
        "labelEn": "70 ml",
        "price": 3328000
      }
    ],
    "variants": [
      {
        "id": "var-pori-410",
        "name": "حجم ۷۰ میلی‌لیتر",
        "nameEn": "70 ml",
        "price": 3328000,
        "stockCount": 2,
        "sku": "IN1727575157"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "عصاره آلوئه‌ورا",
        "nameEn": "Aloe Barbadensis Leaf Extract",
        "description": "آبرسان، خنک‌کننده و التیام‌بخش فوری پوست‌های حساس و کم‌آب به واسطه پلی‌ساکاریدهای طبیعی."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب یک تا دو پمپ روی پوست تمیز صورت و گردن ماساژ دهید.",
      "night": "صبح و شب یک تا دو پمپ روی پوست تمیز صورت و گردن ماساژ دهید."
    },
    "badges": [
      "آبرسانی ۷۲ ساعته",
      "بدون چسبندگی",
      "آلوئه‌ورا + هیالورونیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آلمان",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های نرمال، خشک و حساس که به دنبال آبرسان سبک و زودجذب بدون چربی هستند.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-362",
    "nameFa": "ژل کرم دور چشم هیدروبوست نوتروژینا",
    "nameEn": "Neutrogena Hydro Boost Gel-Cream Eye",
    "brand": "Neutrogena",
    "productType": "eye-care",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hydration",
      "anti-aging"
    ],
    "routines": [
      "morning",
      "night",
      "hydration"
    ],
    "routineStep": "گام ۴: ژل کرم دور چشم",
    "howToUse": "صبح و شب مقدار کمی روی استخوان دور چشم بزنید و با ضربات ملایم انگشت حلقه پخش کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "glycerin"
    ],
    "descriptionFa": "کرم دور چشم نوتروژینا مدل هیدروبوست Hydro Boost\n\nاز قدرت آبرسانی فوق العاده بالایی برخوردار است. این کرم سرشار از اسید هیالورونیک بوده که سریعا به پوست اطراف چشم نفوذ کرده و آن را عمیقا آبرسانی می کند. کرم ضد خستگی دور چشم نوتروژینا مدل Hydro Boost محصولی خارق العاده است که تا حد بسیار زیادی انعطاف پوست دور چشم را بهبود می بخشد و از ظهور چین و چروک و خطوط ظریف جلوگیری به عمل می آورد. علاوه براین باعث شفاف کردن رنگ پوست دور چشم و رفع مشکلاتی مانند سیاهی و پف زیر چشم میشود.\n\n- حفظ رطوبت پوست تا 24 ساعت\n\n- افزایش خاصیت ارتجاعی پوست\n\n- مبارزه با گودی و تیرگی دور چشم\n\n- از بین برنده چین و چروک چشم و تقویت پوست دور چشم\n\n- آبرسانی قوی و عمقی پوست\n\n- سرشار از هیالورونیک اسید\n\n- کاهش خستگی و تیرگی دور چشم\n\n- تازگی و طراوت پوست زیر چشم\n\n- مسدود نکردن منافذ پوست دور چشم\n\n- پرکننده خطوط زیرچشم\n\n- مناسب برای قبل کانسیلر\n\n- محصول نوشته عربی دارد",
    "descriptionEn": "Refreshing hyaluronic acid eye gel-cream delivering 24-hour hydration to smooth dehydration lines and brighten tired under-eyes.",
    "price": 1072000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/470/7ff4b935c01bbab611dcde1b80b6d49c.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵ میلی‌لیتر",
        "labelEn": "15 ml",
        "price": 1072000
      }
    ],
    "variants": [
      {
        "id": "var-pori-409",
        "name": "حجم ۱۵ میلی‌لیتر",
        "nameEn": "15 ml",
        "price": 1072000,
        "stockCount": 2,
        "sku": "IN1727575076"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب مقدار کمی روی استخوان دور چشم بزنید و با ضربات ملایم انگشت حلقه پخش کنید.",
      "night": "صبح و شب مقدار کمی روی استخوان دور چشم بزنید و با ضربات ملایم انگشت حلقه پخش کنید."
    },
    "badges": [
      "آبرسانی ۲۴ ساعته",
      "مناسب زیر کانسیلر",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست دور چشم خسته، کم‌آب و مستعد خطوط ظریف و چروک زیر کانسیلر.",
    "unsuitableFor": "از ورود به داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-326",
    "nameFa": "تونر کوچک‌کننده منافذ و ضدجوش افکلار لاروش پوزای",
    "nameEn": "La Roche-Posay Effaclar Clarifying Lotion Toner",
    "brand": "La Roche-Posay",
    "productType": "toner",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "acne-blemish",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۲: تونر قابض منافذ و ضدجوش",
    "howToUse": "صبح و شب پس از شست‌وشو با پد پنبه‌ای به‌آرامی روی پوست صورت (به‌جز دور چشم) بکشید.",
    "ingredientTags": [
      "salicylic-acid",
      "glycerin"
    ],
    "descriptionFa": "تونر کوچک کننده منافذ و ضدجوش لاروش پوزای مدل افکلار\n\nاین محصول فرانسوی از برند لاروش پوزای (La Roche Posay)، یک تونر ایده‌آل برای مراقبت از پوست‌های چرب و مستعد آکنه است. زیرا می‌تواند در از بین بردن چربی اضافی پوست و کاهش چشمگیر اندازه منافذ آن کمک کند. این تونر با قدرت لایه ‌برداری خود، درون منافذ پوست نفوذ کرده و برای حذف سلول‌های مرده و ناخالصی‌ها، لایه‌برداری می‌کند. به‌همین دلیل انسداد و گرفتگی منافذ را (که مشکلی شایع در پوست‌های چرب و عامل ایجاد جوش است)برطرف می‌کند.\n\n- حاوی آب چشمه لاروش پوزای و لایه بردار لیپوهیدروکسی اسید\n\n- مناسب برای پوست چرب، مستعد آکنه و حساس\n\n- کمک به صاف شدن منافذ و بافت ناهموار پوست\n\n- افزایش نرمی، شفافیت و طراوت پوست صورت\n\n- فاقد ترکیبات کومدوژن‌زا (Non Comedogenic)\n\n- بدون ایجاد حساسیت و آلرژی در پوست\n\n- حاوی آنتی اکسیدان و مواد معدنی برای تقویت پوست",
    "descriptionEn": "Micro-exfoliating astringent toner with LHA and La Roche-Posay thermal spring water to decongest pores and refine oily acne-prone skin.",
    "price": 5186000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/416/804b58f1154ddf699ebd67755b8cddbd.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۰۰ میلی‌لیتر",
        "labelEn": "200 ml",
        "price": 5186000
      }
    ],
    "variants": [
      {
        "id": "var-pori-357",
        "name": "حجم ۲۰۰ میلی‌لیتر",
        "nameEn": "200 ml",
        "price": 5186000,
        "stockCount": 2,
        "sku": "IN1724219368"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از شست‌وشو با پد پنبه‌ای به‌آرامی روی پوست صورت (به‌جز دور چشم) بکشید.",
      "night": "صبح و شب پس از شست‌وشو با پد پنبه‌ای به‌آرامی روی پوست صورت (به‌جز دور چشم) بکشید."
    },
    "badges": [
      "حاوی LHA",
      "آب چشمه لاروش پوزای",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۷/۰۷",
    "targetAudience": "پوست‌های چرب، مختلط و مستعد جوش با منافذ باز و براقیت زیاد.",
    "unsuitableFor": "برای پوست‌های بسیار خشک یا اگزمایی و اطراف چشم مناسب نیست."
  },
  {
    "id": "product-pori-283",
    "nameFa": "ژل کرم ضدلک و ضدجوش افکلار دوئو پلاس ام لاروش پوزای",
    "nameEn": "La Roche-Posay Effaclar Duo+M Anti-Imperfections Cream",
    "brand": "La Roche-Posay",
    "productType": "moisturizer",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "brightening",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۵: کرم درمانی ضدجوش و ضدلک",
    "howToUse": "صبح و شب پس از شست‌وشو روی تمام صورت یا نواحی مستعد جوش استفاده کنید؛ زیر آرایش نیز قابل استفاده است.",
    "ingredientTags": [
      "niacinamide",
      "panthenol",
      "salicylic-acid"
    ],
    "descriptionFa": "یک محصول مراقبت از پوست فرانسوی است که دارای خواص تامین رطوبت پوست بوده و می‌تواند لکه‌های صورت را از بین ببرد. ترکیبات اصلی این محصول شامل فیلوبیوما، مانوز، سالیسیلیک اسید و نیاسینامید می‌باشد.\n\nفرمولاسیون این محصول به گونه‌ای طراحی شده که با مشکلات پوستی مقابله کرده و آنها را از بین می‌برد. هر گونه لک ناشی از آکنه یا سایر عوامل به کمک این کرم از بین خواهد رفت.\n\nلایه‌برداری ملایمی برای پوست انجام دهد. با بازشدن منافذ و پاکسازی آنها به کمک این کرم، از ایجاد جوش‌های جدید به خصوص جوش‌های سرسیاه در پوست جلوگیری می‌شود. بافت سبک و غیرچسبنده این کرم استفاده از آن را ساده‌تر کرده و به سرعت جذب پوست می‌شود.\n\nتنها پس از 8 ساعت از استفاده از این کرم مرطوب کننده، تاثیر فوری آن را مشاهده خواهید کرد و لک های شما شروع به کمرنگ شدن می‌کنند.\n\n- آبرسانی 24 ساعته پوست\n\n- از بین برنده لکه‌های پوستی\n\n- ضد آکنه پوست\n\n- از بین برنده علائم آکنه\n\n- بازکننده منافذ\n\n- از بین برنده جوش سرسیاه\n\n- لایه برداری ملایم\n\n- ضد حساسیت",
    "descriptionEn": "Targeted anti-blemish gel-cream with Phylobioma, niacinamide, and salicylic acid to reduce breakouts, blackheads, and post-acne marks.",
    "price": 6487000,
    "originalPrice": 7287000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/368/8ce98805961b788b28274d92f9f6ac71.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰ میلی‌لیتر",
        "labelEn": "40 ml",
        "price": 6487000,
        "originalPrice": 7287000
      }
    ],
    "variants": [
      {
        "id": "var-pori-311",
        "name": "حجم ۴۰ میلی‌لیتر",
        "nameEn": "40 ml",
        "price": 6487000,
        "originalPrice": 7287000,
        "stockCount": 2,
        "sku": "IN1720777449"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از شست‌وشو روی تمام صورت یا نواحی مستعد جوش استفاده کنید؛ زیر آرایش نیز قابل استفاده است.",
      "night": "صبح و شب پس از شست‌وشو روی تمام صورت یا نواحی مستعد جوش استفاده کنید؛ زیر آرایش نیز قابل استفاده است."
    },
    "badges": [
      "فرمول جدید +M",
      "کنترل آکنه و جای جوش",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۹/۰۲",
    "targetAudience": "پوست‌های چرب و مستعد آکنه دارای جوش فعال، جوش سرسیاه و جای جوش.",
    "unsuitableFor": "از تماس با دور چشم پرهیز شود."
  },
  {
    "id": "product-pori-269",
    "nameFa": "ژل شست‌وشوی صورت کنترل جوش و آکنه سراوی",
    "nameEn": "CeraVe Acne Control Cleanser with 2% Salicylic Acid",
    "brand": "CeraVe",
    "productType": "cleanser",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۱: شوینده ضدجوش و کنترل چربی",
    "howToUse": "روی پوست مرطوب صورت کف کرده و با حرکات دورانی ماساژ دهید (دور چشم نرسد)، سپس با آب ولرم آبکشی کنید.",
    "ingredientTags": [
      "niacinamide",
      "ceramide",
      "salicylic-acid",
      "clay"
    ],
    "descriptionFa": "- حاوی سالیسیلیک اسید جهت کنترل آکنه ، کاهش جوش های سر سیاه و بهبود ظاهر منافذ پوست\n\n- حاوی خاک رس تصفیه شده جهت کنترل چربی پوست و گرفتن روغن اضافه پوست\n\n- مناسب پوست های مختلط ، چرب و مستعد به جوش\n\n- با لایه برداری ملایم،از تجمع سلول های مرده جلوگیری کرده و تا چند درجه پوست را روشن تر می کند.\n\n- حاوی 3 سرامید ضرور و نیاسینامید جهت تقویت پوست و تسکین التهابات است که این شوینده ضد جوش را برای استفاده روزانه ایده آل کرده است.\n\n- شوینده acne control سراوی دارای خواص غیر کومدوژنیک است که باعث مسدود شدن منافذ نمی شود.همچنین فاقد بو،عطر و پارابن نیز می باشد که پوست حساس را تحریک نمی کند.\n\n- مناسب پوست‌های مختلط،چرب و مستعد جوش و آکنه",
    "descriptionEn": "Clarifying gel-to-foam acne cleanser with 2% salicylic acid, purifying clay, niacinamide, and 3 ceramides to clear pores without over-drying.",
    "price": 6486000,
    "originalPrice": 7088000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/351/d77a9cb8d7f2c19c8f5d4b391931c534.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۵۵ میلی‌لیتر",
        "labelEn": "355 ml",
        "price": 6486000,
        "originalPrice": 7088000
      }
    ],
    "variants": [
      {
        "id": "var-pori-290",
        "name": "حجم ۳۵۵ میلی‌لیتر",
        "nameEn": "355 ml",
        "price": 6486000,
        "originalPrice": 7088000,
        "stockCount": 2,
        "sku": "IN1720767807"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "خاک رس تصفیه‌شده",
        "nameEn": "Purifying Clay (Hectorite)",
        "description": "جذب چربی مازاد و پاکسازی عمقی منافذ بدون برهم زدن تعادل رطوبت سد پوستی."
      }
    ],
    "usageRoutine": {
      "morning": "روی پوست مرطوب صورت کف کرده و با حرکات دورانی ماساژ دهید (دور چشم نرسد)، سپس با آب ولرم آبکشی کنید.",
      "night": "روی پوست مرطوب صورت کف کرده و با حرکات دورانی ماساژ دهید (دور چشم نرسد)، سپس با آب ولرم آبکشی کنید."
    },
    "badges": [
      "۲٪ سالیسیلیک اسید",
      "فاقد عطر و پارابن",
      "حاوی خاک رس و سرامید"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۷/۰۹",
    "targetAudience": "پوست‌های چرب، مختلط و مستعد جوش، آکنه و منافذ مسدود.",
    "unsuitableFor": "برای پوست‌های بسیار خشک و حساس ممکن است روزانه دو بار زیاد باشد (یک بار در شب کافی است)."
  },
  {
    "id": "product-pori-181",
    "nameFa": "اسنس روشن‌کننده و ضدپیری گالاکتومایسس ۹۵ کوزارکس",
    "nameEn": "COSRX Galactomyces 95 Tone Balancing Essence",
    "brand": "COSRX",
    "productType": "serum",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "anti-aging",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "brightening",
      "hydration"
    ],
    "routineStep": "گام ۲/۳: اسنس متعادل‌کننده و روشن‌کننده",
    "howToUse": "صبح و شب پس از تونر، ۲ پمپ روی پوست صورت و گردن پخش کرده و به‌آرامی ضربه بزنید تا جذب شود.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "panthenol",
      "allantoin",
      "galactomyces"
    ],
    "descriptionFa": "گالاکتومایسس نوعی مخمر است که محصول فرعی فرایند تخمیر ساکی یا آبجوی ژاپنی است. گالاکتومایس اولین بار توسط محققانی کشف شد که از جوان ماندن دست‌های آبجو سازان ژاپنی متعجب بودند! طبق تحقیقات گسترده مشخص شد که دست این افراد به علت در تماس بودن با گالاکتومایسس کاملاً جوان و بدون چروک است، درحالی‌که پوست صورتشان پیر و چروک شده است!\n\n95 درصد عصاره گالاکتومایسس با خواص آنتی اکسیدانی و کمک به کاهش سایز منافذ\n\nکمک به تحریک سلول های اپیدرم جهت تولید هیالورونیک اسید با خاصیت مرطوب کنندگی\n\nافزایش دهنده جذب و نفوذ بیشتر محصولات پوستی به لایه های زیرین و عمقی پوست\n\nمناسب استفاده انواع پوست بخصوص پوست های کدر، خسته و دارای لک\n\nروشن کننده، کاهش و رفع تیرگی و لک،کمک به ترمیم و بازسازی پوست\n\nحاوی ترکیبات بشدت غنی و مغذی جهت تغذیه و آبرسانی عمیق پوست\n\nدارای بافت بسیار غلیظ با جذب راحت و بدون حس سنگینی روی پوست\n\nسرشار مواد معدنی و طبیعی برای حفظ سلامت سرزندگی پوست\n\nاثرات آنتی اکسیدانی جهت جوانسازی و کند کننده روند پیری",
    "descriptionEn": "Concentrated essence with 95% Galactomyces ferment filtrate, niacinamide, and hyaluronic acid to brighten dull skin and refine texture.",
    "price": 1670000,
    "originalPrice": 2783000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/247/7c1314babaaf7120f94a698425921b11.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰۰ میلی‌لیتر",
        "labelEn": "100 ml",
        "price": 1670000,
        "originalPrice": 2783000
      }
    ],
    "variants": [
      {
        "id": "var-pori-202",
        "name": "حجم ۱۰۰ میلی‌لیتر",
        "nameEn": "100 ml",
        "price": 1670000,
        "originalPrice": 2783000,
        "stockCount": 2,
        "sku": "IN1714161366"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "آلانتوئین",
        "nameEn": "Allantoin",
        "description": "ترکیب التیام‌بخش و ضدتحریک که ضمن نرم کردن لایه شاخی، بازسازی بافتی را تسریع کرده و قرمزی پوست را آرام می‌کند."
      },
      {
        "nameFa": "عصاره تخمیری گالاکتومایسس",
        "nameEn": "Galactomyces Ferment Filtrate",
        "description": "مخمر تخمیری سرشار از آمینواسیدها و آنتی‌اکسیدان‌ها برای افزایش شفافیت، یکدستی بافت و کاهش کدری و ظاهر منافذ."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از تونر، ۲ پمپ روی پوست صورت و گردن پخش کرده و به‌آرامی ضربه بزنید تا جذب شود.",
      "night": "صبح و شب پس از تونر، ۲ پمپ روی پوست صورت و گردن پخش کرده و به‌آرامی ضربه بزنید تا جذب شود."
    },
    "badges": [
      "۹۵٪ گالاکتومایسس",
      "روشن‌کننده و شفاف‌کننده",
      "بافت سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷/۰۵",
    "targetAudience": "پوست‌های کدر، خسته، دارای لک سطحی و ناهماهنگی تناژ پوست.",
    "unsuitableFor": "افراد مبتلا به آکنه قارچی فعال (Malassezia Folliculitis) از محصولات تخمیری پرهیز کنند."
  },
  {
    "id": "product-pori-180",
    "nameFa": "اسنس ۲ در ۱ پاکسازی منافذ کوزارکس",
    "nameEn": "COSRX Two in One Poreless Power Liquid",
    "brand": "COSRX",
    "productType": "toner",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "acne-blemish",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۲: اسنس پاکسازی و سفت‌کننده منافذ",
    "howToUse": "پس از شست‌وشو با پد یا کف دست روی نواحی دارای منافذ باز بزنید؛ می‌توانید به عنوان ماسک پدی ۵ دقیقه‌ای نیز استفاده کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "panthenol",
      "salicylic-acid"
    ],
    "descriptionFa": "مخصوص انواع پوست است که با پاکسازی کامل منافذ به کوچک شدن و سفت شدن منافذ کمک می کند.این اسنس طراحی شده برای افرادی که با سالیسیلیک اسید حساسیت دارند یک پاک کننده عالی محسوب می شود زیرا که به طور کامل میکاپ،آلودگی و چربی را از بین می برد.\n\nکوچک کننده منافذ پوست\n\nسفت کننده پوست\n\nصاف کننده و تمیز کننده\n\nپاک کننده میکاپ و آلودگی ها\n\nپوست کدر را روشن تر می کند\n\nمنافذ مسدود شده پوست را تمیز می کند\n\nحدف کامل جوش های سرسیاه\n\nتعادل چربی پوست\n\nبدون ایجاد تحریک و حساسیت\n\nحذف سلول های مرده پوست\n\nفاقد مواد مضر\n\nوگان و بدون تست حیوانی\n\nمناسب افرادی که به سالیسیلیک اسید حساسیت دارند",
    "descriptionEn": "Gentle pore-tightening essence with white willow bark extract and BHA derivative to clear sebum, smooth texture, and cool enlarged pores.",
    "price": 3074000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/246/4801c1d83fd9255c2850e6c998e249eb.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰۰ میلی‌لیتر",
        "labelEn": "100 ml",
        "price": 3074000
      }
    ],
    "variants": [
      {
        "id": "var-pori-201",
        "name": "حجم ۱۰۰ میلی‌لیتر",
        "nameEn": "100 ml",
        "price": 3074000,
        "stockCount": 2,
        "sku": "IN1714161141"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      }
    ],
    "usageRoutine": {
      "morning": "پس از شست‌وشو با پد یا کف دست روی نواحی دارای منافذ باز بزنید؛ می‌توانید به عنوان ماسک پدی ۵ دقیقه‌ای نیز استفاده کنید.",
      "night": "پس از شست‌وشو با پد یا کف دست روی نواحی دارای منافذ باز بزنید؛ می‌توانید به عنوان ماسک پدی ۵ دقیقه‌ای نیز استفاده کنید."
    },
    "badges": [
      "وگان و کرولتی‌فری",
      "ملایم برای پوست حساس",
      "پاکسازی منافذ"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های دارای منافذ باز، جوش سرسیاه، چربی اضافی و حساس به سالیسیلیک اسید قوی.",
    "unsuitableFor": "روی پوست زخمی و ملتهب استفاده نشود."
  },
  {
    "id": "product-pori-117",
    "nameFa": "سرم ضدلک و روشن‌کننده آلفا آربوتین ۲٪ + هیالورونیک اسید اوردینری",
    "nameEn": "The Ordinary Alpha Arbutin 2% + HA Concentrated Serum",
    "brand": "The Ordinary",
    "productType": "serum",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "brightening"
    ],
    "routineStep": "گام ۳: سرم درمانی ضدلک",
    "howToUse": "صبح و شب چند قطره روی پوست تمیز قبل از کرم بزنید. در روتین صبح حتماً از ضدآفتاب استفاده کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "pha",
      "arbutin"
    ],
    "descriptionFa": "حاوی ماده آلفا آربوتین است و با لایه برداری از سطح پوست به رفع لک های صورت و جای جوش ها کمک کرده و باعث شفاف شدن پوست می شود. برای تامین رطوبت پوست و جلوگیری از خشک و حساس شدن آن در اثر لایه برداری از ترکیبات آبرسان مانند هیالورونیک اسید نیز در این سرم استفاده شده است\n\n———- - •حاوی 2% آلفا آربوتین و هیالورونیک اسید •درمان و بهبود انواع لک های قهوه ای و جای جوش •آبرسانی و جلوگیری از خشک شدن پوست •روشن کننده و شفاف کننده پوست •دارای فرمولاسیون بسیار سبک و زود جذب •بدون ایجاد حس سنگینی روی پوست •دارای ترکیبات کاملا گیاهی و وگان •فاقد عطر و مواد حساسیت ‌زا •فاقد مواد مضر، سولفات‌، پارابن، گلوتن، الکل، هیدروکینون و ... •بدون تست بر روی حیوانات •مناسب برای انواع پوست حتی پوست حساس\n\n————-\n\nمحصول:کانادا",
    "descriptionEn": "Water-based brightening serum with 2% alpha-arbutin and hyaluronic acid to visibly reduce dark spots, hyperpigmentation, and acne scars.",
    "price": 3932000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/167/050af237c8bd3b8fd8a7ce1188252f8c.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 3932000
      }
    ],
    "variants": [
      {
        "id": "var-pori-133",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 3932000,
        "stockCount": 2,
        "sku": "IN1711520036"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پلی‌هیدروکسی اسید (PHA)",
        "nameEn": "Polyhydroxy Acid (PHA)",
        "description": "لایه‌بردار ملایم نسل جدید با مولکول بزرگ‌تر که بدون تحریک پوست حساس، سلول‌های مرده را پاکسازی و رطوبت را حفظ می‌کند."
      },
      {
        "nameFa": "آلفا آربوتین",
        "nameEn": "Alpha-Arbutin",
        "description": "روشن‌کننده ایمن و هدفمند که با مهار تدریجی آنزیم تیروزیناز، تولید ملانین اضافی و لک‌های تیره را کاهش می‌دهد."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب چند قطره روی پوست تمیز قبل از کرم بزنید. در روتین صبح حتماً از ضدآفتاب استفاده کنید.",
      "night": "صبح و شب چند قطره روی پوست تمیز قبل از کرم بزنید. در روتین صبح حتماً از ضدآفتاب استفاده کنید."
    },
    "badges": [
      "۲٪ آلفا آربوتین",
      "وگان و فاقد عطر",
      "ضدلک تخصصی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کانادا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های دارای لک‌های قهوه‌ای، لک آفتاب و تیرگی جای جوش.",
    "unsuitableFor": "مورد منع خاص ندارد؛ هم‌زمان با ویتامین C بسیار اسیدی ممکن است کمی حساسیت ایجاد کند."
  },
  {
    "id": "product-pori-37",
    "nameFa": "ژل شست‌وشوی صورت گل‌های لطیف لورال مناسب پوست خشک و حساس",
    "nameEn": "L’Oréal Paris Fine Flowers Cleansing Gel Dry & Sensitive Skin",
    "brand": "L’Oréal",
    "productType": "cleanser",
    "category": "sensitive-skin",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "sensitive",
      "soothing",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "soothing",
      "minimal"
    ],
    "routineStep": "گام ۱: شوینده ملایم بدون صابون",
    "howToUse": "صبح و شب روی پوست مرطوب صورت و گردن ماساژ داده و سپس با آب ولرم آبکشی کنید.",
    "ingredientTags": [
      "glycerin",
      "rose"
    ],
    "descriptionFa": "- پاک کننده و حذف ناخالصی های کامل پوست\n\n- حاوی عصاره گل رز و گل یاسمین\n\n- نرم کننده و لطافت بخش\n\n- خاصیت افزایش ارتجاعی پوست\n\n- مناسب استفاده روزانه\n\n- ایده آل برای پوست های خشک و حساس\n\n- فرمولاسیون بدون الکل و صابون\n\n- تست شده توسط متخصصین پوست\n\n————————-",
    "descriptionEn": "Soap-free, alcohol-free soothing gel cleanser enriched with rose and jasmine extracts to gently purify and soften dry, sensitive skin.",
    "price": 1644000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/76/0a7acf90fb59f74edee14cd8d76dd5de.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵۰ میلی‌لیتر",
        "labelEn": "150 ml",
        "price": 1644000
      }
    ],
    "variants": [
      {
        "id": "var-pori-46",
        "name": "حجم ۱۵۰ میلی‌لیتر",
        "nameEn": "150 ml",
        "price": 1644000,
        "stockCount": 2,
        "sku": "IN1711020909"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      },
      {
        "nameFa": "عصاره گل رز و یاسمن",
        "nameEn": "Rosa Gallica & Jasmine Extract",
        "description": "طراوت‌بخش و التیام‌بخش ملایم جهت حفظ لطافت و آرامش پوست‌های خشک و حساس هنگام شست‌وشو."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب روی پوست مرطوب صورت و گردن ماساژ داده و سپس با آب ولرم آبکشی کنید.",
      "night": "صبح و شب روی پوست مرطوب صورت و گردن ماساژ داده و سپس با آب ولرم آبکشی کنید."
    },
    "badges": [
      "فاقد صابون و الکل",
      "عصاره گل رز و یاسمن",
      "تست متخصصین پوست"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آلمان",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های خشک، لطیف و حساس نیازمند شوینده روزانه غیرتحریک‌کننده.",
    "unsuitableFor": "از تماس مستقیم با داخل چشم پرهیز شود."
  },
  {
    "id": "product-pori-1558",
    "nameFa": "کرم رفع ترک پا و لایه‌بردار سراوی مدل Renewing SA",
    "nameEn": "CeraVe SA Renewing Foot Cream",
    "brand": "CeraVe",
    "productType": "hair-body",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "hair-body"
    ],
    "routines": [
      "night",
      "barrier-repair"
    ],
    "routineStep": "مراقبت تخصصی پا: نرم‌کننده و رفع ترک پاشنه",
    "howToUse": "پس از شستن و خشک کردن پاها، روی کف پا و پاشنه‌های ضخیم و ترک‌دار ماساژ دهید؛ ترجیحاً شب‌ها و همراه با جوراب نخی.",
    "ingredientTags": [
      "hyaluronic-acid",
      "ceramide",
      "salicylic-acid",
      "lactic-acid"
    ],
    "descriptionFa": "کرم رفع ترک پا سراوی مدل Renewing SA سراوی CeraVe حجم 88میل\n\nکرم رفع ترک پا سراوی مدل SA Renewing، محصولی تخصصی برای مراقبت از پوست خشک، زبر و ضخیم کف پا و پاشنه است که به نرم شدن پوست، کاهش زبری و بهبود ظاهر ترک‌های سطحی کمک می‌کند. این کرم با بهره‌گیری از ترکیبات لایه‌بردار ملایم و مرطوب‌کننده، به حذف سلول‌های مرده سطح پوست کمک کرده و لطافت و نرمی بیشتری به پاها می‌بخشد.\n\nفرمولاسیون این محصول از برند معتبر CeraVe با هدف تقویت سد دفاعی پوست و حفظ رطوبت طراحی شده است. وجود ترکیباتی مانند سالیسیلیک اسید، سرامیدها و هیالورونیک اسید، این کرم را به گزینه‌ای مناسب برای افرادی تبدیل می‌کند که از خشکی شدید، زبری پاشنه و تجمع سلول‌های مرده در کف پا رنج می‌برند.\n\nبافت کرم به‌گونه‌ای طراحی شده است که به‌راحتی روی پوست پخش شود و برای استفاده منظم در روتین مراقبت از پا مناسب باشد.\n\nویژگی‌ها و مزایای کرم رفع ترک پا سراوی\n\n- کمک به کاهش خشکی و زبری پوست کف پا و پاشنه\n\n- کمک به نرم شدن پوست ضخیم و زبر پا\n\n- لایه‌برداری ملایم و کمک به حذف سلول‌های مرده سطح پوست\n\n- کمک به بهبود ظاهر ترک‌های سطحی پاشنه\n\n- کمک به حفظ رطوبت و جلوگیری از خشکی بیشتر پوست\n\n- حاوی سرامیدهای ضروری برای حمایت از سد دفاعی پوست\n\n- حاوی هیالورونیک اسید برای کمک به حفظ رطوبت پوست\n\n- مناسب برای استفاده منظم روی نواحی خشک و زبر پا\n\n- تولیدشده توسط برند معتبر مراقبت از پوست CeraVe\n\n- حجم کاربردی ۸۸ میلی‌لیتر\n\nترکیبات مؤثر و عملکرد آن‌ها\n\n۱. سالیسیلیک اسید (Salicylic Acid)\n\nسالیسیلیک اسید یک ترکیب لایه‌بردار است که به جدا شدن سلول‌های مرده سطح پوست کمک می‌کند. این ماده با کاهش تجمع سلول‌های مرده، به نرم‌تر شدن نواحی ضخیم و زبر کف پا و پاشنه کمک می‌کند.\n\n۲. سرامیدها (Ceramides)\n\nسرامیدها از ترکیبات مهم سد دفاعی طبیعی پوست هستند و به حفظ رطوبت و محافظت از پوست در برابر عوامل خشک‌کننده محیطی کمک می‌کنند. وجود سرامیدها در فرمولاسیون کرم، برای مراقبت از پوست خشک و آسیب‌پذیر پا اهمیت دارد.\n\n۳. هیالورونیک اسید (Hyaluronic Acid)\n\nهیالورونیک اسید به جذب و حفظ آب در پوست کمک می‌کند و در نتیجه می‌تواند باعث افزایش لطافت و انعطاف‌پذیری پوست شود. این ویژگی در مراقبت از پاشنه‌های خشک و زبر اهمیت ویژه‌ای دارد.\n\n۴. ترکیبات مرطوب‌کننده\n\nترکیبات مرطوب‌کننده موجود در فرمولاسیون محصول به کاهش احساس خشکی و زبری کمک کرده و باعث می‌شوند پوست پا نرم‌تر و لطیف‌تر به نظر برسد.\n\nتوجه: ترکیبات دقیق محصول ممکن است با توجه به بازار عرضه یا نسخه تولید متفاوت باشد؛ برای مشاهده فهرست کامل مواد تشکیل‌دهنده، بسته‌بندی محصول را بررسی کنید.\n\nکرم سراوی SA Renewing برای چه افرادی مناسب است؟\n\nاین کرم برای افرادی مناسب است که با مشکلات زیر مواجه هستند:\n\n- خشکی شدید کف پا و پاشنه\n\n- زبری و ضخیم شدن پوست پا\n\n- تجمع سلول‌های مرده در نواحی پاشنه\n\n- ترک‌های سطحی ناشی از خشکی پوست\n\n- کاهش لطافت و نرمی پوست پا\n\n- نیاز به مراقبت منظم برای حفظ رطوبت و ن",
    "descriptionEn": "Exfoliating and moisturizing foot cream with salicylic acid, ammonium lactate, 3 essential ceramides, and hyaluronic acid to soften rough, cracked heels.",
    "price": 4396000,
    "originalPrice": 4725000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4587/79f8b8b5baf23c0f848554abc33fe4af.png",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4589/9ce05dd1e3c7e89fc98b33d6ea50eb5a.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4588/7c9bb0a406e1753df86603f881ee0674.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۸۸ میلی‌لیتر",
        "labelEn": "88 ml",
        "price": 4396000,
        "originalPrice": 4725000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1716",
        "name": "حجم ۸۸ میلی‌لیتر",
        "nameEn": "88 ml",
        "price": 4396000,
        "originalPrice": 4725000,
        "stockCount": 1,
        "sku": "IN1792429465"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "لاکتیک اسید (AHA)",
        "nameEn": "Lactic Acid (AHA)",
        "description": "لایه‌بردار ملایم و آبرسان که ضمن حذف سلول‌های کدر سطحی، فاکتورهای مرطوب‌کننده طبیعی پوست را تقویت می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "پس از شستن و خشک کردن پاها، روی کف پا و پاشنه‌های ضخیم و ترک‌دار ماساژ دهید؛ ترجیحاً شب‌ها و همراه با جوراب نخی."
    },
    "badges": [
      "سالیسیلیک اسید + سرامید",
      "فاقد عطر",
      "رفع ترک پاشنه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "افراد با پاشنه و کف پای خشک، زبر، ضخیم و دارای ترک‌های سطحی.",
    "unsuitableFor": "روی زخم باز، ترک‌های عمیق خون‌ریزی‌دهنده استفاده نشود؛ بیماران دیابتی پیش از مصرف با پزشک مشورت کنند."
  },
  {
    "id": "product-pori-1515",
    "nameFa": "تونر جوانساز و نرم‌کننده ابریشم پپتاید و EGF سانگ بون ادیتور",
    "nameEn": "SUNGBOON EDITOR Silk Peptide EGF Intensive Smoothing Toner",
    "brand": "SUNGBOON EDITOR",
    "productType": "toner",
    "category": "anti-aging",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "anti-aging",
      "hydration",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "anti-aging",
      "hydration"
    ],
    "routineStep": "گام ۲: تونر آبرسان و نرم‌کننده",
    "howToUse": "صبح و شب بعد از شست‌وشوی صورت با کف دست یا پد روی پوست پخش کرده و با ضربات ملایم جذب نمایید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "peptides",
      "egf",
      "silk-amino"
    ],
    "descriptionFa": "تونر جوانساز و نرم کننده قوی ابریشم پپتاید EGF سانگ بون ادیتور\n\nSUNGBOON EDITOR Silk Peptide EGF Intensive Smoothing Toner – 300 ml\n\nتونر Silk Peptide EGF Intensive Smoothing از برند کره‌ای SUNGBOON EDITOR یک تونر آبرسان، نرم‌کننده و جوانساز است که با تمرکز بر بهبود ظاهر پوست، افزایش لطافت و کمک به تقویت سد دفاعی پوست فرموله شده است. این محصول با بافت سبک و رطوبت‌رسان خود، بعد از شست‌وشو به پوست کمک می‌کند احساس خشکی و کشیدگی کمتری داشته باشد و برای مراحل بعدی روتین آماده شود.\n\nفرمول این تونر با ترکیباتی مانند پپتیدها و EGF طراحی شده است تا به بهبود ظاهر پوست خسته و کدر کمک کرده و پوستی نرم‌تر، صاف‌تر و شاداب‌تر ایجاد کند. حجم 300 میلی‌لیتری نیز آن را به گزینه‌ای کاربردی برای استفاده روزانه تبدیل کرده است.\n\nویژگی‌های تونر ابریشم پپتاید EGF سانگ بون ادیتور\n\n- آبرسان و رطوبت‌رسان پوست\n\n- نرم‌کننده و لطافت‌بخش قوی\n\n- کمک به بهبود ظاهر خطوط ریز و نشانه‌های خستگی پوست\n\n- کمک به افزایش ظاهر شاداب و جوان پوست\n\n- کمک به تقویت و حفظ سد دفاعی پوست\n\n- مناسب برای پوست‌های خشک، دهیدراته و کدر\n\n- دارای ترکیبات پپتیدی و EGF\n\n- کمک به ایجاد پوستی صاف‌تر و نرم‌تر\n\n- بافت سبک و مناسب استفاده روزانه\n\n- قابل استفاده در روتین صبح و شب\n\n- حجم بالا و اقتصادی 300 میلی‌لیتر\n\nترکیبات مؤثر و شاخص\n\nپپتیدها (Peptides)\n\nپپتیدها از ترکیبات پرکاربرد در محصولات مراقبت از پوست هستند که به مراقبت از پوست و بهبود ظاهر آن کمک می‌کنند. استفاده منظم از محصولات حاوی پپتید می‌تواند به داشتن پوستی صاف‌تر، باطراوت‌تر و جوان‌تر کمک کند.\n\nEGF یا Epidermal Growth Factor یکی از ترکیبات مورد توجه در محصولات مراقبت از پوست است که با هدف حمایت از فرایندهای طبیعی پوست و بهبود ظاهر آن مورد استفاده قرار می‌گیرد. وجود EGF در این تونر، آن را به گزینه‌ای مناسب برای روتین‌های مراقبت از پوست با تمرکز بر جوانسازی و شادابی تبدیل کرده است.\n\nترکیبات آبرسان و نرم‌کننده\n\nترکیبات رطوبت‌رسان موجود در فرمول به حفظ رطوبت پوست کمک می‌کنند و باعث می‌شوند پوست پس از استفاده احساس نرم‌تر، لطیف‌تر و راحت‌تری داشته باشد.\n\nبافت و عملکرد محصول\n\nتونر سانگ بون ادیتور دارای بافتی سبک و رطوبت‌رسان است که به‌راحتی روی پوست پخش می‌شود و حس سنگینی ایجاد نمی‌کند. این تونر را می‌توان مستقیماً پس از شست‌وشوی صورت استفاده کرد تا پوست علاوه بر دریافت رطوبت، برای استفاده از سرم، اسنس و کرم آماده شود.\n\nاستفاده مداوم از این محصول می‌تواند به داشتن پوستی نرم، لطیف، مرطوب و شاداب کمک کند.\n\nمناسب چه نوع پوستی است؟\n\nاین تونر برای انواع پوست قابل استفاده است، اما به‌خصوص برای افرادی که با موارد زیر مواجه هستند انتخاب مناسبی محسوب می‌شود:\n\n- پوست خشک و کم‌آب\n\n- پوست کدر و خسته\n\n- پوست دارای احساس کشیدگی بعد از شست‌وشو\n\n- پوست با زبری و کاهش لطافت\n\n- پوست‌هایی که به روتین مراقبتی جوانساز نیاز دارند\n\n- پوست‌های بالغ و دارای خطوط ریز\n\nاگر پوست شما چرب",
    "descriptionEn": "Economical 300ml smoothing and hydrating toner with silk peptides and EGF to soften skin texture, replenish moisture, and support firmness.",
    "price": 7513000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4332/eda975943512865b4a7973430bb8089a.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4336/daa6f9f58b665d7d9c78f3631d4778c8.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4334/873d38a1c44cee3574db3ebe8f34cad3.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4335/59d75c233028e166244d9183cb1b5ddb.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4338/6868594bd39aa4c45f29ff6ec26f9cf0.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4337/dfc1a1e3c189b827dc964533a4628c53.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4333/fdc8662294a9f84b21d6d79d2e7410bf.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4339/b382a638b5292427fb018349c5e5fb6b.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰۰ میلی‌لیتر",
        "labelEn": "300 ml",
        "price": 7513000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1666",
        "name": "حجم ۳۰۰ میلی‌لیتر",
        "nameEn": "300 ml",
        "price": 7513000,
        "stockCount": 1,
        "sku": "IN1791307149"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "پپتایدهای فعال زیستی",
        "nameEn": "Bio-Active Peptides",
        "description": "زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط کمک می‌کنند."
      },
      {
        "nameFa": "فاکتور رشد اپیدرمی (EGF)",
        "nameEn": "Epidermal Growth Factor (EGF)",
        "description": "پپتاید بازسازی‌کننده پیشرفته که نوسازی سلولی و استحکام پوست را تقویت کرده و علائم خستگی و افتادگی را کاهش می‌دهد."
      },
      {
        "nameFa": "پپتایدهای ابریشم",
        "nameEn": "Silk Peptides",
        "description": "ایجاد بافت نرم و لطیف، حفظ رطوبت سطحی و بهبود قوام و یکدستی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب بعد از شست‌وشوی صورت با کف دست یا پد روی پوست پخش کرده و با ضربات ملایم جذب نمایید.",
      "night": "صبح و شب بعد از شست‌وشوی صورت با کف دست یا پد روی پوست پخش کرده و با ضربات ملایم جذب نمایید."
    },
    "badges": [
      "حجم اقتصادی ۳۰۰ میل",
      "پپتاید ابریشم + EGF",
      "مناسب لایه‌گذاری"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "پوست‌های خشک، کم‌آب، کدر و دارای خطوط ظریف.",
    "unsuitableFor": "در صورت حساسیت به پروتئین ابریشم با تست پچ مصرف شود."
  },
  {
    "id": "product-pori-1235",
    "nameFa": "کرم کلاژن پرکننده و مرطوب‌کننده مویسچر فیلر لورال",
    "nameEn": "L’Oréal Paris Collagen Moisture Filler Daily Moisturizer",
    "brand": "L’Oréal",
    "productType": "moisturizer",
    "category": "anti-aging",
    "skinTypes": [
      "dry",
      "normal",
      "combination"
    ],
    "concerns": [
      "anti-aging",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "anti-aging",
      "hydration"
    ],
    "routineStep": "گام ۵: کرم مرطوب‌کننده کلاژن‌ساز",
    "howToUse": "صبح و شب پس از سرم، مقدار مناسبی را روی پوست صورت و گردن با حرکات رو به بالا ماساژ دهید.",
    "ingredientTags": [
      "collagen",
      "glycerin",
      "shea-butter"
    ],
    "descriptionFa": "کرم کلاژن پرکننده و مرطوب کننده مویسچر فیلر لورال\n\nL’Oreal Collagen Moisture Filler\n\nکرم مرطوب‌کننده و ضدپیری است که به‌طور خاص برای افزایش حجم پوست و کاهش خطوط و چین و چروک‌ها طراحی شده است. این کرم غنی‌شده با کلاژن، به پوست کمک می‌کند تا رطوبت مورد نیاز خود را تامین کرده و با گذشت زمان، ظاهری جوان‌تر و شاداب‌تر داشته باشد.\n\nکلاژن یکی از مهم‌ترین پروتئین‌های ساختاری پوست است که با افزایش سن، میزان آن کاهش می‌یابد و منجر به افتادگی و ایجاد خطوط و چروک‌ها می‌شود. کرم کلاژن مویسچر فیلر لورآل با بازسازی و تقویت کلاژن طبیعی پوست، به بهبود انعطاف‌پذیری و پر شدن خطوط ریز کمک می‌کند و پوستی صاف و نرم به شما می‌بخشد.\n\n- افزایش رطوبت پوست: آبرسانی عمیق که باعث نرمی و لطافت پوست می‌شود.\n\n- حاوی کلاژن: برای کمک به تقویت و بازسازی ساختار پوست.\n\n- کاهش خطوط و چین و چروک‌ها: به پر کردن خطوط ریز و بهبود ظاهر چین و چروک‌ها کمک می‌کند.\n\n- مناسب برای استفاده روزانه: بافت سبک و غیر چرب که به‌راحتی جذب پوست می‌شود.\n\n- ایده‌آل برای انواع پوست: به‌ویژه پوست‌های خشک و کم‌آب که نیاز به آبرسانی و تقویت دارند.",
    "descriptionEn": "Plumping anti-aging day/night cream enriched with collagen to deeply hydrate skin, restore bounce, and smooth fine lines.",
    "price": 4646000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2678/8bd0acd4efffa1183a4bb193650e1e3e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2682/7ec607cfb68dc8172dee6de031de2f99.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2681/06c320bb7e313874c88e7092f3e29bb4.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2680/75fc3b677d32eb067e27c69241e989ba.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2679/0cf521ac075e5b0e958ff9a836905b29.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 4646000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1360",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 4646000,
        "stockCount": 1,
        "sku": "IN1782514253"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      },
      {
        "nameFa": "کره شی (Shea Butter)",
        "nameEn": "Butyrospermum Parkii (Shea) Butter",
        "description": "تغذیه‌کننده غنی از اسیدهای چرب ضروری که خشکی شدید را برطرف کرده و سد لیپیدی پوست را نرم و مقاوم می‌سازد."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از سرم، مقدار مناسبی را روی پوست صورت و گردن با حرکات رو به بالا ماساژ دهید.",
      "night": "صبح و شب پس از سرم، مقدار مناسبی را روی پوست صورت و گردن با حرکات رو به بالا ماساژ دهید."
    },
    "badges": [
      "غنی‌شده با کلاژن",
      "ضدچروک روزانه",
      "بافت سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های خشک، کم‌آب و مستعد خطوط ظریف و کاهش قوام.",
    "unsuitableFor": "روی پوست‌های خیلی چرب و آکنه‌ای با احتیاط استفاده شود."
  },
  {
    "id": "product-pori-1198",
    "nameFa": "کرم ضدآفتاب تسکین‌دهنده سیکا مری اند می SPF50+",
    "nameEn": "Mary & May CICA Soothing Sun Cream SPF50+ PA++++",
    "brand": "Mary & May",
    "productType": "sunscreen",
    "category": "sunscreen",
    "skinTypes": [
      "sensitive",
      "dry",
      "combination",
      "oily",
      "normal"
    ],
    "concerns": [
      "sunscreen",
      "soothing",
      "hydration"
    ],
    "routines": [
      "morning",
      "soothing",
      "minimal"
    ],
    "routineStep": "گام ۶: ضدآفتاب و محافظت روزانه",
    "howToUse": "هر روز صبح ۱۵ دقیقه قبل از قرارگیری در معرض آفتاب به اندازه دو بند انگشت روی صورت و گردن بزنید و هر ۲ تا ۳ ساعت تمدید کنید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "centella",
      "panthenol",
      "vitamin-e",
      "glycerin",
      "adenosine"
    ],
    "descriptionFa": "کرم ضد آفتاب تسکین دهنده سیکا مری اند می\n\nMARY &amp; MAY CICA Soothing Sun Cream\n\nکرم ضد آفتاب تسکین دهنده سیکا مری اند می با SPF50+ PA++++ یک کرم ضد آفتاب چند منظوره و بدون آسیب به مرجان‌ها است که پوست را مرطوب و تسکین می‌دهد و در عین حال خواص روشن کنندگی و ضد پیری نیز دارد. این کرم ضد آفتاب با SPF 50+ PA++++ محافظت در برابر اشعه ماوراء بنفش را فراهم می‌کند و حاوی 10000 ppm کمپلکس F-CICA (هفت مشتق سنتلا آسیاتیکا تخمیر شده با مخمر) برای ایجاد اثر تسکین دهنده است. بافت سبک این کرم ضد آفتاب به سرعت جذب پوست می‌شود و رد سفیدی از خود به جا نمی‌گذارد.\n\n- سرشار از کمپلکس ۷ نوع عصاره سنتلا آسیاتیکا (Cica) شامل عصاره ریشه سنتلا، عصاره برگ سنتلا و عصاره کامل سنتلا آسیاتیکا به همراه ماد کا سوساید، آسیاتیکوزاید ماد کاسیک اسید و آسیاتیک اسید با خاصیت تسکین دهندگی کمک به کاهش قرمزی و تقویت سد دفاعی پوست.\n\n- حاوی فیلترهای پیشرفته محافظت نوری جهت محافظت وسیع و پایدار در برابر اشعه های UVA و UVB و کمک به ری از ایجاد لک تیرگی و علائم پیری ناشی از نور\n\n- دارای سدیم هیالورونات هیالورونیک اسید به همراه بتائین و گلیسیرین با خاصیت آبرسانی و کمک به حفظ رطوبت پوست بدون ایجاد حس سنگینی.\n\n- دارای توکوفرول ویتامین (E با عملکرد آنتی اکسیدانی و کمک به محافظت از پوست در برابر استرس های محیطی و رادیکال های آزاد\n\n- حاوی نیاسینامید با عملکرد کمک به روشن تر شدن پوست یکنواخت شدن تناژ و کاهش کدری ناشی از عوامل محیطی\n\n- سرشار از پانتنول با عملکرد کمک به آرامش پوست، تقویت سد رطوبتی و کاهش احساس خشکی و کشیدگی.\n\n- حاوی آدنوزین با خاصیت کمک به حفظ لطافت و شادابی پوست و بهبود ظاهر خسته و کدر پوست.\n\n- بدون ایجاد حس سنگینی چربی اضافه یا چسبندگی روی پوست و مناسب استفاده روزانه.\n\n- محافظت قوی از پوست با SPF۵۰ و +++++PA در برابر آسیب های ناشی از نور خورشید.\n\n- حفظ رطوبت پوست در طول روز بدون ایجاد احساس خشکی پس از استفاده از ضد آفتاب.\n\n- دارای بافت ،سبک نرم و زود جذب با فینیش مرطوب و طبیعی بدون ایجاد رد سفیدی\n\n- مناسب انواع پوست بخصوص پوست های حساس اته، مستعد قرمزی\n\n- استفاده زیر آرایش بدون ماسیده شدن یا پیل شدن روی پوست.",
    "descriptionEn": "Reef-safe lightweight chemical sunscreen with SPF50+ PA++++, 10,000ppm fermented F-CICA complex, hyaluronic acid, niacinamide, and panthenol with zero white cast.",
    "price": 2700000,
    "originalPrice": 3119000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2442/750a712990aedae9301c97cf71a8ffee.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2441/f50a1308f224741251cc3ba4bdd4681c.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2443/5627819d69329addff2c3c0f372013a3.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 2700000,
        "originalPrice": 3119000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1322",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 2700000,
        "originalPrice": 3119000,
        "stockCount": 1,
        "sku": "IN1781113856"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محلول در چربی که از غشای سلولی در برابر استرس اکسیداتیو محافظت کرده و نرمی پوست را حفظ می‌کند."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "هر روز صبح ۱۵ دقیقه قبل از قرارگیری در معرض آفتاب به اندازه دو بند انگشت روی صورت و گردن بزنید و هر ۲ تا ۳ ساعت تمدید کنید.",
      "night": "این محصول مخصوص روتین روزانه صبح است و در روتین شب با شوینده مناسب پاکسازی می‌شود."
    },
    "badges": [
      "SPF50+ PA++++",
      "بدون رد سفیدی",
      "حاوی سیکا و پانتنول"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "انواع پوست به‌ویژه پوست‌های حساس، مستعد قرمزی و مناسب زیر آرایش.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1134",
    "nameFa": "تونر شیری شماره ۳ کنترل منافذ بیفیدا و باکوچیول نامبوزین",
    "nameEn": "Numbuzin No.3 Bifida Bakuchiol Zero Pore Milky Toner Light",
    "brand": "Numbuzin",
    "productType": "toner",
    "category": "anti-aging",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "anti-aging",
      "acne-blemish",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "anti-aging",
      "hydration"
    ],
    "routineStep": "گام ۲: تونر شیری کنترل منافذ",
    "howToUse": "صبح و شب پس از شست‌وشوی صورت، مقدار کافی روی پوست زده و با ضربات ملایم جذب کنید.",
    "ingredientTags": [
      "bakuchiol",
      "galactomyces",
      "bifida"
    ],
    "descriptionFa": "تونر نامبوزین روشن کننده شیری کنترل منافذ شماره 3 بیفیدا باکوچیول زیرو پور\n\nتونر شیری شماره 3 بیفیدا باکوچیول زیرو پور NUMBUZIN شماره 3، 200 میلی‌لیتر، یک تونر شیری سبک است که برای مراقبت از منافذ قابل مشاهده، بافت پوستی نرم‌تر و هیدراتاسیون روزانه تازه طراحی شده است.\n\nاین محصول حاوی 57٪ بیفیدا و گالاکتومایسس به همراه باکوچیول تخمیر شده برای کاربرانی است که به دنبال مراقبت از منافذ با تمرکز بر منافذ هستند.\n\nاین فرمول برای پشتیبانی از منافذ با ظاهری اصلاح شده، بافت پوست متعادل و یک پوشش شیری نرم بدون باقی مانده سنگین طراحی شده است.\n\nاین تونر دارای بافت شیری سبک است که به راحتی پخش می‌شود و در روتین‌های مراقبت از پوست روزانه به راحتی لایه برداری می‌شود.\n\nاین تونر برای پوستی مناسب است که خشن به نظر می‌رسد، ناهموار است یا به رطوبت سبک با پشتیبانی از مراقبت از منافذ نیاز دارد.\n\n- نکات برجسته: بیفیدا و گالاکتومایسس ۵۷٪ برای مراقبت متمرکز بر منافذ\n\n- حاوی باکوچیول تخمیر شده برای تثبیت بافت پوست\n\n- بافت تونر شیری سبک با لایه‌بندی تازه و راحت\n\nپشتیبانی از بافت پوست نرم‌تر و آبرسانی روزانه\n\n- مناسب برای منافذ قابل مشاهده و مشکلات بافت ناهموار\n\n- نوع پوست: چرب، مختلط، معمولی، همه انواع پوست\n\n- مشکل: منافذ قابل مشاهده، بافت خشن، ظاهر ناهموار پوست، کم‌آبی\n\nبافت: تونر شیری سبک\n\nترکیبات کلیدی: بیفیدا، گالاکتومایسس ۵۷٪، باکوچیول تخمیر شده\n\nاثر: به بهبود ظاهر منافذ، بافت نرم‌تر و تعادل پوست تازه کمک می‌کند\n\nروش استفاده: پس از تمیز کردن پوست، به طور یکنواخت استفاده کنید و به آرامی برای جذب ضربه بزنید\n\nهدف: کاربرانی که به دنبال تونر شیری بیفیدا باکوچیول برای مراقبت روزانه از منافذ هستند",
    "descriptionEn": "Lightweight milky toner featuring 57% Bifida & Galactomyces ferments plus fermented bakuchiol to refine pores and smooth skin texture.",
    "price": 3931000,
    "originalPrice": 4421000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2185/c0bff85ac6bf5618199850232bc461fc.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2183/fd22eb33cc8179748bfa2ac354e17521.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2182/7353e8d49bf3bda340ea6ea4f681b58a.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2184/4bd6678fd687ed932c0240c22e06c173.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۰۰ میلی‌لیتر",
        "labelEn": "200 ml",
        "price": 3931000,
        "originalPrice": 4421000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1253",
        "name": "حجم ۲۰۰ میلی‌لیتر",
        "nameEn": "200 ml",
        "price": 3931000,
        "originalPrice": 4421000,
        "stockCount": 1,
        "sku": "IN1777822837"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "باکوچیول تخمیرشده",
        "nameEn": "Fermented Bakuchiol",
        "description": "جایگزین گیاهی و ملایم رتینول که بدون ایجاد حساسیت یا پوسته‌ریزی، استحکام و بافت پوست را بهبود می‌بخشد."
      },
      {
        "nameFa": "عصاره تخمیری گالاکتومایسس",
        "nameEn": "Galactomyces Ferment Filtrate",
        "description": "مخمر تخمیری سرشار از آمینواسیدها و آنتی‌اکسیدان‌ها برای افزایش شفافیت، یکدستی بافت و کاهش کدری و ظاهر منافذ."
      },
      {
        "nameFa": "بیفیدا فرمنت لایزیت",
        "nameEn": "Bifida Ferment Lysate",
        "description": "پروبیوتیک تخمیری تقویت‌کننده میکروبیوم و سد دفاعی پوست که به بهبود بافت و افزایش مقاومت پوست کمک می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از شست‌وشوی صورت، مقدار کافی روی پوست زده و با ضربات ملایم جذب کنید.",
      "night": "صبح و شب پس از شست‌وشوی صورت، مقدار کافی روی پوست زده و با ضربات ملایم جذب کنید."
    },
    "badges": [
      "۵۷٪ بیفیدا و گالاکتومایسس",
      "باکوچیول تخمیری",
      "اصلاح منافذ"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "پوست‌های دارای منافذ قابل مشاهده، بافت زبر و نیاز به آبرسانی سبک.",
    "unsuitableFor": "افراد مبتلا به آکنه قارچی فعال (Malassezia) در ترکیبات تخمیری احتیاط کنند."
  },
  {
    "id": "product-pori-1097",
    "nameFa": "لوسیون مرطوب‌کننده و ضدخارش سراوی مدل Itch Relief",
    "nameEn": "CeraVe Itch Relief Moisturizing Lotion",
    "brand": "CeraVe",
    "productType": "moisturizer",
    "category": "sensitive-skin",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "sensitive",
      "soothing",
      "barrier-repair",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "soothing",
      "barrier-repair"
    ],
    "routineStep": "گام ۵: لوسیون التیام‌بخش ضدخارش",
    "howToUse": "روزانه ۳ تا ۴ بار (یا در صورت نیاز) روی نواحی خشک و دچار خارش صورت یا بدن بمالید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "ceramide",
      "vitamin-e",
      "allantoin",
      "pramoxine"
    ],
    "descriptionFa": "کرم مرطوب کننده و ضد خارش سراوی CeraVe مدل Itch Relief تسکین دهنده و بازسازی پوست اگزما\n\nیک راه حل موثر و کارساز برای برطرف کردن احساس خارش و ناراحتی پوست ناشی از اگزما و خارش‌های مکرر است. این محصول می‌تواند خارش ناشی از خشکی پوست، تحریکات جزئی آن، نیش و گزیدگی حشرات و حتی آفتاب سوختگی را به شکل سریع و موثری رفع کند. با هرکدام از این دلایل خارش که روبرو هستید، کرم تسکین دهنده Itch Relief سراوی می‌تواند شما را از خارش آزاردهنده خلاص کند.\n\n- تسکین دهنده سریع و ماندگار خارش پوست\n\n- موثر در رفع خارش ناشی از خشکی، تحریک پوست، نیش حشرات و آفتاب سوختگی\n\n- بازیابی و تقویت سد محافظتی پوست\n\n- حاوی 1% پراموکسین هیدروکلراید\n\n- حاوی نیاسینامید، آلانتوئین، 3 نوع سرامید ضروری، عصاره فلفل تاسمانی، ویتامین E و هیالورونیک اسید هیدرولیزشده\n\n- اثر فوری در 2 دقیقه و با •ماندگاری تا 8 ساعت\n\n- بدون عطر و استروئید\n\n- مجهز به فناوری MVE\n\nمناسب برای انواع پوست حتی پوست حساس\n\n- ساخته شده توسط متخصصین پوست\n\n- پذیرفته شده توسط انجمن ملی اگزما",
    "descriptionEn": "Steroid-free fast-acting anti-itch lotion with 1% pramoxine hydrochloride, 3 essential ceramides, niacinamide, and hyaluronic acid.",
    "price": 8937000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2034/ae7a4ba84f69e0732acdd3feceaae269.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2035/b275a6dca6c8bfbecbd0256f29a7173d.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۳۴۰ گرم",
        "labelEn": "340 g",
        "price": 8937000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1212",
        "name": "وزن ۳۴۰ گرم",
        "nameEn": "340 g",
        "price": 8937000,
        "stockCount": 1,
        "sku": "IN1776467319"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محلول در چربی که از غشای سلولی در برابر استرس اکسیداتیو محافظت کرده و نرمی پوست را حفظ می‌کند."
      },
      {
        "nameFa": "آلانتوئین",
        "nameEn": "Allantoin",
        "description": "ترکیب التیام‌بخش و ضدتحریک که ضمن نرم کردن لایه شاخی، بازسازی بافتی را تسریع کرده و قرمزی پوست را آرام می‌کند."
      },
      {
        "nameFa": "پراموکسین هیدروکلراید ۱٪",
        "nameEn": "Pramoxine Hydrochloride 1%",
        "description": "تسکین‌دهنده تخصصی و سریع خارش و تحریکات ناشی از خشکی شدید و اگزما بدون استفاده از استروئید."
      }
    ],
    "usageRoutine": {
      "morning": "روزانه ۳ تا ۴ بار (یا در صورت نیاز) روی نواحی خشک و دچار خارش صورت یا بدن بمالید.",
      "night": "روزانه ۳ تا ۴ بار (یا در صورت نیاز) روی نواحی خشک و دچار خارش صورت یا بدن بمالید."
    },
    "badges": [
      "فاقد استروئید و عطر",
      "تسکین خارش در ۲ دقیقه",
      "تایید انجمن اگزما"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های دچار خارش، خشکی شدید، اگزما، تحریکات پوستی و آفتاب‌سوختگی.",
    "unsuitableFor": "روی زخم‌های باز عمیق یا نواحی نزدیک چشم و مخاط استفاده نشود."
  },
  {
    "id": "product-pori-1090",
    "nameFa": "کرم آبرسان و ترمیم‌کننده پانتنول بامبو پیوریتو",
    "nameEn": "Purito Mighty Bamboo Panthenol Cream",
    "brand": "Purito",
    "productType": "moisturizer",
    "category": "sensitive-skin",
    "skinTypes": [
      "dry",
      "sensitive",
      "combination",
      "normal",
      "oily"
    ],
    "concerns": [
      "barrier-repair",
      "soothing",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "barrier-repair",
      "soothing",
      "hydration"
    ],
    "routineStep": "گام ۵: کرم ترمیم‌کننده سد دفاعی",
    "howToUse": "صبح و شب به عنوان آخرین مرحله مرطوب‌کننده روی پوست صورت و گردن بمالید تا جذب شود.",
    "ingredientTags": [
      "niacinamide",
      "panthenol",
      "peptides",
      "squalane",
      "collagen",
      "bamboo-extract"
    ],
    "descriptionFa": "کرم آبرسان و ترمیم کننده قوی پانتنول بامبوی پیوریتو\n\nاین کرم حاوی پانتنول و کرم بامبوی کره‌ای است که سد دفاعی آسیب‌دیده پوست را ترمیم می‌کند و با ترمیم پیشرفته و آب‌رسانی، درخشندگی بی‌نظیری به پوست می‌بخشد.\n\nبامبو دامیانگ کره‌ای رطوبت بدن را تقلید می‌کند و سد دفاعی پوست را تقویت می‌کند و یک سد رطوبتی ایجاد می‌کند. 10٪ پانتنول، سد دفاعی پوست را تقویت می‌کند و اسکوالان سطح رطوبت را افزایش می‌دهد. آزمایش سازگاری با پوست حساس و آزمایش ضد حساسیت انجام شده است.\n\n- پانتنول (پروویتامین B5): یک ماده‌ی آبرسان عمیق که به حفظ رطوبت، تسکین و آرام کردن پوست تحریک‌شده و افزایش عملکرد سد دفاعی پوست کمک می‌کند.\n\n- اسکوالان: یک مرطوب‌کننده‌ی بسیار مؤثر که از روغن‌های طبیعی پوست تقلید می‌کند، رطوبت سبکی را فراهم می‌کند و خاصیت ارتجاعی پوست را بدون مسدود کردن منافذ بهبود می‌بخشد.\n\n- بامبو (عصاره‌ی بامبوس ولگاریس): عصاره‌ی بامبو سرشار از آنتی‌اکسیدان‌ها، سیلیس و ویتامین‌هایی است که به آبرسانی، تسکین و تقویت پوست کمک می‌کنند. این عصاره رطوبت طبیعی پوست را تقلید می‌کند و ضمن تقویت سد دفاعی پوست، آبرسانی طولانی‌مدت را فراهم می‌کند. همچنین به بهبود خاصیت ارتجاعی پوست و ایجاد درخشندگی سالم کمک می‌کند.\n\n- نیاسینامید (ویتامین B3): نیاسینامید یک ماده‌ی قدرتمند است که به دلیل توانایی‌اش در روشن کردن رنگ پوست، کاهش ظاهر خطوط ریز و بهبود بافت پوست شناخته شده است. همچنین به تقویت سد دفاعی پوست، کاهش التهاب و تنظیم تولید چربی کمک می‌کند و آن را برای پوست‌های حساس و مستعد آکنه ایده‌آل می‌سازد. پپتیدها: زنجیره‌های کوتاهی از اسیدهای آمینه که تولید کلاژن را تحریک می‌کنند و به سفت شدن پوست، کاهش ظاهر خطوط ریز و چین و چروک و بهبود بافت و رنگ کلی پوست کمک می‌کنند.",
    "descriptionEn": "Barrier-repair gel-cream combining 10% panthenol, Korean Damyang bamboo extract, squalane, and niacinamide for long-lasting hydration and glow.",
    "price": 4132000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2016/a39c8d7ea35cfcebe2959edf55538c8c.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2018/5dc657a113d9e9decefc1927abbc73d0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2017/7491efa68278439b6eb4540fce281304.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2015/620c3ca54153efa0d73842ae52a3ae53.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰۰ میلی‌لیتر",
        "labelEn": "100 ml",
        "price": 4132000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1205",
        "name": "حجم ۱۰۰ میلی‌لیتر",
        "nameEn": "100 ml",
        "price": 4132000,
        "stockCount": 1,
        "sku": "IN1775836445"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "پپتایدهای فعال زیستی",
        "nameEn": "Bio-Active Peptides",
        "description": "زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط کمک می‌کنند."
      },
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک مشابه سبوم طبیعی پوست که بدون سنگینی، رطوبت را قفل و لطافت پوست را بازیابی می‌کند."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      },
      {
        "nameFa": "عصاره بامبوی کره‌ای",
        "nameEn": "Bambusa Vulgaris (Bamboo) Extract",
        "description": "سرشار از سیلیس و آمینواسیدها برای آبرسانی عمیق، آرام‌سازی پوست حساس و تقویت سد رطوبتی."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب به عنوان آخرین مرحله مرطوب‌کننده روی پوست صورت و گردن بمالید تا جذب شود.",
      "night": "صبح و شب به عنوان آخرین مرحله مرطوب‌کننده روی پوست صورت و گردن بمالید تا جذب شود."
    },
    "badges": [
      "۱۰٪ پانتنول",
      "ضدحساسیت",
      "ترمیم سد دفاعی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های حساس، تحریک‌شده، آسیب‌دیده در اثر لایه‌بردارها و کم‌آب.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1073",
    "nameFa": "بی‌بی کرم سفت‌کننده و ضدآفتاب سرامید فارم‌استی SPF50+",
    "nameEn": "Farmstay Ceramide Firming Facial BB Cream SPF50+ PA+++",
    "brand": "Farmstay",
    "productType": "sunscreen",
    "category": "sunscreen",
    "skinTypes": [
      "dry",
      "normal",
      "combination"
    ],
    "concerns": [
      "sunscreen",
      "anti-aging",
      "hydration"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "گام ۶: محافظت روزانه و پوشش طبیعی (BB کرم)",
    "howToUse": "صبح‌ها در آخرین مرحله روتین روی پوست مرطوب صورت به صورت یکنواخت پخش کنید.",
    "ingredientTags": [
      "ceramide",
      "snail-mucin",
      "collagen"
    ],
    "descriptionFa": "بی‌بی‌کرم سفت‌کننده صورت سرامید فارم‌استی Farmstay CERAMIDE FIRMING FACIAL BB Cream\n\nاین محصول حاوی سرامید است که به مرطوب کردن پوست کمک می‌کند و آن را سفت و مستحکم می‌سازد. این کرم پوست را صاف و یکدست کرده و یک کاور طبیعی و غیر درخشان به پوست می‌بخشد. این بی‌بی‌کرم بدون اینکه احساس چسبندگی یا چربی به پوست شما بدهد، از پوست در برابر اشعه‌های ماورای بنفش خورشید در هنگام فعالیت در فضای باز محافظت می‌کند. این محصول علاوه بر محافظت در برابر نور خورشید، پوست را روشن کرده و موجب بهبود چین و چروک پوست می‌شود. این کرم با (Spf+50) و (PA+++) از پوست در برابر اشعه‌های مضر خورشید محافظت می‌کند. از این کرم می‌توانید به عنوان پایه آرایش استفاده کنید. این بی‌بی‌کرم حاوی موکوس حلزون و کلاژن برای طراوت بیشتر پوست است.",
    "descriptionEn": "Firming multi-benefit BB cream with ceramides, snail mucin, collagen, and SPF50+ PA+++ protection for smooth natural coverage.",
    "price": 1929000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1958/51f8854c0d69822e2eee2efb358d998e.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1957/25ec5c13c4c6cbb586a8c07c8be9c24c.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۵۰ میلی‌لیتر",
        "labelEn": "50 ml",
        "price": 1929000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1188",
        "name": "حجم ۵۰ میلی‌لیتر",
        "nameEn": "50 ml",
        "price": 1929000,
        "stockCount": 1,
        "sku": "IN1775143252"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "موسین حلزون فیلترشده",
        "nameEn": "Snail Secretion Filtrate",
        "description": "سرشار از گلیکوپروتئین‌ها و اسید هیالورونیک طبیعی جهت ترمیم بافت، آبرسانی عمیق و افزایش الاستیسیته پوست."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      }
    ],
    "usageRoutine": {
      "morning": "صبح‌ها در آخرین مرحله روتین روی پوست مرطوب صورت به صورت یکنواخت پخش کنید.",
      "night": "این محصول مخصوص روتین روزانه صبح است و در روتین شب با شوینده مناسب پاکسازی می‌شود."
    },
    "badges": [
      "SPF50+ PA+++",
      "حاوی سرامید و موسین حلزون",
      "پایه آرایش طبیعی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "افرادی که به دنبال محافظت آفتاب، رطوبت‌رسانی و پوشش طبیعی و یکنواخت روزانه هستند.",
    "unsuitableFor": "در پایان روز حتماً با شوینده مناسب (دابل کلینز) پاک شود."
  },
  {
    "id": "product-pori-871",
    "nameFa": "لوسیون سرم روشن‌کننده و جوانساز گلوتا هیا وازلین",
    "nameEn": "Vaseline Gluta-Hya Flawless Glow Serum Burst Lotion",
    "brand": "Vaseline",
    "productType": "hair-body",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "brightening",
      "hydration",
      "hair-body"
    ],
    "routines": [
      "morning",
      "night",
      "brightening"
    ],
    "routineStep": "مراقبت بدن: لوسیون سرم روشن‌کننده",
    "howToUse": "روزانه پس از استحمام یا دو بار در روز روی پوست تمیز بدن ماساژ دهید تا جذب شود.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "vitamin-c",
      "glutathione"
    ],
    "descriptionFa": "لوسیون سرم جوانساز و روشن کننده گلوتا هیا وازلین\n\nبا لوسیون سرم درخشان کننده وازلین گلوتا-هیا فلاولس، درخشش خود را به رخ بکشید. این لوسیون با فناوری گلوتاگلو غنی شده است که 10 برابر قدرتمندتر از ویتامین C^ و اسید هیالورونیک است که به عنوان تقویت کننده رطوبت پوست برای داشتن پوستی درخشان و درخشان شناخته می‌شوند. ^ از عملکرد آنتی اکسیدانی مقایسه‌ای، بر اساس آزمایش آزمایشگاهی انجام شده با فناوری گلوتا\n\nوازلین گلوتا-هیا یک سرم فوق‌العاده در لوسیون با بافتی فوق‌العاده سبک است\n\nاز همان بار اول استفاده، پوستی به وضوح روشن‌تر به شما می‌دهد!\n\nفناوری گلوتاتیون که 10 برابر قدرت روشن‌کنندگی بیشتری نسبت به ویتامین C دارد. رطوبت پوست خود را با هیالورون افزایش دهید تا پوستی شاداب داشته باشید.\n\nبه کاهش لکه‌های تیره کمک می‌کند\n\nپوست کدر را یکدست می‌کند\n\n- روشن کننده\n\n- ضدلک و ضدتیرگی\n\n- یکنواخت کننده سطح پوست\n\n- تقویت کننده و تغذیه کننده.\n\n- آبرسان و رطوبت رسان\n\n- اثربخشی سریع\n\n- مناسب انواع تایپ پوستی",
    "descriptionEn": "Ultralight serum-burst body lotion powered by GlutaGlow technology, pro-retinol, and hyaluronic acid to visibly brighten dull skin.",
    "price": 2071000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1463/063490a9bb403dca03d8fa79224a2ff7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1462/09b6c787ec4c82af9e026314c295cecf.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۲۰۰ میلی‌لیتر",
        "labelEn": "200 ml",
        "price": 2071000
      }
    ],
    "variants": [
      {
        "id": "var-pori-952",
        "name": "حجم ۲۰۰ میلی‌لیتر",
        "nameEn": "200 ml",
        "price": 2071000,
        "stockCount": 1,
        "sku": "IN1759444270"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "ویتامین C پایدار",
        "nameEn": "Vitamin C (Ascorbic Acid)",
        "description": "آنتی‌اکسیدان قدرتمند جهت خنثی‌سازی رادیکال‌های آزاد، مهار ملانین اضافه برای کاهش لک و افزایش درخشش پوست."
      },
      {
        "nameFa": "گلوتاتیون",
        "nameEn": "Glutathione",
        "description": "آنتی‌اکسیدان تری‌پپتیدی قوی که با کنترل ملانین‌سازی، تیرگی و کدری پوست را کاهش داده و شفافیت چهره را افزایش می‌دهد."
      }
    ],
    "usageRoutine": {
      "morning": "روزانه پس از استحمام یا دو بار در روز روی پوست تمیز بدن ماساژ دهید تا جذب شود.",
      "night": "روزانه پس از استحمام یا دو بار در روز روی پوست تمیز بدن ماساژ دهید تا جذب شود."
    },
    "badges": [
      "فناوری Gluta-Hya",
      "بافت سبک بدون چسبندگی",
      "روشن‌کننده بدن"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "وازلین (تولید تایلند / بین‌المللی)",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست بدن کدر، دارای لک‌های سطحی و نیازمند آبرسانی سبک و درخشندگی.",
    "unsuitableFor": "برای استفاده روی پوست بدن طراحی شده است و برای صورت توصیه نمی‌شود."
  },
  {
    "id": "product-pori-863",
    "nameFa": "پچ ژلی دور چشم روشن‌کننده ویتامین C کی-سکرت",
    "nameEn": "K-SECRET Extra Illuminating Eye Gel Patches (Vitamin C)",
    "brand": "K-SECRET",
    "productType": "mask",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "hydration",
      "anti-aging"
    ],
    "routines": [
      "morning",
      "night",
      "brightening"
    ],
    "routineStep": "مراقبت تخصصی دور چشم: پچ هیدروژلی",
    "howToUse": "روی پوست تمیز زیر چشم (یا خط اخم و گردن) قرار دهید، ۱۵ تا ۲۰ دقیقه بگذارید بماند، بردارید و اسنس باقیمانده را ضربه‌ای جذب کنید.",
    "ingredientTags": [
      "niacinamide",
      "ceramide",
      "vitamin-c",
      "collagen"
    ],
    "descriptionFa": "پچ‌ ژلی دور چشم کی-سکرت فوق العاده روشن کننده (ویتامین C)\n\nاین پچ‌های هیدروژلی دور چشم با\n\nسفت کردن، نرم کردن و روشن کردن پوست، سلامت ناحیه زیر چشم را بازیابی می‌کنند.\n\nحاوی ویتامین C برای روشن کردن پوست، کاهش هایپرپیگمنتاسیون و افزایش سطح هیدراتاسیون، که منجر به پوستی درخشان و یکدست می‌شود.\n\nاین ماسک هیدروژلی سازگار با پوست، به عصاره اجازه می‌دهد تا به راحتی به لایه پوست نفوذ کند و اثرات خنک‌کننده و تسکین‌دهنده فوری را ارائه می‌دهد.\n\n- در دو اندازه موجود است که برای ناحیه وسیعی از پوست نواحی خاصی که دچار خطوط ریز هستند، طراحی شده‌اند.\n\n- پچ‌های هیدروژلی روشن‌کننده پوست غنی‌شده با ویتامین C با خواص ضد تیرگی، آبرسانی عمیق و تسکین‌دهنده.\n\n- ویتامین C آنتی‌اکسیدان قوی. به کاهش سنتز ملانین در پوست کمک می‌کند، در نتیجه به یکنواختی رنگ، روشن‌تر شدن پوست و کاهش رنگدانه‌ها کمک می‌کند.\n\n- نیاسینامید شکلی از ویتامین B-3 به پوست کمک می‌کند تا سد لیپیدی (سرامید) را برای رطوبت طولانی‌مدت ایجاد کند. این محصول دارای خواص التهابی و آنتی‌اکسیدانی قوی است که به تسکین پوست و ترمیم سلول‌ها کمک می‌کند.\n\n- کلاژن هیدرولیز شده شکل مولکولی کلاژن که به سرعت جذب پوست می‌شود، سلول‌های پوست را به هم متصل می‌کند و از تبخیر آب محافظت می‌کند و رطوبت طولانی‌مدت را برای آن فراهم می‌کند و خاصیت ارتجاعی پوست را بهبود می‌بخشد.\n\n- شکل منحصر به فرد - از آن در هر جایی که نیاز دارید استفاده کنید: ناحیه زیر چشم، پیشانی، چین‌های بینی، گردن و موارد دیگر",
    "descriptionEn": "Cooling hydrogel eye patches infused with vitamin C, niacinamide, and hydrolyzed collagen to brighten dark circles and hydrate fine lines.",
    "price": 3074000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1441/4626d58ee83beeaadccc328536703e72.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1443/e69feb44e8a98c5a84990b9480fb3f95.png",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1442/682d25b5a03b85c2da5bad0cec24a249.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۱۰۲ گرم (۶۰ عدد)",
        "labelEn": "102 g (60 Patches)",
        "price": 3074000
      }
    ],
    "variants": [
      {
        "id": "var-pori-944",
        "name": "وزن ۱۰۲ گرم (۶۰ عدد)",
        "nameEn": "102 g (60 Patches)",
        "price": 3074000,
        "stockCount": 1,
        "sku": "IN1758952647"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "ویتامین C پایدار",
        "nameEn": "Vitamin C (Ascorbic Acid)",
        "description": "آنتی‌اکسیدان قدرتمند جهت خنثی‌سازی رادیکال‌های آزاد، مهار ملانین اضافه برای کاهش لک و افزایش درخشش پوست."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "ایجاد شبکه نگهدارنده رطوبت روی سطح اپیدرم، افزایش قوام و خاصیت ارتجاعی پوست و کاهش نمای خطوط ریز."
      }
    ],
    "usageRoutine": {
      "morning": "روی پوست تمیز زیر چشم (یا خط اخم و گردن) قرار دهید، ۱۵ تا ۲۰ دقیقه بگذارید بماند، بردارید و اسنس باقیمانده را ضربه‌ای جذب کنید.",
      "night": "روی پوست تمیز زیر چشم (یا خط اخم و گردن) قرار دهید، ۱۵ تا ۲۰ دقیقه بگذارید بماند، بردارید و اسنس باقیمانده را ضربه‌ای جذب کنید."
    },
    "badges": [
      "ویتامین C + نیاسینامید",
      "خنک‌کننده فوری",
      "پچ هیدروژل"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "دور چشم تیره، پف‌دار، خسته و نیازمند درخشش و آبرسانی سریع.",
    "unsuitableFor": "از ورود به داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-837",
    "nameFa": "ژل شوینده پوست چرب و آکنه‌دار نورمادرم ویشی",
    "nameEn": "Vichy Normaderm Phytosolution Purifying Cleansing Gel",
    "brand": "Vichy",
    "productType": "cleanser",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "acne-blemish",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۱: شوینده ضدجوش و مات‌کننده",
    "howToUse": "صبح و شب روی پوست مرطوب صورت کف کرده، به‌آرامی ماساژ دهید و سپس آبکشی کنید.",
    "ingredientTags": [
      "salicylic-acid",
      "bifida"
    ],
    "descriptionFa": "ژل شوینده پوست چرب و آکنه دار نورمادرم ویشی\n\nژل شستشوی روزانه پوست چرب و آکنه دار ویشی افزون بر اینکه یک شوینده روزانه مناسب جهت میزان کردن چربی پوست افرادی که دارای پوست چرب و پر آکنه می باشد ، پوست صورت را به هیچ عنوان خشک نخواهد کرد و به علت داشتن سالسیلیک اسید یک ضد جوش عالی به شمار می رود . ژل پاک کننده عمقی نورمادرم ویشی فقط برای بانوان نیست، آقایان هم قادر اند از این محصول به عنوان شوینده صورت بهره بگیرند. این محصول دارای موادی است که به مرور زمان جای جوش را بهبود می بخشد.\n\n- پاک کننده آلودگی، غبار، آرایش و چربی اضافه پوست\n\n- کوچک کننده منافذ باز پوست و کاهش دهند جوش‌های سر سیاه\n\n- غنی شده با مواد معدنی و پروبیوتیک\n\n- تست شده تحت نظر متخصص پوست؛ ضد حساسیت\n\n- ایده‌آل برای پوست‌های چرب، مستعد آکنه و حساس\n\n- پاکسازی عمقی بدون ایجاد خشکی و کشیدگی پوست\n\n- اصلاح کننده بافت پوست\n\n- صاف کننده و لطافت بخش\n\n- کاهش دهنده عیوب پوست\n\n- بهبود رنگ پوست\n\n- مات کننده پوست\n\n- حاوی ترکیبات گیاهی\n\n- بدون سولفات، صابون و الکل",
    "descriptionEn": "Soap-free purifying cleansing gel with salicylic acid, minerals, and probiotic extract to unclog pores and control excess sebum without drying.",
    "price": 5218000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1378/fa206797bd320ef3145aad57d9a0d26b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1379/8b6db6869333c8ccc2714780003c83d1.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1380/a4c874c2f4f23df25abf76c181b56fdb.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰۰ میلی‌لیتر",
        "labelEn": "400 ml",
        "price": 5218000
      }
    ],
    "variants": [
      {
        "id": "var-pori-915",
        "name": "حجم ۴۰۰ میلی‌لیتر",
        "nameEn": "400 ml",
        "price": 5218000,
        "stockCount": 1,
        "sku": "IN1756960699"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "بیفیدا فرمنت لایزیت",
        "nameEn": "Bifida Ferment Lysate",
        "description": "پروبیوتیک تخمیری تقویت‌کننده میکروبیوم و سد دفاعی پوست که به بهبود بافت و افزایش مقاومت پوست کمک می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب روی پوست مرطوب صورت کف کرده، به‌آرامی ماساژ دهید و سپس آبکشی کنید.",
      "night": "صبح و شب روی پوست مرطوب صورت کف کرده، به‌آرامی ماساژ دهید و سپس آبکشی کنید."
    },
    "badges": [
      "فاقد صابون و سولفات",
      "حجم اقتصادی ۴۰۰ میل",
      "ضدجوش"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های چرب، مختلط، مستعد آکنه و منافذ باز (مناسب بانوان و آقایان).",
    "unsuitableFor": "از تماس با اطراف چشم پرهیز شود."
  },
  {
    "id": "product-pori-791",
    "nameFa": "کرم دور چشم بازسازی‌کننده و ضدچروک سراوی",
    "nameEn": "CeraVe Skin Renewing Eye Cream",
    "brand": "CeraVe",
    "productType": "eye-care",
    "category": "anti-aging",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "anti-aging",
      "hydration",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "anti-aging"
    ],
    "routineStep": "گام ۴: کرم دور چشم ضدچروک",
    "howToUse": "صبح و شب چند نقطه کوچک زیر چشم و گوشه خارجی چشم بزنید و به‌آرامی ضربه‌ای پخش کنید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "ceramide",
      "peptides",
      "caffeine"
    ],
    "descriptionFa": "کرم دور چشم بازسازی چین و چروک سراوی\n\nکرم دور چشم سراوی Cerave Skin Renewing در تمام طول روز رطوبت مورد نیاز پوست شما را تامین می‌کند. کرم دور چشم لیفت کننده سراوی حاوی ترکیباتی مانند کافئین است که چین و چروک، پف و سیاهی دور چشم را به وضوح کاهش می‌دهد. فرمولاسیون غنی این کرم دور چشم با پپتید، اسید هیالورونیک، نیاسینامید و سرامیدها غنی شده و باعث احیا، صاف و نرم شدن پوست دور چشم می‌شود.\n\n- آبرسان عمیق پوست\n\n- صاف و نرم کننده پوست اطراف چشم\n\n- حاوی سرامیدهای ضروری برای بازیابی سد محافظتی پوست\n\n- غنی شده با کافئین جهت کاهش پف، تیرگی و خطوط ریز\n\n- روشن کننده و سفت کننده پوست\n\n- حاوی هیالورونیک اسید، نیاسینامید و پپتید\n\n- بازسازی و احیا کننده پوست دور چشم\n\n- کاهش ظاهر چین و چروک‌های پنجه کلاغی\n\n- تست شده توسط متخصصان پوست و چشم پزشک\n\n- مناسب انواع پوست از جمله پوست‌های حساس و استفاده کنندگان از لنز\n\n- فرمولاسیون سبک با جذب سریع بدون حس چربی و چسبندگی\n\n- بدون آثار سفیدی با ظاهر نیمه مات\n\n- مناسب استفاده در زیر آرایش\n\n- فاقد عطر و پارابن",
    "descriptionEn": "Peptide and caffeine eye cream with hyaluronic acid, niacinamide, and 3 essential ceramides to smooth crow’s feet, reduce puffiness, and brighten dark circles.",
    "price": 5705000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1287/9a08ac20fe3c8498b2e36fb25823b891.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1286/0241af5f830ecee5046c71cdd36cd5f7.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۱۴ گرم",
        "labelEn": "14 g",
        "price": 5705000
      }
    ],
    "variants": [
      {
        "id": "var-pori-867",
        "name": "وزن ۱۴ گرم",
        "nameEn": "14 g",
        "price": 5705000,
        "stockCount": 1,
        "sku": "IN1753490349"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سرامیدهای ضروری",
        "nameEn": "Essential Ceramides (NP/AP/EOP)",
        "description": "بازسازی لایه لیپیدی بین‌سلولی، قفل کردن رطوبت درون پوست و جلوگیری از تبخیر آب و نفوذ عوامل محرک."
      },
      {
        "nameFa": "پپتایدهای فعال زیستی",
        "nameEn": "Bio-Active Peptides",
        "description": "زنجیره‌های آمینواسیدی پیام‌رسان که سنتز کلاژن و الاستین را تحریک کرده و به استحکام، لیفتینگ و کاهش خطوط کمک می‌کنند."
      },
      {
        "nameFa": "کافئین",
        "nameEn": "Caffeine",
        "description": "بهبود گردش خون مویرگی، کاهش پف و خستگی ناحیه دور چشم، و محافظت آنتی‌اکسیدانی در برابر استرس محیطی."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب چند نقطه کوچک زیر چشم و گوشه خارجی چشم بزنید و به‌آرامی ضربه‌ای پخش کنید.",
      "night": "صبح و شب چند نقطه کوچک زیر چشم و گوشه خارجی چشم بزنید و به‌آرامی ضربه‌ای پخش کنید."
    },
    "badges": [
      "پپتاید + کافئین",
      "مناسب زیر آرایش",
      "فاقد عطر و پارابن"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "دور چشم دارای خطوط پنجه کلاغی، پف، تیرگی و مناسب استفاده‌کنندگان از لنز.",
    "unsuitableFor": "از ورود مستقیم به چشم جلوگیری شود."
  },
  {
    "id": "product-pori-654",
    "nameFa": "فوم شست‌وشوی صورت کلینیک مناسب پوست چرب و مختلط",
    "nameEn": "Clinique All About Clean Rinse-Off Foaming Cleanser",
    "brand": "Clinique",
    "productType": "cleanser",
    "category": "cleanser",
    "skinTypes": [
      "oily",
      "combination"
    ],
    "concerns": [
      "acne-blemish",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "minimal"
    ],
    "routineStep": "گام ۱: فوم شست‌وشوی متعادل‌کننده چربی",
    "howToUse": "مقدار بسیار کمی (به اندازه یک نخود) با آب کف کرده روی پوست مرطوب ماساژ دهید و آبکشی نمایید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "glycerin"
    ],
    "descriptionFa": "فوم شستشوی صورت کلینیک مخصوص پوست چرب و چرب مختلط\n\nبا مقدار بسیار اندکى از قوم شوینده صورت کلینیک که کف بسیار غلیظی به وجود میاورد میتوانید آرایش صورت ، انواع ضد آفتاب، آلودگى ها، سلول های مرده و… به سرعت و به طور موثر از روى پوست شسته و به پوست احساس شادابی و طروات را هدیه دهید .فوم All About Clean Rinse-Off براى پوست هاى چرب و چرب مختلط توصیه مى شود تا برای تعادل رساندن میزان چربی پوست های چرب و چرب مختلط عملکرد بهتر و قوی تری از خود نشان دهد.\n\n- پاک کننده و تصفیه پوست از انواع آرایش و آلودگی ها\n\n- شاداب کننده و طراوت بخش پوست\n\n- پاک کننده منافذ پوستی\n\n- مناسب پوست های چرب، چرب مختلط\n\n- دارای فرمولاسیون غیر تحریک کننده\n\n- بافت فومی و نرم\n\n- حاوی گلیسیرین و اسید هیالورونیک\n\n- پاکسازی عمیق پوست\n\n- جلوگیری از ایجاد جوش\n\n- با خاصیت آبرسانی و مرطوب کنندگی\n\n- غلیظ و بصرفه\n\n- فاقد پارابن، فتالات، عطر گلوتن، •چربی، الکل دناتوره شده، SLS ، SLES و سولفات",
    "descriptionEn": "Concentrated mousse-foaming cleanser with glycerin and hyaluronic acid that gently removes long-wear makeup, sunscreen, and excess oil.",
    "price": 4217000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1009/f57163cf670e8e61c15c6ae6615f4b2b.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵۰ میلی‌لیتر",
        "labelEn": "150 ml",
        "price": 4217000
      }
    ],
    "variants": [
      {
        "id": "var-pori-724",
        "name": "حجم ۱۵۰ میلی‌لیتر",
        "nameEn": "150 ml",
        "price": 4217000,
        "stockCount": 1,
        "sku": "IN1746147129"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "گلیسیرین گیاهی",
        "nameEn": "Glycerin",
        "description": "هومکتانت کلاسیک و بسیار سازگار با پوست که آب را به لایه شاخی جذب کرده و انعطاف‌پذیری سد پوستی را حفظ می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "مقدار بسیار کمی (به اندازه یک نخود) با آب کف کرده روی پوست مرطوب ماساژ دهید و آبکشی نمایید.",
      "night": "مقدار بسیار کمی (به اندازه یک نخود) با آب کف کرده روی پوست مرطوب ماساژ دهید و آبکشی نمایید."
    },
    "badges": [
      "فاقد سولفات و پارابن",
      "فاقد عطر",
      "بسیار بصرفه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های چرب و چرب مختلط نیازمند پاکسازی عمقی بدون حساسیت.",
    "unsuitableFor": "برای پوست‌های خشک و خیلی خشک ممکن است حس خشکی ایجاد کند."
  },
  {
    "id": "product-pori-610",
    "nameFa": "تونر لایه‌بردار و ضدجوش ۳۰ روزه میراکل سام بای می",
    "nameEn": "SOME BY MI AHA.BHA.PHA 30 Days Miracle Toner",
    "brand": "SOME BY MI",
    "productType": "toner",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "brightening",
      "soothing"
    ],
    "routines": [
      "night",
      "acne-blemish"
    ],
    "routineStep": "گام ۲: تونر لایه‌بردار و ضدجوش",
    "howToUse": "بعد از شست‌وشو با پد پنبه‌ای به‌آرامی روی صورت بکشید (در پوست‌های حساس هفته‌ای ۳ تا ۴ شب) و در روز از ضدآفتاب استفاده کنید.",
    "ingredientTags": [
      "niacinamide",
      "salicylic-acid",
      "glycolic-acid",
      "pha",
      "tea-tree",
      "adenosine"
    ],
    "descriptionFa": "تونر لایه بردار و ضد جوش 30 روزه میراکل سام بای می\n\nیک تونر معجزه آسای چند منظوره است. در این تونر با بکارگیری همزمان اسیدهای AHA، BHA و PHA در کنار هم، یک هم افزایی کامل و اثربخشی بی نظیر ایجاد شده است. تونر لایه بردار و ضد جوش معجزه 30 روزه سام بای می پوست را لایه برداری کرده و سلول های مرده و باقی مانده آلودگی های آن را از بین می برد. این تونر در رطوبت رسانی و آرامش بخشی و کاهش مشکلات پوستی مانند جوش ها، منافذ باز، ترشح چربی اضافی و ... فوق العاده موثر است.\n\n- حاوی اسیدهای AHA، BHA و PHA\n\n- لایه برداری پوست و رفع سلول های مرده و باقی مانده آلودگی های آن\n\n- کنترل کننده چربی پوست و درمان جوش و آکنه ها\n\n- حاوی عصاره پاپایا، فندق جادوگر، غلظت بالای (10000 پی پی ام) عصاره درخت چای، آدنوزین، نیاسینامید\n\n- آبرسانی و مرطوب کننده پوست\n\n- تصفیه کننده منافذ پوست و کاهش اندازه منافذ باز\n\n- بهبود رنگ و بافت پوست\n\n- آرامش بخش و تسکین دهنده التهاب پوست\n\n- روشن کننده و صاف کننده پوست\n\n- موثر در بهبود کدری و چروک پوست\n\n- جلوگیری از مسدود شدن منافذ پوست و ایجاد جوش و آکنه\n\n- تست شده از نظر پوستی برای پوست های حساس و دارای pH بهینه 5.5\n\n- فاقد عطر و رنگ مصنوعی، پارابن، سولفات، الکل، روغن معدنی و سیلیکون\n\n- مناسب برای انواع پوست خصوصا پوست مستعد جوش و آکنه",
    "descriptionEn": "Optimal pH 5.5 exfoliating toner with AHA, BHA, PHA, 10,000ppm tea tree extract, and niacinamide to clear breakouts and refine pores.",
    "price": 3360000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/905/6ee9d03478c67146d600448f8d53b804.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/904/d9730a5d594e026cdd6cf40469fe8b66.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵۰ میلی‌لیتر",
        "labelEn": "150 ml",
        "price": 3360000
      }
    ],
    "variants": [
      {
        "id": "var-pori-676",
        "name": "حجم ۱۵۰ میلی‌لیتر",
        "nameEn": "150 ml",
        "price": 3360000,
        "stockCount": 1,
        "sku": "IN1744953229"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "آلفا هیدروکسی اسید (AHA)",
        "nameEn": "Glycolic Acid (AHA)",
        "description": "حل کردن پیوند سلول‌های مرده سطح پوست برای شفافیت، یکدست‌سازی بافت و کاهش لک‌ها و جوش‌های سرسفید."
      },
      {
        "nameFa": "پلی‌هیدروکسی اسید (PHA)",
        "nameEn": "Polyhydroxy Acid (PHA)",
        "description": "لایه‌بردار ملایم نسل جدید با مولکول بزرگ‌تر که بدون تحریک پوست حساس، سلول‌های مرده را پاکسازی و رطوبت را حفظ می‌کند."
      },
      {
        "nameFa": "عصاره درخت چای",
        "nameEn": "Melaleuca Alternifolia (Tea Tree) Extract",
        "description": "ترکیب آنتی‌باکتریال و ضدالتهاب طبیعی که باکتری‌های مولد آکنه را کنترل کرده و جوش‌های فعال را تسکین می‌دهد."
      },
      {
        "nameFa": "آدنوزین",
        "nameEn": "Adenosine",
        "description": "ترکیب ضدچروک تاییدشده که با حمایت از استحکام پوست، به کاهش ظاهر خطوط ظریف و آرام‌سازی پوست کمک می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "بعد از شست‌وشو با پد پنبه‌ای به‌آرامی روی صورت بکشید (در پوست‌های حساس هفته‌ای ۳ تا ۴ شب) و در روز از ضدآفتاب استفاده کنید."
    },
    "badges": [
      "AHA + BHA + PHA",
      "۱۰,۰۰۰ppm درخت چای",
      "pH بهینه ۵.۵"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های مستعد جوش، دارای منافذ باز، چربی اضافه و جای جوش.",
    "unsuitableFor": "هم‌زمان با رتینول یا سرم‌های اسیدی قوی در یک نوبت مصرف نشود."
  },
  {
    "id": "product-pori-529",
    "nameFa": "سرم منافذ اگزوزوم شات ۲۰۰۰ مدیکوب",
    "nameEn": "Medicube One Day Exosome Shot Pore Ampoule 2000",
    "brand": "Medicube",
    "productType": "serum",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "acne-blemish",
      "anti-aging",
      "brightening"
    ],
    "routines": [
      "night",
      "acne-blemish",
      "anti-aging"
    ],
    "routineStep": "گام ۳: آمپول منافذ و نوسازی سلولی",
    "howToUse": "شب‌ها پس از شست‌وشو روی پوست تمیز بمالید و با فشار آرام دست جذب کنید، سپس سرم یا کرم آبرسان بزنید.",
    "ingredientTags": [
      "niacinamide",
      "panthenol",
      "spicules"
    ],
    "descriptionFa": "سرم منافذ شات اگزوزوم مدیکوب ۲۰۰۰ پی‌پی‌ام medicube\n\nSerum Medicube Exosome Shot 2,000 PPM\n\nبا این سرم قوی حاوی 2000 پی پی ام اگزوزوم برای تقویت بازسازی سلولی پوست، مقابله با منافذ بزرگ شده و یکنواخت کردن رنگ پوست، شادابی را به پوست خسته، کم درخشش یا پیری بازگردانید. فرمول سبک وزن به سرعت در زیر لایه پوست جذب می شود تا اثرات بیشتر مواد فعال بدون ایجاد حس چسبناکی ایجاد شود. این آمپول از نظر پوستی تست شده و برای پوست های حساس و مستعد آکنه مناسب است\n\nسرم حاوی اگزوزوم 2000PPM منافذ را به سرعت سفت می کند که می تواند روزانه حتی برای مبتدیان استفاده شود.\n\nکوچک شدن فوری و قطعی منافذ، 21.1% کاهش در تراکم منافذ و تعداد منافذ فقط پس از یک بار استفاده.\n\nشات های اگزوزوم عمیق و مستقیم به پوست نفوذ می کنند که جذب مواد فعال را تا 242 درصد افزایش می دهد.\n\nبافت آمپول تازه از ده لایه پوست عمیقاً بدون هیچ گونه چسبندگی عبور می کند.\n\nهیپوآلرژنیک تست شده و غیر کومدون زا که برای پوست های حساس و پوست های مستعد آکنه قابل استفاده است",
    "descriptionEn": "Daily-friendly pore-tightening ampoule with 2,000ppm exosome-coated spicules to boost active absorption and visibly refine pores.",
    "price": 3847000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/757/1f3ece3a1084061956efaed390704f1d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/758/d86fcfbe53b0f8946e3a45b5d70ad1f4.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 3847000
      }
    ],
    "variants": [
      {
        "id": "var-pori-589",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 3847000,
        "stockCount": 1,
        "sku": "IN1738305369"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "اسپیکول‌های میکرو / اگزوزوم Cica",
        "nameEn": "Hydrolyzed Sponge / Cica Exosome",
        "description": "ساختارهای سوزنی میکرونی طبیعی برای افزایش نفوذ ترکیبات فعال به لایه‌های عمقی و تحریک نوسازی بافت پوست."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "شب‌ها پس از شست‌وشو روی پوست تمیز بمالید و با فشار آرام دست جذب کنید، سپس سرم یا کرم آبرسان بزنید."
    },
    "badges": [
      "۲۰۰۰ppm اگزوزوم",
      "هیپوآلرژنیک",
      "غیرکومدوژنیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های دارای منافذ باز، بافت ناهموار و کدر (مناسب شروع برای مبتدیان اسپیکول).",
    "unsuitableFor": "روی پوست زخمی یا همراه با لایه‌بردارهای اسیدی قوی هم‌زمان استفاده نشود."
  },
  {
    "id": "product-pori-218",
    "nameFa": "روغن پاک‌کننده ملایم سنتلا ماداگاسکار اسکین ۱۰۰۴",
    "nameEn": "SKIN1004 Madagascar Centella Light Cleansing Oil",
    "brand": "SKIN1004",
    "productType": "cleanser",
    "category": "cleanser",
    "skinTypes": [
      "sensitive",
      "dry",
      "combination",
      "oily",
      "normal"
    ],
    "concerns": [
      "soothing",
      "acne-blemish",
      "sensitive"
    ],
    "routines": [
      "night",
      "soothing",
      "minimal"
    ],
    "routineStep": "گام ۱: پاک‌کننده روغنی ملایم",
    "howToUse": "روی پوست خشک با دست خشک ماساژ دهید تا آرایش و ضدآفتاب حل شود، سپس با آب ولرم امولسیونه و آبکشی نمایید.",
    "ingredientTags": [
      "centella",
      "vitamin-e",
      "jojoba-plant-oils"
    ],
    "descriptionFa": "- دارای چندین روغن مرطوب کننده، روغن دانه هلیانتوس آنووس، نارگیل، سیکا و شش نوع روغن گیاهی.\n\n- شاداب کننده و تسکین دهنده پوست.\n\n- پاک کننده آرایش، آلودگی و ضد آفتاب.\n\n- فاقد ماده مصنوعی یا تحریک کننده.\n\n- مرطوب کننده و نرم کننده پوست.\n\n- آبرسان و روشن کننده پوست.\n\n- سفت کننده منافذ پوست.\n\n- دارای بافت بسیار سبک.\n\n- سرشار از ویتامین E.\n\n- ضد التهاب پوست.",
    "descriptionEn": "Featherlight botanical cleansing oil with Madagascar Centella Asiatica and 6 plant oils to gently melt waterproof makeup, sunscreen, and sebum.",
    "price": 3646000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/291/79035ef6d09550e605ab6336f74b9818.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۰۰ میلی‌لیتر",
        "labelEn": "200 ml",
        "price": 3646000
      }
    ],
    "variants": [
      {
        "id": "var-pori-239",
        "name": "حجم ۲۰۰ میلی‌لیتر",
        "nameEn": "200 ml",
        "price": 3646000,
        "stockCount": 1,
        "sku": "IN1715751274"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      },
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محلول در چربی که از غشای سلولی در برابر استرس اکسیداتیو محافظت کرده و نرمی پوست را حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی سبک",
        "nameEn": "Botanical Cleansing Oils Complex",
        "description": "انحلال کامل ضدآفتاب، سبوم و آرایش مقاوم از منافذ بدون ایجاد کدری یا بستن منافذ."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "روی پوست خشک با دست خشک ماساژ دهید تا آرایش و ضدآفتاب حل شود، سپس با آب ولرم امولسیونه و آبکشی نمایید."
    },
    "badges": [
      "سنتلا ماداگاسکار",
      "ضدالتهاب",
      "بافت بسیار سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "انواع پوست به‌ویژه پوست‌های حساس و مستعد قرمزی برای مرحله اول پاکسازی شبانه.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-205",
    "nameFa": "اسنس لایه‌بردار جوش سرسفید AHA 7 کوزارکس",
    "nameEn": "COSRX AHA 7 Whitehead Power Liquid",
    "brand": "COSRX",
    "productType": "exfoliator",
    "category": "brightening",
    "skinTypes": [
      "dry",
      "combination",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "brightening",
      "acne-blemish"
    ],
    "routines": [
      "night",
      "brightening"
    ],
    "routineStep": "مراقبت هفتگی: لایه‌بردار شیمیایی ملایم",
    "howToUse": "شب‌ها ۲ تا ۳ بار در هفته پس از شست‌وشو با پد یا دست روی پوست خشک بزنید (از دور چشم دوری کنید). روز بعد ضدآفتاب بزنید.",
    "ingredientTags": [
      "niacinamide",
      "hyaluronic-acid",
      "glycolic-acid"
    ],
    "descriptionFa": "یک محصول عالی برای از بین بردن آکنه و جوش های سر سفید است که با لایه برداری ملایم علاوه بر از بین بردن سلول های مرده پوست موجب پاکسازی منافذ نیز می شود.این اسنس لایه بردار کره ای با نیاسینامید،هیالورونیک اسید،گلیکولیک اسید و آلفات هیدروکسی ها غنی شده که به کاهش جوش های سر سفید ، روشن تر شدن کدری ها و لک ها و مرطوب شدن پوست کمک می کند.\n\nلایه بردار ملایم\n\nروشن کننده پوست و رفع کدری ها\n\nضد جوش های سر سفید\n\nافزایش گردش سلولی\n\nاز بین برنده سلول های مرده پوست\n\nبهبود بافت ناهموار پوست\n\nبهترین محصول برای افردای که قبلا از آ اچ آ استفاده کردند\n\nبدون الکل و پارابن و ضد جساسیت\n\nمناسب انواع پوست های حساس،خشک،مختلط و مستعد به آکنه",
    "descriptionEn": "Gentle 7% glycolic acid exfoliating essence enriched with niacinamide and hyaluronic acid to clear whiteheads and brighten dull skin.",
    "price": 3074000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/276/5214286d3a0a43e90ecf164512bacb3b.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰۰ میلی‌لیتر",
        "labelEn": "100 ml",
        "price": 3074000
      }
    ],
    "variants": [
      {
        "id": "var-pori-226",
        "name": "حجم ۱۰۰ میلی‌لیتر",
        "nameEn": "100 ml",
        "price": 3074000,
        "stockCount": 1,
        "sku": "IN1715726828"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "تقویت سد دفاعی پوست، تنظیم ترشح چربی (سبوم)، کاهش ظاهر منافذ باز و یکدست‌سازی تناژ و شفافیت چهره."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "آلفا هیدروکسی اسید (AHA)",
        "nameEn": "Glycolic Acid (AHA)",
        "description": "حل کردن پیوند سلول‌های مرده سطح پوست برای شفافیت، یکدست‌سازی بافت و کاهش لک‌ها و جوش‌های سرسفید."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "شب‌ها ۲ تا ۳ بار در هفته پس از شست‌وشو با پد یا دست روی پوست خشک بزنید (از دور چشم دوری کنید). روز بعد ضدآفتاب بزنید."
    },
    "badges": [
      "۷٪ گلیکولیک اسید",
      "فاقد الکل و پارابن",
      "رفع جوش سرسفید"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های کدر، دارای جوش‌های سرسفید، لک‌های سطحی و بافت ناهموار.",
    "unsuitableFor": "روی پوست‌های زخمی، بسیار تحریک‌شده یا هم‌زمان با رتینول و BHA قوی استفاده نشود."
  },
  {
    "id": "product-pori-203",
    "nameFa": "آمپول تغذیه‌کننده و التیام‌بخش پروپولیس کوزارکس",
    "nameEn": "COSRX Full Fit Propolis Light Ampoule",
    "brand": "COSRX",
    "productType": "serum",
    "category": "sensitive-skin",
    "skinTypes": [
      "dry",
      "sensitive",
      "combination",
      "normal"
    ],
    "concerns": [
      "soothing",
      "barrier-repair",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "soothing",
      "barrier-repair"
    ],
    "routineStep": "گام ۳: آمپول التیام‌بخش و درخشان‌کننده",
    "howToUse": "صبح و شب پس از تونر ۲ تا ۳ قطره روی پوست صورت زده و با ضربات ملایم جذب کنید.",
    "ingredientTags": [
      "centella",
      "panthenol",
      "propolis"
    ],
    "descriptionFa": "پروپولیس یا بره موم زنبور عسل ، یک ماده محافظ قهوه‌ای رنگ است که از مخلوط موم زنبور ، رزین ، شیره گیاهی ، ترکیبات گیاهی و بزاق زنبور عسل ساخته شده . نام آن از دو کلمه یونانی pro به معنای «در دفاع از» و polis به معنای «شهر» گرفته شده است که به معنای در دفاع از شهر (یا کندو) است.\n\n- حاوی 83.25% پروپولیس زنبور عسل دارای خاصیت آنتی اکسیدانی قوی جهت خنثی سازی رادیکال های آزاد و عوامل پیری\n\n- مناسب استفاده برای انواع مشکلات پوستی از جمله پوست های ملتهب و مستعد جوش، کدر و دهیدرته و آسیب دیده\n\n- کاهش التهاب ناشی از جوش و آکنه و جلوگیری از ایجاد آن و کمک به درمان آنها با ترکیبات پروپولیس\n\n- تغذیه کننده کامل پوست و ایجاد برق و درخشش طبیعی به پوست\n\n- ترمیم کننده و سرعت بخشیدن در روند ترمیم بافت آسیب دیده\n\n- حاوی بتائین با خواص مرطوب کنندگی قوی و ضد چین و چروک\n\n- حاوی عصاره رویال ژلی و عسل جهت تغذیه و تقویت پوست\n\n- فاقد الکل، پارابن، روغن های معدنی و رنگ های مصنوعی\n\n- حاوی پنتنول و سیکا جهت تسکین پوست و حفظ رطوبت",
    "descriptionEn": "Nourishing glow ampoule formulated with 83.25% black bee propolis extract, betaine, and panthenol to calm redness and strengthen skin barrier.",
    "price": 2702000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/274/650e75099bf3775069ae2086c06fb23d.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 2702000
      }
    ],
    "variants": [
      {
        "id": "var-pori-224",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 2702000,
        "stockCount": 1,
        "sku": "IN1715726396"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سنتلا آسیاتیکا (سیکا)",
        "nameEn": "Centella Asiatica (Cica)",
        "description": "تسکین‌دهنده فوری التهاب و قرمزی، تحریک سنتز کلاژن و تسریع بازسازی سد دفاعی پوست‌های حساس و آسیب‌دیده."
      },
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "مرطوب‌کننده عمیق و التیام‌بخش قوی که با تقویت فرآیند ترمیم اپیدرم، التهاب، خشکی و کشیدگی پوست را برطرف می‌کند."
      },
      {
        "nameFa": "عصاره پروپولیس (بره‌موم)",
        "nameEn": "Propolis Extract",
        "description": "ترکیب آنتی‌اکسیدان، آنتی‌باکتریال و مغذی که به بازسازی سد پوستی، آرام‌سازی التهاب و ایجاد درخشندگی سالم کمک می‌کند."
      }
    ],
    "usageRoutine": {
      "morning": "صبح و شب پس از تونر ۲ تا ۳ قطره روی پوست صورت زده و با ضربات ملایم جذب کنید.",
      "night": "صبح و شب پس از تونر ۲ تا ۳ قطره روی پوست صورت زده و با ضربات ملایم جذب کنید."
    },
    "badges": [
      "۸۳.۲۵٪ پروپولیس",
      "فاقد الکل و پارابن",
      "ترمیم‌کننده"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۶",
    "targetAudience": "پوست‌های ملتهب، مستعد قرمزی، کدر، دهیدراته و آسیب‌دیده.",
    "unsuitableFor": "افراد دارای آلرژی شدید به فرآورده‌های زنبور عسل (عسل و بره‌موم) تست پچ انجام دهند."
  },
  {
    "id": "product-pori-152",
    "nameFa": "سرم لایه‌بردار پیلینگ سلوشن AHA 30% + BHA 2% اوردینری",
    "nameEn": "The Ordinary AHA 30% + BHA 2% Peeling Solution",
    "brand": "The Ordinary",
    "productType": "exfoliator",
    "category": "acne-blemishes",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "acne-blemish",
      "brightening",
      "anti-aging"
    ],
    "routines": [
      "night",
      "acne-blemish",
      "brightening"
    ],
    "routineStep": "مراقبت هفتگی: پیلینگ شیمیایی قوی",
    "howToUse": "حداکثر ۱ تا ۲ شب در هفته روی پوست کاملاً تمیز و خشک بزنید، حداکثر ۱۰ دقیقه صبر کرده و با آب ولرم بشویید. استفاده از ضدآفتاب روز بعد ضروری است.",
    "ingredientTags": [
      "hyaluronic-acid",
      "salicylic-acid",
      "glycolic-acid"
    ],
    "descriptionFa": "یک سرم لایه بردار و جوانساز است. این سرم با لایه برداری موثر پوست سبب بهبود لک و آکنه و ناهمواری‌های پوست شده و پوستی سالم و شفاف به ارمغان می آورد. این محصول برای پوست های نرمال تا چرب خصوصا پوست مستعد آکنه بسیار مناسب است. اما به دلیل عملکرد قوی بهتر است برای پوستهای حساس استفاده نشود.\n\nحاوی اسیدهای لایه بردار AHA 30٪ و BHA 2٪\n\nدارای فرمولاسیون و عملکرد بسیار قوی و اثرگزار\n\nلایه برداری موثر و حذف سلول های مرده پوست\n\nدرمان لک ها و تیرگی‌ها و روشن کننده پوست\n\nکاهش خطوط و چین و چروک های پوست\n\nبهبود جوش و آکنه ها و جلوگیری از بروز مجدد آن ها\n\nدرخشان کننده و شفاف کننده پوست\n\nکوچک کننده منافذ باز و یکدست کننده پوست\n\nوگان و بدون تست بر روی حیوانات\n\nفاقد پارابن، سولفات، گلوتن و هیدروکینون\n\nمناسب برای پوست های نرمال تا چرب خصوصا پوست مستعد آکنه",
    "descriptionEn": "High-strength 10-minute exfoliating facial mask with 30% AHA and 2% BHA to deeply resurface skin texture, brighten marks, and decongest pores.",
    "price": 2702000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/212/2d67973567f3e0cfbb2cfd923f635f34.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 2702000
      }
    ],
    "variants": [
      {
        "id": "var-pori-173",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 2702000,
        "stockCount": 1,
        "sku": "IN1712872818"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت در لایه‌های اپیدرم، رفع دهیدراتگی و پر کردن خطوط ریز ناشی از خشکی."
      },
      {
        "nameFa": "سالیسیلیک اسید (BHA)",
        "nameEn": "Salicylic Acid (BHA)",
        "description": "لایه‌بردار محلول در چربی با قابلیت نفوذ به عمق منافذ، پاکسازی سبوم مازاد و سلول‌های مرده، و پیشگیری از جوش و آکنه."
      },
      {
        "nameFa": "آلفا هیدروکسی اسید (AHA)",
        "nameEn": "Glycolic Acid (AHA)",
        "description": "حل کردن پیوند سلول‌های مرده سطح پوست برای شفافیت، یکدست‌سازی بافت و کاهش لک‌ها و جوش‌های سرسفید."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است؛ در روتین صبح حتماً از ضدآفتاب با SPF مناسب استفاده کنید.",
      "night": "حداکثر ۱ تا ۲ شب در هفته روی پوست کاملاً تمیز و خشک بزنید، حداکثر ۱۰ دقیقه صبر کرده و با آب ولرم بشویید. استفاده از ضدآفتاب روز بعد ضروری است."
    },
    "badges": [
      "AHA 30% + BHA 2%",
      "وگان",
      "استفاده هفتگی ۱۰ دقیقه‌ای"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کانادا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "پوست‌های مقاوم، نرمال تا چرب دارای تجربه مصرف اسید، منافذ مسدود و لک.",
    "unsuitableFor": "برای پوست‌های حساس، نازک، آسیب‌دیده، زخمی یا مبتدیان اسیدتراپی نامناسب است. بیش از ۱۰ دقیقه روی پوست نماند."
  }
];
