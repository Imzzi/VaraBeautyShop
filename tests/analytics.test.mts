import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { once } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

for (const name of [
  'TURSO_DATABASE_URL',
  'TURSO_URL',
  'TURSO_AUTH_TOKEN',
  'VERCEL',
  'VERCEL_ENV',
  'AWS_LAMBDA_FUNCTION_NAME',
  'GA4_PROPERTY_ID',
  'GA4_SERVICE_ACCOUNT_JSON',
]) {
  delete process.env[name];
}
process.env.NODE_ENV = 'test';
process.env.ADMIN_PASSWORD = 'test-admin-secret-for-analytics-suite';

const root = path.resolve(import.meta.dirname, '..');
const requireLocal = createRequire(path.join(root, 'package.json'));
const http = requireLocal('node:http');
const load = (name: string) => import(pathToFileURL(path.join(root, name)).href);

const { normalizeGaMeasurementId } = await load('src/lib/analytics.ts');
const { normalizeGa4PropertyId } = await load('serverAnalytics.ts');
const { generateAdminToken } = await load('serverDbRouter.ts');
const { app } = await load('server.ts');

test('normalizeGaMeasurementId and normalizeGa4PropertyId validate formats strictly', () => {
  assert.equal(normalizeGaMeasurementId(' g-1a2b3c4d5e '), 'G-1A2B3C4D5E');
  assert.equal(normalizeGaMeasurementId('G-9XYZ1234AB'), 'G-9XYZ1234AB');
  for (const invalid of ['', 'UA-12345-1', 'GTM-12345', 'G-12<script>', 'G-123', 'javascript:alert(1)']) {
    assert.equal(normalizeGaMeasurementId(invalid), null, `Expected invalid ID: ${invalid}`);
  }

  assert.equal(normalizeGa4PropertyId('properties/123456789'), '123456789');
  assert.equal(normalizeGa4PropertyId('987654321'), '987654321');
  for (const bad of ['', 'abc', '123', 'properties/G-12345', '123;DROP TABLE']) {
    assert.equal(normalizeGa4PropertyId(bad), null, `Expected invalid property ID: ${bad}`);
  }
});

test('vercel.json CSP allows GA4 gtag.js & analytics beacons without unsafe-inline or unsafe-eval', () => {
  const vercelJson = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  const rootHeaders = vercelJson.headers?.find((h: any) => h.source === '/(.*)')?.headers || [];
  const csp = rootHeaders.find((h: any) => h.key === 'Content-Security-Policy')?.value || '';

  const scriptSrc = (csp.match(/script-src\s+([^;]+)/) || [])[1] || '';
  const connectSrc = (csp.match(/connect-src\s+([^;]+)/) || [])[1] || '';
  assert.ok(scriptSrc.includes('https://www.googletagmanager.com'));
  assert.equal(scriptSrc.includes('unsafe-inline'), false);
  assert.equal(scriptSrc.includes('unsafe-eval'), false);
  assert.ok(connectSrc.includes('https://www.google-analytics.com'));
  assert.ok(connectSrc.includes('https://*.analytics.google.com'));
});

test('analytics_config endpoint allows public reads and protects writes behind admin auth', async () => {
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const getRes = await fetch(`${baseUrl}/api/db/settings/analytics_config`);
    assert.equal(getRes.status, 200);
    const getJson = await getRes.json();
    assert.equal(getJson.success, true);

    const postRes = await fetch(`${baseUrl}/api/db/settings/analytics_config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: { gaMeasurementId: 'G-TEST123456' } }),
    });
    assert.equal(postRes.status, 401);
  } finally {
    server.close();
  }
});

test('first-party analytics collector and protected admin report aggregate live metrics accurately', async () => {
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // Unauthenticated admin report must fail closed with 401
    const unauthReport = await fetch(`${baseUrl}/api/admin/analytics/report?range=7d`);
    assert.equal(unauthReport.status, 401);

    // Invalid eventName returns 400
    const badCollect = await fetch(`${baseUrl}/api/analytics/collect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName: 'arbitrary_xss_event' }),
    });
    assert.equal(badCollect.status, 400);

    // Record valid store events
    const eventsToSend = [
      {
        eventName: 'page_view',
        sessionId: 'sess-1',
        visitorId: 'vis-1',
        pagePath: '/shop?category=sunscreen',
        pageTitle: 'ضدآفتاب',
        referrer: 'https://www.google.com/search?q=sunscreen',
      },
      {
        eventName: 'view_item',
        sessionId: 'sess-1',
        visitorId: 'vis-1',
        pagePath: '/product/prod-1',
        itemId: 'prod-1',
        itemName: 'ضدآفتاب سنتلا',
      },
      {
        eventName: 'add_to_cart',
        sessionId: 'sess-1',
        visitorId: 'vis-1',
        pagePath: '/product/prod-1',
        itemId: 'prod-1',
        itemName: 'ضدآفتاب سنتلا',
        valueToman: 950000,
      },
      {
        eventName: 'search',
        sessionId: 'sess-2',
        visitorId: 'vis-2',
        pagePath: '/shop',
        searchTerm: 'سراوی',
      },
    ];

    for (const ev of eventsToSend) {
      const r = await fetch(`${baseUrl}/api/analytics/collect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ev),
      });
      assert.equal(r.status, 200);
    }

    // Fetch live report using a valid signed admin token
    const adminToken = generateAdminToken('admin');

    const reportRes = await fetch(`${baseUrl}/api/admin/analytics/report?range=7d`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(reportRes.status, 200);
    const reportJson = await reportRes.json();
    assert.equal(reportJson.success, true);

    const { report } = reportJson;
    assert.equal(report.source, 'first-party');
    assert.equal(report.dailySeries.length, 7);
    assert.ok(report.summary.activeUsers >= 2);
    assert.ok(report.summary.sessions >= 2);
    assert.ok(report.summary.pageViews >= 1);
    assert.equal(report.funnel.view_item, 1);
    assert.equal(report.funnel.add_to_cart, 1);
    assert.equal(report.funnel.search, 1);
    assert.equal(report.topPages[0].path, '/shop?category=sunscreen');
    assert.ok(report.topSources.some((s: any) => s.source.includes('گوگل')));
    assert.equal(report.topSearches[0].term, 'سراوی');
    assert.equal(report.topProducts[0].itemId, 'prod-1');
  } finally {
    server.close();
  }
});
