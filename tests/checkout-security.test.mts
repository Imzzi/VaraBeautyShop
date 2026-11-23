import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Keep all storage in memory and the HTTP listener on loopback, even if the invoking shell has production config.
for (const name of ['TURSO_DATABASE_URL', 'TURSO_URL', 'TURSO_AUTH_TOKEN', 'VERCEL', 'VERCEL_ENV',
  'AWS_LAMBDA_FUNCTION_NAME', 'ZARINPAL_MERCHANT_ID', 'ZARINPAL_PROXY_URL']) delete process.env[name];
process.env.NODE_ENV = 'test';
delete process.env.CUSTOMER_SESSION_SECRET;

const root = path.resolve(import.meta.dirname, '..');
const requireLocal = createRequire(path.join(root, 'package.json'));
const express = requireLocal('express');
const load = (name: string) => import(pathToFileURL(path.join(root, name)).href);
const db = await load('serverDb.ts');
const { dbRouter, generateAdminToken, generateUserToken } = await load('serverDbRouter.ts');
const { issueChallenge, useChallenge } = await load('serverChallenges.ts');
const { registerOrderPaymentRoutes } = await load('serverOrderPayments.ts');
const { ZarinpalService } = await load('serverZarinpal.ts');
const { NextPayService } = await load('serverNextPay.ts');
const { ResendEmailService } = await load('serverEmail.ts');

test('purpose, attempt count, cooldown, and one-time consumption of an issued challenge', async () => {
  const subject = 'fixture-user';
  const issued = await issueChallenge('email-verification', subject, 120000);
  assert.ok(issued);
  assert.equal(await issueChallenge('email-verification', subject, 120000), null);
  assert.equal(await useChallenge('password-reset', subject, issued.code), false);
  const results = await Promise.all([
    useChallenge('email-verification', subject, issued.code),
    useChallenge('email-verification', subject, issued.code),
  ]);
  assert.equal(results.filter(Boolean).length, 1);
  const throttled = await issueChallenge('sms-login', subject, 120000);
  assert.ok(throttled);
  const incorrect = throttled.code === '100000' ? '100001' : '100000';
  for (let attempt = 0; attempt < 5; attempt++) {
    assert.equal(await useChallenge('sms-login', subject, incorrect), false);
  }
  assert.equal(await useChallenge('sms-login', subject, throttled.code), false);
  const expired = await issueChallenge('password-reset', subject, -1);
  assert.equal(await useChallenge('password-reset', subject, expired.code), false);
});

