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

test('v1/v2 catalog upgrades safely with Bioderma price fix and imported skincare + makeup/hair catalogs', async (ctx) => {
  const directory = await mkdtemp(join(tmpdir(), 'vara-db-migrate-'));
  const client = createClient({ url: `file:${join(directory, 'migrate.db')}` });
  const { IMPORTED_SKINCARE_PRODUCTS } = await import('../src/data/importedSkincareCatalog.ts');
  const { IMPORTED_MAKEUP_HAIR_PRODUCTS } = await import('../src/data/importedMakeupHairCatalog.ts');

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
  const zeroPriceBioderma = {
    ...IMPORTED_SKINCARE_PRODUCTS[0],
    id: 'product-49785efd-140a-4478-9d96-d49c8adaf95c',
    nameFa: 'فوم شوینده ضد لک روشن کننده بایودرما',
    brand: 'Bioderma',
    price: 0,
    originalPrice: 0,
    variants: [{ id: 'var-zero', name: '200 ml', price: 0, stockCount: 10 }],
    sizes: [{ label: '200 ml', labelEn: '200 ml', price: 0 }],
    stockCount: 10,
  };
  const badOrigBioderma = {
    ...IMPORTED_SKINCARE_PRODUCTS[0],
    id: 'product-26f7f786-0992-4351-ad12-212fa89fedc3',
    nameFa: 'ژل لایه‌بردار شبانه و ضدجوش بایودرما سبیوم نایت پیل',
    brand: 'Bioderma',
    price: 3570000,
    originalPrice: 2530000,
    variants: [{ id: 'var-bad-orig', name: '40 ml', price: 3570000, originalPrice: 2530000, stockCount: 10 }],
    sizes: [{ label: '40 ml', labelEn: '40 ml', price: 3570000, originalPrice: 2530000 }],
    stockCount: 10,
  };
  for (const row of [existingCustomProduct, zeroPriceBioderma, badOrigBioderma]) {
    await client.execute({
      sql: `INSERT INTO products (id, nameFa, nameEn, brand, price, originalPrice, stockCount, inStock, data, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        row.id,
        row.nameFa,
        row.nameEn,
        row.brand,
        row.price,
        row.originalPrice || 0,
        10,
        1,
        JSON.stringify(row),
        new Date().toISOString(),
      ],
    });
  }
  await client.execute({
    sql: 'INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)',
    args: ['brands', JSON.stringify([{ id: 'Bioderma', labelFa: 'بایودرما', labelEn: 'Bioderma' }]), new Date().toISOString()],
  });
  await client.execute({
    sql: 'INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)',
    args: ['__vara_schema_version', '2', new Date().toISOString()],
  });

  ctx.mock.module('@libsql/client/web', { namedExports: { createClient: () => client } });
  const { ProductsDb, SettingsDb } = await import(new URL('../serverDb.ts?v1-upgrade', import.meta.url).href);

  const allProducts = await ProductsDb.getAllFresh();
  const expectedTotal = 3 + IMPORTED_SKINCARE_PRODUCTS.length + IMPORTED_MAKEUP_HAIR_PRODUCTS.length;
  assert.equal(allProducts.length, expectedTotal);

  const preserved = allProducts.find((p) => p.id === existingCustomProduct.id);
  assert.equal(preserved?.nameFa, existingCustomProduct.nameFa);
  assert.equal(preserved?.price, 4450000);

  const fixedZero = allProducts.find((p) => p.id === zeroPriceBioderma.id);
  assert.equal(fixedZero?.price, 3216000);
  assert.equal(fixedZero?.variants?.[0]?.price, 3216000);
  assert.equal(fixedZero?.sizes?.[0]?.price, 3216000);

  const fixedOrig = allProducts.find((p) => p.id === badOrigBioderma.id);
  assert.equal(fixedOrig?.price, 3570000);
  assert.equal(fixedOrig?.originalPrice, 0);
  assert.equal(fixedOrig?.variants?.[0]?.originalPrice, undefined);

  const brands = (await SettingsDb.get('brands')) as Array<{ id: string }>;
  assert.ok(brands.some((b) => b.id === 'Bioderma'));
  assert.ok(brands.some((b) => b.id === 'Caudalie'));
  assert.ok(brands.some((b) => b.id === 'Maybelline'));
  assert.ok(brands.some((b) => b.id === 'Phyto'));
  assert.ok(brands.some((b) => b.id === 'ENZO'));

  // Deleting an imported product and resetting schema version must NOT re-import it
  await ProductsDb.delete(IMPORTED_MAKEUP_HAIR_PRODUCTS[0].id);
  await client.execute({
    sql: 'DELETE FROM settings WHERE key = ?',
    args: ['__vara_schema_version'],
  });
  const nextWorker = await import(new URL('../serverDb.ts?v1-upgrade-repeat', import.meta.url).href);
  const afterDelete = await nextWorker.ProductsDb.getAllFresh();
  assert.equal(afterDelete.length, expectedTotal - 1);
  assert.equal(afterDelete.some((p) => p.id === IMPORTED_MAKEUP_HAIR_PRODUCTS[0].id), false);

  client.close();
});
