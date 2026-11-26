import React, { useMemo, useState } from 'react';
import { ArrowRight, BookOpen, Calculator, ChevronDown, Clock, ShoppingBag } from 'lucide-react';
import { BUYING_GUIDES, BuyingGuide, getGuideBySlug } from '../data/guides';
import { parseShopFilterFromSearch } from '../lib/seoMetadata';
import { Product, ProductSize, ProductVariant, ShopFilterPreset } from '../types';
import { ProductCard } from './ProductCard';

interface GuidesPageProps {
  activeSlug?: string;
  products: Product[];
  onSelectGuide: (slug?: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize: ProductSize, quantity?: number, selectedVariant?: ProductVariant) => void;
  onNavigateShopPreset: (preset: ShopFilterPreset) => void;
  onNavigateCalculator: () => void;
}

const TOPIC_FILTERS: Array<{ id: BuyingGuide['topic'] | 'all'; label: string }> = [
  { id: 'all', label: 'همه راهنماها' },
  { id: 'shopping', label: 'خرید از دبی و ترکیه' },
  { id: 'authenticity', label: 'تشخیص اصالت کالا' },
  { id: 'routine', label: 'روتین پوستی' },
  { id: 'sunscreen', label: 'ضدآفتاب' },
  { id: 'ingredients', label: 'ترکیبات و ترمیم پوست' },
];

