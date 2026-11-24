import { Modal } from './Modal';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Cloud,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Search,
  Folder,
  Image as ImageIcon,
  Activity,
  Zap,
  ArrowUpRight,
  Filter,
  Layers,
  Database,
  Info,
  ShieldCheck
} from 'lucide-react';

export interface BlobFileItem {
  url: string;
  rawUrl?: string;
  pathname: string;
  size: number;
  sizeFormatted: string;
  uploadedAt: string;
  downloadUrl?: string;
  isPrivate?: boolean;
}

export interface BlobFolderStat {
  folder: string;
  count: number;
  sizeBytes: number;
  sizeFormatted: string;
  percentage: number;
}

export interface BlobDiagnosticsData {
  configured: boolean;
  provider: 'vercel-blob' | 'inline-fallback';
  isPrivateStore?: boolean;
  totalBlobs: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  foldersBreakdown: BlobFolderStat[];
  recentBlobs: BlobFileItem[];
  checkedAt: string;
  error?: string;
}

interface AdminStorageDiagnosticsProps {
  onBackToProducts?: () => void;
}

export const AdminStorageDiagnostics: React.FC<AdminStorageDiagnosticsProps> = ({
  onBackToProducts
}) => {
  const [data, setData] = useState<BlobDiagnosticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [testUploading, setTestUploading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const [deleteConfirmBlob, setDeleteConfirmBlob] = useState<BlobFileItem | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  // Fetch diagnostics
  const fetchDiagnostics = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/upload/diagnostics?limit=200');
      const json = await res.json();

      if (json.success !== false) {
        setData({
          configured: Boolean(json.configured),
          provider: json.provider || 'vercel-blob',
          totalBlobs: json.totalBlobs || 0,
          totalSizeBytes: json.totalSizeBytes || 0,
          totalSizeFormatted: json.totalSizeFormatted || '0 B',
          foldersBreakdown: json.foldersBreakdown || [],
          recentBlobs: json.recentBlobs || [],
          checkedAt: json.checkedAt || new Date().toISOString(),
          error: json.error,
        });
      } else {
        setData({
          configured: false,
          provider: 'vercel-blob',
          totalBlobs: 0,
          totalSizeBytes: 0,
          totalSizeFormatted: '0 B',
          foldersBreakdown: [],
          recentBlobs: [],
          checkedAt: new Date().toISOString(),
          error: json.error || 'خطا در ارتباط با سرور',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch storage diagnostics:', err);
      setData({
        configured: false,
        provider: 'vercel-blob',
        totalBlobs: 0,
        totalSizeBytes: 0,
        totalSizeFormatted: '0 B',
        foldersBreakdown: [],
        recentBlobs: [],
        checkedAt: new Date().toISOString(),
        error: err?.message || 'خطا در برقراری ارتباط با سرویس ابری',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagnostics();
  }, [fetchDiagnostics]);

  // Run live end-to-end test upload
  const handleTestUpload = async () => {
    setTestUploading(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/upload/test', {
        method: 'POST',
      });
      const result = await res.json();

      if (result.success) {
        setTestResult({
          success: true,
          message: 'آزمون موفقیت‌آمیز بود! تصویر تستی در پوشه diagnostics آپلود شد.',
        });
        // Refresh diagnostics
        await fetchDiagnostics(true);
      } else {
        setTestResult({
          success: false,
          message: result.error || 'آزمون با خطا مواجه شد.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'خطا در اتصال به سرور جهت آزمون',
      });
    } finally {
      setTestUploading(false);
      // Auto-clear test result message after 6 seconds
      setTimeout(() => {
        setTestResult(null);
      }, 6000);
    }
  };

  // Copy CDN URL to clipboard
  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2500);
  };

  // Delete Blob file
  const handleDeleteBlob = async (blob: BlobFileItem) => {
    setDeletingUrl(blob.url);
    try {
      const res = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: blob.url }),
      });
      const result = await res.json();

      if (result.success) {
        // Remove locally from state for immediate UI update
        setData((prev) => {
          if (!prev) return null;
          const filteredBlobs = prev.recentBlobs.filter((b) => b.url !== blob.url);
          const newTotalBytes = Math.max(0, prev.totalSizeBytes - blob.size);
          return {
            ...prev,
            totalBlobs: Math.max(0, prev.totalBlobs - 1),
            totalSizeBytes: newTotalBytes,
            recentBlobs: filteredBlobs,
          };
        });
        setDeleteConfirmBlob(null);
      } else {
        alert(result.error || 'خطا در حذف فایل از Vercel Blob');
      }
    } catch (err: any) {
      alert(err?.message || 'خطا در برقراری ارتباط جهت حذف فایل');
    } finally {
      setDeletingUrl(null);
    }
  };

  // Filtered files list
  const filteredBlobs = useMemo(() => {
    if (!data?.recentBlobs) return [];

    return data.recentBlobs.filter((blob) => {
      const matchesSearch =
        !searchTerm.trim() ||
        blob.pathname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blob.url.toLowerCase().includes(searchTerm.toLowerCase());

      const folder = blob.pathname.includes('/') ? blob.pathname.split('/')[0] : 'root';
      const matchesFolder = selectedFolder === 'all' || folder === selectedFolder;

      return matchesSearch && matchesFolder;
    });
  }, [data?.recentBlobs, searchTerm, selectedFolder]);

  // Folder helper labels
  const getFolderLabel = (folder: string) => {
    switch (folder) {
      case 'products':
        return 'محصولات (Products)';
      case 'hero_banners':
      case 'banners':
        return 'بنرهای هیرو (Banners)';
      case 'receipts':
        return 'رسیدهای پرداخت (Receipts)';
      case 'diagnostics':
        return 'آزمون و تست (Diagnostics)';
      default:
        return folder;
    }
  };

  // Format Persian date & time
  const formatUploadDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('fa-IR', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 text-right font-vazir" dir="rtl">
      {/* Top Banner: Status & Refresh */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-vara-line/30">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
                data?.configured
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {data?.configured ? (
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <HardDrive className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-lg font-black text-vara-muted-strong">
                  وضعیت فضای ذخیره‌سازی ابری (Vercel Blob)
                </h2>
                {data?.configured ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>متصل و فعال</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-200">
                    <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>نیازمند تنظیم توکن ورسل</span>
                  </span>
                )}

                {data?.isPrivateStore && (
                  <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold border border-indigo-200" title="استور اختصاصی امن همراه با پروکسی استریم خودکار سرور">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>استور اختصاصی (Private)</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-vara-muted-strong/70 mt-1">
                مدیریت زنده فضای ابری تصاویر محصولات، اسلایدرها و رسیدهای پرداخت در شبکه CDN ورسل
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            {/* Live Test Probe Upload Button */}
            <button
              onClick={handleTestUpload}
              disabled={testUploading || !data?.configured}
              className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3.5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              title="آپلود یک فایل تستی کوچک برای بررسی فوری دسترسی نوشتن به سرور ابری"
            >
              <Zap className={`w-4 h-4 ${testUploading ? 'animate-bounce' : ''}`} />
              <span>{testUploading ? 'در حال آزمون...' : 'تست آپلود زنده'}</span>
            </button>

            {/* Refresh Diagnostics */}
            <button
              onClick={() => fetchDiagnostics(true)}
              disabled={refreshing || loading}
              className="bg-vara-surface hover:bg-white text-vara-muted-strong border border-vara-line/60 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="بروزرسانی اطلاعات و لیست فایل‌ها"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>بروزرسانی</span>
            </button>

            {/* Vercel Dashboard Direct Link */}
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-vara-surface text-vara-muted-strong border border-vara-line/60 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>داشبورد Vercel</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-vara-muted" />
            </a>
          </div>
        </div>

        {/* Live Test Result Toast Banner */}
        {testResult && (
          <div
            className={`mt-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-fadeIn ${
              testResult.success
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Files Card */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-vara-line/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-vara-muted-strong/70 text-xs">
            <span>تعداد کل فایل‌های ابری</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-vara-muted-strong font-jakarta">
              {loading ? '...' : (data?.totalBlobs || 0).toLocaleString('fa-IR')}
            </div>
            <div className="text-[11px] text-vara-muted-strong/60 mt-1">
              تصاویر محصولات، اسلایدرها و بنرها
            </div>
          </div>
        </div>

        {/* Storage Size Card */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-vara-line/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-vara-muted-strong/70 text-xs">
            <span>حجم کل مصرفی در CDN</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-vara-muted-strong font-jakarta">
              {loading ? '...' : data?.totalSizeFormatted || '0 B'}
            </div>
            <div className="text-[11px] text-vara-muted-strong/60 mt-1">
              بهینه‌سازی شده با الگوریتم WebP
            </div>
          </div>
        </div>

        {/* CDN Provider Card */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-vara-line/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-vara-muted-strong/70 text-xs">
            <span>شبکه توزیع محتوا (CDN)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-black text-emerald-700 font-jakarta">
              Vercel Global Edge
            </div>
            <div className="text-[11px] text-vara-muted-strong/60 mt-1">
              تحویل فوق سریع جهانی بدون بار روی دیتابیس
            </div>
          </div>
        </div>

        {/* Compression Engine Card */}
        <div className="bg-white p-5 rounded-3xl shadow-xs border border-vara-line/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-vara-muted-strong/70 text-xs">
            <span>موتور فشرده‌سازی خودکار</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-base font-black text-vara-muted-strong">
              فعال (WebP Client-Side)
            </div>
            <div className="text-[11px] text-vara-muted-strong/60 mt-1">
              کاهش خودکار تا ۸۵٪ حجم تصاویر قبل از آپلود
            </div>
          </div>
        </div>
      </div>

      {/* Image Optimization & Quota Protection Policy Card */}
      <div className="bg-gradient-to-l from-emerald-50/70 via-white to-white rounded-3xl p-6 shadow-xs border border-emerald-200/60">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="space-y-2 text-right flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-emerald-950">
                سیاست فشرده‌سازی خودکار تصاویر و مدیریت منابع ابری (Active Image Policy)
              </h4>
              <span className="text-[11px] font-bold bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">
                ۱۰۰٪ فعال
              </span>
            </div>
            <p className="text-xs text-vara-muted-strong/80 leading-relaxed">
              جهت حفظ سهمیه رایگان Vercel Blob و جلوگیری از افت سرعت یا خطای حجم، تمامی تصاویر در مرورگر پیش از آپلود با ابعاد و فرمت بهینه فشرده می‌شوند:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-xs">
                <div className="font-bold text-vara-muted-strong">کاهش رزولوشن هوشمند</div>
                <div className="text-[11px] text-vara-muted-strong/70 mt-1">
                  محصولات: حداکثر ۱۲۰۰px | بنرها: ۱۶۰۰px | فیش‌ها: ۱۰۰۰px
                </div>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-xs">
                <div className="font-bold text-vara-muted-strong">فرمت نسل جدید WebP</div>
                <div className="text-[11px] text-vara-muted-strong/70 mt-1">
                  کاهش ۷۰٪ تا ۹۰٪ حجم فایل با حفظ شفافیت رتینا و پالت رنگ اصلی
                </div>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-xs">
                <div className="font-bold text-vara-muted-strong">پاسخ‌گویی سریع CDN</div>
                <div className="text-[11px] text-vara-muted-strong/70 mt-1">
                  لود عکس‌ها در کسر ثانیه و بدون تجاوز از محدودیت ۴.۵ مگابایتی ورسل
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Folders Breakdown Section */}
      {data?.foldersBreakdown && data.foldersBreakdown.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-vara-line/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-vara-muted-strong flex items-center gap-2">
              <Folder className="w-4 h-4 text-vara-muted" />
              <span>تفکیک مصرف حجم بر اساس پوشه‌ها</span>
            </h3>
            <span className="text-xs text-vara-muted-strong/60 font-jakarta">
              {data.foldersBreakdown.length} پوشه فعال
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.foldersBreakdown.map((f) => (
              <div
                key={f.folder}
                onClick={() => setSelectedFolder(selectedFolder === f.folder ? 'all' : f.folder)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedFolder === f.folder
                    ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                    : 'border-vara-line/40 bg-vara-surface/30 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-vara-muted-strong">
                  <span className="flex items-center gap-1.5">
                    <Folder className="w-3.5 h-3.5 text-vara-muted" />
                    <span>{getFolderLabel(f.folder)}</span>
                  </span>
                  <span className="text-[11px] font-jakarta bg-white px-2 py-0.5 rounded-full border border-vara-line/40">
                    {f.count} فایل
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <span className="text-vara-muted-strong/70 text-[11px]">حجم:</span>
                  <span className="font-bold font-jakarta text-vara-muted-strong">
                    {f.sizeFormatted} ({f.percentage}٪)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-vara-surface rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-vara-muted-strong h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(f.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Files Table & Toolbar */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-vara-line/30 space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-vara-muted-strong flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-vara-muted" />
              <span>فایل‌های بارگذاری شده در Vercel Blob</span>
            </h3>
            <p className="text-xs text-vara-muted-strong/70 mt-0.5">
              نمایش آخرین فایل‌های ذخیره شده در CDN همراه با پیش‌نمایش و لینک مستقیم
            </p>
          </div>

          {/* Search & Folder Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در فایل‌ها..."
                className="w-full pr-8 pl-3 py-2 bg-vara-surface text-vara-muted-strong text-xs rounded-full border border-transparent focus:border-vara-muted-strong focus:bg-white focus:outline-none transition-all placeholder:text-vara-muted-strong/50"
              />
              <Search className="w-3.5 h-3.5 text-vara-muted-strong/50 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Folder Dropdown */}
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="bg-vara-surface text-vara-muted-strong text-xs py-2 px-3 rounded-full border border-transparent focus:border-vara-muted-strong focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="all">همه پوشه‌ها</option>
              {data?.foldersBreakdown.map((f) => (
                <option key={f.folder} value={f.folder}>
                  {getFolderLabel(f.folder)} ({f.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Files Content */}
        {loading ? (
          <div className="py-16 text-center text-vara-muted-strong/60 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-vara-muted" />
            <p className="text-xs font-bold">در حال دریافت لیست فایل‌ها از سرور Vercel Blob...</p>
          </div>
        ) : filteredBlobs.length === 0 ? (
          <div className="py-14 text-center border-2 border-dashed border-vara-line/40 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-vara-surface text-vara-muted-strong/60 flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold text-vara-muted-strong">
              {searchTerm || selectedFolder !== 'all'
                ? 'هیچ فایلی با این مشخصات یافت نشد.'
                : 'هنوز هیچ تصویری در Vercel Blob ذخیره نشده است.'}
            </div>
            <p className="text-[11px] text-vara-muted-strong/60 max-w-sm mx-auto">
              با افزودن تصویر جدید برای محصولات یا بنرهای هیرو، تصاویر به صورت ابری اینجا لیست خواهند شد.
            </p>
            {data?.configured && (
              <button
                onClick={handleTestUpload}
                disabled={testUploading}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-full font-bold transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>اجرای تست آپلود آزمایشی</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and above) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-vara-line/30 text-vara-muted-strong/70 font-bold">
                    <th className="py-3 px-3">تصویر</th>
                    <th className="py-3 px-3">نام و مسیر فایل</th>
                    <th className="py-3 px-3">پوشه</th>
                    <th className="py-3 px-3">حجم</th>
                    <th className="py-3 px-3">تاریخ آپلود</th>
                    <th className="py-3 px-3 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vara-line/20">
                  {filteredBlobs.map((blob) => {
                    const folder = blob.pathname.includes('/') ? blob.pathname.split('/')[0] : 'root';
                    const basename = blob.pathname.split('/').pop() || blob.pathname;

                    return (
                      <tr key={blob.url} className="hover:bg-vara-surface/50 transition-colors group">
                        {/* Image Thumbnail */}
                        <td className="py-2.5 px-3">
                          <div
                            onClick={() => setPreviewModalUrl(blob.url)}
                            className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 border border-vara-line/40 cursor-pointer relative shrink-0 group-hover:scale-105 transition-transform"
                            title="کلیک جهت مشاهده تصویر در سایز بزرگ"
                          >
                            <img
                              src={blob.url}
                              alt={basename}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                        </td>

                        {/* File Pathname */}
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-vara-muted-strong max-w-xs truncate" title={blob.pathname}>
                            {basename}
                          </div>
                          <div className="text-[10px] text-vara-muted-strong/50 font-mono truncate max-w-xs mt-0.5" dir="ltr">
                            {blob.pathname}
                          </div>
                        </td>

                        {/* Folder Badge */}
                        <td className="py-2.5 px-3">
                          <span className="inline-block bg-vara-surface text-vara-muted-strong text-[10px] font-bold px-2 py-0.5 rounded-full border border-vara-line/30">
                            {folder}
                          </span>
                        </td>

                        {/* File Size */}
                        <td className="py-2.5 px-3 font-jakarta font-bold text-vara-muted-strong">
                          {blob.sizeFormatted}
                        </td>

                        {/* Upload Date */}
                        <td className="py-2.5 px-3 text-[11px] text-vara-muted-strong/70">
                          {formatUploadDate(blob.uploadedAt)}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Copy URL */}
                            <button
                              onClick={() => handleCopy(blob.url)}
                              className="p-1.5 rounded-full bg-vara-surface hover:bg-white text-vara-muted-strong border border-vara-line/40 transition-colors cursor-pointer"
                              title="کپی لینک CDN"
                            >
                              {copiedUrl === blob.url ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Open in New Tab */}
                            <a
                              href={blob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-vara-surface hover:bg-white text-vara-muted-strong border border-vara-line/40 transition-colors cursor-pointer"
                              title="مشاهده مستقیم فایل در تب جدید"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-vara-muted" />
                            </a>

                            {/* Delete File */}
                            <button
                              onClick={() => setDeleteConfirmBlob(blob)}
                              disabled={deletingUrl === blob.url}
                              className="p-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer disabled:opacity-50"
                              title="حذف از فضای ابری"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards List View (below md) */}
            <div className="block md:hidden space-y-3">
              {filteredBlobs.map((blob) => {
                const folder = blob.pathname.includes('/') ? blob.pathname.split('/')[0] : 'root';
                const basename = blob.pathname.split('/').pop() || blob.pathname;

                return (
                  <div
                    key={blob.url}
                    className="p-3 bg-vara-surface/60 border border-vara-line/40 rounded-2xl space-y-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => setPreviewModalUrl(blob.url)}
                        className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 border border-vara-line/40 cursor-pointer shrink-0 relative"
                        title="کلیک جهت مشاهده تصویر"
                      >
                        <img
                          src={blob.url}
                          alt={basename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 justify-between">
                          <span className="font-bold text-xs text-vara-muted-strong truncate" title={blob.pathname}>
                            {basename}
                          </span>
                          <span className="bg-white text-vara-muted-strong text-[10px] font-bold px-2 py-0.5 rounded-full border border-vara-line/30 shrink-0">
                            {folder}
                          </span>
                        </div>
                        <div className="text-[10px] text-vara-muted-strong/50 font-mono truncate mt-0.5" dir="ltr">
                          {blob.pathname}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-vara-muted-strong/70">
                          <span className="font-bold font-jakarta text-vara-muted-strong">{blob.sizeFormatted}</span>
                          <span>•</span>
                          <span>{formatUploadDate(blob.uploadedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-2 border-t border-vara-line/30 justify-between">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopy(blob.url)}
                          className="px-2.5 py-1.5 rounded-full bg-white text-vara-muted-strong border border-vara-line/40 text-xs font-semibold flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
                        >
                          {copiedUrl === blob.url ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">کپی شد</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-vara-muted" />
                              <span>کپی لینک</span>
                            </>
                          )}
                        </button>

                        <a
                          href={blob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-xl bg-white text-vara-muted-strong border border-vara-line/40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-vara-muted" />
                          <span>مشاهده</span>
                        </a>
                      </div>

                      <button
                        onClick={() => setDeleteConfirmBlob(blob)}
                        disabled={deletingUrl === blob.url}
                        className="px-2.5 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer info note */}
        <div className="pt-3 border-t border-vara-line/30 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-vara-muted-strong/60 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-vara-muted" />
            <span>تصاویر ذخیره شده به صورت عمومی از طریق لبه‌های CDN ورسل با دامنه public.blob.vercel-storage.com فراخوانی می‌شوند.</span>
          </div>
          {data?.checkedAt && (
            <div className="font-jakarta text-[10px]">
              آخرین همگام‌سازی: {formatUploadDate(data.checkedAt)}
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewModalUrl && (
        <Modal label="پیش‌نمایش تصویر" onClose={() => setPreviewModalUrl(null)} className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-4 max-w-xl w-full max-h-[85vh] flex flex-col items-center gap-3 relative shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between border-b border-vara-line/30 pb-2">
              <span className="text-xs font-bold text-vara-muted-strong">پیش‌نمایش تصویر در اندازه کامل</span>
              <button
                onClick={() => setPreviewModalUrl(null)}
                className="text-xs text-vara-muted-strong/70 hover:text-black cursor-pointer font-bold px-2 py-1"
              >
                ✕ بستن
              </button>
            </div>
            <div className="w-full max-h-[60vh] overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center p-2">
              <img
                src={previewModalUrl}
                alt="Preview"
                className="max-w-full max-h-[55vh] object-contain rounded-xl"
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] font-mono text-vara-muted-strong/60 truncate flex-1" dir="ltr">
                {previewModalUrl}
              </span>
              <button
                onClick={() => handleCopy(previewModalUrl)}
                className="bg-vara-rose text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>کپی لینک CDN</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmBlob && (
        <Modal label="حذف فایل" onClose={() => { if (!deletingUrl) setDeleteConfirmBlob(null); }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-scaleUp text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-base font-black text-vara-muted-strong">حذف دائمی فایل از Vercel Blob</h4>
              <p className="text-xs text-vara-muted-strong/70 leading-relaxed">
                آیا از حذف این فایل مطمئن هستید؟ این عملیات غیرقابل بازگشت است و تصویر از فضای ابری CDN پاک خواهد شد.
              </p>
            </div>

            <div className="bg-vara-surface p-3 rounded-2xl text-xs space-y-1 border border-vara-line/30">
              <div className="font-bold text-vara-muted-strong truncate" dir="ltr">
                {deleteConfirmBlob.pathname}
              </div>
              <div className="text-vara-muted-strong/60 font-jakarta text-[11px]">
                حجم: {deleteConfirmBlob.sizeFormatted}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleDeleteBlob(deleteConfirmBlob)}
                disabled={deletingUrl === deleteConfirmBlob.url}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingUrl === deleteConfirmBlob.url ? 'در حال حذف...' : 'بله، حذف کن'}</span>
              </button>

              <button
                onClick={() => setDeleteConfirmBlob(null)}
                className="flex-1 bg-vara-surface hover:bg-vara-line/40 text-vara-muted-strong py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
