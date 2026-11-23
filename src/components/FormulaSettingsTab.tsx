import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  RotateCcw, 
  Check, 
  Info,
  Truck
} from 'lucide-react';
import {
  getLocalShippingSettings,
  subscribeToShippingSettings,
  saveShippingSettings,
} from '../lib/shippingSettings';

export interface FormulaConfig {
  aedRate: number; // نرخ درهم امارات به تومان (AED)
  tryRate?: number; // نرخ لیر ترکیه به تومان (TRY) - ترندیول
  gbpRate?: number; // نرخ پوند انگلیس به تومان (GBP) - لوک‌فنتستیک
  eurRate?: number; // نرخ یورو به تومان (EUR)
  usdRate?: number; // نرخ دلار آمریکا به تومان (USD)
  shippingPer100g: number;
  customsRatePercent: number;
  varaFeePercent: number;
  discountPercent: number;
  maxDiscountToman: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
}

export const DEFAULT_FORMULA_CONFIG: FormulaConfig = {
  aedRate: 25500, // نرخ درهم دبی / امارات
  tryRate: 2650, // نرخ لیر ترکیه
  gbpRate: 118000, // نرخ پوند انگلیس
  eurRate: 101000, // نرخ یورو
  usdRate: 92500, // نرخ دلار آمریکا
  shippingPer100g: 85000,
  customsRatePercent: 5,
  varaFeePercent: 4,
  discountPercent: 2,
  maxDiscountToman: 80000,
  deliveryDaysMin: 5,
  deliveryDaysMax: 8,
};

export const FORMULA_STORAGE_KEY = 'vara_pricing_formula';

export const getLocalFormulaConfig = (): FormulaConfig => {
  try {
    const saved = localStorage.getItem(FORMULA_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const aedRate = parsed.aedRate || (parsed.usdRate ? Math.round(parsed.usdRate / 3.67) : 25500);
      return {
        ...DEFAULT_FORMULA_CONFIG,
        ...parsed,
        aedRate,
        tryRate: parsed.tryRate || DEFAULT_FORMULA_CONFIG.tryRate,
        gbpRate: parsed.gbpRate || DEFAULT_FORMULA_CONFIG.gbpRate,
        eurRate: parsed.eurRate || DEFAULT_FORMULA_CONFIG.eurRate,
        usdRate: parsed.usdRate || DEFAULT_FORMULA_CONFIG.usdRate,
      };
    }
  } catch (err) {
    console.warn('Error reading local formula config:', err);
  }
  return DEFAULT_FORMULA_CONFIG;
};

