import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

for (const name of [
  'TURSO_DATABASE_URL',
  'TURSO_URL',
  'TURSO_AUTH_TOKEN',
  'VERCEL',
  'VERCEL_ENV',
  'AWS_LAMBDA_FUNCTION_NAME',
]) {
  delete process.env[name];
}
delete process.env.GEMINI_API_KEY;
process.env.NODE_ENV = 'test';

const root = path.resolve(import.meta.dirname, '..');
const requireLocal = createRequire(path.join(root, 'package.json'));
const http = requireLocal('node:http');
const load = (name: string) => import(pathToFileURL(path.join(root, name)).href);

const {
  buildPersonalizedRoutine,
  selectRelevantAdvisorProducts,
  extractValidatedProductIds,
} = await load('src/lib/routineEngine.ts');
const { isSkinProfileStaleOrInvalid, generateSkinProfile } = await load('src/data/quizData.ts');
const { app, ProductsDb } = await load('server.ts');

import type { Product } from '../src/types';

function makeProduct(overrides: Partial<Product> & { id: string; nameFa: string }): Product {
  return {
    nameEn: overrides.nameEn || overrides.id,
    brand: overrides.brand || 'TestBrand',
    productType: overrides.productType || 'serum',
    category: overrides.category || 'hydration',
    skinTypes: overrides.skinTypes || ['combination', 'normal'],
    concerns: overrides.concerns || ['hydration'],
    descriptionFa: overrides.descriptionFa || 'توضیحات تست محصول مراقبت پوست',
    descriptionEn: 'Skincare product',
    price: overrides.price ?? 1200000,
    rating: overrides.rating ?? 4.7,
    reviewCount: 10,
    images: ['/img.jpg'],
    sizes: [{ label: '۵۰ میل', labelEn: '50ml', price: overrides.price ?? 1200000 }],
    keyIngredients: overrides.keyIngredients || [
      { nameFa: 'هیالورونیک اسید', nameEn: 'Hyaluronic Acid', description: 'آبرسان' },
    ],
    usageRoutine: { morning: 'صبح', night: 'شب' },
    badges: [],
    inStock: overrides.inStock ?? true,
    stockCount: overrides.stockCount ?? 10,
    ...overrides,
  };
}

