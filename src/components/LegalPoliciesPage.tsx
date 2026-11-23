import { Modal } from './Modal';
import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  RotateCcw,
  X,
  Phone,
  ChevronLeft,
} from 'lucide-react';
import { POLICY_DOCUMENTS, PolicyDocumentType } from '../data/policies';

interface LegalPoliciesPageProps {
  activePolicy: PolicyDocumentType;
  onSwitchPolicy: (policy: PolicyDocumentType) => void;
  onBackToHome: () => void;
  onNavigateToContact: () => void;
  onNavigateToProfile: () => void;
}

export const LegalPoliciesPage: React.FC<LegalPoliciesPageProps> = ({
  activePolicy,
  onSwitchPolicy,
  onBackToHome,
  onNavigateToContact,
  onNavigateToProfile,
}) => {
  const doc = POLICY_DOCUMENTS[activePolicy];
  const [activeArticleId, setActiveArticleId] = useState<string>(doc.articles[0]?.id || '');

  const handleJumpToArticle = (articleId: string) => {
    setActiveArticleId(articleId);
    const el = document.getElementById(`policy-article-${articleId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F9F1F0] text-[#23191E] font-vazir pt-28 pb-24 px-4 sm:px-6 lg:px-10"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navigation & Policy Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0E1E4]">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#785E67] hover:text-[#8C3B58] transition-colors cursor-pointer group self-start whitespace-nowrap shrink-0"
          >
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            <span>بازگشت به صفحه اصلی</span>
          </button>

          {/* Segmented Legal Document Switcher */}
          <div
            role="tablist"
            aria-label="اسناد حقوقی ورا بیوتی"
            className="inline-flex items-center p-1 bg-white border border-[#F0E1E4] rounded-xl gap-1 self-start sm:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activePolicy === 'return-policy'}
              onClick={() => {
                onSwitchPolicy('return-policy');
                setActiveArticleId(POLICY_DOCUMENTS['return-policy'].articles[0]?.id || '');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activePolicy === 'return-policy'
                  ? 'bg-[#8C3B58] text-white'
                  : 'text-[#5C444D] hover:text-[#23191E] hover:bg-[#F9F1F0]'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>شرایط بازگشت و استرداد وجه</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activePolicy === 'terms'}
              onClick={() => {
                onSwitchPolicy('terms');
                setActiveArticleId(POLICY_DOCUMENTS.terms.articles[0]?.id || '');
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activePolicy === 'terms'
                  ? 'bg-[#8C3B58] text-white'
                  : 'text-[#5C444D] hover:text-[#23191E] hover:bg-[#F9F1F0]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>قوانین و مقررات خرید</span>
            </button>
          </div>
        </div>

        {/* Document Header */}
        <header className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#785E67]">
            <span className="font-semibold text-[#8C3B58]">اسناد رسمی ورا بیوتی</span>
            <span aria-hidden="true">·</span>
            <span className="font-jakarta tabular-nums">{doc.lastUpdatedFa}</span>
            <span aria-hidden="true">·</span>
            <span>{doc.effectiveScope}</span>
          </div>

          <h1 className="vara-shop-title">
            {doc.heading}
          </h1>
        </header>

        {/* Main 2-Column Reading Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sticky Table of Contents Rail */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-5">
            <div className="bg-white border border-[#F0E1E4] rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="pb-3 border-b border-[#F0E1E4]">
                <h2 className="text-sm font-bold text-[#23191E]">فهرست مواد قانونی</h2>
                <p className="text-[11px] text-[#785E67] mt-1">
                  برای مطالعه هر بخش روی عنوان مورد نظر کلیک کنید
                </p>
              </div>

              <nav aria-label="فهرست مواد" className="space-y-1">
                {doc.articles.map((article) => {
                  const isActive = activeArticleId === article.id;
                  return (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => handleJumpToArticle(article.id)}
                      className={`w-full text-right px-3 py-2.5 rounded-xl text-xs transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#F9F1F0] text-[#8C3B58] font-bold'
                          : 'text-[#5C444D] hover:bg-[#FDFBF9] hover:text-[#23191E]'
                      }`}
                    >
                      <span className="leading-relaxed">
                        <span className="font-jakarta tabular-nums ml-1.5 text-[#8C3B58]">
                          {article.number}:
                        </span>
                        {article.title}
                      </span>
                      <ChevronLeft className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Support & Claim Submission Card */}
            <div className="bg-white border border-[#F0E1E4] rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#8C3B58]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <h3 className="text-xs font-bold text-[#23191E]">ثبت درخواست لغو یا ارسال ویدیو</h3>
              </div>
              <p className="text-xs text-[#5C444D] leading-relaxed">
                جهت ثبت درخواست لغو در بازه ۴ ساعته سفارش‌های بین‌المللی یا ارسال فیلم آنباکسینگ ظرف ۲۴ ساعت از تحویل، از طریق پشتیبانی اقدام نمایید.
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={onNavigateToContact}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#8C3B58] hover:bg-[#732E47] text-white text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>ارتباط با پشتیبانی و ارسال مستندات</span>
                </button>
                <button
                  type="button"
                  onClick={onNavigateToProfile}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#F9F1F0] hover:bg-[#F5E6EB] text-[#23191E] border border-[#F0E1E4] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  مشاهده و پیگیری سفارش‌های من
                </button>
              </div>
            </div>
          </aside>

          {/* Main Articles Prose Column */}
          <article aria-label="متن سیاست فروشگاه" className="lg:col-span-8 bg-white border border-[#F0E1E4] rounded-2xl p-6 sm:p-10">
            <div className="divide-y divide-[#F0E1E4]">
              {doc.articles.map((article, index) => (
                <article
                  key={article.id}
                  id={`policy-article-${article.id}`}
                  className={`scroll-mt-28 ${index === 0 ? 'pb-8' : 'py-8'} ${
                    index === doc.articles.length - 1 ? 'pb-2' : ''
                  } space-y-4`}
                >
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[#8C3B58] font-jakarta tabular-nums block">
                      {article.number}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#23191E] leading-snug">
                      {article.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#785E67] leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <ul className="space-y-3 text-sm sm:text-[15px] text-[#23191E] leading-[1.85]">
                    {article.clauses.map((clause, cIdx) => (
                      <li key={cIdx} className="flex items-start gap-2.5">
                        <span className="font-jakarta tabular-nums text-xs font-bold text-[#8C3B58] mt-1.5 shrink-0">
                          {index + 1}.{cIdx + 1}
                        </span>
                        <span className="text-[#3C2C33]">{clause}</span>
                      </li>
                    ))}
                  </ul>

                  {article.criticalNote && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#FDF5F7] border border-[#E8C5D0] text-xs sm:text-sm text-[#6E233D] flex items-start gap-2.5 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-[#8C3B58] shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold ml-1">تذکر مهم:</strong>
                        {article.criticalNote}
                      </span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

interface PolicyReaderModalProps {
  policyType: PolicyDocumentType | null;
  onClose: () => void;
  onSwitchPolicy: (policy: PolicyDocumentType) => void;
}

export const PolicyReaderModal: React.FC<PolicyReaderModalProps> = ({
  policyType,
  onClose,
  onSwitchPolicy,
}) => {
  if (!policyType) return null;
  const doc = POLICY_DOCUMENTS[policyType];

  return (
    <Modal label="قوانین خرید و بازگشت کالا" onClose={onClose}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-[#23191E]/60 backdrop-blur-xs font-vazir"
    >
      <div
        className="bg-white w-full max-w-3xl max-h-[88vh] rounded-2xl border border-[#F0E1E4] shadow-xl flex flex-col overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#F0E1E4] bg-[#F9F1F0] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onSwitchPolicy('return-policy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                policyType === 'return-policy'
                  ? 'bg-[#8C3B58] text-white'
                  : 'bg-white text-[#5C444D] border border-[#F0E1E4] hover:text-[#23191E]'
              }`}
            >
              شرایط بازگشت و استرداد وجه
            </button>
            <button
              type="button"
              onClick={() => onSwitchPolicy('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                policyType === 'terms'
                  ? 'bg-[#8C3B58] text-white'
                  : 'bg-white text-[#5C444D] border border-[#F0E1E4] hover:text-[#23191E]'
              }`}
            >
              قوانین و مقررات خرید
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="w-8 h-8 rounded-lg bg-white border border-[#F0E1E4] flex items-center justify-center text-[#785E67] hover:text-[#23191E] cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          <div className="space-y-1.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#23191E]">{doc.heading}</h3>
            <p className="text-xs sm:text-sm text-[#785E67] leading-relaxed">{doc.subtitle}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {doc.highlights.map((h, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#FDFBF9] border border-[#F0E1E4] space-y-0.5">
                <div className="text-sm font-bold text-[#8C3B58] font-jakarta tabular-nums">
                  {h.value}
                </div>
                <div className="text-[11px] font-bold text-[#23191E]">{h.label}</div>
              </div>
            ))}
          </div>

          <div className="divide-y divide-[#F0E1E4]">
            {doc.articles.map((article, idx) => (
              <div key={article.id} className={idx === 0 ? 'pb-5 space-y-2.5' : 'py-5 space-y-2.5'}>
                <h4 className="text-sm font-bold text-[#23191E]">
                  <span className="text-[#8C3B58] font-jakarta ml-1.5">{article.number}:</span>
                  {article.title}
                </h4>
                <ul className="space-y-2 text-xs sm:text-[13px] text-[#3C2C33] leading-relaxed">
                  {article.clauses.map((clause, cIdx) => (
                    <li key={cIdx} className="flex items-start gap-2">
                      <span className="font-jakarta tabular-nums text-[11px] font-bold text-[#8C3B58] mt-0.5 shrink-0">
                        {idx + 1}.{cIdx + 1}
                      </span>
                      <span>{clause}</span>
                    </li>
                  ))}
                </ul>
                {article.criticalNote && (
                  <div className="p-3 rounded-xl bg-[#FDF5F7] border border-[#E8C5D0] text-xs text-[#6E233D] flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-[#8C3B58] shrink-0 mt-0.5" />
                    <span>{article.criticalNote}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-[#F0E1E4] bg-[#FDFBF9] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#8C3B58] hover:bg-[#732E47] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            متوجه شدم و بازگشت به ادامه سفارش
          </button>
        </div>
      </div>
    </Modal>
  );
};
