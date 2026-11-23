import { RoutineLabel } from './RoutineLabel';
import { getProductImages, isPackShot, packagingImage } from '../lib/productImages';
import { Modal } from './Modal';
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, ArrowLeft, Star, Sun, Moon, 
  CheckCircle2, Heart,
  AlertTriangle, CheckCheck, Bot,
  Calendar, Shield, ShieldCheck, MapPin, UserCheck, Clock,
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, Sparkles, Check,
  Droplets, FlaskConical, Layers, ChevronDown, ChevronUp, Info, Zap, Award
} from 'lucide-react';
import { Product, ProductSize, ProductVariant, Review, UserSkinProfile, SHOP_ROUTINES } from '../types';
import { ProductCard } from './ProductCard';
import { getSavedSkinProfile } from '../data/quizData';
import {
  DEFAULT_PRODUCT_IMAGE, PRODUCT_COVER_SIZES, PRODUCT_COVER_WIDTHS,
  resolveBlobUrl, responsiveImageSrcSet,
} from '../lib/productImages';
import { enrichIngredientsLocally, isGenericIngredientDescription } from '../lib/ingredientDescriptions';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize: ProductSize, quantity?: number, selectedVariant?: ProductVariant) => void;
  onOpenQuiz?: () => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

const KNOWN_ACTIVE_INGREDIENTS = [
  'آزلائیک اسید', 'بتائین سالیسیلات', 'هیالورونیک اسید', 'سدیم هیالورونات',
  'پانتنول', 'نیاسینامید', 'سنتلا آسیاتیکا', 'عصاره سنتلا', 'آلانتوئین',
  'بتاگلوکان', 'زینک PCA', 'زینک اکساید', 'سرامید NP', 'سرامید AP', 'سرامید EOP',
  'سرامید', 'ویتامین C', 'ویتامین E', 'رتینول', 'سالیسیلیک اسید',
  'گلیکولیک اسید', 'لاکتیک اسید', 'پپتید', 'کلاژن', 'کافئین', 'کاتچین',
  'عصاره چای سبز', 'روغن آرگان', 'اسکوالان', 'اکتوئین', 'مادکاسیک اسید',
  'آسیاتیکوزاید', 'آسیاتیک اسید', 'توکوفرول', 'آووبنزون', 'اکتوکریلن',
  'اکتی‌سالات', 'هموسالات', 'گلیسیرین', 'عصاره لایلاک', 'عصاره خالص گیاهی'
];

function isInsideParens(text: string, index: number): boolean {
  const before = text.substring(0, index);
  const openCount = (before.match(/\(/g) || []).length;
  const closeCount = (before.match(/\)/g) || []).length;
  return openCount > closeCount;
}

function cleanIngredientName(text?: string): string {
  if (!text) return '';
  return text
    .replace(/\s*\(\s*active\s+ingredient\s*\)/gi, '')
    .replace(/\s*\[\s*active\s+ingredient\s*\]/gi, '')
    .replace(/\s*\(\s*ترکیب\s+فعال\s*\)/gi, '')
    .replace(/\s*\[\s*ترکیب\s+فعال\s*\]/gi, '')
    .trim();
}

function cleanIngredientNameEn(text?: string): string {
  if (!text) return '';
  const cleaned = cleanIngredientName(text);
  if (/^active\s+ingredient$/i.test(cleaned) || /^ترکیب\s+فعال$/i.test(cleaned)) {
    return '';
  }
  return cleaned;
}

