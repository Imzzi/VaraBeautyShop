import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Eye,
  RefreshCw,
  Save,
  Search,
  ShoppingBag,
  Trash2,
  Users,
} from 'lucide-react';
import { ANALYTICS_SETTING_KEY, AnalyticsConfig, normalizeGaMeasurementId } from '../lib/analytics';
import { getAdminAuthHeaders } from '../lib/adminAuth';

type RangeKey = '7d' | '14d' | '28d';
type InsightTab = 'pages' | 'sources' | 'searches' | 'products';

interface AnalyticsDashboardReport {
  range: RangeKey;
  rangeDays: number;
  source: 'ga4' | 'first-party';
  ga4Configured: boolean;
  ga4Error?: string;
  generatedAt: string;
  summary: {
    activeUsersNow: number;
    activeUsers: number;
    sessions: number;
    pageViews: number;
    conversions: number;
    revenueToman: number;
  };
  dailySeries: Array<{
    date: string;
    labelFa: string;
    pageViews: number;
    users: number;
  }>;
  funnel: Record<string, number>;
  topPages: Array<{ path: string; title: string; views: number }>;
  topSources: Array<{ source: string; sessions: number }>;
  topSearches: Array<{ term: string; count: number }>;
  topProducts: Array<{ itemId: string; itemName: string; views: number; adds: number }>;
}

const FUNNEL_ITEMS: Array<{ key: string; label: string }> = [
  { key: 'page_view', label: 'بازدید صفحات' },
  { key: 'view_item', label: 'مشاهده محصول' },
  { key: 'add_to_cart', label: 'افزودن به سبد' },
  { key: 'remove_from_cart', label: 'حذف از سبد' },
  { key: 'begin_checkout', label: 'شروع تسویه حساب' },
  { key: 'purchase', label: 'خرید موفق' },
  { key: 'search', label: 'جستجو در فروشگاه' },
  { key: 'calculator_estimate', label: 'استعلام محاسبه‌گر' },
];

