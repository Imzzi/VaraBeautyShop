import { createClient as createWebClient, type Client, type Transaction } from '@libsql/client/web';
import crypto from 'crypto';
import { PRODUCTS as initialProducts } from './src/data/products';
import { BRANDS_DATA } from './src/data/brands';
import { Product, Order, UserProfile, OrderStatus, OrderStats } from './src/types';

// Detect whether Turso is configured in environment (e.g. from Vercel Integration)
const tursoUrl = (process.env.TURSO_DATABASE_URL || process.env.TURSO_URL || '').trim();
const tursoAuthToken = (process.env.TURSO_AUTH_TOKEN || '').trim();
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = !!(process.env.VERCEL || process.env.VERCEL_ENV || process.env.AWS_LAMBDA_FUNCTION_NAME);

let client: Client;
let dbInitializationError: string | null = null;
let dbMode: string = 'unknown';

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

// Create an in-memory fallback client when Turso is not connected
function createInMemoryClient(): Client {
  const tables = new Map<string, Map<string, any>>();
  tables.set('products', new Map(initialProducts.map((product) => [product.id, product])));
  tables.set('orders', new Map());
  tables.set('settings', new Map([['brands', JSON.stringify(BRANDS_DATA)]]));
  tables.set('admins', new Map());
  tables.set('security_store', new Map());

  const execute = async (stmt: any) => {
      const sql = typeof stmt === 'string' ? stmt : stmt.sql;
      const args = typeof stmt === 'string' ? [] : stmt.args || [];
      const sqlLower = sql.trim().toLowerCase();

      if (sqlLower.startsWith('create table') || sqlLower.startsWith('pragma')) {
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
      }

      if (sqlLower.includes('from sqlite_schema')) {
        return { columns: ['name'], columnTypes: ['TEXT'], rows: [{ name: 'products' }], rowsAffected: 0 };
      }

      if (sqlLower.startsWith('select') && sqlLower.includes('from products')) {
        const prodMap = tables.get('products')!;
        if (sqlLower.includes('count(*)')) {
          return { columns: ['count'], columnTypes: ['INTEGER'], rows: [{ count: prodMap.size }], rowsAffected: 0 };
        }
        if (sqlLower.includes('where id =')) {
          const id = args[0];
          const item = prodMap.get(id);
          return { columns: ['data'], columnTypes: ['TEXT'], rows: item ? [{ data: JSON.stringify(item) }] : [], rowsAffected: 0 };
        }
        let products = sqlLower.includes('where id in')
          ? args.map((id: string) => prodMap.get(id)).filter(Boolean)
          : Array.from(prodMap.values());
        if (sqlLower.includes('limit 1')) products = products.slice(0, 1);
        const rows = products.map((product: Product) => ({ data: JSON.stringify(product) }));
        return { columns: ['data'], columnTypes: ['TEXT'], rows, rowsAffected: 0 };
      }

      if (sqlLower.includes('insert into products') || sqlLower.includes('replace into products')) {
        const prodMap = tables.get('products')!;
        const id = args[0];
        if (sqlLower.includes('do nothing') && prodMap.has(id)) {
          return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
        }
        const jsonArg = args[args.length - 2];
        if (jsonArg) {
          prodMap.set(id, JSON.parse(jsonArg));
        }
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('delete from products where id =')) {
        const prodMap = tables.get('products')!;
        return { columns: [], columnTypes: [], rows: [], rowsAffected: Number(prodMap.delete(args[0])) };
      }

      if (sqlLower.includes('update products')) {
        const prodMap = tables.get('products')!;
        const guarded = sqlLower.includes('and data = ?');
        const id = args[guarded ? args.length - 2 : args.length - 1];
        if (!prodMap.has(id) || (guarded && JSON.stringify(prodMap.get(id)) !== args.at(-1))) {
          return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
        }
        prodMap.set(id, JSON.parse(args[guarded ? args.length - 4 : args.length - 3]));
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('delete from products')) {
        const prodMap = tables.get('products')!;
        prodMap.clear();
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.startsWith('select') && sqlLower.includes('from orders')) {
        const ordMap = tables.get('orders')!;
        if (sqlLower.includes('where id =')) {
          const id = args[0];
          const item = ordMap.get(id);
          return { columns: ['data'], columnTypes: ['TEXT'], rows: item ? [{ data: JSON.stringify(item) }] : [], rowsAffected: 0 };
        }
        let entries = Array.from(ordMap.values()) as Order[];
        if (sqlLower.includes('count(*)')) {
          return { columns: [], columnTypes: [], rows: [summarizeOrders(entries)], rowsAffected: 0 };
        }
        if (sqlLower.includes('where ordernumber =') || sqlLower.includes("json_extract(data, '$.ordernumber')")) {
          entries = entries.filter((order) => order.orderNumber === args[0]);
        }
        if (sqlLower.includes('paymentattempt.provider')) {
          entries = entries.filter((order) => order.paymentAttempt?.provider === args[0] &&
            order.paymentAttempt?.transactionId === args[1]).slice(0, 2);
        }
        if (sqlLower.includes("json_extract(data, '$.userid')")) {
          entries = entries.filter((order) => order.checkoutOwnerVerified && order.userId === args[0]);
        }
        if (sqlLower.includes('order by createdat')) {
          entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
        }
        if (sqlLower.includes('limit ?')) {
          let arg = 0;
          if (sqlLower.includes('status = ?')) {
            const status = args[arg++];
            entries = entries.filter((order) => order.status === status);
          }
          if (sqlLower.includes('instr(')) {
            const query = args[arg].toLowerCase();
            arg += 4;
            entries = entries.filter((order) => [order.orderNumber, order.customer.name, order.customer.phone, order.customer.city]
              .some((field) => field?.toLowerCase().includes(query)));
          }
          if (sqlLower.includes('(createdat, id) <')) {
            const time = args[arg++];
            const id = args[arg++];
            entries = entries.filter((order) => order.createdAt < time || (order.createdAt === time && order.id < id));
          }
          entries = entries.slice(0, args[arg]);
        }
        const rows = entries.map(o => ({ data: JSON.stringify(o) }));
        return { columns: ['data'], columnTypes: ['TEXT'], rows, rowsAffected: 0 };
      }

      if (sqlLower.includes('insert into orders') || sqlLower.includes('replace into orders')) {
        const ordMap = tables.get('orders')!;
        const id = args[0];
        const data = args[9];
        if (data) {
          ordMap.set(id, JSON.parse(data));
        }
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('update orders')) {
        const ordMap = tables.get('orders')!;
        const guarded = sqlLower.includes('and data = ?');
        const id = guarded ? args[args.length - 2] : args[args.length - 1];
        if (guarded && JSON.stringify(ordMap.get(id)) !== args[args.length - 1]) {
          return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
        }
        const jsonArg = args.find((a: any) => typeof a === 'string' && (a.startsWith('{') || a.startsWith('[')));
        if (jsonArg) {
          ordMap.set(id, JSON.parse(jsonArg));
        } else if (ordMap.has(id)) {
          const item = ordMap.get(id);
          if (sqlLower.includes('status = ?')) {
            item.status = args[0];
          }
          if (sqlLower.includes('postaltrackingcode = ?')) {
            item.postalTrackingCode = args[1];
          }
          if (sqlLower.includes('paymentstatus = ?')) {
            item.paymentStatus = args[0];
          }
          ordMap.set(id, item);
        }
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('delete from orders where id =')) {
        const ordMap = tables.get('orders')!;
        return { columns: [], columnTypes: [], rows: [], rowsAffected: Number(ordMap.delete(args[0])) };
      }

      if (sqlLower.includes('from settings')) {
        const setMap = tables.get('settings')!;
        const key = args[0];
        const val = setMap.get(key);
        return { columns: ['value'], columnTypes: ['TEXT'], rows: val !== undefined ? [{ value: val }] : [], rowsAffected: 0 };
      }

      if (sqlLower.includes('insert into settings') || sqlLower.includes('replace into settings')) {
        const setMap = tables.get('settings')!;
        const [key, val] = args;
        if (!sqlLower.includes('do nothing') || !setMap.has(key)) setMap.set(key, val);
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('from admins')) {
        const adminMap = tables.get('admins')!;
        const first = Array.from(adminMap.values())[0];
        return {
          columns: ['id', 'username', 'passwordHash', 'salt', 'updatedAt'],
          columnTypes: ['TEXT', 'TEXT', 'TEXT', 'TEXT', 'TEXT'],
          rows: first ? [first] : [],
          rowsAffected: 0,
        };
      }

      if (sqlLower.includes('insert into admins') || sqlLower.includes('replace into admins')) {
        const adminMap = tables.get('admins')!;
        const [id, username, passwordHash, salt, updatedAt] = args;
        adminMap.set(id, { id, username, passwordHash, salt, updatedAt });
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.startsWith('select') && sqlLower.includes('from security_store')) {
        const secMap = tables.get('security_store')!;
        if (sqlLower.includes('where key =')) {
          const key = args[0];
          const item = secMap.get(key);
          return {
            columns: ['key', 'value', 'attempts', 'expiresAt', 'updatedAt'],
            columnTypes: ['TEXT', 'TEXT', 'INTEGER', 'INTEGER', 'INTEGER'],
            rows: item ? [item] : [],
            rowsAffected: 0,
          };
        }
        return {
          columns: ['key', 'value', 'attempts', 'expiresAt', 'updatedAt'],
          columnTypes: ['TEXT', 'TEXT', 'INTEGER', 'INTEGER', 'INTEGER'],
          rows: Array.from(secMap.values()),
          rowsAffected: 0,
        };
      }

      if (sqlLower.includes('insert or replace into security_store') || sqlLower.includes('into security_store')) {
        const secMap = tables.get('security_store')!;
        const [key, value, attempts, expiresAt, updatedAt, limit] = args;
        if (sqlLower.includes('on conflict') && Number(secMap.get(key)?.updatedAt) > limit) {
          return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
        }
        secMap.set(key, { key, value, attempts: Number(attempts || 0), expiresAt: Number(expiresAt || 0), updatedAt });
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('update security_store')) {
        const secMap = tables.get('security_store')!;
        if (sqlLower.includes('attempts = attempts + 1')) {
          const [key, now, value] = args;
          const item = secMap.get(key);
          const valid = item && item.expiresAt > now && item.attempts < 5 && item.value !== value;
          if (valid) item.attempts++;
          return { columns: [], columnTypes: [], rows: [], rowsAffected: valid ? 1 : 0 };
        }
        const [attempts, updatedAt, key] = args;
        const current = secMap.get(key) || { key };
        secMap.set(key, { ...current, attempts: Number(attempts || 0), updatedAt });
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      if (sqlLower.includes('delete from security_store')) {
        const secMap = tables.get('security_store')!;
        if (sqlLower.includes('where key =')) {
          const [key, value, now] = args;
          const item = secMap.get(key);
          if (!item || (args.length >= 2 && item.value !== value) ||
              (args.length === 3 && (item.expiresAt <= now || item.attempts >= 5))) {
            return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
          }
          secMap.delete(key);
        } else {
          secMap.clear();
        }
        return { columns: [], columnTypes: [], rows: [], rowsAffected: 1 };
      }

      return { columns: [], columnTypes: [], rows: [], rowsAffected: 0 };
  };

  let tail = Promise.resolve();
  async function lock() {
    const previous = tail;
    let release!: () => void;
    tail = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    return release;
  }

  async function transaction() {
    const release = await lock();
    const snapshot = structuredClone(tables);
    let closed = false;
    const finish = (rollback: boolean) => {
      if (closed) return;
      if (rollback) {
        tables.clear();
        for (const [name, entries] of snapshot) tables.set(name, entries);
      }
      closed = true;
      release();
    };
    return {
      execute,
      batch: async (statements: any[]) => {
        const results = [];
        for (const statement of statements) results.push(await execute(statement));
        return results;
      },
      commit: async () => finish(false),
      rollback: async () => finish(true),
      close: () => finish(true),
      get closed() { return closed; },
    };
  }

  return {
    execute: async (stmt: any) => {
      const release = await lock();
      try {
        return await execute(stmt);
      } finally {
        release();
      }
    },
    batch: async (stmts: any[]) => {
      const tx = await transaction();
      try {
        const results = await tx.batch(stmts);
        await tx.commit();
        return results;
      } finally {
        tx.close();
      }
    },
    transaction,
    close: () => {},
    sync: async () => ({} as any),
  } as unknown as Client;
}

const fallbackMemoryClient = createInMemoryClient();
try {
  if (tursoUrl) {
    console.log(`[Database] Connecting to Turso Cloud libSQL via pure JS Web Driver: ${tursoUrl.replace(/\/\/[^@]*@/, '//***@')}`);
    const rawClient = createWebClient({
      url: tursoUrl,
      authToken: tursoAuthToken || undefined,
    });
    client = rawClient;
    dbMode = 'Turso Cloud (libSQL Web Driver)';
  } else {
    console.log('[Database] TURSO_DATABASE_URL not detected. Initializing zero-dependency in-memory fallback.');
    client = fallbackMemoryClient;
    dbMode = 'In-Memory Fallback (No Turso URL)';
  }
} catch (initErr: any) {
  console.error('[Database] Failed to initialize web client, using in-memory fallback:', initErr);
  dbInitializationError = initErr?.message || 'Database client creation failed';
  client = fallbackMemoryClient;
  dbMode = 'In-Memory Fallback (Error)';
}

if ((tursoUrl || isVercel || isProduction) && client === fallbackMemoryClient) {
  const unavailable = async () => { throw new Error('Durable database is unavailable.'); };
  client = { execute: unavailable, batch: unavailable, transaction: unavailable } as unknown as Client;
}

export function getDbDiagnostics() {
  return {
    mode: dbMode,
    isInitialized,
    error: dbInitializationError,
    tursoUrlPresent: !!tursoUrl,
    tursoTokenPresent: !!tursoAuthToken,
    tursoUrlPreview: tursoUrl ? tursoUrl.replace(/:[^:@]+@/, ':***@') : null,
  };
}

export async function pingTursoDatabase(): Promise<{
  connected: boolean;
  latencyMs: number;
  mode: string;
  error?: string;
  tableStats?: {
    products: number;
    orders: number;
    brands: number;
  };
}> {
  const start = Date.now();
  try {
    await client.execute('SELECT 1 as ping');
    const latencyMs = Date.now() - start;

    let prodCount = productsCache?.data?.length || initialProducts.length;
    let ordCount = 0;
    try {
      const oRes = await client.execute('SELECT COUNT(*) as c FROM orders');
      ordCount = Number(oRes.rows[0]?.c || 0);
    } catch {
      // In-memory or tables not created yet
    }

    return {
      connected: client !== fallbackMemoryClient,
      latencyMs,
      mode: dbMode,
      ...(dbInitializationError ? { error: dbInitializationError } : {}),
      tableStats: {
        products: prodCount,
        orders: ordCount,
        brands: BRANDS_DATA.length,
      },
    };
  } catch (err: any) {
    return {
      connected: false,
      latencyMs: Date.now() - start,
      mode: dbMode,
      error: err?.message || 'Failed to ping Turso database',
    };
  }
}

// -------------------------------------------------------------
// HELPER CRYPTO UTILITIES FOR PASSWORDS
// -------------------------------------------------------------
export function hashWithSalt(password: string, salt: string, type: 'admin' | 'user' = 'admin'): string {
  const secret = type === 'admin' ? 'vara_beauty_salt' : 'vara_user_salt';
  return crypto.createHash('sha256').update(`${password}::${secret}::${salt}`).digest('hex');
}

export function generateSalt(length = 16): string {
  return crypto.randomBytes(length).toString('hex');
}

// -------------------------------------------------------------
// DATABASE INITIALIZATION & SEEDING
// -------------------------------------------------------------
let isInitialized = false;
let initPromise: Promise<void> | null = null;
const schemaVersion = '1';
const schemaVersionKey = '__vara_schema_version';
const schemaVersionQuery = { sql: 'SELECT value FROM settings WHERE key = ?', args: [schemaVersionKey] };

export async function ensureDbInitialized(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const version = await client.execute(schemaVersionQuery).catch((error) => {
        if (String(error?.message).includes('no such table: settings')) return null;
        throw error;
      });
      if (version?.rows[0]?.value === schemaVersion) {
        isInitialized = true;
        return;
      }

      const tx = await client.transaction('write');
      try {
        const productsTable = await tx.execute(
          "SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'products'",
        );
        const existingVersion = productsTable.rows.length
          ? await tx.execute(schemaVersionQuery).catch((error) => {
            if (String(error?.message).includes('no such table: settings')) return null;
            throw error;
          })
          : null;
        if (existingVersion?.rows[0]?.value !== schemaVersion) {
          await tx.batch([
            `CREATE TABLE IF NOT EXISTS products (
              id TEXT PRIMARY KEY,
              nameFa TEXT,
              nameEn TEXT,
              brand TEXT,
              price INTEGER,
              originalPrice INTEGER,
              stockCount INTEGER,
              inStock INTEGER,
              data TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS orders (
              id TEXT PRIMARY KEY,
              orderNumber TEXT,
              status TEXT NOT NULL,
              paymentStatus TEXT NOT NULL,
              totalAmount INTEGER NOT NULL,
              customerName TEXT,
              customerPhone TEXT,
              customerEmail TEXT,
              postalTrackingCode TEXT,
              data TEXT NOT NULL,
              createdAt TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS users (
              uid TEXT PRIMARY KEY,
              email TEXT UNIQUE,
              phoneNumber TEXT,
              displayName TEXT,
              passwordHash TEXT,
              salt TEXT,
              verificationCode TEXT,
              emailVerified INTEGER DEFAULT 0,
              role TEXT DEFAULT 'customer',
              data TEXT NOT NULL,
              createdAt TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS admins (
              id TEXT PRIMARY KEY,
              username TEXT UNIQUE NOT NULL,
              passwordHash TEXT NOT NULL,
              salt TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS settings (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL,
              updatedAt TEXT NOT NULL
            );`,
            `CREATE TABLE IF NOT EXISTS security_store (
              key TEXT PRIMARY KEY,
              value TEXT NOT NULL,
              attempts INTEGER DEFAULT 0,
              expiresAt INTEGER NOT NULL,
              updatedAt INTEGER NOT NULL
            );`,
            `CREATE INDEX IF NOT EXISTS idx_orders_orderNumber ON orders(orderNumber);`,
            `CREATE INDEX IF NOT EXISTS idx_orders_customerPhone ON orders(customerPhone);`,
            `CREATE INDEX IF NOT EXISTS idx_orders_customerEmail ON orders(customerEmail);`,
            `CREATE INDEX IF NOT EXISTS idx_orders_createdAt ON orders(createdAt DESC);`,
            `CREATE INDEX IF NOT EXISTS idx_orders_date_id ON orders(createdAt DESC, id DESC);`,
            `CREATE INDEX IF NOT EXISTS idx_orders_payment_attempt ON orders(
              json_extract(data, '$.paymentAttempt.provider'), json_extract(data, '$.paymentAttempt.transactionId')
            );`,
            `CREATE INDEX IF NOT EXISTS idx_orders_verified_owner ON orders(
              json_extract(data, '$.userId'), createdAt DESC
            ) WHERE json_extract(data, '$.checkoutOwnerVerified') = 1;`,
            `CREATE INDEX IF NOT EXISTS idx_orders_json_number ON orders(json_extract(data, '$.orderNumber'));`,
            `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
            `CREATE INDEX IF NOT EXISTS idx_users_phoneNumber ON users(phoneNumber);`,
          ]);
          if (!productsTable.rows.length) {
            await tx.batch(initialProducts.map((seed) => ({
              sql: `${productInsert} ON CONFLICT(id) DO NOTHING`,
              args: [seed.id, ...productFields(seed, 25)],
            })));
          }

          const envAdminPass = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || '').trim();
          if (envAdminPass && !(await tx.execute('SELECT id FROM admins LIMIT 1')).rows.length) {
            const username = (process.env.ADMIN_USERNAME || process.env.ADMIN_USER || '').trim() || 'admin';
            const salt = generateSalt(16);
            await tx.execute({
              sql: 'INSERT INTO admins (id, username, passwordHash, salt, updatedAt) VALUES (?, ?, ?, ?, ?)',
              args: ['admin_primary', username, hashWithSalt(envAdminPass, salt, 'admin'), salt, new Date().toISOString()],
            });
          }

          await tx.execute({
            sql: 'INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?) ON CONFLICT(key) DO NOTHING',
            args: ['brands', JSON.stringify(BRANDS_DATA), new Date().toISOString()],
          });
          await tx.execute({
            sql: `INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
            args: [schemaVersionKey, schemaVersion, new Date().toISOString()],
          });
        }
        await tx.commit();
      } catch (error) {
        await tx.rollback().catch(() => {});
        throw error;
      } finally {
        tx.close();
      }
      isInitialized = true;
    } catch (err: any) {
      console.error('[Database] Failed to initialize tables/seeding:', err);
      dbInitializationError = err?.message || 'Table initialization failed';
      initPromise = null;
      throw err;
    }
  })();

  return initPromise;
}

