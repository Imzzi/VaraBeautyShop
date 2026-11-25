import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeFxRatesFromUsd,
  fetchLiveFxRates,
  roundFxRate,
} from '../serverFxRates';
import { runFxSync } from '../serverFxSync';
import { DEFAULT_FORMULA_CONFIG, FORMULA_SETTING_KEY } from '../src/lib/formulaTypes';

function mockJsonResponse(body: any, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

test('roundFxRate rounds TRY to nearest 10 and USD/AED/GBP/EUR to nearest 100', () => {
  assert.equal(roundFxRate(5934, 'TRY'), 5930);
  assert.equal(roundFxRate(5936, 'TRY'), 5940);
  assert.equal(roundFxRate(305549, 'USD'), 305500);
  assert.equal(roundFxRate(305551, 'USD'), 305600);
  assert.equal(roundFxRate(83219, 'AED'), 83200);
  assert.equal(roundFxRate(400360, 'GBP'), 400400);
  assert.equal(roundFxRate(334890, 'EUR'), 334900);
});

test('computeFxRatesFromUsd applies +4% margin and derives AED/TRY/GBP/EUR from USD', () => {
  const baseUsdtToman = 290_000;
  const cross = { AED: 3.6725, TRY: 50.0, GBP: 0.76, EUR: 0.91 };
  // effectiveUsd = 290,000 * 1.04 = 301,600
  // USD = 301,600
  // AED = 301,600 / 3.6725 = 82,123.89 -> 82,100
  // TRY = 301,600 / 50.0 = 6,032 -> 6,030
  // GBP = 301,600 / 0.76 = 396,842.1 -> 396,800
  // EUR = 301,600 / 0.91 = 331,428.57 -> 331,400
  const rates = computeFxRatesFromUsd(baseUsdtToman, cross, 4);
  assert.deepEqual(rates, {
    usdRate: 301600,
    aedRate: 82100,
    tryRate: 6030,
    gbpRate: 396800,
    eurRate: 331400,
  });
});

test('fetchLiveFxRates uses Nobitex (Rial->Toman) and ExchangeRate-API as primary sources', async () => {
  const mockFetch: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes('apiv2.nobitex.ir')) {
      return mockJsonResponse({ status: 'ok', lastTradePrice: '2950000' }); // 295,000 Toman
    }
    if (url.includes('open.er-api.com')) {
      return mockJsonResponse({
        rates: { AED: 3.6725, TRY: 50.67, GBP: 0.763, EUR: 0.912 },
      });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const res = await fetchLiveFxRates(4, mockFetch);
  assert.equal(res.baseUsdtToman, 295000);
  assert.equal(res.rateMarginPercent, 4);
  assert.equal(res.source, 'Nobitex USDT + ExchangeRate-API');
  assert.equal(res.rates.usdRate, 306800); // 295,000 * 1.04
  assert.equal(res.rates.aedRate, 83500);  // round100(306800 / 3.6725 = 83539.8)
  assert.equal(res.rates.tryRate, 6050);   // round10(306800 / 50.67 = 6054.86 -> 6050)
});

test('fetchLiveFxRates falls back to Tabdeal (Toman) then TGJU Tether (Rial->Toman) and jsDelivr/CF cross-rates', async () => {
  // Scenario A: Nobitex fails, Tabdeal succeeds; ExchangeRate-API fails, jsDelivr succeeds
  const fetchTabdealJsDelivr: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes('apiv2.nobitex.ir')) return mockJsonResponse({}, 503);
    if (url.includes('api1.tabdeal.org')) {
      return mockJsonResponse({ bids: [['294000', '10']], asks: [['294200', '10']] }); // midpoint 294,100 Toman
    }
    if (url.includes('open.er-api.com')) return mockJsonResponse({ rates: { AED: 0 } }); // invalid sanity -> fallback
    if (url.includes('cdn.jsdelivr.net')) {
      return mockJsonResponse({ usd: { aed: 3.6725, try: 50.0, gbp: 0.76, eur: 0.91 } });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const resA = await fetchLiveFxRates(4, fetchTabdealJsDelivr);
  assert.equal(resA.baseUsdtToman, 294100);
  assert.equal(resA.source, 'Tabdeal USDT + Currency-API (jsDelivr)');

  // Scenario B: Nobitex corrupted + Tabdeal down -> TGJU Tether succeeds; ExchangeRate + jsDelivr fail -> CF succeeds
  const fetchTgjuCf: typeof fetch = async (input) => {
    const url = String(input);
    if (url.includes('apiv2.nobitex.ir')) return mockJsonResponse({ lastTradePrice: '50' }); // out of bounds -> rejected
    if (url.includes('api1.tabdeal.org')) return mockJsonResponse({}, 500);
    if (url.includes('call1.tgju.org')) {
      return mockJsonResponse({ current: { 'crypto-tether-irr': { p: '2,960,000' } } }); // 296,000 Toman
    }
    if (url.includes('open.er-api.com')) return mockJsonResponse({}, 500);
    if (url.includes('cdn.jsdelivr.net')) return mockJsonResponse({}, 500);
    if (url.includes('latest.currency-api.pages.dev')) {
      return mockJsonResponse({ usd: { aed: 3.6725, try: 50.0, gbp: 0.76, eur: 0.91 } });
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const resB = await fetchLiveFxRates(4, fetchTgjuCf);
  assert.equal(resB.baseUsdtToman, 296000);
  assert.equal(resB.source, 'TGJU USDT + Currency-API (CF)');
});

test('runFxSync preserves non-FX formula fields and respects autoUpdateRates: false unless forced', async () => {
  let storedValue: any = {
    ...DEFAULT_FORMULA_CONFIG,
    shippingPer100g: 112000,
    customsRatePercent: 7.5,
    varaFeePercent: 6,
    discountPercent: 3,
    maxDiscountToman: 120000,
    deliveryDaysMin: 4,
    deliveryDaysMax: 7,
    autoUpdateRates: false,
    rateMarginPercent: 4,
  };

  let fetchCount = 0;
  const fakeDeps = {
    getSetting: async (key: string) => (key === FORMULA_SETTING_KEY ? storedValue : null),
    setSetting: async (key: string, val: any) => {
      if (key === FORMULA_SETTING_KEY) storedValue = val;
    },
    fetchRates: async (marginPercent: number) => {
      fetchCount++;
      const cross = { AED: 3.6725, TRY: 50, GBP: 0.76, EUR: 0.91 };
      return {
        rates: computeFxRatesFromUsd(300_000, cross, marginPercent),
        baseUsdtToman: 300_000,
        usdCrossRates: cross,
        rateMarginPercent: marginPercent,
        source: 'Nobitex USDT + ExchangeRate-API',
        fetchedAt: '2026-11-25T13:30:00.000Z',
      };
    },
  };

  // Schedule trigger skips when autoUpdateRates is false
  const skipped = await runFxSync({ trigger: 'schedule', force: false }, fakeDeps);
  assert.equal(skipped.updated, false);
  assert.equal(skipped.skippedReason, 'auto_update_disabled');
  assert.equal(fetchCount, 0);

  // Manual trigger with force=true updates FX rates while preserving all custom formula parameters
  const forced = await runFxSync({ trigger: 'manual', force: true }, fakeDeps);
  assert.equal(forced.updated, true);
  assert.equal(fetchCount, 1);
  assert.equal(storedValue.usdRate, 312000);
  assert.equal(storedValue.aedRate, 85000);
  assert.equal(storedValue.shippingPer100g, 112000);
  assert.equal(storedValue.customsRatePercent, 7.5);
  assert.equal(storedValue.varaFeePercent, 6);
  assert.equal(storedValue.discountPercent, 3);
  assert.equal(storedValue.maxDiscountToman, 120000);
  assert.equal(storedValue.deliveryDaysMin, 4);
  assert.equal(storedValue.deliveryDaysMax, 7);
  assert.equal(storedValue.autoUpdateRates, false);
});
