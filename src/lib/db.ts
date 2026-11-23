import { Product, Order, OrderStatus, UserProfile, OrderStats } from '../types';
import { PRODUCTS as initialProducts } from '../data/products';
import { getAdminAuthHeaders, getAdminToken } from './adminAuth';

const LOCAL_USER_SESSION_KEY = 'vara_beauty_user_session';
export const LOCAL_USER_TOKEN_KEY = 'vara_beauty_user_token';
const LOCAL_PRODUCTS_KEY = 'vara_public_catalog';
const LOCAL_ORDERS_KEY = 'vara_local_orders';

export function getLocalUserToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem(LOCAL_USER_TOKEN_KEY);
  if (token?.startsWith('vuc2.')) return token;
  if (token) localStorage.removeItem(LOCAL_USER_TOKEN_KEY);
  return null;
}

export function saveLocalUserToken(token?: string | null) {
  if (typeof window === 'undefined' || !token) return;
  localStorage.setItem(LOCAL_USER_TOKEN_KEY, token);
}

export function removeLocalUserToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_USER_TOKEN_KEY);
}

export async function ensureUserToken(): Promise<string | null> {
  return getLocalUserToken();
}

// -------------------------------------------------------------
// REAL-TIME SERVER-SENT EVENTS (SSE) LISTENER
// -------------------------------------------------------------
type EventCallback = (payload?: any) => void;
const eventListeners: { [type: string]: Set<EventCallback> } = {
  products_updated: new Set(),
  orders_updated: new Set(),
  users_updated: new Set(),
  brands_updated: new Set(),
};

let eventSource: EventSource | null = null;
let sseReconnectTimer: any = null;
let sseFailureCount = 0;
declare const __VARA_SERVERLESS__: boolean;
let sseDisabledForServerless = typeof __VARA_SERVERLESS__ !== 'undefined' && __VARA_SERVERLESS__;

function initSseConnection() {
  if (typeof window === 'undefined' || typeof EventSource === 'undefined' || sseDisabledForServerless) return;
  if (eventSource && eventSource.readyState !== EventSource.CLOSED) return;

  try {
    eventSource = new EventSource('/api/db/events');

    eventSource.onopen = () => {
      sseFailureCount = 0;
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed?.serverless) {
          // In serverless hosting (Vercel), connections close cleanly; permanently disable SSE reconnects for this session
          sseDisabledForServerless = true;
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
          return;
        }
        if (parsed.type && eventListeners[parsed.type]) {
          eventListeners[parsed.type].forEach((cb) => {
            try {
              cb(parsed.payload);
            } catch (err) {
              console.warn('[SSE Dispatch Error]:', err);
            }
          });
        }
      } catch {
        // Ping or non-JSON message
      }
    };

    eventSource.onerror = () => {
      if (eventSource) {
        eventSource.close();
        eventSource = null;
      }
      sseFailureCount++;
      clearTimeout(sseReconnectTimer);
      if (sseFailureCount >= 3) {
        sseDisabledForServerless = true;
        return;
      }
      sseReconnectTimer = setTimeout(initSseConnection, 30000);
    };
  } catch (e) {
    console.warn('[SSE Init Error]:', e);
  }
}

function onServerEvent(type: string, callback: EventCallback): () => void {
  initSseConnection();
  if (!eventListeners[type]) {
    eventListeners[type] = new Set();
  }
  eventListeners[type].add(callback);
  return () => {
    eventListeners[type].delete(callback);
  };
}

// -------------------------------------------------------------
// PRODUCTS REPOSITORY (SQLITE BACKEND)
// -------------------------------------------------------------

export interface CatalogSnapshot {
  products: Product[];
  status: 'loading' | 'current' | 'stale' | 'unavailable';
  updatedAt?: number;
}

let catalogRevision = 0;
let publicCatalog: CatalogSnapshot | undefined;
let adminCatalog: CatalogSnapshot | undefined;

