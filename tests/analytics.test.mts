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

const { normalizeGaMeasurementId } = await load('src/lib/analytics.ts');
const { app } = await load('server.ts');

test('normalizeGaMeasurementId accepts valid GA4 IDs and rejects malformed or script inputs', () => {
  assert.equal(normalizeGaMeasurementId(' g-1a2b3c4d5e '), 'G-1A2B3C4D5E');
  assert.equal(normalizeGaMeasurementId('G-9XYZ1234AB'), 'G-9XYZ1234AB');
  for (const invalid of ['', 'UA-12345-1', 'GTM-12345', 'G-12<script>', 'G-123', 'javascript:alert(1)']) {
    assert.equal(normalizeGaMeasurementId(invalid), null, `Expected invalid ID: ${invalid}`);
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
