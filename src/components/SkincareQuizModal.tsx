import { Modal } from './Modal';
import React, { useState, useEffect } from 'react';
import { 
  X, 
  ClipboardCheck, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  RefreshCw, 
  Sun, 
  Moon, 
  Bot, 
  Info,
  Droplets,
  Zap,
  Smile,
  ShieldAlert,
  ShieldCheck,
  Heart,
  Award,
  Layers,
  Feather,
  Check,
  HelpCircle,
  Clock,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  QUIZ_QUESTIONS, 
  generateSkinProfile, 
  saveSkinProfile, 
  getSavedSkinProfile,
  buildRoutineStepsByStyle,
  isSkinProfileStaleOrInvalid
} from '../data/quizData';
import { buildStepReasonFa, RoutineStepRole } from '../lib/routineEngine';
import { Product, ProductSize, UserSkinProfile, RoutineStepRecommendation } from '../types';

interface SkincareQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddMultipleToCart: (items: { product: Product; size: ProductSize }[]) => void;
}

export const SkincareQuizModal: React.FC<SkincareQuizModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddMultipleToCart,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [skinProfile, setSkinProfile] = useState<UserSkinProfile | null>(null);
  const [activeRoutineTab, setActiveRoutineTab] = useState<'morning' | 'night'>('morning');
  const [selectedRoutineStyle, setSelectedRoutineStyle] = useState<'minimal' | 'balanced' | 'complete'>('balanced');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [showUsageTips, setShowUsageTips] = useState(false);
  const [addedRoutineSuccess, setAddedRoutineSuccess] = useState(false);

  // Initialize selected products whenever skinProfile steps change
  const syncSelectedProducts = (profile: UserSkinProfile) => {
    const allIds = Array.from(new Set([
      ...profile.morningSteps.map(s => s.productId),
      ...profile.nightSteps.map(s => s.productId)
    ]));
    setSelectedProductIds(allIds);
  };

  // Load existing profile if available on open and auto-heal stale/broken cached steps
  useEffect(() => {
    if (isOpen) {
      const existing = getSavedSkinProfile();
      if (existing) {
        let resolvedProfile = existing;
        if (products.length > 0 && isSkinProfileStaleOrInvalid(existing, products)) {
          const style = existing.routineStyle || 'balanced';
          const { morningSteps, nightSteps } = buildRoutineStepsByStyle(
            style,
            existing.primaryConcern,
            existing.skinType,
            products,
            {
              sensitivityLevel: existing.sensitivityLevel,
              currentRoutine: existing.currentRoutine,
            }
          );
          resolvedProfile = {
            ...existing,
            morningSteps,
            nightSteps,
            recommendedProductIds: Array.from(
              new Set([
                ...morningSteps.map((s) => s.productId),
                ...nightSteps.map((s) => s.productId),
              ])
            ),
          };
          saveSkinProfile(resolvedProfile);
        }
        setSkinProfile(resolvedProfile);
        setSelectedRoutineStyle(resolvedProfile.routineStyle || 'balanced');
        syncSelectedProducts(resolvedProfile);
      }
      setAddedRoutineSuccess(false);
      setShowUsageTips(false);
    }
  }, [isOpen, products]);

  if (!isOpen) return null;

  const currentQuestion = QUIZ_QUESTIONS[currentStep];

  const handleSelectOption = (value: string) => {
    const updated = { ...answers, [currentQuestion.id]: value };
    setAnswers(updated);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all questions -> Generate Profile & recommended routine
      const computedProfile = generateSkinProfile(updated, products);
      setSkinProfile(computedProfile);
      setSelectedRoutineStyle(computedProfile.routineStyle || 'balanced');
      syncSelectedProducts(computedProfile);
      saveSkinProfile(computedProfile);
    }
  };

  // Allow user to switch routine style (minimal 3-step, balanced 4-step, complete 6-step)
  const handleChangeRoutineStyle = (style: 'minimal' | 'balanced' | 'complete') => {
    if (!skinProfile) return;
    setSelectedRoutineStyle(style);

    const { morningSteps, nightSteps } = buildRoutineStepsByStyle(
      style,
      skinProfile.primaryConcern,
      skinProfile.skinType,
      products,
      {
        sensitivityLevel: skinProfile.sensitivityLevel,
        currentRoutine: skinProfile.currentRoutine,
      }
    );

    const updatedProfile: UserSkinProfile = {
      ...skinProfile,
      routineStyle: style,
      morningSteps,
      nightSteps,
      recommendedProductIds: Array.from(new Set([
        ...morningSteps.map(s => s.productId),
        ...nightSteps.map(s => s.productId)
      ]))
    };

    setSkinProfile(updatedProfile);
    syncSelectedProducts(updatedProfile);
    saveSkinProfile(updatedProfile);
  };

  // Cycle to an alternative product for a given routine step
  const handleSwapStepAlternative = (
    e: React.MouseEvent,
    targetStep: RoutineStepRecommendation
  ) => {
    e.stopPropagation();
    if (!skinProfile || !targetStep.alternativeProductIds || targetStep.alternativeProductIds.length === 0) {
      return;
    }

    const candidates = targetStep.alternativeProductIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));
    if (candidates.length === 0) return;

    const nextProduct = candidates[0];
    const remainingAlts = [
      ...targetStep.alternativeProductIds.filter((id) => id !== nextProduct.id),
      targetStep.productId,
    ];
    const stepRole = (targetStep.role || 'serum') as RoutineStepRole;
    const updatedReasonFa = buildStepReasonFa(
      nextProduct,
      stepRole,
      skinProfile.skinType,
      skinProfile.primaryConcern
    );

    const updateList = (list: RoutineStepRecommendation[]) =>
      list.map((s) => {
        const isTarget =
          (s.timeOfDay === targetStep.timeOfDay && s.stepNumber === targetStep.stepNumber) ||
          (targetStep.role && s.role === targetStep.role);
        if (!isTarget) return s;
        return {
          ...s,
          productId: nextProduct.id,
          product: nextProduct,
          reasonFa: updatedReasonFa,
          alternativeProductIds: remainingAlts,
        };
      });

    const morningSteps = updateList(skinProfile.morningSteps);
    const nightSteps = updateList(skinProfile.nightSteps);
    const updatedProfile: UserSkinProfile = {
      ...skinProfile,
      morningSteps,
      nightSteps,
      recommendedProductIds: Array.from(
        new Set([
          ...morningSteps.map((s) => s.productId),
          ...nightSteps.map((s) => s.productId),
        ])
      ),
    };

    setSkinProfile(updatedProfile);
    syncSelectedProducts(updatedProfile);
    saveSkinProfile(updatedProfile);
  };

  // Toggle selection of a specific product in routine
  const handleToggleProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAllProducts = () => {
    if (!skinProfile) return;
    const allIds = Array.from(new Set([
      ...skinProfile.morningSteps.map(s => s.productId),
      ...skinProfile.nightSteps.map(s => s.productId)
    ]));
    setSelectedProductIds(allIds);
  };

  const handleDeselectAllProducts = () => {
    setSelectedProductIds([]);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setSkinProfile(null);
    setSelectedProductIds([]);
    setAddedRoutineSuccess(false);
    setShowUsageTips(false);
  };

  // Add only the user-selected routine products to cart
  const handleAddSelectedRoutineToCart = () => {
    if (!skinProfile || selectedProductIds.length === 0) return;

    const itemsToAdd: { product: Product; size: ProductSize }[] = [];

    selectedProductIds.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        itemsToAdd.push({
          product,
          size: (product.sizes && product.sizes.length > 0)
            ? product.sizes[0]
            : { label: 'سایز استاندارد', labelEn: 'Standard Size', price: product.price || 0 }
        });
      }
    });

    onAddMultipleToCart(itemsToAdd);
    setAddedRoutineSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1300);
  };

  const handleOpenAIChat = () => {
    onClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('vara-open-ai-advisor'));
    }, 150);
  };

  // Compute subtotal and discount for selected routine
  const selectedProductsList = products.filter(p => selectedProductIds.includes(p.id));
  const rawSubtotal = selectedProductsList.reduce((acc, p) => acc + (p.price || 0), 0);
  const bundleDiscount = selectedProductsList.length >= 3 ? Math.round(rawSubtotal * 0.1) : 0; // 10% discount for 3+ routine items
  const finalRoutinePrice = rawSubtotal - bundleDiscount;

  // Helper for rendering icons
  const renderOptionIcon = (name?: string) => {
    switch (name) {
      case 'Droplets': return <Droplets className="w-4 h-4 text-vara-rose-ink" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'Smile': return <Smile className="w-4 h-4 text-emerald-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-rose-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-vara-rose-ink" />;
      case 'Heart': return <Heart className="w-4 h-4 text-vara-rose-ink" />;
      case 'Award': return <Award className="w-4 h-4 text-vara-rose-ink" />;
      case 'Layers': return <Layers className="w-4 h-4 text-vara-rose-ink" />;
      case 'Feather': return <Feather className="w-4 h-4 text-vara-rose-ink" />;
      default: return <CheckCircle2 className="w-4 h-4 text-vara-rose-ink" />;
    }
  };

  const activeSteps: RoutineStepRecommendation[] = skinProfile
    ? (activeRoutineTab === 'morning' ? skinProfile.morningSteps : skinProfile.nightSteps)
    : [];

  return (
    <Modal label="راهنمای انتخاب روتین" onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-vara-ink/45 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white w-full max-w-3xl rounded-[28px] border border-vara-line overflow-hidden shadow-shop-elevated p-5 sm:p-7 relative text-right my-6 max-h-[92vh] flex flex-col font-vazir"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 hover:bg-vara-surface rounded-full text-vara-muted hover:text-vara-rose-ink transition-colors cursor-pointer z-10"
          aria-label="بستن طراحی روتین"
        >
          <X className="w-5 h-5" />
        </button>

        {!skinProfile ? (
          /* Step Questions Screen */
          <div className="flex-1 overflow-y-auto pr-1">
            {/* Quiz Header */}
            <div className="flex items-center gap-2 text-xs font-semibold text-vara-rose-ink font-jakarta mb-1">
              <ClipboardCheck className="w-4 h-4 text-vara-rose-ink" />
              <span>طراحی روتین پوست</span>
            </div>

            <p className="text-xs text-vara-muted mb-4">
              با ۵ سوال کوتاه، روتین استاندارد و سازگار صبح و شب مخصوص پوست خود را بسازید.
            </p>

            {/* Progress Step Bar */}
            <div className="w-full bg-vara-surface border border-vara-line h-2 rounded-full mb-4 overflow-hidden">
              <div
                className="bg-vara-rose h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Step Counter */}
            <div className="flex items-center justify-between text-xs text-vara-muted mb-3">
              <span>گام {currentStep + 1} از {QUIZ_QUESTIONS.length}</span>
              <span className="text-[11px]">تشخیص نیاز روتین روزانه</span>
            </div>

            {/* Question Title */}
            <h2 className="text-lg sm:text-2xl font-bold text-vara-ink mb-1 leading-snug">
              {currentQuestion.titleFa}
            </h2>
            <p className="text-xs sm:text-sm text-vara-muted mb-5">
              {currentQuestion.subtitleFa}
            </p>

            {/* Question Options */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(option.value)}
                    className={`w-full text-right p-3.5 sm:p-4 rounded-[20px] border transition-all flex items-start gap-3 group cursor-pointer ${
                      isSelected 
                        ? 'bg-vara-canvas border-vara-rose shadow-shop-pill ring-1 ring-vara-rose'
                        : 'bg-white hover:bg-vara-canvas border-vara-line hover:border-vara-tint-line'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-vara-rose text-white shadow-shop-violet' : 'bg-vara-surface text-vara-rose-ink border border-vara-line'
                    }`}>
                      {renderOptionIcon(option.iconName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs sm:text-sm text-vara-ink">
                          {option.labelFa}
                        </h3>
                        <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center shrink-0 mr-2 ${
                          isSelected ? 'border-vara-rose bg-vara-rose' : 'border-vara-line group-hover:border-vara-tint-line'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      {option.subtitleFa && (
                        <p className="text-[11px] sm:text-xs text-vara-muted mt-1 leading-relaxed">
                          {option.subtitleFa}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer Navigation */}
            {currentStep > 0 && (
              <div className="mt-5 pt-3 border-t border-vara-line flex justify-start">
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-xs text-vara-muted hover:text-vara-rose-ink flex items-center gap-1.5 cursor-pointer font-bold px-3 py-1.5 rounded-full hover:bg-vara-surface transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>سوال قبلی</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Result & Routine Selection Screen */
          <div className="flex-1 flex flex-col overflow-hidden space-y-4 animate-fadeIn">
            {/* Header Result Badge */}
            <div className="bg-vara-rose text-white p-5 rounded-[24px] text-center space-y-2 shadow-shop-violet relative overflow-hidden shrink-0">
              <div className="inline-flex items-center bg-white/20 border border-white/30 px-3 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-sm text-white">
                <span>بهترین روتین متناسب با پوست شما شناسایی شد</span>
              </div>

              {/* Skin Profile Headline */}
              <div>
                <h2 className="text-base sm:text-xl font-bold text-white">
                  {skinProfile.routineGoalTitleFa || 'روتین تخصصی مراقبت پوست'}
                </h2>
                <p className="text-[11px] sm:text-xs text-white/85 mt-1">
                  {skinProfile.summaryLabelFa}
                </p>
              </div>
            </div>

            {/* Routine Style Selector (Minimal vs Balanced vs Complete) */}
            <div className="bg-vara-canvas border border-vara-line p-3.5 rounded-[24px] shrink-0">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-vara-ink">
                  <span>سطح روتین مورد نظرتان را انتخاب کنید:</span>
                </span>
                <span className="text-[11px] text-vara-muted hidden sm:inline">
                  امکان شخصی‌سازی مراحل در پایین
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleChangeRoutineStyle('minimal')}
                  className={`p-2.5 rounded-[18px] text-center transition-all cursor-pointer border ${
                    selectedRoutineStyle === 'minimal'
                      ? 'bg-vara-rose text-white border-vara-rose shadow-shop-pill'
                      : 'bg-white text-vara-ink border-vara-line hover:border-vara-tint-line'
                  }`}
                >
                  <div className="text-xs font-bold">روتین ۳ مرحله‌ای</div>
                  <div className="text-[10px] opacity-80 mt-0.5">سریع و اقتصادی (۲ دقیقه)</div>
                </button>

                <button
                  onClick={() => handleChangeRoutineStyle('balanced')}
                  className={`p-2.5 rounded-[18px] text-center transition-all cursor-pointer border relative ${
                    selectedRoutineStyle === 'balanced'
                      ? 'bg-vara-rose text-white border-vara-rose shadow-shop-pill'
                      : 'bg-white text-vara-ink border-vara-line hover:border-vara-tint-line'
                  }`}
                >
                  <div className="text-xs font-bold">روتین ۴ مرحله‌ای</div>
                  <div className="text-[10px] opacity-80 mt-0.5">پیشنهاد هوشمند (استاندارد)</div>
                </button>

                <button
                  onClick={() => handleChangeRoutineStyle('complete')}
                  className={`p-2.5 rounded-[18px] text-center transition-all cursor-pointer border ${
                    selectedRoutineStyle === 'complete'
                      ? 'bg-vara-rose text-white border-vara-rose shadow-shop-pill'
                      : 'bg-white text-vara-ink border-vara-line hover:border-vara-tint-line'
                  }`}
                >
                  <div className="text-xs font-bold">روتین ۶ مرحله‌ای</div>
                  <div className="text-[10px] opacity-80 mt-0.5">کامل و تخصصی شب و روز</div>
                </button>
              </div>
            </div>

            {/* Routine Tabs Header (Morning vs Night) & Quick Selection Tools */}
            <div className="flex items-center justify-between flex-wrap gap-2 shrink-0">
              <div className="flex items-center bg-vara-surface border border-vara-line p-1 rounded-full gap-1">
                <button
                  onClick={() => setActiveRoutineTab('morning')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeRoutineTab === 'morning'
                      ? 'bg-vara-rose text-white shadow-shop-pill'
                      : 'text-vara-muted hover:text-vara-ink'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>روتین صبح ({skinProfile.morningSteps.length} مرحله)</span>
                </button>
                <button
                  onClick={() => setActiveRoutineTab('night')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeRoutineTab === 'night'
                      ? 'bg-vara-rose text-white shadow-shop-pill'
                      : 'text-vara-muted hover:text-vara-ink'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-vara-tint" />
                  <span>روتین شب ({skinProfile.nightSteps.length} مرحله)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <button
                  onClick={handleSelectAllProducts}
                  className="text-vara-ink hover:text-vara-rose-ink cursor-pointer font-medium"
                >
                  انتخاب همه
                </button>
                <span className="text-vara-line">|</span>
                <button
                  onClick={handleDeselectAllProducts}
                  className="text-vara-muted hover:text-vara-ink cursor-pointer font-medium"
                >
                  لغو انتخاب‌ها
                </button>
                <span className="text-vara-line">|</span>
                <button
                  onClick={() => setShowUsageTips(!showUsageTips)}
                  className="text-vara-rose-ink hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>راهنمای مصرف</span>
                </button>
              </div>
            </div>

            {/* Routine Application Tips Callout (Collapsible) */}
            {showUsageTips && skinProfile.usageTipsFa && (
              <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl text-xs font-vazir text-vara-ink space-y-1.5 shrink-0 animate-fadeIn">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>راهنمای ترتیب و نحوه استفاده اصولی از این روتین:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-950/80 leading-relaxed pr-1">
                  {skinProfile.usageTipsFa.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Routine Steps List with Selection Checkboxes */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[160px]">
              {activeSteps.map((step) => {
                const product = products.find((p) => p.id === step.productId) || step.product;
                if (!product) return null;
                const isSelected = selectedProductIds.includes(product.id);

                return (
                  <div 
                    key={step.stepNumber}
                    onClick={() => handleToggleProduct(product.id)}
                    className={`bg-white p-3.5 rounded-[20px] border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-3.5 ${
                      isSelected 
                        ? 'border-vara-rose shadow-shop-card bg-white ring-1 ring-vara-rose'
                        : 'border-vara-line opacity-75 hover:opacity-100 hover:border-vara-tint-line'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected 
                          ? 'bg-vara-rose border-vara-rose text-white shadow-shop-violet'
                          : 'border-vara-line bg-white text-transparent'
                      }`}>
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>

                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[14px] overflow-hidden bg-vara-surface shrink-0 border border-vara-line">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'}
                          alt={product.nameFa || 'محصول'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    {/* Step Details & Why this product callout */}
                    <div className="flex-1 min-w-0 space-y-1 w-full text-right">
                      <div className="flex items-center justify-between flex-wrap gap-1.5">
                        <span className="text-xs font-semibold text-vara-rose-ink font-jakarta">
                          {step.stepTitleFa}
                        </span>
                        <span className="text-xs font-bold text-vara-ink font-jakarta">
                          {(product.price || 0).toLocaleString('fa-IR')} تومان
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-vara-ink truncate">
                          {product.nameFa}
                        </h4>
                        {step.alternativeProductIds && step.alternativeProductIds.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => handleSwapStepAlternative(e, step)}
                            className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold text-vara-rose-ink bg-vara-surface hover:bg-vara-tint px-2 py-0.5 rounded-full border border-vara-line transition-colors cursor-pointer"
                            title="نمایش محصول جایگزین متناسب با این مرحله"
                          >
                            <RefreshCw className="w-2.5 h-2.5" />
                            <span>پیشنهاد جایگزین</span>
                          </button>
                        )}
                      </div>

                      {/* Why this product badge */}
                      <div className="bg-vara-canvas p-2.5 rounded-[14px] border border-vara-line text-[10px] sm:text-[11px] text-vara-muted flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-vara-rose-ink shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                          <strong className="text-vara-ink font-bold">دلیل انتخاب در روتین شما: </strong>
                          <span>{step.reasonFa}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions & Price Summary */}
            <div className="pt-3 border-t border-vara-line flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2 rounded-full text-xs text-vara-muted hover:text-vara-ink hover:bg-vara-surface flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>طراحی مجدد روتین</span>
                </button>

                <button
                  onClick={handleOpenAIChat}
                  className="px-3.5 py-2 rounded-full text-xs text-vara-ink bg-white border border-vara-line hover:border-vara-tint-line shadow-shop-pill flex items-center gap-1.5 cursor-pointer font-bold transition-all"
                >
                  <Bot className="w-3.5 h-3.5 text-vara-rose-ink" />
                  <span>مشاوره هوشمند AI</span>
                </button>
              </div>

              {/* Price & Add to Cart button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="text-right">
                  <div className="text-[11px] text-vara-muted">
                    {selectedProductIds.length > 0 
                      ? `${selectedProductIds.length} محصول انتخاب شده`
                      : 'محصولی انتخاب نشده'}
                  </div>
                  {selectedProductIds.length > 0 && (
                    <div className="text-xs font-bold text-vara-ink font-jakarta">
                      {bundleDiscount > 0 && (
                        <span className="line-through text-vara-muted text-[10px] ml-1.5 font-normal">
                          {rawSubtotal.toLocaleString('fa-IR')}
                        </span>
                      )}
                      <span>{finalRoutinePrice.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddSelectedRoutineToCart}
                  disabled={selectedProductIds.length === 0 || addedRoutineSuccess}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold shadow-shop-violet flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                    selectedProductIds.length === 0
                      ? 'bg-vara-line text-vara-muted cursor-not-allowed shadow-none'
                      : addedRoutineSuccess
                      ? 'bg-[#15803D] text-white'
                      : 'bg-vara-rose hover:bg-vara-rose-hover text-white'
                  }`}
                >
                  {addedRoutineSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>محصولات به سبد خرید افزوده شد!</span>
                    </>
                  ) : (
                    <span>افزودن روتین انتخابی به سبد</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
