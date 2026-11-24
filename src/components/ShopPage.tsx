import { CatalogNotice } from './CatalogNotice';
import { DEFAULT_PRODUCT_IMAGE, getProductCover } from '../lib/productImages';
import type { CatalogSnapshot } from '../lib/db';
import React, { useState, useMemo, useEffect, useLayoutEffect, useId, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  SlidersHorizontal, 
  Search, 
  RotateCcw, 
  ClipboardCheck,
  X, 
  ChevronDown,
  Check
} from 'lucide-react';
import { Product, CategoryId, SkinType, SkincareProductType, RoutineType, ProductSize, ProductVariant, ShopFilterPreset } from '../types';
import { ProductCard } from './ProductCard';
import { BRANDS_DATA, BrandItem } from '../data/brands';
import { subscribeToBrands, getLocalBrands } from '../lib/brandsManager';

const categoryLabels: Record<CategoryId, string> = {
  all: 'همه دسته‌ها', cleanser: 'پاک‌کننده', 'anti-aging': 'ضدچروک', hydration: 'آبرسانی',
  'sensitive-skin': 'پوست حساس', 'acne-blemishes': 'جوش و لک', sunscreen: 'ضدآفتاب',
  brightening: 'روشن‌کننده', 'hair-body': 'مو و بدن',
};

