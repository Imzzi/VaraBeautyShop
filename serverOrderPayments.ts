import crypto from 'node:crypto';
import type { Express, Request, Response } from 'express';
import { OrdersDb } from './serverDb';
import { canAccessCheckout } from './serverDbRouter';
import { ResendEmailService } from './serverEmail';
import { NextPayService } from './serverNextPay';
import { ZarinpalService } from './serverZarinpal';
import type { Order } from './src/types';

type Attempt = NonNullable<Order['paymentAttempt']>;
type Provider = Attempt['provider'];

function getMerchantBinding(provider: Provider): string | null {
  if (provider === 'zarinpal') {
    const config = ZarinpalService.getConfig();
    const production = process.env.VERCEL_ENV === 'production' ||
      (!process.env.VERCEL_ENV && process.env.NODE_ENV === 'production');
    if (production && config.isSandbox) return null;
    return digest(provider, config.merchantId, config.isSandbox ? 'sandbox' : 'live');
  }
  const config = NextPayService.getConfig();
  return config.isConfigured ? digest(provider, config.apiKey) : null;
}

function digest(...parts: string[]): string {
  return crypto.createHash('sha256').update(JSON.stringify(parts)).digest('hex');
}

function callbackUrl(provider: Provider): string {
  const origin = new URL(process.env.PAYMENT_CALLBACK_ORIGIN || 'https://varabeauty.ir');
  if (origin.protocol !== 'https:' || origin.username || origin.password ||
      origin.pathname !== '/' || origin.search || origin.hash) {
    throw new Error('Invalid payment callback origin');
  }
  return new URL(`/api/payment/${provider}/callback`, origin).href;
}

function transaction(value: unknown): string | undefined {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(value) ? value : undefined;
}

async function initiate(provider: Provider, order: Order) {
  const common = {
    amountToman: order.totalAmount,
    orderId: order.id,
    orderNumber: order.orderNumber,
    callbackUrl: callbackUrl(provider),
    description: `پرداخت سفارش ${order.orderNumber}`,
    customerPhone: order.customer.phone,
    customerEmail: order.customer.email,
  };
  if (provider === 'zarinpal') {
    const result = await ZarinpalService.requestPayment(common);
    return { ...result, transactionId: result.authority };
  }
  const result = await NextPayService.requestPayment(common);
  return { ...result, transactionId: result.transId };
}

function matchesAttempt(order: Order, provider: Provider, transactionId: string): boolean {
  const attempt = order.paymentAttempt;
  return Boolean(attempt && attempt.provider === provider && attempt.transactionId === transactionId &&
    attempt.merchantBinding === getMerchantBinding(provider) && attempt.currency === 'IRT' &&
    attempt.amount === order.totalAmount && Number.isSafeInteger(attempt.amount) && attempt.amount >= 1000);
}

async function settle(order: Order, provider: Provider, transactionId: string) {
  if (!matchesAttempt(order, provider, transactionId)) return null;
  if (order.paymentStatus === 'paid') return order;
  if (order.status === 'cancelled' || order.paymentStatus !== 'pending_verification') return null;

  const result = provider === 'zarinpal'
    ? await ZarinpalService.verifyPayment({ authority: transactionId, amountToman: order.totalAmount })
    : await NextPayService.verifyPayment({ transId: transactionId, amountToman: order.totalAmount });
  const reference = result.refId != null && transaction(String(result.refId));
  if (!result.success || !reference) return null;

  const updated = await OrdersDb.changeOrder(order.id, (current) => {
    if (!matchesAttempt(current, provider, transactionId) || current.status === 'cancelled' ||
        current.paymentStatus !== 'pending_verification') return null;
    return { ...current, paymentStatus: 'paid', status: 'processing', refId: reference };
  });
  if (updated) {
    if (updated.customer.email) {
      await ResendEmailService.sendOrderConfirmation(updated).catch(() => undefined);
    }
    return updated;
  }

  const latest = await OrdersDb.getById(order.id);
  return latest?.paymentStatus === 'paid' && matchesAttempt(latest, provider, transactionId) ? latest : null;
}

