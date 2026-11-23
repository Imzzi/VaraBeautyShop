import { ProductImage } from './ProductImage';
import { getProductCover, packagingImage, DEFAULT_PRODUCT_IMAGE } from '../lib/productImages';
import { Modal } from './Modal';
import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: ProductSize) => void;
  onViewProduct: (product: Product) => void;
  onAddAllToCart?: () => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onAddToCart,
  onViewProduct,
  onAddAllToCart,
}) => {
  if (!isOpen) return null;

  const formatPrice = (price?: number) => (price || 0).toLocaleString('fa-IR');

  return (
    <Modal label="علاقه‌مندی‌ها" onClose={onClose} className="fixed inset-0 z-50 overflow-hidden bg-[#23191E]/45 backdrop-blur-xs animate-fadeIn">
      <div 
        className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#FDFBF9] shadow-2xl border-r border-[#F0E1E4] flex flex-col justify-between text-right font-vazir">
          
          {/* Header */}
          <div className="p-5 bg-white border-b border-[#F0E1E4] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8C3B58] flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <h2 className="text-base font-bold text-[#23191E]">علاقه‌مندی‌های شما</h2>
              <span className="bg-[#F5E6EB] text-[#8C3B58] border border-[#D48C9E]/50 text-xs font-bold px-2 py-0.5 rounded-md font-jakarta tabular-nums">
                {wishlistProducts.length.toLocaleString('fa-IR')}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#F5E6EB] rounded-lg transition-colors text-[#785E67] hover:text-[#8C3B58] cursor-pointer"
              aria-label="بستن پنجره"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#F0E1E4] bg-white">
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 bg-[#F9F1F0] rounded-2xl flex items-center justify-center mx-auto border border-[#F0E1E4] text-[#8C3B58]">
                  <Heart className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-[#23191E] text-sm">لیست علاقه‌مندی‌های شما خالی است</h3>
                  <p className="text-xs text-[#785E67] leading-relaxed max-w-xs mx-auto">
                    محصولات مورد علاقه خود را با زدن روی آیکون قلب ذخیره کنید تا در هر زمان به راحتی به آن‌ها دسترسی داشته باشید.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#8C3B58] hover:bg-[#732E47] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  مشاهده و مرور محصولات
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => {
                const defaultSize: ProductSize = (product.sizes && product.sizes.length > 0)
                  ? product.sizes[0]
                  : { label: '۳۰ میلی‌لیتر', labelEn: '30 ml', price: product.price || 0 };

                return (
                  <div
                    key={product.id}
                    className="py-4 first:pt-0 last:pb-0 flex gap-3.5 items-center justify-between transition-all group"
                  >
                    {/* Thumbnail */}
                    <div 
                      onClick={() => {
                        onViewProduct(product);
                        onClose();
                      }}
                      className="w-18 h-18 bg-[#F9F1F0] rounded-xl p-1 overflow-hidden shrink-0 border border-[#F0E1E4] cursor-pointer"
                    >
                      <ProductImage
                        src={getProductCover(product)}
                        alt={product.nameFa || 'محصول'}
                        className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pr-1 text-right">
                      <h4 
                        onClick={() => {
                          onViewProduct(product);
                          onClose();
                        }}
                        className="text-xs font-semibold text-[#23191E] hover:text-[#8C3B58] truncate cursor-pointer transition-colors"
                      >
                        {product.nameFa}
                      </h4>
                      <p className="text-[11px] text-[#785E67] truncate mt-0.5">
                        {defaultSize.label} • {product.brandFa || product.brand || 'ورا بیوتی'}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-xs font-bold font-jakarta text-[#8C3B58] tabular-nums">
                          {formatPrice(defaultSize.price || product.price)} <span className="font-vazir font-normal text-[10px] text-[#785E67]">تومان</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => {
                          onAddToCart(product, defaultSize);
                        }}
                        className="p-2 bg-[#8C3B58] hover:bg-[#732E47] text-white rounded-lg transition-all cursor-pointer shadow-xs"
                        title="افزودن به سبد خرید"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(product.id)}
                        className="p-2 hover:bg-[#F5E6EB] text-[#785E67] hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="حذف از علاقه‌مندی‌ها"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          {wishlistProducts.length > 0 && (
            <div className="p-5 bg-[#F9F1F0] border-t border-[#F0E1E4] space-y-2.5">
              {onAddAllToCart && (
                <button
                  onClick={() => {
                    onAddAllToCart();
                    onClose();
                  }}
                  className="w-full py-3 bg-[#8C3B58] hover:bg-[#732E47] text-white rounded-xl font-semibold text-xs transition-all cursor-pointer shadow-xs"
                >
                  <span>انتقال همه اقلام به سبد خرید</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-white hover:bg-[#F5E6EB] text-[#23191E] border border-[#F0E1E4] hover:border-[#D48C9E] rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                ادامه خرید و بستن
              </button>
            </div>
          )}

        </div>
      </div>
    </Modal>
  );
};
