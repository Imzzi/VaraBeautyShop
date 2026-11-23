import type { CartItem, Order } from '../types';

export const CHECKOUT_PAYMENT_PATH = '/checkout/payment';

export function checkoutPaymentPath(orderId: string) {
  return `${CHECKOUT_PAYMENT_PATH}?order=${encodeURIComponent(orderId)}`;
}

export function isPendingOnlineCheckout(order: Pick<Order, 'paymentMethod' | 'paymentStatus' | 'status'>) {
  return order.paymentMethod === 'online_gateway' && order.paymentStatus === 'pending_verification' && order.status === 'pending';
}

export function getPaymentReturnIdentifier() {
  const { pathname, search } = window.location;
  const params = new URLSearchParams(search);
  if (pathname === CHECKOUT_PAYMENT_PATH) return params.get('order') ?? '';
  // Payment attempts started by earlier releases can still return to the old route.
  if (!['orderSuccess', 'orderPending', 'orderFailed'].some((key) => params.get(key) === 'true')) return '';
  return /^\/order\/([\w-]+)\/?$/.exec(pathname)?.[1] ?? '';
}

const PAYMENT_CART_KEY = 'vara_payment_cart';

export function cartSignature(items: CartItem[]) {
  const lines = items.map(({ product, selectedSize, selectedVariant, quantity }) => {
    const price = selectedVariant?.price ?? selectedSize?.price ?? product.price;
    return JSON.stringify([product.id, selectedSize?.label, selectedVariant?.id, quantity, price]);
  });
  return JSON.stringify(lines.sort());
}

export function readPaymentCart(): { orderId: string; signature: string; userId?: string } | null {
  try {
    return JSON.parse(sessionStorage.getItem(PAYMENT_CART_KEY) ?? 'null');
  } catch {
    return null;
  }
}

export function rememberPaymentCart(orderId: string, items: CartItem[], userId?: string) {
  if (readPaymentCart()?.orderId === orderId) return;
  try {
    sessionStorage.setItem(PAYMENT_CART_KEY, JSON.stringify({ orderId, signature: cartSignature(items), userId }));
  } catch {}
}

export function forgetPaymentCart(orderId: string) {
  if (readPaymentCart()?.orderId !== orderId) return;
  try {
    sessionStorage.removeItem(PAYMENT_CART_KEY);
  } catch {}
}
