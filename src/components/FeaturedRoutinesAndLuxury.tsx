import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { getProductCover } from '../lib/productImages';
import { ProductImage } from './ProductImage';

interface FeaturedRoutinesAndLuxuryProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  onViewAllProducts: () => void;
  onOpenQuiz: () => void;
}

export const FeaturedRoutinesAndLuxury: React.FC<FeaturedRoutinesAndLuxuryProps> = ({
  products = [],
  onViewProduct,
  onViewAllProducts,
  onOpenQuiz
}) => {
  if (!products.length) return null;

  const getProductSafe = (index: number) => {
    return products[index] || products[0];
  };

  // 4 Curated Formulations for Personalized Regimens (2x2 architectural grid)
  const luxuryPicks = [
    {
      product: getProductSafe(0),
      tag: 'سرم هدفمند جوانسازی و سد دفاعی',
      roleInRoutine: 'مناسب برای پکیج‌های ضدپیری، کم‌آبی و ترمیم بافت'
    },
    {
      product: getProductSafe(2),
      tag: 'مرطوب‌کننده و قفل‌کننده رطوبت',
      roleInRoutine: 'پایه ثابت روتین‌های پوست خشک، حساس و دهیدراته'
    },
    {
      product: getProductSafe(1),
      tag: 'اکسیر شفاف‌کننده و ضدلک',
      roleInRoutine: 'تنظیم‌شده برای پکیج‌های روشن‌کننده و رفع کدری پوست'
    },
    {
      product: getProductSafe(3),
      tag: 'محافظت روزانه و ضدآفتاب تخصصی',
      roleInRoutine: 'گام نهایی محافظتی در تمامی پکیج‌های مراقبت روزانه'
    }
  ];

  const personalizationSteps = [
    { num: '۰۱', title: 'ارزیابی دقیق تیپ و نیاز پوست شما', desc: 'بررسی میزان چربی، رطوبت، حساسیت و دغدغه‌های اصلی (جوش، لک یا چروک)' },
    { num: '۰۲', title: 'ترکیب هوشمند فرمولاسیون‌های مکمل', desc: 'انتخاب محصولات هم‌افزا بدون تداخل ترکیبات فعال (رتینول، اسیدها و پپتیدها)' },
    { num: '۰۳', title: 'تدوین برنامه مصرف صبح و شب', desc: 'ارائه پکیج اختصاصی به همراه راهنمای گام‌به‌گام ترتیب استفاده روزانه' },
  ];

  return (
    <section className="w-full py-12 bg-transparent text-right font-vazir">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1 (5 cols in RTL): Personalized Skincare Package */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-5 text-right min-h-[64px] flex flex-col justify-end">
              <div className="text-xs font-medium text-[#8C3B58] mb-1">
                <span>پروتکل اختصاصی</span>
                <span className="mx-1.5 text-[#D48C9E]" aria-hidden="true">·</span>
                <span className="font-jakarta">Personalized Regimen</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#23191E] tracking-tight">
                پکیج مراقبتی شخصی‌سازی‌شده
              </h3>
              <p className="text-xs text-[#785E67] mt-1">
                طراحی روتین اختصاصی دقیقاً متناسب با بیولوژی و دغدغه پوست شما
              </p>
            </div>

            <div className="flex-1 bg-[#F9F1F0] rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-[#F0E1E4]">
              <div className="space-y-5">
                {/* Routine Header + Image Split */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-7 text-right space-y-1.5">
                    <div className="text-[11px] font-medium text-[#8C3B58]">
                      <span>تطبیق هوشمند</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>روتین صبح و شب</span>
                    </div>
                    <h4 className="font-bold text-base sm:text-lg text-[#23191E] leading-snug">
                      پکیج اختصاصی بر اساس آنالیز پوست شما
                    </h4>
                    <p className="text-xs text-[#785E67] leading-relaxed">
                      به جای خرید محصولات پراکنده، پکیج هماهنگ و هدفمند مخصوص تیپ پوستی خودتان را دریافت کنید.
                    </p>
                  </div>

                  <div className="sm:col-span-5">
                    <div className="aspect-4/3 rounded-xl overflow-hidden bg-white border border-[#F0E1E4]">
                      <img
                        loading="lazy"
                        decoding="async"
                        src="https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop"
                        alt="پکیج مراقبتی شخصی‌سازی‌شده"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>

                {/* Editorial Numbered Personalization Steps */}
                <div className="pt-4 border-t border-[#F0E1E4] divide-y divide-[#F0E1E4]/70">
                  {personalizationSteps.map((step) => (
                    <div key={step.num} className="py-2.5 first:pt-0 last:pb-0 flex items-baseline gap-3 text-right">
                      <span className="text-xs font-bold text-[#8C3B58] tabular-nums shrink-0">
                        {step.num}.
                      </span>
                      <div className="space-y-0.5">
                        <div className="text-xs font-semibold text-[#23191E]">
                          {step.title}
                        </div>
                        <div className="text-[11px] text-[#785E67]">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalization Action Footer (No Price) */}
              <div className="pt-5 mt-5 border-t border-[#F0E1E4] flex items-center justify-between gap-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-[#23191E]">
                    آماده ساخت پکیج اختصاصی خود هستید؟
                  </div>
                  <div className="text-[11px] text-[#785E67] mt-0.5">
                    تکمیل تست تخصصی پوست در کمتر از ۱ دقیقه
                  </div>
                </div>

                <button
                  onClick={onOpenQuiz}
                  className="px-5 py-2.5 rounded-xl bg-[#8C3B58] hover:bg-[#732E47] text-white text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  طراحی پکیج اختصاصی من
                </button>
              </div>
            </div>
          </div>

          {/* Column 2 (7 cols in RTL): Curated Formulations in Personalized Packages */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-end justify-between gap-4 mb-5 text-right min-h-[64px]">
              <div>
                <div className="text-xs font-medium text-[#8C3B58] mb-1">
                  <span>اجزای کلیدی پکیج‌ها</span>
                  <span className="mx-1.5 text-[#D48C9E]" aria-hidden="true">·</span>
                  <span className="font-jakarta">Core Formulations</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#23191E] tracking-tight">
                  فرمولاسیون‌های منتخب در روتین‌های شخصی
                </h3>
                <p className="text-xs text-[#785E67] mt-1">
                  محصولات کلینیکال که بر اساس نیاز پوست شما در پکیج‌های اختصاصی ترکیب می‌شوند
                </p>
              </div>

              <button
                onClick={onViewAllProducts}
                className="text-xs text-[#8C3B58] hover:text-[#23191E] flex items-center gap-1.5 cursor-pointer transition-colors font-semibold py-1.5 whitespace-nowrap shrink-0"
              >
                <span>مشاهده همه محصولات</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2x2 Balanced Product Showcase Grid (No Prices) */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {luxuryPicks.map((item, idx) => {
                const product = item.product as Product;
                return (
                  <div
                    key={product?.id || idx}
                    onClick={() => onViewProduct(product)}
                    className="group bg-white border border-[#F0E1E4] hover:border-[#D48C9E] rounded-2xl p-4 flex items-center gap-4 text-right cursor-pointer transition-all duration-200"
                  >
                    {/* Product Thumbnail */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-[#F9F1F0] overflow-hidden shrink-0 border border-[#F0E1E4] p-2 flex items-center justify-center">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={getProductCover(product)}
                        alt={product?.nameFa || 'محصول لوکس'}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                      <div className="space-y-1">
                        <div className="text-[11px] text-[#785E67] flex items-center gap-1.5 truncate">
                          <span className="font-jakarta font-semibold text-[#8C3B58]">{product?.brand || 'VARA'}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{item.tag}</span>
                        </div>

                        <h4 className="text-sm font-bold text-[#23191E] group-hover:text-[#8C3B58] transition-colors line-clamp-1 leading-snug">
                          {product?.nameFa || 'فرمولاسیون تخصصی'}
                        </h4>

                        <p className="text-[11px] text-[#785E67] line-clamp-2 leading-relaxed">
                          {item.roleInRoutine}
                        </p>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-[#F0E1E4]/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#785E67] truncate">
                          قابلیت انتخاب در روتین شخصی
                        </span>

                        <span className="text-[11px] font-semibold text-[#8C3B58] flex items-center gap-1 whitespace-nowrap shrink-0 group-hover:-translate-x-0.5 transition-transform">
                          <span>بررسی محصول</span>
                          <ArrowLeft className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
