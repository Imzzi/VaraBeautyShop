import type { Express, Request } from 'express';
import { GoogleAuth } from 'google-auth-library';
import { AnalyticsDb, AnalyticsEventRecord, OrdersDb, SettingsDb } from './serverDb';
import { requireAdminAuth } from './serverDbRouter';
import { getClientIp } from './serverSecurity';

export const ALLOWED_ANALYTICS_EVENTS = [
  'page_view',
  'view_item',
  'add_to_cart',
  'remove_from_cart',
  'begin_checkout',
  'purchase',
  'search',
  'calculator_estimate',
] as const;

export type AllowedAnalyticsEvent = (typeof ALLOWED_ANALYTICS_EVENTS)[number];

export interface AnalyticsDashboardSummary {
  activeUsersNow: number;
  activeUsers: number;
  sessions: number;
  pageViews: number;
  conversions: number;
  revenueToman: number;
}

export interface AnalyticsDailyPoint {
  date: string;
  labelFa: string;
  pageViews: number;
  users: number;
}

export interface AnalyticsDashboardReport {
  range: '7d' | '14d' | '28d';
  rangeDays: number;
  source: 'ga4' | 'first-party';
  ga4Configured: boolean;
  ga4Error?: string;
  generatedAt: string;
  summary: AnalyticsDashboardSummary;
  dailySeries: AnalyticsDailyPoint[];
  funnel: Record<AllowedAnalyticsEvent, number>;
  topPages: Array<{ path: string; title: string; views: number }>;
  topSources: Array<{ source: string; sessions: number }>;
  topSearches: Array<{ term: string; count: number }>;
  topProducts: Array<{ itemId: string; itemName: string; views: number; adds: number }>;
}

const COLLECT_WINDOW_MS = 60 * 1000;
const COLLECT_MAX_PER_WINDOW = 120;
const collectRateMap = new Map<string, { count: number; resetAt: number }>();

const GA4_CACHE_TTL_MS = 60 * 1000;
const ga4ReportCache = new Map<string, { expiresAt: number; report: AnalyticsDashboardReport }>();

