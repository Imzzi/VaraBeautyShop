import React, { useState } from 'react';
import { Star, Heart, ArrowLeft } from 'lucide-react';

export const UserReviewsSection: React.FC = () => {
  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});

  const toggleLike = (idx: number) => {
    setLikedReviews(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const reviews = [
    {
      name: 'سارا',
      rating: 4.8,
      skinType: 'مختلط',
      age: 29,
      concern: 'جوش و لک‌های پوستی',
      usedFor: '۸ هفته',
      comment: 'بعد از ۲ ماه استفاده، جای جوش‌هام خیلی کم رنگ شده و پوستم خیلی شفاف تر شده. با اینکه قیمتش بالاست ولی ارزشش رو داشت.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'مریم',
      rating: 4.8,
      skinType: 'خشک',
      age: 34,
      concern: 'کم‌آبی و دهیدراتگی',
      usedFor: '۶ هفته',
      comment: 'این محصول نجات بخش پوست خشک من بود. پوستم نرم و لطیف شده و هیچ حس کشیدگی ندارم.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'نرگس',
      rating: 4.8,
      skinType: 'حساس',
      age: 27,
      concern: 'قرمزی و التهاب',
      usedFor: '۴ هفته',
      comment: 'پوست حساسی دارم ولی این محصول هیچ تحریکی ایجاد نکرد و قرمزی پوستم رو خیلی کم کرد.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop'
    },
    {
      name: 'مهشید',
      rating: 4.8,
      skinType: 'چرب',
      age: 31,
      concern: 'منافذ باز و چربی',
      usedFor: '۱۰ هفته',
      comment: 'منافذ پوستم کوچیک تر شده و جلوی چرب شدن پوستم رو خیلی خوب میگیره.',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200&auto=format&fit=crop'
    }
  ];

  return (
    <section className="w-full py-12 bg-transparent text-right font-vazir">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#F0E1E4] pb-4">
          <div>
            <div className="text-[11px] font-semibold text-[#8C3B58] uppercase tracking-[0.12em] mb-1 flex items-center gap-1.5 font-jakarta">
              <span>CLINICAL FEEDBACK · بازخورد مصرف‌کنندگان</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#23191E] tracking-tight">
              تجربیات و نتایج واقعی خریداران
            </h2>
            <p className="text-xs sm:text-sm text-[#785E67] mt-1">
              گزارش‌های تاییدشده از اثربخشی محصولات بر انواع تیپ‌های پوستی
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#F0E1E4] hover:border-[#D48C9E] transition-all duration-200 shadow-shop-card hover:shadow-shop-elevated"
            >
              <div>
                {/* Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 text-[#8C3B58]">
                    <Star className="w-3.5 h-3.5 fill-[#8C3B58] text-[#8C3B58]" />
                    <span className="text-xs font-bold text-[#23191E] font-jakarta">
                      {rev.rating.toLocaleString('fa-IR')} / ۵
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8C3B58] bg-[#F5E6EB] px-2 py-0.5 rounded font-medium border border-[#F0E1E4]">
                    مصرف {rev.usedFor}
                  </span>
                </div>

                {/* Metadata List */}
                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#785E67] bg-[#F9F1F0] border border-[#F0E1E4] rounded-xl p-2.5 mb-3 text-right">
                  <div><span className="text-[#23191E] font-medium">پوست:</span> {rev.skinType}</div>
                  <div><span className="text-[#23191E] font-medium">سن:</span> {rev.age.toLocaleString('fa-IR')} سال</div>
                  <div className="col-span-2 truncate"><span className="text-[#23191E] font-medium">دغدغه:</span> {rev.concern}</div>
                </div>

                {/* Comment */}
                <p className="text-xs text-[#23191E] leading-relaxed text-right line-clamp-4">
                  «{rev.comment}»
                </p>
              </div>

              {/* Author & Heart */}
              <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-[#F0E1E4]">
                <div className="flex items-center gap-2">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-6 h-6 rounded-full object-cover border border-[#F0E1E4]"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs font-semibold text-[#23191E]">
                    {rev.name}
                  </span>
                </div>

                <button
                  onClick={() => toggleLike(idx)}
                  className={`p-1.5 rounded-lg hover:bg-[#F5E6EB] transition-colors cursor-pointer ${
                    likedReviews[idx] ? 'text-[#8C3B58]' : 'text-[#785E67]'
                  }`}
                  aria-label="پسندیدن نظر"
                >
                  <Heart className={`w-3.5 h-3.5 ${likedReviews[idx] ? 'fill-[#8C3B58]' : ''}`} />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