interface ShopPageProps {
  products: Product[];
  catalog: CatalogSnapshot;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product, selectedSize: ProductSize, quantity?: number, selectedVariant?: ProductVariant) => void;
  onOpenQuiz: () => void;
  initialSearchQuery?: string;
  onSearchChange: (query: string) => void;
  initialFilterPreset?: ShopFilterPreset | null;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  catalog,
  onQuickView,
  onAddToCart,
  onOpenQuiz,
  initialSearchQuery = '',
  onSearchChange,
  initialFilterPreset = null,
}) => {
  const reducedMotion = useReducedMotion();
  // Filter States
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSkinType, setSelectedSkinType] = useState<SkinType | 'all'>('all');
  const [selectedProductType, setSelectedProductType] = useState<SkincareProductType | 'all'>(initialFilterPreset?.productType || 'all');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('all');
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineType | 'all'>(initialFilterPreset?.routine || 'all');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(initialFilterPreset?.category || 'all');
  
  // Secondary Filters
  const [priceRange, setPriceRange] = useState<'all' | 'under1m' | '1m-1.5m' | 'over1.5m'>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyBestSellers, setOnlyBestSellers] = useState(false);
  const [onlyNew, setOnlyNew] = useState(initialFilterPreset?.onlyNew || false);
  const [minRating, setMinRating] = useState<number>(0);
  const searchQuery = initialSearchQuery;
  const setSearchQuery = onSearchChange;
  const [sortBy, setSortBy] = useState<'bestseller' | 'newest' | 'price-low' | 'price-high' | 'rating'>(initialFilterPreset?.sortBy || 'bestseller');
  
  // Mobile and Accordion UI States
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const mobileFilterId = useId();
  const mobileFilterTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileFilterDialogRef = useRef<HTMLDialogElement>(null);
  const closeMobileFilterRef = useRef<HTMLButtonElement>(null);
  const applyMobileFilterRef = useRef<HTMLButtonElement>(null);
  const sortRef = useRef<HTMLSelectElement>(null);
  const shopSearchRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const dialog = mobileFilterDialogRef.current;
    if (!mobileFilterOpen || !dialog) return;

    const desktop = window.matchMedia('(min-width: 64rem)');
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileFilterOpen(false);
    };
    if (desktop.matches) {
      closeOnDesktop();
      return;
    }

    const opener = mobileFilterTriggerRef.current;
    dialog.showModal();
    closeMobileFilterRef.current?.focus();
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      desktop.removeEventListener('change', closeOnDesktop);
      dialog.close();
      (desktop.matches ? sortRef.current : opener)?.focus({ preventScroll: true });
    };
  }, [mobileFilterOpen]);

  const keepMobileFilterTabInside = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const edge = event.shiftKey ? closeMobileFilterRef.current : applyMobileFilterRef.current;
    if (event.target !== edge) return;
    event.preventDefault();
    (event.shiftKey ? applyMobileFilterRef.current : closeMobileFilterRef.current)?.focus();
  };

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    brand: false,
    skinType: false,
    productType: false,
    ingredient: false,
    routine: false,
    price: false,
    special: false
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  // Sync filter preset when triggered from Footer or external navigation
  useEffect(() => {
    if (!initialFilterPreset) return;
    setSelectedBrand('all');
    setSelectedSkinType('all');
    setSelectedIngredient('all');
    setPriceRange('all');
    setOnlyInStock(false);
    setOnlyBestSellers(false);
    setMinRating(0);
    setSelectedProductType(initialFilterPreset.productType || 'all');
    setSelectedRoutine(initialFilterPreset.routine || 'all');
    setSelectedCategory(initialFilterPreset.category || 'all');
    setOnlyNew(Boolean(initialFilterPreset.onlyNew));
    setSortBy(initialFilterPreset.sortBy || 'bestseller');
  }, [initialFilterPreset]);

  // 1. برند (Brand List) - Cleared and sorted alphabetically in Persian
  const [rawBrands, setRawBrands] = useState<BrandItem[]>(() => getLocalBrands());

  useEffect(() => {
    const unsub = subscribeToBrands((updated) => {
      if (updated && updated.length > 0) {
        setRawBrands(updated);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const [brandSearchInput, setBrandSearchInput] = useState('');
  const brandsList: { id: string; labelFa: string; labelEn: string }[] = useMemo(() => {
    const sorted = [...rawBrands].sort((a, b) => a.labelFa.localeCompare(b.labelFa, 'fa'));
    return [
      { id: 'all', labelFa: 'همه برندها', labelEn: 'All Brands' },
      ...sorted
    ];
  }, [rawBrands]);

  // Filtered brands for quick search in sidebar
  const visibleBrandsList = useMemo(() => {
    if (!brandSearchInput.trim()) return brandsList;
    const q = brandSearchInput.trim().toLowerCase();
    return brandsList.filter(
      b => b.id === 'all' || 
           b.labelFa.toLowerCase().includes(q) || 
           b.labelEn.toLowerCase().includes(q) || 
           b.id.toLowerCase().includes(q)
    );
  }, [brandsList, brandSearchInput]);

  // 2. نوع پوست (Skin Type List)
  const skinTypesList: { id: SkinType | 'all'; labelFa: string }[] = [
    { id: 'all', labelFa: 'همه انواع پوست' },
    { id: 'dry', labelFa: 'پوست خشک و کم‌آب' },
    { id: 'oily', labelFa: 'پوست چرب و مستعد جوش' },
    { id: 'combination', labelFa: 'پوست مختلط' },
    { id: 'sensitive', labelFa: 'پوست حساس و آسیب‌پذیر' },
    { id: 'normal', labelFa: 'پوست معمولی و نرمال' },
  ];

  // 3. مراقبت از پوست / نوع محصول (Skin Care & Product Types)
  const productTypesList: { id: SkincareProductType | 'all'; labelFa: string }[] = [
    { id: 'all', labelFa: 'همه مراحل مراقبت' },
    { id: 'cleanser', labelFa: 'شوینده و پاک‌کننده' },
    { id: 'toner', labelFa: 'تونر و اسنس' },
    { id: 'serum', labelFa: 'سرم‌های تخصصی و درمانی' },
    { id: 'moisturizer', labelFa: 'کرم مرطوب‌کننده و آبرسان' },
    { id: 'exfoliator', labelFa: 'لایه‌بردار و اسکراب' },
    { id: 'eye-care', labelFa: 'مراقبت دور چشم' },
    { id: 'sunscreen', labelFa: 'ضدآفتاب و محافظت پوست' },
    { id: 'mask', labelFa: 'ماسک و لایه‌بردار' },
    { id: 'lip-care', labelFa: 'مراقبت لب' },
    { id: 'hair-body', labelFa: 'مراقبت مو و بدن' },
    { id: 'device', labelFa: 'دستگاه‌ها و ابزار ماساژ' },
  ];

  // 4. ترکیبات و مواد مؤثره (Ingredients & Actives)
  const ingredientsList: { id: string; labelFa: string; searchTag: string }[] = [
    { id: 'all', labelFa: 'همه ترکیبات', searchTag: '' },
    { id: 'hyaluronic-acid', labelFa: 'هیالورونیک اسید', searchTag: 'hyaluronic' },
    { id: 'niacinamide', labelFa: 'نیاسینامید و زینک', searchTag: 'niacinamide' },
    { id: 'argan', labelFa: 'روغن آرگان مراکشی', searchTag: 'argan' },
    { id: 'snail-mucin', labelFa: 'موسین حلزون کره‌ای', searchTag: 'snail' },
    { id: 'panthenol', labelFa: 'پانتنول و مادکاسوساید (سنتلا)', searchTag: 'panthenol' },
    { id: 'ginseng', labelFa: 'جینسینگ و عصاره برنج', searchTag: 'ginseng' },
    { id: 'cactus', labelFa: 'شیره کاکتوس صحرا', searchTag: 'cactus' },
    { id: 'caffeine', labelFa: 'کافئین و پپتیدها', searchTag: 'caffeine' },
    { id: 'zinc-oxide', labelFa: 'زینک اکساید و چای سفید', searchTag: 'zinc' },
    { id: 'lavender', labelFa: 'اسطوخودوس و بابونه', searchTag: 'lavender' },
    { id: 'lactic-acid', labelFa: 'اسید لاکتیک و AHA', searchTag: 'lactic' },
    { id: 'rose', labelFa: 'عصاره گل رز و موم عسل', searchTag: 'rose' },
    { id: 'jade-stone', labelFa: 'سنگ جید و یشم اصل', searchTag: 'jade' },
  ];

  // 5. روتین‌ها (Routines & Rituals)
  const routinesList: { id: RoutineType | 'all'; labelFa: string; descFa: string }[] = [
    { id: 'all', labelFa: 'همه روتین‌ها', descFa: 'تمام محصولات و روتین‌ها' },
    { id: 'morning', labelFa: 'روتین صبح', descFa: 'محافظت، شادابی و ضدآفتاب' },
    { id: 'night', labelFa: 'روتین شبانه', descFa: 'تغذیه عمیق و بازسازی سلولی' },
    { id: 'anti-aging', labelFa: 'روتین جوانسازی و لیفت', descFa: 'کاهش خطوط و افزایش کلاژن' },
    { id: 'hydration', labelFa: 'روتین آبرسانی ۷۲ ساعته', descFa: 'رفع خشکی مفرط و کدری' },
    { id: 'brightening', labelFa: 'روتین شفاف‌کننده و ضدلک', descFa: 'درخشش طبیعی و رفع تیرگی' },
    { id: 'acne-blemish', labelFa: 'روتین ضدجوش و کنترل چربی', descFa: 'پاکسازی منافذ و تنظیم سبوم' },
    { id: 'barrier-repair', labelFa: 'روتین ترمیم سد دفاعی', descFa: 'التیام قرمزی و رفع حساسیت' },
    { id: 'soothing', labelFa: 'روتین التیام‌بخش و تسکین‌دهنده', descFa: 'آرامش‌بخش پوست‌های حساس' },
    { id: 'minimal', labelFa: 'روتین مینیمال و پایه', descFa: 'مراقبت ساده ۳ مرحله‌ای ضروری' },
  ];

  // Dynamic Item Counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    brandsList.forEach((brand) => {
      if (brand.id === 'all') return;
      const bId = brand.id.toLowerCase();
      const bEn = brand.labelEn.toLowerCase();
      const bFa = brand.labelFa.toLowerCase();
      let matchCount = 0;
      products.forEach((p) => {
        const pBrand = (p.brand || '').toLowerCase();
        const pNameFa = (p.nameFa || '').toLowerCase();
        const pNameEn = (p.nameEn || '').toLowerCase();
        if (
          pBrand === bId ||
          pBrand === bEn ||
          pBrand === bFa ||
          pNameFa.includes(bFa) ||
          pNameEn.includes(bEn)
        ) {
          matchCount++;
        }
      });
      counts[brand.id] = matchCount;
    });
    return counts;
  }, [products, brandsList]);

  const skinTypeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      (p.skinTypes || []).forEach(st => {
        counts[st] = (counts[st] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const productTypeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      const pt = p.productType || 'serum';
      counts[pt] = (counts[pt] || 0) + 1;
    });
    return counts;
  }, [products]);

  const routineCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      (p.routines || ['morning', 'night']).forEach(r => {
        counts[r] = (counts[r] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Brand Filter
        if (selectedBrand !== 'all') {
          const brandObj = brandsList.find(b => b.id === selectedBrand);
          const bId = selectedBrand.toLowerCase();
          const bEn = (brandObj?.labelEn || '').toLowerCase();
          const bFa = (brandObj?.labelFa || '').toLowerCase();
          const pBrand = (p.brand || '').toLowerCase();
          const pNameFa = (p.nameFa || '').toLowerCase();
          const pNameEn = (p.nameEn || '').toLowerCase();

          const isMatch =
            pBrand === bId ||
            pBrand === bEn ||
            pBrand === bFa ||
            (bFa !== '' && pNameFa.includes(bFa)) ||
            (bEn !== '' && pNameEn.includes(bEn));

          if (!isMatch) return false;
        }

        // 2. Skin Type Filter
        if (selectedSkinType !== 'all') {
          if (!p.skinTypes || !p.skinTypes.includes(selectedSkinType)) {
            return false;
          }
        }

        // 3. Product Type Filter (مراقبت از پوست)
        if (selectedProductType !== 'all') {
          const pType = p.productType || 'serum';
          if (pType !== selectedProductType) {
            // Also check category fallback for backward compatibility
            if (selectedProductType === 'sunscreen' && p.category !== 'sunscreen') return false;
            if (selectedProductType === 'hair-body' && p.category !== 'hair-body') return false;
            if (selectedProductType === 'cleanser' && !p.nameFa.includes('شوینده') && !p.nameFa.includes('پاک‌کننده')) return false;
            if (selectedProductType === 'toner' && !p.nameFa.includes('تونر') && !p.nameFa.includes('اسنس')) return false;
            if (selectedProductType === 'moisturizer' && !p.nameFa.includes('کرم') && !p.nameFa.includes('بالم') && p.category !== 'hydration') return false;
            if (selectedProductType === 'eye-care' && !p.nameFa.includes('چشم')) return false;
            if (selectedProductType === 'mask' && !p.nameFa.includes('ماسک')) return false;
            if (selectedProductType === 'lip-care' && !p.nameFa.includes('لب')) return false;
            if (selectedProductType === 'device' && !p.nameFa.includes('ماساژور') && !p.nameFa.includes('رولر')) return false;
          }
        }

        // 4. Ingredient Filter (ترکیبات)
        if (selectedIngredient !== 'all') {
          const ingTag = selectedIngredient.toLowerCase();
          const hasTag = (p.ingredientTags || []).some(t => t.toLowerCase().includes(ingTag));
          const hasKeyIng = (p.keyIngredients || []).some(
            k => k.nameFa.toLowerCase().includes(ingTag) || 
                 k.nameEn.toLowerCase().includes(ingTag) || 
                 k.description.toLowerCase().includes(ingTag)
          );
          const hasInName = (p.nameFa + ' ' + p.nameEn + ' ' + p.descriptionFa).toLowerCase().includes(ingTag);
          if (!hasTag && !hasKeyIng && !hasInName) return false;
        }

        // 5. Routine Filter (روتین‌ها)
        if (selectedRoutine !== 'all') {
          const pRoutines = p.routines || [];
          if (!pRoutines.includes(selectedRoutine)) {
            // Fallback for concern matching
            if (selectedRoutine === 'anti-aging' && !p.concerns?.includes('anti-aging')) return false;
            if (selectedRoutine === 'hydration' && !p.concerns?.includes('hydration')) return false;
            if (selectedRoutine === 'brightening' && !p.concerns?.includes('brightening')) return false;
            if (selectedRoutine === 'acne-blemish' && !p.concerns?.includes('acne-blemish')) return false;
            if (selectedRoutine === 'barrier-repair' && !p.concerns?.includes('barrier-repair') && !p.concerns?.includes('soothing')) return false;
            if (selectedRoutine === 'soothing' && !p.concerns?.includes('soothing') && !p.concerns?.includes('sensitive')) return false;
            if (selectedRoutine === 'morning' || selectedRoutine === 'night' || selectedRoutine === 'minimal') return false;
          }
        }

        // Category Filter (General)
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Price Filter
        const pPrice = p.price || 0;
        if (priceRange === 'under1m' && pPrice >= 1000000) return false;
        if (priceRange === '1m-1.5m' && (pPrice < 1000000 || pPrice > 1500000)) return false;
        if (priceRange === 'over1.5m' && pPrice <= 1500000) return false;

        // Stock & Badges Filter
        if (onlyInStock) {
          const currentStock = p.stockCount !== undefined ? p.stockCount : (p.inStock ? 10 : 0);
          if (currentStock <= 0 || !p.inStock) return false;
        }
        if (onlyBestSellers && !p.isBestSeller) return false;
        if (onlyNew && !p.isNew) return false;

        // Rating Filter
        if (minRating > 0 && (p.rating || 0) < minRating) return false;

        // Search Filter (Brand, Name, Ingredients, Description, Product Type)
        const q = searchQuery.trim().toLowerCase();
        if (q) {
          const matchFa = (p.nameFa || '').toLowerCase().includes(q) || (p.descriptionFa || '').toLowerCase().includes(q);
          const matchEn = (p.nameEn || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q);
          const matchIng = (p.ingredientTags || []).some(k => k.toLowerCase().includes(q)) || 
                           (p.keyIngredients || []).some(k => (k.nameFa + ' ' + k.nameEn).toLowerCase().includes(q));
          const cosrxAlias = p.brand?.toLowerCase() === 'cosrx' && ['کوزارکس', 'کازارکس'].includes(q);
          if (!matchFa && !matchEn && !matchIng && !cosrxAlias) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'bestseller') return Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller))
          || Number(getProductCover(b) !== DEFAULT_PRODUCT_IMAGE) - Number(getProductCover(a) !== DEFAULT_PRODUCT_IMAGE);
        if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return 0;
      });
  }, [
    products, 
    selectedBrand,
    selectedSkinType,
    selectedProductType,
    selectedIngredient,
    selectedRoutine,
    selectedCategory,
    priceRange, 
    onlyInStock,
    onlyBestSellers, 
    onlyNew, 
    minRating, 
    searchQuery, 
    sortBy
  ]);

  // Active Filter Count
  const activeFilters = [
    selectedBrand !== 'all' && { key: 'brand', label: `برند: ${brandsList.find((brand) => brand.id === selectedBrand)?.labelFa || selectedBrand}`, clear: () => setSelectedBrand('all') },
    selectedCategory !== 'all' && { key: 'category', label: `دسته: ${categoryLabels[selectedCategory]}`, clear: () => setSelectedCategory('all') },
    selectedSkinType !== 'all' && { key: 'skin', label: `نوع پوست: ${skinTypesList.find((item) => item.id === selectedSkinType)?.labelFa}`, clear: () => setSelectedSkinType('all') },
    selectedProductType !== 'all' && { key: 'type', label: `نوع محصول: ${productTypesList.find((item) => item.id === selectedProductType)?.labelFa}`, clear: () => setSelectedProductType('all') },
    selectedIngredient !== 'all' && { key: 'ingredient', label: `ترکیب: ${ingredientsList.find((item) => item.id === selectedIngredient)?.labelFa}`, clear: () => setSelectedIngredient('all') },
    selectedRoutine !== 'all' && { key: 'routine', label: `روتین: ${routinesList.find((item) => item.id === selectedRoutine)?.labelFa}`, clear: () => setSelectedRoutine('all') },
    priceRange !== 'all' && { key: 'price', label: priceRange === 'under1m' ? 'زیر ۱ میلیون تومان' : priceRange === '1m-1.5m' ? '۱ تا ۱٫۵ میلیون تومان' : 'بیش از ۱٫۵ میلیون تومان', clear: () => setPriceRange('all') },
    onlyInStock && { key: 'stock', label: 'فقط موجود', clear: () => setOnlyInStock(false) },
    onlyBestSellers && { key: 'best', label: 'پرفروش‌ترین‌ها', clear: () => setOnlyBestSellers(false) },
    onlyNew && { key: 'new', label: 'جدیدترین‌ها', clear: () => setOnlyNew(false) },
    minRating > 0 && { key: 'rating', label: `امتیاز ${minRating.toLocaleString('fa-IR')} به بالا`, clear: () => setMinRating(0) },
    searchQuery.trim() && { key: 'query', label: `جستجو: «${searchQuery}»`, clear: () => setSearchQuery('') },
  ].filter((filter): filter is { key: string; label: string; clear: () => void } => Boolean(filter));
  const activeFiltersCount = activeFilters.length;

  const resetAllFilters = () => {
    setSelectedBrand('all');
    setSelectedSkinType('all');
    setSelectedProductType('all');
    setSelectedIngredient('all');
    setSelectedRoutine('all');
    setSelectedCategory('all');
    setPriceRange('all');
    setOnlyInStock(false);
    setOnlyBestSellers(false);
    setOnlyNew(false);
    setMinRating(0);
    setSearchQuery('');
    setSortBy('bestseller');
  };

  return (
    <div className="min-h-screen w-full pb-24 font-vazir" dir="rtl">
      {/* Main Shop Container */}
      <div className="vara-container pt-8 sm:pt-12">
        
        <div className="space-y-3 mb-6">
          <h1 className="vara-shop-title">فروشگاه مراقبت پوست</h1>
          <CatalogNotice catalog={catalog} />
        </div>
        {/* Top Control Bar: Search & Sorting */}
        <div className="bg-vara-surface p-4 sm:p-6 rounded-3xl border border-vara-line mb-8 w-full max-w-full overflow-hidden shadow-shop-card">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Box */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                ref={shopSearchRef}
                aria-label="جستجو در کاتالوگ"
                dir="auto"
                placeholder="نام محصول، برند یا ترکیب"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-vara-surface text-vara-ink placeholder-vara-muted text-xs font-vazir pr-10 pl-8 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white transition-colors"
              />
              <Search className="w-4 h-4 text-vara-rose-ink absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="پاک کردن جستجو"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-vara-muted hover:text-vara-rose-ink cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-3">
              
              {/* Mobile Filter Button */}
              <button
                type="button"
                ref={mobileFilterTriggerRef}
                onClick={() => setMobileFilterOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={mobileFilterOpen}
                aria-controls={mobileFilterOpen ? mobileFilterId : undefined}
                className="lg:hidden flex items-center gap-2 bg-vara-rose hover:bg-vara-rose-hover text-white px-4 py-2.5 rounded-full text-xs font-semibold cursor-pointer shadow-xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>فیلترها {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-vara-muted shrink-0 font-medium hidden sm:inline">مرتب‌سازی:</span>
                <select
                  ref={sortRef}
                  aria-label="مرتب‌سازی محصولات"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-vara-surface text-vara-ink font-semibold text-xs px-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose cursor-pointer"
                >
                  <option value="bestseller">پرفروش‌ترین‌ها</option>
                  <option value="newest">جدیدترین محصولات</option>
                  <option value="price-low">قیمت: کم به زیاد</option>
                  <option value="price-high">قیمت: زیاد به کم</option>
                  <option value="rating">بیشترین امتیاز مشتریان</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {activeFiltersCount > 0 && (
          <div className="vara-active-filters" aria-label="فیلترهای فعال">
            <span className="text-sm font-bold">فیلترهای فعال</span>
            {activeFilters.map(({ key, label, clear }) => (
              <button key={key} type="button" className="vara-chip" aria-label={`حذف فیلتر ${label}`} onClick={(event) => {
                const group = event.currentTarget.parentElement;
                const next = event.currentTarget.nextElementSibling;
                clear();
                if (activeFiltersCount === 1) shopSearchRef.current?.focus();
                else if (next instanceof HTMLElement) next.focus();
                else group?.querySelector('button')?.focus();
              }}>
                <bdi>{label}</bdi><X size={14} aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="vara-button" onClick={() => { resetAllFilters(); shopSearchRef.current?.focus(); }}>
              پاک کردن همه
            </button>
          </div>
        )}

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-vara-surface p-6 rounded-2xl border border-vara-line space-y-5 sticky top-28 max-h-[85vh] overflow-y-auto text-right shadow-shop-card">
              
              <div className="flex items-center justify-between pb-3 border-b border-vara-line">
                <h3 className="font-bold text-xs text-vara-ink flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-vara-rose-ink" />
                  <span>فیلترهای جامع فروشگاه</span>
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetAllFilters}
                    className="text-[10px] text-vara-rose-ink hover:underline font-semibold cursor-pointer"
                  >
                    بازنشانی ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* 1. برند (Brand Filter) */}
              <div className="space-y-2">
                <button
                  onClick={() => toggleSection('brand')}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-vara-ink cursor-pointer"
                >
                  <span>برند محصول</span>
                  <ChevronDown className={`w-3 h-3 text-vara-muted transition-transform duration-300 ${openSections.brand ? 'rotate-180 text-vara-rose-ink' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSections.brand && (
                    <motion.div
                      key="filter-brand"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pt-1.5 space-y-2">
                        {/* Quick brand filter input */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="جستجوی برند..."
                            value={brandSearchInput}
                            onChange={(e) => setBrandSearchInput(e.target.value)}
                            className="w-full bg-vara-surface text-vara-ink placeholder-vara-muted text-[10px] pr-7 pl-5 py-1.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose"
                          />
                          <Search className="w-3 h-3 text-vara-rose-ink absolute right-2 top-1/2 -translate-y-1/2" />
                          {brandSearchInput && (
                            <button
                              onClick={() => setBrandSearchInput('')}
                              className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-vara-muted hover:text-vara-rose-ink"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                          {visibleBrandsList.map((brand) => (
                            <button
                              key={brand.id}
                              onClick={() => setSelectedBrand(brand.id)} aria-pressed={selectedBrand === brand.id}
                              className={`w-full text-right px-2.5 py-1.5 rounded-full text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                                selectedBrand === brand.id
                                  ? 'bg-vara-rose text-white font-semibold'
                                  : 'text-vara-muted hover:bg-vara-tint hover:text-vara-ink'
                              }`}
                            >
                              <div className="flex flex-col truncate">
                                <span className="truncate">{brand.labelFa}</span>
                                {brand.id !== 'all' && (
                                  <span className={`text-[9px] font-normal truncate font-jakarta ${selectedBrand === brand.id ? 'text-white/75' : 'text-vara-muted'}`}>{brand.labelEn}</span>
                                )}
                              </div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full shrink-0 ml-1 font-jakarta tabular-nums ${
                                selectedBrand === brand.id ? 'bg-white/20 text-white' : 'bg-vara-surface text-vara-muted border border-vara-line'
                              }`}>
                                {(brandCounts[brand.id] || 0).toLocaleString('fa-IR')}
                              </span>
                            </button>
                          ))}
                          {visibleBrandsList.length === 0 && (
                            <p className="text-[10px] text-center text-vara-muted py-2">برندی یافت نشد</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 2. نوع پوست (Skin Type Filter) */}
              <div className="space-y-2 pt-2.5 border-t border-vara-line">
                <button
                  onClick={() => toggleSection('skinType')}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-vara-ink cursor-pointer"
                >
                  <span>نوع پوست</span>
                  <ChevronDown className={`w-3 h-3 text-vara-muted transition-transform duration-300 ${openSections.skinType ? 'rotate-180 text-vara-rose-ink' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSections.skinType && (
                    <motion.div
                      key="filter-skinType"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1">
                        {skinTypesList.map((st) => (
                          <label
                            key={st.id}
                            onClick={() => setSelectedSkinType(st.id)} aria-pressed={selectedSkinType === st.id}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                              selectedSkinType === st.id
                                ? 'bg-vara-rose text-white font-semibold'
                                : 'text-vara-muted hover:bg-vara-tint hover:text-vara-ink'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <input
                                type="radio"
                                name="desktopSkinType"
                                checked={selectedSkinType === st.id}
                                onChange={() => setSelectedSkinType(st.id)}
                                className="hidden"
                              />
                              <span>{st.labelFa}</span>
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-jakarta tabular-nums ${
                              selectedSkinType === st.id ? 'bg-white/20 text-white' : 'bg-vara-surface text-vara-muted border border-vara-line'
                            }`}>
                              {(skinTypeCounts[st.id] || 0).toLocaleString('fa-IR')}
                            </span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 3. مراقبت از پوست (Product Types / Skin Care Steps) */}
              <div className="space-y-2 pt-2.5 border-t border-vara-line">
                <button
                  onClick={() => toggleSection('productType')}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-vara-ink cursor-pointer"
                >
                  <span>مراقبت از پوست و محصولات</span>
                  <ChevronDown className={`w-3 h-3 text-vara-muted transition-transform duration-300 ${openSections.productType ? 'rotate-180 text-vara-rose-ink' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSections.productType && (
                    <motion.div
                      key="filter-productType"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1 max-h-52 overflow-y-auto pr-1">
                        {productTypesList.map((pt) => (
                          <button
                            key={pt.id}
                            onClick={() => setSelectedProductType(pt.id)} aria-pressed={selectedProductType === pt.id}
                            className={`w-full text-right px-2.5 py-1.5 rounded-full text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                              selectedProductType === pt.id
                                ? 'bg-vara-rose text-white font-semibold'
                                : 'text-vara-muted hover:bg-vara-tint hover:text-vara-ink'
                            }`}
                          >
                            <span className="truncate">{pt.labelFa}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-jakarta tabular-nums ${
                              selectedProductType === pt.id ? 'bg-white/20 text-white' : 'bg-vara-surface text-vara-muted border border-vara-line'
                            }`}>
                              {(productTypeCounts[pt.id] || 0).toLocaleString('fa-IR')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. ترکیبات و مواد مؤثره (Ingredients) */}
              <div className="space-y-2 pt-2.5 border-t border-vara-line">
                <button
                  onClick={() => toggleSection('ingredient')}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-vara-ink cursor-pointer"
                >
                  <span>ترکیبات و مواد فعال</span>
                  <ChevronDown className={`w-3 h-3 text-vara-muted transition-transform duration-300 ${openSections.ingredient ? 'rotate-180 text-vara-rose-ink' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSections.ingredient && (
                    <motion.div
                      key="filter-ingredient"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1 max-h-44 overflow-y-auto pr-1">
                        {ingredientsList.map((ing) => (
                          <button
                            key={ing.id}
                            onClick={() => setSelectedIngredient(ing.id)} aria-pressed={selectedIngredient === ing.id}
                            className={`w-full text-right px-2.5 py-1.5 rounded-full text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                              selectedIngredient === ing.id
                                ? 'bg-vara-rose text-white font-semibold'
                                : 'text-vara-muted hover:bg-vara-tint hover:text-vara-ink'
                            }`}
                          >
                            <span className="truncate">{ing.labelFa}</span>
                            {selectedIngredient === ing.id && <Check className="w-3 h-3 text-white" />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 5. روتین‌ها (Routines & Rituals) */}
              <div className="space-y-2 pt-2.5 border-t border-vara-line">
                <button
                  onClick={() => toggleSection('routine')}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-vara-ink cursor-pointer"
                >
                  <span>روتین‌ها و اهداف پوستی</span>
                  <ChevronDown className={`w-3 h-3 text-vara-muted transition-transform duration-300 ${openSections.routine ? 'rotate-180 text-vara-rose-ink' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSections.routine && (
                    <motion.div
                      key="filter-routine"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1 max-h-48 overflow-y-auto pr-1">
                        {routinesList.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => setSelectedRoutine(r.id)} aria-pressed={selectedRoutine === r.id}
                            className={`w-full text-right px-2.5 py-1.5 rounded-full text-[11px] transition-all flex items-center justify-between cursor-pointer ${
                              selectedRoutine === r.id
                                ? 'bg-vara-rose text-white font-semibold'
                                : 'text-vara-muted hover:bg-vara-tint hover:text-vara-ink'
                            }`}
                          >
                            <span className="truncate">{r.labelFa}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-jakarta tabular-nums ${
                              selectedRoutine === r.id ? 'bg-white/20 text-white' : 'bg-vara-surface text-vara-muted border border-vara-line'
                            }`}>
                              {(routineCounts[r.id] || 0).toLocaleString('fa-IR')}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 pt-2.5 border-t border-vara-line">
                <button
                  onClick={() => toggleSection('price')}
                  className="w-full flex items-center justify-between text-[11px] font-bold text-vara-ink cursor-pointer"
                >
                  <span>محدوده قیمت</span>
                  <ChevronDown className={`w-3 h-3 text-vara-muted transition-transform duration-300 ${openSections.price ? 'rotate-180 text-vara-rose-ink' : ''}`} />
                </button>
                
                <AnimatePresence initial={false}>
                  {openSections.price && (
                    <motion.div
                      key="filter-price"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 pt-1">
                        {[
                          { id: 'all', label: 'همه قیمت‌ها' },
                          { id: 'under1m', label: 'زیر ۱٫۰۰۰٫۰۰۰ تومان' },
                          { id: '1m-1.5m', label: '۱٫۰۰۰٫۰۰۰ تا ۱٫۵۰۰٫۰۰۰ تومان' },
                          { id: 'over1.5m', label: 'بالای ۱٫۵۰۰٫۰۰۰ تومان' },
                        ].map((pr) => (
                          <label
                            key={pr.id}
                            className="flex items-center gap-2 text-[11px] text-vara-muted hover:text-vara-ink cursor-pointer py-1"
                          >
                            <input
                              type="radio"
                              name="priceRange"
                              checked={priceRange === pr.id}
                              onChange={() => setPriceRange(pr.id as any)}
                              className="accent-vara-rose"
                            />
                            <span>{pr.label}</span>
                          </label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Special Toggles & In Stock */}
              <div className="space-y-1.5 pt-2.5 border-t border-vara-line">
                <label className="flex items-center justify-between text-[11px] text-vara-ink cursor-pointer py-0.5 font-semibold">
                  <span>فقط کالاهای موجود در انبار</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-vara-rose w-3.5 h-3.5 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] text-vara-muted cursor-pointer py-0.5">
                  <span>محصولات پرفروش</span>
                  <input
                    type="checkbox"
                    checked={onlyBestSellers}
                    onChange={(e) => setOnlyBestSellers(e.target.checked)}
                    className="accent-vara-rose w-3.5 h-3.5 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-[11px] text-vara-muted cursor-pointer py-0.5">
                  <span>جدیدترین محصولات</span>
                  <input
                    type="checkbox"
                    checked={onlyNew}
                    onChange={(e) => setOnlyNew(e.target.checked)}
                    className="accent-vara-rose w-3.5 h-3.5 rounded cursor-pointer"
                  />
                </label>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <section aria-label="نتایج کاتالوگ" className="lg:col-span-3 min-w-0 space-y-5">
            
            {/* Results Count Header */}
            <div className="flex items-center justify-between text-sm text-vara-muted pb-3 border-b border-vara-line">
              <span role="status">
                نمایش <strong className="text-vara-rose-ink font-bold text-sm font-jakarta tabular-nums">{filteredProducts.length.toLocaleString('fa-IR')}</strong> محصول
              </span>

            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="vara-store-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            ) : (
              /* Empty Search Results State */
              <div className="bg-white p-12 rounded-2xl border border-vara-line text-center space-y-4 my-8 shadow-shop-card">
                <div className="w-14 h-14 bg-vara-surface rounded-2xl flex items-center justify-center mx-auto text-vara-rose-ink border border-vara-line">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-vara-ink">
                  {products.length === 0
                    ? catalog.status === 'current' ? 'هنوز محصولی در فروشگاه ثبت نشده است.' : catalog.status === 'loading' ? 'در حال دریافت محصولات…' : 'فهرست محصولات در دسترس نیست.'
                    : 'محصولی با این فیلترها پیدا نشد.'}
                </h3>
                {activeFiltersCount > 0 && <button type="button" onClick={() => { resetAllFilters(); shopSearchRef.current?.focus(); }} className="vara-button vara-button-primary">
                  پاک کردن فیلترها
                </button>}
              </div>
            )}

            {/* Skincare Quiz Banner Callout */}
            <div className="mt-12 bg-vara-surface border border-vara-tint-line/50 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-right">

                <h3 className="text-lg font-bold text-vara-ink">
                  برای انتخاب روتین راهنمایی می‌خواهید؟
                </h3>
                <p className="text-xs text-vara-muted">
                  به چند سؤال کوتاه درباره پوستتان پاسخ دهید.
                </p>
              </div>
              <button
                onClick={onOpenQuiz}
                className="bg-vara-rose hover:bg-vara-rose-hover text-white px-6 py-3 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>طراحی روتین پوست</span>
              </button>
            </div>

          </section>

        </div>

      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
          <dialog
            ref={mobileFilterDialogRef}
            id={mobileFilterId}
            aria-labelledby={`${mobileFilterId}-title`}
            onCancel={(event) => {
              event.preventDefault();
              setMobileFilterOpen(false);
            }}
            onKeyDown={keepMobileFilterTabInside}
            className="fixed inset-0 m-0 h-dvh w-full max-h-none max-w-none flex-col bg-vara-canvas text-vara-ink open:flex lg:hidden"
            dir="rtl"
          >
            <div className="p-4 border-b border-vara-line flex items-center justify-between bg-white">
              <h3 id={`${mobileFilterId}-title`} className="font-bold text-sm text-vara-ink flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-vara-rose-ink" />
                <span>فیلترهای پیشرفته فروشگاه</span>
              </h3>
              <button
                type="button"
                ref={closeMobileFilterRef}
                aria-label="بستن فیلترها"
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 text-vara-muted hover:text-vara-rose-ink hover:bg-vara-tint rounded-full cursor-pointer focus-visible:outline-2 focus-visible:outline-vara-rose-ink"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-6 text-right bg-vara-canvas">
              {/* 1. برند */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-vara-ink flex items-center justify-between">
                  <span>برند</span>
                  <span className="text-[10px] text-vara-muted font-normal">
                    {visibleBrandsList.length} برند
                  </span>
                </h4>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="جستجوی برند..."
                    value={brandSearchInput}
                    onChange={(e) => setBrandSearchInput(e.target.value)}
                    className="w-full bg-white text-vara-ink placeholder-vara-muted text-xs pr-8 pl-6 py-2 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose"
                  />
                  <Search className="w-3.5 h-3.5 text-vara-rose-ink absolute right-2.5 top-1/2 -translate-y-1/2" />
                  {brandSearchInput && (
                    <button
                      onClick={() => setBrandSearchInput('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-vara-muted hover:text-vara-rose-ink"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1">
                  {visibleBrandsList.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)} aria-pressed={selectedBrand === brand.id}
                      className={`p-2.5 rounded-full text-xs transition-all cursor-pointer text-center flex flex-col items-center justify-center ${
                        selectedBrand === brand.id
                          ? 'bg-vara-rose text-white font-semibold'
                          : 'bg-white text-vara-ink border border-vara-line'
                      }`}
                    >
                      <span className="truncate w-full">{brand.labelFa}</span>
                      {brand.id !== 'all' && (
                        <span className={`text-[9px] truncate w-full font-normal font-jakarta ${selectedBrand === brand.id ? 'text-white/75' : 'text-vara-muted'}`}>{brand.labelEn}</span>
                      )}
                    </button>
                  ))}
                  {visibleBrandsList.length === 0 && (
                    <div className="col-span-2 text-center text-xs text-vara-muted py-3">
                      برندی با این نام یافت نشد.
                    </div>
                  )}
                </div>
              </div>

              {/* 2. نوع پوست */}
              <div className="space-y-2 pt-4 border-t border-vara-line">
                <h4 className="text-xs font-bold text-vara-ink">
                  <span>نوع پوست</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {skinTypesList.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedSkinType(st.id)} aria-pressed={selectedSkinType === st.id}
                      className={`p-2 rounded-full text-xs transition-all cursor-pointer text-center ${
                        selectedSkinType === st.id
                          ? 'bg-vara-rose text-white font-semibold'
                          : 'bg-white text-vara-ink border border-vara-line'
                      }`}
                    >
                      {st.labelFa}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. مراقبت از پوست */}
              <div className="space-y-2 pt-4 border-t border-vara-line">
                <h4 className="text-xs font-bold text-vara-ink">
                  <span>مراقبت از پوست و محصولات</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {productTypesList.map((pt) => (
                    <button
                      key={pt.id}
                      onClick={() => setSelectedProductType(pt.id)} aria-pressed={selectedProductType === pt.id}
                      className={`p-2 rounded-full text-xs transition-all cursor-pointer text-center ${
                        selectedProductType === pt.id
                          ? 'bg-vara-rose text-white font-semibold'
                          : 'bg-white text-vara-ink border border-vara-line'
                      }`}
                    >
                      {pt.labelFa}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. ترکیبات */}
              <div className="space-y-2 pt-4 border-t border-vara-line">
                <h4 className="text-xs font-bold text-vara-ink">
                  <span>ترکیبات و مواد فعال</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {ingredientsList.map((ing) => (
                    <button
                      key={ing.id}
                      onClick={() => setSelectedIngredient(ing.id)} aria-pressed={selectedIngredient === ing.id}
                      className={`p-2 rounded-full text-xs transition-all cursor-pointer text-center ${
                        selectedIngredient === ing.id
                          ? 'bg-vara-rose text-white font-semibold'
                          : 'bg-white text-vara-ink border border-vara-line'
                      }`}
                    >
                      {ing.labelFa}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. روتین‌ها */}
              <div className="space-y-2 pt-4 border-t border-vara-line">
                <h4 className="text-xs font-bold text-vara-ink">
                  <span>روتین‌ها و اهداف پوستی</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {routinesList.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRoutine(r.id)} aria-pressed={selectedRoutine === r.id}
                      className={`p-2 rounded-full text-xs transition-all cursor-pointer text-center ${
                        selectedRoutine === r.id
                          ? 'bg-vara-rose text-white font-semibold'
                          : 'bg-white text-vara-ink border border-vara-line'
                      }`}
                    >
                      {r.labelFa}
                    </button>
                  ))}
                </div>
              </div>

              {/* موجودی */}
              <div className="pt-4 border-t border-vara-line space-y-2">
                <label className="flex items-center justify-between text-xs text-vara-ink py-1 font-bold">
                  <span>فقط کالاهای موجود</span>
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-vara-rose w-4 h-4 rounded"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-vara-line bg-white flex gap-3">
              <button
                type="button"
                onClick={() => {
                  resetAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-1/3 bg-vara-surface text-vara-ink border border-vara-line py-3 rounded-full text-xs font-semibold cursor-pointer"
              >
                پاکسازی
              </button>
              <button
                type="button"
                ref={applyMobileFilterRef}
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 bg-vara-rose hover:bg-vara-rose-hover text-white py-3 rounded-full text-xs font-semibold cursor-pointer"
              >
                اعمال فیلترها ({filteredProducts.length.toLocaleString('fa-IR')})
              </button>
            </div>
          </dialog>
      )}

    </div>
  );
};
