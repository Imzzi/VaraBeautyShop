import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  Copy, 
  AlertCircle, 
  RefreshCw,
  Send,
  MessageCircle,
  Globe,
  ImageOff,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { FormulaConfig, getLocalFormulaConfig, subscribeToFormulaConfig } from '../lib/formulaSettings';
import { validateUaeStoreUrl, UrlCheckResult } from '../utils/urlValidator';
import { addOrderToDb, getLocalUserSession } from '../lib/db';
import { UserProfile } from '../types';
import { PolicyReaderModal } from './LegalPoliciesPage';
import { PolicyDocumentType } from '../data/policies';
import { sanitizeNavigationUrl } from '../utils/safeUrl';

interface PriceCalculatorPageProps {
  initialUrl?: string;
  onBackToHome: () => void;
  onAddToCart?: (product: any, size?: any) => void;
  user?: UserProfile | null;
  onNavigateToProfile?: () => void;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  sourcePrice?: number;
  image?: string;
  swatchImage?: string;
  inStock?: boolean;
}

export interface ParsedProduct {
  title: string;
  brand: string;
  store: 'sephora' | 'amazon' | 'lookfantastic' | 'trendyol' | 'other';
  storeName: string;
  storeUrl: string;
  image: string;
  originalCurrency: string; // 'AED' | 'TRY' | 'GBP' | 'EUR' | 'USD'
  originalPrice: number;
  sourceOriginalCurrency?: string;
  sourceOriginalPrice?: number;
  weightGrams: number;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  shadeOrSize?: string;
  description: string;
  variants?: ProductVariant[];
  selectedVariantId?: string;
  extractionSource?:
    | 'live_sephora_scraper'
    | 'live_amazon_scraper'
    | 'live_lookfantastic_scraper'
    | 'live_trendyol_scraper'
    | 'live_html'
    | 'verified_catalog'
    | 'url_slug';
}

const getCurrencyDetails = (
  rawCurrency: string | undefined,
  config: FormulaConfig
): { code: string; labelFa: string; rate: number } => {
  const cur = (rawCurrency || 'AED').trim().toUpperCase();
  const aedRate = config.aedRate || (config.usdRate ? Math.round(config.usdRate / 3.67) : 25500);
  if (cur === 'TRY' || cur === 'TL') {
    return { code: 'TRY', labelFa: 'لیر ترکیه', rate: config.tryRate || 2650 };
  }
  if (cur === 'GBP') {
    return { code: 'GBP', labelFa: 'پوند انگلیس', rate: config.gbpRate || 118000 };
  }
  if (cur === 'EUR') {
    return { code: 'EUR', labelFa: 'یورو', rate: config.eurRate || 101000 };
  }
  if (cur === 'USD') {
    return { code: 'USD', labelFa: 'دلار آمریکا', rate: config.usdRate || 92500 };
  }
  return { code: 'AED', labelFa: 'درهم امارات', rate: aedRate };
};

const getOriginLabel = (store?: string, currency?: string, storeUrl?: string): string => {
  if (store === 'trendyol') {
    return currency === 'AED' ? 'امارات / ترکیه (ترندیول)' : 'ترکیه (ترندیول)';
  }
  if (store === 'lookfantastic') {
    return storeUrl?.includes('lookfantastic.ae')
      ? 'دبی / امارات (لوک‌فنتستیک)'
      : 'انگلستان / دبی (لوک‌فنتستیک)';
  }
  return 'دبی / امارات متحده عربی';
};

const getSafeImageUrl = (rawUrl?: string): string => {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return '';
  if (rawUrl.startsWith('/api/') || rawUrl.startsWith('data:')) return rawUrl;
  
  let clean = rawUrl.trim().replace(/&amp;/g, '&');
  if (clean.includes('commercecloud.salesforce.com/on/demandware.static/')) {
    clean = clean.replace(
      /https?:\/\/[^\/]+\.commercecloud\.salesforce\.com\/on\/demandware\.static\//,
      'https://img-product.sephora.me/dw/image/v2/BKWK_PRD/on/demandware.static/'
    );
  } else if (clean.includes('sephora.ae/dw/image/')) {
    clean = clean.replace('www.sephora.ae', 'img-product.sephora.me').replace('sephora.ae', 'img-product.sephora.me');
  }

  return `/api/proxy-image?url=${encodeURIComponent(clean)}`;
};