// Cache public catalog reads within each worker.
const ADMIN_CACHE_TTL_MS = 5 * 60 * 1000;
const PRODUCT_CACHE_TTL_MS = 30_000;
let productsCache: { data: Product[]; expiresAt: number } | null = null;
let adminCredsCache: { data: { username: string; passwordHash: string; salt: string; updatedAt: string } | null; expiresAt: number } | null = null;

let productsCacheRevision = 0;

export function invalidateProductsCache() {
  productsCacheRevision++;
  productsCache = null;
}

// -------------------------------------------------------------
// PRODUCTS REPOSITORY
// -------------------------------------------------------------
const productInsert = `INSERT INTO products
  (id, nameFa, nameEn, brand, price, originalPrice, stockCount, inStock, data, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

function productFields(product: Product, defaultStock = 20) {
  return [
    product.nameFa || '', product.nameEn || '', product.brand || 'VARA',
    product.price || 0, product.originalPrice || 0,
    product.stockCount ?? (product.inStock ? defaultStock : 0), product.inStock ? 1 : 0,
    JSON.stringify(product), new Date().toISOString(),
  ];
}

export class CatalogWriteError extends Error {
  constructor(message: string, readonly status: 400 | 409) {
    super(message);
  }
}

function checkProductImages(product: Product, previous?: Product) {
  if ((product.images !== undefined && !Array.isArray(product.images)) ||
      (product.variants !== undefined && !Array.isArray(product.variants))) {
    throw new CatalogWriteError('فهرست تصاویر یا گزینه‌های محصول نامعتبر است.', 400);
  }
  const inline = (item: Product) => [
    ...(item.images || []), ...(item.variants || []).map((variant) => variant.image),
  ].filter((url) => typeof url === 'string' && /^\s*data:/i.test(url));
  const existing = new Set(previous ? inline(previous) : []);
  if (inline(product).some((url) => !existing.has(url))) {
    throw new CatalogWriteError('تصویر محصول را در فضای ذخیره‌سازی بارگذاری کنید.', 400);
  }
}

export const ProductsDb = {
  async getAllFresh(): Promise<Product[]> {
    await ensureDbInitialized();
    const res = await client.execute('SELECT data FROM products');
    return res.rows.map((row) => JSON.parse(String(row.data)));
  },

  async getAllCached(): Promise<Product[]> {
    if (productsCache && Date.now() < productsCache.expiresAt) return productsCache.data;
    const revision = productsCacheRevision;
    const data = await this.getAllFresh();
    if (revision === productsCacheRevision) {
      productsCache = { data, expiresAt: Date.now() + PRODUCT_CACHE_TTL_MS };
    }
    return data;
  },

  async getAll(): Promise<Product[]> {
    try {
      return await this.getAllCached();
    } catch {
      return initialProducts;
    }
  },

  async getById(id: string): Promise<Product | null> {
    await ensureDbInitialized();
    const res = await client.execute({ sql: 'SELECT data FROM products WHERE id = ?', args: [id] });
    return res.rows.length ? JSON.parse(String(res.rows[0].data)) : null;
  },

  async create(input: Product): Promise<Product> {
    await ensureDbInitialized();
    const product = { ...input, id: input.id || `product-${crypto.randomUUID()}` };
    checkProductImages(product);
    const result = await client.execute({
      sql: `${productInsert} ON CONFLICT(id) DO NOTHING`,
      args: [product.id, ...productFields(product)],
    });
    if (!result.rowsAffected) {
      const existing = await this.getById(product.id);
      if (existing && JSON.stringify(existing) === JSON.stringify(product)) return existing;
      throw new CatalogWriteError('این شناسه قبلاً برای محصول دیگری استفاده شده است.', 409);
    }
    invalidateProductsCache();
    return product;
  },

  async update(id: string, updates: Partial<Product>): Promise<Product | null> {
    await ensureDbInitialized();
    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await client.execute({ sql: 'SELECT data FROM products WHERE id = ?', args: [id] });
      if (!result.rows.length) return null;
      const before = String(result.rows[0].data);
      const previous = JSON.parse(before) as Product;
      const product = { ...previous, ...updates, id };
      checkProductImages(product, previous);
      const write = await client.execute({
        sql: `UPDATE products SET nameFa = ?, nameEn = ?, brand = ?, price = ?, originalPrice = ?,
          stockCount = ?, inStock = ?, data = ?, updatedAt = ? WHERE id = ? AND data = ?`,
        args: [...productFields(product), id, before],
      });
      if (write.rowsAffected === 1) {
        invalidateProductsCache();
        return product;
      }
    }
    throw new CatalogWriteError('محصول هم‌زمان تغییر کرده است. دوباره تلاش کنید.', 409);
  },

  async delete(id: string): Promise<boolean> {
    await ensureDbInitialized();
    const res = await client.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] });
    if (res.rowsAffected) invalidateProductsCache();
    return res.rowsAffected > 0;
  },

  async resetToDefault(): Promise<Product[]> {
    await ensureDbInitialized();
    await client.batch([
      'DELETE FROM products',
      ...initialProducts.map((product) => ({
        sql: productInsert,
        args: [product.id, ...productFields(product, 25)],
      })),
    ], 'write');
    invalidateProductsCache();
    return initialProducts;
  },

  async updateStock(id: string, newStock: number): Promise<Product | null> {
    const stockCount = Math.max(0, Math.floor(newStock));
    return this.update(id, { stockCount, inStock: stockCount > 0 });
  },

};

export class OrderWriteError extends Error {
  constructor(message: string, readonly status: 400 | 409) {
    super(message);
  }
}

async function writeTransaction<T>(operation: (tx: Transaction) => Promise<T>): Promise<T> {
  await ensureDbInitialized();
  const tx = await client.transaction('write');
  try {
    const result = await operation(tx);
    await tx.commit();
    return result;
  } catch (error) {
    await tx.rollback().catch(() => {});
    throw error;
  } finally {
    tx.close();
  }
}

async function orderProducts(tx: Transaction, items: Order['items']) {
  const ids = Array.from(new Set(items.map((item) => item.productId)));
  if (!ids.length) return new Map<string, Product>();
  const result = await tx.execute({
    sql: `SELECT data FROM products WHERE id IN (${ids.map(() => '?').join(', ')})`,
    args: ids,
  });
  const products = result.rows.map((row) => JSON.parse(String(row.data)) as Product);
  return new Map(products.map((product) => [product.id, product]));
}

async function writeOrderStock(
  tx: Transaction,
  items: Order['items'],
  products: Map<string, Product>,
  direction: 1 | -1,
) {
  const touched = new Set<string>();
  for (const item of items) {
    const product = products.get(item.productId);
    if (!product) {
      if (direction === 1) continue; // A historical product may have been removed.
      throw new OrderWriteError('کالا یا گزینهٔ انتخاب‌شده در کاتالوگ موجود نیست.', 409);
    }

    const variants = product.variants || [];
    const variant = item.variantId ? variants.find((entry) => entry.id === item.variantId) : undefined;
    const stock = product.stockCount ?? (variants.length
      ? variants.reduce((total, entry) => total + (entry.stockCount || 0), 0)
      : product.inStock ? 20 : 0);
    if (direction === -1 && (!product.inStock || stock < item.quantity ||
        (item.variantId && (!variant || (variant.stockCount ?? 0) < item.quantity)))) {
      throw new OrderWriteError('موجودی محصول برای ثبت سفارش کافی نیست.', 409);
    }

    product.stockCount = stock + direction * item.quantity;
    if (variant) variant.stockCount = (variant.stockCount ?? 0) + direction * item.quantity;
    product.inStock = variants.length ? variants.some((entry) => (entry.stockCount ?? 0) > 0) : product.stockCount > 0;
    touched.add(product.id);
  }

  const updatedAt = new Date().toISOString();
  const changes = Array.from(touched, (id) => {
    const product = products.get(id)!;
    return {
      sql: 'UPDATE products SET stockCount = ?, inStock = ?, data = ?, updatedAt = ? WHERE id = ?',
      args: [product.stockCount!, Number(product.inStock), JSON.stringify(product), updatedAt, id],
    };
  });
  if (changes.length) await tx.batch(changes);
}

async function priceOrder(tx: Transaction, order: Order, products: Map<string, Product>) {
  order.items = order.items.map((item) => {
    const product = products.get(item.productId);
    const variant = item.variantId ? product?.variants?.find((entry) => entry.id === item.variantId) : undefined;
    const size = !item.variantId && item.sizeLabel ? product?.sizes?.find((entry) => entry.label === item.sizeLabel) : undefined;
    if (!product || (item.variantId && !variant) || (!item.variantId && product.sizes?.length && !size)) {
      throw new OrderWriteError('کالا یا گزینهٔ انتخاب‌شده در کاتالوگ موجود نیست.', 400);
    }
    const price = variant?.price ?? size?.price ?? product.price;
    if (!Number.isSafeInteger(price) || price < 0) throw new OrderWriteError('قیمت کالا نامعتبر است.', 400);
    return {
      productId: product.id, quantity: item.quantity, price, nameFa: product.nameFa, nameEn: product.nameEn,
      sizeLabel: size?.label || '', variantId: variant?.id, variantName: variant?.name,
      image: variant?.image || product.images?.[0] || '',
    };
  });

  order.subtotal = order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  if (order.shippingMethod === 'post_express') {
    const shipping = await tx.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: ['shipping_settings'] });
    const settings = shipping.rows.length ? JSON.parse(String(shipping.rows[0].value)) : undefined;
    order.shippingFee = Number(settings?.postExpressFee ?? 50000);
  }
  order.totalAmount = order.subtotal + order.shippingFee;
  if (!Number.isSafeInteger(order.shippingFee) || order.shippingFee < 0 ||
      !Number.isSafeInteger(order.totalAmount) || order.totalAmount > 500000000 || order.totalAmount < 1000) {
    throw new OrderWriteError('مبلغ سفارش نامعتبر است.', 400);
  }
}


// -------------------------------------------------------------
// ORDERS REPOSITORY
// -------------------------------------------------------------
type OrderCursor = { createdAt: string; id: string };

function summarizeOrders(orders: Order[]): OrderStats {
  const stats = { total: orders.length, pending: 0, processing: 0, shipped: 0, cancelled: 0, revenue: 0 };
  for (const order of orders) {
    if (order.status === 'pending' && order.paymentStatus !== 'failed') stats.pending++;
    if (order.status === 'processing') stats.processing++;
    if (order.status === 'shipped') stats.shipped++;
    if (order.status === 'cancelled' || order.paymentStatus === 'failed') stats.cancelled++;
    if (order.status !== 'cancelled' && order.paymentStatus === 'paid') stats.revenue += order.totalAmount;
  }
  return stats;
}

let orderStatsCache: { value: OrderStats; expiresAt: number } | undefined;
let orderStatsRevision = 0;

function invalidateOrderStats() {
  orderStatsRevision++;
  orderStatsCache = undefined;
}

export const OrdersDb = {
  async getAll(): Promise<Order[]> {
    await ensureDbInitialized();
    const res = await client.execute('SELECT data FROM orders ORDER BY createdAt DESC');
    return res.rows.map((r) => JSON.parse(r.data as string));
  },

  async getPage(options: { cursor?: OrderCursor; status?: OrderStatus; query?: string; limit: number }) {
    await ensureDbInitialized();
    const conditions: string[] = [];
    const args: (string | number)[] = [];
    if (options.status) {
      conditions.push('status = ?');
      args.push(options.status);
    }
    if (options.query) {
      conditions.push(`(instr(lower(orderNumber), ?) OR instr(lower(customerName), ?)
        OR instr(customerPhone, ?) OR instr(lower(json_extract(data, '$.customer.city')), ?))`);
      args.push(options.query, options.query, options.query, options.query);
    }
    if (options.cursor) {
      conditions.push('(createdAt, id) < (?, ?)');
      args.push(options.cursor.createdAt, options.cursor.id);
    }
    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await client.execute({
      sql: `SELECT data FROM orders ${where} ORDER BY createdAt DESC, id DESC LIMIT ?`,
      args: [...args, options.limit + 1],
    });
    const rows = result.rows.slice(0, options.limit).map((row) => JSON.parse(String(row.data)) as Order);
    const last = rows.at(-1);
    return {
      orders: rows,
      cursor: last && result.rows.length > rows.length ? { createdAt: last.createdAt, id: last.id } : undefined,
    };
  },

  async getStats(): Promise<OrderStats> {
    if (orderStatsCache && Date.now() < orderStatsCache.expiresAt) return orderStatsCache.value;
    const revision = orderStatsRevision;
    await ensureDbInitialized();
    const res = await client.execute(`SELECT COUNT(*) AS total,
      SUM(status = 'pending' AND paymentStatus != 'failed') AS pending,
      SUM(status = 'processing') AS processing, SUM(status = 'shipped') AS shipped,
      SUM(status = 'cancelled' OR paymentStatus = 'failed') AS cancelled,
      SUM(CASE WHEN status != 'cancelled' AND paymentStatus = 'paid' THEN totalAmount ELSE 0 END) AS revenue
      FROM orders`);
    const { total, pending, processing, shipped, cancelled, revenue } = res.rows[0];
    const value = { total: Number(total), pending: Number(pending), processing: Number(processing),
      shipped: Number(shipped), cancelled: Number(cancelled), revenue: Number(revenue) };
    if (revision === orderStatsRevision) orderStatsCache = { value, expiresAt: Date.now() + 30_000 };
    return value;
  },

  async getByVerifiedUser(uid: string): Promise<Order[]> {
    await ensureDbInitialized();
    const result = await client.execute({
      sql: `SELECT data FROM orders WHERE json_extract(data, '$.userId') = ?
        AND json_extract(data, '$.checkoutOwnerVerified') = 1 ORDER BY createdAt DESC`,
      args: [uid],
    });
    return result.rows.map((row) => JSON.parse(String(row.data)));
  },

  async getById(id: string): Promise<Order | null> {
    await ensureDbInitialized();
    const res = await client.execute({
      sql: 'SELECT data FROM orders WHERE id = ?',
      args: [id],
    });
    if (res.rows.length === 0) return null;
    return JSON.parse(res.rows[0].data as string);
  },

  async getByOrderNumber(orderNumber: string): Promise<Order | null> {
    await ensureDbInitialized();
    const cleanNum = (orderNumber || '').trim();
    const res = await client.execute({
      sql: 'SELECT data FROM orders WHERE orderNumber = ?',
      args: [cleanNum],
    });
    if (res.rows.length > 0) {
      return JSON.parse(res.rows[0].data as string);
    }
    const legacy = await client.execute({
      sql: "SELECT data FROM orders WHERE json_extract(data, '$.orderNumber') = ? LIMIT 1",
      args: [cleanNum],
    });
    return legacy.rows.length ? JSON.parse(String(legacy.rows[0].data)) : null;
  },

  async getByPaymentTransaction(provider: 'zarinpal' | 'nextpay', transactionId: string): Promise<Order | null> {
    await ensureDbInitialized();
    const result = await client.execute({
      sql: `SELECT data FROM orders
        WHERE json_extract(data, '$.paymentAttempt.provider') = ?
        AND json_extract(data, '$.paymentAttempt.transactionId') = ? LIMIT 2`,
      args: [provider, transactionId],
    });
    return result.rows.length === 1 ? JSON.parse(String(result.rows[0].data)) : null;
  },

  async changeOrder(orderId: string, change: (current: Order) => Order | null): Promise<Order | null> {
    await ensureDbInitialized();
    for (let attempt = 0; attempt < 3; attempt++) {
      const result = await client.execute({ sql: 'SELECT data FROM orders WHERE id = ?', args: [orderId] });
      if (!result.rows.length) return null;
      const before = String(result.rows[0].data);
      const updated = change(JSON.parse(before));
      if (!updated) return null;
      updated.updatedAt = new Date().toISOString();
      const write = await client.execute({
        sql: `UPDATE orders SET status = ?, paymentStatus = ?, postalTrackingCode = ?, data = ?, updatedAt = ?
          WHERE id = ? AND data = ?`,
        args: [updated.status, updated.paymentStatus, updated.postalTrackingCode || '',
          JSON.stringify(updated), updated.updatedAt, orderId, before],
      });
      if (write.rowsAffected === 1) {
        invalidateOrderStats();
        return updated;
      }
    }
    return null;
  },

  async getByUser(email?: string, phone?: string, userId?: string): Promise<Order[]> {
    const all = await this.getAll();
    const cleanReqPhone = normalizePhoneNumber(phone);
    const cleanReqEmail = (email || '').trim().toLowerCase();
    const cleanReqUid = (userId || '').trim();

    return all.filter((order) => {
      // 1. Direct user ID match
      if (cleanReqUid && order.userId && order.userId === cleanReqUid) {
        return true;
      }

      // 2. Email match (check customer.email, userEmail, or notes)
      const orderEmail = (
        order.customer?.email ||
        order.userEmail ||
        order.customer?.notes?.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] ||
        ''
      ).trim().toLowerCase();

      if (cleanReqEmail && orderEmail && orderEmail === cleanReqEmail) {
        return true;
      }

      // 3. Normalized Phone match
      const orderPhone = normalizePhoneNumber(order.customer?.phone);
      if (cleanReqPhone && orderPhone) {
        if (
          orderPhone === cleanReqPhone ||
          (orderPhone.length >= 10 && cleanReqPhone.length >= 10 && orderPhone.slice(-10) === cleanReqPhone.slice(-10))
        ) {
          return true;
        }
      }

      return false;
    });
  },

  async add(order: Order): Promise<Order> {
    const saved = await writeTransaction(async (tx) => {
      const existing = await tx.execute({ sql: 'SELECT data FROM orders WHERE id = ?', args: [order.id] });
      if (existing.rows.length) {
        const previous = JSON.parse(String(existing.rows[0].data)) as Order;
        if (previous.userId === order.userId && previous.guestCheckoutDigest === order.guestCheckoutDigest &&
            previous.checkoutRequestDigest === order.checkoutRequestDigest) return previous;
        throw new OrderWriteError('این شناسهٔ درخواست قبلاً استفاده شده است.', 409);
      }

      const newOrder = { ...order, updatedAt: new Date().toISOString() };
      const products = order.quoteRequired ? new Map<string, Product>() : await orderProducts(tx, order.items);
      if (!order.quoteRequired) {
        await priceOrder(tx, newOrder, products);
        await writeOrderStock(tx, newOrder.items, products, -1);
      }

      await tx.execute({
        sql: `INSERT INTO orders
          (id, orderNumber, status, paymentStatus, totalAmount, customerName, customerPhone,
           customerEmail, postalTrackingCode, data, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [newOrder.id, newOrder.orderNumber, newOrder.status, newOrder.paymentStatus, newOrder.totalAmount,
          newOrder.customer.name, newOrder.customer.phone, newOrder.customer.email ?? '',
          newOrder.postalTrackingCode ?? '', JSON.stringify(newOrder), newOrder.createdAt, newOrder.updatedAt],
      });
      return newOrder;
    });
    invalidateOrderStats();
    if (!saved.quoteRequired) invalidateProductsCache();
    return saved;
  },

  async updateStatus(orderId: string, status: OrderStatus, postalTrackingCode?: string): Promise<Order | null> {
    const updated = await writeTransaction(async (tx) => {
      const result = await tx.execute({ sql: 'SELECT data FROM orders WHERE id = ?', args: [orderId] });
      if (!result.rows.length) return null;
      const order = JSON.parse(String(result.rows[0].data)) as Order;
      if (status === 'cancelled' && order.paymentAttempt && order.paymentStatus === 'pending_verification') return null;
      if (!order.quoteRequired && (order.status === 'cancelled') !== (status === 'cancelled')) {
        await writeOrderStock(tx, order.items, await orderProducts(tx, order.items), status === 'cancelled' ? 1 : -1);
      }
      order.status = status;
      order.postalTrackingCode = postalTrackingCode ?? order.postalTrackingCode;
      order.updatedAt = new Date().toISOString();
      await tx.execute({
        sql: 'UPDATE orders SET status = ?, postalTrackingCode = ?, data = ?, updatedAt = ? WHERE id = ?',
        args: [order.status, order.postalTrackingCode ?? '', JSON.stringify(order), order.updatedAt, orderId],
      });
      return order;
    });
    if (updated) {
      invalidateOrderStats();
      invalidateProductsCache();
    }
    return updated;
  },

  async updatePayment(orderId: string, paymentStatus: Order['paymentStatus']): Promise<Order | null> {
    return this.changeOrder(orderId, (current) => {
      if (current.paymentAttempt || current.quoteRequired || current.status === 'cancelled' ||
          (current.paymentStatus === 'paid' && paymentStatus !== 'paid')) return null;
      return {
        ...current, paymentStatus,
        status: current.status === 'pending' && paymentStatus === 'paid' ? 'processing' : current.status,
      };
    });
  },

  async delete(orderId: string): Promise<boolean> {
    const deleted = await writeTransaction(async (tx) => {
      const result = await tx.execute({ sql: 'SELECT data FROM orders WHERE id = ?', args: [orderId] });
      if (!result.rows.length) return false;
      const order = JSON.parse(String(result.rows[0].data)) as Order;
      if (!order.quoteRequired && order.status !== 'cancelled') {
        await writeOrderStock(tx, order.items, await orderProducts(tx, order.items), 1);
      }
      const write = await tx.execute({ sql: 'DELETE FROM orders WHERE id = ?', args: [orderId] });
      return write.rowsAffected === 1;
    });
    if (deleted) {
      invalidateOrderStats();
      invalidateProductsCache();
    }
    return deleted;
  },
};

