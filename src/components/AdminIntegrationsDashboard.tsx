import React, { useState, useEffect, useCallback } from 'react';
import {
  Server,
  Database,
  Cloud,
  Sparkles,
  MessageSquare,
  Mail,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  HardDrive,
  Clock,
  FileText,
  Layers,
  Terminal,
  ArrowRight,
  Info,
  Lock,
  Key,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
} from 'lucide-react';
import { AdminStorageDiagnostics } from './AdminStorageDiagnostics';

export interface HostInfo {
  platform: string;
  environment: string;
  vercelUrl: string;
  nodeVersion: string;
  uptimeSeconds: number;
  memoryMb: number;
  heapUsedMb: number;
  pid: number;
}

export interface TursoIntegration {
  name: string;
  category: string;
  status: 'healthy' | 'degraded' | 'fallback' | 'error';
  mode: string;
  urlPreview?: string | null;
  configured: boolean;
  latencyMs?: number;
  error?: string | null;
  stats?: {
    products: number;
    orders: number;
    brands: number;
  };
}

export interface VercelBlobIntegration {
  name: string;
  category: string;
  status: 'healthy' | 'fallback';
  provider: string;
  configured: boolean;
  isPrivateStore: boolean;
  totalFiles: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  proxyStreamActive: boolean;
  compressionEngine: string;
}

export interface GeminiIntegration {
  name: string;
  category: string;
  status: 'healthy' | 'unconfigured' | 'error';
  configured: boolean;
  model: string;
  capabilities: string[];
  keyPreview?: string | null;
}

export interface KavenegarIntegration {
  name: string;
  category: string;
  status: 'healthy' | 'unconfigured' | 'error';
  configured: boolean;
  template: string;
  keyPreview?: string | null;
}

export interface ResendIntegration {
  name: string;
  category: string;
  status: 'healthy' | 'unconfigured' | 'error';
  configured: boolean;
  sender: string | { name?: string; email?: string; formatted?: string; isTestDomain?: boolean };
  senderDetails?: { name: string; email: string; formatted: string; isTestDomain: boolean };
  source?: string;
}

export interface SystemDiagnosticsData {
  success: boolean;
  timestamp: string;
  host: HostInfo;
  integrations: {
    turso: TursoIntegration;
    vercelBlob: VercelBlobIntegration;
    gemini: GeminiIntegration;
    kavenegar: KavenegarIntegration;
    resend: ResendIntegration;
    zarinpal?: {
      name: string;
      category: string;
      status: string;
      configured: boolean;
      isSandbox: boolean;
      merchantIdPreview?: string | null;
    };
  };
}

interface AdminIntegrationsDashboardProps {
  onBackToProducts?: () => void;
}

type TabType = 'overview' | 'turso' | 'blob' | 'gemini' | 'messaging' | 'system_report';