function buildRealisticFixtureCatalog(): Product[] {
  return [
    // Index 0 trap: heavy dry body/face balm (used to overwrite ALL steps in legacy fallback!)
    makeProduct({
      id: 'trap-bioderma-atoderm-0',
      nameFa: 'کرم مرطوب کننده قوی اتودرم بیودرما 500 میل',
      brand: 'Bioderma',
      productType: 'moisturizer',
      category: 'hydration',
      skinTypes: ['dry', 'sensitive'],
      concerns: ['hydration', 'barrier-repair'],
      descriptionFa: 'کرم غلیظ مرطوب‌کننده و مغذی برای پوست‌های خیلی خشک و آتوپیک',
      keyIngredients: [{ nameFa: 'گلیسیرین', nameEn: 'Glycerin', description: 'مرطوب‌کننده' }],
      rating: 4.9,
      isBestSeller: true,
    }),
    // Trap: body wash labeled with productType cleanser & concerns ['hair-body']
    makeProduct({
      id: 'trap-medicube-body-wash',
      nameFa: 'شوینده بدن ضدجوش مدیکوب Red Acne Body Wash',
      brand: 'Medicube',
      productType: 'cleanser',
      category: 'acne-blemishes',
      skinTypes: ['oily'],
      concerns: ['acne-blemish', 'hair-body'],
      keyIngredients: [{ nameFa: 'سالیسیلیک اسید', nameEn: 'Salicylic Acid', description: 'بدن' }],
      rating: 5.0,
    }),
    // Trap: body pigment cream labeled moisturizer
    makeProduct({
      id: 'trap-bioderma-body-pigmentbio',
      nameFa: 'کرم روشن‌کننده نواحی حساس بدن پیگمنت‌بیو بیودرما',
      brand: 'Bioderma',
      productType: 'moisturizer',
      category: 'hair-body',
      skinTypes: ['sensitive', 'dry'],
      concerns: ['brightening', 'hair-body'],
      rating: 5.0,
    }),
    // Trap: lash serum labeled eye-care
    makeProduct({
      id: 'trap-lancome-lash-serum',
      nameFa: 'سرم تقویت‌کننده و احیاکننده مژه لانکوم',
      brand: 'Lancome',
      productType: 'eye-care',
      category: 'anti-aging',
      skinTypes: ['normal', 'dry', 'oily', 'combination', 'sensitive'],
      concerns: ['anti-aging'],
      rating: 5.0,
    }),
    // Trap: makeup product
    makeProduct({
      id: 'trap-sheglam-blush',
      nameFa: 'رژگونه مایع شیگلم',
      brand: 'SHEGLAM',
      productType: 'makeup',
      category: 'makeup',
      skinTypes: ['normal', 'dry', 'oily', 'combination', 'sensitive'],
      concerns: ['makeup'],
      rating: 5.0,
    }),
    // Trap: out-of-stock oily serum
    makeProduct({
      id: 'trap-oos-serum',
      nameFa: 'سرم ناموجود کنترل چربی',
      brand: 'Ordinary',
      productType: 'serum',
      category: 'acne-blemishes',
      skinTypes: ['oily'],
      concerns: ['acne-blemish'],
      inStock: false,
      stockCount: 0,
      rating: 5.0,
    }),
    // Cleansers
    makeProduct({
      id: 'oily-cleanser-cosrx',
      nameFa: 'ژل شستشوی سالیسیلیک اسید کوزارکس',
      brand: 'COSRX',
      productType: 'cleanser',
      category: 'acne-blemishes',
      skinTypes: ['oily', 'combination'],
      concerns: ['acne-blemish'],
      descriptionFa: 'ژل شستشوی فاقد چربی برای کنترل سبوم و پاکسازی منافذ پوست چرب',
      keyIngredients: [{ nameFa: 'سالیسیلیک اسید', nameEn: 'Salicylic Acid', description: 'BHA' }],
    }),
    makeProduct({
      id: 'dry-cleanser-cerave',
      nameFa: 'ژل شستشوی آبرسان سرامید سراوی',
      brand: 'CeraVe',
      productType: 'cleanser',
      category: 'cleanser',
      skinTypes: ['dry', 'sensitive', 'normal'],
      concerns: ['hydration', 'barrier-repair'],
      descriptionFa: 'شوینده ملایم و آبرسان برای پوست خشک و حساس بدون آسیب به سد دفاعی',
      keyIngredients: [
        { nameFa: 'سرامید', nameEn: 'Ceramides', description: 'سد پوستی' },
        { nameFa: 'هیالورونیک اسید', nameEn: 'Hyaluronic Acid', description: 'آبرسان' },
      ],
    }),
    // Toners
    makeProduct({
      id: 'oily-toner-anua',
      nameFa: 'تونر آرامش‌بخش هارت‌لیف آنوا',
      brand: 'Anua',
      productType: 'toner',
      category: 'acne-blemishes',
      skinTypes: ['oily', 'combination', 'sensitive'],
      concerns: ['acne-blemish', 'soothing'],
      keyIngredients: [{ nameFa: 'هارت‌لیف', nameEn: 'Heartleaf', description: 'آرامش‌بخش' }],
    }),
    makeProduct({
      id: 'dry-toner-boj',
      nameFa: 'اسنس و تونر جینسینگ بیوتی آف جوزان',
      brand: 'Beauty of Joseon',
      productType: 'toner',
      category: 'hydration',
      skinTypes: ['dry', 'normal', 'combination'],
      concerns: ['hydration', 'anti-aging'],
      keyIngredients: [{ nameFa: 'جینسینگ', nameEn: 'Ginseng', description: 'آبرسان و شاداب‌کننده' }],
    }),
    // Serums
    makeProduct({
      id: 'oily-serum-niacinamide',
      nameFa: 'سرم نیاسینامید ۱۰٪ و زینک اوردینری',
      brand: 'The Ordinary',
      productType: 'serum',
      category: 'acne-blemishes',
      skinTypes: ['oily', 'combination'],
      concerns: ['acne-blemish'],
      descriptionFa: 'سرم سبک کنترل چربی، کوچک‌کننده منافذ و ضدجوش',
      keyIngredients: [
        { nameFa: 'نیاسینامید', nameEn: 'Niacinamide', description: 'کنترل سبوم' },
        { nameFa: 'زینک', nameEn: 'Zinc PCA', description: 'ضدجوش' },
      ],
    }),
    makeProduct({
      id: 'sensitive-serum-centella',
      nameFa: 'آمپول سنتلا ماداگاسکار اسکین۱۰۰۴',
      brand: 'SKIN1004',
      productType: 'serum',
      category: 'sensitive-skin',
      skinTypes: ['sensitive', 'dry', 'oily', 'combination'],
      concerns: ['barrier-repair', 'sensitive', 'soothing'],
      descriptionFa: 'سرم ۱۰۰٪ سنتلا برای التیام قرمزی و تقویت سد دفاعی پوست حساس',
      keyIngredients: [{ nameFa: 'سنتلا آسیاتیکا', nameEn: 'Centella Asiatica', description: 'التیام‌بخش' }],
    }),
    makeProduct({
      id: 'strong-active-peel',
      nameFa: 'سرم پیلینگ AHA 30% + BHA 2% اوردینری',
      brand: 'The Ordinary',
      productType: 'exfoliator',
      category: 'brightening',
      skinTypes: ['oily', 'normal'],
      concerns: ['acne-blemish', 'brightening'],
      descriptionFa: 'لایه بردار قوی پیلینگ اسیدی برای پوست مقاوم',
      keyIngredients: [{ nameFa: 'اسید گلیکولیک و سالیسیلیک', nameEn: 'AHA/BHA', description: 'پیلینگ' }],
    }),
    makeProduct({
      id: 'night-mask-soothing',
      nameFa: 'ماسک خواب التیام‌بخش سنتلا و پانتنول',
      brand: 'Mary & May',
      productType: 'mask',
      category: 'sensitive-skin',
      skinTypes: ['dry', 'sensitive', 'combination', 'normal'],
      concerns: ['hydration', 'barrier-repair', 'soothing'],
      keyIngredients: [
        { nameFa: 'سنتلا', nameEn: 'Centella', description: 'ضدالتهاب' },
        { nameFa: 'پانتنول', nameEn: 'Panthenol', description: 'ترمیم‌کننده' },
      ],
    }),
    // Moisturizers
    makeProduct({
      id: 'oily-moisturizer-sebium',
      nameFa: 'ژل کرم آبرسان سبیوم هیدرا بیودرما',
      brand: 'Bioderma',
      productType: 'moisturizer',
      category: 'acne-blemishes',
      skinTypes: ['oily', 'combination'],
      concerns: ['acne-blemish', 'hydration'],
      descriptionFa: 'مرطوب‌کننده سبک و فاقد چربی برای کنترل چربی و آبرسانی پوست مختلط و چرب',
      keyIngredients: [{ nameFa: 'گلیسیرین و سرامید', nameEn: 'Ceramide', description: 'آبرسان سبک' }],
    }),
    makeProduct({
      id: 'dry-moisturizer-ceramide',
      nameFa: 'کرم ترمیم‌کننده سرامید سیکاپلاست لاروش پوزای',
      brand: 'La Roche-Posay',
      productType: 'moisturizer',
      category: 'sensitive-skin',
      skinTypes: ['dry', 'sensitive'],
      concerns: ['barrier-repair', 'hydration'],
      keyIngredients: [
        { nameFa: 'پانتنول', nameEn: 'Panthenol', description: 'ترمیم' },
        { nameFa: 'مادکاسوساید', nameEn: 'Madecassoside', description: 'التیام' },
      ],
    }),
    // Eye care, Sunscreen, Lip care
    makeProduct({
      id: 'eye-cream-caffeine',
      nameFa: 'کرم دور چشم پپتید و کافئین',
      brand: 'Beauty of Joseon',
      productType: 'eye-care',
      category: 'anti-aging',
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      concerns: ['anti-aging', 'brightening'],
      keyIngredients: [{ nameFa: 'پپتید و رتينال ملایم', nameEn: 'Peptide', description: 'دور چشم' }],
    }),
    makeProduct({
      id: 'sunscreen-oily',
      nameFa: 'فلوئید ضدآفتاب فاقد چربی ایزدین',
      brand: 'ISDIN',
      productType: 'sunscreen',
      category: 'sunscreen',
      skinTypes: ['oily', 'combination'],
      concerns: ['sunscreen', 'acne-blemish'],
      descriptionFa: 'ضدآفتاب سبک و مات‌کننده فاقد چربی SPF 50',
      keyIngredients: [{ nameFa: 'هیالورونیک اسید', nameEn: 'Hyaluronic Acid', description: 'سبک' }],
    }),
    makeProduct({
      id: 'sunscreen-dry',
      nameFa: 'کرم ضدآفتاب آبرسان برنج بیوتی آف جوزان',
      brand: 'Beauty of Joseon',
      productType: 'sunscreen',
      category: 'sunscreen',
      skinTypes: ['dry', 'sensitive', 'normal'],
      concerns: ['sunscreen', 'hydration'],
      descriptionFa: 'ضدآفتاب مرطوب‌کننده مناسب پوست خشک و حساس SPF 50+',
      keyIngredients: [{ nameFa: 'نیاسینامید و پروبیوتیک برنج', nameEn: 'Rice Extract', description: 'آبرسان' }],
    }),
    makeProduct({
      id: 'lip-balm-laneige',
      nameFa: 'ماسک و بالم لب شبانه بری',
      brand: 'Laneige',
      productType: 'lip-care',
      category: 'hydration',
      skinTypes: ['dry', 'normal', 'sensitive', 'oily', 'combination'],
      concerns: ['hydration'],
      keyIngredients: [{ nameFa: 'ویتامین C و شی باتر', nameEn: 'Shea Butter', description: 'نرم‌کننده لب' }],
    }),
  ];
}