function readPublicCatalog(): CatalogSnapshot | undefined {
  if (publicCatalog || typeof window === 'undefined') return publicCatalog;
  try {
    const cached = JSON.parse(localStorage.getItem(LOCAL_PRODUCTS_KEY) || 'null');
    if (Array.isArray(cached?.products)) return cached;
  } catch {}
}

export async function fetchProductsFromDb(admin = false): Promise<Product[]> {
  const response = await fetch(admin ? '/api/db/admin/products' : '/api/db/products', {
    headers: admin ? getAdminAuthHeaders() : undefined,
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !Array.isArray(data.products)) {
    throw new Error('دریافت فهرست محصولات انجام نشد.');
  }
  return data.products;
}

export async function seedProductsIfEmpty(): Promise<Product[]> {
  return fetchProductsFromDb().catch(() => readPublicCatalog()?.products ?? initialProducts);
}

export async function resetProductsToDefaultDb(): Promise<Product[]> {
  const data = await mutateCatalog('/api/db/products/reset', 'POST');
  if (!Array.isArray(data.products)) throw new Error('پاسخ فهرست محصولات نامعتبر است.');
  publishProductChange(() => data.products);
  return data.products;
}

function publishProductChange(update: (products: Product[]) => Product[]) {
  catalogRevision++;
  if (adminCatalog) adminCatalog = { ...adminCatalog, products: update(adminCatalog.products) };
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('vara-products-updated'));
}

export function refreshCatalog() {
  window.dispatchEvent(new Event('vara-products-updated'));
}

export function subscribeToProducts(callback: (snapshot: CatalogSnapshot) => void, adminRoute = false): () => void {
  const isAdmin = () => adminRoute && Boolean(getAdminToken());
  const fallback = (): CatalogSnapshot => {
    const cached = adminRoute ? isAdmin() ? adminCatalog : undefined : readPublicCatalog();
    return { products: adminRoute ? [] : initialProducts, ...cached, status: 'loading' };
  };
  callback(fallback());

  let active = true;
  let lastFetchTime = 0;
  let newestRequest = 0;
  const refresh = async () => {
    lastFetchTime = Date.now();
    const request = ++newestRequest;
    const revision = catalogRevision;
    const admin = isAdmin();
    if (adminRoute && !admin) {
      adminCatalog = undefined;
      callback(fallback());
      return;
    }
    const stillCurrent = () => active && request === newestRequest && revision === catalogRevision && admin === isAdmin();
    try {
      const products = await fetchProductsFromDb(admin);
      if (!stillCurrent()) return;
      const snapshot: CatalogSnapshot = { products, status: 'current', updatedAt: Date.now() };
      if (admin) adminCatalog = snapshot;
      else {
        publicCatalog = snapshot;
        try { localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(snapshot)); } catch {}
      }
      callback(snapshot);
    } catch {
      if (!stillCurrent()) return;
      const cached = fallback();
      callback({ ...cached, status: cached.updatedAt || cached.products.length ? 'stale' : 'unavailable' });
    }
  };

  const handleChange = () => {
    if (adminRoute && isAdmin() && adminCatalog) callback(adminCatalog);
    void refresh();
  };
  const handleVisibilityOrFocus = () => {
    if (document.visibilityState !== 'hidden' && Date.now() - lastFetchTime >= 60000) void refresh();
  };
  void refresh();
  const unsubSse = onServerEvent('products_updated', refresh);
  window.addEventListener('vara-products-updated', handleChange);
  window.addEventListener('focus', handleVisibilityOrFocus);
  document.addEventListener('visibilitychange', handleVisibilityOrFocus);

  return () => {
    active = false;
    unsubSse();
    window.removeEventListener('vara-products-updated', handleChange);
    window.removeEventListener('focus', handleVisibilityOrFocus);
    document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
  };
}

export async function addProductToDb(
  product: Omit<Product, 'id'>,
  id = `product-${crypto.randomUUID()}`,
): Promise<Product> {
  return saveProduct('/api/db/products', 'POST', { ...product, id });
}

export async function updateProductInDb(id: string, updates: Partial<Product>): Promise<Product> {
  return saveProduct(`/api/db/products/${encodeURIComponent(id)}`, 'PUT', updates);
}

