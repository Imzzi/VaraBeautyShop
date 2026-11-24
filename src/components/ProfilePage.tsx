import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  LogOut, 
  Package, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  RefreshCw, 
  Check, 
  MapPin, 
  Edit3, 
  Truck, 
  MessageSquare, 
  KeyRound, 
  Heart, 
  Copy, 
  Printer, 
  Calendar, 
  SlidersHorizontal,
  Home,
  Camera,
  Upload,
  Trash2,
  Clock,
  MailCheck,
  Lock
} from 'lucide-react';
import { UserProfile, Order, Product, ProductSize, SkinType, SkinConcern } from '../types';
import { 
  registerNewUser, 
  loginWithEmail, 
  syncGoogleUserProfile,
  resetPasswordWithEmail,
  requestPasswordResetCode,
  confirmPasswordResetWithCode,
  resendEmailVerification,
  verifyUserEmailWithCode,
  verifyUserEmailStatus,
  logoutUser,
  updateUserProfileInDb,
  getUserOrdersFromDb,
  saveVerifiedCustomerSession,
} from '../lib/db';
import { initGoogleSignIn } from '../utils/googleAuth';

interface ProfilePageProps {
  user: UserProfile | null;
  onLoginSuccess: (userProfile: UserProfile) => void;
  onLogoutSuccess: () => void;
  onBackToShop: () => void;
  onNavigateToHome: () => void;
  wishlistProducts?: Product[];
  onRemoveFromWishlist?: (productId: string) => void;
  onAddToCart: (product: Product, size: ProductSize, quantity?: number) => void;
  onViewProduct: (product: Product) => void;
  onOpenQuiz: () => void;
  allProducts: Product[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onLoginSuccess,
  onLogoutSuccess,
  onBackToShop,
  onNavigateToHome,
  wishlistProducts = [],
  onRemoveFromWishlist,
  onAddToCart,
  onViewProduct,
  onOpenQuiz,
  allProducts,
}) => {
  // Navigation active tab for authenticated user
  const [activeTab, setActiveTab] = useState<'orders' | 'info' | 'skin' | 'wishlist' | 'security'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');

  // Authentication Flow State (For guests/unauthenticated users)
  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp');
  const [otpStep, setOtpStep] = useState<'phone' | 'code'>('phone');
  const [otpPhone, setOtpPhone] = useState('');
  const [otpName, setOtpName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(120);
  const [otpTimerActive, setOtpTimerActive] = useState(false);

  // Email Flow
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'forgot-password' | 'verify-email'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Email Verification Step State
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingUid, setPendingUid] = useState('');
  const [emailVerifyCountdown, setEmailVerifyCountdown] = useState(120);
  const [emailTimerActive, setEmailTimerActive] = useState(false);

  // Forgot Password Step State
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');
  const [resetCode, setResetCode] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [forgotCountdown, setForgotCountdown] = useState(120);
  const [forgotTimerActive, setForgotTimerActive] = useState(false);

  // Profile Photo Management State
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Address Inputs for Profile Editing
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // User Skin Profile State
  const [userSkinType, setUserSkinType] = useState<SkinType>('combination');
  const [userPrimaryConcern, setUserPrimaryConcern] = useState<SkinConcern>('hydration');

  // Orders History State
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(false);
  const [ordersUpdatedAt, setOrdersUpdatedAt] = useState<number>();
  const [ordersOwner, setOrdersOwner] = useState<string>();
  const ordersRequest = React.useRef(0);
  const currentOrders = ordersOwner === user?.uid ? userOrders : [];
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  // Action / Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const googleButton = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSendingVerification, setIsSendingVerification] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // User lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  // Email verification countdown timer
  useEffect(() => {
    let interval: any = null;
    if (emailTimerActive && emailVerifyCountdown > 0) {
      interval = setInterval(() => {
        setEmailVerifyCountdown((prev) => prev - 1);
      }, 1000);
    } else if (emailVerifyCountdown === 0) {
      setEmailTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [emailTimerActive, emailVerifyCountdown]);

  // Forgot password countdown timer
  useEffect(() => {
    let interval: any = null;
    if (forgotTimerActive && forgotCountdown > 0) {
      interval = setInterval(() => {
        setForgotCountdown((prev) => prev - 1);
      }, 1000);
    } else if (forgotCountdown === 0) {
      setForgotTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [forgotTimerActive, forgotCountdown]);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setPhone(user.phoneNumber || '');
      setPhotoURL(user.photoURL || '');
      setProvince(user.province || '');
      setCity(user.city || '');
      setAddress(user.address || '');
      setPostalCode(user.postalCode || '');

      if (user.skinProfile?.skinType) {
        setUserSkinType(user.skinProfile.skinType);
      }
      if (user.skinProfile?.primaryConcern) {
        setUserPrimaryConcern(user.skinProfile.primaryConcern);
      }

      if (user.email || user.phoneNumber || user.uid) {
        fetchUserOrders(user.email, user.phoneNumber, user.uid);
      }
    }
  }, [user]);

  // Real-time synchronization with order events
  useEffect(() => {
    if (!user) return;
    const handleOrderEvent = () => {
      fetchUserOrders(user.email, user.phoneNumber, user.uid);
    };
    window.addEventListener('vara-orders-updated', handleOrderEvent);
    return () => {
      window.removeEventListener('vara-orders-updated', handleOrderEvent);
    };
  }, [user]);

  // Image compression and resize helper
  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'image/svg+xml' || file.size < 30 * 1024) {
        const directReader = new FileReader();
        directReader.onload = (e) => resolve(e.target?.result as string);
        directReader.onerror = reject;
        directReader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const image = new window.Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 360;
          let width = image.width;
          let height = image.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height = Math.round((height * MAX_SIZE) / width);
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width = Math.round((width * MAX_SIZE) / height);
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }
          ctx.drawImage(image, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl);
        };
        image.onerror = reject;
        image.src = readerEvent.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleProfilePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (!file.type.startsWith('image/')) {
      setError('لطفاً یک فایل تصویری معتبر (JPG, PNG, WebP) انتخاب نمایید.');
      return;
    }

    setIsUploadingPhoto(true);
    setError('');
    setSuccessMessage('');
    try {
      const base64Data = await compressAndResizeImage(file);
      setPhotoURL(base64Data);

      await updateUserProfileInDb(user.uid, {
        photoURL: base64Data
      });

      onLoginSuccess({
        ...user,
        photoURL: base64Data
      });

      setSuccessMessage('تصویر نمایه کاربری شما با موفقیت بروزرسانی شد.');
    } catch (err: any) {
      console.warn('Error processing photo:', err);
      setError('خطا در پردازش و ذخیره تصویر نمایه.');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveProfilePhoto = async () => {
    if (!user) return;
    setIsUploadingPhoto(true);
    setError('');
    setSuccessMessage('');
    try {
      setPhotoURL('');
      await updateUserProfileInDb(user.uid, {
        photoURL: ''
      });
      onLoginSuccess({
        ...user,
        photoURL: ''
      });
      setSuccessMessage('تصویر نمایه کاربری حذف گردید.');
    } catch (err: any) {
      setError('خطا در حذف تصویر نمایه.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpTimerActive && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else if (otpCountdown === 0) {
      setOtpTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [otpTimerActive, otpCountdown]);

  const fetchUserOrders = async (userEmail?: string, userPhone?: string, userId?: string) => {
    if (!userEmail && !userPhone && !userId) return;
    const request = ++ordersRequest.current;
    setIsLoadingOrders(true);
    setOrdersError(false);
    try {
      const orders = await getUserOrdersFromDb(userEmail, userPhone, userId);
      if (ordersRequest.current !== request) return;
      setOrdersOwner(userId);
      setUserOrders(orders);
      setOrdersUpdatedAt(Date.now());
    } catch {
      if (ordersRequest.current === request) setOrdersError(true);
    } finally {
      if (ordersRequest.current === request) setIsLoadingOrders(false);
    }
  };

  // -------------------------------------------------------------
  // SMS OTP Handlers
  // -------------------------------------------------------------
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMessage('');

    const cleanPhone = otpPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setError('لطفاً شماره موبایل ۱۱ رقمی معتبر (مانند ۰۹۱۲۳۴۵۶۷۸۹) وارد فرمایید.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: otpPhone.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'خطا در ارسال کد پیامکی. لطفاً شماره را بررسی فرمایید.');
        return;
      }

      setOtpStep('code');
      setOtpCountdown(data.expiresIn || 120);
      setOtpTimerActive(true);

      if (data.isTestMode && data.warningMessage) {
        setSuccessMessage(data.warningMessage);
      } else {
        setSuccessMessage(data.message || 'کد تایید با موفقیت از طریق پیامک ارسال شد.');
      }
    } catch (err: any) {
      console.error('OTP Send Error:', err);
      setError('خطا در برقراری ارتباط با سامانه ارسال پیامک. لطفاً اتصال اینترنت را بررسی فرمایید.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otpCode || otpCode.trim().length < 4) {
      setError('لطفاً کد تایید ۵ رقمی را به صورت کامل وارد نمایید.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: otpPhone.trim(),
          code: otpCode.trim(),
          displayName: otpName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'کد تایید وارد شده نادرست یا منقضی شده است.');
        return;
      }

      const savedProfile = saveVerifiedCustomerSession(data.user, data.token);
      onLoginSuccess(savedProfile);
      setSuccessMessage(`خوش آمدید، ${savedProfile.displayName}! ورود با موفقیت انجام شد.`);
      setOtpStep('phone');
      setOtpCode('');
    } catch (err: any) {
      console.error('OTP Verify Error:', err);
      setError('خطا در تایید کد پیامکی. لطفاً مجدداً تلاش فرمایید.');
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Email Registration & Login Handlers
  // -------------------------------------------------------------
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setError('لطفاً نام و نام خانوادگی خود را وارد نمایید.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('لطفاً یک آدرس ایمیل معتبر وارد کنید.');
      return;
    }
    if (password.length < 6) {
      setError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (password !== confirmPassword) {
      setError('رمز عبور با تکرار آن مطابقت ندارد.');
      return;
    }

    setIsLoading(true);
    try {
      const { profile } = await registerNewUser({
        email: email.trim(),
        password,
        displayName: name.trim(),
        phoneNumber: phone.trim(),
      });

      setPendingUid(profile.uid);
      setPendingEmail(email.trim());
      setViewMode('verify-email');
      setEmailVerifyCountdown(0);
      setEmailTimerActive(false);
      setSuccessMessage(`کد فعال‌سازی ۶ رقمی به آدرس ${email.trim()} ارسال گردید. لطفاً ایمیل خود را بررسی فرمایید.`);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use' || err.message?.includes('قبلاً')) {
        setError('این ایمیل قبلاً در سیستم ثبت شده است. لطفاً وارد حساب خود شوید.');
      } else {
        setError(err.message || 'خطا در ثبت‌نام. لطفاً مجدداً تلاش کنید.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailVerificationCode.trim()) {
      setError('لطفاً کد ۶ رقمی فعال‌سازی را وارد فرمایید.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const verifiedProfile = await verifyUserEmailWithCode(
        { uid: pendingUid, email: pendingEmail },
        emailVerificationCode.trim()
      );
      onLoginSuccess(verifiedProfile);
      setSuccessMessage(`خوش آمدید، ${verifiedProfile.displayName}! ایمیل شما با موفقیت تایید شد.`);
      setViewMode('login');
      setEmailVerificationCode('');
    } catch (err: any) {
      setError(err.message || 'کد فعال‌سازی وارد شده نادرست یا منقضی شده است.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailCode = async () => {
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await resendEmailVerification({ uid: pendingUid, email: pendingEmail });
      setSuccessMessage('کد فعال‌سازی مجدداً به ایمیل شما ارسال گردید.');
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال مجدد کد فعال‌سازی.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('لطفاً ایمیل و رمز عبور را وارد فرمایید.');
      return;
    }

    setIsLoading(true);
    try {
      const { profile } = await loginWithEmail(email.trim(), password);
      onLoginSuccess(profile);
      setSuccessMessage(`خوش آمدید، ${profile.displayName}!`);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.isLocked) {
        setError(err.message || 'به دلیل ۵ تلاش ناموفق مکرر، ورود موقتاً مسدود شده است.');
        if (err.remainingSeconds) {
          setLockoutRemaining(err.remainingSeconds);
        }
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('ایمیل یا رمز عبور وارد شده نادرست است.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const button = googleButton.current;
    if (user || !button) return;
    let active = true;
    initGoogleSignIn(button, async (credential) => {
      if (!active) return;
      setError('');
      setIsGoogleLoading(true);
      try {
        const profile = await syncGoogleUserProfile(credential);
        if (active) onLoginSuccess(profile);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'خطا در ورود با گوگل.');
      } finally {
        if (active) setIsGoogleLoading(false);
      }
    }, () => active).catch(() => {
      if (active) setError('ورود با گوگل موقتاً در دسترس نیست.');
    });
    return () => {
      active = false;
      button.replaceChildren();
    };
  }, [user, onLoginSuccess]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('لطفاً یک آدرس ایمیل معتبر وارد فرمایید.');
      return;
    }
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await requestPasswordResetCode(email.trim());
      setForgotStep('verify');
      setForgotCountdown(120);
      setForgotTimerActive(true);
      setSuccessMessage('کد تایید ۶ رقمی به ایمیل ' + email.trim() + ' ارسال شد. لطفاً آن را به همراه رمز عبور جدید وارد فرمایید.');
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال کد بازیابی رمز عبور.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendResetCode = async () => {
    if (!email.trim() || !email.includes('@')) return;
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await requestPasswordResetCode(email.trim());
      setForgotCountdown(120);
      setForgotTimerActive(true);
      setSuccessMessage('کد تایید جدید به ایمیل شما ارسال شد.');
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال مجدد کد.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = resetCode.trim();
    if (!cleanCode || cleanCode.length < 4) {
      setError('لطفاً کد ۶ رقمی تایید را به درستی وارد فرمایید.');
      return;
    }
    if (!resetNewPassword || resetNewPassword.length < 6) {
      setError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setError('تکرار رمز عبور جدید با رمز وارد شده مطابقت ندارد.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const res = await confirmPasswordResetWithCode(email.trim(), cleanCode, resetNewPassword);
      setSuccessMessage(res.message || 'رمز عبور شما با موفقیت تغییر یافت! لطفاً با رمز عبور جدید وارد شوید.');
      setResetCode('');
      setResetNewPassword('');
      setResetConfirmPassword('');
      setForgotStep('request');
      setViewMode('login');
    } catch (err: any) {
      setError(err.message || 'کد وارد شده صحیح نمی‌باشد یا منقضی شده است.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;
    setIsSendingVerification(true);
    setError('');
    setSuccessMessage('');
    try {
      await resendEmailVerification(user);
      setSuccessMessage('ایمیل فعال‌سازی مجدداً به آدرس شما ارسال شد.');
    } catch (err: any) {
      setError(err.message || 'خطا در ارسال مجدد ایمیل فعال‌سازی.');
    } finally {
      setIsSendingVerification(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      onLogoutSuccess();
      setViewMode('login');
      setOtpStep('phone');
      setSuccessMessage('با موفقیت از حساب کاربری خود خارج شدید.');
    } catch (err: any) {
      setError('خطا در خروج از حساب کاربری.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfileInfo = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    setError('');
    setSuccessMessage('');
    try {
      await updateUserProfileInDb(user.uid, {
        displayName: name.trim() || user.displayName,
        phoneNumber: phone.trim() || user.phoneNumber,
        province: province.trim(),
        city: city.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        skinProfile: {
          ...(user.skinProfile || {
            ageGroup: '25-34',
            sensitivityLevel: 'متوسط',
            currentRoutine: 'پایه',
            summaryLabelEn: 'Custom Profile',
            summaryLabelFa: 'پروفایل سفارشی',
            morningSteps: [],
            nightSteps: [],
            recommendedProductIds: [],
            createdAt: new Date().toISOString()
          }),
          skinType: userSkinType,
          primaryConcern: userPrimaryConcern,
        }
      });

      onLoginSuccess({
        ...user,
        displayName: name.trim() || user.displayName,
        phoneNumber: phone.trim() || user.phoneNumber,
        province: province.trim(),
        city: city.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        skinProfile: {
          ...(user.skinProfile || {
            ageGroup: '25-34',
            sensitivityLevel: 'متوسط',
            currentRoutine: 'پایه',
            summaryLabelEn: 'Custom Profile',
            summaryLabelFa: 'پروفایل سفارشی',
            morningSteps: [],
            nightSteps: [],
            recommendedProductIds: [],
            createdAt: new Date().toISOString()
          }),
          skinType: userSkinType,
          primaryConcern: userPrimaryConcern,
        }
      });

      setIsEditingInfo(false);
      setSuccessMessage('اطلاعات حساب و نشانی شما با موفقیت ذخیره شد.');
    } catch (err: any) {
      setError('خطا در ذخیره تغییرات: ' + (err.message || ''));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleCopyTrackingCode = (code: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedTrackingId(code);
      setTimeout(() => setCopiedTrackingId(null), 2500);
    }
  };

  const filteredOrders = currentOrders.filter((ord) => {
    if (orderStatusFilter === 'all') return true;
    return ord.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen py-8 sm:py-12 text-right font-vazir text-[var(--vara-ink)]" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-vara-line pb-4">
          <nav className="flex items-center gap-2 text-xs font-vazir text-vara-muted">
            <button 
              onClick={onNavigateToHome} 
              className="hover:text-vara-rose-ink transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>صفحه اصلی</span>
            </button>
            <span className="text-vara-line">/</span>
            <span className="text-vara-rose-ink font-semibold">حساب کاربری</span>
          </nav>

          <button
            onClick={onBackToShop}
            className="text-xs font-semibold text-vara-rose-ink hover:text-vara-rose-ink flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>بازگشت به فروشگاه</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="bg-white border border-red-200 text-red-700 p-4 rounded-xl text-xs font-vazir flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-white border border-emerald-200 text-[#15803D] p-4 rounded-xl text-xs font-vazir flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#15803D]" />
            <span className="leading-relaxed font-medium">{successMessage}</span>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: AUTHENTICATED USER PROFILE DASHBOARD */}
        {/* ------------------------------------------------------------- */}
        {user ? (
          <div className="space-y-6 animate-fadeIn">
            
            {/* User Profile Hero Header */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-vara-line shadow-vara-float">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Right (RTL): Avatar & Identity Details */}
                <div className="flex items-center gap-4 sm:gap-5">
                  <div className="relative group">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleProfilePhotoFileChange}
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      className="hidden"
                    />

                    <div className="w-18 h-18 sm:w-20 sm:h-20 bg-vara-rose text-white rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold font-vazir border border-vara-line overflow-hidden relative">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'تصویر پروفایل'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{(user.displayName?.trim() || 'کاربر').charAt(0) || 'و'}</span>
                      )}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="absolute inset-0 bg-vara-ink/75 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-vazir font-semibold p-1 text-center"
                        title="تغییر یا آپلود عکس پروفایل"
                      >
                        {isUploadingPhoto ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Camera className="w-4 h-4" />
                            <span>تغییر عکس</span>
                          </>
                        )}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="absolute -bottom-1 -left-1 bg-vara-rose hover:bg-vara-rose-hover text-white p-1.5 rounded-full border-2 border-white transition-colors cursor-pointer"
                      title="افزودن یا تغییر عکس پروفایل"
                    >
                      {isUploadingPhoto ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Camera className="w-3 h-3" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-jakarta uppercase tracking-[0.14em] text-vara-rose-ink font-bold block w-full">
                        VARA BOUTIQUE MEMBER
                      </span>
                      <h1 className="text-lg sm:text-xl font-bold font-vazir text-vara-ink">
                        {user.displayName || 'کاربر گرامی ورا بیوتی'}
                      </h1>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-vazir text-vara-muted-strong flex-wrap">
                      {user.phoneNumber && (
                        <span className="flex items-center gap-1.5 dir-ltr font-jakarta tabular-nums">
                          <Phone className="w-3.5 h-3.5 text-vara-rose-ink" />
                          <span>{user.phoneNumber}</span>
                        </span>
                      )}
                      {user.email && (
                        <span className="flex items-center gap-1.5 dir-ltr font-jakarta">
                          <Mail className="w-3.5 h-3.5 text-vara-rose-ink" />
                          <span>{user.email}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Left (RTL): Quick Stat Badges */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
                  <div className="bg-vara-surface border border-vara-line p-3.5 rounded-xl text-center min-w-[90px]">
                    <span className="text-[10px] font-vazir text-vara-muted block">سفارش‌ها</span>
                    <strong className="text-sm font-bold font-jakarta tabular-nums text-vara-rose-ink mt-1 block">
                      {userOrders.length.toLocaleString('fa-IR')}
                    </strong>
                  </div>

                  <div className="bg-vara-surface border border-vara-line p-3.5 rounded-xl text-center min-w-[90px]">
                    <span className="text-[10px] font-vazir text-vara-muted block">علاقه‌مندی‌ها</span>
                    <strong className="text-sm font-bold font-jakarta tabular-nums text-vara-rose-ink mt-1 block">
                      {wishlistProducts.length.toLocaleString('fa-IR')}
                    </strong>
                  </div>

                  <div className="bg-vara-surface border border-vara-line p-3.5 rounded-xl text-center min-w-[90px]">
                    <span className="text-[10px] font-vazir text-vara-muted block">وضعیت حساب</span>
                    <strong className="text-xs font-semibold font-vazir text-[#15803D] mt-1 flex items-center justify-center gap-1">
                      <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      <span>فعال</span>
                    </strong>
                  </div>
                </div>

              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-vara-line scrollbar-none bg-white px-2 pt-2 rounded-t-2xl border-x border-t">
              {[
                { id: 'orders', label: `سفارش‌ها و رهگیری (${userOrders.length.toLocaleString('fa-IR')})` },
                { id: 'info', label: 'مشخصات و نشانی ارسال' },
                { id: 'skin', label: 'پروفایل پوستی من' },
                { id: 'wishlist', label: `علاقه‌مندی‌ها (${wishlistProducts.length.toLocaleString('fa-IR')})` },
                { id: 'security', label: 'امنیت و خروج' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-4 text-xs font-vazir transition-all shrink-0 cursor-pointer border-b-2 -mb-[1px] ${
                    activeTab === tab.id
                      ? 'border-vara-rose text-vara-rose-ink font-bold'
                      : 'border-transparent text-vara-muted hover:text-vara-ink font-medium'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: ORDERS & TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                
                {/* Orders Filter Row */}
                <div className="flex items-center justify-between gap-4 flex-wrap bg-white p-4 rounded-2xl border border-vara-line">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold font-vazir text-vara-muted-strong">فیلتر وضعیت:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { id: 'all', label: 'همه' },
                        { id: 'processing', label: 'در حال آماده‌سازی' },
                        { id: 'shipped', label: 'ارسال شده' },
                        { id: 'delivered', label: 'تحویل شده' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setOrderStatusFilter(st.id as any)}
                          className={`px-3 py-1.5 rounded-full text-xs font-vazir transition-colors cursor-pointer ${
                            orderStatusFilter === st.id
                              ? 'bg-vara-rose text-white font-semibold'
                              : 'bg-vara-surface text-vara-muted-strong hover:text-vara-rose-ink'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => fetchUserOrders(user.email, user.phoneNumber, user.uid)}
                    disabled={isLoadingOrders}
                    className="text-xs font-vazir font-medium text-vara-muted-strong hover:text-vara-rose-ink flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                    <span>به‌روزرسانی</span>
                  </button>
                </div>

                {ordersError && <div className="vara-status" data-tone="warning" role="alert">
                  <span>{currentOrders.length ? 'دریافت تازه انجام نشد. آخرین فهرست موفق نمایش داده می‌شود.' : 'فهرست سفارش‌ها در دسترس نیست.'}</span>
                  {currentOrders.length > 0 && ordersUpdatedAt && <time dateTime={new Date(ordersUpdatedAt).toISOString()}>
                    آخرین دریافت {new Date(ordersUpdatedAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                  </time>}
                </div>}
                {/* Orders Content */}
                {isLoadingOrders ? (
                  <div className="bg-white rounded-2xl p-12 text-center text-xs font-vazir text-vara-muted border border-vara-line flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-5 h-5 animate-spin text-vara-rose-ink" />
                    <span>در حال دریافت فهرست سفارش‌ها...</span>
                  </div>
                ) : currentOrders.length === 0 ? ordersError ? null : (
                  <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-vara-line">
                    <div className="w-14 h-14 rounded-2xl bg-vara-surface border border-vara-line text-vara-rose-ink flex items-center justify-center mx-auto">
                      <Package className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold font-vazir text-vara-ink">هنوز سفارشی ثبت نکرده‌اید</h3>
                      <p className="text-xs font-vazir text-vara-muted max-w-md mx-auto leading-relaxed">
                        سفارش‌های شما به همراه کد رهگیری پستی و جزئیات اقلام در این بخش نمایش داده می‌شوند.
                      </p>
                    </div>
                    <button
                      onClick={onBackToShop}
                      className="bg-vara-rose hover:bg-vara-rose-hover text-white px-6 py-3 rounded-full text-xs font-vazir font-semibold transition-colors inline-flex items-center cursor-pointer shadow-vara-float"
                    >
                      <span>مشاهده محصولات فروشگاه</span>
                    </button>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center text-xs font-vazir text-vara-muted border border-vara-line">
                    سفارشی با این فیلتر وضعیت یافت نشد.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div 
                        key={order.id}
                        className="bg-white rounded-2xl p-5 sm:p-6 border border-vara-line space-y-4 transition-colors hover:border-vara-tint-line"
                      >
                        {/* Order Header Summary */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-vara-line">
                          <div className="flex items-center gap-3">
                            <span className="font-jakarta font-bold tabular-nums text-xs text-vara-rose-ink bg-vara-surface px-3 py-1.5 rounded-full border border-vara-line dir-ltr">
                              {order.orderNumber}
                            </span>
                            <span className="text-xs font-vazir text-vara-muted flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-vara-rose-ink" />
                              <span>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-semibold px-3 py-1 rounded-full font-vazir flex items-center gap-1.5 border ${
                              order.status === 'delivered' ? 'bg-emerald-50 text-[#15803D] border-emerald-200' :
                              order.status === 'shipped' ? 'bg-vara-rose text-white border-vara-rose' :
                              order.status === 'processing' ? 'bg-amber-50 text-[#B45309] border-amber-200' :
                              order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                              'bg-vara-surface text-vara-muted-strong border-vara-line'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              <span>
                                {order.status === 'delivered' ? 'تحویل شده' :
                                 order.status === 'shipped' ? 'ارسال شده' :
                                 order.status === 'processing' ? 'در حال آماده‌سازی' :
                                 order.status === 'cancelled' ? 'لغو شده' : 'در انتظار بررسی'}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Iran Post Postal Tracking Code Box */}
                        {order.postalTrackingCode && (
                          <div className="bg-vara-surface border border-vara-line p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-vara-rose text-white flex items-center justify-center shrink-0">
                                <Truck className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold font-vazir text-vara-ink">کد رهگیری مرسوله پستی</h4>
                                <p className="text-[11px] font-vazir text-vara-muted">
                                  قابل پیگیری در سامانه رهگیری مرسولات پستی (tracking.post.ir)
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-jakarta font-bold tabular-nums text-xs text-vara-ink bg-white px-3.5 py-2 rounded-full border border-vara-line dir-ltr select-all">
                                {order.postalTrackingCode}
                              </span>
                              <button
                                onClick={() => handleCopyTrackingCode(order.postalTrackingCode || '')}
                                className="bg-vara-rose hover:bg-vara-rose-hover text-white px-3 py-2 rounded-full text-xs font-vazir font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                                title="کپی کد رهگیری"
                              >
                                {copiedTrackingId === order.postalTrackingCode ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                                    <span>کپی شد</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>کپی</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Order Items List */}
                        <div className="space-y-2.5">
                          <h5 className="text-xs font-semibold font-vazir text-vara-muted-strong">اقلام سفارش ({order.items.length.toLocaleString('fa-IR')} مورد):</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {order.items.map((item, idx) => (
                              <div 
                                key={idx} 
                                className="flex items-center gap-3 bg-vara-canvas border border-vara-line p-2.5 rounded-xl"
                              >
                                <div className="w-12 h-12 rounded-lg bg-vara-surface border border-vara-line p-1 shrink-0 overflow-hidden">
                                  <img 
                                    src={item.image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=100&auto=format&fit=crop&q=80'} 
                                    alt={item.nameFa}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h6 className="font-semibold text-xs font-vazir text-vara-ink truncate">{item.nameFa}</h6>
                                  <div className="flex items-center justify-between text-[11px] font-vazir text-vara-muted mt-1">
                                    <span>{item.sizeLabel}</span>
                                    <span className="font-semibold text-vara-rose-ink tabular-nums">{item.quantity.toLocaleString('fa-IR')} عدد</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Delivery & Payment Footer */}
                        <div className="pt-3 border-t border-vara-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-vazir">
                          <div className="text-vara-muted-strong flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-vara-rose-ink" />
                            <span>مقصد: {order.customer.province}، {order.customer.city}</span>
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <div className="text-right">
                              <span className="text-[10px] text-vara-muted block">مبلغ کل:</span>
                              <strong className="text-sm font-bold font-vazir tabular-nums text-vara-rose-ink">
                                {order.totalAmount.toLocaleString('fa-IR')} تومان
                              </strong>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedOrderForInvoice(order);
                                setTimeout(() => window.print(), 300);
                              }}
                              className="bg-white hover:bg-vara-surface text-vara-ink border border-vara-line hover:border-vara-tint-line px-3.5 py-2 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5 text-vara-rose-ink" />
                              <span>چاپ فاکتور</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: PERSONAL INFO & ADDRESSES */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Editable Information */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-vara-line space-y-6">
                  <div className="flex items-center justify-between border-b border-vara-line pb-4">
                    <div>
                      <h3 className="text-sm font-bold font-vazir text-vara-ink">مشخصات فردی و نشانی ارسال</h3>
                      <p className="text-xs font-vazir text-vara-muted mt-0.5">اطلاعات گیرنده و آدرس پستی پیش‌فرض جهت تحویل مرسولات</p>
                    </div>

                    {!isEditingInfo ? (
                      <button
                        onClick={() => setIsEditingInfo(true)}
                        className="bg-vara-rose hover:bg-vara-rose-hover text-white px-4 py-2 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>ویرایش اطلاعات</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditingInfo(false)}
                        className="text-xs font-vazir text-vara-muted hover:text-vara-ink cursor-pointer"
                      >
                        انصراف
                      </button>
                    )}
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="bg-vara-surface border border-vara-line p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-full bg-vara-rose text-white flex items-center justify-center text-lg font-bold font-vazir overflow-hidden border border-vara-line shrink-0">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'تصویر پروفایل'}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{(user.displayName?.trim() || 'کاربر').charAt(0) || 'و'}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-vazir text-vara-ink">تصویر نمایه کاربری</h4>
                        <p className="text-[11px] font-vazir text-vara-muted mt-0.5">
                          فرمت‌های مجاز: JPG, PNG, WebP
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="bg-white hover:bg-vara-canvas text-vara-ink border border-vara-line px-3.5 py-2 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingPhoto ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-vara-rose-ink" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-vara-rose-ink" />
                        )}
                        <span>{user.photoURL ? 'تغییر تصویر' : 'آپلود تصویر'}</span>
                      </button>

                      {user.photoURL && (
                        <button
                          type="button"
                          onClick={handleRemoveProfilePhoto}
                          disabled={isUploadingPhoto}
                          className="bg-white hover:bg-red-50 text-red-600 border border-vara-line px-3 py-2 rounded-full text-xs font-vazir font-medium transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfileInfo(); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold font-vazir text-vara-ink mb-1.5 block">
                          نام و نام خانوادگی
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            disabled={!isEditingInfo}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="نام و نام خانوادگی"
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir pl-10 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white disabled:opacity-75 transition-colors"
                          />
                          <User className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold font-vazir text-vara-ink mb-1.5 block">
                          شماره موبایل
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            disabled={!isEditingInfo}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-jakarta tabular-nums pl-10 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr disabled:opacity-75 transition-colors"
                          />
                          <Phone className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold font-vazir text-vara-ink mb-1.5 block">
                        آدرس ایمیل
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          disabled={!isEditingInfo}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="user@example.com"
                          className="w-full bg-vara-canvas text-vara-ink text-xs font-jakarta pl-10 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr disabled:opacity-75 transition-colors"
                        />
                        <Mail className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Shipping Address Inputs */}
                    <div className="pt-4 border-t border-vara-line space-y-4">
                      <h4 className="text-xs font-bold font-vazir text-vara-ink flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-vara-rose-ink" />
                        <span>نشانی پیش‌فرض ارسال مرسولات</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-vazir text-vara-muted-strong mb-1 block">استان</label>
                          <input
                            type="text"
                            disabled={!isEditingInfo}
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            placeholder="مثلاً: تهران"
                            className="w-full bg-vara-canvas text-xs font-vazir px-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white disabled:opacity-75 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-vazir text-vara-muted-strong mb-1 block">شهر</label>
                          <input
                            type="text"
                            disabled={!isEditingInfo}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="مثلاً: تهران"
                            className="w-full bg-vara-canvas text-xs font-vazir px-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white disabled:opacity-75 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-vazir text-vara-muted-strong mb-1 block">نشانی دقیق پستی (خیابان، کوچه، پلاک، واحد)</label>
                        <textarea
                          disabled={!isEditingInfo}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="نشانی کامل پستی جهت تحویل مرسوله..."
                          rows={3}
                          className="w-full bg-vara-canvas text-xs font-vazir px-3.5 py-2.5 rounded-xl border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white disabled:opacity-75 transition-colors"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-vazir text-vara-muted-strong mb-1 block">کد پستی ۱۰ رقمی</label>
                          <input
                            type="text"
                            disabled={!isEditingInfo}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="۱۲۳۴۵۶۷۸۹۰"
                            className="w-full bg-vara-canvas text-xs font-jakarta tabular-nums px-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr disabled:opacity-75 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingInfo && (
                      <div className="pt-4 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setIsEditingInfo(false)}
                          className="px-4 py-2.5 rounded-full border border-vara-line text-xs font-vazir font-medium text-vara-muted-strong hover:text-vara-ink hover:bg-vara-surface transition-colors cursor-pointer"
                        >
                          انصراف
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="bg-vara-rose hover:bg-vara-rose-hover text-white px-6 py-2.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          {isSavingProfile ? (
                            <span>در حال ذخیره...</span>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>ذخیره تغییرات</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Support & Authenticity Info */}
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 border border-vara-line space-y-3">
                    <span className="text-[10px] font-jakarta uppercase tracking-[0.14em] text-vara-rose-ink font-bold block">
                      CLIENT CONCIERGE
                    </span>
                    <h4 className="text-xs font-bold font-vazir text-vara-ink">پشتیبانی سفارش‌ها</h4>
                    <p className="text-xs font-vazir text-vara-muted-strong leading-relaxed">
                      برای پیگیری وضعیت تامین از امارات یا هماهنگی ارسال پستی، تیم پشتیبانی ورا بیوتی پاسخگوی شماست.
                    </p>
                    <div className="pt-2 border-t border-vara-line text-xs font-vazir font-semibold text-vara-ink">
                      ساعات پاسخگویی: شنبه تا پنج‌شنبه، ۹ الی ۲۱
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: SKIN PROFILE & ROUTINE */}
            {activeTab === 'skin' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-vara-line space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-vara-line pb-4">
                    <div>
                      <span className="text-[10px] font-jakarta uppercase tracking-[0.14em] text-vara-rose-ink font-bold block mb-1">
                        DERMATOLOGICAL PROFILE
                      </span>
                      <h3 className="text-sm font-bold font-vazir text-vara-ink">
                        پروفایل و پروتکل مراقبت پوست شما
                      </h3>
                      <p className="text-xs font-vazir text-vara-muted mt-0.5">
                        تنظیم شده بر اساس تیپ پوستی و دغدغه اصلی درمانی شما
                      </p>
                    </div>

                    <button
                      onClick={onOpenQuiz}
                      className="bg-vara-rose hover:bg-vara-rose-hover text-white px-4 py-2.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>مشاوره مجدد روتین</span>
                    </button>
                  </div>

                  {/* Skin Characteristics Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-vara-canvas border border-vara-line p-5 rounded-xl space-y-3">
                      <label className="text-xs font-bold font-vazir text-vara-ink block">تیپ پوست:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'dry', label: 'خشک' },
                          { id: 'combination', label: 'مختلط' },
                          { id: 'oily', label: 'چرب' },
                          { id: 'sensitive', label: 'حساس' },
                          { id: 'normal', label: 'نرمال' },
                        ].map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setUserSkinType(t.id as SkinType)}
                            className={`py-2 px-3 rounded-full text-xs font-vazir transition-colors cursor-pointer border ${
                              userSkinType === t.id
                                ? 'bg-vara-rose text-white border-vara-rose font-semibold'
                                : 'bg-white text-vara-muted-strong border-vara-line hover:border-vara-tint-line'
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-vara-canvas border border-vara-line p-5 rounded-xl space-y-3">
                      <label className="text-xs font-bold font-vazir text-vara-ink block">هدف اصلی مراقبت:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'hydration', label: 'آبرسانی و سد دفاعی' },
                          { id: 'anti-aging', label: 'جوانسازی و ضد چروک' },
                          { id: 'acne-blemish', label: 'کنترل جوش و منافذ' },
                          { id: 'brightening', label: 'روشن‌کنندگی و ضد لک' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setUserPrimaryConcern(c.id as SkinConcern)}
                            className={`py-2 px-3 rounded-full text-xs font-vazir transition-colors cursor-pointer border ${
                              userPrimaryConcern === c.id
                                ? 'bg-vara-rose text-white border-vara-rose font-semibold'
                                : 'bg-white text-vara-muted-strong border-vara-line hover:border-vara-tint-line'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Daily Routine */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold font-vazir text-vara-ink">پروتکل روزانه پیشنهادی:</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Morning Routine */}
                      <div className="bg-vara-surface border border-vara-line p-5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold font-vazir text-vara-ink border-b border-vara-line pb-2.5">
                          <span>نوبت صبح</span>
                          <span className="font-jakarta text-[10px] tracking-widest uppercase text-vara-rose-ink">AM PROTOCOL</span>
                        </div>
                        <ul className="text-xs font-vazir text-vara-muted-strong space-y-2.5 pt-1">
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">01</span>
                            <span>شوینده ملایم و تنظیم‌کننده pH</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">02</span>
                            <span>سرم آنتی‌اکسیدان ویتامین C یا هیالورونیک اسید</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">03</span>
                            <span>مرطوب‌کننده تقویت‌کننده سد دفاعی پوست</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">04</span>
                            <span>ضد آفتاب طیف گسترده SPF 50+</span>
                          </li>
                        </ul>
                      </div>

                      {/* Night Routine */}
                      <div className="bg-vara-surface border border-vara-line p-5 rounded-xl space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold font-vazir text-vara-ink border-b border-vara-line pb-2.5">
                          <span>نوبت شب</span>
                          <span className="font-jakarta text-[10px] tracking-widest uppercase text-vara-rose-ink">PM PROTOCOL</span>
                        </div>
                        <ul className="text-xs font-vazir text-vara-muted-strong space-y-2.5 pt-1">
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">01</span>
                            <span>پاکسازی دو مرحله‌ای (میسلار واتر / بالم + شوینده)</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">02</span>
                            <span>سرم درمانی شب (رتینول / نیاسینامید / پپتاید)</span>
                          </li>
                          <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-vara-line font-jakarta font-bold text-[10px] flex items-center justify-center text-vara-rose-ink">03</span>
                            <span>کرم بازسازی‌کننده شب و مراقبت دور چشم</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        onClick={handleSaveProfileInfo}
                        disabled={isSavingProfile}
                        className="bg-vara-rose hover:bg-vara-rose-hover text-white px-6 py-2.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        {isSavingProfile ? <span>در حال ذخیره...</span> : <span>ذخیره پروفایل پوستی</span>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-vara-line">
                    <div className="w-14 h-14 rounded-2xl bg-vara-surface border border-vara-line text-vara-rose-ink flex items-center justify-center mx-auto">
                      <Heart className="w-6 h-6 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold font-vazir text-vara-ink">لیست علاقه‌مندی‌های شما خالی است</h3>
                      <p className="text-xs font-vazir text-vara-muted max-w-md mx-auto leading-relaxed">
                        محصولات مورد نظر خود را با لمس نشانگر قلب ذخیره کنید تا در مراجعات بعدی سریع‌تر به آن‌ها دسترسی داشته باشید.
                      </p>
                    </div>
                    <button
                      onClick={onBackToShop}
                      className="bg-vara-rose hover:bg-vara-rose-hover text-white px-6 py-3 rounded-full text-xs font-vazir font-semibold transition-colors inline-flex items-center cursor-pointer shadow-vara-float"
                    >
                      <span>مشاهده فروشگاه</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {wishlistProducts.map((product) => {
                      const defaultSz = product.sizes?.[0] || { label: '۳۰ میل', labelEn: '30ml', price: product.price };
                      return (
                        <div 
                          key={product.id}
                          className="bg-white rounded-2xl p-4 border border-vara-line flex flex-col justify-between group transition-colors hover:border-vara-tint-line"
                        >
                          <div className="space-y-3">
                            <div className="relative aspect-square rounded-xl overflow-hidden bg-vara-surface p-4">
                              <img 
                                src={product.images[0]} 
                                alt={product.nameFa}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                              />
                              {onRemoveFromWishlist && (
                                <button
                                  onClick={() => onRemoveFromWishlist(product.id)}
                                  className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-vara-rose-ink flex items-center justify-center border border-vara-line transition-colors cursor-pointer"
                                  title="حذف از علاقه‌مندی‌ها"
                                >
                                  <Heart className="w-4 h-4 fill-vara-rose" />
                                </button>
                              )}
                            </div>

                            <div>
                              <span className="text-[10px] font-jakarta uppercase tracking-wider text-vara-rose-ink font-bold block truncate">
                                {product.brand || product.nameEn}
                              </span>
                              <h4 className="font-semibold text-xs font-vazir text-vara-ink line-clamp-2 mt-1 min-h-[2.25rem]">
                                {product.nameFa}
                              </h4>
                              <div className="font-bold font-vazir tabular-nums text-xs text-vara-rose-ink mt-1.5">
                                {defaultSz.price.toLocaleString('fa-IR')} تومان
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-vara-line grid grid-cols-2 gap-2 mt-3">
                            <button
                              onClick={() => onViewProduct(product)}
                              className="py-2 px-2 bg-vara-canvas hover:bg-vara-surface text-vara-ink border border-vara-line rounded-full text-xs font-vazir font-medium transition-colors text-center cursor-pointer"
                            >
                              مشاهده
                            </button>
                            <button
                              onClick={() => onAddToCart(product, defaultSz)}
                              className="py-2 px-2 bg-vara-rose hover:bg-vara-rose-hover text-white rounded-full text-xs font-vazir font-semibold transition-colors text-center cursor-pointer"
                            >
                              + افزودن
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SECURITY & LOGOUT */}
            {activeTab === 'security' && (
              <div className="max-w-xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-vara-line space-y-6">
                <div className="space-y-1 border-b border-vara-line pb-4">
                  <h3 className="text-sm font-bold font-vazir text-vara-ink">امنیت و نشست کاربری</h3>
                  <p className="text-xs font-vazir text-vara-muted">مدیریت تایید حساب و خروج امن از سامانه</p>
                </div>

                {user.email && (
                  <div className="bg-vara-canvas border border-vara-line p-4 rounded-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold font-vazir text-vara-ink">وضعیت تایید ایمیل</h4>
                        <p className="text-[11px] font-vazir text-vara-muted mt-0.5">
                          {user.emailVerified ? 'آدرس ایمیل شما تایید شده است' : 'آدرس ایمیل در انتظار تایید است'}
                        </p>
                      </div>
                      {user.emailVerified ? (
                        <span className="text-[11px] font-semibold text-[#15803D] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-vazir">
                          تایید شده
                        </span>
                      ) : (
                        <button
                          onClick={handleResendVerification}
                          disabled={isSendingVerification}
                          className="text-xs font-vazir font-semibold text-vara-rose-ink underline cursor-pointer"
                        >
                          {isSendingVerification ? 'در حال ارسال...' : 'ارسال کد تایید'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="w-full bg-white hover:bg-red-50 text-red-600 border border-vara-line hover:border-red-200 py-3 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isLoading ? 'در حال خروج...' : 'خروج از حساب کاربری'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: GUEST / UNAUTHENTICATED LOGIN & REGISTER HUB */
          /* ------------------------------------------------------------- */
          <div className="max-w-md mx-auto animate-fadeIn py-4">
            
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-vara-line shadow-vara-float space-y-6">
              
              {/* Header Title */}
              <div className="text-center space-y-1.5 border-b border-vara-line pb-5">
                <h1 className="text-2xl font-bold">حساب کاربری ورا</h1>
                <p className="text-xs font-vazir text-vara-muted leading-relaxed">
                  برای پیگیری سفارش‌ها، مدیریت نشانی و دسترسی به پروفایل پوستی وارد شوید.
                </p>
              </div>

              {/* Method Switcher: OTP SMS vs Email */}
              <div className="grid grid-cols-2 gap-1.5 bg-vara-surface p-1 rounded-xl border border-vara-line">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('otp');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className={`py-2.5 rounded-full text-xs font-vazir transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'otp'
                      ? 'bg-vara-rose text-white font-semibold shadow-xs'
                      : 'text-vara-muted-strong hover:text-vara-rose-ink font-medium'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>ورود با پیامک</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('email');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className={`py-2.5 rounded-full text-xs font-vazir transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authMethod === 'email'
                      ? 'bg-vara-rose text-white font-semibold shadow-xs'
                      : 'text-vara-muted-strong hover:text-vara-rose-ink font-medium'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>ورود با ایمیل</span>
                </button>
              </div>

              {/* METHOD 1: OTP SMS FORM */}
              {authMethod === 'otp' ? (
                otpStep === 'phone' ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-right">
                    <div>
                      <label className="text-xs font-semibold font-vazir text-vara-ink mb-1.5 block">
                        شماره موبایل
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          autoFocus
                          placeholder="09123456789"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          className="w-full bg-vara-canvas text-vara-ink text-sm font-jakarta tabular-nums pl-10 pr-4 py-3 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                        />
                        <Phone className="w-4 h-4 text-vara-rose-ink absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || !otpPhone.trim()}
                      className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-vara-float"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>در حال ارسال کد...</span>
                        </div>
                      ) : (
                        <>
                          <span>دریافت کد تایید</span>
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-right">
                    <div className="bg-vara-surface border border-vara-line p-3.5 rounded-xl flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-vazir text-vara-muted block">ارسال شده به شماره:</span>
                        <div className="font-bold font-jakarta tabular-nums text-xs text-vara-ink dir-ltr">{otpPhone}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep('phone');
                          setOtpCode('');
                          setError('');
                        }}
                        className="text-xs text-vara-rose-ink font-semibold font-vazir underline cursor-pointer"
                      >
                        ویرایش شماره
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold font-vazir text-vara-ink mb-1.5 block">
                        کد تایید ۵ رقمی
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        required
                        autoFocus
                        placeholder="• • • • •"
                        value={otpCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                          setOtpCode(val);
                        }}
                        className="w-full bg-vara-canvas text-vara-ink text-xl font-bold font-jakarta tabular-nums tracking-[0.4em] text-center py-3 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white dir-ltr"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading || otpCode.length < 4}
                      className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-vara-float"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>در حال بررسی...</span>
                        </div>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>تایید و ورود</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-1">
                      {otpTimerActive ? (
                        <p className="text-xs font-vazir text-vara-muted">
                          ارسال مجدد کد تا{' '}
                          <span className="font-bold font-jakarta tabular-nums text-vara-rose-ink dir-ltr inline-block">
                            {Math.floor(otpCountdown / 60)}:{(otpCountdown % 60).toString().padStart(2, '0')}
                          </span>{' '}
                          دیگر
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          disabled={isLoading}
                          className="text-xs text-vara-rose-ink font-semibold font-vazir underline cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>ارسال مجدد کد پیامکی</span>
                        </button>
                      )}
                    </div>
                  </form>
                )
              ) : (
                /* METHOD 2: EMAIL AUTHENTICATION */
                <div className="space-y-4">
                  {viewMode === 'verify-email' ? (
                    <form onSubmit={handleVerifyEmail} className="space-y-4 text-right">
                      <div className="text-center space-y-1.5">
                        <div className="w-11 h-11 rounded-xl bg-vara-surface border border-vara-line text-vara-rose-ink flex items-center justify-center mx-auto mb-1">
                          <MailCheck className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-xs font-vazir text-vara-ink">تایید آدرس ایمیل</h4>
                        <p className="text-[11px] text-vara-muted font-vazir">
                          کد فعال‌سازی ۶ رقمی به آدرس زیر ارسال شد:
                        </p>
                        <div className="font-semibold font-jakarta text-xs text-vara-rose-ink dir-ltr inline-block bg-vara-surface px-3 py-1 rounded-lg border border-vara-line">
                          {pendingEmail || email}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold font-vazir text-vara-ink mb-1.5 block text-center">
                          کد ۶ رقمی ارسال شده
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          autoFocus
                          placeholder="• • • • • •"
                          value={emailVerificationCode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setEmailVerificationCode(val);
                          }}
                          className="w-full bg-vara-canvas text-vara-ink text-xl font-bold font-jakarta tabular-nums tracking-[0.4em] text-center py-3 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white dir-ltr"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || emailVerificationCode.length < 5}
                        className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>در حال اعتبارسنجی...</span>
                          </div>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>تایید و فعال‌سازی حساب</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs font-vazir pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setViewMode('register');
                            setEmailVerificationCode('');
                          }}
                          className="text-vara-muted hover:text-vara-ink underline cursor-pointer"
                        >
                          ویرایش مشخصات
                        </button>

                        <button
                          type="button"
                          onClick={handleResendEmailCode}
                          disabled={isLoading}
                          className="text-vara-rose-ink font-semibold underline cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                          <span>ارسال مجدد کد</span>
                        </button>
                      </div>
                    </form>
                  ) : viewMode === 'register' ? (
                    <form onSubmit={handleRegister} className="space-y-3.5 text-right">
                      <div>
                        <label className="text-xs font-semibold font-vazir text-vara-ink mb-1 block">
                          نام و نام خانوادگی
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="مثال: سارا محمدی"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir pl-10 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white transition-colors"
                          />
                          <User className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold font-vazir text-vara-ink mb-1 block">
                          آدرس ایمیل
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="example@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-jakarta pl-10 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                          />
                          <Mail className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-xs font-semibold font-vazir text-vara-ink mb-1 block">
                            رمز عبور
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="حداقل ۶ کاراکتر"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir pl-9 pr-3 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-vara-muted hover:text-vara-ink p-0.5 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold font-vazir text-vara-ink mb-1 block">
                            تکرار رمز عبور
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="تکرار رمز"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir px-3 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-vara-float"
                      >
                        {isLoading ? <span>در حال ثبت‌نام...</span> : <span>تکمیل ثبت‌نام</span>}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('login')}
                          className="text-xs text-vara-rose-ink font-vazir font-semibold underline cursor-pointer"
                        >
                          قبلاً حساب دارید؟ ورود به حساب
                        </button>
                      </div>
                    </form>
                  ) : viewMode === 'forgot-password' ? (
                    forgotStep === 'request' ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4 text-right">
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs font-vazir text-vara-ink">بازیابی رمز عبور</h4>
                          <p className="text-[11px] text-vara-muted font-vazir leading-relaxed">
                            ایمیل حساب خود را وارد کنید تا کد تایید ۶ رقمی جهت تنظیم رمز جدید ارسال شود.
                          </p>
                        </div>

                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="example@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-jakarta pl-10 pr-4 py-3 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                          />
                          <Mail className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isLoading ? <span>در حال ارسال...</span> : <span>ارسال کد بازیابی</span>}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setForgotStep('request');
                            setViewMode('login');
                            setError('');
                          }}
                          className="text-xs text-vara-muted hover:text-vara-ink font-vazir font-medium underline block mx-auto pt-1 cursor-pointer"
                        >
                          بازگشت به صفحه ورود
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleConfirmResetPassword} className="space-y-3.5 text-right">
                        <div className="space-y-1 bg-vara-surface border border-vara-line p-3 rounded-xl text-right">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs font-vazir text-vara-ink">تایید کد و تغییر رمز</span>
                            <button
                              type="button"
                              onClick={() => {
                                setForgotStep('request');
                                setError('');
                              }}
                              className="text-[10px] text-vara-rose-ink underline font-vazir cursor-pointer font-semibold"
                            >
                              تغییر ایمیل
                            </button>
                          </div>
                          <p className="text-[11px] text-vara-muted font-vazir leading-relaxed">
                            کد ۶ رقمی ارسال‌شده به <span className="font-jakarta dir-ltr inline-block font-semibold text-vara-rose-ink">{email}</span> را وارد نمایید.
                          </p>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold font-vazir text-vara-ink mb-1 block">
                            کد تایید ۶ رقمی
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="123456"
                              value={resetCode}
                              onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                              className="w-full bg-vara-canvas text-vara-ink text-base tracking-widest font-jakarta tabular-nums font-bold pl-10 pr-4 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-center dir-ltr"
                            />
                            <KeyRound className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold font-vazir text-vara-ink mb-1 block">
                            رمز عبور جدید (حداقل ۶ کاراکتر)
                          </label>
                          <div className="relative">
                            <input
                              type={showResetPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={resetNewPassword}
                              onChange={(e) => setResetNewPassword(e.target.value)}
                              className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir pl-10 pr-10 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr"
                            />
                            <Lock className="w-4 h-4 text-vara-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <button
                              type="button"
                              onClick={() => setShowResetPassword(!showResetPassword)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-vara-muted hover:text-vara-ink cursor-pointer"
                            >
                              {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold font-vazir text-vara-ink mb-1 block">
                            تکرار رمز عبور جدید
                          </label>
                          <div className="relative">
                            <input
                              type={showResetPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={resetConfirmPassword}
                              onChange={(e) => setResetConfirmPassword(e.target.value)}
                              className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir pl-10 pr-10 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr"
                            />
                            <Lock className="w-4 h-4 text-vara-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isLoading ? <span>در حال ذخیره...</span> : <span>تایید و ثبت رمز جدید</span>}
                        </button>

                        <div className="flex items-center justify-between pt-1 text-[11px] font-vazir">
                          {forgotTimerActive ? (
                            <span className="text-vara-muted flex items-center gap-1 tabular-nums">
                              <Clock className="w-3.5 h-3.5" />
                              ارسال مجدد ({forgotCountdown} ثانیه)
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResendResetCode}
                              disabled={isLoading}
                              className="text-vara-rose-ink underline font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              ارسال مجدد کد
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              setForgotStep('request');
                              setViewMode('login');
                              setError('');
                            }}
                            className="text-vara-muted hover:text-vara-ink font-medium underline cursor-pointer"
                          >
                            انصراف
                          </button>
                        </div>
                      </form>
                    )
                  ) : (
                    <form onSubmit={handleLogin} className="space-y-3.5 text-right">
                      <div>
                        <label htmlFor="vara-login-email" className="text-xs font-semibold font-vazir text-vara-ink mb-1 block">
                          آدرس ایمیل
                        </label>
                        <div className="relative">
                          <input id="vara-login-email" dir="ltr" autoComplete="username"
                            type="email"
                            required
                            placeholder="example@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-jakarta pl-10 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                          />
                          <Mail className="w-4 h-4 text-vara-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label htmlFor="vara-login-password" className="text-xs font-semibold font-vazir text-vara-ink">رمز عبور</label>
                          <button
                            type="button"
                            onClick={() => setViewMode('forgot-password')}
                            className="text-[11px] text-vara-muted hover:text-vara-rose-ink font-vazir underline cursor-pointer"
                          >
                            فراموشی رمز عبور؟
                          </button>
                        </div>
                        <div className="relative">
                          <input id="vara-login-password" dir="ltr" autoComplete="current-password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-vara-canvas text-vara-ink text-xs font-vazir pl-9 pr-3.5 py-2.5 rounded-full border border-vara-line focus:outline-none focus:border-vara-rose focus:bg-white text-left dir-ltr transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'پنهان کردن رمز' : 'نمایش رمز'}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-vara-muted hover:text-vara-ink p-0.5 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || lockoutRemaining > 0}
                        className="w-full bg-vara-rose hover:bg-vara-rose-hover text-white py-3.5 rounded-full text-xs font-vazir font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-vara-float"
                      >
                        {lockoutRemaining > 0 ? (
                          <span className="flex items-center gap-1.5 text-red-200 tabular-nums">
                            <Clock className="w-4 h-4 animate-pulse" />
                            <span>مسدود موقت ({Math.floor(lockoutRemaining / 60)}:{(lockoutRemaining % 60).toString().padStart(2, '0')})</span>
                          </span>
                        ) : isLoading ? (
                          <span>در حال ورود...</span>
                        ) : (
                          <span>ورود به حساب کاربری</span>
                        )}
                      </button>

                      <div className="text-center pt-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('register')}
                          className="text-xs text-vara-rose-ink font-vazir font-semibold underline cursor-pointer"
                        >
                          حساب کاربری ندارید؟ ثبت‌نام کنید
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Google Social Sign In */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-vara-line"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 font-vazir text-vara-muted">یا ادامه با</span>
                </div>
              </div>

              <div ref={googleButton} className="flex justify-center" hidden={isGoogleLoading} />
              {isGoogleLoading && <p role="status">در حال ورود با گوگل...</p>}

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
