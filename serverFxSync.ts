import { SettingsDb } from './serverDb';
import { fetchLiveFxRates, type LiveFxRatesResult } from './serverFxRates';
import {
  FORMULA_SETTING_KEY,
  FX_REFRESH_INTERVAL_MS,
  type FormulaConfig,
  normalizeFormulaConfig,
} from './src/lib/formulaTypes';

export interface FxSyncOptions {
  trigger: 'schedule' | 'manual' | 'stale-read';
  force?: boolean;
  overrideMarginPercent?: number;
}

export interface FxSyncResult {
  updated: boolean;
  skippedReason?: 'auto_update_disabled' | 'fresh';
  config: FormulaConfig;
  source?: string;
  baseUsdtToman?: number;
}

export interface FxSyncDependencies {
  getSetting: (key: string) => Promise<any>;
  setSetting: (key: string, value: any) => Promise<void>;
  fetchRates: (marginPercent: number) => Promise<LiveFxRatesResult>;
  now?: () => number;
}

const defaultDeps: FxSyncDependencies = {
  getSetting: (key) => SettingsDb.get(key, null),
  setSetting: (key, value) => SettingsDb.set(key, value),
  fetchRates: (marginPercent) => fetchLiveFxRates(marginPercent),
  now: () => Date.now(),
};

const STALE_READ_FAILURE_COOLDOWN_MS = 5 * 60 * 1000;
let inFlightSync: Promise<FxSyncResult> | null = null;
let lastStaleReadFailureAt = 0;

export function isFormulaConfigStale(
  config: FormulaConfig | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!config?.ratesUpdatedAt) return true;
  const updatedMs = Date.parse(config.ratesUpdatedAt);
  if (Number.isNaN(updatedMs)) return true;
  return nowMs - updatedMs >= FX_REFRESH_INTERVAL_MS;
}

export async function runFxSync(
  options: FxSyncOptions,
  deps: FxSyncDependencies = defaultDeps
): Promise<FxSyncResult> {
  const nowMs = (deps.now || Date.now)();
  const raw = await deps.getSetting(FORMULA_SETTING_KEY);
  const current = normalizeFormulaConfig(raw);

  if (!options.force && current.autoUpdateRates === false) {
    return {
      updated: false,
      skippedReason: 'auto_update_disabled',
      config: current,
    };
  }

  if (!options.force && options.trigger === 'stale-read' && raw !== null && !isFormulaConfigStale(current, nowMs)) {
    return {
      updated: false,
      skippedReason: 'fresh',
      config: current,
    };
  }

  const marginPercent =
    options.overrideMarginPercent !== undefined && Number.isFinite(options.overrideMarginPercent)
      ? Math.min(50, Math.max(0, Math.round(options.overrideMarginPercent * 100) / 100))
      : (current.rateMarginPercent ?? 4);

  const live = await deps.fetchRates(marginPercent);

  const updated: FormulaConfig = normalizeFormulaConfig({
    ...current,
    usdRate: live.rates.usdRate,
    aedRate: live.rates.aedRate,
    tryRate: live.rates.tryRate,
    gbpRate: live.rates.gbpRate,
    eurRate: live.rates.eurRate,
    rateMarginPercent: live.rateMarginPercent,
    ratesUpdatedAt: live.fetchedAt,
    ratesSource: live.source,
    baseUsdtToman: live.baseUsdtToman,
    usdCrossRates: live.usdCrossRates,
  });

  await deps.setSetting(FORMULA_SETTING_KEY, updated);

  return {
    updated: true,
    config: updated,
    source: live.source,
    baseUsdtToman: live.baseUsdtToman,
  };
}

export async function syncFxRatesToDb(options: FxSyncOptions): Promise<FxSyncResult> {
  if (inFlightSync) {
    return inFlightSync;
  }

  const promise = runFxSync(options, defaultDeps)
    .then((result) => {
      if (result.updated) {
        lastStaleReadFailureAt = 0;
      }
      return result;
    })
    .catch((err) => {
      if (options.trigger === 'stale-read') {
        lastStaleReadFailureAt = Date.now();
      }
      throw err;
    })
    .finally(() => {
      if (inFlightSync === promise) {
        inFlightSync = null;
      }
    });

  inFlightSync = promise;
  return promise;
}

export async function getFormulaConfigWithAutoRefresh(): Promise<FormulaConfig> {
  const raw = await SettingsDb.get(FORMULA_SETTING_KEY, null);
  const current = normalizeFormulaConfig(raw);
  const nowMs = Date.now();

  const shouldRefresh =
    current.autoUpdateRates !== false &&
    (raw === null || isFormulaConfigStale(current, nowMs)) &&
    nowMs - lastStaleReadFailureAt >= STALE_READ_FAILURE_COOLDOWN_MS;

  if (!shouldRefresh) {
    return current;
  }

  try {
    const res = await syncFxRatesToDb({ trigger: 'stale-read', force: false });
    return res.config;
  } catch (err: any) {
    console.warn('[FX stale-read fallback]', err?.message || err);
    return current;
  }
}