export function registerOrderPaymentRoutes(app: Express) {
  for (const provider of ['zarinpal', 'nextpay'] as const) {
    const base = `/api/payment/${provider}`;
    app.get(`${base}/status`, (_req, res) => {
      const configured = getMerchantBinding(provider) !== null;
      const sandbox = provider === 'zarinpal' && ZarinpalService.getConfig().isSandbox;
      return res.json({ success: true, isConfigured: configured, configured, isSandbox: sandbox });
    });

    app.post(`${base}/request`, async (req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      try {
        const orderId = typeof req.body?.orderId === 'string' ? req.body.orderId : '';
        const order = orderId && await OrdersDb.getById(orderId);
        if (!order || !canAccessCheckout(req, order)) return res.status(404).json({ success: false });
        const merchantBinding = getMerchantBinding(provider);
        if (!merchantBinding) return res.status(503).json({ success: false });
        if (order.status !== 'pending' || order.paymentStatus !== 'pending_verification' ||
            order.paymentMethod !== 'online_gateway' || order.quoteRequired ||
            !Number.isSafeInteger(order.totalAmount) || order.totalAmount < 1000) {
          return res.status(409).json({ success: false });
        }
        if (order.paymentAttempt?.transactionId && matchesAttempt(order, provider, order.paymentAttempt.transactionId)) {
          return res.json({ success: true, paymentUrl: order.paymentAttempt.paymentUrl });
        }

        const attempt: Attempt = {
          id: crypto.randomUUID(), provider, merchantBinding, amount: order.totalAmount, currency: 'IRT',
        };
        const reserved = await OrdersDb.changeOrder(order.id, (current) => {
          if (!canAccessCheckout(req, current) || current.paymentAttempt || current.status !== 'pending' ||
              current.paymentStatus !== 'pending_verification' || current.totalAmount !== attempt.amount ||
              current.paymentMethod !== 'online_gateway' || current.quoteRequired) return null;
          return { ...current, paymentAttempt: attempt };
        });
        if (!reserved) return res.status(409).json({ success: false });

        const result = await initiate(provider, reserved).catch(() => null);
        const id = transaction(result?.transactionId);
        if (!result?.success || !id || !result.paymentUrl) {
          await OrdersDb.changeOrder(order.id, (current) =>
            current.paymentAttempt?.id === attempt.id && !current.paymentAttempt.transactionId
              ? { ...current, paymentAttempt: undefined } : null);
          return res.status(502).json({ success: false, error: 'درگاه پرداخت موقتاً در دسترس نیست.' });
        }

        const ready = await OrdersDb.changeOrder(order.id, (current) =>
          current.paymentAttempt?.id === attempt.id && current.status === 'pending' &&
          current.paymentStatus === 'pending_verification'
            ? { ...current, paymentAttempt: { ...attempt, transactionId: id, paymentUrl: result.paymentUrl } } : null);
        if (!ready) return res.status(409).json({ success: false });
        return res.json({ success: true, paymentUrl: result.paymentUrl });
      } catch {
        return res.status(503).json({ success: false, error: 'آغاز پرداخت موقتاً در دسترس نیست.' });
      }
    });

    app.post(`${base}/verify`, async (req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      try {
        const id = transaction(provider === 'zarinpal' ? req.body?.authority : (req.body?.transId ?? req.body?.authority));
        const orderId = req.body?.orderId;
        if (!id || typeof orderId !== 'string') return res.status(400).json({ success: false });
        const order = await OrdersDb.getById(orderId);
        if (!order || !canAccessCheckout(req, order)) return res.status(404).json({ success: false });
        const paid = await settle(order, provider, id);
        return paid ? res.json({ success: true, refId: paid.refId }) : res.status(409).json({ success: false });
      } catch {
        return res.status(503).json({ success: false });
      }
    });

    const callback = async (req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Referrer-Policy', 'no-referrer');
      try {
        const id = transaction(provider === 'zarinpal' ? req.query.Authority : (req.query.trans_id ?? req.body?.trans_id));
        if (!id) return res.status(400).send('Missing payment reference.');
        const order = await OrdersDb.getByPaymentTransaction(provider, id);
        if (!order) return res.status(404).send('Payment reference not found.');
        // Callback parameters never set paid or failed. Reconcile with the configured provider.
        const paid = await settle(order, provider, id);
        return res.redirect(303, `/order/${encodeURIComponent(order.orderNumber)}?${paid ? 'orderSuccess=true' : 'orderPending=true'}`);
      } catch {
        return res.status(503).send('Payment verification temporarily unavailable.');
      }
    };
    app.get(`${base}/callback`, callback);
    if (provider === 'nextpay') app.post(`${base}/callback`, callback);
  }
}