export const AdminIntegrationsDashboard: React.FC<AdminIntegrationsDashboardProps> = ({
  onBackToProducts,
}) => {
  // Tech Admin Access & Password Protection State
  const [techToken, setTechToken] = useState<string>(() => {
    try {
      return sessionStorage.getItem('vara_tech_admin_token') || '';
    } catch {
      return '';
    }
  });

  const [isTechAuthenticated, setIsTechAuthenticated] = useState<boolean>(() => {
    try {
      const hasSession = sessionStorage.getItem('vara_tech_admin_session') === 'true';
      const token = sessionStorage.getItem('vara_tech_admin_token');
      return hasSession && Boolean(token && token.trim().length > 0);
    } catch {
      return false;
    }
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [data, setData] = useState<SystemDiagnosticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live Ping States
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [tursoPingLoading, setTursoPingLoading] = useState(false);
  const [tursoPingResult, setTursoPingResult] = useState<{ latencyMs: number; error?: string } | null>(null);

  const [geminiPingLoading, setGeminiPingLoading] = useState(false);
  const [geminiPingResult, setGeminiPingResult] = useState<{ latencyMs: number; error?: string; response?: string } | null>(null);

  const [kavenegarPingLoading, setKavenegarPingLoading] = useState(false);
  const [kavenegarPingResult, setKavenegarPingResult] = useState<{ latencyMs: number; status?: number; message?: string } | null>(null);

  const [copiedReport, setCopiedReport] = useState(false);

  // Check config and token status on mount
  useEffect(() => {
    if (!techToken) {
      setIsTechAuthenticated(false);
      try {
        sessionStorage.removeItem('vara_tech_admin_session');
      } catch {}
      return;
    }

    fetch('/api/auth/tech-admin/status', {
      headers: { 'x-tech-admin-token': techToken },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.isAuthenticated) {
          setIsTechAuthenticated(true);
        } else {
          // Token is expired or unrecognized: clear session
          setIsTechAuthenticated(false);
          setTechToken('');
          try {
            sessionStorage.removeItem('vara_tech_admin_session');
            sessionStorage.removeItem('vara_tech_admin_token');
          } catch {}
        }
      })
      .catch(() => {});
  }, [techToken]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setVerifyError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Password Verification Handler
  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim() || verifyLoading || lockoutRemaining > 0) return;

    setVerifyLoading(true);
    setVerifyError(null);

    try {
      const res = await fetch('/api/auth/tech-admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput.trim() }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        try {
          sessionStorage.setItem('vara_tech_admin_session', 'true');
          sessionStorage.setItem('vara_tech_admin_token', json.token || '');
        } catch {}
        setTechToken(json.token || '');
        setIsTechAuthenticated(true);
        setPasswordInput('');
        setVerifyError(null);
      } else {
        if (json.isLocked && json.remainingSeconds) {
          setLockoutRemaining(json.remainingSeconds);
        }
        setVerifyError(json.message || 'رمز عبور پنل فنی نادرست است.');
      }
    } catch (err: any) {
      setVerifyError('خطا در برقراری ارتباط با سرور.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Re-lock / Logout Handler
  const handleLogoutTech = async () => {
    try {
      await fetch('/api/auth/tech-admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tech-admin-token': techToken,
        },
      });
    } catch {}
    try {
      sessionStorage.removeItem('vara_tech_admin_session');
      sessionStorage.removeItem('vara_tech_admin_token');
    } catch {}
    setIsTechAuthenticated(false);
    setTechToken('');
    setPasswordInput('');
    setData(null);
    setError(null);
  };

  // Fetch full system diagnostic data
  const fetchDiagnostics = useCallback(async () => {
    if (!isTechAuthenticated || !techToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/diagnostics/system', {
        headers: { 'x-tech-admin-token': techToken },
      });

      if (res.status === 401) {
        // Token is expired or unauthorized: revert to gate with helpful notice
        try {
          sessionStorage.removeItem('vara_tech_admin_session');
          sessionStorage.removeItem('vara_tech_admin_token');
        } catch {}
        setIsTechAuthenticated(false);
        setTechToken('');
        setData(null);
        setError(null);
        setVerifyError('اعتبار نشست فنی به پایان رسیده است. لطفاً رمز عبور را وارد فرمایید.');
        return;
      }

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: SystemDiagnosticsData = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('[Diagnostics Fetch Error]:', err);
      setError(err?.message || 'خطا در ارتباط با سرور تشخیصی');
    } finally {
      setLoading(false);
    }
  }, [isTechAuthenticated, techToken]);

  useEffect(() => {
    if (isTechAuthenticated && techToken) {
      fetchDiagnostics();
    }
  }, [isTechAuthenticated, techToken, fetchDiagnostics]);

  // Live Ping Turso
  const handlePingTurso = async () => {
    if (!techToken) return;
    setTursoPingLoading(true);
    setTursoPingResult(null);
    try {
      const res = await fetch('/api/diagnostics/turso/ping', {
        method: 'POST',
        headers: { 'x-tech-admin-token': techToken },
      });
      if (res.status === 401) {
        handleLogoutTech();
        return;
      }
      const json = await res.json();
      setTursoPingResult({
        latencyMs: json.latencyMs || 0,
        error: json.success ? undefined : json.error,
      });
    } catch (err: any) {
      setTursoPingResult({ latencyMs: 0, error: err?.message || 'Failed' });
    } finally {
      setTursoPingLoading(false);
    }
  };

  // Live Ping Gemini AI
  const handlePingGemini = async () => {
    if (!techToken) return;
    setGeminiPingLoading(true);
    setGeminiPingResult(null);
    try {
      const res = await fetch('/api/diagnostics/gemini/ping', {
        method: 'POST',
        headers: { 'x-tech-admin-token': techToken },
      });
      if (res.status === 401) {
        handleLogoutTech();
        return;
      }
      const json = await res.json();
      setGeminiPingResult({
        latencyMs: json.latencyMs || 0,
        response: json.response,
        error: json.success ? undefined : json.error,
      });
    } catch (err: any) {
      setGeminiPingResult({ latencyMs: 0, error: err?.message || 'Failed' });
    } finally {
      setGeminiPingLoading(false);
    }
  };

  // Live Ping Kavenegar
  const handlePingKavenegar = async () => {
    if (!techToken) return;
    setKavenegarPingLoading(true);
    setKavenegarPingResult(null);
    try {
      const res = await fetch('/api/diagnostics/kavenegar/ping', {
        method: 'POST',
        headers: { 'x-tech-admin-token': techToken },
      });
      if (res.status === 401) {
        handleLogoutTech();
        return;
      }
      const json = await res.json();
      setKavenegarPingResult({
        latencyMs: json.latencyMs || 0,
        status: json.status,
        message: json.message,
      });
    } catch (err: any) {
      setKavenegarPingResult({ latencyMs: 0, message: err?.message || 'Failed' });
    } finally {
      setKavenegarPingLoading(false);
    }
  };

  // Ping All Concurrently
  const handlePingAll = async () => {
    setIsPingingAll(true);
    await Promise.allSettled([
      handlePingTurso(),
      handlePingGemini(),
      handlePingKavenegar(),
      fetchDiagnostics(),
    ]);
    setIsPingingAll(false);
  };

  const handleCopyReport = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const parts = [];
    if (d > 0) parts.push(`${d} روز`);
    if (h > 0) parts.push(`${h} ساعت`);
    parts.push(`${m} دقیقه`);
    return parts.join(' و ');
  };

  const formatSenderString = (sender: any): string => {
    if (!sender) return 'mail@varabeauty.ir';
    if (typeof sender === 'string') return sender;
    return sender.formatted || sender.email || `${sender.name || ''} <${sender.email || ''}>`.trim();
  };

  // IF NOT AUTHENTICATED -> RENDER TECH ADMIN PASSWORD GATE
  if (!isTechAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-14 px-4 animate-fadeIn" dir="rtl">
        <div className="bg-[#1e2329] text-white rounded-3xl p-7 sm:p-8 shadow-2xl border border-white/10 relative overflow-hidden space-y-6">
          {/* Subtle glowing background circle */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Minimal Gate Header */}
          <div className="relative z-10 text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 text-amber-400 flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>
            
            <h2 className="text-lg font-black font-vazir text-white">
              احراز هویت دسترسی
            </h2>
          </div>

          {/* Password Form */}
          <form onSubmit={handleVerifyPassword} className="relative z-10 space-y-4">
            {verifyError && (
              <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs rounded-xl p-3 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-0.5">
                  <p className="font-bold">{verifyError}</p>
                  {lockoutRemaining > 0 && (
                    <p className="text-[11px] text-rose-300 font-mono">
                      زمان تا پایان محدودیت: {Math.floor(lockoutRemaining / 60)} دقیقه و {lockoutRemaining % 60} ثانیه
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-right">
              <label className="block text-xs font-bold text-gray-300 font-vazir">
                رمز عبور:
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="رمز عبور را وارد کنید..."
                  disabled={verifyLoading || lockoutRemaining > 0}
                  className="w-full bg-white/5 border border-white/20 hover:border-white/30 focus:border-amber-400 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-all font-mono pl-11 disabled:opacity-50"
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 cursor-pointer"
                  tabIndex={-1}
                  title={showPassword ? 'مخفی‌سازی رمز' : 'نمایش رمز'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifyLoading || !passwordInput.trim() || lockoutRemaining > 0}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-950 font-bold py-2.5 px-4 rounded-xl text-xs font-vazir shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>در حال بررسی...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>ورود</span>
                </>
              )}
            </button>
          </form>

          {onBackToProducts && (
            <div className="relative z-10 text-center pt-2 border-t border-white/10">
              <button
                onClick={onBackToProducts}
                className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer py-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به پنل مدیریت</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12" dir="rtl">
      {/* Top Header & Overview Banner */}
      <div className="bg-gradient-to-r from-[#1e2329] via-[#2d3239] to-[#1e2329] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-400">
                <Server className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-jakarta tracking-tight">
                مرکز پایش فنی و سرویس‌های ابری (Integrations Monitor)
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>مانیتورینگ زنده</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-500/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>احراز هویت شده</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300/90 max-w-3xl leading-relaxed">
              داشبورد مهندسی و پایش جامع سرویس‌های طرف‌سوم: پایگاه‌داده Turso (libSQL)، فضای ابری Vercel Blob، هوش مصنوعی Gemini، درگاه پیامک کاوه‌نگار، سرویس ایمیل Resend و شبکه سرورلس Vercel Edge.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handlePingAll}
              disabled={isPingingAll || loading}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPingingAll ? 'animate-spin' : ''}`} />
              <span>{isPingingAll ? 'در حال پایش زنده...' : 'تست زنده تمام سرویس‌ها'}</span>
            </button>

            <button
              onClick={handleCopyReport}
              disabled={!data}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
              title="کپی لاگ و گزارش کامل در قالب JSON"
            >
              {copiedReport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedReport ? 'کپی شد' : 'خروجی گزارش JSON'}</span>
            </button>

            <button
              onClick={handleLogoutTech}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer font-bold"
              title="خروج و قفل مجدد پنل فنی"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>قفل مجدد تب</span>
            </button>

            {onBackToProducts && (
              <button
                onClick={onBackToProducts}
                className="bg-white/10 hover:bg-white/20 text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>بازگشت به محصولات</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* Quick telemetry bar */}
        {data && (
          <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-gray-400 text-[11px]">پلتفرم اجرا</div>
              <div className="font-bold text-white mt-0.5 font-jakarta truncate">
                {data.host.platform}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">محیط ورسل</div>
              <div className="font-bold text-emerald-400 mt-0.5 uppercase">
                {data.host.environment}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">مصرف حافظه (RAM)</div>
              <div className="font-bold text-white mt-0.5 font-jakarta">
                {data.host.memoryMb} MB (Heap: {data.host.heapUsedMb} MB)
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-[11px]">زمان فعالیت (Uptime)</div>
              <div className="font-bold text-white mt-0.5 font-jakarta">
                {formatUptime(data.host.uptimeSeconds)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-[#eff2f4] p-1.5 rounded-2xl flex items-center gap-1.5 border border-[#b8b8b9]/40 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-vazir transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'overview'
              ? 'bg-white text-[#454a4f] shadow-xs border border-[#b8b8b9]'
              : 'text-[#454a4f]/70 hover:text-[#454a4f] hover:bg-white/50'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-emerald-600" />
          <span>ماتریس سلامت کلی</span>
        </button>

        <button
          onClick={() => setActiveTab('turso')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-vazir transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'turso'
              ? 'bg-white text-[#454a4f] shadow-xs border border-[#b8b8b9]'
              : 'text-[#454a4f]/70 hover:text-[#454a4f] hover:bg-white/50'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span>پایگاه‌داده Turso Cloud</span>
          {data?.integrations.turso.configured && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('blob')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-vazir transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'blob'
              ? 'bg-white text-[#454a4f] shadow-xs border border-[#b8b8b9]'
              : 'text-[#454a4f]/70 hover:text-[#454a4f] hover:bg-white/50'
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-indigo-600" />
          <span>فضای ابری Vercel Blob</span>
          {data?.integrations.vercelBlob.configured && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('gemini')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-vazir transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'gemini'
              ? 'bg-white text-[#454a4f] shadow-xs border border-[#b8b8b9]'
              : 'text-[#454a4f]/70 hover:text-[#454a4f] hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>هوش مصنوعی Gemini</span>
          {data?.integrations.gemini.configured && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('messaging')}
          className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold font-vazir transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 ${
            activeTab === 'messaging'
              ? 'bg-white text-[#454a4f] shadow-xs border border-[#b8b8b9]'
              : 'text-[#454a4f]/70 hover:text-[#454a4f] hover:bg-white/50'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
          <span>پیامک و ایمیل (SMS & Email)</span>
        </button>

        <button
          onClick={() => setActiveTab('system_report')}
          className={`px-4 py-2 rounded-xl text-xs font-bold font-vazir transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'system_report'
              ? 'bg-white text-[#454a4f] shadow-xs border border-[#b8b8b9]'
              : 'text-[#454a4f]/70 hover:text-[#454a4f] hover:bg-white/50'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-gray-700" />
          <span>گزارش فنی و متغیرهای Vercel</span>
        </button>
      </div>

      {/* Loading & Error States */}
      {loading && !data && (
        <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-[#b8b8b9]/30">
          <RefreshCw className="w-8 h-8 animate-spin text-[#949c91] mx-auto mb-3" />
          <div className="text-sm font-bold text-[#454a4f]">در حال تحلیل وضعیت سرویس‌ها و انجام پینگ فنی...</div>
        </div>
      )}

      {error && !data && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-800 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchDiagnostics()}
              className="px-3.5 py-1.5 bg-white border border-red-300 hover:bg-red-100 text-red-900 rounded-xl text-xs font-bold font-vazir transition-colors cursor-pointer"
            >
              تلاش مجدد
            </button>
            <button
              onClick={handleLogoutTech}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold font-vazir transition-colors cursor-pointer"
            >
              ورود مجدد
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: OVERVIEW & HEALTH MATRIX */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'overview' && data && (
        <div className="space-y-6">
          {/* Status Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Turso Cloud Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#454a4f]">Turso Cloud</h4>
                      <p className="text-[11px] text-[#454a4f]/60 font-jakarta">libSQL Distributed SQLite</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      data.integrations.turso.status === 'healthy'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.integrations.turso.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{data.integrations.turso.status === 'healthy' ? 'متصل و فعال' : 'حالت Fallback'}</span>
                  </span>
                </div>

                <div className="bg-[#eff2f4]/60 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>پینگ دیتابیس:</span>
                    <span className="font-bold font-jakarta text-emerald-700">
                      {tursoPingResult ? `${tursoPingResult.latencyMs} ms` : `${data.integrations.turso.latencyMs || 0} ms`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>محصولات در دیتابیس:</span>
                    <span className="font-bold font-jakarta">
                      {(data.integrations.turso.stats?.products || 0).toLocaleString('fa-IR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>سفارشات ثبت‌شده:</span>
                    <span className="font-bold font-jakarta">
                      {(data.integrations.turso.stats?.orders || 0).toLocaleString('fa-IR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b8b8b9]/30 flex items-center justify-between">
                <button
                  onClick={handlePingTurso}
                  disabled={tursoPingLoading}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${tursoPingLoading ? 'animate-spin' : ''}`} />
                  <span>تست تاخیر زنده</span>
                </button>
                <button
                  onClick={() => setActiveTab('turso')}
                  className="text-xs text-[#454a4f]/70 hover:text-[#454a4f] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>جزئیات فنی</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Vercel Blob Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Cloud className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#454a4f]">Vercel Blob</h4>
                      <p className="text-[11px] text-[#454a4f]/60 font-jakarta">Global Edge Object Storage</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      data.integrations.vercelBlob.configured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.integrations.vercelBlob.configured ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{data.integrations.vercelBlob.configured ? 'متصل به ورسل' : 'آماده اتصال'}</span>
                  </span>
                </div>

                <div className="bg-[#eff2f4]/60 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>تعداد فایل‌های ابری:</span>
                    <span className="font-bold font-jakarta">
                      {data.integrations.vercelBlob.totalFiles.toLocaleString('fa-IR')} فایل
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>حجم کل مصرفی:</span>
                    <span className="font-bold font-jakarta text-indigo-700">
                      {data.integrations.vercelBlob.totalSizeFormatted}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>نوع استور:</span>
                    <span className="font-bold">
                      {data.integrations.vercelBlob.isPrivateStore ? 'اختصاصی (Private + Stream)' : 'عمومی (Public)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b8b8b9]/30 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>فشرده‌سازی WebP فعال</span>
                </span>
                <button
                  onClick={() => setActiveTab('blob')}
                  className="text-xs text-[#454a4f]/70 hover:text-[#454a4f] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>مدیریت فایل‌ها</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Google Gemini AI Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#454a4f]">Google Gemini AI</h4>
                      <p className="text-[11px] text-[#454a4f]/60 font-jakarta">{data.integrations.gemini.model}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      data.integrations.gemini.configured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.integrations.gemini.configured ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{data.integrations.gemini.configured ? 'کلید API فعال' : 'نیازمند کلید API'}</span>
                  </span>
                </div>

                <div className="bg-[#eff2f4]/60 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>مدل اصلی:</span>
                    <span className="font-bold font-jakarta text-amber-700">{data.integrations.gemini.model}</span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>پاسخ‌گویی آخرین آزمون:</span>
                    <span className="font-bold font-jakarta text-emerald-700">
                      {geminiPingResult ? `${geminiPingResult.latencyMs} ms` : 'آماده تست'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>قابلیت‌ها:</span>
                    <span className="font-bold">مشاور پوست + تحلیل لینک</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b8b8b9]/30 flex items-center justify-between">
                <button
                  onClick={handlePingGemini}
                  disabled={geminiPingLoading}
                  className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${geminiPingLoading ? 'animate-spin' : ''}`} />
                  <span>تست هوش مصنوعی</span>
                </button>
                <button
                  onClick={() => setActiveTab('gemini')}
                  className="text-xs text-[#454a4f]/70 hover:text-[#454a4f] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>قابلیت‌ها</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Kavenegar SMS Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#454a4f]">کاوه‌نگار (Kavenegar)</h4>
                      <p className="text-[11px] text-[#454a4f]/60 font-jakarta">سامانه ارسال پیامک OTP</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      data.integrations.kavenegar.configured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.integrations.kavenegar.configured ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{data.integrations.kavenegar.configured ? 'کلید ست شده' : 'نیازمند کلید'}</span>
                  </span>
                </div>

                <div className="bg-[#eff2f4]/60 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>الگوی پیامک (Template):</span>
                    <span className="font-bold font-jakarta text-purple-700">{data.integrations.kavenegar.template}</span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>وضعیت ارتباط:</span>
                    <span className="font-bold">
                      {kavenegarPingResult ? `${kavenegarPingResult.latencyMs} ms` : 'آماده اتصال'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>کاربرد اصلی:</span>
                    <span className="font-bold">احراز هویت و ورود با کد پیامکی</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b8b8b9]/30 flex items-center justify-between">
                <button
                  onClick={handlePingKavenegar}
                  disabled={kavenegarPingLoading}
                  className="text-xs text-purple-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${kavenegarPingLoading ? 'animate-spin' : ''}`} />
                  <span>تست سرور کاوه‌نگار</span>
                </button>
                <button
                  onClick={() => setActiveTab('messaging')}
                  className="text-xs text-[#454a4f]/70 hover:text-[#454a4f] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>مشاهده جزئیات</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Resend Email Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#454a4f]">Resend Email</h4>
                      <p className="text-[11px] text-[#454a4f]/60 font-jakarta">سرویس ارسال فاکتور و اعلان</p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      data.integrations.resend.configured
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        data.integrations.resend.configured ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{data.integrations.resend.configured ? 'کلید ست شده' : 'اختیاری'}</span>
                  </span>
                </div>

                <div className="bg-[#eff2f4]/60 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>فرستنده ایمیل:</span>
                    <span className="font-bold font-jakarta text-rose-700 truncate max-w-[160px]">
                      {formatSenderString(data.integrations.resend.sender)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>کاربرد:</span>
                    <span className="font-bold">ارسال رسید خرید به ایمیل کاربر</span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>وضعیت اتصال:</span>
                    <span className="font-bold">{data.integrations.resend.configured ? 'آماده ارسال' : 'غیرفعال'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b8b8b9]/30 flex items-center justify-between">
                <span className="text-[11px] text-[#454a4f]/60">ایمیل تراکنشی</span>
                <button
                  onClick={() => setActiveTab('messaging')}
                  className="text-xs text-[#454a4f]/70 hover:text-[#454a4f] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>مشاهده جزئیات</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>

            {/* Vercel Hosting & Edge Network Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#454a4f]">Vercel Edge & Host</h4>
                      <p className="text-[11px] text-[#454a4f]/60 font-jakarta">Serverless & CDN Edge</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>فعال</span>
                  </span>
                </div>

                <div className="bg-[#eff2f4]/60 p-3 rounded-2xl space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>محیط اجرا:</span>
                    <span className="font-bold font-jakarta text-teal-700">{data.host.environment}</span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>نسخه Node.js:</span>
                    <span className="font-bold font-jakarta">{data.host.nodeVersion}</span>
                  </div>
                  <div className="flex justify-between text-[#454a4f]/80">
                    <span>شناسه پردازه (PID):</span>
                    <span className="font-bold font-jakarta">{data.host.pid}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#b8b8b9]/30 flex items-center justify-between">
                <span className="text-[11px] text-teal-700 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>تحویل فوق‌سریع جهانی</span>
                </span>
                <button
                  onClick={() => setActiveTab('system_report')}
                  className="text-xs text-[#454a4f]/70 hover:text-[#454a4f] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>بررسی متغیرها</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Technical Summary Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30">
            <h3 className="text-sm font-black text-[#454a4f] flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>وضعیت یکپارچگی‌های فنی کل سیستم</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-[#eff2f4]/40 p-4 rounded-2xl border border-[#b8b8b9]/30 space-y-2">
                <div className="font-bold text-[#454a4f] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>داده‌ها و ذخیره‌سازی ابری</span>
                </div>
                <p className="text-[#454a4f]/70 leading-relaxed text-[11px]">
                  پایگاه‌داده توزیع‌شده Turso اطلاعات محصولات و سفارش‌ها را بر بستر پروتکل libSQL ذخیره می‌کند و کلیه تصاویر با الگوریتم مدرن WebP در Vercel Blob میزبانی می‌شوند.
                </p>
              </div>

              <div className="bg-[#eff2f4]/40 p-4 rounded-2xl border border-[#b8b8b9]/30 space-y-2">
                <div className="font-bold text-[#454a4f] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ارتباطات و هوش مصنوعی</span>
                </div>
                <p className="text-[#454a4f]/70 leading-relaxed text-[11px]">
                  موتور Gemini 2.5 Flash فرآیند مشاوره تخصصی پوست و استخراج خودکار محصول از لینک را هدایت می‌کند و پیامک‌های ورود با پترن خدماتی سریع کاوه‌نگار ارسال می‌گردند.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TURSO CLOUD DATABASE MONITOR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'turso' && data && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#b8b8b9]/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#454a4f]">پایگاه‌داده ابری Turso (libSQL)</h3>
                  <p className="text-xs text-[#454a4f]/60 mt-0.5">
                    دیتابیس توزیع‌شده SQLite در لبه شبکه برای پایداری ۱۰۰٪ اطلاعات در دیپلوی ورسل
                  </p>
                </div>
              </div>

              <button
                onClick={handlePingTurso}
                disabled={tursoPingLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-4 h-4 ${tursoPingLoading ? 'animate-spin' : ''}`} />
                <span>{tursoPingLoading ? 'در حال ارسال کوئری پینگ...' : 'تست پینگ زنده به Turso'}</span>
              </button>
            </div>

            {/* Turso Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#eff2f4]/60 p-4 rounded-2xl border border-[#b8b8b9]/30">
                <div className="text-[11px] text-[#454a4f]/60">حالت اجرا (Driver Mode)</div>
                <div className="text-sm font-bold text-[#454a4f] mt-1 font-jakarta">
                  {data.integrations.turso.mode}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>درایور وب Pure JS (@libsql/client/web)</span>
                </div>
              </div>

              <div className="bg-[#eff2f4]/60 p-4 rounded-2xl border border-[#b8b8b9]/30">
                <div className="text-[11px] text-[#454a4f]/60">آدرس دیتابیس در Turso</div>
                <div className="text-xs font-bold text-blue-700 mt-1 font-jakarta truncate dir-ltr">
                  {data.integrations.turso.urlPreview || 'libsql://[your-db].turso.io'}
                </div>
                <div className="text-[11px] text-[#454a4f]/60 mt-1">
                  متغیر TURSO_DATABASE_URL
                </div>
              </div>

              <div className="bg-[#eff2f4]/60 p-4 rounded-2xl border border-[#b8b8b9]/30">
                <div className="text-[11px] text-[#454a4f]/60">تاخیر رفت و برگشت (Round-trip)</div>
                <div className="text-xl font-black text-emerald-700 mt-1 font-jakarta">
                  {tursoPingResult ? `${tursoPingResult.latencyMs} ms` : `${data.integrations.turso.latencyMs || 0} ms`}
                </div>
                <div className="text-[11px] text-emerald-600 font-bold mt-1">
                  کوئری مستقیم SELECT 1
                </div>
              </div>
            </div>

            {/* Turso Tables Stats */}
            <div className="border-t border-[#b8b8b9]/30 pt-6">
              <h4 className="text-xs font-bold text-[#454a4f] mb-3">آمار جداول دیتابیس (Active Database Tables)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-[#b8b8b9]/40 text-center">
                  <div className="text-xl font-black text-[#454a4f] font-jakarta">
                    {(data.integrations.turso.stats?.products || 0).toLocaleString('fa-IR')}
                  </div>
                  <div className="text-[11px] text-[#454a4f]/70 mt-1">جدول products</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#b8b8b9]/40 text-center">
                  <div className="text-xl font-black text-[#454a4f] font-jakarta">
                    {(data.integrations.turso.stats?.orders || 0).toLocaleString('fa-IR')}
                  </div>
                  <div className="text-[11px] text-[#454a4f]/70 mt-1">جدول orders</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#b8b8b9]/40 text-center">
                  <div className="text-xl font-black text-[#454a4f] font-jakarta">
                    {(data.integrations.turso.stats?.brands || 0).toLocaleString('fa-IR')}
                  </div>
                  <div className="text-[11px] text-[#454a4f]/70 mt-1">جدول brands</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#b8b8b9]/40 text-center">
                  <div className="text-xl font-black text-[#454a4f] font-jakarta">۱</div>
                  <div className="text-[11px] text-[#454a4f]/70 mt-1">جدول admins</div>
                </div>
              </div>
            </div>

            {/* Turso setup instructions card */}
            <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 text-xs text-blue-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-600" />
                <span>راهنمای دیپلوی ورسل با Turso:</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-relaxed">
                برای ماندگاری کامل محصولات و تغییرات پس از استقرار در Vercel، مطمئن شوید دو متغیر{' '}
                <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold">TURSO_DATABASE_URL</code> و{' '}
                <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold">TURSO_AUTH_TOKEN</code> در بخش Project Settings &gt; Environment Variables ورسل اضافه شده باشند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: VERCEL BLOB STORAGE & MEDIA CDN */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'blob' && (
        <div className="space-y-6">
          <AdminStorageDiagnostics onBackToProducts={() => setActiveTab('overview')} />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: GOOGLE GEMINI AI ENGINE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'gemini' && data && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#b8b8b9]/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#454a4f]">موتور هوش مصنوعی Google Gemini</h3>
                  <p className="text-xs text-[#454a4f]/60 mt-0.5 font-jakarta">
                    SDK رسمی @google/genai با مدل مدرن {data.integrations.gemini.model}
                  </p>
                </div>
              </div>

              <button
                onClick={handlePingGemini}
                disabled={geminiPingLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw className={`w-4 h-4 ${geminiPingLoading ? 'animate-spin' : ''}`} />
                <span>{geminiPingLoading ? 'در حال ارسال پیام تست...' : 'تست زنده تاخیر هوش مصنوعی'}</span>
              </button>
            </div>

            {/* Gemini Live Test Response Box */}
            {geminiPingResult && (
              <div
                className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                  geminiPingResult.error
                    ? 'bg-red-50 border border-red-200 text-red-800'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="font-bold flex items-center justify-between">
                  <span>{geminiPingResult.error ? 'خطا در ارتباط با Gemini API' : 'پاسخ موفق از Gemini API'}</span>
                  <span className="font-jakarta text-[11px] font-mono">{geminiPingResult.latencyMs} ms</span>
                </div>
                {geminiPingResult.error ? (
                  <p className="text-[11px]">{geminiPingResult.error}</p>
                ) : (
                  <p className="text-[11px]">پاسخ سرور هوش مصنوعی: {geminiPingResult.response || 'OK'}</p>
                )}
              </div>
            )}

            {/* Features List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#454a4f]">ماژول‌های فعال هوش مصنوعی در سایت ورا:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#eff2f4]/60 p-4 rounded-2xl border border-[#b8b8b9]/30">
                  <div className="font-bold text-xs text-[#454a4f] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>مشاور تخصصی پوست</span>
                  </div>
                  <p className="text-[11px] text-[#454a4f]/70 mt-1 leading-relaxed">
                    تحلیل نوع پوست (چرب، خشک، مختلط) و تدوین روتین پوستی روز و شب متناسب با نیاز مشتری.
                  </p>
                </div>

                <div className="bg-[#eff2f4]/60 p-4 rounded-2xl border border-[#b8b8b9]/30">
                  <div className="font-bold text-xs text-[#454a4f] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>تحلیل بینایی و تصویر (Vision)</span>
                  </div>
                  <p className="text-[11px] text-[#454a4f]/70 mt-1 leading-relaxed">
                    امکان آپلود عکس پوست یا محصول و دریافت تحلیل ترکیبات فعال نظیر نیاسینامید، رتینول و سالیسیلیک.
                  </p>
                </div>

                <div className="bg-[#eff2f4]/60 p-4 rounded-2xl border border-[#b8b8b9]/30">
                  <div className="font-bold text-xs text-[#454a4f] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>استخراج خودکار محصول از لینک</span>
                  </div>
                  <p className="text-[11px] text-[#454a4f]/70 mt-1 leading-relaxed">
                    اسکرپ و استخراج خودکار مشخصات، نام فارسی/انگلیسی، حجم و قیمت کالا از لینک فروشگاه‌های خارجی و ایرانی.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: MESSAGING & COMMUNICATIONS (SMS & EMAIL) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'messaging' && data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kavenegar SMS Details */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#454a4f]">کاوه‌نگار (Kavenegar)</h4>
                    <p className="text-[11px] text-[#454a4f]/60 font-jakarta">سامانه ارسال سریع کد تایید OTP</p>
                  </div>
                </div>

                <button
                  onClick={handlePingKavenegar}
                  disabled={kavenegarPingLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  {kavenegarPingLoading ? 'در حال تست...' : 'تست اعتبار'}
                </button>
              </div>

              {kavenegarPingResult && (
                <div className="bg-purple-50 p-3 rounded-xl text-xs space-y-1 text-purple-900 border border-purple-200">
                  <div className="font-bold flex justify-between">
                    <span>نتیجه استعلام کاوه‌نگار:</span>
                    <span className="font-mono">{kavenegarPingResult.latencyMs} ms</span>
                  </div>
                  <p className="text-[11px]">{kavenegarPingResult.message || 'پاسخ موفق دریافت شد.'}</p>
                </div>
              )}

              <div className="bg-[#eff2f4]/60 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-[#454a4f]">
                  <span>الگوی تایید هویت (OTP Template):</span>
                  <span className="font-bold font-mono text-purple-700">{data.integrations.kavenegar.template}</span>
                </div>
                <div className="flex justify-between text-[#454a4f]">
                  <span>وضعیت اتصال API:</span>
                  <span className={`font-bold text-[11px] ${data.integrations.kavenegar.configured ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {data.integrations.kavenegar.configured ? 'کلید معتبر تنظیم شده' : 'تنظیم نشده (KAVENEGAR_API_KEY)'}
                  </span>
                </div>
                <div className="flex justify-between text-[#454a4f]">
                  <span>ارسال به شماره‌های بلک‌لیست:</span>
                  <span className="font-bold text-emerald-600">پشتیبانی می‌شود (Lookup Service)</span>
                </div>
              </div>
            </div>

            {/* Resend Email Details */}
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#b8b8b9]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#454a4f]">Resend Email Service</h4>
                    <p className="text-[11px] text-[#454a4f]/60 font-jakarta">سرویس ایمیل مدرن برای سفارشات</p>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    data.integrations.resend.configured
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {data.integrations.resend.configured ? 'آماده ارسال' : 'اختیاری'}
                </span>
              </div>

              <div className="bg-[#eff2f4]/60 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-[#454a4f]">
                  <span>آدرس فرستنده رسمی (Sender):</span>
                  <span className="font-bold font-mono text-rose-700 truncate max-w-[200px]">
                    {formatSenderString(data.integrations.resend.sender)}
                  </span>
                </div>
                <div className="flex justify-between text-[#454a4f]">
                  <span>متغیر محیطی:</span>
                  <span className="font-bold font-mono text-[11px]">RESEND_API_KEY</span>
                </div>
                <div className="flex justify-between text-[#454a4f]">
                  <span>قالب‌های HTML:</span>
                  <span className="font-bold text-emerald-600">فاکتور سفارش و کد پیگیری خرید</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: TECHNICAL SYSTEM REPORT & VERCEL ENV AUDIT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'system_report' && data && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-[#b8b8b9]/30 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#454a4f]">ممیزی فنی متغیرهای محیطی و محیط سرورلس</h3>
                <p className="text-xs text-[#454a4f]/60 mt-0.5">
                  بررسی صحت ست بودن کلیدها جهت استقرار پایدار در Vercel
                </p>
              </div>

              <button
                onClick={handleCopyReport}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs px-3.5 py-2 rounded-xl border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReport ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-emerald-600" />}
                <span>{copiedReport ? 'کپی شد' : 'کپی کل گزارش'}</span>
              </button>
            </div>

            {/* Checklist Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-[#b8b8b9]/30 text-[#454a4f]/70">
                    <th className="py-2.5 px-3">سرویس</th>
                    <th className="py-2.5 px-3">نام متغیر در ورسل (Key)</th>
                    <th className="py-2.5 px-3">ضرورت</th>
                    <th className="py-2.5 px-3">وضعیت فعلی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#b8b8b9]/20 font-vazir">
                  <tr>
                    <td className="py-3 px-3 font-bold text-[#454a4f]">پایگاه‌داده Turso</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-blue-700">TURSO_DATABASE_URL</td>
                    <td className="py-3 px-3 text-red-600 font-bold">حیاتی (Required)</td>
                    <td className="py-3 px-3">
                      {data.integrations.turso.configured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> تنظیم شده
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> استفاده از Fallback
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-[#454a4f]">توکن Turso</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-blue-700">TURSO_AUTH_TOKEN</td>
                    <td className="py-3 px-3 text-red-600 font-bold">حیاتی (Required)</td>
                    <td className="py-3 px-3">
                      {data.integrations.turso.configured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> تنظیم شده
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> در انتظار توکن
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-[#454a4f]">فضای ابری تصاویر</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-indigo-700">VARA_MEDIA_STORE_ID</td>
                    <td className="py-3 px-3 text-[#454a4f]/70">توصیه‌شده</td>
                    <td className="py-3 px-3">
                      {data.integrations.vercelBlob.configured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> استور متصل
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> اتصال با ۱ کلیک در پنل ورسل
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-[#454a4f]">هوش مصنوعی Gemini</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-amber-700">GEMINI_API_KEY</td>
                    <td className="py-3 px-3 text-[#454a4f]/70">اختیاری (برای چت هوشمند)</td>
                    <td className="py-3 px-3">
                      {data.integrations.gemini.configured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> فعال
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> تنظیم نشده
                        </span>
                      )}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 px-3 font-bold text-[#454a4f]">پیامک کاوه‌نگار</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-purple-700">KAVENEGAR_API_KEY</td>
                    <td className="py-3 px-3 text-[#454a4f]/70">توصیه‌شده (برای ورود پیامکی)</td>
                    <td className="py-3 px-3">
                      {data.integrations.kavenegar.configured ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> فعال
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> تنظیم نشده
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Raw JSON Debug Viewer */}
            <div className="space-y-2 pt-4 border-t border-[#b8b8b9]/30">
              <div className="flex items-center justify-between text-xs text-[#454a4f]/70">
                <span className="font-bold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>داده‌های خام تشخیصی سرور (Raw JSON Telemetry):</span>
                </span>
                <span className="text-[11px] font-mono text-gray-500">{data.timestamp}</span>
              </div>
              <pre className="bg-[#1e2329] text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-72 dir-ltr">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
