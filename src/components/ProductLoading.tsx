import { ProductImage } from './ProductImage';
import { Product } from '../types';
import {
  getProductCover, PRODUCT_COVER_SIZES, PRODUCT_COVER_WIDTHS,
  responsiveImageSrcSet,
} from '../lib/productImages';

export function ProductLoading({ product }: { product?: Product | null }) {
  const image = product ? getProductCover(product) : '';
  return (
    <div aria-busy="true" className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 space-y-6 sm:space-y-10">
      <div className="h-[46px] border-b border-vara-line" aria-hidden="true" />
      <div className="vara-product-showcase">
        <div className="space-y-4">
          <div className="vara-product-stage relative rounded-xl overflow-hidden">
            {image && <ProductImage
              src={image}
              srcSet={responsiveImageSrcSet(image, PRODUCT_COVER_WIDTHS)}
              sizes={PRODUCT_COVER_SIZES}
              alt={product?.nameFa || ''}
              fetchPriority="high"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />}
          </div>
          {Number(product?.images?.length) > 1 && <div className="h-18 sm:h-20" aria-hidden="true" />}
        </div>
        <div className="text-vara-muted text-sm min-h-72" role="status">
          در حال بارگذاری جزئیات محصول...
        </div>
      </div>
    </div>
  );
}
