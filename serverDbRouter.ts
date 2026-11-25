import express from 'express';
import crypto from 'crypto';
import { issueChallenge, useChallenge } from './serverChallenges';
import { OAuth2Client } from 'google-auth-library';
import { GOOGLE_CLIENT_ID } from './src/utils/googleAuth';
import { isPendingOnlineCheckout } from './src/utils/checkoutReturn';
import { 
  ProductsDb,
  CatalogWriteError,
  OrdersDb,
  OrderWriteError,
  UsersDb, 
  AdminDb, 
  SettingsDb,
  hashWithSalt,
  generateSalt,
  pingTursoDatabase,
  getDbDiagnostics
} from './serverDb';
import { 
  authRateLimiter, 
  getClientIp, 
  getAdminSigningSecret, 
  getTechSigningSecret, 
  getUserSigningSecret 
} from './serverSecurity';
import { Readable } from 'node:stream';
import { blobPath, detectSafeRasterImage, getPrivateBlobStream } from './serverBlob';
import { ResendEmailService } from './serverEmail';
import { Product, Order, UserProfile, OrderStatus } from './src/types';
import { BRANDS_DATA } from './src/data/brands';
import { getFormulaConfigWithAutoRefresh, syncFxRatesToDb } from './serverFxSync';
import { FORMULA_SETTING_KEY, normalizeFormulaConfig } from './src/lib/formulaTypes';

export const dbRouter = express.Router();

// -------------------------------------------------------------
// ADMIN AUTHENTICATION & ACCESS CONTROL (HMAC-SHA256 SIGNED TOKENS)
// -------------------------------------------------------------

// Generate signed Admin token (valid for 24 hours)
export function generateAdminToken(username: string): string {
  const payload = {
    role: 'admin',
    username,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    iat: Date.now(),
    nonce: crypto.randomBytes(12).toString('hex'),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getAdminSigningSecret())
    .update(payloadB64)
    .digest('base64url');
  return `vat.${payloadB64}.${signature}`;
}

// Verify signed Admin token (stateless, constant-time)
export function verifyAdminToken(token?: string | null): boolean {
  if (!token || typeof token !== 'string') return false;

  // 1. Verify signed admin token (vat.<payload>.<signature>)
  if (token.startsWith('vat.')) {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [, payloadB64, signature] = parts;
    if (!payloadB64 || !signature) return false;

    try {
      const expectedSignature = crypto
        .createHmac('sha256', getAdminSigningSecret())
        .update(payloadB64)
        .digest('base64url');

      const sigBuf = Buffer.from(signature);
      const expBuf = Buffer.from(expectedSignature);
      if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return false;
      }

      const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
      if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
        return false;
      }
      return payload.role === 'admin';
    } catch {
      return false;
    }
  }

  // 2. Also accept tech admin token (vts.<payload>.<signature>) for super-admin / developer access
  if (token.startsWith('vts.')) {
    const parts = token.split('.');
    if (parts.length === 3) {
      const [, payloadB64, signature] = parts;
      try {
        const techSecret = getTechSigningSecret();
        const expectedSignature = crypto
          .createHmac('sha256', techSecret)
          .update(payloadB64)
          .digest('base64url');

        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSignature);
        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
          if (typeof payload.exp === 'number' && Date.now() <= payload.exp) {
            return true;
          }
        }
      } catch {}
    }
  }

  return false;
}

// Middleware to restrict sensitive administrative endpoints
export function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = (req.headers['authorization'] as string) || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  const customAdminHeader = req.headers['x-admin-token'] as string | undefined;
  const customTechHeader = req.headers['x-tech-admin-token'] as string | undefined;
  const token = bearerToken || customAdminHeader || customTechHeader;

  if (!verifyAdminToken(token)) {
    return res.status(401).json({
      success: false,
      error: 'دسترسی غیرمجاز. این عملیات نیازمند مجوز مدیریت است (Authorization: Bearer <token> یا x-admin-token).',
    });
  }
  next();
}

// -------------------------------------------------------------
// CUSTOMER AUTHENTICATION & ACCESS CONTROL (HMAC-SHA256 SIGNED TOKENS)
// -------------------------------------------------------------

export interface VerifiedUserPayload {
  role: 'user';
  uid: string;
  email: string;
  phone: string;
  name: string;
  exp: number;
}

// Generate signed User session token (valid for 30 days)
export function generateUserToken(user: { uid: string; email?: string; phoneNumber?: string; displayName?: string; name?: string }): string {
  const payload = {
    role: 'user',
    audience: 'vara-customer-v2',
    uid: user.uid,
    email: (user.email || '').trim().toLowerCase(),
    phone: (user.phoneNumber || '').trim(),
    name: user.displayName || user.name || '',
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    iat: Date.now(),
    nonce: crypto.randomBytes(12).toString('hex'),
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', getUserSigningSecret())
    .update(payloadB64)
    .digest('base64url');
  return `vuc2.${payloadB64}.${signature}`;
}

// Verify signed User token (constant-time check)
export function verifyUserToken(token?: string | null): VerifiedUserPayload | null {
  if (!token || typeof token !== 'string') return null;
  if (!token.startsWith('vuc2.')) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [, payloadB64, signature] = parts;
  if (!payloadB64 || !signature) return null;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', getUserSigningSecret())
      .update(payloadB64)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || Date.now() > payload.exp) {
      return null;
    }
    if (payload.role !== 'user' || payload.audience !== 'vara-customer-v2' || typeof payload.uid !== 'string' || !payload.uid) {
      return null;
    }
    return payload as VerifiedUserPayload;
  } catch {
    return null;
  }
}

// Middleware to restrict endpoints to authenticated users or administrators (BOLA / IDOR Defense)
export function requireUserOrAdminAuth(
  req: express.Request & { user?: VerifiedUserPayload; isAdmin?: boolean },
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = (req.headers['authorization'] as string) || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  const customUserHeader = req.headers['x-user-token'] as string | undefined;
  const customAdminHeader = req.headers['x-admin-token'] as string | undefined;
  const customTechHeader = req.headers['x-tech-admin-token'] as string | undefined;
  const token = bearerToken || customUserHeader || customAdminHeader || customTechHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'دسترسی غیرمجاز. برای مشاهده سوابق سفارشات، لطفاً ابتدا وارد حساب کاربری خود شوید.',
    });
  }

  // 1. Check if it's a valid admin token (Admins can view customer orders)
  if (verifyAdminToken(token)) {
    req.isAdmin = true;
    return next();
  }

  // 2. Check if it's a valid user token
  const verifiedUser = verifyUserToken(token);
  if (verifiedUser) {
    req.user = verifiedUser;
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'نشست کاربری شما منقضی یا نامعتبر است. لطفاً مجدداً وارد حساب کاربری خود شوید.',
  });
}