test('buildPersonalizedRoutine eliminates traps, duplicates, and matches skin profiles accurately', () => {
  const catalog = buildRealisticFixtureCatalog();
  const forbiddenIds = new Set([
    'trap-medicube-body-wash',
    'trap-bioderma-body-pigmentbio',
    'trap-lancome-lash-serum',
    'trap-sheglam-blush',
    'trap-oos-serum',
  ]);

  const oilyRoutine = buildPersonalizedRoutine({
    style: 'complete',
    skinType: 'oily',
    primaryConcern: 'acne-blemish',
    sensitivityLevel: 'low',
    currentRoutine: 'experienced',
    products: catalog,
  });

  const drySensitiveRoutine = buildPersonalizedRoutine({
    style: 'complete',
    skinType: 'dry',
    primaryConcern: 'barrier-repair',
    sensitivityLevel: 'high',
    currentRoutine: 'none',
    products: catalog,
  });

  const assertValidRoutine = (routine: ReturnType<typeof buildPersonalizedRoutine>) => {
    const seenRoleByProduct = new Map<string, string>();
    const allSteps = [...routine.morningSteps, ...routine.nightSteps];
    assert.ok(routine.morningSteps.length >= 4);
    assert.ok(routine.nightSteps.length >= 4);

    for (const step of allSteps) {
      assert.equal(forbiddenIds.has(step.productId), false, `Forbidden product leaked: ${step.productId}`);
      assert.equal(step.reasonFa.includes('شیره کاکتوس'), false);
      assert.equal(step.reasonFa.includes('گل لادن'), false);
      assert.equal(step.reasonFa.includes('اکسیر لایلاک'), false);
      assert.equal(step.reasonFa.includes('خاک رس سفید'), false);

      const prevRole = seenRoleByProduct.get(step.productId);
      if (prevRole) {
        assert.equal(prevRole, step.role, `Product ${step.productId} duplicated across ${prevRole} and ${step.role}`);
      } else {
        seenRoleByProduct.set(step.productId, step.role || step.stepTitleEn);
      }

      if (step.alternativeProductIds) {
        assert.equal(step.alternativeProductIds.includes(step.productId), false);
      }
    }
  };

  assertValidRoutine(oilyRoutine);
  assertValidRoutine(drySensitiveRoutine);

  const oilyCleanser = oilyRoutine.morningSteps.find((s: any) => s.role === 'cleanser')?.productId;
  const dryCleanser = drySensitiveRoutine.morningSteps.find((s: any) => s.role === 'cleanser')?.productId;
  assert.notEqual(oilyCleanser, dryCleanser);

  const oilySerum = oilyRoutine.morningSteps.find((s: any) => s.role === 'serum')?.productId;
  const drySerum = drySensitiveRoutine.morningSteps.find((s: any) => s.role === 'serum')?.productId;
  assert.equal(oilySerum, 'oily-serum-niacinamide');
  assert.equal(drySerum, 'sensitive-serum-centella');

  // High sensitivity routine must NOT select the strong AHA 30% + BHA 2% peel
  const dryNightTreatment = drySensitiveRoutine.nightSteps.find((s: any) => s.role === 'night-treatment')?.productId;
  assert.notEqual(dryNightTreatment, 'strong-active-peel');
  assert.equal(dryNightTreatment, 'night-mask-soothing');
});