// -------------------------------------------------------------
// USERS REPOSITORY
// -------------------------------------------------------------
export const UsersDb = {
  async getByUid(uid: string): Promise<(UserProfile & { passwordHash?: string; salt?: string; verificationCode?: string }) | null> {
    await ensureDbInitialized();
    const res = await client.execute({
      sql: 'SELECT data, passwordHash, salt, verificationCode, emailVerified FROM users WHERE uid = ?',
      args: [uid],
    });
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const profile = JSON.parse(row.data as string) as UserProfile;
    return {
      ...profile,
      emailVerified: Boolean(row.emailVerified ?? profile.emailVerified),
      passwordHash: row.passwordHash as string | undefined,
      salt: row.salt as string | undefined,
      verificationCode: (row.verificationCode || profile.verificationCode) as string | undefined,
    };
  },

  async getByEmail(email: string): Promise<(UserProfile & { passwordHash?: string; salt?: string; verificationCode?: string }) | null> {
    await ensureDbInitialized();
    const cleanEmail = email.trim().toLowerCase();
    const res = await client.execute({
      sql: 'SELECT data, passwordHash, salt, verificationCode FROM users WHERE email = ?',
      args: [cleanEmail],
    });
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const profile = JSON.parse(row.data as string) as UserProfile;
    return {
      ...profile,
      passwordHash: row.passwordHash as string | undefined,
      salt: row.salt as string | undefined,
      verificationCode: row.verificationCode as string | undefined,
    };
  },

  async upsert(user: UserProfile, passwordHash?: string, salt?: string): Promise<UserProfile> {
    await ensureDbInitialized();
    const now = new Date().toISOString();
    const { passwordHash: _hash, salt: _salt, verificationCode: _verification, ...profile } =
      user as UserProfile & { passwordHash?: string; salt?: string };
    const cleanUser: UserProfile = {
      ...profile,
      uid: user.uid || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      updatedAt: now,
      createdAt: user.createdAt || now,
    };

    await client.execute({
      sql: `
        INSERT INTO users (uid, email, phoneNumber, displayName, passwordHash, salt, verificationCode, emailVerified, role, data, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(uid) DO UPDATE SET
          email = excluded.email,
          phoneNumber = excluded.phoneNumber,
          displayName = excluded.displayName,
          passwordHash = COALESCE(excluded.passwordHash, users.passwordHash),
          salt = COALESCE(excluded.salt, users.salt),
          verificationCode = NULL,
          emailVerified = excluded.emailVerified,
          role = excluded.role,
          data = excluded.data,
          updatedAt = excluded.updatedAt
      `,
      args: [
        cleanUser.uid,
        cleanUser.email?.trim().toLowerCase() || null,
        cleanUser.phoneNumber || '',
        cleanUser.displayName || '',
        passwordHash || null,
        salt || null,
        null,
        cleanUser.emailVerified ? 1 : 0,
        cleanUser.role || 'customer',
        JSON.stringify(cleanUser),
        cleanUser.createdAt,
        cleanUser.updatedAt,
      ],
    });

    return cleanUser;
  },

  async update(uid: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const current = await this.getByUid(uid);
    if (!current) return null;

    const merged: UserProfile = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.upsert(merged, current.passwordHash, current.salt);
  },

  async deleteByEmail(email: string): Promise<boolean> {
    await ensureDbInitialized();
    const cleanEmail = email.trim().toLowerCase();
    const res = await client.execute({
      sql: 'DELETE FROM users WHERE email = ?',
      args: [cleanEmail],
    });
    return res.rowsAffected > 0;
  },

  async deleteByUid(uid: string): Promise<boolean> {
    await ensureDbInitialized();
    const res = await client.execute({
      sql: 'DELETE FROM users WHERE uid = ?',
      args: [uid],
    });
    return res.rowsAffected > 0;
  },
};

