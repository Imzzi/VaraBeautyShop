import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product, ProductSize, ProductVariant } from '../types';
import { DEFAULT_PRODUCT_IMAGE, getProductCover } from '../lib/productImages';
import { ProductCard } from './ProductCard';

interface BestSellersSectionProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: ProductSize, quantity?: number, variant?: ProductVariant) => void;
  onViewAllBestSellers: () => void;
}

const tabs = [
  { id: 'all', label: 'همه', test: () => true },
  { id: 'skincare', label: 'آبرسان و مرطوب‌کننده', test: (p: Product) => p.category === 'hydration' || p.productType === 'moisturizer' },
  { id: 'serum', label: 'سرم‌ و اسنس', test: (p: Product) => p.productType === 'serum' || p.productType === 'toner' },
  { id: 'sunscreen', label: 'ضدآفتاب', test: (p: Product) => p.category === 'sunscreen' },
];

export function BestSellersSection({ products, onViewProduct, onAddToCart, onViewAllBestSellers }: BestSellersSectionProps) {
  const list = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const best = products.filter((product) => product.isBestSeller || product.rating >= 4.7);
  const shown = (best.length > 0 ? best : products)
    .filter(activeTab.test)
    .sort((a, b) => Number(getProductCover(b) !== DEFAULT_PRODUCT_IMAGE) - Number(getProductCover(a) !== DEFAULT_PRODUCT_IMAGE))
    .slice(0, 12);

  if (!products.length) return null;

  function scroll(direction: number) {
    const element = list.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * .85, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }

  return (
    <section id="best-sellers-section" className="vara-container vara-featured" aria-labelledby="vara-featured-title">
      <div className="vara-section-heading">
        <h2 id="vara-featured-title">منتخب فروشگاه</h2>
        <button type="button" className="vara-button" onClick={onViewAllBestSellers}>همه محصولات</button>
      </div>
      <div className="vara-featured-controls">
        <div className="flex flex-wrap gap-2" aria-label="نوع محصول">
          {tabs.map((tab) => (
            <button key={tab.id} type="button" className="vara-chip" aria-pressed={tab.id === activeTab.id} onClick={() => {
              setActiveTab(tab);
              list.current?.scrollTo({ left: 0, behavior: 'instant' });
            }}>{tab.label}</button>
          ))}
        </div>
        {shown.length > 1 && <div className="hidden sm:flex gap-2">
          <button className="vara-button" type="button" aria-label="محصولات قبلی" onClick={() => scroll(1)}><ChevronRight size={18} /></button>
          <button className="vara-button" type="button" aria-label="محصولات بعدی" onClick={() => scroll(-1)}><ChevronLeft size={18} /></button>
        </div>}
      </div>
      {shown.length === 0 ? <p className="vara-status" role="status">در این گروه محصول منتخبی وجود ندارد.</p> : (
        <div ref={list} className="vara-featured-list">
          {shown.map((product) => <ProductCard key={product.id} product={product} onQuickView={onViewProduct} onAddToCart={onAddToCart} />)}
        </div>
      )}
    </section>
  );
}
