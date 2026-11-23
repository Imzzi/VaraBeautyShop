/**
 * Currency and Financial Utilities for Vara Beauty
 * Primary currency throughout the app: Toman (تومان)
 * Banking & Gateway currency (e.g. Zarinpal, Shaparak): Rial (ریال)
 * 1 Toman = 10 Rials
 */

/**
 * Safely converts an amount in Toman to Rial (multiplies by 10)
 * Uses integer math to eliminate floating-point rounding errors.
 */
export function tomanToRial(toman: number | string): number {
  const num = typeof toman === 'string' ? parseFloat(toman.replace(/[^\d.-]/g, '')) : toman;
  if (!Number.isFinite(num) || isNaN(num)) return 0;
  return Math.round(num * 10);
}

/**
 * Safely converts an amount in Rial to Toman (divides by 10)
 * Uses Math.floor or Math.round to preserve integer precision.
 */
export function rialToToman(rial: number | string): number {
  const num = typeof rial === 'string' ? parseFloat(rial.replace(/[^\d.-]/g, '')) : rial;
  if (!Number.isFinite(num) || isNaN(num)) return 0;
  return Math.round(num / 10);
}

/**
 * Formats a numeric price in Persian numbers (fa-IR locale)
 */
export function formatToman(price?: number | null): string {
  const val = Math.round(price || 0);
  return val.toLocaleString('fa-IR');
}

/**
 * Formats a numeric price in Rial with Persian digits
 */
export function formatRial(price?: number | null): string {
  const val = tomanToRial(price || 0);
  return val.toLocaleString('fa-IR');
}

/**
 * Safely calculates sum of an array of numbers without float precision issues
 */
export function safeSum(amounts: number[]): number {
  return Math.round(amounts.reduce((sum, val) => sum + (Number.isFinite(val) ? val : 0), 0));
}

/**
 * Safely calculates unit price * quantity
 */
export function safeMultiply(price: number, quantity: number): number {
  return Math.round((price || 0) * Math.max(0, quantity || 0));
}