function normalizeKeyIngredients(
  rawIngredients?: { nameFa: string; nameEn?: string; description?: string }[]
): { nameFa: string; nameEn?: string; description?: string }[] {
  if (!rawIngredients || rawIngredients.length === 0) return [];

  const results: { nameFa: string; nameEn?: string; description?: string }[] = [];

  for (const ing of rawIngredients) {
    const rawText = cleanIngredientName(ing.nameFa || '');
    if (!rawText) continue;

    const safeNameEn = cleanIngredientNameEn(ing.nameEn);

    const lines = rawText
      .split(/[\n\r،,;؛|•\t]+|\s+(?=[0-9۰-۹]+[\.\-]\s*)/)
      .map(s => s.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (line.includes('→') || line.includes('←')) {
        const arrow = line.includes('→') ? '→' : '←';
        const parts = line.split(arrow);
        const namePart = parts[0]?.trim();
        const descPart = parts.slice(1).join(' ').trim();
        if (namePart) {
          results.push({
            nameFa: cleanIngredientName(namePart.replace(/^[0-9۰-۹]+[\.\-\s]+/, '').trim()),
            nameEn: safeNameEn || undefined,
            description: descPart || ing.description || 'تغذیه عمیق و تقویت ساختار طبیعی پوست'
          });
        }
        continue;
      }

      const sorted = [...KNOWN_ACTIVE_INGREDIENTS].sort((a, b) => b.length - a.length);
      const pattern = new RegExp('(' + sorted.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'g');
      const matches: { name: string; idx: number }[] = [];
      let m: RegExpExecArray | null;
      let lastEnd = 0;
      while ((m = pattern.exec(line)) !== null) {
        if (m.index < lastEnd || isInsideParens(line, m.index)) continue;
        matches.push({ name: m[1], idx: m.index });
        lastEnd = m.index + m[0].length;
      }

      if (matches.length > 1) {
        for (let i = 0; i < matches.length; i++) {
          const next = i + 1 < matches.length ? matches[i + 1].idx : line.length;
          const chunk = line.substring(matches[i].idx, next).replace(/^[0-9۰-۹]+[\.\-\s]+/, '').trim();
          if (chunk) {
            results.push({
              nameFa: cleanIngredientName(chunk),
              nameEn: safeNameEn || undefined,
              description: ing.description || 'تغذیه عمیق و تقویت ساختار طبیعی پوست'
            });
          }
        }
      } else {
        results.push({
          nameFa: cleanIngredientName(line.replace(/^[0-9۰-۹]+[\.\-\s]+/, '').trim()),
          nameEn: safeNameEn || undefined,
          description: ing.description
        });
      }
    }
  }

  return results;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onOpenQuiz,
  isWishlisted: externalIsWishlisted,
  onToggleWishlist
}) => {
  const defaultSize: ProductSize = {
    label: '۳۰ میلی‌لیتر',
    labelEn: '30 ml',
    price: product.price || 0
  };

  const [aiIngredientMap, setAiIngredientMap] = useState<Record<string, { nameEn?: string; description: string }>>({});
  const [loadingAiIngredients, setLoadingAiIngredients] = useState<boolean>(false);

  const { baseIngredientsList, pendingAiNames } = React.useMemo(() => {
    const normalized = normalizeKeyIngredients(product.keyIngredients);
    if (normalized.length > 0) {
      const { enriched, needsAiNames } = enrichIngredientsLocally(normalized);
      return { baseIngredientsList: enriched, pendingAiNames: needsAiNames };
    }
    return {
      baseIngredientsList: [
        {
          nameFa: 'نیاسینامید خالص (ویتامین B3)',
          nameEn: 'Niacinamide (Vitamin B3)',
          description: 'تقویت سد دفاعی پوست، کنترل ترشح سبوم، کاهش التهابات و یکدست‌کننده رنگ چهره.'
        },
        {
          nameFa: 'کمپلکس هیالورونیک اسید چندوزنی',
          nameEn: 'Multi-Weight Hyaluronic Acid',
          description: 'نفوذ به لایه‌های مختلف اپیدرم، اتصال رطوبت تا ۱۰۰۰ برابر وزن مولکولی و رفع خطوط ناشی از خشکی.'
        },
        {
          nameFa: 'عصاره سنتلا آسیاتیکا (سیکا)',
          nameEn: 'Centella Asiatica (Cica)',
          description: 'تسکین‌بخش فوری سوزش و قرمزی، تحریک بیوسنتز کلاژن نوع یک و بازسازی بافت آسیب‌دیده.'
        },
        {
          nameFa: 'سرامیدهای بیومیمتیک (NP/AP)',
          nameEn: 'Biomimetic Ceramides',
          description: 'جایگزین لیپیدهای از دست‌رفته پوست، ایجاد سد ضد نفوذ آلاینده‌ها و جلوگیری از تبخیر آب (TEWL).'
        }
      ],
      pendingAiNames: [] as string[]
    };
  }, [product.keyIngredients]);

  useEffect(() => {
    const unresolved = pendingAiNames.filter((name) => !aiIngredientMap[name]);
    if (unresolved.length === 0) return;

    let cancelled = false;
    setLoadingAiIngredients(true);

    fetch('/api/ingredients/describe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: unresolved,
        productNameFa: product.nameFa,
        category: product.category,
        productId: product.id
      })
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.success && Array.isArray(data.ingredients)) {
          setAiIngredientMap((prev) => {
            const next = { ...prev };
            for (const item of data.ingredients) {
              if (item?.nameFa && item?.description) {
                next[String(item.nameFa).trim()] = {
                  nameEn: item.nameEn ? String(item.nameEn).trim() : undefined,
                  description: String(item.description).trim()
                };
              }
            }
            return next;
          });
        }
      })
      .catch(() => {
        // Fallback handled gracefully
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingAiIngredients(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [product.id, product.nameFa, product.category, pendingAiNames.join('|')]);

  const activeIngredientsList = React.useMemo(() => {
    return baseIngredientsList.map((ing) => {
      const cleanName = cleanIngredientName(ing.nameFa);
      const aiData = aiIngredientMap[ing.nameFa] || aiIngredientMap[cleanName];
      const finalDescription =
        !isGenericIngredientDescription(ing.description)
          ? ing.description
          : aiData?.description || ing.description || 'تغذیه عمیق و تقویت ساختار طبیعی پوست';
      const finalNameEn = cleanIngredientNameEn(ing.nameEn) || aiData?.nameEn || '';
      return {
        nameFa: cleanName,
        nameEn: finalNameEn || undefined,
        description: finalDescription
      };
    });
  }, [baseIngredientsList, aiIngredientMap]);

  const sources = [...new Set([...getProductImages(product), ...(product.variants ?? []).map((variant) => packagingImage(variant.image)).filter(Boolean)])];
  const imagesList = sources.length > 0 ? sources : [DEFAULT_PRODUCT_IMAGE];
  const [coverReady, setCoverReady] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const [visitedImages, setVisitedImages] = useState<Set<string>>(() => new Set());

  const recordImageFailure = (src: string) => {
    setFailedImages((previous) => previous.has(src) ? previous : new Set(previous).add(src));
  };

  const displayImage = (src: string) => failedImages.has(src) ? '/vara-logo.svg' : src;

  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Zoom-on-hover state for product texture & packaging inspection
  const [isHoverZooming, setIsHoverZooming] = useState<boolean>(false);
  const [zoomCoords, setZoomCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [lightboxZoom, setLightboxZoom] = useState<boolean>(false);
  const [lightboxCoords, setLightboxCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y))
    });
  };

  const handleImageMouseEnter = () => {
    setIsHoverZooming(true);
  };

  const handleImageMouseLeave = () => {
    setIsHoverZooming(false);
    setZoomCoords({ x: 50, y: 50 });
  };

  const [sizeChoice, setSelectedSize] = useState<ProductSize>(product.sizes?.[0] || defaultSize);
  const selectedSize = product.sizes?.find((size) => size.label === sizeChoice.label) ?? product.sizes?.[0] ?? sizeChoice;
  const [variantChoice, setSelectedVariant] = useState<ProductVariant | null>(product.variants?.[0] ?? null);
  const selectedVariant = product.variants?.find((variant) => variant.id === variantChoice?.id) ?? product.variants?.[0] ?? null;
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'features' | 'ingredients' | 'routine' | 'compatibility' | 'reviews'>('features');
  const [selectedIngredientIdx, setSelectedIngredientIdx] = useState<number | null>(null);
  const [routineTimeOfDay, setRoutineTimeOfDay] = useState<'morning' | 'night'>('morning');
  const [showStickyMobileBar, setShowStickyMobileBar] = useState<boolean>(false);
  const [added, setAdded] = useState(false);
  const [internalIsWishlisted, setInternalIsWishlisted] = useState(false);
  const isWishlisted = externalIsWishlisted !== undefined ? externalIsWishlisted : internalIsWishlisted;
  const [userProfile, setUserProfile] = useState<UserSkinProfile | null>(null);

  // Dropdown list view states for ingredients & specifications cards
  const [openIngredientsList, setOpenIngredientsList] = useState<boolean>(true);
  const [openIngredientIdx, setOpenIngredientIdx] = useState<number | null>(null);
  const [openSpecs, setOpenSpecs] = useState<Record<string, boolean>>({
    authenticity: true,
    sourcing: false,
    targetAudience: false,
    unsuitable: false,
    expiry: false,
    routine: false
  });

  const toggleSpec = (key: string) => {
    setOpenSpecs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleIngredient = (idx: number) => {
    setOpenIngredientIdx((prev) => (prev === idx ? null : idx));
  };

  // Scroll listener for sticky mobile buy bar
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowStickyMobileBar(window.scrollY > 420);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamic Page Title for Product SEO & Social Sharing
  useEffect(() => {
    if (product) {
      const origTitle = document.title;
      const brandName = product.brand ? ` برند ${product.brand}` : '';
      document.title = `${product.nameFa || product.nameEn}${brandName} | ورا بیوتی`;
      return () => {
        document.title = origTitle;
      };
    }
  }, [product]);

  const hasVariants = Boolean(product.variants && product.variants.length > 0);

  // Safe active index bounded by imagesList length
  const activeImageIndex = Math.min(currentImageIndex, Math.max(0, imagesList.length - 1));
  const activeImage = imagesList[activeImageIndex];
  useEffect(() => {
    setVisitedImages((previous) => previous.has(activeImage) ? previous : new Set(previous).add(activeImage));
  }, [activeImage]);


  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe Handlers
  const minSwipeDistance = 45;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      // Swiped left -> next image
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev image
      handlePrevImage();
    }
  };

  useEffect(() => {
    setUserProfile(getSavedSkinProfile());
  }, []);

  // Keyboard navigation for image carousel & lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imagesList.length, isLightboxOpen]);

  // Reset zoom states on image change or lightbox toggle
  useEffect(() => {
    setIsHoverZooming(false);
    setZoomCoords({ x: 50, y: 50 });
  }, [currentImageIndex]);

  useEffect(() => {
    if (!isLightboxOpen) {
      setLightboxZoom(false);
      setLightboxCoords({ x: 50, y: 50 });
    }
  }, [isLightboxOpen]);

  // Reset selected image index, variant & size when product prop changes
  useEffect(() => {
    setCurrentImageIndex(0);
    if (product.variants && product.variants.length > 0) {
      const firstVar = product.variants[0];
      setSelectedVariant(firstVar);
      setSelectedSize({
        label: firstVar.name,
        labelEn: firstVar.nameEn || '',
        price: firstVar.price,
        originalPrice: firstVar.originalPrice
      });
    } else {
      setSelectedVariant(null);
      setSelectedSize(product.sizes?.[0] || defaultSize);
    }
    setQuantity(1);
  }, [product.id]);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedSize({
      label: variant.name,
      labelEn: variant.nameEn || '',
      price: variant.price,
      originalPrice: variant.originalPrice
    });
    const image = packagingImage(variant.image);
    if (image && imagesList.includes(image)) {
      setCurrentImageIndex(imagesList.indexOf(image));
    }
  };

  // Interactive Customer Reviews State with Skin Type Metadata
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'rev-1',
      author: 'مریم سهرابی',
      rating: 5,
      date: '۱۴ مرداد ۱۴۰۵',
      comment: 'بعد از دو هفته استفاده از این محصول، خشکی پوستم به کلی برطرف شده و شفافیت بی‌نظیری پیدا کرده. بوی ملایم و طبیعی آن واقعاً آرامش‌بخش است.',
      verified: true,
      skinType: 'پوست خشک و حساس • دغدغه: کم‌آبی'
    },
    {
      id: 'rev-2',
      author: 'آتوسا داوودی',
      rating: 5,
      date: '۱۰ مرداد ۱۴۰۵',
      comment: 'اصلاً حس چربی سنگین روی صورت نمی‌گذارد و خیلی زود جذب می‌شود. بسته‌بندی فاخر شیشه‌ای و کیفیت بسیار بالای محصول واقعاً ارزش خرید دارد.',
      verified: true,
      skinType: 'پوست مختلط • دغدغه: خطوط ریز'
    }
  ]);

  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newSkinType, setNewSkinType] = useState('پوست مختلط');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      date: 'امروز',
      comment: newComment,
      verified: true,
      skinType: `${newSkinType} • خریدار تایید شده`
    };

    setReviews([newRev, ...reviews]);
    setNewAuthor('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const currentStock = hasVariants && selectedVariant
    ? selectedVariant.stockCount
    : (product.stockCount !== undefined ? product.stockCount : (product.inStock ? 15 : 0));
  const isOutOfStock = !product.inStock || currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= 5;

  const activePrice = hasVariants && selectedVariant
    ? selectedVariant.price
    : (selectedSize?.price || product.price || 0);

  const activeOriginalPrice = hasVariants && selectedVariant
    ? selectedVariant.originalPrice
    : selectedSize?.originalPrice;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const sizeToPass: ProductSize = selectedSize || {
      label: selectedVariant?.name || 'اندازه استاندارد',
      labelEn: selectedVariant?.nameEn || 'Standard',
      price: activePrice,
      originalPrice: activeOriginalPrice
    };
    onAddToCart(product, sizeToPass, Math.min(quantity, Math.max(1, currentStock)), selectedVariant || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (price?: number) => (price || 0).toLocaleString('fa-IR');

  // Compatibility Check
  const isCompatibleWithUserProfile = userProfile
    ? (product.skinTypes?.includes(userProfile.skinType) || product.concerns?.includes(userProfile.primaryConcern))
    : null;

  // Related products (exclude current product)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const fallbackRelated = relatedProducts.length > 0 
    ? relatedProducts 
    : allProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 space-y-6 sm:space-y-10 text-right font-vazir overflow-x-hidden">
      
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 border-b border-[#F0E1E4] pb-3 sm:pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-white hover:bg-[#F9F1F0] text-[#23191E] hover:text-[#8C3B58] px-3.5 sm:px-4 py-2 rounded-lg border border-[#F0E1E4] hover:border-[#D48C9E] text-xs font-bold transition-all cursor-pointer active:scale-98 shrink-0"
        >
          <ArrowRight className="w-4 h-4 text-[#8C3B58]" />
          <span>بازگشت به فهرست محصولات</span>
        </button>

        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-[#785E67] max-w-full min-w-0">
          <button onClick={onBack} className="hover:text-[#8C3B58] transition-colors cursor-pointer shrink-0">فروشگاه</button>
          <span>/</span>
          <span className="text-[#23191E] font-bold truncate max-w-[150px] sm:max-w-xs md:max-w-none">{product.nameFa}</span>
        </div>
      </div>

      {/* Main Product Showcase Section - Contiguous Purchase Module */}
      <div className="vara-product-showcase">
        
        {/* Gallery / Images Column with Carousel & Slider */}
        <div className="vara-product-gallery space-y-4">
          {/* Main Display Image Carousel */}
          <div 
            className={`vara-product-stage relative rounded-xl overflow-hidden group select-none ${
              isHoverZooming ? 'cursor-crosshair' : 'cursor-zoom-in'
            }`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseMove={handleImageMouseMove}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
            onClick={() => { if (sources.length) setIsLightboxOpen(true); }}
            title="کلیک برای بزرگ‌نمایی تمام‌صفحه | حرکت ماوس برای بررسی دقیق بافت و بسته‌بندی"
          >
            {/* Horizontal Slide Track */}
            <div 
              className="w-full h-full flex transition-transform duration-500 ease-out"
              style={{ 
                transform: `translateX(-${activeImageIndex * 100}%)`,
                direction: 'ltr' 
              }}
            >
              {imagesList.map((img, idx) => {
                const isActive = idx === activeImageIndex;
                return (
                  <div 
                    key={idx} 
                    className="w-full h-full shrink-0 relative flex items-center justify-center overflow-hidden"
                  >
                    {(isActive || visitedImages.has(img)) && <img
                      src={displayImage(img)}
                      srcSet={responsiveImageSrcSet(displayImage(img), PRODUCT_COVER_WIDTHS)}
                      sizes={PRODUCT_COVER_SIZES}
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      onLoad={() => setCoverReady(true)}
                      onError={() => {
                        recordImageFailure(img);
                        setCoverReady(true);
                      }}
                      alt={displayImage(img) === DEFAULT_PRODUCT_IMAGE ? "تصویر محصول در دسترس نیست" : `${product.nameFa}، تصویر ${idx + 1}`}
                      className={`w-full h-full ${displayImage(img) === DEFAULT_PRODUCT_IMAGE ? "vara-image-fallback" : isPackShot(img) ? "vara-packshot" : "object-contain"} select-none pointer-events-none transition-transform ${
                        isHoverZooming && isActive
                          ? 'scale-[1.5] duration-75 ease-out'
                          : 'scale-100 duration-300 ease-out'
                      }`}
                      style={{
                        transformOrigin: isHoverZooming && isActive
                          ? `${zoomCoords.x}% ${zoomCoords.y}%`
                          : 'center center'
                      }}
                      draggable={false}
                      referrerPolicy="no-referrer"
                    />}
                  </div>
                );
              })}
            </div>

            {/* Slider Navigation Arrows */}
            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 right-3 z-20 w-9 h-9 rounded-lg bg-white/95 hover:bg-white text-[#23191E] hover:text-[#8C3B58] flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-[#F0E1E4] hover:border-[#D48C9E] ${
                    isHoverZooming ? 'opacity-0 pointer-events-none' : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95'
                  }`}
                  aria-label="تصویر قبلی"
                  title="تصویر قبلی"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className={`absolute top-1/2 -translate-y-1/2 left-3 z-20 w-9 h-9 rounded-lg bg-white/95 hover:bg-white text-[#23191E] hover:text-[#8C3B58] flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs border border-[#F0E1E4] hover:border-[#D48C9E] ${
                    isHoverZooming ? 'opacity-0 pointer-events-none' : 'opacity-90 sm:opacity-0 sm:group-hover:opacity-100 active:scale-95'
                  }`}
                  aria-label="تصویر بعدی"
                  title="تصویر بعدی"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Stock Alert Overlay (Top Right) */}
            {(isOutOfStock || isLowStock) && (
              <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-none">
                {isOutOfStock ? (
                  <span className="bg-[#23191E] text-white text-[11px] font-vazir font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                    <span>اتمام موجودی در انبار</span>
                  </span>
                ) : isLowStock ? (
                  <span className="bg-white/95 text-[#B45309] text-[11px] font-vazir font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 border border-[#F0E1E4]">
                    <span>تنها {currentStock} عدد باقی‌مانده</span>
                  </span>
                ) : null}
              </div>
            )}

            {/* Wishlist Button (Top Left) */}
            <button
              type="button" aria-pressed={isWishlisted}
              onClick={(event) => {
                event.stopPropagation();
                if (onToggleWishlist) {
                  onToggleWishlist(product.id);
                } else {
                  setInternalIsWishlisted(!internalIsWishlisted);
                }
              }}
              className={`absolute top-3 left-3 z-20 p-2.5 rounded-lg backdrop-blur-md border transition-all cursor-pointer active:scale-95 ${
                isWishlisted
                  ? 'bg-[#F5E6EB] border-[#8C3B58] text-[#8C3B58]'
                  : 'bg-white/95 border-[#F0E1E4] text-[#785E67] hover:text-[#8C3B58] hover:border-[#D48C9E]'
              }`}
              title={isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#8C3B58] text-[#8C3B58]' : ''}`} />
            </button>

            {/* Bottom Controls Row: Dots Indicator, Counter Badge & Zoom Trigger */}
            <div className={`absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none transition-opacity duration-200 ${
              isHoverZooming ? 'opacity-20' : 'opacity-100'
            }`}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="pointer-events-auto px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-[#23191E] hover:text-[#8C3B58] backdrop-blur-xs transition-all cursor-pointer border border-[#F0E1E4] hover:border-[#D48C9E] flex items-center gap-1.5 text-[11px] font-vazir font-medium"
                title="بزرگ‌نمایی و مشاهده تمام صفحه"
                disabled={!sources.length}
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#8C3B58]" />
                <span className="hidden sm:inline">بزرگ‌نمایی</span>
              </button>

              {imagesList.length > 1 && (
                <div 
                  className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#23191E]/75 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  {imagesList.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        idx === activeImageIndex
                          ? 'w-4 h-1.5 bg-[#D48C9E]'
                          : 'w-1.5 h-1.5 bg-white/50 hover:bg-white'
                      }`}
                      aria-label={`رفتن به تصویر ${idx + 1}`}
                    />
                  ))}
                </div>
              )}

              {imagesList.length > 1 && (
                <div className="pointer-events-none select-none bg-[#23191E]/75 backdrop-blur-md text-white text-[11px] font-jakarta font-bold px-2.5 py-1 rounded-md flex items-center gap-1 tabular-nums">
                  <span>{activeImageIndex + 1}</span>
                  <span className="text-white/50">/</span>
                  <span>{imagesList.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails Gallery Strip */}
          {activeImage?.endsWith('/ordinary-niacinamide-30ml.webp') && (
            <p className="text-sm text-[var(--vara-muted)]">تصویر بسته‌بندی ۳۰ میلی‌لیتری</p>
          )}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all shrink-0 bg-[#F9F1F0] cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#8C3B58] ring-1 ring-[#8C3B58]'
                      : 'border-[#F0E1E4] opacity-65 hover:opacity-100 hover:border-[#D48C9E]'
                  }`}
                  aria-label={`مشاهده تصویر ${idx + 1}`}
                >
                  {coverReady && <img
                    src={displayImage(img)}
                    srcSet={responsiveImageSrcSet(displayImage(img), [96, 160, 240])}
                    sizes="80px"
                    loading="lazy"
                    decoding="async"
                    alt={`${product.nameFa} - ${idx + 1}`}
                    onError={() => recordImageFailure(img)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />}
                </button>
              ))}
            </div>
          )}

          {/* Boutique Trust Highlights */}
          <div className="pt-1">
            <div className="bg-[#FDFBF9] p-4 rounded-xl border border-[#F0E1E4] grid grid-cols-2 gap-3 text-right">
              <div className="text-xs font-vazir text-[#23191E] border-r-2 border-[#8C3B58] pr-2.5">
                <span className="font-bold block text-[11px]">تأمین مستقیم از دبی</span>
                <span className="text-[10px] text-[#785E67]">تضمین اصالت و بچ‌کد رسمی</span>
              </div>
              <div className="text-xs font-vazir text-[#23191E] border-r-2 border-[#8C3B58] pr-2.5">
                <span className="font-bold block text-[11px]">ارسال سریع سراسری</span>
                <span className="text-[10px] text-[#785E67]">بسته‌بندی ایمن بوتیک</span>
              </div>
              <div className="text-xs font-vazir text-[#23191E] border-r-2 border-[#8C3B58] pr-2.5">
                <span className="font-bold block text-[11px]">فرمولاسیون اورجینال</span>
                <span className="text-[10px] text-[#785E67]">نگهداری در دمای استاندارد</span>
              </div>
              <div className="text-xs font-vazir text-[#23191E] border-r-2 border-[#8C3B58] pr-2.5">
                <span className="font-bold block text-[11px]">بررسی سازگاری پوست</span>
                <span className="text-[10px] text-[#785E67]">آنالیز دقیق ترکیبات فعال</span>
              </div>
            </div>
          </div>

          {/* Key Product Specs & Authenticity Accordion (Placed in Right Column) */}
          <div className="border border-[#F0E1E4] rounded-xl bg-white divide-y divide-[#F0E1E4] overflow-hidden">
            {/* 1. اصالت کالا */}
            <div>
              <button
                type="button"
                onClick={() => toggleSpec('authenticity')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-right hover:bg-[#FDFBF9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                  <span className="font-bold text-xs font-vazir text-[#23191E]">
                    اصالت کالا و بچ‌کد
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronDown
                    className={`w-4 h-4 text-[#785E67] transition-transform duration-200 ${
                      openSpecs.authenticity ? 'rotate-180 text-[#8C3B58]' : ''
                    }`}
                  />
                </div>
              </button>
              {openSpecs.authenticity && (
                <div className="px-4 pb-3.5 pt-2 text-xs font-vazir text-[#4A3840] leading-relaxed bg-[#FDFBF9] border-t border-[#F0E1E4]">
                  <p className="whitespace-pre-wrap break-words">
                    {product.authenticity || 'ضمانت اصالت ۱۰۰٪ اورجینال با تأییدیه بچ‌کد رسمی از نمایندگی‌های معتبر امارات'}
                  </p>
                </div>
              )}
            </div>

            {/* 2. منبع تأمین */}
            <div>
              <button
                type="button"
                onClick={() => toggleSpec('sourcing')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-right hover:bg-[#FDFBF9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#8C3B58] shrink-0" />
                  <span className="font-bold text-xs font-vazir text-[#23191E]">
                    منبع تأمین و تولید
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#785E67] transition-transform duration-200 ${
                    openSpecs.sourcing ? 'rotate-180 text-[#8C3B58]' : ''
                  }`}
                />
              </button>
              {openSpecs.sourcing && (
                <div className="px-4 pb-3.5 pt-2 text-xs font-vazir text-[#4A3840] leading-relaxed bg-[#FDFBF9] border-t border-[#F0E1E4]">
                  <p className="whitespace-pre-wrap break-words">
                    {product.sourcingOrigin || 'تأمین مستقیم از استورهای رسمی امارات متحده عربی (Sephora / Amazon UAE)'}
                  </p>
                </div>
              )}
            </div>

            {/* 3. مناسب برای */}
            <div>
              <button
                type="button"
                onClick={() => toggleSpec('targetAudience')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-right hover:bg-[#FDFBF9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-[#8C3B58] shrink-0" />
                  <span className="font-bold text-xs font-vazir text-[#23191E]">
                    مناسب برای تیپ پوستی
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#785E67] transition-transform duration-200 ${
                    openSpecs.targetAudience ? 'rotate-180 text-[#8C3B58]' : ''
                  }`}
                />
              </button>
              {openSpecs.targetAudience && (
                <div className="px-4 pb-3.5 pt-2 text-xs font-vazir text-[#4A3840] leading-relaxed bg-[#FDFBF9] border-t border-[#F0E1E4]">
                  <p className="whitespace-pre-wrap break-words">
                    {product.targetAudience || 'انواع پوست نیازمند تقویت سد رطوبتی، شفافیت و تغذیه روزانه'}
                  </p>
                </div>
              )}
            </div>

            {/* 4. تاریخ انقضا */}
            <div>
              <button
                type="button"
                onClick={() => toggleSpec('expiry')}
                className="w-full flex items-center justify-between p-3.5 sm:p-4 text-right hover:bg-[#FDFBF9] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#8C3B58] shrink-0" />
                  <span className="font-bold text-xs font-vazir text-[#23191E]">
                    تاریخ انقضا و شرایط نگهداری
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#785E67] transition-transform duration-200 ${
                    openSpecs.expiry ? 'rotate-180 text-[#8C3B58]' : ''
                  }`}
                />
              </button>
              {openSpecs.expiry && (
                <div className="px-4 pb-3.5 pt-2 text-xs font-vazir text-[#4A3840] leading-relaxed bg-[#FDFBF9] border-t border-[#F0E1E4]">
                  <p className="whitespace-pre-wrap break-words">
                    {product.expiryDate || '۲۴ ماه پس از تولید (۱۲ ماه پس از باز شدن درب محصول)'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info & Contiguous Purchase Column */}
        <div className="min-w-0 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            
            {/* Brand Eyebrow & Rating */}
            <div className="flex items-center justify-between border-b border-[#F0E1E4] pb-3">
              {product.brand ? (
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#8C3B58] font-jakarta">
                  <bdi>{product.brand}</bdi>
                </div>
              ) : (
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8C3B58] font-jakarta">
                  <span>ورا</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[#23191E] bg-[#FDFBF9] px-2.5 py-1 rounded-md border border-[#F0E1E4]">
                  <Star className="w-3.5 h-3.5 fill-[#8C3B58] text-[#8C3B58]" />
                  <span className="font-bold font-jakarta text-xs text-[#23191E] tabular-nums">{product.rating}</span>
                </div>
                <span className="text-[#785E67] text-xs font-vazir tabular-nums">
                  ({(product.reviewCount || 0).toLocaleString('fa-IR')} دیدگاه)
                </span>
              </div>
            </div>

            {/* Product Name Title */}
            <div className="space-y-1.5">
              <h1 className="vara-product-title">
                <bdi>{product.nameFa}</bdi>
              </h1>
              <p className="font-jakarta text-xs sm:text-sm text-[#785E67] tracking-wide" dir="ltr">
                {product.nameEn}
              </p>
              <RoutineLabel step={product.routineStep} />
            </div>

            {/* Skin Profile Compatibility Notice */}
            {userProfile && (
              <div className="p-3.5 rounded-xl border border-[#F0E1E4] bg-[#FDFBF9] text-xs font-vazir flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[#23191E]">
                  {isCompatibleWithUserProfile ? (
                    <CheckCheck className="w-4 h-4 text-[#15803D] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0" />
                  )}
                  <span>
                    {isCompatibleWithUserProfile 
                      ? `این فرمولاسیون با پروفایل پوستی شما (${userProfile.summaryLabelFa}) کاملاً سازگار است.`
                      : `توجه: با توجه به پروفایل شما (${userProfile.summaryLabelFa})، پیشنهاد می‌کنیم توضیحات مصرف را مطالعه فرمایید.`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-[#4A3840] font-vazir leading-relaxed whitespace-pre-wrap break-words">
              {product.descriptionFa}
            </p>

            {/* Product Variants or Size Selector */}
            {hasVariants && product.variants && product.variants.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold font-vazir text-[#23191E]">
                    انتخاب تنوع محصول (مدل / حجم / رنگ):
                  </label>
                  {selectedVariant && (
                    <span className="text-[11px] font-vazir text-[#785E67]">
                      انتخاب شده: <strong className="text-[#8C3B58]">{selectedVariant.name}</strong>
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const vOutOfStock = v.stockCount <= 0 || !product.inStock;

                    return (
                      <button
                        key={v.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectVariant(v)}
                        className={`p-3 rounded-xl text-right transition-all border flex flex-col justify-between gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-[#8C3B58] text-white border-[#8C3B58] shadow-xs'
                            : 'bg-white text-[#23191E] border-[#F0E1E4] hover:border-[#D48C9E]'
                        } ${vOutOfStock ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            {v.colorCode && v.colorCode.trim() !== '' && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                                style={{ backgroundColor: v.colorCode }}
                                title={`رنگ: ${v.colorCode}`}
                              />
                            )}
                            <bdi className="font-bold font-vazir text-sm truncate">{v.name}</bdi>
                          </div>

                          {vOutOfStock ? (
                            <span className={`text-[10px] font-vazir px-1.5 py-0.5 rounded-sm font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-[#F9F1F0] text-[#785E67]'
                            }`}>
                              ناموجود
                            </span>
                          ) : (
                            <span className={`text-[10px] font-vazir ${isSelected ? 'text-white/85' : 'text-[#15803D]'}`}>
                              {v.stockCount <= 5 ? `تنها ${v.stockCount} عدد` : 'موجود'}
                            </span>
                          )}
                        </div>

                        <div className={`flex items-baseline justify-between w-full pt-1.5 border-t ${isSelected ? 'border-white/15' : 'border-[#F0E1E4]'}`}>
                          {v.nameEn ? (
                            <span className={`text-[10px] font-vazir ${isSelected ? 'text-white/75' : 'text-[#785E67]'}`}>
                              <bdi>{v.nameEn}</bdi>
                            </span>
                          ) : <span />}
                          <div className="flex items-baseline gap-1 font-vazir tabular-nums">
                            {v.originalPrice && v.originalPrice > v.price && (
                              <span className={`text-[10px] line-through font-vazir ${isSelected ? 'text-white/60' : 'text-[#785E67]'}`}>
                                {formatPrice(v.originalPrice)}
                              </span>
                            )}
                            <span className="font-bold font-vazir text-xs">
                              {formatPrice(v.price)} تومان
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : product.sizes && product.sizes.length > 0 ? (
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-bold font-vazir text-[#23191E]">
                  انتخاب حجم محصول:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz, idx) => (
                    <button
                      key={idx}
                      aria-pressed={selectedSize?.label === sz.label}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-lg text-xs font-vazir border transition-all flex items-center gap-2 cursor-pointer tabular-nums ${
                        (selectedSize?.label || '') === sz.label
                          ? 'bg-[#8C3B58] text-white border-[#8C3B58] font-bold shadow-xs'
                          : 'bg-white text-[#23191E] border-[#F0E1E4] hover:border-[#D48C9E]'
                      }`}
                    >
                      <span>{sz.label}</span>
                      <span className="opacity-75">({formatPrice(sz.price)} تومان)</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Contiguous Price, Quantity & Add-to-Bag Block */}
            <div className="vara-purchase p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5 font-vazir">
                  <span className="text-[11px] text-[#785E67] font-vazir block">قیمت مصرف‌کننده:</span>
                  <div className="flex items-baseline gap-2 font-vazir tabular-nums">
                    {activeOriginalPrice && (
                      <span className="line-through text-xs text-[#785E67] font-vazir">
                        {formatPrice(activeOriginalPrice)} تومان
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-bold font-vazir text-[#23191E]">
                      {formatPrice(activePrice * (isOutOfStock ? 1 : quantity))}
                    </span>
                    <span className="text-xs text-[#785E67] font-vazir font-bold">تومان</span>
                  </div>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                  isOutOfStock 
                    ? 'bg-[#F9F1F0] text-[#785E67] border-[#F0E1E4]' 
                    : isLowStock 
                    ? 'bg-amber-50/80 text-[#B45309] border-amber-200' 
                    : 'bg-emerald-50/80 text-[#15803D] border-emerald-200'
                }`}>
                  {isOutOfStock ? 'ناموجود در انبار' : isLowStock ? `تنها ${currentStock} عدد باقی‌مانده` : `موجود در انبار (${currentStock} عدد)`}
                </span>
              </div>

              {isOutOfStock ? (
                <div className="bg-white border border-[#F0E1E4] rounded-lg px-4 py-3 text-center">
                  <span className="text-xs font-bold text-[#785E67]">
                    این محصول در حال حاضر ناموجود است.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Tactile Quantity Stepper */}
                  <div className="flex items-center justify-between border border-[#F0E1E4] bg-white rounded-xl p-1 w-full sm:w-32">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-lg hover:bg-[#F9F1F0] text-[#23191E] hover:text-[#8C3B58] font-bold text-base flex items-center justify-center transition-colors cursor-pointer"
                      title="کاهش تعداد"
                    >
                      -
                    </button>
                    <span className="font-jakarta font-bold text-sm text-[#23191E] tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                      disabled={quantity >= currentStock}
                      className="w-9 h-9 rounded-lg hover:bg-[#F9F1F0] text-[#23191E] hover:text-[#8C3B58] font-bold text-base flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title="افزایش تعداد"
                    >
                      +
                    </button>
                  </div>

                  {/* Primary Berry Mauve Add-to-Bag Button */}
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs ${
                      added
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#8C3B58] hover:bg-[#732E47] text-white'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>افزوده شد به سبد خرید</span>
                      </>
                    ) : (
                      <span>افزودن به سبد خرید</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Active Ingredients Hairline Accordion */}
            {activeIngredientsList.length > 0 && (
              <div className="border border-[#F0E1E4] rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIngredientsList((prev) => !prev)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-right hover:bg-[#FDFBF9] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-[#F9F1F0] text-[#8C3B58] flex items-center justify-center shrink-0 border border-[#F0E1E4]">
                      <FlaskConical className="w-3.5 h-3.5" />
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold font-vazir text-[#23191E]">
                        ترکیبات فعال و کلیدی
                      </span>
                      <span className="text-[10px] font-vazir text-[#8C3B58] bg-[#F5E6EB] px-2 py-0.5 rounded-sm font-bold border border-[#D48C9E]/40">
                        {activeIngredientsList.length} ترکیب
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#785E67] transition-transform duration-200 ${
                      openIngredientsList ? 'rotate-180 text-[#8C3B58]' : ''
                    }`}
                  />
                </button>

                {openIngredientsList && (
                  <div className="divide-y divide-[#F0E1E4] border-t border-[#F0E1E4] bg-[#FDFBF9]">
                    {activeIngredientsList.map((ing, idx) => {
                      const isExpanded = openIngredientIdx === idx;
                      const displayNameFa = cleanIngredientName(ing.nameFa);
                      const displayNameEn = cleanIngredientNameEn(ing.nameEn);
                      return (
                        <div key={idx} className="transition-colors">
                          <button
                            type="button"
                            onClick={() => toggleIngredient(idx)}
                            className="w-full flex items-center justify-between p-3 sm:px-4 text-right hover:bg-white transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0 pr-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8C3B58] shrink-0" />
                              <span className="font-bold text-xs font-vazir text-[#23191E] truncate">
                                {displayNameFa}
                              </span>
                              {displayNameEn && (
                                <span className="hidden md:inline text-[10px] text-[#785E67] font-jakarta truncate">
                                  ({displayNameEn})
                                </span>
                              )}
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-[#785E67] transition-transform duration-200 shrink-0 ${
                                isExpanded ? 'rotate-180 text-[#8C3B58]' : ''
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-5 pb-3.5 pt-2 text-[11px] font-vazir text-[#4A3840] leading-relaxed bg-white border-t border-[#F0E1E4]">
                              {displayNameEn && (
                                <div className="md:hidden text-[10px] text-[#785E67] font-jakarta font-medium mb-1">
                                  {displayNameEn}
                                </div>
                              )}
                              <p>{ing.description}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Tabs Section (Ingredients, Routine & Customer Reviews) */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#F0E1E4] shadow-[0_12px_32px_-8px_rgba(140,59,88,0.05)] space-y-6 w-full max-w-full overflow-hidden">
        
        {/* Navigation Tabs as Boutique Underline Tabs */}
        <div className="flex border-b border-[#F0E1E4] overflow-x-auto gap-6 scrollbar-none">
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
              activeTab === 'features'
                ? 'border-[#8C3B58] text-[#8C3B58]'
                : 'border-transparent text-[#785E67] hover:text-[#23191E]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ویژگی‌های محصول</span>
            {product.badges && product.badges.length > 0 && (
              <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold tabular-nums ${
                activeTab === 'features' ? 'bg-[#8C3B58] text-white' : 'bg-[#F9F1F0] text-[#785E67]'
              }`}>
                {product.badges.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
              activeTab === 'ingredients'
                ? 'border-[#8C3B58] text-[#8C3B58]'
                : 'border-transparent text-[#785E67] hover:text-[#23191E]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>ترکیبات فعال و آنالیز علمی</span>
          </button>
          <button
            onClick={() => setActiveTab('routine')}
            className={`pb-3 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
              activeTab === 'routine'
                ? 'border-[#8C3B58] text-[#8C3B58]'
                : 'border-transparent text-[#785E67] hover:text-[#23191E]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>راهنمای گام‌به‌گام روتین</span>
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-[1px] cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-[#8C3B58] text-[#8C3B58]'
                : 'border-transparent text-[#785E67] hover:text-[#23191E]'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>دیدگاه‌های خریداران</span>
            <span className={`px-1.5 py-0.5 rounded-sm text-[10px] font-bold tabular-nums ${
              activeTab === 'reviews' ? 'bg-[#8C3B58] text-white' : 'bg-[#F9F1F0] text-[#785E67]'
            }`}>
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab 1: ویژگی‌های محصول */}
        {activeTab === 'features' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E1E4] pb-4">
              <div>
                <div className="text-[11px] font-bold text-[#8C3B58] uppercase tracking-[0.08em] font-jakarta mb-1">
                  BOUTIQUE SPECIFICATIONS
                </div>
                <h3 className="font-vazir font-bold text-base sm:text-lg text-[#23191E]">
                  ویژگی‌های برجسته و مشخصات محصول
                </h3>
              </div>
            </div>

            {product.badges && product.badges.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-vazir text-[#23191E]">ویژگی‌های کلیدی:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {product.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3 flex items-center gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-white text-[#8C3B58] flex items-center justify-center shrink-0 border border-[#F0E1E4]">
                        <Check className="w-3 h-3" />
                      </span>
                      <span className="font-bold text-xs font-vazir text-[#23191E]">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold font-vazir text-[#23191E]">مشخصات فنی و راهنمای انتخاب:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-vazir">
                {product.brand && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">برند سازنده:</span>
                    <span className="font-bold text-[#23191E] text-xs">{product.brand}</span>
                  </div>
                )}
                {product.productType && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">نوع فرآورده:</span>
                    <span className="font-bold text-[#23191E] text-xs">{product.productType}</span>
                  </div>
                )}
                {product.skinTypes && product.skinTypes.length > 0 && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">سازگار با انواع پوست:</span>
                    <span className="font-bold text-[#23191E] text-xs">
                      {product.skinTypes.join('، ')}
                    </span>
                  </div>
                )}
                {product.concerns && product.concerns.length > 0 && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">هدف و تمرکز بر دغدغه‌های:</span>
                    <span className="font-bold text-[#23191E] text-xs">
                      {product.concerns.join('، ')}
                    </span>
                  </div>
                )}
                {product.authenticity && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">اصالت کالا:</span>
                    <span className="font-bold text-[#23191E] text-xs">{product.authenticity}</span>
                  </div>
                )}
                {product.targetAudience && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">جامعه هدف:</span>
                    <span className="font-bold text-[#23191E] text-xs">{product.targetAudience}</span>
                  </div>
                )}
                {product.unsuitableFor && (
                  <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-3.5 space-y-1">
                    <span className="text-[#B45309] text-[11px] block font-bold">موارد احتیاط یا منع مصرف:</span>
                    <span className="text-[#23191E] text-xs font-vazir">{product.unsuitableFor}</span>
                  </div>
                )}
                {product.expiryDate && (
                  <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1">
                    <span className="text-[#785E67] text-[11px] block">تاریخ انقضا و دوره ماندگاری:</span>
                    <span className="font-bold text-[#23191E] text-xs">{product.expiryDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Ingredient Matrix & Scientific Analysis */}
        {activeTab === 'ingredients' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E1E4] pb-4">
              <div>
                <div className="text-[11px] font-bold text-[#8C3B58] uppercase tracking-[0.08em] font-jakarta mb-1">
                  ACTIVE FORMULATION MATRIX
                </div>
                <h3 className="font-vazir font-bold text-base sm:text-lg text-[#23191E]">
                  ترکیبات مؤثره و عملکرد زیستی
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#FDFBF9] border border-[#F0E1E4] text-[#23191E] px-2.5 py-1 rounded-md text-[11px] font-bold font-vazir flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                  <span>شاخص کومدوژنیک: ۰ (غیرجوش‌زا)</span>
                </span>
                <span className="bg-[#FDFBF9] border border-[#F0E1E4] text-[#23191E] px-2.5 py-1 rounded-md text-[11px] font-bold font-vazir flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8C3B58]" />
                  <span>استاندارد کلینیکال: EWG 1</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeIngredientsList.map((ing, idx) => {
                const isExpanded = selectedIngredientIdx === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedIngredientIdx(isExpanded ? null : idx)}
                    className={`rounded-xl p-4 border transition-all cursor-pointer text-right space-y-3 ${
                      isExpanded
                        ? 'bg-[#FDFBF9] border-[#8C3B58]'
                        : 'bg-white border-[#F0E1E4] hover:border-[#D48C9E]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isExpanded ? 'bg-[#8C3B58] text-white border-[#8C3B58]' : 'bg-[#F9F1F0] text-[#8C3B58] border-[#F0E1E4]'
                        }`}>
                          <FlaskConical className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#23191E] font-vazir leading-tight">
                          {ing.nameFa}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold font-vazir px-2 py-0.5 rounded-sm bg-[#F9F1F0] border border-[#F0E1E4] text-[#8C3B58]">
                          ترکیب فعال
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#785E67] transition-transform ${isExpanded ? 'rotate-180 text-[#8C3B58]' : ''}`} />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-[#F0E1E4] space-y-2.5 animate-fadeIn text-xs font-vazir">
                        <div className="bg-white p-3 rounded-lg border border-[#F0E1E4] space-y-1.5">
                          <span className="font-bold text-[#8C3B58] text-[11px] flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-[#8C3B58]" />
                            <span>مکانیسم اثر بر لایه‌های سلولی:</span>
                          </span>
                          <p className="text-[#4A3840] text-[11px] leading-relaxed">
                            {ing.description || 'این مولکول فعال با اتصال به گیرنده‌های غشایی کراتینوسیت‌ها، فرآیند رطوبت‌رسانی بین‌سلولی را تسریع کرده و از تخریب کلاژن ناشی از رادیکال‌های آزاد هوا جلوگیری می‌کند.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-[#FDFBF9] p-5 rounded-xl border border-[#F0E1E4] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#23191E] font-vazir flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#8C3B58]" />
                  <span>تعهد ورا بیوتی در اصالت و سلامت فرمولاسیون:</span>
                </span>
                <span className="text-[10px] text-[#8C3B58] font-jakarta font-bold">BOUTIQUE STANDARDS</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-right">
                <div className="bg-white p-3 rounded-lg border border-[#F0E1E4] space-y-1">
                  <span className="font-bold text-[11px] text-[#23191E] block">بدون تست حیوانی</span>
                  <span className="text-[10px] text-[#785E67]">Cruelty Free گواهی‌شده</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#F0E1E4] space-y-1">
                  <span className="font-bold text-[11px] text-[#23191E] block">فاقد پارابن و سولفات</span>
                  <span className="text-[10px] text-[#785E67]">بدون ترکیبات شیمیایی خشن</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#F0E1E4] space-y-1">
                  <span className="font-bold text-[11px] text-[#23191E] block">تنظیم pH فیزیولوژیک</span>
                  <span className="text-[10px] text-[#785E67]">منطبق با اسیدیته ۵.۵ پوست</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-[#F0E1E4] space-y-1">
                  <span className="font-bold text-[11px] text-[#23191E] block">تست درماتولوژی</span>
                  <span className="text-[10px] text-[#785E67]">ایمن برای پوست‌های حساس</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Dynamic Skincare Routine Visualizer & Pairing Guide */}
        {activeTab === 'routine' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E1E4] pb-4">
              <div>
                <div className="text-[11px] font-bold text-[#8C3B58] uppercase tracking-[0.08em] font-jakarta mb-1">
                  REGIMEN PROTOCOL
                </div>
                <h3 className="font-vazir font-bold text-base sm:text-lg text-[#23191E]">
                  چیدمان گام‌به‌گام مراحل مراقبت از پوست
                </h3>
              </div>

              <div className="flex items-center bg-[#F9F1F0] p-1 rounded-lg border border-[#F0E1E4]">
                <button
                  type="button"
                  onClick={() => setRoutineTimeOfDay('morning')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold font-vazir transition-all cursor-pointer ${
                    routineTimeOfDay === 'morning'
                      ? 'bg-[#8C3B58] text-white shadow-xs'
                      : 'text-[#785E67] hover:text-[#23191E]'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>روتین صبح</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRoutineTimeOfDay('night')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold font-vazir transition-all cursor-pointer ${
                    routineTimeOfDay === 'night'
                      ? 'bg-[#8C3B58] text-white shadow-xs'
                      : 'text-[#785E67] hover:text-[#23191E]'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>روتین شب</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1.5 text-center sm:text-right">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-md bg-white border border-[#F0E1E4] text-[#785E67] text-[10px] font-bold font-jakarta flex items-center justify-center">
                      1
                    </span>
                    <span className="text-[10px] text-[#785E67] font-vazir">مرحله اول</span>
                  </div>
                  <div className="font-bold text-xs text-[#23191E] font-vazir">شوینده ملایم</div>
                  <p className="text-[10px] text-[#785E67] font-vazir line-clamp-2">پاکسازی آلودگی‌ها و باز کردن منافذ</p>
                </div>

                <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1.5 text-center sm:text-right">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-md bg-white border border-[#F0E1E4] text-[#785E67] text-[10px] font-bold font-jakarta flex items-center justify-center">
                      2
                    </span>
                    <span className="text-[10px] text-[#785E67] font-vazir">مرحله دوم</span>
                  </div>
                  <div className="font-bold text-xs text-[#23191E] font-vazir">تونر و آماده‌سازی</div>
                  <p className="text-[10px] text-[#785E67] font-vazir line-clamp-2">تنظیم pH پوست و آماده‌سازی سد دفاعی</p>
                </div>

                <div className="bg-[#F9F1F0] border-2 border-[#8C3B58] rounded-xl p-3.5 space-y-1.5 text-center sm:text-right relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-md bg-[#8C3B58] text-white text-[10px] font-bold font-jakarta flex items-center justify-center">
                      3
                    </span>
                    <span className="text-[10px] font-bold text-[#8C3B58] font-vazir">گام فعال شما</span>
                  </div>
                  <div className="font-bold text-xs text-[#23191E] font-vazir truncate">{product.nameFa}</div>
                  <p className="text-[10px] text-[#4A3840] font-vazir font-medium">جذب عمیق مواد موثره به لایه‌های اپیدرم</p>
                </div>

                <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1.5 text-center sm:text-right">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-md bg-white border border-[#F0E1E4] text-[#785E67] text-[10px] font-bold font-jakarta flex items-center justify-center">
                      4
                    </span>
                    <span className="text-[10px] text-[#785E67] font-vazir">مرحله چهارم</span>
                  </div>
                  <div className="font-bold text-xs text-[#23191E] font-vazir">کرم مرطوب‌کننده</div>
                  <p className="text-[10px] text-[#785E67] font-vazir line-clamp-2">قفل رطوبت و ترمیم چربی‌های سد محافظتی</p>
                </div>

                <div className="bg-[#FDFBF9] border border-[#F0E1E4] rounded-xl p-3.5 space-y-1.5 text-center sm:text-right">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-md bg-white border border-[#F0E1E4] text-[#785E67] text-[10px] font-bold font-jakarta flex items-center justify-center">
                      5
                    </span>
                    <span className="text-[10px] text-[#785E67] font-vazir">مرحله پایانی</span>
                  </div>
                  <div className="font-bold text-xs text-[#23191E] font-vazir">
                    {routineTimeOfDay === 'morning' ? 'ضدآفتاب SPF' : 'ماسک شب / روغن'}
                  </div>
                  <p className="text-[10px] text-[#785E67] font-vazir line-clamp-2">
                    {routineTimeOfDay === 'morning' ? 'حفاظت کامل در برابر پرتوهای مضر آفتاب' : 'بازسازی و تثبیت شبانه سلول‌ها'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Reviews & Rating Submission */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-[#FDFBF9] border border-[#F0E1E4] p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#23191E] font-vazir">{rev.author}</span>
                      {rev.verified && (
                        <span className="bg-white text-[#15803D] text-[9px] font-bold font-vazir px-2 py-0.5 rounded-sm border border-[#F0E1E4]">
                          خریدار تاییدشده
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[#8C3B58]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#8C3B58] text-[#8C3B58]" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[#4A3840] font-vazir leading-relaxed">
                    {rev.comment}
                  </p>
                  <div className="text-[10px] text-[#785E67] font-vazir">
                    {rev.skinType} • {rev.date}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddReview} className="bg-[#FDFBF9] border border-[#F0E1E4] p-5 rounded-xl space-y-3.5">
              <h4 className="font-bold text-xs text-[#23191E] font-vazir">ثبت دیدگاه جدید برای این محصول:</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="bg-white border border-[#F0E1E4] rounded-lg px-3.5 py-2.5 text-xs font-vazir focus:outline-none focus:border-[#8C3B58] text-[#23191E]"
                  required
                />

                <select
                  value={newSkinType}
                  onChange={(e) => setNewSkinType(e.target.value)}
                  className="bg-white border border-[#F0E1E4] rounded-lg px-3.5 py-2.5 text-xs font-vazir focus:outline-none focus:border-[#8C3B58] text-[#23191E] cursor-pointer"
                >
                  <option value="پوست مختلط">نوع پوست: مختلط</option>
                  <option value="پوست خشک و دهیدراته">نوع پوست: خشک و کم‌آب</option>
                  <option value="پوست چرب و مستعد جوش">نوع پوست: چرب</option>
                  <option value="پوست حساس و واکنشی">نوع پوست: بسیار حساس</option>
                  <option value="پوست معمولی">نوع پوست: معمولی</option>
                </select>
                
                <div className="flex items-center gap-2 bg-white border border-[#F0E1E4] rounded-lg px-3.5 py-2">
                  <span className="text-xs font-vazir text-[#785E67]">امتیاز:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewRating(num)}
                        className="focus:outline-none cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${num <= newRating ? 'fill-[#8C3B58] text-[#8C3B58]' : 'text-[#F0E1E4]'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                placeholder="تجربه شما درباره عملکرد و بافت محصول..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full bg-white border border-[#F0E1E4] rounded-lg p-3.5 text-xs font-vazir focus:outline-none focus:border-[#8C3B58] text-[#23191E]"
                required
              />

              <button
                type="submit"
                className="bg-[#8C3B58] hover:bg-[#732E47] text-white px-6 py-2.5 rounded-lg text-xs font-vazir font-bold transition-all cursor-pointer active:scale-98 shadow-xs"
              >
                ارسال دیدگاه
              </button>

              {reviewSubmitted && (
                <p className="text-xs font-bold text-[#15803D] font-vazir">
                  دیدگاه شما با موفقیت ثبت شد!
                </p>
              )}
            </form>
          </div>
        )}

      </div>

      {/* Recommended Related Products Row */}
      {fallbackRelated.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#F0E1E4]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold font-vazir text-[#23191E]">
              محصولات مکمل و مشابه برای روتین پوستی شما
            </h2>
            <button
              onClick={onBack}
              className="text-xs font-vazir font-bold text-[#8C3B58] hover:underline cursor-pointer"
            >
              مشاهده همه محصولات
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackRelated.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onQuickView={(p) => onSelectProduct(p)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <Modal label="تصاویر محصول" onClose={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-[#23191E]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn"
        >
          <div className="flex items-center justify-between text-white max-w-5xl mx-auto w-full z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-vazir font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 tabular-nums">
                تصویر {activeImageIndex + 1} از {imagesList.length}
              </span>
              <span className="text-xs text-white/70 font-vazir hidden sm:inline">
                {product.nameFa}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxZoom(!lightboxZoom)}
                className={`px-3 py-1.5 rounded-lg text-xs font-vazir font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                  lightboxZoom 
                    ? 'bg-white text-[#23191E] border-white font-bold' 
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                }`}
              >
                {lightboxZoom ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span>{lightboxZoom ? 'بزرگ‌نمایی ۱.۵x فعال' : 'بزرگ‌نمایی بافت'}</span>
              </button>

              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                aria-label="بستن بزرگ‌نمایی"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div 
            className={`relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full py-4 select-none overflow-hidden ${
              lightboxZoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setLightboxZoom(!lightboxZoom);
            }}
            onMouseMove={(e) => {
              if (!lightboxZoom) return;
              const rect = e.currentTarget.getBoundingClientRect();
              if (!rect.width || !rect.height) return;
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              setLightboxCoords({
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y))
              });
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {imagesList.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className={`absolute right-2 sm:right-4 z-20 p-3 rounded-lg bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-md border border-white/20 ${
                  lightboxZoom ? 'opacity-30 hover:opacity-100' : ''
                }`}
                aria-label="تصویر قبلی"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            <img
              src={displayImage(activeImage)}
              onError={() => recordImageFailure(activeImage)}
              alt={`${product.nameFa} - بزرگ‌نمایی تصویر ${activeImageIndex + 1}`}
              className={`max-h-[75vh] max-w-full object-contain rounded-xl transition-transform will-change-transform ${
                lightboxZoom ? 'scale-[1.5] duration-75 ease-out' : 'scale-100 duration-300 ease-out'
              }`}
              style={{
                transformOrigin: lightboxZoom ? `${lightboxCoords.x}% ${lightboxCoords.y}%` : 'center center'
              }}
              referrerPolicy="no-referrer"
            />

            {imagesList.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className={`absolute left-2 sm:left-4 z-20 p-3 rounded-lg bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-md border border-white/20 ${
                  lightboxZoom ? 'opacity-30 hover:opacity-100' : ''
                }`}
                aria-label="تصویر بعدی"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
          </div>

          {imagesList.length > 1 && (
            <div 
              className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 max-w-5xl mx-auto w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-black cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#D48C9E] scale-105 opacity-100'
                      : 'border-white/20 opacity-40 hover:opacity-80'
                  }`}
                >
                  <img
                    src={displayImage(img)}
                    srcSet={responsiveImageSrcSet(displayImage(img), [64, 112, 176])}
                    sizes="56px"
                    loading="lazy"
                    onError={() => recordImageFailure(img)}
                    alt={`بندانگشتی ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </Modal>
      )}

      {/* Sticky Mobile Purchase Bar */}
      {showStickyMobileBar && !isLightboxOpen && (
        <div className="sm:hidden fixed bottom-14 inset-x-0 z-40 bg-[#FDFBF9]/95 backdrop-blur-md border-t border-[#F0E1E4] p-3 animate-fadeIn">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#F0E1E4] shrink-0 bg-[#F9F1F0]">
                <img
                  src={displayImage(imagesList[0])}
                  srcSet={responsiveImageSrcSet(displayImage(imagesList[0]), [48, 80, 128])}
                  sizes="40px"
                  onError={() => recordImageFailure(imagesList[0])}
                  alt={product.nameFa}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 text-right">
                <span className="font-bold text-xs text-[#23191E] font-vazir truncate block">
                  {product.nameFa}
                </span>
                <span className="text-[11px] font-jakarta font-bold text-[#8C3B58] block tabular-nums">
                  {formatPrice(activePrice)} تومان
                </span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`px-4 py-2.5 rounded-lg font-bold text-xs font-vazir transition-all shrink-0 active:scale-98 cursor-pointer shadow-xs ${
                isOutOfStock
                  ? 'bg-[#F9F1F0] text-[#785E67] opacity-60 cursor-not-allowed'
                  : added
                  ? 'bg-[#15803D] text-white'
                  : 'bg-[#8C3B58] hover:bg-[#732E47] text-white'
              }`}
            >
              {isOutOfStock ? 'ناموجود' : added ? 'افزوده شد!' : 'خرید آنی'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
