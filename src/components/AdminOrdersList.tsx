import { Modal } from './Modal';
import { fetchOrderReceipt } from '../lib/db';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ShoppingBag, Search, RefreshCw, CheckCircle2, Clock, 
  Truck, AlertCircle, Eye, Printer, Phone, 
  Calendar, Trash2, X, XCircle,
  Package, Hash
} from 'lucide-react';
import { Order, OrderStatus, OrderItem, OrderStats } from '../types';
import { 
  subscribeToOrderChanges,
  updateOrderStatusInDb, 
  updateOrderPaymentInDb, 
  deleteOrderFromDb,
  fetchOrderPage
} from '../lib/db';
import {
  getLocalShippingSettings,
  subscribeToShippingSettings,
  saveShippingSettings,
} from '../lib/shippingSettings';

interface AdminOrdersListProps {
  stats?: OrderStats;
}

export const AdminOrdersList: React.FC<AdminOrdersListProps> = ({ stats }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [cursors, setCursors] = useState<string[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string>();
  const [lastUpdated, setLastUpdated] = useState<number>();
  const loadedFilter = useRef('');
  const activeFilter = JSON.stringify([searchQuery, statusFilter, cursors.at(-1)]);
  const visibleOrders = loadedFilter.current === activeFilter ? orders : [];
  const requestNumber = useRef(0);

  const setStatusFilter = (status: 'all' | OrderStatus) => {
    setCursors([]);
    setOrderStatusFilter(status);
  };
  const changeSearch = (value: string) => {
    setCursors([]);
    setSearchQuery(value);
  };
  
  // Modals
  const [selectedReceiptImage, setSelectedReceiptImage] = useState<string | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [trackingModal, setTrackingModal] = useState<{
    isOpen: boolean;
    orderId: string;
    orderNumber: string;
    currentCode: string;
  } | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);

  // Shipping Fee Settings State
  const [postExpressFeeInput, setPostExpressFeeInput] = useState<number | ''>(() => getLocalShippingSettings().postExpressFee);
  const postExpressFeeRef = useRef<number>(getLocalShippingSettings().postExpressFee);
  const isDirtyShippingFeeRef = useRef(false);
  const [savingShippingFee, setSavingShippingFee] = useState(false);
  const [shippingSavedSuccess, setShippingSavedSuccess] = useState(false);
  const [shippingSaveError, setShippingSaveError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToShippingSettings((settings) => {
      if (!isDirtyShippingFeeRef.current) {
        postExpressFeeRef.current = settings.postExpressFee;
        setPostExpressFeeInput(settings.postExpressFee);
      }
    });
    return () => unsub();
  }, []);

  const handleSaveShippingFee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingShippingFee(true);
    setShippingSaveError(null);
    const rawVal = postExpressFeeInput !== '' ? Number(postExpressFeeInput) : postExpressFeeRef.current;
    const cleanFee = Math.max(0, Math.floor(Number.isFinite(rawVal) ? rawVal : 0));
    isDirtyShippingFeeRef.current = false;
    postExpressFeeRef.current = cleanFee;
    setPostExpressFeeInput(cleanFee);
    try {
      await saveShippingSettings({
        postExpressFee: cleanFee,
      });
      setShippingSavedSuccess(true);
      setTimeout(() => setShippingSavedSuccess(false), 2500);
    } catch {
      setShippingSaveError('خطا در ذخیره هزینه پست');
      setTimeout(() => setShippingSaveError(null), 4000);
    } finally {
      setSavingShippingFee(false);
    }
  };

  const cursor = cursors.at(-1);
  const handleManualRefresh = useCallback(async () => {
    const request = ++requestNumber.current;
    setIsRefreshing(true);
    try {
      const page = await fetchOrderPage({ cursor, query: searchQuery, status: statusFilter });
      if (request !== requestNumber.current) return;
      loadedFilter.current = activeFilter;
      setOrders(page.orders);
      setLastUpdated(Date.now());
      setNextCursor(page.nextCursor);
      setFetchError(undefined);
    } catch (error) {
      if (request === requestNumber.current) {
        setFetchError(error instanceof Error ? error.message : 'دریافت سفارش‌ها انجام نشد.');
      }
    } finally {
      if (request === requestNumber.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [cursor, searchQuery, statusFilter, activeFilter]);

  useEffect(() => {
    const timer = window.setTimeout(handleManualRefresh, 200);
    const unsubscribe = subscribeToOrderChanges(handleManualRefresh);
    return () => {
      requestNumber.current++;
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [handleManualRefresh]);

  // Format Persian Currency / Numbers
  const formatPrice = (price: number) => (Number(price) || 0).toLocaleString('fa-IR');

  const parseNumericInput = (val: string): number | '' => {
    const english = val
      .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
      .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
      .replace(/[^0-9]/g, '');
    return english !== '' ? parseInt(english, 10) : '';
  };

  // Format Persian Date
  const formatPersianDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Status Labels & Color Schemes
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'در انتظار بررسی / واریز',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Clock
        };
      case 'processing':
        return {
          label: 'در حال بسته‌بندی',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          icon: Package
        };
      case 'shipped':
        return {
          label: 'ارسال شده به پست',
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          icon: Truck
        };
      case 'delivered':
        return {
          label: 'تحویل داده شده',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: CheckCircle2
        };
      case 'cancelled':
        return {
          label: 'لغو شده',
          bg: 'bg-rose-50 text-rose-800 border-rose-200',
          icon: XCircle
        };
      default:
        return {
          label: status,
          bg: 'bg-gray-50 text-gray-800 border-gray-200',
          icon: Clock
        };
    }
  };

  const getPaymentBadge = (method: string, status: string) => {
    if (method === 'online_gateway') {
      if (status === 'paid') {
        return {
          label: 'پرداخت آنلاین (موفق)',
          bg: 'bg-emerald-100 text-emerald-800'
        };
      }
      if (status === 'failed') {
        return {
          label: 'پرداخت آنلاین (ناموفق / لغو شده)',
          bg: 'bg-rose-100 text-rose-800'
        };
      }
      return {
        label: 'پرداخت آنلاین (در انتظار تراکنش)',
        bg: 'bg-amber-100 text-amber-900'
      };
    }
    if (status === 'paid') {
      return {
        label: 'کارت به کارت (فیش تأیید شد)',
        bg: 'bg-emerald-100 text-emerald-800'
      };
    }
    if (status === 'failed') {
      return {
        label: 'کارت به کارت (رد شده)',
        bg: 'bg-rose-100 text-rose-800'
      };
    }
    return {
      label: 'کارت به کارت (در انتظار تأیید فیش)',
      bg: 'bg-amber-100 text-amber-900'
    };
  };

  const totalOrdersCount = stats?.total ?? 0;
  const pendingOrdersCount = stats?.pending ?? 0;
  const processingOrdersCount = stats?.processing ?? 0;
  const shippedOrdersCount = stats?.shipped ?? 0;
  const cancelledOrdersCount = stats?.cancelled ?? 0;
  const totalRevenue = stats?.revenue ?? 0;

  // Status Change Handler (Immediate optimistic update with automatic error rollback)
  const handleStatusChange = async (order: Order, newStatus: OrderStatus, trackingCode?: string) => {
    const previousOrders = [...orders];

    // 1. Optimistic UI update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: newStatus,
              postalTrackingCode: trackingCode !== undefined ? trackingCode : o.postalTrackingCode,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    try {
      setActionLoadingId(order.id);
      await updateOrderStatusInDb(order.id, newStatus, trackingCode);
    } catch (err) {
      console.error('Error changing order status:', err);
      setOrders(previousOrders);
      alert('خطا در تغییر وضعیت سفارش. تغییرات به حالت قبل بازگردانده شدند.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Confirm Postal Tracking Code (Optional with automatic error rollback)
  const handleSaveTrackingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModal) return;

    const previousOrders = [...orders];
    const trimmed = trackingInput.trim();
    const targetOrder = orders.find((o) => o.id === trackingModal.orderId);
    const targetStatus = targetOrder?.status === 'pending' ? 'shipped' : (targetOrder?.status || 'shipped');

    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) =>
        o.id === trackingModal.orderId
          ? {
              ...o,
              status: targetStatus,
              postalTrackingCode: trimmed || undefined,
              updatedAt: new Date().toISOString(),
            }
          : o
      )
    );

    try {
      setActionLoadingId(trackingModal.orderId);
      await updateOrderStatusInDb(trackingModal.orderId, targetStatus, trimmed);
      setTrackingModal(null);
    } catch (err) {
      console.error('Error saving tracking code:', err);
      setOrders(previousOrders);
      alert('خطا در ثبت کد رهگیری پستی. اطلاعات بازگردانده شدند.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Verify Card Payment (with automatic error rollback)
  const handleVerifyCardPayment = async (orderId: string) => {
    const previousOrders = [...orders];
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, paymentStatus: 'paid', status: 'processing', updatedAt: new Date().toISOString() }
          : o
      )
    );
    try {
      setActionLoadingId(orderId);
      await updateOrderPaymentInDb(orderId, 'paid');
      await updateOrderStatusInDb(orderId, 'processing');
    } catch (err) {
      console.error('Error verifying payment:', err);
      setOrders(previousOrders);
      alert('خطا در تایید پرداخت. تغییرات به وضعیت قبل بازگردانده شدند.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete Order (with automatic error rollback)
  const handleDeleteOrder = async (orderId: string) => {
    const previousOrders = [...orders];
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      setActionLoadingId(orderId);
      await deleteOrderFromDb(orderId);
      setDeleteConfirmOrder(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      setOrders(previousOrders);
      alert('خطا در حذف سفارش. سفارش بازگردانده شد.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-right font-vazir">
      
      {/* 1. Quick Statistics Dashboard Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#b8b8b9]" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#454a4f]/70 truncate">کل سفارش‌ها</div>
            <div className="text-base sm:text-xl font-extrabold text-[#454a4f] font-vazir">{formatPrice(totalOrdersCount)}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500 text-[#dde2e7] flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#454a4f]/70 truncate">نیازمند بررسی</div>
            <div className="text-base sm:text-xl font-extrabold text-amber-700 font-vazir">{formatPrice(pendingOrdersCount)}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-sm flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-blue-600 text-[#dde2e7] flex items-center justify-center shrink-0">
            <Package className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#454a4f]/70 truncate">در حال بسته‌بندی</div>
            <div className="text-base sm:text-xl font-extrabold text-blue-700 font-vazir">{formatPrice(processingOrdersCount)}</div>
          </div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-2xs flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] sm:text-[11px] font-bold text-[#788089] truncate">مجموع فروش نهایی</div>
            <div className="text-xs sm:text-base font-extrabold text-[#454a4f] font-vazir truncate">{formatPrice(totalRevenue)} ت</div>
          </div>
        </div>
      </div>

      {/* 1.5 Shipping Fee Settings Bar */}
      <form
        onSubmit={handleSaveShippingFee}
        className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#eff2f4] text-[#454a4f] flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-[#949c91]" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-extrabold text-[#454a4f] font-vazir">تنظیم هزینه ارسال پست پیشتاز</div>
            <div className="text-[11px] text-[#788089] font-vazir">
              پیک موتوری تهران: پس‌کرایه (به عهده مشتری)
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:w-44">
            <input
              type="text"
              inputMode="numeric"
              placeholder="۵۰٬۰۰۰"
              value={postExpressFeeInput === '' ? '' : formatPrice(postExpressFeeInput)}
              onChange={(e) => {
                const parsed = parseNumericInput(e.target.value);
                isDirtyShippingFeeRef.current = true;
                postExpressFeeRef.current = parsed === '' ? 0 : parsed;
                setPostExpressFeeInput(parsed);
              }}
              className="w-full bg-[#eff2f4] rounded-xl pl-12 pr-3.5 py-2 text-xs font-vazir font-bold text-[#454a4f] focus:outline-none focus:border-[#949c91] border border-transparent"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#788089] font-vazir">
              تومان
            </span>
          </div>
          <button
            type="submit"
            disabled={savingShippingFee}
            className="px-4 py-2 rounded-xl text-xs font-bold font-vazir bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {savingShippingFee ? 'در حال ذخیره...' : shippingSavedSuccess ? 'ذخیره شد ✓' : 'ذخیره هزینه پست'}
          </button>
          {shippingSaveError && (
            <span className="text-[11px] font-bold text-rose-600 font-vazir">{shippingSaveError}</span>
          )}
        </div>
      </form>

      {/* 2. Filter Toolbar & Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Box & Refresh Button */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="جستجو با کد سفارش، نام یا شماره تماس..."
                value={searchQuery}
                onChange={(e) => changeSearch(e.target.value)}
                className="w-full bg-[#eff2f4] rounded-2xl pl-4 pr-10 py-2.5 text-xs text-[#454a4f] focus:outline-none focus:border-[#949c91]"
              />
              <Search className="w-4 h-4 text-[#454a4f]/50 absolute right-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => changeSearch('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#454a4f]/40 hover:text-[#454a4f]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl text-xs font-bold bg-[#eff2f4] hover:bg-[#b8b8b9] text-[#454a4f] transition-all cursor-pointer disabled:opacity-50 shrink-0"
              title="بروزرسانی زنده لیست سفارش‌ها"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-[#454a4f]'}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'بروزرسانی...' : 'بروزرسانی'}</span>
            </button>
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs no-scrollbar">
            <button
              onClick={() => setStatusFilter('all')}
              className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] shadow-xs'
                  : 'bg-[#eff2f4] text-[#454a4f]/80 hover:bg-[#b8b8b9]'
              }`}
            >
              همه ({formatPrice(totalOrdersCount)})
            </button>

            <button
              onClick={() => setStatusFilter('pending')}
              className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-[#dde2e7] shadow-xs'
                  : 'bg-[#eff2f4] text-[#454a4f]/80 hover:bg-[#b8b8b9]'
              }`}
            >
              در انتظار ({formatPrice(pendingOrdersCount)})
            </button>

            <button
              onClick={() => setStatusFilter('processing')}
              className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'processing'
                  ? 'bg-blue-600 text-[#dde2e7] shadow-xs'
                  : 'bg-[#eff2f4] text-[#454a4f]/80 hover:bg-[#b8b8b9]'
              }`}
            >
              در حال پردازش ({formatPrice(processingOrdersCount)})
            </button>

            <button
              onClick={() => setStatusFilter('shipped')}
              className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'shipped'
                  ? 'bg-purple-600 text-[#dde2e7] shadow-xs'
                  : 'bg-[#eff2f4] text-[#454a4f]/80 hover:bg-[#b8b8b9]'
              }`}
            >
              ارسال شده ({formatPrice(shippedOrdersCount)})
            </button>

            <button
              onClick={() => setStatusFilter('delivered')}
              className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'delivered'
                  ? 'bg-emerald-600 text-[#dde2e7] shadow-xs'
                  : 'bg-[#eff2f4] text-[#454a4f]/80 hover:bg-[#b8b8b9]'
              }`}
            >
              تحویل شده
            </button>

            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === 'cancelled'
                  ? 'bg-rose-600 text-[#dde2e7] shadow-xs'
                  : 'bg-[#eff2f4] text-[#454a4f]/80 hover:bg-[#b8b8b9]'
              }`}
            >
              لغو شده / ناموفق ({formatPrice(cancelledOrdersCount)})
            </button>
          </div>
        </div>
      </div>

      {fetchError && <div className="vara-status" data-tone="warning" role="alert">
        <span>{visibleOrders.length ? 'دریافت تازه انجام نشد. آخرین فهرست موفق نمایش داده می‌شود.' : 'فهرست سفارش‌ها در دسترس نیست.'}</span>
        {visibleOrders.length > 0 && lastUpdated && <time dateTime={new Date(lastUpdated).toISOString()}>
          آخرین دریافت {new Date(lastUpdated).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
        </time>}
        <button type="button" className="vara-button" disabled={isRefreshing} onClick={handleManualRefresh}>تلاش دوباره</button>
      </div>}
      {/* 3. Orders List */}
      {loading || (loadedFilter.current !== activeFilter && !fetchError) ? (
        <div role="status" className="bg-white rounded-3xl p-16 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#949c91] animate-spin mx-auto" />
          <p className="text-xs text-[#454a4f]/70">در حال دریافت فهرست سفارش‌ها...</p>
        </div>
      ) : visibleOrders.length === 0 ? fetchError ? null : (
        <div className="bg-white rounded-3xl p-16 text-center space-y-3">
          <ShoppingBag className="w-12 h-12 text-[#b8b8b9] mx-auto" />
          <h3 className="text-base font-bold text-[#454a4f]">سفارشی با این مشخصات یافت نشد</h3>
          <p className="text-xs text-[#454a4f]/60">
            {searchQuery || statusFilter !== 'all' ? 'عبارت جستجو را تغییر دهید یا فیلتر را بازنشانی کنید.' : 'هنوز سفارشی ثبت نشده است.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => {
            const statusConfig = getStatusBadge(order.status);
            const StatusIcon = statusConfig.icon;
            const paymentConfig = getPaymentBadge(order.paymentMethod, order.paymentStatus);

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm hover:border-[#b8b8b9] transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#b8b8b9] pb-3.5">
                  <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#eff2f4] flex items-center justify-center font-mono font-bold text-xs text-[#454a4f] shrink-0 mt-0.5 sm:mt-0">
                      <Hash className="w-4 h-4 text-[#949c91]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-[#454a4f]">
                          {order.orderNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusConfig.bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusConfig.label}</span>
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${paymentConfig.bg}`}>
                          {paymentConfig.label}
                        </span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#454a4f]/60 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#949c91]" />
                        <span>ثبت شده در: {formatPersianDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => setInvoiceOrder(order)}
                      className="bg-[#eff2f4] hover:bg-[#b8b8b9] text-[#454a4f] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#b8b8b9] transition-colors cursor-pointer"
                      title="مشاهده و چاپ فاکتور"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#949c91]" />
                      <span>چاپ فاکتور</span>
                    </button>

                    <button
                      onClick={() => setDeleteConfirmOrder(order)}
                      className="p-1.5 sm:p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="حذف سفارش"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Order Main Content (2 Columns: Customer Info & Items) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs">
                  
                  {/* Left Column: Customer & Delivery Details */}
                  <div className="lg:col-span-5 bg-[#eff2f4]/70 p-4 rounded-2xl space-y-2.5">
                    <div className="font-bold text-xs text-[#454a4f] border-b border-[#b8b8b9] pb-1.5 flex items-center justify-between">
                      <span>اطلاعات خریدار و ارسال:</span>
                      <span className="text-[11px] text-[#949c91]">
                        {order.shippingMethod === 'courier_tehran' ? 'پیک موتوری (ویژه تهران)' : 'پست پیشتاز سراسری'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#454a4f]/70">نام گیرنده:</span>
                      <span className="font-bold text-[#454a4f]">{order.customer.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#454a4f]/70">شماره تماس:</span>
                      <a 
                        href={`tel:${order.customer.phone}`}
                        className="font-mono font-bold text-[#949c91] hover:underline flex items-center gap-1 dir-ltr"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{order.customer.phone}</span>
                      </a>
                    </div>

                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[#454a4f]/70 shrink-0">نشانی:</span>
                      <span className="font-medium text-[#454a4f] text-left leading-relaxed">
                        {order.customer.province}، {order.customer.city}، {order.customer.address}
                      </span>
                    </div>

                    {order.customer.postalCode && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#454a4f]/70">کد پستی:</span>
                        <span className="font-mono text-[#454a4f]">{order.customer.postalCode}</span>
                      </div>
                    )}

                    {order.customer.notes && (
                      <div className="p-2 bg-amber-50/80 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-relaxed">
                        <span className="font-bold">یادداشت سفارش: </span>
                        {order.customer.notes}
                      </div>
                    )}

                    {order.postalTrackingCode && (
                      <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5" />
                          <span>کد رهگیری پستی:</span>
                        </span>
                        <span className="font-mono font-bold tracking-wider">{order.postalTrackingCode}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Ordered Products Breakdown */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="font-bold text-xs text-[#454a4f] flex items-center justify-between">
                      <span>اقلام سفارش داده شده ({formatPrice(order.items.length)}):</span>
                      <span className="text-[#949c91] font-bold">
                        مبلغ کل: {formatPrice(order.totalAmount)} تومان
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-[#eff2f4]/40 rounded-xl border border-[#b8b8b9]"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.nameFa}
                              className="w-10 h-10 object-cover rounded-lg bg-[#b8b8b9]"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <div className="font-bold text-xs text-[#454a4f] line-clamp-1">
                                {item.nameFa}
                              </div>
                              <div className="text-[10px] text-[#949c91] mt-0.5">
                                حجم: {item.sizeLabel} | تعداد: {formatPrice(item.quantity)} عدد
                              </div>
                            </div>
                          </div>

                          <div className="font-semibold text-xs text-[#454a4f]">
                            {formatPrice(item.price * item.quantity)} تومان
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Card-to-Card Receipt Actions */}
                    {order.paymentMethod === 'card_transfer' && order.hasPaymentReceipt && (
                      <div className="p-3 bg-[#eff2f4] rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div>
                            <span className="font-bold text-xs text-[#454a4f] block">تصویر فیش واریزی مشتری</span>
                            <button
                              onClick={async () => {
                                try {
                                  const receipt = await fetchOrderReceipt(order.id);
                                  const reader = new FileReader();
                                  reader.onload = () => setSelectedReceiptImage(String(reader.result));
                                  reader.readAsDataURL(receipt);
                                } catch {
                                  window.alert('رسید در دسترس نیست.');
                                }
                              }}
                              className="text-[11px] text-[#949c91] hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Eye className="w-3 h-3" />
                              <span>مشاهده اندازه بزرگ فیش</span>
                            </button>
                          </div>
                        </div>

                        {order.paymentStatus !== 'paid' && (
                          <button
                            onClick={() => handleVerifyCardPayment(order.id)}
                            disabled={actionLoadingId === order.id}
                            className="bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>تأیید فیش واریزی</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Footer Actions & Pipeline Change */}
                <div className="border-t border-[#b8b8b9] pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                    <span className="font-bold text-[#454a4f] text-[11px] sm:text-xs">تغییر وضعیت سفارش:</span>
                    <select
                      value={order.status}
                      disabled={actionLoadingId === order.id}
                      onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                      className="bg-[#eff2f4] border border-[#b8b8b9] rounded-xl px-3 py-2 sm:py-1.5 text-xs font-semibold text-[#454a4f] focus:outline-none focus:border-[#949c91] cursor-pointer w-full sm:w-auto"
                    >
                      <option value="pending">در انتظار بررسی / واریز</option>
                      <option value="processing">در حال بسته‌بندی و آماده‌سازی</option>
                      <option value="shipped">ارسال شده به پست</option>
                      <option value="delivered">تحویل داده شده به مشتری</option>
                      <option value="cancelled">لغو شده</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setTrackingInput(order.postalTrackingCode || '');
                        setTrackingModal({
                          isOpen: true,
                          orderId: order.id,
                          orderNumber: order.orderNumber,
                          currentCode: order.postalTrackingCode || ''
                        });
                      }}
                      className="w-full sm:w-auto justify-center text-[#454a4f] hover:text-purple-700 text-xs flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl border border-[#b8b8b9] bg-white hover:bg-[#eff2f4] cursor-pointer transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5 text-purple-600" />
                      <span>{order.postalTrackingCode ? 'ویرایش کد رهگیری' : 'ثبت کد رهگیری (اختیاری)'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {(cursors.length > 0 || nextCursor) && (
        <nav aria-label="صفحه‌بندی سفارش‌ها" className="flex items-center justify-center gap-3 text-sm">
          <button type="button" className="px-3 py-2 rounded-xl bg-white disabled:opacity-50"
            disabled={isRefreshing || cursors.length === 0} onClick={() => setCursors((pages) => pages.slice(0, -1))}>
            صفحه قبل
          </button>
          <span>{formatPrice(cursors.length + 1)}</span>
          <button type="button" className="px-3 py-2 rounded-xl bg-white disabled:opacity-50"
            disabled={isRefreshing || !nextCursor} onClick={() => nextCursor && setCursors((pages) => [...pages, nextCursor])}>
            صفحه بعد
          </button>
        </nav>
      )}

      {/* Postal Tracking Code Modal */}
      {trackingModal && trackingModal.isOpen && (
        <Modal label="کد رهگیری پستی" onClose={() => { if (!actionLoadingId) setTrackingModal(null); }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-right space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-[#dde2e7] flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#454a4f]">کد رهگیری مرسوله پستی</h3>
                  <p className="text-xs text-[#454a4f]/70">سفارش شماره {trackingModal.orderNumber}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTrackingModal(null)}
                className="w-8 h-8 rounded-full bg-[#eff2f4] hover:bg-[#b8b8b9] flex items-center justify-center text-[#454a4f] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTrackingCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#454a4f] mb-1.5">
                  کد رهگیری ۲۴ رقمی پست پیشتاز <span className="text-purple-600 font-normal">(اختیاری)</span>:
                </label>
                <input
                  type="text"
                  placeholder="مثال: 184920394820194820192847 (اختیاری)"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="w-full bg-[#eff2f4] border border-[#b8b8b9] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider text-[#454a4f] focus:outline-none focus:border-[#949c91]"
                />
                <p className="text-[11px] text-[#949c91] mt-1.5 leading-relaxed">
                  ثبت کد رهگیری اختیاری است. در صورت ثبت، مشتری در پنل کاربری خود امکان رهگیری بسته را خواهد داشت. برای ارسال بدون کد، می‌توانید این کادر را خالی بگذارید.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTrackingModal(null)}
                  className="px-3.5 py-2 rounded-xl border border-[#b8b8b9] text-xs font-bold text-[#454a4f] hover:bg-[#eff2f4] cursor-pointer"
                >
                  انصراف
                </button>

                {trackingModal.currentCode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      setTrackingInput('');
                      setTimeout(() => {
                        const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                        handleSaveTrackingCode(fakeEvent);
                      }, 10);
                    }}
                    disabled={actionLoadingId === trackingModal.orderId}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 cursor-pointer"
                  >
                    حذف کد رهگیری
                  </button>
                )}

                <button
                  type="submit"
                  disabled={actionLoadingId === trackingModal.orderId}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-[#dde2e7] shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ذخیره تغییرات</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Lightbox / Receipt Image Modal */}
      {selectedReceiptImage && (
        <Modal label="رسید سفارش" onClose={() => setSelectedReceiptImage(null)} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="bg-white rounded-3xl p-4 max-w-lg w-full max-h-[90vh] flex flex-col items-center justify-between space-y-3 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center px-2">
              <span className="text-xs font-bold text-[#454a4f]">تصویر رسید واریزی کارت به کارت</span>
              <button
                onClick={() => setSelectedReceiptImage(null)}
                className="p-1 hover:bg-[#eff2f4] rounded-full text-[#454a4f] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full max-h-[75vh] overflow-auto rounded-2xl">
              <img src={selectedReceiptImage} alt="رسید کامل" className="w-full object-contain" />
            </div>
          </div>
        </Modal>
      )}

      {/* Printable Invoice & Shipping Label Modal */}
      {invoiceOrder && (
        <Modal label="فاکتور سفارش" onClose={() => setInvoiceOrder(null)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl text-right space-y-6 my-auto max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#b8b8b9] pb-4">
              <div>
                <span className="text-xs font-bold text-[#949c91]">فاکتور رسمی و برچسب پستی مرسوله</span>
                <h3 className="text-lg font-extrabold text-[#454a4f]">فروشگاه تخصصی مراقبت پوست ورا بیوتی</h3>
              </div>
              <button
                onClick={() => setInvoiceOrder(null)}
                className="w-8 h-8 rounded-full bg-[#eff2f4] hover:bg-[#b8b8b9] flex items-center justify-center text-[#454a4f] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Invoice Sheet Body */}
            <div id="printable-invoice" className="space-y-4 overflow-y-auto p-1 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-[#eff2f4] p-4 rounded-2xl">
                <div>
                  <span className="text-[#454a4f]/70 block">شماره فاکتور / سفارش:</span>
                  <span className="font-mono text-sm font-bold text-[#454a4f]">{invoiceOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-[#454a4f]/70 block">تاریخ صدور:</span>
                  <span className="font-bold text-[#454a4f]">{formatPersianDate(invoiceOrder.createdAt)}</span>
                </div>
                <div className="col-span-2 border-t border-[#b8b8b9] pt-2">
                  <span className="text-[#454a4f]/70 block">مشخصات گیرنده و نشانی پستی:</span>
                  <span className="font-bold text-[#454a4f] block">
                    {invoiceOrder.customer.name} - شماره همراه: {invoiceOrder.customer.phone}
                  </span>
                  <span className="text-[#454a4f] block mt-0.5">
                    {invoiceOrder.customer.province}، {invoiceOrder.customer.city}، {invoiceOrder.customer.address} (کد پستی: {invoiceOrder.customer.postalCode || '---'})
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-2xl overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead className="bg-[#eff2f4] border-b border-[#b8b8b9] text-[11px] font-bold text-[#454a4f]">
                    <tr>
                      <th className="p-2.5">ردیف</th>
                      <th className="p-2.5">نام کالا</th>
                      <th className="p-2.5">حجم</th>
                      <th className="p-2.5">تعداد</th>
                      <th className="p-2.5">مبلغ واحد</th>
                      <th className="p-2.5">مبلغ کل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#b8b8b9]">
                    {invoiceOrder.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-[#eff2f4]/40">
                        <td className="p-2.5 font-jakarta font-semibold">{idx + 1}</td>
                        <td className="p-2.5 font-bold">{it.nameFa}</td>
                        <td className="p-2.5 text-[#949c91]">{it.sizeLabel}</td>
                        <td className="p-2.5 font-jakarta">{it.quantity}</td>
                        <td className="p-2.5">{formatPrice(it.price)} ت</td>
                        <td className="p-2.5 font-bold">{formatPrice(it.price * it.quantity)} ت</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="bg-[#eff2f4] p-4 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>جمع اقلام:</span>
                  <span>{formatPrice(invoiceOrder.subtotal)} تومان</span>
                </div>
                {invoiceOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[#949c91] font-bold">
                    <span>تخفیف:</span>
                    <span>- {formatPrice(invoiceOrder.discountAmount)} تومان</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span>
                    {invoiceOrder.shippingMethod === 'courier_tehran' && invoiceOrder.shippingFee === 0
                      ? 'پس‌کرایه (به عهده مشتری)'
                      : invoiceOrder.shippingFee === 0
                      ? 'رایگان'
                      : `${formatPrice(invoiceOrder.shippingFee)} تومان`}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm text-[#454a4f] border-t border-[#b8b8b9] pt-2">
                  <span>مبلغ کل پرداختی:</span>
                  <span className="text-[#949c91]">{formatPrice(invoiceOrder.totalAmount)} تومان</span>
                </div>
              </div>
            </div>

            {/* Modal Print Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#b8b8b9] pt-3">
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-[#b8b8b9] text-xs font-bold text-[#454a4f] hover:bg-[#eff2f4] cursor-pointer"
              >
                بستن
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] shadow-2xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ فاکتور و برچسب</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOrder && (
        <Modal label="حذف سفارش" onClose={() => { if (!actionLoadingId) setDeleteConfirmOrder(null); }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-right space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#454a4f]">حذف سفارش</h3>
                <p className="text-xs text-[#454a4f]/70">سفارش شماره {deleteConfirmOrder.orderNumber}</p>
              </div>
            </div>

            <p className="text-xs text-[#454a4f]/80 leading-relaxed bg-[#eff2f4] p-3.5 rounded-2xl">
              آیا از حذف دائم این سفارش از سیستم اطمینان دارید؟ این عمل غیرقابل بازگشت است.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOrder(null)}
                className="px-4 py-2 rounded-xl border border-[#b8b8b9] text-xs font-bold text-[#454a4f] hover:bg-[#eff2f4] cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOrder(deleteConfirmOrder.id)}
                disabled={actionLoadingId === deleteConfirmOrder.id}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-[#dde2e7] shadow-md cursor-pointer"
              >
                {actionLoadingId === deleteConfirmOrder.id ? 'در حال حذف...' : 'حذف سفارش'}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