test('checkout, ownership, provider binding, idempotent settlement, and receipts', async (ctx) => {
  const app = express();
  app.use(express.json());
  app.use('/api/db', dbRouter);
  registerOrderPaymentRoutes(app);
  const listener = app.listen(0, '127.0.0.1');
  await once(listener, 'listening');
  ctx.after(() => listener.close());
  const origin = `http://127.0.0.1:${listener.address().port}`;
  const send = (endpoint: string, body?: unknown, headers: Record<string, string> = {}) =>
    fetch(origin + endpoint, body === undefined ? { headers, redirect: 'manual' } : {
      method: 'POST', headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body), redirect: 'manual',
    });

  const google = requireLocal('google-auth-library').OAuth2Client;
  ctx.mock.method(google.prototype, 'verifyIdToken', async () => ({
    getPayload: () => ({ sub: 'synthetic-subject', email: 'fixture-google@example.test', email_verified: true, name: 'Fixture' }),
  }));
  assert.equal((await send('/api/db/users/sync-phone', {})).status, 404);
  assert.equal((await send('/api/db/users/sync-google', { credential: 'fixture' })).status, 403);
  const googleResult = await send('/api/db/users/sync-google', { credential: 'fixture' }, { 'X-Vara-Google-Sign-In': '1' });
  assert.equal(googleResult.status, 200);
  const googleSession = await googleResult.json();
  assert.ok(googleSession.profile.uid);
  assert.equal(Object.hasOwn(googleSession.profile, 'passwordHash'), false);
  assert.equal(Object.hasOwn(googleSession.profile, 'verificationCode'), false);

  const products = await db.ProductsDb.getAll();
  const product = products.find(p => p.stockCount > 8 && p.price >= 1000 && !p.variants?.length && !p.sizes?.length)
    ?? products.find(p => p.stockCount > 8 && p.price >= 1000 && !p.variants?.length);
  assert.ok(product);
  const line = { productId: product.id, quantity: 1, sizeLabel: product.sizes?.[0]?.label };
  const online = {
    customer: { name: 'Fixture', phone: '09000000000', city: 'تهران', address: 'Fixture address' },
    items: [line], paymentMethod: 'online_gateway', shippingMethod: 'post_express',
  };
  const owner = { Authorization: `Bearer ${googleSession.token}` };
  const other = { Authorization: `Bearer ${generateUserToken({ uid: 'other-fixture' })}` };
  const admin = { Authorization: `Bearer ${generateAdminToken('fixture-admin')}` };
  const createA = await send('/api/db/orders', online, owner);
  assert.equal(createA.status, 201, JSON.stringify(await createA.clone().json()));
  const orderA = (await createA.json()).order;
  assert.equal(orderA.paymentStatus, 'pending_verification');
  assert.equal(orderA.userId, googleSession.profile.uid);
  assert.ok(orderA.totalAmount >= 1000);
  const createB = await send('/api/db/orders', online);
  assert.equal(createB.status, 201);
  const guest = { Cookie: createB.headers.get('set-cookie')!.split(';')[0] };
  const orderB = (await createB.json()).order;
  assert.equal((await send('/api/db/orders/lookup/' + orderB.orderNumber)).status, 404);
  assert.equal((await send('/api/db/orders/lookup/' + orderB.orderNumber, undefined, guest)).status, 200);
  assert.equal((await send('/api/db/orders/lookup/' + orderA.orderNumber, undefined, other)).status, 404);
  assert.equal((await send('/api/db/orders/lookup/' + orderA.orderNumber, undefined, owner)).status, 200);
  assert.deepEqual((await (await send('/api/db/orders/user', undefined, other)).json()).orders, []);
  const resumeA = '/api/db/orders/checkout/' + orderA.id;
  const resumeB = '/api/db/orders/checkout/' + orderB.id;
  assert.equal((await send(resumeA, undefined, other)).status, 404);
  assert.equal((await send(resumeB)).status, 404);
  assert.equal((await send(resumeB, undefined, guest)).status, 200);
  assert.deepEqual((await (await send('/api/db/orders/user', undefined, owner)).json()).orders, []);

  const requestA = ctx.mock.method(ZarinpalService, 'requestPayment', async () => ({
    success: true, authority: 'fixture-a', paymentUrl: 'https://sandbox.zarinpal.com/pg/StartPay/fixture-a',
  }));
  let gatewayPaid = false;
  const verifyA = ctx.mock.method(ZarinpalService, 'verifyPayment', async ({ amountToman }) => {
    assert.equal(amountToman, orderA.totalAmount);
    return gatewayPaid ? { success: true, refId: 'fixture-receipt-a' } : { success: false };
  });
  const email = ctx.mock.method(ResendEmailService, 'sendOrderConfirmation', async () => ({ success: true }));
  const startA = () => send('/api/payment/zarinpal/request', { orderId: orderA.id }, owner);
  assert.equal((await startA()).status, 200);
  assert.equal((await startA()).status, 200);
  assert.equal(requestA.mock.callCount(), 1);
  assert.equal((await send('/api/payment/zarinpal/request', { orderId: orderA.id }, other)).status, 404);
  assert.equal((await send('/api/payment/zarinpal/verify', { orderId: orderB.id, authority: 'fixture-a' }, guest)).status, 409);
  assert.equal(verifyA.mock.callCount(), 0);
  const cb = '/api/payment/zarinpal/callback?Authority=fixture-a';
  const cancelled = await send(cb + '&Status=NOK');
  assert.equal(cancelled.status, 303);
  assert.equal(cancelled.headers.get('location'), '/checkout/payment?order=' + orderA.id);
  const resumed = await send(resumeA, undefined, owner);
  assert.match(resumed.headers.get('cache-control')!, /private, no-store/);
  const { order: draft } = await resumed.json();
  assert.equal(draft.id, orderA.id);
  assert.equal(draft.paymentStatus, 'pending_verification');
  assert.equal(draft.totalAmount, orderA.totalAmount);
  assert.equal(Object.hasOwn(draft, 'paymentAttempt'), false);
  assert.equal(email.mock.callCount(), 0);
  assert.equal((await startA()).status, 200);
  assert.equal(requestA.mock.callCount(), 1);

  gatewayPaid = true;
  const callbacks = await Promise.all([send(cb), send(cb)]);
  assert.ok(callbacks.every(res => res.status === 303 &&
    res.headers.get('location') === '/order/' + orderA.orderNumber + '?orderSuccess=true'));
  assert.equal((await db.OrdersDb.getById(orderA.id)).paymentStatus, 'paid');
  assert.equal((await (await send(resumeA, undefined, owner)).json()).order.paymentStatus, 'paid');
  assert.equal((await (await send('/api/db/orders/user', undefined, owner)).json()).orders[0].id, orderA.id);
  assert.deepEqual(await (await startA()).json(), { success: true, settled: true });
  assert.equal(email.mock.callCount(), 1);

  process.env.NEXTPAY_API_KEY = 'synthetic-nextpay-fixture';
  ctx.mock.method(NextPayService, 'requestPayment', async () => ({
    success: true, transId: 'fixture-b', paymentUrl: 'https://nextpay.org/nx/gateway/payment/fixture-b',
  }));
  ctx.mock.method(NextPayService, 'verifyPayment', async () => ({ success: false }));
  assert.equal((await send('/api/payment/nextpay/request', { orderId: orderB.id }, guest)).status, 200);
  await send('/api/payment/nextpay/callback?trans_id=fixture-b');
  assert.equal((await db.OrdersDb.getById(orderB.id)).paymentStatus, 'pending_verification');
  ctx.mock.method(NextPayService, 'verifyPayment', async () => ({ success: true, refId: 'fixture-receipt-b' }));
  assert.equal((await send('/api/payment/nextpay/callback?trans_id=fixture-b')).status, 303);
  assert.equal((await db.OrdersDb.getById(orderB.id)).paymentStatus, 'paid');

  const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/n8sAAAAASUVORK5CYII=';
  const createReceipt = await send('/api/db/orders', { ...online, paymentMethod: 'card_transfer', paymentReceiptImage: png });
  assert.equal(createReceipt.status, 201);
  const receiptOrder = (await createReceipt.json()).order;
  assert.equal(Object.hasOwn(receiptOrder, 'paymentReceiptImage'), false);
  const receiptUrl = '/api/db/orders/' + receiptOrder.id + '/receipt';
  assert.equal((await send(receiptUrl)).status, 401);
  const receipt = await send(receiptUrl, undefined, admin);
  assert.equal(receipt.status, 200);
  assert.match(receipt.headers.get('cache-control')!, /private, no-store/);
  await ctx.test('product mutations preserve unrelated fields and acknowledge persisted results', async () => {
    const catalogue = '/api/db/products';
    const sku = 'fixture-' + randomUUID();
    const productBody = { ...product, id: sku, nameFa: 'محصول آزمایشی', stockCount: 1, inStock: true };
    const mutate = (method: string, suffix: string, body?: object) => fetch(origin + catalogue + suffix, {
      method, headers: { ...admin, 'Content-Type': 'application/json' }, body: body && JSON.stringify(body),
    });
    const createFixture = () => mutate('POST', '', productBody);
    assert.equal((await createFixture()).status, 200);
    assert.equal((await createFixture()).status, 200);
    assert.equal((await mutate('POST', '', { ...productBody, price: 1 })).status, 409);
    assert.equal((await mutate('POST', '', { ...productBody, id: 'inline-fixture', images: [png] })).status, 400);
    const patch = await mutate('PUT', '/' + sku, { isBestSeller: true });
    assert.equal(patch.status, 200);
    const updated = (await patch.json()).product;
    assert.equal(updated.nameFa, productBody.nameFa);
    assert.deepEqual(updated.images, productBody.images);
    assert.equal(updated.price, productBody.price);
    assert.equal(updated.isBestSeller, true);
    assert.equal((await mutate('PATCH', '/' + sku + '/stock', { stockCount: -1 })).status, 400);
    assert.equal((await mutate('PATCH', '/not-found/stock', { stockCount: 1 })).status, 404);
    assert.equal((await mutate('PUT', '/not-found', { isBestSeller: true })).status, 404);
    const fresh = await send('/api/db/admin/products', undefined, admin);
    assert.equal(fresh.status, 200);
    assert.match(fresh.headers.get('cache-control')!, /private, no-store/);
    assert.equal((await fresh.json()).products.find((record) => record.id === sku).price, productBody.price);

    const cart = { ...online, items: [{ ...line, productId: sku }] };
    const place = (key: string, body = cart) => send('/api/db/orders', body, { 'X-Vara-Checkout-Id': key });
    const quantityKey = randomUUID();
    assert.equal((await place(quantityKey, { ...cart, items: [cart.items[0], cart.items[0]] })).status, 409);
    assert.equal((await db.ProductsDb.getById(sku)).stockCount, 1);
    const keys = [randomUUID(), randomUUID()];
    const responses = await Promise.all(keys.map((key) => place(key)));
    assert.deepEqual(responses.map((response) => response.status).sort(), [201, 409]);
    const winner = responses.findIndex((response) => response.status === 201);
    const { order: placed } = await responses[winner].json();
    const retry = await place(keys[winner]);
    assert.equal(retry.status, 201);
    assert.equal((await retry.json()).order.id, placed.id);
    assert.equal((await place(keys[winner], { ...cart, customer: { ...cart.customer, name: 'Different' } })).status, 409);
    assert.equal((await db.ProductsDb.getById(sku)).stockCount, 0);

    const cancel = () => fetch(origin + '/api/db/orders/' + placed.id + '/status', {
      method: 'PATCH', headers: { ...admin, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    assert.deepEqual((await Promise.all([cancel(), cancel()])).map((response) => response.status), [200, 200]);
    assert.equal((await db.ProductsDb.getById(sku)).stockCount, 1);
    assert.equal((await mutate('DELETE', '/' + sku)).status, 200);
    assert.equal((await mutate('DELETE', '/' + sku)).status, 404);
  });

  await ctx.test('admin order pages retain filters and cursor boundaries', async () => {
    const search = new URLSearchParams({ q: 'Pagination Fixture' });
    const pageUrl = '/api/db/orders/page?' + search;
    assert.equal((await send(pageUrl)).status, 401);
    const quotation = {
      ...online, paymentMethod: 'card_transfer',
      customer: { ...online.customer, name: 'Pagination Fixture' },
      items: [{ productId: 'dubai-0', nameFa: 'Fixture', quantity: 1 }],
    };
    for (let i = 0; i < 26; i++) {
      assert.equal((await send('/api/db/orders', quotation)).status, 201);
    }
    const first = await (await send(pageUrl, undefined, admin)).json();
    assert.equal(first.orders.length, 25);
    assert.ok(first.nextCursor);
    const second = await (await send(pageUrl + '&cursor=' + first.nextCursor, undefined, admin)).json();
    assert.equal(second.orders.length, 1);
    assert.equal(second.nextCursor, null);
    assert.equal(new Set([...first.orders, ...second.orders].map((record) => record.id)).size, 26);
    const stats = await (await send('/api/db/orders/stats', undefined, admin)).json();
    assert.ok(stats.stats.total >= 26);
  });

});