test('isSkinProfileStaleOrInvalid detects legacy duplicated or body-leaked profiles and auto-heals via generateSkinProfile', () => {
  const catalog = buildRealisticFixtureCatalog();
  const brokenLegacyProfile = {
    skinType: 'oily' as const,
    primaryConcern: 'acne-blemish' as const,
    ageGroup: 'all',
    sensitivityLevel: 'medium',
    currentRoutine: 'basic',
    routineStyle: 'balanced' as const,
    summaryLabelEn: 'Oily Skin',
    summaryLabelFa: 'پوست چرب',
    morningSteps: [
      { stepNumber: 1, stepTitleFa: '۱. شوینده', stepTitleEn: '1. Cleanser', timeOfDay: 'morning' as const, productId: 'trap-bioderma-atoderm-0', reasonFa: 'old' },
      { stepNumber: 2, stepTitleFa: '۲. سرم', stepTitleEn: '2. Serum', timeOfDay: 'morning' as const, productId: 'trap-bioderma-atoderm-0', reasonFa: 'old' },
    ],
    nightSteps: [],
    recommendedProductIds: ['trap-bioderma-atoderm-0'],
    createdAt: new Date().toISOString(),
  };

  assert.equal(isSkinProfileStaleOrInvalid(brokenLegacyProfile, catalog), true);

  const healthyProfile = generateSkinProfile(
    { 1: 'oily', 2: 'acne-blemish', 3: 'balanced', 4: 'basic', 5: 'medium' },
    catalog
  );
  assert.equal(isSkinProfileStaleOrInvalid(healthyProfile, catalog), false);
});

