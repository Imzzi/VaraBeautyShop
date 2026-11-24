import { Product } from '../types';

/**
 * Curated makeup & hair-care catalog (82 in-stock items) aligned with VaraBeautyShop schema (+5% Toman pricing).
 * Synced once per version into Turso/libSQL via serverDb.ts.
 */
export const IMPORTED_MAKEUP_HAIR_PRODUCTS: Product[] = [
  {
    "id": "product-pori-954",
    "nameFa": "رژ لب مدادی مخملی و ضدآب جاست کیسد شیگلم",
    "nameEn": "SHEGLAM Just Kissed Lipstick Crayon",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: رژ لب و خط لب ۲ در ۱",
    "howToUse": "نوک مدادی رژ را ابتدا روی خط لب کشیده و سپس داخل لب‌ها را پر کنید.",
    "ingredientTags": [
      "shea-butter",
      "biotin",
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ لب مدادی مخملی و ضد آب مدل جاست کیسد شیگلم Bread Pudding\n\nاین محصول رنگدانه های غنی یک رژ لب را با قابلیت اعمال راحت و دقت یک خط لب یا مداد رنگی لب ادغام کرده است. از این رو به راحتی روی لب های شما کشیده شده و آن را زیبا می کند. رژلب مدادی شیگلم مدل جاست کیسد حاوی رنگدانه قوی و پیگمنت عالی و بادوام است. این رژ همچنین بافت نرم و ابریشمی داشته و یک پوشش طبیعی و مخملی روی لب ایجاد می نماید. بعلاوه لب های شما را بسیار مرطوب می کند.\n\n- دارای بافت نرم و ابریشمی با رنگدانه های غنی\n\n- طراحی مدادی با قابلیت اعمال راحت و دقیق روی لب\n\n- پیگمنت عالی و ماندگاری طولانی مدت\n\n- ایجاد یک پوشش طبیعی و مخملی و صاف روی لب\n\n- ضد آب و ضد تعریق\n\n- مرطوب کننده و جلوگیری از خشکی و پوسته پوسته شدن لب\n\n- دارای عطر شکلاتی بی نظیر و لذت بخش\n\n- ترکیبی از رژلب، مداد لب و بالم لب\n\n- ایده آل برای استفاده روزانه یا آرایش لب در مهمانی ها\n\n- دارای رنگ های زیبا و متنوع\n\n- فاقد الکل، گلوتن، پارابن، تالک\n\n- وگان و بدون تست حیوانی\n\n- مناسب انواع پوست",
    "descriptionEn": "SHEGLAM Just Kissed Lipstick Crayon by SHEGLAM.",
    "price": 1499000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1653/e7d8628019da8f04f4c93c321bc501f5.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1654/5b3fd9209aa0793b737be6c11b5556bf.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1655/7880c534c551cc42f210e0c5719f700d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1656/36b7d4c9ba2c9260a3b591ccc86ca9d3.webp"
    ],
    "sizes": [
      {
        "label": "Bread pudding",
        "labelEn": "Bread pudding",
        "price": 1499000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1234",
        "name": "Bread pudding",
        "nameEn": "Bread pudding",
        "price": 1499000,
        "stockCount": 12,
        "sku": "IN1777605901",
        "colorCode": "#f06c3b"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "نوک مدادی رژ را ابتدا روی خط لب کشیده و سپس داخل لب‌ها را پر کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "ضدآب",
      "بافت مخملی",
      "وگان و فاقد تالک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 12,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آرایش روزانه و مجلسی لب با پوشش مخملی، ماندگاری بالا و بدون خشکی لب.",
    "unsuitableFor": "روی لب‌های دارای زخم باز استفاده نشود."
  },
  {
    "id": "product-pori-357",
    "nameFa": "خط لب و لیپ گلاس دوطرفه لیپ رولز شیگلم",
    "nameEn": "SHEGLAM Lip Rolls Liner & Gloss 2-in-1",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: خط لب مات + برق لب",
    "howToUse": "ابتدا با سر خط لب کرمی، فرم لب را بکشید و سپس با سر لیپ گلاس روی آن درخشش و حجم ایجاد کنید.",
    "ingredientTags": [
      "vitamin-e",
      "shea-butter",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "Shaglam Lip Rolls Liner &amp; Gloss 2-in-1\n\nخط‌لب و لیپ‌گلاس ۲طرفه شیگلم\n\nست خط‌لب و لیپ گلاس ۲طرفه شیگلم کار ارایش لب‌ها را برای شما بسیار ساده‌تر و سریعتر فراهم میکند\n\nاین محصول ب شما کمک میکند لب‌های برجسته‌تر و خوشرنگ‌تری داشته باشید\n\nهمچنین خط‌لب این محصول بافت کرمی و بسیار نرمی دارد تا بدون مشکل رو لب کشیده شود\n\nبخاطر ابرسانی عمیق این محصول رنگ ان تا مدت زیادی روی لب ماندگاری دارد،\n\n- ارائه روکش مات و مخملی توسط خط‌لب\n\n- ارائه پوششی سبک و غیرچسبناک با درخشندگی بالا توسط لیپ‌گلاس\n\n- ماندگاری طولانی\n\n- پیگمنت رنگی بالا\n\n- ماندگاری طولانی مدت\n\n- نرم کننده و مرطوب کننده لب‌ها\n\n- حاوی ویتامینE و شی‌باتر\n\n- بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Lip Rolls Liner & Gloss 2-in-1 by SHEGLAM.",
    "price": 1572000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/459/1c87ac08155b6a7df48efd7625305216.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/458/b839a6f15bd6cde0e6148779f7acddd9.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/460/67d8cda815cd0d3e192a7e78f4b1face.jpeg"
    ],
    "sizes": [
      {
        "label": "judgey much",
        "labelEn": "judgey much",
        "price": 1572000
      }
    ],
    "variants": [
      {
        "id": "var-pori-399",
        "name": "judgey much",
        "nameEn": "judgey much",
        "price": 1572000,
        "stockCount": 12,
        "sku": "IN1726679818"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "ابتدا با سر خط لب کرمی، فرم لب را بکشید و سپس با سر لیپ گلاس روی آن درخشش و حجم ایجاد کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۲ در ۱",
      "حاوی ویتامین E و شی‌باتر",
      "بدون تست حیوانی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 12,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "افراد علاقه‌مند به لب‌های خوش‌فرم، برجسته و درخشان بدون چسبندگی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-755",
    "nameFa": "کانسیلر براش‌دار کاور بالا پرفکت اسکین شیگلم",
    "nameEn": "SHEGLAM Perfect Skin High Coverage Concealer",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: کانسیلر و اصلاح تیرگی",
    "howToUse": "مقدار کمی را زیر چشم یا روی لک‌ها بزنید و با براش یا اسفنج آرایشی به آرامی فید کنید.",
    "ingredientTags": [
      "squalane",
      "jojoba-oils",
      "mineral-pigments"
    ],
    "descriptionFa": "کانسیلر براش دار شیگلم\n\nکانسیلر Perfect Skin ما دارای فرمولی با پوشش بالا است که با فیتواسترول‌ها و اسکوالان ۱۰۰٪ با منشاء زیتون غنی شده است تا از دست دادن آب پوست شما در لایه اپیدرم را کاهش دهد و رطوبت فوق‌العاده‌ای را برای ظاهری زیبا و طبیعی فراهم کند. این کانسیلر با رنگدانه‌های فراوان و پوشش کامل، ساخته شده از مواد اولیه سازگار با پوست، برای انواع پوست مناسب است.\n\n- بافت مایع سبک\n\n- کاور بالا\n\n- ماندگاری بالا\n\n- پوشاننده‌ی تیرگی‌‌ها و عیوب پوست\n\n- دارای اپلیکاتور به صورت براش فشرده\n\n- دارای رنگ‌های متنوع\n\nحاوی فیتواسترول\n\n- حاوی اسکوالان زیتون\n\n- مرطوب‌کننده‌ی عمقی پوست\n\n- کاهش‌دهنده‌ی روند پیری پوست\n\n- مناسب همه‌ی انواع پوست",
    "descriptionEn": "SHEGLAM Perfect Skin High Coverage Concealer by SHEGLAM.",
    "price": 1499000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1214/4506a6ce9209b06160c0a6edf26a8c9d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1215/ff8de484bfcd7cd0fce51d89481653ca.jpeg"
    ],
    "sizes": [
      {
        "label": "Nude",
        "labelEn": "Nude",
        "price": 1499000
      },
      {
        "label": "Chantilly",
        "labelEn": "Chantilly",
        "price": 1499000
      },
      {
        "label": "Acron",
        "labelEn": "Acron",
        "price": 1499000
      }
    ],
    "variants": [
      {
        "id": "var-pori-829",
        "name": "Nude",
        "nameEn": "Nude",
        "price": 1499000,
        "stockCount": 10,
        "sku": "IN1751898036"
      },
      {
        "id": "var-pori-830",
        "name": "Chantilly",
        "nameEn": "Chantilly",
        "price": 1499000,
        "stockCount": 1,
        "sku": "IN1751898037"
      },
      {
        "id": "var-pori-1528",
        "name": "Acron",
        "nameEn": "Acron",
        "price": 1499000,
        "stockCount": 2,
        "sku": "IN1787156620"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "مقدار کمی را زیر چشم یا روی لک‌ها بزنید و با براش یا اسفنج آرایشی به آرامی فید کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "کاور بالا",
      "اسکوالان زیتون",
      "دارای اپلیکاتور براش"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 13,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوشانندگی تیرگی دور چشم، جای جوش و قرمزی برای انواع پوست.",
    "unsuitableFor": "از تماس با داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-673",
    "nameFa": "قلم ۴ در ۱ هایلایتر، کانتور و برنزر مالتی گلم شیگلم",
    "nameEn": "SHEGLAM Multi-Glam 4-in-1 Face Pen",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: کانتورینگ و هایلایت ۴ کاره",
    "howToUse": "از بخش کانتور و برنزر زیر گونه و خط فک، و از هایلایتر مات و شاین روی بالای گونه و پل بینی استفاده و محو کنید.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "قلم هایلایتر و کانتور ۴تایی شیگلم طبقه ای 4در1\n\nیک ابزار زیبایی کامل ۴ در ۱ است که شامل هایلایتر براق، هایلایتر مات، کانتور و برنزر است؛ همه در یک طراحی باریک و شبیه به قلم. بافت نرم آن به‌آسانی روی پوست می‌لغزد و ترکیب آن برای ایجاد ظاهری طبیعی و خوش‌فرم ساده است.\n\nچه بخواهید هایلایت کنید، کانتور بزنید یا برنزه کنید، این قلم چندکاره، روتین شما را ساده کرده و تنها با چند حرکت، فرم دلخواه را به چهره‌تان می‌بخشد.\n\nاین قلم شامل چهار ابزار آرایشی است:\n\nهایلایتر مات : برای روشن کردن نقاط برجسته صورت با جلوه طبیعی و بدون درخشش.\n\nهایلایتر شاین : برای ایجاد درخشندگی در نواحی مثل بالای گونه‌ها و پل بینی.\n\nبرنزر : برای افزودن گرمای طبیعی به پوست در قسمت‌هایی مانند پیشانی و گونه‌ها.\n\nکانتور : برای فرم‌دهی به صورت در نواحی مثل خط فک و کناره‌های بینی.\n\n- دارای رنگ مخملی و مات\n\n- پوشش یکدست\n\n- یک هایلایتر درخشان\n\n- یک هایلایتر مات\n\n- یک کانتور\n\n- یک برنزر",
    "descriptionEn": "SHEGLAM Multi-Glam 4-in-1 Face Pen by SHEGLAM.",
    "price": 1500000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1047/721f28bebdc226193ed32559970d4e5f.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1048/752bd5da1e1d8a5f0b9315497eb19d5f.jpeg"
    ],
    "sizes": [
      {
        "label": "Cacao",
        "labelEn": "Cacao",
        "price": 1500000
      },
      {
        "label": "Medium",
        "labelEn": "Medium",
        "price": 1500000
      }
    ],
    "variants": [
      {
        "id": "var-pori-744",
        "name": "Cacao",
        "nameEn": "Cacao",
        "price": 1500000,
        "stockCount": 9,
        "sku": "IN1746797115"
      },
      {
        "id": "var-pori-1530",
        "name": "Medium",
        "nameEn": "Medium",
        "price": 1500000,
        "stockCount": 1,
        "sku": "IN1787157880"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "از بخش کانتور و برنزر زیر گونه و خط فک، و از هایلایتر مات و شاین روی بالای گونه و پل بینی استفاده و محو کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۴ کاره در ۱ قلم",
      "مناسب سفر",
      "بافت کرمی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 10,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "کانتورینگ و زاویه‌سازی سریع صورت در خانه یا سفر.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-347",
    "nameFa": "براش و مایع میکروبلیدینگ ابرو برُو فکشن شیگلم",
    "nameEn": "SHEGLAM Brow-fection Angled Brush & Dip",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش ابرو: هاشور طبیعی و پرکننده",
    "howToUse": "براش زاویه‌دار را به مقدار کمی محلول آغشته کرده و در جهت رویش موهای ابرو خطوط ظریف بکشید.",
    "ingredientTags": [
      "mineral-pigments"
    ],
    "descriptionFa": "براش میکروبلیدینگ شیگلم | Sheglam Brow Fection Angled Brush &amp; Dip\n\nهاشور ابرو شیگلم ، یک محصول نوآورانه از SHEGLAM است که برای خلق ابروهایی با ظاهری طبیعی و دقیق طراحی شده است. این مجموعه شامل یک براش زاویهدار و یک محلول مات مایع است که با هم ترکیب شدهاند تا اثری شبیه به میکروبلیدینگ با ضربات مویی واقعگرایانه ایجاد کنند. این ترکیب نوآورانه به شما امکان می دهد تا ابروهایی کمپشت را پر کنید یا ظاهری کاملاً سفارشی برای ابروهایتان خلق کنید.\n\nرنگ طبیعی و گرم\n\nفرمولاسیون مقاوم و ماندگار\n\nکاربرد آسان و دقیق\n\nمناسب انواع ابروها\n\nنتایج حرفه‌ای در خانه\n\nموجود در ۴ رنگ",
    "descriptionEn": "SHEGLAM Brow-fection Angled Brush & Dip by SHEGLAM.",
    "price": 786000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/446/f0c380d57fa0eeb4864f257e9bd91233.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/447/055aa026058f79bd6e145ebc84b2b0b0.jpeg"
    ],
    "sizes": [
      {
        "label": "LATTE",
        "labelEn": "LATTE",
        "price": 786000
      },
      {
        "label": "TAUPE",
        "labelEn": "TAUPE",
        "price": 928000
      }
    ],
    "variants": [
      {
        "id": "var-pori-380",
        "name": "LATTE",
        "nameEn": "LATTE",
        "price": 786000,
        "stockCount": 1,
        "sku": "IN1724862095"
      },
      {
        "id": "var-pori-381",
        "name": "TAUPE",
        "nameEn": "TAUPE",
        "price": 928000,
        "stockCount": 8,
        "sku": "IN1724862096"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "براش زاویه‌دار را به مقدار کمی محلول آغشته کرده و در جهت رویش موهای ابرو خطوط ظریف بکشید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "اثر هاشور میکروبلیدینگ",
      "ضدآب و ماندگار",
      "براش زاویه‌دار"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 9,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پر کردن جاهای خالی ابرو با نمای طبیعی و مویی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1301",
    "nameFa": "ریمل حجم‌دهنده و بلندکننده لش سنسیشنال فایروورک میبلین",
    "nameEn": "Maybelline Lash Sensational Firework Mascara",
    "brand": "Maybelline",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "sensitive",
      "oily",
      "dry",
      "combination"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: ریمل مژه",
    "howToUse": "از ریشه مژه‌ها به سمت بالا با حرکت زیگزاگی بکشید؛ برای حجم بیشتر لایه دوم را قبل از خشک شدن بزنید.",
    "ingredientTags": [
      "panthenol",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "ریمل میبلین لش سنسیشنال فایروورک حجم دهنده و بلند کننده مژه\n\nیکی از جدیدترین ریمل‌های برند میبلین است که با برس اختصاصی SuperSpark™ و فرمول ژلی غنی‌شده با پروویتامین B5، مژه‌ها را از ریشه تا نوک به‌صورت یکنواخت پوشش می‌دهد. این ریمل بدون ایجاد چسبندگی یا گلوله شدن، مژه‌ها را بلندتر، حجیم‌تر و کاملاً از یکدیگر جدا نشان می‌دهد و جلوه‌ای چشمگیر و طبیعی به آرایش چشم می‌بخشد.\n\nبرس انعطاف‌پذیر این محصول حتی کوتاه‌ترین مژه‌ها را نیز پوشش داده و باعث می‌شود مژه‌ها حالتی باز، مرتب و شبیه به انفجار آتش‌بازی (Firework Effect) پیدا کنند.\n\n- افزایش طول و حجم مژه‌ها\n\nجداکننده مژه‌ها بدون ایجاد چسبندگی\n\n- دارای برس اختصاصی SuperSpark™ با دندانه‌های منعطف\n\n- پوشش کامل مژه‌ها از ریشه تا نوک\n\nبدون ایجاد گلوله یا ریزش روی پوست\n\n- حاوی پروویتامین B5 برای کمک به حفظ نرمی مژه‌ها\n\nماندگاری بالا در طول روز\n\n- مناسب استفاده روزانه و آرایش حرفه‌ای\n\nمزایای استفاده\n\nایجاد مژه‌هایی بلند، حجیم و خوش‌حالت\n\nبازتر و درشت‌تر نشان دادن چشم‌ها\n\nپوشش‌دهی حتی مژه‌های کوتاه و گوشه چشم\n\nحفظ حالت مژه‌ها بدون احساس سنگینی\n\nمناسب برای آرایش طبیعی و آرایش‌های چشمگیر\n\nمناسب برای\n\nانواع مژه\n\nمژه‌های کوتاه و کم‌پشت\n\nافرادی که به دنبال ریملی با حجم‌دهی و بلندکنندگی هم‌زمان هستند\n\nاستفاده روزانه و مهمانی\n\nنحوه استفاده\n\nبرس ریمل را از ریشه مژه‌ها به سمت نوک با حرکات زیگزاگی بکشید. برای حجم و طول بیشتر، اجازه دهید لایه اول کمی خشک شود و سپس لایه دوم را اعمال کنید. برای مژه‌های پایین از نوک برس استفاده کنید.",
    "descriptionEn": "Maybelline Lash Sensational Firework Mascara by Maybelline.",
    "price": 3317000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3044/959117e8758fba252bacdd1028cc72f4.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3046/8bcd0fc1199e3d0070b45894c2c77716.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3045/3086ae58fef6a48a12fb8102cf6cb924.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3047/680311ac63d2d50fc23fe083fe2e992e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3048/8c1e09f156475c9957fa1f0a76537003.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰ میلی‌لیتر",
        "labelEn": "10 ml",
        "price": 3317000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1428",
        "name": "حجم ۱۰ میلی‌لیتر",
        "nameEn": "10 ml",
        "price": 3317000,
        "stockCount": 7,
        "sku": "IN1784667676"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "آبرسان، نرم‌کننده و تقویت‌کننده مژه، تار مو و پوست سر."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "از ریشه مژه‌ها به سمت بالا با حرکت زیگزاگی بکشید؛ برای حجم بیشتر لایه دوم را قبل از خشک شدن بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "برس SuperSpark™",
      "حاوی پروویتامین B5",
      "بدون ریزش"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 7,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا / اروپا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "مژه‌های نیازمند بلندی، حجم و جداشدن کامل بدون چسبندگی.",
    "unsuitableFor": "از تماس مستقیم با داخل چشم پرهیز شود."
  },
  {
    "id": "product-pori-1082",
    "nameFa": "روغن لب مغذی ویتا گلو اکسیس وای",
    "nameEn": "AXIS-Y Vita Glow Lip Oil",
    "brand": "AXIS-Y",
    "productType": "lip-care",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hydration",
      "makeup",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "night",
      "hydration"
    ],
    "routineStep": "مراقبت و زیبایی لب: لیپ اویل درمانی",
    "howToUse": "در طول روز به تنهایی یا روی رژلب و شب‌ها به عنوان ماسک آبرسان لب استفاده کنید.",
    "ingredientTags": [
      "vitamin-e",
      "ceramide",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "لیپ اویل اکسیس وای\n\nاین روغن لب غنی از ویتامین E و سرامید NP لایه محافظ لب را تقویت کرده و آبرسانی عمیقی فراهم می‌آورد. این محصول سلول‌های مرده پوست روی لب‌های خشک و ترک‌خورده را کاهش می‌دهد و به دستیابی به لب‌هایی نرم‌تر، لطیف‌تر و سالم‌تر کمک می‌کند، که آن را به گزینه‌ای ایده‌آل برای مراقبت روزانه تبدیل کرده است.\n\nلیپ اویل اکسیس وای به عنوان یک محصول چندمنظوره برای استفاده روز و شب عمل می‌کند؛ هم به عنوان مراقبت از پوست لب و هم آرایش. می‌توانید روزانه برای مرطوب کردن لب‌های بدون آرایش از آن استفاده کنید، به عنوان پوشش براق برای ظاهری پرتر بکار ببرید، یا شب‌ها به عنوان ماسک لب برای صاف و نرم شدن لب‌ها تا صبح بهره ببرید.\n\n- تغذیه و احیا کننده لب های خشک و ترک خورده\n\n- آبرسان و بهبود رطوبت لب‌ها\n\n- رفع خشکی و پوسته پوسته شدن لب\n\n- ایجاد بافتی نرم و لطیف روی پوست لب\n\n- تقویت و تغذیه کننده سد محافظتی پوست\n\n- حاوی سرامید NP و ویتامین E\n\n- اپلیکاتور مخملی نوک انگشتی\n\n- درخششی یکنواخت و دقیق\n\n- بدون پارابن، روغن‌های معدنی\n\n- فرمول گیاهی بدون الکل",
    "descriptionEn": "AXIS-Y Vita Glow Lip Oil by AXIS-Y.",
    "price": 2415000,
    "originalPrice": 2898000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1984/0a3e6392fa02c25b62f40364c325c73b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1983/20a625f7b5a46c15a69e4edaa9401cc4.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1985/054a7ec70a8877ede6d8c87ce69dec21.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 2415000,
        "originalPrice": 2898000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1197",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 2415000,
        "originalPrice": 2898000,
        "stockCount": 7,
        "sku": "IN1775730247"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "سرامید NP",
        "nameEn": "Ceramide NP",
        "description": "تقویت سد محافظتی پوست و لب و جلوگیری از تبخیر رطوبت در طول روز."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "در طول روز به تنهایی یا روی رژلب و شب‌ها به عنوان ماسک آبرسان لب استفاده کنید.",
      "night": "در طول روز به تنهایی یا روی رژلب و شب‌ها به عنوان ماسک آبرسان لب استفاده کنید."
    },
    "badges": [
      "سرامید NP + ویتامین E",
      "جلوه شیشه‌ای",
      "مناسب شب و روز"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 7,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لب‌های خشک، ترک‌خورده یا نیازمند درخشش طبیعی و تغذیه.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-103",
    "nameFa": "بالم لب حجم‌دهنده پوت پرفکت شاین شیگلم",
    "nameEn": "SHEGLAM Pout-Perfect Shine Lip Plumper",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: بالم لب حجم‌دهنده و براق",
    "howToUse": "مستقیم روی لب‌های تمیز بزنید تا رطوبت، رنگ ملایم و درخشش حجم‌دهنده ایجاد شود.",
    "ingredientTags": [
      "vitamin-e",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "لب‌ها بر اثر دمای سرد، خشکی هوا و قرار گرفتن در معرض باد رطوبت خود را از دست می‌دهند و از آن‌جایی‌که عضوی حساس در بدن به شمار می‌آید، بایستی رسیدگی‌های لازم نسبت به آن انجام شود. برند شیگلم با در نظر گرفتن این موارد بالم لب شیگلم خود را با استفاده از روغن‌ها و سایر مواد مغذی تولید کرده است و شما می‌توانید با اعمال آن بر روی لب علاوه‌بر آبرسانی و مرطوب کردن لب، از رنگ زیبای آن نیز استفاده کنید.\n\n- رنگ بسیار جذاب و براق\n\n- آبرسانی عمیق و حفظ رطوبت لب ها\n\n- ایجاد لطافت و درمان خشکی لب ها\n\n- حاوی روغن نارگیل و روغن هسته انگور\n\n- حاوی ویتامین e و ویتامین f",
    "descriptionEn": "SHEGLAM Pout-Perfect Shine Lip Plumper by SHEGLAM.",
    "price": 1725000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/148/a321684f8601cc32228bfd9a325914a3.jpg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/147/fd8a9e0dea615465d195949134fc498e.jpg"
    ],
    "sizes": [
      {
        "label": "spring fever",
        "labelEn": "spring fever",
        "price": 1725000
      },
      {
        "label": "hot stuff",
        "labelEn": "hot stuff",
        "price": 1725000
      }
    ],
    "variants": [
      {
        "id": "var-pori-116",
        "name": "spring fever",
        "nameEn": "spring fever",
        "price": 1725000,
        "stockCount": 4,
        "sku": "IN1711455109",
        "colorCode": "#f21d68"
      },
      {
        "id": "var-pori-117",
        "name": "hot stuff",
        "nameEn": "hot stuff",
        "price": 1725000,
        "stockCount": 7,
        "sku": "IN1711455110",
        "colorCode": "#b90c21"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "مستقیم روی لب‌های تمیز بزنید تا رطوبت، رنگ ملایم و درخشش حجم‌دهنده ایجاد شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "حجم‌دهنده لب",
      "روغن نارگیل و هسته انگور",
      "براق"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 11,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لب‌های خشک و کم‌حجم برای آرایش براق روزانه.",
    "unsuitableFor": "روی لب‌های ترک‌خورده بسیار حساس با احتیاط استفاده شود."
  },
  {
    "id": "product-pori-1609",
    "nameFa": "رژگونه کرمی دریم تاچ روژ شیگلم",
    "nameEn": "SHEGLAM Dream Touch Rouge Blush",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: رژگونه",
    "howToUse": "با براش رژگونه یا نوک انگشت مقدار کمی روی سیب گونه بزنید و به سمت شقیقه‌ها محو کنید.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ گونه Dream Touch شیگلم ۱۰گرم\n\nرژگونه Dream Touch Rouge شیگلم محصولی جذاب برای داشتن گونه‌هایی خوش‌رنگ، شاداب و طبیعی است. این رژگونه با بافت نرم و لطیف خود به‌راحتی روی پوست پخش می‌شود و جلوه‌ای زیبا و یکدست به گونه‌ها می‌بخشد.\n\nاگر به دنبال رژگونه‌ای با رنگدانه مناسب و جلوه‌ای طبیعی هستید که آرایش شما را شاداب‌تر و جذاب‌تر نشان دهد، رژگونه دریم تاچ شیگلم می‌تواند انتخابی مناسب برای تکمیل آرایش روزانه و مجلسی شما باشد.\n\nویژگی‌های رژگونه Dream Touch شیگلم\n\n- دارای بافت نرم و لطیف\n\n- پخش آسان و یکنواخت روی پوست\n\n- ایجاد جلوه‌ای شاداب و طبیعی روی گونه‌ها\n\n- دارای رنگدانه مناسب و قابل لایه‌سازی\n\n- مناسب برای آرایش روزانه و حرفه‌ای\n\n- قابل استفاده برای انواع سبک آرایش\n\n- طراحی کاربردی و مناسب برای استفاده روزمره\n\nنحوه استفاده\n\nبا استفاده از براش رژگونه یا نوک انگشت، مقدار مناسبی از محصول را روی برجستگی گونه‌ها قرار دهید و به‌آرامی پخش کنید. برای داشتن رنگی ملایم، از مقدار کم شروع کنید و در صورت تمایل شدت رنگ را افزایش دهید.\n\nچرا رژگونه شیگلم را انتخاب کنیم؟\n\nرژگونه دریم تاچ شیگلم با بافت لطیف و قابلیت پخش مناسب، به شما کمک می‌کند گونه‌هایی خوش‌رنگ و طبیعی داشته باشید. این محصول انتخابی زیبا برای افرادی است که دوست دارند بدون ایجاد ظاهری سنگین، طراوت و جذابیت بیشتری به آرایش خود ببخشند.\n\nبا رژگونه Dream Touch شیگلم، به آرایش خود رنگ و شادابی بیشتری هدیه دهید.",
    "descriptionEn": "SHEGLAM Dream Touch Rouge Blush by SHEGLAM.",
    "price": 1992000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4926/56cca57789f6881d4fd93c9ad3748a47.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4931/6997a6a6b89128c0fb71b749459a5349.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4928/0d924501f886a4bf89f3781aa695d9fd.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4930/8ace91230c90ca1adcaf129927fb522e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4929/5bb819e926e6a11137da816b4f1b59a9.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4932/0e5ba5c2e426551bcc2f0bb728bf8b1b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4927/df9c14664896d64a3838a34664038688.jpeg"
    ],
    "sizes": [
      {
        "label": "Hush hush",
        "labelEn": "Hush hush",
        "price": 1992000
      },
      {
        "label": "Wannabe",
        "labelEn": "Wannabe",
        "price": 1992000
      },
      {
        "label": "Love cake",
        "labelEn": "Love cake",
        "price": 1992000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1779",
        "name": "Hush hush",
        "nameEn": "Hush hush",
        "price": 1992000,
        "stockCount": 6,
        "sku": "IN1794671759"
      },
      {
        "id": "var-pori-1780",
        "name": "Wannabe",
        "nameEn": "Wannabe",
        "price": 1992000,
        "stockCount": 3,
        "sku": "IN1794671760"
      },
      {
        "id": "var-pori-1781",
        "name": "Love cake",
        "nameEn": "Love cake",
        "price": 1992000,
        "stockCount": 1,
        "sku": "IN1794671761"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با براش رژگونه یا نوک انگشت مقدار کمی روی سیب گونه بزنید و به سمت شقیقه‌ها محو کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "قابل لایه‌سازی",
      "پخش یکنواخت",
      "بافت نرم"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 10,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد رنگ طبیعی و شاداب روی گونه‌ها برای میکاپ روزانه و مجلسی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1371",
    "nameFa": "بالم و مربا لب آبرسان هیدرا ژلی پاکت شیگلم",
    "nameEn": "SHEGLAM Hydra Jelly Pocket Lip Jam",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: ژلی آبرسان و براق",
    "howToUse": "هر زمان در طول روز مقدار کمی روی لب‌ها بزنید و با انگشت یا اپلیکاتور پخش کنید.",
    "ingredientTags": [
      "vitamin-e",
      "hyaluronic-acid",
      "biotin"
    ],
    "descriptionFa": "مربا لب شیگلم لب‌هایی نرم، مرطوب و درخشان\n\nSHEGLAM Confiture pour les lèvres Hydra Jelly Pocket\n\nبا Hydra Jelly Pocket به لب‌های خود یک تجربه لطیف و دلپذیر هدیه دهید. این محصول با بافت ژله‌ای و لطیف، به‌راحتی روی لب پخش می‌شود و با کمک به حفظ رطوبت، لب‌ها را نرم، لطیف و براق نشان می‌دهد.\n\nطراحی جمع‌وجور و کاربردی Pocket باعث می‌شود بتوانید آن را همیشه همراه خود داشته باشید؛ داخل کیف، کیف آرایش یا حتی جیب. هر زمان که لب‌هایتان به کمی مراقبت و رطوبت نیاز داشت، می‌توانید به‌سادگی از آن استفاده کنید.\n\nویژگی‌های محصول\n\nکمک به آبرسانی و حفظ رطوبت لب‌ها\n\nکمک به نرم و لطیف شدن لب‌ها\n\nدارای بافت ژله‌ای، سبک و دلپذیر\n\nایجاد جلوه‌ای براق و جذاب روی لب\n\nمناسب برای استفاده روزانه\n\nطراحی کوچک و مناسب برای حمل در کیف یا جیب\n\nبافت ژله‌ای و لذت‌بخش\n\nبافت ژله‌ای Hydra Jelly Pocket هنگام تماس با لب به‌آرامی پخش شده و حس نرمی و راحتی ایجاد می‌کند. این محصول به لب‌ها ظاهری صاف‌تر، نرم‌تر و درخشان‌تر می‌بخشد و برای استفاده در طول روز گزینه‌ای ایده‌آل است.\n\nنحوه استفاده\n\nمقدار مناسبی از محصول را مستقیماً روی لب‌ها بزنید. در طول روز و هر زمان که احساس کردید لب‌ها به رطوبت و مراقبت بیشتری نیاز دارند، می‌توانید استفاده را تکرار کنید.\n\nنکته زیبایی: می‌توانید از آن به‌تنهایی برای داشتن لب‌هایی براق و طبیعی استفاده کنید یا آن را روی رژ لب بزنید تا جلوه‌ای درخشان‌تر و جذاب‌تر ایجاد شود.\n\nچرا Hydra Jelly Pocket؟\n\nاگر به دنبال محصولی هستید که مراقبت، لطافت و درخشش را در یک محصول جمع‌وجور ارائه دهد، Hydra Jelly Pocket انتخابی کاربردی برای روتین روزانه لب‌هاست.\n\nیک همراه کوچک برای مراقبت از لب‌ها\n\nHydra Jelly Pocket؛ لب‌هایی نرم، مرطوب و براق، هر جا که هستید.",
    "descriptionEn": "SHEGLAM Hydra Jelly Pocket Lip Jam by SHEGLAM.",
    "price": 1805000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3439/b3b39faf272b1433832c1fe932f5bdfc.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3445/d9730a5d594e026cdd6cf40469fe8b66.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3441/ceabae38f4667cea872ab988f0ce959f.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3443/6ee9d03478c67146d600448f8d53b804.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3440/dfab030f5e8ed89b36c4b7d1853ffaa2.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3442/c5c09b6e37df7b21fa6d535849ecd2a7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3444/e9e23d11f691bdecbf455bc89e70fc53.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3446/d84643fe3dfd7f2148a80ee52a592383.jpeg"
    ],
    "sizes": [
      {
        "label": "Watermelon whirl",
        "labelEn": "Watermelon whirl",
        "price": 1805000
      },
      {
        "label": "Apricot pop",
        "labelEn": "Apricot pop",
        "price": 1805000
      },
      {
        "label": "Fig flirt",
        "labelEn": "Fig flirt",
        "price": 1805000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1507",
        "name": "Watermelon whirl",
        "nameEn": "Watermelon whirl",
        "price": 1805000,
        "stockCount": 6,
        "sku": "IN1786694954"
      },
      {
        "id": "var-pori-1508",
        "name": "Apricot pop",
        "nameEn": "Apricot pop",
        "price": 1805000,
        "stockCount": 6,
        "sku": "IN1786694955"
      },
      {
        "id": "var-pori-1509",
        "name": "Fig flirt",
        "nameEn": "Fig flirt",
        "price": 1805000,
        "stockCount": 5,
        "sku": "IN1786694956"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "هر زمان در طول روز مقدار کمی روی لب‌ها بزنید و با انگشت یا اپلیکاتور پخش کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "بافت ژله‌ای",
      "ابعاد جیبی",
      "آبرسان و براق"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 17,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لب‌های نیازمند رطوبت سبک، لطافت و درخشش طبیعی میوه‌ای.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1368",
    "nameFa": "میست معطر و آبرسان مو و بدن گلو وانیلا مدیکوب",
    "nameEn": "Medicube Glow Vanilla Hair & Body Fragrance Mist",
    "brand": "Medicube",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت مو و بدن: میست معطر و آبرسان",
    "howToUse": "در طول روز از فاصله ۲۰ سانتی‌متری روی موها یا بدن اسپری کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "jojoba-oils",
      "biotin",
      "niacinamide"
    ],
    "descriptionFa": "میست معطر مو و بدن مدیکوب مدل Medicube Glow Vanilla\n\nMedicube Glow Vanilla Hair &amp; Body Fragrance Mist\n\nاگر به رایحه‌های شیرین، گرم و کرمی علاقه دارید، Medicube Glow Vanilla Hair &amp; Body Fragrance Mist می‌تواند انتخابی جذاب برای استفاده روزمره باشد. این میست خوشبوکننده برای مو و بدن طراحی شده و رایحه‌ای دلنشین از وانیل، پسته، کارامل و نت‌های چوبی را با ترکیبات مراقبتی مانند نیاسینامید، اسید کوجیک و ۷ نوع هیالورونیک اسید ترکیب می‌کند.\n\nبافت سبک و اسپری بسیار ریز آن به‌راحتی روی پوست و مو پخش می‌شود و برخلاف محصولات سنگین، حس چسبندگی یا چربی ناخوشایند ایجاد نمی‌کند. به همین دلیل می‌توان از آن در طول روز برای تازه‌کردن رایحه، ایجاد حس طراوت و خوشبو کردن مو و بدن استفاده کرد.\n\nرایحه Glow Vanilla؛ شیرین، خامه‌ای و جذاب\n\nرایحه این محصول برای علاقه‌مندان به عطرهای گورماند و وانیلی طراحی شده است؛ عطری گرم و شیرین که حالت خامه‌ای و لطیف وانیل را در کنار حس آجیلی پسته و شیرینی کارامل قرار می‌دهد.\n\nنت‌های رایحه\n\n- نت آغازین: وانیل کرمی، نارگیل و پسته\n\n- نت میانی: وانیل گرم، چوب کشمیر و کهربا\n\n- نت پایه: وانیل لطیف، کارامل و چوب صندل\n\nفقط یک بادی میست معمولی نیست!\n\nیکی از ویژگی‌های متفاوت Glow Vanilla این است که مدیکوب آن را با رویکرد Fragrance + Skincare طراحی کرده است؛ یعنی در کنار ایجاد رایحه خوشایند، ترکیباتی با کاربردهای مراقبتی نیز در فرمول آن وجود دارد.\n\n۷ نوع هیالورونیک اسید\n\nفرمول محصول حاوی مجموعه‌ای از ۷ نوع هیالورونیک اسید است که به آبرسانی پوست و مو کمک می‌کنند. این ترکیبات می‌توانند به حفظ رطوبت و ایجاد حس نرمی و لطافت بیشتر کمک کنند.\n\nنیاسینامید ۲٪\n\nNiacinamide یکی از ترکیبات شناخته‌شده در محصولات مراقبت از پوست است. مدیکوب از ۲٪ نیاسینامید در این میست استفاده کرده تا در کنار رایحه، از ظاهر شاداب‌تر و یکنواخت‌تر پوست حمایت کند.\n\nاسید کوجیک\n\nKojic Acid نیز در فرمول محصول قرار گرفته و برای مراقبت از ظاهر پوست‌های کدر و ناهماهنگ و کمک به ایجاد ظاهری روشن‌تر و یکدست‌تر مورد استفاده قرار می‌گیرد.\n\nکنترل بوی نامطبوع تا ۲۴ ساعت\n\nGlow Vanilla علاوه بر خوشبو کردن پوست و مو، با هدف کمک به کنترل بوی نامطبوع بدن نیز طراحی شده است. طبق نتایج اعلام‌شده توسط برند، این محصول در آزمایش‌های بالینی برای کنترل بو تا ۲۴ ساعت مورد ارزیابی قرار گرفته است. میزان ماندگاری رایحه روی پوست و مو می‌تواند با توجه به شرایط بدن، میزان فعالیت و محیط متفاوت باشد.\n\nدرخشش و ظاهر سالم‌تر مو\n\nاین محصول تنها برای بدن نیست و می‌توان آن را روی مو نیز استفاده کرد. اسپری سبک آن می‌تواند موهای کدر را خوشبو کرده و به ایجاد ظاهری براق‌تر و شاداب‌تر کمک کند.\n\nبه‌خصوص برای استفاده در طول روز، بعد از ورزش، بیرون از منزل یا زمانی که می‌خواهید رایحه موهایتان را تازه کنید، یک گزینه کاربردی محسوب می‌شود.\n\nبافت سبک و بدون حس چسبندگی\n\nیکی از مزیت‌های Glow Vanilla، میکرومیست بسیار ریز و سبک آن است. ذ",
    "descriptionEn": "Medicube Glow Vanilla Hair & Body Fragrance Mist by Medicube.",
    "price": 4273000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3420/80addfb9e128caa661a01b896518d3d6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3423/0dde365e32437e587cbbe2fc57e2874b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3422/09dc1e0eebe48c45cf35b60cec02b305.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3421/962182120922fa564bda3c28a90c01f6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3424/54f7ee5d059766c08dd6d42c51abd368.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3419/1596588ce1dfce2d74587215065297a8.jpeg"
    ],
    "sizes": [
      {
        "label": "۱۰۰میل",
        "labelEn": "100 ml",
        "price": 4273000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1610",
        "name": "۱۰۰میل",
        "nameEn": "100 ml",
        "price": 4273000,
        "stockCount": 6,
        "sku": "IN1789639866"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "کمک به یکدستی رنگ پوست، تنظیم چربی و حفظ طراوت و شادابی."
      }
    ],
    "usageRoutine": {
      "morning": "در طول روز از فاصله ۲۰ سانتی‌متری روی موها یا بدن اسپری کنید.",
      "night": "در طول روز از فاصله ۲۰ سانتی‌متری روی موها یا بدن اسپری کنید."
    },
    "badges": [
      "۷ نوع هیالورونیک + نیاسینامید",
      "بدون چسبندگی",
      "رایحه وانیل و پسته"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "افراد علاقه‌مند به رایحه گرم وانیلی همراه با رطوبت‌رسانی سبک برای مو و بدن.",
    "unsuitableFor": "از اسپری نزدیک به چشم و روی زخم باز خودداری شود."
  },
  {
    "id": "product-pori-1366",
    "nameFa": "رژ لب و رژگونه پوتی بانس پاکت شیگلم",
    "nameEn": "SHEGLAM Bounce Putty Pocket Lip & Cheek",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب و گونه: ۲ در ۱",
    "howToUse": "با نوک انگشت روی لب‌ها و سیب گونه ضربه‌ای بزنید و برای رنگ طبیعی‌تر فید کنید.",
    "ingredientTags": [
      "shea-butter",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ لب و گونه شیگلم بافت پوتی و جذاب\n\nSheglam Bounce Putty Pocket Pâte à Lèvres\n\nیک انتخاب دوست‌داشتنی برای داشتن لب‌هایی نرم، لطیف و خوش‌رنگ در طول روز است. این محصول با بافت خاص و جذاب پوتی، روی لب احساس راحتی ایجاد می‌کند و ظاهری شاداب و طبیعی به لب‌ها می‌بخشد.\n\nبافت نرم و متفاوت\n\nبافت پوتی و انعطاف‌پذیر این محصول به‌راحتی روی لب پخش می‌شود و جلوه‌ای لطیف و جذاب ایجاد می‌کند. ظاهر نهایی آن برای آرایش‌های روزانه و استایل‌های طبیعی بسیار مناسب است و می‌توان شدت رنگ را با توجه به سلیقه افزایش داد.\n\nچرا Sheglam Bounce Putty Pocket؟\n\nبافت نرم و پوتی با حس دلپذیر روی لب\n\nایجاد جلوه‌ای شاداب و خوش‌رنگ\n\nمناسب برای استفاده روزمره\n\nطراحی جمع‌وجور و مناسب برای همراه داشتن در کیف\n\nقابل استفاده به‌تنهایی یا در کنار سایر محصولات آرایشی لب\n\nانتخابی عالی برای آرایش‌های طبیعی، مینیمال و ترندی\n\nهمیشه همراه شما\n\nطراحی کوچک و کاربردی Bounce Putty Pocket باعث می‌شود بتوانید آن را به‌راحتی داخل کیف آرایش یا حتی کیف روزمره قرار دهید و هر زمان که خواستید، ظاهر لب‌هایتان را تازه و جذاب کنید.\n\nمناسب چه کسانی است؟\n\nاگر محصولی می‌خواهید که هم ظاهر لب‌ها را زیباتر کند و هم استفاده از آن ساده و سریع باشد، Sheglam Bounce Putty Pocket Pâte à Lèvres می‌تواند گزینه‌ای جذاب برای روتین آرایشی شما باشد؛ مخصوصاً اگر طرفدار آرایش‌های سبک، طبیعی و امروزی هستید.\n\nSheglam Bounce Putty Pocket؛ کوچیک، دوست‌داشتنی و آماده برای اینکه هر لحظه لب‌هات رو جذاب‌تر کنه!",
    "descriptionEn": "SHEGLAM Bounce Putty Pocket Lip & Cheek by SHEGLAM.",
    "price": 1805000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3408/4bcdaeb187f06b4a5a68051cf2f4e848.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3412/2b22813f788e4b888164201e9f9e521f.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3413/f5adceaa29a315cbcf97c02b0f55353b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3409/7386f6c155bd54e6fc68123a96b199de.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3414/2276980a09d542e4bb3f9638d79813b5.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3410/f5e4b888c399e5a9127845f2eb148cac.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3415/1c48ac761a7732fa56f6c6ff354a1104.jpeg"
    ],
    "sizes": [
      {
        "label": "Biscotti baby",
        "labelEn": "Biscotti baby",
        "price": 1805000
      },
      {
        "label": "Peachy pie",
        "labelEn": "Peachy pie",
        "price": 1805000
      },
      {
        "label": "Cherry cheer",
        "labelEn": "Cherry cheer",
        "price": 1805000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1498",
        "name": "Biscotti baby",
        "nameEn": "Biscotti baby",
        "price": 1805000,
        "stockCount": 6,
        "sku": "IN1786657719"
      },
      {
        "id": "var-pori-1497",
        "name": "Peachy pie",
        "nameEn": "Peachy pie",
        "price": 1805000,
        "stockCount": 5,
        "sku": "IN1786657718"
      },
      {
        "id": "var-pori-1499",
        "name": "Cherry cheer",
        "nameEn": "Cherry cheer",
        "price": 1805000,
        "stockCount": 5,
        "sku": "IN1786657720"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با نوک انگشت روی لب‌ها و سیب گونه ضربه‌ای بزنید و برای رنگ طبیعی‌تر فید کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "بافت پوتی نرم",
      "کاربرد لب و گونه",
      "حمل آسان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 16,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "علاقه‌مندان به میکاپ مونوکروم، طبیعی و مینیمال.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-889",
    "nameFa": "رژگونه کرمی-پودری باترملت نیکس",
    "nameEn": "NYX Professional Makeup Buttermelt Blush",
    "brand": "NYX",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: رژگونه ماندگار",
    "howToUse": "با براش نرم مقدار بسیار کمی برداشته و روی گونه‌ها بزنید و به خوبی بلند کنید.",
    "ingredientTags": [
      "shea-butter",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژگونه نیکس کالکشن باترملت\n\nرژگونه پودری نیکس مدل Buttermelt، یک رژگونه پودری با فرمولی نرم و کرمی است. این رژگونه به راحتی ترکیب می‌شود و با رنگدانه‌های غنی خود، تا ۱۲ ساعت روی پوست باقی می‌ماند و پخش یا محو نمی‌شود. غنی شده با کره شی باتر، کره انبه و کره بادام برای آبرسانی و احیای پوست شما.\n\nرژگونه باترملت مخصوص آرایش حرفه‌ای نیکس برای لب‌های باتا، رژگونه‌ای زیبا است که قابلیت ترکیب پودر را با نرمی کره ترکیب می‌کند.\n\nفرمول سبک و انعطاف‌پذیر آن با کره انبه، کره شی باتر و کره بادام غنی شده تا بافتی مقاومت‌ناپذیر ایجاد کند. از ظاهری لذت ببرید که تا ۱۲ ساعت بدون پخش شدن یا محو شدن، ماندگار است. با ۱۲ رنگ زیبا، مناسب برای انواع رنگ پوست، هرگز ظاهری چرب یا لکه‌دار نخواهید داشت.\n\nاز برس رژگونه باترملت برای استفاده آسان و ایجاد حجم استفاده کنید\n\n- پودر با قابلیت ترکیب\n\nنرمی کره\n\n- تا ۱۲ ساعت ماندگار است\n\n- غنی شده با کره انبه، کره شی باتر و کره بادام\n\n- مقاوم در برابر انتقال و محو شدن\n\n- بدون تست حیوانی\n\n- گیاهی",
    "descriptionEn": "NYX Professional Makeup Buttermelt Blush by NYX.",
    "price": 3328000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/5002/243a221ba210476450912d48611613ac.jpg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/5001/6fbd9d4e90498a00fda07606870a35a7.jpg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/5000/b1a0b0e5419531cc78e42d64d477840d.jpg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4999/88aa8a744dd0fdbbb05ee067a2d05766.jpg"
    ],
    "sizes": [
      {
        "label": "08",
        "labelEn": "08",
        "price": 3328000
      },
      {
        "label": "07",
        "labelEn": "07",
        "price": 3328000
      },
      {
        "label": "04",
        "labelEn": "04",
        "price": 3328000
      }
    ],
    "variants": [
      {
        "id": "var-pori-977",
        "name": "08",
        "nameEn": "08",
        "price": 3328000,
        "stockCount": 6,
        "sku": "IN1760020681"
      },
      {
        "id": "var-pori-973",
        "name": "07",
        "nameEn": "07",
        "price": 3328000,
        "stockCount": 6,
        "sku": "IN1760020677"
      },
      {
        "id": "var-pori-974",
        "name": "04",
        "nameEn": "04",
        "price": 3328000,
        "stockCount": 1,
        "sku": "IN1760020678"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با براش نرم مقدار بسیار کمی برداشته و روی گونه‌ها بزنید و به خوبی بلند کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "ماندگاری ۱۲ ساعته",
      "کره انبه، شی‌باتر و بادام",
      "پیگمنت بالا"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 13,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا / فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "رژگونه با ماندگاری بالا، ترکیب‌پذیری کرمی و بدون لکه‌شدن.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-763",
    "nameFa": "روغن لب رولی مرطوب‌کننده گود تایمز شیگلم",
    "nameEn": "SHEGLAM Good Times Roll Ball Lip Oil",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "night",
      "hydration"
    ],
    "routineStep": "آرایش لب: روغن لب رولی",
    "howToUse": "غلتک را مستقیماً روی لب‌های تمیز بکشید تا لایه‌ای براق و مغذی ایجاد شود.",
    "ingredientTags": [
      "squalane",
      "jojoba-oils",
      "biotin",
      "ginkgo-botanical"
    ],
    "descriptionFa": "روغن لب رولی مرطوب کننده و براق کننده مدل گود تایمز شیگلم\n\nبا این روغن لب، روزهای خوبی برای لب‌هایتان در پیش است! این روغن که دارای یک اپلیکاتور غلتکی است، با چرخاندن آن روی تمام لب‌هایتان، لب‌هایی زیبا و مرطوب خواهید داشت که در تمام طول روز ماندگار است. پی‌نوشت: درخشندگی بالای آن یک امتیاز اضافی است.\n\nاین محصول فرمول مغذی دارد که حاوی روغن ماکادمیا و اسکوالان می باشد. بنابراین به آبرسانی و تغذیه لب های شما کمک می کند و آن را نرم و مرطوب نگه می دارد.دارای رنگ و جلوه براقی است. این محصول درخشش عالی و زیبایی به لب ها می دهد. در عین حال لب های شما را در تمام اوقات هیدراته نگه می دارد.\n\n- فرمول مغذی حاوی روغن ماکادمیا و اسکوالان\n\n- آبرسانی و نرم و مرطوب کننده لب ها\n\n- تغذیه کننده و ایجاد لب هایی هیدراته در تمام روز\n\n- دارای رنگ و جلوه براق با درخشش عالی و زیبا\n\n- پیشگیری و درمان خشکی و ترک لب\n\n- صاف و یکدست کننده لب ها\n\n- دوام و ماندگاری بالا\n\n- دارای طراحی رولی و اپلیکاتور توپی غلتکی با چرخش کامل\n\n- امکان استفاده آسان و ماساژ روی لب\n\n- قابل استفاده بعنوان برق لب روی رژلب\n\n- فاقد الکل، گلوتن، پارابن، تالک\n\n- وگان و بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Good Times Roll Ball Lip Oil by SHEGLAM.",
    "price": 1072000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1229/5d52fefd9a56a98e3760fb55a90ca4fe.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1231/4156947099b62cdc751196a76946299f.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1230/5c63cefa83a9400e0ea15194e0ce5521.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 1072000
      }
    ],
    "variants": [
      {
        "id": "var-pori-838",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 1072000,
        "stockCount": 6,
        "sku": "IN1752163023"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "عصاره جینکو بیلوبا و گیاهان تقویتی",
        "nameEn": "Ginkgo Biloba & Botanical Extracts",
        "description": "افزایش خون‌رسانی مویرگی به فولیکول‌های مو و کمک به افزایش تراکم و رشد مو."
      }
    ],
    "usageRoutine": {
      "morning": "غلتک را مستقیماً روی لب‌های تمیز بکشید تا لایه‌ای براق و مغذی ایجاد شود.",
      "night": "غلتک را مستقیماً روی لب‌های تمیز بکشید تا لایه‌ای براق و مغذی ایجاد شود."
    },
    "badges": [
      "روغن ماکادمیا + اسکوالان",
      "اپلیکاتور غلتکی",
      "براق"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لب‌های خشک و مستعد ترک با علاقه به درخشش شیشه‌ای.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-734",
    "nameFa": "پالت سایه چشم ۸ رنگ لایو تو روم شیگلم",
    "nameEn": "SHEGLAM Live To Roam Eyeshadow Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت سایه",
    "howToUse": "رنگ پایه مات را روی پلک بزنید و رنگ‌های شیمر یا تیره‌تر را با براش یا انگشت ترکیب کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پالت سایه چشم لایو تو روم شیگلم\n\nاین پالت رنگ دانه های غنی و غلیظ تشکیل شده است که از پیگمنت بالایی برخوردار بوده و موجب زیبایی چشم می شود. پالت سایه چشم شیگلم لایو تو روم به چشم جلوه ای مات و شاین دار دارد. پالت سایه چشم شیگلم لایو تو روم بافت پودری و سبکی دارد که روی پوست به راحتی کشیده می شود و موجب سنگین شدن پوست نمی شود.\n\nپالت سایه چشم شیگلم لایو تو روم روی پوست حالت کیکی و ماسیده ایجاد نمی کند و ماندگاری طولانی مدتی روی پوست دارد. پالت سایه چشم شیگلم لایو تو روم پوست را خشک نکرده و باعث پوسته پوسته شدن پوست نمی گردد. پالت سایه چشم شیگلم لایو تو روم به هیچ عنوان پخش نمی شود و زیر چشم نمی ریزد.\n\n- شامل هشت رنگ سایه\n\n- جلوه مات و شیمر\n\n- بافت پودری و فشرده\n\n- دارای رنگبندی متفاوت\n\n- قابل استفاده برای تمام سبک‌ها\n\n- بدون کیکی شدن روی پوست\n\n- ضد لک و ریزش\n\n- ماندگاری بالا\n\n- بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Live To Roam Eyeshadow Palette by SHEGLAM.",
    "price": 2972000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1166/01969345e062d923a38794593b078105.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1167/6757a5807a805b64024e2f65068354bb.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۷.۶ گرم (۸ رنگ)",
        "labelEn": "7.6 g (8 Shades)",
        "price": 2972000
      }
    ],
    "variants": [
      {
        "id": "var-pori-807",
        "name": "وزن ۷.۶ گرم (۸ رنگ)",
        "nameEn": "7.6 g (8 Shades)",
        "price": 2972000,
        "stockCount": 6,
        "sku": "IN1749615497"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "رنگ پایه مات را روی پلک بزنید و رنگ‌های شیمر یا تیره‌تر را با براش یا انگشت ترکیب کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۸ رنگ مات و شیمر",
      "بدون ریزش",
      "بدون تست حیوانی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "میکاپ چشم روزانه و مجلسی با بافت سبک و بدون کیکی‌شدن.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-665",
    "nameFa": "لیپ گلاس آبرسان ریک اند مورتی شیگلم مدل Beth",
    "nameEn": "SHEGLAM Rick & Morty Family Counseling Lip Gloss - Beth",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: لیپ گلاس",
    "howToUse": "با اپلیکاتور روی لب‌ها بزنید؛ قابل استفاده به تنهایی یا روی رژ لب مات.",
    "ingredientTags": [
      "squalane",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "لیپ گلاس شیگلم سری ریک اند مورتی\n\nلیپ گلاس شیگلم یکی از پرفروش ترین لیپ گلاس‌های این روز‌ها در سراسر دنیا است که جلوه ای براق و شاین دار روی لب دارد و در عین حال لب را رطوبت رسانی کرده و از خشک شدن و پوسته پوسته شدن لب ها جلوگیری می‌کند. لیپ گلاس شیگلم برای روز های گرم تابستان ایده آل است و اصلا احساس چسبندگی روی لبها ایجاد نمی‌کند. این محصول از پوست لب ها محافظت کرده و ظاهری حجیم و برجسته به آنها می‌بخشد.\n\n- مرطوب‌کننده و آبرسان لب\n\n- افزایش حجم لب\n\n- نرم‌کننده و پرکننده خطوط لب\n\n- کیفیت بسیار بالا\n\n- جلوه براق و درخشان\n\n- حاوی روغن جوجوبا و روغن نارگیل\n\n- حاوی اسکوالن\n\n- عدم تست حیوانی",
    "descriptionEn": "SHEGLAM Rick & Morty Family Counseling Lip Gloss - Beth by SHEGLAM.",
    "price": 1500000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1028/d1b96da58c2ebc28a8746f05949f95ba.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1030/3a53013c44f934fc2080bb0a9827532d.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1029/01333133c3186efe8b4172a0cc994b18.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۳.۶ میلی‌لیتر",
        "labelEn": "3.6 ml",
        "price": 1500000
      }
    ],
    "variants": [
      {
        "id": "var-pori-735",
        "name": "حجم ۳.۶ میلی‌لیتر",
        "nameEn": "3.6 ml",
        "price": 1500000,
        "stockCount": 6,
        "sku": "IN1746426738"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "با اپلیکاتور روی لب‌ها بزنید؛ قابل استفاده به تنهایی یا روی رژ لب مات.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "روغن جوجوبا + اسکوالان",
      "بدون چسبندگی",
      "کالکشن ویژه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "درخشش بالا، نرمی لب و جلوه برجسته‌تر بدون چسبندگی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-640",
    "nameFa": "رژ لب جامد مات و مخملی استارلایت ولوت شیگلم",
    "nameEn": "SHEGLAM Starlight Velvet Lipstick",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: رژ لب جامد مخملی",
    "howToUse": "از مرکز لب به سمت گوشه‌ها بکشید؛ برای دوام بیشتر قبل از آن از خط لب استفاده کنید.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ لب جامد مات و مخملی شیگلم مدل استارلایت ولوت\n\nیک رژلب فوق العاده لوکس و جذاب است. این رزلب دارای بافت کرمی و لطیفی بوده که به راحتی روی لب ها اعمال می شود. سپس پوششی صاف و ابریشمی و مخملی و مغذی با نمای مات روی لب ها ایجاد می کند. رژلب جامد مات و مخملی استارلایت ولوت شیگلم فرمول قدرتمند با رنگدانه های غنی و ماندگاری بسیار بالا دارد. این رژلب نه تنها باعث احساس خشکی لب ها نمی شود، بلکه آن ها را نرم تر می کند.\n\nیک رژلب هالیوودی جذاب است.\n\nفرمول قدرتمند با رنگدانه های غنی و ماندگاری طولانی مدت\n\n- ایجاد پوشش صاف و یکدست و ابریشمی و مغذی روی لب\n\n- نمای مات و مخملی با جلوه ای ظریف و ملایم روی لب\n\n- نرم کننده لب و جلوگیری از خشکی آن\n\n- بسیار راحت و سبک و بدون احساس چسبناکی و ماسیدگی روی لب ها\n\n- طراحی شده در رنگ های زیبا\n\n- فاقد الکل، گلوتن، پارابن، تالک\n\n- وگان و بدون تست حیوانی\n\n- مناسب برای هر نوع و رنگ پوستی",
    "descriptionEn": "SHEGLAM Starlight Velvet Lipstick by SHEGLAM.",
    "price": 2170000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/971/1fcbd4848aa3a54cc524a0c6609a4286.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/972/4b34e4f14e1ad726443bba925d82a7ee.jpeg"
    ],
    "sizes": [
      {
        "label": "Magical dlight",
        "labelEn": "Magical dlight",
        "price": 2170000
      },
      {
        "label": "BEACH BABE",
        "labelEn": "BEACH BABE",
        "price": 2170000
      }
    ],
    "variants": [
      {
        "id": "var-pori-710",
        "name": "Magical dlight",
        "nameEn": "Magical dlight",
        "price": 2170000,
        "stockCount": 6,
        "sku": "IN1745889602"
      },
      {
        "id": "var-pori-1526",
        "name": "BEACH BABE",
        "nameEn": "BEACH BABE",
        "price": 2170000,
        "stockCount": 6,
        "sku": "IN1787155371"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "از مرکز لب به سمت گوشه‌ها بکشید؛ برای دوام بیشتر قبل از آن از خط لب استفاده کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "نمای مات مخملی",
      "وگان و بدون تالک",
      "بدون تست حیوانی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 12,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوشش مات و ابریشمی با پیگمنت غنی بدون خشک کردن لب.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-359",
    "nameFa": "اسپری فیکس مات‌کننده ریک اند مورتی شیگلم مدل Pickle Rick",
    "nameEn": "SHEGLAM Rick & Morty Pickle Rick Setting Spray",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "مرحله پایانی میکاپ: اسپری فیکس ۱۷ ساعته",
    "howToUse": "پس از اتمام آرایش، بطری را تکان داده و از فاصله ۲۰ تا ۲۵ سانتی‌متری با چشمان بسته روی صورت اسپری کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "biotin"
    ],
    "descriptionFa": "اسپری فیکس SHEGLAM کالکشن ریک و مورتی مدل Pickle Rick\n\nاین اسپری فیکساتور به شکل Pickle Rick دارای عصاره خیار سازگار با پوست است تا صورت شما را مرطوب کرده و بیس شما را حفظ کند و باعث ماندگاری آن در طول روز می شود. عصاره خیار موجود در این محصول باعث آبرسانی، شادابی و رفع خستگی شده و به کوچک شدن منافذ پوست کمک میکند. این اسپری با افزایش ماندگاری آرایش تا 17 ساعت محصولی فوق العاده برای روزهای شلوغ شما خواهد بود!\n\nحاوی عصاره خیار\n\nآبرسانی و شاداب کننده پوست\n\nحفظ رطوبت پوست\n\nافزایش ماندگاری آرایش تا 17 ساعت\n\nنمایی مات روی پوست\n\nتقویت کننده پوست\n\nتثبیت کننده آرایش\n\nبدون ایجاد چسبندگی\n\nجلوگیری از ماسیدگی و بهم ریختن آرایش\n\nبسیار سبک و بدون ایجاد حس سنگینی\n\nایجاد نمایی تازه و بدون نقص روی پوست در طولانی مدت",
    "descriptionEn": "SHEGLAM Rick & Morty Pickle Rick Setting Spray by SHEGLAM.",
    "price": 2949000,
    "originalPrice": 3360000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/464/258cfcba5f3719c7adfc7d4dd370edfc.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/465/146549af41b06b95056b037c6755d1ed.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۷۷ میلی‌لیتر",
        "labelEn": "77 ml",
        "price": 2949000,
        "originalPrice": 3360000
      }
    ],
    "variants": [
      {
        "id": "var-pori-406",
        "name": "حجم ۷۷ میلی‌لیتر",
        "nameEn": "77 ml",
        "price": 2949000,
        "originalPrice": 3360000,
        "stockCount": 6,
        "sku": "IN1727079105"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "پس از اتمام آرایش، بطری را تکان داده و از فاصله ۲۰ تا ۲۵ سانتی‌متری با چشمان بسته روی صورت اسپری کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "ماندگاری ۱۷ ساعته",
      "عصاره خیار",
      "فینیش مات بدون چسبندگی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "افزایش دوام آرایش در طول روز و جلوگیری از ماسیدگی و براقیت اضافه.",
    "unsuitableFor": "از پاشیدن مستقیم به داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-6",
    "nameFa": "پنکک کرم‌پودری مات و ضدآب شیگلم",
    "nameEn": "SHEGLAM Complexion Pro Powder Foundation",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: پنکک فول‌کاور",
    "howToUse": "با پد یا براش متراکم روی پوست مرطوب یا کرم‌پودر بزنید تا پوششی یکدست و مات ایجاد شود.",
    "ingredientTags": [
      "shea-butter",
      "jojoba-oils",
      "mineral-pigments"
    ],
    "descriptionFa": "- حاوی کره شی باتر طبیعی و روغن جوجوبا\n\n- کنترل کننده چربی پوست\n\n- ایجاد رطوبت پوست و حفظ آن\n\n- جلوگیری از ایجاد جوش\n\n- دارای جلوه ای مات و بافتی مخملی\n\n- کاور بسیار بالا (فول کاور)\n\n- پوشش کامل تمامی نواقص پوست\n\n- ضد آب\n\n- بسیار سبک\n\n- فاقد چربی\n\n- مناسب برای انواع پوست به خصوص پوستهای چرب\n\n————————-\n\nدارای ۳طیف رنگی",
    "descriptionEn": "SHEGLAM Complexion Pro Powder Foundation by SHEGLAM.",
    "price": 3313000,
    "originalPrice": 3591000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/36/963290a85828f011743e5019b2bc720a.jpg"
    ],
    "sizes": [
      {
        "label": "nude",
        "labelEn": "nude",
        "price": 3313000,
        "originalPrice": 3591000
      },
      {
        "label": "fair",
        "labelEn": "fair",
        "price": 3313000,
        "originalPrice": 3591000
      }
    ],
    "variants": [
      {
        "id": "var-pori-12",
        "name": "nude",
        "nameEn": "nude",
        "price": 3313000,
        "originalPrice": 3591000,
        "stockCount": 2,
        "sku": "IN1710799621",
        "colorCode": "#c7b959"
      },
      {
        "id": "var-pori-895",
        "name": "fair",
        "nameEn": "fair",
        "price": 3313000,
        "originalPrice": 3591000,
        "stockCount": 6,
        "sku": "IN1755589491",
        "colorCode": "#c7b959"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با پد یا براش متراکم روی پوست مرطوب یا کرم‌پودر بزنید تا پوششی یکدست و مات ایجاد شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "فول‌کاور و ضدآب",
      "شی‌باتر و جوجوبا",
      "کنترل چربی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 8,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های چرب و مختلط نیازمند پوشش کامل لک و منافذ با نمای مات مخملی.",
    "unsuitableFor": "برای پوست‌های خیلی خشک زیر آن حتماً آبرسان سبک استفاده شود."
  },
  {
    "id": "product-pori-1263",
    "nameFa": "کپسول تقویت‌کننده و ضدریزش مو و ناخن نووفن ای‌سی‌ام",
    "nameEn": "ACM Novophane Hair & Nails Food Supplement Capsules",
    "brand": "ACM",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "normal",
      "dry",
      "oily",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت تخصصی مو: مکمل تقویتی مو و ناخن",
    "howToUse": "روزانه ۲ عدد کپسول همراه با وعده غذایی و یک لیوان آب به مدت حداقل ۳ ماه میل شود (مطابق دستور بسته‌بندی).",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "کپسول ضد ریزش و سفیدی مو نووفن ای سی ام\n\nنووفان رشد مجدد و زیبایی مو و ناخن را بهبود می‌بخشد و آنها را دوباره قوی و مقاوم می‌کند. ریزش موی موقت یا فصلی، تغییر کیفیت مو، یا ناخن‌های شکننده، نرم، ترک خورده یا شکننده نووفان حاوی فرمولی بسیار جامع با اسیدهای آمینه، ویتامین‌ها، مواد معدنی و سیلیکون گیاهی است تا مو و ناخن‌ها را سالم و قوی نگه دارد.\n\nکپسول‌های فرمول تقویت‌شده نووفان حاوی فرمولی بسیار کامل با اسیدهای آمینه، ویتامین‌ها، مواد معدنی و سیلیکون گیاهی هستند که مو و ناخن را سالم و قوی نگه می‌دارند.\n\nبیوتین و روی به حفظ زیبایی مو کمک می‌کنند. روی به حفظ سلامت ناخن‌ها کمک می‌کند. ویتامین B6 به سنتز طبیعی سیستئین کمک می‌کند. مس به رنگدانه‌سازی طبیعی مو کمک می‌کند.\n\n- شامل بیوتین\n\n- دارای مواد معدنی\n\n- کمک به حفظ رنگدانه موها\n\n- حاوی اسید آمینه های گیاهی\n\n- حفظ سلامت مو و ناخن\n\n- جلوگیری از سفید شدن مو\n\n- حاوی ویتامین E C B5 B6 B2 B3 و آهن\n\n- دوره استفاده حداقل 3 ماه\n\n- روزی 2 عدد بعد از غذا مصرف شود",
    "descriptionEn": "ACM Novophane Hair & Nails Food Supplement Capsules by ACM.",
    "price": 11225000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2838/960515e134f594a654927dd96f6b1800.jpeg"
    ],
    "sizes": [
      {
        "label": "بسته ۶۰ عددی",
        "labelEn": "60 Capsules",
        "price": 11225000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1388",
        "name": "بسته ۶۰ عددی",
        "nameEn": "60 Capsules",
        "price": 11225000,
        "stockCount": 5,
        "sku": "IN1783430612"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "روزانه ۲ عدد کپسول همراه با وعده غذایی و یک لیوان آب به مدت حداقل ۳ ماه میل شود (مطابق دستور بسته‌بندی).",
      "night": "روزانه ۲ عدد کپسول همراه با وعده غذایی و یک لیوان آب به مدت حداقل ۳ ماه میل شود (مطابق دستور بسته‌بندی)."
    },
    "badges": [
      "بیوتین + زینک + سیستئین",
      "تقویت مو و ناخن",
      "ساخت فرانسه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 5,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ریزش موی فصلی یا موقت، تار موی ضعیف و ناخن‌های شکننده و لایه‌لایه.",
    "unsuitableFor": "در دوران بارداری، شیردهی یا بیماری خاص پیش از مصرف با پزشک مشورت شود."
  },
  {
    "id": "product-pori-1080",
    "nameFa": "پک پیلو تاک شارلوت تیلبری مدل Iconic Lip & Cheek Secrets",
    "nameEn": "Charlotte Tilbury Pillow Talk Iconic Lip & Cheek Secrets Set",
    "brand": "Charlotte Tilbury",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "پک لوکس آرایش لب و گونه",
    "howToUse": "لب‌ها را با مداد Lip Cheat فرم دهید، رژ Matte Revolution بزنید و Beauty Light Wand را روی برجستگی گونه محو کنید.",
    "ingredientTags": [
      "vitamin-e",
      "collagen",
      "mineral-pigments"
    ],
    "descriptionFa": "پک پیلو تاک شارلوت تیلبری مدل\n\nIconic Lip &amp; Cheek secrets\n\nترکیبی شگفت‌انگیز از پرطرفدارترین محصولات آرایشی شارلوت تیلبری در رنگ نمادین “Pillow Talk” است. این مجموعه، تمام آنچه برای یک آرایش روزانه و شبانه درخشان و جذاب نیاز دارید را در قالبی لوکس و جمع‌وجور ارائه می‌دهد.\n\nاین پک خاص، ایده‌آل برای خانم‌هایی است که به دنبال برجسته‌سازی طبیعی لب‌ها و گونه‌های خود هستند؛ بدون اغراق، با نهایت لطافت، شاین و رنگ طبیعی.\n\nمحتویات پک پیلو تاک شارلوت تیلبری:\n\n1.رژ لب مات Matte Revolution - Pillow Talk\n\nرژ لب نمادین شارلوت با فرمول مات مخملی، که هم ماندگاری بالایی دارد و هم لب‌ها را خشک نمی‌کند. رنگ پیلو تاک برای انواع تناژ پوستی مناسب است.\n\n2.رژگونه مایع Beauty Light Wand - Pillow Talk\n\nهایلایتر و رژگونه مایع با اپلیکاتور اسفنجی، بافت سبک و براق که جلوه‌ای درخشان و طبیعی به گونه‌ها می‌دهد.\n\n3.خط لب Lip Cheat - Pillow Talk\n\nمداد لب حرفه‌ای با بافت نرم و پیگمنت بالا که فرم‌دهی لب را آسان کرده و از پخش شدن رژ جلوگیری می‌کند.\n\n4.بالم لب Collagen Lip Bath - Pillow Talk\n\nبراق‌کننده و حجم‌دهنده لب با فرمول غنی از کلاژن، برای ظاهری درخشان، سالم و حجیم.",
    "descriptionEn": "Charlotte Tilbury Pillow Talk Iconic Lip & Cheek Secrets Set by Charlotte Tilbury.",
    "price": 15547000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1976/7c8b7b9d3ce445d9fb0f90dc352683b7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1974/0f534cedc0397242aba8dad54b55d72b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1975/46c3bc624facb90bb779968738e89bf7.jpeg"
    ],
    "sizes": [
      {
        "label": "ست ۳ عددی Pillow Talk",
        "labelEn": "3-Piece Gift Set",
        "price": 15547000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1195",
        "name": "ست ۳ عددی Pillow Talk",
        "nameEn": "3-Piece Gift Set",
        "price": 15547000,
        "stockCount": 5,
        "sku": "IN1775582918"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "کمک به حفظ رطوبت، افزایش حجم و قوام تارهای مو، مژه و نرمی بافت لب."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "لب‌ها را با مداد Lip Cheat فرم دهید، رژ Matte Revolution بزنید و Beauty Light Wand را روی برجستگی گونه محو کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "کالکشن Pillow Talk",
      "لوکس اورجینال",
      "ست ۳ عددی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 5,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انگلستان / ایتالیا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "علاقه‌مندان به آرایش کلاسیک، درخشان و طبیعی با شید جهانی Pillow Talk.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1068",
    "nameFa": "تینت پوست آبرسان با SPF20 شیگلم مدل Dew & Done",
    "nameEn": "SHEGLAM Dew & Done Skin Tint SPF 20",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration",
      "sunscreen"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: تینت پوست سبک روزانه",
    "howToUse": "صبح‌ها روی پوست مرطوب و ضدآفتاب با براش یا انگشت پخش کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "sun-filters",
      "mineral-pigments"
    ],
    "descriptionFa": "تینت پوست شیگلم حاوی SPF 20\n\nSHEGLAM DEW &amp; DONE SKIN TINT WITH SPF20\n\nاین محصول با بافتی سبک و پوشانندگی ملایم، جلوه‌ای درخشان و سالم به پوست می‌بخشد، بدون اینکه احساس سنگینی یا ماسیدگی ایجاد کند. فرمول آبرسان آن باعث می‌شود که پوست در طول روز مرطوب، تازه و شفاف باقی بماند.\n\nدر کنار جلوه‌ی طبیعی و درخشان، این محصول از پوست در برابر آسیب‌های محیطی و اشعه UV با SPF 20 محافظت می‌کند. طراحی آن به‌گونه‌ای‌ست که بتواند پایه‌ای روزمره و کاربردی برای آرایش‌های ساده تا حرفه‌ای باشد.\n\nاگر به‌دنبال پوست طبیعی، درخشان و بی‌نقص هستید بدون سنگینی کرم‌پودرهای سنتی، تینت پوست شیگلم گزینه‌ای سبک، مرطوب‌کننده و محافظ در برابر UV است که ظاهر شما را در کمترین زمان به نهایت طراوت می‌رساند.\n\n- دارای پیگمنت و رنگدانه\n\n- صاف و یکدست کننده پوست\n\n- افزایش لطافت و نرمی\n\n- بافت سبک و بدون حس سنگینی\n\n- افزایش شادابی و نشاط پوست\n\n- آبرسان و رطوبت رسان (12 ساعت)\n\n- فینیش طبیعی و درخشان\n\n- دارای یک براش کاربردی\n\n- مناسب انواع پوست",
    "descriptionEn": "SHEGLAM Dew & Done Skin Tint SPF 20 by SHEGLAM.",
    "price": 2558000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1938/331a2c925537bfc8924e4521f625c845.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1939/f897cfbc3423144ddb6c462fabb10684.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1940/3309230bdbf8234cd1c7180810b8eba1.webp"
    ],
    "sizes": [
      {
        "label": "Warm vanilla",
        "labelEn": "Warm vanilla",
        "price": 2558000
      },
      {
        "label": "Bamboo",
        "labelEn": "Bamboo",
        "price": 2558000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1181",
        "name": "Warm vanilla",
        "nameEn": "Warm vanilla",
        "price": 2558000,
        "stockCount": 5,
        "sku": "IN1774539921"
      },
      {
        "id": "var-pori-1182",
        "name": "Bamboo",
        "nameEn": "Bamboo",
        "price": 2558000,
        "stockCount": 2,
        "sku": "IN1774539922"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "فیلتر محافظ UV (SPF)",
        "nameEn": "Broad-Spectrum UV Filters",
        "description": "محافظت از پوست و لب در برابر اشعه‌های UVA و UVB و پیشگیری از آسیب نوری."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "صبح‌ها روی پوست مرطوب و ضدآفتاب با براش یا انگشت پخش کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "SPF 20",
      "آبرسانی ۱۲ ساعته",
      "فینیش طبیعی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 7,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "افراد علاقه‌مند به پوشش سبک و درخشان روزانه به جای کرم‌پودرهای سنگین.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-927",
    "nameFa": "ریمل مژه و ابرو مگا بوست کلاژن‌دار شیگلم",
    "nameEn": "SHEGLAM Lashlighter Mega Boost Mascara",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "sensitive",
      "oily",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: ریمل حجم‌دهنده",
    "howToUse": "برس مخروطی را از بن مژه‌ها تا نوک بکشید تا مژه‌ها فر و حجیم شوند.",
    "ingredientTags": [
      "peptides",
      "collagen",
      "mineral-pigments"
    ],
    "descriptionFa": "ریمل مژه و ابرو مگا بوست شیگلم\n\nبا ریمل Lashlighter Mega Boost حجم مژه‌ها را افزایش دهید. این ریمل فوق‌العاده غنی با هر بار کشیدن، مژه‌ها را حجیم و حجیم‌تر می‌کند و حجمی جسورانه و تقویت‌شده را ارائه می‌دهد که باعث می‌شود چشمان شما برجسته‌تر به نظر برسند. سر مخروطی برس آن تک تک مژه‌ها را در بر می‌گیرد تا به راحتی شکل داده، فر شود و بیشترین تأثیر را داشته باشد. به علاوه، این ریمل با کلاژن و پپتیدها غنی شده است تا مژه‌های شما را تغذیه، قوی و ماندگار نگه دارد. و وقتی زمان پاک کردن آن فرا می‌رسد، به راحتی با آب گرم پاک می‌شود.\n\n- رنگدانه های مشکی\n\n- ماندگاری بالا\n\n- حجم دهنده\n\n- بلند کننده\n\n- حالت دهنده\n\n- بدون چسبندگی مژه ها\n\n- تست شده توسط متخصصان پوست\n\n- مناسب برای افرادی که از لنز استفاده می‌کنند.",
    "descriptionEn": "SHEGLAM Lashlighter Mega Boost Mascara by SHEGLAM.",
    "price": 1556000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1590/8cef37bd1d017f35342ebc29dbd3bd81.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1591/c7f55839c6c084d7c43ef808e4f3aaf2.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1592/8491f4dcfe2f85a041551ebc41abc7b0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1593/4e7657b6fcc6fb406a5e97a5d96eb919.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۸ میلی‌لیتر",
        "labelEn": "8 ml",
        "price": 1556000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1017",
        "name": "حجم ۸ میلی‌لیتر",
        "nameEn": "8 ml",
        "price": 1556000,
        "stockCount": 5,
        "sku": "IN1761859195"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پپتایدهای فعال و فاکتور رشد EGF",
        "nameEn": "Bio-Active Peptides & EGF",
        "description": "تقویت ریشه مو و مژه، حمایت از استحکام ساختار کراتینی و بهبود لطافت و پرپشتی."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "کمک به حفظ رطوبت، افزایش حجم و قوام تارهای مو، مژه و نرمی بافت لب."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "برس مخروطی را از بن مژه‌ها تا نوک بکشید تا مژه‌ها فر و حجیم شوند.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "کلاژن و پپتاید",
      "مناسب لنز",
      "شست‌وشوی آسان با آب گرم"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 5,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "حجم‌دهی، بلندکنندگی و حالت‌دهی مژه حتی برای چشم‌های حساس و دارای لنز.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-922",
    "nameFa": "کانسیلر فول‌کاور شیپ تیپ تارت",
    "nameEn": "Tarte Shape Tape Full Coverage Concealer",
    "brand": "Tarte",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "combination",
      "oily",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: کانسیلر حرفه‌ای",
    "howToUse": "مقدار بسیار کمی را روی تیرگی زیر چشم یا نواحی دارای لک بزنید و بلافاصله با اسفنج مرطوب بلند کنید.",
    "ingredientTags": [
      "shea-butter",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "کانسیلر شیپ تیپ تارت\n\nاین کانسیلر با پوشش کامل، ظاهری مات و طبیعی ارائه می‌دهد و در عین حال، ظاهر پوست را صاف و روشن می‌کند و جلوه‌ای فوری به پوست می‌بخشد. فرمول بدون چروک آن پاره یا رسوب نمی‌کند و ۱۶ ساعت استفاده بی‌نقص را فراهم می‌کند. با بهره‌گیری از فناوری نواری، خطوط ریز و چین و چروک محو می‌شوند و ظاهری صاف و جوان به پوست می‌بخشد. اپلیکاتور نرم‌تر جامبو اسپید، استفاده از آن را در عرض چند ثانیه آسان می‌کند. ساخته شده از مواد گیاهی و بدون آزمایش روی حیوانات. همیشه بدون پارابن، روغن معدنی، فتالات، تریکلوزان، سدیم لوریل سولفات و گلوتن.\n\n- فرمول ضد آب با پوشش کامل و ظاهری مات طبیعی\n\n- صاف و روشن کننده برای ایجاد اثر لیفتینگ فوری دور چشم\n\n- فرمول ضد چروک ۱۲ ساعته، بدون ایجاد رسوب و چربی و ۱۶ ساعت ماندگاری بی‌عیب و نقص\n\n- فناوری tape™ به صاف و محو کردن خطوط ریز و چین و چروک کمک می‌کند\n\n- به راحتی با jumbo speed smoother™ اعمال می‌شود\n\n- گیاهی، آزمایش شده توسط متخصص پوست و بدون تست حیوانی",
    "descriptionEn": "Tarte Shape Tape Full Coverage Concealer by Tarte.",
    "price": 7362000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1578/9e1658838af2b9c394e10b832b9071a6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1581/ba333997487583085031911b30d55e91.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1579/bf061ca95810306ee2a4d81392f9bead.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1580/d0400da5c2dca30f681f08c9582fdfd0.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰ میلی‌لیتر",
        "labelEn": "10 ml",
        "price": 7362000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1012",
        "name": "حجم ۱۰ میلی‌لیتر",
        "nameEn": "10 ml",
        "price": 7362000,
        "stockCount": 5,
        "sku": "IN1761604933"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "مقدار بسیار کمی را روی تیرگی زیر چشم یا نواحی دارای لک بزنید و بلافاصله با اسفنج مرطوب بلند کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "کاور کامل ۱۶ ساعته",
      "ضدچروک و ضدآب",
      "وگان و فاقد پارابن"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 5,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوشش بی‌نقص تیرگی زیر چشم، لیفت ظاهری و ماندگاری ۱۶ ساعته.",
    "unsuitableFor": "برای زیر چشم بسیار خشک حتماً قبل از مصرف از دور چشم آبرسان استفاده کنید."
  },
  {
    "id": "product-pori-592",
    "nameFa": "مداد ابرو دوطرفه ۲ در ۱ براوز آن دیمند شیگلم",
    "nameEn": "SHEGLAM Brows On Demand 2-in-1 Brow Pencil",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش ابرو: مداد + ماژیک دوطرفه",
    "howToUse": "با سر مدادی کرمی فرم کلی را بکشید و با سر ماژیکی ظریف تارهای خالی ابرو را هاشور بزنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "مداد ابرو دوطرفه 2 در 1 شیگلم-\n\nبا مداد ابروی دو طرفه ما، ابروی خود را از هر زاویه ای بالا ببرید. یک طرف دارای نوک کرم مات ضد آب است که برای خطوط دقیقی که شبیه موهای طبیعی شما هستند، بسیار باریک طراحی شده است. انتهای دیگر یک مایع لوکس را ارائه می دهد که ضد آب، ضد عرق و مقاوم در برابر روغن است و با رنگدانه های متعدد تزریق می شود تا سایه ای کاملا گرد داشته باشد. و چه چیزی جادویی تر؟ این محصول برای هر نوع ابرو و رنگ پوست ساخته شده است زیرا در دنیای ما، همه سزاوار ابروهای زیبا هستند!\n\n- طراحی دوطرفه با دو سر کاملا کاربردی\n\n- دارای یک نوک کرمی مات و ضد آب و نازک برای رسم خطوط مو ظریف و دقیق و طبیعی\n\n- دارای یک نوک مویی و مایع لوکس برای ایجاد سایه های منحنی تر\n\n- حاوی رنگدانه های بسیار قوی و ضد آب، ضد عرق و مقاوم در برابر چربی\n\n- پیگمنت عالی و فینیش مات و طبیعی روی ابروها\n\n- ماندگاری طولانی مدت و بدون پخش شدن در اطراف ابرو\n\n- طراحی شده در رنگ های زیبا و مطابق با رنگ طبیعی ابروها\n\n- فاقد الکل، عطر، گلوتن، تالک",
    "descriptionEn": "SHEGLAM Brows On Demand 2-in-1 Brow Pencil by SHEGLAM.",
    "price": 1836000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/873/82c06f6970f9c62e68b9c8587d1250d7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/874/2907bea16458aa69b44b394659dd2644.jpeg"
    ],
    "sizes": [
      {
        "label": "شکلات",
        "labelEn": "شکلات",
        "price": 1836000
      },
      {
        "label": "اسپرسو",
        "labelEn": "اسپرسو",
        "price": 1836000
      }
    ],
    "variants": [
      {
        "id": "var-pori-658",
        "name": "شکلات",
        "nameEn": "شکلات",
        "price": 1836000,
        "stockCount": 5,
        "sku": "IN1744159477"
      },
      {
        "id": "var-pori-1669",
        "name": "اسپرسو",
        "nameEn": "اسپرسو",
        "price": 1836000,
        "stockCount": 3,
        "sku": "IN1791312954"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با سر مدادی کرمی فرم کلی را بکشید و با سر ماژیکی ظریف تارهای خالی ابرو را هاشور بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "دوطرفه ۲ در ۱",
      "ضدآب و ضدتعریق",
      "نوک ظریف"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 8,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "طراحی و پر کردن دقیق ابرو با ماندگاری بالا در برابر رطوبت و چربی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-26",
    "nameFa": "شامپو ضدشوره دندراف کیلر آلپسین",
    "nameEn": "Alpecin Dandruff Killer Anti-Dandruff Shampoo",
    "brand": "Alpecin",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "oily",
      "normal",
      "combination"
    ],
    "concerns": [
      "hair-body",
      "soothing"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت مو: شامپو درمانی ضدشوره",
    "howToUse": "روی مو و کف سر خیس ماساژ دهید تا کف کند و بلافاصله آبکشی نمایید؛ مناسب استفاده روزانه.",
    "ingredientTags": [
      "panthenol",
      "biotin",
      "salicylic-dandruff"
    ],
    "descriptionFa": "(قوی‌ترین ضدشوره بازار)\n\nاصلی‌ترین مدل بازار\n\n- رفع کامل شوره سر\n\n- سرشار از سالسیلیک اسید و اسید فوماریک\n\n- غنش شده با پیریوتیون روی و پیروکتون اولامین\n\n- کاهش التهاب و خارش پوست سر\n\n- حاوی روی، پانتنول و آلانتوئین\n\n- جلوگیری از تکثیر میکروارگانیسم‌ها در ناحیه‌ی اپیدرم",
    "descriptionEn": "Alpecin Dandruff Killer Anti-Dandruff Shampoo by Alpecin.",
    "price": 2788000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/61/73f46b039ea55ab921ea70a1e825544c.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۵۰ میلی‌لیتر",
        "labelEn": "250 ml",
        "price": 2788000
      }
    ],
    "variants": [
      {
        "id": "var-pori-35",
        "name": "حجم ۲۵۰ میلی‌لیتر",
        "nameEn": "250 ml",
        "price": 2788000,
        "stockCount": 5,
        "sku": "IN1710996914"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "آبرسان، نرم‌کننده و تقویت‌کننده مژه، تار مو و پوست سر."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "سالیسیلیک اسید و کمپلکس ضدشوره",
        "nameEn": "Salicylic Acid & Piroctone Olamine",
        "description": "پاکسازی عمیق پوست سر، رفع پوسته‌ریزی و کنترل قارچ‌های عامل شوره بدون التهاب."
      }
    ],
    "usageRoutine": {
      "morning": "روی مو و کف سر خیس ماساژ دهید تا کف کند و بلافاصله آبکشی نمایید؛ مناسب استفاده روزانه.",
      "night": "روی مو و کف سر خیس ماساژ دهید تا کف کند و بلافاصله آبکشی نمایید؛ مناسب استفاده روزانه."
    },
    "badges": [
      "سالیسیلیک اسید + پیروکتون اولامین",
      "ضدخارش کف سر",
      "ساخت آلمان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 5,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آلمان",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "رفع شوره چرب و خشک، پوسته‌ریزی و خارش پوست سر.",
    "unsuitableFor": "از تماس با چشم‌ها خودداری شود."
  },
  {
    "id": "product-pori-1372",
    "nameFa": "برق لب شیشه‌ای چندمنظوره میرور موو شیگلم",
    "nameEn": "SHEGLAM Mirror Move Multifunctional Clear Gloss",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: برق لب آینه‌ای",
    "howToUse": "به‌تنهایی برای لب طبیعی و براق یا روی رژلب دلخواه بزنید.",
    "ingredientTags": [
      "vitamin-e",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "برق لب چندمنظوره شیگلم درخشش آینه‌ای، جلوه‌ای خیره‌کننده\n\nاگر به دنبال یک برق لب هستید که در کنار ایجاد درخشش چشمگیر، ظاهر لب‌ها را جذاب‌تر و شاداب‌تر نشان دهد، Sheglam Mirror Move Gloss Clair Multifonctionnel انتخابی ایده‌آل برای آرایش روزمره و مهمانی است.\n\nاین برق لب با جلوه‌ای شفاف و براق، سطح لب‌ها را پوشش داده و ظاهری درخشان و آینه‌ای ایجاد می‌کند. بافت آن به‌گونه‌ای طراحی شده که می‌توانید به‌تنهایی برای داشتن لب‌هایی طبیعی و براق یا روی رژ لب مورد علاقه‌تان استفاده کنید.\n\nویژگی‌های محصول\n\nایجاد جلوه شفاف و درخشش آینه‌ای روی لب\n\nمناسب برای استفاده به‌تنهایی یا روی رژ لب\n\nکمک به جذاب‌تر و شاداب‌تر دیده شدن لب‌ها\n\nمناسب برای انواع استایل‌های آرایشی\n\nکاربردی برای آرایش روزانه، مهمانی و موقعیت‌های خاص\n\nطراحی کاربردی و مناسب برای همراه داشتن در کیف آرایش\n\nدرخشش شفاف و جذاب\n\nرنگ شفاف این محصول باعث می‌شود زیبایی طبیعی لب‌ها حفظ شود و در عین حال جلوه‌ای براق و چشمگیر به آرایش شما اضافه کند. همچنین می‌توانید آن را روی رژ لب مات یا رنگی استفاده کنید تا جلوه‌ای تازه، درخشان و جذاب‌تر به رنگ لب بدهد.\n\nمحصولی چندمنظوره برای آرایش لب\n\nیکی از جذاب‌ترین ویژگی‌های Mirror Move Gloss امکان استفاده از آن به روش‌های مختلف است. برای یک آرایش مینیمال، مقدار کمی از برق لب را به‌تنهایی روی لب‌ها بزنید. برای آرایش‌های کامل‌تر، آن را روی رژ لب مورد علاقه خود استفاده کنید تا جلوه‌ای براق و آینه‌ای ایجاد شود.\n\nنحوه استفاده\n\nاپلیکاتور را به‌آرامی روی لب‌ها بکشید و محصول را به‌صورت یکنواخت پخش کنید. می‌توانید برای درخشش بیشتر، مقدار بیشتری از محصول را در قسمت مرکزی لب‌ها استفاده کنید.\n\nبرای استفاده روی رژ لب، ابتدا رژ لب خود را بزنید و سپس یک لایه نازک از Sheglam Mirror Move Gloss را روی آن اعمال کنید.\n\nچرا Sheglam Mirror Move Gloss؟\n\nاگر طرفدار لب‌های براق، شفاف و چشمگیر هستید، این برق لب می‌تواند یکی از کاربردی‌ترین محصولات کیف آرایش شما باشد. رنگ شفاف آن به‌راحتی با انواع رنگ‌های رژ لب هماهنگ می‌شود و به شما اجازه می‌دهد هر بار جلوه‌ای متفاوت برای آرایش لب خود ایجاد کنید.\n\nیک لمس براق برای کامل کردن آرایش\n\nSheglam Mirror Move Gloss انتخابی مناسب برای زمانی است که می‌خواهید در چند ثانیه، جلوه‌ای براق، شفاف و جذاب به لب‌ها و آرایش خود اضافه کنید.",
    "descriptionEn": "SHEGLAM Mirror Move Multifunctional Clear Gloss by SHEGLAM.",
    "price": 1024000,
    "originalPrice": 1617000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3447/8b84d784d76fc241901e183569e33789.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3450/87aa9b896a98282db13d0b9aca9dd55d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3451/de71280eebbd840f69c37d03e527553e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3449/928d3d34aa8f8681e7e6dd4f2dd1ad7a.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3448/9e4b2d14d8413f10a776005dd6965038.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 1024000,
        "originalPrice": 1617000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1510",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 1024000,
        "originalPrice": 1617000,
        "stockCount": 4,
        "sku": "IN1786698570"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "به‌تنهایی برای لب طبیعی و براق یا روی رژلب دلخواه بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "درخشش آینه‌ای",
      "قابل استفاده روی رژ لب",
      "بافت سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد جلوه شفاف، براق و حجیم روی لب در میکاپ روزانه و مجلسی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-917",
    "nameFa": "کرم پودر پرو لانگ مات با SPF شیگلم",
    "nameEn": "SHEGLAM Complexion Pro Longwear Breathable Matte Foundation",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "makeup",
      "sunscreen"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "آرایش صورت: کرم پودر مات و سبک",
    "howToUse": "روی پوست آماده‌شده با پرایمر به اندازه ۱ تا ۲ پمپ زده و با براش یا اسفنج مرطوب پخش کنید.",
    "ingredientTags": [
      "biotin",
      "sun-filters",
      "mineral-pigments",
      "ceramic-ionic"
    ],
    "descriptionFa": "کرم پودر پرو لانگ مات شیگلم\n\nاین محصول دارای خاصیت‌هایی مختلفی مانند آبرسانی، فیلتر فیزیکی تیتانیوم دی اکساید برای محافظت از اشعه مضر نور خورشید، آنتی اکسیدان قوی، تسکین دهنده، ضد‌التهاب و قرمزی، ضد‌آب و تعریق می‌باشد. کرم پودر شیگلم اصل پیگمنت بالایی دارد و کاملا Buildable است؛ یعنی می‌توانید برای افزایش پیگمنت کرم پودر لایه‌های بیشتری از آن روی پوست بزنید بدون اینکه پیل شود یا جلوه کیکی پیدا کند.\n\n- فینیش نیمه مات و طبیعی\n\n- ماندگاری طولانی مدت\n\n- پیگمنت بالا\n\n- ضد آب و تعریق\n\n- کنترل کننده چربی پوست\n\n- بدون مسدود کردن منافذ\n\n- بافت سبک\n\n- ضد التهاب و قرمزی\n\n- حاوی فیلتر تیتانیوم دی اکساید که موجب محافظت از پوست در برابر اشعه فرابنفش می شود.\n\n- قابل استفاده شخصی و حرفه ای،",
    "descriptionEn": "SHEGLAM Complexion Pro Longwear Breathable Matte Foundation by SHEGLAM.",
    "price": 2924000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1565/5b657dde885958ec35f23db954f4fa14.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1566/d52de0fadd1a6534811051496c81c7ec.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1567/42eaee3045c58c4eaa4f92046300a543.webp"
    ],
    "sizes": [
      {
        "label": "Nude",
        "labelEn": "Nude",
        "price": 2924000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1006",
        "name": "Nude",
        "nameEn": "Nude",
        "price": 2924000,
        "stockCount": 4,
        "sku": "IN1761508582"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "فیلتر محافظ UV (SPF)",
        "nameEn": "Broad-Spectrum UV Filters",
        "description": "محافظت از پوست و لب در برابر اشعه‌های UVA و UVB و پیشگیری از آسیب نوری."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      },
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "روی پوست آماده‌شده با پرایمر به اندازه ۱ تا ۲ پمپ زده و با براش یا اسفنج مرطوب پخش کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "فینیش نیمه‌مات",
      "ضدآب و غیرکومدوژنیک",
      "حاوی فیلتر UV"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های چرب، مختلط و نرمال به دنبال کاور قابل‌ساخت بدون بستن منافذ.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-799",
    "nameFa": "خط چشم ماژیکی مات و ضدآب او سو ریچ شیگلم",
    "nameEn": "SHEGLAM Oh So Rich Matte Waterproof Eyeliner",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: خط چشم ماژیکی",
    "howToUse": "نوک نمدی ظریف را نزدیک خط مژه بکشید؛ پس از مصرف درپوش را محکم ببندید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "خط چشم ماژیکی شیگلم ضد آب\n\nمات، پررنگ و بادوام - مطابق با سلیقه‌ی شما برای خط چشم جدید! خط چشم مات Oh So Rich ما با جلوه‌ای فوق‌العاده مات، جسارتی بی‌نظیر را به ارمغان می‌آورد. بدون تابش خیره‌کننده، بدون برق، فقط خلوص و بی‌نقص. این خط چشم فوق‌العاده غنی به راحتی روی پلک کشیده می‌شود و ظاهری براق و ماندگار در تمام طول روز ایجاد می‌کند. به علاوه، ضد آب، ضد لک و ضد ریزش است، بنابراین چه از خنده تا گریه سر بخورید و چه از باران بترسید، خط چشم شما تمام روز در جای خود ثابت می‌ماند\n\n- دارای فرمول مایع با رنگدانه های مشکی غنی و نمای مات\n\n- نوک نمدی فوق العاده ظریف و نازک برای رسم خطوط دلخواه\n\n- فرمول ضد آب با ماندگاری بالا در تمام طول روز\n\n- ضد عرق و ضد لک و بدون ریزش زیر چشم\n\n- قابلیت استفاده آسان و انتخابی ایده آل برای افراد مبتدی و حرفه ای\n\n- مناسب جهت استفاده روزانه یا آرایش مجلسی حرفه ای\n\n- فاقد الکل، عطر، گلوتن، سیلیکون، پارابن و تالک\n\n- وگان و بدون تست حیوانی\n\n- مناسب برای انواع پوست",
    "descriptionEn": "SHEGLAM Oh So Rich Matte Waterproof Eyeliner by SHEGLAM.",
    "price": 1672000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1299/ec151c269197545a2a84750989bbb651.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1300/b058f5b23b0228aa537ca058752ddc76.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1301/b9ea6724150b16057d5eedfcb2cfebce.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 1672000
      }
    ],
    "variants": [
      {
        "id": "var-pori-875",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 1672000,
        "stockCount": 4,
        "sku": "IN1754196334"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "نوک نمدی ظریف را نزدیک خط مژه بکشید؛ پس از مصرف درپوش را محکم ببندید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "مشکی مات غنی",
      "ضدآب و ضدریزش",
      "وگان و بدون عطر"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "رسم خط چشم دقیق و ماندگار بدون پخش شدن حتی در هوای مرطوب.",
    "unsuitableFor": "از تماس مستقیم با داخل چشم پرهیز شود."
  },
  {
    "id": "product-pori-627",
    "nameFa": "لیپ گلاس آبرسان جلی واو شیگلم",
    "nameEn": "SHEGLAM Jelly Wow Hydrating Lip Oil Gloss",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: لیپ گلاس آبرسان",
    "howToUse": "در طول روز روی لب‌ها بکشید تا لب‌ها مرطوب، نرم و براق شوند.",
    "ingredientTags": [
      "squalane",
      "hyaluronic-acid",
      "biotin"
    ],
    "descriptionFa": "لیپ گلاس جدید آبرسان شیگلم\n\nیک محصول روزانه و کاربردی برای لب ها است که درخششی زیبا و غیر چسبنده به لبها می بخشد. حاوی هیالورونیک اسید و اسکوالن است و در عین ایجاد درخشش روی لب، موجب رطوبت رسانی و حفظ سلامت لبها شده و خاصیت درمانی برای لبهای خشک دارد؛ همچنین در طول روز لطافت لبها را حفظ می کند.\n\nاین روغن لب با رطوبت رسانی بالای خود، لبها را حجیم تر کرده و با پر کردن خطوط ریز لب موجب یکدست شدن سطح آن می شود.\n\n- حاوی هیالورونیک اسید و اسکوالن\n\n- رطوبت رسان قوی\n\n- پلامپ کننده\n\n- جلوه براق و درخشان\n\n- بهبود ترک و خشکی لب\n\n- تقویت کننده و تغذیه کننده\n\n- ایجاد حس نرمی و لطافت\n\n- قابل استفاده روزانه\n\n- سبک و بدون احساس سنگینی\n\n- فاقد الکل، گلوتن و پارابن\n\n- فرمولاسیون وگان",
    "descriptionEn": "SHEGLAM Jelly Wow Hydrating Lip Oil Gloss by SHEGLAM.",
    "price": 1415000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/935/58526c7329cf61bce4e99abac40413f4.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۵ گرم",
        "labelEn": "5 g",
        "price": 1415000
      }
    ],
    "variants": [
      {
        "id": "var-pori-694",
        "name": "وزن ۵ گرم",
        "nameEn": "5 g",
        "price": 1415000,
        "stockCount": 4,
        "sku": "IN1745701267"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "در طول روز روی لب‌ها بکشید تا لب‌ها مرطوب، نرم و براق شوند.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "هیالورونیک اسید + اسکوالان",
      "وگان",
      "فاقد الکل و پارابن"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لب‌های خشک و دارای خطوط ریز نیازمند رطوبت‌رسانی همراه با جلوه شیشه‌ای.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-516",
    "nameFa": "ماسک موی درمانی و ترمیم‌کننده پرفکت سرم میزانسن",
    "nameEn": "Mise En Scène Perfect Serum Treatment Pack",
    "brand": "Mise En Scène",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "night"
    ],
    "routineStep": "مراقبت مو: ماسک ترمیم‌کننده داخل حمام",
    "howToUse": "پس از شامپو روی ساقه موی مرطوب بزنید، ۲ تا ۳ دقیقه صبر کرده و با آب ولرم بشویید.",
    "ingredientTags": [
      "jojoba-oils",
      "argan",
      "biotin",
      "silk-keratin"
    ],
    "descriptionFa": "ماسک موی درمانی فوری و ترمیم کننده میزانسن\n\nیک ماسک مو حاوی روغن است که مراقبت های شدید و سریع از آسیب را ارائه می دهد. این سرم ترمیم کننده فوق العاده غنی شده بویژه با روغن آرگان طلایی مراکش، مواد مغذی را در عمق موهای شما تقویت می کند و موها را صاف، ابریشمی و تغذیه می کند.\n\n- داراي هفت نوع روغن تقویت کننده (آرگان، نارگیل، جوجوبا، زیتون، روغن دانه چاي، روغن دانه زردآلو، روغن آفتابگردان)\n\n- این ماسک مو با خواص درمانی فوق العاده برای از بین بردن وز مو ، حالت اسکاچی مو و آسیب دیدگی های ناشی از رنگ و دکلره… میباشد.\n\n- این محصول همچنین در درمان موخوره و احیای موها با آسیب دیدگی شدید نیز مناسب است.\n\n- این ماسک دارای ترکیبات منحصر بفرد برای تغذیه و درخشان کردن موها و افزایش ضخامت تارهای مو و تقویت آنها میباشد.\n\n- این ماسک برای موهای خشک و انواع مو مناسب است.\n\n- درمان مو های آسیب دیده از حرارت با پروتئین گل رز و ژل رویال.\n\n- ماده پروتئینی موجود در محصول از مو محافظت کرده و مو را تغذیه، نرم و ابریشمی میکند.",
    "descriptionEn": "Mise En Scène Perfect Serum Treatment Pack by Mise En Scène.",
    "price": 1169000,
    "originalPrice": 2225000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/731/5627819d69329addff2c3c0f372013a3.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/732/7ea7d754ed3ef0eafa27f1b680da38ca.jpeg"
    ],
    "sizes": [
      {
        "label": "۱۸۰میل",
        "labelEn": "180 ml",
        "price": 1169000,
        "originalPrice": 2225000
      }
    ],
    "variants": [
      {
        "id": "var-pori-828",
        "name": "۱۸۰میل",
        "nameEn": "180 ml",
        "price": 1169000,
        "originalPrice": 2225000,
        "stockCount": 4,
        "sku": "IN1751897975"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "روغن آرگان مراکشی",
        "nameEn": "Moroccan Argan Oil",
        "description": "غنی از اسیدهای چرب امگا و ویتامین E برای ترمیم موهای آسیب‌دیده، رفع وز و درخشندگی مو."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است.",
      "night": "پس از شامپو روی ساقه موی مرطوب بزنید، ۲ تا ۳ دقیقه صبر کرده و با آب ولرم بشویید."
    },
    "badges": [
      "۷ روغن مغذی + آرگان مراکشی",
      "رفع وز و موخوره",
      "ترمیم رنگ و دکلره"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "موهای خشک، آسیب‌دیده از رنگ، دکلره و حرارت سشوار.",
    "unsuitableFor": "به ریشه و کف سر زده نشود."
  },
  {
    "id": "product-pori-1531",
    "nameFa": "کرم پودر و هایلایتر مایع درخشان‌کننده هالو گلو الف",
    "nameEn": "e.l.f. Halo Glow Liquid Filter",
    "brand": "e.l.f.",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: فیلتر درخشان‌کننده پوست",
    "howToUse": "به تنهایی، زیر کرم پودر، مخلوط با فاندیشن یا به عنوان هایلایتر مایع روی نقاط برجسته صورت بزنید.",
    "ingredientTags": [
      "squalane",
      "hyaluronic-acid",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "کرم پودر مایع درخشان کننده الف\n\nکرم پودر مایع درخشان‌کننده e.l.f. Halo Glow Liquid Filter یکی از محصولات محبوب برند الف (e.l.f. Cosmetics) است که برای ایجاد جلوه‌ای درخشان، شاداب و طبیعی روی پوست طراحی شده است. این محصول با بافت مایع و سبک خود، به پوست ظاهری صاف‌تر، یکدست‌تر و درخشان‌تر می‌بخشد و انتخابی مناسب برای افرادی است که آرایش‌های طبیعی و گلو (Glow) را دوست دارند.\n\nاین محصول را می‌توان به‌تنهایی برای داشتن پوستی درخشان و شاداب، زیر کرم پودر برای ایجاد جلوه‌ای براق و زیبا، یا همراه با سایر محصولات آرایشی برای افزایش درخشندگی پوست استفاده کرد.\n\nویژگی‌های کرم پودر مایع درخشان‌کننده الف\n\n- ایجاد جلوه‌ای درخشان و طبیعی روی پوست\n\n- بافت مایع و سبک\n\n- کمک به یکدست‌تر دیده شدن ظاهر پوست\n\n- پوشش سبک و قابل لایه‌سازی\n\n- مناسب برای آرایش روزانه و آرایش‌های گلو\n\n- قابل استفاده به‌تنهایی یا همراه با کرم پودر\n\n- دارای اپلیکاتور بزرگ برای استفاده آسان‌تر\n\n- مناسب برای ایجاد جلوه‌ای شاداب و درخشان\n\n- قابل استفاده به‌عنوان زیرساز آرایش یا هایلایتر مایع\n\n- مناسب برای افرادی که آرایش طبیعی و براق را ترجیح می‌دهند\n\nعملکرد و جلوه روی پوست\n\nکرم پودر مایع Halo Glow Liquid Filter با هدف ایجاد جلوه‌ای درخشان و لطیف روی پوست طراحی شده است. این محصول به پوست ظاهری شاداب می‌دهد و می‌تواند به کمتر دیده شدن ناهماهنگی‌های ظاهری پوست کمک کند.\n\nپوشش این محصول سبک است و برای افرادی که به دنبال پوشش کامل و مات نیستند، گزینه‌ای مناسب محسوب می‌شود. درخشندگی آن باعث می‌شود پوست جلوه‌ای زنده‌تر و سرحال‌تر داشته باشد.\n\nنکته: این محصول بیشتر یک فیلتر درخشان‌کننده مایع است تا یک کرم پودر کلاسیک با پوشش بالا؛ بنابراین برای پوشاندن کامل لک‌ها و نواقص پوستی، بهتر است در صورت نیاز از کانسیلر یا کرم پودر با پوشش بیشتر استفاده کنید.\n\nروش‌های استفاده از Halo Glow Liquid Filter\n\n۱. استفاده به‌تنهایی\n\nمقدار مناسبی از محصول را با اپلیکاتور روی پوست تمیز و مرطوب‌شده قرار دهید. سپس با براش، اسفنج آرایشی یا نوک انگشتان به‌آرامی پخش کنید تا جلوه‌ای یکدست و درخشان ایجاد شود.\n\n۲. استفاده به‌عنوان زیرساز آرایش\n\nپس از آماده‌سازی پوست، لایه‌ای نازک از محصول را روی صورت پخش کنید. سپس کرم پودر مورد علاقه خود را روی آن بزنید تا آرایش جلوه‌ای شاداب‌تر و درخشان‌تر پیدا کند.\n\n۳. ترکیب با کرم پودر\n\nبرای ایجاد جلوه‌ای لطیف و براق، می‌توانید مقدار کمی از محصول را با کرم پودر خود ترکیب کنید. بهتر است ابتدا مقدار کمی را امتحان کنید تا میزان درخشندگی و پوشش مطابق سلیقه شما باشد.\n\n۴. استفاده به‌عنوان هایلایتر مایع\n\nمقدار کمی از محصول را روی نقاط برجسته صورت مانند بالای گونه‌ها، پل بینی و استخوان ابرو بزنید و به‌آرامی محو کنید تا جلوه‌ای درخشان و طبیعی ایجاد شود.\n\nمناسب چه نوع پوستی است؟\n\nاین محصول را می‌توان متناسب با نوع پوست و سبک آرایش استفاده کرد:\n\n- پوست خشک: می‌تواند به ایجاد جلوه‌ای شاداب و درخشان کمک کند. استفا",
    "descriptionEn": "e.l.f. Halo Glow Liquid Filter by e.l.f..",
    "price": 8737000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4447/944dda0cb4f85185c8593d9a71fe5d58.png",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4444/0015755dfe559998b6a52fbad30bcf2e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4445/2d9a2f4ae87d34dd10bee28dcad321e6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4443/aea47d1ee3e2127bc0a4caeeb1d76280.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4442/adf52c868702f61c85baa2d4a6dd913c.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4446/e2d43f7b229bc0ddf7118a193ceaf7e4.jpeg"
    ],
    "sizes": [
      {
        "label": "Fair clair/1",
        "labelEn": "Fair clair/1",
        "price": 8737000
      },
      {
        "label": "Fair light/2",
        "labelEn": "Fair light/2",
        "price": 8737000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1684",
        "name": "Fair clair/1",
        "nameEn": "Fair clair/1",
        "price": 8737000,
        "stockCount": 3,
        "sku": "IN1791709076"
      },
      {
        "id": "var-pori-1685",
        "name": "Fair light/2",
        "nameEn": "Fair light/2",
        "price": 8737000,
        "stockCount": 3,
        "sku": "IN1791709077"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "به تنهایی، زیر کرم پودر، مخلوط با فاندیشن یا به عنوان هایلایتر مایع روی نقاط برجسته صورت بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "اسکوالان + هیالورونیک اسید",
      "جلوه Glass Skin",
      "وگان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد پوست درخشان، صاف و باطراوت با جلوه طبیعی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1351",
    "nameFa": "اسپری فیکس مات و بلورکننده ضدآب کَمرا آن شیگلم",
    "nameEn": "SHEGLAM Camera On Blurring Waterproof Setting Spray",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "مرحله پایانی میکاپ: فیکساتور ضدآب",
    "howToUse": "پس از تکمیل آرایش از فاصله ۲۵ سانتی‌متری روی صورت اسپری کنید و اجازه دهید خشک شود.",
    "ingredientTags": [
      "biotin",
      "niacinamide",
      "mineral-pigments"
    ],
    "descriptionFa": "اسپری فیکس و مات‌کننده شیگلم Camera On Blurring Waterproof Setting Spray\n\nاگر به دنبال یک اسپری فیکس‌کننده هستید که آرایش شما را برای مدت طولانی‌تری ثابت نگه دارد و در عین حال ظاهر پوست را صاف‌تر و یکدست‌تر نشان دهد، Sheglam Camera On Blurring Waterproof Setting Spray می‌تواند انتخابی کاربردی برای روتین آرایشی شما باشد.\n\nاین اسپری با بافت سبک و پخش آسان، روی پوست احساس سنگینی ایجاد نمی‌کند و به فیکس شدن آرایش کمک می‌کند. خاصیت ضدآب (Waterproof) آن باعث می‌شود آرایش در برابر رطوبت و تعریق مقاومت بیشتری داشته باشد؛ بنابراین برای استفاده روزمره، مهمانی‌ها و موقعیت‌هایی که ماندگاری آرایش اهمیت بیشتری دارد، گزینه‌ای مناسب است.\n\n- کمک به افزایش ماندگاری آرایش\n\n- دارای خاصیت ضدآب و مقاوم در برابر رطوبت\n\n- ایجاد جلوه‌ای صاف‌تر و یکدست‌تر روی پوست\n\n- کمک به کاهش نمای ظاهری منافذ و ناصافی‌های پوست\n\n- بافت سبک و مناسب برای استفاده روزانه\n\n- مناسب برای فیکس کردن انواع آرایش\n\n- ایجاد ظاهر مرتب‌تر و طبیعی‌تر پس از تکمیل میکاپ\n\nجلوه Blurring؛ آرایش صاف‌تر و یکدست‌تر\n\nیکی از ویژگی‌های جذاب Camera On Blurring Setting Spray ، افکت بلور یا Blurring آن است. این افکت کمک می‌کند ظاهر ناهمواری‌ها و منافذ کمتر به چشم بیایند و سطح پوست پس از آرایش، صاف‌تر و یکدست‌تر دیده شود. نتیجه نهایی، میکاپی مرتب‌تر و مناسب برای عکس و فیلم است.\n\nماندگاری بیشتر آرایش\n\nپس از کامل کردن آرایش، اسپری فیکس می‌تواند به تثبیت لایه‌های مختلف میکاپ کمک کند و باعث شود آرایش مدت بیشتری ظاهر اولیه خود را حفظ کند. فرمول ضدآب این محصول نیز برای زمان‌هایی که احتمال تعریق یا تماس با رطوبت وجود دارد، یک مزیت کاربردی محسوب می‌شود.\n\nروش استفاده\n\nبطری را به خوبی تکان دهید. پس از اتمام آرایش، اسپری را با فاصله مناسب از صورت نگه داشته و چند بار به صورت یکنواخت روی پوست اسپری کنید. اجازه دهید محصول به طور طبیعی روی پوست خشک شود و از تماس مستقیم با چشم‌ها خودداری کنید.\n\nچرا اسپری فیکس شیگلم را انتخاب کنیم؟\n\nاگر ماندگاری آرایش، ظاهر صاف و یکدست پوست و مقاومت بیشتر میکاپ در برابر رطوبت برایتان اهمیت دارد، Sheglam Camera On Blurring Waterproof Setting Spray می‌تواند یکی از محصولات کاربردی برای تکمیل روتین آرایشی شما باشد.",
    "descriptionEn": "SHEGLAM Camera On Blurring Waterproof Setting Spray by SHEGLAM.",
    "price": 2337000,
    "originalPrice": 2772000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3323/486893e282b8a8894d101652d13304fb.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3326/7718e941ba5ed8a9ea6a9d33250d910f.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3329/be58768b9d70bdaa2a082deebaa44ba3.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3325/c15f0b51bb06f083a0c7467262a684c6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3328/caec0879bba1434f0b054e83319182da.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3324/da50a58f32a772f70c976a67ace287cc.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3327/19285eef23854523da17fe12f5b1abae.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 2337000,
        "originalPrice": 2772000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1481",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 2337000,
        "originalPrice": 2772000,
        "stockCount": 3,
        "sku": "IN1786204822"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "کمک به یکدستی رنگ پوست، تنظیم چربی و حفظ طراوت و شادابی."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "پس از تکمیل آرایش از فاصله ۲۵ سانتی‌متری روی صورت اسپری کنید و اجازه دهید خشک شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "ضدآب",
      "کاهش ظاهر منافذ",
      "بافت سبک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "تثبیت طولانی‌مدت آرایش، کاهش براقیت اضافه و صاف‌کردن ظاهر منافذ.",
    "unsuitableFor": "از تماس مستقیم با چشم خودداری شود."
  },
  {
    "id": "product-pori-1122",
    "nameFa": "پالت سایه چشم ۱۲ رنگ استی فوئگو مکزیک شیگلم",
    "nameEn": "SHEGLAM Stay Fuego Mexico 12-Color Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت سایه ۱۲ رنگ",
    "howToUse": "سایه‌های مات را در چین پلک و شیمرها را روی مرکز پلک اعمال و فید کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پالت سایه چشم 12 رنگ مکزیک شیگلم\n\nبا طیفی از رنگ‌های صورتی پررنگ، سبز تند و متالیک‌های جذاب، گرما و سبک مکزیکوسیتی را به ارمغان بیاورید. وقتی صحبت از جذابیت روز تا شب می‌شود، آن را به عنوان یک انچیلادای کامل در نظر بگیرید. به علاوه، این رنگ‌ها برای لحظات بی‌پایان ترکیب و تطبیق، فوق‌العاده قابل ترکیب هستند و وقتی روی پلک‌های شما قرار می‌گیرند، در جای خود باقی می‌مانند. تاکو، درباره کمال!\n\n- دارای ۱۲ رنگ جذاب مات و شاین\n\n- پیگمنت و قدرت رنگدهی بالا\n\n- طیف رنگی صورتی، قرمز، سبز و زرد\n\n- مناسب آرایش حرفه ای و روزانه\n\nپوشش‌دهی فوق‌العاده بادوام و عالی\n\nهای متنوع: پالت شامل 12 رنگ مختلف است که ترکیبی از رنگ‌های مات، براق و شاین دار را در بر دارد. این رنگ‌ها از تن‌های طبیعی و خنثی گرفته تا رنگ‌های جذاب و پررنگ را شامل می‌شود، بنابراین می‌توانید به راحتی آرایش‌های روزمره یا جشن‌ها و مهمانی‌ها را با این پالت انجام دهید.\n\nفرمولاسیون با کیفیت: سایه‌های این پالت دارای فرمولاسیونی نرم و مخملی هستند که به راحتی روی پلک‌ها می‌نشینند و به خوبی با هم ترکیب می‌شوند. این سایه‌ها معمولاً از مواد باکیفیت ساخته شده‌اند و برای استفاده طولانی‌مدت مناسب هستند.\n\nپوشش‌دهی خوب: پالت سایه چشم شیگلم به خوبی رنگدانه‌ها را منتقل کرده و نیاز به تکرار چندباره برای پوشش کامل ندارد. رنگ‌ها به خوبی به پلک چسبیده و طول عمر خوبی دارند.\n\nماندگاری بالا: سایه‌های شیگلم به دلیل ترکیب خاص خود، ماندگاری بالایی دارند و در طول روز از محو شدن یا پخش شدن روی پوست جلوگیری می‌کنند.\n\nمناسب برای انواع پوست: این سایه‌ها برای انواع پوست، از جمله پوست‌های حساس اطراف چشم، مناسب هستند. پالت‌ها دارای فرمولاسیون ضد آلرژی یا غیرکمدوژنیک (بدون انسداد منافذ) نیز می‌باشند.",
    "descriptionEn": "SHEGLAM Stay Fuego Mexico 12-Color Palette by SHEGLAM.",
    "price": 2644000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2136/7cc1bcd5cab002360d69db6dde51ecf8.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2139/61645b3d8968ff67180fc9d54544a087.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2138/4e853478edb06d15f842283b6d39d057.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2137/cbc06d10f791813dcc6a5ad99db3934c.jpeg"
    ],
    "sizes": [
      {
        "label": "۱۲ رنگ مات و شاین",
        "labelEn": "12 Shades",
        "price": 2644000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1239",
        "name": "۱۲ رنگ مات و شاین",
        "nameEn": "12 Shades",
        "price": 2644000,
        "stockCount": 3,
        "sku": "IN1777616224"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "سایه‌های مات را در چین پلک و شیمرها را روی مرکز پلک اعمال و فید کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۱۲ رنگ پررنگ",
      "پیگمنت بالا",
      "مات و متالیک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آرایش‌های خلاقانه، گرم و پرانرژی روز و شب.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1004",
    "nameFa": "روغن مو آرگان نرم‌کننده و ترمیم‌کننده R3 ریپ",
    "nameEn": "RAIP R3 Argan Hair Oil",
    "brand": "RAIP",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت مو: سرم روغنی بدون آبکشی",
    "howToUse": "چند قطره روی ساقه و نوک موی نم‌دار (قبل از سشوار) یا خشک پخش کنید؛ بدون نیاز به آبکشی.",
    "ingredientTags": [
      "jojoba-oils",
      "argan"
    ],
    "descriptionFa": "روغن مو نرم و مرطوب کننده R3 آرگان ریپ\n\nیک روغن درمانی است که برای انواع موها قابل استفاده می باشد. این روغن با ترکیبات موثری از جمله روغن آرگان، روغن کاملیا ژاپنی، روغن دانه جوجوبا، روغن زیتون، روغن دانه آفتابگردان و ... فرموله شده است. از این رو مواد مغذی و رطوبت فراوانی را برای موها به ارمغان می آورد.موهای شما را براق و درخشان می سازد. همچنین موهای آسیب دیده را نیز ترمیم می کند.\n\n- حاوی روغن آرگان، روغن کاملیا ژاپنی، روغن جوجوبا، روغن زیتون، روغن آفتابگردان و ...\n\n- تامین مواد مغذی و رطوبت فراوانی برای موها\n\n- تغذیه کننده و نرم و مرطوب کننده موها\n\n- دارای اثرات درمانی و ترمیم کننده موهای آسیب دیده\n\n- براق کننده و درخشان کننده موها\n\n- حفظ تعادل سطوح چربی و رطوبت موها در حالت بهینه\n\n- محافظت از مو در برابر انواع روش های شیمیایی، وسایل حرارتی و عوامل آسیب رسان خارجی\n\n- ایجاد موهایی لطیف و مدرن و شیک با رایحه ای ظریف و عمیق\n\n- دارای فرمولاسیون روغنی و زودجذب و بدون احساس چسبناکی",
    "descriptionEn": "RAIP R3 Argan Hair Oil by RAIP.",
    "price": 2326000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1783/13efc393f5c225985ee64058c38206c4.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1784/6e410b59b361b93d2f7ad5537281e991.jpeg"
    ],
    "sizes": [
      {
        "label": "Grapefruit",
        "labelEn": "Grapefruit",
        "price": 2326000
      },
      {
        "label": "Orginal",
        "labelEn": "Orginal",
        "price": 2326000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1723",
        "name": "Grapefruit",
        "nameEn": "Grapefruit",
        "price": 2326000,
        "stockCount": 3,
        "sku": "IN1792834144"
      },
      {
        "id": "var-pori-1724",
        "name": "Orginal",
        "nameEn": "Orginal",
        "price": 2326000,
        "stockCount": 3,
        "sku": "IN1792834145"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "روغن آرگان مراکشی",
        "nameEn": "Moroccan Argan Oil",
        "description": "غنی از اسیدهای چرب امگا و ویتامین E برای ترمیم موهای آسیب‌دیده، رفع وز و درخشندگی مو."
      }
    ],
    "usageRoutine": {
      "morning": "چند قطره روی ساقه و نوک موی نم‌دار (قبل از سشوار) یا خشک پخش کنید؛ بدون نیاز به آبکشی.",
      "night": "چند قطره روی ساقه و نوک موی نم‌دار (قبل از سشوار) یا خشک پخش کنید؛ بدون نیاز به آبکشی."
    },
    "badges": [
      "آرگان + کاملیا + جوجوبا",
      "جذب سریع بدون چسبندگی",
      "محافظ حرارت"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "موهای وز، خشک، آسیب‌دیده و نیازمند درخشندگی و نرمی فوری.",
    "unsuitableFor": "فقط روی ساقه مو استفاده شود، نه کف سر."
  },
  {
    "id": "product-pori-909",
    "nameFa": "ریمل موی مرتب‌کننده موهای وز و ریز آن د گلو شیگلم",
    "nameEn": "SHEGLAM On The Glow Style Keeper Hair Mascara",
    "brand": "SHEGLAM",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "مراقبت مو: استایلر فوری موهای ریز",
    "howToUse": "برس را روی موهای ریز خط رویش مو، چتری یا موهای وز شده بکشید تا مرتب و ثابت شوند.",
    "ingredientTags": [
      "jojoba-oils",
      "argan",
      "biotin"
    ],
    "descriptionFa": "ریمل مو شیگلم صاف کننده موی وز\n\nریمل موی Style Keeper برس خیلی بزرگ، موهای وز و حالت‌دار را صاف کنید، موهای صاف و یکدست\n\nبا ریمل موی Style Keeper در عرض چند ثانیه به حالت‌های براق و براق برسید. این برس بی‌نقص مو که با یک برس خیلی بزرگ طراحی شده است، فوراً وز را رام می‌کند، حالت‌های وز را صاف می‌کند، لبه‌ها را مرتب می‌کند و موهای پراکنده را برای نتایج بی‌نقص - در هر زمان و هر مکان - مرتب می‌کند.\n\nسر برس بسیار بزرگ در هر حرکت، موهای بیشتری را پوشش می‌دهد، برای اصلاح سریع و حالت‌دهی آسان.\n\nفیبرهای متراکم و بلند: موهای پراکنده را با دقت می‌گیرد و کنترل می‌کند، برای یک نتیجه صاف و بدون توده.\n\nبرس نرم و انعطاف‌پذیر: برای نتایج دقیق و طبیعی با خطوط مو سازگار می‌شود.\n\nطراحی مناسب برای حالت دادن: مناسب برای همه چیز - چتری، خط رویش مو، پشت صاف، پشت گردن و موارد دیگر.\n\nبافت سرمی سبک و بدون اثر\n\nنگهدارندگی نرم و بدون توده\n\nبدون باقی ماندن اثر چسبندگی، شستشوی آسان\n\nفرمول ضد تعریق که در طول کار، گردش و تفریح ​​دوام می‌آورد\n\nترکیبات مغذی مو\n\nروغن هسته آرگان: تغذیه عمیق و پشتیبانی ترمیم\n\nآلوی کاکادو: تقویت موهای قوی‌تر و مقاوم‌تر\n\nروغن دانه جوجوبا: افزایش نرمی و لطافت\n\nعطری با حال و هوای جزیره‌ای در تمام طول روز\n\nنت‌های اولیه: هوای اقیانوس، یاس، نمک دریا\n\nنت‌های میانی: نارگیل، گل برف، بهار نارنج\n\nنت‌های پایه: مشک، وانیل، چوب صندل\n\nاجازه دهید موهایتان عصاره یک جزیره مخفی را هر کجا که می‌روید، با خود حمل کنند.",
    "descriptionEn": "SHEGLAM On The Glow Style Keeper Hair Mascara by SHEGLAM.",
    "price": 1357000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1552/32e5f423eedde697ab9f847e428cf6c2.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1551/323d2db7900cc0abd95d84fa21c4328c.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 1357000
      }
    ],
    "variants": [
      {
        "id": "var-pori-998",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 1357000,
        "stockCount": 3,
        "sku": "IN1761025057"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "روغن آرگان مراکشی",
        "nameEn": "Moroccan Argan Oil",
        "description": "غنی از اسیدهای چرب امگا و ویتامین E برای ترمیم موهای آسیب‌دیده، رفع وز و درخشندگی مو."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "برس را روی موهای ریز خط رویش مو، چتری یا موهای وز شده بکشید تا مرتب و ثابت شوند.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "برس بزرگ و دقیق",
      "بدون چسبندگی و سفیدک",
      "شست‌وشوی آسان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "مرتب‌سازی فوری بیبی‌هیرها و موهای وز شده در طول روز.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-888",
    "nameFa": "بالم لب و پوست آبرسان اسکوالان و آمینو اسید اوردینری",
    "nameEn": "The Ordinary Squalane + Amino Acids Lip Balm",
    "brand": "The Ordinary",
    "productType": "lip-care",
    "category": "hydration",
    "skinTypes": [
      "dry",
      "sensitive",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hydration",
      "barrier-repair",
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "hydration",
      "barrier-repair"
    ],
    "routineStep": "مراقبت لب و نقاط خشک: بالم ترمیم‌کننده",
    "howToUse": "روی لب‌ها، کوتیکول ناخن یا نواحی خشک مثل آرنج هر زمان نیاز بود بمالید.",
    "ingredientTags": [
      "squalane",
      "shea-butter",
      "mineral-pigments"
    ],
    "descriptionFa": "بالم لب اوردینری حاوی اسکوالان و آمینو اسید\n\nیک بالم چند منظوره است که برای آبرسانی به لب، آرنج و کوتیکول ها طراحی شده است. این محصول با ترکیبی منحصربفرد از اسیدهای آمینه و ماده اسکوالن فرموله شده است. بنابراین یک بالم لب اوردینری فوق العاده مرطوب کننده و مغذی است. بطوریکه آبرسانی فوری و طولانی مدت ایجاد کرده و به حفظ و نگهداری رطوبت کمک می کند. در عین حال پوست نرم تری را ارائه می دهد\n\n- بالم آبرسان چند منظوره با فرمول غنی و مغذی\n\n- آبرسانی فوری و طولانی مدت و تقویت سد پوستی\n\n- نرم و مرطوب کننده فوق العاده قوی پوست\n\n- طراحی شده برای تغذیه و افزایش رطوبت و لطافت لب ها\n\n- قابل استفاده برای نرم و صاف کردن نواحی آرنج و کوتیکول ها\n\n- حاوی ترکیبی منحصربفرد از اسیدهای آمینه و ماده اسکوالن\n\n- موثر در حفظ و نگهداری رطوبت و مقابله با خشکی\n\n- دارای طراحی خاص با استفاده اسان\n\n- فاقد الکل، سیلیکون و گلوتن\n\n- فرمول وگان و بدون تست حیوانی\n\n- مناسب برای انواع پوست",
    "descriptionEn": "The Ordinary Squalane + Amino Acids Lip Balm by The Ordinary.",
    "price": 2501000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1504/52fe0e2b5c6a061d5641bfe2a14e6654.png",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1505/104c7a400719d93796684879637302a4.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۱۵ میلی‌لیتر",
        "labelEn": "15 ml",
        "price": 2501000
      }
    ],
    "variants": [
      {
        "id": "var-pori-972",
        "name": "حجم ۱۵ میلی‌لیتر",
        "nameEn": "15 ml",
        "price": 2501000,
        "stockCount": 3,
        "sku": "IN1759985399"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "روی لب‌ها، کوتیکول ناخن یا نواحی خشک مثل آرنج هر زمان نیاز بود بمالید.",
      "night": "روی لب‌ها، کوتیکول ناخن یا نواحی خشک مثل آرنج هر زمان نیاز بود بمالید."
    },
    "badges": [
      "اسکوالان + آمینواسید",
      "وگان و فاقد الکل",
      "چندمنظوره لب و کوتیکول"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کانادا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لب‌های بسیار خشک و دهیدراته، کوتیکول و نواحی زبر پوست.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-784",
    "nameFa": "برق لب حجم‌دهنده بوستر شاین شیگلم",
    "nameEn": "SHEGLAM Booster Shine Plumping Lip Gloss",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: گلاس حجم‌دهنده",
    "howToUse": "انتهای قلم را فشار دهید تا مقدار کمی خارج شود و روی لب‌ها پخش کنید.",
    "ingredientTags": [
      "vitamin-e",
      "jojoba-oils",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "برق لب حجم دهنده و بوستر شاین شیگلم\n\nبرای حجیم شدن فشار دهید! با کلیک یک دکمه، درخشندگی بالا و حجم نهایی را به آرایش لب بعدی خود تزریق کنید. این برق لب حجیم کننده، بلیط شما برای داشتن لبی با رنگدانه‌های غنی و تمام جذابیت یک لب آبدار است. وقتی هوس لبی براق با ظاهری جذاب‌تر را دارید، این لیپ را امتحان کنید.\n\nاین برق لب که برای ارائه درخششی بی‌نظیر و ظاهری طبیعی و پرتر طراحی شده است، به لب‌های شما درخششی مقاومت‌ناپذیر و کمی حس سوزش می‌دهد. رنگ زیبا، رنگی اغواکننده به لب‌ها اضافه می‌کند و در عین حال حجم و آبرسانی را افزایش می‌دهد. این برق لب که با ترکیبات دوستدار پوست غنی شده است، لب‌ها را بدون ایجاد چسبندگی، صاف و نرم می‌کند. این برق لب برای استفاده روزمره، مهمانی‌ها، تعطیلات یا صرفاً برای داشتن احساسی خوب، ایده‌آل است و برای جذابیت فوری و درخشش شدید ایده‌آل است.\n\n- ظاهری براق برای جلوه‌ای شیشه‌ای و درخشان.\n\n- قدرت حجم دهندگی\n\n- به آرامی حجم لب را با حس سوزشی طراوت‌بخش افزایش می‌دهد.\n\n- فرمول مرطوب‌کننده لب‌ها را مرطوب می‌کند و در عین حال ظاهر خطوط ریز را کاهش می‌دهد.\n\n- بافت غیرچسبنده\n\n- استفاده روان برای راحتی و پوشش در تمام طول روز.\n\n- ایده‌آل برای، محل کار، قرار ملاقات یا تعطیلات.\n\n- لایه لایه یا به تنهایی استفاده شود •برای حجم و درخشندگی بیشتر، به تنهایی یا روی رژ لب استفاده شود.",
    "descriptionEn": "SHEGLAM Booster Shine Plumping Lip Gloss by SHEGLAM.",
    "price": 1414000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1270/22b5572949e88d7318e8e3b1cdb7b576.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1271/4db792d1762083680e984ca0d5472ec0.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز استاندارد",
        "labelEn": "Standard",
        "price": 1414000
      }
    ],
    "variants": [
      {
        "id": "var-pori-860",
        "name": "سایز استاندارد",
        "nameEn": "Standard",
        "price": 1414000,
        "stockCount": 3,
        "sku": "IN1753079266"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "انتهای قلم را فشار دهید تا مقدار کمی خارج شود و روی لب‌ها پخش کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "براق و حجم‌دهنده",
      "پخش آسان کلیکی",
      "بدون چسبندگی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد حجم طبیعی و درخشش شیشه‌ای روی لب‌ها.",
    "unsuitableFor": "حس گزگز خفیف موقت طبیعی است؛ روی زخم باز مصرف نشود."
  },
  {
    "id": "product-pori-752",
    "nameFa": "سایه ۳ طبقه هلو کیتی شوگر کوکی شیگلم",
    "nameEn": "SHEGLAM Hello Kitty Darling Dear Shadow Stack - Sugar Cookie",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: سایه ۳ طبقه مسافرتی",
    "howToUse": "رنگ روشن‌تر را به عنوان بیس، رنگ میانی را روی پلک و رنگ شاین را در گوشه داخلی چشم بزنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "سایه 3 طبقه کوکی هلو کیتی شیگلم\n\nسایه 3 طبقه کوکی هلو کیتی شیگلم از کالکشن کیتی رنگ Sugar Cookie یکی از محصولات جذاب این برند است که با طیف رنگی شیک و فانتزی، گزینه‌ای فوق‌العاده برای آرایش روزانه و مجلسی محسوب می‌شود.\n\nبه کمک سایه پودری می توانید رنگ های مختلف را باهم ترکیب و رنگ های جدید به وجود آورید و میکاپی متنوع و زیبا خلق کنید.\n\n- دارای بافت فوق العاده لطیف و سبک\n\n- حاوی رنگدانه های بسیار قوی و ماندگاری عالی\n\n- بدون ریزش یا حس سنگینی روی پلک\n\n- دارای طراحی پازلی\n\n- ایده آل برای آرایش لایت یا مجلسی\n\n- فاقد الکل، عطر، مواد معدنی، گلوتن، پارابن\n\n- وگان و بدون تست حیوانی\n\n- مناسب برای انواع پوست",
    "descriptionEn": "SHEGLAM Hello Kitty Darling Dear Shadow Stack - Sugar Cookie by SHEGLAM.",
    "price": 1785000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1207/925860b92533a6b492c5d5aba5abc741.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1209/9f3ac46d705828487db0a5cae45f36f6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1208/1ede9e173f6994debbcdb5fa35411755.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۴.۳ گرم",
        "labelEn": "4.3 g",
        "price": 1785000
      }
    ],
    "variants": [
      {
        "id": "var-pori-825",
        "name": "وزن ۴.۳ گرم",
        "nameEn": "4.3 g",
        "price": 1785000,
        "stockCount": 3,
        "sku": "IN1751469948"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "رنگ روشن‌تر را به عنوان بیس، رنگ میانی را روی پلک و رنگ شاین را در گوشه داخلی چشم بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "کالکشن Hello Kitty",
      "وگان و فاقد عطر",
      "بدون ریزش"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "سایه چشم جمع‌وجور و کاربردی برای آرایش ملایم روزانه یا مهمانی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-741",
    "nameFa": "پرایمر ژله‌ای آبرسان هلو کیتی جلی آمور شیگلم",
    "nameEn": "SHEGLAM Hello Kitty Jelly Amor Hydrating Primer",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "زیرساز آرایش: پرایمر آبرسان",
    "howToUse": "پیش از کرم‌پودر مقدار کمی روی پوست تمیز صورت ماساژ دهید تا جذب و آماده میکاپ شود.",
    "ingredientTags": [
      "vitamin-e",
      "hyaluronic-acid",
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "پرایمر آبرسان شیگلم سری هلو کیتی\n\nبا پرایمر آبرسان ژله‌ای آمور ما، هرروز روز جذاب باشید! این پرایمر ژلی، پوست شما را مرطوب می‌کند و به آرایش شما کمک می‌کند تا به طور یکپارچه با پوست ترکیب شود و حال و هوای گربه‌ای بیشتری به آن ببخشد.\n\nپرایمر آبرسان شیگلم به سرعت جذب پوست می‌شود و پوست را صاف و ابریشمی می‌کند. این بهترین محصول برای پایه آرایش با هدف ثابت نگه داشتن آرایش برای مدت طولانی است.\n\n- ایجاد زیرساز یکدست برای میکاپ\n\n- افزایش ماندگاری آرایش\n\n- فرمولاسیون آبرسان و مغذی\n\n- بافت ژله‌ای سبک زودجذب\n\n- حاوی سدیم هیالورونات\n\n- حاوی ذرات تزیینی جذب شونده قلب و پاپیون\n\n- دارای خاصیت آنتی اکسیدان\n\n- بسته‌بندی جذاب شخصیت هلو کیتی\n\n- فاقد پارابن، الکل، سیلیکون و مواد شیمایی مضر",
    "descriptionEn": "SHEGLAM Hello Kitty Jelly Amor Hydrating Primer by SHEGLAM.",
    "price": 1571000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1184/2d6f496750a46335a8d2a7a51213ca93.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1186/429f12679a28845ca8b7ff09f09476a7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1185/d34a38d5feed35d24fd28efa67c44674.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۳۰ گرم",
        "labelEn": "30 g",
        "price": 1571000
      }
    ],
    "variants": [
      {
        "id": "var-pori-814",
        "name": "وزن ۳۰ گرم",
        "nameEn": "30 g",
        "price": 1571000,
        "stockCount": 3,
        "sku": "IN1750568200"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "پیش از کرم‌پودر مقدار کمی روی پوست تمیز صورت ماساژ دهید تا جذب و آماده میکاپ شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "سدیم هیالورونات",
      "فاقد الکل و سیلیکون",
      "کالکشن Hello Kitty"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آماده‌سازی، آبرسانی و افزایش ماندگاری کرم‌پودر بدون ماسیدگی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-647",
    "nameFa": "پالت سایه چشم ۹ رنگ لاتس تو لاوا شیگلم",
    "nameEn": "SHEGLAM Lots to Lava 9-Shade Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت سایه ۹ رنگ",
    "howToUse": "با براش نرم سایه را روی پلک پخش و ترکیب کنید.",
    "ingredientTags": [
      "mineral-pigments"
    ],
    "descriptionFa": "پالت سایه چشم شیگلم\n\nبا نه رنگ بسیار جذاب و کاربردی که استفاده از آن‌ها هم به صورت تک رنگ و هم ترکیبی بسیار زیبا و چشم‌گیر است. مهم‌ترین ویژگی این سایه چشم این است که به دلیل ترکیبات باکیفیتی که در ساخت آن به کار رفته، دچار ریزش نمی‌شود.\n\nیکی از دلایل محبوبیت این پالت زیبا، سازگاری آن با پدست‌های مختلف است‌. این پالت سایه، مجموعه‌ای از رنگ‌های زیبا و جذاب را در اختیار شما قرار می‌دهد که به شما امکان می‌دهد آرایش‌‌ متنوع و زیبایی داشته باشید.\n\n- ماندگاری عالی\n\n- پیگمنت دهی بالا\n\n- 9 رنگ مات و شاین\n\n- ترکیب پذیری عالی\n\n- عدم ریزش زیر چشم\n\n- عدم چسبندگی و ماسیدگی\n\n- رنگدانه های قوی",
    "descriptionEn": "SHEGLAM Lots to Lava 9-Shade Palette by SHEGLAM.",
    "price": 2304000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/991/80eb61e3d4baf1df4db643b37d655be9.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/993/374f1db052bd15a4198f618c56eee320.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/992/a323f9d684f543044464321ad4573410.jpeg"
    ],
    "sizes": [
      {
        "label": "۹ رنگ مات و شاین",
        "labelEn": "9 Shades",
        "price": 2304000
      }
    ],
    "variants": [
      {
        "id": "var-pori-717",
        "name": "۹ رنگ مات و شاین",
        "nameEn": "9 Shades",
        "price": 2304000,
        "stockCount": 3,
        "sku": "IN1746140832"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با براش نرم سایه را روی پلک پخش و ترکیب کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۹ رنگ مات و شاین",
      "پیگمنت قوی",
      "بدون ریزش"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "آرایش‌های گرم و جذاب چشم با ماندگاری بالا.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-348",
    "nameFa": "بالم لب مغذی و مرطوب‌کننده میوه‌ای لابلو",
    "nameEn": "Labello Caring Fruit Shine Lip Balm",
    "brand": "Labello",
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
      "soothing"
    ],
    "routines": [
      "morning",
      "night",
      "minimal"
    ],
    "routineStep": "مراقبت روزانه لب: بالم لب آبرسان",
    "howToUse": "در طول روز هر زمان لب‌ها احساس خشکی داشتند روی لب بکشید.",
    "ingredientTags": [
      "shea-butter",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "بالم لب شاتوت لابلو (لبلو)\n\nبالم لب شاتوت لبلو از تبخیر رطوبت لب ها جلوگیری می نماید. این بالم لب در ساختار خود از روغن کرچک استفاده کرده است که باکتری های مضر را از بین برده و همچون یک لایه مقاوم از لب ها در مقابل عواملی همانند تابش خورشیدو انواع قارچ ها و … محافظت می کند. تاثیر گذاری عمقی بالم لب شاتوت لبلو باعث شده است که طرفداران زیادی را به سمت خود جلب نماید.\n\n- نرم کننده لب\n\n- مغذی برای پوست لب\n\n- مرطوب کننده و آبرسان قوی لب\n\n- ایجاد رطوبت ماندگار بر روی لب ها\n\n- جلوگیری از خشکی و ترک خوردگی لب ها\n\n- مناسب برای استفاده روزمره\n\n- رفع پوسته پوسته و ترک لب ها",
    "descriptionEn": "Labello Caring Fruit Shine Lip Balm by Labello.",
    "price": 642000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/448/b8b18e28c757517864ca36d169f9497d.jpeg"
    ],
    "sizes": [
      {
        "label": "Black berry",
        "labelEn": "Black berry",
        "price": 642000
      },
      {
        "label": "Cherry",
        "labelEn": "Cherry",
        "price": 642000
      },
      {
        "label": "Watermelon",
        "labelEn": "Watermelon",
        "price": 642000
      }
    ],
    "variants": [
      {
        "id": "var-pori-384",
        "name": "Black berry",
        "nameEn": "Black berry",
        "price": 642000,
        "stockCount": 1,
        "sku": "IN1725402637"
      },
      {
        "id": "var-pori-385",
        "name": "Cherry",
        "nameEn": "Cherry",
        "price": 642000,
        "stockCount": 2,
        "sku": "IN1725402740"
      },
      {
        "id": "var-pori-387",
        "name": "Watermelon",
        "nameEn": "Watermelon",
        "price": 642000,
        "stockCount": 3,
        "sku": "IN1725402742"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کره شی و کره‌های گیاهی مغذی",
        "nameEn": "Shea & Botanical Butters",
        "description": "تغذیه‌کننده غنی برای ایجاد بافت کرمی، نرم‌کنندگی و جلوگیری از خشکی و ترک پوست و لب."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "در طول روز هر زمان لب‌ها احساس خشکی داشتند روی لب بکشید.",
      "night": "در طول روز هر زمان لب‌ها احساس خشکی داشتند روی لب بکشید."
    },
    "badges": [
      "روغن‌های طبیعی",
      "رطوبت ۲۴ ساعته",
      "ساخت آلمان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 6,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آلمان",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "جلوگیری از خشکی و پوسته شدن لب‌ها همراه با رنگ و رایحه لطیف.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-45",
    "nameFa": "ریمل حجم‌دهنده بیگ بولد ایزادورا بنفش",
    "nameEn": "IsaDora Big Bold Mascara",
    "brand": "Isadora",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "sensitive",
      "oily",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: ریمل حجم‌دهنده",
    "howToUse": "با برس بزرگ فیبری از ریشه مژه‌ها به سمت بالا بکشید.",
    "ingredientTags": [
      "mineral-pigments"
    ],
    "descriptionFa": "حجم دهی فوق‌العاده زیاد - مقاوم در برابر آب - دارای بافت کرمی، حاوی رنگدانه‌های سیاه کربنی - خشک شدن سریع و امکان استفاده‌ی چندلایه - دارای برس بزرگ از جنس فیبر با شانه‌های کوتاه و بلند - ضد آب - مناسب برای چشم‌های حساس - قابل استفاده برای مصرف‌کنندگان لنز - بدون رایحه",
    "descriptionEn": "IsaDora Big Bold Mascara by Isadora.",
    "price": 2044000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4191/d8e113bb16e24a617dd29fda06289512.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4192/5628c5695a10757dd0368616cd275f50.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۱۴ میلی‌لیتر",
        "labelEn": "14 ml",
        "price": 2044000
      }
    ],
    "variants": [
      {
        "id": "var-pori-54",
        "name": "حجم ۱۴ میلی‌لیتر",
        "nameEn": "14 ml",
        "price": 2044000,
        "stockCount": 3,
        "sku": "IN1711023746"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با برس بزرگ فیبری از ریشه مژه‌ها به سمت بالا بکشید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "مناسب چشم حساس و لنز",
      "فاقد عطر",
      "مقاوم در برابر آب"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "سوئد",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد حجم زیاد و رنگ سیاه کربنی روی مژه‌ها بدون حساسیت.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-16",
    "nameFa": "پالت کانتور و هایلایتر کرمی ۶ رنگ استریو فیس شیگلم",
    "nameEn": "SHEGLAM Stereo Face 6-Color Cream Contour Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "آرایش صورت: پالت کانتورینگ ۶ رنگ",
    "howToUse": "از رنگ‌های روشن برای زیر چشم و تیغه بینی و از رنگ‌های تیره برای زیر گونه و خط فک استفاده کرده و با اسفنج بلند کنید.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "ماندگاری بالا\n\nدارای شش رنگ هایلایتر و کانتور\n\nپوشش بالا\n\nبافت کرمی\n\nنما نهایی مات\n\nمناسب برای انواع پوست\n\nجلوه طبیعی\n\nبدون ایجاد سنگینی\n\nدارای یک رنگ رژگونه ملایم صورتی\n\nمراحل کانتور صورت\n\nابتدا کرم مرطوب کننده بزنید.\n\nبا کرم پودری ( که به رنگ پوستتان نزدیک است پوستتان را پوشش دهید.\n\nروی بینی، زیر چشم، چانه و پیشانی را با کرم پودری که از پوستتان دو درجه روشن تر است هایلایت کنید.\n\nزیر گونه ها و بالای پیشانی را کمی تیره تر کنید.\n\nدر مرحله آخر قسمت های مشخص شده را محو کنید.\n\n————————-",
    "descriptionEn": "SHEGLAM Stereo Face 6-Color Cream Contour Palette by SHEGLAM.",
    "price": 2359000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/51/bd73d098110c5224859830e0a18e9f2b.jpg"
    ],
    "sizes": [
      {
        "label": "FRENCH GIRL",
        "labelEn": "FRENCH GIRL",
        "price": 2359000
      }
    ],
    "variants": [
      {
        "id": "var-pori-24",
        "name": "FRENCH GIRL",
        "nameEn": "FRENCH GIRL",
        "price": 2359000,
        "stockCount": 3,
        "sku": "IN1710993242"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "از رنگ‌های روشن برای زیر چشم و تیغه بینی و از رنگ‌های تیره برای زیر گونه و خط فک استفاده کرده و با اسفنج بلند کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۶ رنگ کانتور و رژگونه",
      "نمای مات طبیعی",
      "بافت کرمی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "زاویه‌سازی حرفه‌ای چهره با بافت کرمی و نمای طبیعی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1589",
    "nameFa": "رژگونه استیکی شیشه‌ای گلس گلو شیگلم",
    "nameEn": "SHEGLAM Glass Glow Blush Stick",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: رژگونه استیکی براق",
    "howToUse": "مستقیم روی گونه بکشید و با انگشت یا براش به سمت بالا محو کنید.",
    "ingredientTags": [
      "vitamin-e",
      "squalane",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "رژ گونه استیکی گلس گلو شیگلم\n\nبه لطف این رژگونه استیکی حاوی اسکوالان، ویتامین E و جوجوبا، پوست خود را تغذیه کنید و در عین حال رنگی درخشان به آن ببخشید. با یک بار استفاده از این رژگونه، با اثر مرطوب‌کننده و ماندگار خود، ظاهری طبیعی به چهره خود ببخشید. این رژگونه جیبی با قابلیت ترکیب فوق‌العاده و مناسب برای سفر، انتخابی ایده‌آل برای شماست.\n\n- درخشش طبیعی شیشه‌ای : ایجاد جلوه‌ی مرطوب و پرطراوت روی گونه\n\n- بافت ژل-بالم سبک : بسیار نرم، راحت برای ترکیب و بدون احساس سنگینی\n\n- فرمول قابل لایه‌بندی : از لطیف تا چشم‌گیر، با کنترل کامل میزان رنگ\n\n- نمای براق بدون چربی : درخشش بدون حس چسبنده یا روغنی\n\n- قابل استفاده روی پوست برهنه یا فاندیشن ترکیب‌پذیر با انواع آرایش",
    "descriptionEn": "SHEGLAM Glass Glow Blush Stick by SHEGLAM.",
    "price": 1836000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4786/0eec04c91f4fac15e6718c386981ce01.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4790/3f6ac458396a4f5b6444c8bcf848edc3.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4791/33fb798601a669e6accc4b951ace5728.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4787/9fde35f1dd715b7ad3f6a45a51121b37.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4789/01762fc78341a68cd9e13358ab4db9fc.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4788/b599e1c2506fb31b0551bc33a468af1d.jpeg"
    ],
    "sizes": [
      {
        "label": "Cherry express",
        "labelEn": "Cherry express",
        "price": 1836000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1752",
        "name": "Cherry express",
        "nameEn": "Cherry express",
        "price": 1836000,
        "stockCount": 2,
        "sku": "IN1794277834"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "اسکوالان گیاهی",
        "nameEn": "Plant-Derived Squalane",
        "description": "امولینت سبک و غیرکومدوژنیک که رطوبت پوست و لب را بدون ایجاد حس سنگینی حفظ می‌کند."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "مستقیم روی گونه بکشید و با انگشت یا براش به سمت بالا محو کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "اسکوالان + ویتامین E + جوجوبا",
      "درخشش شیشه‌ای",
      "بافت ژل-بالم"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد درخشش مرطوب و شاداب روی گونه‌ها بدون چربی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1327",
    "nameFa": "برس حرارتی سرامیکی صاف‌کننده مو انزو مدل EN-4002",
    "nameEn": "ENZO Professional Hair Straightening Brush EN-4002",
    "brand": "ENZO",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: برس حرارتی صاف‌کننده",
    "howToUse": "روی موهای کاملاً خشک دمای مناسب جنس مو را انتخاب کرده و لایه‌لایه به آرامی شانه کنید.",
    "ingredientTags": [
      "mineral-pigments",
      "ceramic-ionic"
    ],
    "descriptionFa": "برس حرارتی حرفه‌ای انزو پروفیشینال ENZO مدل EN-4002\n\nاگر به دنبال یک برس حرارتی حرفه‌ای برای صاف کردن، حالت‌دهی و کاهش وز مو هستید، برس حرارتی انزو پروفیشینال مدل EN-4002 انتخابی ایده‌آل برای استفاده خانگی و سالن‌های آرایش است. این دستگاه با بهره‌گیری از فناوری گرمایش سریع، پوشش سرامیکی و تولید یون منفی، موها را بدون ایجاد آسیب ناشی از حرارت بیش از حد، صاف، براق و خوش‌حالت می‌کند.\n\nطراحی ارگونومیک و وزن مناسب این برس باعث می‌شود در استفاده طولانی‌مدت دست خسته نشود و به‌راحتی بتوان انواع موهای کوتاه، بلند، ضخیم، نازک، فر و موج‌دار را حالت داد. نمایشگر دیجیتال LED و قابلیت تنظیم دما نیز امکان انتخاب حرارت مناسب برای هر نوع مو را فراهم می‌کند.\n\n- گرم شدن سریع در مدت حدود ۱۰ تا ۳۰ ثانیه\n\n- دندانه‌های سرامیکی با توزیع یکنواخت حرارت\n\n- قابلیت تنظیم دما متناسب با انواع مو\n\n- نمایشگر دیجیتال LED\n\n- فناوری تولید یون منفی برای کاهش وز و افزایش درخشندگی مو\n\n- مناسب برای صاف کردن، حجم‌دهی و حالت‌دهی مو\n\n- کابل چرخان ۳۶۰ درجه برای استفاده آسان\n\n- طراحی ارگونومیک و سبک\n\n- خاموش شدن خودکار برای افزایش ایمنی\n\n- مناسب برای استفاده شخصی و حرفه‌ای\n\nمزایای استفاده\n\nبرس حرارتی ENZO مدل EN-4002 با انتقال یکنواخت حرارت، از سوختگی و آسیب به تارهای مو جلوگیری کرده و در مدت کوتاهی موهایی صاف، نرم و براق ایجاد می‌کند. وجود فناوری یون منفی باعث کاهش الکتریسیته ساکن، جلوگیری از وز شدن مو و حفظ لطافت طبیعی آن می‌شود. همچنین طراحی ایمن و خوش‌دست این دستگاه، استفاده روزانه را بسیار آسان کرده است.\n\nمشخصات فنی\n\nمدل: EN-4002\n\nنوع دستگاه: برس حرارتی صاف‌کننده مو\n\nجنس صفحات و دندانه‌ها: سرامیکی\n\nحداکثر دما: تا ۲۳۰ درجه سانتی‌گراد (بسته به نسخه محصول)\n\nولتاژ: 220 تا 240 ولت\n\nنمایشگر: LED دیجیتال\n\nقابلیت تنظیم دما: دارد\n\nسیستم یون‌ساز: دارد\n\nکابل: چرخشی ۳۶۰ درجه\n\nمناسب برای: انواع مو",
    "descriptionEn": "ENZO Professional Hair Straightening Brush EN-4002 by ENZO.",
    "price": 8659000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3195/1a42e5fa6dad4e8ca5025f8cdb1f299c.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3192/1acf88508ef429d14e19f82155b2854b.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3193/1ba752b0c26faeba3106e424b8105622.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3194/95e001c38127c3521cbec9209c37983d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3196/f03255e92e8e9604b7521345706d2de0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3197/8663baaefa06d59abbed84a1dabe38f7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3198/84a2516327d5a7e86fc610a3082a965e.jpeg"
    ],
    "sizes": [
      {
        "label": "طلایی",
        "labelEn": "طلایی",
        "price": 8659000
      },
      {
        "label": "سرخ",
        "labelEn": "سرخ",
        "price": 8659000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1456",
        "name": "طلایی",
        "nameEn": "طلایی",
        "price": 8659000,
        "stockCount": 2,
        "sku": "IN1785282142"
      },
      {
        "id": "var-pori-1457",
        "name": "سرخ",
        "nameEn": "سرخ",
        "price": 8659000,
        "stockCount": 2,
        "sku": "IN1785282143"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      },
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "روی موهای کاملاً خشک دمای مناسب جنس مو را انتخاب کرده و لایه‌لایه به آرامی شانه کنید.",
      "night": "روی موهای کاملاً خشک دمای مناسب جنس مو را انتخاب کرده و لایه‌لایه به آرامی شانه کنید."
    },
    "badges": [
      "نمایشگر دیجیتال LED",
      "گرمایش ۱۰-۳۰ ثانیه",
      "تولید یون منفی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 4,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انزو پروفشنال",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "صاف‌کردن سریع و کاهش وز انواع مو در منزل و سالن.",
    "unsuitableFor": "روی موی خیس استفاده نشود و پیش از حرارت از اسپری محافظ حرارت استفاده کنید."
  },
  {
    "id": "product-pori-1169",
    "nameFa": "رژ لب مایع براق ماندگار سوپر استی وینیل اینک میبلین مدل Witty",
    "nameEn": "Maybelline Super Stay Vinyl Ink Liquid Lipcolor - 40 Witty",
    "brand": "Maybelline",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: رژ مایع براق ۱۶ ساعته",
    "howToUse": "پیش از مصرف ۵ ثانیه بطری را تکان دهید، روی لب تمیز و خشک بزنید و چند لحظه صبر کنید تا فیکس شود.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ لب مایع براق میبلین سوپر استی Super Stay Vinyl Ink WITTY\n\nاین رژ از محصولات جذاب و برتر برند معتبر میبلین در دنیای آرایش است. این رژ لب با ویژگی‌ها و فرمولاسیون خاص خود، توانسته است تا به توجه زیادی از طرفداران آرایش و زیبایی جلب کند.\n\nرنگ Witty با کد 40، یک رنگ هوشمندانه و خلاقانه است که به لب‌ها شادابی و جلوه‌ی خوش‌پوشانه‌ای می‌بخشد. این رنگ با طیف وسیعی از پوست‌ها سازگاری دارد و به طرز ماندگاری برجسته‌ای به آرایش شما زنده‌ای و جذابیت می‌بخشد.\n\nیکی از ویژگی‌های مهم این رژ لب، ماندگاری بسیار بالاست. فرمولاسیون Super Stay Vinyl Ink باعث می‌شود تا رنگ روی لب‌ها به طور طولانی‌مدت حفظ شود و شما نیاز به تجدید رنگ را به حداقل برسانید. حتی در مقابل فعالیت‌های روزانه مانند خوردن و نوشیدن، رژ لب همچنان ثابت و جذاب روی لب‌ها باقی می‌ماند.\n\nبرای استفاده بهتر از این رژ لب، می‌توانید لب‌ها را از چربی و آلودگی پاک کرده و سپس با دقت از اپلیکاتور محصول استفاده کنید. این اپلیکاتور دقیق به شما امکان می‌دهد تا رنگ را به شکل یکنواخت و دقیق بر روی لب‌ها بگذارید.\n\nبا خرید رژ لب مایع میبلین Super Stay Vinyl Ink با کد رنگ 40 Witty، می‌توانید زیبایی لب‌های خود را با رنگی خلاقانه و زنده تزئین کرده و از آرایشی جذاب و ماندگار لذت ببرید.\n\nماندگاری بالا: رنگ تا ساعت‌ها بدون نیاز به تجدید باقی می‌ماند.\n\nبراقیت و جلوه وینیل: لب‌ها حجیم‌تر و جذاب‌تر دیده می‌شوند.\n\nرنگ‌دهی قوی: حتی رنگ‌های روشن پوشش‌دهی عالی دارند.\n\nآسانی در استفاده: اپلیکاتور دقیق و انعطاف‌پذیر برای پخش یکنواخت رنگ.\n\nاحساس راحتی روی لب: نه سنگین است و نه لب‌ها را خشک می‌کند.\n\nتنوع رنگی بالا: انتخاب مناسب برای هر نوع پوست و سبک آرایش.",
    "descriptionEn": "Maybelline Super Stay Vinyl Ink Liquid Lipcolor - 40 Witty by Maybelline.",
    "price": 2558000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2326/8832e3bf8d8b0d5e3e69a8f4841fad4b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2325/f80457ea361872785763c2feae309400.jpeg"
    ],
    "sizes": [
      {
        "label": "شماره ۴۰ Witty",
        "labelEn": "40 Witty - 4.2 ml",
        "price": 2558000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1292",
        "name": "شماره ۴۰ Witty",
        "nameEn": "40 Witty - 4.2 ml",
        "price": 2558000,
        "stockCount": 2,
        "sku": "IN1779675161"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "پیش از مصرف ۵ ثانیه بطری را تکان دهید، روی لب تمیز و خشک بزنید و چند لحظه صبر کنید تا فیکس شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "براق و ضدانتقال",
      "ماندگاری ۱۶ ساعته",
      "رنگ Witty"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا / فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "افرادی که رژ لب براق با ماندگاری بالا و بدون پخش‌شدن می‌خواهند.",
    "unsuitableFor": "با پاک‌کننده دوفاز یا روغنی پاک شود."
  },
  {
    "id": "product-pori-1151",
    "nameFa": "رژگونه مایع آمپولی مرطوب‌کننده هاوس آف هور",
    "nameEn": "House of Hur Moist Ampoule Blusher",
    "brand": "House of Hur",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: رژگونه مایع آبرسان",
    "howToUse": "یک قطره روی گونه قرار داده و با نوک انگشت یا اسفنج به‌آرامی ضربه‌ای پخش کنید.",
    "ingredientTags": [
      "hyaluronic-acid",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژگونه آمپولی هاوس آف هور (House of Hur Moist Ampoule Blusher)\n\nرژگونه آمپولی هاوس آف هور، یک رژگونه مایع با بافت سبک و آبرسان و رنگ های منحصر به فرد است که به‌راحتی روی پوست پخش می‌شود و جلوه‌ای طبیعی، شاداب و درخشان به گونه‌ها می‌بخشد. این محصول با ترکیبات رطوبت‌رسان، به حفظ لطافت پوست کمک می‌کند و بدون ایجاد حس سنگینی، رنگی یکدست و قابل‌لایه‌سازی ایجاد می‌کند.\n\nویژگی‌ها:\n\n- بافت مایع، سبک و زودپخش\n\n- ایجاد جلوه طبیعی و شیشه‌ای روی گونه‌ها\n\n- قابلیت تنظیم شدت رنگ با لایه‌سازی\n\n- کمک به حفظ رطوبت و لطافت پوست\n\n- مناسب برای آرایش روزانه و انواع سبک‌های میکاپ\n\n- قابل استفاده برای انواع پوست\n\nروش استفاده: مقدار کمی از رژگونه را روی گونه‌ها قرار دهید و با انگشت، براش یا اسفنج به‌آرامی پخش کنید. برای رنگ قوی‌تر، مقدار محصول را به‌تدریج افزایش دهید.",
    "descriptionEn": "House of Hur Moist Ampoule Blusher by House of Hur.",
    "price": 2930000,
    "originalPrice": 3098000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4997/e46b4a0fea1934deef7e7782f80b1f23.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4991/dd824b40b4a6fcca7ccca89a8d5a2b6c.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4998/e6ae3a42ee69bc1f2a6d61c2e4699de8.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4993/692f373a514bcf224d8b3b91965fe5b2.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4992/f1330ddec39170f14535e9409716ab48.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4995/f59840ac1ecd1469b26b1507779966d8.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4994/7cf10c0c6f4f91e6e7680566f0de8dd9.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4996/6b44cc0aaac84c421bd7affb627e823b.webp"
    ],
    "sizes": [
      {
        "label": "05",
        "labelEn": "05",
        "price": 2930000,
        "originalPrice": 3098000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1272",
        "name": "05",
        "nameEn": "05",
        "price": 2930000,
        "originalPrice": 3098000,
        "stockCount": 2,
        "sku": "IN1778618661"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "یک قطره روی گونه قرار داده و با نوک انگشت یا اسفنج به‌آرامی ضربه‌ای پخش کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "بافت آمپولی آبرسان",
      "جلوه شیشه‌ای طبیعی",
      "ساخت کره"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "میکاپ کره‌ای لطیف، باطراوت و بدون سنگینی برای انواع پوست.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1119",
    "nameFa": "پالت سایه چشم ۱۵ رنگ ولوت رز رولوشن",
    "nameEn": "Makeup Revolution Re-Loaded Palette Velvet Rose",
    "brand": "Makeup Revolution",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت ۱۵ رنگ ولوت رز",
    "howToUse": "رنگ‌های بژ و قهوه‌ای را برای سایه روزانه و طلایی، آلبالویی و مسی را برای آرایش مجلسی ترکیب کنید.",
    "ingredientTags": [
      "biotin",
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "سایه چشم پودری ولوت رز رولوشن\n\nپالت سایه 15 رنگ رولوشن Revolution مدل ولوت رز Velvet Rose یکی از جدیدترین اعضای خانواده پالت سایه رولوشن است، مجموعه‌ای که از پرفروش‌ترین محصولات رولوشن به شمار می‌روند. پالت سایه رولوشن ولوت رز ترکیبی از پانزده رنگ سایه صاف و بسیار پررنگ است. در میان رنگ‌های متنوع این پالت سایه رولوشن اصل می‌توان رنگ‌های بژ، قهوه‌ای، طلایی و آلبالویی، مسی و همینطور مشکی را مشاهده کرد.\n\nبه طور کلی رنگ‌های پالت سایه 15 رنگ رولوشن رنگدانه‌های بسیار زیادی داشته و قابلیت ترکیب بالایی دارند. دوام این سایه‌ها بسیار بالا بوده و تا ساعت‌ها می‌توانید آن را روی پلک خود داشته باشید. پالت سایه رولوشن اصل به شما در داشتن سایه‌ای جذاب و زیبا کمک زیادی خواهد کرد و برایتان این امکان را فراهم می‌کند که در هر موقعیتی از این محصول استفاده نمایید. پالت سایه 15 رنگ رولوشن بدون آینه و براش است و درب کاملا شفافی دارد که می‌توانید بدون باز کردن آن، رنگ‌های داخل پالت را ببینید.\n\n- 15 رنگ شاینی و مات\n\n- 9 رنگ مات و 6 رنگ شاینی و درخشان\n\n- پخش آسان و سریع\n\n- ماندگاری بالا\n\n- فاقد تست حیوانی\n\n- فاقد گلوتن\n\n- وگان\n\n- بافت سبک و ابریشمی\n\n- دارای رنگدانه‌های فراوان\n\n- سازگار با انواع پوست\n\n- فاقد آلرژی و حساسیت پوستی\n\n- مناسب برای بانوان",
    "descriptionEn": "Makeup Revolution Re-Loaded Palette Velvet Rose by Makeup Revolution.",
    "price": 3216000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2131/79b598fb521e475e2947d959acee819e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2132/fb92ef4872aed50008ccf65931751a86.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2133/41459d08c11d488a53c121936fc1577b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2130/98adfa539eec6274dd0ec1a6e3cd3d1c.jpeg"
    ],
    "sizes": [
      {
        "label": "۱۵ رنگ مات و شیمر",
        "labelEn": "15 Shades",
        "price": 3216000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1236",
        "name": "۱۵ رنگ مات و شیمر",
        "nameEn": "15 Shades",
        "price": 3216000,
        "stockCount": 2,
        "sku": "IN1777611808"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "رنگ‌های بژ و قهوه‌ای را برای سایه روزانه و طلایی، آلبالویی و مسی را برای آرایش مجلسی ترکیب کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۱۵ رنگ کاربردی",
      "پیگمنت بالا",
      "بسته‌بندی شفاف"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انگلستان",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پالت همه‌کاره چشم با رنگ‌های گرم، نود و طلایی برای روز و شب.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-989",
    "nameFa": "سرم ویال ضدریزش درمانی فیتوسیان آقایان فیتو",
    "nameEn": "Phyto Phytocyane Progressive Anti-Hair Loss Treatment for Men",
    "brand": "Phyto",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "normal",
      "oily",
      "dry",
      "sensitive"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "night"
    ],
    "routineStep": "درمان تخصصی ریزش مو: ویال ضدریزش آقایان",
    "howToUse": "هفته‌ای ۳ بار روی پوست سر تمیز و مرطوب خط‌به‌خط بزنید و با نوک انگشت ماساژ دهید؛ نیاز به آبکشی ندارد.",
    "ingredientTags": [
      "biotin",
      "ginkgo-botanical"
    ],
    "descriptionFa": "سرم ویال ضد ریزش درمانی فیتو سیان مخصوص آقایان تحریک رشد و ضخامت مو\n\nریزش مو، کابوسی که برای بسیاری از آقایان به واقعیت تبدیل شده است. اما نگران نباشید! سرم ویال فیتوسیان فیتو، ناجی موهای شماست. این محصول منحصر به فرد، با ترکیبی جادویی از عصاره گیاهان و ویتامین‌های مغذی، به جنگ ریزش مو می‌رود و تار و پود موهایتان را از نو احیا می‌کند.\n\nاین سرم مو پیشرفته ترمیم کننده موی فیتوسیان مردانه فیتو با ماکا، قارچ و اسیدهای آمینه رشد مو را تحریک می کند. این محصول با فرمول نوآورانه، فولیکول های مو را تغذیه می کند، طول عمر مو را افزایش می دهد و به وضوح تارهای ضخیم تر و پرتری را در محل های آلوپسی و قسمت هایی که موها نازک شده اند رشد می دهد.\n\n- کاهش ریزش موی پیشرونده ناشی از وراثت یا افزایش سن\n\n- تحریک رشد طبیعی مو و افزایش ضخامت موها\n\n- مناسب برای نواحی دچار کم‌پشتی: شقیقه‌ها، فرق سر و تاج سر\n\n- بدون نیاز به آبکشی، بدون چربی یا چسبندگی\n\n- استفاده آسان و غیرمزاحم برای ۸۵٪ کاربران\n\n- حاوی ۹۵٪ ترکیبات با منشأ طبیعی",
    "descriptionEn": "Phyto Phytocyane Progressive Anti-Hair Loss Treatment for Men by Phyto.",
    "price": 10795000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1745/126a4c617ff15429318438f24eac6dcf.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1746/3c1d38e4393c53a0d6f4a3323a412f86.webp"
    ],
    "sizes": [
      {
        "label": "۱۲ ویال ۵ میلی‌لیتر",
        "labelEn": "12 × 5 ml Vials",
        "price": 10795000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1090",
        "name": "۱۲ ویال ۵ میلی‌لیتر",
        "nameEn": "12 × 5 ml Vials",
        "price": 10795000,
        "stockCount": 2,
        "sku": "IN1766770835"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "عصاره جینکو بیلوبا و گیاهان تقویتی",
        "nameEn": "Ginkgo Biloba & Botanical Extracts",
        "description": "افزایش خون‌رسانی مویرگی به فولیکول‌های مو و کمک به افزایش تراکم و رشد مو."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است.",
      "night": "هفته‌ای ۳ بار روی پوست سر تمیز و مرطوب خط‌به‌خط بزنید و با نوک انگشت ماساژ دهید؛ نیاز به آبکشی ندارد."
    },
    "badges": [
      "۸۵٪ اثر ضدریزش",
      "ماکا + آمینواسید",
      "بدون نیاز به آبکشی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آقایان دچار ریزش ارثی، پیشرونده یا نازک‌شدن مو در شقیقه و تاج سر.",
    "unsuitableFor": "فقط برای استعمال خارجی روی پوست سر است."
  },
  {
    "id": "product-pori-988",
    "nameFa": "شامپو ضدشوره پاکسازی عمقی زغال فعال و مرکبات آقایان کلییر",
    "nameEn": "Clear Men Deep Cleanse Anti-Dandruff Charcoal Shampoo",
    "brand": "Clear",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت مو: شامپو ضدشوره زغال فعال",
    "howToUse": "روی مو و کف سر خیس ماساژ دهید تا کف کند، سپس کامل آبکشی کنید.",
    "ingredientTags": [
      "salicylic-dandruff"
    ],
    "descriptionFa": "شامپو ضد شوره کلییر مخصوص آقایان، پاک کننده عمیق با زغال فعال و مرکبات\n\nدر برخی روزها، عوامل استرس‌زای محیط شهری مانند کثیفی، آلودگی و مواد زائد می‌توانند در پوست سر شما گیر بیفتند که ممکن است باعث شوره سر شود. شامپوی ضد شوره زغالی پاک‌کننده عمیق مردانه کلییر، که مخصوص آقایان ساخته شده و با زغال فعال و پوست مرکبات غنی شده است، منافذ را عمیقاً تمیز می‌کند، کثیفی را از بین می‌برد و پوست سر شما را تمیز و تازه نگه می‌دارد. یک نگرانی کمتر در مورد پیشرفت شغلی شما. با شامپوی ضد شوره پاک‌کننده عمیق، کلییر را ارتقا دهید و دو برابر قدرت مبارزه^ در برابر شوره سر و میکروب‌ها را برای داشتن پوست سر تمیز و سالم دریافت کنید. شامپوی پاک‌کننده عمیق مردانه کلییر با فرمول ژل ضد شوره ارتقا یافته Liquifresh فرموله شده است تا شوره سر را از بین ببرد، در برابر آن مقاومت کند و از آن جلوگیری کند. ۱۰۰٪ بدون شوره*. طراوت کامل *بدون پوسته‌های قابل مشاهده و بدون چربی با استفاده منظم ^ عملکرد دوگانه در برابر شوره سر و میکروب‌های ایجاد کننده شوره.\n\n- با خاصیت ضد شوره و ضد خارش کف سر\n\n- تهیه شده از عصاره زغال چوب خالص\n\n- حاوی اسیدهای آمینه، ویتامین B3\n\n- طراوت و شادابی پوست و موی سر\n\n- کنترل چربی کف پوست سر\n\n- مناسب آقایان\n\n- مناسب مصرف روزانه",
    "descriptionEn": "Clear Men Deep Cleanse Anti-Dandruff Charcoal Shampoo by Clear.",
    "price": 1127000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1744/3bec8543d9e8dfb306ce2dde5b1d791c.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰۰ میلی‌لیتر",
        "labelEn": "400 ml",
        "price": 1127000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1089",
        "name": "حجم ۴۰۰ میلی‌لیتر",
        "nameEn": "400 ml",
        "price": 1127000,
        "stockCount": 2,
        "sku": "IN1766726068"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "سالیسیلیک اسید و کمپلکس ضدشوره",
        "nameEn": "Salicylic Acid & Piroctone Olamine",
        "description": "پاکسازی عمیق پوست سر، رفع پوسته‌ریزی و کنترل قارچ‌های عامل شوره بدون التهاب."
      }
    ],
    "usageRoutine": {
      "morning": "روی مو و کف سر خیس ماساژ دهید تا کف کند، سپس کامل آبکشی کنید.",
      "night": "روی مو و کف سر خیس ماساژ دهید تا کف کند، سپس کامل آبکشی کنید."
    },
    "badges": [
      "زغال فعال و مرکبات",
      "پاکسازی ۳ برابری منافذ سر",
      "ضدشوره"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "بین‌المللی (Clear)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست سر چرب آقایان، شوره و تجمع چربی و آلودگی محیطی.",
    "unsuitableFor": "از تماس با چشم پرهیز شود."
  },
  {
    "id": "product-pori-986",
    "nameFa": "تونیک ضدریزش و تقویت‌کننده ریشه رزماری آروماتیکا",
    "nameEn": "AROMATICA Rosemary Root Enhancer Hair Tonic",
    "brand": "AROMATICA",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "oily",
      "combination",
      "sensitive",
      "normal"
    ],
    "concerns": [
      "hair-body",
      "soothing"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت پوست سر: تونیک تقویتی بدون آبکشی",
    "howToUse": "پس از تکان دادن، روی کف سر تمیز اسپری کنید و با سرانگشتان آرام ماساژ دهید تا جذب شود (بدون آبکشی).",
    "ingredientTags": [
      "panthenol",
      "rosemary",
      "biotin"
    ],
    "descriptionFa": "تونیک ضد ریزش مو رزماری آروماتیکا\n\nتقویت‌کننده ریشه رزماری آروماتیکا حاوی حداقل ۹۹.۵٪ مواد طبیعی است و موهایی سالم، قوی، صاف، پرپشت و تغذیه‌شده را از ریشه تا نوک تضمین می‌کند. همچنین حاوی روغن‌های ضروری است که باعث می‌شود موها و پوست سر برای مدت طولانی‌تری شاداب‌تر بمانند و در عین حال تأثیر آرامش‌بخشی بر ذهن دارد. این محصول همچنین برای افرادی که موهای نازکی دارند ایده‌آل است، زیرا درمانی عالی برای تقویت ریشه‌ها و جلوگیری از شکستگی مو است.\n\n- فرموله شده با عصاره رزماری جهت تحریک گردش خون، تقویت فولیکول‌ های مو، کاهش ریزش و افزایش رشد مو\n\n- حاوی و کمپلکس غذای سیاه( عصاره لوبیا سیاه، برنج سیاه، کنجد سیاه، توت، بادمجان و دانه فلفل) برای تقویت و تغذیه ریشه مو\n\nحاوی ویتامین های ضروری ، ویتامین B و بیوتین برای داشتن مو های ضخیم‌ و سالم\n\n- تسکین دهنده و آرم بخش پوست سر های مستعد به التهاب و خارش\n\n- جلوگیری از ریزش مو و کمک به رشد مجدد\n\n- کمک به حفظ تعادل چربی و رطوبت کف سر\n\n- دارای اثرات خنک کننده\n\nآبرسانی عمیق پوست سر خشک\n\n- مناسب برای انواع مو و پوست کف سر",
    "descriptionEn": "AROMATICA Rosemary Root Enhancer Hair Tonic by AROMATICA.",
    "price": 4026000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1740/4518f824f6543983a213069aadda96b0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1741/8d606132ac2f01230f2090d85ce99c03.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۰۰ میلی‌لیتر",
        "labelEn": "100 ml",
        "price": 4026000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1087",
        "name": "حجم ۱۰۰ میلی‌لیتر",
        "nameEn": "100 ml",
        "price": 4026000,
        "stockCount": 2,
        "sku": "IN1766677334"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پانتنول (پروویتامین B5)",
        "nameEn": "Panthenol (Pro-Vitamin B5)",
        "description": "آبرسان، نرم‌کننده و تقویت‌کننده مژه، تار مو و پوست سر."
      },
      {
        "nameFa": "عصاره رزماری خالص",
        "nameEn": "Rosmarinus Officinalis (Rosemary) Extract",
        "description": "تحریک گردش خون پوست سر، تقویت فولیکول‌ها، کنترل چربی کف سر و کمک به کاهش ریزش مو."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "پس از تکان دادن، روی کف سر تمیز اسپری کنید و با سرانگشتان آرام ماساژ دهید تا جذب شود (بدون آبکشی).",
      "night": "پس از تکان دادن، روی کف سر تمیز اسپری کنید و با سرانگشتان آرام ماساژ دهید تا جذب شود (بدون آبکشی)."
    },
    "badges": [
      "۹۹.۵٪ ترکیبات طبیعی",
      "رزماری + بیوتین",
      "وگان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ریزش مو، ضعف ریشه، خارش کف سر و موهای نازک و کم‌حجم.",
    "unsuitableFor": "از ورود به چشم خودداری شود."
  },
  {
    "id": "product-pori-920",
    "nameFa": "ریمل لیفت‌کننده و حجم‌دهنده لش آیدول لانکوم",
    "nameEn": "Lancôme Lash Idôle Lifting & Volumizing Mascara",
    "brand": "Lancôme",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "sensitive",
      "dry",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: ریمل لیفتینگ لوکس",
    "howToUse": "برس منحنی را افقی زیر مژه‌ها نگه داشته و از ریشه به سمت بالا بکشید تا هر مژه جداگانه لیفت شود.",
    "ingredientTags": [
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "ریمل لیفت کننده و حجم دهنده لانکوم مدل Lash Idole\n\nLancome Lash Idole Lifting &amp; Volumizing Mascara\n\nبا ریمل لش آیدول لانکوم، برای رسیدن به کمال تلاش کنید. ریملی انقلابی که تک تک مژه‌ها را هدف قرار می‌دهد تا مژه‌هایی جدا، فر و بدون چسبندگی داشته باشید. ماندگاری 24 ساعته و پاک شدن آسان. با برس منحصر به فرد ریمل لش آیدول، به مژه‌های خود حجم دهید: یک برس خمیده و کشسان با 360 میکرو برس که با یک حرکت، چشم‌ها را باز می‌کند. مژه‌ها را پوشش داده و بلند می‌کند و جلوه‌ای از افزایش حجم مژه را تضمین می‌کند. فرمول این ریمل ژل-امولسیون که 4 برابر موم کمتری نسبت به ریمل‌های سنتی دارد، نتیجه‌ای سبک اما به شدت مشکی را تضمین می‌کند.\n\nدر یک لحظه به اهداف مژه‌هایتان برسید: قدرت ریمل Lash Idôle را کشف کنید، ریمل‌ای که هر مژه را به صورت جداگانه برای بلند کردن، بلند کردن و حجم‌دهی فوری، بدون ایجاد توده، هدف قرار می‌دهد.\n\nبرس الاستومر منحنی منحصر به فرد، مژه‌ها را بلند و حالت می‌دهد تا جلوه‌ای خیره‌کننده ایجاد کند، در حالی که 360 میکروبریست هر مژه را در بر می‌گیرد. فرمول ژل-امولسیون سبک، مژه‌ها را سنگین نمی‌کند و آنها را تا 24 ساعت نرم و ابریشمی و بدون پوسته پوسته شدن باقی می‌گذارد. ریملی که فراتر می‌رود و مژه‌ها را بلند می‌کند.\n\n- حجم‌دهی و بلند کردن فوری\n\n- تا 24 ساعت ماندگاری\n\n- بدون توده\n\n- اثر بلند کننده و حجم دهنده\n\n- مژه های فر و جدا شده\n\n- ماندگاری 24 ساعته\n\n- افزایش حجم ناحیه چشم تا 140٪\n\n- اثر تضمینی افزایش حجم مژه\n\n- سیاهی شدید مژه‌ها",
    "descriptionEn": "Lancôme Lash Idôle Lifting & Volumizing Mascara by Lancôme.",
    "price": 15013000,
    "originalPrice": 15971000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1575/d2a03f1d6854b85605cf7411da625a48.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1576/7dc986faab896adbffdadcc107eb255a.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۸ میلی‌لیتر",
        "labelEn": "8 ml",
        "price": 15013000,
        "originalPrice": 15971000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1010",
        "name": "حجم ۸ میلی‌لیتر",
        "nameEn": "8 ml",
        "price": 15013000,
        "originalPrice": 15971000,
        "stockCount": 2,
        "sku": "IN1761604122"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "برس منحنی را افقی زیر مژه‌ها نگه داشته و از ریشه به سمت بالا بکشید تا هر مژه جداگانه لیفت شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "برس ۳۶۰ میکروپره‌ای",
      "ماندگاری ۲۴ ساعته",
      "بدون چسبندگی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "لیفت، بازکردن و حجم‌دهی فوری مژه‌ها بدون توده و سنگینی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-910",
    "nameFa": "برس حرارتی و فرکننده ۲ در ۱ جریان هوای سرد شیگلم",
    "nameEn": "SHEGLAM Hair Cool Lock 360° Airflow Styler",
    "brand": "SHEGLAM",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: صاف‌کننده و فرکننده ۲ در ۱",
    "howToUse": "روی موهای خشک دسته به دسته بکشید؛ جریان هوای خنک بلافاصله حالت فر یا صاف مو را تثبیت می‌کند.",
    "ingredientTags": [
      "ceramic-ionic"
    ],
    "descriptionFa": "برس حرارتی ۲ در ۱ شیگلم غیرچرخشی خودکار\n\nحالت دهنده مو با جریان هوای ۳۶۰ درجه ۲ در ۱ - این صاف کننده و فر کننده مو ۲ در ۱، عملکرد یک اتوی تخت بسیار بلند و یک اتوی فر کننده را با هم ترکیب می‌کند و به شما این امکان را می‌دهد که به راحتی حالت‌های صاف، فرهای موج‌دار و موج‌های ساحلی ایجاد کنید. فناوری یون‌های منفی برای براق، صاف و بدون وز نگه داشتن مو. مناسب برای انواع و مدل‌های مو.\n\nفناوری جریان هوای ۳۶۰ درجه برای حالت دادن بدون آسیب - حالت دهنده مو با جریان هوای ۳۶۰ درجه، توزیع یکنواخت گرما را تضمین می‌کند و هوای خنک را برای پیچیدن به دور موهای شما در خود جای می‌دهد و در عین حال که حالت مو را برای نتایج طولانی‌تر ثابت نگه می‌دارد، آسیب ناشی از گرما را کاهش می‌دهد.\n\nحالت دادن آسان - این صاف کننده و فر کننده مو ۲ در ۱ دارای گرمایش دوگانه PTC برای گرمای یکنواخت و به حداقل رساندن آسیب ناشی از گرما است. صفحات شناور سه بعدی و دسته ارگونومیک، حالت دادن نرم و آسان را تضمین می‌کنند. اتوی مو/فرکننده‌ی بسیار بلند: برای فر کردن یا صاف کردن موثرتر مو، در مورد این اتوی مو و فرکننده‌ی جریان هوا، ما طول اتوی مو را تا ۵.۵ اینچ افزایش داده‌ایم که حدود ۱.۵ اینچ بلندتر از مدل قدیمی است.\n\n۵ تنظیم دما برای انواع مو - اتوی مو با قابلیت حالت دادن به ... جریان هوا (۲۸۵ درجه فارنهایت) و ۴۳۰ درجه فارنهایت (۴۳۰ درجه فارنهایت)، مناسب برای موهای نازک و ضخیم.\n\nاتوی مو مسافرتی با قابلیت حالت دادن به مو با قابلیت حالت دادن به مو با قابلیت حالت دادن به مو با قابلیت حالت دادن به مو با قابلیت حالت دادن به مو با قابلیت جریان هوا (۲ در ۱)، قابل حمل و مناسب برای سفر است و دارای ولتاژ دوگانه و سیم گردان ۳۶۰ درجه برای حالت دادن آسان در هر مکانی می‌باشد.",
    "descriptionEn": "SHEGLAM Hair Cool Lock 360° Airflow Styler by SHEGLAM.",
    "price": 10839000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1553/c62092d15eeea2297893a617fccff0f9.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1554/3e5e2be2e36f9dfc0dd20d9ff2672f43.jpeg"
    ],
    "sizes": [
      {
        "label": "تک سایز (Cool Lock)",
        "labelEn": "Standard",
        "price": 10839000
      }
    ],
    "variants": [
      {
        "id": "var-pori-999",
        "name": "تک سایز (Cool Lock)",
        "nameEn": "Standard",
        "price": 10839000,
        "stockCount": 2,
        "sku": "IN1761025113"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "روی موهای خشک دسته به دسته بکشید؛ جریان هوای خنک بلافاصله حالت فر یا صاف مو را تثبیت می‌کند.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "جریان هوای سرد ۳۶۰ درجه",
      "گرمایش PTC + یون منفی",
      "۲ در ۱ صاف و فر"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "حالت‌دهی بدون آسیب حرارتی شدید با ماندگاری بالا.",
    "unsuitableFor": "روی موی خیس استفاده نشود."
  },
  {
    "id": "product-pori-838",
    "nameFa": "پنکک کرم‌پودری مات میت فیوژن کیکو میلانو",
    "nameEn": "KIKO Milano Matte Fusion Pressed Powder",
    "brand": "KIKO Milano",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش صورت: پنکک مات مخملی",
    "howToUse": "به صورت خشک یا با پد کمی مرطوب روی صورت بزنید تا پوشش مات و یکدست ایجاد شود.",
    "ingredientTags": [
      "vitamin-e",
      "argan",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پنکک کرمپودری مات کیکو میلانو مدل میت فیوژن\n\nبافت کرمی و پوشاننده آن کاملاً به پوست می‌چسبد بدون اینکه رگه رگه شود.\n\nپس از استفاده، رنگ به نرمی روی پوست می‌لغزد و به راحتی ترکیب می‌شود. لمس این محصول حس خوشایندی دارد.\n\nغنی شده با ویتامین E و روغن آرگان، فرمول آن روی رنگ‌های شفاف تا متوسط ​​می‌لغزد و در عین حال حسی مخملی و نرم به جا می‌گذارد. این پودر که کرمی و نرم‌کننده است، به راحتی با هر بافت یا نوع پوستی ترکیب می‌شود.\n\n- فینیش کاملا مات و مخملی\n\n- بافت نرم و لطیف و قابلیت اعمال آسان روی پوست\n\n- دارای رنگدانه و پوشانندگی بسیار بالا و قابل ساخت\n\n- پوشش دهی عیوب و تیرگی ها و یکدست کننده رنگ پوست\n\n- دارای نمای مات طبیعی و ایجاد ظاهری تازه و صاف و بی نقص\n\n- فرمولی فوق العاده سبک و راحت\n\n- قابل استفاده به دو صورت مرطوب یا خشک\n\n- حاوی عصاره انار با فواید مراقبتی برای پوست\n\n- تست شده توسط متخصصین پوست و غیر کومدوژنیک\n\n- عرضه شده در بسته بندی فلزی جمع و جور و زیبا\n\n- دارای یک پد یا اسفنج و یک آینه داخلی بزرگ\n\n- مناسب برای پوست های معمولی تا چرب",
    "descriptionEn": "KIKO Milano Matte Fusion Pressed Powder by KIKO Milano.",
    "price": 7680000,
    "originalPrice": 10710000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1382/2bdd2931cfabbb17f417280f3b8e033b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1383/ca4db6f209d88e3d27756026831315e8.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1384/670fcdcd5cd3cb33ab8841d2c5cc055c.webp"
    ],
    "sizes": [
      {
        "label": "۱۰",
        "labelEn": "۱۰",
        "price": 7680000,
        "originalPrice": 10710000
      }
    ],
    "variants": [
      {
        "id": "var-pori-917",
        "name": "۱۰",
        "nameEn": "۱۰",
        "price": 7680000,
        "originalPrice": 10710000,
        "stockCount": 2,
        "sku": "IN1757084675",
        "colorCode": "#dfb382"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "روغن آرگان مراکشی",
        "nameEn": "Moroccan Argan Oil",
        "description": "غنی از اسیدهای چرب امگا و ویتامین E برای ترمیم موهای آسیب‌دیده، رفع وز و درخشندگی مو."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "به صورت خشک یا با پد کمی مرطوب روی صورت بزنید تا پوشش مات و یکدست ایجاد شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "ویتامین E و روغن آرگان",
      "غیرکومدوژنیک",
      "ساخت ایتالیا"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "ایتالیا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پوست‌های مختلط تا چرب به دنبال فینیش مات طبیعی همراه با مراقبت از پوست.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-793",
    "nameFa": "روغن زیتون درخشان‌کننده و تقویت رشد مو اورجینالز",
    "nameEn": "Africa's Best Originals Extra Virgin Olive Oil Stimulating Growth Oil",
    "brand": "Africa's Best",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "night"
    ],
    "routineStep": "مراقبت مو و ناخن: روغن درمانی تقویت رشد",
    "howToUse": "مقدار کمی را به پوست سر و ساقه مو ماساژ دهید (یا قبل حمام به عنوان روغن‌تراپی استفاده کنید).",
    "ingredientTags": [
      "vitamin-e",
      "jojoba-oils",
      "salicylic-dandruff"
    ],
    "descriptionFa": "روغن زیتون درخشان کننده و تقویت رشد موی اورجینالز\n\nروغن زیتون فرا بکر درمانی ارگانیک، محرک رشد، درخشندگی و رشد سالم را افزایش می‌دهد. این روغن تقویت، درخشندگی و رشد مو را در سطح بالاتری فراهم می‌کند. این روغن محرک همه منظوره که با خواص قدیمی روغن زیتون فوق بکر فرموله شده است، به مو، پوست و ناخن نفوذ کرده و آنها را جوان می‌کند و در تمام طول روز رطوبت و نرمی را به آنها بازمی‌گرداند.\n\n- تقویت رشد مو: روغن زیتون با تغذیه فولیکول‌های مو، می‌تواند به تقویت رشد مو و افزایش ضخامت آن‌ها کمک کند\n\n- نرم کننده و مرطوب کننده: روغن زیتون یک نرم کننده طبیعی است که به موهای خشک و آسیب دیده رطوبت می‌رساند و آن‌ها را نرم و لطیف می‌کند\n\n- مقابله با شوره سر: روغن زیتون می‌تواند به کاهش شوره سر کمک کند، به ویژه اگر به صورت ماسک مو به همراه لیمو استفاده شود\n\n- درمان موخوره: روغن زیتون با نرم کردن و تغذیه موها، به جلوگیری از موخوره کمک می‌کند\n\n- حالت دهنده طبیعی: روغن زیتون می‌تواند به عنوان یک حالت دهنده طبیعی برای موها عمل کند و به آن‌ها درخشندگی و لطافت ببخشد\n\n- افزایش گردش خون: ماساژ پوست سر با روغن زیتون می‌تواند به بهبود گردش خون در پوست سر کمک کند و در نتیجه رشد مو را تقوی",
    "descriptionEn": "Africa's Best Originals Extra Virgin Olive Oil Stimulating Growth Oil by Africa's Best.",
    "price": 1503000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1289/f698e006e621a1898de76990b4ae43a6.webp"
    ],
    "sizes": [
      {
        "label": "حجم ۱۷۷ میلی‌لیتر",
        "labelEn": "177 ml",
        "price": 1503000
      }
    ],
    "variants": [
      {
        "id": "var-pori-869",
        "name": "حجم ۱۷۷ میلی‌لیتر",
        "nameEn": "177 ml",
        "price": 1503000,
        "stockCount": 2,
        "sku": "IN1753678451"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "سالیسیلیک اسید و کمپلکس ضدشوره",
        "nameEn": "Salicylic Acid & Piroctone Olamine",
        "description": "پاکسازی عمیق پوست سر، رفع پوسته‌ریزی و کنترل قارچ‌های عامل شوره بدون التهاب."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است.",
      "night": "مقدار کمی را به پوست سر و ساقه مو ماساژ دهید (یا قبل حمام به عنوان روغن‌تراپی استفاده کنید)."
    },
    "badges": [
      "روغن زیتون فرابکر ارگانیک",
      "ضدموخوره و ضدخشکی",
      "چندمنظوره مو و پوست"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "موهای خشک، شکننده، دارای موخوره و پوست سر کم‌آب.",
    "unsuitableFor": "برای موهای بسیار چرب فقط روی نوک مو مصرف شود."
  },
  {
    "id": "product-pori-739",
    "nameFa": "ریمل دو سر حجم‌دهنده و بلندکننده ضدآب بورگاندی شیگلم",
    "nameEn": "SHEGLAM All-In-One Volume & Length Waterproof Mascara - Burgundy",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "sensitive",
      "oily",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: ریمل دو سر بورگاندی",
    "howToUse": "ابتدا با سر بلندکننده طول مژه‌ها را افزایش داده و سپس با سر حجم‌دهنده پرپشت کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "ریمل دو سر شیگلم بورگاندی\n\nAll-In-One Volume &amp; Length Mascara-Waterproof Brugundy\n\nیک محصول برجسته از برند SHEGLAM است که برای افزایش حجم و طول مژه ها طراحی شده است. این محصول با فرمولاسیون خاص خود، مژه ها را به طور کامل پوشش می دهد و جلوهای جذاب و چشم گیر به آن ها می بخشد.\n\nیکی از ویژگیهای منحصر به فرد این ریمل، برس دوطرفه آن است که دارای دو فرمول مختلف است. این برس به شما امکان میدهد تا به طور جداگانه یا همزمان از هر دو فرمول استفاده کنید و نتیجه ای سفارشی و بدون توده به دست آورید.\n\n- بافت کرمی: به راحتی روی مژه ها مینشیند و آنها را یکنواخت پوشش می دهد.\n\n- ماندگاری بالا: به مدت طولانی روی مژه ها باقی میماند.\n\n- جداکننده مژه ها: از چسبیدن مژه ها به یکدیگر جلوگیری میکند.\n\n- برس دوطرفه: دارای دو فرمول مختلف برای نتیجه ای سفارشی.\n\n- ضد لک و سریع خشک شونده: بدون ایجاد لک و با خشک شدن سریع.\n\n- افزایش حجم و طول مژه ها: مژه ها را پرپشتتر و بلندتر نشان می دهد",
    "descriptionEn": "SHEGLAM All-In-One Volume & Length Waterproof Mascara - Burgundy by SHEGLAM.",
    "price": 1986000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1179/028abed5624b56ed0f7753e44b10df05.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1178/f4fdf37288771f6c23aad66752e18a76.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1180/58d1ecb1497af471e46b924e5d24b637.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۴.۶ گرم | Burgundy",
        "labelEn": "4.6 g - Burgundy",
        "price": 1986000
      }
    ],
    "variants": [
      {
        "id": "var-pori-812",
        "name": "وزن ۴.۶ گرم | Burgundy",
        "nameEn": "4.6 g - Burgundy",
        "price": 1986000,
        "stockCount": 2,
        "sku": "IN1749633717"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "ابتدا با سر بلندکننده طول مژه‌ها را افزایش داده و سپس با سر حجم‌دهنده پرپشت کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "دو برس مجزا",
      "رنگ خاص بورگاندی",
      "ضدآب و ضدلک"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "مژه‌های خوش‌رنگ بورگاندی برای برجسته‌تر کردن رنگ چشم.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-737",
    "nameFa": "پالت سایه گرامافونی رنگارنگ کالر می کریزی شیگلم",
    "nameEn": "SHEGLAM Color Me Crazy Vinyl Pop Eyeshadow Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "آرایش چشم: پالت سایه فانتزی",
    "howToUse": "با براش متراکم روی پلک آماده‌شده با پرایمر چشم بزنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پالت سایه گرامافونی شیگلم\n\nیک پالت سایه گرامافونی شیگلم است که برای افرادی که عاشق رنگ‌های زنده و پرانرژی هستند طراحی شده است. این پالت شامل رنگ‌های متنوعی از جمله آبی، سبز، زرد و نارنجی است که می‌تواند به شما کمک کند تا ظاهری جسورانه و متفاوت ایجاد کنید.\n\nاین پالت شامل رنگ‌هایی است که می‌توانند هر ظاهری را زنده کرده و با استفاده از آن سبک‌های مختلفی از آرایش را تجربه کنید.\n\nبافت غنی و کرمی این سایه‌ها باعث می‌شود که به راحتی بر روی پلک‌ها نشسته و ماندگاری بالایی داشته باشند.\n\nفرمولاسیون‌های خاص و مواد اولیه با کیفیت باعث می‌شود که سایه‌ها ماندگاری بالایی داشته باشند همچنین بافت نرم این سایه‌ها باعث می‌شود که به راحتی بر روی پلک‌ها کشیده شوند و نیازی به فشار زیاد نباشد.\n\n- الهام گرفته از Cd Player های قدیمی\n\n- بسته بندی فوق العاده زیبا و نوستالژی\n\n- ترکیب رنگ های خاص و زیبا\n\n- دارای رنگ‌های مات و براق\n\n- ماندگاری بالا\n\n- ضدلک و ریزش\n\n- دارای بافت کرمی، خشک و مات\n\n- حاوی پرایمر برای سایه های براق برای درخشش بیشتر\n\n- فاقد الکل، گلوتن، پارابن، تالک و افزودنی های معدنی\n\n- فاقد رایحه\n\n- بسته بندی قابل بازیافت\n\n- بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Color Me Crazy Vinyl Pop Eyeshadow Palette by SHEGLAM.",
    "price": 2130000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1174/6116ee7e7302070e797fe36d6d62cc73.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1175/bd71fc93e1e1d0eef181a51e3823d9fb.jpeg"
    ],
    "sizes": [
      {
        "label": "پالت گرامافونی",
        "labelEn": "Standard Palette",
        "price": 2130000
      }
    ],
    "variants": [
      {
        "id": "var-pori-810",
        "name": "پالت گرامافونی",
        "nameEn": "Standard Palette",
        "price": 2130000,
        "stockCount": 2,
        "sku": "IN1749618128"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با براش متراکم روی پلک آماده‌شده با پرایمر چشم بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "رنگ‌های شاد و پرانرژی",
      "بسته‌بندی وینیل",
      "مات و شاین"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آرایش‌های جسورانه، هنری و رنگارنگ.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-614",
    "nameFa": "اسپری فیکساتور مات ۲۴ ساعته میست اند فیکس میکاپ فوراور",
    "nameEn": "MAKE UP FOR EVER Mist & Fix Matte 24HR Setting Spray",
    "brand": "MAKE UP FOR EVER",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "مرحله پایانی میکاپ: اسپری فیکس حرفه‌ای",
    "howToUse": "قبل از مصرف تکان دهید و پس از پایان آرایش از فاصله ۳۰ سانتی‌متری با حرکت Z روی صورت اسپری کنید.",
    "ingredientTags": [
      "biotin",
      "silk-keratin",
      "niacinamide",
      "mineral-pigments"
    ],
    "descriptionFa": "اسپری فیکساتور میست اند فیکس مات 24 ساعته میکاپ فوراور\n\nSpray fixture Mist &amp; Fix Matte - Format Voyage Make up for ever\n\nاسپری فیکس میکاپ فوراور محصولی برای تنظیم درخشش پوست است. با روش استفاده ای سریع و راحت به ماندگاری آرایش شما کمک می کند.\n\nهمانطور که از اسم این محصول مشخص است به صورت اسپری بوده است. همین خاصیت اعمال آن را بر روی پوست به کاری سریع و آسان مبدل کرده است.\n\nمواد اسپری فیکس میکاپ فوراور سبک و غیر چسبنده است و تضمین می کند که آرایش شما مدت زیادی با کیفیت اولیه روی پوستتان باقی بماند.\n\nاین محصول با ایجاد مانع برای تعریق، آرایش را در برابر ریزش یا محو شدن مقاوم می کند. این ماندگاری به طور تضمین شده ۲۴ ساعت طول می کشد.\n\nفرمول این اسپری و نحوه خشک شدن آن باعث هیدراته شدن پوست میشود. ظاهری ابریشمی و صاف را برای صورت به ارمغان می آورد.\n\nاسپری فیکس میکاپ فوراور بی رنگ، بدون وزن و به اصطلاح نامرئی است. فرمولاسیون بدون الکل این اسپری، آن را برای انواع پوست مناسب کرده است.\n\n- حفظ آرایش و تازه نگه داشتن آن\n\n- سبک و با ماندگاری بالا\n\n- مرطوب کننده و آب رسان\n\n- ضد عرق و ضد آّب\n\n- ایجاد ظاهری صاف و ابریشمی\n\n- اکسیژن رسانی به پوست\n\n- مناسب انواع پوست\n\n- آزمایش شده توسط متخصصان پوست\n\n- تا 40 درصد افزایش میزان آب رسانی پس از 2 ساعت",
    "descriptionEn": "MAKE UP FOR EVER Mist & Fix Matte 24HR Setting Spray by MAKE UP FOR EVER.",
    "price": 1987000,
    "originalPrice": 3266000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/912/373001b59e36b729dc3e813597a3071e.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/911/3ed514fa513a50917ef13b2a00a6c731.webp"
    ],
    "sizes": [
      {
        "label": "۱۰۰میل",
        "labelEn": "100 ml",
        "price": 5704000,
        "originalPrice": 6426000
      },
      {
        "label": "۳۰میل",
        "labelEn": "30 ml",
        "price": 1987000,
        "originalPrice": 3266000
      }
    ],
    "variants": [
      {
        "id": "var-pori-680",
        "name": "۱۰۰میل",
        "nameEn": "100 ml",
        "price": 5704000,
        "originalPrice": 6426000,
        "stockCount": 1,
        "sku": "IN1745016419"
      },
      {
        "id": "var-pori-681",
        "name": "۳۰میل",
        "nameEn": "30 ml",
        "price": 1987000,
        "originalPrice": 3266000,
        "stockCount": 2,
        "sku": "IN1745016420"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "نیاسینامید (ویتامین B3)",
        "nameEn": "Niacinamide (Vitamin B3)",
        "description": "کمک به یکدستی رنگ پوست، تنظیم چربی و حفظ طراوت و شادابی."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "قبل از مصرف تکان دهید و پس از پایان آرایش از فاصله ۳۰ سانتی‌متری با حرکت Z روی صورت اسپری کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "فینیش مات ۲۴ ساعته",
      "فاقد الکل",
      "مقاوم در برابر تعریق"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 3,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "کنترل براقیت پوست و تثبیت حرفه‌ای آرایش تا ۲۴ ساعت.",
    "unsuitableFor": "از پاشیدن داخل چشم خودداری شود."
  },
  {
    "id": "product-pori-552",
    "nameFa": "کیت ۴ عددی برق لب مغذی امبر رز شیگلم",
    "nameEn": "SHEGLAM Ember Rose Immortal Love Nourishing Lip Gloss Set (4 pcs)",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "sensitive"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: ست ۴ عددی لیپ گلاس",
    "howToUse": "به تنهایی برای درخشش شیشه‌ای یا روی رژلب دلخواه استفاده کنید.",
    "ingredientTags": [
      "vitamin-e",
      "jojoba-oils",
      "biotin"
    ],
    "descriptionFa": "کیت رژ لب مایع براق شیگلم مدل EMBER ROSE بسته 4 عددی شیگلم SHEGLAM EMBER ROSE IMMORTAL LOVE NOURISHING LIP GLOSS SET\n\nبا استفاده از براق کننده لب مغذی عشق Immortal ما، ظاهری فوق‌العاده لذیذ فقط چند انگشت دورتر است. این براق کننده لب با فرمول فوق العاده مغذی، درخششی درخشان شیشه ای ارائه می دهد که به راحتی روی لب ها با رنگی زیبا می پوشد. آن را روی یک رژ لب مکمل قرار دهید یا آن را به تنهایی برای درخشندگی لبتان استفاده کنید\n\n- در 4 رنگ بسیار کاربردی و زیبا\n\n- پوشش براق و فریبنده\n\n- با ماندگاری بالا\n\n- دارای فرمول گیاهی\n\n- جلوه مخملی و زیبا\n\n- دارای رنگ دانه های غنی و خوشرنگ\n\n- بافت نرم و سبک\n\n- رطوبت رسان\n\n- بدون ایجاد حس سنگینی بر روی لب\n\n- عدم احساس ماسیدگی بر روی لب\n\n- فاقد مواد آلرژی زا\n\n- بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Ember Rose Immortal Love Nourishing Lip Gloss Set (4 pcs) by SHEGLAM.",
    "price": 3845000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/798/eeb38813351d381a5d3fe016f9e7c53d.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/799/ff529fb1be649a6c3f374b6334b0b336.jpeg"
    ],
    "sizes": [
      {
        "label": "۴ عدد × ۲.۶ گرم",
        "labelEn": "4 × 2.6 g",
        "price": 3845000
      }
    ],
    "variants": [
      {
        "id": "var-pori-616",
        "name": "۴ عدد × ۲.۶ گرم",
        "nameEn": "4 × 2.6 g",
        "price": 3845000,
        "stockCount": 2,
        "sku": "IN1740652083"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "به تنهایی برای درخشش شیشه‌ای یا روی رژلب دلخواه استفاده کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "بسته ۴ رنگ",
      "فرمول گیاهی مغذی",
      "بدون تست حیوانی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "ست هدیه و روزانه ۴ رنگ کاربردی با بافت نرم و رطوبت‌رسان.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-450",
    "nameFa": "پرایمر سیلیکونی مات‌کننده و آبرسان های ادهیرنس اوردینری",
    "nameEn": "The Ordinary High-Adherence Silicone Primer",
    "brand": "The Ordinary",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "زیرساز آرایش: پرایمر محوکننده منافذ",
    "howToUse": "در آخرین مرحله روتین مراقبت از پوست و پیش از کرم‌پودر مقدار کمی روی صورت پخش کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پرایمر سیلیکونی آبرسان و مات کننده و پوشاننده منافذ پوست مدل های ادهیرنس اوردینری\n\nدارای بافت کرم مانند با پوشش سبک و نمای مات است. این محصول با ذرات سیلیکون های پیشرفته فرموله شده تا ضمن محو کردن منافذ بزرگ و عیوب پوست، کیفیت و دوام آرایش را افزایش دهد. بنابراین بعنوان یک پرایمر سه کاره برای آرایش عمل کرده تا میکاپ واضح تر با ماندگاری بیشتری داشته باشید. پرایمر کرمی سیلیکونی پر کننده منافذ اوردینری مدل های ادهیرنس پوست را صاف و مات می کند.. در عین حال باعث آبرسانی به پوست نیز می شود.\n\n- پوشش سبک و نمای مات\n\n- فرموله شده با ذرات سیلیکون های پیشرفته\n\n- محو کننده و کاهش ظاهر منافذ بزرگ، خطوط ریز و سایر عیوب و نواحی مشکل دار پوست\n\n- ایجاد سطحی صاف و پایه ای بهینه روی صورت برای آرایش\n\n- افزایش کیفیت و ماندگاری طولانی مدت آرایش\n\n- آبرسانی و صاف و مات کننده پوست\n\n- جلوگیری از درخشش ناخواسته پوست و ایجاد ظاهری شاداب\n\n- قابل استفاده به تنهایی بعنوان یک آبرسان بدون چربی یا در کنار سایر محصولات آرایشی",
    "descriptionEn": "The Ordinary High-Adherence Silicone Primer by The Ordinary.",
    "price": 2558000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/616/7c8b7b9d3ce445d9fb0f90dc352683b7.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۰ میلی‌لیتر",
        "labelEn": "30 ml",
        "price": 2558000
      }
    ],
    "variants": [
      {
        "id": "var-pori-502",
        "name": "حجم ۳۰ میلی‌لیتر",
        "nameEn": "30 ml",
        "price": 2558000,
        "stockCount": 2,
        "sku": "IN1732946822"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "در آخرین مرحله روتین مراقبت از پوست و پیش از کرم‌پودر مقدار کمی روی صورت پخش کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "محوکننده منافذ",
      "آبرسان فاقد چربی",
      "وگان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کانادا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "صاف‌کردن بافت پوست، کاهش ظاهر منافذ و افزایش چسبندگی و دوام آرایش.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-424",
    "nameFa": "اتو فرکننده اتوماتیک مو با روکش کراتین It-Curl شیگلم",
    "nameEn": "SHEGLAM It-Curl Keratin Gloss Pro Curling Iron",
    "brand": "SHEGLAM",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: اتو فرکننده کراتینه",
    "howToUse": "پس از خشک شدن کامل مو، دما را متناسب با جنس مو انتخاب کرده و دسته‌های مو را بپیچید.",
    "ingredientTags": [
      "silk-keratin",
      "ceramic-ionic"
    ],
    "descriptionFa": "اتو فر کننده شیگلم It-Curl\n\n[پیش گرم کردن سریع، بدون انتظار] آماده استفاده در عرض 45 ثانیه، بدون انتظار، بدون فشار برای تازه کارها! مدل موی با کیفیت سالن را به سرعت و به راحتی در خانه دریافت کنید! چه هدیه ای به یک دوست یا یکی از عزیزانتان باشد، این اتوی فر یک انتخاب ایده آل است.\n\n[مراقبت از مو بدون آسیب به مو، طراحی موی ضد کارت] اتو فر با روکش کراتین Gloss Pro™ پوشیده شده است، که به طور یکنواخت گرم می شود، آسیب حرارتی و موخوره را کاهش می دهد، و حرارت یکنواخت و ثابت را در هنگام حالت دادن ایجاد می کند، که می تواند باعث ایجاد حرارت بالا شود. - فرهای براق و موهای سالم. علاوه بر این طرح گیره موی ضد کارت این فر کننده، نگران کشیدن موهای شما نیست.\n\n[نمایشگر LED، 8 گزینه دما] دمای صفحه نمایش LED اتو فر اتوماتیک 130 تا 210 درجه سانتیگراد با 8 تنظیم دما مناسب برای افراد با انواع مو (درشت، متوسط، ریز و نرم) است. لطفا تنظیم مناسب برای موهای خود را انتخاب کنید.\n\nسایز:۹میلیمتر",
    "descriptionEn": "SHEGLAM It-Curl Keratin Gloss Pro Curling Iron by SHEGLAM.",
    "price": 6220000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2128/84bb716837cceab0ec2f094dd0fce109.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/570/f4616c04b8604519361255d6c0ff8118.jpeg"
    ],
    "sizes": [
      {
        "label": "سایز ۳۲ میلی‌متر",
        "labelEn": "32 mm",
        "price": 6220000
      }
    ],
    "variants": [
      {
        "id": "var-pori-475",
        "name": "سایز ۳۲ میلی‌متر",
        "nameEn": "32 mm",
        "price": 6220000,
        "stockCount": 2,
        "sku": "IN1731120342"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "پس از خشک شدن کامل مو، دما را متناسب با جنس مو انتخاب کرده و دسته‌های مو را بپیچید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "روکش کراتین Gloss Pro",
      "۸ دما (۱۳۰–۲۱۰°C)",
      "گرمایش ۴۵ ثانیه"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "ایجاد فرهای براق و ماندگار با حداقل آسیب و بدون کشیدگی مو.",
    "unsuitableFor": "روی موهای خیس یا بدون محافظ حرارت استفاده نشود."
  },
  {
    "id": "product-pori-106",
    "nameFa": "رژ لب مایع مات مت آلور شیگلم مدل Cosmopolitan",
    "nameEn": "SHEGLAM Matte Allure Liquid Lipstick - Cosmopolitan",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: رژ مایع مات مخملی",
    "howToUse": "با اپلیکاتور روی لب‌های تمیز بکشید و چند ثانیه صبر کنید تا مات و فیکس شود.",
    "ingredientTags": [
      "jojoba-oils",
      "biotin",
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ لب مایع و مات مدل مت آلور Sheglam دارای اندازه های مینیاتوری و کوچکی می باشد که برای به همراه داشتن در کیف و سفر نیز ایده آل است. این رژلب ها در رنگ های متنوع و زیبایی طراحی شده تا برای هر نوع و رنگ پوستی مناسب باشند.\n\n—————-\n\nدارای بافت مایع و بسیار نرم و سبک با فینیش مات و مخملی • حاوی رنگدانه های قوی و پررنگ و ماندگاری طولانی مدت • ارائه فوری یک پوشش اشباع و مات و یکدست با حسی سبک و ابریشمی روی لب • غنی شده با عصاره روغن آفتابگردان برای صاف تر به نظر رسیدن لب ها • جلوگیری از ایجاد خشکی و خطوط و چروک روی لب • دارای اندازه های مینیاتوری و کوچکی برای حمل آسان در کیف و سفر • طراحی شده در رنگ های متنوع و زیبا با بافت قابل ساخت و قابل ترکیب • کاملا کرولتی فری و بدون تست حیوانی • مناسب هر نوع و رنگ پوستی\n\n————-",
    "descriptionEn": "SHEGLAM Matte Allure Liquid Lipstick - Cosmopolitan by SHEGLAM.",
    "price": 2689000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3548/f9cf464b0038aa8b17e6736f7695ae14.jpg"
    ],
    "sizes": [
      {
        "label": "حجم ۲.۳ میلی‌لیتر",
        "labelEn": "2.3 ml",
        "price": 2689000
      }
    ],
    "variants": [
      {
        "id": "var-pori-121",
        "name": "حجم ۲.۳ میلی‌لیتر",
        "nameEn": "2.3 ml",
        "price": 2689000,
        "stockCount": 2,
        "sku": "IN1711456127"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با اپلیکاتور روی لب‌های تمیز بکشید و چند ثانیه صبر کنید تا مات و فیکس شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "حاوی روغن آفتابگردان",
      "فینیش مات ابریشمی",
      "کرولتی‌فری"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آرایش لب مات و سبک با رنگ اشباع بدون ایجاد ترک روی لب.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-14",
    "nameFa": "پالت سایه ۱۲ رنگ مراکش آبسسد شیگلم",
    "nameEn": "SHEGLAM Marrakesh Obsessed 12-Color Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت سایه ۱۲ رنگ",
    "howToUse": "رنگ‌های گرم و خاکی را برای آرایش روز و شیدهای متالیک را برای درخشش شب ترکیب کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "- الهام گرفته از صحرا های زیبای مراکش\n\n- جلوه مات، متالیک و شیمر\n\n- 12 رنگ مات و شاین\n\n- ترکیب پذیری عالی\n\n- پیگمنت قوی\n\n- بدون کیکی شدن روی پوست\n\n- بافت پودری فشرده\n\n- رنگبندی فوق العاده زیبا\n\n- ماندگاری بالا\n\n- فاقد الکل، گلوتن، پارابن و رایحه\n\n- فرمولاسیون وگان\n\n- بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Marrakesh Obsessed 12-Color Palette by SHEGLAM.",
    "price": 2558000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/49/71fb5a5ff6e3a68190167e4e737bf928.jpg"
    ],
    "sizes": [
      {
        "label": "۱۲ رنگ مات، متالیک و شیمر",
        "labelEn": "12 Shades",
        "price": 2558000
      }
    ],
    "variants": [
      {
        "id": "var-pori-22",
        "name": "۱۲ رنگ مات، متالیک و شیمر",
        "nameEn": "12 Shades",
        "price": 2558000,
        "stockCount": 2,
        "sku": "IN1710992964"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "رنگ‌های گرم و خاکی را برای آرایش روز و شیدهای متالیک را برای درخشش شب ترکیب کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "وگان و فاقد پارابن",
      "بدون عطر و الکل",
      "پیگمنت قوی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 2,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "پالت ۱۲ رنگ الهام‌گرفته از رنگ‌های گرم مراکشی با دوام بالا.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1594",
    "nameFa": "سرم تخصصی پوست سر کلاژن، پپتاید ابریشم و EGF سانگ بون ادیتور",
    "nameEn": "SUNGBOON EDITOR Silk Peptide EGF Collagen Scalp Serum",
    "brand": "SUNGBOON EDITOR",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "night"
    ],
    "routineStep": "مراقبت تخصصی پوست سر: سرم تقویت ریشه",
    "howToUse": "روی پوست سر تمیز چند قطره چکانده و با سرانگشتان آرام ماساژ دهید تا جذب شود (بدون آبکشی).",
    "ingredientTags": [
      "biotin",
      "peptides",
      "collagen",
      "silk-keratin"
    ],
    "descriptionFa": "سرم تخصصی پوست سر کلاژن و پپتاید ابریشم EGF سانگ بون ادیتور افزایش رشد و پر کننده نقاط خالی مو\n\nSUNGBOON EDITOR Silk Peptide EGF Collagen Scalp Serum –(75 ml)\n\nسرم پوست سر کلاژن و پپتید ابریشم EGF از برند کره‌ای SUNGBOON EDITOR یک محصول مراقبتی تخصصی برای تغذیه، آبرسانی و بهبود ظاهر پوست سر و موهاست. این سرم با بهره‌گیری از ترکیباتی مانند پپتید ابریشم، کلاژن، EGF و استیل هگزاپپتید-8 به مراقبت از پوست سر کمک می‌کند و محیطی مناسب برای داشتن موهایی سالم‌تر، خوش‌حالت‌تر و پرپشت‌تر فراهم می‌آورد.\n\nفرمولاسیون این محصول با تمرکز بر مراقبت از ریشه مو و پوست سر طراحی شده است تا علاوه بر کمک به حفظ رطوبت، به بهبود ظاهر موهای ضعیف و کم‌حجم کمک کند. با استفاده منظم، پوست سر احساس لطافت و طراوت بیشتری خواهد داشت و موها ظاهری قوی‌تر و حجیم‌تر پیدا می‌کنند.\n\nویژگی‌ها و مزایای محصول\n\n- کمک به تغذیه و مراقبت از پوست سر\n\n- حاوی پپتید ابریشم برای کمک به لطافت و نرمی مو\n\n- غنی‌شده با کلاژن برای کمک به حفظ رطوبت و بهبود ظاهر مو\n\n- حاوی EGF برای پشتیبانی از مراقبت و شادابی پوست سر\n\n- دارای استیل هگزاپپتید-8 در ترکیبات مراقبتی\n\n- کمک به بهبود ظاهر موهای نازک و کم‌حجم\n\n- کمک به حفظ رطوبت پوست سر و ساقه مو\n\n- مناسب برای روتین مراقبت از پوست سر و مو\n\n- کمک به داشتن موهایی خوش‌حالت‌تر، نرم‌تر و پرتر\n\nترکیبات کلیدی و عملکرد آن‌ها\n\n۱. پپتید ابریشم (Silk Peptide)\n\nبه نرم شدن موها کمک می‌کند و باعث می‌شود تارهای مو ظاهری لطیف‌تر، صاف‌تر و درخشان‌تر داشته باشند.\n\n۲. EGF (فاکتور رشد اپیدرمی)\n\nیکی از ترکیبات مورد استفاده در محصولات مراقبت از پوست است که با هدف پشتیبانی از شادابی و بهبود ظاهر پوست سر به کار می‌رود.\n\n۳. کلاژن (Collagen)\n\nترکیبی شناخته‌شده در محصولات مراقبتی که به حفظ رطوبت و بهبود حس لطافت پوست و مو کمک می‌کند.\n\n۴. استیل هگزاپپتید-8 (Acetyl Hexapeptide-8)\n\nیک پپتید کاربردی در فرمولاسیون محصولات مراقبت از پوست که برای کمک به حفظ ظاهر صاف و شاداب پوست استفاده می‌شود.\n\nروش استفاده\n\n۱. ابتدا موها را تمیز کرده و پوست سر را آماده کنید.\n\n۲. مقدار مناسبی از سرم را مستقیماً روی پوست سر، به‌خصوص نواحی موردنیاز، بمالید.\n\n۳. با نوک انگشتان به‌آرامی ماساژ دهید تا محصول به‌خوبی پخش شود.\n\n۴. مطابق دستورالعمل درج‌شده روی بسته‌بندی، از محصول استفاده کنید.\n\n۵. برای دستیابی به بهترین نتیجه مراقبتی، مصرف منظم را در روتین خود قرار دهید.\n\nمناسب برای چه افرادی است؟\n\n- افرادی که موهای نازک و کم‌حجم دارند.\n\n- کسانی که به دنبال مراقبت و تغذیه پوست سر هستند.\n\n- افرادی که پوست سرشان به آبرسانی و مراقبت بیشتر نیاز دارد.\n\n- کسانی که می‌خواهند ظاهر موهای خود را نرم‌تر، سالم‌تر و پرتر نشان دهند.\n\n- افرادی که به محصولات مراقبت از موی کره‌ای و حاوی پپتید علاقه دارند.",
    "descriptionEn": "SUNGBOON EDITOR Silk Peptide EGF Collagen Scalp Serum by SUNGBOON EDITOR.",
    "price": 7068000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4819/75fc3b677d32eb067e27c69241e989ba.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4825/0e52da16330fd3abc7d396e0669f02e2.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4822/06c320bb7e313874c88e7092f3e29bb4.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4820/7ec607cfb68dc8172dee6de031de2f99.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4824/07188a1fa382fad9554bde61d24cd390.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4823/a2af59e4e32a564ada1af37a3f5d7686.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4821/8bd0acd4efffa1183a4bb193650e1e3e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4826/6cef8415a5372b10fc6aa6c750b24ee9.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۷۵ میلی‌لیتر",
        "labelEn": "75 ml",
        "price": 7068000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1757",
        "name": "حجم ۷۵ میلی‌لیتر",
        "nameEn": "75 ml",
        "price": 7068000,
        "stockCount": 1,
        "sku": "IN1794290758"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پپتایدهای فعال و فاکتور رشد EGF",
        "nameEn": "Bio-Active Peptides & EGF",
        "description": "تقویت ریشه مو و مژه، حمایت از استحکام ساختار کراتینی و بهبود لطافت و پرپشتی."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "کمک به حفظ رطوبت، افزایش حجم و قوام تارهای مو، مژه و نرمی بافت لب."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است.",
      "night": "روی پوست سر تمیز چند قطره چکانده و با سرانگشتان آرام ماساژ دهید تا جذب شود (بدون آبکشی)."
    },
    "badges": [
      "پپتاید ابریشم + EGF",
      "کلاژن آبرسان",
      "بدون چربی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "کف سر خشک یا کم‌آب، موهای نازک، ضعیف و نقاط کم‌پشت.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1588",
    "nameFa": "شامپو حجم‌دهنده پپتاید ابریشم، EGF و کلاژن سانگ بون ادیتور",
    "nameEn": "SUNGBOON EDITOR Silk Peptide EGF Collagen Intensive Volume Shampoo",
    "brand": "SUNGBOON EDITOR",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت مو: شامپو حجم‌دهنده تخصصی",
    "howToUse": "روی مو و کف سر خیس ماساژ دهید، ۱ تا ۲ دقیقه صبر کرده و کامل آبکشی کنید.",
    "ingredientTags": [
      "biotin",
      "peptides",
      "collagen",
      "silk-keratin"
    ],
    "descriptionFa": "شامپو حجم‌دهنده سانگ بون ادیتور حاوی پپتاید ابریشم EGF و کلاژن حجم ۴۰۰ میلی‌لیتر\n\nشامپو حجم‌دهنده سانگ بون ادیتور مدل Silk Peptide EGF Collagen Intensive Volume، یک شوینده تخصصی مو با فرمولاسیون مراقبتی و حجم‌دهنده است که با بهره‌گیری از ترکیباتی مانند پپتاید ابریشم، EGF و کلاژن به پاکسازی موها، بهبود ظاهر تارهای مو و افزایش حس حجم و پرپشتی کمک می‌کند.\n\nاین شامپو برای افرادی طراحی شده است که موهای نازک، کم‌حجم و بی‌حالت دارند و به دنبال محصولی برای شست‌وشوی مؤثر در کنار مراقبت از زیبایی و ظاهر موهای خود هستند. ترکیبات مراقبتی آن به نرمی، لطافت و خوش‌حالت شدن موها کمک می‌کنند و باعث می‌شوند موها پس از شست‌وشو ظاهری شاداب‌تر و حجیم‌تر داشته باشند.\n\nویژگی‌ها و مزایای شامپو حجم‌دهنده سانگ بون ادیتور\n\nکمک به افزایش حجم و پرپشت‌تر دیده شدن موها\n\nپاکسازی مو و پوست سر از آلودگی‌ها و چربی‌های اضافی\n\nحاوی پپتاید ابریشم برای کمک به نرمی و لطافت مو\n\nغنی‌شده با EGF برای پشتیبانی از مراقبت و سلامت ظاهری مو و پوست سر\n\nحاوی کلاژن برای کمک به بهبود ظاهر و انعطاف‌پذیری تارهای مو\n\nکمک به کاهش ظاهر بی‌حالت و خوابیده موها\n\nکمک به خوش‌حالت شدن و افزایش شادابی مو\n\nمناسب برای روتین مراقبت از موهای نازک و کم‌حجم\n\nقابل استفاده برای شست‌وشوی منظم مو، متناسب با نیاز مو و پوست سر\n\nترکیبات مؤثر و عملکرد آن‌ها\n\n۱. پپتاید ابریشم (Silk Peptide)\n\nپپتایدهای ابریشم از ترکیبات مراقبتی محبوب در محصولات مو هستند که به بهبود نرمی، لطافت و ظاهر صاف‌تر تارهای مو کمک می‌کنند. این ترکیب با کمک به حفظ رطوبت و بهبود حالت‌پذیری مو، می‌تواند موها را خوش‌حالت‌تر و درخشان‌تر نشان دهد.\n\n۲. فاکتور رشد اپیدرمی (EGF)\n\nEGF یا فاکتور رشد اپیدرمی، ترکیبی شناخته‌شده در محصولات مراقبت از پوست است که در فرمولاسیون برخی محصولات مراقبت از مو و پوست سر نیز استفاده می‌شود. حضور این ماده در فرمول محصول با هدف ارتقای مراقبت از پوست سر و کمک به حفظ ظاهر سالم آن در نظر گرفته شده است.\n\n۳. کلاژن (Collagen)\n\nکلاژن یکی از ترکیبات پرکاربرد در محصولات مراقبتی و زیبایی است. در محصولات مو، کلاژن می‌تواند به بهبود حس نرمی، لطافت و ظاهر انعطاف‌پذیر تارهای مو کمک کند و موها را خوش‌حالت‌تر نشان دهد.\n\nاین شامپو برای چه کسانی مناسب است؟\n\nافرادی با موهای نازک و کم‌حجم\n\nافرادی که موهایشان سریع حالت خوابیده و بی‌حالت پیدا می‌کند\n\nکسانی که به دنبال شامپوی حجم‌دهنده برای روتین مراقبت از مو هستند\n\nافرادی که به نرمی، لطافت و خوش‌حالتی موهای خود اهمیت می‌دهند\n\nکسانی که می‌خواهند در کنار پاکسازی مو، از ترکیبات مراقبتی نیز بهره‌مند شوند\n\nروش استفاده\n\n۱. موهای خود را با آب ولرم کاملاً خیس کنید.\n\n۲. مقدار مناسبی از شامپو را روی کف دست ریخته و روی پوست سر و موها پخش کنید.\n\n۳. با نوک انگشتان، پوست سر را به‌آرامی ماساژ دهید تا کف ایجاد شود.\n\n۴. موها را به‌خوبی با آب ولرم آبکشی کنید.\n\n۵. در صورت نیاز، شست‌وشو را تکرار کنید.\n\nبرای مراقبت بهتر از موهای",
    "descriptionEn": "SUNGBOON EDITOR Silk Peptide EGF Collagen Intensive Volume Shampoo by SUNGBOON EDITOR.",
    "price": 6288000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4785/16688bd54bac11e22e0649746fa7fdd4.png"
    ],
    "sizes": [
      {
        "label": "حجم ۴۰۰ میلی‌لیتر",
        "labelEn": "400 ml",
        "price": 6288000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1751",
        "name": "حجم ۴۰۰ میلی‌لیتر",
        "nameEn": "400 ml",
        "price": 6288000,
        "stockCount": 1,
        "sku": "IN1794276890"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پپتایدهای فعال و فاکتور رشد EGF",
        "nameEn": "Bio-Active Peptides & EGF",
        "description": "تقویت ریشه مو و مژه، حمایت از استحکام ساختار کراتینی و بهبود لطافت و پرپشتی."
      },
      {
        "nameFa": "کلاژن هیدرولیزشده",
        "nameEn": "Hydrolyzed Collagen",
        "description": "کمک به حفظ رطوبت، افزایش حجم و قوام تارهای مو، مژه و نرمی بافت لب."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      }
    ],
    "usageRoutine": {
      "morning": "روی مو و کف سر خیس ماساژ دهید، ۱ تا ۲ دقیقه صبر کرده و کامل آبکشی کنید.",
      "night": "روی مو و کف سر خیس ماساژ دهید، ۱ تا ۲ دقیقه صبر کرده و کامل آبکشی کنید."
    },
    "badges": [
      "پپتاید ابریشم + EGF + کلاژن",
      "افزایش حجم مو",
      "ساخت کره"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "کره جنوبی",
    "expiryDate": "۲۰۲۹",
    "targetAudience": "موهای نازک، کم‌حجم و بی‌حالت نیازمند شست‌وشوی ملایم و حجم‌دهی.",
    "unsuitableFor": "از تماس با چشم خودداری شود."
  },
  {
    "id": "product-pori-1313",
    "nameFa": "برس حرارتی بخار صاف‌کننده مو هیدرا شات پرو شیگلم",
    "nameEn": "SHEGLAM Hydra Shot Steam Straightening Brush Pro",
    "brand": "SHEGLAM",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: برس بخار نانو",
    "howToUse": "مخزن آب را پر کنید، دمای مناسب جنس مو را برگزینید و روی موهای خشک به آرامی شانه کنید.",
    "ingredientTags": [
      "biotin",
      "silk-keratin",
      "salicylic-dandruff",
      "ceramic-ionic"
    ],
    "descriptionFa": "برس حرارتی با بخار صاف‌کننده مو شیگلم\n\nتجربه‌ای حرفه‌ای از صافی و درخشندگی مو در خانه\n\nاگر به دنبال ابزاری حرفه‌ای برای صاف کردن موها بدون ایجاد خشکی و وز هستید، Hydra Shot Steam Straightening Brush Pro انتخابی ایده‌آل برای شماست. این برس بخار با ترکیب فناوری بخار نانو، تنظیمات دمای متنوع و طراحی ارگونومیک، به شما کمک می‌کند در مدت زمان کوتاهی موهایی صاف، نرم و براق داشته باشید.\n\n- فناوری بخار نانو (Nano Steam)\n\nبخار نانو به پخش یکنواخت رطوبت روی تارهای مو کمک می‌کند تا موها نرم‌تر شده و هنگام صاف کردن، وز و خشکی کاهش یابد.\n\n۱۲ سطح تنظیم دما\n\nاین دستگاه دارای ۱۲ درجه تنظیم دما از ۱۲۰ تا ۲۳۰ درجه سانتی‌گراد است و برای انواع مو مناسب است:\n\nموهای نازک و آسیب‌دیده: ۱۲۰ تا ۱۵۰ درجه\n\nموهای معمولی: ۱۵۰ تا ۱۹۰ درجه\n\nموهای ضخیم و فر: ۱۹۰ تا ۲۳۰ درجه\n\n۳ سطح تنظیم بخار\n\nبا سه حالت بخار (کم، متوسط و زیاد) می‌توانید میزان بخار را متناسب با جنس و حجم موهای خود تنظیم کنید.\n\n- پوشش محافظ Keratin Pro™\n\nسطح برس با پوشش محافظ Keratin Pro™ طراحی شده تا حرکت نرم‌تر روی موها را فراهم کرده و به حفظ لطافت و درخشندگی مو کمک کند.\n\n- صفحه نمایش دیجیتال\n\nنمایشگر LED دمای دستگاه را به‌صورت لحظه‌ای نمایش می‌دهد و کنترل تنظیمات را آسان می‌کند.\n\n- مناسب برای سفر\n\nپشتیبانی از ولتاژ دوگانه (Dual Voltage) باعث می‌شود بتوانید از این دستگاه در کشورهای مختلف نیز استفاده کنید.\n\n- صاف کردن سریع و آسان مو\n\n- کاهش وز و ایجاد ظاهری یکدست\n\n- مناسب برای انواع مو\n\n- تنظیم دمای دقیق\n\n- طراحی خوش‌دست و سبک\n\n- گرم شدن سریع\n\n- استفاده آسان در منزل یا سفر\n\nروش استفاده\n\nمخزن آب را با آب تمیز پر کنید.\n\nدستگاه را روشن کرده و دمای مناسب را انتخاب کنید.\n\nشدت بخار را تنظیم نمایید.\n\nپس از آماده شدن دستگاه، موها را به دسته‌های کوچک تقسیم کرده و برس را به‌آرامی از ریشه تا نوک مو حرکت دهید.\n\nپس از پایان کار، دستگاه را خاموش کرده و مخزن آب را تخلیه کنید.\n\nمشخصات فنی\n\nنوع محصول: برس بخار صاف‌کننده مو\n\nتعداد تنظیمات دما: ۱۲ سطح\n\nمحدوده دما: ۱۲۰ تا ۲۳۰ درجه سانتی‌گراد\n\nتنظیمات بخار: ۳ سطح\n\nنمایشگر: LED دیجیتال\n\nولتاژ: Dual Voltage\n\nمناسب برای: انواع مو\n\nمحتویات جعبه\n\nبرس بخار Hydra Shot Steam Straightening Brush Pro\n\nمخزن آب\n\nدفترچه راهنمای استفاده\n\nچرا Hydra Shot Steam Straightening Brush Pro؟\n\nاگر به دنبال ابزاری هستید که در کنار صاف کردن مو، ظاهر نرم‌تر و براق‌تری ایجاد کند و امکان تنظیم دما و بخار را متناسب با نوع موی شما فراهم سازد، Hydra Shot Steam Straightening Brush Pro می‌تواند گزینه‌ای مناسب برای استفاده روزانه و حرفه‌ای باشد.",
    "descriptionEn": "SHEGLAM Hydra Shot Steam Straightening Brush Pro by SHEGLAM.",
    "price": 21514000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3123/f0c3120945aa0a9a4e5a3ed1d5a1f1ef.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3120/264b6d6375c4c6f3eb99bb4601520a46.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3121/a5da50d9342dbccd49ad78f8f18e3c3b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3124/5086195f58f61b83d2d1bb8a4c39f07f.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3125/6b6a672a7d6f0633ffcb04b9928ea151.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3126/b1fe016e560f159810524639dcbb1e7f.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3122/f9011d4a4acbb92f6765406e62c95f1b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3128/24327d2910a0dfaaef81780750fe4038.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/3127/7a5af2057554bce93514bd57c5ec0c4a.jpeg"
    ],
    "sizes": [
      {
        "label": "مدل Hydra Shot Pro",
        "labelEn": "Pro Steam Edition",
        "price": 21514000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1440",
        "name": "مدل Hydra Shot Pro",
        "nameEn": "Pro Steam Edition",
        "price": 21514000,
        "stockCount": 1,
        "sku": "IN1784981652"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "سالیسیلیک اسید و کمپلکس ضدشوره",
        "nameEn": "Salicylic Acid & Piroctone Olamine",
        "description": "پاکسازی عمیق پوست سر، رفع پوسته‌ریزی و کنترل قارچ‌های عامل شوره بدون التهاب."
      },
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "مخزن آب را پر کنید، دمای مناسب جنس مو را برگزینید و روی موهای خشک به آرامی شانه کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "بخار نانو ضدوز",
      "۱۲ سطح دما (۱۲۰–۲۳۰°C)",
      "۳ سطح بخار"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "صاف کردن موهای فر، ضخیم یا وز با رطوبت‌رسانی هم‌زمان بخار نانو.",
    "unsuitableFor": "فقط از آب تصفیه‌شده یا مقطر در مخزن استفاده شود."
  },
  {
    "id": "product-pori-1170",
    "nameFa": "رژ لب مایع براق ماندگار سوپر استی وینیل اینک میبلین مدل 100 Charmed",
    "nameEn": "Maybelline Super Stay Vinyl Ink Liquid Lipcolor - 100 Charmed",
    "brand": "Maybelline",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: رژ مایع براق ۱۶ ساعته",
    "howToUse": "قبل از استفاده بطری را ۵ ثانیه تکان دهید و روی لب‌های تمیز و خشک اعمال کنید.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "رژ لب مایع براق میبلین مدل Super Stay Vinyl Ink شماره 100 CHARMED\n\nاین رژ از محصولات جذاب و برتر برند معتبر میبلین در دنیای آرایش است. این رژ لب با ویژگی‌ها و فرمولاسیون خاص خود، توانسته است تا به توجه زیادی از طرفداران آرایش و زیبایی جلب کند.\n\nرنگ charmed با کد ۱۰۰، یک رنگ هوشمندانه و خلاقانه است که به لب‌ها شادابی و جلوه‌ی خوش‌پوشانه‌ای می‌بخشد. این رنگ با طیف وسیعی از پوست‌ها سازگاری دارد و به طرز ماندگاری برجسته‌ای به آرایش شما زنده‌ای و جذابیت می‌بخشد.\n\nیکی از ویژگی‌های مهم این رژ لب، ماندگاری بسیار بالاست. فرمولاسیون Super Stay Vinyl Ink باعث می‌شود تا رنگ روی لب‌ها به طور طولانی‌مدت حفظ شود و شما نیاز به تجدید رنگ را به حداقل برسانید. حتی در مقابل فعالیت‌های روزانه مانند خوردن و نوشیدن، رژ لب همچنان ثابت و جذاب روی لب‌ها باقی می‌ماند.\n\nبرای استفاده بهتر از این رژ لب، می‌توانید لب‌ها را از چربی و آلودگی پاک کرده و سپس با دقت از اپلیکاتور محصول استفاده کنید. این اپلیکاتور دقیق به شما امکان می‌دهد تا رنگ را به شکل یکنواخت و دقیق بر روی لب‌ها بگذارید.\n\nبا خرید رژ لب مایع میبلین با کد رنگ ۱۰۰، می‌توانید زیبایی لب‌های خود را با رنگی خلاقانه و زنده تزئین کرده و از آرایشی جذاب و ماندگار لذت ببرید.\n\nماندگاری بالا: رنگ تا ساعت‌ها بدون نیاز به تجدید باقی می‌ماند.\n\nبراقیت و جلوه وینیل: لب‌ها حجیم‌تر و جذاب‌تر دیده می‌شوند.\n\nرنگ‌دهی قوی: حتی رنگ‌های روشن پوشش‌دهی عالی دارند.\n\nآسانی در استفاده: اپلیکاتور دقیق و انعطاف‌پذیر برای پخش یکنواخت رنگ.\n\nاحساس راحتی روی لب: نه سنگین است و نه لب‌ها را خشک می‌کند.\n\nتنوع رنگی بالا: انتخاب مناسب برای هر نوع پوست و سبک آرایش.",
    "descriptionEn": "Maybelline Super Stay Vinyl Ink Liquid Lipcolor - 100 Charmed by Maybelline.",
    "price": 2558000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2327/545ea337129db973c3157d42bb24bd69.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2328/307ca09a8b9e9c497921d51f35ac2808.webp"
    ],
    "sizes": [
      {
        "label": "شماره ۱۰۰ Charmed",
        "labelEn": "100 Charmed - 4.2 ml",
        "price": 2558000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1293",
        "name": "شماره ۱۰۰ Charmed",
        "nameEn": "100 Charmed - 4.2 ml",
        "price": 2558000,
        "stockCount": 1,
        "sku": "IN1779678160"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "قبل از استفاده بطری را ۵ ثانیه تکان دهید و روی لب‌های تمیز و خشک اعمال کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "براق و ضدانتقال",
      "ماندگاری طولانی",
      "رنگ Charmed"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا / فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "دوام طولانی در طول روز همراه با درخشش وینیلی شیک.",
    "unsuitableFor": "با پاک‌کننده آرایش دوفاز یا روغنی پاک شود."
  },
  {
    "id": "product-pori-1117",
    "nameFa": "ست برس سشوار تاشو ۸ کاره انزو مدل EN-6208",
    "nameEn": "ENZO EN-6208 Foldable Hair Dryer Brush Set (8-in-1)",
    "brand": "ENZO",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: ست سشوار ۸ کاره تاشو",
    "howToUse": "سری دلخواه (برس گرد حجم‌دهنده، لوله‌های فر یا سری صاف‌کننده) را نصب و روی موی نم‌دار خشک‌حالت‌دهی کنید.",
    "ingredientTags": [
      "ceramic-ionic"
    ],
    "descriptionFa": "ست برس سشوار تاشو انزو ENZO EN 6208 - 8 عدد لوازم جانبی حالت دهنده مو\n\nENZO EN 6208 Foldable Hair Dryer Brush Set – 8 Accessories Styling Kit\n\nست برس سشوار تاشو ENZO EN 6208 یک راه‌حل کاربردی برای حالت دادن به مو، خشک کردن، صاف کردن، فر کردن و حجم دادن به مو ارائه می‌دهد. این ابزار جمع و جور، قدرت جریان هوا را با لوازم جانبی حالت دهنده قابل تعویض ترکیب می‌کند. در نتیجه، کاربران می‌توانند بدون استفاده از چندین دستگاه، چندین مدل مو ایجاد کنند. طراحی تاشو همچنین قابلیت حمل را بهبود می‌بخشد و نگهداری یا حمل این ابزار را در طول سفر آسان می‌کند.\n\nدرباره حالت دهنده موی ENZO 8 لوازم جانبی\n\nحالت دهنده موی ENZO 8 لوازم جانبی، گزینه‌های حالت دهنده انعطاف‌پذیری را برای استفاده روزمره ارائه می‌دهد. هر لوازم جانبی هدف خاصی را دنبال می‌کند و به کاربران کمک می‌کند تا حجم، موهای صاف یا فرهای مو را شکل دهند. به عنوان مثال، برس‌های گرد به بلند کردن ریشه‌ها و افزایش حجم مو کمک می‌کنند. در همین حال، لوله‌های فرکننده، امواج نرم و فرهای مشخص را ممکن می‌سازند. علاوه بر این، نازل متمرکز کننده جریان هوا را دقیقاً برای حالت دادن کنترل شده هدایت می‌کند.\n\n۸ لوازم جانبی حرفه‌ای حالت‌دهنده مو قابل تعویض\n\n- دسته تاشو برای نگهداری جمع و جور\n\n- برس‌های گرد برای حجم‌دهی و حالت‌دهی\n\n- سری‌های فرکننده برای فرهای نرم\n\nدیفیوزر برای ایجاد بافت طبیعی\n\n- نازل متمرکزکننده برای جریان هوای متمرکز\n\n- طراحی بدنه ارگونومیک سبک\n\nمناسب برای استفاده در منزل یا سالن\n\n- سیستم جریان هوای متعادل به کاهش زمان حالت‌دهی مو کمک می‌کند و در عین حال نتایج صافی را حفظ می‌کند. علاوه بر این، دسته ارگونومیک کنترل بهتری را در طول جلسات طولانی‌تر حالت‌دهی مو فراهم می‌کند. بنابراین، کاربران می‌توانند چندین مرحله حالت‌دهی مو را با استفاده از یک دستگاه انجام دهند. در مجموع، مجموعه برس سشوار تاشو ENZO EN 6208 یک راه‌حل قابل اعتماد و همه‌کاره برای حالت‌دهی مدرن مو ارائه می‌دهد",
    "descriptionEn": "ENZO EN-6208 Foldable Hair Dryer Brush Set (8-in-1) by ENZO.",
    "price": 26378000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2113/accfb132687152d37887c0aef0df9b48.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2115/aa9d31cb9feee0995c846d028cb96090.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2116/15dc40d5ec064831b220a4c62f13f414.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2114/7cda5ecbecd6cdf1196efbaf20aeec25.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2111/6450ea07977f222cbcc41401fc907aa2.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2112/79dae5e408b362f6e23d0800bb61cfca.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2117/1b73e110dce003033944b3518d004dc6.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2120/241b101bdf1444ab2ccf6e9aa946ceed.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2118/32fa3e1142cb748da88a3bbe187d0049.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2119/bd58a660e52d82f084594e31bedf5c14.jpeg"
    ],
    "sizes": [
      {
        "label": "۸ سری قابل تعویض + کیف",
        "labelEn": "8-Piece Styling Kit",
        "price": 26378000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1232",
        "name": "۸ سری قابل تعویض + کیف",
        "nameEn": "8-Piece Styling Kit",
        "price": 26378000,
        "stockCount": 1,
        "sku": "IN1777590978"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "سری دلخواه (برس گرد حجم‌دهنده، لوله‌های فر یا سری صاف‌کننده) را نصب و روی موی نم‌دار خشک‌حالت‌دهی کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۸ سری متنوع",
      "طراحی تاشو مسافرتی",
      "تنظیم دما و باد"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انزو پروفشنال",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "خشک کردن، حجم‌دهی ریشه، فر و صاف کردن مو در خانه و سفر.",
    "unsuitableFor": "از مسدود کردن ورودی هوا حین کار جلوگیری کنید."
  },
  {
    "id": "product-pori-1085",
    "nameFa": "پالت سایه چشم ۱۴ رنگ سافت گلم آناستازیا بورلی هیلز",
    "nameEn": "Anastasia Beverly Hills Soft Glam Eyeshadow Palette",
    "brand": "Anastasia Beverly Hills",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت سایه حرفه‌ای لوکس",
    "howToUse": "با براش دوطرفه داخل پالت، سایه‌ها را به‌آرامی روی پلک ترکیب کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پالت سایه آناستازیا سافت گلم\n\nپالت سایه چشم Soft Glam آناستازیا بورلی هیلز که تقریباً مطمئناً به پرطرفدارترین پالت این فصل تبدیل خواهد شد، دارای ۱۴ پودر با رنگدانه‌های بسیار قوی و ماندگاری بالا در طیفی از رنگ‌های خنثی، رنگین‌کمانی مسحورکننده و متالیک‌های جذاب است. سایه‌های صورتی پاستلی، قهوه‌ای گرم و هلویی وجود دارد که این پالت را به پالتی ایده‌آل برای آرایش روز و شب تبدیل می‌کند - و کمی هم «عروسی» است (آیا زنگ‌های عروسی را می‌شنویم!؟). این مجموعه هوشمندانه با هفت سایه کاملاً جدید و هفت رنگ محبوب آشنا، به ظاهر پلک شما جانی تازه - و به طرز رشک‌برانگیزی - می‌بخشد. بژ مخملی فوق‌العاده مات «تمپرا»، طلایی رنگین‌کمانی با کمی صورتی «گلیستنیگ»، هلویی پاستلی فوق‌العاده مات «نارنجی سودا»، رزگلد با صورتی ملایم رنگین‌کمانی «رز پینک»، قهوه‌ای شکلاتی گرم متالیک «سولتری»، برنز طلایی متالیک «برنز»، توتی فوق‌العاده مات «مالبری»، یاسی غبارآلود فوق‌العاده مات «داستی رز»، طلایی روشن چندبعدی «فیری»، نارنجی پررنگ فوق‌العاده مات «برنت اورنج»، قهوه‌ای خاکی فوق‌العاده مات «سینا»، قهوه‌ای دارچینی پررنگ فوق‌العاده مات «روستیک»، قهوه‌ای تیره فوق‌العاده مات «سیپروس آمبر» و در آخر، مشکی کربنی پررنگ فوق‌العاده مات «نوآر».\n\n- جنس رویه پالت: مخملی و پارچه ای\n\n- دارای 14 رنگ\n\n- 9 رنگ مات و 5 رنگ شاین دار\n\n- رنگ های گرم و کاربردی\n\n- پیگمنت بسیار بالا\n\n- ماندگاری طولانی مدت\n\n- بدون ریزش\n\n- استفاده آسان\n\n- بافت نرم و پودری\n\n- مناسب برای انواع رنگ پوست\n\n- دارای آینه بزرگ و براش دو سر کاربردی\n\n- فاقد تست حیوانی\n\n- فاقد پارابن، سولفات و فتالات",
    "descriptionEn": "Anastasia Beverly Hills Soft Glam Eyeshadow Palette by Anastasia Beverly Hills.",
    "price": 8564000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1993/3fccf91e967f755bd70bba437b54c6c5.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1992/d824eb19552c9438a58ec09bc2f2f7c4.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1994/fa880f063842ba703ed7131431a10fcd.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1991/98b6a4f9cc3112530aec90056c1dfda0.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1995/994cea98f1b5c3a8209f87303c0e0f2f.webp"
    ],
    "sizes": [
      {
        "label": "۱۴ رنگ (۹.۸ گرم)",
        "labelEn": "14 Shades",
        "price": 8564000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1200",
        "name": "۱۴ رنگ (۹.۸ گرم)",
        "nameEn": "14 Shades",
        "price": 8564000,
        "stockCount": 1,
        "sku": "IN1775750034"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با براش دوطرفه داخل پالت، سایه‌ها را به‌آرامی روی پلک ترکیب کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۱۴ رنگ مات و متالیک",
      "پالت پرفروش عروس",
      "پیگمنت فوق‌العاده"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آرایش روزانه ملایم، اسموکی گرم و میکاپ حرفه‌ای عروس و مهمانی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-1017",
    "nameFa": "ست سشوار و حالت‌دهنده سریع کراتینه انزو مدل EN-6227",
    "nameEn": "ENZO EN-6227 Keratin High Speed Air Styler Set",
    "brand": "ENZO",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: ایر استایلر کراتینه BLDC",
    "howToUse": "موی نم‌دار را با متمرکزکننده یا برس پارویی خشک و صاف کرده و با نازل فرکننده حالت دهید.",
    "ingredientTags": [
      "biotin",
      "silk-keratin",
      "ceramic-ionic"
    ],
    "descriptionFa": "سشوار انزو مدل ۶۲۲۷ ست حالت دهنده موی سریع کراتینه با کیسه PU\n\nEnzo_6227 Keratin High Speed Air Styler Set With PU Bag\n\nاین مجموعه با طراحی نمادین قرمز کوکاکولا، توجه هر آرایشگر یا کاربر خانگی را به خود جلب می‌کند. این مجموعه با موتور BLDC اقتصادی، با عملکرد عالی و در عین حال مقرون به صرفه‌تر ارائه می‌شود. ما در مجموع 5 نازل برای نیازهای مختلف حالت دادن به موهای شما آماده کرده‌ایم: 2 نازل فر کننده مو، 1 نازل برس بیضی شکل حجم دهنده، 1 نازل برس گرد حجم دهنده، 1 نازل برس پارویی. همه نازل‌ها با رنگ تیتانیوم فیوژن پوشانده شده‌اند و حالت دادن به موهای شما را بادوام، براق و حالت دادن به موها را آسان می‌کنند.\n\nنازل صاف کننده برای خشک کردن و حالت دادن همزمان موهای شما طراحی شده است و در عرض چند دقیقه موهای شما را صاف و بدون وز می کند. متمرکز کننده حالت دهنده به شما این امکان را می دهد که جریان هوا را بر روی بخش های خاصی از موهای خود متمرکز کنید و آن را برای ایجاد حالت های صاف و صاف یا حجم دادن به موهای خود عالی می کند. و دیفیوزر برای تقویت بافت طبیعی موهای شما، ایجاد فر و موج های مشخص عالی است.\n\nمدل:۶۲۲۷",
    "descriptionEn": "ENZO EN-6227 Keratin High Speed Air Styler Set by ENZO.",
    "price": 12797000,
    "originalPrice": 12936000,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1813/5ebf5b882cf714e98f1f466bf31ac9e4.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1812/e945261b247deb4cd5bf62e6112380b8.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1814/5eaed29a78530ec98dfa933d4fab400a.webp"
    ],
    "sizes": [
      {
        "label": "۵ نازل تیتانیوم + کیف PU",
        "labelEn": "5 Nozzles + PU Bag",
        "price": 12797000,
        "originalPrice": 12936000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1121",
        "name": "۵ نازل تیتانیوم + کیف PU",
        "nameEn": "5 Nozzles + PU Bag",
        "price": 12797000,
        "originalPrice": 12936000,
        "stockCount": 1,
        "sku": "IN1770025128"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "موی نم‌دار را با متمرکزکننده یا برس پارویی خشک و صاف کرده و با نازل فرکننده حالت دهید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "موتور پرسرعت BLDC",
      "۵ نازل روکش تیتانیوم",
      "کیف چرمی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انزو پروفشنال",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "حالت‌دهی سریع با قدرت موتور BLDC و درخشش بیشتر موها.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-984",
    "nameFa": "نرم‌کننده بدون آبکشی و تقویت‌کننده رزماری و نعناع میله",
    "nameEn": "Mielle Rosemary Mint Strengthening Leave-In Conditioner",
    "brand": "Mielle",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body",
      "hydration"
    ],
    "routines": [
      "morning",
      "night"
    ],
    "routineStep": "مراقبت مو: نرم‌کننده لیو-این بدون آبکشی",
    "howToUse": "پس از حمام روی موی نم‌دار به صورت یکنواخت پخش و شانه کنید؛ نیاز به آبکشی ندارد.",
    "ingredientTags": [
      "jojoba-oils",
      "rosemary",
      "biotin"
    ],
    "descriptionFa": "نرم کننده ضدریزش و تقویت کننده رزماری میله\n\nنرم‌کننده تقویت‌کننده رزماری و نعناع ما، تعادل کاملی از قدرت و رطوبت را برای بهبود وضعیت کلی مو و پوست سر فراهم می‌کند. فوراً نرم و باز می‌شود تا حالت‌پذیری افزایش یابد. از موهای بلندتر و سالم‌تر پشتیبانی می‌کند.\n\nعصاره رزماری در این محصول تاثیرگذار و درمانی قوی می‌باشند. این محصول چربی کف سر را تنظیم می‌کند و مانع از خشکی زیاد یا ترشح بیش از حد چربی می‌شود. همچنین پس فولیکول موها تقویت می‌شود؛ مو سالم و شاداب به نظر می‌رسد و به راحتی حالت می‌پذیرد. ساختمان مو را بهبود می‌بخشد و نرمی و درخشش به مو باز می‌گردد. pH این محصول متعادل شده و مناسب با ساختار موها می‌باشد.\n\n- تقویت کننده رشد موها\n\n- افزایش استحکام فولیکول موها\n\n- کنترل کننده چربی کف سر\n\n- تقویت کننده فولیکول موها\n\n- افزایش سلامت و شادابی موها\n\n- بهبود ساختمان مو\n\n- افزایش سلامت و شادابی مو\n\n- نرم کننده\n\n- مناسب انواع مو\n\n- مناسب استفاده روزانه",
    "descriptionEn": "Mielle Rosemary Mint Strengthening Leave-In Conditioner by Mielle.",
    "price": 2414000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1735/865f6050e87a9c6ba19c599b2b02ae2e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1737/593a692d0fdfb173c9f5d4c9c74a31a7.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1736/6d8f53f3283d4db71d51e022f4ff6dae.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۳۵۵ میلی‌لیتر",
        "labelEn": "355 ml",
        "price": 2414000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1085",
        "name": "حجم ۳۵۵ میلی‌لیتر",
        "nameEn": "355 ml",
        "price": 2414000,
        "stockCount": 1,
        "sku": "IN1766677136"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "کمپلکس روغن‌های گیاهی مغذی",
        "nameEn": "Nourishing Botanical Oils",
        "description": "تغذیه عمیق، ایجاد درخشش طبیعی و محافظت از لب، پوست یا تار مو در برابر خشکی."
      },
      {
        "nameFa": "عصاره رزماری خالص",
        "nameEn": "Rosmarinus Officinalis (Rosemary) Extract",
        "description": "تحریک گردش خون پوست سر، تقویت فولیکول‌ها، کنترل چربی کف سر و کمک به کاهش ریزش مو."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "پس از حمام روی موی نم‌دار به صورت یکنواخت پخش و شانه کنید؛ نیاز به آبکشی ندارد.",
      "night": "پس از حمام روی موی نم‌دار به صورت یکنواخت پخش و شانه کنید؛ نیاز به آبکشی ندارد."
    },
    "badges": [
      "رزماری + نعناع + بیوتین",
      "بدون نیاز به آبکشی",
      "تقویت‌کننده"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "باز کردن گره مو، آبرسانی ساقه و تقویت رشد و استحکام تار مو.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-941",
    "nameFa": "سشوار ایررپ ۶ کاره طرح دایسون انزو پروفشنال مدل EN-4133",
    "nameEn": "ENZO Professional 6-in-1 Airwrap Styler EN-4133",
    "brand": "ENZO",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: ایررپ ۶ کاره یونی",
    "howToUse": "روی موی ۸۰٪ خشک با سری‌های دوگانه چپ و راست فرهای حجیم و یا با برس بیضی صاف‌سازی انجام دهید.",
    "ingredientTags": [
      "silk-keratin",
      "ceramic-ionic"
    ],
    "descriptionFa": "سشوار ایررپ 6 کاره انزو پرو طرح دایسون مدل 4133\n\nسشوار ایررپ انزو با بهره‌گیری از جریان هوای متمرکز و سری‌های تخصصی، به‌راحتی می‌تواند موها را بدون آسیب حرارتی حالت دهد. برخلاف سشوارهای معمولی، این مدل از ترکیب جریان هوا و حرارت ملایم استفاده می‌کند و همین موضوع باعث کاهش آسیب به موها می‌شود.\n\nبرس حرارتی آن برای صاف‌کردن سریع موها بسیار مناسب است و سری‌های فرکننده به‌خوبی موها را در حالت پیچشی نگه می‌دارند. به لطف وجود تکنولوژی یون‌سازی، موها بعد از استفاده درخشان، براق و بدون الکتریسیته ساکن خواهند بود.\n\n- با ست موی پیشرفته Airwrap ما، که برای ارائه حالت‌دهی با کیفیت سالنی - در راحتی خانه خودتان - طراحی شده است، تعادل بی‌نظیری از فناوری و سبک را کشف کنید.\n\n- اتصالات دوگانه Airwrap (1.2 اینچ): فرهای بی‌نقصی را در هر دو جهت - راست یا چپ - برای حجم و حالت طبیعی و ماندگار ایجاد کنید.\n\n- برس حجم‌دهنده بیضی بزرگ: پرپشتی را اضافه می‌کند و مو را از ریشه بلند می‌کند و جلوه‌ای حرفه‌ای برای سشوار ایجاد می‌کند.\n\n- برس حالت‌دهنده گرد: ایده‌آل برای دستیابی به مدل‌های موی شاداب و پرپشت با حرکت و حالت.\n\n- فناوری پیشرفته صاف‌کننده: برس سفت، وز و فر را کاهش می‌دهد و موها را صاف، براق و ابریشمی می‌کند.\n\n- دما و سرعت قابل تنظیم: بین 50 تا 110 درجه سانتیگراد انتخاب کنید و گرما را با توجه به نوع موی خود - از نازک و ظریف تا ضخیم و قوی - تنظیم کنید.\n\n- گرمایش سرامیکی: گرما را به طور مساوی توزیع می‌کند و از خشک شدن و آسیب دیدن مو جلوگیری می‌کند.\n\n- صفحه نمایش دیجیتال LED: امکان کنترل کامل با نمایش دما و زمان در حین حالت‌دهی را فراهم می‌کند.\n\n- مجموعه کامل لوازم جانبی: طراحی چند منظوره که به شما امکان می‌دهد مدل‌های موی مختلفی ایجاد کنید - از کاملاً صاف گرفته تا فرهای غلیظ و حجیم.\n\n- هر روز به ظاهری بی‌عیب و نقص دست یابید - با ابزاری که موهای شما را درک می‌کند.",
    "descriptionEn": "ENZO Professional 6-in-1 Airwrap Styler EN-4133 by ENZO.",
    "price": 15514000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1815/6888bc0825b380ceee6c1df44f889ba1.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1635/e6af67e7636d5940607d2d849cff8700.jpeg"
    ],
    "sizes": [
      {
        "label": "صورتی",
        "labelEn": "صورتی",
        "price": 15514000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1031",
        "name": "صورتی",
        "nameEn": "صورتی",
        "price": 15514000,
        "stockCount": 1,
        "sku": "IN1763853752",
        "colorCode": "#ff2d2d"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "روی موی ۸۰٪ خشک با سری‌های دوگانه چپ و راست فرهای حجیم و یا با برس بیضی صاف‌سازی انجام دهید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۶ سری Airwrap",
      "فناوری یون منفی",
      "بدون آسیب حرارتی شدید"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انزو پروفشنال",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "حالت‌دهی سالنی (فر، ویو، حجم‌دهی و صافی) در خانه.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-938",
    "nameFa": "رژگونه و رژلب حرارتی تغییر رنگ‌دهنده با pH پوست بلادلاین شیگلم",
    "nameEn": "SHEGLAM Bloodline pH Color Changing Blush & Lip",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب و گونه: رژگونه pH واکنش‌پذیر",
    "howToUse": "مقدار بسیار کمی را روی گونه یا لب بزنید و سریع با دست پخش کنید تا با pH پوست رنگ اختصاصی بسازد.",
    "ingredientTags": [
      "vitamin-e",
      "hyaluronic-acid",
      "mineral-pigments"
    ],
    "descriptionFa": "رژگونه حرارتی ‌رد خون شیگلم\n\nاین رژگونه شگفت انگیز با توجه به تغییر pH پوست، شروع به تغییر رنگ می کند و در هر بازه زمانی، رنگی فوق العاده و جدید ارائه می دهد. قابل توجه است که هم به عنوان رژگونه و هم به عنوان رژ لب قابل استفاده است. رنگ در نظر گرفته شده برای هر طیف رنگی پوست، مناسب است و زیبایی و شادابی صورت را چند برابر می کند. رنگ آن از طیف صورتی به قرمز در نوسان است و همین قابلیت در میان مصرف کنندگان بسیار جذاب و محبوب است. نحوه استفاده از آن نیز بسیار آسان است و کافی است با دست بر گونه پخش شود.\n\n- ماندگاری بالا\n\n- پیگمنت بالا و buildable\n\n- رطوبت رسان\n\n- بافت کرمی و سبک\n\n- جلوه ای درخشان و زیبا\n\n- بِلِندینگ آسان\n\n- مناسب انواع تناژ پوستی\n\n- حاوی هیالورونات سدیم، ویتامین E و پروتئین گیاهی\n\n- وگان",
    "descriptionEn": "SHEGLAM Bloodline pH Color Changing Blush & Lip by SHEGLAM.",
    "price": 1357000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1629/e3b8cf31d0acb23c08c14446930f83e2.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1630/362bacb35ff03a6cee4f49a038774f1b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1628/84ca83a0f55bab88a0dca33db7f0ed3b.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۲.۷ گرم",
        "labelEn": "2.7 g",
        "price": 1357000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1028",
        "name": "وزن ۲.۷ گرم",
        "nameEn": "2.7 g",
        "price": 1357000,
        "stockCount": 1,
        "sku": "IN1763271049"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "مقدار بسیار کمی را روی گونه یا لب بزنید و سریع با دست پخش کنید تا با pH پوست رنگ اختصاصی بسازد.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "تغییر رنگ با pH پوست",
      "هیالورونات + ویتامین E",
      "وگان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ایجاد رنگ صورتی تا قرمز طبیعی متناسب با تناژ پوست هر فرد.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-907",
    "nameFa": "برس حرارتی ۴ در ۱ حجم‌دهنده بلوآوت بلیس شیگلم",
    "nameEn": "SHEGLAM Blowout Bliss 4-in-1 Volumizing Hot Air Brush",
    "brand": "SHEGLAM",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: برس سشوار ۴ کاره",
    "howToUse": "برای موهای مرطوب یا خشک، ۳ تنظیم دما را متناسب با ضخامت مو انتخاب کرده و از ریشه به سمت نوک بکشید.",
    "ingredientTags": [
      "ceramic-ionic"
    ],
    "descriptionFa": "برس حرارتی ۴در ۱ حجم‌دهنده شیگلم\n\nطراحی چند منظوره، سبک نامحدود این برس سشوار ۴ کاره، عملکردهای سشوار، شانه، فرکننده و صاف کننده را با هم ترکیب می‌کند، برای موهای مرطوب و خشک مناسب است و می‌تواند به طور موثری آسیب به مو را کاهش دهد. طراحی نوآورانه و سبک آن، استفاده از آن را راحت‌تر و سبک‌تر از بسیاری از محصولات مشابه می‌کند.\n\nموهای ممتاز و طراحی بیضی برس سشوار ما از پین‌های نایلونی و موهای تافت‌دار استفاده می‌کند تا به طور موثر از گره خوردن مو جلوگیری کند و در عین حال نرمی، حجم و براقیت را بهبود بخشد. طراحی منحصر به فرد لوله برس بیضی شکل، حجم مو را بیشتر افزایش می‌دهد و کارایی حالت دادن را بهبود می‌بخشد. این برس سشوار دارای پوشش GLOSS PRO™ است که از مو در برابر گرما محافظت می‌کند و در حین حالت دادن، درخشندگی بیشتری به آن می‌بخشد. این برس می‌تواند رطوبت را در خود نگه دارد، مو را به طور طبیعی براق و بدون وز کند. [مناسب برای انواع مو] با ۳ تنظیم حرارت و سرعت، به علاوه‌ی گزینه‌ی هوای خنک، گزینه‌های متنوع حالت‌دهی و نتایج عالی برای انواع مو ارائه می‌دهد. این دستگاه می‌تواند زمان سشوار کشیدن در سالن را به نصف کاهش دهد، نه تنها سرعت خشک کردن را افزایش می‌دهد، بلکه جلوه‌ای بی‌نظیرتر به موها می‌دهد.",
    "descriptionEn": "SHEGLAM Blowout Bliss 4-in-1 Volumizing Hot Air Brush by SHEGLAM.",
    "price": 10901000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1547/0717868ff5c6ac6b6bebdc9f7f74c2c0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1546/d48cca3aa519f525dd61acce1c3f4073.jpeg"
    ],
    "sizes": [
      {
        "label": "۳ تنظیم دما + روکش GLOSS PRO",
        "labelEn": "3 Heat Settings",
        "price": 10901000
      }
    ],
    "variants": [
      {
        "id": "var-pori-996",
        "name": "۳ تنظیم دما + روکش GLOSS PRO",
        "nameEn": "3 Heat Settings",
        "price": 10901000,
        "stockCount": 1,
        "sku": "IN1761022328"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "برای موهای مرطوب یا خشک، ۳ تنظیم دما را متناسب با ضخامت مو انتخاب کرده و از ریشه به سمت نوک بکشید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "۴ کاره (سشوار+شانه+فر+صاف)",
      "روکش GLOSS PRO™",
      "ضدگره"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "ایجاد حجم، براشینگ خانگی سریع و کاهش وز مو.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-880",
    "nameFa": "بالم لب ترمیم‌کننده و ضدآفتاب انبه مالیبو SPF30",
    "nameEn": "Malibu Lip Care Mango Balm SPF 30",
    "brand": "Malibu",
    "productType": "lip-care",
    "category": "sunscreen",
    "skinTypes": [
      "dry",
      "normal",
      "sensitive",
      "combination",
      "oily"
    ],
    "concerns": [
      "sunscreen",
      "hydration",
      "barrier-repair"
    ],
    "routines": [
      "morning",
      "hydration"
    ],
    "routineStep": "مراقبت روزانه لب: بالم لب ضدآفتاب SPF30",
    "howToUse": "پیش از قرار گرفتن در آفتاب یا در طول روز به طور منظم روی لب‌ها بکشید و هر ۲ ساعت تمدید کنید.",
    "ingredientTags": [
      "vitamin-e",
      "sun-filters"
    ],
    "descriptionFa": "بالم لب ترمیم کننده انبه مالیبو\n\nبالم لب Malibu Lip Care با طعم انبه SPF30 محافظت پیشرفته در برابر آفتاب را فراهم می‌کند که به محافظت از لب‌ها در برابر اشعه‌های UVA و UVB کمک می‌کند. سازگار با وگان‌ها به حفظ رطوبت و هیدراته نگه داشتن آنها در حین محافظت در برابر آفتاب کمک می‌کند.\n\nبه طور موثر مرطوب می‌کند\n\nاز لب‌ها در تمام شرایط آب و هوایی، به ویژه در برابر دمای بالا محافظت می‌کند\n\nSPF 30 در برابر اشعه‌های UVA و UVB محافظت می‌کند\n\nاز لب‌ها در برابر خشک شدن ناشی از ماندن در اتاق‌های دارای تهویه مطبوع محافظت می‌کند\n\nترکیب منحصر به فرد این بالم به محافظت از لب‌های شما هم در تابستان و هم در زمستان کمک می‌کند.\n\n- آبرسان و رطوبت رسان\n\n- نرم و لطیف کننده\n\n- آنتی اکسیدان\n\n- صاف و یکدست کننده\n\n- تغذیه رسان و تقویت کننده\n\n- ترمیم پوسته پوسته‌های لب\n\n- بافت سبک و جذب سریع\n\n- مناسب پوست نرمال و خشک\n\n- دارای رایحه انبه",
    "descriptionEn": "Malibu Lip Care Mango Balm SPF 30 by Malibu.",
    "price": 927000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1482/cb4c5b3b2252cb538af33074ac0db69b.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1483/673c720b3bab4562ed3f74f112dc0808.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۵ گرم",
        "labelEn": "5 g",
        "price": 927000
      }
    ],
    "variants": [
      {
        "id": "var-pori-962",
        "name": "وزن ۵ گرم",
        "nameEn": "5 g",
        "price": 927000,
        "stockCount": 1,
        "sku": "IN1759768018"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "فیلتر محافظ UV (SPF)",
        "nameEn": "Broad-Spectrum UV Filters",
        "description": "محافظت از پوست و لب در برابر اشعه‌های UVA و UVB و پیشگیری از آسیب نوری."
      }
    ],
    "usageRoutine": {
      "morning": "پیش از قرار گرفتن در آفتاب یا در طول روز به طور منظم روی لب‌ها بکشید و هر ۲ ساعت تمدید کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "SPF30 محافظ UVA/UVB",
      "وگان",
      "ساخت انگلستان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "انگلستان",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "محافظت از لب‌ها در برابر آفتاب، خشکی و ترک‌خوردگی در تابستان و زمستان.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-719",
    "nameFa": "لیپ پلامپر حجم‌دهنده لب بولد بوستر شیگلم",
    "nameEn": "SHEGLAM Bold Booster Lip Plumper - Strawberry Fields",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup",
      "hydration"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش لب: پلامپر حجم‌دهنده",
    "howToUse": "به‌تنهایی یا روی رژلب بزنید تا لب‌ها براق و پرحجم‌تر شوند.",
    "ingredientTags": [
      "vitamin-e",
      "hyaluronic-acid",
      "biotin"
    ],
    "descriptionFa": "لیپ پلامپر شیگلم حجم دهنده\n\nیک حجم‌دهنده لب با فرمول پیشرفته است که به طور طبیعی حجم لب‌ها را افزایش می‌دهد و به آن‌ها جلوه‌ای برجسته، نرم و براق می‌بخشد. این محصول حاوی ترکیبات مغذی و آبرسان است که به حفظ لطافت و سلامت لب‌ها کمک می‌کند.\n\n- افزایش حجم فوری لب‌ها بدون ایجاد احساس ناراحتی شدید\n\n- فرمول سبک و غیرچسبنده که حس سنگینی روی لب ایجاد نمی‌کند\n\n- بافت براق و درخشان برای ایجاد ظاهری جذاب و حجیم\n\n- ماندگاری بالا همراه با احساس نرمی و آبرسانی\n\n- آبرسانی عمیق و حفظ رطوبت لب‌ها\n\n- تحریک جریان خون برای افزایش حجم طبیعی لب‌ها\n\n- خاصیت آنتی‌اکسیدانی و محافظت از لب‌ها در برابر خشکی\n\n- نرمی و لطافت بخشیدن به لب‌ها",
    "descriptionEn": "SHEGLAM Bold Booster Lip Plumper - Strawberry Fields by SHEGLAM.",
    "price": 1072000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1142/c42965266709225da76eed5b86d5553e.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1143/a6aa41b389e092f95502032d359b6bed.jpeg"
    ],
    "sizes": [
      {
        "label": "وزن ۲ گرم | Strawberry Fields",
        "labelEn": "2 g - Strawberry Fields",
        "price": 1072000
      }
    ],
    "variants": [
      {
        "id": "var-pori-792",
        "name": "وزن ۲ گرم | Strawberry Fields",
        "nameEn": "2 g - Strawberry Fields",
        "price": 1072000,
        "stockCount": 1,
        "sku": "IN1749130278"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "هیالورونیک اسید",
        "nameEn": "Hyaluronic Acid",
        "description": "جذب و نگهداری رطوبت برای لطافت لب، زیرساز یکدست آرایش و حفظ آب مو و پوست."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      }
    ],
    "usageRoutine": {
      "morning": "به‌تنهایی یا روی رژلب بزنید تا لب‌ها براق و پرحجم‌تر شوند.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "حجم‌دهی فوری",
      "غیرچسبنده",
      "آبرسان"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "افزایش حجم ظاهری لب با درخشش طبیعی بدون حس چسبندگی.",
    "unsuitableFor": "روی لب‌های زخمی استفاده نشود."
  },
  {
    "id": "product-pori-672",
    "nameFa": "سرم ویال ضدریزش موی بانوان فیتوسیان فیتو (اثربخشی ۸۷٪)",
    "nameEn": "Phyto Phytocyane Revitalizing Anti-Hair Loss Serum for Women",
    "brand": "Phyto",
    "productType": "hair-body",
    "category": "hair-body",
    "skinTypes": [
      "normal",
      "dry",
      "oily",
      "sensitive"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "night"
    ],
    "routineStep": "درمان تخصصی ریزش مو: ویال ضدریزش بانوان",
    "howToUse": "هفته‌ای ۳ بار (در ماه اول) روی کف سر تمیز و مرطوب پخش و ماساژ دهید؛ نیاز به آبکشی ندارد.",
    "ingredientTags": [
      "biotin",
      "silk-keratin",
      "ginkgo-botanical"
    ],
    "descriptionFa": "سرم ضد ریزش مو فیتو سیان مناسب خانم ها ۸۷ درصد فرانسوی\n\nسرم ضد ریزش مو فیتو سیان مناسب خانم ها Phyto cyane Women در بسته بندی جدید برای جلوگیری از ریزش مو در خانم ها تولید شده است. معمولا ریزش مو در بانوان بر اثر عواملی چون بارداری، خستگی و استرس، مصرف داروهای هورمونی و رژیم های سخت غذایی اتفاق می افتد. که منجر به کم شدن حجم مو می شود. محلول فیتوسیان علاوه بر جلوگیری از ریزش مو، به زیبایی و جوان ماندن مو نیز کمک می کند.\n\nبدون نیاز به شست و شو\n\nیک کنسانتره مواد فعال با منشا طبیعی برای اثربخشی سه گانه\n\nکاهش ریزش مو،افزایش تراکم،ایجاد موهای زیبا و سالم\n\n۸۷٪اثربخشی ضدریزش مو بعد از ۲ ماه\n\nحاوی عصاره جینکو بیلوبا،پروتئین های ابریشم و عصاره لاله\n\nسرشار از سیستین و ویتامین های B5 و B6\n\nافزایش حجم و درخشندگی موهای ضعیف\n\nافزایش استحکام و مقاومت موها\n\nآنتی اکسیدان و محافظ موها\n\nکمک به زیبایی و جوان ماندن مو",
    "descriptionEn": "Phyto Phytocyane Revitalizing Anti-Hair Loss Serum for Women by Phyto.",
    "price": 9295000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/1046/16f558a48f6b48cb56097e400f44bf4a.png"
    ],
    "sizes": [
      {
        "label": "۱۲ ویال ۵ میلی‌لیتر",
        "labelEn": "12 × 5 ml Vials",
        "price": 9295000
      }
    ],
    "variants": [
      {
        "id": "var-pori-743",
        "name": "۱۲ ویال ۵ میلی‌لیتر",
        "nameEn": "12 × 5 ml Vials",
        "price": 9295000,
        "stockCount": 1,
        "sku": "IN1746796350"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "عصاره جینکو بیلوبا و گیاهان تقویتی",
        "nameEn": "Ginkgo Biloba & Botanical Extracts",
        "description": "افزایش خون‌رسانی مویرگی به فولیکول‌های مو و کمک به افزایش تراکم و رشد مو."
      }
    ],
    "usageRoutine": {
      "morning": "این محصول برای استفاده در روتین شب طراحی شده است.",
      "night": "هفته‌ای ۳ بار (در ماه اول) روی کف سر تمیز و مرطوب پخش و ماساژ دهید؛ نیاز به آبکشی ندارد."
    },
    "badges": [
      "۸۷٪ کاهش ریزش",
      "جینکو + پروتئین ابریشم + لاله",
      "بدون نیاز به آبکشی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "فرانسه",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "ریزش موی واکنشی بانوان ناشی از استرس، رژیم، خستگی یا پس از بارداری.",
    "unsuitableFor": "فقط برای استعمال خارجی روی پوست سر."
  },
  {
    "id": "product-pori-648",
    "nameFa": "پالت سایه ۹ رنگ تای دای فور شیگلم",
    "nameEn": "SHEGLAM Tie Dye For 9-Color Palette",
    "brand": "SHEGLAM",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: پالت سایه ۹ رنگ",
    "howToUse": "با براش یا انگشت رنگ‌های مات و شاین را روی پلک ترکیب کنید.",
    "ingredientTags": [
      "biotin",
      "mineral-pigments"
    ],
    "descriptionFa": "پالت سایه شیگلم رنگ\n\nتنوع رنگ‌های جذاب و پر انرژی، مناسب انواع سبک‌های آرایش است. از بافت نرم و مخملی آن که به راحتی روی پوست می‌نشیند، لذت ببرید. این پالت با ترکیب رنگ‌های شاد و گرم، چالش‌هایی مانند کم‌رنگ بودن سایه و ماندگاری کوتاه را حل می‌کند. مناسب افرادی است که به دنبال رنگ‌های خلاقانه و با پوشش بالا هستند.\n\n- جلوه مات، شاین و متالیک\n\n- 9 رنگ سایه\n\n- بافت پودری و فشرده\n\n- فاقد الکل، گلوتن و پارابن\n\n- فاقد رایحه\n\n- بسته بندی قابل بازیافت\n\n- فرمولاسیون وگان\n\n- بدون تست حیوانی",
    "descriptionEn": "SHEGLAM Tie Dye For 9-Color Palette by SHEGLAM.",
    "price": 2304000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/994/b86d75d849705844477bcc72393ac5d8.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/996/08f2a7db147da34f8ec1c5c58b9ea60a.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/995/32184fc0425dbee9431d174e9715d0a1.jpeg"
    ],
    "sizes": [
      {
        "label": "۹ رنگ مات، شاین و متالیک",
        "labelEn": "9 Shades",
        "price": 2304000
      }
    ],
    "variants": [
      {
        "id": "var-pori-718",
        "name": "۹ رنگ مات، شاین و متالیک",
        "nameEn": "9 Shades",
        "price": 2304000,
        "stockCount": 1,
        "sku": "IN1746141014"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "با براش یا انگشت رنگ‌های مات و شاین را روی پلک ترکیب کنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "وگان و فاقد عطر",
      "بدون پارابن و الکل",
      "۹ رنگ پرانرژی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "آرایش چشم شاد، گرم و خلاقانه با بافت مخملی.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-601",
    "nameFa": "پرایمر محوکننده منافذ باز د پروفشنال بنفیت",
    "nameEn": "Benefit The POREfessional Face Primer",
    "brand": "Benefit",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "oily",
      "combination",
      "normal",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "زیرساز آرایش: پرایمر تخصصی منافذ",
    "howToUse": "پیش از کرم‌پودر مقدار کمی را با ضربات انگشت روی ناحیه T و منافذ باز بزنید.",
    "ingredientTags": [
      "vitamin-e",
      "biotin",
      "silk-keratin",
      "mineral-pigments"
    ],
    "descriptionFa": "پرایمر پوشاننده منافذ باز بنفیت مدل پروفشنال\n\nاز بهترین و پرفروش ترین پرایمرها در سراسر جهان است. این پرایمر منافذ باز را به وضوح کاهش داده و پوست را برای ایجاد یک آرایش زیبا و بی نقص آماده می سازد. پرایمر صورت پروفشنال بنفیت بافت مخملی و ابریشمی دارد. این پرایمر پوست را فوق العاده نرم و لطیف کرده و پوشش صاف و یکدستی بر روی پوست به وجود می آورد.\n\nپوشاننده منافذ باز پوست\n\n- زیرساز آرایش حرفه ای و آماده سازی پوست برای ایجاد یک آرایش بی نقص\n\n- دارای بافت مخملی و ابریشمی\n\n- نرم کننده و صاف کننده سطح پوست\n\n- حاوی رنگدانه\n\n- ایجاد پوششی یکدست بر روی پوست\n\n- پوشش دهی بالا و تصحیح خطوط، چروک، جای جوش و لک و ...\n\n- افزایش دوام و ماندگاری و کیفیت آرایش\n\n- حاوی ویتامین E و محافظت از پوست در برابر رادیکال های آزاد\n\n- دارای فرمولاسیون سبک و فاقد چربی و روغن",
    "descriptionEn": "Benefit The POREfessional Face Primer by Benefit.",
    "price": 5276000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/890/49521369c60ead601c25619a898e8714.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۲۲ میلی‌لیتر",
        "labelEn": "22 ml",
        "price": 5276000
      }
    ],
    "variants": [
      {
        "id": "var-pori-667",
        "name": "حجم ۲۲ میلی‌لیتر",
        "nameEn": "22 ml",
        "price": 5276000,
        "stockCount": 1,
        "sku": "IN1744493923"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "ویتامین E (توکوفرول)",
        "nameEn": "Tocopherol (Vitamin E)",
        "description": "آنتی‌اکسیدان محافظ برای تغذیه پوست و لب، جلوگیری از خشکی و افزایش ماندگاری بافت آرایشی."
      },
      {
        "nameFa": "بیوتین، سیستئین و کمپلکس ویتامین B",
        "nameEn": "Biotin, L-Cysteine & B-Vitamins",
        "description": "تامین آمینواسیدها و ریزمغذی‌های کلیدی برای استحکام ریشه مو، ضخامت تار مو و سلامت ناخن."
      },
      {
        "nameFa": "پروتئین ابریشم و کراتین محافظ",
        "nameEn": "Silk Proteins & Keratin Complex",
        "description": "صاف کردن کوتیکول مو، کاهش موخوره و وز و محافظت در برابر حرارت."
      },
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "پیش از کرم‌پودر مقدار کمی را با ضربات انگشت روی ناحیه T و منافذ باز بزنید.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "پرفروش جهانی",
      "حاوی ویتامین E",
      "فاقد چربی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "آمریکا",
    "expiryDate": "۲۰۲۷",
    "targetAudience": "محو کردن ظاهر منافذ باز و خطوط ریز و افزایش ماندگاری میکاپ.",
    "unsuitableFor": "مورد منع خاص ندارد."
  },
  {
    "id": "product-pori-425",
    "nameFa": "بیگودی و فرکننده خودکار تک‌لمسی ایت-کرل ۳۲ میل شیگلم",
    "nameEn": "SHEGLAM It-Curl One-Touch Instant Automatic Curler (32mm)",
    "brand": "SHEGLAM",
    "productType": "device",
    "category": "hair-body",
    "skinTypes": [
      "dry",
      "normal",
      "combination",
      "oily"
    ],
    "concerns": [
      "hair-body"
    ],
    "routines": [
      "morning"
    ],
    "routineStep": "ابزار حالت‌دهنده مو: فرکننده اتوماتیک ۳۲ میل",
    "howToUse": "دسته موی خشک را داخل محفظه قرار داده و دکمه چرخش چپ یا راست را فشار دهید تا فر یکنواخت ایجاد شود.",
    "ingredientTags": [
      "ceramic-ionic"
    ],
    "descriptionFa": "بیگودی فوری تک لمسی شیگلم\n\nگرمایش سریع، پیچش خودکار یک دکمه بدون فشار برای مبتدیان! این اتوی چرخشی از طرح فر کردن یک دکمه استفاده می کند.\n\n[ضد سوختگی و ضد گره خوردن ایمن تر است] اتو فر کننده خودکار ما از طراحی منحصر به فرد ضد گره خوردگی استفاده می کند تا به طور موثر از گره خوردن یا کشیدن مو جلوگیری کند و از موهای شما در برابر آسیب محافظت کند. قسمت بالایی از طراحی ضد سوختگی خاصی برخوردار است و بافل میانی تماس را جدا می کند که می تواند به طور موثری حتی پس از استفاده طولانی مدت از سوختگی جلوگیری کند و این کار را برای مبتدیان مناسب تر می کند.\n\n[3 دما] اتو فر کننده خودکار ما دارای 3 گزینه دما (170 درجه سانتیگراد تا 210 درجه سانتیگراد) است که برای انواع مو مناسب است و هر بار که از آن استفاده می کنید نتایج ایده آلی را تضمین می کند. اتو فر کننده همچنین عملکرد چرخش دو طرفه را ارائه می دهد و به شما این امکان را می دهد که به راحتی جهت فرهای چپ و راست را تغییر دهید و به راحتی مدل موی مناسب برای موقعیت های مختلف ایجاد کنید.",
    "descriptionEn": "SHEGLAM It-Curl One-Touch Instant Automatic Curler (32mm) by SHEGLAM.",
    "price": 10518000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2457/2caee816e83e11c931cdbbf8171de234.webp",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/2458/c31c67218b82653e660fca4250966cf0.jpeg",
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/572/9e92d629cfb5447ac368a8e8675597c2.jpeg"
    ],
    "sizes": [
      {
        "label": "32",
        "labelEn": "32",
        "price": 10518000
      }
    ],
    "variants": [
      {
        "id": "var-pori-1114",
        "name": "32",
        "nameEn": "32",
        "price": 10518000,
        "stockCount": 1,
        "sku": "IN1769621808"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پوشش سرامیکی / فناوری یون منفی",
        "nameEn": "Ceramic Coating & Negative Ion Tech",
        "description": "توزیع یکنواخت حرارت، کاهش الکتریسیته ساکن و جلوگیری از سوختگی و وز شدن مو."
      }
    ],
    "usageRoutine": {
      "morning": "دسته موی خشک را داخل محفظه قرار داده و دکمه چرخش چپ یا راست را فشار دهید تا فر یکنواخت ایجاد شود.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "چرخش دوطرفه چپ و راست",
      "ضدسوختگی و ضدگره",
      "۳ دما (۱۷۰–۲۱۰°C)"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "چین (تحت لیسانس شیگلم)",
    "expiryDate": "لوازم برقی (بدون انقضا)",
    "targetAudience": "فر کردن ایمن و سریع مو حتی برای افراد مبتدی بدون سوختگی دست.",
    "unsuitableFor": "روی موهای خیس استفاده نشود."
  },
  {
    "id": "product-pori-44",
    "nameFa": "ریمل حجم‌دهنده بی‌نهایت بیگ بولد اکستریم ایزادورا",
    "nameEn": "IsaDora Big Bold Extreme Ultimate Volume Mascara",
    "brand": "Isadora",
    "productType": "makeup",
    "category": "makeup",
    "skinTypes": [
      "normal",
      "sensitive",
      "oily",
      "dry"
    ],
    "concerns": [
      "makeup"
    ],
    "routines": [
      "morning",
      "minimal"
    ],
    "routineStep": "آرایش چشم: ریمل فوق حجم‌دهنده",
    "howToUse": "برس بزرگ فیبری را از ریشه تا نوک مژه بکشید؛ امکان زدن چند لایه دارد.",
    "ingredientTags": [
      "mineral-pigments"
    ],
    "descriptionFa": "- بافت کرمی •حجم دهنده زیاد •ضدآب •پوشانندگی خوب •دارای رنگدانه قوی •رنگ سیاه کربنی •خشک شدن سریع •امکان استفاده چند لایه •دارای برس بزرگ از جنس فیبر •مقاوم در برابر آب •مناسب چشم حساس •فاقد پارابن",
    "descriptionEn": "IsaDora Big Bold Extreme Ultimate Volume Mascara by Isadora.",
    "price": 2044000,
    "originalPrice": 0,
    "rating": 0,
    "reviewCount": 0,
    "images": [
      "https://oss.sazito.com/apiuploads/poribeauty/uploads/image/rootimage/4193/4e853478edb06d15f842283b6d39d057.jpeg"
    ],
    "sizes": [
      {
        "label": "حجم ۱۴ میلی‌لیتر",
        "labelEn": "14 ml",
        "price": 2044000
      }
    ],
    "variants": [
      {
        "id": "var-pori-53",
        "name": "حجم ۱۴ میلی‌لیتر",
        "nameEn": "14 ml",
        "price": 2044000,
        "stockCount": 1,
        "sku": "IN1711023502"
      }
    ],
    "keyIngredients": [
      {
        "nameFa": "پیگمنت‌های معدنی میکرونیزه و نرم‌کننده‌ها",
        "nameEn": "Micronized Mineral Pigments & Emollients",
        "description": "پوشش‌دهی یکدست، ماندگاری طولانی بدون ماسیدگی و پخش آسان روی پوست."
      }
    ],
    "usageRoutine": {
      "morning": "برس بزرگ فیبری را از ریشه تا نوک مژه بکشید؛ امکان زدن چند لایه دارد.",
      "night": "این محصول برای استفاده روزانه طراحی شده و در پایان روز با پاک‌کننده مناسب تمیز می‌شود."
    },
    "badges": [
      "مناسب چشم حساس",
      "ضدآب و فاقد پارابن",
      "مشکی کربنی"
    ],
    "isBestSeller": false,
    "isNew": true,
    "inStock": true,
    "stockCount": 1,
    "authenticity": "ضمانت اصالت ۱۰۰٪ اورجینال",
    "sourcingOrigin": "سوئد",
    "expiryDate": "۲۰۲۸",
    "targetAudience": "حجم‌دهی حداکثری مژه‌ها بدون ریزش زیر چشم.",
    "unsuitableFor": "مورد منع خاص ندارد."
  }
];
