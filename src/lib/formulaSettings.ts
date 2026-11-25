import { getAdminAuthHeaders } from './adminAuth';
import {
  DEFAULT_FORMULA_CONFIG,
  FORMULA_STORAGE_KEY,
  FormulaConfig,
  normalizeFormulaConfig,
} from './formulaTypes';

export type { FormulaConfig, UsdCrossRates } from './formulaTypes';
export { DEFAULT_FORMULA_CONFIG, FORMULA_STORAGE_KEY, normalizeFormulaConfig } from './formulaTypes';

const FORMULA_MAX_AGE_MS = 60_000;

let cachedConfig: FormulaConfig | null = null;
let formulaRevision = 0;
let formulaFreshUntil = 0;
let pendingFetch: Promise<FormulaConfig> | null = null;
let activeSavesCount = 0;
const listeners: Set<(config: FormulaConfig) => void> = new Set();

export function getLocalFormulaConfig(): FormulaConfig {
  if (cachedConfig) return cachedConfig;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(FORMULA_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          cachedConfig = normalizeFormulaConfig(parsed);
          return cachedConfig;
        }
      }
    } catch (err) {
      console.warn('Error reading local formula config:', err);
    }
  }
  return DEFAULT_FORMULA_CONFIG;
}

function notifyListeners(config: FormulaConfig, broadcast = true) {
  cachedConfig = config;
  formulaFreshUntil = Date.now() + FORMULA_MAX_AGE_MS;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FORMULA_STORAGE_KEY, JSON.stringify(config));
      if (broadcast) {
        window.dispatchEvent(new CustomEvent('vara-formula-change', { detail: config }));
      }
    } catch (err) {
      console.error('Error saving local formula config:', err);
    }
  }
  listeners.forEach((cb) => cb(config));
}

export function saveLocalFormulaConfig(config: FormulaConfig): void {
  const normalized = normalizeFormulaConfig(config);
  formulaRevision++;
  notifyListeners(normalized, true);
}

export function fetchFormulaConfig(force = false): Promise<FormulaConfig> {
  if (!force && (activeSavesCount > 0 || Date.now() < formulaFreshUntil)) {
    return Promise.resolve(getLocalFormulaConfig());
  }
  if (!force && pendingFetch) return pendingFetch;

  const revision = formulaRevision;
  const req = fetch('/api/db/settings/formula_config', { cache: 'no-store' })
    .then(async (res) => {
      if (!res.ok) return getLocalFormulaConfig();
      const data = await res.json();
      if (revision !== formulaRevision || data?.success !== true) {
        return getLocalFormulaConfig();
      }
      if (data.value && typeof data.value === 'object') {
        const normalized = normalizeFormulaConfig(data.value);
        notifyListeners(normalized, false);
        return normalized;
      }
      return getLocalFormulaConfig();
    })
    .catch(() => getLocalFormulaConfig())
    .finally(() => {
      if (pendingFetch === req) {
        pendingFetch = null;
      }
    });

  pendingFetch = req;
  return req;
}

export async function saveFormulaConfig(config: Partial<FormulaConfig>): Promise<FormulaConfig> {
  const current = getLocalFormulaConfig();
  const merged = normalizeFormulaConfig({
    ...current,
    ...config,
  });

  activeSavesCount += 1;
  formulaRevision++;

  try {
    const res = await fetch('/api/db/settings/formula_config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify({ value: merged }),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success !== true || !data.value || typeof data.value !== 'object') {
      if (res.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vara-admin-session-expired'));
      }
      throw new Error(data?.error || 'ذخیره تنظیمات فرمول انجام نشد.');
    }

    const authoritative = normalizeFormulaConfig(data.value);
    formulaRevision++;
    notifyListeners(authoritative, true);
    return authoritative;
  } finally {
    activeSavesCount = Math.max(0, activeSavesCount - 1);
  }
}

export async function refreshFxRatesNow(
  rateMarginPercent?: number
): Promise<{ config: FormulaConfig; source: string; baseUsdtToman: number }> {
  activeSavesCount += 1;
  formulaRevision++;

  try {
    const res = await fetch('/api/db/fx-rates/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAdminAuthHeaders(),
      },
      body: JSON.stringify(
        rateMarginPercent !== undefined ? { rateMarginPercent } : {}
      ),
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || data?.success !== true || !data.value || typeof data.value !== 'object') {
      if (res.status === 401 && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vara-admin-session-expired'));
      }
      throw new Error(data?.error || 'استعلام لحظه‌ای نرخ ارز ناموفق بود.');
    }

    const authoritative = normalizeFormulaConfig(data.value);
    formulaRevision++;
    notifyListeners(authoritative, true);
    return {
      config: authoritative,
      source: String(data.source || authoritative.ratesSource || ''),
      baseUsdtToman: Number(data.baseUsdtToman || authoritative.baseUsdtToman || 0),
    };
  } finally {
    activeSavesCount = Math.max(0, activeSavesCount - 1);
  }
}

export function subscribeToFormulaConfig(callback: (config: FormulaConfig) => void): () => void {
  listeners.add(callback);
  callback(getLocalFormulaConfig());
  fetchFormulaConfig().catch(() => {});

  const handleCustomChange = (e: Event) => {
    const customEvent = e as CustomEvent<FormulaConfig>;
    if (customEvent.detail && typeof customEvent.detail === 'object') {
      const normalized = normalizeFormulaConfig(customEvent.detail);
      cachedConfig = normalized;
      formulaFreshUntil = Date.now() + FORMULA_MAX_AGE_MS;
      callback(normalized);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === FORMULA_STORAGE_KEY && e.newValue) {
      try {
        const parsed = normalizeFormulaConfig(JSON.parse(e.newValue));
        formulaRevision++;
        formulaFreshUntil = Date.now() + FORMULA_MAX_AGE_MS;
        cachedConfig = parsed;
        callback(parsed);
      } catch {
        // ignore parse errors
      }
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('vara-formula-change', handleCustomChange);
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('vara-formula-change', handleCustomChange);
      window.removeEventListener('storage', handleStorage);
    }
  };
}
