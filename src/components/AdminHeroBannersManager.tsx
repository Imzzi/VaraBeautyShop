import React, { useState } from 'react';
import { 
  CarouselSlide 
} from '../types';
import { 
  saveLocalHeroSlides, 
  DEFAULT_HERO_SLIDES 
} from '../data/heroSlides';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  RotateCcw, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Eye, 
  ArrowLeft, 
  Check, 
  MoveUp, 
  MoveDown,
  UploadCloud,
  RefreshCw
} from 'lucide-react';
import { uploadImageFile } from '../lib/blobUpload';

interface AdminHeroBannersManagerProps {
  slides: CarouselSlide[];
  onSlidesChange: (newSlides: CarouselSlide[]) => void;
}

const PRESET_GRADIENTS = [
  { label: 'صورتی ملایم (شیگلم)', value: 'from-[#FFF0F5] via-[#FDF5F8] to-[#FFFFFF]' },
  { label: 'بژ و کرم لوکس (ورا)', value: 'from-[#F9F5F0] via-[#FAF6F2] to-[#FFFFFF]' },
  { label: 'آبی مینیمال (اوردینری)', value: 'from-[#F2F5F8] via-[#F7FAFC] to-[#FFFFFF]' },
  { label: 'سبز گیاهی و نعنایی', value: 'from-[#F0FDF4] via-[#F6FBF7] to-[#FFFFFF]' },
  { label: 'بنفش اسطوخودوس', value: 'from-[#FAF5FF] via-[#FCF9FF] to-[#FFFFFF]' },
  { label: 'طلایی و کهربایی', value: 'from-[#FFFBEB] via-[#FEFCE8] to-[#FFFFFF]' },
];

const PRESET_TITLE_COLORS = [
  { label: 'زرشکی شیگلم', value: 'text-[#8A1A3C]' },
  { label: 'مشکی طبیعی لوکس', value: 'text-[#454a4f]' },
  { label: 'طلایی متالیک', value: 'text-[#B8860B]' },
  { label: 'آبی تیره اقیانوسی', value: 'text-[#1E3A8A]' },
  { label: 'سبز جنگلی طبیعی', value: 'text-[#14532D]' },
  { label: 'سرخابی پررنگ', value: 'text-[#9D174D]' },
];