// -------------------------------------------------------------
// ADMINS REPOSITORY
// -------------------------------------------------------------
export const AdminDb = {
  async getCredentials(): Promise<{ username: string; passwordHash: string; salt: string; updatedAt: string } | null> {
    if (adminCredsCache && Date.now() < adminCredsCache.expiresAt) {
      return adminCredsCache.data;
    }
    const envUser = (process.env.ADMIN_USERNAME || process.env.ADMIN_USER || '').trim();
    const envPass = (process.env.ADMIN_PASSWORD || process.env.ADMIN_PASS || '').trim();

    try {
      await ensureDbInitialized();
      const res = await client.execute('SELECT username, passwordHash, salt, updatedAt FROM admins LIMIT 1');
      if (res.rows.length > 0) {
        const row = res.rows[0];
        const result = {
          username: envUser || (row.username as string),
          passwordHash: row.passwordHash as string,
          salt: row.salt as string,
          updatedAt: row.updatedAt as string,
        };
        adminCredsCache = { data: result, expiresAt: Date.now() + ADMIN_CACHE_TTL_MS };
        return result;
      }
    } catch (err) {
      console.warn('[AdminDb.getCredentials] Database unavailable, falling back to environment credentials:', err);
    }

    if (!envPass) {
      return null;
    }
    const fallbackUser = envUser || 'admin';
    const salt = generateSalt(16);
    const passwordHash = hashWithSalt(envPass, salt, 'admin');
    const fallbackCreds = {
      username: fallbackUser,
      passwordHash,
      salt,
      updatedAt: new Date().toISOString(),
    };
    adminCredsCache = { data: fallbackCreds, expiresAt: Date.now() + ADMIN_CACHE_TTL_MS };
    return fallbackCreds;
  },

  async updateCredentials(newUsername: string, newPasswordHash: string, newSalt: string): Promise<void> {
    adminCredsCache = null;
    try {
      await ensureDbInitialized();
      const now = new Date().toISOString();
      const res = await client.execute({
        sql: `
          UPDATE admins
          SET username = ?, passwordHash = ?, salt = ?, updatedAt = ?
          WHERE id = 'admin_primary'
        `,
        args: [newUsername.trim().toLowerCase(), newPasswordHash, newSalt, now],
      });

      if (res.rowsAffected === 0) {
        await client.execute({
          sql: `
            INSERT INTO admins (id, username, passwordHash, salt, updatedAt)
            VALUES ('admin_primary', ?, ?, ?, ?)
          `,
          args: [newUsername.trim().toLowerCase(), newPasswordHash, newSalt, now],
        });
      }
    } catch (err) {
      console.warn('[AdminDb.updateCredentials] Ignored DB write failure during quota block:', err);
    }
  },
};

