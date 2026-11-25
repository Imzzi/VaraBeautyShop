import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
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

test('Torob product feed API supports pagination, form-urlencoded single lookup, page_url lookup, and Toman prices', async () => {
  const products = await ProductsDb.getAllFresh();
  assert.ok(products.length > 0);
  const sample = products[0];

  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. POST /api/torob/products with form-urlencoded page=1
    const pageRes = await fetch(`${baseUrl}/api/torob/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'page=1',
    });
    assert.equal(pageRes.status, 200);
    const pageJson = await pageRes.json();
    assert.equal(pageJson.count, products.length);
    assert.equal(pageJson.max_pages, Math.ceil(products.length / 100));
    assert.equal(pageJson.products.length, Math.min(100, products.length));

    const first = pageJson.products[0];
    assert.equal(first.page_unique, sample.id);
    assert.equal(first.page_url, `https://varabeauty.ir/product/${encodeURIComponent(sample.id)}`);
    assert.equal(typeof first.current_price, 'number');
    assert.equal(Number.isInteger(first.current_price), true);
    assert.ok(first.current_price > 0);
    assert.ok(['instock', 'outofstock'].includes(first.availability));
    assert.ok(first.image_link.startsWith('https://'));
    assert.ok(first.guarantee.includes('اصالت'));

    // 2. Single lookup via page_unique (POST form-urlencoded)
    const singleRes = await fetch(`${baseUrl}/api/torob/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ page_unique: sample.id }).toString(),
    });
    assert.equal(singleRes.status, 200);
    const singleJson = await singleRes.json();
    assert.equal(singleJson.count, 1);
    assert.equal(singleJson.max_pages, 1);
    assert.equal(singleJson.products.length, 1);
    assert.equal(singleJson.products[0].page_unique, sample.id);

    // 3. Lookup via page_url (GET query param)
    const urlRes = await fetch(
      `${baseUrl}/api/torob/products?page_url=${encodeURIComponent(`https://varabeauty.ir/product/${sample.id}`)}`
    );
    assert.equal(urlRes.status, 200);
    const urlJson = await urlRes.json();
    assert.equal(urlJson.count, 1);
    assert.equal(urlJson.products[0].page_unique, sample.id);

    // 4. Unknown page_unique returns empty list cleanly
    const missingRes = await fetch(`${baseUrl}/api/torob/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_unique: 'does-not-exist-999' }),
    });
    assert.equal(missingRes.status, 200);
    const missingJson = await missingRes.json();
    assert.equal(missingJson.count, 0);
    assert.equal(missingJson.max_pages, 0);
    assert.deepEqual(missingJson.products, []);
  } finally {
    server.close();
  }
});
