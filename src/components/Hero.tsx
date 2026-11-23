import { Modal } from './Modal';
import { HERO_IMAGE_SIZES, HERO_IMAGE_WIDTHS, responsiveImageSrcSet } from '../lib/productImages';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Link2, X, User, Sparkles, Calculator } from 'lucide-react';
import { Product, CarouselSlide } from '../types';
import { ProductImage } from './ProductImage';
import { getProductCover, DEFAULT_PRODUCT_IMAGE, HERO_PRODUCT_IDS } from '../lib/productImages';
import { getLocalHeroSlides } from '../data/heroSlides';

interface HeroProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onOpenAccount: () => void;
  onExploreClick?: () => void;
  onQuizClick?: () => void;
  onFlashSaleClick?: () => void;
  onCalculatePrice?: (url: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  products,
  onViewProduct,
  onOpenAccount,
  onExploreClick,
  onQuizClick,
  onFlashSaleClick,
  onCalculatePrice
}) => {
  const [calculatorInputUrl, setCalculatorInputUrl] = useState('');
  // Slides dynamic state from storage and listeners
  const [slides, setSlides] = useState<CarouselSlide[]>(() => getLocalHeroSlides());

  useEffect(() => {
    const handleSlidesChange = () => {
      setSlides(getLocalHeroSlides());
    };
    window.addEventListener('vara-hero-slides-change', handleSlidesChange);
    return () => window.removeEventListener('vara-hero-slides-change', handleSlidesChange);
  }, []);

  // Carousel slide state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [campaignOpen, setCampaignOpen] = useState(false);

  // Modals state
  const [directLinkModalOpen, setDirectLinkModalOpen] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  const activeSlides = slides.length > 0 ? slides : getLocalHeroSlides();

  // Ensure current index is within bounds when slides count changes
  useEffect(() => {
    if (currentSlideIndex >= activeSlides.length) {
      setCurrentSlideIndex(0);
    }
  }, [activeSlides.length, currentSlideIndex]);

  const handleNextSlide = () => {
    setCurrentSlideIndex(prev => (prev + 1) % activeSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex(prev => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  const handleSlideCta = (slide: CarouselSlide) => {
    if (slide.actionType === 'custom_url' && slide.linkUrl) {
      if (slide.linkUrl.startsWith('http://') || slide.linkUrl.startsWith('https://')) {
        window.open(slide.linkUrl, '_blank', 'noopener,noreferrer');
      } else if (slide.linkUrl.startsWith('/#') || slide.linkUrl.startsWith('#')) {
        window.location.hash = slide.linkUrl.replace('/#', '#');
      } else {
        window.location.href = slide.linkUrl;
      }
      return;
    }

    if (slide.actionType === 'ai_advisor') {
      window.dispatchEvent(new CustomEvent('vara-open-ai-advisor', { detail: { tab: 'chat' } }));
      return;
    }

    if (slide.actionType === 'quiz' && onQuizClick) {
      onQuizClick();
    } else if (slide.actionType === 'flash' && onFlashSaleClick) {
      onFlashSaleClick();
    } else if (onExploreClick) {
      onExploreClick();
    }
  };

  const handleDirectLinkSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!productUrl.trim()) return;
    setDirectLinkModalOpen(false);
    onCalculatePrice?.(productUrl.trim());
  };

  const featured = HERO_PRODUCT_IDS
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product && getProductCover(product) !== DEFAULT_PRODUCT_IMAGE));

  return (
    <section className="vara-home" aria-labelledby="vara-home-title">
      <div className="vara-container vara-home-inner">
        <div className="vara-hero">
          <div className="vara-hero-copy">
            <p className="vara-hero-kicker">فروشگاه مراقبت پوست ورا</p>
            <h1 id="vara-home-title">روتین پوست،<br /><span>به انتخاب شما.</span></h1>
            <p>محصولات مراقبت پوست را بر اساس نیاز پوستتان پیدا کنید. ترکیبات، حجم و روش مصرف را کنار هم ببینید و روتین خودتان را بسازید.</p>
            <div className="vara-hero-actions">
              <button type="button" onClick={onExploreClick} className="vara-button vara-button-primary">دیدن محصولات</button>
              <button type="button" onClick={onQuizClick} className="vara-button">راهنمای انتخاب روتین</button>
            </div>
          </div>
          <div className="vara-hero-stage">
            {featured.length > 0 ? (
              <div className="vara-hero-products">
                {featured.map((product, index) => (
                  <a href={`/product/${encodeURIComponent(product.id)}`} className="vara-hero-product" key={product.id}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                      event.preventDefault();
                      onViewProduct(product);
                    }}>
                    <ProductImage
                      src={getProductCover(product)}
                      alt={product.nameFa}
                      width={560}
                      height={560}
                      fetchPriority={index === 0 ? 'high' : 'auto'}
                      referrerPolicy="no-referrer"
                      decoding="async"
                    />
                    <bdi>{product.brand}</bdi>
                  </a>
                ))}
              </div>
            ) : <img className="vara-hero-mark" src="/vara-logo.svg" alt="ورا" width={300} height={101} />}
          </div>
        </div>

        {/* ========================================================= */}
        {/* STREAMLINED QUICK TOOLS & UAE LINK PRICE CALCULATOR BAR   */}
        {/* ========================================================= */}
        <div className="vara-tools grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Integrated UAE Link Price Calculator (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center gap-3 lg:border-l lg:border-[#F0E1E4] lg:pl-5">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#F4E4E8] border border-[#D48C9E]/50 text-[#8C3B58] flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-[#23191E]">
                    محاسبه قیمت خرید خارجی
                  </h2>

                </div>
                <p className="text-[11px] text-[#785E67]">
                  سفورا، آمازون امارات، لوک‌فنتستیک و ترندیول
                </p>
              </div>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (onCalculatePrice) {
                  onCalculatePrice(calculatorInputUrl.trim() || 'https://www.sephora.ae/en/p/soft-pinch-liquid-blush-P97989778.html');
                }
              }}
              className="flex-1 flex items-center gap-2"
            >
              <input
                type="url"
                value={calculatorInputUrl}
                onChange={(e) => setCalculatorInputUrl(e.target.value)}
                aria-label="لینک محصول برای محاسبه قیمت"
                placeholder="https://…"
                dir="ltr"
                className="flex-1 min-w-0 bg-white border border-[#F0E1E4] focus:border-[#8C3B58] rounded-xl px-3 py-2 text-xs text-[#23191E] placeholder-[#785E67] outline-none font-mono transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#8C3B58] hover:bg-[#732E47] text-white font-semibold text-xs shadow-shop-pill transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
              >
                <span>محاسبه قیمت</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Streamlined Quick Tools Triggers (5 cols on desktop) */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                if (onQuizClick) onQuizClick();
              }}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4E4E8]/60 border border-[#F0E1E4] hover:border-[#D48C9E] transition-all flex flex-col items-start text-right cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8C3B58]" />
                <ArrowLeft className="w-3 h-3 text-[#785E67] group-hover:-translate-x-0.5 group-hover:text-[#8C3B58] transition-all" />
              </div>
              <span className="text-[11px] font-semibold text-[#23191E] line-clamp-1">تست روتین پوست</span>
              <span className="text-[10px] text-[#785E67] line-clamp-1">راهنمای انتخاب</span>
            </button>

            <button
              type="button"
              onClick={() => setDirectLinkModalOpen(true)}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4E4E8]/60 border border-[#F0E1E4] hover:border-[#D48C9E] transition-all flex flex-col items-start text-right cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Link2 className="w-3.5 h-3.5 text-[#8C3B58]" />
                <ArrowLeft className="w-3 h-3 text-[#785E67] group-hover:-translate-x-0.5 group-hover:text-[#8C3B58] transition-all" />
              </div>
              <span className="text-[11px] font-semibold text-[#23191E] line-clamp-1">سفارش با لینک</span>
              <span className="text-[10px] text-[#785E67] line-clamp-1">خرید از سایت‌های جهانی</span>
            </button>

            <button
              type="button"
              onClick={onOpenAccount}
              className="p-2.5 rounded-xl bg-white hover:bg-[#F4E4E8]/60 border border-[#F0E1E4] hover:border-[#D48C9E] transition-all flex flex-col items-start text-right cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <User className="w-3.5 h-3.5 text-[#8C3B58]" />
                <ArrowLeft className="w-3 h-3 text-[#785E67] group-hover:-translate-x-0.5 group-hover:text-[#8C3B58] transition-all" />
              </div>
              <span className="text-[11px] font-semibold text-[#23191E] line-clamp-1">حساب کاربری</span>
              <span className="text-[10px] text-[#785E67] line-clamp-1">پیگیری سفارش‌ها</span>
            </button>
          </div>

        </div>
        <details className="vara-campaigns" open={campaignOpen} onToggle={(event) => setCampaignOpen(event.currentTarget.open)}>
          <summary>تازه‌های ورا</summary>
          {campaignOpen && <div className="vara-campaign">
            {currentSlide && <>
              <img src={currentSlide.imageSrc} srcSet={responsiveImageSrcSet(currentSlide.imageSrc, HERO_IMAGE_WIDTHS)}
                sizes={HERO_IMAGE_SIZES} alt={currentSlide.imageAlt} loading="lazy" referrerPolicy="no-referrer" />
              <div>
                <h2>{currentSlide.titlePart1} {currentSlide.titlePart2}</h2>
                <p>{currentSlide.subtitle}</p>
                <button type="button" className="vara-button vara-button-primary" onClick={() => handleSlideCta(currentSlide)}>{currentSlide.ctaText}</button>
                {activeSlides.length > 1 && <div className="vara-campaign-nav">
                  <button type="button" className="vara-button" onClick={handlePrevSlide} aria-label="خبر قبلی"><ChevronRight size={18} /></button>
                  <button type="button" className="vara-button" onClick={handleNextSlide} aria-label="خبر بعدی"><ChevronLeft size={18} /></button>
                </div>}
              </div>
            </>}
          </div>}
        </details>
      </div>

      {directLinkModalOpen && (
        <Modal label="سفارش با لینک" onClose={() => setDirectLinkModalOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-[#23191E]/50">
          <form onSubmit={handleDirectLinkSubmit} className="w-full max-w-md rounded-xl bg-white p-5 space-y-4">
            <div className="flex justify-between items-center gap-3">
              <h2 className="font-bold text-lg">سفارش با لینک</h2>
              <button type="button" className="vara-button" aria-label="بستن سفارش با لینک" onClick={() => setDirectLinkModalOpen(false)}><X size={18} /></button>
            </div>
            <p className="text-sm text-[#785E67]">لینک صفحه محصول را وارد کنید تا قیمت و گزینه‌های خرید را ببینید.</p>
            <label htmlFor="vara-direct-link" className="block text-sm font-medium">نشانی محصول</label>
            <input id="vara-direct-link" type="url" required dir="ltr" value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)} placeholder="https://…" className="w-full border rounded-lg px-3" />
            <button type="submit" className="vara-button vara-button-primary">محاسبه قیمت</button>
          </form>
        </Modal>
      )}
    </section>
  );
};
