import { Modal } from './Modal';
import { HERO_IMAGE_SIZES, HERO_IMAGE_WIDTHS, responsiveImageSrcSet } from '../lib/productImages';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, Link2, Sparkles, User, X } from 'lucide-react';
import type { CarouselSlide } from '../types';
import { getLocalHeroSlides, HERO_SLIDES_STORAGE_KEY } from '../data/heroSlides';
import { sanitizeNavigationUrl } from '../utils/safeUrl';

interface HeroProps {
  onOpenAccount: () => void;
  onExploreClick?: () => void;
  onQuizClick?: () => void;
  onFlashSaleClick?: () => void;
  onCalculatePrice?: (url: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAccount,
  onExploreClick,
  onQuizClick,
  onFlashSaleClick,
  onCalculatePrice
}) => {
  const [calculatorInputUrl, setCalculatorInputUrl] = useState('');
  const [slides, setSlides] = useState(getLocalHeroSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [directLinkModalOpen, setDirectLinkModalOpen] = useState(false);
  const [productUrl, setProductUrl] = useState('');

  useEffect(() => {
    const refreshSlides = () => {
      setSlides(getLocalHeroSlides());
      setCurrentSlideIndex(0);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === HERO_SLIDES_STORAGE_KEY || event.key === null) refreshSlides();
    };
    window.addEventListener('vara-hero-slides-change', refreshSlides);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('vara-hero-slides-change', refreshSlides);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || isHovered || hasFocus ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = window.setInterval(() => {
      setCurrentSlideIndex((index) => (index + 1) % slides.length);
    }, 5500);
    return () => window.clearInterval(interval);
  }, [slides.length, isHovered, hasFocus]);

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleSlideCta = (slide: CarouselSlide) => {
    if (slide.actionType === 'custom_url' && slide.linkUrl) {
      const safeUrl = sanitizeNavigationUrl(slide.linkUrl);
      if (!safeUrl) return;
      if (safeUrl.startsWith('http://') || safeUrl.startsWith('https://')) {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
      } else if (safeUrl.startsWith('/#') || safeUrl.startsWith('#')) {
        window.location.hash = safeUrl.replace('/#', '#');
      } else {
        window.location.href = safeUrl;
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

  return (
    <section className="vara-home" aria-labelledby="vara-home-title">
      <div className="vara-container vara-home-inner">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setHasFocus(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setHasFocus(false);
          }}
          className="w-full relative rounded-3xl overflow-hidden border border-vara-line h-[400px] sm:h-[440px] lg:h-[470px] bg-vara-surface flex flex-col justify-between shadow-shop-card"
        >
          {/* Slide Content Layout */}
          <div className="relative z-10 w-full flex-1 flex items-center justify-between p-6 sm:p-10 lg:p-14 overflow-hidden">

            {/* Background Campaign Imagery */}
            <img
              src={currentSlide.imageSrc}
              srcSet={responsiveImageSrcSet(currentSlide.imageSrc, HERO_IMAGE_WIDTHS)}
              sizes={HERO_IMAGE_SIZES}
              alt={currentSlide.imageAlt}
              className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-transform duration-700"
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />

            {/* Warm Blush Scrim */}
            <div className="absolute inset-0 bg-gradient-to-l from-vara-canvas/95 via-vara-surface/75 to-transparent pointer-events-none z-1" />

            {/* Editorial Copy Column (Right in RTL) */}
            <div className="relative z-10 w-full md:max-w-[54%] text-start space-y-5 flex flex-col justify-center">

              {/* Boutique Eyebrow */}
              <div className="flex items-center gap-2.5 justify-start">
                <span className="text-xs font-semibold text-vara-rose-ink font-jakarta bg-vara-tint border border-vara-tint-line/40 px-2.5 py-1 rounded-full">
                  {currentSlide.eyebrow || 'CLINICAL FORMULATIONS'}
                </span>
                {currentSlide.actionType === 'ai_advisor' && (
                  <span className="text-[10px] font-semibold bg-vara-rose text-white px-2.5 py-1 rounded-full">
                    هوش مصنوعی ورا
                  </span>
                )}
              </div>

              {/* Balanced Persian Headline */}
              <div className="space-y-1.5">
                <h1 id="vara-home-title" className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-vara-ink leading-[1.28]">
                  {currentSlide.titlePart1}
                </h1>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-vara-ink leading-[1.28]">
                  {currentSlide.titlePart2}
                </div>
              </div>

              {/* Subtitle Description */}
              <p className="text-sm sm:text-base text-vara-muted leading-relaxed max-w-md line-clamp-2">
                {currentSlide.subtitle}
              </p>

              <div className="pt-2 flex">
                <button
                  type="button"
                  onClick={() => handleSlideCta(currentSlide)}
                  className="px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-vara-rose hover:bg-vara-rose-hover text-white shadow-shop-violet transition-all duration-150 flex items-center gap-2.5 cursor-pointer group active:scale-98"
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowLeft className="w-4 h-4 text-white group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        </div>


        {/* ========================================================= */}
        {/* STREAMLINED QUICK TOOLS & UAE LINK PRICE CALCULATOR BAR   */}
        {/* ========================================================= */}
        <div className="vara-tools grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Integrated UAE Link Price Calculator (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-center gap-3 lg:border-e lg:border-vara-line lg:pe-5">
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-full bg-vara-tint border border-vara-tint-line/50 text-vara-rose-ink flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs sm:text-sm font-bold text-vara-ink">
                    محاسبه قیمت خرید خارجی
                  </h2>

                </div>
                <p className="text-[11px] text-vara-muted">
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
                className="flex-1 min-w-0 bg-white border border-vara-line focus:border-vara-rose rounded-full px-3 py-2 text-xs text-vara-ink placeholder-vara-muted outline-none font-mono transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-full bg-vara-rose hover:bg-vara-rose-hover text-white font-semibold text-xs shadow-shop-pill transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
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
              className="p-3 rounded-2xl bg-white hover:bg-vara-tint/60 border border-vara-line hover:border-vara-tint-line transition-all flex flex-col items-start text-right cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-vara-rose-ink" />
                <ArrowLeft className="w-3 h-3 text-vara-muted group-hover:-translate-x-0.5 group-hover:text-vara-rose-ink transition-all" />
              </div>
              <span className="text-[11px] font-semibold text-vara-ink line-clamp-1">تست روتین پوست</span>
              <span className="text-[10px] text-vara-muted line-clamp-1">راهنمای انتخاب</span>
            </button>

            <button
              type="button"
              onClick={() => setDirectLinkModalOpen(true)}
              className="p-3 rounded-2xl bg-white hover:bg-vara-tint/60 border border-vara-line hover:border-vara-tint-line transition-all flex flex-col items-start text-right cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <Link2 className="w-3.5 h-3.5 text-vara-rose-ink" />
                <ArrowLeft className="w-3 h-3 text-vara-muted group-hover:-translate-x-0.5 group-hover:text-vara-rose-ink transition-all" />
              </div>
              <span className="text-[11px] font-semibold text-vara-ink line-clamp-1">سفارش با لینک</span>
              <span className="text-[10px] text-vara-muted line-clamp-1">خرید از سایت‌های جهانی</span>
            </button>

            <button
              type="button"
              onClick={onOpenAccount}
              className="p-3 rounded-2xl bg-white hover:bg-vara-tint/60 border border-vara-line hover:border-vara-tint-line transition-all flex flex-col items-start text-right cursor-pointer group"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <User className="w-3.5 h-3.5 text-vara-rose-ink" />
                <ArrowLeft className="w-3 h-3 text-vara-muted group-hover:-translate-x-0.5 group-hover:text-vara-rose-ink transition-all" />
              </div>
              <span className="text-[11px] font-semibold text-vara-ink line-clamp-1">حساب کاربری</span>
              <span className="text-[10px] text-vara-muted line-clamp-1">پیگیری سفارش‌ها</span>
            </button>
          </div>

        </div>
      </div>

      {directLinkModalOpen && (
        <Modal label="سفارش با لینک" onClose={() => setDirectLinkModalOpen(false)} className="fixed inset-0 flex items-center justify-center p-4 bg-vara-ink/50">
          <form onSubmit={handleDirectLinkSubmit} className="w-full max-w-md rounded-xl bg-white p-5 space-y-4">
            <div className="flex justify-between items-center gap-3">
              <h2 className="font-bold text-lg">سفارش با لینک</h2>
              <button type="button" className="vara-button" aria-label="بستن سفارش با لینک" onClick={() => setDirectLinkModalOpen(false)}><X size={18} /></button>
            </div>
            <p className="text-sm text-vara-muted">لینک صفحه محصول را وارد کنید تا قیمت و گزینه‌های خرید را ببینید.</p>
            <label htmlFor="vara-direct-link" className="block text-sm font-medium">نشانی محصول</label>
            <input id="vara-direct-link" type="url" required dir="ltr" value={productUrl}
              onChange={(event) => setProductUrl(event.target.value)} placeholder="https://…" className="w-full border rounded-full px-3" />
            <button type="submit" className="vara-button vara-button-primary">محاسبه قیمت</button>
          </form>
        </Modal>
      )}
    </section>
  );
};
