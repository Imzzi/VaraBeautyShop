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

test('v1 catalog upgrades safely with imported skincare products without touching existing records', async (ctx) => {
  const directory = await mkdtemp(join(tmpdir(), 'vara-db-migrate-'));
  const client = createClient({ url: `file:${join(directory, 'migrate.db')}` });
  const { IMPORTED_SKINCARE_PRODUCTS } = await import('../src/data/importedSkincareCatalog.ts');

  await client.batch([
    `CREATE TABLE products (
      id TEXT PRIMARY KEY,
      nameFa TEXT,
      nameEn TEXT,
      brand TEXT,
      price INTEGER,
      originalPrice INTEGER,
      stockCount INTEGER,
      inStock INTEGER,
      data TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );`,
    `CREATE TABLE orders (
      id TEXT PRIMARY KEY,
      orderNumber TEXT,
      status TEXT NOT NULL,
      paymentStatus TEXT NOT NULL,
      totalAmount INTEGER NOT NULL,
      customerName TEXT,
      customerPhone TEXT,
      customerEmail TEXT,
      postalTrackingCode TEXT,
      data TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );`,
    `CREATE TABLE users (
      uid TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      phoneNumber TEXT,
      displayName TEXT,
      passwordHash TEXT,
      salt TEXT,
      verificationCode TEXT,
      emailVerified INTEGER DEFAULT 0,
      role TEXT DEFAULT 'customer',
      data TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );`,
    `CREATE TABLE admins (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      salt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );`,
    `CREATE TABLE settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );`,
    `CREATE TABLE security_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      attempts INTEGER DEFAULT 0,
      expiresAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );`,
  ], 'write');

  const existingCustomProduct = {
    ...IMPORTED_SKINCARE_PRODUCTS[0],
    id: 'product-existing-bioderma',
    nameFa: 'کرم آبرسان اختصاصی بایودرما',
    brand: 'Bioderma',
    price: 4450000,
    stockCount: 10,
  };
  await client.execute({
    sql: `INSERT INTO products (id, nameFa, nameEn, brand, price, originalPrice, stockCount, inStock, data, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      existingCustomProduct.id,
      existingCustomProduct.nameFa,
      existingCustomProduct.nameEn,
      existingCustomProduct.brand,
      existingCustomProduct.price,
      0,
      10,
      1,
      JSON.stringify(existingCustomProduct),
      new Date().toISOString(),
    ],
  });
  await client.execute({
    sql: 'INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)',
    args: ['brands', JSON.stringify([{ id: 'Bioderma', labelFa: 'بایودرما', labelEn: 'Bioderma' }]), new Date().toISOString()],
  });
  await client.execute({
    sql: 'INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)',
    args: ['__vara_schema_version', '1', new Date().toISOString()],
  });

  ctx.mock.module('@libsql/client/web', { namedExports: { createClient: () => client } });
  const { ProductsDb, SettingsDb } = await import(new URL('../serverDb.ts?v1-upgrade', import.meta.url).href);

  const allProducts = await ProductsDb.getAllFresh();
  assert.equal(allProducts.length, 1 + IMPORTED_SKINCARE_PRODUCTS.length);
  const preserved = allProducts.find((p) => p.id === existingCustomProduct.id);
  assert.equal(preserved?.nameFa, existingCustomProduct.nameFa);
  assert.equal(preserved?.price, 4450000);

  const brands = (await SettingsDb.get('brands')) as Array<{ id: string }>;
  assert.ok(brands.some((b) => b.id === 'Bioderma'));
  assert.ok(brands.some((b) => b.id === 'Caudalie'));
  assert.ok(brands.some((b) => b.id === 'SUNGBOON EDITOR'));

  // Deleting an imported product and resetting schema version must NOT re-import it
  await ProductsDb.delete(IMPORTED_SKINCARE_PRODUCTS[0].id);
  await client.execute({
    sql: 'DELETE FROM settings WHERE key = ?',
    args: ['__vara_schema_version'],
  });
  const nextWorker = await import(new URL('../serverDb.ts?v1-upgrade-repeat', import.meta.url).href);
  const afterDelete = await nextWorker.ProductsDb.getAllFresh();
  assert.equal(afterDelete.length, IMPORTED_SKINCARE_PRODUCTS.length);
  assert.equal(afterDelete.some((p) => p.id === IMPORTED_SKINCARE_PRODUCTS[0].id), false);

  client.close();
});