// -------------------------------------------------------------
// REAL-TIME SERVER-SENT EVENTS (SSE) BROADCASTER
// -------------------------------------------------------------
const sseClients = new Set<express.Response>();

export function broadcastDbEvent(type: string, payload?: any) {
  const data = JSON.stringify({ type, payload, timestamp: Date.now() });
  const msg = `data: ${data}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch {
      sseClients.delete(client);
    }
  }
}

// SSE Subscription Endpoint
dbRouter.get('/events', (req, res) => {
  const isVercel = !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (isVercel) {
    // Vercel Serverless has strict execution timeouts and does not support long-lived SSE sockets.
    // Send initial connected payload and gracefully close with 200 OK so the browser receives a clean response.
    res.setHeader('Connection', 'close');
    res.write(`data: ${JSON.stringify({ type: 'connected', serverless: true, timestamp: Date.now() })}\n\n`);
    return res.end();
  }

  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`);

  // Send periodic keep-alive ping every 25 seconds
  const pingInterval = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch {
      clearInterval(pingInterval);
      sseClients.delete(res);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    sseClients.delete(res);
  });
});

// -------------------------------------------------------------
// PRODUCTS ENDPOINTS
// -------------------------------------------------------------

// GET all products (Public catalog)
dbRouter.get('/products', async (_req, res) => {
  try {
    const products = await ProductsDb.getAllCached();
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=30');
    return res.json({ success: true, products });
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(503).json({ success: false, error: 'فهرست محصولات موقتاً در دسترس نیست.' });
  }
});

dbRouter.get('/products/:id', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(req.params.id)) return productNotFound(res);
  try {
    const product = await ProductsDb.getById(req.params.id);
    return product ? res.json({ success: true, product }) : productNotFound(res);
  } catch {
    return res.status(503).json({ success: false, error: 'دریافت محصول موقتاً در دسترس نیست.' });
  }
});

dbRouter.get('/admin/products', requireAdminAuth, async (_req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    return res.json({ success: true, products: await ProductsDb.getAllFresh() });
  } catch {
    return res.status(503).json({ success: false, error: 'دریافت محصولات موقتاً در دسترس نیست.' });
  }
});

function catalogWriteFailure(res: express.Response, error: unknown) {
  if (error instanceof CatalogWriteError) {
    return res.status(error.status).json({ success: false, error: error.message });
  }
  console.error('[Catalog or settings write]', error instanceof Error ? error.name : 'unknown error');
  return res.status(503).json({ success: false, error: 'ذخیره در پایگاه‌داده موقتاً در دسترس نیست.' });
}

function productNotFound(res: express.Response) {
  return res.status(404).json({ success: false, error: 'محصول یافت نشد.' });
}

