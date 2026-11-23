import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { createClient } from '@libsql/client';
import type { Order } from '../src/types';

test('catalog and checkout persist through the real SQLite transaction driver', async (ctx) => {
  const directory = await mkdtemp(join(tmpdir(), 'vara-db-fixture-'));
  const client = createClient({ url: `file:${join(directory, 'fixture.db')}` });
  for (const name of ['TURSO_AUTH_TOKEN', 'ADMIN_USERNAME', 'ADMIN_USER', 'ADMIN_PASSWORD', 'ADMIN_PASS']) {
    delete process.env[name];
  }
  process.env.TURSO_DATABASE_URL = 'https://local-fixture.invalid';
  ctx.mock.module('@libsql/client/web', { namedExports: { createClient: () => client } });
  const { ProductsDb, OrdersDb, SettingsDb } = await import('../serverDb.ts');

  const seed = (await ProductsDb.getAllFresh())[0];
  assert.ok(seed);
  const product = { ...seed, id: 'fixture-sku', inStock: true, stockCount: 1, variants: [], sizes: [] };
  await ProductsDb.create(product);
  const changed = await ProductsDb.update(product.id, { isBestSeller: true });
  assert.equal(changed?.nameFa, product.nameFa);
  assert.equal(changed?.price, product.price);
  assert.equal(changed?.isBestSeller, true);

  await SettingsDb.set('shipping_settings', { postExpressFee: 52_000 });
  const draft: Order = {
    id: 'fixture-order', orderNumber: 'VARA-FIXTURE', status: 'pending',
    paymentStatus: 'pending_verification', paymentMethod: 'online_gateway', shippingMethod: 'post_express',
    createdAt: new Date().toISOString(), totalAmount: 0, subtotal: 0, shippingFee: 0, discountAmount: 0,
    customer: {
      name: 'Fixture', phone: '000', province: 'تهران', city: 'تهران', address: 'Fixture address', postalCode: '',
    },
    items: [{ productId: product.id, quantity: 1, price: 0, image: '', nameFa: '', nameEn: '', sizeLabel: '' }],
  };

  const placed = await OrdersDb.add(draft);
  assert.equal(placed.totalAmount, product.price + 52_000);
  assert.equal((await OrdersDb.add(draft)).id, placed.id);
  await assert.rejects(OrdersDb.add({ ...draft, id: 'sold-out-order' }));
  assert.equal(await OrdersDb.getById('sold-out-order'), null);
  await OrdersDb.updateStatus(placed.id, 'cancelled');
  await OrdersDb.updateStatus(placed.id, 'cancelled');
  assert.equal((await ProductsDb.getById(product.id))?.stockCount, 1);
  assert.equal((await OrdersDb.getPage({ limit: 25, query: 'fixture' })).orders.length, 1);
  assert.equal((await OrdersDb.getStats()).cancelled, 1);

  await client.execute('DELETE FROM products');
  await client.execute({
    sql: 'DELETE FROM settings WHERE key = ?', args: ['__vara_schema_version'],
  });
  const worker = await import(new URL('../serverDb.ts?existing-catalog', import.meta.url).href);
  assert.deepEqual(await worker.ProductsDb.getAllFresh(), []);

  client.close();
  await assert.rejects(SettingsDb.set('shipping_settings', { postExpressFee: 50_000 }));
  await assert.rejects(ProductsDb.update(product.id, { isBestSeller: false }));
});