async function mutateCatalog(url: string, method: string, body?: object) {
  const response = await fetch(url, {
    method,
    headers: getAdminAuthHeaders(body ? { 'Content-Type': 'application/json' } : {}),
    body: body && JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vara-admin-session-expired'));
    }
    throw new Error(data?.error || 'ذخیره محصول انجام نشد.');
  }
  return data;
}

async function saveProduct(url: string, method: string, updates: Partial<Product>): Promise<Product> {
  const { product } = await mutateCatalog(url, method, updates);
  if (!product || typeof product.id !== 'string') throw new Error('پاسخ ذخیره محصول نامعتبر است.');
  publishProductChange((products) => products.some((item) => item.id === product.id)
    ? products.map((item) => item.id === product.id ? product : item)
    : [...products, product]);
  return product;
}

export async function deleteProductFromDb(id: string): Promise<void> {
  await mutateCatalog(`/api/db/products/${encodeURIComponent(id)}`, 'DELETE');
  publishProductChange((products) => products.filter((product) => product.id !== id));
}

export async function updateProductStockInDb(id: string, newStock: number): Promise<Product> {
  return saveProduct(`/api/db/products/${encodeURIComponent(id)}/stock`, 'PATCH', { stockCount: newStock });
}

export async function decrementStockForOrder(items: { productId: string; variantId?: string; quantity: number }[]): Promise<void> {
  // Handled atomically on server in OrdersDb.add()
}

// -------------------------------------------------------------
// ORDERS REPOSITORY (SQLITE BACKEND)
// -------------------------------------------------------------

export function getCustomerAuthHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const token = getLocalUserToken();
  return token ? { ...extra, Authorization: `Bearer ${token}` } : extra;
}

async function fetchAdminOrders(path: string) {
  if (typeof window !== 'undefined') {
    try { localStorage.removeItem(LOCAL_ORDERS_KEY); } catch {}
  }
  const res = await fetch(`/api/db/orders/${path}`, { headers: getAdminAuthHeaders(), cache: 'no-store' });
  if ((res.status === 401 || res.status === 403) && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('vara-admin-session-expired'));
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || data?.success !== true) throw new Error(data?.error || 'دریافت سفارش‌ها انجام نشد.');
  return data;
}

export async function fetchOrderPage(filters: { cursor?: string; query: string; status: OrderStatus | 'all' }) {
  const params = new URLSearchParams();
  if (filters.cursor) params.set('cursor', filters.cursor);
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.status !== 'all') params.set('status', filters.status);
  const data = await fetchAdminOrders(`page?${params}`);
  if (!Array.isArray(data.orders)) throw new Error('پاسخ فهرست سفارش‌ها نامعتبر است.');
  return { orders: data.orders as Order[], nextCursor: data.nextCursor as string | null };
}

export async function fetchOrderStats(): Promise<OrderStats> {
  const data = await fetchAdminOrders('stats');
  return data.stats;
}

let orderDraft: { body: string; id: string } | undefined;

export async function addOrderToDb(orderData: Omit<Order, 'id'>): Promise<Order> {
  const { customer, paymentMethod, shippingMethod, paymentReceiptImage } = orderData;
  const items = orderData.items.map(({ productId, variantId, sizeLabel, quantity, nameFa, nameEn }) => ({
    // A direct quote has no catalog ID. Normalize the old timestamp marker across retries.
    productId: /^dubai-\d+$/.test(productId) ? 'dubai-0' : productId, variantId, sizeLabel, quantity,
    nameFa, nameEn,
  }));
  const body = JSON.stringify({ customer, items, paymentMethod, shippingMethod, paymentReceiptImage });
  if (orderDraft?.body !== body) orderDraft = { body, id: crypto.randomUUID() };
  const draft = orderDraft;
  const res = await fetch('/api/db/orders', {
    method: 'POST',
    headers: getCustomerAuthHeaders({ 'Content-Type': 'application/json', 'X-Vara-Checkout-Id': draft.id }),
    body,
  });
  const data = await res.json();
  if (!res.ok || !data.success || !data.order) {
    throw new Error(data.error || 'ثبت سفارش انجام نشد.');
  }
  if (orderDraft === draft) orderDraft = undefined;
  notifyOrdersSync();
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('vara-products-updated'));
  return data.order;
}

