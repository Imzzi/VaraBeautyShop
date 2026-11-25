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

const { app } = await load('server.ts');
const { isInternalOrLoopbackHost, validateScraperUrl, safeScraperFetch } = await load('serverExtractor.ts');
const { detectSafeProxyImage } = await load('serverBlob.ts');
const { escapeHtml } = await load('serverSecurity.ts');
const { ProductsDb, OrdersDb, UsersDb, SettingsDb } = await load('serverDb.ts');
const { sanitizeNavigationUrl, isSafeHttpsUrl } = await load('src/utils/safeUrl.ts');

test('SSRF defense: isInternalOrLoopbackHost blocks IPv4, shorthand, decimal/hex, ULA/link-local IPv6, and hex IPv4-mapped addresses', () => {
  const blockedHosts = [
    'localhost',
    'localhost.',
    'sub.localhost',
    'metadata.google.internal',
    '127.0.0.1',
    '127.1',
    '0.0.0.0',
    '10.0.0.1',
    '100.64.0.1',
    '172.16.0.1',
    '172.31.255.255',
    '192.168.1.1',
    '169.254.169.254',
    '2130706433',
    '0x7f000001',
    '0177.0.0.1',
    '::1',
    '[::1]',
    'fc00::1',
    'fd12:3456::1',
    'fe80::1',
    'fe80::1%eth0',
    '::ffff:127.0.0.1',
    '::ffff:7f00:1',
    '::ffff:a9fe:a9fe',
    '0:0:0:0:0:ffff:7f00:1',
  ];

  for (const host of blockedHosts) {
    assert.equal(isInternalOrLoopbackHost(host), true, `Expected ${host} to be blocked`);
  }

  // Verify WHATWG URL normalized hostnames for bracketed IPv4-mapped IPv6 are also blocked
  const parsedMappedLoopback = new URL('http://[::ffff:127.0.0.1]/admin');
  assert.equal(isInternalOrLoopbackHost(parsedMappedLoopback.hostname), true);
  const parsedMappedImds = new URL('http://[::ffff:169.254.169.254]/latest/meta-data');
  assert.equal(isInternalOrLoopbackHost(parsedMappedImds.hostname), true);

  for (const allowedHost of ['www.sephora.ae', 'www.amazon.ae', 'oss.sazito.com', '8.8.8.8']) {
    assert.equal(isInternalOrLoopbackHost(allowedHost), false, `Expected ${allowedHost} to be allowed`);
  }
});

