import { CartItem, Order, Product } from '../types';
import { isAdminRoute } from '../utils/adminRouteConfig';

export const ANALYTICS_SETTING_KEY = 'analytics_config';
const TRACKED_ORDERS_STORAGE_KEY = 'vara_ga_tracked_orders';
const MAX_QUEUED_EVENTS = 25;

export interface AnalyticsConfig {
  gaMeasurementId?: string;
  updatedAt?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

interface QueuedEvent {
  type: 'event' | 'config';
  name: string;
  params: Record<string, unknown>;
}

let activeMeasurementId: string | null = null;
let initPromise: Promise<string | null> | null = null;
let scriptInjected = false;
const eventQueue: QueuedEvent[] = [];

export function normalizeGaMeasurementId(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.trim().toUpperCase();
  return /^G-[A-Z0-9]{4,20}$/.test(cleaned) ? cleaned : null;
}

function isClientBlocked(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return true;
  return isAdminRoute(window.location.pathname) || isAdminRoute(window.location.hash);
}

function ensureGtagStub(): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      // Push `arguments` object as required by official gtag.js dataLayer spec
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }
}

function injectGtagScript(measurementId: string): void {
  if (typeof document === 'undefined' || scriptInjected) return;
  const existing = document.querySelector<HTMLScriptElement>('script[data-vara-ga4="true"]');
  if (existing) {
    scriptInjected = true;
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.varaGa4 = 'true';
  document.head.appendChild(script);
  scriptInjected = true;
}

function flushQueue(): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function' || !activeMeasurementId) return;
  while (eventQueue.length > 0) {
    const item = eventQueue.shift()!;
    window.gtag(item.type, item.name, item.params);
  }
}

function activateMeasurementId(id: string): string {
  activeMeasurementId = id;
  ensureGtagStub();
  injectGtagScript(id);
  window.gtag?.('js', new Date());
  window.gtag?.('config', id, { send_page_view: false });
  flushQueue();
  return id;
}

function emitEvent(name: string, params: Record<string, unknown>): void {
  if (isClientBlocked()) return;
  if (activeMeasurementId && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
    return;
  }
  if (eventQueue.length >= MAX_QUEUED_EVENTS) {
    eventQueue.shift();
  }
  eventQueue.push({ type: 'event', name, params });
}

function toIrrValue(toman: number | undefined): number {
  const numeric = Number(toman) || 0;
  return Math.max(0, Math.round(numeric * 10));
}

function productToGaItem(product: Product, unitPriceToman?: number, quantity = 1, variantName?: string) {
  const priceToman = unitPriceToman ?? product.price ?? 0;
  return {
    item_id: product.id,
    item_name: product.nameFa || product.nameEn || product.id,
    item_brand: product.brand || 'Vara Beauty',
    item_category: product.category || 'skincare',
    ...(variantName ? { item_variant: variantName } : {}),
    price: toIrrValue(priceToman),
    quantity: Math.max(1, quantity),
  };
}

