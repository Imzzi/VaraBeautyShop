import { Modal } from './Modal';
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Camera, 
  Upload, 
  Bot, 
  User as UserIcon, 
  ShoppingBag, 
  ChevronLeft, 
  Check, 
  RefreshCw, 
  Info,
  Maximize2,
  Minimize2,
  MessageSquareHeart
} from 'lucide-react';
import { Product, ProductSize, UserProfile, UserSkinProfile } from '../types';
import { getSavedSkinProfile } from '../data/quizData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestedProductIds?: string[];
  isAnalysisResult?: boolean;
}

interface AIBeautyAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
  requestedTab: 'chat' | 'scan';
  products: Product[];
  onAddToCart: (product: Product, size: ProductSize, qty?: number) => void;
  onSelectProduct?: (product: Product) => void;
  user?: UserProfile | null;
}

export const AIBeautyAdvisor: React.FC<AIBeautyAdvisorProps> = ({
  isOpen,
  onClose,
  requestedTab,
  products,
  onAddToCart,
  onSelectProduct,
  user
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'scan'>(requestedTab);
  const [savedSkinProfile, setSavedSkinProfile] = useState<UserSkinProfile | null>(null);
  
  // Chat state
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load and subscribe to saved skin profile
  useEffect(() => {
    const profile = getSavedSkinProfile();
    setSavedSkinProfile(profile);

    const initialBotMessage: Message = {
      id: 'welcome-1',
      sender: 'bot',
      text: profile
        ? `سلام ${user?.displayName ? user.displayName + ' عزیز' : 'عزیز'}! 🌿 مشاور هوشمند ورا بیوتی (VARA BEAUTY) در خدمت شماست.\n\nمن پروفایل پوست شما (**${profile.summaryLabelFa}**) را ثبت کرده‌ام و آماده‌ام تا درباره روتین پیشنهادی، تداخل ترکیبات، نحوه استفاده یا انتخاب محصولات گیاهی پاسخگوی سوالات شما باشم.`
        : `سلام ${user?.displayName ? user.displayName + ' عزیز' : 'عزیز'}! 🌿 به مشاور هوشمند درماتولوژی گیاهی ورا بیوتی خوش آمدید.\n\nمن می‌توانم بر اساس **نوع پوست، حساسیت‌ها و اهداف مراقبتی شما**، بهترین روتین و محصولات گیاهی را پیشنهاد دهم.\n\nهمچنین می‌توانید با بخش **«آنالیز عکس چهره»** تصویری از پوست خود ارسال کنید تا بررسی تخصصی انجام شود.`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      suggestedProductIds: profile?.recommendedProductIds?.slice(0, 3) || ['product-1', 'product-2']
    };

    setMessages([initialBotMessage]);

    const handleProfileUpdate = (e: any) => {
      const updated = e.detail || getSavedSkinProfile();
      setSavedSkinProfile(updated);
    };

    window.addEventListener('vara-skin-profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('vara-skin-profile-updated', handleProfileUpdate);
    };
  }, [user]);

  // Skin Photo Analysis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userNote, setUserNote] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisProductIds, setAnalysisProductIds] = useState<string[]>([]);
  const [addedProductMap, setAddedProductMap] = useState<{ [id: string]: boolean }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }, [messages, loading, isOpen, activeTab]);

  useEffect(() => {
    if (isOpen) setActiveTab(requestedTab);
  }, [isOpen, requestedTab]);

  const quickPrompts = [
    { label: '✨ محصول مناسب من رو پیدا کن', query: 'بر اساس نوع پوست و دغدغه‌های من، بهترین محصول ورا بیوتی را معرفی کن.' },
    { label: '🌿 روتین بساز', query: 'یک روتین کامل مراقبت پوست صبح و شب با محصولات ورا بیوتی برای من تدوین کن.' },
    { label: '⚖️ دو محصول رو مقایسه کن', query: 'تفاوت سرم اکسیر جوانساز و روغن درخشش لادن چیست و کدام برای من مناسب‌تر است؟' },
    { label: '🛡️ روتین فعلی من رو بررسی کن', query: 'من در حال حاضر از شوینده و مرطوب‌کننده استفاده می‌کنم، چطور روتینم را ارتقا دهم؟' },
    { label: '🔄 یک محصول جایگزین پیدا کن', query: 'اگر نخواهم از اسیدهای قوی استفاده کنم، چه جایگزین گیاهی و ملایمی در ورا بیوتی دارید؟' },
    { label: '📖 نحوه استفاده از محصول رو بگو', query: 'طرز استفاده اصولی و ترتیب مراحل استفاده از سرم، تونر و ضدآفتاب چگونه است؟' }
  ];

  // Send message to backend API
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsgId = 'user-' + Date.now();
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Prepare compact catalog payload
      const catalogSummary = products.map((p) => ({
        id: p.id,
        nameFa: p.nameFa,
        nameEn: p.nameEn,
        category: p.category,
        price: p.price,
        skinTypes: p.skinTypes,
        concerns: p.concerns,
        keyIngredients: p.keyIngredients,
        descriptionFa: p.descriptionFa
      }));

      // History formatted for backend
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          catalogSummary,
          userProfile: user,
          skinProfile: savedSkinProfile
        })
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            suggestedProductIds: data.suggestedProductIds || []
          }
        ]);
      } else {
        throw new Error(data.error || 'پاسخی دریافت نشد');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-err-' + Date.now(),
          sender: 'bot',
          text: 'متاسفانه در برقراری ارتباط با مشاور خطایی رخ داد. پیشنهاد می‌کنم محصولات کاتالوگ گیاهی را بررسی بفرمایید یا سوالتان را مجدداً ارسال نمایید.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Image Upload Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از ۸ مگابایت باشد.');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Execute Skin Analysis
  const handleAnalyzePhoto = async () => {
    if (!selectedImage || analyzing) return;

    setAnalyzing(true);
    setAnalysisResult(null);

    try {
      const catalogSummary = products.map((p) => ({
        id: p.id,
        nameFa: p.nameFa,
        nameEn: p.nameEn,
        descriptionFa: p.descriptionFa,
        price: p.price
      }));

      const res = await fetch('/api/advisor/analyze-skin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: imageFile?.type || 'image/jpeg',
          userNotes: userNote,
          catalogSummary
        })
      });

      const data = await res.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        setAnalysisProductIds(data.suggestedProductIds || []);

        // Also add result to chat thread for reference
        setMessages((prev) => [
          ...prev,
          {
            id: 'scan-' + Date.now(),
            sender: 'bot',
            text: `📊 **نتیجه آنالیز تصویر چهره:**\n\n${data.analysis}`,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
            suggestedProductIds: data.suggestedProductIds || [],
            isAnalysisResult: true
          }
        ]);
      } else {
        throw new Error(data.error || 'خطا در آنالیز تصویر');
      }
    } catch (err: any) {
      alert('خطا در پردازش تصویر: ' + (err.message || 'لطفاً دوباره تلاش کنید.'));
    } finally {
      setAnalyzing(false);
    }
  };

  const handleQuickAddToCart = (product: Product) => {
    const size = product.sizes?.[0] || { label: 'استاندارد', labelEn: 'Standard', price: product.price || 0 };
    onAddToCart(product, size, 1);
    setAddedProductMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedProductMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const renderSuggestedProducts = (productIds?: string[]) => {
    if (!productIds || productIds.length === 0) return null;

    const matchedProducts = products.filter((p) => productIds.includes(p.id));
    if (matchedProducts.length === 0) return null;

    return (
      <div className="mt-3.5 pt-3 border-t border-vara-line space-y-2.5">
        <div className="text-[11px] font-bold text-vara-rose-ink">
          <span>محصولات توصیه شده برای این روتین:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {matchedProducts.map((prod) => {
            const isAdded = addedProductMap[prod.id];
            const prodImg = prod.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop';
            const prodPrice = (prod.price || 0).toLocaleString('fa-IR');
            return (
              <div 
                key={prod.id}
                className="bg-white rounded-xl p-2.5 border border-vara-line shadow-xs flex items-center justify-between gap-2.5 hover:border-vara-tint-line transition-all"
              >
                <div 
                  className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                  onClick={() => onSelectProduct && onSelectProduct(prod)}
                >
                  <img 
                    src={prodImg} 
                    alt={prod.nameFa || 'محصول'}
                    className="w-11 h-11 object-cover rounded-lg bg-vara-surface shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-vara-ink truncate">{prod.nameFa || 'محصول'}</h4>
                    <p className="text-[11px] text-vara-rose-ink font-bold">
                      {prodPrice} <span className="text-[9px] font-normal text-vara-muted">تومان</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickAddToCart(prod)}
                  className={`p-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isAdded 
                      ? 'bg-vara-rose text-white'
                      : 'bg-white hover:bg-vara-tint text-vara-rose-ink hover:text-vara-rose-ink border border-vara-line'
                  }`}
                  title="افزودن به سبد خرید"
                >
                  {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Advisor Drawer / Modal */}
      {isOpen && (
        <Modal label="مشاور پوست ورا" onClose={onClose}
          className="fixed inset-0 z-50 flex items-end justify-end p-1.5 sm:p-4 md:p-6 bg-vara-ink/45 font-vazir">
          <div 
            id="ai-advisor-window"
            className={`pointer-events-auto relative z-10 bg-white rounded-t-[28px] sm:rounded-[28px] border border-vara-line shadow-vara-float flex flex-col transition-all duration-300 overflow-hidden w-full ${
              isExpanded 
                ? 'sm:w-[620px] h-[85dvh] max-h-[calc(100dvh-1rem)] sm:max-h-[min(680px,calc(100dvh-2rem))]' 
                : 'sm:w-[440px] h-[78dvh] max-h-[calc(100dvh-1rem)] sm:max-h-[min(540px,calc(100dvh-2rem))]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-white text-vara-ink px-5 py-3.5 flex flex-col justify-center border-b border-vara-line shrink-0">
              {/* Mobile Pull/Close Indicator */}
              <div 
                onClick={() => onClose()}
                className="w-10 h-1 bg-vara-line-strong hover:bg-vara-tint rounded-full mx-auto mb-2 cursor-pointer transition-colors sm:hidden"
                title="برای بستن لمس کنید"
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-vara-surface flex items-center justify-center text-vara-rose-ink border border-vara-line">
                    <MessageSquareHeart className="w-4 h-4 text-vara-rose-ink" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-vara-ink flex items-center gap-1.5">
                      مشاور هوشمند پوست
                    </h3>
                    <span className="text-[10px] text-vara-muted hidden sm:inline-block">مشاور تخصصی ورا بیوتی</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-vara-muted">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 hover:bg-vara-surface rounded-full transition-colors cursor-pointer hidden sm:flex items-center text-xs text-vara-muted hover:text-vara-rose-ink"
                    title={isExpanded ? 'کوچک‌نمایی' : 'بزرگ‌نمایی'}
                  >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onClose()}
                    className="p-1.5 sm:px-3 sm:py-1 bg-vara-surface hover:bg-vara-tint hover:text-vara-rose-ink text-vara-ink rounded-full transition-colors cursor-pointer flex items-center gap-1 border border-vara-line"
                    title="بستن (Esc)"
                    aria-label="بستن مشاور هوشمند"
                  >
                    <span className="text-xs font-semibold">بستن</span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs: Chat vs Vision Scan */}
            <div className="bg-vara-canvas p-1.5 border-b border-vara-line flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-vara-rose text-white shadow-xs'
                    : 'text-vara-muted hover:text-vara-rose-ink'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>گفت‌وگو و مشاوره پوستی</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('scan')}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'scan'
                    ? 'bg-vara-rose text-white shadow-xs'
                    : 'text-vara-muted hover:text-vara-rose-ink'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>آنالیز عکس چهره</span>
              </button>
            </div>

            {/* Personalized Skin Profile Banner */}
            {savedSkinProfile && (
              <div className="bg-vara-surface border-b border-vara-line px-3.5 py-1.5 flex items-center justify-between text-[11px] font-vazir text-vara-ink">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-vara-rose-ink">پروفایل متصل:</span>
                  <span className="font-serif italic font-medium">{savedSkinProfile.summaryLabelEn}</span>
                </div>
                <span className="text-[10px] text-vara-muted font-mono">
                  {savedSkinProfile.skinType} · {savedSkinProfile.primaryConcern}
                </span>
              </div>
            )}

            {/* Tab 1: Chat Mode */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col justify-between overflow-hidden bg-vara-canvas">
                
                {/* Messages Container */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                        msg.sender === 'user' 
                          ? 'bg-vara-rose text-white'
                          : 'bg-vara-surface text-vara-rose-ink border border-vara-line'
                      }`}>
                        {msg.sender === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      {/* Message Bubble */}
                      <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-vazir leading-relaxed text-right ${
                        msg.sender === 'user'
                          ? 'bg-vara-rose text-white rounded-tr-xs'
                          : 'bg-white text-vara-ink rounded-tl-xs border border-vara-line shadow-xs'
                      }`}>
                        <div className="whitespace-pre-line">
                          {msg.text}
                        </div>

                        {/* Suggested Products (if any) */}
                        {msg.sender === 'bot' && renderSuggestedProducts(msg.suggestedProductIds)}

                        <div className={`text-[10px] mt-1.5 opacity-60 text-left ${msg.sender === 'user' ? 'text-white' : 'text-vara-muted'}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Typing Indicator */}
                  {loading && (
                    <div className="flex gap-2.5 items-center text-right">
                      <div className="w-8 h-8 rounded-full bg-vara-surface text-vara-rose-ink border border-vara-line shrink-0 flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-white border border-vara-line rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-vara-tint animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-2 h-2 rounded-full bg-vara-tint animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-2 h-2 rounded-full bg-vara-rose animate-bounce"></span>
                        <span className="text-[11px] text-vara-muted mr-1.5 font-vazir">در حال بررسی کاتالوگ...</span>
                      </div>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Quick Prompts Carousel */}
                <div className="p-2.5 bg-white border-t border-vara-line shrink-0">
                  <p className="text-[10px] font-bold text-vara-muted mb-1.5 text-right">پیشنهادهای سریع:</p>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                    {quickPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(p.query)}
                        className="whitespace-nowrap bg-vara-canvas hover:bg-vara-surface text-vara-ink border border-vara-line px-2.5 py-1 rounded-full text-[11px] font-vazir font-semibold hover:border-vara-tint-line transition-colors shrink-0 cursor-pointer"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Footer */}
                <div className="p-3 bg-white border-t border-vara-line shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveTab('scan')}
                      className="p-2.5 rounded-full bg-vara-canvas text-vara-rose-ink hover:bg-vara-surface border border-vara-line transition-colors cursor-pointer"
                      title="آنالیز عکس پوست"
                    >
                      <Camera className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="نوع پوست، سوال یا دغدغه‌تان را بنویسید..."
                      className="flex-1 bg-vara-canvas border border-vara-line text-vara-ink text-xs font-vazir rounded-full px-3.5 py-2.5 focus:outline-none focus:border-vara-rose focus:bg-white transition-all text-right placeholder-vara-muted"
                    />

                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || loading}
                      className="p-2.5 rounded-full bg-vara-rose hover:bg-vara-rose-hover disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-2xs cursor-pointer"
                      title="ارسال"
                    >
                      <Send className="w-4 h-4 rotate-180" />
                    </button>
                  </form>
                </div>

              </div>
            )}

            {/* Tab 2: Skin Photo Scan Mode */}
            {activeTab === 'scan' && (
              <div className="flex-1 overflow-y-auto p-4 bg-vara-canvas space-y-4 text-right">
                
                {/* Intro Box */}
                <div className="bg-white p-4 rounded-2xl border border-vara-line shadow-xs space-y-2">
                  <div className="text-xs font-bold text-vara-rose-ink">
                    <span>آنالیز هوشمند تصویر چهره (AI Skin Vision)</span>
                  </div>
                  <p className="text-xs text-vara-muted-strong leading-relaxed font-vazir">
                    عکسی واضح و بدون آرایش از پوست صورت خود را آپلود کنید تا مدل هوش مصنوعی وضعیت هیدراتاسیون، منافذ و سد دفاعی پوست را بررسی و روتین مناسب را پیشنهاد دهد.
                  </p>
                </div>

                {/* Upload / Camera Box */}
                <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-vara-tint-line transition-all text-center">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />

                  {selectedImage ? (
                    <div className="space-y-3">
                      <div className="relative mx-auto max-w-[260px] aspect-square rounded-2xl overflow-hidden bg-vara-surface shadow-md">
                        <img
                          src={selectedImage}
                          alt="پوست انتخاب شده"
                          className="w-full h-full object-cover"
                        />
                        {analyzing && (
                          <div className="absolute inset-0 bg-vara-ink/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                            <RefreshCw className="w-8 h-8 text-vara-rose-ink animate-spin mb-2" />
                            <p className="text-xs font-bold font-vazir animate-pulse">در حال اسکن لایه‌های پوستی...</p>
                            <p className="text-[10px] text-white/80 mt-1">تطبیق با ترکیبات تخصصی</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-vazir text-vara-ink hover:bg-vara-surface bg-vara-canvas px-3 py-1.5 rounded-full border border-vara-line cursor-pointer"
                        >
                          تغییر تصویر
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImageFile(null);
                            setAnalysisResult(null);
                          }}
                          className="text-xs font-vazir text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="py-6 cursor-pointer space-y-3 flex flex-col items-center"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-vara-surface border border-vara-line flex items-center justify-center text-vara-rose-ink shadow-xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-vara-ink font-vazir">
                          کلیک کنید تا تصویر آپلود یا عکس گرفته شود
                        </p>
                        <p className="text-[11px] text-vara-muted mt-1 font-vazir">
                          فرمت‌های JPG، PNG (حداکثر ۸ مگابایت)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional User Notes */}
                {selectedImage && !analysisResult && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-vara-ink block">
                      توضیح یا دغدغه تکمیلی (اختیاری):
                    </label>
                    <input
                      type="text"
                      value={userNote}
                      onChange={(e) => setUserNote(e.target.value)}
                      placeholder="مثال: پوستم در فصل سرما پوسته پوسته می‌شود و احساس کشیدگی دارم..."
                      className="w-full bg-white border border-vara-line text-xs font-vazir rounded-full p-3 focus:outline-none focus:border-vara-rose"
                    />

                    <button
                      type="button"
                      onClick={handleAnalyzePhoto}
                      disabled={analyzing}
                      className="w-full mt-2 bg-vara-rose hover:bg-vara-rose-hover disabled:opacity-50 text-white font-bold text-xs font-vazir py-3 rounded-full transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {analyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>در حال آنالیز تصویر توسط هوش مصنوعی...</span>
                        </>
                      ) : (
                        <span>شروع آنالیز هوشمند پوست</span>
                      )}
                    </button>
                  </div>
                )}

                {/* Analysis Result Display */}
                {analysisResult && (
                  <div className="bg-white p-4 rounded-2xl border border-vara-line shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-vara-line pb-2.5">
                      <div className="text-xs font-bold text-vara-rose-ink">
                        <span>گزارش تخصصی آنالیز چهره</span>
                      </div>
                      <span className="text-[10px] bg-vara-surface px-2 py-0.5 rounded-full text-vara-rose-ink border border-vara-line">
                        تطبیق تخصصی پوست
                      </span>
                    </div>

                    <div className="text-xs font-vazir leading-relaxed text-vara-ink whitespace-pre-line space-y-2">
                      {analysisResult}
                    </div>

                    {/* Matched Products Recommendations */}
                    {renderSuggestedProducts(analysisProductIds)}

                    <div className="pt-2 border-t border-vara-line flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('chat');
                          setAnalysisResult(null);
                          setSelectedImage(null);
                        }}
                        className="text-xs text-vara-rose-ink font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>طرح سوال بیشتر در چت</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAnalysisResult(null);
                          setSelectedImage(null);
                          setImageFile(null);
                        }}
                        className="text-xs text-vara-muted hover:text-vara-ink cursor-pointer"
                      >
                        آنالیز عکس دیگر
                      </button>
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="p-3 bg-vara-surface rounded-xl border border-vara-line flex items-start gap-2 text-[11px] text-vara-muted font-vazir">
                  <Info className="w-4 h-4 text-vara-rose-ink shrink-0 mt-0.5" />
                  <p>
                    تحلیل‌های ارائه شده بر پایه راهنماهای مراقبت پوست است و جایگزین درمان‌های پزشکی تخصصی در موارد حاد پوستی نمی‌باشد.
                  </p>
                </div>

              </div>
            )}

          </div>
        </Modal>
      )}
    </>
  );
};
