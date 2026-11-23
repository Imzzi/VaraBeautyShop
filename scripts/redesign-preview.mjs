// A loopback-only preview with synthetic commerce, account, and admin responses.
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { PRODUCTS } from '../src/data/products.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const images = {
  cover: '/catalog/cosrx-snail-96-100ml.webp',
  alternate: '/catalog/cosrx-snail-96-100ml-front.webp',
};
const product = {
  ...PRODUCTS.find(({ id }) => id === 'product-12'),
  id: 'fixture-variants', nameFa: 'اسنس آزمایشی برای بررسی تنوع', nameEn: 'Fixture Essence A-50',
  images: [images.cover],
  variants: [
    { id: 'standard', name: 'حجم اصلی', nameEn: '100 mL', price: 1450000, stockCount: 4, image: images.cover },
    { id: 'sold-out', name: 'بسته دوم', nameEn: 'A-50', price: 1520000, stockCount: 0, image: images.alternate },
  ],
};
const products = [...structuredClone(PRODUCTS), product];
const user = {
  uid: 'fixture-customer', displayName: 'مریم آزمایشی', email: 'customer@example.test',
  phoneNumber: '09120000000', address: 'خیابان آزمایشی، پلاک ۱۰',
  city: 'تهران', province: 'تهران', postalCode: '1234567890',
  emailVerified: true, phoneVerified: true,
};
const order = {
  id: 'fixture-order', orderNumber: 'UX-1234', userId: user.uid,
  customer: { name: user.displayName, phone: user.phoneNumber, address: user.address, city: user.city, province: user.province, postalCode: user.postalCode },
  items: [{ productId: 'product-12', nameFa: 'اسنس حلزون کوزارکس', sizeLabel: '۱۰۰ میلی‌لیتر', quantity: 1, price: 1450000 }],
  subtotal: 1450000, totalAmount: 1500000, shippingFee: 50000, shippingMethod: 'post_express',
  status: 'pending', paymentStatus: 'pending_verification', paymentMethod: 'online_gateway',
  createdAt: '2026-11-23T08:00:00.000Z',
};
const orders = [order];
const flags = { catalog: 'ok', orders: 'ok', save: 'ok', upload: 'ok', checkout: 'ok' };
const mutations = [];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const port = Number(process.env.VARA_PREVIEW_PORT || 4192);