// Normalize Iranian phone numbers (Persian numerals, prefixes, spacing)
export function normalizePhoneNumber(phone?: string | null): string {
  if (!phone) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let normalized = phone.toString();
  for (let i = 0; i < 10; i++) {
    normalized = normalized.replaceAll(persianDigits[i], i.toString());
    normalized = normalized.replaceAll(arabicDigits[i], i.toString());
  }
  const digits = normalized.replace(/\D/g, '');
  if (digits.startsWith('989')) return '0' + digits.slice(2);
  if (digits.startsWith('9') && digits.length === 10) return '0' + digits;
  return digits;
}

// Cross-tab broadcast channel for orders
let ordersBroadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    ordersBroadcastChannel = new BroadcastChannel('vara_orders_sync_channel');
  } catch {}
}

export function notifyOrdersSync() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('vara-orders-updated'));
    try {
      ordersBroadcastChannel?.postMessage({ type: 'orders_updated', timestamp: Date.now() });
    } catch {}
  }
}

async function updateAdminOrder(orderId: string, path: string, method: string, body?: object) {
  const response = await fetch(`/api/db/orders/${encodeURIComponent(orderId)}${path}`, {
    method,
    headers: getAdminAuthHeaders(body ? { 'Content-Type': 'application/json' } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) throw new Error(data?.error || 'تغییر سفارش انجام نشد.');
  notifyOrdersSync();
  if ((path === '/status' || method === 'DELETE') && typeof window !== 'undefined') {
    window.dispatchEvent(new Event('vara-products-updated'));
  }
}

export async function updateOrderStatusInDb(orderId: string, status: OrderStatus, postalTrackingCode?: string) {
  await updateAdminOrder(orderId, '/status', 'PATCH', { status, postalTrackingCode });
}

export async function updateOrderPaymentInDb(orderId: string, paymentStatus: Order['paymentStatus']) {
  await updateAdminOrder(orderId, '/payment', 'PATCH', { paymentStatus });
}

export async function deleteOrderFromDb(orderId: string) {
  await updateAdminOrder(orderId, '', 'DELETE');
}

export async function fetchOrderReceipt(orderId: string): Promise<Blob> {
  const response = await fetch(`/api/db/orders/${encodeURIComponent(orderId)}/receipt`, {
    headers: getAdminAuthHeaders(), cache: 'no-store',
  });
  if (!response.ok) throw new Error('رسید در دسترس نیست.');
  return response.blob();
}

export function subscribeToOrderChanges(refresh: () => void): () => void {
  const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
  const unsubscribe = onServerEvent('orders_updated', refresh);
  window.addEventListener('vara-orders-updated', refresh);
  document.addEventListener('visibilitychange', onVisible);
  ordersBroadcastChannel?.addEventListener('message', refresh);
  return () => {
    unsubscribe();
    window.removeEventListener('vara-orders-updated', refresh);
    document.removeEventListener('visibilitychange', onVisible);
    ordersBroadcastChannel?.removeEventListener('message', refresh);
  };
}

export async function getUserOrdersFromDb(email?: string, phone?: string, userId?: string): Promise<Order[]> {
  const token = getLocalUserToken();
  const headers = token ? getCustomerAuthHeaders() : getAdminAuthHeaders();
  if (!headers.Authorization) throw new Error('برای دیدن سفارش‌ها دوباره وارد حساب شوید.');
  const params = new URLSearchParams();
  if (!token && email) params.set('email', email);
  if (!token && phone) params.set('phone', phone);
  if (!token && userId) params.set('userId', userId);
  const response = await fetch(`/api/db/orders/user?${params}`, { headers, cache: 'no-store' });
  const data = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(data?.orders)) throw new Error('دریافت سفارش‌ها انجام نشد.');
  return data.orders;
}

// -------------------------------------------------------------
// USER AUTHENTICATION & PROFILES (SQLITE BACKEND)
// -------------------------------------------------------------

export interface RegisterUserData {
  email: string;
  password: string;
  displayName: string;
  phoneNumber?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

export function getLocalUserSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!getLocalUserToken()) {
      localStorage.removeItem(LOCAL_USER_SESSION_KEY);
      return null;
    }
    const raw = localStorage.getItem(LOCAL_USER_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function registerNewUser(data: RegisterUserData): Promise<{ user: any; profile: UserProfile; requiresEmailVerification: boolean }> {
  const res = await fetch('/api/db/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.error || 'خطا در ثبت‌نام کاربر.');
  }

  const profile: UserProfile = result.profile;
  if (result.token) {
    saveLocalUserToken(result.token);
  }

  const user = {
    uid: profile.uid,
    email: profile.email,
    displayName: profile.displayName,
    emailVerified: false,
    reload: async () => {},
  };

  return { 
    user, 
    profile, 
    requiresEmailVerification: true 
  };
}

export async function loginWithEmail(email: string, password: string): Promise<{ user: any; profile: UserProfile }> {
  const res = await fetch('/api/db/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await res.json();
  if (!res.ok || !result.success) {
    const err: any = new Error(result.error || 'ایمیل یا رمز عبور وارد شده نادرست است.');
    err.isLocked = !!result.isLocked;
    err.remainingSeconds = result.remainingSeconds;
    err.remainingAttempts = result.remainingAttempts;
    throw err;
  }

  const profile: UserProfile = result.profile;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USER_SESSION_KEY, JSON.stringify(profile));
    if (result.token) {
      saveLocalUserToken(result.token);
    }
    window.dispatchEvent(new Event('vara-auth-change'));
  }

  const user = {
    uid: profile.uid,
    email: profile.email,
    displayName: profile.displayName,
    emailVerified: profile.emailVerified,
    reload: async () => {},
  };

  return { user, profile };
}

export function saveVerifiedCustomerSession(profile: UserProfile, token: string): UserProfile {
  if (!profile?.uid || typeof token !== 'string' || !token) {
    throw new Error('نشست کاربر تأیید نشد.');
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USER_SESSION_KEY, JSON.stringify(profile));
    saveLocalUserToken(token);
    window.dispatchEvent(new Event('vara-auth-change'));
  }
  return profile;
}

