import { getCustomerAuthHeaders } from '../lib/db';
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, Package, Truck, 
  Printer, ArrowRight, ShieldCheck, Hash, Calendar, 
  User, MapPin, Phone, CreditCard, ShoppingBag, AlertCircle, Copy, Check
} from 'lucide-react';
import { formatToman } from '../utils/currency';
import { checkoutPaymentPath, isPendingOnlineCheckout } from '../utils/checkoutReturn';

interface OrderDetailItem {
  productId: string;
  nameFa: string;
  nameEn?: string;
  sizeLabel?: string;
  variantName?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderDetailCustomer {
  name: string;
  province?: string;
  city?: string;
  maskedPhone?: string;
  maskedAddress?: string;
}

interface SanitizedOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'pending_verification' | 'failed';
  paymentMethod: 'online_gateway' | 'card_transfer';
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  shippingMethod: string;
  createdAt: string;
  updatedAt?: string;
  postalTrackingCode?: string;
  refId?: string;
  items: OrderDetailItem[];
  customer: OrderDetailCustomer;
}

interface OrderDetailPageProps {
  orderIdentifier: string;
  onBackToHome: () => void;
  onBackToShop: () => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  orderIdentifier,
  onBackToHome,
  onBackToShop,
}) => {
  const [order, setOrder] = useState<SanitizedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingOrder, setMissingOrder] = useState(false);
  const [retry, setRetry] = useState(0);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState(false);
  const [copiedRefId, setCopiedRefId] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    setOrder(null);
    setMissingOrder(false);

    const cleanIdentifier = (orderIdentifier || '').trim();
    if (!cleanIdentifier) {
      setMissingOrder(true);
      setError('شماره سفارش نامعتبر است.');
      setLoading(false);
      return;
    }

    fetch(`/api/db/orders/lookup/${encodeURIComponent(cleanIdentifier)}`, {
      cache: 'no-store',
      headers: getCustomerAuthHeaders({ Accept: 'application/json' }),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            if (isMounted) setMissingOrder(true);
            throw new Error('سفارشی با این مشخصات یافت نشد.');
          }
          throw new Error('خطا در دریافت اطلاعات سفارش.');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          if (data.success && data.order) {
            setOrder(data.order);
          } else {
            setError(data.error || 'سفارش مورد نظر یافت نشد.');
          }
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setError(err?.message || 'ارتباط با سرور برقرار نشد.');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderIdentifier, retry]);

  const formatPrice = (p?: number) => formatToman(p);

  const formatPersianDate = (isoStr?: string) => {
    if (!isoStr) return '---';
    try {
      const date = new Date(isoStr);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return isoStr;
    }
  };

  const handleCopy = (text: string, type: 'order' | 'ref') => {
    try {
      navigator.clipboard.writeText(text);
      if (type === 'order') {
        setCopiedOrderNumber(true);
        setTimeout(() => setCopiedOrderNumber(false), 2000);
      } else {
        setCopiedRefId(true);
        setTimeout(() => setCopiedRefId(false), 2000);
      }
    } catch {}
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center font-vazir px-4">
        <div className="w-10 h-10 border-2 border-[#8C3B58] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold text-[#23191E]">در حال دریافت جزئیات سفارش...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4 font-vazir text-right">
        <div className="bg-white rounded-2xl border border-[#F0E1E4] p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#23191E]">{missingOrder ? 'سفارش یافت نشد' : 'جزئیات سفارش در دسترس نیست'}</h2>
          <p className="text-xs text-[#4A3840] leading-relaxed">
            {error || 'متأسفانه سفارشی با این شناسه یافت نشد یا ممکن است هنوز در سامانه ثبت نشده باشد.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {!missingOrder && <button type="button" className="vara-button" onClick={() => setRetry((count) => count + 1)}>تلاش دوباره</button>}
            <button
              onClick={onBackToHome}
              className="bg-[#FDFBF9] hover:bg-[#F9F1F0] text-[#23191E] border border-[#F0E1E4] text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              صفحه اصلی
            </button>
            <button
              onClick={onBackToShop}
              className="bg-[#8C3B58] hover:bg-[#732E47] text-white text-xs font-bold px-7 py-3 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              فروشگاه محصولات
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const isFailed = order.paymentStatus === 'failed' || order.status === 'cancelled';

  if (isPendingOnlineCheckout(order)) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4 font-vazir text-center">
        <div className="bg-white rounded-2xl border border-[#F0E1E4] p-8 space-y-4">
          <h1 className="text-xl font-bold text-[#23191E]">پرداخت هنوز تأیید نشده است</h1>
          <a className="vara-button inline-flex" href={checkoutPaymentPath(order.id)}>ادامهٔ پرداخت</a>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { id: 'pending', label: 'ثبت و تایید سفارش' },
    { id: 'processing', label: 'تأمین و آماده‌سازی' },
    { id: 'shipped', label: 'ارسال مرسوله' },
    { id: 'delivered', label: 'تحویل به مشتری' },
  ];

  const activeStepIndex =
    order.status === 'delivered'
      ? 3
      : order.status === 'shipped'
      ? 2
      : order.status === 'processing'
      ? 1
      : 0;

  return (
    <div className="max-w-4xl mx-auto my-8 sm:my-12 px-3 sm:px-6 font-vazir text-right space-y-6">
      
      {/* 1. Header Banner / Transaction Outcome */}
      <div className="bg-white rounded-2xl border border-[#F0E1E4] p-6 sm:p-8 space-y-6">
        {isPaid ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-right">
            <div className="w-14 h-14 rounded-xl bg-emerald-50 text-[#15803D] border border-emerald-200 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-emerald-50 text-[#15803D] border border-emerald-200 text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>پرداخت با موفقیت انجام شد</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#23191E]">
                سفارش شما با موفقیت ثبت و تایید گردید
              </h1>
              <p className="text-xs text-[#4A3840] leading-relaxed">
                با سپاس از خرید شما از فروشگاه ورا بیوتی. مرسوله شما در صف پردازش و بسته‌بندی قرار گرفته و در اسرع وقت ارسال خواهد شد.
              </p>
            </div>
          </div>
        ) : isFailed ? (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-right">
            <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <XCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>پرداخت ناموفق یا لغو شده</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#23191E]">
                تراکنش بانکی تکمیل نگردید
              </h1>
              <p className="text-xs text-[#4A3840] leading-relaxed">
                پرداخت در درگاه بانکی به سرانجام نرسید یا توسط شما لغو شد. در صورت کسر وجه از حساب، حداکثر تا ۷۲ ساعت کاری توسط بانک عودت داده می‌شود.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-right">
            <div className="w-14 h-14 rounded-xl bg-amber-50 text-[#B45309] border border-amber-200 flex items-center justify-center shrink-0">
              <Clock className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-amber-50 text-[#B45309] border border-amber-200 text-[11px] font-bold">
                <span>در انتظار تایید یا واریز</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#23191E]">
                سفارش در انتظار بررسی
              </h1>
              <p className="text-xs text-[#4A3840] leading-relaxed">
                سفارش شما در سامانه ثبت گردیده و پس از بررسی تیم پشتیبانی پردازش خواهد شد.
              </p>
            </div>
          </div>
        )}

        {/* Boutique Order Status Stepper */}
        {!isFailed && (
          <div className="pt-5 border-t border-[#F0E1E4]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {statusSteps.map((st, idx) => {
                const isCompleted = idx <= activeStepIndex;
                const isCurrent = idx === activeStepIndex;
                return (
                  <div
                    key={st.id}
                    className={`p-3 rounded-xl border transition-all flex items-center gap-2.5 ${
                      isCurrent
                        ? 'bg-[#8C3B58] text-white border-[#8C3B58] shadow-xs'
                        : isCompleted
                        ? 'bg-[#F9F1F0] text-[#8C3B58] border-[#D48C9E]'
                        : 'bg-white text-[#785E67] border-[#F0E1E4]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md text-[11px] font-jakarta font-bold flex items-center justify-center shrink-0 ${
                        isCurrent
                          ? 'bg-white text-[#8C3B58]'
                          : isCompleted
                          ? 'bg-[#8C3B58] text-white'
                          : 'bg-[#F9F1F0] text-[#785E67]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold truncate">{st.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Key Order Meta Specs Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#F0E1E4] space-y-1">
          <div className="text-[11px] text-[#785E67] flex items-center gap-1">
            <Hash className="w-3.5 h-3.5 text-[#8C3B58]" />
            <span>شماره سفارش:</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-jakarta text-xs sm:text-sm font-bold text-[#23191E] tabular-nums" dir="ltr">
              {order.orderNumber}
            </span>
            <button
              onClick={() => handleCopy(order.orderNumber, 'order')}
              className="text-[#785E67] hover:text-[#8C3B58] p-1 rounded-md transition-colors cursor-pointer"
              title="کپی شماره سفارش"
            >
              {copiedOrderNumber ? <Check className="w-3.5 h-3.5 text-[#15803D]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#F0E1E4] space-y-1">
          <div className="text-[11px] text-[#785E67] flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#8C3B58]" />
            <span>تاریخ ثبت:</span>
          </div>
          <div className="text-xs font-bold text-[#23191E]">
            {formatPersianDate(order.createdAt)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#F0E1E4] space-y-1">
          <div className="text-[11px] text-[#785E67] flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-[#8C3B58]" />
            <span>شیوه پرداخت:</span>
          </div>
          <div className="text-xs font-bold text-[#23191E]">
            {order.paymentMethod === 'online_gateway' ? 'درگاه آنلاین شاپرک' : 'کارت به کارت'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#F0E1E4] space-y-1">
          <div className="text-[11px] text-[#785E67] flex items-center gap-1">
            <Package className="w-3.5 h-3.5 text-[#8C3B58]" />
            <span>وضعیت سفارش:</span>
          </div>
          <div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm border inline-block ${
              order.status === 'delivered'
                ? 'bg-emerald-50 text-[#15803D] border-emerald-200'
                : order.status === 'cancelled'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-[#F5E6EB] text-[#8C3B58] border-[#D48C9E]/40'
            }`}>
              {order.status === 'processing'
                ? 'در حال آماده‌سازی'
                : order.status === 'shipped'
                ? 'تحویل به پست'
                : order.status === 'delivered'
                ? 'تحویل شده'
                : order.status === 'cancelled'
                ? 'لغو شده'
                : 'در انتظار'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bank Ref ID Card */}
      {order.refId && (
        <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#15803D] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#15803D]" />
            <span>کد پیگیری تراکنش بانکی:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-jakarta font-bold text-sm text-[#23191E] bg-white px-3 py-1 rounded-lg border border-emerald-200 tabular-nums">
              {order.refId}
            </span>
            <button
              onClick={() => handleCopy(order.refId!, 'ref')}
              className="text-[#15803D] hover:bg-emerald-100 p-1.5 rounded-md transition-colors cursor-pointer"
              title="کپی کد رهگیری بانکی"
            >
              {copiedRefId ? <Check className="w-4 h-4 text-[#15803D]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* 4. Postal Tracking Code Card */}
      {order.postalTrackingCode && (
        <div className="bg-[#F9F1F0] border border-[#8C3B58] p-4 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#8C3B58] font-bold">
            <Truck className="w-4 h-4 text-[#8C3B58]" />
            <span>کد رهگیری پستی مرسوله:</span>
          </div>
          <span className="font-jakarta font-bold tracking-wider text-[#23191E] bg-white px-3 py-1 rounded-lg border border-[#F0E1E4] tabular-nums">
            {order.postalTrackingCode}
          </span>
        </div>
      )}

      {/* 5. Main Content Grid: Delivery Info & Itemized Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Ordered Products Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#F0E1E4] p-5 sm:p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#23191E] border-b border-[#F0E1E4] pb-3 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#8C3B58]" />
            <span>اقلام خریداری شده ({order.items.length})</span>
          </h3>

          <div className="divide-y divide-[#F0E1E4]">
            {order.items.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nameFa}
                      className="w-14 h-14 object-cover rounded-lg bg-[#F9F1F0] border border-[#F0E1E4] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-[#F9F1F0] border border-[#F0E1E4] flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5 text-[#785E67]" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#23191E] line-clamp-1">{item.nameFa}</div>
                    {item.nameEn && (
                      <div className="text-[10px] text-[#785E67] line-clamp-1 font-jakarta">{item.nameEn}</div>
                    )}
                    <div className="text-[11px] text-[#4A3840] font-medium mt-0.5 tabular-nums">
                      {item.variantName || item.sizeLabel || 'استاندارد'} × {item.quantity} عدد
                    </div>
                  </div>
                </div>

                <div className="text-left shrink-0 tabular-nums">
                  <div className="text-xs font-bold text-[#23191E] font-jakarta">
                    {formatPrice(item.price * item.quantity)} تومان
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-[10px] text-[#785E67]">
                      هر عدد {formatPrice(item.price)} تومان
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown Summary */}
          <div className="border-t border-[#F0E1E4] pt-4 space-y-2 text-xs tabular-nums">
            <div className="flex justify-between text-[#4A3840]">
              <span>جمع اقلام:</span>
              <span className="font-bold text-[#23191E]">{formatPrice(order.subtotal)} تومان</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#15803D] font-bold">
                <span>تخفیف سفارش:</span>
                <span>- {formatPrice(order.discountAmount)} تومان</span>
              </div>
            )}
            <div className="flex justify-between text-[#4A3840]">
              <span>هزینه بسته‌بندی و ارسال:</span>
              <span className="font-bold text-[#23191E]">
                {order.shippingFee === 0 ? 'رایگان' : `${formatPrice(order.shippingFee)} تومان`}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-[#23191E] border-t border-[#F0E1E4] pt-3">
              <span>مبلغ کل:</span>
              <span className="text-base text-[#8C3B58] font-jakarta font-black">{formatPrice(order.totalAmount)} تومان</span>
            </div>
          </div>
        </div>

        {/* Recipient and Shipping Summary (Security-Masked) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-[#F0E1E4] p-5 space-y-3.5 text-xs">
            <h3 className="font-bold text-[#23191E] border-b border-[#F0E1E4] pb-2.5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#8C3B58]" />
              <span>مشخصات تحویل گیرنده</span>
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[#785E67] flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>نام گیرنده:</span>
                </span>
                <span className="font-bold text-[#23191E]">{order.customer.name}</span>
              </div>

              {order.customer.maskedPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-[#785E67] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>شماره همراه:</span>
                  </span>
                  <span className="font-jakarta font-bold text-[#23191E] tabular-nums" dir="ltr">{order.customer.maskedPhone}</span>
                </div>
              )}

              <div className="border-t border-[#F0E1E4] pt-2 space-y-1">
                <div className="text-[#785E67] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C3B58]" />
                  <span>شهر و استان:</span>
                </div>
                <div className="font-bold text-[#23191E] pr-4">
                  {order.customer.province ? `${order.customer.province}، ${order.customer.city || ''}` : 'ثبت شده'}
                </div>
              </div>

              <div className="border-t border-[#F0E1E4] pt-2 space-y-1">
                <span className="text-[#785E67]">شیوه ارسال:</span>
                <div className="font-bold text-[#23191E]">
                  {order.shippingMethod === 'courier_tehran' ? 'پیک موتوری (ویژه تهران)' : 'پست پیشتاز سراسری'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl border border-[#F0E1E4] p-4 flex flex-col gap-2.5">
            <button
              onClick={handlePrint}
              className="w-full bg-[#FDFBF9] hover:bg-[#F9F1F0] text-[#23191E] font-bold text-xs py-3 rounded-xl border border-[#F0E1E4] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#785E67]" />
              <span>چاپ فاکتور سفارش</span>
            </button>

            <button
              onClick={onBackToShop}
              className="w-full bg-[#8C3B58] hover:bg-[#732E47] text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
            >
              <span>بازگشت به فروشگاه ورا بیوتی</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