export const AdminAnalyticsPanel: React.FC = () => {
  const envMeasurementId =
    normalizeGaMeasurementId((import.meta as any)?.env?.VITE_GA_MEASUREMENT_ID) || '';
  const [inputValue, setInputValue] = useState('');
  const [savedConfig, setSavedConfig] = useState<AnalyticsConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const [range, setRange] = useState<RangeKey>('7d');
  const [insightTab, setInsightTab] = useState<InsightTab>('pages');
  const [report, setReport] = useState<AnalyticsDashboardReport | null>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportError, setReportError] = useState('');

  const loadConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await fetch(`/api/db/settings/${ANALYTICS_SETTING_KEY}`, { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        const val = (data.value && typeof data.value === 'object' ? data.value : {}) as AnalyticsConfig;
        setSavedConfig(val);
        setInputValue(val.gaMeasurementId || '');
      }
    } catch {
      // Keep UI responsive even if config fetch fails transiently
    } finally {
      setConfigLoading(false);
    }
  }, []);

  const loadReport = useCallback(async (targetRange: RangeKey) => {
    setReportLoading(true);
    setReportError('');
    try {
      const res = await fetch(`/api/admin/analytics/report?range=${targetRange}`, {
        cache: 'no-store',
        headers: {
          ...getAdminAuthHeaders(),
        },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success || !data?.report) {
        setReportError(data?.error || 'دریافت گزارش آنالیتیکس ناموفق بود.');
        return;
      }
      setReport(data.report as AnalyticsDashboardReport);
    } catch {
      setReportError('خطا در ارتباط با سرور برای دریافت گزارش آنالیتیکس.');
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConfig();
  }, [loadConfig]);

  useEffect(() => {
    void loadReport(range);
  }, [range, loadReport]);

  const trimmed = inputValue.trim().toUpperCase();
  const normalizedPreview = normalizeGaMeasurementId(trimmed);
  const isValidOrEmpty = trimmed === '' || Boolean(normalizedPreview);
  const effectiveId =
    envMeasurementId || normalizeGaMeasurementId(savedConfig?.gaMeasurementId) || '';

  const saveId = async (nextRawId: string) => {
    const cleaned = nextRawId.trim().toUpperCase();
    const valid = cleaned === '' || Boolean(normalizeGaMeasurementId(cleaned));
    if (!valid) {
      setError('فرمت Measurement ID معتبر نیست (مثال: G-1A2B3C4D5E)');
      return;
    }

    setSaving(true);
    setError('');
    setStatusMessage('');
    try {
      const res = await fetch(`/api/db/settings/${ANALYTICS_SETTING_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          value: {
            gaMeasurementId: cleaned,
            updatedAt: new Date().toISOString(),
          },
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setError(data?.error || 'ذخیره تنظیمات GA4 انجام نشد.');
        return;
      }
      const nextConfig = (data.value || { gaMeasurementId: cleaned }) as AnalyticsConfig;
      setSavedConfig(nextConfig);
      setInputValue(nextConfig.gaMeasurementId || '');
      setStatusMessage(cleaned ? `شناسه ${cleaned} ذخیره شد.` : 'ردیابی GA4 غیرفعال شد.');
    } catch {
      setError('خطا در ذخیره تنظیمات GA4.');
    } finally {
      setSaving(false);
    }
  };

  const maxDailyViews = useMemo(() => {
    if (!report?.dailySeries?.length) return 1;
    return Math.max(1, ...report.dailySeries.map((d) => d.pageViews));
  }, [report]);

  const maxFunnelCount = useMemo(() => {
    if (!report?.funnel) return 1;
    const values = Object.values(report.funnel).map((v) => Number(v) || 0);
    return Math.max(1, ...values);
  }, [report]);

  const formatNum = (val: number | undefined) => (Number(val) || 0).toLocaleString('fa-IR');

  return (
    <div
      className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-vara-line shadow-xs space-y-6 text-right font-vazir"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-vara-line pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-vara-ink flex items-center gap-2">
            <Activity className="w-5 h-5 text-vara-rose-ink" />
            <span>آنالیتیکس و آمار رفتار کاربران</span>
          </h2>
          {report && (
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                report.source === 'ga4'
                  ? 'bg-sky-50 text-sky-700 border-sky-200'
                  : 'bg-vara-surface text-vara-ink border-vara-line'
              }`}
            >
              {report.source === 'ga4' ? 'Google Analytics API' : 'آمار لحظه‌ای سایت'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center bg-vara-surface border border-vara-line rounded-full p-0.5 text-xs">
            {(['7d', '14d', '28d'] as RangeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                  range === key
                    ? 'bg-vara-rose text-white'
                    : 'text-vara-muted hover:text-vara-ink'
                }`}
              >
                {key === '7d' ? '۷ روز' : key === '14d' ? '۱۴ روز' : '۲۸ روز'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => void loadReport(range)}
            disabled={reportLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vara-ink bg-vara-surface hover:bg-vara-tint px-3 py-1.5 rounded-full border border-vara-line transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reportLoading ? 'animate-spin' : ''}`} />
            <span>بروزرسانی</span>
          </button>

          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vara-rose-ink bg-vara-surface hover:bg-vara-tint px-3 py-1.5 rounded-full border border-vara-line transition-colors"
          >
            <span>Google Analytics</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
              effectiveId
                ? 'bg-emerald-50 text-[#15803D] border-emerald-200'
                : 'bg-vara-surface text-vara-muted border-vara-line'
            }`}
          >
            {effectiveId ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            <span>{effectiveId ? `فعال: ${effectiveId}` : 'بدون شناسه'}</span>
          </span>
        </div>
      </div>

      {reportError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl p-3">
          {reportError}
        </div>
      )}

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-vara-surface/70 border border-vara-line rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-vara-muted">
            <span>آنلاین (۳۰ دقیقه اخیر)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-vara-ink font-jakarta">
            {report ? formatNum(report.summary.activeUsersNow) : '—'}
          </div>
        </div>

        <div className="bg-vara-surface/70 border border-vara-line rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-vara-muted">
            <span>کاربران یکتا</span>
            <Users className="w-4 h-4 text-vara-rose-ink" />
          </div>
          <div className="text-2xl font-bold text-vara-ink font-jakarta">
            {report ? formatNum(report.summary.activeUsers) : '—'}
          </div>
        </div>

        <div className="bg-vara-surface/70 border border-vara-line rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-vara-muted">
            <span>بازدید صفحات</span>
            <Eye className="w-4 h-4 text-vara-rose-ink" />
          </div>
          <div className="text-2xl font-bold text-vara-ink font-jakarta">
            {report ? formatNum(report.summary.pageViews) : '—'}
          </div>
        </div>

        <div className="bg-vara-surface/70 border border-vara-line rounded-2xl p-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-vara-muted">
            <span>نشست‌ها / سفارش‌ها</span>
            <ShoppingBag className="w-4 h-4 text-vara-rose-ink" />
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl font-bold text-vara-ink font-jakarta">
              {report ? formatNum(report.summary.sessions) : '—'}
            </span>
            {report && (
              <span className="text-[11px] font-semibold text-[#15803D]">
                {formatNum(report.summary.conversions)} سفارش
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Daily Traffic Chart */}
      <div className="bg-vara-surface/60 border border-vara-line rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs sm:text-sm font-bold text-vara-ink flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-vara-rose-ink" />
            <span>روند روزانه بازدید صفحات و کاربران</span>
          </h3>
          <div className="flex items-center gap-3 text-[11px] text-vara-muted">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-vara-rose inline-block" /> بازدید
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-vara-rose/35 inline-block" /> کاربر
            </span>
          </div>
        </div>

        {report && report.dailySeries.length > 0 ? (
          <div className="flex items-end gap-1.5 sm:gap-2 h-36 pt-2">
            {report.dailySeries.map((day) => {
              const viewPct = Math.max(4, Math.round((day.pageViews / maxDailyViews) * 100));
              const userPct = Math.max(2, Math.round((day.users / maxDailyViews) * 100));
              return (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center justify-end gap-1 h-full min-w-0 group"
                  title={`${day.labelFa}: ${formatNum(day.pageViews)} بازدید | ${formatNum(day.users)} کاربر`}
                >
                  <div className="w-full flex items-end justify-center gap-0.5 flex-1">
                    <div
                      className="w-1/2 max-w-[14px] rounded-t bg-vara-rose transition-all"
                      style={{ height: `${day.pageViews > 0 ? viewPct : 4}%` }}
                    />
                    <div
                      className="w-1/2 max-w-[14px] rounded-t bg-vara-rose/35 transition-all"
                      style={{ height: `${day.users > 0 ? userPct : 2}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-vara-muted truncate w-full text-center">
                    {range === '28d' ? day.date.slice(8) : day.labelFa}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-xs text-vara-muted">
            {reportLoading ? 'در حال بارگذاری نمودار...' : 'داده‌ای برای نمایش وجود ندارد.'}
          </div>
        )}
      </div>

      {/* Funnel & Top Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* E-Commerce Funnel */}
        <div className="bg-vara-surface/70 border border-vara-line rounded-2xl p-4 sm:p-5 space-y-3">
          <h3 className="text-xs sm:text-sm font-bold text-vara-ink">قیف فروش و رویدادها (E-Commerce)</h3>
          <ul className="space-y-2.5 text-xs">
            {FUNNEL_ITEMS.map((item) => {
              const count = report?.funnel?.[item.key] ?? 0;
              const pct = Math.min(100, Math.round((count / maxFunnelCount) * 100));
              return (
                <li key={item.key} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <code className="font-jakarta text-[11px] font-semibold text-vara-rose-ink">
                        {item.key}
                      </code>
                      <span className="text-vara-muted truncate">{item.label}</span>
                    </div>
                    <span className="font-bold text-vara-ink font-jakarta shrink-0">
                      {formatNum(count)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-vara-line/60">
                    <div
                      className="h-full bg-vara-rose rounded-full transition-all"
                      style={{ width: `${count > 0 ? Math.max(4, pct) : 0}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Live Tabbed Insights */}
        <div className="bg-vara-canvas border border-vara-line rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-vara-line pb-2.5">
            {(
              [
                ['pages', 'صفحات پربازدید'],
                ['sources', 'منابع ورودی'],
                ['searches', 'جستجوهای سایت'],
                ['products', 'محصولات پربازدید'],
              ] as Array<[InsightTab, string]>
            ).map(([tabKey, label]) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setInsightTab(tabKey)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                  insightTab === tabKey
                    ? 'bg-vara-rose text-white'
                    : 'bg-white text-vara-muted hover:text-vara-ink border border-vara-line'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-[180px]">
            {insightTab === 'pages' && (
              <InsightRows
                emptyLabel="هنوز بازدیدی ثبت نشده است."
                rows={(report?.topPages || []).map((p) => ({
                  primary: p.path,
                  secondary: p.title,
                  value: `${formatNum(p.views)} بازدید`,
                  ltrPrimary: true,
                }))}
              />
            )}
            {insightTab === 'sources' && (
              <InsightRows
                emptyLabel="هنوز منبع ورودی ثبت نشده است."
                rows={(report?.topSources || []).map((s) => ({
                  primary: s.source,
                  value: `${formatNum(s.sessions)} نشست`,
                }))}
              />
            )}
            {insightTab === 'searches' && (
              <InsightRows
                emptyLabel="هنوز جستجویی ثبت نشده است."
                icon={<Search className="w-3.5 h-3.5 text-vara-rose-ink shrink-0" />}
                rows={(report?.topSearches || []).map((s) => ({
                  primary: s.term,
                  value: `${formatNum(s.count)} بار`,
                }))}
              />
            )}
            {insightTab === 'products' && (
              <InsightRows
                emptyLabel="هنوز بازدید محصولی ثبت نشده است."
                rows={(report?.topProducts || []).map((p) => ({
                  primary: p.itemName || p.itemId,
                  value: `${formatNum(p.views)} بازدید · ${formatNum(p.adds)} سبد`,
                }))}
              />
            )}
          </div>
        </div>
      </div>

      {/* Compact GA4 Measurement ID Config Bar */}
      <div className="pt-2 border-t border-vara-line space-y-2.5">
        <label htmlFor="ga4-measurement-id-input" className="block text-xs font-bold text-vara-ink">
          GA4 Measurement ID
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            id="ga4-measurement-id-input"
            type="text"
            dir="ltr"
            placeholder="G-XXXXXXXXXX"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
              setStatusMessage('');
            }}
            disabled={configLoading || saving}
            className={`flex-1 bg-vara-surface text-vara-ink placeholder-vara-muted text-sm font-jakarta px-4 py-2 rounded-full border focus:outline-none ${
              isValidOrEmpty ? 'border-vara-line focus:border-vara-rose' : 'border-red-400 focus:border-red-500'
            }`}
          />
          <button
            type="button"
            disabled={configLoading || saving || !isValidOrEmpty}
            onClick={() => void saveId(inputValue)}
            className="inline-flex items-center justify-center gap-2 bg-vara-rose hover:bg-vara-rose-hover disabled:opacity-50 text-white px-5 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>ذخیره شناسه</span>
          </button>
          {(savedConfig?.gaMeasurementId || inputValue) && (
            <button
              type="button"
              disabled={configLoading || saving}
              onClick={() => void saveId('')}
              className="inline-flex items-center justify-center gap-1.5 bg-vara-surface hover:bg-red-50 text-vara-muted hover:text-red-700 border border-vara-line px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>غیرفعال‌سازی</span>
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {statusMessage && <p className="text-xs text-[#15803D] font-medium">{statusMessage}</p>}
      </div>
    </div>
  );
};

const InsightRows: React.FC<{
  rows: Array<{ primary: string; secondary?: string; value: string; ltrPrimary?: boolean }>;
  emptyLabel: string;
  icon?: React.ReactNode;
}> = ({ rows, emptyLabel, icon }) => {
  if (rows.length === 0) {
    return (
      <div className="h-full min-h-[160px] flex items-center justify-center text-xs text-vara-muted">
        {emptyLabel}
      </div>
    );
  }

  return (
    <ul className="space-y-2 text-xs">
      {rows.map((row, idx) => (
        <li
          key={`${row.primary}-${idx}`}
          className="flex items-center justify-between gap-2 bg-white border border-vara-line/80 rounded-xl px-3 py-2"
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {icon}
            <div className="min-w-0">
              <div
                className={`font-semibold text-vara-ink truncate ${row.ltrPrimary ? 'font-jakarta' : ''}`}
                dir={row.ltrPrimary ? 'ltr' : 'rtl'}
              >
                {row.primary}
              </div>
              {row.secondary && (
                <div className="text-[10px] text-vara-muted truncate">{row.secondary}</div>
              )}
            </div>
          </div>
          <span className="text-[11px] font-bold text-vara-rose-ink shrink-0">{row.value}</span>
        </li>
      ))}
    </ul>
  );
};
