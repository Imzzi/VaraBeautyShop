import { Modal } from './Modal';
import React, { useState, useMemo } from 'react';
import { 
  Award, Plus, Trash2, Search, AlertCircle, CheckCircle2, 
  RefreshCw, RotateCcw, Package, X
} from 'lucide-react';
import { BrandItem } from '../data/brands';
import { Product } from '../types';
import { 
  addBrandToDb, 
  deleteBrandFromDb, 
  resetBrandsToDefaultDb 
} from '../lib/brandsManager';

interface AdminBrandsManagerProps {
  brands: BrandItem[];
  products: Product[];
  onBrandCreated?: (newBrand: BrandItem) => void;
  onBrandDeleted?: (deletedBrandId: string) => void;
}

export const AdminBrandsManager: React.FC<AdminBrandsManagerProps> = ({
  brands,
  products,
  onBrandCreated,
  onBrandDeleted
}) => {
  // New Brand Form States
  const [newLabelEn, setNewLabelEn] = useState('');
  const [newLabelFa, setNewLabelFa] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'hasProducts' | 'noProducts'>('all');

  // Delete Confirmation Modal state
  const [brandToDelete, setBrandToDelete] = useState<BrandItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Reset to default confirmation state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Map products count per brand for fast lookup
  const brandProductsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      if (p.brand) {
        const brandKey = p.brand.trim();
        map[brandKey] = (map[brandKey] || 0) + 1;
      }
    });
    return map;
  }, [products]);

  // Filtered brands list
  const filteredBrands = useMemo(() => {
    return brands.filter(b => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch = !q || 
        b.labelFa.toLowerCase().includes(q) || 
        b.labelEn.toLowerCase().includes(q) || 
        b.id.toLowerCase().includes(q);

      const count = brandProductsCountMap[b.id] || brandProductsCountMap[b.labelEn] || 0;
      let matchesFilter = true;
      if (filterMode === 'hasProducts') {
        matchesFilter = count > 0;
      } else if (filterMode === 'noProducts') {
        matchesFilter = count === 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [brands, searchTerm, filterMode, brandProductsCountMap]);

  // Auto-generate ID when English name changes (if user hasn't typed a custom ID)
  const handleLabelEnChange = (val: string) => {
    setNewLabelEn(val);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleLabelFaChange = (val: string) => {
    setNewLabelFa(val);
    setFormError(null);
    setFormSuccess(null);
  };

  // Submit new brand
  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const trimmedEn = newLabelEn.trim();
    const trimmedFa = newLabelFa.trim();
    const generatedId = trimmedEn;

    if (!trimmedEn) {
      setFormError('لطفاً نام انگلیسی برند را وارد کنید.');
      return;
    }
    if (!trimmedFa) {
      setFormError('لطفاً نام فارسی برند را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addBrandToDb({
        id: generatedId,
        labelEn: trimmedEn,
        labelFa: trimmedFa
      });

      if (result.success) {
        setFormSuccess(`برند «${trimmedFa} (${trimmedEn})» با موفقیت ثبت و به سیستم اضافه شد.`);
        setNewLabelEn('');
        setNewLabelFa('');
        if (onBrandCreated) {
          onBrandCreated({ id: generatedId, labelEn: trimmedEn, labelFa: trimmedFa });
        }
      } else {
        setFormError(result.error || 'خطایی در ثبت برند رخ داد.');
      }
    } catch (err) {
      setFormError('خطا در برقراری ارتباط با پایگاه‌داده.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirm delete brand
  const handleConfirmDelete = async () => {
    if (!brandToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteBrandFromDb(brandToDelete.id);
      if (result.success) {
        if (onBrandDeleted) {
          onBrandDeleted(brandToDelete.id);
        }
        setBrandToDelete(null);
      } else {
        setDeleteError(result.error || 'خطایی در حذف برند رخ داد.');
      }
    } catch (err) {
      setDeleteError('خطا در حذف برند از پایگاه‌داده.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Reset to default
  const handleResetToDefault = async () => {
    setIsResetting(true);
    try {
      await resetBrandsToDefaultDb();
      setIsResetConfirmOpen(false);
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsResetting(false);
    }
  };

  const totalBrandsCount = brands.length;
  const brandsWithProductsCount = Object.keys(brandProductsCountMap).length;

  return (
    <div className="space-y-4 sm:space-y-6 font-vazir animate-fadeIn text-right">
      {/* Overview Analytics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vara-muted-strong/70">تعداد کل برندها</span>
            <div className="w-8 h-8 rounded-xl bg-vara-surface flex items-center justify-center text-vara-muted-strong">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-vara-muted-strong font-vazir">{totalBrandsCount.toLocaleString('fa-IR')}</div>
          <div className="text-[10px] sm:text-[11px] text-vara-muted font-medium">پوشش کامل برندهای معتبر کره‌ای و بین‌المللی</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vara-muted-strong/70">برندهای دارای محصول</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-vazir">{brandsWithProductsCount.toLocaleString('fa-IR')}</div>
          <div className="text-[10px] sm:text-[11px] text-vara-muted-strong/70 font-medium">دارای حداقل ۱ محصول فعال در فروشگاه</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs space-y-1 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-vara-muted-strong/70">عملیات پایگاه‌داده برندها</span>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full py-2 px-3 bg-vara-surface hover:bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی به لیست پیش‌فرض</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: Create New Brand Form */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between border-b border-vara-line pb-3.5 sm:pb-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-vara-muted-strong/90 hover:bg-vara-muted-strong text-white flex items-center justify-center shadow-xs shrink-0">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-vara-line" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-vara-muted-strong">افزودن و ثبت برند جدید</h2>
              <p className="text-[11px] sm:text-xs text-vara-muted-strong/70 mt-0.5">
                پس از ایجاد، برند جدید فوراً در فیلترهای فروشگاه و در فرم ثبت محصول در دسترس خواهد بود.
              </p>
            </div>
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-vazir rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        {formSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-vazir rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{formSuccess}</span>
          </div>
        )}

        <form onSubmit={handleCreateBrand} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-vara-muted-strong mb-1.5">
              نام انگلیسی برند (Brand Name - EN) <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              dir="ltr"
              value={newLabelEn}
              onChange={(e) => handleLabelEnChange(e.target.value)}
              placeholder="مثال: Skin1004 یا Haruharu Wonder"
              className="w-full bg-vara-surface border border-vara-line rounded-full px-3.5 py-2.5 text-xs text-left font-sans focus:outline-none focus:border-vara-ink"
              required
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-vara-muted-strong mb-1.5">
              نام فارسی برند (Brand Name - FA) <span className="text-rose-500">*</span>:
            </label>
            <input
              type="text"
              value={newLabelFa}
              onChange={(e) => handleLabelFaChange(e.target.value)}
              placeholder="مثال: اسکین ۱۰۰۴ یا هاروهارو واندر"
              className="w-full bg-vara-surface border border-vara-line rounded-full px-3.5 py-2.5 text-xs focus:outline-none focus:border-vara-ink"
              required
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-vara-rose hover:bg-vara-rose-hover disabled:bg-gray-400 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-vara-line" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-vara-line" />
                  <span>ثبت برند جدید</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Brands Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="جستجو در نام فارسی یا انگلیسی برندها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-vara-surface text-xs pr-9 pl-3 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-ink"
            />
            <Search className="w-4 h-4 text-vara-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            <div className="flex items-center gap-1 bg-vara-surface border border-vara-line p-1 rounded-xl text-xs shrink-0">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 sm:px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterMode === 'all' 
                    ? 'bg-vara-rose hover:bg-vara-rose-hover text-white font-bold'
                    : 'text-vara-muted-strong/70 hover:bg-white'
                }`}
              >
                همه ({brands.length.toLocaleString('fa-IR')})
              </button>
              <button
                onClick={() => setFilterMode('hasProducts')}
                className={`px-2.5 sm:px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterMode === 'hasProducts' 
                    ? 'bg-vara-rose hover:bg-vara-rose-hover text-white font-bold'
                    : 'text-vara-muted-strong/70 hover:bg-white'
                }`}
              >
                دارای محصول ({brandsWithProductsCount.toLocaleString('fa-IR')})
              </button>
              <button
                onClick={() => setFilterMode('noProducts')}
                className={`px-2.5 sm:px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filterMode === 'noProducts' 
                    ? 'bg-vara-rose hover:bg-vara-rose-hover text-white font-bold'
                    : 'text-vara-muted-strong/70 hover:bg-white'
                }`}
              >
                بدون محصول ({(brands.length - brandsWithProductsCount).toLocaleString('fa-IR')})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid Listing */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-vara-muted-strong/80">
          <span>لیست برندهای ثبت شده ({filteredBrands.length.toLocaleString('fa-IR')} مورد یافت شد)</span>
          {filteredBrands.length < brands.length && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterMode('all');
              }}
              className="text-vara-muted hover:underline cursor-pointer"
            >
              نمایش همه برندها
            </button>
          )}
        </div>

        {filteredBrands.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-vara-surface flex items-center justify-center mx-auto text-vara-muted">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-vara-muted-strong">هیچ برندی با این مشخصات یافت نشد.</p>
            <p className="text-xs text-vara-muted-strong/70">می‌توانید با استفاده از فرم بالا این برند را اضافه کنید.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredBrands.map((brand) => {
              const productCount = brandProductsCountMap[brand.id] || brandProductsCountMap[brand.labelEn] || 0;
              return (
                <div
                  key={brand.id}
                  className="bg-vara-surface hover:bg-white border border-vara-line hover:border-vara-line p-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between group shadow-2xs"
                >
                  <div className="space-y-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-vara-muted-strong truncate">
                        {brand.labelFa}
                      </span>
                      {productCount > 0 && (
                        <span 
                          title={`${productCount.toLocaleString('fa-IR')} محصول در فروشگاه`}
                          className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-vazir shrink-0"
                        >
                          {productCount.toLocaleString('fa-IR')} محصول
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-vara-muted font-sans truncate" dir="ltr">
                      {brand.labelEn}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setBrandToDelete(brand)}
                      className="w-8 h-8 rounded-full bg-white group-hover:bg-rose-50 text-vara-muted hover:text-rose-700 hover:border-rose-200 border border-vara-line flex items-center justify-center transition-colors cursor-pointer"
                      title="حذف این برند"
                      aria-label={`حذف برند ${brand.labelFa}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {brandToDelete && (
        <Modal label="حذف برند" onClose={() => { if (!isDeleting) setBrandToDelete(null); }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-vara-muted-strong">
                آیا از حذف این برند اطمینان دارید؟
              </h3>
              <p className="text-xs text-vara-muted-strong/80">
                برند انتخابی: <strong className="text-vara-muted-strong">{brandToDelete.labelFa} ({brandToDelete.labelEn})</strong>
              </p>
              
              {(brandProductsCountMap[brandToDelete.id] || brandProductsCountMap[brandToDelete.labelEn] || 0) > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>توجه: این برند دارای {brandProductsCountMap[brandToDelete.id] || brandProductsCountMap[brandToDelete.labelEn]} محصول فعال است!</span>
                  </div>
                  <p className="text-[11px] text-amber-800/90">
                    با حذف این برند، محصولات مرتبط با آن در دیتابیس باقی می‌مانند اما برند در لیست فیلترهای جدید و فرم‌ها نمایش داده نخواهد شد.
                  </p>
                </div>
              )}
            </div>

            {deleteError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setBrandToDelete(null);
                  setDeleteError(null);
                }}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-vara-surface hover:bg-vara-line text-vara-muted-strong rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال حذف...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>بله، حذف شود</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reset to Default Confirmation Modal */}
      {isResetConfirmOpen && (
        <Modal label="بازنشانی برندها" onClose={() => { if (!isResetting) setIsResetConfirmOpen(false); }} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-right">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-extrabold text-vara-muted-strong">
                بازنشانی لیست برندها به حالت پیش‌فرض
              </h3>
              <p className="text-xs text-vara-muted-strong/80">
                آیا مایلید تمام برندهای سامانه به کاتالوگ استاندارد اولیه بازگردانی شوند؟
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                disabled={isResetting}
                className="flex-1 py-2.5 px-4 bg-vara-surface hover:bg-vara-line text-vara-muted-strong rounded-full text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                disabled={isResetting}
                className="flex-1 py-2.5 px-4 bg-vara-rose hover:bg-vara-rose-hover text-white rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>در حال بازنشانی...</span>
                  </>
                ) : (
                  <span>تایید و بازنشانی</span>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
