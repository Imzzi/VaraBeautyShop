import { Modal } from './Modal';
import React, { useState } from 'react';
import { 
  X, CheckCircle2, CreditCard, Printer, 
  Building, Phone, User, UploadCloud, 
  ArrowRight, AlertCircle, Copy, ShieldCheck
} from 'lucide-react';
import { CartItem, Order, OrderCustomer, OrderItem, ShippingMethodType, PaymentMethodType, UserProfile } from '../types';
import { addOrderToDb, getCustomerAuthHeaders } from '../lib/db';
import { formatToman } from '../utils/currency';
import { getLocalShippingSettings, subscribeToShippingSettings, ShippingSettings } from '../lib/shippingSettings';
import { PolicyReaderModal } from './LegalPoliciesPage';
import { PolicyDocumentType } from '../data/policies';

export type CheckoutDeliveryDraft = Partial<
  Pick<OrderCustomer, 'name' | 'phone' | 'province' | 'city' | 'address' | 'postalCode' | 'notes'> & {
    shippingMethod: ShippingMethodType;
  }
>;

interface CheckoutModalProps {
  isOpen: boolean;
  initialDeliveryDraft: CheckoutDeliveryDraft | null;
  initialOrder?: Order | null;
  onOrderPersisted: (order: Order) => void;
  onClose: (draft: CheckoutDeliveryDraft | null) => void;
  items: CartItem[];
  discountAmount: number;
  onClearCart: () => void;
  user?: UserProfile | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  initialDeliveryDraft,
  initialOrder,
  onOrderPersisted,
  onClose,
  items,
  discountAmount,
  onClearCart,
  user,
}) => {
  const [step, setStep] = useState<'form' | 'payment' | 'receipt'>(() => initialOrder ? 'payment' : 'form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  // Profile updates can fill untouched fields without overwriting a shopper's edits.
  const [deliveryDraft, setDeliveryDraft] = useState<CheckoutDeliveryDraft>(() => initialDeliveryDraft ?? {});
  const customerName = deliveryDraft.name ?? user?.displayName ?? '';
  const phone = deliveryDraft.phone ?? user?.phoneNumber ?? '';
  const province = deliveryDraft.province ?? (user?.province || 'تهران');
  const city = deliveryDraft.city ?? (user?.city || 'تهران');
  const address = deliveryDraft.address ?? user?.address ?? '';
  const postalCode = deliveryDraft.postalCode ?? user?.postalCode ?? '';
  const notes = deliveryDraft.notes ?? '';
  const shippingMethod = deliveryDraft.shippingMethod ?? 'post_express';
  const [phoneError, setPhoneError] = useState('');
  const [postalCodeError, setPostalCodeError] = useState('');

  function updateDeliveryField<K extends keyof CheckoutDeliveryDraft>(field: K, value: CheckoutDeliveryDraft[K]) {
    setDeliveryDraft((draft) => ({ ...draft, [field]: value }));
  }

  const toEnglishDigits = (val: string) =>
    val
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632));

  const normalizeIranPhone = (val: string) => {
    let cleaned = toEnglishDigits(val).replace(/[\s\-()]/g, '');
    if (cleaned.startsWith('+98')) cleaned = '0' + cleaned.slice(3);
    else if (cleaned.startsWith('0098')) cleaned = '0' + cleaned.slice(4);
    else if (cleaned.startsWith('98') && cleaned.length === 12) cleaned = '0' + cleaned.slice(2);
    else if (cleaned.startsWith('9') && cleaned.length === 10) cleaned = '0' + cleaned;
    return cleaned;
  };

  const isValidIranPhone = (val: string) => /^09\d{9}$/.test(normalizeIranPhone(val));

  const normalizePostalCode = (val: string) => toEnglishDigits(val).replace(/[\s\-]/g, '');

  const isValidPostalCode = (val: string) => {
    const cleaned = normalizePostalCode(val);
    return /^\d{10}$/.test(cleaned) && !/^(\d)\1{9}$/.test(cleaned);
  };

  // Shipping Method & Settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(() => getLocalShippingSettings());

  React.useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToShippingSettings((settings) => {
      setShippingSettings(settings);
    });
    return () => unsubscribe();
  }, [isOpen]);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(() => initialOrder?.paymentMethod ?? 'online_gateway');
  
  // Card Transfer State
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptFileName, setReceiptFileName] = useState('');
  const [readingReceipt, setReadingReceipt] = useState(false);
  const receiptInput = React.useRef<HTMLInputElement>(null);
  const [copiedCard, setCopiedCard] = useState(false);

  // Policy Consent & Preview State
  const [acceptedPolicies, setAcceptedPolicies] = useState(Boolean(initialOrder));
  const [activePolicyPreview, setActivePolicyPreview] = useState<PolicyDocumentType | null>(null);

  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(initialOrder ?? null);

  const stepTitle = React.useRef<HTMLHeadingElement>(null);
  const previousStep = React.useRef(step);
  React.useEffect(() => {
    if (previousStep.current !== step) stepTitle.current?.focus();
    previousStep.current = step;
  }, [step]);
  
  if (!isOpen) return null;

  // Calculation Math
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.selectedVariant?.price ?? (item.selectedSize?.price ?? item.product?.price ?? 0);
    return sum + itemPrice * item.quantity;
  }, 0);
  const postExpressFee = shippingSettings.postExpressFee ?? 50000;
  
  let shippingFee = 0;
  if (shippingMethod === 'post_express') {
    shippingFee = postExpressFee;
  } else if (shippingMethod === 'courier_tehran') {
    shippingFee = 0;
  }

  const total = Math.round(Math.max(0, subtotal - discountAmount + shippingFee));
  const displayTotal = completedOrder ? completedOrder.totalAmount : total;
  const formatPrice = (price?: number) => formatToman(price);
  const directQuote = items.length === 1 && /^dubai-\d+$/.test(items[0].product?.id ?? '');

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText('6104338615659576');
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  // Client-side image compression helper (downscale to max 1200px, 75% quality JPEG)
  const compressReceiptImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_DIM) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(e.target?.result as string);
            return;
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.78));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = '';
    if (file.size > 5 * 1024 * 1024) {
      setSubmissionError('عکس رسید باید کمتر از ۵ مگابایت باشد.');
      return;
    }

    setReadingReceipt(true);
    setSubmissionError('');
    try {
      const compressed = await compressReceiptImage(file);
      if (!compressed || compressed.length > 350000) throw new Error('Receipt is too large.');
      setReceiptImage(compressed);
      setReceiptFileName(file.name);
    } catch {
      setSubmissionError('لطفاً تصویر معتبر و کوچک‌تری برای رسید انتخاب کنید.');
    } finally {
      setReadingReceipt(false);
    }
  };

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');
    setPostalCodeError('');

    if (!customerName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      const field = !customerName.trim() ? 'name' : !phone.trim() ? 'phone' : !address.trim() ? 'address' : 'postalCode';
      document.getElementById(`checkout-${field}`)?.focus();
      if (!phone.trim()) setPhoneError('وارد کردن شماره همراه الزامی است.');
      if (!postalCode.trim()) setPostalCodeError('وارد کردن کد پستی الزامی است.');
      setSubmissionError('لطفاً فیلدهای الزامی را تکمیل فرمایید.');
      return;
    }

    let hasValidationError = false;
    if (!isValidIranPhone(phone)) {
      setPhoneError('شماره همراه باید ۱۱ رقم معتبر و با ۰۹ شروع شود.');
      hasValidationError = true;
    }
    if (!isValidPostalCode(postalCode)) {
      setPostalCodeError('کد پستی باید دقیقاً ۱۰ رقم عددی معتبر باشد.');
      hasValidationError = true;
    }

    if (hasValidationError) {
      document.getElementById(isValidIranPhone(phone) ? 'checkout-postalCode' : 'checkout-phone')?.focus();
      setSubmissionError('لطفاً شماره همراه و کد پستی را به صورت صحیح وارد نمایید.');
      return;
    }

    setDeliveryDraft((draft) => ({
      ...draft,
      phone: normalizeIranPhone(phone),
      postalCode: normalizePostalCode(postalCode),
    }));
    setSubmissionError('');
    setStep('payment');
  };

  const handleFinalizeOrder = async () => {
    if (!acceptedPolicies) {
      setSubmissionError('لطفاً پیش از پرداخت، مطالعه و پذیرش قوانین خرید و شرایط بازگشت کالا را تایید فرمایید.');
      return;
    }

    if (paymentMethod === 'card_transfer' && !directQuote && !receiptImage) {
      setSubmissionError('برای ثبت کارت‌به‌کارت تصویر رسید را اضافه کنید.');
      document.getElementById('checkout-receipt-trigger')?.focus();
      return;
    }
    if (isSubmitting || readingReceipt) return;
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const orderNumber = `VARA-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product?.id || '',
        nameFa: item.product?.nameFa || 'محصول',
        nameEn: item.product?.nameEn || 'Product',
        sizeLabel: item.selectedSize?.label || 'استاندارد',
        variantId: item.selectedVariant?.id,
        variantName: item.selectedVariant?.name,
        quantity: item.quantity,
        price: item.selectedVariant?.price ?? (item.selectedSize?.price ?? item.product?.price ?? 0),
        image: item.selectedVariant?.image || item.product?.images?.[0] || ''
      }));

      // Determine active user credentials from props or local storage session
      let currentUid = user?.uid;
      let currentEmail = user?.email;
      if ((!currentUid || !currentEmail) && typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('vara_beauty_user_session');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (!currentUid && parsed.uid) currentUid = parsed.uid;
            if (!currentEmail && parsed.email) currentEmail = parsed.email;
          }
        } catch {}
      }

      const consentTag = '[تایید قوانین خرید، لغو ۴ ساعته / ۱۰٪ و شرط پلمپ و فیلم آنباکسینگ]';
      const combinedNotes = notes.trim() ? `${notes.trim()} | ${consentTag}` : consentTag;

      const newOrderData: Omit<Order, 'id'> = {
        orderNumber,
        userId: currentUid,
        userEmail: currentEmail,
        customer: {
          name: customerName.trim(),
          phone: phone.trim(),
          email: currentEmail,
          province: province.trim(),
          city: city.trim(),
          address: address.trim(),
          postalCode: postalCode.trim(),
          notes: combinedNotes
        },
        items: orderItems,
        subtotal,
        discountAmount,
        shippingFee,
        shippingMethod,
        totalAmount: total,
        paymentMethod,
        paymentStatus: 'pending_verification',
        paymentReceiptImage: paymentMethod === 'card_transfer' && receiptImage ? receiptImage : undefined,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save into Turso / SQLite Database via backend API (or reuse if retrying payment)
      const savedOrder = completedOrder || (await addOrderToDb(newOrderData));
      if (!completedOrder) {
        setCompletedOrder(savedOrder);
        onOrderPersisted(savedOrder);
      }

      // If user selected online gateway, initiate payment transaction
      if (paymentMethod === 'online_gateway') {
        try {
          const payRes = await fetch('/api/payment/zarinpal/request', {
            method: 'POST',
            headers: getCustomerAuthHeaders({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ orderId: savedOrder.id }),
          });
          const payData = await payRes.json();
          if (payRes.ok && payData.success && payData.paymentUrl) {
            onClearCart();
            // Redirect to Online Payment Gateway (keep isSubmitting true while browser navigates)
            try {
              if (window.top && window.top !== window) {
                window.top.location.href = payData.paymentUrl;
              } else {
                window.location.href = payData.paymentUrl;
              }
            } catch {
              window.location.href = payData.paymentUrl;
            }
            return;
          } else {
            setSubmissionError('سفارش ثبت شد، اما اتصال به درگاه برقرار نشد. دوباره به درگاه بروید.');
            setIsSubmitting(false);
            return;
          }
        } catch {
          setSubmissionError('سفارش ثبت شد، اما اتصال به درگاه برقرار نشد. دوباره به درگاه بروید.');
          setIsSubmitting(false);
          return;
        }
      }

      setCompletedOrder(savedOrder);
      setStep('receipt');
      onClearCart();
      setIsSubmitting(false);
    } catch (err: any) {
      console.warn('Failed to submit order to database:', err);
      setSubmissionError('سفارش ثبت نشد. اطلاعات واردشده حفظ شده است. دوباره تلاش کنید.');
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (!isSubmitting) onClose(step === 'receipt' ? null : deliveryDraft);
  };

  return (
    <Modal label="تسویه‌حساب" onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#23191E]/50 backdrop-blur-xs animate-fadeIn overflow-y-auto font-vazir">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl border border-[#F0E1E4] overflow-hidden shadow-shop-elevated p-5 sm:p-7 relative text-right my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 p-2 hover:bg-[#F5E6EB] rounded-lg text-[#785E67] hover:text-[#8C3B58] transition-colors cursor-pointer"
          aria-label="بستن"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step 1: Customer & Shipping Details */}
        {step === 'form' && (
          <form onSubmit={handleSubmitAddress} className="space-y-4 overflow-y-auto pr-1">
            <div className="border-b border-[#F0E1E4] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C3B58] font-jakarta">مرحله ۱ از ۲ · ارسال</span>
              <h2 ref={stepTitle} tabIndex={-1} className="text-lg font-bold text-[#23191E] mt-0.5">مشخصات تحویل‌گیرنده و آدرس ارسال</h2>
            </div>

            {/* Order Items Preview */}
            <div className="bg-[#F9F1F0] p-3.5 rounded-xl border border-[#F0E1E4] space-y-2 max-h-32 overflow-y-auto">
              <div className="flex justify-between items-center text-xs font-bold text-[#23191E]">
                <span>اقلام انتخاب‌شده ({items.length.toLocaleString('fa-IR')}):</span>
                <span className="text-[#8C3B58] font-jakarta tabular-nums">{formatPrice(subtotal)} تومان</span>
              </div>
              {items.map((item) => {
                const variantOrSize = item.selectedVariant ? item.selectedVariant.name : (item.selectedSize?.label || 'استاندارد');
                const unitPrice = item.selectedVariant?.price ?? (item.selectedSize?.price ?? item.product?.price ?? 0);
                return (
                  <div key={`${item.product?.id || 'item'}-${item.selectedVariant?.id || item.selectedSize?.label || 'default'}`} className="flex justify-between items-center text-xs text-[#785E67]">
                    <span className="line-clamp-1 text-[#23191E]">{item.product?.nameFa || 'محصول'} ({variantOrSize}) × {item.quantity}</span>
                    <span className="font-semibold text-[#23191E] font-jakarta tabular-nums shrink-0">{formatPrice(unitPrice * item.quantity)} تومان</span>
                  </div>
                );
              })}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="checkout-name" className="block text-xs font-semibold text-[#23191E] mb-1">نام و نام خانوادگی تحویل‌گیرنده: *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: مریم محمدی"
                    id="checkout-name" autoComplete="name" value={customerName}
                    onChange={(e) => updateDeliveryField('name', e.target.value)}
                    className="w-full text-xs py-2.5 px-3.5 pr-9 rounded-xl border border-[#F0E1E4] bg-[#FDFBF9] focus:bg-white text-[#23191E] focus:outline-none focus:border-[#8C3B58] transition-colors"
                  />
                  <User className="w-4 h-4 text-[#8C3B58] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-xs font-semibold text-[#23191E] mb-1">شماره همراه (پیامک رهگیری مرسوله): *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    maxLength={14}
                    placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    id="checkout-phone" autoComplete="tel" dir="ltr" aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? "checkout-phone-error" : undefined} value={phone}
                    onChange={(e) => {
                      updateDeliveryField('phone', e.target.value);
                      if (phoneError) setPhoneError('');
                    }}
                    onBlur={() => {
                      if (phone.trim() && !isValidIranPhone(phone)) {
                        setPhoneError('شماره همراه باید ۱۱ رقم معتبر و با ۰۹ شروع شود.');
                      } else {
                        setPhoneError('');
                      }
                    }}
                    className={`w-full text-xs py-2.5 px-3.5 pr-9 rounded-xl border bg-[#FDFBF9] focus:bg-white text-[#23191E] font-jakarta focus:outline-none transition-colors ${
                      phoneError ? 'border-rose-400 focus:border-rose-500' : 'border-[#F0E1E4] focus:border-[#8C3B58]'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-[#8C3B58] absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                {phoneError && (
                  <p id="checkout-phone-error" className="text-sm text-rose-700 mt-1">{phoneError}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-province" className="block text-xs font-semibold text-[#23191E] mb-1">استان مقصد: *</label>
                <input
                  type="text"
                  required
                  placeholder="تهران، خراسان رضوی، فارس..."
                  id="checkout-province" autoComplete="address-level1" value={province}
                  onChange={(e) => updateDeliveryField('province', e.target.value)}
                  className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#F0E1E4] bg-[#FDFBF9] focus:bg-white text-[#23191E] focus:outline-none focus:border-[#8C3B58] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="checkout-city" className="block text-xs font-semibold text-[#23191E] mb-1">شهر مقصد: *</label>
                <input
                  type="text"
                  required
                  placeholder="تهران، مشهد، شیراز، اصفهان..."
                  id="checkout-city" autoComplete="address-level2" value={city}
                  onChange={(e) => updateDeliveryField('city', e.target.value)}
                  className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#F0E1E4] bg-[#FDFBF9] focus:bg-white text-[#23191E] focus:outline-none focus:border-[#8C3B58] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="checkout-postalCode" className="block text-xs font-semibold text-[#23191E] mb-1">کد پستی (۱۰ رقمی): *</label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={12}
                  placeholder="۱۲۳۴۵۶۷۸۹۰"
                  id="checkout-postalCode" autoComplete="postal-code" dir="ltr" aria-invalid={Boolean(postalCodeError)} aria-describedby={postalCodeError ? "checkout-postalCode-error" : undefined} value={postalCode}
                  onChange={(e) => {
                    updateDeliveryField('postalCode', e.target.value);
                    if (postalCodeError) setPostalCodeError('');
                  }}
                  onBlur={() => {
                    if (postalCode.trim() && !isValidPostalCode(postalCode)) {
                      setPostalCodeError('کد پستی باید دقیقاً ۱۰ رقم عددی معتبر باشد.');
                    } else {
                      setPostalCodeError('');
                    }
                  }}
                  className={`w-full text-xs py-2.5 px-3.5 rounded-xl border bg-[#FDFBF9] focus:bg-white text-[#23191E] font-jakarta focus:outline-none transition-colors ${
                    postalCodeError ? 'border-rose-400 focus:border-rose-500' : 'border-[#F0E1E4] focus:border-[#8C3B58]'
                  }`}
                />
                {postalCodeError && (
                  <p id="checkout-postalCode-error" className="text-sm text-rose-700 mt-1">{postalCodeError}</p>
                )}
              </div>

              <div>
                <label htmlFor="checkout-notes" className="block text-xs font-semibold text-[#23191E] mb-1">توضیحات ارسال (اختیاری):</label>
                <input
                  type="text"
                  placeholder="ساعت تحویل، هماهنگی با نگهبانی و..."
                  id="checkout-notes" autoComplete="off" value={notes}
                  onChange={(e) => updateDeliveryField('notes', e.target.value)}
                  className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#F0E1E4] bg-[#FDFBF9] focus:bg-white text-[#23191E] focus:outline-none focus:border-[#8C3B58] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-address" className="block text-xs font-semibold text-[#23191E] mb-1">نشانی دقیق پستی: *</label>
              <textarea
                required
                rows={2}
                placeholder="خیابان اصلی، کوچه، پلاک، واحد..."
                id="checkout-address" autoComplete="street-address" value={address}
                onChange={(e) => updateDeliveryField('address', e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#F0E1E4] bg-[#FDFBF9] focus:bg-white text-[#23191E] focus:outline-none focus:border-[#8C3B58] transition-colors"
              />
            </div>

            {/* Shipping Method Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-[#23191E]">روش ارسال سفارش:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={shippingMethod === 'post_express'}
                  onClick={() => updateDeliveryField('shippingMethod', 'post_express')}
                  className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                    shippingMethod === 'post_express'
                      ? 'bg-[#8C3B58] text-white border-[#8C3B58]'
                      : 'bg-[#F9F1F0] text-[#23191E] border-[#F0E1E4] hover:border-[#D48C9E]'
                  }`}
                >
                  <div className="text-xs font-bold">
                    <span>پست پیشتاز سراسری</span>
                  </div>
                  <span className={`text-[11px] font-semibold mt-1 ${shippingMethod === 'post_express' ? 'text-white/80' : 'text-[#785E67]'}`}>
                    {`${formatPrice(postExpressFee)} تومان`}
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={shippingMethod === 'courier_tehran'}
                  onClick={() => updateDeliveryField('shippingMethod', 'courier_tehran')}
                  className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                    shippingMethod === 'courier_tehran'
                      ? 'bg-[#8C3B58] text-white border-[#8C3B58]'
                      : 'bg-[#F9F1F0] text-[#23191E] border-[#F0E1E4] hover:border-[#D48C9E]'
                  }`}
                >
                  <div className="text-xs font-bold">
                    <span>پیک موتوری (ویژه تهران)</span>
                  </div>
                  <span className={`text-[11px] font-semibold mt-1 ${shippingMethod === 'courier_tehran' ? 'text-white/80' : 'text-[#785E67]'}`}>
                    هزینه به عهده مشتری (پس‌کرایه)
                  </span>
                </button>
              </div>
            </div>

            {submissionError && (
              <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            {/* Total Summary Footer */}
            <div className="bg-[#F9F1F0] border border-[#F0E1E4] text-[#23191E] p-4 rounded-xl flex items-center justify-between text-xs mt-2">
              <div>
                <span className="text-[#785E67]">مبلغ قابل پرداخت</span>
                <span className="block text-[#785E67]">{shippingMethod === 'post_express' ? `پست پیشتاز: ${formatPrice(shippingFee)} تومان` : 'هزینه پیک هنگام تحویل پرداخت می‌شود.'}</span>
                <span className="text-lg font-bold block text-[#8C3B58] font-jakarta tabular-nums">{formatPrice(displayTotal)} تومان</span>
              </div>
              <button
                type="submit"
                className="bg-[#8C3B58] hover:bg-[#732E47] text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.99] shadow-xs"
              >
                <span>انتخاب شیوه پرداخت</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Gateway / Card Transfer */}
        {step === 'payment' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="border-b border-[#F0E1E4] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C3B58] font-jakarta">مرحله ۲ از ۲ · پرداخت</span>
              <h2 ref={stepTitle} tabIndex={-1} className="text-lg font-bold text-[#23191E] mt-0.5">تسویه حساب و نهایی‌سازی سفارش</h2>
            </div>

            <div className="vara-status justify-between" role="status">
              <span>{completedOrder ? <>سفارش ثبت‌شده <bdi>{completedOrder.orderNumber}</bdi></> : shippingMethod === 'post_express' ? `با هزینه پست ${formatPrice(shippingFee)} تومان` : 'هزینه پیک جداگانه هنگام تحویل پرداخت می‌شود.'}</span>
              <strong>{formatPrice(displayTotal)} تومان</strong>
            </div>

            {/* Payment Method Switcher Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                aria-pressed={paymentMethod === 'online_gateway'}
                  disabled={Boolean(completedOrder) || isSubmitting}
                  onClick={() => setPaymentMethod('online_gateway')}
                className={`p-4 rounded-xl border transition-all text-right flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'online_gateway'
                    ? 'bg-[#8C3B58] text-white border-[#8C3B58] font-semibold'
                    : 'bg-[#F9F1F0] text-[#23191E] border-[#F0E1E4] hover:border-[#D48C9E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className={`w-4 h-4 ${paymentMethod === 'online_gateway' ? 'text-white' : 'text-[#8C3B58]'}`} />
                  <div>
                    <div className="text-xs">درگاه آنلاین بانکی</div>
                    <div className={`text-[10px] font-normal ${paymentMethod === 'online_gateway' ? 'text-white/75' : 'text-[#785E67]'}`}>پرداخت امن شاپرک</div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === 'online_gateway' ? 'border-white bg-white' : 'border-[#D48C9E]'}`} />
              </button>

              <button
                type="button"
                aria-pressed={paymentMethod === 'card_transfer'}
                  disabled={Boolean(completedOrder) || isSubmitting}
                  onClick={() => setPaymentMethod('card_transfer')}
                className={`p-4 rounded-xl border transition-all text-right flex items-center justify-between cursor-pointer ${
                  paymentMethod === 'card_transfer'
                    ? 'bg-[#8C3B58] text-white border-[#8C3B58] font-semibold'
                    : 'bg-[#F9F1F0] text-[#23191E] border-[#F0E1E4] hover:border-[#D48C9E]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building className={`w-4 h-4 ${paymentMethod === 'card_transfer' ? 'text-white' : 'text-[#8C3B58]'}`} />
                  <div>
                    <div className="text-xs">کارت به کارت</div>
                    <div className={`text-[10px] font-normal ${paymentMethod === 'card_transfer' ? 'text-white/75' : 'text-[#785E67]'}`}>واریز و آپلود فیش</div>
                  </div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border ${paymentMethod === 'card_transfer' ? 'border-white bg-white' : 'border-[#D48C9E]'}`} />
              </button>
            </div>

            {/* Online Gateway Channel */}
            {paymentMethod === 'online_gateway' && (
              <div className="space-y-3 p-4 bg-[#F9F1F0] border border-[#F0E1E4] rounded-xl">
                <div className="p-3.5 rounded-xl border bg-white border-[#8C3B58] ring-1 ring-[#8C3B58] text-right flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F5E6EB] text-[#8C3B58] flex items-center justify-center shrink-0 border border-[#D48C9E]/40">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-[#23191E]">
                        درگاه زرین‌پال (شاپرک)
                      </div>
                      <div className="text-[10px] text-[#785E67]">
                        کلیه کارت‌های عضو شبکه شتاب
                      </div>
                    </div>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full border shrink-0 border-[#8C3B58] bg-[#8C3B58]" />
                </div>
              </div>
            )}

            {/* Card to Card Bank Details & Receipt Upload */}
            {paymentMethod === 'card_transfer' && (
              <div className="space-y-3 p-4 bg-[#F9F1F0] border border-[#F0E1E4] rounded-xl">
                <div className="p-3.5 bg-white border border-[#F0E1E4] rounded-xl space-y-2 text-xs">
                  <div className="font-bold text-[#23191E] flex items-center justify-between">
                    <span>اطلاعات حساب بانکی فروشگاه ورا بیوتی:</span>
                    <button
                      type="button"
                      onClick={handleCopyCardNumber}
                      className="text-[#8C3B58] hover:underline flex items-center gap-1 text-[11px] cursor-pointer font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCard ? 'کپی شد' : 'کپی شماره کارت'}</span>
                    </button>
                  </div>
                  
                  <div dir="ltr" className="font-mono text-sm font-bold text-[#23191E] tracking-wider text-left bg-[#F5E6EB] p-2.5 rounded-lg border border-[#D48C9E]/40">
                    6104-3386-1565-9576
                  </div>
                  <div className="text-[11px] text-[#785E67] flex justify-between">
                    <span>بانک ملت</span>
                    <span>به‌نام: سمیه حاجی آقایی طبالوندانی</span>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-semibold mb-2">{directQuote ? 'تصویر رسید (اختیاری)' : 'تصویر رسید واریز (الزامی)'}</div>
                  <input type="file" ref={receiptInput} accept="image/jpeg,image/png,image/webp" onChange={handleReceiptUpload} hidden />
                  <button type="button" id="checkout-receipt-trigger" className="vara-button" disabled={readingReceipt || isSubmitting} onClick={() => receiptInput.current?.click()}>
                    <UploadCloud size={18} />
                    {readingReceipt ? 'در حال آماده‌سازی…' : receiptFileName ? <>تعویض <bdi>{receiptFileName}</bdi></> : 'انتخاب عکس رسید'}
                  </button>
                  <p className="text-xs mt-2">JPEG، PNG یا WebP · حداکثر ۵ مگابایت</p>

                  {receiptImage && (
                    <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-[#F0E1E4]">
                      <img src={receiptImage} alt="رسید" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptImage(null);
                          setReceiptFileName('');
                        }}
                        className="absolute top-1 right-1 p-1 bg-[#23191E]/70 text-white rounded-full hover:bg-[#23191E] cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recipient summary recap */}
            <div className="bg-[#F9F1F0] border border-[#F0E1E4] p-3.5 rounded-xl space-y-1 text-xs text-[#23191E]">
              <div className="flex justify-between">
                <span className="text-[#785E67]">تحویل گیرنده:</span>
                <span className="font-semibold">{customerName} ({phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#785E67]">آدرس:</span>
                <span className="font-semibold line-clamp-1">{province}، {city}، {address}</span>
              </div>
            </div>

            {/* Mandatory Legal & Return Policy Consent Checkbox */}
            <div className="p-3.5 rounded-xl bg-[#FDFBF9] border border-[#F0E1E4] space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedPolicies}
                  onChange={(e) => {
                    setAcceptedPolicies(e.target.checked);
                    if (e.target.checked && submissionError.includes('قوانین')) {
                      setSubmissionError('');
                    }
                  }}
                  className="mt-1 w-4 h-4 accent-[#8C3B58] rounded cursor-pointer shrink-0"
                />
                <span className="text-xs text-[#23191E] leading-relaxed">
                  <button
                    type="button"
                    onClick={() => setActivePolicyPreview('terms')}
                    className="text-[#8C3B58] font-bold hover:underline cursor-pointer mx-0.5"
                  >
                    قوانین و مقررات خرید
                  </button>
                  {' و '}
                  <button
                    type="button"
                    onClick={() => setActivePolicyPreview('return-policy')}
                    className="text-[#8C3B58] font-bold hover:underline cursor-pointer mx-0.5"
                  >
                    شرایط بازگشت و استرداد وجه
                  </button>
                  {' '}
                  (شامل غیرقابل بازگشت بودن کالای بازشده، الزام فیلم آنباکسینگ پیوسته و مهلت لغو ۴ ساعته با ۱۰٪ کارمزد برای سفارش‌های بین‌المللی) را مطالعه کرده و می‌پذیرم.
                </span>
              </label>
            </div>

            {submissionError && (
              <div role="alert" className="flex p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submissionError}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setSubmissionError(''); setStep('form'); }}
                disabled={isSubmitting || Boolean(completedOrder)}
                className="text-xs text-[#785E67] hover:text-[#8C3B58] font-semibold cursor-pointer py-2 px-3 rounded-lg hover:bg-[#F5E6EB]"
              >
                بازگشت و ویرایش آدرس
              </button>

              <button
                type="button"
                onClick={handleFinalizeOrder}
                disabled={isSubmitting || readingReceipt}
                className="bg-[#8C3B58] hover:bg-[#732E47] text-white px-7 py-3.5 rounded-xl text-xs font-semibold cursor-pointer active:scale-[0.99] disabled:opacity-50 shadow-xs"
              >
                <span>
                  {isSubmitting
                    ? (paymentMethod === 'online_gateway' ? `در حال انتقال به درگاه بانکی (${formatPrice(displayTotal)} تومان)...` : 'در حال ثبت سفارش...')
                    : paymentMethod === 'online_gateway'
                    ? completedOrder ? 'تلاش دوباره برای پرداخت' : `پرداخت آنلاین ${formatPrice(displayTotal)} تومان`
                    : 'ثبت نهایی سفارش کارت به کارت'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Receipt & Success Screen */}
        {step === 'receipt' && completedOrder && (
          <div className="space-y-5 text-center overflow-y-auto pr-1">
            <div className="w-14 h-14 bg-[#8C3B58] text-white rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C3B58] font-jakarta">ORDER CONFIRMED</span>
              <h2 ref={stepTitle} tabIndex={-1} className="text-xl font-bold text-[#23191E] mt-0.5">با تشکر از اعتماد شما به «ورا بیوتی»</h2>
            </div>

            {/* Receipt Box */}
            <div className="bg-[#F9F1F0] border border-[#F0E1E4] p-5 rounded-xl text-right space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-[#F0E1E4] pb-2.5 font-bold text-[#23191E]">
                <span>کد رهگیری اختصاصی سفارش:</span>
                <span className="font-mono text-sm text-[#8C3B58] bg-white px-3 py-1 rounded-lg border border-[#D48C9E]/50">
                  {completedOrder.orderNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#785E67]">نام خریدار:</span>
                <span className="font-semibold text-[#23191E]">{completedOrder.customer.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#785E67]">شماره پیگیری پیامک:</span>
                <span className="font-jakarta font-semibold text-[#23191E]">{completedOrder.customer.phone}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#785E67]">آدرس ارسال:</span>
                <span className="font-semibold text-[#23191E] line-clamp-1">{completedOrder.customer.province}، {completedOrder.customer.city}، {completedOrder.customer.address}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#785E67]">مبلغ کل سفارش:</span>
                <span className="font-bold text-[#8C3B58] font-jakarta tabular-nums">{formatPrice(completedOrder.totalAmount)} تومان</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#785E67]">روش پرداخت:</span>
                <span className="font-semibold text-[#23191E]">
                  {completedOrder.paymentMethod === 'online_gateway' ? 'درگاه آنلاین (پرداخت موفق)' : 'کارت به کارت (در انتظار تایید فیش)'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#785E67]">وضعیت سفارش:</span>
                <span className="bg-white text-[#8C3B58] font-semibold px-2.5 py-0.5 rounded-md text-[11px] border border-[#D48C9E]/50">
                  {completedOrder.status === 'processing' ? 'در نوبت پردازش و بسته‌بندی' : 'در انتظار تایید'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#785E67]">
              پیامک تایید سفارش و کد رهگیری پستی به شماره همراه شما ارسال خواهد شد.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-white hover:bg-[#F5E6EB] text-[#23191E] border border-[#F0E1E4] hover:border-[#D48C9E] px-5 py-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-[#8C3B58]" />
                <span>چاپ فاکتور</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="bg-[#8C3B58] hover:bg-[#732E47] text-white px-8 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                بازگشت به فروشگاه
              </button>
            </div>
          </div>
        )}

      </div>

      <PolicyReaderModal
        policyType={activePolicyPreview}
        onClose={() => setActivePolicyPreview(null)}
        onSwitchPolicy={(p) => setActivePolicyPreview(p)}
      />
    </Modal>
  );
};