test('selectRelevantAdvisorProducts retrieves relevant items beyond index 20 and excludes unrequested makeup/body', () => {
  const fillerProducts = Array.from({ length: 28 }, (_, i) =>
    makeProduct({
      id: `filler-${i}`,
      nameFa: `کرم مرطوب‌کننده عمومی ${i}`,
      productType: 'moisturizer',
      skinTypes: ['dry'],
      concerns: ['hydration'],
      rating: 4.1,
    })
  );

  const lateTargetSerum = makeProduct({
    id: 'late-index-acne-serum',
    nameFa: 'سرم ضدجوش سالیسیلیک و نیاسینامید پیشرفته',
    brand: 'COSRX',
    productType: 'serum',
    category: 'acne-blemishes',
    skinTypes: ['oily'],
    concerns: ['acne-blemish'],
    keyIngredients: [{ nameFa: 'نیاسینامید', nameEn: 'Niacinamide', description: 'ضدجوش' }],
    rating: 4.9,
  });

  const lateBodyWash = makeProduct({
    id: 'late-body-wash',
    nameFa: 'بادی واش خوشبو بدن',
    productType: 'hair-body',
    category: 'hair-body',
    concerns: ['hair-body'],
    rating: 5.0,
  });

  const largeCatalog = [...fillerProducts, lateBodyWash, lateTargetSerum];

  const facialResults = selectRelevantAdvisorProducts(largeCatalog, {
    query: 'برای پوست چرب و جوش سرم نیاسینامید چی پیشنهاد میدی؟',
    limit: 20,
  });

  assert.ok(facialResults.some((p: Product) => p.id === 'late-index-acne-serum'));
  assert.equal(facialResults.some((p: Product) => p.id === 'late-body-wash'), false);

  const bodyResults = selectRelevantAdvisorProducts(largeCatalog, {
    query: 'شوینده بدن یا بادی واش خوب چی دارید؟',
    limit: 10,
  });
  assert.ok(bodyResults.some((p: Product) => p.id === 'late-body-wash'));
});

