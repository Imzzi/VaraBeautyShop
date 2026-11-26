import React, { useEffect, useState } from 'react';
import { Activity, AlertCircle, CheckCircle2, ExternalLink, RefreshCw, Save, Trash2 } from 'lucide-react';
import { ANALYTICS_SETTING_KEY, AnalyticsConfig, normalizeGaMeasurementId } from '../lib/analytics';
import { getAdminAuthHeaders } from '../lib/adminAuth';

const TRACKED_EVENTS_SUMMARY: Array<{ name: string; label: string }> = [
  { name: 'page_view', label: 'بازدید تمام صفحات و فیلترهای فروشگاه' },
  { name: 'view_item', label: 'مشاهده صفحه اختصاصی هر محصول (همراه با قیمت به ریال ISO)' },
  { name: 'add_to_cart / remove_from_cart', label: 'افزودن به سبد خرید و حذف از سبد خرید' },
  { name: 'begin_checkout', label: 'شروع فرآیند تسویه حساب و مبلغ نهایی سبد' },
  { name: 'purchase', label: 'تایید خرید موفق (یک‌بار به‌ازای هر کد سفارش)' },
  { name: 'search', label: 'عبارات جستجو شده توسط مشتریان در فروشگاه' },
  { name: 'calculator_estimate', label: 'استعلام موفق قیمت کالا از سفورا، آمازون، ترندیول و لوک‌فنتستیک' },
];

export const AdminAnalyticsPanel: React.FC = () => {
  const envMeasurementId = normalizeGaMeasurementId((import.meta as any)?.env?.VITE_GA_MEASUREMENT_ID) || '';
  const [inputValue, setInputValue] = useState('');
  const [savedConfig, setSavedConfig] = useState<AnalyticsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const loadConfig = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/db/settings/${ANALYTICS_SETTING_KEY}`, { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.success) {
        const val = (data.value && typeof data.value === 'object' ? data.value : {}) as AnalyticsConfig;
        setSavedConfig(val);
        setInputValue(val.gaMeasurementId || '');
      } else {
        setError('دریافت تنظیمات آنالیتیکس ناموفق بود.');
      }
    } catch {
      setError('خطا در ارتباط با سرور برای دریافت تنظیمات آنالیتیکس.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadConfig();
  }, []);

  const trimmed = inputValue.trim().toUpperCase();
  const normalizedPreview = normalizeGaMeasurementId(trimmed);
  const isValidOrEmpty = trimmed === '' || Boolean(normalizedPreview);
  const effectiveId = envMeasurementId || normalizeGaMeasurementId(savedConfig?.gaMeasurementId) || '';

  const saveId = async (nextRawId: string) => {
    const cleaned = nextRawId.trim().toUpperCase();
    const valid = cleaned === '' || Boolean(normalizeGaMeasurementId(cleaned));
    if (!valid) {
      setError('فرمت Measurement ID معتبر نیست. شناسه GA4 باید با G- شروع شود (مثال: G-1A2B3C4D5E).');
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
      setStatusMessage(
        cleaned
          ? `شناسه ${cleaned} ذخیره شد و ردیابی GA4 برای بازدیدکنندگان فعال است.`
          : 'ردیابی GA4 با موفقیت غیرفعال شد.'
      );
    } catch {
      setError('خطا در ذخیره تنظیمات GA4.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-vara-line shadow-xs space-y-6 text-right font-vazir" dir="rtl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-vara-line pb-4">
        <h2 className="text-base sm:text-lg font-bold text-vara-ink flex items-center gap-2">
          <Activity className="w-5 h-5 text-vara-rose-ink" />
          <span>اتصال Google Analytics 4 (GA4)</span>
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-vara-rose-ink bg-vara-surface hover:bg-vara-tint px-3 py-1.5 rounded-full border border-vara-line transition-colors"
          >
            <span>باز کردن Google Analytics</span>
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
            <span>{effectiveId ? `فعال: ${effectiveId}` : 'در انتظار ثبت شناسه G-XXXXXXXXXX'}</span>
          </span>
        </div>
      </div>

      {envMeasurementId && (
        <div className="bg-vara-surface border border-vara-line rounded-xl p-3.5 text-xs text-vara-ink">
          متغیر محیطی <code className="font-jakarta font-bold">VITE_GA_MEASUREMENT_ID</code> با مقدار{' '}
          <strong className="font-jakarta">{envMeasurementId}</strong> روی سرور تنظیم شده و اولویت دارد.
        </div>
      )}

      <div className="space-y-3">
        <label htmlFor="ga4-measurement-id-input" className="block text-xs font-bold text-vara-ink">
          GA4 Measurement ID (شناسه اندازه‌گیری)
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
            disabled={loading || saving}
            className={`flex-1 bg-vara-surface text-vara-ink placeholder-vara-muted text-sm font-jakarta px-4 py-2.5 rounded-full border focus:outline-none ${
              isValidOrEmpty ? 'border-vara-line focus:border-vara-rose' : 'border-red-400 focus:border-red-500'
            }`}
          />
          <button
            type="button"
            disabled={loading || saving || !isValidOrEmpty}
            onClick={() => void saveId(inputValue)}
            className="inline-flex items-center justify-center gap-2 bg-vara-rose hover:bg-vara-rose-hover disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>ذخیره شناسه</span>
          </button>
          {(savedConfig?.gaMeasurementId || inputValue) && (
            <button
              type="button"
              disabled={loading || saving}
              onClick={() => void saveId('')}
              className="inline-flex items-center justify-center gap-1.5 bg-vara-surface hover:bg-red-50 text-vara-muted hover:text-red-700 border border-vara-line px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>غیرفعال‌سازی</span>
            </button>
          )}
        </div>

        {!isValidOrEmpty && (
          <p className="text-xs text-red-600">شناسه GA4 باید با «G-» شروع شود و شامل ۴ تا ۲۰ حرف یا عدد انگلیسی باشد.</p>
        )}
        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {statusMessage && <p className="text-xs text-[#15803D] font-medium">{statusMessage}</p>}
      </div>

      <div className="pt-2">
        <div className="bg-vara-surface/70 border border-vara-line rounded-2xl p-4 sm:p-5 space-y-2.5">
          <h3 className="text-xs sm:text-sm font-bold text-vara-ink">رویدادهای فعال قیف فروش (E-Commerce)</h3>
          <ul className="space-y-2 text-xs text-vara-muted-strong">
            {TRACKED_EVENTS_SUMMARY.map((ev) => (
              <li key={ev.name} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-vara-line/60 pb-1.5 last:border-none last:pb-0">
                <code className="font-jakarta text-[11px] font-semibold text-vara-rose-ink">{ev.name}</code>
                <span>{ev.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
