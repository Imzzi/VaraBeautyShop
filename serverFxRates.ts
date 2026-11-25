import type { UsdCrossRates } from './src/lib/formulaTypes';

export type FxCurrency = 'USD' | 'AED' | 'TRY' | 'GBP' | 'EUR';

export interface ComputedFxRates {
  usdRate: number;
  aedRate: number;
  tryRate: number;
  gbpRate: number;
  eurRate: number;
}

export interface LiveFxRatesResult {
  rates: ComputedFxRates;
  baseUsdtToman: number;
  usdCrossRates: UsdCrossRates;
  rateMarginPercent: number;
  source: string;
  fetchedAt: string;
}

export const USDT_TOMAN_MIN = 30_000;
export const USDT_TOMAN_MAX = 2_000_000;

export const USD_CROSS_BOUNDS: Record<keyof UsdCrossRates, readonly [number, number]> = {
  AED: [3.4, 3.9],
  TRY: [15, 200],
  GBP: [0.5, 1.2],
  EUR: [0.6, 1.4],
};

const REQUEST_TIMEOUT_MS = 6000;

export function roundFxRate(rawToman: number, currency: FxCurrency): number {
  if (!Number.isFinite(rawToman) || rawToman <= 0) {
    throw new Error(`Invalid raw rate for ${currency}: ${rawToman}`);
  }
  const step = currency === 'TRY' ? 10 : 100;
  return Math.round(rawToman / step) * step;
}

export function computeFxRatesFromUsd(
  baseUsdtToman: number,
  cross: UsdCrossRates,
  marginPercent: number = 4
): ComputedFxRates {
  if (!Number.isFinite(baseUsdtToman) || baseUsdtToman < USDT_TOMAN_MIN || baseUsdtToman > USDT_TOMAN_MAX) {
    throw new Error(`USDT Toman rate out of bounds: ${baseUsdtToman}`);
  }
  validateUsdCrossRates(cross);

  const safeMargin = Number.isFinite(marginPercent) ? Math.min(50, Math.max(0, marginPercent)) : 4;
  const effectiveUsdToman = baseUsdtToman * (1 + safeMargin / 100);

  return {
    usdRate: roundFxRate(effectiveUsdToman, 'USD'),
    aedRate: roundFxRate(effectiveUsdToman / cross.AED, 'AED'),
    tryRate: roundFxRate(effectiveUsdToman / cross.TRY, 'TRY'),
    gbpRate: roundFxRate(effectiveUsdToman / cross.GBP, 'GBP'),
    eurRate: roundFxRate(effectiveUsdToman / cross.EUR, 'EUR'),
  };
}

function parseNumericValue(raw: unknown): number {
  if (typeof raw === 'number') return raw;
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/,/g, '').trim();
    if (!cleaned) return NaN;
    return Number(cleaned);
  }
  return NaN;
}

function isValidUsdtToman(val: number): boolean {
  return Number.isFinite(val) && val >= USDT_TOMAN_MIN && val <= USDT_TOMAN_MAX;
}

function validateUsdCrossRates(cross: UsdCrossRates): void {
  (['AED', 'TRY', 'GBP', 'EUR'] as const).forEach((key) => {
    const val = cross[key];
    const [min, max] = USD_CROSS_BOUNDS[key];
    if (!Number.isFinite(val) || val < min || val > max) {
      throw new Error(`Cross rate ${key} out of bounds: ${val}`);
    }
  });
}