test('extractValidatedProductIds strictly extracts cited [ID: ...] tags and ignores negated plain mentions', () => {
  const catalog = buildRealisticFixtureCatalog();
  const modelReply = `برای پوست حساس شما **آمپول سنتلا** عالی است [ID: "sensitive-serum-centella"] و **کرم سیکاپلاست** [ID: dry-moisturizer-ceramide].
توجه کنید که از سرم پیلینگ AHA 30% + BHA 2% اوردینری استفاده نکنید چون ممکن است باعث سوزش شود.
شناسه جعلی [ID: vara-serum-01] هم نباید برگردد.`;

  const ids = extractValidatedProductIds(modelReply, catalog, 5);
  assert.deepEqual(ids, ['sensitive-serum-centella', 'dry-moisturizer-ceramide']);
});

test('POST /api/advisor/chat recommends distinct real in-stock products from live DB catalog without fake IDs', async () => {
  const catalog = await ProductsDb.getAllFresh();
  const validIds = new Set(catalog.map((p: Product) => p.id));

  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const oilyRes = await fetch(`${baseUrl}/api/advisor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: 'برای پوست چرب و مستعد جوش چه روتین و سرمی پیشنهاد می‌دهی؟' }],
      }),
    });
    assert.equal(oilyRes.status, 200);
    const oilyJson = await oilyRes.json();
    assert.equal(oilyJson.success, true);
    assert.ok(Array.isArray(oilyJson.suggestedProductIds) && oilyJson.suggestedProductIds.length >= 2);
    for (const id of oilyJson.suggestedProductIds) {
      assert.ok(validIds.has(id), `Expected real catalog ID, got ${id}`);
      assert.equal(id.startsWith('vara-'), false);
    }

    const dryRes = await fetch(`${baseUrl}/api/advisor/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', text: 'پوست خیلی خشک و حساس دارم و می‌خواهم سد دفاعی را ترمیم کنم.' }],
      }),
    });
    assert.equal(dryRes.status, 200);
    const dryJson = await dryRes.json();
    assert.equal(dryJson.success, true);
    assert.ok(Array.isArray(dryJson.suggestedProductIds) && dryJson.suggestedProductIds.length >= 2);
    for (const id of dryJson.suggestedProductIds) {
      assert.ok(validIds.has(id), `Expected real catalog ID, got ${id}`);
    }

    assert.notDeepEqual(oilyJson.suggestedProductIds, dryJson.suggestedProductIds);
  } finally {
    server.close();
  }
});
