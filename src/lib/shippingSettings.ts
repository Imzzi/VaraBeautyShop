import { getAdminAuthHeaders } from './adminAuth';

export interface ShippingSettings {
  postExpressFee: number;
}

const STORAGE_KEY = 'vara_shipping_settings';
const SHIPPING_MAX_AGE_MS = 60_000;

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  postExpressFee: 50000,
};

let cachedSettings: ShippingSettings | null = null;
let shippingRevision = 0;
let shippingFreshUntil = 0;
let pendingShipping: Promise<ShippingSettings> | null = null;
let activeSavesCount = 0;
const listeners: Set<(settings: ShippingSettings) => void> = new Set();

function normalizeSettings(raw: any): ShippingSettings {
  const rawFee = raw?.postExpressFee !== undefined && raw?.postExpressFee !== null && raw?.postExpressFee !== ''
    ? Number(raw.postExpressFee)
    : DEFAULT_SHIPPING_SETTINGS.postExpressFee;

  const postExpressFee = Number.isFinite(rawFee) && rawFee >= 0
    ? Math.floor(rawFee)
    : DEFAULT_SHIPPING_SETTINGS.postExpressFee;

  return {
    postExpressFee,
  };
}

export function getLocalShippingSettings(): ShippingSettings {
  if (cachedSettings) return cachedSettings;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          cachedSettings = normalizeSettings(parsed);
          return cachedSettings;
        }
      }
    } catch {
      // ignore storage errors
    }
  }
  return DEFAULT_SHIPPING_SETTINGS;
}

function notifyListeners(settings: ShippingSettings, broadcast = true) {
  cachedSettings = settings;
  shippingFreshUntil = Date.now() + SHIPPING_MAX_AGE_MS;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      if (broadcast) {
        window.dispatchEvent(new CustomEvent('vara-shipping-settings-updated', { detail: settings }));
      }
    } catch {
      // ignore
    }
  }
  listeners.forEach((cb) => cb(settings));
}

export function fetchShippingSettings(): Promise<ShippingSettings> {
  if (activeSavesCount > 0 || Date.now() < shippingFreshUntil) {
    return Promise.resolve(getLocalShippingSettings());
  }
  if (pendingShipping) return pendingShipping;

  const revision = shippingRevision;
  pendingShipping = fetch('/api/db/settings/shipping_settings', { cache: 'no-store' })
    .then(async (res) => {
      if (!res.ok) return getLocalShippingSettings();
      const data = await res.json();
      if (revision !== shippingRevision || data?.success !== true) return getLocalShippingSettings();
      if (data.value === null || data.value?.postExpressFee != null) {
        const settings = normalizeSettings(data.value);
        notifyListeners(settings, false);
        return settings;
      }
      return getLocalShippingSettings();
    })
    .catch(() => getLocalShippingSettings())
    .finally(() => { pendingShipping = null; });
  return pendingShipping;
}

export async function saveShippingSettings(settings: Partial<ShippingSettings>): Promise<ShippingSettings> {
  const current = getLocalShippingSettings();
  const merged = normalizeSettings({
    ...current,
    ...settings,
  });

  activeSavesCount += 1;
  shippingRevision++;

  try {
    const res = await fetch('/api/db/settings/shipping_settings', {
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
      throw new Error(data?.error || 'ذخیره تنظیمات ارسال انجام نشد.');
    }

    const authoritative = normalizeSettings(data.value);
    shippingRevision++;
    notifyListeners(authoritative, true);
    return authoritative;
  } finally {
    activeSavesCount = Math.max(0, activeSavesCount - 1);
  }
}

export function subscribeToShippingSettings(callback: (settings: ShippingSettings) => void): () => void {
  listeners.add(callback);
  callback(getLocalShippingSettings());
  fetchShippingSettings().catch(() => {});

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = normalizeSettings(JSON.parse(e.newValue));
        if (cachedSettings?.postExpressFee !== parsed.postExpressFee) shippingRevision++;
        shippingFreshUntil = Date.now() + SHIPPING_MAX_AGE_MS;
        cachedSettings = parsed;
        callback(parsed);
      } catch {}
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    listeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage);
    }
  };
}
