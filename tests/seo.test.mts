import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

for (const name of ['TURSO_DATABASE_URL', 'TURSO_URL', 'TURSO_AUTH_TOKEN', 'VERCEL', 'VERCEL_ENV', 'AWS_LAMBDA_FUNCTION_NAME']) {
  delete process.env[name];
}
process.env.NODE_ENV = 'test';

const root = path.resolve(import.meta.dirname, '..');
const requireLocal = createRequire(path.join(root, 'package.json'));
const http = requireLocal('node:http');
const load = (name: string) => import(pathToFileURL(path.join(root, name)).href);

const { app, ProductsDb } = await load('server.ts');
const { detectSafeRasterImage } = await load('serverBlob.ts');
const { CALCULATOR_FAQS } = await load('src/lib/seoMetadata.ts');
const { BUILT_INDEX_HTML } = await load('src/generated/indexHtmlTemplate.ts');

test('public/og-image.jpg exists and is a valid JPEG raster image', () => {
  const ogPath = path.join(root, 'public', 'og-image.jpg');
  assert.equal(fs.existsSync(ogPath), true);
  const buf = fs.readFileSync(ogPath);
  assert.deepEqual(detectSafeRasterImage(buf), { valid: true, mime: 'image/jpeg', ext: 'jpg' });
});

test('BUILT_INDEX_HTML includes root mount and external preload script for serverless SSR', () => {
  assert.ok(BUILT_INDEX_HTML.includes('<div id="root"></div>'));
  assert.ok(BUILT_INDEX_HTML.includes('/assets/vara-critical-preload.js'));
});

test('SSR SEO routes inject buyer-intent Persian metadata, JSON-LD, IRR currency, and real 404s', async () => {
  const products = await ProductsDb.getAllFresh();
  assert.ok(products.length > 0);
  const sampleProduct = products[0];

  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Valid product returns 200, Persian buyer-intent title, canonical, and IRR price schema
    const prodRes = await fetch(`${baseUrl}/product/${encodeURIComponent(sampleProduct.id)}`);
    assert.equal(prodRes.status, 200);
    const prodHtml = await prodRes.text();
    assert.ok(prodHtml.includes(`خرید ${sampleProduct.nameFa}`), 'Missing buyer-intent Persian title');
    assert.ok(prodHtml.includes(`<link rel="canonical" href="https://varabeauty.ir/product/${sampleProduct.id}" />`));
    const jsonLdMatch = prodHtml.match(/<script id="vara-ssr-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch, 'Missing SSR JSON-LD script');
    const schema = JSON.parse(jsonLdMatch[1]);
    const prodNode = schema['@graph'].find((n: any) => n['@type'] === 'Product');
    assert.ok(prodNode, 'Missing Product JSON-LD node');
    assert.equal(prodNode.offers.priceCurrency, 'IRR');
    assert.equal(prodNode.offers.price, Math.round(sampleProduct.price * 10));

    // 2. Non-existent product returns real HTTP 404 + noindex (prevents Soft 404)
    const missingRes = await fetch(`${baseUrl}/product/non-existent-product-999`);
    assert.equal(missingRes.status, 404);
    const missingHtml = await missingRes.text();
    assert.ok(missingHtml.includes('noindex'));
    assert.equal(/<link\s+rel="canonical"/i.test(missingHtml), false);

    // 3. Category & Brand shop pages have self-referencing canonical URLs and distinct titles
    const sunscreenRes = await fetch(`${baseUrl}/shop?category=sunscreen`);
    assert.equal(sunscreenRes.status, 200);
    const sunscreenHtml = await sunscreenRes.text();
    assert.ok(sunscreenHtml.includes('<link rel="canonical" href="https://varabeauty.ir/shop?category=sunscreen" />'));
    assert.ok(sunscreenHtml.includes('ضدآفتاب'));

    const brandRes = await fetch(`${baseUrl}/shop?brand=${encodeURIComponent('The Ordinary')}`);
    assert.equal(brandRes.status, 200);
    const brandHtml = await brandRes.text();
    assert.ok(brandHtml.includes('<link rel="canonical" href="https://varabeauty.ir/shop?brand=The%20Ordinary" />'));
    assert.ok(brandHtml.includes('The Ordinary'));

    // Free-text ?q= search canonicalizes back to /shop
    const queryRes = await fetch(`${baseUrl}/shop?q=niacinamide`);
    assert.equal(queryRes.status, 200);
    const queryHtml = await queryRes.text();
    assert.ok(queryHtml.includes('<link rel="canonical" href="https://varabeauty.ir/shop" />'));

    // 4. Calculator route includes FAQPage JSON-LD matching CALCULATOR_FAQS
    const calcRes = await fetch(`${baseUrl}/calculator`);
    assert.equal(calcRes.status, 200);
    const calcHtml = await calcRes.text();
    const calcJsonMatch = calcHtml.match(/<script id="vara-ssr-jsonld" type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(calcJsonMatch);
    const calcSchema = JSON.parse(calcJsonMatch[1]);
    const faqNode = calcSchema['@graph'].find((n: any) => n['@type'] === 'FAQPage');
    assert.ok(faqNode);
    assert.equal(faqNode.mainEntity.length, CALCULATOR_FAQS.length);

    // 5. Static SEO routes (/contact, /return-policy, /terms) return 200 with canonicals
    for (const staticPath of ['/contact', '/return-policy', '/terms']) {
      const staticRes = await fetch(`${baseUrl}${staticPath}`);
      assert.equal(staticRes.status, 200, `Expected 200 for ${staticPath}`);
      const staticHtml = await staticRes.text();
      assert.ok(
        staticHtml.includes(`<link rel="canonical" href="https://varabeauty.ir${staticPath}" />`),
        `Missing canonical on ${staticPath}`
      );
    }

    // 6. Serverless cwd simulation (no dist/index.html or index.html in cwd) falls back to BUILT_INDEX_HTML
    const prevCwd = process.cwd();
    try {
      process.chdir('/tmp');
      const tmpCalcRes = await fetch(`${baseUrl}/calculator`);
      assert.equal(tmpCalcRes.status, 200);
      const tmpCalcHtml = await tmpCalcRes.text();
      assert.ok(tmpCalcHtml.includes('FAQPage'));
      assert.ok(tmpCalcHtml.includes('<link rel="canonical" href="https://varabeauty.ir/calculator" />'));
    } finally {
      process.chdir(prevCwd);
    }
  } finally {
    server.close();
  }
});
