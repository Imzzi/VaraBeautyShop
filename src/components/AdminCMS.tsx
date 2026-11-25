import { Modal } from './Modal';
import { ProductImage } from './ProductImage';
import { getProductCover } from '../lib/productImages';
import { CatalogNotice } from './CatalogNotice';
import type { CatalogSnapshot } from '../lib/db';
import React, { useState, useEffect, useRef, useMemo, Suspense, lazy } from 'react';
import { 
  ShieldCheck, Lock, LogOut, Plus, Edit3, Trash2, CheckCircle2, 
  XCircle, Search, RefreshCw, Image as ImageIcon, 
  Layers, Package, AlertCircle, ArrowRight, Eye, Check,
  UploadCloud, X, ShoppingBag,
  Minus, Box, Award, SlidersHorizontal,
  Globe, AlertTriangle, Star, Clock, Cloud, HardDrive,
  Server, Activity, Sparkles
} from 'lucide-react';
import { 
  Product, 
  ProductSize, 
  ProductVariant,
  CategoryId, 
  SkinType, 
  SkincareProductType,
  RoutineType,
  SkinConcern,
  OrderStats,
  SHOP_ROUTINES,
  CarouselSlide
} from '../types';
import { 
  addProductToDb, 
  updateProductInDb, 
  deleteProductFromDb, 
  updateProductStockInDb,
  subscribeToOrderChanges,
  fetchOrderStats,
  logoutUser
} from '../lib/db';
import { enrichIngredientsLocally, isGenericIngredientDescription } from '../lib/ingredientDescriptions';
import { 
  verifyAdminCredentialsInDb,
  getAdminToken,
  setAdminToken,
  clearAdminToken
} from '../lib/adminAuth';
import { BrandItem } from '../data/brands';
import { subscribeToBrands, getLocalBrands } from '../lib/brandsManager';
import { getLocalHeroSlides } from '../data/heroSlides';
import { getLocalFormulaConfig, subscribeToFormulaConfig, FormulaConfig } from '../lib/formulaSettings';
import { uploadImageFile, checkVercelBlobStatus, formatBytes } from '../lib/blobUpload';

const AdminOrdersList = lazy(() => import('./AdminOrdersList').then(m => ({ default: m.AdminOrdersList })));
const AdminBrandsManager = lazy(() => import('./AdminBrandsManager').then(m => ({ default: m.AdminBrandsManager })));
const AdminHeroBannersManager = lazy(() => import('./AdminHeroBannersManager').then(m => ({ default: m.AdminHeroBannersManager })));
const AdminIntegrationsDashboard = lazy(() => import('./AdminIntegrationsDashboard').then(m => ({ default: m.AdminIntegrationsDashboard })));
const FormulaSettingsTab = lazy(() => import('./FormulaSettingsTab').then(m => ({ default: m.FormulaSettingsTab })));