export const GuidesPage: React.FC<GuidesPageProps> = ({
  activeSlug,
  products,
  onSelectGuide,
  onSelectProduct,
  onAddToCart,
  onNavigateShopPreset,
  onNavigateCalculator,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<BuyingGuide['topic'] | 'all'>('all');

  const activeGuide = useMemo(() => (activeSlug ? getGuideBySlug(activeSlug) : undefined), [activeSlug]);

  const filteredGuides = useMemo(
    () => (selectedTopic === 'all' ? BUYING_GUIDES : BUYING_GUIDES.filter((g) => g.topic === selectedTopic)),
    [selectedTopic]
  );

  const matchingProducts = useMemo(() => {
    if (!activeGuide || products.length === 0) return [];
    let matches: Product[] = [];
    if (activeGuide.relatedBrand) {
      const target = activeGuide.relatedBrand.toLowerCase();
      matches = products.filter(
        (p) => (p.brand || '').toLowerCase() === target || (p.brandFa || '').toLowerCase() === target
      );
    } else if (activeGuide.relatedCategory) {
      matches = products.filter((p) => p.category === activeGuide.relatedCategory);
    }
    return matches.slice(0, 3);
  }, [activeGuide, products]);

  const handleHrefClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (href === '/calculator') {
      onNavigateCalculator();
      return;
    }
    if (href.startsWith('/guides/')) {
      onSelectGuide(href.slice('/guides/'.length));
      return;
    }
    if (href === '/guides') {
      onSelectGuide(undefined);
      return;
    }
    if (href.startsWith('/shop')) {
      const qIdx = href.indexOf('?');
      const parsed = qIdx >= 0 ? parseShopFilterFromSearch(href.slice(qIdx)) : null;
      onNavigateShopPreset(parsed || {});
    }
  };

  // Not-found guide detail state
  if (activeSlug && !activeGuide) {
    return (
      <div className="vara-container py-16 text-center space-y-4 font-vazir" dir="rtl">
        <h1 className="text-xl sm:text-2xl font-bold text-vara-ink">راهنمای مورد نظر یافت نشد</h1>
        <p className="text-sm text-vara-muted">ممکن است آدرس تغییر کرده باشد یا این مقاله حذف شده باشد.</p>
        <a
          href="/guides"
          onClick={(e) => handleHrefClick(e, '/guides')}
          className="inline-flex items-center gap-2 bg-vara-rose hover:bg-vara-rose-hover text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به مجله و راهنمای خرید</span>
        </a>
      </div>
    );
  }

  // Detail Article View
  if (activeGuide) {
    const otherGuides = BUYING_GUIDES.filter((g) => g.slug !== activeGuide.slug).slice(0, 3);

    return (
      <article className="vara-container py-8 sm:py-12 pb-24 space-y-10 font-vazir text-right" dir="rtl">
        {/* Breadcrumb */}
        <nav aria-label="مسیر راهنما" className="flex flex-wrap items-center gap-2 text-xs text-vara-muted">
          <a
            href="/guides"
            onClick={(e) => handleHrefClick(e, '/guides')}
            className="inline-flex items-center gap-1.5 text-vara-rose-ink hover:underline font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>مجله و راهنمای خرید</span>
          </a>
          <span>/</span>
          <span className="text-vara-ink font-medium truncate">{activeGuide.title}</span>
        </nav>

        {/* Article Header */}
        <header className="bg-white border border-vara-line rounded-3xl p-6 sm:p-10 space-y-5 shadow-shop-card">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="bg-vara-tint/60 text-vara-rose-ink font-semibold px-3 py-1 rounded-full border border-vara-tint-line/40">
              {activeGuide.topicLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-vara-muted">
              <Clock className="w-3.5 h-3.5 text-vara-rose-ink" />
              <span>زمان مطالعه: {activeGuide.readingMinutes.toLocaleString('fa-IR')} دقیقه</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-bold text-vara-ink leading-snug">{activeGuide.title}</h1>
          <p className="text-sm sm:text-base text-vara-muted-strong leading-8">{activeGuide.excerpt}</p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {activeGuide.ctaLinks.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                onClick={(e) => handleHrefClick(e, cta.href)}
                className={
                  cta.primary
                    ? 'inline-flex items-center gap-2 bg-vara-rose hover:bg-vara-rose-hover text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-shop-pill transition-colors'
                    : 'inline-flex items-center gap-2 bg-vara-surface hover:bg-vara-tint text-vara-ink border border-vara-line px-4 py-2.5 rounded-full text-xs font-semibold transition-colors'
                }
              >
                {cta.href === '/calculator' ? <Calculator className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                <span>{cta.label}</span>
              </a>
            ))}
          </div>
        </header>

        {/* Article Body Sections */}
        <div className="bg-white border border-vara-line rounded-3xl p-6 sm:p-10 space-y-8 shadow-shop-card">
          {activeGuide.sections.map((section, idx) => (
            <section key={idx} className="space-y-3.5">
              <h2 className="text-base sm:text-xl font-bold text-vara-ink">{section.heading}</h2>
              {section.paragraphs.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-sm text-vara-muted-strong leading-8">
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2.5 bg-vara-surface/70 border border-vara-line rounded-2xl p-4 sm:p-5 list-disc list-inside text-xs sm:text-sm text-vara-ink leading-7">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Matching Catalog Products */}
        {matchingProducts.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-vara-ink">محصولات مرتبط و پرفروش در فروشگاه</h2>
              <a
                href={
                  activeGuide.relatedBrand
                    ? `/shop?brand=${encodeURIComponent(activeGuide.relatedBrand)}`
                    : activeGuide.relatedCategory
                    ? `/shop?category=${encodeURIComponent(activeGuide.relatedCategory)}`
                    : '/shop'
                }
                onClick={(e) =>
                  handleHrefClick(
                    e,
                    activeGuide.relatedBrand
                      ? `/shop?brand=${encodeURIComponent(activeGuide.relatedBrand)}`
                      : activeGuide.relatedCategory
                      ? `/shop?category=${encodeURIComponent(activeGuide.relatedCategory)}`
                      : '/shop'
                  )
                }
                className="text-xs font-semibold text-vara-rose-ink hover:underline"
              >
                مشاهده همه در فروشگاه
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={onSelectProduct}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Visible FAQ Accordion */}
        {activeGuide.faqs.length > 0 && (
          <section className="bg-white border border-vara-line rounded-3xl p-6 sm:p-8 space-y-4 shadow-shop-card">
            <h2 className="text-base sm:text-lg font-bold text-vara-ink">سوالات متداول این راهنما</h2>
            <div className="divide-y divide-vara-line rounded-2xl border border-vara-line bg-vara-canvas/60">
              {activeGuide.faqs.map((faq, idx) => (
                <details key={idx} className="group px-4 py-3.5">
                  <summary className="flex items-center justify-between gap-3 cursor-pointer list-none text-xs sm:text-sm font-semibold text-vara-ink">
                    <span>{faq.question}</span>
                    <ChevronDown className="w-4 h-4 text-vara-muted shrink-0 transition-transform duration-200 group-open:rotate-180 group-open:text-vara-rose-ink" />
                  </summary>
                  <p className="mt-2.5 text-xs sm:text-sm text-vara-muted-strong leading-7">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-vara-ink">سایر راهنماهای تخصصی ورا بیوتی</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {otherGuides.map((guide) => (
              <a
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                onClick={(e) => handleHrefClick(e, `/guides/${guide.slug}`)}
                className="bg-white border border-vara-line hover:border-vara-tint-line rounded-2xl p-5 space-y-2.5 shadow-shop-card transition-all block"
              >
                <span className="text-[11px] font-semibold text-vara-rose-ink block">{guide.topicLabel}</span>
                <h3 className="text-sm font-bold text-vara-ink leading-6">{guide.title}</h3>
                <p className="text-xs text-vara-muted line-clamp-2 leading-6">{guide.excerpt}</p>
              </a>
            ))}
          </div>
        </section>
      </article>
    );
  }

  // Guides Index View (/guides)
  return (
    <div className="vara-container py-8 sm:py-12 pb-24 space-y-8 font-vazir text-right" dir="rtl">
      <header className="bg-white border border-vara-line rounded-3xl p-6 sm:p-10 space-y-4 shadow-shop-card">
        <h1 className="text-2xl sm:text-3xl font-bold text-vara-ink">مجله مراقبت پوست و راهنمای خرید اورجینال</h1>
        <p className="text-sm text-vara-muted-strong max-w-3xl leading-8">
          مجموعه راهنماهای کاربردی برای تشخیص اصالت محصولات خارجی، انتخاب روتین علمی بر اساس تیپ پوستی و نحوه سفارش مستقیم از سفورا دبی، آمازون امارات و ترندیول.
        </p>

        {/* Topic Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {TOPIC_FILTERS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopic(topic.id)}
              aria-pressed={selectedTopic === topic.id}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                selectedTopic === topic.id
                  ? 'bg-vara-rose text-white border-vara-rose'
                  : 'bg-vara-surface text-vara-ink border-vara-line hover:bg-vara-tint'
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </header>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <article
            key={guide.slug}
            className="bg-white border border-vara-line hover:border-vara-tint-line rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-shop-card hover:shadow-shop-card-hover transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px]">
                <span className="bg-vara-surface text-vara-rose-ink font-semibold px-2.5 py-1 rounded-full border border-vara-line">
                  {guide.topicLabel}
                </span>
                <span className="text-vara-muted inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {guide.readingMinutes.toLocaleString('fa-IR')} دقیقه
                </span>
              </div>

              <h2 className="text-base font-bold text-vara-ink leading-7">
                <a
                  href={`/guides/${guide.slug}`}
                  onClick={(e) => handleHrefClick(e, `/guides/${guide.slug}`)}
                  className="hover:text-vara-rose-ink transition-colors"
                >
                  {guide.title}
                </a>
              </h2>

              <p className="text-xs sm:text-sm text-vara-muted-strong leading-7">{guide.excerpt}</p>
            </div>

            <div className="pt-3 border-t border-vara-line flex items-center justify-between">
              <a
                href={`/guides/${guide.slug}`}
                onClick={(e) => handleHrefClick(e, `/guides/${guide.slug}`)}
                className="text-xs font-bold text-vara-rose-ink hover:underline"
              >
                مطالعه راهنما ←
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Direct International Calculator Banner */}
      <div className="bg-vara-surface border border-vara-tint-line/50 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-right">
          <h2 className="text-base sm:text-lg font-bold text-vara-ink">محصول مورد نظرتان را از سایت‌های خارجی انتخاب کرده‌اید؟</h2>
          <p className="text-xs sm:text-sm text-vara-muted-strong">
            لینک سفورا دبی، آمازون امارات، ترندیول یا لوک‌فنتستیک را وارد کنید و قیمت تمام‌شده را فوری ببینید.
          </p>
        </div>
        <a
          href="/calculator"
          onClick={(e) => handleHrefClick(e, '/calculator')}
          className="bg-vara-rose hover:bg-vara-rose-hover text-white px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 shrink-0 shadow-shop-pill transition-colors"
        >
          <Calculator className="w-4 h-4" />
          <span>محاسبه قیمت خرید خارجی</span>
        </a>
      </div>
    </div>
  );
};
