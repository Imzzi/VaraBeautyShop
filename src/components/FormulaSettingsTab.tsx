import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  RotateCcw, 
  Check, 
  Info,
  Truck,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import {
  getLocalShippingSettings,
  subscribeToShippingSettings,
  saveShippingSettings,
} from '../lib/shippingSettings';
import {
  FormulaConfig,
  DEFAULT_FORMULA_CONFIG,
  FORMULA_STORAGE_KEY,
  getLocalFormulaConfig,
  saveLocalFormulaConfig,
  saveFormulaConfig,
  refreshFxRatesNow,
  subscribeToFormulaConfig,
} from '../lib/formulaSettings';

export type { FormulaConfig } from '../lib/formulaSettings';
export {
  DEFAULT_FORMULA_CONFIG,
  FORMULA_STORAGE_KEY,
  getLocalFormulaConfig,
  saveLocalFormulaConfig,
} from '../lib/formulaSettings';

interface FormulaSettingsTabProps {
  config?: FormulaConfig;
  onSave?: (newConfig: FormulaConfig) => void;
  onReset?: () => void;
  onSwitchToCalculator?: () => void;
}

export const FormulaSettingsTab: React.FC<FormulaSettingsTabProps> = ({
  config,
  onSave,
  onReset,
  onSwitchToCalculator
}) => {
  const [formState, setFormState] = useState<FormulaConfig>(() => config || getLocalFormulaConfig());
  const isDirtyFormulaRef = useRef(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingFormula, setSavingFormula] = useState(false);
  const [formulaSaveError, setFormulaSaveError] = useState<string | null>(null);
  const [refreshingFx, setRefreshingFx] = useState(false);
  const [fxStatusMsg, setFxStatusMsg] = useState<string | null>(null);
  const [fxErrorMsg, setFxErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (config) return;
    const unsub = subscribeToFormulaConfig((remoteConfig) => {
      if (!isDirtyFormulaRef.current) {
        setFormState(remoteConfig);
      }
    });
    return () => unsub();
  }, [config]);

  // Domestic Post Express Fee state
  const [postExpressFee, setPostExpressFee] = useState<number | ''>(() => getLocalShippingSettings().postExpressFee);
  const postExpressFeeRef = useRef<number>(getLocalShippingSettings().postExpressFee);
  const isDirtyPostFeeRef = useRef(false);
  const [savingPostFee, setSavingPostFee] = useState(false);
  const [savedPostFeeSuccess, setSavedPostFeeSuccess] = useState(false);
  const [postFeeError, setPostFeeError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToShippingSettings((settings) => {
      if (!isDirtyPostFeeRef.current) {
        postExpressFeeRef.current = settings.postExpressFee;
        setPostExpressFee(settings.postExpressFee);
      }
    });
    return () => unsub();
  }, []);

  const handleSavePostFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPostFee(true);
    setPostFeeError(null);
    const rawVal = postExpressFee !== '' ? Number(postExpressFee) : postExpressFeeRef.current;
    const cleanFee = Math.max(0, Math.floor(Number.isFinite(rawVal) ? rawVal : 0));
    isDirtyPostFeeRef.current = false;
    postExpressFeeRef.current = cleanFee;
    setPostExpressFee(cleanFee);
    try {
      await saveShippingSettings({
        postExpressFee: cleanFee,
      });
      setSavedPostFeeSuccess(true);
      setTimeout(() => setSavedPostFeeSuccess(false), 2500);
    } catch {
      setPostFeeError('خطا در ذخیره هزینه پست');
      setTimeout(() => setPostFeeError(null), 4000);
    } finally {
      setSavingPostFee(false);
    }
  };

  // Simulator test inputs (supports AED, TRY, GBP, EUR, USD)
  const [testCurrency, setTestCurrency] = useState<'AED' | 'TRY' | 'GBP' | 'EUR' | 'USD'>('AED');
  const [testAedPrice, setTestAedPrice] = useState(115);
  const [testWeightGrams, setTestWeightGrams] = useState(120);

  const parseNumericInput = (val: string) => {
    const english = val
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/[^0-9.]/g, '');
    return english ? parseFloat(english) : 0;
  };

  const parsePostFeeInput = (val: string): number | '' => {
    const english = val
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/[^0-9]/g, '');
    return english !== '' ? parseInt(english, 10) : '';
  };

  const handleFieldChange = (field: keyof FormulaConfig, value: number) => {
    isDirtyFormulaRef.current = true;
    setFormState(prev => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value
    }));
  };

  const handleToggleAutoUpdate = () => {
    isDirtyFormulaRef.current = true;
    setFormState(prev => ({
      ...prev,
      autoUpdateRates: prev.autoUpdateRates === false,
    }));
  };

  const handleRefreshFxNow = async () => {
    setRefreshingFx(true);
    setFxErrorMsg(null);
    setFxStatusMsg(null);
    try {
      const margin = formState.rateMarginPercent ?? 4;
      const result = await refreshFxRatesNow(margin);
      const mergedUpdated: FormulaConfig = {
        ...formState,
        usdRate: result.config.usdRate,
        aedRate: result.config.aedRate,
        tryRate: result.config.tryRate,
        gbpRate: result.config.gbpRate,
        eurRate: result.config.eurRate,
        rateMarginPercent: result.config.rateMarginPercent,
        ratesUpdatedAt: result.config.ratesUpdatedAt,
        ratesSource: result.config.ratesSource,
        baseUsdtToman: result.config.baseUsdtToman,
        usdCrossRates: result.config.usdCrossRates,
      };
      isDirtyFormulaRef.current = false;
      setFormState(mergedUpdated);
      if (onSave) {
        onSave(mergedUpdated);
      }
      setFxStatusMsg(`نرخ‌ها با موفقیت از ${result.source} استعلام و ذخیره شدند.`);
      setTimeout(() => setFxStatusMsg(null), 4500);
    } catch (err: any) {
      setFxErrorMsg(err?.message || 'خطا در استعلام لحظه‌ای نرخ ارز.');
      setTimeout(() => setFxErrorMsg(null), 5000);
    } finally {
      setRefreshingFx(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFormula(true);
    setFormulaSaveError(null);
    isDirtyFormulaRef.current = false;
    try {
      const saved = await saveFormulaConfig(formState);
      setFormState(saved);
      if (onSave) {
        onSave(saved);
      }
    } catch (err: any) {
      saveLocalFormulaConfig(formState);
      setFormulaSaveError(err?.message || 'ذخیره در دیتابیس انجام نشد (تغییرات فقط محلی ذخیره شد).');
      setTimeout(() => setFormulaSaveError(null), 5000);
    } finally {
      setSavingFormula(false);
    }
    const rawVal = postExpressFee !== '' ? Number(postExpressFee) : postExpressFeeRef.current;
    const cleanFee = Math.max(0, Math.floor(Number.isFinite(rawVal) ? rawVal : 0));
    isDirtyPostFeeRef.current = false;
    postExpressFeeRef.current = cleanFee;
    setPostExpressFee(cleanFee);
    try {
      await saveShippingSettings({
        postExpressFee: cleanFee,
      });
    } catch {}
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = async () => {
    if (window.confirm('آیا از بازنشانی فرمول به مقادیر پیش‌فرض اطمینان دارید؟')) {
      const fresh = { ...DEFAULT_FORMULA_CONFIG };
      isDirtyFormulaRef.current = false;
      setFormState(fresh);
      try {
        const saved = await saveFormulaConfig(fresh);
        setFormState(saved);
      } catch {
        saveLocalFormulaConfig(fresh);
      }
      if (onReset) {
        onReset();
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const formattedRatesUpdatedAt = (() => {
    if (!formState.ratesUpdatedAt) return 'هنوز انجام نشده';
    const dt = new Date(formState.ratesUpdatedAt);
    if (Number.isNaN(dt.getTime())) return 'نامشخص';
    return dt.toLocaleString('fa-IR', {
      timeZone: 'Asia/Tehran',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  })();

  // Simulator calculations using current form state
  const currentAedRate = formState.aedRate || 25500;
  const currencyRatesMap: Record<'AED' | 'TRY' | 'GBP' | 'EUR' | 'USD', { rate: number; label: string }> = {
    AED: { rate: currentAedRate, label: 'درهم' },
    TRY: { rate: formState.tryRate || 2650, label: 'لیر' },
    GBP: { rate: formState.gbpRate || 118000, label: 'پوند' },
    EUR: { rate: formState.eurRate || 101000, label: 'یورو' },
    USD: { rate: formState.usdRate || 92500, label: 'دلار' },
  };
  const activeSimCurrency = currencyRatesMap[testCurrency];
  const simBaseToman = Math.round(testAedPrice * activeSimCurrency.rate);
  const simShipping = Math.round((testWeightGrams / 100) * formState.shippingPer100g);
  const simCustoms = Math.round(simBaseToman * (formState.customsRatePercent / 100));
  const simVaraFee = Math.round(simBaseToman * (formState.varaFeePercent / 100));
  const simDiscount = Math.min(
    formState.maxDiscountToman,
    Math.round(simBaseToman * (formState.discountPercent / 100))
  );
  const simFinalPrice = simBaseToman + simShipping + simCustoms + simVaraFee - simDiscount;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-vara-surface text-vara-rose-ink text-[11px] font-bold border border-vara-line">
            <span>تنظیمات الگوریتم قیمت‌گذاری خرید از دبی و فروشگاه‌های بین‌المللی</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-vara-muted-strong">
            فرمول محاسبه قیمت و نرخ ارز فروشگاه‌ها
          </h2>
          <p className="text-xs text-vara-muted leading-relaxed max-w-2xl">
            استعلام‌ها از سفورا دبی، آمازون امارات، لوک‌فنتستیک (Lookfantastic) و ترندیول (Trendyol) دریافت شده و متناسب با ارز مبدأ (درهم، لیر ترکیه، پوند، یورو یا دلار) به تومان تبدیل می‌شوند.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSwitchToCalculator}
            className="px-3.5 py-2.5 rounded-full bg-vara-surface hover:bg-vara-line text-vara-muted-strong border border-vara-line text-xs font-semibold transition-all cursor-pointer"
          >
            <span>تست در محاسبه‌گر</span>
          </button>
        </div>
      </div>

      {/* Domestic Shipping Fee Settings Card */}
      <form
        onSubmit={handleSavePostFee}
        className="bg-white p-5 sm:p-6 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vara-surface border border-vara-line text-vara-rose-ink flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-vara-muted-strong">تنظیم هزینه ارسال پست پیشتاز سراسری</h3>
            <p className="text-xs text-vara-muted mt-0.5">
              هزینه پیک موتوری تهران به عهده مشتری (پس‌کرایه) می‌باشد.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="relative w-full sm:w-44">
            <input
              type="text"
              inputMode="numeric"
              placeholder="۵۰٬۰۰۰"
              value={postExpressFee === '' ? '' : (Number(postExpressFee) || 0).toLocaleString('fa-IR')}
              onChange={(e) => {
                const parsed = parsePostFeeInput(e.target.value);
                isDirtyPostFeeRef.current = true;
                postExpressFeeRef.current = parsed === '' ? 0 : parsed;
                setPostExpressFee(parsed);
              }}
              className="w-full bg-vara-surface border border-vara-line rounded-full pl-12 pr-3.5 py-2.5 text-xs font-vazir font-bold text-vara-muted-strong focus:outline-none focus:border-vara-muted-strong"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-vara-muted font-vazir">
              تومان
            </span>
          </div>
          <button
            type="submit"
            disabled={savingPostFee}
            className="px-4 py-2.5 rounded-full bg-vara-rose hover:bg-vara-rose-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {savedPostFeeSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>ذخیره شد</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-vara-muted" />
                <span>{savingPostFee ? 'در حال ذخیره...' : 'ذخیره هزینه پست'}</span>
              </>
            )}
          </button>
          {postFeeError && (
            <span className="text-[11px] font-bold text-rose-600 font-vazir">{postFeeError}</span>
          )}
        </div>
      </form>

      {/* Formula Math Visual Equation */}
      <div className="bg-vara-surface p-4 sm:p-5 rounded-2xl text-xs text-vara-muted-strong font-vazir">
        <span className="font-bold text-vara-rose-ink block mb-2">معادله محاسبه قیمت نهایی سفارش از دبی:</span>
        <div className="flex flex-wrap items-center gap-2 font-vazir text-[11px] sm:text-xs">
          <span className="bg-white px-2.5 py-1.5 rounded-full border border-vara-line font-semibold text-vara-rose-ink">
            (قیمت به درهم × {currentAedRate.toLocaleString('fa-IR')} تومان)
          </span>
          <span className="text-vara-muted font-bold">+</span>
          <span className="bg-white px-2.5 py-1.5 rounded-full border border-vara-line font-semibold">
            (وزن کالا × {formState.shippingPer100g.toLocaleString('fa-IR')} / ۱۰۰)
          </span>
          <span className="text-vara-muted font-bold">+</span>
          <span className="bg-white px-2.5 py-1.5 rounded-full border border-vara-line font-semibold">
            ({formState.customsRatePercent.toLocaleString('fa-IR')}٪ گمرک و ترخیص)
          </span>
          <span className="text-vara-muted font-bold">+</span>
          <span className="bg-white px-2.5 py-1.5 rounded-full border border-vara-line font-semibold">
            ({formState.varaFeePercent.toLocaleString('fa-IR')}٪ کارمزد ورا)
          </span>
          <span className="text-emerald-700 font-bold">-</span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-full border border-emerald-200 font-semibold">
            (تخفیف تا سقف {formState.maxDiscountToman.toLocaleString('fa-IR')} ت)
          </span>
          <span className="text-vara-muted font-bold">=</span>
          <span className="bg-vara-muted-strong/90 hover:bg-vara-muted-strong text-white px-3 py-1.5 rounded-full font-bold">
            قیمت نهایی قطعی
          </span>
        </div>
      </div>

      {/* Main Form & Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-vazir">
        
        {/* Form Inputs (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl shadow-2xs space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-vara-line">
            <h3 className="text-sm font-bold text-vara-muted-strong">
              <span>ضرایب و متغیرهای فرمول محاسبه قیمت</span>
            </h3>
            <button
              type="button"
              onClick={handleRefreshFxNow}
              disabled={refreshingFx}
              className="px-3.5 py-1.5 rounded-full bg-vara-surface hover:bg-vara-line text-vara-rose-ink border border-vara-line text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingFx ? 'animate-spin' : ''}`} />
              <span>{refreshingFx ? 'در حال استعلام...' : 'استعلام و بروزرسانی الان'}</span>
            </button>
          </div>

          {/* Automatic 4-Hour FX Sync Controls & Status */}
          <div className="bg-vara-surface border border-vara-line rounded-2xl p-3.5 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-vara-line text-vara-rose-ink flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-vara-muted-strong">
                      بروزرسانی خودکار هر ۴ ساعت (تتر + نرخ جهانی)
                    </span>
                  </div>
                  <p className="text-[11px] text-vara-muted leading-relaxed mt-0.5">
                    قیمت دلار از تتر (USDT) استعلام شده و نرخ درهم، لیر، پوند و یورو بر اساس تبدیل دلاری جهانی محاسبه و گرد می‌شوند.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={formState.autoUpdateRates !== false}
                onClick={handleToggleAutoUpdate}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${
                  formState.autoUpdateRates !== false
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-vara-muted border-vara-line'
                }`}
              >
                {formState.autoUpdateRates !== false ? 'خودکار: روشن' : 'خودکار: خاموش'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-vara-line/80 items-center">
              <div>
                <label className="block text-[11px] font-semibold text-vara-muted-strong mb-1">
                  حاشیه اطمینان نرخ ارز (٪):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={(Number(formState.rateMarginPercent ?? 4)).toLocaleString('fa-IR')}
                    onChange={(e) => handleFieldChange('rateMarginPercent', Math.min(50, Math.max(0, parseNumericInput(e.target.value))))}
                    className="w-full bg-white border border-vara-line focus:border-vara-ink rounded-full px-3 py-1.5 text-xs font-vazir font-bold outline-none"
                  />
                  <span className="absolute left-3 top-1.5 text-[11px] text-vara-muted pointer-events-none">
                    درصد
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-vara-muted space-y-1">
                <div className="flex items-center gap-1.5 text-vara-muted-strong font-medium">
                  <Clock className="w-3.5 h-3.5 text-vara-rose-ink shrink-0" />
                  <span>آخرین استعلام: {formattedRatesUpdatedAt}</span>
                </div>
                {formState.ratesSource && (
                  <div className="truncate">
                    منبع: <span className="font-semibold text-vara-muted-strong">{formState.ratesSource}</span>
                  </div>
                )}
                {formState.baseUsdtToman ? (
                  <div>
                    تتر خام: <span className="font-bold text-vara-muted-strong">{formState.baseUsdtToman.toLocaleString('fa-IR')} تومان</span>
                  </div>
                ) : null}
              </div>
            </div>

            {fxStatusMsg && (
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                {fxStatusMsg}
              </div>
            )}
            {fxErrorMsg && (
              <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {fxErrorMsg}
              </div>
            )}
            {formulaSaveError && (
              <div className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {formulaSaveError}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AED Rate */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-vara-muted-strong flex items-center justify-between">
                <span>نرخ درهم امارات / دبی (تومان):</span>
                <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-2 py-0.5 rounded-full border border-vara-line">واحد مبنا: AED</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.aedRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('aedRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
              <p className="text-[11px] text-vara-muted">
                مبنای تبدیل قیمت‌های درهمی کالاهای سفورا دبی، آمازون امارات، لوک‌فنتستیک امارات و ترندیول امارات
              </p>
            </div>

            {/* TRY Rate (Trendyol Turkey) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong flex items-center justify-between">
                <span>نرخ لیر ترکیه (ترندیول):</span>
                <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-1.5 py-0.5 rounded-full border border-vara-line">TRY</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.tryRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('tryRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* GBP Rate (Lookfantastic UK) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong flex items-center justify-between">
                <span>نرخ پوند (لوک‌فنتستیک):</span>
                <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-1.5 py-0.5 rounded-full border border-vara-line">GBP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.gbpRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('gbpRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* EUR Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong flex items-center justify-between">
                <span>نرخ یورو (شعب اروپا):</span>
                <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-1.5 py-0.5 rounded-full border border-vara-line">EUR</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.eurRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('eurRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* USD Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong flex items-center justify-between">
                <span>نرخ دلار آمریکا:</span>
                <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-1.5 py-0.5 rounded-full border border-vara-line">USD</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.usdRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('usdRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* Shipping per 100g */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong">
                حمل هوایی از دبی (هر ۱۰۰ گرم):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.shippingPer100g) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('shippingPer100g', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* Customs and insurance % */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong">
                درصد ترخیص گمرکی و بیمه (٪):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(Number(formState.customsRatePercent) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('customsRatePercent', parseNumericInput(e.target.value))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  درصد
                </span>
              </div>
            </div>

            {/* Service fee % */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong">
                درصد کارمزد ورا (٪):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(Number(formState.varaFeePercent) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('varaFeePercent', parseNumericInput(e.target.value))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  درصد
                </span>
              </div>
            </div>

            {/* Discount % */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-vara-muted-strong">
                درصد تخفیف پیش‌فرض (٪):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(Number(formState.discountPercent) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('discountPercent', parseNumericInput(e.target.value))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  درصد
                </span>
              </div>
            </div>

            {/* Max discount cap */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-vara-muted-strong">
                حداکثر سقف تخفیف (تومان):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.maxDiscountToman) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('maxDiscountToman', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-vara-surface border border-vara-line focus:border-vara-ink rounded-full px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-vara-muted pointer-events-none">
                  تومان
                </span>
              </div>
            </div>


          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-vara-line flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-full bg-white hover:bg-rose-50 text-vara-muted hover:text-rose-700 border border-vara-line text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <button
              type="submit"
              disabled={savingFormula}
              className="px-5 py-2.5 rounded-full bg-vara-rose hover:bg-vara-rose-hover text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>ذخیره شد!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-vara-muted" />
                  <span>{savingFormula ? 'در حال ذخیره...' : 'ذخیره فرمول'}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-vara-surface p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vara-line">
              <h3 className="text-sm font-bold text-vara-muted-strong">شبیه‌ساز و تست فرمول</h3>
              <span className="text-[11px] text-vara-muted">محاسبه زنده</span>
            </div>

            <p className="text-xs text-vara-muted-strong leading-relaxed">
              با تغییر مقادیر زیر، نتیجه را طبق فرمول تنظیم‌شده به صورت آنی بررسی کنید:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(['AED', 'TRY', 'GBP', 'EUR', 'USD'] as const).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setTestCurrency(cur)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    testCurrency === cur
                      ? 'bg-vara-rose text-white'
                      : 'bg-white text-vara-muted-strong border border-vara-line'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-vara-muted mb-1">
                  قیمت تست ({testCurrency}):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(testAedPrice) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => setTestAedPrice(Math.max(1, parseNumericInput(e.target.value) || 0))}
                  className="w-full bg-white border border-vara-line rounded-full px-2.5 py-1.5 text-xs font-vazir font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-vara-muted mb-1">
                  وزن کالا (گرم):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(testWeightGrams) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => setTestWeightGrams(Math.max(10, Math.floor(parseNumericInput(e.target.value)) || 0))}
                  className="w-full bg-white border border-vara-line rounded-full px-2.5 py-1.5 text-xs font-vazir font-bold"
                />
              </div>
            </div>

            {/* Simulation Breakdown Table */}
            <div className="space-y-2 pt-2 border-t border-vara-line text-xs">
              <div className="flex items-center justify-between text-vara-muted-strong">
                <span>قیمت پایه ({testAedPrice.toLocaleString('fa-IR')} {activeSimCurrency.label} × {activeSimCurrency.rate.toLocaleString('fa-IR')} ت):</span>
                <span className="font-vazir font-bold">{simBaseToman.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-vara-muted-strong">
                <span>هزینه حمل هوایی از دبی ({testWeightGrams.toLocaleString('fa-IR')} گرم):</span>
                <span className="font-vazir font-bold">{simShipping.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-vara-muted-strong">
                <span>ترخیص و بیمه ({formState.customsRatePercent.toLocaleString('fa-IR')}٪):</span>
                <span className="font-vazir font-bold">{simCustoms.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-vara-muted-strong">
                <span>کارمزد ورا ({formState.varaFeePercent.toLocaleString('fa-IR')}٪):</span>
                <span className="font-vazir font-bold">{simVaraFee.toLocaleString('fa-IR')} تومان</span>
              </div>
              {simDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <span>تخفیف ({formState.discountPercent.toLocaleString('fa-IR')}٪):</span>
                  <span className="font-vazir font-bold">- {simDiscount.toLocaleString('fa-IR')} تومان</span>
                </div>
              )}
            </div>

            {/* Calculated Sim Price Output */}
            <div className="bg-white p-3.5 rounded-xl border border-vara-muted flex items-center justify-between">
              <div>
                <span className="text-[10px] text-vara-rose-ink font-bold block">مبلغ نهایی محاسبه‌شده</span>
                <span className="text-lg font-black text-vara-muted-strong font-vazir">
                  {simFinalPrice.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-vara-muted mr-1">تومان</span>
              </div>

              <button
                type="button"
                onClick={onSwitchToCalculator}
                className="px-3 py-1.5 rounded-full bg-vara-rose hover:bg-vara-rose-hover text-white text-[11px] font-semibold hover:bg-black transition-all cursor-pointer"
              >
                تست در سفارش
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
