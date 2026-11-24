import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Mail,
  Phone,
  Clock,
  MapPin,
  Instagram,
  Send,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Navigation
} from 'lucide-react';

interface ContactPageProps {
  onBackToHome: () => void;
  onNavigateToShop: () => void;
  onShowToast?: (message: string) => void;
}

const CONTACT_LAT = 36.6508;
const CONTACT_LNG = 51.4998;

export const ContactPage: React.FC<ContactPageProps> = ({
  onBackToHome,
  onNavigateToShop,
  onShowToast
}) => {
  const reducedMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    orderNumber: '',
    subject: 'پیگیری سفارش و ارسال',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      if (onShowToast) {
        onShowToast('پیام شما با موفقیت ثبت شد. کارشناسان وارا بیوتی به زودی با شما تماس می‌گیرند.');
      }
    }, 600);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      orderNumber: '',
      subject: 'پیگیری سفارش و ارسال',
      message: ''
    });
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen text-[var(--vara-ink)] font-vazir py-8 sm:py-12 px-4 sm:px-6 lg:px-12" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb / Back navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-sm text-vara-muted hover:text-vara-rose-ink transition-colors cursor-pointer group"
          >
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>بازگشت به صفحه اصلی</span>
          </button>
        </div>

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.45 }}
          className="vara-page-heading p-6 sm:p-10 mb-8 relative overflow-hidden"
        >
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <h1 className="vara-shop-title">
              تماس با ورا
            </h1>
          </div>
        </motion.div>

        {/* Main Grid: Contact Info Cards + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Channels Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.1 }}
            className="lg:col-span-5 space-y-5"
          >
            <div className="bg-white/80 backdrop-blur-md border border-vara-ink/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-vara-ink mb-2">راه‌های ارتباط مستقیم</h2>
                <p className="text-xs sm:text-sm text-vara-muted leading-relaxed">
                  برای دریافت پاسخ سریع‌تر در مورد موجودی کالاها یا پیگیری مرسولات پستی، می‌توانید از طریق راه‌های زیر با ما در ارتباط باشید:
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone Number */}
                <a
                  href="tel:09037943125"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-vara-surface hover:bg-vara-line border border-vara-ink/5 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-vara-rose text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-vara-ink group-hover:text-vara-rose-ink transition-colors">
                        شماره تماس پشتیبانی
                      </h3>
                      <ExternalLink size={14} className="text-vara-muted group-hover:text-vara-rose-ink" />
                    </div>
                    <p className="text-xs text-vara-muted mt-1">پاسخگویی تلفنی، مشاوره خرید و پیگیری سفارشات</p>
                    <span className="inline-block mt-1.5 text-sm font-jakarta font-bold text-vara-rose-ink tracking-wide" dir="ltr">
                      0903 794 3125
                    </span>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-vara-surface border border-vara-ink/5">
                  <div className="w-11 h-11 rounded-xl bg-vara-line text-vara-rose-ink flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-vara-ink">آدرس مجموعه</h3>
                    <p className="text-xs text-vara-ink font-medium mt-1 leading-relaxed">
                      مازندران، نوشهر، ساختمان دکتر مازیار
                    </p>
                  </div>
                </div>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/varabeautyshop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-vara-surface hover:bg-vara-line border border-vara-ink/5 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-vara-ink text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Instagram size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-vara-ink group-hover:text-vara-rose-ink transition-colors">
                        دایرکت اینستاگرام
                      </h3>
                      <ExternalLink size={14} className="text-vara-muted group-hover:text-vara-rose-ink" />
                    </div>
                    <p className="text-xs text-vara-muted mt-1">مشاوره رایگان خرید و ثبت سفارش مستقیم</p>
                    <span className="inline-block mt-1.5 text-xs font-jakarta font-semibold text-vara-rose-ink" dir="ltr">
                      @varabeautyshop
                    </span>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@varabeauty.ir"
                  className="flex items-start gap-4 p-4 rounded-2xl bg-vara-surface hover:bg-vara-line border border-vara-ink/5 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-vara-line text-vara-rose-ink flex items-center justify-center shrink-0 shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-vara-ink group-hover:text-vara-rose-ink transition-colors">
                      پست الکترونیکی
                    </h3>
                    <p className="text-xs text-vara-muted mt-1">همکاری‌های تجاری، پیشنهادات و پیگیری سفارشات</p>
                    <span className="inline-block mt-1.5 text-xs font-jakarta font-semibold text-vara-rose-ink" dir="ltr">
                      info@varabeauty.ir
                    </span>
                  </div>
                </a>

                {/* Working Hours */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-vara-surface border border-vara-ink/5">
                  <div className="w-11 h-11 rounded-xl bg-vara-line text-vara-rose-ink flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-vara-ink">ساعات پاسخگویی پشتیبانی</h3>
                    <p className="text-xs text-vara-muted mt-1 leading-relaxed">
                      شنبه تا پنج‌شنبه: ساعت ۱۰:۰۰ صبح الی ۲۱:۰۰ شب
                    </p>
                    <p className="text-[11px] text-vara-rose-ink mt-1 font-medium">
                      ثبت سفارش در وب‌سایت به صورت ۲۴ ساعته و در تمام ایام هفته فعال است.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Location Card */}
            <div className="bg-white border border-vara-ink/10 rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-vara-ink">موقعیت روی نقشه</h3>
                  <p className="text-xs text-vara-muted mt-0.5">مازندران، نوشهر، ساختمان دکتر مازیار</p>
                </div>
                <a
                  href={`https://www.google.com/maps?q=${CONTACT_LAT},${CONTACT_LNG}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vara-rose text-white text-xs font-medium hover:bg-vara-ink transition-colors"
                >
                  <Navigation size={13} />
                  <span>مسیریابی</span>
                </a>
              </div>

              <div className="w-full h-56 rounded-2xl overflow-hidden border border-vara-ink/10 bg-vara-surface">
                <iframe
                  title="موقعیت مکانی وارا بیوتی روی نقشه"
                  src={`https://maps.google.com/maps?q=${CONTACT_LAT},${CONTACT_LNG}&z=16&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>

          {/* Contact Form Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white border border-vara-ink/10 rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-vara-line text-vara-rose-ink flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-vara-ink">ارسال پیام به پشتیبانی</h2>
                  <p className="text-xs text-vara-muted mt-0.5">
                    فرم زیر را تکمیل کنید تا کارشناسان ما در کوتاه‌ترین زمان با شما تماس بگیرند.
                  </p>
                </div>
              </div>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-vara-surface border border-vara-rose/20 rounded-2xl p-8 text-center space-y-4 my-4"
                >
                  <div className="w-16 h-16 rounded-full bg-vara-rose/10 text-vara-rose-ink flex items-center justify-center mx-auto">
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 className="text-xl font-bold text-vara-ink">پیام شما با موفقیت دریافت شد</h3>
                  <p className="text-sm text-vara-muted max-w-md mx-auto leading-relaxed">
                    از همراهی شما سپاسگزاریم. تیم پشتیبانی وارا بیوتی پیام شما را بررسی کرده و از طریق شماره تماس یا ایمیل ثبت‌شده پاسخگوی شما خواهند بود.
                  </p>
                  <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-full bg-vara-rose text-white text-xs font-medium hover:bg-vara-rose-hover transition-colors cursor-pointer"
                    >
                      ارسال پیام جدید
                    </button>
                    <button
                      type="button"
                      onClick={onNavigateToShop}
                      className="px-6 py-2.5 rounded-full border border-vara-ink/15 text-vara-ink text-xs font-medium hover:bg-vara-line transition-colors cursor-pointer"
                    >
                      مشاهده فروشگاه
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-vara-ink mb-2">
                        نام و نام خانوادگی <span className="text-vara-rose-ink">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="مثال: سارا محمدی"
                        className="w-full px-4 py-3 rounded-full bg-vara-surface border border-vara-ink/10 text-sm text-vara-ink placeholder-vara-muted/50 focus:outline-none focus:border-vara-rose transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-vara-ink mb-2">
                        شماره موبایل <span className="text-vara-rose-ink">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="0912XXXXXXX"
                        className="w-full px-4 py-3 rounded-full bg-vara-surface border border-vara-ink/10 text-sm text-vara-ink placeholder-vara-muted/50 text-right focus:outline-none focus:border-vara-rose transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-vara-ink mb-2">
                        موضوع پیام
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-full bg-vara-surface border border-vara-ink/10 text-sm text-vara-ink focus:outline-none focus:border-vara-rose transition-colors"
                      >
                        <option value="پیگیری سفارش و ارسال">پیگیری سفارش و مرسولات</option>
                        <option value="مشاوره تخصصی انتخاب محصول">مشاوره تخصصی پوست و زیبایی</option>
                        <option value="سفارش اختصاصی از امارات">استعلام و سفارش اختصاصی از امارات</option>
                        <option value="پیشنهادات و انتقادات">پیشنهادات و انتقادات</option>
                        <option value="سایر موارد">سایر موارد</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-vara-ink mb-2">
                        شماره سفارش (اختیاری)
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={formData.orderNumber}
                        onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                        placeholder="VB-XXXX"
                        className="w-full px-4 py-3 rounded-full bg-vara-surface border border-vara-ink/10 text-sm text-vara-ink placeholder-vara-muted/50 text-right focus:outline-none focus:border-vara-rose transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-vara-ink mb-2">
                      آدرس ایمیل (اختیاری)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="yourname@example.com"
                      className="w-full px-4 py-3 rounded-full bg-vara-surface border border-vara-ink/10 text-sm text-vara-ink placeholder-vara-muted/50 text-right focus:outline-none focus:border-vara-rose transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-vara-ink mb-2">
                      متن پیام شما <span className="text-vara-rose-ink">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="سوال، درخواست مشاوره یا جزئیات سفارش خود را اینجا بنویسید..."
                      className="w-full px-4 py-3 rounded-xl bg-vara-surface border border-vara-ink/10 text-sm text-vara-ink placeholder-vara-muted/50 focus:outline-none focus:border-vara-rose transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-vara-rose hover:bg-vara-ink text-white font-medium text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer disabled:opacity-60"
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'در حال ثبت پیام...' : 'ثبت و ارسال پیام'}</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
