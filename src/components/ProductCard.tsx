import { ProductImage } from './ProductImage';
import { RoutineLabel } from './RoutineLabel';
import React, { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { Product, ProductSize, ProductVariant } from '../types';
import { getProductCover, packagingImage, responsiveImageSrcSet } from '../lib/productImages';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize: ProductSize, quantity?: number, selectedVariant?: ProductVariant) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
}) => {
  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  const image = packagingImage(selectedVariant?.image) || getProductCover(product);
  const productUrl = `/product/${encodeURIComponent(product.id)}`;
  const openProduct = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onQuickView(product);
  };

  const defaultSize: ProductSize = {
    label: selectedVariant?.name || 'استاندارد',
    labelEn: selectedVariant?.nameEn || 'Standard',
    price: selectedVariant?.price || product.price || 0
  };

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes?.[0] || defaultSize
  );

  const currentStock = hasVariants && selectedVariant
    ? selectedVariant.stockCount
    : (product.stockCount !== undefined ? product.stockCount : (product.inStock ? 15 : 0));
  const isOutOfStock = currentStock <= 0 || !product.inStock;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const formatPrice = (price?: number) => {
    return (price || 0).toLocaleString('fa-IR');
  };

  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    setSelectedSize({
      label: v.name,
      labelEn: v.nameEn || '',
      price: v.price,
      originalPrice: v.originalPrice
    });
  };

  return (
    <div className={`vara-card group bg-white rounded-xl p-3 border border-[#F0E1E4] hover:border-[#D48C9E] transition-all duration-200 flex flex-col justify-between ${
      isOutOfStock ? 'opacity-85' : 'hover:-translate-y-0.5 shadow-shop-card hover:shadow-shop-card-hover'
    }`}>
      
      {/* Top Image & Single Boutique Tag Container */}
      <a href={productUrl} tabIndex={-1} onClick={openProduct} aria-hidden="true" className="vara-card-image">
        <ProductImage
          src={image}
          srcSet={responsiveImageSrcSet(image, [240, 360, 540, 800])}
          sizes="(min-width: 1280px) 260px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          alt={product.nameFa || 'محصول'}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isOutOfStock ? 'grayscale-[45%]' : 'group-hover:scale-104'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />

        {/* Single Restrained Boutique Tag */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-[#23191E] text-white text-[10px] font-medium font-vazir px-2.5 py-0.5 rounded-md">
              ناموجود
            </span>
          ) : isLowStock ? (
            <span className="bg-white/95 text-[#B45309] text-[10px] font-semibold font-vazir px-2 py-0.5 rounded-md border border-[#F0E1E4]">
              تنها {currentStock.toLocaleString('fa-IR')} عدد
            </span>
          ) : product.isNew ? (
            <span className="bg-[#8C3B58] text-white text-[10px] font-semibold font-vazir px-2 py-0.5 rounded-md">
              جدید
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-[#F4E4E8]/95 text-[#8C3B58] font-semibold text-[10px] font-vazir px-2 py-0.5 rounded-md border border-[#D48C9E]/40">
              پرفروش
            </span>
          ) : null}
        </div>
      </a>

      {/* Product Content Details */}
      <div className="pt-3 px-1 flex-1 flex flex-col justify-between space-y-2.5 text-right">
        <div>
          {/* Brand & Rating Row */}
          <div className="flex items-center justify-between text-xs mb-1">
            <bdi className="text-xs font-semibold text-[#8C3B58] font-jakarta truncate max-w-[140px]">
              {product.brand || product.brandFa || 'VARA'}
            </bdi>
            {product.rating > 0 && <div className="flex items-center gap-1 text-xs text-[#785E67]">
              <Star className="w-3 h-3 fill-[#D48C9E] text-[#8C3B58]" />
              <span className="font-semibold tabular-nums">{product.rating.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</span>
            </div>}
          </div>

          {/* Farsi Title */}
          <h3 className="vara-card-title">
            <a href={productUrl} onClick={openProduct}><bdi>{product.nameFa}</bdi></a>
          </h3>
          <RoutineLabel step={product.routineStep} />

          {/* Key Active Ingredients */}
          {product.keyIngredients && product.keyIngredients.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#785E67] font-vazir truncate">
              {product.keyIngredients.slice(0, 2).map((ing, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span aria-hidden="true" className="text-[#D48C9E]">·</span>}
                  <span>{ing.nameFa}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Variants or Size Selection */}
        {hasVariants && product.variants && product.variants.length > 0 ? (
          <div className="pt-0.5">
            <div className="flex flex-wrap gap-1">
              {product.variants.slice(0, 3).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selectedVariant?.id === v.id}
                  onClick={() => handleVariantSelect(v)}
                  className={`text-[10px] font-vazir px-2 py-0.5 rounded-md border transition-all cursor-pointer flex items-center gap-1 ${
                    selectedVariant?.id === v.id
                      ? 'bg-[#8C3B58] text-white border-[#8C3B58] font-medium'
                      : 'bg-[#F9F1F0] text-[#5E434D] border-[#F0E1E4] hover:border-[#D48C9E]'
                  }`}
                  title={v.name}
                >
                  {v.colorCode && v.colorCode.trim() !== '' && (
                    <span
                      className="w-2 h-2 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: v.colorCode }}
                    />
                  )}
                  <span className="truncate max-w-[72px]">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : product.sizes && product.sizes.length > 1 ? (
          <div className="flex items-center gap-1 pt-0.5">
            <div className="flex gap-1">
              {product.sizes.map((sz, idx) => (
                <button
                  key={idx}
                  aria-pressed={selectedSize?.label === sz.label}
                  onClick={() => setSelectedSize(sz)}
                  className={`text-[10px] font-vazir px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    (selectedSize?.label || '') === sz.label
                      ? 'bg-[#8C3B58] text-white border-[#8C3B58] font-medium'
                      : 'bg-[#F9F1F0] text-[#5E434D] border-[#F0E1E4] hover:border-[#D48C9E]'
                  }`}
                >
                  {sz.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Price & Add To Cart Button */}
        <div className="vara-card-actions pt-2.5 border-t border-[#F0E1E4]">
          
          {/* Price Container */}
          <div className="flex flex-col text-right">
            {(selectedVariant?.originalPrice || selectedSize?.originalPrice) && (
              <span className="line-through text-[10px] text-[#785E67] font-vazir">
                {formatPrice(selectedVariant?.originalPrice || selectedSize?.originalPrice)}
              </span>
            )}
            <div className="flex flex-wrap items-baseline gap-1">
              <span className="font-bold font-jakarta text-sm sm:text-[15px] text-[#23191E] tracking-tight">
                {hasVariants && selectedVariant ? formatPrice(selectedVariant.price) : formatPrice(selectedSize?.price || product.price)}
              </span>
              <span className="text-[10px] font-vazir text-[#785E67]">تومان</span>
            </div>
          </div>

          {/* Quick Add Button */}
          {isOutOfStock ? (
            <button
              disabled
              className="bg-[#F9F1F0] text-[#785E67] px-3 py-1.5 rounded-lg text-xs font-vazir font-medium cursor-not-allowed border border-[#F0E1E4]"
            >
              <span>ناموجود</span>
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product, selectedSize, 1, selectedVariant || undefined)}
              className="bg-[#8C3B58] hover:bg-[#732E47] text-white px-3.5 py-1.5 rounded-lg shadow-shop-pill transition-all flex items-center justify-center gap-1 text-xs font-vazir font-medium cursor-pointer active:scale-95"
              aria-label={`افزودن ${product.nameFa} به سبد`}
            >
              <Plus aria-hidden="true" size={14} /><span>افزودن</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