const app = await createServer({
  root,
  server: { host: '127.0.0.1', port, strictPort: true },
  plugins: [{
    name: 'vara-local-fixtures',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const { pathname, searchParams } = new URL(req.url, 'http://127.0.0.1');
        const { method } = req;
        res.setHeader('Content-Security-Policy', "connect-src 'self' ws://127.0.0.1:*; form-action 'self'; frame-src 'none'; script-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:");
        if (!pathname.startsWith('/api/') && !pathname.startsWith('/__vara/')) return next();
        const send = (data, status = 200) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(JSON.stringify(data));
        };
        const unavailable = () => send({ success: false, error: 'سرویس آزمایشی در دسترس نیست.' }, 503);
        let payload = {};
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          let raw = '';
          for await (const chunk of req) raw += chunk;
          try { payload = JSON.parse(raw); } catch {}
        }
        if (pathname === '/__vara/state') {
          for (const [key, value] of searchParams) {
            if (Object.hasOwn(flags, key) && ['ok', 'fail', 'empty', 'delay'].includes(value)) flags[key] = value;
          }
          return send(flags);
        }
        if (pathname === '/__vara/mutations') return send(mutations);
        if (pathname === '/api/db/events') {
          res.setHeader('Content-Type', 'text/event-stream');
          return res.end('data: {"serverless":true}\n\n');
        }
        if (pathname === '/api/db/admin/verify') {
          return send(payload.username === 'vara-preview' && payload.password === 'preview-only'
            ? { success: true, token: 'fixture-admin-session' } : { success: false });
        }
        if (pathname === '/api/db/admin/session' || pathname === '/api/db/admin/meta') return send({ success: true });
        if (pathname === '/api/db/users/login' || pathname === '/api/db/user/login') return send({ success: true, user, profile: user, token: 'vuc2.fixture-preview-session' });
        if (pathname.startsWith('/api/db/users/') && method === 'GET') return send({ success: true, user, profile: user });
        if (['/api/db/products', '/api/db/admin/products'].includes(pathname) && method === 'GET') {
          if (flags.catalog === 'delay') await wait(1800);
          if (flags.catalog === 'fail') return unavailable();
          return send({ success: true, products: flags.catalog === 'empty' ? [] : products });
        }
        if (pathname.startsWith('/api/db/products/')) {
          const id = decodeURIComponent(pathname.split('/')[4]);
          const catalogProduct = products.find((entry) => entry.id === id);
          if (method === 'GET') return catalogProduct ? send({ success: true, product: catalogProduct }) : send({ success: false }, 404);
          if (method === 'DELETE' && catalogProduct) {
            products.splice(products.indexOf(catalogProduct), 1);
            return send({ success: true });
          }
          if (method === 'PUT' || method === 'PATCH') {
            mutations.push({ path: pathname, method });
            await wait(650);
            if (flags.save === 'fail') return unavailable();
            if (!catalogProduct) return send({ success: false }, 404);
            Object.assign(catalogProduct, payload);
            return send({ success: true, product: catalogProduct });
          }
        }
        if (pathname === '/api/db/products' && method === 'POST') {
          mutations.push({ path: pathname, method });
          await wait(650);
          if (flags.save === 'fail') return unavailable();
          products.push(payload);
          return send({ success: true, product: payload });
        }
        if (pathname === '/api/upload/status') return send({ configured: true, provider: 'vercel-blob' });
        if (pathname === '/api/upload' && method === 'POST') {
          mutations.push({ path: pathname, method });
          await wait(650);
          return flags.upload === 'fail' ? unavailable() : send({ success: true, url: images.cover, provider: 'vercel-blob', isBlobConfigured: true });
        }
        if (pathname === '/api/db/orders/page' || pathname === '/api/db/orders/user') {
          if (flags.orders === 'fail') return unavailable();
          const query = (searchParams.get('q') || '').toLowerCase();
          const status = searchParams.get('status') || 'all';
          const results = flags.orders === 'empty' ? [] : orders.filter((item) => (
            item.orderNumber.toLowerCase().includes(query) && (status === 'all' || item.status === status)
          ));
          return send({ success: true, orders: results, nextCursor: null });
        }
        if (pathname === '/api/db/orders/stats') return send({ success: true, stats: null });
        if (pathname.startsWith('/api/db/orders/lookup/')) {
          if (flags.orders === 'fail') return unavailable();
          const found = orders.find((item) => pathname.endsWith('/' + item.orderNumber));
          return found ? send({ success: true, order: found }) : send({ success: false }, 404);
        }
        if (pathname === '/api/db/orders' && method === 'POST') {
          mutations.push({ path: pathname, method });
          await wait(500);
          if (flags.checkout === 'fail') return unavailable();
          const saved = { ...order, id: 'fixture-saved-' + orders.length, orderNumber: 'UX-' + (7000 + orders.length), customer: payload.customer, paymentMethod: payload.paymentMethod, shippingMethod: payload.shippingMethod };
          orders.unshift(saved);
          return send({ success: true, order: saved });
        }
        if (pathname === '/api/payment/zarinpal/request') {
          mutations.push({ path: pathname, method });
          return unavailable();
        }
        if (pathname.includes('/shipping_settings')) return send({ success: true, value: { postExpressFee: 50000, tehranCourierEnabled: true } });
        if (pathname.startsWith('/api/db/settings/')) return send({ success: true, value: null });
        if (pathname === '/api/ingredients/describe') return send({ success: true, ingredients: [] });
        return send({ success: false, error: 'این سرویس در پیش‌نمایش محلی فعال نیست.' }, 404);
      });
    },
  }],
});
await app.listen();
console.log(`Vara fixture preview at http://127.0.0.1:${port}`);
