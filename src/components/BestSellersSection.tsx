import { useMemo, useRef, useState } from 'react';
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
  { id: 'skincare', label: 'آبرسان و مرطوب‌کننده', test: (p: Product) => p.category === 'hydration' || p.productType === 'moisturizer' },
  { id: 'serum', label: 'سرم‌ و اسنس', test: (p: Product) => p.productType === 'serum' || p.productType === 'toner' },
  { id: 'sunscreen', label: 'ضدآفتاب', test: (p: Product) => p.category === 'sunscreen' || p.productType === 'sunscreen' || (p.concerns || []).includes('sunscreen') },
];

function pickRandomProducts(items: Product[], count: number): Product[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export function BestSellersSection({ products, onViewProduct, onAddToCart, onViewAllBestSellers }: BestSellersSectionProps) {
  const list = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const featuredByTab = useMemo(() => {
    const result: Record<string, Product[]> = {};
    for (const tab of tabs) {
      const matching = products.filter(tab.test);
      const preferred = matching.filter(
        (p) => p.inStock && (p.stockCount ?? 1) > 0 && getProductCover(p) !== DEFAULT_PRODUCT_IMAGE,
      );
      if (preferred.length >= 4) {
        result[tab.id] = pickRandomProducts(preferred, 4);
      } else {
        const preferredIds = new Set(preferred.map((p) => p.id));
        const fallback = pickRandomProducts(
          matching.filter((p) => !preferredIds.has(p.id)),
          4 - preferred.length,
        );
        result[tab.id] = [...pickRandomProducts(preferred, preferred.length), ...fallback];
      }
    }
    return result;
  }, [products]);

  const shown = featuredByTab[activeTab.id] || [];

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
