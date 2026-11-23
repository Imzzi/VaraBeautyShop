import { Modal } from './Modal';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Heart, 
  ChevronDown,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { UserProfile } from '../types';
import { VaraLogo } from './VaraLogo';
import { BRANDS_DATA, BrandItem } from '../data/brands';
import { subscribeToBrands, getLocalBrands } from '../lib/brandsManager';

interface HeaderProps {
  cartItemCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onOpenWishlist?: () => void;
  onOpenQuiz: () => void;
  onOpenAuth: () => void;
  onOpenGiftCard?: () => void;
  user: UserProfile | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenQuiz,
  onOpenAuth,
  onOpenGiftCard,
  user,
  searchQuery,
  setSearchQuery,
  activeSection,
  setActiveSection,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [brandsList, setBrandsList] = useState<BrandItem[]>(() => getLocalBrands());
  const headerRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unsub = subscribeToBrands((updated) => {
      if (updated && updated.length > 0) {
        setBrandsList(updated);
      }
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Debounced dropdown hover handlers to prevent accidental closing on fast or diagonal mouse movements
  const handleDropdownMouseEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleDropdownMouseLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 220); // 220ms grace period so cursor can travel smoothly across the navigation
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        if (dropdownTimeoutRef.current) {
          clearTimeout(dropdownTimeoutRef.current);
        }
        setActiveDropdown(null);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (dropdownTimeoutRef.current) {
          clearTimeout(dropdownTimeoutRef.current);
        }
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 960px)');
    const closeAtDesktop = () => { if (desktop.matches) setMobileMenuOpen(false); };
    desktop.addEventListener('change', closeAtDesktop);
    return () => desktop.removeEventListener('change', closeAtDesktop);
  }, []);

  const handleNavClick = (sectionId: string, filterTerm?: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (sectionId === 'quiz') {
      onOpenQuiz();
    } else if (sectionId === 'ai-advisor') {
      window.dispatchEvent(new CustomEvent('vara-open-ai-advisor'));
    } else if (sectionId === 'gift-card') {
      if (onOpenGiftCard) {
        onOpenGiftCard();
      } else {
        window.dispatchEvent(new CustomEvent('vara-open-gift-card'));
      }
    } else if (sectionId === 'profile') {
      setActiveSection('profile');
    } else if (sectionId === 'home') {
      setActiveSection('home');
    } else {
      if (filterTerm) {
        setSearchQuery(filterTerm);
      }
      setActiveSection('shop');
    }
  };

  const toggleDropdown = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(prev => (prev === name ? null : name));
  };

  return (
    <header ref={headerRef} className="vara-header sticky top-0 z-50 w-full bg-[#FDFBF9]/95 backdrop-blur-md border-b border-[#F0E1E4] transition-all">
      {/* Row 1: Top Brand Bar with Actions */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="p-2 -mr-1 rounded-xl text-[#23191E] hover:bg-[#F9F1F0] active:bg-[#8C3B58]/10 transition-all min-[960px]:hidden cursor-pointer flex items-center justify-center border border-transparent hover:border-[#F0E1E4]"
            aria-label={mobileMenuOpen ? 'بستن منو' : 'باز کردن منوی دسته‌بندی‌ها'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => handleNavClick('home')}
            className="group flex items-center focus:outline-none cursor-pointer hover:opacity-85 transition-opacity"
            title="صفحه اصلی ورا بیوتی شاپ - VARA BEAUTY"
          >
            <VaraLogo 
              size="md"
              subtitleFa="ورا بیوتی شاپ"
            />
          </button>
        </div>

        {/* Center Search Bar with Blush Tinted Input */}
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl mx-2 sm:mx-4 md:mx-6">
          <div className="vara-search relative w-full flex items-center bg-[#F9F1F0] rounded-xl border border-[#F0E1E4] hover:border-[#D48C9E] focus-within:border-[#8C3B58] focus-within:bg-white transition-all p-1">
            <input
              type="search" aria-label="جستجو در فروشگاه" dir="auto"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setActiveSection('shop');
                }
              }}
              placeholder="جستجوی محصول یا برند"
              className="w-full bg-transparent text-[#23191E] text-xs sm:text-sm placeholder:text-[#785E67] font-vazir pr-3 pl-2 py-1.5 focus:outline-none text-right"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#785E67] hover:text-[#8C3B58] cursor-pointer ml-1"
                title="پاک کردن متن جستجو"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveSection('shop')}
              className="w-8 h-8 rounded-lg bg-[#8C3B58] hover:bg-[#732E47] text-white flex items-center justify-center shrink-0 transition-all active:scale-95 cursor-pointer ml-0.5 shadow-shop-pill"
              title="جستجو در فروشگاه"
              aria-label="جستجو"
            >
              <Search className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

        {/* Right Tools (Wishlist, Account, Cart) */}
        <div className="flex items-center gap-1.5 sm:gap-2 font-vazir text-xs shrink-0 text-[#785E67]">
          
          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="hidden min-[960px]:flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9F1F0] border border-[#F0E1E4] text-[#23191E] hover:border-[#D48C9E] hover:bg-[#F4E4E8] transition-all cursor-pointer relative"
            title="لیست علاقه‌مندی‌ها"
            aria-label="لیست علاقه‌مندی‌ها"
          >
            <div className="relative">
              <Heart className="w-4 h-4 text-[#8C3B58]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2.5 text-[9px] bg-[#8C3B58] text-white font-bold px-1 rounded-full font-jakarta min-w-[15px] h-[15px] flex items-center justify-center">
                  {wishlistCount.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </button>

          {/* Account Button */}
          <button
            onClick={onOpenAuth}
            className={`hidden min-[960px]:flex items-center justify-center w-10 h-10 rounded-xl bg-[#F9F1F0] border border-[#F0E1E4] text-[#23191E] hover:border-[#D48C9E] hover:bg-[#F4E4E8] transition-all cursor-pointer relative ${
              activeSection === 'profile' ? 'border-[#8C3B58] bg-[#F4E4E8]' : ''
            }`}
            title="حساب کاربری و پروفایل"
            aria-label="حساب کاربری"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'حساب کاربری'}
                className="w-7 h-7 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-4 h-4 text-[#8C3B58]" />
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="hidden min-[960px]:flex items-center justify-center w-10 h-10 rounded-xl bg-[#8C3B58] text-white hover:bg-[#732E47] shadow-shop-violet transition-all cursor-pointer relative"
            title="سبد خرید"
            aria-label="سبد خرید"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-white text-[#8C3B58] border border-[#8C3B58] text-[9px] font-bold font-jakarta min-w-[15px] h-[15px] rounded-full flex items-center justify-center px-1">
                  {cartItemCount.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </button>

        </div>
      </div>

      {/* Row 2: Boutique Category Navigation Bar (Desktop & Tablet) */}
      <div className="hidden min-[960px]:block border-t border-[#F0E1E4] bg-[#FDFBF9] text-right relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start gap-1.5 font-vazir text-xs sm:text-[13px] font-medium text-[#5E434D] py-2 relative">
            
            {/* ۱. فروشگاه — بر اساس نوع محصول (Mega Menu) */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('shop')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button
                onClick={() => handleNavClick('shop')}
                className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'shop' || activeSection === 'shop'
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#23191E] hover:bg-[#F9F1F0] hover:text-[#8C3B58]'
                }`}
              >
                <span className="font-semibold">فروشگاه</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'shop' || activeSection === 'shop' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {/* Mega Menu Overlay */}
              {activeDropdown === 'shop' && (
                <div 
                  className="absolute top-full right-0 pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('shop')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-[860px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-shop-elevated border border-[#F0E1E4] p-6 grid grid-cols-6 gap-5 text-right">
                    
                    {/* مراقبت از پوست */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[13px] text-[#8C3B58] pb-1.5 border-b border-[#F0E1E4]">مراقبت از پوست</h4>
                      <ul className="space-y-0.5 text-[12.5px] text-[#5E434D]">
                        <li><button onClick={() => handleNavClick('shop', 'پاک کننده')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">شوینده و پاک‌کننده صورت</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'تونر')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">تونر و اسنس</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'سرم')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">سرم و محصولات تخصصی</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'مرطوب کننده')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">مرطوب‌کننده و آبرسان</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'دور چشم')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">مراقبت از دور چشم</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'ماسک')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">ماسک و لایه‌بردار</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'ضد آفتاب')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">ضدآفتاب کلینیکال</button></li>
                      </ul>
                    </div>

                    {/* مراقبت از بدن */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[13px] text-[#8C3B58] pb-1.5 border-b border-[#F0E1E4]">مراقبت از بدن</h4>
                      <ul className="space-y-0.5 text-[12.5px] text-[#5E434D]">
                        <li><button onClick={() => handleNavClick('shop', 'شوینده بدن')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">شوینده و ژل بدن</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'لوسیون')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">لوسیون و کره بدن</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'اسکراب بدن')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">اسکراب بدن</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'دست و پا')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">مراقبت دست و پا</button></li>
                      </ul>
                    </div>

                    {/* مراقبت از لب */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[13px] text-[#8C3B58] pb-1.5 border-b border-[#F0E1E4]">مراقبت از لب</h4>
                      <ul className="space-y-0.5 text-[12.5px] text-[#5E434D]">
                        <li><button onClick={() => handleNavClick('shop', 'بالم لب')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">بالم لب</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'اسکراب لب')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">اسکراب لب</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'ماسک لب')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">ماسک لب</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'روغن لب')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">روغن لب</button></li>
                      </ul>
                    </div>

                    {/* مراقبت از مو */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[13px] text-[#8C3B58] pb-1.5 border-b border-[#F0E1E4]">مراقبت از مو</h4>
                      <ul className="space-y-0.5 text-[12.5px] text-[#5E434D]">
                        <li><button onClick={() => handleNavClick('shop', 'شامپو')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">شامپو</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'نرم کننده')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">نرم‌کننده</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'ماسک مو')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">ماسک مو</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'سرم مو')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">سرم و روغن مو</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'درمان مو')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">محصولات مراقبت و درمان</button></li>
                      </ul>
                    </div>

                    {/* آرایشی */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-[13px] text-[#8C3B58] pb-1.5 border-b border-[#F0E1E4]">آرایشی</h4>
                      <ul className="space-y-0.5 text-[12.5px] text-[#5E434D]">
                        <li><button onClick={() => handleNavClick('shop', 'آرایش صورت')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">آرایش صورت</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'آرایش چشم')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">آرایش چشم</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'آرایش لب')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">آرایش لب</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'ابرو')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">محصولات ابرو</button></li>
                        <li><button onClick={() => handleNavClick('shop', 'ابزار آرایشی')} className="w-full text-right px-2 py-1.5 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer">ابزار آرایشی</button></li>
                      </ul>
                    </div>

                    {/* دستگاه‌های زیبایی */}
                    <div className="bg-[#F9F1F0] p-4 rounded-xl border border-[#F0E1E4] flex flex-col justify-between">
                      <div>
                        <h4 className="font-semibold text-[13px] text-[#23191E] mb-1">ابزارهای زیبایی</h4>
                        <p className="text-[11.5px] text-[#785E67] mb-3.5 leading-relaxed">تجهیزات مراقبت خانگی و ماساژورهای تخصصی</p>
                        <button 
                          onClick={() => handleNavClick('shop', 'دستگاه زیبایی')}
                          className="w-full text-center py-2 px-3 bg-[#8C3B58] hover:bg-[#732E47] text-white text-xs rounded-lg font-medium cursor-pointer transition-all mt-1 shadow-shop-pill"
                        >
                          مشاهده کالکشن
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* ۲. بر اساس مشکل پوست */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('concern')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                onClick={() => toggleDropdown('concern')}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'concern' 
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#5E434D] hover:text-[#8C3B58] hover:bg-[#F9F1F0]'
                }`}
              >
                <span>مشکل پوست</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'concern' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {activeDropdown === 'concern' && (
                <div 
                  className="absolute top-full right-0 pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('concern')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-60 bg-white rounded-xl shadow-shop-elevated border border-[#F0E1E4] p-2.5 text-right">
                    <div className="space-y-0.5">
                      <button onClick={() => handleNavClick('shop', 'چروک')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">چروک و خطوط ریز</button>
                      <button onClick={() => handleNavClick('shop', 'لک')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">لک و تیرگی</button>
                      <button onClick={() => handleNavClick('shop', 'خشکی')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">خشکی و کم‌آبی</button>
                      <button onClick={() => handleNavClick('shop', 'جوش')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">جوش و جای جوش</button>
                      <button onClick={() => handleNavClick('shop', 'حساسیت')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">حساسیت و قرمزی</button>
                      <button onClick={() => handleNavClick('shop', 'کدری')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">کدری و افزایش شفافیت</button>
                      <button onClick={() => handleNavClick('shop', 'منافذ')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">منافذ و کنترل چربی</button>
                      <button onClick={() => handleNavClick('shop', 'سرسیاه')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">کمدون سرسیاه و زیرپوستی</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ۳. بر اساس نوع پوست */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('skintype')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                onClick={() => toggleDropdown('skintype')}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'skintype' 
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#5E434D] hover:text-[#8C3B58] hover:bg-[#F9F1F0]'
                }`}
              >
                <span>نوع پوست</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'skintype' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {activeDropdown === 'skintype' && (
                <div 
                  className="absolute top-full right-0 pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('skintype')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-56 bg-white rounded-xl shadow-shop-elevated border border-[#F0E1E4] p-2.5 text-right">
                    <div className="space-y-0.5">
                      <button onClick={() => handleNavClick('shop', 'پوست خشک')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">پوست خشک</button>
                      <button onClick={() => handleNavClick('shop', 'پوست چرب')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">پوست چرب</button>
                      <button onClick={() => handleNavClick('shop', 'پوست مختلط')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">پوست مختلط</button>
                      <button onClick={() => handleNavClick('shop', 'پوست نرمال')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">پوست نرمال</button>
                      <button onClick={() => handleNavClick('shop', 'پوست حساس')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">پوست حساس</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ۴. بر اساس ترکیبات */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('ingredients')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                onClick={() => toggleDropdown('ingredients')}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'ingredients' 
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#5E434D] hover:text-[#8C3B58] hover:bg-[#F9F1F0]'
                }`}
              >
                <span>ترکیبات فعال</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'ingredients' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {activeDropdown === 'ingredients' && (
                <div 
                  className="absolute top-full right-0 pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('ingredients')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-60 bg-white rounded-xl shadow-shop-elevated border border-[#F0E1E4] p-2.5 text-right">
                    <div className="space-y-0.5 max-h-[360px] overflow-y-auto no-scrollbar">
                      <button onClick={() => handleNavClick('shop', 'رتینول')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">رتینول (Retinol)</button>
                      <button onClick={() => handleNavClick('shop', 'ویتامین C')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">ویتامین C</button>
                      <button onClick={() => handleNavClick('shop', 'نیاسینامید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">نیاسینامید (Niacinamide)</button>
                      <button onClick={() => handleNavClick('shop', 'هیالورونیک اسید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">هیالورونیک اسید</button>
                      <button onClick={() => handleNavClick('shop', 'پپتید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">پپتیدها (Peptides)</button>
                      <button onClick={() => handleNavClick('shop', 'سرامید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">سرامیدها (Ceramides)</button>
                      <button onClick={() => handleNavClick('shop', 'AHA')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">AHA و BHA</button>
                      <button onClick={() => handleNavClick('shop', 'سالیسیلیک اسید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">سالیسیلیک اسید</button>
                      <button onClick={() => handleNavClick('shop', 'آزلائیک اسید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">آزلائیک اسید</button>
                      <button onClick={() => handleNavClick('shop', 'ترانگزامیک اسید')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">ترانگزامیک اسید</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ۵. روتین‌ها */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('routines')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                onClick={() => toggleDropdown('routines')}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'routines' 
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#5E434D] hover:text-[#8C3B58] hover:bg-[#F9F1F0]'
                }`}
              >
                <span>روتین‌های تخصصی</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'routines' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {activeDropdown === 'routines' && (
                <div 
                  className="absolute top-full right-0 pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('routines')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-64 bg-white rounded-xl shadow-shop-elevated border border-[#F0E1E4] p-2.5 text-right">
                    <div className="space-y-0.5">
                      <button onClick={() => handleNavClick('shop', 'آبرسانی')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین آبرسانی</button>
                      <button onClick={() => handleNavClick('shop', 'روشن کننده')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین روشن‌کننده</button>
                      <button onClick={() => handleNavClick('shop', 'ضدپیری')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین ضدپیری و جوانسازی</button>
                      <button onClick={() => handleNavClick('shop', 'ضدجوش')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین ضدجوش و پاکسازی</button>
                      <button onClick={() => handleNavClick('shop', 'ترمیم')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین ترمیم سد دفاعی پوست</button>
                      <button onClick={() => handleNavClick('shop', 'پوست حساس')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین پوست‌های حساس</button>
                      <button onClick={() => handleNavClick('shop', 'مبتدی')} className="w-full text-right px-3 py-2 text-[13px] rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] cursor-pointer transition-colors">روتین پایه ۴ مرحله‌ای</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-4 w-[1px] bg-[#F0E1E4] mx-1 hidden lg:block" />

            {/* ۱۰. انتخاب‌های VARA */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('vara-picks')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                onClick={() => toggleDropdown('vara-picks')}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'vara-picks' 
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#5E434D] hover:text-[#8C3B58] hover:bg-[#F9F1F0]'
                }`}
              >
                <span>انتخاب‌های VARA</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'vara-picks' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {activeDropdown === 'vara-picks' && (
                <div 
                  className="absolute top-full left-0 sm:right-0 sm:left-auto pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('vara-picks')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-64 bg-white rounded-xl shadow-shop-elevated border border-[#F0E1E4] p-2.5 text-right">
                    <div className="px-3 py-1.5 mb-1.5 border-b border-[#F0E1E4] flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#8C3B58] tracking-wider">منتخب کارشناسان ورا</span>
                    </div>

                    <div className="space-y-0.5">
                      <button onClick={() => handleNavClick('shop')} className="w-full text-right px-3 py-2 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] font-semibold text-[13px] cursor-pointer transition-colors">
                        انتخاب‌های تخصصی تیم VARA
                      </button>
                      <button onClick={() => handleNavClick('shop', 'لوکس')} className="w-full text-right px-3 py-2 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] text-[13px] cursor-pointer transition-colors">
                        محصولات پریمیوم و لوکس
                      </button>
                      <button onClick={() => handleNavClick('shop')} className="w-full text-right px-3 py-2 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] text-[13px] cursor-pointer transition-colors">
                        ترندهای مراقبت پوست جهان
                      </button>
                      <button onClick={() => handleNavClick('shop')} className="w-full text-right px-3 py-2 rounded-lg hover:bg-[#F9F1F0] hover:text-[#8C3B58] text-[#23191E] text-[13px] cursor-pointer transition-colors">
                        بهترین فرمولاسیون‌های سال
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ۱۱. مشاور هوشمند AI */}
            <div 
              className="relative"
              onMouseEnter={() => handleDropdownMouseEnter('my-routine')}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <button 
                onClick={() => toggleDropdown('my-routine')}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs sm:text-[13px] whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  activeDropdown === 'my-routine' 
                    ? 'bg-[#8C3B58] text-white font-semibold shadow-shop-pill' 
                    : 'text-[#5E434D] hover:text-[#8C3B58] hover:bg-[#F9F1F0]'
                }`}
              >
                <span>مشاور هوشمند AI</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'my-routine' ? 'rotate-180 text-white' : 'text-[#785E67]'}`} />
              </button>

              {activeDropdown === 'my-routine' && (
                <div 
                  className="absolute top-full left-0 pt-2 z-[100] animate-fadeIn"
                  onMouseEnter={() => handleDropdownMouseEnter('my-routine')}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <div className="w-72 bg-white rounded-xl shadow-shop-elevated border border-[#F0E1E4] p-3 text-right">
                    <div className="px-2 py-1.5 mb-2 border-b border-[#F0E1E4]">
                      <span className="text-[11px] font-semibold text-[#8C3B58] tracking-wider">تشخیص و راهنمای هوشمند پوست</span>
                    </div>

                    <div className="space-y-1.5">
                      <button 
                        onClick={() => handleNavClick('quiz')} 
                        className="w-full text-right p-2.5 rounded-lg bg-[#F9F1F0] hover:bg-[#8C3B58] hover:text-white text-[#23191E] font-semibold text-[12.5px] flex items-center justify-between cursor-pointer transition-all group border border-[#F0E1E4]"
                      >
                        <span>طراحی روتین پوست</span>
                        <span className="text-[10px] bg-white text-[#8C3B58] px-2 py-0.5 rounded border border-[#F0E1E4] font-medium">شروع</span>
                      </button>

                      <button 
                        onClick={() => handleNavClick('ai-advisor')} 
                        className="w-full text-right p-2.5 rounded-lg bg-[#F9F1F0] hover:bg-[#8C3B58] hover:text-white text-[#23191E] font-semibold text-[12.5px] flex items-center justify-between cursor-pointer transition-all group border border-[#F0E1E4]"
                      >
                        <span>گفتگو با مشاور AI پوست</span>
                        <span className="text-[10px] bg-white text-[#8C3B58] px-2 py-0.5 rounded border border-[#F0E1E4] font-medium">ورود</span>
                      </button>

                      <button 
                        onClick={() => handleNavClick('shop')} 
                        className="w-full text-right px-3 py-2 text-[12.5px] rounded-lg hover:bg-[#F9F1F0] text-[#785E67] hover:text-[#8C3B58] font-medium cursor-pointer transition-colors block"
                      >
                        مشاهده تمامی محصولات سازگار با شما
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </nav>
        </div>
      </div>

      {/* Mobile Full Navigation Drawer */}
      {mobileMenuOpen && (
          <Modal label="منوی فروشگاه" onClose={() => setMobileMenuOpen(false)}
            className="min-[960px]:hidden fixed inset-0 z-[120] bg-[#23191E]/50 backdrop-blur-xs flex font-vazir text-right motion-safe:animate-[vara-menu-fade_180ms_ease-out]"
          >
            <div
              className="w-[85vw] max-w-sm sm:max-w-md bg-[#FDFBF9] h-[100dvh] shadow-2xl flex flex-col relative overflow-hidden mr-0 ml-auto motion-safe:animate-[vara-menu-slide_220ms_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Drawer Header */}
              <div className="p-4 border-b border-[#F0E1E4] flex items-center justify-between bg-white">
                <VaraLogo size="sm" subtitleFa="منوی تخصصی ورا بیوتی" />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-[#785E67] hover:bg-[#F9F1F0] hover:text-[#8C3B58] transition-colors cursor-pointer"
                  aria-label="بستن منو"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* In-Drawer Quick Search */}
              <div className="p-3 border-b border-[#F0E1E4] bg-[#F9F1F0]">
                <div className="relative">
                  <input
                    type="search" aria-label="جستجو در منو" dir="auto"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleNavClick('shop');
                      }
                    }}
                    placeholder="جستجوی محصولات، برندها و ترکیبات..."
                    className="w-full bg-white text-[#23191E] text-xs placeholder:text-[#785E67] font-vazir pr-9 pl-3 py-2.5 rounded-xl border border-[#F0E1E4] focus:outline-none focus:border-[#8C3B58] text-right transition-all"
                  />
                  <Search className="w-4 h-4 text-[#8C3B58] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Quick Action Highlights */}
              <div className="p-3 bg-white border-b border-[#F0E1E4] grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleNavClick('quiz')}
                  className="p-2.5 rounded-xl bg-[#8C3B58] hover:bg-[#732E47] text-white flex items-center justify-center font-semibold active:scale-[0.98] transition-all cursor-pointer shadow-shop-pill"
                >
                  <span className="truncate">طراحی روتین پوست</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('ai-advisor')}
                  className="p-2.5 rounded-xl bg-[#F9F1F0] border border-[#F0E1E4] text-[#8C3B58] flex items-center justify-center font-semibold hover:border-[#D48C9E] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span className="truncate">مشاور هوشمند AI</span>
                </button>
              </div>

              {/* Mobile Navigation Accordions */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs overscroll-contain">
                {/* ۱. فروشگاه بر اساس نوع محصول */}
                <div className="rounded-xl border border-[#F0E1E4] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(mobileExpandedCat === 'shop' ? null : 'shop')} aria-expanded={mobileExpandedCat === 'shop'}
                    className="w-full p-3 flex items-center justify-between font-semibold text-[#23191E] bg-[#F9F1F0]/60 hover:bg-[#F9F1F0] cursor-pointer"
                  >
                    <span>۱. فروشگاه (بر اساس نوع محصول)</span>
                    <ChevronLeft className={`w-4 h-4 text-[#8C3B58] transition-transform duration-200 ${mobileExpandedCat === 'shop' ? '-rotate-90' : ''}`} />
                  </button>
                  {mobileExpandedCat === 'shop' && (
                    <div className="p-3 bg-white space-y-3 border-t border-[#F0E1E4]">
                      <div>
                        <p className="font-semibold text-[#8C3B58] text-[11px] mb-1.5">
                          <span>مراقبت از صورت</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {['شوینده', 'میسلار واتر', 'تونر', 'اسنس', 'سرم', 'مرطوب کننده', 'کرم شب', 'دور چشم', 'ماسک', 'ضد آفتاب', 'روغن صورت'].map(t => (
                            <button key={t} onClick={() => handleNavClick('shop', t)} className="bg-[#F9F1F0] px-2.5 py-1 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] transition-colors cursor-pointer">
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-[#8C3B58] text-[11px] mb-1.5">
                          <span>بدن، لب و مو</span>
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {['شوینده بدن', 'لوسیون بدن', 'بالم لب', 'کرم دست', 'شامپو', 'اسکراب', 'ماسک مو', 'سرم مو'].map(t => (
                            <button key={t} onClick={() => handleNavClick('shop', t)} className="bg-[#F9F1F0] px-2.5 py-1 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] transition-colors cursor-pointer">
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ۲. بر اساس برندها */}
                <div className="rounded-xl border border-[#F0E1E4] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(mobileExpandedCat === 'brands' ? null : 'brands')} aria-expanded={mobileExpandedCat === 'brands'}
                    className="w-full p-3 flex items-center justify-between font-semibold text-[#23191E] bg-[#F9F1F0]/60 hover:bg-[#F9F1F0] cursor-pointer"
                  >
                    <span>۲. بر اساس برندها</span>
                    <ChevronLeft className={`w-4 h-4 text-[#8C3B58] transition-transform duration-200 ${mobileExpandedCat === 'brands' ? '-rotate-90' : ''}`} />
                  </button>
                  {mobileExpandedCat === 'brands' && (
                    <div className="p-3 bg-white border-t border-[#F0E1E4]">
                      <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {brandsList.slice(0, 24).map(brand => (
                          <button 
                            key={brand.id} 
                            onClick={() => handleNavClick('shop', brand.id)}
                            className="bg-[#F9F1F0] px-2.5 py-1 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] text-[11px] transition-colors cursor-pointer"
                          >
                            {brand.labelFa} ({brand.labelEn})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ۳. بر اساس مشکل پوست */}
                <div className="rounded-xl border border-[#F0E1E4] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(mobileExpandedCat === 'concern' ? null : 'concern')} aria-expanded={mobileExpandedCat === 'concern'}
                    className="w-full p-3 flex items-center justify-between font-semibold text-[#23191E] bg-[#F9F1F0]/60 hover:bg-[#F9F1F0] cursor-pointer"
                  >
                    <span>۳. مشکل و دغدغه پوست</span>
                    <ChevronLeft className={`w-4 h-4 text-[#8C3B58] transition-transform duration-200 ${mobileExpandedCat === 'concern' ? '-rotate-90' : ''}`} />
                  </button>
                  {mobileExpandedCat === 'concern' && (
                    <div className="p-3 bg-white flex flex-wrap gap-1.5 border-t border-[#F0E1E4]">
                      {[
                        { label: 'خطوط و چروک پوستی', q: 'چروک' },
                        { label: 'لک و تیرگی', q: 'لک' },
                        { label: 'خشکی و کم‌آبی', q: 'خشکی' },
                        { label: 'جوش و آکنه', q: 'جوش' },
                        { label: 'حساسیت و قرمزی', q: 'حساسیت' },
                        { label: 'منافذ باز و سرسیاه', q: 'منافذ' },
                        { label: 'کدری و خستگی پوست', q: 'کدری' },
                        { label: 'ترمیم سد دفاعی', q: 'ترمیم' },
                      ].map(c => (
                        <button key={c.q} onClick={() => handleNavClick('shop', c.q)} className="bg-[#F9F1F0] px-2.5 py-1.5 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] transition-colors cursor-pointer">
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ۴. بر اساس نوع پوست */}
                <div className="rounded-xl border border-[#F0E1E4] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(mobileExpandedCat === 'type' ? null : 'type')} aria-expanded={mobileExpandedCat === 'type'}
                    className="w-full p-3 flex items-center justify-between font-semibold text-[#23191E] bg-[#F9F1F0]/60 hover:bg-[#F9F1F0] cursor-pointer"
                  >
                    <span>۴. نوع پوست</span>
                    <ChevronLeft className={`w-4 h-4 text-[#8C3B58] transition-transform duration-200 ${mobileExpandedCat === 'type' ? '-rotate-90' : ''}`} />
                  </button>
                  {mobileExpandedCat === 'type' && (
                    <div className="p-3 bg-white flex flex-wrap gap-1.5 border-t border-[#F0E1E4]">
                      {[
                        { label: 'پوست خشک (Dry)', q: 'پوست خشک' },
                        { label: 'پوست چرب (Oily)', q: 'پوست چرب' },
                        { label: 'پوست مختلط (Combination)', q: 'پوست مختلط' },
                        { label: 'پوست نرمال (Normal)', q: 'پوست نرمال' },
                        { label: 'پوست حساس (Sensitive)', q: 'پوست حساس' },
                      ].map(st => (
                        <button key={st.q} onClick={() => handleNavClick('shop', st.q)} className="bg-[#F9F1F0] px-2.5 py-1.5 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] transition-colors cursor-pointer">
                          {st.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ۵. ترکیبات و مواد موثره */}
                <div className="rounded-xl border border-[#F0E1E4] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(mobileExpandedCat === 'ingredients' ? null : 'ingredients')} aria-expanded={mobileExpandedCat === 'ingredients'}
                    className="w-full p-3 flex items-center justify-between font-semibold text-[#23191E] bg-[#F9F1F0]/60 hover:bg-[#F9F1F0] cursor-pointer"
                  >
                    <span>۵. ترکیبات و مواد موثره</span>
                    <ChevronLeft className={`w-4 h-4 text-[#8C3B58] transition-transform duration-200 ${mobileExpandedCat === 'ingredients' ? '-rotate-90' : ''}`} />
                  </button>
                  {mobileExpandedCat === 'ingredients' && (
                    <div className="p-3 bg-white flex flex-wrap gap-1.5 border-t border-[#F0E1E4]">
                      {['رتینول', 'ویتامین C', 'نیاسینامید', 'هیالورونیک اسید', 'پپتید', 'سرامید', 'AHA/BHA', 'سالیسیلیک اسید', 'سنتلا آسیاتیکا', 'عصاره چای سبز', 'حلزون (موسین)'].map(ing => (
                        <button key={ing} onClick={() => handleNavClick('shop', ing)} className="bg-[#F9F1F0] px-2.5 py-1.5 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] transition-colors cursor-pointer">
                          {ing}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* ۶. روتین‌های مراقبتی */}
                <div className="rounded-xl border border-[#F0E1E4] overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedCat(mobileExpandedCat === 'routines' ? null : 'routines')} aria-expanded={mobileExpandedCat === 'routines'}
                    className="w-full p-3 flex items-center justify-between font-semibold text-[#23191E] bg-[#F9F1F0]/60 hover:bg-[#F9F1F0] cursor-pointer"
                  >
                    <span>۶. روتین‌های تخصصی</span>
                    <ChevronLeft className={`w-4 h-4 text-[#8C3B58] transition-transform duration-200 ${mobileExpandedCat === 'routines' ? '-rotate-90' : ''}`} />
                  </button>
                  {mobileExpandedCat === 'routines' && (
                    <div className="p-3 bg-white space-y-2 border-t border-[#F0E1E4]">
                      <div className="flex flex-wrap gap-1.5">
                        {['روتین صبح', 'روتین شب', 'روتین آبرسانی', 'روتین جوانساز', 'روتین روشن‌کننده', 'روتین ضدجوش', 'روتین مینیمال'].map(r => (
                          <button key={r} onClick={() => handleNavClick('shop', r)} className="bg-[#F9F1F0] px-2.5 py-1.5 rounded-md text-[#5E434D] hover:text-white hover:bg-[#8C3B58] transition-colors cursor-pointer">
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ۷. کارت هدیه ورا */}
                <button
                  type="button"
                  onClick={() => handleNavClick('gift-card')}
                  className="w-full p-3 rounded-xl border border-[#F0E1E4] flex items-center justify-between font-semibold text-[#23191E] bg-white hover:bg-[#F9F1F0] transition-colors cursor-pointer"
                >
                  <span>کارت هدیه ورا بیوتی</span>
                  <ChevronLeft className="w-4 h-4 text-[#8C3B58]" />
                </button>

                {/* ۸. لیست علاقه‌مندی‌ها */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenWishlist) onOpenWishlist();
                  }}
                  className="w-full p-3 rounded-xl border border-[#F0E1E4] flex items-center justify-between font-semibold text-[#23191E] bg-white hover:bg-[#F9F1F0] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#8C3B58]" />
                    <span>لیست علاقه‌مندی‌های من</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="text-[10px] bg-[#8C3B58] text-white font-bold px-2 py-0.5 rounded-full font-jakarta">
                      {wishlistCount.toLocaleString('fa-IR')}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Drawer Footer with Auth & Guarantees */}
              <div className="p-3.5 border-t border-[#F0E1E4] bg-[#F9F1F0] space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 px-3 bg-[#8C3B58] hover:bg-[#732E47] text-white rounded-xl font-semibold flex items-center justify-center gap-2 text-xs transition-all cursor-pointer active:scale-[0.98] shadow-shop-violet"
                >
                  <User className="w-4 h-4 text-white" />
                  <span>{user ? `پروفایل: ${user.displayName || 'کاربر گرامی'}` : 'ورود / عضویت در حساب کاربری'}</span>
                </button>
                
                <div className="flex items-center justify-center gap-3 text-[10px] text-[#785E67] pt-1">
                  <span>فروشگاه مراقبت پوست ورا</span>
                </div>
              </div>
            </div>
          </Modal>
      )}
    </header>
  );
};