interface AdminCMSProps {
  products: Product[];
  catalog: CatalogSnapshot;
  onBackToShop: () => void;
  onViewProduct?: (product: Product) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  products,
  catalog,
  onBackToShop,
  onViewProduct
}) => {
  // Navigation tab state: 'site' | 'orders' | 'formula'
  const [activeTab, setActiveTab] = useState<'site' | 'orders' | 'formula'>('site');
  // Subtab within 'site': 'products' | 'brands' | 'hero_banners' | 'storage'
  const [siteSubTab, setSiteSubTab] = useState<'products' | 'brands' | 'hero_banners' | 'storage'>('products');
  const [orderStats, setOrderStats] = useState<OrderStats>();
  const [brandsList, setBrandsList] = useState<BrandItem[]>(() => getLocalBrands());
  const [heroSlides, setHeroSlides] = useState<CarouselSlide[]>(() => getLocalHeroSlides());
  const [formulaConfig, setFormulaConfig] = useState<FormulaConfig>(() => getLocalFormulaConfig());
  const [blobStatus, setBlobStatus] = useState<{ configured: boolean; provider: string }>({ configured: false, provider: 'vercel-blob' });

  // Check Vercel Blob status
  useEffect(() => {
    checkVercelBlobStatus().then(setBlobStatus).catch(() => {});
  }, []);

  // Realtime formula synchronization (DB-backed)
  useEffect(() => {
    const unsub = subscribeToFormulaConfig((updated) => {
      setFormulaConfig(updated);
    });
    return () => unsub();
  }, []);

  // Realtime hero slides synchronization
  useEffect(() => {
    const handleHeroSlidesChange = () => {
      setHeroSlides(getLocalHeroSlides());
    };
    window.addEventListener('vara-hero-slides-change', handleHeroSlidesChange);
    return () => window.removeEventListener('vara-hero-slides-change', handleHeroSlidesChange);
  }, []);

  // Realtime brands synchronization
  useEffect(() => {
    const unsub = subscribeToBrands((updatedBrands) => {
      if (updatedBrands && updatedBrands.length > 0) {
        setBrandsList(updatedBrands);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Auth state (No hardcoded passwords anywhere - strictly production ready)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vara_admin_session') === 'true' && Boolean(getAdminToken());
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [adminLockoutRemaining, setAdminLockoutRemaining] = useState<number>(0);

  // Admin lockout countdown timer
  useEffect(() => {
    if (adminLockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setAdminLockoutRemaining((prev) => {
        if (prev <= 1) {
          setAuthError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [adminLockoutRemaining]);

  useEffect(() => {
    if (!isAdminAuthenticated) return;
    let active = true;
    let pending = false;
    let again = false;
    const refresh = async () => {
      if (pending) {
        again = true;
        return;
      }
      pending = true;
      try {
        const stats = await fetchOrderStats();
        if (active) setOrderStats(stats);
      } catch {
        if (active) setOrderStats(undefined);
      } finally {
        pending = false;
        if (active && again) {
          again = false;
          void refresh();
        }
      }
    };
    const handleSessionExpired = () => {
      clearAdminToken();
      localStorage.removeItem('vara_admin_session');
      setIsAdminAuthenticated(false);
      setOrderStats(undefined);
      setAuthError('نشست مدیریت منقضی شده است. لطفاً مجدداً وارد شوید.');
    };

    void refresh();
    const unsubscribe = subscribeToOrderChanges(refresh);
    window.addEventListener('vara-admin-session-expired', handleSessionExpired);
    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener('vara-admin-session-expired', handleSessionExpired);
    };
  }, [isAdminAuthenticated]);

  // Filter & Search state in CMS
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  // Modal State for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const saveInFlight = useRef(false);
  const [saveError, setSaveError] = useState('');
  const [productFeedback, setProductFeedback] = useState<{ text: string; error?: boolean }>();
  const [pendingStock, setPendingStock] = useState<string[]>([]);
  const stockWrites = useRef(new Set<string>());

  // Direct Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageUploadActive = useRef(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Form Fields State
  const [formNameFa, setFormNameFa] = useState('');
  const [formNameEn, setFormNameEn] = useState('');
  const [formBrand, setFormBrand] = useState('VARA');
  const [formProductType, setFormProductType] = useState<SkincareProductType>('serum');
  const [formCategory, setFormCategory] = useState<CategoryId>('anti-aging');
  const [formSkinTypes, setFormSkinTypes] = useState<SkinType[]>(['dry', 'normal', 'combination']);
  const [formConcerns, setFormConcerns] = useState<SkinConcern[]>(['anti-aging', 'hydration']);
  const [formRoutines, setFormRoutines] = useState<RoutineType[]>(['morning', 'night']);
  const [formPrice, setFormPrice] = useState<number>(1200000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(1400000);
  const [formDescriptionFa, setFormDescriptionFa] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formNewImageUrlInput, setFormNewImageUrlInput] = useState('');
  const [formStockCount, setFormStockCount] = useState<number>(20);
  const [formInStock, setFormInStock] = useState(true);
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsNew, setFormIsNew] = useState(true);
  const [formBadges, setFormBadges] = useState('۱۰۰٪ گیاهی, ارگانیک');
  const [formKeyIngredientsFa, setFormKeyIngredientsFa] = useState('عصاره خالص گیاهی');
  const [formHowToUse, setFormHowToUse] = useState('صبح و شب، مقدار کافی از محصول را روی پوست تمیز صورت و گردن به آرامی ماساژ دهید تا جذب شود.');
  const [formRoutineStep, setFormRoutineStep] = useState('گام ۳: سرم و آمپول درمانی تخصصی (Serum / Ampoule)');

  // Product Attributes & Authenticity Specifications
  const [formAuthenticity, setFormAuthenticity] = useState('');
  const [formSourcingOrigin, setFormSourcingOrigin] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formUnsuitableFor, setFormUnsuitableFor] = useState('');
  const [formTargetAudience, setFormTargetAudience] = useState('');

  // Product Variants State
  const [formHasVariants, setFormHasVariants] = useState(false);
  const [formVariants, setFormVariants] = useState<ProductVariant[]>([]);

  const handleAddVariant = (name: string = '', price: number = formPrice, stock: number = 10, nameEn: string = '', colorCode?: string) => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name || `تنوع ${formVariants.length + 1}`,
      nameEn: nameEn || '',
      price: price > 0 ? price : formPrice,
      originalPrice: formOriginalPrice > formPrice ? formOriginalPrice : undefined,
      stockCount: Math.max(0, stock),
      sku: '',
      colorCode: colorCode || ''
    };
    setFormVariants((prev) => [...prev, newVar]);
  };

  const handleRemoveVariant = (id: string) => {
    setFormVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleUpdateVariant = (id: string, field: keyof ProductVariant, val: any) => {
    setFormVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  // Handle direct multi-image file upload from device
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [failedUploads, setFailedUploads] = useState<File[]>([]);
  const [activeFileName, setActiveFileName] = useState('');

  const handleImageFiles = async (files: FileList | File[]) => {
    if (imageUploadActive.current || saveInFlight.current || !files || files.length === 0) return;
    setUploadError(null);
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      setUploadError('لطفاً فایل‌های تصویری معتبر (JPG, PNG, WEBP) انتخاب کنید.');
      return;
    }

    const uploadInput = fileInputRef.current;
    imageUploadActive.current = true;
    setIsUploadingImage(true);
    setUploadNotice(null);
    let totalOriginal = 0;
    let totalCompressed = 0;
    let successes = 0;
    const failed: File[] = [];
    try {
      // Process one image at a time so a batch cannot multiply decode and canvas memory.
      for (const file of validFiles) {
        if (fileInputRef.current !== uploadInput) return;
        try {
          setActiveFileName(file.name);
          const result = await uploadImageFile(file, 'products');
          if (fileInputRef.current !== uploadInput) return;
          setFormImages((previous) => [...previous, result.url]);
          totalOriginal += result.stats?.originalSizeBytes || 0;
          totalCompressed += result.stats?.compressedSizeBytes || 0;
          successes++;
        } catch {
          if (fileInputRef.current !== uploadInput) return;
          failed.push(file);
        }
      }
      setFailedUploads((previous) => [...previous.filter((file) => !validFiles.includes(file)), ...failed]);
      if (successes > 0) {
        setUploadNotice(`${successes.toLocaleString('fa-IR')} عکس بارگذاری شد${totalCompressed && totalOriginal > totalCompressed ? ` · ${formatBytes(totalCompressed)}` : ''}.`);
      }
    } finally {
      imageUploadActive.current = false;
      setActiveFileName('');
      setIsUploadingImage(false);
      if (uploadInput) uploadInput.value = '';
    }
  };

  const handleRemoveImage = (idxToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleMakePrimaryImage = (idx: number) => {
    setFormImages((prev) => {
      const target = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [target, ...rest];
    });
  };

  const handleAddImageUrl = () => {
    if (!formNewImageUrlInput.trim()) return;
    const urls = formNewImageUrlInput
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.some((url) => {
      try { return !['https:', 'http:'].includes(new URL(url).protocol) && !url.startsWith('/api/blob/view?'); }
      catch { return !url.startsWith('/api/blob/view?'); }
    })) {
      setUploadError('نشانی کامل عکس را با https وارد کنید.');
      return;
    }
    setUploadError(null);
    setFormImages((prev) => [...prev, ...urls]);
    setFormNewImageUrlInput('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageFiles(e.dataTransfer.files);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await verifyAdminCredentialsInDb(usernameInput, passwordInput);
      if (res.success) {
        if (res.token) {
          setAdminToken(res.token);
        }
        localStorage.setItem('vara_admin_session', 'true');
        setIsAdminAuthenticated(true);
        window.dispatchEvent(new Event('vara-products-updated'));
        setAdminLockoutRemaining(0);
      } else {
        if (res.isLocked && res.remainingSeconds) {
          setAdminLockoutRemaining(res.remainingSeconds);
        }
        setAuthError(res.message || 'نام کاربری یا رمز عبور اشتباه است.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError('خطا در برقراری ارتباط با سرور.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    clearAdminToken();
    localStorage.removeItem('vara_admin_session');
    setIsAdminAuthenticated(false);
  };

  const draftProductId = useRef<string | undefined>(undefined);
  const productUsageText = (product: Product) => product.howToUse || [
    product.usageRoutine?.morning && `صبح: ${product.usageRoutine.morning}`,
    product.usageRoutine?.night && `شب: ${product.usageRoutine.night}`,
  ].filter(Boolean).join('\n');

  const openAddModal = () => {
    draftProductId.current = `product-${crypto.randomUUID()}`;
    setUploadError(null);
    setSaveError('');
    setFailedUploads([]);
    setProductFeedback(undefined);
    setUploadNotice(null);
    setEditingProduct(null);
    setFormNameFa('');
    setFormNameEn('');
    setFormBrand('VARA');
    setFormProductType('serum');
    setFormCategory('anti-aging');
    setFormSkinTypes(['dry', 'normal', 'combination']);
    setFormConcerns(['anti-aging', 'hydration']);
    setFormRoutines(['morning', 'night']);
    setFormPrice(0);
    setFormOriginalPrice(0);
    setFormDescriptionFa('');
    setFormImages([]);
    setFormNewImageUrlInput('');
    setFormStockCount(0);
    setFormInStock(true);
    setFormIsBestSeller(false);
    setFormIsNew(true);
    setFormBadges('');
    setFormKeyIngredientsFa('');
    setFormHowToUse('');
    setFormRoutineStep('');
    setFormAuthenticity('');
    setFormSourcingOrigin('');
    setFormExpiryDate('');
    setFormUnsuitableFor('');
    setFormTargetAudience('');
    setFormHasVariants(false);
    setFormVariants([]);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setUploadError(null);
    setSaveError('');
    setFailedUploads([]);
    setProductFeedback(undefined);
    setUploadNotice(null);
    setEditingProduct(product);
    setFormNameFa(product.nameFa || '');
    setFormNameEn(product.nameEn || '');
    setFormBrand(product.brand || 'VARA');
    setFormProductType(product.productType || 'serum');
    setFormCategory(product.category || 'hydration');
    setFormSkinTypes(product.skinTypes ?? []);
    setFormConcerns(product.concerns ?? []);
    setFormRoutines(product.routines ?? []);
    setFormPrice(product.price || 0);
    setFormOriginalPrice(product.originalPrice ?? 0);
    setFormDescriptionFa(product.descriptionFa || '');
    setFormImages(product.images && product.images.length > 0 ? [...product.images] : []);
    setFormNewImageUrlInput('');
    setFormStockCount(product.stockCount !== undefined ? product.stockCount : (product.inStock ? 20 : 0));
    setFormInStock(!!product.inStock);
    setFormIsBestSeller(!!product.isBestSeller);
    setFormIsNew(product.isNew !== undefined ? !!product.isNew : true);
    setFormBadges(product.badges ? product.badges.join(', ') : '');
    setFormKeyIngredientsFa(product.keyIngredients?.map((ingredient) => ingredient.nameFa).join('، ') ?? '');
    setFormRoutineStep(product.routineStep ?? '');
    setFormHowToUse(productUsageText(product));
    setFormAuthenticity(product.authenticity || '');
    setFormSourcingOrigin(product.sourcingOrigin || '');
    setFormExpiryDate(product.expiryDate || '');
    setFormUnsuitableFor(product.unsuitableFor || '');
    setFormTargetAudience(product.targetAudience || '');
    
    // Initialize Variants
    if (product.variants && product.variants.length > 0) {
      setFormHasVariants(true);
      setFormVariants(product.variants.map((v) => ({ ...v })));
    } else {
      setFormHasVariants(false);
      setFormVariants([]);
    }
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUploadActive.current || saveInFlight.current) return;
    setSaveError('');
    if (failedUploads.length) {
      setSaveError('ابتدا عکس‌های ناموفق را دوباره بارگذاری یا حذف کنید.');
      return;
    }
    if (!editingProduct && !formImages.length) {
      setSaveError('پیش از ذخیره، یک عکس برای کاور اضافه کنید.');
      return;
    }

    const badgesArray = formBadges.split(',').map((b) => b.trim()).filter(Boolean);
    const imagesArray = formImages;
    const validStock = Math.max(0, Number(formStockCount) || 0);

    const validVariants = formHasVariants
      ? formVariants
          .filter((v) => v.name && v.name.trim() !== '')
          .map((v) => ({
            ...v,
            colorCode: v.colorCode && v.colorCode.trim() !== '' ? v.colorCode.trim() : undefined
          }))
      : [];
    const hasActiveVariants = validVariants.length > 0;

    if (formHasVariants && validVariants.length === 0) {
      setSaveError('برای محصول دارای تنوع، دست‌کم یک گزینه نام‌دار وارد کنید.');
      return;
    }

    const totalVariantStock = hasActiveVariants
      ? validVariants.reduce((sum, v) => sum + (Number(v.stockCount) || 0), 0)
      : validStock;
    const finalStock = hasActiveVariants ? totalVariantStock : validStock;
    const calculatedInStock = finalStock > 0 && formInStock;

    const finalPrice = hasActiveVariants
      ? Math.min(...validVariants.map((v) => v.price))
      : formPrice;

    const lowestVariant = hasActiveVariants
      ? validVariants.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), validVariants[0])
      : null;
    const finalOriginalPrice = hasActiveVariants
      ? (lowestVariant?.originalPrice || 0)
      : formOriginalPrice;

    const sizeObj: ProductSize = {
      label: 'اندازه استاندارد',
      labelEn: 'Standard Size',
      price: formPrice,
      ...(formOriginalPrice > formPrice ? { originalPrice: formOriginalPrice } : {})
    };

    const finalSizes: ProductSize[] = hasActiveVariants
      ? validVariants.map((v) => ({
          label: v.name,
          labelEn: v.nameEn || '',
          price: v.price,
          ...(v.originalPrice ? { originalPrice: v.originalPrice } : {})
        }))
      : editingProduct?.sizes?.length && !editingProduct.variants?.length
        ? editingProduct.sizes.map((size, index) => index === 0 && (formPrice !== editingProduct.price || formOriginalPrice !== (editingProduct.originalPrice ?? 0))
          ? { ...size, price: sizeObj.price, originalPrice: sizeObj.originalPrice } : size)
        : [sizeObj];

    const rawIngredientNames = formKeyIngredientsFa
      .split(/[\n\r،,;؛|•\t]+|\s+(?=[0-9۰-۹]+[\.\-]\s*)/)
      .map(k => k.replace(/^[0-9۰-۹]+[\.\-\s]+/, '').trim())
      .filter(Boolean);

    const existingIngMap = new Map<string, { nameEn?: string; description?: string }>();
    if (editingProduct?.keyIngredients) {
      for (const prev of editingProduct.keyIngredients) {
        const key = (prev.nameFa || '').trim();
        if (key && !isGenericIngredientDescription(prev.description)) {
          existingIngMap.set(key, { nameEn: prev.nameEn, description: prev.description });
        }
      }
    }

    const baseIngredients = rawIngredientNames.map((k) => {
      const existing = existingIngMap.get(k);
      return {
        nameFa: k,
        nameEn: existing?.nameEn || '',
        description: existing?.description || ''
      };
    });

    const { enriched: localEnriched } = enrichIngredientsLocally(baseIngredients);
    const keyIngredientsArray = localEnriched.map((item) => ({
      nameFa: item.nameFa,
      nameEn: item.nameEn || '',
      description: item.description || 'تغذیه عمیق و تقویت ساختار طبیعی پوست'
    }));


    saveInFlight.current = true;
    setSaving(true);
    try {
      if (editingProduct) {
        // Update
        const updates: Partial<Product> = {
          nameFa: formNameFa,
          nameEn: formNameEn,
          brand: formBrand,
          productType: formProductType,
          category: formCategory,
          skinTypes: formSkinTypes,
          concerns: formConcerns,
          routines: formRoutines,
          price: finalPrice,
          originalPrice: finalOriginalPrice,
          descriptionFa: formDescriptionFa,
          images: imagesArray,
          stockCount: finalStock,
          inStock: calculatedInStock,
          isBestSeller: formIsBestSeller,
          isNew: formIsNew,
          badges: badgesArray,
          sizes: finalSizes,
          variants: hasActiveVariants ? validVariants : [],
          keyIngredients: keyIngredientsArray,
          ...(formHowToUse !== productUsageText(editingProduct) ? {
            usageRoutine: { morning: formHowToUse, night: formHowToUse },
            howToUse: formHowToUse,
          } : {}),
          routineStep: formRoutineStep,
          authenticity: formAuthenticity,
          sourcingOrigin: formSourcingOrigin,
          expiryDate: formExpiryDate,
          unsuitableFor: formUnsuitableFor,
          targetAudience: formTargetAudience
        };
        const changes = Object.fromEntries(
          Object.entries(updates).filter(([key, value]) =>
            JSON.stringify(editingProduct[key as keyof Product]) !== JSON.stringify(value)),
        );
        if (!Object.keys(changes).length) {
          setModalOpen(false);
          setProductFeedback({ text: 'تغییری برای ذخیره وجود ندارد.' });
          return;
        }
        await updateProductInDb(editingProduct.id, changes);
      } else {
        // Add
        const newProd: Omit<Product, 'id'> = {
          nameFa: formNameFa,
          nameEn: formNameEn,
          brand: formBrand,
          productType: formProductType,
          category: formCategory,
          skinTypes: formSkinTypes,
          concerns: formConcerns,
          routines: formRoutines,
          descriptionFa: formDescriptionFa,
          descriptionEn: formNameEn,
          price: finalPrice,
          originalPrice: finalOriginalPrice,
          rating: 0,
          reviewCount: 0,
          images: imagesArray,
          sizes: finalSizes,
          variants: hasActiveVariants ? validVariants : [],
          keyIngredients: keyIngredientsArray,
          usageRoutine: {
            morning: formHowToUse,
            night: formHowToUse
          },
          howToUse: formHowToUse,
          routineStep: formRoutineStep,
          badges: badgesArray,
          isBestSeller: formIsBestSeller,
          isNew: formIsNew,
          stockCount: finalStock,
          inStock: calculatedInStock,
          authenticity: formAuthenticity,
          sourcingOrigin: formSourcingOrigin,
          expiryDate: formExpiryDate,
          unsuitableFor: formUnsuitableFor,
          targetAudience: formTargetAudience
        };
        await addProductToDb(newProd, draftProductId.current);
      }
      setModalOpen(false);
      setProductFeedback({ text: `«${formNameFa}» در کاتالوگ ذخیره شد.` });
    } catch {
      setSaveError('ذخیره محصول انجام نشد. اطلاعات و عکس‌ها حفظ شده‌اند. دوباره تلاش کنید.');
    } finally {
      saveInFlight.current = false;
      setSaving(false);
    }
  };

  const saveStock = async (product: Product, quantity: number) => {
    if (product.variants?.length) {
      openEditModal(product);
      return;
    }
    if (stockWrites.current.has(product.id)) return;
    stockWrites.current.add(product.id);
    setPendingStock([...stockWrites.current]);
    setProductFeedback(undefined);
    try {
      const saved = await updateProductStockInDb(product.id, quantity);
      setProductFeedback({ text: `موجودی «${saved.nameFa}» به ${saved.stockCount.toLocaleString('fa-IR')} عدد تغییر کرد.` });
    } catch {
      setProductFeedback({ text: `موجودی «${product.nameFa}» تغییر نکرد. دوباره تلاش کنید.`, error: true });
    } finally {
      stockWrites.current.delete(product.id);
      setPendingStock([...stockWrites.current]);
    }
  };

  const handleToggleStock = (product: Product) => saveStock(product, product.inStock ? 0 : Math.max(1, product.stockCount || 0));
  const handleUpdateInlineStock = (product: Product, delta: number) => saveStock(product, Math.max(0, (product.stockCount || 0) + delta));

  const handleToggleBestSeller = async (product: Product) => {
    try {
      await updateProductInDb(product.id, { isBestSeller: !product.isBestSeller });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'تغییر محصول انجام نشد.');
    }
  };

  // Custom in-app Confirmation Dialog (works safely in sandboxed iframes)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    isDanger?: boolean;
    onConfirm: () => Promise<void> | void;
  } | null>(null);

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleDelete = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'حذف محصول',
      message: `آیا از حذف محصول «${name}» از فروشگاه اطمینان دارید؟`,
      confirmLabel: 'بله، حذف کن',
      isDanger: true,
      onConfirm: async () => {
        try {
          await deleteProductFromDb(id);
        } catch (err) {
          alert(err instanceof Error ? err.message : 'تغییر محصول انجام نشد.');
        }
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        !searchTerm.trim() ||
        p.nameFa.includes(searchTerm) || 
        p.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      const matchesBrand = selectedBrandFilter === 'all' || p.brand === selectedBrandFilter;

      const currentStock = p.stockCount !== undefined ? p.stockCount : (p.inStock ? 15 : 0);
      let matchesStock = true;
      if (selectedStockFilter === 'inStock') {
        matchesStock = p.inStock && currentStock > 0;
      } else if (selectedStockFilter === 'lowStock') {
        matchesStock = p.inStock && currentStock > 0 && currentStock <= 5;
      } else if (selectedStockFilter === 'outOfStock') {
        matchesStock = !p.inStock || currentStock <= 0;
      }

      return matchesSearch && matchesCat && matchesBrand && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, selectedBrandFilter, selectedStockFilter]);

  const formatPrice = (p?: number | null) => {
    if (p === undefined || p === null || isNaN(Number(p)) || !isFinite(Number(p))) {
      return '۰';
    }
    return Number(p).toLocaleString('fa-IR');
  };

  // IF NOT AUTHENTICATED -> SHOW ADMIN LOGIN FORM
  if (!isAdminAuthenticated) {
    return (
      <div className="vara-admin max-w-md mx-auto px-4 py-8 sm:py-16 text-right">
        <div className="bg-white rounded-xl border border-[var(--vara-line)] p-5 sm:p-8 space-y-5 sm:space-y-6">
          <div className="space-y-3">
            <img src="/vara-logo.svg" alt="ورا بیوتی" width={94} height={32} />
            <h1 className="text-2xl font-extrabold">ورود به مدیریت ورا</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="vara-admin-user" className="block text-sm font-bold mb-1">
                نام کاربری یا ایمیل مدیر
              </label>
              <input
                type="text"
                id="vara-admin-user" autoComplete="username" dir="ltr" value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="نام کاربری"
                className="w-full bg-vara-surface border border-vara-line rounded-full px-3.5 py-2.5 text-xs font-vazir focus:outline-none focus:border-vara-muted"
                required
              />
            </div>

            <div>
              <label htmlFor="vara-admin-password" className="block text-sm font-bold mb-1">
                رمز عبور
              </label>
              <input
                type="password"
                id="vara-admin-password" autoComplete="current-password" dir="ltr" value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-vara-surface border border-vara-line rounded-full px-3.5 py-2.5 text-xs font-vazir focus:outline-none focus:border-vara-muted"
                required
              />
            </div>

            {authError && (
              <div role="alert" className="vara-status" data-tone="error">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || adminLockoutRemaining > 0}
              className="w-full vara-button vara-button-primary"
            >
              {adminLockoutRemaining > 0 ? (
                <>
                  <Clock className="w-4 h-4 text-rose-300 animate-pulse" />
                  <span className="text-rose-200">
                    ورود موقتاً مسدود است ({Math.floor(adminLockoutRemaining / 60)}:{(adminLockoutRemaining % 60).toString().padStart(2, '0')})
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-vara-line" />
                  <span>{authLoading ? 'در حال اعتبارسنجی اطلاعات...' : 'ورود به پنل'}</span>
                </>
              )}
            </button>

          </form>

          <button
            onClick={onBackToShop}
            className="w-full py-2 text-center text-xs font-vazir text-vara-muted hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>
      </div>
    );
  }

  // ADMIN CMS DASHBOARD VIEW
  return (
    <div className="vara-admin vara-container py-4 sm:py-6 space-y-4 text-right">
      
      {/* Top Admin Header Bar */}
      <div className="bg-white border border-[var(--vara-line)] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-vara-muted-strong/90 hover:bg-vara-muted-strong text-white flex items-center justify-center shadow-md shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-vara-line" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-xl font-extrabold font-vazir text-vara-muted-strong truncate">
                مدیریت فروشگاه ورا
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs font-vazir text-vara-muted-strong/70 mt-0.5 line-clamp-1 sm:line-clamp-none">
              کاتالوگ، موجودی و سفارش‌ها
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          {activeTab === 'site' && siteSubTab === 'products' && (
            <button
              onClick={openAddModal}
              className="flex-1 sm:flex-initial bg-vara-rose hover:bg-vara-rose-hover text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-vazir font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>افزودن محصول</span>
            </button>
          )}

          <button
            onClick={onBackToShop}
            className="flex-1 sm:flex-initial bg-vara-surface hover:bg-white text-vara-muted-strong border border-vara-line px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full text-xs font-vazir font-medium transition-all flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
          >
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            <span>فروشگاه</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 sm:flex-initial bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-full text-xs font-vazir font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            title="خروج از پنل"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>خروج</span>
          </button>
        </div>

      </div>

      {/* Main Module Tabs Switcher */}
      <div className="flex items-center gap-1.5 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-2xl shadow-2xs overflow-x-auto no-scrollbar">
        <button
          aria-pressed={activeTab === 'site'} onClick={() => setActiveTab('site')}
          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer flex-1 whitespace-nowrap shrink-0 min-w-[120px] ${
            activeTab === 'site'
              ? 'bg-vara-rose hover:bg-vara-rose-hover text-white shadow-2xs'
              : 'text-vara-muted-strong/70 hover:bg-vara-surface'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          <span>مدیریت سایت</span>
          <span className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full font-vazir ${
            activeTab === 'site' ? 'bg-vara-muted text-white' : 'bg-vara-line text-vara-muted-strong'
          }`}>
            {formatPrice(products.length + brandsList.length + heroSlides.length)}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('orders');
          }}
          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer flex-1 whitespace-nowrap shrink-0 min-w-[100px] ${
            activeTab === 'orders'
              ? 'bg-vara-rose hover:bg-vara-rose-hover text-white shadow-2xs'
              : 'text-vara-muted-strong/70 hover:bg-vara-surface'
          }`}
        >
          <ShoppingBag className="w-4 h-4 shrink-0" />
          <span>سفارش‌ها</span>
          {Boolean(orderStats?.total) && (
            <span className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full font-vazir ${
              activeTab === 'orders' ? 'bg-vara-muted text-white' : 'bg-vara-line text-vara-muted-strong'
            }`}>
              {formatPrice(orderStats?.total ?? 0)}
            </span>
          )}
          {Boolean(orderStats?.pending) && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="سفارش نیازمند بررسی" />
          )}
        </button>

        <button
          aria-pressed={activeTab === 'formula'} onClick={() => setActiveTab('formula')}
          className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer flex-1 whitespace-nowrap shrink-0 min-w-[125px] ${
            activeTab === 'formula'
              ? 'bg-vara-rose hover:bg-vara-rose-hover text-white shadow-2xs'
              : 'text-vara-muted-strong/70 hover:bg-vara-surface'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0 text-vara-muted" />
          <span>نرخ درهم</span>
          <span className={`text-[10px] font-vazir font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${
            activeTab === 'formula' ? 'bg-vara-muted text-white' : 'bg-vara-surface text-vara-rose-ink border border-vara-line'
          }`}>
            {(formulaConfig.aedRate || 25500).toLocaleString('fa-IR')} ت
          </span>
        </button>
      </div>

      {/* Tab Content: Formula Settings View */}
      {activeTab === 'formula' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xs">
          <Suspense fallback={<div className="py-12 text-center text-xs text-vara-muted font-vazir">در حال بارگذاری تنظیمات فرمول...</div>}>
            <FormulaSettingsTab 
              onSwitchToCalculator={onBackToShop}
            />
          </Suspense>
        </div>
      )}

      {/* Tab Content: Orders View */}
      {activeTab === 'orders' && (
        <Suspense fallback={<div className="py-12 text-center text-xs text-vara-muted font-vazir">در حال بارگذاری لیست سفارش‌ها...</div>}>
          <AdminOrdersList stats={orderStats} />
        </Suspense>
      )}

      {/* Tab Content: Site Management View (Contains Products & Brands) */}
      {activeTab === 'site' && (
        <div className="space-y-5 sm:space-y-6">
          {/* Site Management Sub-tabs */}
          <div className="bg-vara-surface p-1.5 rounded-2xl flex flex-row items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar w-full">
            <button
              onClick={() => setSiteSubTab('products')}
              className={`shrink-0 sm:flex-1 whitespace-nowrap py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                siteSubTab === 'products'
                  ? 'bg-white text-vara-muted-strong shadow-xs border border-vara-line'
                  : 'text-vara-muted-strong/70 hover:text-vara-muted-strong hover:bg-white/50'
              }`}
            >
              <Package className="w-4 h-4 text-vara-muted shrink-0" />
              <span>مدیریت محصولات ({formatPrice(products.length)})</span>
            </button>

            <button
              onClick={() => setSiteSubTab('brands')}
              className={`shrink-0 sm:flex-1 whitespace-nowrap py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                siteSubTab === 'brands'
                  ? 'bg-white text-vara-muted-strong shadow-xs border border-vara-line'
                  : 'text-vara-muted-strong/70 hover:text-vara-muted-strong hover:bg-white/50'
              }`}
            >
              <Award className="w-4 h-4 text-vara-muted shrink-0" />
              <span>مدیریت برندها ({formatPrice(brandsList.length)})</span>
            </button>

            <button
              onClick={() => setSiteSubTab('hero_banners')}
              className={`shrink-0 sm:flex-1 whitespace-nowrap py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                siteSubTab === 'hero_banners'
                  ? 'bg-white text-vara-muted-strong shadow-xs border border-vara-line'
                  : 'text-vara-muted-strong/70 hover:text-vara-muted-strong hover:bg-white/50'
              }`}
            >
              <Layers className="w-4 h-4 text-vara-muted shrink-0" />
              <span>اسلایدر بنرها ({formatPrice(heroSlides.length)})</span>
            </button>

            <button
              onClick={() => setSiteSubTab('storage')}
              className={`shrink-0 sm:flex-1 whitespace-nowrap py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs font-bold font-vazir transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                siteSubTab === 'storage'
                  ? 'bg-white text-vara-muted-strong shadow-xs border border-vara-line'
                  : 'text-vara-muted-strong/70 hover:text-vara-muted-strong hover:bg-white/50'
              }`}
            >
              <Server className="w-4 h-4 text-vara-muted shrink-0" />
              <span>پایش فنی و سرویس‌ها</span>
              <span className="inline-flex items-center gap-0.5 text-[9px] bg-amber-50 text-amber-700 font-normal px-1 py-0.5 rounded-full border border-amber-200">
                <Lock className="w-2 h-2 text-amber-600" />
                <span>رمزدار</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="سیستم پایش یکپارچگی‌ها فعال است" />
            </button>
          </div>

          {/* Subtab: Technical Integrations & Services Monitoring */}
          {siteSubTab === 'storage' && (
            <Suspense fallback={<div className="py-12 text-center text-xs text-vara-muted font-vazir">در حال بارگذاری داشبورد پایش فنی...</div>}>
              <AdminIntegrationsDashboard onBackToProducts={() => setSiteSubTab('products')} />
            </Suspense>
          )}

          {/* Subtab: Hero Banners View */}
          {siteSubTab === 'hero_banners' && (
            <Suspense fallback={<div className="py-12 text-center text-xs text-vara-muted font-vazir">در حال بارگذاری مدیریت بنرها...</div>}>
              <AdminHeroBannersManager 
                slides={heroSlides} 
                onSlidesChange={(newSlides) => setHeroSlides(newSlides)} 
              />
            </Suspense>
          )}

          {/* Subtab: Brands View */}
          {siteSubTab === 'brands' && (
            <Suspense fallback={<div className="py-12 text-center text-xs text-vara-muted font-vazir">در حال بارگذاری مدیریت برندها...</div>}>
              <AdminBrandsManager 
                brands={brandsList} 
                products={products}
              />
            </Suspense>
          )}

          {/* Subtab: Products View */}
          {siteSubTab === 'products' && (
            <>

      {/* Analytics / Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xs space-y-0.5 sm:space-y-1">
          <div className="text-[11px] sm:text-xs font-vazir text-vara-muted-strong/70">کل محصولات</div>
          <div className="text-xl sm:text-2xl font-black font-vazir text-vara-muted-strong">{formatPrice(products.length)}</div>
        </div>
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xs space-y-0.5 sm:space-y-1">
          <div className="text-[11px] sm:text-xs font-vazir text-vara-muted-strong/70">محصولات موجود</div>
          <div className="text-xl sm:text-2xl font-black font-vazir text-emerald-700">
            {formatPrice(products.filter((p) => p.inStock && (p.stockCount === undefined || p.stockCount > 0)).length)}
          </div>
        </div>
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xs space-y-0.5 sm:space-y-1">
          <div className="text-[11px] sm:text-xs font-vazir text-vara-muted-strong/70">موجودی محدود (زیر ۵)</div>
          <div className="text-xl sm:text-2xl font-black font-vazir text-amber-700">
            {formatPrice(products.filter((p) => (p.stockCount !== undefined ? p.stockCount : (p.inStock ? 15 : 0)) <= 5 && (p.stockCount !== undefined ? p.stockCount : (p.inStock ? 15 : 0)) > 0).length)}
          </div>
        </div>
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl shadow-xs space-y-0.5 sm:space-y-1">
          <div className="text-[11px] sm:text-xs font-vazir text-vara-muted-strong/70">اتمام موجودی در انبار</div>
          <div className="text-xl sm:text-2xl font-black font-vazir text-rose-700">
            {formatPrice(products.filter((p) => !p.inStock || (p.stockCount !== undefined && p.stockCount <= 0)).length)}
          </div>
        </div>
      </div>

      <CatalogNotice catalog={catalog} />
      {productFeedback && <p className="vara-status" data-tone={productFeedback.error ? 'error' : 'success'} role={productFeedback.error ? 'alert' : 'status'}>{productFeedback.text}</p>}
      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="جستجو در نام محصول، برند یا انگلیسی..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-vara-surface text-xs font-vazir pr-9 pl-3 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-ink"
            />
            <Search className="w-4 h-4 text-vara-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center">
            {/* Brand Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-vara-surface border border-vara-line rounded-xl px-2.5 py-1.5 min-w-0">
              <Award className="w-3.5 h-3.5 text-vara-muted-strong shrink-0" />
              <label className="text-[10px] sm:text-[11px] font-bold text-vara-muted-strong whitespace-nowrap">برند:</label>
              <select
                value={selectedBrandFilter}
                onChange={(e) => setSelectedBrandFilter(e.target.value)}
                className="bg-transparent text-xs font-vazir text-vara-muted-strong focus:outline-none cursor-pointer w-full truncate"
              >
                <option value="all">همه برندها</option>
                {brandsList.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.labelFa} ({brand.labelEn})
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Filter Dropdown */}
            <div className="flex items-center gap-1.5 bg-vara-surface border border-vara-line rounded-xl px-2.5 py-1.5 min-w-0">
              <Box className="w-3.5 h-3.5 text-vara-muted-strong shrink-0" />
              <label className="text-[10px] sm:text-[11px] font-bold text-vara-muted-strong whitespace-nowrap">موجودی:</label>
              <select
                value={selectedStockFilter}
                onChange={(e) => setSelectedStockFilter(e.target.value as any)}
                className="bg-transparent text-xs font-vazir text-vara-muted-strong focus:outline-none cursor-pointer w-full truncate"
              >
                <option value="all">همه</option>
                <option value="inStock">فقط موجود</option>
                <option value="lowStock">رو به اتمام (&le;۵)</option>
                <option value="outOfStock">ناموجود</option>
              </select>
            </div>

            {(selectedCategory !== 'all' || selectedBrandFilter !== 'all' || selectedStockFilter !== 'all' || searchTerm) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrandFilter('all');
                  setSelectedStockFilter('all');
                  setSearchTerm('');
                }}
                className="col-span-2 md:col-span-1 text-[11px] text-rose-600 hover:text-rose-800 font-vazir font-bold px-2 py-1.5 rounded-full hover:bg-rose-50 transition-colors flex items-center justify-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>پاکسازی فیلترها</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full pb-1 pt-1 border-t border-vara-line/60 no-scrollbar">
          {[
            { id: 'all', label: 'همه دسته‌ها' },
            { id: 'cleanser', label: 'پاک‌کننده و شوینده' },
            { id: 'anti-aging', label: 'ضدپیری و جوانساز' },
            { id: 'hydration', label: 'آبرسان و مرطوب‌کننده' },
            { id: 'sensitive-skin', label: 'پوست حساس' },
            { id: 'acne-blemishes', label: 'ضدجوش و لک' },
            { id: 'sunscreen', label: 'ضدآفتاب و محافظت' },
            { id: 'brightening', label: 'روشن‌کننده' },
            { id: 'hair-body', label: 'مراقبت مو و بدن' },
            { id: 'makeup', label: 'لوازم آرایشی' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-vazir whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-vara-rose hover:bg-vara-rose-hover text-white border-vara-ink font-bold shadow-2xs'
                  : 'bg-vara-surface text-vara-muted-strong border-vara-line hover:bg-vara-line'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && catalog.status === 'current' && <p role="status" className="vara-status">
        {products.length ? 'محصولی با این فیلترها پیدا نشد.' : 'هنوز محصولی ثبت نشده است.'}
      </p>}
      {/* Products Table (Desktop View: md and above) */}
      <div className="hidden md:block bg-white rounded-3xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs font-vazir">
            <thead className="bg-vara-surface border-b border-vara-line text-vara-muted-strong font-bold">
              <tr>
                <th className="p-4">تصویر، برند و نام محصول</th>
                <th className="p-4">دسته‌بندی و نوع</th>
                <th className="p-4">قیمت (تومان)</th>
                <th className="p-4">موجودی انبار</th>
                <th className="p-4">وضعیت عرضه</th>
                <th className="p-4">برچسب‌ها</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-vara-line">
              {filteredProducts.map((p) => {
                const currentStock = p.stockCount !== undefined ? p.stockCount : (p.inStock ? 15 : 0);
                const isOutOfStock = currentStock <= 0 || !p.inStock;
                const isLowStock = currentStock > 0 && currentStock <= 5;

                return (
                  <tr key={p.id} className="hover:bg-vara-surface/60 transition-colors">
                    
                    {/* Name & Image & Brand */}
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => onViewProduct && onViewProduct(p)}
                        className="flex items-center gap-3 text-right hover:opacity-90 transition-all group cursor-pointer w-full"
                        title="مشاهده صفحه این محصول در فروشگاه"
                      >
                        <div className="relative shrink-0 overflow-hidden rounded-xl">
                          <ProductImage
                            src={getProductCover(p)}
                            alt={p.nameFa || 'محصول'}
                            className="w-12 h-12 rounded-xl object-cover border border-vara-line group-hover:border-vara-ink group-hover:scale-105 bg-vara-surface transition-all duration-300 shadow-2xs"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white rounded-xl">
                            <Eye className="w-4 h-4 drop-shadow" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1.5">
                            {p.brand && (
                              <span className="text-[10px] font-bold font-jakarta bg-vara-line text-vara-muted-strong px-1.5 py-0.5 rounded-full">
                                {p.brand}
                              </span>
                            )}
                            <span className="font-bold text-vara-muted-strong group-hover:text-vara-muted text-xs transition-colors">
                              {p.nameFa}
                            </span>
                          </div>
                          <div className="text-[10px] text-vara-muted font-jakarta group-hover:underline mt-0.5">{p.nameEn}</div>
                        </div>
                      </button>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="bg-vara-line px-2.5 py-0.5 rounded-full text-[10px] font-bold text-vara-muted-strong w-fit">
                          {p.category === 'cleanser' && 'پاک‌کننده و شوینده'}
                          {p.category === 'anti-aging' && 'ضدپیری و جوانساز'}
                          {p.category === 'hydration' && 'آبرسان و مرطوب‌کننده'}
                          {p.category === 'sensitive-skin' && 'پوست حساس'}
                          {p.category === 'acne-blemishes' && 'ضدجوش و لک'}
                          {p.category === 'sunscreen' && 'ضدآفتاب'}
                          {p.category === 'brightening' && 'روشن‌کننده'}
                          {p.category === 'hair-body' && 'مراقبت مو و بدن'}
                          {p.category === 'makeup' && 'لوازم آرایشی'}
                          {!['cleanser', 'anti-aging', 'hydration', 'sensitive-skin', 'acne-blemishes', 'sunscreen', 'brightening', 'hair-body', 'makeup'].includes(p.category) && p.category}
                        </span>
                        {p.productType && (
                          <span className="text-[10px] text-vara-muted font-vazir">
                            {p.productType === 'cleanser' && 'شوینده'}
                            {p.productType === 'toner' && 'تونر'}
                            {p.productType === 'serum' && 'سرم'}
                            {p.productType === 'moisturizer' && 'مرطوب‌کننده'}
                            {p.productType === 'sunscreen' && 'ضدآفتاب'}
                            {p.productType === 'mask' && 'ماسک صورت'}
                            {p.productType === 'eye-cream' && 'کرم دور چشم'}
                            {p.productType === 'eye-care' && 'مراقبت دور چشم'}
                            {p.productType === 'lip-care' && 'مراقبت لب'}
                            {p.productType === 'hair-body' && 'مراقبت مو و بدن'}
                            {p.productType === 'makeup' && 'لوازم آرایشی'}
                            {p.productType === 'oil' && 'روغن گیاهی'}
                            {p.productType === 'exfoliator' && 'لایه‌بردار'}
                            {p.productType === 'device' && 'ابزار زیبایی'}
                          </span>
                        )}
                        {p.routines && p.routines.length > 0 && (
                          <span className="text-[9px] text-vara-muted-strong bg-vara-surface border border-vara-line px-1.5 py-0.5 rounded-full font-vazir" title={`روتین‌ها: ${p.routines.join('، ')}`}>
                            {formatPrice(p.routines.length)} روتین شاپ
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="font-bold text-vara-muted-strong font-vazir">
                        {p.variants && p.variants.length > 0 ? (
                          <span className="text-xs">
                            از {formatPrice(Math.min(...p.variants.map((v) => Number(v.price) || 0)))}
                          </span>
                        ) : (
                          formatPrice(p.price)
                        )}
                      </div>
                      {p.variants && p.variants.length > 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="bg-vara-muted-strong/90 hover:bg-vara-muted-strong text-white text-[9px] font-vazir px-2 py-0.5 rounded-full font-bold shadow-2xs">
                            {formatPrice(p.variants.length)} تنوع
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Stock Inventory Quantity with Quick Controls */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-vara-surface border border-vara-line rounded-xl overflow-hidden shadow-2xs">
                          <button
                            onClick={() => handleUpdateInlineStock(p, -1)}
                            disabled={catalog.status !== 'current' || pendingStock.includes(p.id) || currentStock <= 0}
                            className="p-1.5 hover:bg-vara-line text-vara-muted-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title={p.variants?.length ? "ویرایش موجودی تنوع‌ها" : "کاهش ۱ عدد از انبار"}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className={`px-2.5 py-1 text-xs font-bold font-vazir text-center min-w-[34px] ${
                            isOutOfStock ? 'text-rose-700 font-extrabold' : isLowStock ? 'text-amber-700' : 'text-vara-muted-strong'
                          }`}>
                            {pendingStock.includes(p.id) ? "…" : formatPrice(currentStock)}
                          </span>

                          <button
                            onClick={() => handleUpdateInlineStock(p, 1)}
                            disabled={catalog.status !== 'current' || pendingStock.includes(p.id)}
                            className="p-1.5 hover:bg-vara-line text-vara-muted-strong transition-colors"
                            title={p.variants?.length ? "ویرایش موجودی تنوع‌ها" : "افزایش ۱ عدد به انبار"}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Stock Badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          isOutOfStock
                            ? 'bg-rose-100 text-rose-800'
                            : isLowStock
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isOutOfStock ? 'اتمام موجودی' : isLowStock ? 'موجودی محدود' : 'موجود'}
                        </span>
                      </div>
                      {p.variants && p.variants.length > 0 && (
                        <div className="text-[9px] text-vara-muted font-vazir mt-1">
                          (مجموع کل تنوع‌ها)
                        </div>
                      )}
                    </td>

                    {/* Stock Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStock(p)}
                        disabled={catalog.status !== 'current' || pendingStock.includes(p.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          p.inStock && currentStock > 0
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {p.inStock && currentStock > 0 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{p.inStock && currentStock > 0 ? 'فعال در فروشگاه' : 'غیرفعال / ناموجود'}</span>
                      </button>
                    </td>

                    {/* BestSeller Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleBestSeller(p)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          p.isBestSeller
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-vara-surface text-vara-muted border border-vara-line'
                        }`}
                      >
                        {p.isBestSeller ? '⭐ پرفروش' : 'عادی'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onViewProduct && onViewProduct(p)}
                          className="p-2 bg-vara-surface hover:bg-vara-line text-vara-muted-strong rounded-full border border-vara-line transition-all cursor-pointer"
                          title="مشاهده صفحه محصول در فروشگاه"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 bg-vara-surface hover:bg-vara-line text-vara-muted-strong rounded-full border border-vara-line transition-all cursor-pointer"
                          title="ویرایش محصول"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.nameFa)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full border border-rose-200 transition-all cursor-pointer"
                          title="حذف محصول"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Products Cards Grid (Optimized for Small Screens) */}
      <div className="block md:hidden space-y-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-xs text-vara-muted">
            محصولی با این مشخصات یافت نشد.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const currentStock = p.stockCount !== undefined ? p.stockCount : (p.inStock ? 15 : 0);
            const isOutOfStock = currentStock <= 0 || !p.inStock;
            const isLowStock = currentStock > 0 && currentStock <= 5;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-3.5 border border-vara-line/60 shadow-2xs space-y-3 hover:border-vara-muted transition-all"
              >
                {/* Top row: Image + Info */}
                <div className="flex items-start gap-3">
                  <div 
                    onClick={() => onViewProduct && onViewProduct(p)}
                    className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-vara-line bg-vara-surface cursor-pointer"
                  >
                    <ProductImage
                      src={getProductCover(p)}
                      alt={p.nameFa || 'محصول'}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {p.brand && (
                        <span className="text-[10px] font-bold font-jakarta bg-vara-surface text-vara-muted-strong px-1.5 py-0.5 rounded-full border border-vara-line/60">
                          {p.brand}
                        </span>
                      )}
                      <span className="text-[10px] text-vara-muted bg-vara-surface/60 px-1.5 py-0.5 rounded-full">
                        {p.category === 'cleanser' ? 'شوینده' : p.category === 'anti-aging' ? 'ضدپیری' : p.category === 'hydration' ? 'آبرسان' : p.category === 'sensitive-skin' ? 'حساس' : p.category === 'acne-blemishes' ? 'ضدجوش' : p.category === 'sunscreen' ? 'ضدآفتاب' : p.category === 'brightening' ? 'روشن‌کننده' : p.category}
                      </span>
                    </div>

                    <h4 
                      onClick={() => onViewProduct && onViewProduct(p)}
                      className="font-bold text-xs text-vara-muted-strong mt-1 line-clamp-1 cursor-pointer hover:text-vara-muted"
                    >
                      {p.nameFa}
                    </h4>
                    <p className="text-[10px] text-vara-muted font-jakarta truncate mt-0.5" dir="ltr">
                      {p.nameEn}
                    </p>
                  </div>
                </div>

                {/* Price & Stock Counter row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-vara-line/40 bg-vara-surface/30 -mx-3.5 px-3.5 py-2">
                  <div>
                    <span className="text-[10px] text-vara-muted block">قیمت واحد:</span>
                    <div className="font-bold text-xs text-vara-muted-strong font-vazir flex items-center gap-1">
                      <span>
                        {p.variants && p.variants.length > 0 
                          ? `از ${formatPrice(Math.min(...p.variants.map((v) => Number(v.price) || 0)))}` 
                          : formatPrice(p.price)}
                      </span>
                      <span className="text-[10px] font-vazir text-vara-muted">تومان</span>
                      {p.variants && p.variants.length > 0 && (
                        <span className="bg-vara-muted-strong/90 text-white text-[9px] font-vazir px-1.5 py-0.2 rounded-full font-bold mr-1">
                          {formatPrice(p.variants.length)} تنوع
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Inline Stock Controls */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center bg-white border border-vara-line rounded-xl overflow-hidden shadow-2xs">
                      <button
                        onClick={() => handleUpdateInlineStock(p, -1)}
                        disabled={catalog.status !== 'current' || pendingStock.includes(p.id) || currentStock <= 0}
                        className="w-7 h-7 flex items-center justify-center hover:bg-vara-surface text-vara-muted-strong disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title={p.variants?.length ? "ویرایش موجودی تنوع‌ها" : "کاهش ۱ عدد از انبار"}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`px-2 text-xs font-bold font-vazir text-center min-w-[28px] ${
                        isOutOfStock ? 'text-rose-700 font-extrabold' : isLowStock ? 'text-amber-700' : 'text-vara-muted-strong'
                      }`}>
                        {pendingStock.includes(p.id) ? "…" : formatPrice(currentStock)}
                      </span>
                      <button
                        onClick={() => handleUpdateInlineStock(p, 1)}
                        disabled={catalog.status !== 'current' || pendingStock.includes(p.id)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-vara-surface text-vara-muted-strong transition-colors"
                        title={p.variants?.length ? "ویرایش موجودی تنوع‌ها" : "افزایش ۱ عدد به انبار"}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      isOutOfStock
                        ? 'bg-rose-100 text-rose-800'
                        : isLowStock
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isOutOfStock ? 'اتمام' : isLowStock ? 'محدود' : 'موجود'}
                    </span>
                  </div>
                </div>

                {/* Quick toggles row */}
                <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                  <button
                    onClick={() => handleToggleStock(p)}
                    disabled={catalog.status !== 'current' || pendingStock.includes(p.id)}
                    className={`flex-1 py-1.5 px-2 rounded-full text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      p.inStock && currentStock > 0
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {p.inStock && currentStock > 0 ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    <span>{p.inStock && currentStock > 0 ? 'فعال در فروشگاه' : 'غیرفعال / ناموجود'}</span>
                  </button>

                  <button
                    onClick={() => handleToggleBestSeller(p)}
                    className={`py-1.5 px-2.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                      p.isBestSeller
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-vara-surface text-vara-muted border border-vara-line'
                    }`}
                  >
                    {p.isBestSeller ? '⭐ پرفروش' : 'عادی'}
                  </button>
                </div>

                {/* Bottom Actions toolbar */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-vara-line/40">
                  <button
                    type="button"
                    onClick={() => onViewProduct && onViewProduct(p)}
                    className="py-2 px-2 bg-vara-surface hover:bg-vara-line text-vara-muted-strong rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-vara-muted" />
                    <span>مشاهده</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(p)}
                    className="py-2 px-2 bg-vara-surface hover:bg-vara-line text-vara-muted-strong rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-vara-muted" />
                    <span>ویرایش</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(p.id, p.nameFa)}
                    className="py-2 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      </>
      )}
        </div>
      )}

      {/* Modal for Add / Edit Product */}
      {modalOpen && (
        <Modal label={editingProduct ? 'ویرایش محصول' : 'افزودن محصول'} onClose={() => { if (!saving && !isUploadingImage) setModalOpen(false); }} className="vara-admin fixed inset-0 z-50 bg-black/55 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-7 shadow-2xl space-y-5 text-right max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-vara-line pb-3 sticky -top-4 sm:-top-7 -mx-4 sm:-mx-7 px-4 sm:px-7 pt-4 sm:pt-7 bg-white/95 backdrop-blur-xs z-20">
              <h2 className="text-base sm:text-lg font-bold font-vazir text-vara-muted-strong">
                {editingProduct ? 'ویرایش اطلاعات محصول' : 'افزودن محصول جدید'}
              </h2>
              <button
                onClick={() => setModalOpen(false)} disabled={saving || isUploadingImage}
                aria-label="بستن ویرایشگر" className="w-8 h-8 flex items-center justify-center hover:bg-vara-surface rounded-full text-vara-muted-strong text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4" aria-busy={saving}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vara-edit-name-fa" className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                    نام فارسی محصول:
                  </label>
                  <input
                    type="text"
                    id="vara-edit-name-fa" value={formNameFa}
                    onChange={(e) => setFormNameFa(e.target.value)}
                    className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                    placeholder="مثال: سرم هیالورونیک اسید ۲٪ و B5"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="vara-edit-name-en" className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                    نام انگلیسی (لاتین):
                  </label>
                  <input
                    type="text"
                    id="vara-edit-name-en" value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                    placeholder="e.g. Hyaluronic Acid 2% + B5"
                    required
                  />
                </div>
              </div>

              {/* Brand & Product Type Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                    برند محصول (از لیست برندهای رسمی):
                  </label>
                  <select
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                  >
                    {brandsList.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.labelFa} ({brand.labelEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                    نوع محصول (Product Type):
                  </label>
                  <select
                    value={formProductType}
                    onChange={(e) => setFormProductType(e.target.value as SkincareProductType)}
                    className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                  >
                    <option value="cleanser">شوینده و پاک‌کننده (Cleanser)</option>
                    <option value="toner">تونر و پد (Toner & Pad)</option>
                    <option value="serum">سرم و آمپول درمانی (Serum & Ampoule)</option>
                    <option value="moisturizer">کرم مرطوب‌کننده و آبرسان (Moisturizer)</option>
                    <option value="sunscreen">ضدآفتاب (Sunscreen)</option>
                    <option value="mask">ماسک ورقه‌ای و خواب (Mask)</option>
                    <option value="eye-cream">کرم دور چشم (Eye Cream)</option>
                    <option value="oil">روغن صورت و گیاهی (Facial Oil)</option>
                    <option value="exfoliator">لایه‌بردار و اسکراب (Exfoliator / Peeling)</option>
                    <option value="lip-care">مراقبت لب (Lip Care)</option>
                    <option value="hair-body">مراقبت مو و بدن (Hair & Body)</option>
                    <option value="makeup">لوازم آرایشی (Makeup)</option>
                    <option value="device">ابزار زیبایی و حالت‌دهنده (Beauty Device)</option>
                  </select>
                </div>
              </div>

              {/* Category, Prices & Stock */}
              <div className={`grid gap-3 ${formHasVariants ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'}`}>
                <div>
                  <label className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                    دسته‌بندی اصلی:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                    className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                  >
                    <option value="cleanser">پاک‌کننده و شوینده (Cleanser)</option>
                    <option value="anti-aging">ضدپیری و جوانساز (Anti-Aging)</option>
                    <option value="hydration">آبرسان و مرطوب‌کننده (Hydration)</option>
                    <option value="sensitive-skin">پوست حساس (Sensitive Skin)</option>
                    <option value="acne-blemishes">ضدجوش و آکنه (Acne & Blemishes)</option>
                    <option value="sunscreen">ضدآفتاب و محافظتی (Sunscreen)</option>
                    <option value="brightening">روشن‌کننده و ضدلک (Brightening)</option>
                    <option value="hair-body">مراقبت مو و بدن (Hair & Body)</option>
                    <option value="makeup">لوازم آرایشی (Makeup)</option>
                  </select>
                </div>

                {!formHasVariants && (
                  <>
                    <div>
                      <label htmlFor="vara-edit-price" className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                        قیمت فروش (تومان):
                      </label>
                      <input
                        type="number"
                        id="vara-edit-price" value={formPrice}
                        onChange={(e) => setFormPrice(Number(e.target.value))}
                        className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                        required={!formHasVariants}
                      />
                    </div>

                    <div>
                      <label htmlFor="vara-edit-compare-price" className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                        قیمت قبل تخفیف (تومان):
                      </label>
                      <input
                        type="number"
                        id="vara-edit-compare-price" value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                        className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                      />
                    </div>

                    <div>
                      <label htmlFor="vara-edit-stock" className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1 flex items-center justify-between">
                        <span>موجودی در انبار:</span>
                        <span className={`text-[10px] ${formStockCount > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {formStockCount > 0 ? `${formStockCount} عدد` : 'ناموجود'}
                        </span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        id="vara-edit-stock" value={formStockCount}
                        onChange={(e) => setFormStockCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink font-bold"
                        placeholder="مثال: ۲۵"
                        required={!formHasVariants}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Product Variants (تنوع محصول) */}
              <div className="bg-vara-surface p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-vara-line">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-vara-muted-strong" />
                    <label className="text-xs font-bold font-vazir text-vara-muted-strong cursor-pointer flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formHasVariants}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormHasVariants(checked);
                          if (checked && formVariants.length === 0) {
                            handleAddVariant('حجم ۳۰ میلی‌لیتر', formPrice, formStockCount || 10, '30 ml');
                          }
                        }}
                        className="rounded border-vara-line text-vara-muted-strong focus:ring-vara-ink"
                      />
                      <span>این محصول دارای تنوع است (مانند حجم‌های مختلف، رنگ/شید، رایحه یا مدل)</span>
                    </label>
                  </div>
                </div>

                {formHasVariants && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-vara-muted font-vazir">
                        برای هر تنوع می‌توانید نام اختصاصی، قیمت، تخفیف، موجودی انبار و کد رنگ مشخص فرمایید:
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddVariant()}
                        className="bg-vara-rose hover:bg-vara-rose-hover text-white text-xs font-vazir font-bold px-3 py-1.5 rounded-full transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>افزودن تنوع جدید</span>
                      </button>
                    </div>

                    {formVariants.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-vara-line rounded-xl bg-white text-xs text-vara-muted font-vazir">
                        هنوز هیچ تنوعی ثبت نشده است. روی «افزودن تنوع جدید» یا قالب‌های آماده بالا کلیک کنید.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {formVariants.map((v, idx) => (
                          <div
                            key={v.id}
                            className="bg-white border border-vara-line p-3 rounded-xl shadow-2xs space-y-2"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-vara-line/60 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-vara-surface text-vara-muted-strong text-[10px] font-bold font-jakarta flex items-center justify-center border border-vara-line">
                                  {idx + 1}
                                </span>
                                <span className="text-xs font-bold font-vazir text-vara-muted-strong">
                                  {v.name || `تنوع شماره ${idx + 1}`}
                                </span>
                                {v.colorCode && v.colorCode.trim() !== '' && (
                                  <span
                                    className="w-4 h-4 rounded-full border border-black/20 shadow-2xs inline-block shrink-0"
                                    style={{ backgroundColor: v.colorCode }}
                                    title={`کد رنگ: ${v.colorCode}`}
                                  />
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveVariant(v.id)}
                                className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                                title="حذف این تنوع"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 pt-1">
                              {/* Variant Name Fa */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold font-vazir text-vara-muted mb-1">
                                  نام تنوع (فارسی): *
                                </label>
                                <input
                                  type="text"
                                  value={v.name}
                                  onChange={(e) => handleUpdateVariant(v.id, 'name', e.target.value)}
                                  placeholder="مثال: ۵۰ میلی‌لیتر یا شید ۰۱ روشن"
                                  className="w-full bg-vara-surface border border-vara-line rounded-full p-2 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                                  required
                                />
                              </div>

                              {/* Price */}
                              <div>
                                <label className="block text-[10px] font-bold font-vazir text-vara-muted mb-1">
                                  قیمت (تومان): *
                                </label>
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => handleUpdateVariant(v.id, 'price', Number(e.target.value))}
                                  className="w-full bg-vara-surface border border-vara-line rounded-full p-2 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                                  required
                                />
                              </div>

                              {/* Original Price */}
                              <div>
                                <label className="block text-[10px] font-bold font-vazir text-vara-muted mb-1">
                                  قیمت قبل تخفیف:
                                </label>
                                <input
                                  type="number"
                                  value={v.originalPrice || ''}
                                  onChange={(e) => handleUpdateVariant(v.id, 'originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                                  placeholder="اختیاری"
                                  className="w-full bg-vara-surface border border-vara-line rounded-full p-2 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                                />
                              </div>

                              {/* Stock */}
                              <div>
                                <label className="block text-[10px] font-bold font-vazir text-vara-muted mb-1">
                                  موجودی انبار: *
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  value={v.stockCount}
                                  onChange={(e) => handleUpdateVariant(v.id, 'stockCount', Math.max(0, parseInt(e.target.value, 10) || 0))}
                                  className="w-full bg-vara-surface border border-vara-line rounded-full p-2 text-xs font-jakarta font-bold focus:outline-none focus:border-vara-ink"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                              {/* English Name / Subtitle */}
                              <div>
                                <label className="block text-[10px] font-bold font-vazir text-vara-muted mb-1">
                                  نام لاتین / زیرعنوان (اختیاری):
                                </label>
                                <input
                                  type="text"
                                  value={v.nameEn || ''}
                                  onChange={(e) => handleUpdateVariant(v.id, 'nameEn', e.target.value)}
                                  placeholder="e.g. 50 ml"
                                  className="w-full bg-vara-surface border border-vara-line rounded-full p-1.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                                />
                              </div>

                              {/* SKU */}
                              <div>
                                <label className="block text-[10px] font-bold font-vazir text-vara-muted mb-1">
                                  کد کالا / SKU (اختیاری):
                                </label>
                                <input
                                  type="text"
                                  value={v.sku || ''}
                                  onChange={(e) => handleUpdateVariant(v.id, 'sku', e.target.value)}
                                  placeholder="e.g. VARA-50ML"
                                  className="w-full bg-vara-surface border border-vara-line rounded-full p-1.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                                />
                              </div>

                              {/* Color Swatch */}
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <label className="text-[10px] font-bold font-vazir text-vara-muted">
                                    کد رنگ هگز (اختیاری):
                                  </label>
                                  {v.colorCode && v.colorCode.trim() !== '' && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateVariant(v.id, 'colorCode', '')}
                                      className="text-[9px] text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                                      title="حذف کد رنگ"
                                    >
                                      پاک کردن رنگ
                                    </button>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={v.colorCode && /^#[0-9A-Fa-f]{6}$/.test(v.colorCode.trim()) ? v.colorCode.trim() : '#E8C5B0'}
                                    onChange={(e) => handleUpdateVariant(v.id, 'colorCode', e.target.value)}
                                    className="w-8 h-8 rounded-full border border-vara-line p-0.5 cursor-pointer bg-white shrink-0"
                                    title="انتخاب رنگ از پالت"
                                  />
                                  <input
                                    type="text"
                                    value={v.colorCode || ''}
                                    onChange={(e) => handleUpdateVariant(v.id, 'colorCode', e.target.value)}
                                    placeholder="بدون رنگ (اختیاری)"
                                    className="flex-1 bg-vara-surface border border-vara-line rounded-full p-1.5 text-xs font-jakarta focus:outline-none focus:border-vara-ink"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Skin Types & Concerns Multi-Selection */}
              <div className="bg-vara-surface p-4 rounded-2xl space-y-3">
                <div>
                  <label className="block text-xs font-bold font-vazir text-vara-muted-strong mb-2">
                    انواع پوست مناسب برای این محصول:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'dry' as SkinType, label: 'پوست خشک' },
                      { id: 'oily' as SkinType, label: 'پوست چرب' },
                      { id: 'combination' as SkinType, label: 'پوست مختلط' },
                      { id: 'sensitive' as SkinType, label: 'پوست حساس' },
                      { id: 'normal' as SkinType, label: 'پوست نرمال' }
                    ].map((st) => {
                      const isSelected = formSkinTypes.includes(st.id);
                      return (
                        <button
                          type="button"
                          key={st.id}
                          onClick={() => {
                            if (isSelected) {
                              setFormSkinTypes(formSkinTypes.filter(x => x !== st.id));
                            } else {
                              setFormSkinTypes([...formSkinTypes, st.id]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-vazir transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-vara-rose hover:bg-vara-rose-hover text-white border-vara-ink font-bold shadow-2xs'
                              : 'bg-white text-vara-muted-strong border-vara-line hover:bg-vara-line'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{st.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 border-t border-vara-line/60">
                  <label className="block text-xs font-bold font-vazir text-vara-muted-strong mb-2">
                    مشکلات و نیازهای پوستی تحت پوشش:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'anti-aging' as SkinConcern, label: 'جوانسازی و ضدچروک' },
                      { id: 'hydration' as SkinConcern, label: 'دهیدراتگی و آبرسانی' },
                      { id: 'acne-blemish' as SkinConcern, label: 'جوش و آکنه' },
                      { id: 'brightening' as SkinConcern, label: 'لک و شفاف‌کننده' },
                      { id: 'barrier-repair' as SkinConcern, label: 'ترمیم سد دفاعی پوست' },
                      { id: 'soothing' as SkinConcern, label: 'التیام‌بخش و قرمزی' },
                      { id: 'sensitive' as SkinConcern, label: 'پوست حساس و واکنشی' }
                    ].map((sc) => {
                      const isSelected = formConcerns.includes(sc.id);
                      return (
                        <button
                          type="button"
                          key={sc.id}
                          onClick={() => {
                            if (isSelected) {
                              setFormConcerns(formConcerns.filter(x => x !== sc.id));
                            } else {
                              setFormConcerns([...formConcerns, sc.id]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-vazir transition-all cursor-pointer border ${
                            isSelected
                              ? 'bg-vara-muted text-white border-vara-muted font-bold shadow-2xs'
                              : 'bg-white text-vara-muted-strong border-vara-line hover:bg-vara-line'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{sc.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ۲ - جایگاه در روتین (دسته‌بندی‌های روتین در فروشگاه به صورت چک‌مارک) */}
                <div className="pt-3 border-t border-vara-line/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold font-vazir text-vara-muted-strong flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-vara-muted-strong" />
                      <span>۲. جایگاه در روتین (دسته‌بندی‌های روتین در فروشگاه):</span>
                    </label>
                    <span className="text-[10px] font-vazir bg-white border border-vara-line px-2 py-0.5 rounded-full text-vara-muted-strong font-bold">
                      {formRoutines.length} روتین با چک‌مارک انتخاب شده
                    </span>
                  </div>

                  <p className="text-[11px] text-vara-muted font-vazir leading-relaxed">
                    با علامت زدن هر چک‌مارک، این محصول در دسته‌بندی و فیلتر مربوطه در بخش «روتین‌ها» در فروشگاه قرار می‌گیرد:
                  </p>

                  <div className="flex flex-col gap-2">
                    {SHOP_ROUTINES.map((rt) => {
                      const isChecked = formRoutines.includes(rt.id);
                      return (
                        <label
                          key={rt.id}
                          className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-white border-vara-ink shadow-xs ring-1 ring-vara-ink/20'
                              : 'bg-white/70 border-vara-line hover:bg-white hover:border-vara-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="shrink-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setFormRoutines(formRoutines.filter((x) => x !== rt.id));
                                  } else {
                                    setFormRoutines([...formRoutines, rt.id]);
                                  }
                                }}
                                className="sr-only"
                              />
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                                  isChecked
                                    ? 'bg-vara-ink border-vara-ink text-white shadow-2xs'
                                    : 'bg-white border-vara-line'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
                              <div className="min-w-0">
                                <span className="text-xs font-bold font-vazir text-vara-muted-strong block">
                                  {rt.labelFa}
                                </span>
                                <span className="text-[11px] text-vara-muted font-vazir block mt-0.5">
                                  {rt.descFa}
                                </span>
                              </div>

                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-vazir font-medium shrink-0 self-start sm:self-center ${
                                  isChecked
                                    ? 'bg-vara-ink text-white'
                                    : 'bg-vara-surface text-vara-muted border border-vara-line/50'
                                }`}
                              >
                                {rt.badge}
                              </span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  {/* ترتیب و گام در مراحل روتین */}
                  <div className="pt-2 border-t border-vara-line/40">
                    <label className="block text-[11px] font-bold font-vazir text-vara-muted-strong mb-1">
                      جایگاه گام در مراحل روتین (ترتیب مصرف بر اساس فرمولاسیون):
                    </label>
                    <select
                      value={formRoutineStep}
                      onChange={(e) => setFormRoutineStep(e.target.value)}
                      className="w-full bg-white border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                    >
                      <option value="گام ۱: پاک‌کننده و شوینده (Cleanser)">گام ۱: پاک‌کننده و شوینده (Cleanser)</option>
                      <option value="گام ۲: تونر و اسنس متعادل‌کننده (Toner / Essence)">گام ۲: تونر و اسنس متعادل‌کننده (Toner / Essence)</option>
                      <option value="گام ۳: سرم و آمپول درمانی تخصصی (Serum / Ampoule)">گام ۳: سرم و آمپول درمانی تخصصی (Serum / Ampoule)</option>
                      <option value="گام ۴: کرم دور چشم (Eye Care)">گام ۴: کرم دور چشم (Eye Care)</option>
                      <option value="گام ۵: مرطوب‌کننده و تقویت‌کننده سد دفاعی (Moisturizer / Cream)">گام ۵: مرطوب‌کننده و تقویت‌کننده سد دفاعی (Moisturizer / Cream)</option>
                      <option value="گام ۶: ضدآفتاب و محافظ روز / بالم یا ماسک خواب شب (Sunscreen / Night Mask)">گام ۶: ضدآفتاب و محافظ روز / بالم یا ماسک خواب شب (Sunscreen / Night Mask)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Direct Multi-Image Upload & Gallery Manager */}
              <div className="space-y-3 bg-vara-surface p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-vara-muted" />
                    <label className="block text-xs font-bold font-vazir text-vara-muted-strong">
                      تصاویر محصول
                    </label>
                    <span className="text-[10px] font-vazir bg-white border border-vara-line px-2 py-0.5 rounded-full text-vara-muted-strong font-bold">
                      {formImages.length} تصویر
                    </span>
                    {blobStatus.configured ? (
                      <span className="text-[10px] font-vazir bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Vercel Blob ابری</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-vazir bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1" title="فضای Blob در داشبورد Vercel آماده اتصال است">
                        <span>فضای بارگذاری در دسترس نیست</span>
                      </span>
                    )}
                  </div>
                  {formImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setFormImages([])}
                      className="text-[11px] text-rose-600 hover:text-rose-800 font-vazir flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>حذف همه عکس‌ها</span>
                    </button>
                  )}
                </div>

                {/* Hidden Native File Input with multiple attribute */}
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  accept="image/png, image/jpeg, image/webp, image/jpg"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageFiles(e.target.files);
                    }
                  }}
                  className="hidden"
                />

                {uploadError && (
                  <div role="alert" className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-vazir flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {failedUploads.length > 0 && (
                  <ul className="space-y-2">
                    {failedUploads.map((file, index) => <li className="vara-status" data-tone="error" key={index}>
                      <span>بارگذاری ناموفق بود. <bdi>{file.name}</bdi></span>
                      <button className="vara-button" type="button" disabled={isUploadingImage} onClick={() => handleImageFiles([file])}>بارگذاری دوباره</button>
                      <button className="vara-button" type="button" disabled={isUploadingImage} onClick={() => setFailedUploads((files) => files.filter((item) => item !== file))}>حذف فایل</button>
                    </li>)}
                  </ul>
                )}
                {/* Image Thumbnails Gallery (if any images present) */}
                {formImages.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formImages.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border bg-white shadow-xs group aspect-square flex flex-col justify-between ${
                            idx === 0 ? 'ring-2 ring-vara-ink border-transparent' : 'border-vara-line'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`عکس ${idx + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />

                          {/* Top Controls Overlay */}
                          <div className="absolute top-1.5 inset-x-1.5 flex items-center justify-between gap-1 z-10">
                            {idx === 0 ? (
                              <span className="bg-vara-ink/90 text-amber-300 text-[10px] font-bold font-vazir px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs shadow-xs">
                                <Star className="w-2.5 h-2.5 fill-amber-300" />
                                <span>کاور اصلی</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleMakePrimaryImage(idx)}
                                className="bg-white/90 hover:bg-white text-vara-muted-strong text-[10px] font-bold font-vazir px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs backdrop-blur-xs transition-all cursor-pointer"
                                title="تبدیل به تصویر شاخص و کاور"
                              >
                                <Star className="w-2.5 h-2.5" />
                                <span>کاور</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="bg-rose-600/90 hover:bg-rose-700 text-white p-1 rounded-full shadow-xs transition-all cursor-pointer"
                              title="حذف این تصویر"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Bottom Order Badge */}
                          <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] font-vazir px-1.5 py-0.5 rounded backdrop-blur-xs">
                            عکس {idx + 1}
                          </div>
                        </div>
                      ))}

                      {/* Quick Add More Card */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-full border-2 border-dashed border-vara-line hover:border-vara-muted bg-white/60 hover:bg-white flex flex-col items-center justify-center p-3 gap-1.5 text-vara-muted-strong/70 hover:text-vara-muted-strong transition-all aspect-square cursor-pointer"
                      >
                        <Plus className="w-5 h-5 text-vara-muted" />
                        <span className="text-[11px] font-bold font-vazir">افزودن عکس</span>
                      </button>
                    </div>

                    <p className="text-[10px] font-vazir text-vara-muted">
                      * اولین عکس به عنوان کاور اصلی کارت محصول نمایش داده می‌شود. با کلیک بر روی دکمه «کاور» می‌توانید هر عکسی را به عنوان کاور اصلی برگزینید.
                    </p>
                  </div>
                )}

                {/* Drag & Drop Upload Zone */}
                <button type="button" disabled={isUploadingImage || saving}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`w-full cursor-pointer border-2 border-dashed rounded-full p-5 text-center transition-all flex flex-col items-center justify-center gap-2 ${
                    isDragging
                      ? 'border-vara-muted bg-vara-muted/10 scale-[0.99]'
                      : 'border-vara-line hover:border-vara-muted bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-vara-surface border border-vara-line shadow-2xs flex items-center justify-center text-vara-muted">
                    {isUploadingImage ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-vara-muted" />
                    ) : (
                      <UploadCloud className="w-5 h-5 text-vara-muted" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold font-vazir text-vara-muted-strong">
                      {isUploadingImage
                        ? 'در حال آماده‌سازی و بارگذاری عکس…'
                        : 'انتخاب عکس از دستگاه'}
                    </div>
                    <div className="text-[11px] font-vazir text-vara-muted-strong/60 mt-0.5">
                      JPEG، PNG یا WebP
                    </div>
                  </div>
                </button>
                {activeFileName && <p className="vara-status" role="status">در حال بارگذاری <bdi>{activeFileName}</bdi></p>}

                {/* Live Compression Notice Banner */}
                {uploadNotice && (
                  <div className="vara-status" data-tone="success" role="status">
                    <span>{uploadNotice}</span>
                  </div>
                )}

                {/* Add by Direct URL Input */}
                <div className="pt-2 border-t border-vara-line/60">
                  <label htmlFor="vara-product-image-url" className="block text-sm font-bold mb-1">
                    افزودن عکس با نشانی اینترنتی
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="vara-product-image-url" value={formNewImageUrlInput}
                      placeholder="https://…"
                      onChange={(e) => setFormNewImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddImageUrl();
                        }
                      }}
                      className="flex-1 bg-white border border-vara-line rounded-full px-3 py-2 text-xs font-vazir focus:outline-none focus:border-vara-muted"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      disabled={!formNewImageUrlInput.trim()}
                      className="px-4 py-2 bg-vara-rose hover:bg-vara-rose-hover disabled:opacity-40 text-white rounded-full text-xs font-vazir font-bold transition-all shrink-0 cursor-pointer"
                    >
                      افزودن عکس
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="block text-xs sm:text-sm font-bold font-vazir text-vara-muted-strong">
                    ترکیبات اصلی و اکتیو (جداشده با ویرگول یا کاما):
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] font-vazir font-bold text-vara-muted-strong bg-vara-surface border border-vara-line px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-vara-muted" />
                    <span>توضیحات علمی هر ترکیب خودکار توسط هوش مصنوعی نوشته می‌شود</span>
                  </span>
                </div>
                <textarea
                  rows={2}
                  value={formKeyIngredientsFa}
                  onChange={(e) => setFormKeyIngredientsFa(e.target.value)}
                  placeholder="مثال: نیاسینامید، عصاره چای سبز، سرامید NP، زینک PCA"
                  className="w-full bg-vara-surface border border-vara-line rounded-xl py-2.5 px-3.5 text-sm font-vazir leading-relaxed focus:outline-none focus:border-vara-ink transition-all resize-y min-h-[68px]"
                />
                <p className="text-[11px] text-vara-muted font-vazir mt-1">
                  فقط نام ترکیبات را وارد کنید؛ نیازی به نوشتن توضیحات نیست و هوش مصنوعی توضیحات تخصصی هر ترکیب را در صفحه محصول می‌نویسد.
                </p>
              </div>

              <div>
                <label htmlFor="vara-edit-description" className="block text-xs sm:text-sm font-bold font-vazir text-vara-muted-strong mb-1.5">
                  توضیحات فارسی محصول:
                </label>
                <textarea
                  id="vara-edit-description" value={formDescriptionFa}
                  onChange={(e) => setFormDescriptionFa(e.target.value)}
                  rows={6}
                  className="w-full bg-vara-surface border border-vara-line rounded-xl p-3.5 text-sm font-vazir focus:outline-none focus:border-vara-ink whitespace-pre-wrap leading-relaxed min-h-[150px] transition-all"
                  placeholder="توضیحات کامل محصول (می‌توانید با زدن اینتر پاراگراف‌های مجزا یا لیست خطی ایجاد کنید)..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-vazir text-vara-muted-strong mb-1">
                  برچسب‌های ویژگی (جداشده با کاما):
                </label>
                <input
                  type="text"
                  value={formBadges}
                  onChange={(e) => setFormBadges(e.target.value)}
                  placeholder="مثال: ۱۰۰٪ گیاهی, بدون تست حیوانی, ضدحساسیت"
                  className="w-full bg-vara-surface border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                />
              </div>

              {/* ۱ - روش استفاده از محصول */}
              <div className="bg-vara-surface p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-vara-line">
                  <div className="flex items-center gap-2 text-xs font-bold text-vara-muted-strong font-vazir">
                    <Sparkles className="w-4 h-4 text-vara-muted" />
                    <span>روش استفاده (دستورالعمل نحوه مصرف محصول):</span>
                  </div>
                  <span className="text-[10px] font-vazir text-vara-muted">
                    نمایش در تب روتین صفحه محصول
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold font-vazir text-vara-muted-strong mb-1.5">
                    دستورالعمل کلی نحوه مصرف:
                  </label>
                  <textarea
                    value={formHowToUse}
                    onChange={(e) => setFormHowToUse(e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-vara-line rounded-xl p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink whitespace-pre-wrap leading-relaxed"
                    placeholder="نحوه مصرف صحیح: مثلاً ۳ تا ۴ قطره از محصول را پس از شوینده و تونر، روی پوست تمیز صورت و گردن به آرامی ماساژ دهید تا به طور کامل جذب گردد..."
                  />
                </div>
              </div>

              {/* Product Details & Authenticity Specifications Section */}
              <div className="bg-vara-surface p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-vara-muted-strong font-vazir pb-1 border-b border-vara-line">
                  <ShieldCheck className="w-4 h-4 text-vara-muted" />
                  <span>مشخصات تکمیلی، اصالت کالا، سازگاری و موارد منع مصرف:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold font-vazir text-vara-muted-strong mb-1">
                      🛡️ اصالت کالا:
                    </label>
                    <input
                      type="text"
                      value={formAuthenticity}
                      onChange={(e) => setFormAuthenticity(e.target.value)}
                      placeholder="مثال: ضمانت اصالت ۱۰۰٪ اورجینال با تأییدیه رسمی"
                      className="w-full bg-white border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold font-vazir text-vara-muted-strong mb-1">
                      🌱 منبع تأمین و کشور مبدأ:
                    </label>
                    <input
                      type="text"
                      value={formSourcingOrigin}
                      onChange={(e) => setFormSourcingOrigin(e.target.value)}
                      placeholder="مثال: کره جنوبی / فرانسه / مزارع ارگانیک"
                      className="w-full bg-white border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold font-vazir text-vara-muted-strong mb-1">
                      ⏳ تاریخ انقضا و ماندگاری:
                    </label>
                    <input
                      type="text"
                      value={formExpiryDate}
                      onChange={(e) => setFormExpiryDate(e.target.value)}
                      placeholder="مثال: ۲۴ ماه پس از تولید (۱۲ ماه پس از باز شدن)"
                      className="w-full bg-white border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold font-vazir text-vara-muted-strong mb-1">
                      🎯 مناسب برای (نوع پوست و نیاز):
                    </label>
                    <input
                      type="text"
                      value={formTargetAudience}
                      onChange={(e) => setFormTargetAudience(e.target.value)}
                      placeholder="مثال: پوست‌های کدر، دهیدراته، دارای خطوط ریز و سنین بالای ۲۰ سال"
                      className="w-full bg-white border border-vara-line rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-vara-ink"
                    />
                  </div>
                </div>

                {/* Unsuitable For Contraindications Field */}
                <div className="bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200">
                  <label className="block text-[11px] font-bold font-vazir text-rose-900 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>⚠️ نامناسب برای (منع مصرف پوستی و هشدارها):</span>
                  </label>
                  <input
                    type="text"
                    value={formUnsuitableFor}
                    onChange={(e) => setFormUnsuitableFor(e.target.value)}
                    placeholder="مثال: نامناسب برای پوست‌های مستعد آکنه قارچی، اگزما فعال، یا بانوان باردار"
                    className="w-full bg-white border border-rose-200 rounded-full p-2.5 text-xs font-vazir focus:outline-none focus:border-rose-500 text-rose-950 placeholder:text-rose-400"
                  />
                  <p className="text-[10px] text-rose-700/80 font-vazir mt-1">
                    چون بعضی از محصولات برای بعضی پوست‌ها مناسب نیستند، این هشدار با رنگ قرمز در صفحه محصول و پیش‌نمایش قرار می‌گیرد.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold font-vazir text-vara-muted-strong">
                  <input
                    type="checkbox"
                    checked={formInStock}
                    onChange={(e) => setFormInStock(e.target.checked)}
                    className="w-4 h-4 rounded accent-vara-ink"
                  />
                  <span>موجود در انبار</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold font-vazir text-vara-muted-strong">
                  <input
                    type="checkbox"
                    checked={formIsBestSeller}
                    onChange={(e) => setFormIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded accent-vara-ink"
                  />
                  <span>⭐ برچسب پرفروش‌ترین</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold font-vazir text-vara-muted-strong">
                  <input
                    type="checkbox"
                    checked={formIsNew}
                    onChange={(e) => setFormIsNew(e.target.checked)}
                    className="w-4 h-4 rounded accent-vara-ink"
                  />
                  <span>✨ برچسب محصول جدید</span>
                </label>
              </div>

              <div className="sticky -bottom-4 sm:-bottom-7 -mx-4 sm:-mx-7 px-4 sm:px-7 py-3 sm:py-4 bg-white/95 backdrop-blur-xs border-t border-vara-line flex flex-wrap items-center justify-end gap-2.5 z-20 shadow-lg mt-4">
                {saveError && <p className="vara-status w-full" data-tone="error" role="alert">{saveError}</p>}
                <button
                  type="button"
                  onClick={() => setModalOpen(false)} disabled={saving || isUploadingImage}
                  className="px-4 sm:px-5 py-2.5 rounded-full border border-vara-line text-xs font-vazir font-bold text-vara-muted-strong hover:bg-vara-surface transition-all cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploadingImage}
                  className="vara-button vara-button-primary"
                >
                  {saving ? (
                    <span>در حال ذخیره...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ذخیره‌سازی محصول</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </Modal>
      )}


      {/* Sandboxed Safe Confirmation Modal */}
      {confirmModal && confirmModal.isOpen && (
        <Modal label="تأیید تغییر کاتالوگ" onClose={() => { if (!confirmLoading) setConfirmModal(null); }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-right space-y-5">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                confirmModal.isDanger ? 'bg-rose-100 text-rose-600' : 'bg-vara-line text-vara-muted-strong'
              }`}>
                {confirmModal.isDanger ? (
                  <Trash2 className="w-5 h-5" />
                ) : (
                  <RefreshCw className="w-5 h-5 text-vara-muted-strong" />
                )}
              </div>
              <div>
                <h3 className="text-base font-extrabold font-vazir text-vara-muted-strong">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-vara-muted font-vazir mt-0.5">
                  تأیید اقدام در پنل مدیریت
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm font-vazir text-vara-muted-strong leading-relaxed bg-vara-surface p-4 rounded-2xl">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                disabled={confirmLoading}
                className="px-4 py-2.5 rounded-full border border-vara-line text-xs font-vazir font-bold text-vara-muted-strong hover:bg-vara-surface transition-all cursor-pointer"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={confirmLoading}
                onClick={async () => {
                  try {
                    setConfirmLoading(true);
                    await confirmModal.onConfirm();
                  } finally {
                    setConfirmLoading(false);
                    setConfirmModal(null);
                  }
                }}
                className={`px-5 py-2.5 rounded-full text-xs font-vazir font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer ${
                  confirmModal.isDanger
                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                    : 'bg-vara-rose hover:bg-vara-rose-hover text-white'
                }`}
              >
                {confirmLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال انجام...</span>
                  </>
                ) : (
                  <span>{confirmModal.confirmLabel}</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