dbRouter.post('/products', requireAdminAuth, async (req, res) => {
  try {
    if (typeof req.body?.nameFa !== 'string' || !req.body.nameFa.trim() ||
        (req.body.id !== undefined && (typeof req.body.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(req.body.id)))) {
      return res.status(400).json({ success: false, error: 'نام یا شناسهٔ محصول نامعتبر است.' });
    }
    const product = await ProductsDb.create(req.body);
    broadcastDbEvent('products_updated', { action: 'add', productId: product.id });
    return res.json({ success: true, product });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

dbRouter.put('/products/:id', requireAdminAuth, async (req, res) => {
  try {
    if (!req.body || Array.isArray(req.body) || typeof req.body !== 'object') {
      return res.status(400).json({ success: false, error: 'اطلاعات محصول نامعتبر است.' });
    }
    const product = await ProductsDb.update(req.params.id, req.body);
    if (!product) return productNotFound(res);
    broadcastDbEvent('products_updated', { action: 'update', productId: product.id });
    return res.json({ success: true, product });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

dbRouter.delete('/products/:id', requireAdminAuth, async (req, res) => {
  try {
    if (!await ProductsDb.delete(req.params.id)) return productNotFound(res);
    broadcastDbEvent('products_updated', { action: 'delete', productId: req.params.id });
    return res.json({ success: true });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

dbRouter.post('/products/reset', requireAdminAuth, async (_req, res) => {
  try {
    const products = await ProductsDb.resetToDefault();
    broadcastDbEvent('products_updated', { action: 'reset' });
    return res.json({ success: true, products });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

dbRouter.patch('/products/:id/stock', requireAdminAuth, async (req, res) => {
  try {
    const { stockCount } = req.body || {};
    if (!Number.isSafeInteger(stockCount) || stockCount < 0) {
      return res.status(400).json({ success: false, error: 'موجودی باید عدد صحیح و نامنفی باشد.' });
    }
    const product = await ProductsDb.updateStock(req.params.id, stockCount);
    if (!product) return productNotFound(res);
    broadcastDbEvent('products_updated', { action: 'stock', productId: product.id });
    return res.json({ success: true, product });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

// -------------------------------------------------------------
// ORDERS ENDPOINTS
// -------------------------------------------------------------

// GET all orders (Admin only - protects customer PII)
dbRouter.get('/orders', requireAdminAuth, async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const orders = await OrdersDb.getAll();
    return res.json({ success: true, orders: orders.map(orderResponse) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

const GUEST_CHECKOUT_COOKIE = 'vara_checkout';

function guestCheckoutKey(req: express.Request): string | undefined {
  const key = req.headers.cookie?.split(';').map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${GUEST_CHECKOUT_COOKIE}=`))
    ?.slice(GUEST_CHECKOUT_COOKIE.length + 1);
  return key && /^[A-Za-z0-9_-]{43}$/.test(key) ? key : undefined;
}

function checkoutDigest(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export function customerFromRequest(req: express.Request) {
  const header = req.get('authorization') || '';
  return verifyUserToken(header.startsWith('Bearer ') ? header.slice(7).trim() : undefined);
}

export function canAccessCheckout(req: express.Request, order: Order): boolean {
  const user = customerFromRequest(req);
  if (order.checkoutOwnerVerified && user && order.userId === user.uid) return true;
  const guestKey = guestCheckoutKey(req);
  return Boolean(!order.userId && guestKey && order.guestCheckoutDigest === checkoutDigest(guestKey));
}

function orderResponse(order: Order) {
  const { guestCheckoutDigest, checkoutRequestDigest, paymentAttempt, checkoutOwnerVerified, paymentReceiptImage, ...safe } = order;
  return { ...safe, hasPaymentReceipt: Boolean(paymentReceiptImage) };
}

// GET orders for user by authenticated session (Strict IDOR & PII Defense)
dbRouter.get('/orders/stats', requireAdminAuth, async (_req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  try {
    return res.json({ success: true, stats: await OrdersDb.getStats() });
  } catch {
    return res.status(503).json({ success: false, error: 'دریافت آمار سفارش‌ها موقتاً در دسترس نیست.' });
  }
});

dbRouter.get('/orders/page', requireAdminAuth, async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  let cursor: { createdAt: string; id: string } | undefined;
  try {
    if (req.query.cursor !== undefined) {
      if (typeof req.query.cursor !== 'string' || !/^[A-Za-z0-9_-]{1,320}$/.test(req.query.cursor)) {
        return res.sendStatus(400);
      }
      cursor = JSON.parse(Buffer.from(req.query.cursor, 'base64url').toString());
      if (!cursor || typeof cursor.createdAt !== 'string' || cursor.createdAt.length > 64 ||
          typeof cursor.id !== 'string' || cursor.id.length > 128) return res.sendStatus(400);
    }
  } catch {
    return res.sendStatus(400);
  }

  const status = req.query.status;
  if (status && (typeof status !== 'string' || !['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status))) {
    return res.sendStatus(400);
  }
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase().slice(0, 120) : '';
  try {
    const page = await OrdersDb.getPage({ cursor, status: status as OrderStatus | undefined, query, limit: 25 });
    const orders = page.orders.map((order) => ({
      ...orderResponse(order),
      items: order.items.map((item) => ({ ...item, image: /^\s*data:/i.test(item.image) ? '' : item.image })),
    }));
    return res.json({
      success: true, orders,
      nextCursor: page.cursor ? Buffer.from(JSON.stringify(page.cursor)).toString('base64url') : null,
    });
  } catch {
    return res.status(503).json({ success: false, error: 'دریافت سفارش‌ها موقتاً در دسترس نیست.' });
  }
});

dbRouter.get('/orders/user', requireUserOrAdminAuth, async (req: express.Request & { user?: VerifiedUserPayload; isAdmin?: boolean }, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let emailToQuery: string | undefined;
    let phoneToQuery: string | undefined;
    let userIdToQuery: string | undefined;

    if (req.isAdmin) {
      // Administrators may inspect customer orders by filter
      emailToQuery = req.query.email as string | undefined;
      phoneToQuery = req.query.phone as string | undefined;
      userIdToQuery = req.query.userId as string | undefined;
    } else if (req.user) {
      // Authenticated customers can ONLY access their own records!
      // Any query params provided by client are ignored to eliminate IDOR.
      userIdToQuery = req.user.uid;
    } else {
      return res.status(401).json({ success: false, error: 'احراز هویت الزامی است.' });
    }

    const visible = req.isAdmin
      ? await OrdersDb.getByUser(emailToQuery, phoneToQuery, userIdToQuery)
      : (await OrdersDb.getByVerifiedUser(userIdToQuery!)).filter((order) => !isPendingOnlineCheckout(order));
    return res.json({ success: true, orders: visible.map(orderResponse) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Restore the persisted checkout for the customer or guest session that created it.
dbRouter.get('/orders/checkout/:orderIdentifier', async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  const identifier = req.params.orderIdentifier;
  if (!/^[A-Za-z0-9_-]{3,80}$/.test(identifier)) return res.sendStatus(400);

  try {
    const order = await OrdersDb.getById(identifier) ?? await OrdersDb.getByOrderNumber(identifier);
    if (!order || order.paymentMethod !== 'online_gateway' || !canAccessCheckout(req, order)) {
      return res.status(404).json({ success: false });
    }
    return res.json({ success: true, order: orderResponse(order) });
  } catch {
    return res.status(503).json({ success: false });
  }
});

// GET order by orderNumber or id for the customer order confirmation / detail page
dbRouter.get('/orders/lookup/:orderIdentifier', async (req, res) => {
  try {
    const rawParam = (req.params.orderIdentifier || '').trim();
    if (!rawParam || rawParam.length < 3 || rawParam.length > 80) {
      return res.status(400).json({ success: false, error: 'شناسه سفارش نامعتبر است.' });
    }

    let order = await OrdersDb.getByOrderNumber(rawParam);
    if (!order) {
      order = await OrdersDb.getById(rawParam);
    }

    const bearer = req.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
    if (!order || (!verifyAdminToken(bearer) && !canAccessCheckout(req, order))) {
      return res.status(404).json({ success: false, error: 'سفارش مورد نظر یافت نشد.' });
    }

    // Security Masking: Mask phone number (e.g. 0912***3456)
    const rawPhone = order.customer?.phone || '';
    const maskedPhone = rawPhone.length > 7
      ? `${rawPhone.slice(0, 4)}***${rawPhone.slice(-4)}`
      : rawPhone;

    // Security Masking: Mask delivery street address (retain province & city for confirmation)
    const rawAddress = order.customer?.address || '';
    const maskedAddress = rawAddress.length > 15
      ? `${rawAddress.slice(0, 15)}... (محرمانه)`
      : rawAddress;

    const sanitizedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      totalAmount: order.totalAmount,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discountAmount: order.discountAmount,
      shippingMethod: order.shippingMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      postalTrackingCode: order.postalTrackingCode,
      refId: (order as any).refId || (order as any).zarinpalRefId || undefined,
      items: Array.isArray(order.items)
        ? order.items.map((it) => ({
            productId: it.productId,
            nameFa: it.nameFa,
            nameEn: it.nameEn,
            sizeLabel: it.sizeLabel,
            variantName: it.variantName,
            quantity: it.quantity,
            price: it.price,
            image: it.image,
          }))
        : [],
      customer: {
        name: order.customer?.name || 'مشتری گرامی',
        province: order.customer?.province || '',
        city: order.customer?.city || '',
        maskedPhone,
        maskedAddress,
      },
    };

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    return res.json({ success: true, order: sanitizedOrder });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Checkout accepts only buyer and catalog selections. Sensitive fields are assigned here.
dbRouter.post('/orders', async (req, res) => {
  try {
    const raw = req.body;
    if (!Array.isArray(raw?.items) || !raw.items.length || raw.items.length > 100) {
      return res.status(400).json({ success: false, error: 'اقلام سفارش نامعتبر است.' });
    }
    const text = (value: unknown, max: number) => typeof value === 'string' ? value.trim().slice(0, max) : '';
    const { paymentMethod, shippingMethod } = raw;
    if (!['card_transfer', 'online_gateway'].includes(paymentMethod) ||
        !['post_express', 'courier_tehran'].includes(shippingMethod)) {
      return res.status(400).json({ success: false, error: 'روش پرداخت یا ارسال نامعتبر است.' });
    }

    const buyer = customerFromRequest(req);
    if (req.get('authorization') && !buyer) return res.status(401).json({ success: false, error: 'دوباره وارد شوید.' });
    const customer = {
      name: text(raw.customer?.name, 120),
      phone: text(raw.customer?.phone, 32),
      email: buyer?.email || undefined,
      province: text(raw.customer?.province, 100),
      city: text(raw.customer?.city, 100),
      address: text(raw.customer?.address, 512),
      postalCode: text(raw.customer?.postalCode, 20),
      notes: text(raw.customer?.notes, 1024),
    };
    if (!customer.name || !customer.phone || !customer.address ||
        (shippingMethod === 'courier_tehran' && !['تهران', 'tehran'].includes(customer.city.toLowerCase()))) {
      return res.status(400).json({ success: false, error: 'اطلاعات گیرنده و روش ارسال را بررسی کنید.' });
    }

    const quoteRequired = raw.items.length === 1 && paymentMethod === 'card_transfer' &&
      typeof raw.items[0]?.productId === 'string' && /^dubai-\d+$/.test(raw.items[0].productId);
    const items: Order['items'] = [];
    for (const line of raw.items) {
      const quantity = line?.quantity;
      const productId = text(line?.productId, 128);
      if (!productId || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) {
        return res.status(400).json({ success: false, error: 'شناسه یا تعداد کالا نامعتبر است.' });
      }
      items.push({
        productId, quantity: quoteRequired ? 1 : quantity, price: 0, image: '',
        nameFa: quoteRequired ? text(line.nameFa, 200) : '',
        nameEn: quoteRequired ? text(line.nameEn, 200) : '',
        sizeLabel: text(line.sizeLabel, 100),
        variantId: quoteRequired ? undefined : text(line.variantId, 128) || undefined,
      });
    }

    let paymentReceiptImage: string | undefined;
    if (!quoteRequired && paymentMethod === 'card_transfer') {
      const receipt = raw.paymentReceiptImage;
      const encoded = typeof receipt === 'string' && receipt.length <= 350000
        ? receipt.match(/^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/)?.[1] : undefined;
      const buffer = encoded ? Buffer.from(encoded, 'base64') : undefined;
      const raster = buffer && detectSafeRasterImage(buffer);
      if (!raster || !raster.valid) {
        return res.status(400).json({ success: false, error: 'تصویر معتبر و کم‌حجم رسید الزامی است.' });
      }
      paymentReceiptImage = `data:${raster.mime};base64,${buffer!.toString('base64')}`;
    }

    const requestId = req.get('x-vara-checkout-id');
    if (requestId && !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)) {
      return res.status(400).json({ success: false, error: 'شناسهٔ درخواست نامعتبر است.' });
    }
    const id = requestId
      ? crypto.createHmac('sha256', getUserSigningSecret()).update(`order:${requestId}`).digest('base64url')
      : crypto.randomUUID();
    const guestKey = buyer ? undefined : guestCheckoutKey(req) ?? (requestId
      ? crypto.createHmac('sha256', getUserSigningSecret()).update(`guest-checkout:${requestId}`).digest('base64url')
      : crypto.randomBytes(32).toString('base64url'));
    const checkoutRequestDigest = checkoutDigest(JSON.stringify({
      customer, items, paymentMethod, shippingMethod, paymentReceiptImage,
    }));
    const order = await OrdersDb.add({
      id,
      orderNumber: `VARA-${crypto.randomBytes(8).toString('hex').toUpperCase()}`,
      userId: buyer?.uid,
      userEmail: buyer?.email,
      checkoutOwnerVerified: Boolean(buyer),
      guestCheckoutDigest: guestKey && checkoutDigest(guestKey),
      checkoutRequestDigest,
      quoteRequired,
      customer, items, subtotal: 0, shippingFee: 0, totalAmount: 0, paymentMethod, shippingMethod, paymentReceiptImage,
      discountAmount: 0, status: 'pending', paymentStatus: 'pending_verification',
      createdAt: new Date().toISOString(),
    });
    if (guestKey) {
      res.cookie(GUEST_CHECKOUT_COOKIE, guestKey, {
        httpOnly: true, secure: Boolean(process.env.VERCEL) || process.env.NODE_ENV === 'production',
        sameSite: 'lax', path: '/', maxAge: 30 * 24 * 60 * 60 * 1000,
      });
    }
    res.setHeader('Cache-Control', 'no-store');
    return res.status(201).json({ success: true, order: orderResponse(order) });
  } catch (err) {
    if (err instanceof OrderWriteError) {
      return res.status(err.status).json({ success: false, error: err.message });
    }
    return res.status(503).json({ success: false, error: 'ثبت سفارش موقتاً در دسترس نیست.' });
  }
});

dbRouter.get('/orders/:id/receipt', requireAdminAuth, async (req, res) => {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  try {
    const order = await OrdersDb.getById(req.params.id);
    const receipt = order?.paymentReceiptImage;
    if (!receipt) return res.sendStatus(404);
    const encoded = receipt.match(/^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/)?.[1];
    if (encoded) {
      const buffer = Buffer.from(encoded, 'base64');
      const raster = detectSafeRasterImage(buffer);
      return raster.valid ? res.type(raster.mime).send(buffer) : res.sendStatus(404);
    }
    const pathname = blobPath(receipt);
    if (!pathname?.startsWith('receipts/')) return res.sendStatus(404);
    const object = await getPrivateBlobStream(pathname);
    const mime = object?.blob?.contentType;
    if (!object?.stream || !mime || !['image/jpeg', 'image/png', 'image/webp'].includes(mime)) {
      return res.sendStatus(404);
    }
    res.type(mime);
    Readable.fromWeb(object.stream as any).on('error', () => res.destroy()).pipe(res);
  } catch {
    return res.sendStatus(503);
  }
});

// PATCH update order status (Admin only)
dbRouter.patch('/orders/:id/status', requireAdminAuth, async (req, res) => {
  try {
    const { status, postalTrackingCode } = req.body;
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false });
    }
    const updated = await OrdersDb.updateStatus(req.params.id, status as OrderStatus, postalTrackingCode);
    if (!updated) {
      return res.status(409).json({ success: false, error: 'تغییر وضعیت این سفارش مجاز نیست.' });
    }
    broadcastDbEvent('orders_updated');
    broadcastDbEvent('products_updated');
    return res.json({ success: true, order: orderResponse(updated) });
  } catch (err: any) {
    return res.status(err instanceof OrderWriteError ? err.status : 503).json({
      success: false, error: err instanceof OrderWriteError ? err.message : 'تغییر سفارش موقتاً در دسترس نیست.',
    });
  }
});

// PATCH update order payment status (Admin only)
dbRouter.patch('/orders/:id/payment', requireAdminAuth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!['paid', 'pending_verification', 'failed'].includes(paymentStatus)) {
      return res.status(400).json({ success: false });
    }
    const updated = await OrdersDb.updatePayment(req.params.id, paymentStatus);
    if (!updated) {
      return res.status(409).json({ success: false, error: 'تغییر وضعیت این سفارش مجاز نیست.' });
    }
    broadcastDbEvent('orders_updated');
    return res.json({ success: true, order: orderResponse(updated) });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE order (Admin only)
dbRouter.delete('/orders/:id', requireAdminAuth, async (req, res) => {
  try {
    const deleted = await OrdersDb.delete(req.params.id);
    broadcastDbEvent('orders_updated');
    return res.json({ success: deleted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// USER AUTHENTICATION & PROFILES
// -------------------------------------------------------------

// POST register user
dbRouter.post('/users/register', async (req, res) => {
  try {
    const { email, password, displayName, phoneNumber, province, city, address, postalCode } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'لطفاً یک آدرس ایمیل معتبر وارد فرمایید.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' });
    }

    // Check if email already registered
    const existing = await UsersDb.getByEmail(cleanEmail);
    if (existing && existing.emailVerified) {
      return res.status(400).json({ 
        success: false, 
        error: 'این ایمیل قبلاً در سیستم ثبت شده و فعال است. لطفاً وارد حساب کاربری خود شوید یا از بخش بازیابی رمز عبور اقدام فرمایید.' 
      });
    }

    const salt = generateSalt(16);
    const passwordHash = hashWithSalt(password, salt, 'user');
    const now = new Date().toISOString();
    const uid = existing?.uid || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newProfile: UserProfile = {
      uid,
      email: cleanEmail,
      displayName: (displayName || existing?.displayName || 'کاربر ورا بیوتی').trim(),
      phoneNumber: (phoneNumber || existing?.phoneNumber || '').trim(),
      emailVerified: false,
      province: province || existing?.province || '',
      city: city || existing?.city || '',
      address: address || existing?.address || '',
      postalCode: postalCode || existing?.postalCode || '',
      role: existing?.role || 'customer',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    await UsersDb.upsert(newProfile, passwordHash, salt);
    broadcastDbEvent('users_updated');

    const delivered = await sendEmailChallenge('email-verification', newProfile);
    if (!delivered) return res.status(503).json({ success: false, error: 'ارسال ایمیل فعال‌سازی انجام نشد.' });
    return res.json({ success: true, profile: customerProfile(newProfile), requiresEmailVerification: true, emailSent: true });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST login with email and password (protected with Rate Limiting & Brute-Force defense)
dbRouter.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const ip = getClientIp(req);

    // 1. Check Rate Limit & Lockout status before any processing
    const limitCheck = authRateLimiter.checkLimit('user_login', cleanEmail, ip);
    if (limitCheck.isLocked) {
      const minutes = Math.ceil(limitCheck.remainingSeconds / 60);
      return res.status(429).json({ 
        success: false, 
        isLocked: true,
        remainingSeconds: limitCheck.remainingSeconds,
        error: `به دلیل ۵ تلاش ناموفق مکرر، ورود موقتاً مسدود شده است. لطفاً پس از ${minutes} دقیقه مجدداً تلاش فرمایید.` 
      });
    }

    if (!cleanEmail || !password) {
      return res.status(400).json({ success: false, error: 'لطفاً ایمیل و رمز عبور را وارد نمایید.' });
    }

    const userRecord = await UsersDb.getByEmail(cleanEmail);
    if (!userRecord) {
      // Record failed attempt to prevent username enumeration and account flood attacks
      const attempt = authRateLimiter.recordFailedAttempt('user_login', cleanEmail, ip);
      if (attempt.isLocked) {
        const minutes = Math.ceil(attempt.remainingSeconds / 60);
        return res.status(429).json({
          success: false,
          isLocked: true,
          remainingSeconds: attempt.remainingSeconds,
          error: `به دلیل ۵ تلاش ناموفق مکرر، ورود موقتاً مسدود شد. لطفاً پس از ${minutes} دقیقه مجدداً تلاش فرمایید.`
        });
      }

      return res.status(404).json({ 
        success: false, 
        error: 'کاربری با این آدرس ایمیل یافت نشد. لطفاً ابتدا ثبت‌نام فرمایید.',
        remainingAttempts: attempt.remainingAttempts
      });
    }

    if (!userRecord.emailVerified) {
      return res.status(403).json({ success: false, error: 'ابتدا آدرس ایمیل خود را تأیید کنید.' });
    }

    // Ensure account has password authentication configured (prevent ATO on OAuth / OTP accounts)
    if (!userRecord.passwordHash || !userRecord.salt) {
      return res.status(400).json({
        success: false,
        error: 'این حساب با ورود بدون گذرواژه (حساب گوگل یا پیامک) ایجاد شده است. لطفاً از همان روش برای ورود استفاده فرمایید یا از بخش بازیابی رمز عبور اقدام نمایید.',
      });
    }

    const computedHash = hashWithSalt(password, userRecord.salt, 'user');
    if (computedHash !== userRecord.passwordHash) {
      const attempt = authRateLimiter.recordFailedAttempt('user_login', cleanEmail, ip);
      if (attempt.isLocked) {
        const minutes = Math.ceil(attempt.remainingSeconds / 60);
        return res.status(429).json({
          success: false,
          isLocked: true,
          remainingSeconds: attempt.remainingSeconds,
          error: `به دلیل ۵ تلاش ناموفق مکرر، ورود به این حساب به مدت ${minutes} دقیقه مسدود گردید.`
        });
      }
      return res.status(401).json({ 
        success: false, 
        error: 'رمز عبور وارد شده نادرست است.',
        remainingAttempts: attempt.remainingAttempts
      });
    }

    // Success! Clear any recorded failed attempts for this email and IP
    authRateLimiter.clearAttempts('user_login', cleanEmail, ip);

    // Clean user profile to return
    const { passwordHash: _ph, salt: _s, verificationCode: _vc, ...cleanProfile } = userRecord;
    const token = generateUserToken(cleanProfile);
    return res.json({ success: true, profile: cleanProfile, token });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET user profile by UID (Protected with BOLA / IDOR defense: Customers may only view their own profile)
dbRouter.get('/users/:uid', requireUserOrAdminAuth, async (req: express.Request & { user?: VerifiedUserPayload; isAdmin?: boolean }, res) => {
  try {
    const targetUid = req.params.uid;
    // BOLA Check: If not administrator, user UID must match session token
    if (!req.isAdmin && req.user?.uid !== targetUid) {
      return res.status(403).json({ success: false, error: 'دسترسی غیرمجاز. شما فقط مجاز به مشاهده حساب کاربری خود می‌باشید.' });
    }

    const profile = await UsersDb.getByUid(targetUid);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'پروفایل کاربری یافت نشد' });
    }
    // Strip sensitive secrets before returning
    const { passwordHash: _ph, salt: _s, verificationCode: _vc, ...safeProfile } = profile as any;
    return res.json({ success: true, profile: safeProfile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH update user profile (Protected with BOLA / IDOR defense & Privilege Escalation prevention)
dbRouter.patch('/users/:uid', requireUserOrAdminAuth, async (req: express.Request & { user?: VerifiedUserPayload; isAdmin?: boolean }, res) => {
  try {
    const targetUid = req.params.uid;
    // BOLA Check: If not administrator, user UID must match session token
    if (!req.isAdmin && req.user?.uid !== targetUid) {
      return res.status(403).json({ success: false, error: 'دسترسی غیرمجاز به ویرایش این حساب کاربری.' });
    }

    // Privilege Escalation Defense: Normal customers cannot alter role, verification status, or password hashes via patch
    const fields = ['displayName', 'province', 'city', 'address', 'postalCode', 'photoURL', 'skinProfile'] as const;
    const sanitizedBody = Object.fromEntries(fields.filter((key) => Object.hasOwn(req.body, key))
      .map((key) => [key, req.body[key]]));

    const updated = await UsersDb.update(targetUid, sanitizedBody);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'کاربر یافت نشد' });
    }
    broadcastDbEvent('users_updated');
    const { passwordHash: _ph, salt: _s, verificationCode: _vc, ...safeProfile } = updated as any;
    return res.json({ success: true, profile: safeProfile });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

type EmailPurpose = 'email-verification' | 'password-reset';

async function sendEmailChallenge(purpose: EmailPurpose, profile: UserProfile) {
  const challenge = await issueChallenge(purpose, profile.uid, 10 * 60 * 1000);
  if (!challenge) return false;
  const send = purpose === 'email-verification'
    ? ResendEmailService.sendVerificationCode(profile.email, challenge.code, profile.displayName)
    : ResendEmailService.sendPasswordResetEmail(profile.email, challenge.code, undefined, profile.displayName);
  const delivered = await send.then((result) => result.success).catch(() => false);
  if (!delivered) await challenge.invalidate();
  return delivered;
}

async function getEmailAccount(body: any) {
  if (typeof body?.email === 'string' && body.email.trim()) {
    return UsersDb.getByEmail(body.email.trim().toLowerCase());
  }
  return typeof body?.uid === 'string' ? UsersDb.getByUid(body.uid) : null;
}

dbRouter.post('/users/verify-email-code', async (req, res) => {
  try {
    const record = await getEmailAccount(req.body);
    if (!record || record.emailVerified || !await useChallenge('email-verification', record.uid, req.body?.enteredCode)) {
      return res.status(400).json({ success: false, error: 'کد فعال‌سازی نامعتبر یا منقضی شده است.' });
    }
    const updated = await UsersDb.update(record.uid, { emailVerified: true });
    if (!updated) return res.sendStatus(503);
    const profile = customerProfile(updated);
    res.setHeader('Cache-Control', 'no-store');
    return res.json({ success: true, profile, token: generateUserToken(profile) });
  } catch {
    return res.sendStatus(503);
  }
});

dbRouter.post('/users/resend-code', async (req, res) => {
  try {
    const record = await getEmailAccount(req.body);
    if (record && !record.emailVerified && record.email) await sendEmailChallenge('email-verification', record);
    return res.json({ success: true, message: 'در صورت امکان، کد جدید ارسال می‌شود.' });
  } catch {
    return res.sendStatus(503);
  }
});

dbRouter.post('/users/reset-password', async (req, res) => {
  if (req.body?.code !== undefined || req.body?.newPassword !== undefined) return confirmPasswordReset(req, res);
  try {
    const record = typeof req.body?.email === 'string' ? await getEmailAccount({ email: req.body.email }) : null;
    if (record?.email) await sendEmailChallenge('password-reset', record);
    return res.json({ success: true, message: 'در صورت وجود حساب، کد بازیابی به ایمیل ارسال می‌شود.' });
  } catch {
    return res.sendStatus(503);
  }
});

async function confirmPasswordReset(req: express.Request, res: express.Response) {
  try {
    const { email, code, newPassword } = req.body ?? {};
    if (typeof email !== 'string' || typeof newPassword !== 'string' || newPassword.length < 6 || newPassword.length > 1024) {
      return res.status(400).json({ success: false, error: 'اطلاعات بازیابی نامعتبر است.' });
    }
    const record = await getEmailAccount({ email });
    if (!record || !await useChallenge('password-reset', record.uid, code)) {
      return res.status(400).json({ success: false, error: 'کد بازیابی نامعتبر یا منقضی شده است.' });
    }
    const salt = generateSalt(16);
    await UsersDb.upsert({ ...customerProfile(record), emailVerified: true }, hashWithSalt(newPassword, salt, 'user'), salt);
    return res.json({ success: true, message: 'رمز عبور جدید ذخیره شد.' });
  } catch {
    return res.sendStatus(503);
  }
}

dbRouter.post('/users/confirm-reset-password', confirmPasswordReset);

// Every identity response uses a field allowlist. Database rows also contain credential fields.
export function customerProfile(profile: UserProfile): UserProfile {
  return {
    uid: profile.uid,
    email: profile.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    phoneNumber: profile.phoneNumber,
    emailVerified: profile.emailVerified,
    province: profile.province,
    city: profile.city,
    address: profile.address,
    postalCode: profile.postalCode,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    skinProfile: profile.skinProfile,
    role: 'customer',
  };
}

const googleIdentity = new OAuth2Client(GOOGLE_CLIENT_ID);

dbRouter.post('/users/sync-google', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  // The browser's same-origin JSON fetch must supply this header. No CORS is granted.
  if (req.get('x-vara-google-sign-in') !== '1' || !req.is('application/json')) {
    return res.status(403).json({ success: false });
  }

  const credential = req.body?.credential;
  if (typeof credential !== 'string' || !credential || credential.length > 8192) {
    return res.status(400).json({ success: false, error: 'اعتبارنامه گوگل لازم است.' });
  }

  const ticket = await googleIdentity.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  }).catch(() => null);
  const identity = ticket?.getPayload();
  if (!identity || !identity.sub || !identity.email || identity.email_verified !== true) {
    return res.status(401).json({ success: false, error: 'اعتبارنامه گوگل نامعتبر است.' });
  }

  try {
    const uid = `google_${crypto.createHash('sha256').update(identity.sub).digest('hex')}`;
    const existing = await UsersDb.getByUid(uid);
    if (existing) {
      const profile = customerProfile(existing);
      return res.json({ success: true, profile, token: generateUserToken(profile) });
    }

    const email = identity.email.trim().toLowerCase();
    if (await UsersDb.getByEmail(email)) {
      // Legacy records have no trusted subject binding. An email match cannot link an account.
      return res.status(409).json({
        success: false,
        error: 'این ایمیل قبلاً ثبت شده است. برای ورود از روش قبلی یا بازیابی حساب استفاده کنید.',
      });
    }

    getUserSigningSecret();
    const profile = customerProfile(await UsersDb.upsert({
      uid,
      email,
      displayName: (identity.name || email.split('@')[0]).slice(0, 120),
      photoURL: identity.picture?.startsWith('https://') ? identity.picture : undefined,
      emailVerified: true,
      role: 'customer',
      createdAt: new Date().toISOString(),
    }));
    return res.json({ success: true, profile, token: generateUserToken(profile) });
  } catch {
    return res.status(503).json({ success: false, error: 'ورود با گوگل موقتاً در دسترس نیست.' });
  }
});

// -------------------------------------------------------------
// ADMIN CREDENTIALS ENDPOINTS
// -------------------------------------------------------------

// GET admin info (safe)
dbRouter.get('/admin/credentials', async (_req, res) => {
  try {
    const creds = await AdminDb.getCredentials();
    const envUser = (process.env.ADMIN_USERNAME || process.env.ADMIN_USER || '').trim();
    return res.json({
      success: true,
      hasAdmin: !!creds,
      username: envUser || (creds ? creds.username : 'admin'),
      updatedAt: creds?.updatedAt,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST verify admin credentials (protected with Rate Limiting & Brute-Force defense)
dbRouter.post('/admin/verify', async (req, res) => {
  try {
    const { username, password } = req.body;
    const inputUser = (username || '').trim().toLowerCase();
    const inputPass = String(password || '');
    const ip = getClientIp(req);

    // 1. Check Rate Limit & Lockout status for Admin
    const limitCheck = authRateLimiter.checkLimit('admin_login', inputUser || 'admin', ip);
    if (limitCheck.isLocked) {
      const minutes = Math.ceil(limitCheck.remainingSeconds / 60);
      return res.status(429).json({
        success: false,
        isLocked: true,
        remainingSeconds: limitCheck.remainingSeconds,
        message: `به دلیل ۵ بار تلاش ناموفق، ورود به پنل مدیریت موقتاً مسدود شد. لطفاً پس از ${minutes} دقیقه مجدداً تلاش نمایید.`
      });
    }

    const envUser = (process.env.ADMIN_USERNAME || process.env.ADMIN_USER || '').trim().toLowerCase();
    const envPass = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || '').trim();

    let isMatch = false;
    let resolvedUsername = envUser || 'admin';

    // 1. Fast-path: Direct match against environment variables (Zero DB reads required!)
    if (envPass) {
      const isUserMatch = !envUser || inputUser === envUser || inputUser === 'admin';
      if (isUserMatch && inputPass === envPass) {
        isMatch = true;
        resolvedUsername = envUser || inputUser || 'admin';
      }
    }

    // 2. Fallback: Match against database credentials if not matched by envPass
    if (!isMatch) {
      const creds = await AdminDb.getCredentials().catch(() => null);
      if (creds) {
        const dbUser = creds.username.trim().toLowerCase();
        const isUserMatch = inputUser === dbUser || (envUser && inputUser === envUser);
        const computedHash = hashWithSalt(inputPass, creds.salt, 'admin');

        if (isUserMatch && computedHash === creds.passwordHash) {
          isMatch = true;
          resolvedUsername = creds.username;
        }
      }
    }

    if (isMatch) {
      // Clear recorded failures on successful login
      authRateLimiter.clearAttempts('admin_login', inputUser || 'admin', ip);
      const token = generateAdminToken(resolvedUsername);
      return res.json({ 
        success: true, 
        token,
        message: 'ورود موفقیت‌آمیز به پنل مدیریت.' 
      });
    }

    // Failure: Record failed attempt and check if threshold reached
    const attempt = authRateLimiter.recordFailedAttempt('admin_login', inputUser || 'admin', ip);
    if (attempt.isLocked) {
      const minutes = Math.ceil(attempt.remainingSeconds / 60);
      return res.status(429).json({
        success: false,
        isLocked: true,
        remainingSeconds: attempt.remainingSeconds,
        message: `به دلیل ۵ بار تلاش ناموفق، ورود به پنل مدیریت به مدت ${minutes} دقیقه مسدود گردید.`
      });
    }

    return res.status(401).json({ 
      success: false, 
      remainingAttempts: attempt.remainingAttempts,
      message: 'نام کاربری یا رمز عبور وارد شده نادرست است.' 
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'خطای سرور در احراز هویت مدیر.' });
  }
});

// GET /api/db/admin/status: check if current admin token is valid
dbRouter.get('/admin/status', (req, res) => {
  const authHeader = (req.headers['authorization'] as string) || '';
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
  const token = bearerToken || (req.headers['x-admin-token'] as string) || (req.query.token as string);
  const isAuthenticated = verifyAdminToken(token);
  return res.json({
    success: true,
    isAuthenticated,
  });
});

// POST update admin credentials (Admin only)
dbRouter.post('/admin/update-credentials', requireAdminAuth, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    const creds = await AdminDb.getCredentials();

    const envPass = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || '').trim();

    let isCurrentPassValid = false;
    if (envPass && currentPassword === envPass) {
      isCurrentPassValid = true;
    }
    if (creds && creds.passwordHash && creds.salt) {
      const currentHash = hashWithSalt(currentPassword || '', creds.salt, 'admin');
      if (currentHash === creds.passwordHash) {
        isCurrentPassValid = true;
      }
    }

    if (!isCurrentPassValid) {
      return res.json({ success: false, message: 'رمز عبور فعلی نادرست است.' });
    }

    if (!newUsername || newUsername.trim().length < 3) {
      return res.json({ success: false, message: 'نام کاربری جدید باید حداقل ۳ کاراکتر باشد.' });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.json({ success: false, message: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد.' });
    }

    const newSalt = generateSalt(16);
    const newPasswordHash = hashWithSalt(newPassword, newSalt, 'admin');
    await AdminDb.updateCredentials(newUsername, newPasswordHash, newSalt);

    return res.json({ success: true, message: 'اطلاعات ورود ادمین با موفقیت در پایگاه داده به‌روزرسانی شد.' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// -------------------------------------------------------------
// SETTINGS & BRANDS ENDPOINTS
// -------------------------------------------------------------

// GET brands (Public)
dbRouter.get('/settings/brands', async (_req, res) => {
  try {
    const brands = await SettingsDb.get('brands', BRANDS_DATA);
    return res.json({ success: true, brands });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST update brands (Admin only)
dbRouter.post('/settings/brands', requireAdminAuth, async (req, res) => {
  try {
    const { brands } = req.body;
    if (!Array.isArray(brands)) {
      return res.status(400).json({ success: false, error: 'فرمت برندها نامعتبر است' });
    }
    await SettingsDb.set('brands', brands);
    broadcastDbEvent('brands_updated', { count: brands.length });
    return res.json({ success: true, brands });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

// GET formula config & live FX rates (Public - auto-refreshes if stale > 4h and autoUpdateRates is enabled)
dbRouter.get('/settings/formula_config', async (_req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const value = await getFormulaConfigWithAutoRefresh();
    return res.json({ success: true, value });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST update formula config (Admin only)
dbRouter.post('/settings/formula_config', requireAdminAuth, async (req, res) => {
  try {
    const rawValue = req.body?.value !== undefined ? req.body.value : req.body;
    if (!rawValue || typeof rawValue !== 'object' || Array.isArray(rawValue)) {
      return res.status(400).json({ success: false, error: 'فرمت تنظیمات فرمول نامعتبر است.' });
    }
    const normalized = normalizeFormulaConfig(rawValue);
    await SettingsDb.set(FORMULA_SETTING_KEY, normalized);
    broadcastDbEvent('setting_updated', { key: FORMULA_SETTING_KEY, value: normalized });
    return res.json({ success: true, value: normalized });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

// POST force refresh live FX rates from Tether + USD cross-rates (Admin only)
dbRouter.post('/fx-rates/refresh', requireAdminAuth, async (req, res) => {
  try {
    const rawMargin = req.body?.rateMarginPercent;
    const overrideMarginPercent =
      rawMargin !== undefined && rawMargin !== null && rawMargin !== '' && Number.isFinite(Number(rawMargin))
        ? Number(rawMargin)
        : undefined;
    const result = await syncFxRatesToDb({
      trigger: 'manual',
      force: true,
      overrideMarginPercent,
    });
    broadcastDbEvent('setting_updated', { key: FORMULA_SETTING_KEY, value: result.config });
    return res.json({
      success: true,
      value: result.config,
      source: result.source,
      baseUsdtToman: result.baseUsdtToman,
    });
  } catch (err: any) {
    console.error('[FX manual refresh failed]', err?.message || err);
    return res.status(502).json({
      success: false,
      error: 'استعلام لحظه‌ای نرخ ارز از سرویس‌های تتر یا نرخ جهانی موقتاً ناموفق بود.',
    });
  }
});

// GET generic setting (Public)
dbRouter.get('/settings/:key', async (req, res) => {
  if (req.params.key.startsWith('__vara_')) return res.sendStatus(404);
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const value = await SettingsDb.get(req.params.key, null);
    return res.json({ success: true, value });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET database diagnostics & Turso connectivity status (Admin only)
dbRouter.get('/diagnostics', requireAdminAuth, async (_req, res) => {
  try {
    const ping = await pingTursoDatabase();
    const diagnostics = getDbDiagnostics();
    return res.json({ success: true, diagnostics, ping });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST update generic setting (Admin only)
dbRouter.post('/settings/:key', requireAdminAuth, async (req, res) => {
  if (req.params.key.startsWith('__vara_')) return res.sendStatus(404);
  try {
    const valueToSave = req.body?.value !== undefined ? req.body.value : req.body;
    if (valueToSave === undefined || valueToSave === null) {
      return res.status(400).json({ success: false, error: 'مقدار تنظیمات معتبر نمی‌باشد.' });
    }
    await SettingsDb.set(req.params.key, valueToSave);
    broadcastDbEvent('setting_updated', { key: req.params.key, value: valueToSave });
    return res.json({ success: true, value: valueToSave });
  } catch (error) {
    return catalogWriteFailure(res, error);
  }
});

// -------------------------------------------------------------
// RESEND EMAIL SERVICE DIAGNOSTICS & STATUS
// -------------------------------------------------------------

// GET check email service status
dbRouter.get('/email/status', (req, res) => {
  return res.json({
    provider: 'Resend',
    keyName: 'vara',
    configured: ResendEmailService.isConfigured(),
    sender: ResendEmailService.getSender(),
  });
});

// GET full live diagnostics & logs (Admin only: Protects against information disclosure)
dbRouter.get('/email/diagnostics', requireAdminAuth, async (req, res) => {
  try {
    const diag = await ResendEmailService.getDiagnostics();
    return res.json(diag);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// GET recent email transmission logs (Admin only: Protects customer PII and OTPs)
dbRouter.get('/email/logs', requireAdminAuth, (req, res) => {
  return res.json({ logs: ResendEmailService.getLogs() });
});

// POST send a test email (Admin only: Prevents quota exhaustion attacks)
dbRouter.post('/email/test', requireAdminAuth, async (req, res) => {
  try {
    const { toEmail } = req.body;
    if (!toEmail || !toEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'لطفاً یک آدرس ایمیل معتبر وارد فرمایید.' });
    }

    const sender = ResendEmailService.getSender();
    const result = await ResendEmailService.sendEmail({
      toEmail,
      subject: 'ایمیل آزمایشی ورا بیوتی شاپ (Vara Beauty Shop) | تست موفق اتصال به Resend',
      htmlContent: `
        <div dir="rtl" style="font-family: Tahoma, sans-serif; padding: 25px; border-radius: 12px; background-color: #f7f8f9; color: #2B2927; max-width: 500px; margin: 0 auto; border: 1px solid #eef0f2;">
          <h2 style="color: #454a4f; margin-top: 0;">اتصال به Resend با موفقیت برقرار است! 🎉</h2>
          <p style="font-size: 13px; line-height: 1.7; color: #5a5f65;">
            این یک ایمیل آزمایشی از سامانه <strong>ورا بیوتی شاپ (Vara Beauty Shop)</strong> با کلید <strong>vara</strong> است که برای بررسی کارکرد صحیح اتصال به سرورهای Resend ارسال گردیده است.
          </p>
          <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 11px; color: #788089; line-height: 1.8;">
            <div><strong>فرستنده:</strong> ${sender.formatted}</div>
            <div><strong>تاریخ و زمان ارسال:</strong> ${new Date().toLocaleString('fa-IR')}</div>
          </div>
        </div>
      `,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