export const AdminHeroBannersManager: React.FC<AdminHeroBannersManagerProps> = ({
  slides,
  onSlidesChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isNewSlide, setIsNewSlide] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewSlide, setPreviewSlide] = useState<CarouselSlide | null>(slides[0] || null);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const bannerFileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    try {
      const res = await uploadImageFile(file, 'banners');
      setEditingSlide((prev) => (prev ? { ...prev, imageSrc: res.url } : prev));
      if (res.stats && res.stats.savedPercentage > 5) {
        showFeedback(`بنر با موفقیت فشرده و بارگذاری شد (${res.stats.savedPercentageFormatted} صرفه‌جویی، حجم ${res.stats.compressedSizeFormatted}).`);
      } else {
        showFeedback('تصویر بنر با موفقیت ذخیره شد.');
      }
    } catch (err: any) {
      console.error('Banner upload error:', err);
    } finally {
      setIsUploadingBanner(false);
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = '';
    }
  };

  const showFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // Open modal or form to add new slide
  const handleAddNewSlide = () => {
    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      eyebrow: 'N E W   C O L L E C T I O N',
      titlePart1: 'عنوان جدید اسلاید',
      titlePart2: 'پیشنهاد ویژه ورا',
      titleColorClass: 'text-[#8A1A3C]',
      subtitle: 'توضیحات جذاب و معرفی ویژگی‌های اصلی محصول یا کالکشن جدید برای ترغیب مشتریان',
      ctaText: 'مشاهده و خرید آنلاین',
      bgGradient: 'from-[#FFF0F5] via-[#FDF5F8] to-[#FFFFFF]',
      imageSrc: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop',
      imageAlt: 'تصویر اسلاید بنر جدید',
      bubbleColor: 'border-pink-200/60 bg-pink-100/30',
      actionType: 'explore',
      linkUrl: ''
    };
    setEditingSlide(newSlide);
    setIsNewSlide(true);
    setEditingIndex(slides.length);
  };

  // Start editing existing slide
  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingSlide({ ...slides[index] });
    setIsNewSlide(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingSlide(null);
    setIsNewSlide(false);
  };

  // Save current slide
  const handleSaveSlide = () => {
    if (!editingSlide) return;

    if (!editingSlide.titlePart1.trim() || !editingSlide.imageSrc.trim()) {
      alert('لطفاً عنوان و آدرس تصویر بنر را تکمیل نمایید.');
      return;
    }

    let updatedSlides: CarouselSlide[];
    if (isNewSlide) {
      updatedSlides = [...slides, editingSlide];
      showFeedback('اسلاید بنر جدید با موفقیت اضافه شد.');
    } else if (editingIndex !== null) {
      updatedSlides = [...slides];
      updatedSlides[editingIndex] = editingSlide;
      showFeedback('تغییرات اسلاید با موفقیت ذخیره شد.');
    } else {
      return;
    }

    onSlidesChange(updatedSlides);
    saveLocalHeroSlides(updatedSlides);
    setEditingIndex(null);
    setEditingSlide(null);
    setIsNewSlide(false);
    if (updatedSlides.length > 0) {
      setPreviewSlide(updatedSlides[0]);
    }
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      alert('حداقل یک اسلاید بنر باید در صفحه اصلی وجود داشته باشد.');
      return;
    }

    const confirmDelete = window.confirm(`آیا از حذف اسلاید "${slides[index].titlePart1} ${slides[index].titlePart2}" اطمینان دارید؟`);
    if (!confirmDelete) return;

    const updatedSlides = slides.filter((_, i) => i !== index);
    onSlidesChange(updatedSlides);
    saveLocalHeroSlides(updatedSlides);
    showFeedback('اسلاید مورد نظر حذف شد.');
    
    if (editingIndex === index) {
      handleCancelEdit();
    }
    setPreviewSlide(updatedSlides[0] || null);
  };

  // Move slide up or down
  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === slides.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    onSlidesChange(updated);
    saveLocalHeroSlides(updated);
    showFeedback('ترتیب اسلایدها با موفقیت تغییر کرد.');
  };

  // Reset to initial default slides
  const handleResetToDefault = () => {
    const confirmReset = window.confirm('آیا می‌خواهید تمام اسلایدها را به حالت پیش‌فرض اولیه بازگردانید؟ تمام تغییرات سفارشی جایگزین خواهد شد.');
    if (!confirmReset) return;

    onSlidesChange(DEFAULT_HERO_SLIDES);
    saveLocalHeroSlides(DEFAULT_HERO_SLIDES);
    setPreviewSlide(DEFAULT_HERO_SLIDES[0]);
    handleCancelEdit();
    showFeedback('اسلایدهای بنر هیرو به وضعیت پیش‌فرض بازگردانی شدند.');
  };

  return (
    <div className="space-y-6 text-right font-vazir" dir="rtl">
      
      {/* Top Header & Actions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-[#454a4f]">مدیریت اسلایدر بنرهای هیرو</h3>
            <span className="bg-[#FAF6F2] text-[#8A1A3C] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#b8b8b9]">
              {slides.length} اسلاید فعال
            </span>
          </div>
          <p className="text-xs text-[#788089] mt-1.5 leading-relaxed">
            امکان ویرایش تصویر تمام‌صفحه، عناوین فارسی و انگلیسی، توضیحات، متن و لینک دکمه، و همچنین کم و زیاد کردن و جابجایی تعداد اسلایدها.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleAddNewSlide}
            className="px-4 py-2.5 rounded-xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#949c91]" />
            <span>افزودن اسلاید جدید</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2.5 rounded-xl bg-[#eff2f4] hover:bg-[#b8b8b9] text-[#788089] hover:text-[#454a4f] text-xs font-semibold transition-all border border-[#b8b8b9] flex items-center gap-1.5 cursor-pointer"
            title="بازنشانی به بنرهای اولیه سایت"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>بازنشانی پیش‌فرض</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Active Slides List Cards */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-[#788089] uppercase tracking-wider px-1">
          فهرست اسلایدهای فعال (به ترتیب نمایش در سایت)
        </h4>

        <div className="grid grid-cols-1 gap-3.5">
          {slides.map((slide, idx) => {
            const isBeingEdited = editingIndex === idx && !isNewSlide;

            return (
              <div 
                key={slide.id}
                className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
                  isBeingEdited 
                    ? 'border-[#949c91] ring-2 ring-[#949c91]/20 shadow-md' 
                    : 'border-[#b8b8b9] hover:border-[#949c91]/50 shadow-2xs'
                }`}
              >
                {/* Right: Slide Thumbnail & Order Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 min-w-0">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center justify-center gap-0.5 text-[#788089]">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSlide(idx, 'up')}
                        className="p-1 rounded hover:bg-[#eff2f4] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                        title="انتقال به بالا"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold font-jakarta text-[#454a4f]">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === slides.length - 1}
                        onClick={() => handleMoveSlide(idx, 'down')}
                        className="p-1 rounded hover:bg-[#eff2f4] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
                        title="انتقال به پایین"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Thumbnail Image */}
                    <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border border-[#b8b8b9] shrink-0 bg-[#eff2f4]">
                      <img 
                        src={slide.imageSrc} 
                        alt={slide.imageAlt || slide.titlePart1}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-[#788089] font-bold tracking-wider font-jakarta">
                        {slide.eyebrow}
                      </span>
                      <span className="text-[10px] bg-[#FAF6F2] text-[#8A1A3C] px-2 py-0.5 rounded font-semibold">
                        {slide.actionType === 'ai_advisor' ? 'هوش مصنوعی AI' : slide.actionType === 'explore' ? 'فروشگاه' : slide.actionType === 'quiz' ? 'کوئیز پوست' : slide.actionType === 'flash' ? 'تخفیف ویژه' : 'لینک سفارشی'}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-[#454a4f] flex items-center gap-1.5 flex-wrap">
                      <span>{slide.titlePart1}</span>
                      <span className={slide.titleColorClass || 'text-[#8A1A3C]'}>
                        {slide.titlePart2}
                      </span>
                    </h4>

                    <p className="text-xs text-[#788089] line-clamp-1">
                      {slide.subtitle}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#454a4f]/80 flex-wrap">
                      <span className="font-semibold text-[#949c91]">دکمه: {slide.ctaText}</span>
                      {slide.actionType === 'custom_url' && slide.linkUrl && (
                        <span className="text-[#788089] truncate max-w-xs font-mono text-[10px]" dir="ltr">
                          {slide.linkUrl}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left: Action Controls */}
                <div className="flex items-center gap-2 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#b8b8b9]/60 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setPreviewSlide(slide)}
                    className="p-2 sm:px-3 rounded-xl bg-[#eff2f4] hover:bg-[#b8b8b9] text-[#454a4f] text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    title="پیش‌نمایش این اسلاید"
                  >
                    <Eye className="w-4 h-4 text-[#788089]" />
                    <span className="hidden sm:inline">پیش‌نمایش</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(idx)}
                    className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#949c91]" />
                    <span>ویرایش اسلاید</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(idx)}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-600 border border-transparent hover:border-red-200 transition-all cursor-pointer"
                    title="حذف اسلاید"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit or Add Slide Form Modal / Section */}
      {editingSlide && (
        <div className="bg-white p-5 sm:p-7 rounded-2xl border-2 border-[#949c91] shadow-lg space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#b8b8b9]">
            <h4 className="text-base font-bold text-[#454a4f]">
              {isNewSlide ? 'افزودن اسلاید بنر جدید' : `ویرایش اسلاید شماره ${editingIndex !== null ? editingIndex + 1 : ''}`}
            </h4>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-xs text-[#788089] hover:text-[#454a4f] p-1 cursor-pointer"
            >
              انصراف
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            
            {/* Field: Image URL */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#949c91]" />
                  <span>آدرس تصویر بنر (URL مستقیم یا عکس از Unsplash / CDN)</span>
                </span>
                <span className="text-[11px] text-[#788089]">کیفیت پیشنهادی: 1200x600 پیکسل</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={editingSlide.imageSrc}
                  onChange={(e) => setEditingSlide({ ...editingSlide, imageSrc: e.target.value })}
                  placeholder="https://... یا آپلود از کامپیوتر"
                  className="flex-1 bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs text-left ltr font-mono outline-none"
                  dir="ltr"
                />
                <input
                  type="file"
                  ref={bannerFileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleBannerFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingBanner}
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#2B2927] text-white hover:bg-[#1a1918] transition-all text-xs font-vazir font-bold flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  {isUploadingBanner ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>در حال آپلود...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>آپلود تصویر در Blob</span>
                    </>
                  )}
                </button>
              </div>
              {/* Quick image preview */}
              {editingSlide.imageSrc && (
                <div className="mt-2 relative h-32 rounded-xl overflow-hidden border border-[#b8b8b9] bg-[#eff2f4]">
                  <img 
                    src={editingSlide.imageSrc} 
                    alt="پیش‌نمایش" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-[#dde2e7] text-[10px] px-2 py-0.5 rounded font-bold">
                    پیش‌نمایش تصویر
                  </div>
                </div>
              )}
            </div>

            {/* Field: Eyebrow (Latin Tag) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f]">
                متن انگلیسی بالای عنوان (Eyebrow Tag)
              </label>
              <input
                type="text"
                value={editingSlide.eyebrow}
                onChange={(e) => setEditingSlide({ ...editingSlide, eyebrow: e.target.value })}
                placeholder="S H E G L A M   H A I R"
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none uppercase font-mono ltr"
                dir="ltr"
              />
            </div>

            {/* Field: Alt tag */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f]">
                متن جایگزین تصویر (Alt Text جهت سئو)
              </label>
              <input
                type="text"
                value={editingSlide.imageAlt}
                onChange={(e) => setEditingSlide({ ...editingSlide, imageAlt: e.target.value })}
                placeholder="دستگاه جدید شیگلم"
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
            </div>

            {/* Field: Title Part 1 (Regular) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f]">
                بخش اول عنوان (فونت استاندارد)
              </label>
              <input
                type="text"
                value={editingSlide.titlePart1}
                onChange={(e) => setEditingSlide({ ...editingSlide, titlePart1: e.target.value })}
                placeholder="جدیدترین دستگاه"
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none"
              />
            </div>

            {/* Field: Title Part 2 (Bold / Colored / Lalezar) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f]">
                بخش دوم عنوان (برجسته و لاله زار)
              </label>
              <input
                type="text"
                value={editingSlide.titlePart2}
                onChange={(e) => setEditingSlide({ ...editingSlide, titlePart2: e.target.value })}
                placeholder="شیگلم رسید"
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none font-bold"
              />
            </div>

            {/* Field: Title Color Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f] block">
                <span>رنگ بخش دوم عنوان</span>
              </label>
              <select
                value={editingSlide.titleColorClass || 'text-[#8A1A3C]'}
                onChange={(e) => setEditingSlide({ ...editingSlide, titleColorClass: e.target.value })}
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none cursor-pointer"
              >
                {PRESET_TITLE_COLORS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Field: CTA Button Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f]">
                متن روی دکمه (CTA Button)
              </label>
              <input
                type="text"
                value={editingSlide.ctaText}
                onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                placeholder="مشاهده و خرید دستگاه"
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none font-semibold"
              />
            </div>

            {/* Field: Action Type / Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f] flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#949c91]" />
                <span>عملکرد و لینک دکمه اسلاید</span>
              </label>
              <select
                value={editingSlide.actionType}
                onChange={(e) => setEditingSlide({ ...editingSlide, actionType: e.target.value as any })}
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none cursor-pointer"
              >
                <option value="explore">انتقال به بخش فروشگاه و کاتالوگ محصولات</option>
                <option value="ai_advisor">مشاور و آنالیزور هوش مصنوعی (AI Beauty Advisor)</option>
                <option value="quiz">طراحی روتین پوست (Skincare Routine Builder)</option>
                <option value="flash">بخش تخفیف‌های ویژه روز</option>
                <option value="custom_url">لینک اختصاصی و سفارشی (URL اینترنتی یا مسیر داخلی)</option>
              </select>
            </div>

            {/* Field: Custom URL if selected */}
            {editingSlide.actionType === 'custom_url' && (
              <div className="space-y-1.5 animate-in fade-in">
                <label className="text-xs font-bold text-[#8A1A3C]">
                  آدرس اینترنتی یا مسیر لینک سفارشی
                </label>
                <input
                  type="text"
                  value={editingSlide.linkUrl || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, linkUrl: e.target.value })}
                  placeholder="https://... یا /#shop"
                  className="w-full bg-[#FAF6F2] border border-[#949c91] focus:border-[#2B2927] rounded-xl px-3.5 py-2.5 text-xs outline-none ltr text-left"
                  dir="ltr"
                />
              </div>
            )}

            {/* Field: Subtitle Description */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-[#454a4f]">
                متن توضیحات اسلاید (زیرنویس)
              </label>
              <textarea
                rows={2}
                value={editingSlide.subtitle}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                placeholder="برس حرارتی و حالت‌دهنده هوشمند، بدون آسیب به ساقه مو با ماندگاری ۲۴ ساعته"
                className="w-full bg-[#FAF6F2] border border-[#b8b8b9] focus:border-[#2B2927] rounded-xl p-3 text-xs outline-none resize-none leading-relaxed"
              />
            </div>

          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#b8b8b9]">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#788089] hover:bg-[#eff2f4] cursor-pointer"
            >
              انصراف
            </button>

            <button
              type="button"
              onClick={handleSaveSlide}
              className="px-6 py-2.5 rounded-xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#949c91]" />
              <span>ذخیره اسلاید بنر</span>
            </button>
          </div>
        </div>
      )}

      {/* Live Preview Box */}
      {previewSlide && (
        <div className="bg-white p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#454a4f] flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#949c91]" />
              <span>پیش‌نمایش زنده در نمای صفحه اصلی:</span>
            </h4>
            <span className="text-[11px] text-[#788089]">
              این اسلاید در حال حاضر در هیرو نمایش داده خواهد شد
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden h-[280px] sm:h-[320px] flex items-center p-6 sm:p-8">
            {/* Background stretched image */}
            <img 
              src={previewSlide.imageSrc} 
              alt={previewSlide.imageAlt}
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
              referrerPolicy="no-referrer"
            />
            {/* Soft gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-white/15 pointer-events-none z-1" />

            {/* Slide Content */}
            <div className="relative z-10 max-w-[65%] space-y-2.5">
              <div className="text-[10px] font-bold text-[#788089] tracking-widest uppercase font-mono">
                {previewSlide.eyebrow} ✦
              </div>

              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-black text-[#454a4f]">
                  {previewSlide.titlePart1}
                </h2>
                <div className={`text-2xl sm:text-3xl font-black font-lalezar ${previewSlide.titleColorClass || 'text-[#8A1A3C]'}`}>
                  {previewSlide.titlePart2}
                </div>
              </div>

              <p className="text-xs text-[#3E3A36] line-clamp-2 leading-relaxed">
                {previewSlide.subtitle}
              </p>

              <div className="pt-1">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#454a4f]/90 hover:bg-[#454a4f] text-[#dde2e7] text-xs font-bold shadow-xs">
                  <span>{previewSlide.ctaText}</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#949c91]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
