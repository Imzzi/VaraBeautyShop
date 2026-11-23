import { CarouselSlide } from '../types';

export const DEFAULT_HERO_SLIDES: CarouselSlide[] = [
  {
    id: 'sheglam-hair',
    eyebrow: 'S H E G L A M   H A I R',
    titlePart1: 'جدیدترین دستگاه',
    titlePart2: 'شیگلم رسید',
    titleColorClass: 'text-[#8A1A3C]',
    subtitle: 'برس حرارتی و حالت‌دهنده هوشمند، بدون آسیب به ساقه مو با ماندگاری ۲۴ ساعته',
    ctaText: 'مشاهده و خرید دستگاه',
    bgGradient: 'from-[#FFF0F5] via-[#FDF5F8] to-[#FFFFFF]',
    imageSrc: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'جدیدترین دستگاه شیگلم',
    bubbleColor: 'border-pink-200/60 bg-pink-100/30',
    actionType: 'explore',
    linkUrl: ''
  },
  {
    id: 'vara-ai-advisor',
    eyebrow: 'V A R A   A I   •   اسـکن چـهـره و تـشـخـیص مـوانـع پـوسـتـی',
    titlePart1: 'آنالیز چهره و مشاوره تخصصی با',
    titlePart2: 'هوش مصنوعی ورا بیوتی',
    titleColorClass: 'text-[#0F3B2C]',
    subtitle: 'اسکن تصویری چهره، تشخیص موانع پوستی، بررسی منع مصرف و ناسازگاری ترکیبات و پیشنهاد روتین علمی اختصاصی',
    ctaText: 'شروع آنالیز چهره با هوش مصنوعی',
    bgGradient: 'from-[#EBF5EE] via-[#F2F8F4] to-[#FFFFFF]',
    imageSrc: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'آنالیز چهره و مشاوره تخصصی با هوش مصنوعی ورا بیوتی',
    bubbleColor: 'border-emerald-200/60 bg-emerald-100/30',
    actionType: 'ai_advisor',
    linkUrl: ''
  },
  {
    id: 'the-ordinary-serums',
    eyebrow: 'T H E   O R D I N A R Y   &   C O S R X',
    titlePart1: 'سرم‌های درمانی و جوانساز',
    titlePart2: 'اصالت ۱۰۰٪ تضمینی',
    titleColorClass: 'text-[#454a4f]',
    subtitle: 'مستقیم از نمایندگی‌های رسمی کانادا و کره جنوبی با بچ‌کد معتبر جهانی',
    ctaText: 'مشاهده پرفروش‌ترین‌ها',
    bgGradient: 'from-[#F2F5F8] via-[#F7FAFC] to-[#FFFFFF]',
    imageSrc: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop',
    imageAlt: 'سرم‌های پوستی اوردینری و کوزارکس',
    bubbleColor: 'border-blue-200/50 bg-blue-100/20',
    actionType: 'explore',
    linkUrl: ''
  }
];

export const HERO_SLIDES_STORAGE_KEY = 'vara_hero_slides_config';

export function getLocalHeroSlides(): CarouselSlide[] {
  if (typeof window === 'undefined') return DEFAULT_HERO_SLIDES;
  try {
    const saved = localStorage.getItem(HERO_SLIDES_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const aiSlide = DEFAULT_HERO_SLIDES.find(s => s.id === 'vara-ai-advisor') || DEFAULT_HERO_SLIDES[1];
        const aiIndex = parsed.findIndex((s: CarouselSlide) => s.actionType === 'ai_advisor' || s.id === 'vara-ai-advisor');
        if (aiIndex >= 0) {
          // Keep slide updated with current rich AI copy
          parsed[aiIndex] = {
            ...parsed[aiIndex],
            ...aiSlide
          };
          localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(parsed));
          return parsed;
        } else {
          const updated = [...parsed];
          if (updated.length >= 2) {
            updated[1] = aiSlide;
          } else {
            updated.push(aiSlide);
          }
          localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
      }
    }
  } catch (err) {
    console.error('Error reading hero slides from storage:', err);
  }
  return DEFAULT_HERO_SLIDES;
}

export function saveLocalHeroSlides(slides: CarouselSlide[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HERO_SLIDES_STORAGE_KEY, JSON.stringify(slides));
    window.dispatchEvent(new Event('vara-hero-slides-change'));
  } catch (err) {
    console.error('Error saving hero slides to storage:', err);
  }
}
