import React from 'react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      titleEn: 'ضمانت اصالت ۱۰۰٪',
      titleFa: 'تضمین سلامت و کیفیت اورجینال'
    },
    {
      titleEn: 'برندهای معتبر جهانی',
      titleFa: 'تأمین مستقیم از نمایندگی رسمی'
    },
    {
      titleEn: 'ضمانت تاریخ انقضا',
      titleFa: 'قابل رهگیری با بچ‌کد معتبر'
    },
    {
      titleEn: 'بسته‌بندی ایمن و بهداشتی',
      titleFa: 'ارسال با عایق ضد ضربه'
    },
    {
      titleEn: 'مشاوره و پشتیبانی تخصصی',
      titleFa: 'پاسخگویی سریع کارشناسان'
    }
  ];

  return (
    <section className="w-full py-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-vara-surface border border-vara-line rounded-2xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-vara-line overflow-hidden shadow-shop-card">
          {badges.map((b, idx) => (
            <div 
              key={idx} 
              className="flex flex-col text-right p-4 sm:p-5 font-vazir justify-center hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2 justify-start">
                <span className="w-1.5 h-1.5 rounded-full bg-vara-rose shrink-0" />
                <span className="text-xs sm:text-[13px] font-semibold text-vara-ink">
                  {b.titleEn}
                </span>
              </div>
              <span className="text-[11px] text-vara-muted mt-1 pr-3.5 leading-relaxed">
                {b.titleFa}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