test('SSRF defense: validateScraperUrl rejects embedded credentials and safeScraperFetch blocks unsafe 302 redirects', async () => {
  assert.equal(validateScraperUrl('https://user:pass@www.sephora.ae/ae-en/p/test').isValid, false);
  assert.equal(validateScraperUrl('javascript:alert(1)').isValid, false);
  assert.equal(validateScraperUrl('https://www.sephora.ae/ae-en/p/test').isValid, true);

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () =>
    new Response(null, {
      status: 302,
      headers: { location: 'http://169.254.169.254/latest/meta-data/' },
    })) as typeof fetch;

  try {
    await assert.rejects(
      () => safeScraperFetch('https://www.sephora.ae/ae-en/p/test'),
      /SSRF Blocked/i
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('XSS defense: proxy magic bytes reject SVG/HTML, URL sanitizer blocks script schemes, and CSP excludes unsafe-inline scripts', () => {
  // SVG & HTML payloads must fail magic-byte validation
  assert.equal(detectSafeProxyImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"></svg>')).valid, false);
  assert.equal(detectSafeProxyImage(Buffer.from('<!doctype html><script>alert(1)</script>')).valid, false);

  // Raster magic bytes pass
  assert.deepEqual(detectSafeProxyImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), { valid: true, mime: 'image/png' });
  assert.deepEqual(detectSafeProxyImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10])), { valid: true, mime: 'image/jpeg' });
  assert.deepEqual(detectSafeProxyImage(Buffer.from('GIF89a\x01\x00\x01\x00')), { valid: true, mime: 'image/gif' });

  // Frontend URL sanitizer blocks dangerous schemes and protocol-relative open redirects
  for (const dangerous of [
    'javascript:alert(1)',
    '  JaVaScRiPt:alert(1) ',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '//evil.example/phish',
    'https://user:pass@varabeauty.ir/',
  ]) {
    assert.equal(sanitizeNavigationUrl(dangerous), null, `Expected ${dangerous} to be rejected`);
  }
  assert.equal(sanitizeNavigationUrl('/shop?category=cleanser'), '/shop?category=cleanser');
  assert.equal(sanitizeNavigationUrl('https://www.sephora.ae/ae-en/p/blush'), 'https://www.sephora.ae/ae-en/p/blush');
  assert.equal(isSafeHttpsUrl('http://gateway.example/pay'), false);
  assert.equal(isSafeHttpsUrl('https://payment.zarinpal.com/pg/StartPay/123'), true);

  // HTML escaping
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');

  // Vercel CSP header exists and script-src does not allow unsafe-inline or unsafe-eval
  const vercelJson = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const rootHeaders = vercelJson.headers?.find((h: any) => h.source === '/(.*)')?.headers || [];
  const csp = rootHeaders.find((h: any) => h.key === 'Content-Security-Policy')?.value || '';
  assert.ok(csp.includes("object-src 'none'"));
  assert.ok(csp.includes("frame-ancestors 'none'"));
  const scriptSrcMatch = csp.match(/script-src\s+([^;]+)/);
  assert.ok(scriptSrcMatch && !scriptSrcMatch[1].includes('unsafe-inline') && !scriptSrcMatch[1].includes('unsafe-eval'));
});

test('SQLi defense: parameterized database repositories treat SQL metacharacters as literal data', async () => {
  const payload = "' OR '1'='1'; DROP TABLE products; --";
  assert.equal(await ProductsDb.getById(payload), null);
  assert.equal(await OrdersDb.getByOrderNumber(payload), null);
  const page = await OrdersDb.getPage({ query: payload, limit: 10 });
  assert.deepEqual(page.orders, []);
  assert.equal(await UsersDb.getByEmail("admin' OR '1'='1@example.com"), null);
  assert.equal(await SettingsDb.get(payload, null), null);
  // Products table remains intact
  const products = await ProductsDb.getAllFresh();
  assert.ok(products.length > 0);
});

test('HTTP endpoint hardening: outbound-ip & admin/credentials require auth, health minimizes leakage, and proxy-image/settings validate inputs', async () => {
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const ipRes = await fetch(`${baseUrl}/api/outbound-ip`);
    assert.equal(ipRes.status, 401);

    const credsRes = await fetch(`${baseUrl}/api/db/admin/credentials`);
    assert.equal(credsRes.status, 401);

    const healthRes = await fetch(`${baseUrl}/api/health`);
    assert.equal(healthRes.status, 200);
    const healthJson = await healthRes.json();
    assert.equal(healthJson.status, 'ok');
    assert.equal(healthJson.kavenegarConfigured, undefined);
    assert.equal(healthJson.template, undefined);

    const proxyInternal = await fetch(`${baseUrl}/api/proxy-image?url=${encodeURIComponent('http://169.254.169.254/latest/meta-data')}`);
    assert.equal(proxyInternal.status, 403);

    const proxyMapped = await fetch(`${baseUrl}/api/proxy-image?url=${encodeURIComponent('http://[::ffff:127.0.0.1]/secret.png')}`);
    assert.equal(proxyMapped.status, 403);

    const proxyScheme = await fetch(`${baseUrl}/api/proxy-image?url=${encodeURIComponent('javascript:alert(1)')}`);
    assert.equal(proxyScheme.status, 400);

    const badSetting1 = await fetch(`${baseUrl}/api/db/settings/__proto__`);
    assert.equal(badSetting1.status, 404);

    const badSetting2 = await fetch(`${baseUrl}/api/db/settings/__vara_schema_version`);
    assert.equal(badSetting2.status, 404);
  } finally {
    server.close();
  }
});
