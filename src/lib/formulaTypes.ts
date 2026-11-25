export interface UsdCrossRates {
  AED: number;
  TRY: number;
  GBP: number;
  EUR: number;
}

export interface FormulaConfig {
  aedRate: number; // نرخ درهم امارات به تومان (AED)
  tryRate?: number; // نرخ لیر ترکیه به تومان (TRY) - ترندیول
  gbpRate?: number; // نرخ پوند انگلیس به تومان (GBP) - لوک‌فنتستیک
  eurRate?: number; // نرخ یورو به تومان (EUR)
  usdRate?: number; // نرخ دلار آمریکا به تومان (USD)
  shippingPer100g: number;
  customsRatePercent: number;
  varaFeePercent: number;
  discountPercent: number;
  maxDiscountToman: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  // Auto FX sync fields
  autoUpdateRates?: boolean;
  rateMarginPercent?: number;
  ratesUpdatedAt?: string;
  ratesSource?: string;
  baseUsdtToman?: number;
  usdCrossRates?: UsdCrossRates;
}

export const FORMULA_SETTING_KEY = 'formula_config';
export const FORMULA_STORAGE_KEY = 'vara_pricing_formula';
export const FX_REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000;

export const DEFAULT_FORMULA_CONFIG: FormulaConfig = {
  aedRate: 83200, // نرخ درهم امارات (بر اساس تتر + ۴٪ حاشیه اطمینان)
  tryRate: 6030, // نرخ لیر ترکیه
  gbpRate: 400500, // نرخ پوند انگلیس
  eurRate: 335000, // نرخ یورو
  usdRate: 305600, // نرخ دلار آمریکا
  shippingPer100g: 85000,
  customsRatePercent: 5,
  varaFeePercent: 4,
  discountPercent: 2,
  maxDiscountToman: 80000,
  deliveryDaysMin: 5,
  deliveryDaysMax: 8,
  autoUpdateRates: true,
  rateMarginPercent: 4,
};

function positiveNumber(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') return fallback;
  const num = Number(val);
  return Number.isFinite(num) && num > 0 ? num : fallback;
}

function nonNegativeNumber(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') return fallback;
  const num = Number(val);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
}

function normalizeCrossRates(raw: any): UsdCrossRates | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  const AED = Number(raw.AED);
  const TRY = Number(raw.TRY);
  const GBP = Number(raw.GBP);
  const EUR = Number(raw.EUR);
  if (
    Number.isFinite(AED) && AED > 0 &&
    Number.isFinite(TRY) && TRY > 0 &&
    Number.isFinite(GBP) && GBP > 0 &&
    Number.isFinite(EUR) && EUR > 0
  ) {
    return { AED, TRY, GBP, EUR };
  }
  return undefined;
}

export function normalizeFormulaConfig(raw: any): FormulaConfig {
  const src = raw && typeof raw === 'object' ? raw : {};

  const usdRate = Math.floor(positiveNumber(src.usdRate, DEFAULT_FORMULA_CONFIG.usdRate!));
  const rawAed = src.aedRate !== undefined && src.aedRate !== null && src.aedRate !== ''
    ? Number(src.aedRate)
    : undefined;
  const aedRate = rawAed !== undefined && Number.isFinite(rawAed) && rawAed > 0
    ? Math.floor(rawAed)
    : (src.usdRate ? Math.round(usdRate / 3.6725) : DEFAULT_FORMULA_CONFIG.aedRate);

  const tryRate = Math.floor(positiveNumber(src.tryRate, DEFAULT_FORMULA_CONFIG.tryRate!));
  const gbpRate = Math.floor(positiveNumber(src.gbpRate, DEFAULT_FORMULA_CONFIG.gbpRate!));
  const eurRate = Math.floor(positiveNumber(src.eurRate, DEFAULT_FORMULA_CONFIG.eurRate!));

  const rawMargin = src.rateMarginPercent !== undefined && src.rateMarginPercent !== null && src.rateMarginPercent !== ''
    ? Number(src.rateMarginPercent)
    : DEFAULT_FORMULA_CONFIG.rateMarginPercent!;
  const rateMarginPercent = Number.isFinite(rawMargin)
    ? Math.min(50, Math.max(0, Math.round(rawMargin * 100) / 100))
    : DEFAULT_FORMULA_CONFIG.rateMarginPercent!;

  const autoUpdateRates = src.autoUpdateRates !== false;

  const ratesUpdatedAt =
    typeof src.ratesUpdatedAt === 'string' && !Number.isNaN(Date.parse(src.ratesUpdatedAt))
      ? src.ratesUpdatedAt
      : undefined;

  const ratesSource =
    typeof src.ratesSource === 'string' && src.ratesSource.trim()
      ? src.ratesSource.trim()
      : undefined;

  const baseUsdtToman =
    src.baseUsdtToman !== undefined && Number.isFinite(Number(src.baseUsdtToman)) && Number(src.baseUsdtToman) > 0
      ? Math.round(Number(src.baseUsdtToman))
      : undefined;

  const usdCrossRates = normalizeCrossRates(src.usdCrossRates);

  const deliveryDaysMin = Math.max(1, Math.floor(positiveNumber(src.deliveryDaysMin, DEFAULT_FORMULA_CONFIG.deliveryDaysMin)));
  const deliveryDaysMax = Math.max(deliveryDaysMin, Math.floor(positiveNumber(src.deliveryDaysMax, DEFAULT_FORMULA_CONFIG.deliveryDaysMax)));

  return {
    aedRate,
    tryRate,
    gbpRate,
    eurRate,
    usdRate,
    shippingPer100g: Math.floor(nonNegativeNumber(src.shippingPer100g, DEFAULT_FORMULA_CONFIG.shippingPer100g)),
    customsRatePercent: nonNegativeNumber(src.customsRatePercent, DEFAULT_FORMULA_CONFIG.customsRatePercent),
    varaFeePercent: nonNegativeNumber(src.varaFeePercent, DEFAULT_FORMULA_CONFIG.varaFeePercent),
    discountPercent: nonNegativeNumber(src.discountPercent, DEFAULT_FORMULA_CONFIG.discountPercent),
    maxDiscountToman: Math.floor(nonNegativeNumber(src.maxDiscountToman, DEFAULT_FORMULA_CONFIG.maxDiscountToman)),
    deliveryDaysMin,
    deliveryDaysMax,
    autoUpdateRates,
    rateMarginPercent,
    ...(ratesUpdatedAt ? { ratesUpdatedAt } : {}),
    ...(ratesSource ? { ratesSource } : {}),
    ...(baseUsdtToman !== undefined ? { baseUsdtToman } : {}),
    ...(usdCrossRates ? { usdCrossRates } : {}),
  };
}