export async function syncGoogleUserProfile(credential: string): Promise<UserProfile> {
  const res = await fetch('/api/db/users/sync-google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Vara-Google-Sign-In': '1' },
    body: JSON.stringify({ credential }),
  });
  const result = await res.json();
  if (!res.ok || !result.success) {
    throw new Error(result.error || 'خطا در ورود با حساب گوگل.');
  }
  return saveVerifiedCustomerSession(result.profile, result.token);
}

export async function resendEmailVerification(target?: any): Promise<{ success: boolean; message?: string }> {
  const session = getLocalUserSession();
  const uid = typeof target === 'string' ? target : target?.uid || session?.uid;
  const email = target?.email;
  if (!uid && !email) throw new Error('کاربری یافت نشد.');

  const res = await fetch('/api/db/users/resend-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ uid, email })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'خطا در ارسال مجدد کد فعال‌سازی.');
  }

  return { success: true, message: data.message };
}

export async function verifyUserEmailWithCode(target: string | { uid?: string; email?: string }, enteredCode: string): Promise<UserProfile> {
  const body = typeof target === 'string' ? { uid: target, enteredCode } : { ...target, enteredCode };

  const res = await fetch('/api/db/users/verify-email-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'کد فعال‌سازی وارد شده نادرست یا منقضی شده است.');
  }

  if (typeof window !== 'undefined' && data.profile) {
    localStorage.setItem(LOCAL_USER_SESSION_KEY, JSON.stringify(data.profile));
    if (data.token) {
      saveLocalUserToken(data.token);
    }
    window.dispatchEvent(new Event('vara-auth-change'));
  }

  return data.profile;
}

