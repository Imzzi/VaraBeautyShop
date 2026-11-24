import { Modal } from './Modal';
import React, { useState } from 'react';
import { X, Gift, Check } from 'lucide-react';
import { Product, ProductSize } from '../types';

interface GiftCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: ProductSize) => void;
}

export const GiftCardModal: React.FC<GiftCardModalProps> = ({
  isOpen,
  onClose,
  onAddToCart
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<'luxury-dark' | 'gold' | 'botanical'>('luxury-dark');
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const presetAmounts = [
    { value: 500000, label: '۵۰۰,۰۰۰ تومان' },
    { value: 1000000, label: '۱,۰۰۰,۰۰۰ تومان' },
    { value: 2000000, label: '۲,۰۰۰,۰۰۰ تومان' },
    { value: 3000000, label: '۳,۰۰۰,۰۰۰ تومان' },
    { value: 5000000, label: '۵,۰۰۰,۰۰۰ تومان' },
  ];

  const currentPrice = isCustom 
    ? (parseInt(customAmount.replace(/[^0-9]/g, ''), 10) || 1000000)
    : selectedAmount;

  const handleAddGiftCardToCart = () => {
    const giftCardProduct: Product = {
      id: `gift-card-${Date.now()}`,
      nameEn: 'VARA Digital Luxury Gift Card',
      nameFa: `کارت هدیه دیجیتال ورا بیوتی (${currentPrice.toLocaleString('fa-IR')} تومان)`,
      category: 'hair-body',
      price: currentPrice,
      rating: 5.0,
      reviewCount: 48,
      sizes: [{
        label: `${currentPrice.toLocaleString('fa-IR')} تومان`,
        labelEn: `${currentPrice} Toman`,
        price: currentPrice
      }],
      badges: ['کارت هدیه اختصاصی', 'ارسال آنی دیجیتال'],
      isBestSeller: true,
      inStock: true,
      stockCount: 999,
      descriptionFa: `کارت هدیه اختصاصی ورا بیوتی به مبلغ ${currentPrice.toLocaleString('fa-IR')} تومان برای ${recipientName || 'گیرنده محترم'}. پیام: ${personalMessage || 'با آرزوی زیبایی و سلامتی'}`,
      descriptionEn: `VARA Beauty Gift Card valued at ${currentPrice.toLocaleString('fa-IR')} Toman`,
      keyIngredients: [
        {
          nameFa: 'اعتبار دیجیتال',
          nameEn: 'Digital Credit',
          description: 'معتبر در تمامی خریدهای آنلاین ورا بیوتی بدون محدودیت زمانی'
        }
      ],
      usageRoutine: {
        morning: 'قابل استفاده در تمامی ساعات شبانه‌روز',
        night: 'قابل استفاده در تمامی ساعات شبانه‌روز'
      },
      skinTypes: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      concerns: ['anti-aging', 'hydration', 'brightening'],
      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800']
    };

    onAddToCart(giftCardProduct, giftCardProduct.sizes[0]);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal label="کارت هدیه" onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vara-ink/50 backdrop-blur-sm animate-fadeIn font-vazir">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-vara-float border border-vara-line relative text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-vara-line flex items-center justify-between sticky top-0 bg-vara-canvas/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-vara-surface border border-vara-line flex items-center justify-center text-vara-rose-ink">
              <Gift className="w-5 h-5 text-vara-rose-ink" />
            </div>
            <div>
              <h3 className="font-bold text-base text-vara-ink">کارت هدیه اختصاصی ورا بیوتی</h3>
              <p className="text-xs text-vara-muted">انتخاب مبلغ و ارسال آنی هدیه دیجیتال زیبایی</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-vara-surface text-vara-muted hover:text-vara-rose-ink transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Card Preview */}
          <div className={`p-6 rounded-2xl transition-all duration-300 text-white relative overflow-hidden shadow-lg ${
            selectedTheme === 'luxury-dark'
              ? 'bg-gradient-to-br from-[#8C3B58] via-[#732E47] to-[#23191E] border border-vara-tint-line/30'
              : selectedTheme === 'gold'
              ? 'bg-gradient-to-br from-[#D48C9E] via-[#B86B80] to-[#8C3B58] border border-white/20'
              : 'bg-gradient-to-br from-[#23191E] via-[#3A2730] to-[#8C3B58] border border-vara-tint-line/30'
          }`}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] tracking-widest uppercase opacity-80 font-jakarta">VARA BEAUTY GIFT CARD</span>
                <h4 className="text-xl font-bold font-jakarta mt-0.5">VARA</h4>
              </div>
            </div>

            <div className="my-4">
              <span className="text-xs opacity-80 block">مبلغ هدیه</span>
              <span className="text-2xl font-bold font-jakarta tracking-tight">
                {currentPrice.toLocaleString('fa-IR')} <span className="text-sm font-vazir font-normal">تومان</span>
              </span>
            </div>

            <div className="flex justify-between items-end text-xs opacity-90 border-t border-white/15 pt-3">
              <div>
                <span className="block text-[10px] opacity-75">به نام:</span>
                <span className="font-semibold">{recipientName || 'گیرنده محترم هدیه'}</span>
              </div>
              <div className="text-left">
                <span className="block text-[10px] opacity-75">از طرف:</span>
                <span className="font-semibold">{senderName || 'شما'}</span>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-vara-ink mb-2">طرح و تم کارت هدیه</label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={() => setSelectedTheme('luxury-dark')}
                className={`py-2 px-3 rounded-full border text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  selectedTheme === 'luxury-dark'
                    ? 'border-vara-rose bg-vara-rose text-white font-bold shadow-xs'
                    : 'border-vara-line hover:bg-vara-surface text-vara-muted'
                }`}
              >
                <span>موو سلطنتی</span>
              </button>
              <button
                onClick={() => setSelectedTheme('gold')}
                className={`py-2 px-3 rounded-full border text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  selectedTheme === 'gold'
                    ? 'border-vara-tint-line bg-vara-tint text-vara-rose-ink font-bold shadow-xs'
                    : 'border-vara-line hover:bg-vara-surface text-vara-muted'
                }`}
              >
                <span>رزگلد ملایم</span>
              </button>
              <button
                onClick={() => setSelectedTheme('botanical')}
                className={`py-2 px-3 rounded-full border text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  selectedTheme === 'botanical'
                    ? 'border-vara-ink bg-vara-ink text-white font-bold shadow-xs'
                    : 'border-vara-line hover:bg-vara-surface text-vara-muted'
                }`}
              >
                <span>پلام تیره لوکس</span>
              </button>
            </div>
          </div>

          {/* Amount Selector */}
          <div>
            <label className="block text-xs font-semibold text-vara-ink mb-2">انتخاب مبلغ کارت هدیه</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(preset.value);
                    setIsCustom(false);
                  }}
                  className={`py-2.5 px-3 rounded-full border text-xs font-medium cursor-pointer transition-all text-center ${
                    !isCustom && selectedAmount === preset.value
                      ? 'border-vara-rose bg-vara-rose text-white font-bold shadow-xs'
                      : 'border-vara-line hover:bg-vara-surface text-vara-ink'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`px-3 py-2 rounded-full text-xs border cursor-pointer transition-all shrink-0 ${
                  isCustom ? 'border-vara-rose bg-vara-rose text-white font-bold' : 'border-vara-line text-vara-muted'
                }`}
              >
                مبلغ دلخواه
              </button>
              {isCustom && (
                <input
                  type="text"
                  placeholder="مبلغ به تومان (مثلا: ۴,۵۰۰,۰۰۰)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 bg-vara-canvas text-vara-ink text-xs font-vazir px-3.5 py-2 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose text-right"
                  autoFocus
                />
              )}
            </div>
          </div>

          {/* Recipient & Sender Form */}
          <div className="space-y-3 border-t border-vara-line pt-4">
            <h4 className="text-xs font-bold text-vara-ink">اطلاعات گیرنده و پیام شما</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-vara-muted mb-1">نام گیرنده</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="مثلا: سارا رضایی"
                  className="w-full bg-vara-canvas text-vara-ink text-xs px-3.5 py-2 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] text-vara-muted mb-1">شماره همراه یا ایمیل گیرنده</label>
                <input
                  type="text"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="۰۹۱۲۰۰۰۰۰۰۰ یا email@example.com"
                  className="w-full bg-vara-canvas text-vara-ink text-xs px-3.5 py-2 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-vara-muted mb-1">نام فرستنده</label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="نام شما"
                  className="w-full bg-vara-canvas text-vara-ink text-xs px-3.5 py-2 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose text-right"
                />
              </div>
              <div>
                <label className="block text-[11px] text-vara-muted mb-1">متن تبریک / پیام دلخواه</label>
                <input
                  type="text"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  placeholder="تولدت مبارک عزیز دلم! 🌸"
                  className="w-full bg-vara-canvas text-vara-ink text-xs px-3.5 py-2 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-vara-line bg-vara-canvas flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-vara-muted block">مبلغ نهایی کارت:</span>
            <span className="text-base font-bold text-vara-rose-ink font-jakarta">
              {currentPrice.toLocaleString('fa-IR')} تومان
            </span>
          </div>
          <button
            onClick={handleAddGiftCardToCart}
            disabled={addedSuccess}
            className={`px-6 py-3 rounded-full font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              addedSuccess
                ? 'bg-[#15803D] text-white'
                : 'bg-vara-rose hover:bg-vara-rose-hover text-white shadow-xs'
            }`}
          >
            {addedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>به سبد خرید اضافه شد!</span>
              </>
            ) : (
              <span>افزودن کارت هدیه به سبد خرید</span>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