export function normalizeGa4PropertyId(raw: unknown): string | null {
  if (typeof raw !== 'string' && typeof raw !== 'number') return null;
  const cleaned = String(raw)
    .trim()
    .replace(/^properties\//i, '')
    .trim();
  return /^\d{5,15}$/.test(cleaned) ? cleaned : null;
}

function sanitizeText(raw: unknown, maxLen: number): string {
  return String(raw || '')
    .replace(/[\x00-\x1F\x7F<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

function parseRangeParam(raw: unknown): { range: '7d' | '14d' | '28d'; rangeDays: number } {
  const s = String(raw || '7d').toLowerCase();
  if (s === '14d') return { range: '14d', rangeDays: 14 };
  if (s === '28d' || s === '30d') return { range: '28d', rangeDays: 28 };
  return { range: '7d', rangeDays: 7 };
}

function normalizeTrafficSource(referrerRaw: unknown, explicitSourceRaw?: unknown): string {
  const explicit = sanitizeText(explicitSourceRaw, 80).toLowerCase();
  const ref = sanitizeText(referrerRaw, 300).toLowerCase();

  let host = explicit;
  if (!host && ref) {
    try {
      host = new URL(ref).hostname.replace(/^www\./i, '').toLowerCase();
    } catch {
      host = ref;
    }
  }

  if (!host || host === 'varabeauty.ir' || host.endsWith('.varabeauty.ir') || host === 'localhost' || host === '127.0.0.1') {
    return 'ورود مستقیم (Direct)';
  }
  if (host.includes('google.')) return 'گوگل (Organic)';
  if (host.includes('instagram.com') || host.includes('l.instagram.com')) return 'اینستاگرام';
  if (host.includes('torob.com')) return 'ترب (Torob)';
  if (host.includes('t.me') || host.includes('telegram')) return 'تلگرام';
  if (host.includes('bing.com') || host.includes('yandex.') || host.includes('duckduckgo.com')) {
    return `موتور جستجو (${host})`;
  }
  return host.slice(0, 60);
}

function formatDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function formatDayLabelFa(dateStr: string): string {
  try {
    const dt = new Date(`${dateStr}T12:00:00Z`);
    return new Intl.DateTimeFormat('fa-IR', { month: 'short', day: 'numeric' }).format(dt);
  } catch {
    return dateStr.slice(5);
  }
}

function getEmptyFunnel(): Record<AllowedAnalyticsEvent, number> {
  return {
    page_view: 0,
    view_item: 0,
    add_to_cart: 0,
    remove_from_cart: 0,
    begin_checkout: 0,
    purchase: 0,
    search: 0,
    calculator_estimate: 0,
  };
}

function buildFirstPartyAggregates(
  events: AnalyticsEventRecord[],
  orders: Array<{ status?: string; paymentStatus?: string; totalAmount?: number; createdAt?: string }>,
  range: '7d' | '14d' | '28d',
  rangeDays: number,
  nowMs = Date.now()
): AnalyticsDashboardReport {
  const sinceMs = nowMs - (rangeDays - 1) * 24 * 60 * 60 * 1000;
  const sinceDayStart = new Date(sinceMs);
  sinceDayStart.setUTCHours(0, 0, 0, 0);
  const sinceIso = sinceDayStart.toISOString();
  const activeCutoffIso = new Date(nowMs - 30 * 60 * 1000).toISOString();

  const visitorsAll = new Set<string>();
  const sessionsAll = new Set<string>();
  const activeNowSessions = new Set<string>();
  const funnel = getEmptyFunnel();

  const dailyBuckets = new Map<string, { pageViews: number; users: Set<string> }>();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(nowMs - i * 24 * 60 * 60 * 1000);
    dailyBuckets.set(formatDayKey(d), { pageViews: 0, users: new Set<string>() });
  }

  const pagesMap = new Map<string, { title: string; views: number }>();
  const sourcesMap = new Map<string, Set<string>>();
  const searchesMap = new Map<string, number>();
  const productsMap = new Map<string, { itemName: string; views: number; adds: number }>();
  let trackedRevenue = 0;

  for (const ev of events) {
    const createdAt = String(ev.createdAt || '');
    if (!createdAt || createdAt < sinceIso) continue;

    if (ev.visitorId) visitorsAll.add(ev.visitorId);
    if (ev.sessionId) sessionsAll.add(ev.sessionId);
    if (createdAt >= activeCutoffIso && (ev.sessionId || ev.visitorId)) {
      activeNowSessions.add(ev.sessionId || ev.visitorId);
    }

    const dayKey = createdAt.slice(0, 10);
    const bucket = dailyBuckets.get(dayKey);
    if (bucket && ev.visitorId) {
      bucket.users.add(ev.visitorId);
    }

    const name = ev.eventName as AllowedAnalyticsEvent;
    if (name in funnel) {
      funnel[name]++;
    }

    if (ev.eventName === 'page_view') {
      if (bucket) bucket.pageViews++;
      const cleanPath = ev.pagePath || '/';
      const existingPage = pagesMap.get(cleanPath) || { title: '', views: 0 };
      existingPage.views++;
      if (ev.pageTitle) existingPage.title = ev.pageTitle;
      pagesMap.set(cleanPath, existingPage);
    }

    const src = ev.source || 'ورود مستقیم (Direct)';
    if (!sourcesMap.has(src)) sourcesMap.set(src, new Set<string>());
    if (ev.sessionId || ev.visitorId) {
      sourcesMap.get(src)!.add(ev.sessionId || ev.visitorId);
    }

    if (ev.eventName === 'search' && ev.searchTerm) {
      const term = ev.searchTerm.trim();
      if (term) searchesMap.set(term, (searchesMap.get(term) || 0) + 1);
    }

    if ((ev.eventName === 'view_item' || ev.eventName === 'add_to_cart') && ev.itemId) {
      const entry = productsMap.get(ev.itemId) || {
        itemName: ev.itemName || ev.itemId,
        views: 0,
        adds: 0,
      };
      if (ev.itemName) entry.itemName = ev.itemName;
      if (ev.eventName === 'view_item') entry.views++;
      if (ev.eventName === 'add_to_cart') entry.adds++;
      productsMap.set(ev.itemId, entry);
    }

    if (ev.eventName === 'purchase') {
      trackedRevenue += Math.max(0, Number(ev.valueToman) || 0);
    }
  }

  // Merge verified paid/valid orders from OrdersDb so conversions remain exact even after payment redirects
  let paidOrdersCount = 0;
  let paidOrdersRevenue = 0;
  for (const ord of orders) {
    if (!ord?.createdAt || ord.createdAt < sinceIso) continue;
    if (ord.status === 'cancelled') continue;
    if (ord.paymentStatus === 'paid' || ord.status === 'delivered' || ord.status === 'shipped') {
      paidOrdersCount++;
      paidOrdersRevenue += Math.max(0, Number(ord.totalAmount) || 0);
    }
  }

  const conversions = Math.max(funnel.purchase, paidOrdersCount);
  funnel.purchase = conversions;
  const revenueToman = Math.max(trackedRevenue, paidOrdersRevenue);

  const dailySeries: AnalyticsDailyPoint[] = Array.from(dailyBuckets.entries()).map(([date, info]) => ({
    date,
    labelFa: formatDayLabelFa(date),
    pageViews: info.pageViews,
    users: info.users.size,
  }));

  const topPages = Array.from(pagesMap.entries())
    .map(([path, info]) => ({ path, title: info.title, views: info.views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const topSources = Array.from(sourcesMap.entries())
    .map(([source, set]) => ({ source, sessions: set.size }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 6);

  const topSearches = Array.from(searchesMap.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topProducts = Array.from(productsMap.entries())
    .map(([itemId, info]) => ({ itemId, itemName: info.itemName, views: info.views, adds: info.adds }))
    .sort((a, b) => b.views + b.adds * 2 - (a.views + a.adds * 2))
    .slice(0, 8);

  return {
    range,
    rangeDays,
    source: 'first-party',
    ga4Configured: false,
    generatedAt: new Date(nowMs).toISOString(),
    summary: {
      activeUsersNow: activeNowSessions.size,
      activeUsers: visitorsAll.size,
      sessions: sessionsAll.size,
      pageViews: funnel.page_view,
      conversions,
      revenueToman,
    },
    dailySeries,
    funnel,
    topPages,
    topSources,
    topSearches,
    topProducts,
  };
}

function getGa4CredentialsFromEnv(): Record<string, any> | null {
  const rawJson = (process.env.GA4_SERVICE_ACCOUNT_JSON || '').trim();
  if (rawJson) {
    try {
      const parsed = rawJson.startsWith('{')
        ? JSON.parse(rawJson)
        : JSON.parse(Buffer.from(rawJson, 'base64').toString('utf8'));
      if (parsed?.client_email && parsed?.private_key) return parsed;
    } catch {
      // Ignore malformed JSON and check split env vars
    }
  }
  const clientEmail = (process.env.GA4_CLIENT_EMAIL || '').trim();
  const privateKey = (process.env.GA4_PRIVATE_KEY || '').replace(/\\n/g, '\n').trim();
  if (clientEmail && privateKey) {
    return { client_email: clientEmail, private_key: privateKey };
  }
  return null;
}

async function fetchGa4ReportFromApi(
  propertyId: string,
  range: '7d' | '14d' | '28d',
  rangeDays: number,
  firstPartyFallback: AnalyticsDashboardReport
): Promise<AnalyticsDashboardReport> {
  const cacheKey = `${propertyId}:${range}`;
  const cached = ga4ReportCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      ...cached.report,
      topSearches:
        cached.report.topSearches.length > 0
          ? cached.report.topSearches
          : firstPartyFallback.topSearches,
      topProducts:
        cached.report.topProducts.length > 0
          ? cached.report.topProducts
          : firstPartyFallback.topProducts,
    };
  }

  const credentials = getGa4CredentialsFromEnv();
  if (!credentials) {
    throw new Error('GA4_SERVICE_ACCOUNT_JSON is not configured');
  }

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  const token = await auth.getAccessToken();
  if (!token) throw new Error('Failed to acquire Google Analytics OAuth access token');

  const baseUrl = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const [realtimeRes, batchRes] = await Promise.all([
    fetch(`${baseUrl}:runRealtimeReport`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        metrics: [{ name: 'activeUsers' }],
      }),
    }),
    fetch(`${baseUrl}:batchRunReports`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        requests: [
          {
            dateRanges: [{ startDate: `${rangeDays - 1}daysAgo`, endDate: 'today' }],
            metrics: [
              { name: 'activeUsers' },
              { name: 'sessions' },
              { name: 'screenPageViews' },
              { name: 'ecommercePurchases' },
              { name: 'purchaseRevenue' },
            ],
          },
          {
            dateRanges: [{ startDate: `${rangeDays - 1}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
            orderBys: [{ dimension: { dimensionName: 'date' } }],
          },
          {
            dateRanges: [{ startDate: `${rangeDays - 1}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
            limit: 8,
          },
          {
            dateRanges: [{ startDate: `${rangeDays - 1}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'sessionSourceMedium' }],
            metrics: [{ name: 'sessions' }],
            orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
            limit: 6,
          },
          {
            dateRanges: [{ startDate: `${rangeDays - 1}daysAgo`, endDate: 'today' }],
            dimensions: [{ name: 'eventName' }],
            metrics: [{ name: 'eventCount' }],
            limit: 25,
          },
        ],
      }),
    }),
  ]);

  if (!batchRes.ok) {
    const errText = await batchRes.text().catch(() => '');
    throw new Error(`GA4 batchRunReports HTTP ${batchRes.status}: ${errText.slice(0, 160)}`);
  }

  const realtimeJson: any = realtimeRes.ok ? await realtimeRes.json().catch(() => ({})) : {};
  const batchJson: any = await batchRes.json();
  const reports = Array.isArray(batchJson?.reports) ? batchJson.reports : [];

  const activeUsersNow = Number(realtimeJson?.rows?.[0]?.metricValues?.[0]?.value || 0);
  const overviewMetrics = reports[0]?.rows?.[0]?.metricValues || [];
  const activeUsers = Number(overviewMetrics[0]?.value || 0);
  const sessions = Number(overviewMetrics[1]?.value || 0);
  const pageViews = Number(overviewMetrics[2]?.value || 0);
  const conversions = Number(overviewMetrics[3]?.value || 0);
  const revenueIrrOrBase = Number(overviewMetrics[4]?.value || 0);
  const revenueToman = Math.round(revenueIrrOrBase / 10);

  const ga4DailyMap = new Map<string, { pageViews: number; users: number }>();
  for (const row of reports[1]?.rows || []) {
    const yyyymmdd = String(row?.dimensionValues?.[0]?.value || '');
    if (yyyymmdd.length === 8) {
      const iso = `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
      ga4DailyMap.set(iso, {
        pageViews: Number(row?.metricValues?.[0]?.value || 0),
        users: Number(row?.metricValues?.[1]?.value || 0),
      });
    }
  }

  const dailySeries = firstPartyFallback.dailySeries.map((slot) => {
    const hit = ga4DailyMap.get(slot.date);
    return {
      date: slot.date,
      labelFa: slot.labelFa,
      pageViews: hit ? hit.pageViews : 0,
      users: hit ? hit.users : 0,
    };
  });

  const topPages = (reports[2]?.rows || []).map((row: any) => ({
    path: String(row?.dimensionValues?.[0]?.value || '/'),
    title: String(row?.dimensionValues?.[1]?.value || ''),
    views: Number(row?.metricValues?.[0]?.value || 0),
  }));

  const topSources = (reports[3]?.rows || []).map((row: any) => ({
    source: String(row?.dimensionValues?.[0]?.value || '(direct) / (none)'),
    sessions: Number(row?.metricValues?.[0]?.value || 0),
  }));

  const funnel = getEmptyFunnel();
  for (const row of reports[4]?.rows || []) {
    const evName = String(row?.dimensionValues?.[0]?.value || '') as AllowedAnalyticsEvent;
    if (evName in funnel) {
      funnel[evName] = Number(row?.metricValues?.[0]?.value || 0);
    }
  }

  const ga4Report: AnalyticsDashboardReport = {
    range,
    rangeDays,
    source: 'ga4',
    ga4Configured: true,
    generatedAt: new Date().toISOString(),
    summary: {
      activeUsersNow,
      activeUsers,
      sessions,
      pageViews,
      conversions,
      revenueToman,
    },
    dailySeries,
    funnel,
    topPages,
    topSources,
    topSearches: firstPartyFallback.topSearches,
    topProducts: firstPartyFallback.topProducts,
  };

  ga4ReportCache.set(cacheKey, {
    expiresAt: Date.now() + GA4_CACHE_TTL_MS,
    report: ga4Report,
  });

  return ga4Report;
}

export function registerAnalyticsRoutes(app: Express): void {
  // Public first-party telemetry collector (strictly rate-limited & schema-validated)
  app.post('/api/analytics/collect', async (req: Request, res) => {
    try {
      const ip = getClientIp(req);
      const now = Date.now();
      const bucket = collectRateMap.get(ip);
      if (bucket && bucket.resetAt > now) {
        if (bucket.count >= COLLECT_MAX_PER_WINDOW) {
          return res.status(204).end();
        }
        bucket.count++;
      } else {
        collectRateMap.set(ip, { count: 1, resetAt: now + COLLECT_WINDOW_MS });
        if (collectRateMap.size > 5000) {
          for (const [k, v] of collectRateMap.entries()) {
            if (v.resetAt <= now) collectRateMap.delete(k);
          }
        }
      }

      const body = req.body || {};
      const eventName = sanitizeText(body.eventName, 40) as AllowedAnalyticsEvent;
      if (!ALLOWED_ANALYTICS_EVENTS.includes(eventName)) {
        return res.status(400).json({ success: false, error: 'Invalid eventName' });
      }

      const sessionId = sanitizeText(body.sessionId, 64) || 'anon-session';
      const visitorId = sanitizeText(body.visitorId, 64) || sessionId;
      const pagePath = sanitizeText(body.pagePath, 240) || '/';
      const pageTitle = sanitizeText(body.pageTitle, 160);
      const source = normalizeTrafficSource(body.referrer, body.source);
      const searchTerm = sanitizeText(body.searchTerm, 100);
      const itemId = sanitizeText(body.itemId, 100);
      const itemName = sanitizeText(body.itemName, 160);
      const valueToman = Math.max(0, Math.round(Number(body.valueToman) || 0));

      await AnalyticsDb.recordEvent({
        eventName,
        sessionId,
        visitorId,
        pagePath,
        pageTitle,
        source,
        searchTerm,
        itemId,
        itemName,
        valueToman,
      });

      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('[Analytics Collect] Error:', err?.message || err);
      return res.status(500).json({ success: false, error: 'Analytics collect failed' });
    }
  });

  // Protected Admin Analytics Dashboard endpoint (GA4 Data API + First-Party Realtime Fallback)
  app.get('/api/admin/analytics/report', requireAdminAuth, async (req: Request, res) => {
    try {
      const { range, rangeDays } = parseRangeParam(req.query.range);
      const preferredSource = String(req.query.source || 'auto').toLowerCase();

      const nowMs = Date.now();
      const sinceDayStart = new Date(nowMs - (rangeDays - 1) * 24 * 60 * 60 * 1000);
      sinceDayStart.setUTCHours(0, 0, 0, 0);

      const [events, orders, analyticsSettings] = await Promise.all([
        AnalyticsDb.getEventsSince(sinceDayStart.toISOString()),
        OrdersDb.getAll(),
        SettingsDb.get<{ gaPropertyId?: string }>('analytics_config', {}),
      ]);

      const firstParty = buildFirstPartyAggregates(events, orders, range, rangeDays, nowMs);

      const propertyId = normalizeGa4PropertyId(
        process.env.GA4_PROPERTY_ID || analyticsSettings?.gaPropertyId
      );
      const hasGa4Creds = Boolean(propertyId && getGa4CredentialsFromEnv());
      firstParty.ga4Configured = hasGa4Creds;

      if (preferredSource !== 'site' && hasGa4Creds && propertyId) {
        try {
          const ga4Report = await fetchGa4ReportFromApi(propertyId, range, rangeDays, firstParty);
          return res.json({ success: true, report: ga4Report });
        } catch (ga4Err: any) {
          firstParty.ga4Error = String(ga4Err?.message || 'GA4 API unavailable');
        }
      }

      return res.json({ success: true, report: firstParty });
    } catch (err: any) {
      console.error('[Analytics Report] Error:', err?.message || err);
      return res.status(500).json({ success: false, error: 'Failed to load analytics report' });
    }
  });
}