export async function initAnalytics(overrideId?: string): Promise<string | null> {
  if (isClientBlocked()) return null;

  const explicit = normalizeGaMeasurementId(
    overrideId || (import.meta as any)?.env?.VITE_GA_MEASUREMENT_ID
  );
  if (explicit) {
    return activateMeasurementId(explicit);
  }

  if (activeMeasurementId) return activeMeasurementId;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const response = await fetch(`/api/db/settings/${ANALYTICS_SETTING_KEY}`, {
        cache: 'no-store',
      });
      if (!response.ok) return null;
      const data = await response.json().catch(() => null);
      const id = normalizeGaMeasurementId(data?.value?.gaMeasurementId);
      if (!id) {
        eventQueue.length = 0;
        return null;
      }
      return activateMeasurementId(id);
    } catch {
      return null;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export function trackPageView(pagePath: string, pageTitle?: string): void {
  if (isClientBlocked()) return;
  const cleanPath = pagePath || '/';
  emitEvent('page_view', {
    page_path: cleanPath,
    page_location: typeof window !== 'undefined' ? `${window.location.origin}${cleanPath}` : undefined,
    page_title: pageTitle || (typeof document !== 'undefined' ? document.title : undefined),
  });
}

export function trackViewItem(product: Product): void {
  if (!product?.id) return;
  const value = toIrrValue(product.price);
  emitEvent('view_item', {
    currency: 'IRR',
    value,
    items: [productToGaItem(product)],
  });
}

export function trackAddToCart(
  product: Product,
  unitPriceToman: number,
  quantity: number = 1,
  variantName?: string
): void {
  if (!product?.id) return;
  const qty = Math.max(1, quantity);
  emitEvent('add_to_cart', {
    currency: 'IRR',
    value: toIrrValue(unitPriceToman * qty),
    items: [productToGaItem(product, unitPriceToman, qty, variantName)],
  });
}

export function trackRemoveFromCart(item: CartItem): void {
  if (!item?.product?.id) return;
  const unitPrice = item.selectedVariant?.price ?? item.selectedSize?.price ?? item.product.price ?? 0;
  const qty = Math.max(1, item.quantity || 1);
  const variant = item.selectedVariant?.name || item.selectedSize?.label;
  emitEvent('remove_from_cart', {
    currency: 'IRR',
    value: toIrrValue(unitPrice * qty),
    items: [productToGaItem(item.product, unitPrice, qty, variant)],
  });
}

export function trackBeginCheckout(items: CartItem[], discountToman = 0): void {
  if (!Array.isArray(items) || items.length === 0) return;
  let totalToman = 0;
  const gaItems = items
    .filter((entry) => entry?.product?.id)
    .map((entry) => {
      const unitPrice = entry.selectedVariant?.price ?? entry.selectedSize?.price ?? entry.product.price ?? 0;
      const qty = Math.max(1, entry.quantity || 1);
      totalToman += unitPrice * qty;
      return productToGaItem(entry.product, unitPrice, qty, entry.selectedVariant?.name || entry.selectedSize?.label);
    });
  if (gaItems.length === 0) return;

  const netToman = Math.max(0, totalToman - Math.max(0, discountToman));
  emitEvent('begin_checkout', {
    currency: 'IRR',
    value: toIrrValue(netToman),
    items: gaItems,
  });
}

export function trackPurchase(order: Order): void {
  if (!order?.id) return;
  try {
    const raw = sessionStorage.getItem(TRACKED_ORDERS_STORAGE_KEY);
    const tracked: string[] = raw ? JSON.parse(raw) : [];
    if (Array.isArray(tracked) && tracked.includes(order.id)) return;
    const next = [...(Array.isArray(tracked) ? tracked : []).slice(-19), order.id];
    sessionStorage.setItem(TRACKED_ORDERS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Proceed even if sessionStorage is restricted
  }

  const gaItems = (order.items || []).map((item, idx) => ({
    item_id: item.productId || `item-${idx}`,
    item_name: item.nameFa || item.nameEn || 'محصول ورا بیوتی',
    ...(item.variantName || item.sizeLabel ? { item_variant: item.variantName || item.sizeLabel } : {}),
    price: toIrrValue(item.price),
    quantity: Math.max(1, item.quantity || 1),
  }));

  emitEvent('purchase', {
    transaction_id: order.orderNumber || order.id,
    currency: 'IRR',
    value: toIrrValue(order.totalAmount),
    shipping: toIrrValue(order.shippingFee || 0),
    items: gaItems,
  });
}

export function trackSearch(searchTerm: string): void {
  const clean = (searchTerm || '').trim();
  if (clean.length < 2) return;
  emitEvent('search', { search_term: clean.slice(0, 100) });
}

export function trackCalculatorEstimate(params: {
  url: string;
  currency: string;
  originalPrice: number;
  title?: string;
}): void {
  let storeHost = 'external';
  try {
    storeHost = new URL(params.url).hostname.replace(/^www\./i, '');
  } catch {
    storeHost = 'external';
  }
  emitEvent('calculator_estimate', {
    store_host: storeHost,
    currency: (params.currency || 'AED').toUpperCase(),
    original_price: Number(params.originalPrice) || 0,
    ...(params.title ? { item_name: params.title.slice(0, 120) } : {}),
  });
}