export const saveLocalFormulaConfig = (config: FormulaConfig): void => {
  try {
    localStorage.setItem(FORMULA_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('vara-formula-change', { detail: config }));
  } catch (err) {
    console.error('Error saving local formula config:', err);
  }
};

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
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    setFormState(prev => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalFormulaConfig(formState);
    if (onSave) {
      onSave(formState);
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

  const handleReset = () => {
    if (window.confirm('آیا از بازنشانی فرمول به مقادیر پیش‌فرض اطمینان دارید؟')) {
      const fresh = { ...DEFAULT_FORMULA_CONFIG };
      setFormState(fresh);
      saveLocalFormulaConfig(fresh);
      if (onReset) {
        onReset();
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

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
          <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#FAF8F5] text-[#8A1A3C] text-[11px] font-bold border border-[#b8b8b9]">
            <span>تنظیمات الگوریتم قیمت‌گذاری خرید از دبی و فروشگاه‌های بین‌المللی</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#454a4f]">
            فرمول محاسبه قیمت و نرخ ارز فروشگاه‌ها
          </h2>
          <p className="text-xs text-[#788089] leading-relaxed max-w-2xl">
            استعلام‌ها از سفورا دبی، آمازون امارات، لوک‌فنتستیک (Lookfantastic) و ترندیول (Trendyol) دریافت شده و متناسب با ارز مبدأ (درهم، لیر ترکیه، پوند، یورو یا دلار) به تومان تبدیل می‌شوند.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSwitchToCalculator}
            className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#b8b8b9] text-[#454a4f] border border-[#b8b8b9] text-xs font-semibold transition-all cursor-pointer"
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
          <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#b8b8b9] text-[#8A1A3C] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#454a4f]">تنظیم هزینه ارسال پست پیشتاز سراسری</h3>
            <p className="text-xs text-[#788089] mt-0.5">
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
              className="w-full bg-[#FAF8F5] border border-[#b8b8b9] rounded-xl pl-12 pr-3.5 py-2.5 text-xs font-vazir font-bold text-[#454a4f] focus:outline-none focus:border-[#454a4f]"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#788089] font-vazir">
              تومان
            </span>
          </div>
          <button
            type="submit"
            disabled={savingPostFee}
            className="px-4 py-2.5 rounded-xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {savedPostFeeSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>ذخیره شد</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#949c91]" />
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
      <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl text-xs text-[#454a4f] font-vazir">
        <span className="font-bold text-[#8A1A3C] block mb-2">معادله محاسبه قیمت نهایی سفارش از دبی:</span>
        <div className="flex flex-wrap items-center gap-2 font-vazir text-[11px] sm:text-xs">
          <span className="bg-white px-2.5 py-1.5 rounded-lg border border-[#b8b8b9] font-semibold text-[#8A1A3C]">
            (قیمت به درهم × {currentAedRate.toLocaleString('fa-IR')} تومان)
          </span>
          <span className="text-[#788089] font-bold">+</span>
          <span className="bg-white px-2.5 py-1.5 rounded-lg border border-[#b8b8b9] font-semibold">
            (وزن کالا × {formState.shippingPer100g.toLocaleString('fa-IR')} / ۱۰۰)
          </span>
          <span className="text-[#788089] font-bold">+</span>
          <span className="bg-white px-2.5 py-1.5 rounded-lg border border-[#b8b8b9] font-semibold">
            ({formState.customsRatePercent.toLocaleString('fa-IR')}٪ گمرک و ترخیص)
          </span>
          <span className="text-[#788089] font-bold">+</span>
          <span className="bg-white px-2.5 py-1.5 rounded-lg border border-[#b8b8b9] font-semibold">
            ({formState.varaFeePercent.toLocaleString('fa-IR')}٪ کارمزد ورا)
          </span>
          <span className="text-emerald-700 font-bold">-</span>
          <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1.5 rounded-lg border border-emerald-200 font-semibold">
            (تخفیف تا سقف {formState.maxDiscountToman.toLocaleString('fa-IR')} ت)
          </span>
          <span className="text-[#788089] font-bold">=</span>
          <span className="bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] px-3 py-1.5 rounded-lg font-bold">
            قیمت نهایی قطعی
          </span>
        </div>
      </div>

      {/* Main Form & Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-vazir">
        
        {/* Form Inputs (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-[#454a4f] pb-3 border-b border-[#b8b8b9]">
            <span>ضرایب و متغیرهای فرمول محاسبه قیمت</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* AED Rate */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-[#454a4f] flex items-center justify-between">
                <span>نرخ درهم امارات / دبی (تومان):</span>
                <span className="text-[10px] text-[#8A1A3C] font-bold bg-[#FAF6F2] px-2 py-0.5 rounded border border-[#b8b8b9]">واحد مبنا: AED</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.aedRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('aedRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
              <p className="text-[11px] text-[#788089]">
                مبنای تبدیل قیمت‌های درهمی کالاهای سفورا دبی، آمازون امارات، لوک‌فنتستیک امارات و ترندیول امارات
              </p>
            </div>

            {/* TRY Rate (Trendyol Turkey) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f] flex items-center justify-between">
                <span>نرخ لیر ترکیه (ترندیول):</span>
                <span className="text-[10px] text-[#8A1A3C] font-bold bg-[#FAF6F2] px-1.5 py-0.5 rounded border border-[#b8b8b9]">TRY</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.tryRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('tryRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* GBP Rate (Lookfantastic UK) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f] flex items-center justify-between">
                <span>نرخ پوند (لوک‌فنتستیک):</span>
                <span className="text-[10px] text-[#8A1A3C] font-bold bg-[#FAF6F2] px-1.5 py-0.5 rounded border border-[#b8b8b9]">GBP</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.gbpRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('gbpRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* EUR Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f] flex items-center justify-between">
                <span>نرخ یورو (شعب اروپا):</span>
                <span className="text-[10px] text-[#8A1A3C] font-bold bg-[#FAF6F2] px-1.5 py-0.5 rounded border border-[#b8b8b9]">EUR</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.eurRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('eurRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* USD Rate */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f] flex items-center justify-between">
                <span>نرخ دلار آمریکا:</span>
                <span className="text-[10px] text-[#8A1A3C] font-bold bg-[#FAF6F2] px-1.5 py-0.5 rounded border border-[#b8b8b9]">USD</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.usdRate) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('usdRate', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* Shipping per 100g */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f]">
                حمل هوایی از دبی (هر ۱۰۰ گرم):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.shippingPer100g) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('shippingPer100g', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
            </div>

            {/* Customs and insurance % */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f]">
                درصد ترخیص گمرکی و بیمه (٪):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(Number(formState.customsRatePercent) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('customsRatePercent', parseNumericInput(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  درصد
                </span>
              </div>
            </div>

            {/* Service fee % */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f]">
                درصد کارمزد ورا (٪):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(Number(formState.varaFeePercent) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('varaFeePercent', parseNumericInput(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                  required
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  درصد
                </span>
              </div>
            </div>

            {/* Discount % */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#454a4f]">
                درصد تخفیف پیش‌فرض (٪):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={(Number(formState.discountPercent) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('discountPercent', parseNumericInput(e.target.value))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  درصد
                </span>
              </div>
            </div>

            {/* Max discount cap */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-semibold text-[#454a4f]">
                حداکثر سقف تخفیف (تومان):
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(formState.maxDiscountToman) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => handleFieldChange('maxDiscountToman', Math.floor(parseNumericInput(e.target.value)))}
                  className="w-full bg-[#FAF8F5] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs font-vazir font-bold outline-none"
                />
                <span className="absolute left-3.5 top-2.5 text-xs text-[#788089] pointer-events-none">
                  تومان
                </span>
              </div>
            </div>


          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-[#b8b8b9] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-[#788089] hover:text-rose-700 border border-[#b8b8b9] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>ذخیره شد!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#949c91]" />
                  <span>ذخیره فرمول</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Live Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#b8b8b9]">
              <h3 className="text-sm font-bold text-[#454a4f]">شبیه‌ساز و تست فرمول</h3>
              <span className="text-[11px] text-[#788089]">محاسبه زنده</span>
            </div>

            <p className="text-xs text-[#55504A] leading-relaxed">
              با تغییر مقادیر زیر، نتیجه را طبق فرمول تنظیم‌شده به صورت آنی بررسی کنید:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {(['AED', 'TRY', 'GBP', 'EUR', 'USD'] as const).map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setTestCurrency(cur)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    testCurrency === cur
                      ? 'bg-[#454a4f] text-white'
                      : 'bg-white text-[#55504A] border border-[#b8b8b9]'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#788089] mb-1">
                  قیمت تست ({testCurrency}):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(testAedPrice) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => setTestAedPrice(Math.max(1, parseNumericInput(e.target.value) || 0))}
                  className="w-full bg-white border border-[#b8b8b9] rounded-lg px-2.5 py-1.5 text-xs font-vazir font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#788089] mb-1">
                  وزن کالا (گرم):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={(Number(testWeightGrams) || 0).toLocaleString('fa-IR')}
                  onChange={(e) => setTestWeightGrams(Math.max(10, Math.floor(parseNumericInput(e.target.value)) || 0))}
                  className="w-full bg-white border border-[#b8b8b9] rounded-lg px-2.5 py-1.5 text-xs font-vazir font-bold"
                />
              </div>
            </div>

            {/* Simulation Breakdown Table */}
            <div className="space-y-2 pt-2 border-t border-[#b8b8b9] text-xs">
              <div className="flex items-center justify-between text-[#55504A]">
                <span>قیمت پایه ({testAedPrice.toLocaleString('fa-IR')} {activeSimCurrency.label} × {activeSimCurrency.rate.toLocaleString('fa-IR')} ت):</span>
                <span className="font-vazir font-bold">{simBaseToman.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-[#55504A]">
                <span>هزینه حمل هوایی از دبی ({testWeightGrams.toLocaleString('fa-IR')} گرم):</span>
                <span className="font-vazir font-bold">{simShipping.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-[#55504A]">
                <span>ترخیص و بیمه ({formState.customsRatePercent.toLocaleString('fa-IR')}٪):</span>
                <span className="font-vazir font-bold">{simCustoms.toLocaleString('fa-IR')} تومان</span>
              </div>
              <div className="flex items-center justify-between text-[#55504A]">
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
            <div className="bg-white p-3.5 rounded-xl border border-[#949c91] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#8A1A3C] font-bold block">مبلغ نهایی محاسبه‌شده</span>
                <span className="text-lg font-black text-[#454a4f] font-vazir">
                  {simFinalPrice.toLocaleString('fa-IR')}
                </span>
                <span className="text-xs text-[#788089] mr-1">تومان</span>
              </div>

              <button
                type="button"
                onClick={onSwitchToCalculator}
                className="px-3 py-1.5 rounded-lg bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-[11px] font-semibold hover:bg-black transition-all cursor-pointer"
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
