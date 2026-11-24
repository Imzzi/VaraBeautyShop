import React from 'react';
import { 
  Instagram, 
  Mail
} from 'lucide-react';
import { VaraLogo } from './VaraLogo';
import { ShopFilterPreset } from '../types';

interface FooterProps {
  onNavigateToAdmin?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToCalculator?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToReturnPolicy?: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToShopWithFilter?: (preset: ShopFilterPreset) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToProfile,
  onNavigateToCalculator,
  onNavigateToContact,
  onNavigateToReturnPolicy,
  onNavigateToTerms,
  onNavigateToShopWithFilter,
}) => {
  const handleFilterClick = (e: React.MouseEvent, preset: ShopFilterPreset) => {
    e.preventDefault();
    if (onNavigateToShopWithFilter) {
      onNavigateToShopWithFilter({ ...preset, timestamp: Date.now() });
    }
  };

  return (
    <footer className="w-full bg-vara-surface border-t border-vara-line pt-12 pb-28 sm:pb-14 font-vazir text-right" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-right font-vazir">
          
          {/* Brand Info (Cols 1 & 2) */}
          <div className="col-span-2 space-y-3">
            <div className="space-y-1 text-right">
              <VaraLogo 
                size="md"
                subtitleFa="ورا بیوتی شاپ"
              />
              <span className="text-[12px] text-vara-rose-ink font-semibold font-vazir block pt-1">
                مرجع تخصصی تامین مستقیم محصولات مراقبت از پوست از امارات
              </span>
            </div>
            <p className="text-xs text-vara-muted leading-relaxed max-w-sm pt-1">
              ورا بیوتی (VARA BEAUTY) ارائه‌دهنده اصیل‌ترین فرمولاسیون‌های کلینیکال و مراقبت از پوست و مو از نمایندگی‌های رسمی سفورا و آمازون امارات با ضمانت بچ‌کد.
            </p>
            <div className="flex items-center gap-2.5 pt-2 text-vara-rose-ink">
              <a
                href="https://www.instagram.com/varabeautyshop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white border border-vara-line flex items-center justify-center hover:bg-vara-tint hover:text-vara-rose-ink hover:border-vara-rose transition-all cursor-pointer"
                aria-label="اینستاگرام"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@varabeauty.ir"
                className="w-9 h-9 rounded-lg bg-white border border-vara-line flex items-center justify-center hover:bg-vara-tint hover:text-vara-rose-ink hover:border-vara-rose transition-all cursor-pointer"
                aria-label="ایمیل"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Shop */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-vara-ink tracking-normal uppercase">
              دسته‌بندی‌ها
            </h4>
            <ul className="space-y-2.5 text-xs text-vara-muted">
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { productType: 'all', routine: 'all', category: 'all' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  مراقبت از صورت
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { productType: 'hair-body' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  مراقبت از مو
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { productType: 'hair-body' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  مراقبت از بدن
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { productType: 'sunscreen' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  ضد آفتاب تخصصی
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { sortBy: 'newest' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  جدیدترین فرمولاسیون‌ها
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Shop by Concern */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-vara-ink tracking-normal uppercase">
              بر اساس دغدغه پوست
            </h4>
            <ul className="space-y-2.5 text-xs text-vara-muted">
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { routine: 'acne-blemish' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  درمان جوش و آکنه
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { routine: 'anti-aging' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  ضد پیری و چروک
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { routine: 'brightening' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  ضد لک و روشن‌کننده
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { routine: 'hydration' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  آبرسانی و خشکی
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  onClick={(e) => handleFilterClick(e, { routine: 'barrier-repair' })}
                  className="hover:text-vara-rose-ink transition-colors cursor-pointer"
                >
                  ترمیم سد دفاعی و قرمزی
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-vara-ink tracking-normal uppercase">
              خدمات مشتریان
            </h4>
            <ul className="space-y-2.5 text-xs text-vara-muted">
              <li>
                <button
                  onClick={onNavigateToCalculator}
                  className="hover:text-vara-rose-ink transition-colors text-right cursor-pointer"
                >
                  استعلام قیمت از امارات
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateToProfile} 
                  className="hover:text-vara-rose-ink transition-colors text-right cursor-pointer"
                >
                  پیگیری سفارش و مرسولات
                </button>
              </li>
              <li>
                <button 
                  onClick={onNavigateToProfile} 
                  className="hover:text-vara-rose-ink transition-colors text-right cursor-pointer"
                >
                  حساب کاربری من
                </button>
              </li>
              <li>
                <a
                  href="/return-policy"
                  onClick={(e) => {
                    if (onNavigateToReturnPolicy) {
                      e.preventDefault();
                      onNavigateToReturnPolicy();
                    }
                  }}
                  className="hover:text-vara-rose-ink transition-colors text-right cursor-pointer inline-block"
                >
                  شرایط بازگشت و استرداد وجه
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  onClick={(e) => {
                    if (onNavigateToTerms) {
                      e.preventDefault();
                      onNavigateToTerms();
                    }
                  }}
                  className="hover:text-vara-rose-ink transition-colors text-right cursor-pointer inline-block"
                >
                  قوانین و مقررات خرید
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => {
                    if (onNavigateToContact) {
                      e.preventDefault();
                      onNavigateToContact();
                    }
                  }}
                  className="hover:text-vara-rose-ink transition-colors text-right cursor-pointer inline-block"
                >
                  تماس با ما
                </a>
              </li>
            </ul>
          </div>

          {/* Col 6: Enamad Trust Seal */}
          <div className="space-y-2 text-right">
            <span className="text-[10px] font-medium text-vara-muted block">
              نماد اعتماد الکترونیکی
            </span>
            <div className="w-24 h-28 bg-white border border-vara-line rounded-xl p-2 flex items-center justify-center">
              <a
                referrerPolicy="origin"
                target="_blank"
                href="https://trustseal.enamad.ir/?id=7840738&Code=m1kzPQfDD4qthoDpXDrv0RPhoCm2lOVs"
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=7840738&Code=m1kzPQfDD4qthoDpXDrv0RPhoCm2lOVs"
                  alt="نماد اعتماد الکترونیکی ورا بیوتی"
                  style={{ cursor: 'pointer' }}
                  className="max-h-full max-w-full object-contain"
                  {...{ code: 'm1kzPQfDD4qthoDpXDrv0RPhoCm2lOVs' }}
                />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright */}
        <p className="mt-12 pt-6 border-t border-vara-line text-xs text-vara-muted">
          تمامی حقوق این وب‌سایت متعلق به فروشگاه «ورا بیوتی» (<span className="font-jakarta text-vara-rose-ink font-medium">varabeauty.ir</span>) است.
        </p>

      </div>
    </footer>
  );
};