export const PriceCalculatorPage: React.FC<PriceCalculatorPageProps> = ({
  initialUrl = '',
  onBackToHome,
  onAddToCart,
  user,
  onNavigateToProfile
}) => {
  const [formulaConfig, setFormulaConfig] = useState<FormulaConfig>(() => getLocalFormulaConfig());
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [registeredOrderNumber, setRegisteredOrderNumber] = useState<string>('');
  const [orderErrorMessage, setOrderErrorMessage] = useState<string>('');

  useEffect(() => {
    const unsub = subscribeToFormulaConfig((updated) => {
      setFormulaConfig(updated);
    });
    return () => unsub();
  }, []);

  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [productData, setProductData] = useState<ParsedProduct | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [extractionStatusText, setExtractionStatusText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [nonUaeNotice, setNonUaeNotice] = useState<UrlCheckResult | null>(null);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [activePolicyPreview, setActivePolicyPreview] = useState<PolicyDocumentType | null>(null);

  // Selected Product Variant (Shade or Size from Sephora)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setImageLoadFailed(false);
    setCustomerNotes(`مدل / شید انتخابی: ${variant.name}`);
  };

  // Parse and extract real product data from supported storefronts
  const parseAndCalculate = async (urlToParse: string) => {
    const targetUrl = urlToParse && urlToParse.trim() ? urlToParse.trim() : '';
    if (!targetUrl) {
      setErrorMessage('لطفاً لینک کالا از سفورا دبی، آمازون امارات، لوک‌فنتستیک یا ترندیول را وارد فرمایید.');
      setNonUaeNotice(null);
      return;
    }

    // Pre-flight link check before any network fetch
    const check = validateUaeStoreUrl(targetUrl);

    if (!check.isValidUae) {
      // Cease fetching immediately - no network request, no loading spinner
      setIsCalculating(false);
      setExtractionStatusText('');
      setProductData(null);
      setSelectedVariant(null);
      setFailedUrl(null);

      if (check.isOutsideUae) {
        // Targeted professional guidance for Sephora or Amazon outside Dubai
        setNonUaeNotice(check);
        setErrorMessage(null);
      } else {
        // Completely unsupported or invalid store
        setNonUaeNotice(null);
        setErrorMessage(check.userMessage);
      }
      return;
    }

    // Passed pre-flight check: confirmed Sephora UAE, Amazon UAE, Lookfantastic, or Trendyol
    setNonUaeNotice(null);
    setErrorMessage(null);
    setFailedUrl(null);
    setImageLoadFailed(false);
    setIsCalculating(true);
    setOrderSuccess(false);
    setExtractionStatusText(
      check.store === 'trendyol'
        ? 'در حال استعلام قیمت و مشخصات کالا از ترندیول...'
        : check.store === 'lookfantastic'
          ? 'در حال استعلام قیمت و مشخصات کالا از لوک‌فنتستیک...'
          : 'در حال استعلام قیمت رسمی و مشخصات کالا از دبی...'
    );

    let failureReason = 'عدم امکان دریافت خودکار مشخصات یا قیمت کالا از لینک ارسال‌شده.';

    try {
      const response = await fetch('/api/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success && data.product && typeof data.product.originalPrice === 'number' && data.product.originalPrice > 0) {
        setProductData(data.product);

        if (data.product.variants && data.product.variants.length > 0) {
          const initialVar =
            (data.product.selectedVariantId
              ? data.product.variants.find((v: ProductVariant) => v.id === data.product.selectedVariantId)
              : null) ||
            data.product.variants.find((v: ProductVariant) => v.inStock) ||
            data.product.variants[0];
          setSelectedVariant(initialVar);
          setCustomerNotes(`مدل / شید انتخابی: ${initialVar.name}`);
        } else {
          setSelectedVariant(null);
          setCustomerNotes(data.product.shadeOrSize ? `مدل / سایز: ${data.product.shadeOrSize}` : '');
        }

        setFailedUrl(null);
        setIsCalculating(false);
        setExtractionStatusText('');
        return;
      } else if (data && data.error) {
        failureReason = data.error;
      }
    } catch (err: any) {
      console.warn('Backend extraction error:', err);
      failureReason = 'عدم برقراری ارتباط با سرور استعلام کالا. لطفاً مجدداً تلاش نمایید.';
    }

    // STRICT: Under NO circumstances use mock data, simulated items, or placeholder prices on failed fetch.
    setErrorMessage(failureReason);
    setProductData(null);
    setSelectedVariant(null);
    setFailedUrl(targetUrl);
    setIsCalculating(false);
    setExtractionStatusText('');
  };

  useEffect(() => {
    if (initialUrl && initialUrl.trim()) {
      parseAndCalculate(initialUrl);
    }
  }, [initialUrl]);

  const handleCalculateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseAndCalculate(inputUrl);
  };

  // Pricing calculations based on formulaConfig and detected source currency.
  // For Lookfantastic, price is always converted to UAE Dirhams (AED) first, then calculated.
  const rawActivePrice = selectedVariant?.price && selectedVariant.price > 0
    ? selectedVariant.price
    : (productData ? productData.originalPrice : 0);
  const needsLookfantasticAedFallback =
    productData?.store === 'lookfantastic' &&
    (productData.originalCurrency || '').trim().toUpperCase() !== 'AED';
  const rawCurrencyInfo = getCurrencyDetails(productData?.originalCurrency, formulaConfig);
  const aedInfo = getCurrencyDetails('AED', formulaConfig);

  const originalPrice = needsLookfantasticAedFallback && aedInfo.rate > 0
    ? Math.round(((rawActivePrice * rawCurrencyInfo.rate) / aedInfo.rate) * 100) / 100
    : rawActivePrice;
  const currencyInfo = needsLookfantasticAedFallback ? aedInfo : rawCurrencyInfo;

  const sourceOriginalCurrency = needsLookfantasticAedFallback
    ? rawCurrencyInfo.code
    : productData?.sourceOriginalCurrency;
  const sourceOriginalPrice = needsLookfantasticAedFallback
    ? rawActivePrice
    : (selectedVariant?.sourcePrice && selectedVariant.sourcePrice > 0
        ? selectedVariant.sourcePrice
        : productData?.sourceOriginalPrice);

  const baseTomanPrice = Math.round(originalPrice * currencyInfo.rate);
  const airShippingCost = Math.round(((productData?.weightGrams || 100) / 100) * formulaConfig.shippingPer100g);
  const customsAndInsurance = Math.round(baseTomanPrice * (formulaConfig.customsRatePercent / 100));
  const varaServiceFee = Math.round(baseTomanPrice * (formulaConfig.varaFeePercent / 100));
  const promotionalDiscount = Math.min(
    formulaConfig.maxDiscountToman, 
    Math.round(baseTomanPrice * (formulaConfig.discountPercent / 100))
  );
  const finalPriceToman = baseTomanPrice + airShippingCost + customsAndInsurance + varaServiceFee - promotionalDiscount;
  const originLabel = getOriginLabel(productData?.store, currencyInfo.code, productData?.storeUrl);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = customerPhone.trim();
    if (!cleanPhone) {
      setOrderErrorMessage('لطفاً شماره تماس خود را وارد نمایید.');
      return;
    }
    if (!acceptedPolicies) {
      setOrderErrorMessage('لطفاً پیش از ثبت سفارش، قوانین خرید بین‌المللی (لغو ۴ ساعته / ۱۰٪ کارمزد) و شرایط بازگشت را تایید فرمایید.');
      return;
    }
    if (!productData) return;

    setIsSubmittingOrder(true);
    setOrderErrorMessage('');

    try {
      const activeUser = user || getLocalUserSession();
      const variantTitle = selectedVariant ? selectedVariant.name : (productData.shadeOrSize || '');
      const activeImg = selectedVariant?.image || productData.image || '';
      const orderNumber = `VARA-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrderData = {
        orderNumber,
        userId: activeUser?.uid,
        userEmail: activeUser?.email,
        customer: {
          name: activeUser?.displayName || 'مشتری سفارش مستقیم خارجی',
          phone: cleanPhone,
          email: activeUser?.email,
          province: activeUser?.address?.province || 'ایران',
          city: activeUser?.address?.city || 'تهران',
          address: activeUser?.address?.fullAddress || `سفارش مستقیم و استعلام فوری از لینک خارجی (${productData.storeName})`,
          postalCode: activeUser?.address?.postalCode || '1111111111',
          notes: `سفارش اختصاصی از ${productData.storeName} (${productData.storeUrl})${variantTitle ? ` | مدل/شید: ${variantTitle}` : ''} | [تایید قوانین سفارش بین‌المللی (مهلت لغو ۴ ساعته / ۱۰٪ کارمزد)]`
        },
        items: [
          {
            productId: `dubai-${Date.now()}`,
            nameFa: `${productData.title}${variantTitle ? ` (${variantTitle})` : ''}`,
            nameEn: productData.title,
            sizeLabel: variantTitle || 'سفارش مستقیم خارجی',
            variantName: variantTitle || undefined,
            quantity: 1,
            price: finalPriceToman,
            image: activeImg
          }
        ],
        subtotal: finalPriceToman,
        discountAmount: 0,
        shippingFee: 0,
        shippingMethod: 'post_express' as const,
        totalAmount: finalPriceToman,
        paymentMethod: 'card_transfer' as const,
        paymentStatus: 'pending_verification' as const,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      const saved = await addOrderToDb(newOrderData);
      setRegisteredOrderNumber(saved?.orderNumber || orderNumber);
      setOrderSuccess(true);
      setCustomerPhone('');
    } catch (err: any) {
      console.error('Error submitting direct foreign order:', err);
      setOrderErrorMessage(err?.message || 'خطا در ثبت سفارش در پایگاه داده. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleAddToCartDubai = () => {
    if (!productData) return;
    const variantTitle = selectedVariant ? selectedVariant.name : (productData.shadeOrSize || '');
    const activeImg = selectedVariant?.image || productData.image;

    const dummyProduct: any = {
      id: `dubai-${Date.now()}`,
      nameFa: productData.title + (variantTitle ? ` (${variantTitle})` : ''),
      nameEn: productData.title,
      brand: productData.brand || 'خرید از دبی',
      category: 'all',
      price: finalPriceToman,
      originalPrice: baseTomanPrice,
      images: [activeImg],
      sizes: [{
        label: variantTitle || 'سایز استاندارد',
        labelEn: variantTitle || 'Standard',
        price: finalPriceToman,
      }],
      inStock: selectedVariant?.inStock ?? true,
      descriptionFa: `سفارش مستقیم اختصاصی از ${productData.storeName} با ضمانت اصالت ۱۰۰٪`,
      descriptionEn: productData.description || 'Direct international import',
      rating: productData.rating || 5,
      reviewCount: productData.reviewsCount || 1,
    };

    const sizeObj = {
      label: variantTitle || 'سایز استاندارد',
      labelEn: variantTitle || 'Standard',
      price: finalPriceToman,
    };

    if (onAddToCart) {
      onAddToCart(dummyProduct, sizeObj);
    }
  };

  const handleCopyInvoice = () => {
    if (!productData) return;
    const formattedPrice = Number.isInteger(originalPrice) ? originalPrice : originalPrice.toFixed(2);
    const formattedSource =
      sourceOriginalPrice && sourceOriginalCurrency && sourceOriginalCurrency !== currencyInfo.code
        ? ` (معادل ${Number.isInteger(sourceOriginalPrice) ? sourceOriginalPrice : sourceOriginalPrice.toFixed(2)} ${sourceOriginalCurrency})`
        : '';
    const variantLine = selectedVariant ? `\nمدل / شید انتخابی: ${selectedVariant.name}` : (productData.shadeOrSize ? `\nمدل / سایز: ${productData.shadeOrSize}` : '');
    const invoiceText = `پیش‌فاکتور خرید مستقیم ورا بیوتی:
محصول: ${productData.title}${variantLine}
فروشگاه مبدأ: ${productData.storeName}
قیمت در مبدأ: ${formattedPrice} ${currencyInfo.labelFa} (${currencyInfo.code})${formattedSource}
قیمت نهایی قطعی: ${finalPriceToman.toLocaleString('fa-IR')} تومان
نحوه و زمان تحویل: ارسال هوایی (تحویل ۶ تا ۸ هفته) با ضمانت اصالت ۱۰۰٪
لینک محصول: ${productData.storeUrl}`;

    navigator.clipboard.writeText(invoiceText);
    setCopiedInvoice(true);
    setTimeout(() => setCopiedInvoice(false), 2500);
  };

  return (
    <div className="min-h-screen bg-vara-canvas text-vara-ink font-vazir text-right pb-16 pt-4 sm:pt-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Breadcrumb & Back Button */}
        <div className="flex items-center justify-between border-b border-vara-line pb-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-vara-line text-xs font-bold text-vara-ink hover:bg-vara-surface hover:border-vara-tint-line transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 text-vara-rose-ink" />
            <span>بازگشت به فروشگاه ورا</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-vara-muted">
            <span className="hidden sm:inline">سرویس خرید مستقیم بین‌المللی</span>
            <span>/</span>
            <span className="font-bold text-vara-rose-ink">محاسبه‌گر هوشمند قیمت</span>
          </div>
        </div>

        {/* Hero Header Banner */}
        <div className="bg-vara-tint text-vara-ink p-6 sm:p-8 rounded-3xl border border-vara-tint-line relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/85 text-vara-rose-ink text-[11px] font-semibold font-jakarta">
              <span>DIRECT SOURCING PRICE CALCULATOR</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-semibold text-vara-ink leading-tight">
              خرید مستقیم از سفورا، آمازون، لوک‌فنتستیک و ترندیول
            </h1>

            <p className="text-xs sm:text-sm text-vara-muted-strong leading-relaxed">
              لینک کالا را وارد کنید تا قیمت واقعی ارزی (درهم، لیر، پوند یا یورو) و معادل تومانی آن با کلیه هزینه‌های حمل هوایی و ترخیص به صورت آنی محاسبه شود.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px]">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/85 text-vara-rose-ink font-medium">
                خرید مستقیم از استور رسمی
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/85 text-vara-rose-ink font-medium">
                تحویل ۶ تا ۸ هفته
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/85 text-vara-rose-ink font-medium">
                ضمانت ۱۰۰٪ اصالت بچ‌کد
              </span>
            </div>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="bg-amber-50/90 border border-amber-200 text-[#B45309] px-4 py-3 rounded-xl flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-vara-ink">توجه در استعلام لینک:</p>
              <p className="text-vara-muted-strong mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Link Input Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-vara-line shadow-vara-float space-y-3">
          <form onSubmit={handleCalculateSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1 relative">
              <input
                type="url"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="لینک کالا از Sephora.ae، Amazon.ae، Lookfantastic یا Trendyol را وارد کنید..."
                dir="ltr"
                className="w-full bg-vara-canvas border border-vara-line focus:border-vara-rose focus:bg-white rounded-full px-4 py-3 text-xs sm:text-sm outline-none font-jakarta text-left text-vara-ink transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="px-6 py-3 rounded-full bg-vara-rose hover:bg-vara-rose-hover text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 shadow-vara-float"
            >
              <span>{isCalculating ? 'در حال استعلام قیمت...' : 'محاسبه قیمت'}</span>
            </button>
          </form>

          {/* Supported Stores Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-vara-muted">
            <span className="font-semibold text-vara-muted-strong">فروشگاه‌های پشتیبانی‌شده:</span>
            <a
              href="https://www.sephora.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-vara-canvas hover:bg-vara-surface border border-vara-line text-vara-ink font-jakarta font-medium transition-colors"
            >
              sephora.ae
            </a>
            <a
              href="https://www.amazon.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-vara-canvas hover:bg-vara-surface border border-vara-line text-vara-ink font-jakarta font-medium transition-colors"
            >
              amazon.ae
            </a>
            <a
              href="https://www.lookfantastic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-vara-canvas hover:bg-vara-surface border border-vara-line text-vara-ink font-jakarta font-medium transition-colors"
            >
              lookfantastic.com
            </a>
            <a
              href="https://www.trendyol.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-vara-canvas hover:bg-vara-surface border border-vara-line text-vara-ink font-jakarta font-medium transition-colors"
            >
              trendyol.com
            </a>
          </div>
        </div>

        {/* Non-UAE Branch Guidance Card */}
        {nonUaeNotice && (
          <div className="bg-white border border-vara-rose rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-vara-rose text-white flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-vara-ink">
                    لزوم ارسال لینک از شعب امارات متحده عربی (دبی)
                  </h3>
                  <span className="text-[11px] font-jakarta text-vara-rose-ink font-bold bg-vara-surface px-2.5 py-0.5 rounded-full border border-vara-line" dir="ltr">
                    {nonUaeNotice.detectedDomain}
                  </span>
                </div>
                <p className="text-xs text-vara-muted-strong leading-relaxed pt-0.5">
                  خرید مستقیم، پلمپ مبدأ و ترخیص محموله‌های ورا بیوتی <strong>منحصراً از دبی</strong> انجام می‌پذیرد و تمامی هزینه‌ها بر پایه درهم امارات (AED) محاسبه می‌شوند. لینک ارسالی شما متعلق به شعبه {nonUaeNotice.detectedRegionName || 'خارج از امارات'} است.
                </p>
              </div>
            </div>

            <div className="p-4 bg-vara-canvas rounded-xl border border-vara-line text-xs text-vara-ink space-y-3">
              <div className="text-xs font-bold text-vara-ink">
                <span>لطفاً لینک نسخه امارات (sephora.ae یا amazon.ae) را وارد فرمایید:</span>
              </div>
              <p className="text-[11px] text-vara-muted leading-relaxed">
                جهت استعلام دقیق و ثبت سفارش، کافیست این کالا را در نسخه امارات باز نموده و لینک آن را در کادر بالا قرار دهید:
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {nonUaeNotice.extractedKeywords && nonUaeNotice.suggestedUaeSearchUrl && (
                  <a
                    href={sanitizeNavigationUrl(nonUaeNotice.suggestedUaeSearchUrl) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-vara-rose hover:bg-vara-rose-hover text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <span>جستجوی «{nonUaeNotice.extractedKeywords}» در {nonUaeNotice.suggestedUaeStoreName}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <a
                  href="https://www.sephora.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-vara-surface text-vara-ink border border-vara-line text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>ورود به سفورا امارات (sephora.ae)</span>
                  <ExternalLink className="w-3 h-3 text-vara-muted" />
                </a>

                <a
                  href="https://www.amazon.ae"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-vara-surface text-vara-ink border border-vara-line text-xs font-semibold transition-all cursor-pointer"
                >
                  <span>ورود به آمازون امارات (amazon.ae)</span>
                  <ExternalLink className="w-3 h-3 text-vara-muted" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Extraction Loading Indicator */}
        {isCalculating && (
          <div className="bg-white p-4 rounded-xl border border-vara-line flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 text-vara-rose-ink animate-spin shrink-0" />
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-bold text-vara-ink">
                  {extractionStatusText || 'در حال دریافت اطلاعات کالا از فروشگاه مبدأ...'}
                </p>
                <p className="text-[11px] text-vara-muted">
                  استعلام زنده از فروشگاه رسمی و محاسبه دقیق معادل تومانی
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-vara-rose-ink bg-vara-surface px-2.5 py-1 rounded-full border border-vara-line hidden sm:inline">
              استعلام آنلاین
            </span>
          </div>
        )}

        {/* Calculated Results Area */}
        {productData && (
          <div className="space-y-4">
            <div className="bg-white border border-vara-line rounded-xl px-4 py-2.5 flex items-center justify-between gap-2 text-vara-ink text-xs">
              <span className="font-bold">اطلاعات کالا از {productData.storeName} دریافت شد.</span>
              <span className="text-[11px] text-vara-rose-ink font-bold font-jakarta">OFFICIAL {currencyInfo.code} ESTIMATE</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
              {/* Product Media & Specs - 5 cols */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-vara-line shadow-vara-float space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-vara-surface text-vara-rose-ink border border-vara-line">
                    {productData.storeName}
                  </span>

                  <a 
                    href={sanitizeNavigationUrl(productData.storeUrl) || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-vara-muted hover:text-vara-rose-ink flex items-center gap-1 font-medium"
                  >
                    <span>مشاهده در سایت مبدأ</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Product Image */}
                {(() => {
                  const activeImg = selectedVariant?.image || productData.image;
                  const safeImgUrl = getSafeImageUrl(activeImg);
                  const showImage = Boolean(safeImgUrl && !imageLoadFailed);

                  return (
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-vara-surface border border-vara-line group flex items-center justify-center">
                      {showImage ? (
                        <img 
                          src={safeImgUrl} 
                          alt={selectedVariant ? `${productData.title} - ${selectedVariant.name}` : productData.title}
                          className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-102"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.dataset.triedDirect && activeImg) {
                              target.dataset.triedDirect = 'true';
                              let clean = activeImg.replace(/&amp;/g, '&');
                              if (clean.includes('commercecloud.salesforce.com/on/demandware.static/')) {
                                clean = clean.replace(
                                  /https?:\/\/[^\/]+\.commercecloud\.salesforce\.com\/on\/demandware\.static\//,
                                  'https://img-product.sephora.me/dw/image/v2/BKWK_PRD/on/demandware.static/'
                                );
                              } else if (clean.includes('sephora.ae/dw/image/')) {
                                clean = clean.replace('www.sephora.ae', 'img-product.sephora.me').replace('sephora.ae', 'img-product.sephora.me');
                              }
                              target.src = `https://i0.wp.com/${clean.replace(/^https?:\/\//, '')}`;
                            } else {
                              setImageLoadFailed(true);
                            }
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center text-vara-muted space-y-2">
                          <div className="w-12 h-12 rounded-lg bg-white border border-vara-line flex items-center justify-center text-vara-rose-ink">
                            <ImageOff className="w-5 h-5 stroke-[1.5]" />
                          </div>
                          <p className="text-xs font-bold text-vara-ink">تصویر کالا در فروشگاه مبدأ ارائه نشده است</p>
                          <span className="text-[11px] text-vara-muted">{productData.brand}</span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-vara-rose text-white text-[10px] px-2.5 py-1 rounded-sm font-bold">
                        <span>اصالت تضمین‌شده فروشگاه رسمی</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Title & Brand */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-vara-rose-ink uppercase tracking-[0.08em] font-jakarta block">
                    {productData.brand}
                  </span>
                  <h2 className="text-sm sm:text-base font-bold text-vara-ink leading-snug">
                    {productData.title}
                  </h2>
                  {selectedVariant ? (
                    <p className="text-xs text-vara-muted">
                      مدل / شید انتخابی: <span className="text-vara-rose-ink font-bold">{selectedVariant.name}</span>
                    </p>
                  ) : productData.shadeOrSize ? (
                    <p className="text-xs text-vara-muted">
                      مدل / سایز: <span className="text-vara-rose-ink font-bold">{productData.shadeOrSize}</span>
                    </p>
                  ) : null}
                </div>

                {/* Variants */}
                {productData.variants && productData.variants.length > 0 && (
                  <div className="pt-3 pb-1 border-t border-vara-line space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-vara-ink">
                        انتخاب شید رنگ یا سایز:
                      </span>
                      <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-2 py-0.5 rounded-full border border-vara-line">
                        {productData.variants.length} تنوع موجود
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-1.5 rounded-xl bg-vara-canvas border border-vara-line">
                      {productData.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => handleSelectVariant(v)}
                            className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-vara-rose text-white font-bold shadow-xs'
                                : 'bg-white hover:bg-vara-surface text-vara-ink border border-vara-line hover:border-vara-tint-line'
                            }`}
                            title={v.name}
                          >
                            {v.swatchImage ? (
                              <span className="w-4 h-4 rounded-full overflow-hidden shrink-0 border border-black/15 inline-block">
                                <img
                                  src={getSafeImageUrl(v.swatchImage)}
                                  alt={v.name}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </span>
                            ) : (
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSelected ? 'bg-white' : 'bg-vara-rose'}`} />
                            )}
                            <span className="truncate max-w-[130px] text-[11px]">{v.name}</span>
                            {v.price && v.price !== productData.originalPrice && (
                              <span className={`text-[10px] font-jakarta tabular-nums ${isSelected ? 'text-white/85' : 'text-vara-muted'}`}>
                                {v.price} {currencyInfo.code}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {productData.description && (
                  <div className="pt-2 border-t border-vara-line">
                    <p className="text-xs text-vara-muted-strong leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                      {productData.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div className="bg-vara-canvas p-2.5 rounded-lg border border-vara-line">
                    <span className="text-vara-muted text-[10px] block">مبدأ ارسال</span>
                    <span className="font-bold text-vara-ink">{originLabel}</span>
                  </div>
                  <div className="bg-vara-canvas p-2.5 rounded-lg border border-vara-line">
                    <span className="text-vara-muted text-[10px] block">زمان تحویل</span>
                    <span className="font-bold text-vara-ink">۶ تا ۸ هفته</span>
                  </div>
                </div>

              </div>

              {/* Transparent Pricing & Final Price Card - 7 cols */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="bg-white p-6 rounded-2xl border border-vara-line shadow-vara-float space-y-5">
                  <div className="flex items-center justify-between pb-3.5 border-b border-vara-line">
                    <h3 className="text-sm sm:text-base font-bold text-vara-ink">برآورد قیمت خرید مستقیم</h3>
                    <span className="text-[10px] text-vara-rose-ink font-bold bg-vara-surface px-2.5 py-1 rounded-full border border-vara-line">
                      پلمپ اصل مبدأ
                    </span>
                  </div>

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-vara-line/60">
                      <div>
                        <span className="text-vara-muted-strong block">
                          {sourceOriginalPrice && sourceOriginalCurrency && sourceOriginalCurrency !== currencyInfo.code
                            ? `قیمت تبدیل‌شده به ${currencyInfo.labelFa}`
                            : `قیمت رسمی در مبدأ (${currencyInfo.labelFa})`}
                        </span>
                        {sourceOriginalPrice && sourceOriginalCurrency && sourceOriginalCurrency !== currencyInfo.code && (
                          <span className="text-[11px] text-vara-muted font-jakarta block mt-0.5" dir="ltr">
                            قیمت اصلی سایت: {Number.isInteger(sourceOriginalPrice) ? sourceOriginalPrice : sourceOriginalPrice.toFixed(2)} {sourceOriginalCurrency}
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-vara-ink font-jakarta text-sm tabular-nums">
                        {Number.isInteger(originalPrice) ? originalPrice : originalPrice.toFixed(2)} {currencyInfo.code}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-vara-line/60">
                      <span className="text-vara-muted-strong">فروشگاه مبدأ</span>
                      <span className="font-bold text-vara-ink flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        <span>{productData.storeName}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-vara-line/60">
                      <span className="text-vara-muted-strong">نحوه و مدت تحویل</span>
                      <span className="font-medium text-vara-ink">
                        ارسال هوایی (تحویل ۶ تا ۸ هفته)
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-vara-line/60">
                      <span className="text-vara-muted-strong">ترخیص و تحویل</span>
                      <span className="text-[#15803D] font-bold">
                        تحویل کامل درب منزل بدون هزینه مازاد
                      </span>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="p-4 rounded-xl bg-vara-surface border border-vara-line flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-vara-ink block">
                        مبلغ نهایی و تمام‌شده
                      </span>
                      <span className="text-[11px] text-vara-muted block mt-0.5">
                        قیمت قطعی شامل کلیه هزینه‌ها تا تحویل درب منزل
                      </span>
                    </div>
                    <div className="text-left tabular-nums">
                      <span className="text-2xl sm:text-3xl font-black text-vara-rose-ink tracking-tight font-jakarta">
                        {finalPriceToman.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-xs font-bold text-vara-muted-strong mr-1.5">تومان</span>
                    </div>
                  </div>

                  {/* Order & Action Buttons */}
                  {orderSuccess ? (
                    <div className="bg-vara-canvas border border-vara-line text-vara-ink p-5 rounded-xl text-center space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-vara-ink">سفارش مستقیم شما از دبی با موفقیت ثبت شد</h4>
                      {registeredOrderNumber && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-vara-line text-xs font-jakarta font-bold text-vara-rose-ink tabular-nums">
                          <span className="font-vazir font-normal text-vara-muted">کد رهگیری سفارش:</span>
                          <span dir="ltr">{registeredOrderNumber}</span>
                        </div>
                      )}
                      <p className="text-xs text-vara-muted-strong leading-relaxed max-w-sm mx-auto">
                        سفارش شما ثبت شد و در بخش سفارش‌های حساب کاربری قابل مشاهده است. کارشناسان ما جهت هماهنگی نهایی با شما در ارتباط خواهند بود.
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {onNavigateToProfile && (
                          <button
                            type="button"
                            onClick={onNavigateToProfile}
                            className="text-xs px-4 py-2 rounded-full bg-vara-rose text-white hover:bg-vara-rose-hover font-bold cursor-pointer transition-all"
                          >
                            مشاهده در حساب کاربری
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setOrderSuccess(false);
                            setRegisteredOrderNumber('');
                          }}
                          className="text-xs text-vara-muted hover:text-vara-rose-ink hover:underline font-bold cursor-pointer px-2 py-1"
                        >
                          ثبت سفارش جدید
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      {orderErrorMessage && (
                        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{orderErrorMessage}</span>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center gap-2.5">
                        {onAddToCart && (
                          <button
                            type="button"
                            onClick={handleAddToCartDubai}
                            className="w-full sm:flex-1 py-3 px-4 rounded-full bg-vara-rose hover:bg-vara-rose-hover text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-vara-float"
                          >
                            <span>افزودن به سبد خرید</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleCopyInvoice}
                          className="w-full sm:w-auto py-3 px-4 rounded-full bg-vara-canvas hover:bg-vara-surface text-vara-ink border border-vara-line text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5 text-vara-rose-ink" />
                          <span>{copiedInvoice ? 'کپی شد' : 'کپی پیش‌فاکتور'}</span>
                        </button>
                      </div>

                      {/* Quick direct phone order input with policy consent */}
                      <form onSubmit={handleOrderSubmit} className="space-y-2.5 pt-2.5 border-t border-vara-line">
                        <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-vara-muted-strong leading-relaxed">
                          <input
                            type="checkbox"
                            checked={acceptedPolicies}
                            onChange={(e) => {
                              setAcceptedPolicies(e.target.checked);
                              if (e.target.checked && orderErrorMessage.includes('قوانین')) {
                                setOrderErrorMessage('');
                              }
                            }}
                            className="mt-0.5 w-3.5 h-3.5 accent-vara-rose rounded cursor-pointer shrink-0"
                          />
                          <span>
                            <button
                              type="button"
                              onClick={() => setActivePolicyPreview('return-policy')}
                              className="text-vara-rose-ink font-bold hover:underline cursor-pointer mx-0.5"
                            >
                              شرایط لغو ۴ ساعته (۱۰٪ کارمزد) و بازگشت کالا
                            </button>
                            {' و '}
                            <button
                              type="button"
                              onClick={() => setActivePolicyPreview('terms')}
                              className="text-vara-rose-ink font-bold hover:underline cursor-pointer mx-0.5"
                            >
                              قوانین خرید
                            </button>
                            {' را مطالعه و تایید می‌کنم.'}
                          </span>
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            type="tel"
                            required
                            disabled={isSubmittingOrder}
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="شماره تماس جهت ثبت سفارش مستقیم..."
                            dir="ltr"
                            className="flex-1 bg-vara-canvas border border-vara-line focus:border-vara-rose focus:bg-white rounded-full px-3 py-2.5 text-xs outline-none font-jakarta text-vara-ink disabled:opacity-50"
                          />
                          <button
                            type="submit"
                            disabled={isSubmittingOrder}
                            className="py-2.5 px-4 rounded-full bg-white hover:bg-vara-tint text-vara-rose-ink hover:text-vara-rose-ink border border-vara-rose text-xs font-bold transition-all shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isSubmittingOrder ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>در حال ثبت...</span>
                              </>
                            ) : (
                              <span>ثبت فوری</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>

                {/* Guarantees Box */}
                <div className="bg-white p-3.5 rounded-xl border border-vara-line grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-vara-canvas border border-vara-line">
                    <span className="font-bold text-vara-ink">ضمانت اصالت ۱۰۰٪</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-vara-canvas border border-vara-line">
                    <span className="font-bold text-vara-ink">ارسال مستقیم هوایی</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-vara-canvas border border-vara-line">
                    <span className="font-bold text-vara-ink">قیمت قطعی و تضمین‌شده</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* Support Section when fetch fails */}
        {failedUrl && !productData && !isCalculating && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-vara-line space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-vara-line">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-vara-ink">
                  عدم امکان استعلام خودکار — تماس با پشتیبانی ورا
                </h3>
                <p className="text-xs text-vara-muted mt-0.5">
                  کارشناسان خرید ورا آماده استعلام دستی و صدور پیش‌فاکتور دقیق هستند
                </p>
              </div>
            </div>

            <div className="bg-vara-canvas p-4 sm:p-5 rounded-xl border border-vara-line space-y-2 text-xs leading-relaxed text-vara-muted-strong">
              <p className="font-bold text-vara-ink">
                چرا این لینک به صورت خودکار خوانده نشد؟
              </p>
              <p>
                فروشگاه‌های خارجی مانند سفورا، آمازون، لوک‌فنتستیک و ترندیول گاهی دسترسی به برخی از صفحات را برای ربات‌های استعلام محدود می‌کنند. کارشناسان خرید ورا این محصول را به صورت دستی بررسی کرده و قیمت دقیق را برای شما ارسال خواهند کرد.
              </p>
            </div>

            <div className="bg-vara-canvas p-3.5 rounded-xl border border-vara-line flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <span className="text-vara-muted shrink-0 font-medium">لینک ارسالی شما:</span>
                <span className="font-jakarta text-[11px] text-vara-ink truncate text-left" dir="ltr">
                  {failedUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(failedUrl);
                  setCopiedInvoice(true);
                  setTimeout(() => setCopiedInvoice(false), 2000);
                }}
                className="px-3 py-1.5 rounded-full bg-white hover:bg-vara-surface text-vara-ink border border-vara-line text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1"
              >
                <Copy className="w-3 h-3 text-vara-rose-ink" />
                <span>{copiedInvoice ? 'کپی شد' : 'کپی لینک'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={`https://api.whatsapp.com/send?phone=989120000000&text=${encodeURIComponent(
                  `سلام و وقت بخیر، می‌خواستم قیمت و شرایط سفارش این محصول از دبی را استعلام کنم:\n${failedUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-vara-canvas hover:bg-vara-surface border border-vara-line hover:border-vara-tint-line text-vara-ink transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-vara-rose text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-vara-ink">ارسال لینک در واتساپ</span>
              </a>

              <a
                href={`https://t.me/varabeauty_support?text=${encodeURIComponent(
                  `سلام، استعلام قیمت این کالا از دبی:\n${failedUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-vara-canvas hover:bg-vara-surface border border-vara-line hover:border-vara-tint-line text-vara-ink transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-vara-rose text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-vara-ink">ارسال در تلگرام</span>
              </a>
            </div>
          </div>
        )}

        {/* Clean Empty Initial State Guide */}
        {!productData && !failedUrl && !isCalculating && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-vara-line shadow-vara-float space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-vara-ink">
                راهنمای استعلام و خرید آنلاین از فروشگاه‌های بین‌المللی
              </h3>
              <p className="text-xs text-vara-muted leading-relaxed">
                کافی است لینک محصول مورد نظر خود را در کادر بالا قرار دهید تا محاسبات دقیق قیمت با نرخ روز ارز انجام شود.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-vara-canvas border border-vara-line space-y-2">
                <div className="w-7 h-7 rounded-md bg-vara-rose text-white flex items-center justify-center font-bold font-jakarta text-xs">
                  01
                </div>
                <h4 className="font-bold text-vara-ink">کپی لینک از فروشگاه</h4>
                <p className="text-vara-muted-strong leading-relaxed text-[11px]">
                  وارد سایت sephora.ae، amazon.ae، lookfantastic یا trendyol.com شوید و آدرس صفحه محصول دلخواهتان را کپی کنید.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-vara-canvas border border-vara-line space-y-2">
                <div className="w-7 h-7 rounded-md bg-vara-rose text-white flex items-center justify-center font-bold font-jakarta text-xs">
                  02
                </div>
                <h4 className="font-bold text-vara-ink">محاسبه شفاف هزینه‌ها</h4>
                <p className="text-vara-muted-strong leading-relaxed text-[11px]">
                  سیستم هوشمند ورا قیمت ارزی کالا، هزینه حمل هوایی، ترخیص و بیمه را به صورت شفاف محاسبه می‌کند.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-vara-canvas border border-vara-line space-y-2">
                <div className="w-7 h-7 rounded-md bg-vara-rose text-white flex items-center justify-center font-bold font-jakarta text-xs">
                  03
                </div>
                <h4 className="font-bold text-vara-ink">تحویل درب منزل با پلمپ</h4>
                <p className="text-vara-muted-strong leading-relaxed text-[11px]">
                  پس از ثبت سفارش، تیم خرید ورا سفارش را از فروشگاه اصلی تهیه کرده و با پلمپ اورجینال تحویل می‌دهد.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-vara-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-vara-muted">
              <span>ضمانت ۱۰۰٪ اصالت و ارائه فاکتور رسمی خرید از فروشگاه‌های معتبر بین‌المللی</span>
              <a 
                href="tel:02188888888" 
                className="text-vara-rose-ink hover:underline font-bold"
              >
                <span>نیاز به راهنمایی دارید؟ تماس با پشتیبانی (۰۲۱-۸۸۸۸۸۸۸۸)</span>
              </a>
            </div>
          </div>
        )}

      </div>

      <PolicyReaderModal
        policyType={activePolicyPreview}
        onClose={() => setActivePolicyPreview(null)}
        onSwitchPolicy={(p) => setActivePolicyPreview(p)}
      />
    </div>
  );
};