export async function verifyUserEmailStatus(currentUser?: any): Promise<boolean> {
  const session = getLocalUserSession();
  const uid = currentUser?.uid || session?.uid;
  if (!uid) return false;

  const profile = await getUserProfileFromDb(uid);
  return !!profile?.emailVerified;
}

export async function requestPasswordResetCode(email: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/db/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim() })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'حساب کاربری با این آدرس ایمیل یافت نشد.');
  }

  return {
    success: true,
    message: data.message || 'کد ۶ رقمی بازنشانی رمز عبور به ایمیل شما ارسال شد.'
  };
}

export async function confirmPasswordResetWithCode(email: string, code: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/db/users/confirm-reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: email.trim(), 
      code: code.trim(), 
      newPassword 
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'کد وارد شده صحیح نمی‌باشد یا تغییر رمز با خطا مواجه شد.');
  }

  return {
    success: true,
    message: data.message || 'رمز عبور جدید با موفقیت ذخیره شد.'
  };
}

export async function resetPasswordWithEmail(email: string, newPassword?: string, code?: string): Promise<{ success: boolean; message?: string }> {
  const res = await fetch('/api/db/users/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, newPassword, code })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'حساب کاربری با این آدرس ایمیل یافت نشد.');
  }

  return {
    success: true,
    message: data.message || 'درخواست بازنشانی رمز ثبت شد.'
  };
}

export async function logoutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_USER_SESSION_KEY);
    removeLocalUserToken();
    localStorage.removeItem(LOCAL_ORDERS_KEY);
    window.dispatchEvent(new Event('vara-auth-change'));
  }
}

export async function getUserProfileFromDb(uid: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/db/users/${encodeURIComponent(uid)}`, { headers: getCustomerAuthHeaders(), cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.profile) {
        return data.profile;
      }
    }
  } catch (err) {
    console.warn('[Get User Profile Error]:', err);
  }

  const local = getLocalUserSession();
  return local && local.uid === uid ? local : null;
}

export async function updateUserProfileInDb(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const res = await fetch(`/api/db/users/${encodeURIComponent(uid)}`, {
    method: 'PATCH',
    headers: getCustomerAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success || !data.profile) throw new Error('ذخیرهٔ اطلاعات حساب انجام نشد.');
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_USER_SESSION_KEY, JSON.stringify(data.profile));
    window.dispatchEvent(new Event('vara-auth-change'));
  }
}

export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void): () => void {
  const local = getLocalUserSession();
  callback(local && local.uid === uid ? local : null);

  getUserProfileFromDb(uid).then((p) => {
    if (p) callback(p);
  });

  const unsubSse = onServerEvent('users_updated', (payload) => {
    if (!payload?.uid || payload.uid === uid) {
      getUserProfileFromDb(uid).then((p) => callback(p));
    }
  });

  return unsubSse;
}

// -------------------------------------------------------------
// EMAIL & SYSTEM DIAGNOSTICS
// -------------------------------------------------------------
export async function getEmailStatus(): Promise<{
  provider: string;
  keyName: string;
  configured: boolean;
  sender: { name: string; email: string; formatted: string; isTestDomain: boolean };
}> {
  try {
    const res = await fetch('/api/db/email/status');
    return await res.json();
  } catch (err: any) {
    return {
      provider: 'Resend',
      keyName: 'vara',
      configured: false,
      sender: { name: 'Vara Beauty Shop', email: 'mail@varabeauty.ir', formatted: 'Vara Beauty Shop <mail@varabeauty.ir>', isTestDomain: false }
    };
  }
}

export async function getEmailDiagnostics(): Promise<any> {
  const res = await fetch('/api/db/email/diagnostics');
  return await res.json();
}

export async function getEmailLogs(): Promise<{ logs: any[] }> {
  try {
    const res = await fetch('/api/db/email/logs');
    return await res.json();
  } catch {
    return { logs: [] };
  }
}

export async function sendTestEmail(toEmail: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const res = await fetch('/api/db/email/test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toEmail: toEmail.trim() })
  });
  return await res.json();
}