async function fetchJsonWithTimeout(url: string, fetchImpl: typeof fetch): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetchImpl(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'VaraBeautyFX/1.0',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchUsdtTomanRate(
  fetchImpl: typeof fetch = fetch
): Promise<{ usdtToman: number; source: string }> {
  const errors: string[] = [];

  // 1. Nobitex (returns Rial -> divide by 10 for Toman)
  try {
    const data = await fetchJsonWithTimeout('https://apiv2.nobitex.ir/v3/orderbook/USDTIRT', fetchImpl);
    const lastRial = parseNumericValue(data?.lastTradePrice);
    let toman = lastRial / 10;
    if (!isValidUsdtToman(toman)) {
      const bidRial = parseNumericValue(data?.bids?.[0]?.[0]);
      const askRial = parseNumericValue(data?.asks?.[0]?.[0]);
      if (Number.isFinite(bidRial) && Number.isFinite(askRial)) {
        toman = ((bidRial + askRial) / 2) / 10;
      } else if (Number.isFinite(askRial)) {
        toman = askRial / 10;
      }
    }
    if (!isValidUsdtToman(toman)) {
      throw new Error(`Out of bounds Toman rate: ${toman}`);
    }
    return { usdtToman: Math.round(toman), source: 'Nobitex USDT' };
  } catch (err: any) {
    errors.push(`Nobitex: ${err?.message || 'failed'}`);
  }

  // 2. Tabdeal (returns Toman directly)
  try {
    const data = await fetchJsonWithTimeout('https://api1.tabdeal.org/r/api/v1/depth?symbol=USDTIRT&limit=5', fetchImpl);
    const bidToman = parseNumericValue(data?.bids?.[0]?.[0]);
    const askToman = parseNumericValue(data?.asks?.[0]?.[0]);
    let toman = NaN;
    if (Number.isFinite(bidToman) && Number.isFinite(askToman)) {
      toman = (bidToman + askToman) / 2;
    } else if (Number.isFinite(askToman)) {
      toman = askToman;
    } else if (Number.isFinite(bidToman)) {
      toman = bidToman;
    }
    if (!isValidUsdtToman(toman)) {
      throw new Error(`Out of bounds Toman rate: ${toman}`);
    }
    return { usdtToman: Math.round(toman), source: 'Tabdeal USDT' };
  } catch (err: any) {
    errors.push(`Tabdeal: ${err?.message || 'failed'}`);
  }

  // 3. TGJU Tether (crypto-tether-irr returns Rial -> divide by 10 for Toman)
  try {
    const data = await fetchJsonWithTimeout('https://call1.tgju.org/ajax.json', fetchImpl);
    const tetherRial = parseNumericValue(data?.current?.['crypto-tether-irr']?.p);
    const toman = tetherRial / 10;
    if (!isValidUsdtToman(toman)) {
      throw new Error(`Out of bounds Toman rate: ${toman}`);
    }
    return { usdtToman: Math.round(toman), source: 'TGJU USDT' };
  } catch (err: any) {
    errors.push(`TGJU: ${err?.message || 'failed'}`);
  }

  throw new Error(`All Tether (USDT/IRT) providers failed (${errors.join('; ')})`);
}

export async function fetchUsdCrossRates(
  fetchImpl: typeof fetch = fetch
): Promise<{ cross: UsdCrossRates; source: string }> {
  const errors: string[] = [];

  // 1. ExchangeRate-API
  try {
    const data = await fetchJsonWithTimeout('https://open.er-api.com/v6/latest/USD', fetchImpl);
    const r = data?.rates || {};
    const cross: UsdCrossRates = {
      AED: parseNumericValue(r.AED),
      TRY: parseNumericValue(r.TRY),
      GBP: parseNumericValue(r.GBP),
      EUR: parseNumericValue(r.EUR),
    };
    validateUsdCrossRates(cross);
    return { cross, source: 'ExchangeRate-API' };
  } catch (err: any) {
    errors.push(`ExchangeRate-API: ${err?.message || 'failed'}`);
  }

  // 2. Fawaz Currency API (jsDelivr)
  try {
    const data = await fetchJsonWithTimeout(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      fetchImpl
    );
    const u = data?.usd || {};
    const cross: UsdCrossRates = {
      AED: parseNumericValue(u.aed),
      TRY: parseNumericValue(u.try),
      GBP: parseNumericValue(u.gbp),
      EUR: parseNumericValue(u.eur),
    };
    validateUsdCrossRates(cross);
    return { cross, source: 'Currency-API (jsDelivr)' };
  } catch (err: any) {
    errors.push(`Currency-API jsDelivr: ${err?.message || 'failed'}`);
  }

  // 3. Fawaz Currency API (Cloudflare Pages)
  try {
    const data = await fetchJsonWithTimeout(
      'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
      fetchImpl
    );
    const u = data?.usd || {};
    const cross: UsdCrossRates = {
      AED: parseNumericValue(u.aed),
      TRY: parseNumericValue(u.try),
      GBP: parseNumericValue(u.gbp),
      EUR: parseNumericValue(u.eur),
    };
    validateUsdCrossRates(cross);
    return { cross, source: 'Currency-API (CF)' };
  } catch (err: any) {
    errors.push(`Currency-API CF: ${err?.message || 'failed'}`);
  }

  throw new Error(`All USD cross-rate providers failed (${errors.join('; ')})`);
}

export async function fetchLiveFxRates(
  marginPercent: number = 4,
  fetchImpl: typeof fetch = fetch
): Promise<LiveFxRatesResult> {
  const safeMargin = Number.isFinite(marginPercent) ? Math.min(50, Math.max(0, Math.round(marginPercent * 100) / 100)) : 4;
  const [usdtResult, crossResult] = await Promise.all([
    fetchUsdtTomanRate(fetchImpl),
    fetchUsdCrossRates(fetchImpl),
  ]);

  const rates = computeFxRatesFromUsd(usdtResult.usdtToman, crossResult.cross, safeMargin);

  return {
    rates,
    baseUsdtToman: usdtResult.usdtToman,
    usdCrossRates: crossResult.cross,
    rateMarginPercent: safeMargin,
    source: `${usdtResult.source} + ${crossResult.source}`,
    fetchedAt: new Date().toISOString(),
  };
}