// -------------------------------------------------------------
// SETTINGS REPOSITORY (BRANDS, ETC.)
// -------------------------------------------------------------
export const SettingsDb = {
  async get<T>(key: string, defaultValue: T): Promise<T> {
    await ensureDbInitialized();
    const res = await client.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: [key] });
    return res.rows.length ? (JSON.parse(String(res.rows[0].value)) ?? defaultValue) : defaultValue;
  },

  async set<T>(key: string, value: T): Promise<void> {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error('A setting value is required.');
    await ensureDbInitialized();
    await client.execute({
      sql: `INSERT INTO settings (key, value, updatedAt) VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
      args: [key, serialized, new Date().toISOString()],
    });
  },
};

// -------------------------------------------------------------
// PERSISTENT SECURITY REPOSITORY (OTP, RATE LIMITS, REVOKED TOKENS)
// Solves Vercel serverless ephemeral memory drop & lockout bypass
// -------------------------------------------------------------
export const SecurityDb = {
  async issueChallenge(key: string, value: string, lifetime: number): Promise<boolean> {
    await ensureDbInitialized();
    const now = Date.now();
    const result = await client.execute({
      sql: `INSERT INTO security_store (key, value, attempts, expiresAt, updatedAt) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value=excluded.value, attempts=0,
          expiresAt=excluded.expiresAt, updatedAt=excluded.updatedAt
        WHERE security_store.updatedAt <= ?`,
      args: [key, value, 0, now + lifetime, now, now - 60000],
    });
    return result.rowsAffected === 1;
  },

  async finishChallenge(key: string, value: string): Promise<void> {
    await client.execute({ sql: 'DELETE FROM security_store WHERE key = ? AND value = ?', args: [key, value] });
  },

  async consumeChallenge(key: string, value: string): Promise<boolean> {
    await ensureDbInitialized();
    const now = Date.now();
    const consumed = await client.execute({
      sql: 'DELETE FROM security_store WHERE key = ? AND value = ? AND expiresAt > ? AND attempts < 5',
      args: [key, value, now],
    });
    if (consumed.rowsAffected === 1) return true;
    await client.execute({
      sql: 'UPDATE security_store SET attempts = attempts + 1 WHERE key = ? AND expiresAt > ? AND attempts < 5 AND value <> ?',
      args: [key, now, value],
    });
    return false;
  },

  async set(key: string, value: string, expiresInMs: number, attempts = 0): Promise<void> {
    await ensureDbInitialized();
    const now = Date.now();
    const expiresAt = now + expiresInMs;
    await client.execute({
      sql: `INSERT OR REPLACE INTO security_store (key, value, attempts, expiresAt, updatedAt)
            VALUES (?, ?, ?, ?, ?)`,
      args: [key, value, attempts, expiresAt, now],
    });
  },

  async get(key: string): Promise<{ value: string; attempts: number; expiresAt: number } | null> {
    await ensureDbInitialized();
    const res = await client.execute({
      sql: 'SELECT value, attempts, expiresAt FROM security_store WHERE key = ?',
      args: [key],
    });
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const expiresAt = Number(row.expiresAt);
    if (Date.now() > expiresAt) {
      // Lazy cleanup of expired key
      await this.delete(key);
      return null;
    }
    return {
      value: String(row.value),
      attempts: Number(row.attempts || 0),
      expiresAt,
    };
  },

  async incrementAttempts(key: string): Promise<number> {
    await ensureDbInitialized();
    const current = await this.get(key);
    if (!current) return 0;
    const newAttempts = current.attempts + 1;
    await client.execute({
      sql: 'UPDATE security_store SET attempts = ?, updatedAt = ? WHERE key = ?',
      args: [newAttempts, Date.now(), key],
    });
    return newAttempts;
  },

  async delete(key: string): Promise<void> {
    try {
      await client.execute({
        sql: 'DELETE FROM security_store WHERE key = ?',
        args: [key],
      });
    } catch {}
  },

  // Save OTP with cryptographic hash and automatic 2-minute expiration
  async saveOtp(phone: string, code: string, expiresInMs = 120000): Promise<void> {
    const key = `otp:${normalizePhoneNumber(phone)}`;
    const hash = hashWithSalt(code, 'vara_otp_salt');
    await this.set(key, hash, expiresInMs, 0);
  },

  // Verify OTP atomically in database
  async verifyOtp(
    phone: string,
    inputCode: string
  ): Promise<{ valid: boolean; reason?: string; remainingAttempts?: number }> {
    const cleanPhone = normalizePhoneNumber(phone);
    const key = `otp:${cleanPhone}`;
    const record = await this.get(key);

    if (!record) {
      return { valid: false, reason: 'کد تایید منقضی گردیده است یا یافت نشد. لطفاً مجدداً کد دریافت نمایید.' };
    }

    if (record.attempts >= 5) {
      await this.delete(key);
      return { valid: false, reason: 'به دلیل ۵ بار تلاش ناموفق، کد تایید باطل شد. لطفاً کد جدید دریافت نمایید.' };
    }

    const inputHash = hashWithSalt(inputCode.trim(), 'vara_otp_salt');
    const isMatch = crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(record.value));

    if (isMatch) {
      await this.delete(key);
      return { valid: true };
    } else {
      const attempts = await this.incrementAttempts(key);
      const remaining = Math.max(0, 5 - attempts);
      return {
        valid: false,
        reason: remaining > 0 ? `کد تایید نادرست است. (${remaining} بار تلاش باقی مانده)` : 'تعداد دفعات مجاز به پایان رسید.',
        remainingAttempts: remaining,
      };
    }
  },

  // Persistent Serverless Rate Limiter (shared across all Vercel function containers)
  async checkRateLimit(
    scope: string,
    identifier: string,
    ip: string,
    maxAttempts = 5
  ): Promise<{
    isLocked: boolean;
    remainingSeconds: number;
    remainingAttempts: number;
  }> {
    const cleanId = (identifier || 'anonymous').trim().toLowerCase();
    const cleanIp = (ip || '127.0.0.1').trim();
    const idKey = `rl:${scope}:id:${cleanId}`;
    const ipKey = `rl:${scope}:ip:${cleanIp}`;

    const idRecord = await this.get(idKey);
    const ipRecord = await this.get(ipKey);

    const now = Date.now();
    for (const rec of [idRecord, ipRecord]) {
      if (rec && rec.attempts >= maxAttempts && rec.expiresAt > now) {
        const remainingSeconds = Math.ceil((rec.expiresAt - now) / 1000);
        return { isLocked: true, remainingSeconds, remainingAttempts: 0 };
      }
    }

    const currentAttempts = Math.max(idRecord?.attempts || 0, ipRecord?.attempts || 0);
    return {
      isLocked: false,
      remainingSeconds: 0,
      remainingAttempts: Math.max(0, maxAttempts - currentAttempts),
    };
  },

  async recordFailedAttempt(
    scope: string,
    identifier: string,
    ip: string,
    maxAttempts = 5,
    lockoutMs = 15 * 60 * 1000
  ): Promise<{
    isLocked: boolean;
    remainingSeconds: number;
    remainingAttempts: number;
  }> {
    const cleanId = (identifier || 'anonymous').trim().toLowerCase();
    const cleanIp = (ip || '127.0.0.1').trim();
    const idKey = `rl:${scope}:id:${cleanId}`;
    const ipKey = `rl:${scope}:ip:${cleanIp}`;

    const idRecord = await this.get(idKey);
    const ipRecord = await this.get(ipKey);

    const nextAttempts = Math.max(idRecord?.attempts || 0, ipRecord?.attempts || 0) + 1;
    const isLocked = nextAttempts >= maxAttempts;
    const windowMs = isLocked ? lockoutMs : 15 * 60 * 1000;

    await this.set(idKey, 'attempt', windowMs, nextAttempts);
    await this.set(ipKey, 'attempt', windowMs, nextAttempts);

    return {
      isLocked,
      remainingSeconds: isLocked ? Math.ceil(lockoutMs / 1000) : 0,
      remainingAttempts: Math.max(0, maxAttempts - nextAttempts),
    };
  },

  async clearRateLimit(scope: string, identifier: string, ip: string): Promise<void> {
    const cleanId = (identifier || 'anonymous').trim().toLowerCase();
    const cleanIp = (ip || '127.0.0.1').trim();
    await this.delete(`rl:${scope}:id:${cleanId}`);
    await this.delete(`rl:${scope}:ip:${cleanIp}`);
  },

  async revokeToken(token: string, expiresInMs = 24 * 60 * 60 * 1000): Promise<void> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await this.set(`revoked:${tokenHash}`, 'true', expiresInMs);
  },

  async isTokenRevoked(token: string): Promise<boolean> {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const rec = await this.get(`revoked:${tokenHash}`);
    return Boolean(rec);
  },
};
