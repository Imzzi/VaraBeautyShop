import { ProductImage } from './ProductImage';
import { getProductCover, packagingImage, DEFAULT_PRODUCT_IMAGE } from '../lib/productImages';
import { Modal } from './Modal';
import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';
import { getLocalShippingSettings, subscribeToShippingSettings, ShippingSettings } from '../lib/shippingSettings';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, sizeLabel: string, delta: number) => void;
  onRemoveItem: (productId: string, sizeLabel: string) => void;
  onProceedToCheckout: (appliedDiscount: number) => Promise<void>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [checkingCart, setCheckingCart] = useState(false);
  const [cartError, setCartError] = useState('');
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(() => getLocalShippingSettings());

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToShippingSettings((settings) => {
      setShippingSettings(settings);
    });
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const proceed = async () => {
    if (checkingCart) return;
    setCheckingCart(true);
    setCartError('');
    try {
      await onProceedToCheckout(0);
    } catch (error) {
      setCartError(error instanceof Error ? error.message : 'بررسی سبد انجام نشد. دوباره تلاش کنید.');
    } finally {
      setCheckingCart(false);
    }
  };

  const postExpressFee = shippingSettings.postExpressFee ?? 50000;

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.selectedVariant?.price ?? (item.selectedSize?.price ?? item.product?.price ?? 0);
    return sum + itemPrice * item.quantity;
  }, 0);

  const formatPrice = (price?: number) => (price || 0).toLocaleString('fa-IR');

  return (
    <Modal label="سبد خرید" onClose={() => { if (!checkingCart) onClose(); }} className="fixed inset-0 z-50 overflow-hidden bg-vara-ink/45 backdrop-blur-xs animate-fadeIn">
      <div 
        className="absolute inset-y-0 end-0 max-w-full flex pe-0 sm:pe-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-vara-canvas shadow-2xl border-r border-vara-line flex flex-col justify-between text-right font-vazir">
          
          {/* Header */}
          <div className="p-5 bg-white text-vara-ink flex items-center justify-between border-b border-vara-line">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-vara-rose text-white flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold font-vazir text-vara-ink">سبد خرید شما</h2>
              <span className="bg-vara-tint text-vara-rose-ink border border-vara-tint-line/50 text-xs font-bold px-2 py-0.5 rounded-full font-jakarta tabular-nums">
                {items.length}
              </span>
            </div>
            <button
              onClick={onClose} disabled={checkingCart}
              className="p-1.5 hover:bg-vara-tint rounded-full transition-colors text-vara-muted hover:text-vara-rose-ink cursor-pointer"
              aria-label="بستن سبد"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-vara-line bg-white">
            {items.length > 0 ? (
              items.map((item) => {
                const sizeLabel = item.selectedSize?.label || 'استاندارد';
                const itemPrice = item.selectedVariant?.price ?? (item.selectedSize?.price ?? item.product?.price ?? 0);
                const stockLimit = item.selectedVariant ? item.selectedVariant.stockCount : (item.product?.stockCount !== undefined ? item.product.stockCount : 15);
                const itemIdentifier = item.selectedVariant?.id || sizeLabel;
                const itemKey = item.selectedVariant ? `${item.product?.id}-var-${item.selectedVariant.id}` : `${item.product?.id}-${sizeLabel}`;

                return (
                  <div
                    key={itemKey}
                    className="py-4 first:pt-0 last:pb-0 flex items-center gap-3.5"
                  >
                    <div className="w-18 h-18 rounded-xl bg-vara-surface border border-vara-line p-1 shrink-0 overflow-hidden">
                      <ProductImage
                        src={packagingImage(item.selectedVariant?.image) || (item.product ? getProductCover(item.product) : DEFAULT_PRODUCT_IMAGE)}
                        alt={item.product?.nameFa || 'محصول'}
                        className="w-full h-full object-contain rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 text-right min-w-0">
                      <h3 className="font-semibold text-xs text-vara-ink line-clamp-1">
                        {item.product?.nameFa || 'محصول'}
                      </h3>

                      {item.selectedVariant ? (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-vara-muted">تنوع:</span>
                          <span className="text-[10px] font-medium text-vara-rose-ink bg-vara-tint border border-vara-tint-line/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                            {item.selectedVariant.colorCode && item.selectedVariant.colorCode.trim() !== '' && (
                              <span
                                className="w-2 h-2 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: item.selectedVariant.colorCode }}
                              />
                            )}
                            <span className="truncate max-w-[100px]">{item.selectedVariant.name}</span>
                          </span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-vara-muted mt-0.5">
                          حجم: {sizeLabel}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-2.5">
                        {/* Price */}
                        <span className="text-xs font-bold font-jakarta text-vara-rose-ink tabular-nums">
                          {formatPrice(itemPrice * item.quantity)} <span className="font-vazir font-normal text-[10px] text-vara-muted">تومان</span>
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-vara-line rounded-lg bg-vara-canvas p-0.5">
                          <button
                            disabled={checkingCart}
                            onClick={() => onUpdateQuantity(item.product.id, itemIdentifier, -1)}
                            className="w-6 h-6 rounded-full hover:bg-vara-tint text-vara-ink hover:text-vara-rose-ink flex items-center justify-center transition-colors cursor-pointer"
                            title="کاهش تعداد"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold font-jakarta text-vara-ink tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, itemIdentifier, 1)}
                            disabled={checkingCart || item.quantity >= stockLimit}
                            className="w-6 h-6 rounded-full hover:bg-vara-tint text-vara-ink hover:text-vara-rose-ink flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title={item.quantity >= stockLimit ? 'سقف موجودی انبار' : 'افزایش تعداد'}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={checkingCart}
                      onClick={() => onRemoveItem(item.product.id, itemIdentifier)}
                      className="p-1.5 text-vara-muted hover:text-rose-600 transition-colors cursor-pointer"
                      title="حذف از سبد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-vara-surface border border-vara-line flex items-center justify-center mx-auto text-vara-rose-ink">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-vara-ink">سبد خرید شما خالی است</p>
                <p className="text-xs text-vara-muted">محصولات تخصصی ما را در فروشگاه بررسی نمایید.</p>
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-5 bg-vara-surface border-t border-vara-line space-y-4">
              
              {/* Price Calculation Summary */}
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex justify-between text-vara-muted">
                  <span>مبلغ کل کالاها:</span>
                  <span className="text-vara-ink font-jakarta font-semibold tabular-nums">{formatPrice(subtotal)} تومان</span>
                </div>

                <div className="flex justify-between text-vara-muted">
                  <span>هزینه ارسال (پست پیشتاز):</span>
                  <span className="text-vara-ink font-medium">{formatPrice(postExpressFee)} تومان</span>
                </div>

                <div className="flex justify-between font-bold text-sm text-vara-ink pt-2 border-t border-vara-line">
                  <span>برآورد با پست پیشتاز</span>
                  <span className="text-vara-rose-ink font-jakarta tabular-nums">
                    {formatPrice(subtotal + postExpressFee)} تومان
                  </span>
                </div>
              </div>

              {cartError && <p role="alert" className="vara-status" data-tone="warning">{cartError}</p>}
              {/* Checkout Action Button */}
              <button
                onClick={proceed}
                aria-disabled={checkingCart}
                className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full font-semibold text-xs transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.99] shadow-xs"
              >
                <span>{checkingCart ? 'در حال بررسی موجودی…' : 'ادامه و تسویه‌حساب'}</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </button>

            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};
