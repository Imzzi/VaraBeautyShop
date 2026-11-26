export type CategoryId = 
  | 'all' 
  | 'cleanser'
  | 'anti-aging' 
  | 'hydration' 
  | 'sensitive-skin' 
  | 'acne-blemishes' 
  | 'sunscreen' 
  | 'brightening'
  | 'hair-body'
  | 'makeup';

export type SkinType = 'dry' | 'oily' | 'combination' | 'sensitive' | 'normal';

export type SkincareProductType = 
  | 'cleanser' 
  | 'toner' 
  | 'serum' 
  | 'moisturizer' 
  | 'exfoliator'
  | 'eye-care' 
  | 'sunscreen' 
  | 'mask' 
  | 'lip-care'
  | 'hair-body'
  | 'makeup'
  | 'device';

export type RoutineType = 
  | 'morning' 
  | 'night' 
  | 'anti-aging' 
  | 'hydration' 
  | 'brightening' 
  | 'acne-blemish' 
  | 'barrier-repair' 
  | 'soothing'
  | 'minimal';

export type ShopDepartment = 'skincare' | 'body' | 'lip' | 'hair';

export interface ShopFilterPreset {
  productType?: SkincareProductType | 'all';
  routine?: RoutineType | 'all';
  category?: CategoryId;
  department?: ShopDepartment | 'all';
  brand?: string;
  onlyNew?: boolean;
  sortBy?: 'bestseller' | 'newest' | 'price-low' | 'price-high' | 'rating';
  searchQuery?: string;
  timestamp?: number;
}

export interface ShopRoutineCategory {
  id: RoutineType;
  labelFa: string;
  descFa: string;
  badge: string;
}

export const SHOP_ROUTINES: ShopRoutineCategory[] = [
  { id: 'morning', labelFa: 'روتین صبح', descFa: 'محافظت، شادابی و ضدآفتاب', badge: 'روزانه' },
  { id: 'night', labelFa: 'روتین شبانه', descFa: 'تغذیه عمیق و بازسازی سلولی', badge: 'شب' },
  { id: 'anti-aging', labelFa: 'روتین جوانسازی و لیفت', descFa: 'کاهش خطوط و افزایش کلاژن', badge: 'ضدپیری' },
  { id: 'hydration', labelFa: 'روتین آبرسانی ۷۲ ساعته', descFa: 'رفع خشکی مفرط و کدری', badge: 'آبرسانی' },
  { id: 'brightening', labelFa: 'روتین شفاف‌کننده و ضدلک', descFa: 'درخشش طبیعی و رفع تیرگی', badge: 'شفافیت' },
  { id: 'acne-blemish', labelFa: 'روتین ضدجوش و کنترل چربی', descFa: 'پاکسازی منافذ و تنظیم سبوم', badge: 'ضدجوش' },
  { id: 'barrier-repair', labelFa: 'روتین ترمیم سد دفاعی', descFa: 'التیام قرمزی و رفع حساسیت', badge: 'ترمیم‌کننده' },
  { id: 'soothing', labelFa: 'روتین التیام‌بخش و تسکین‌دهنده', descFa: 'آرامش‌بخش پوست‌های حساس', badge: 'تسکین‌بخش' },
  { id: 'minimal', labelFa: 'روتین مینیمال و پایه', descFa: 'مراقبت ساده ۳ مرحله‌ای ضروری', badge: 'مینیمال' },
];

export interface CarouselSlide {
  id: string;
  eyebrow: string;
  titlePart1: string;
  titlePart2: string;
  titleColorClass?: string;
  subtitle: string;
  ctaText: string;
  bgGradient: string;
  imageSrc: string;
  imageAlt: string;
  bubbleColor: string;
  actionType: 'explore' | 'quiz' | 'flash' | 'custom_url' | 'ai_advisor';
  linkUrl?: string;
}

export type SkinConcern = 
  | 'anti-aging' 
  | 'hydration' 
  | 'sensitive' 
  | 'acne-blemish' 
  | 'sunscreen' 
  | 'brightening' 
  | 'hair-body' 
  | 'makeup'
  | 'soothing' 
  | 'barrier-repair';

export interface RoutineStepRecommendation {
  stepNumber: number;
  stepTitleFa: string;
  stepTitleEn: string;
  timeOfDay: 'morning' | 'night';
  productId: string;
  product?: Product;
  reasonFa: string;
  role?: string;
  alternativeProductIds?: string[];
}

export interface UserSkinProfile {
  skinType: SkinType;
  primaryConcern: SkinConcern;
  ageGroup: string;
  sensitivityLevel: string;
  currentRoutine: string;
  routineStyle?: 'minimal' | 'balanced' | 'complete';
  routineGoalTitleFa?: string;
  usageTipsFa?: string[];
  summaryLabelEn: string;
  summaryLabelFa: string;
  morningSteps: RoutineStepRecommendation[];
  nightSteps: RoutineStepRecommendation[];
  recommendedProductIds: string[];
  createdAt: string;
}

export interface ProductSize {
  label: string; // e.g. "۳۰ میلی‌لیتر"
  labelEn: string; // "30 ml"
  price: number; // in Toman
  originalPrice?: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "حجم ۵۰ میلی‌لیتر" یا "شید ۰۱ لایت بژ" یا "فرمولاسیون پوست چرب"
  nameEn?: string; // e.g. "50 ml" or "Shade 01 Light"
  price: number; // قیمت اختصاصی این تنوع به تومان
  originalPrice?: number; // قیمت قبل از تخفیف به تومان
  stockCount: number; // موجودی انبار برای این تنوع
  sku?: string; // شناسه محصول/بارکد
  image?: string; // تصویر اختصاصی این تنوع (در صورت تمایل)
  colorCode?: string; // کدرنگ برای شیدها یا رنگ‌بندی (مثلاً #E8C5B0)
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  skinType?: string;
}

export interface Product {
  id: string;
  nameFa: string; // Farsi Name
  nameEn: string; // English Sub-name
  brand?: string; // e.g. "VARA", "Beauty of Joseon", "COSRX", "La Roche-Posay", "The Ordinary", "CeraVe", "Avène"
  productType?: SkincareProductType; // نوع محصول مراقبت از پوست
  category: CategoryId;
  skinTypes: SkinType[];
  concerns: SkinConcern[];
  routines?: RoutineType[]; // روتین‌های متناسب و جایگاه در دسته‌بندی روتین‌های شاپ
  routineStep?: string; // جایگاه و گام در مراحل روتین (مثلاً: گام ۳: سرم و آمپول درمانی)
  howToUse?: string; // روش استفاده و دستورالعمل مصرف محصول
  ingredientTags?: string[]; // تگ‌های ترکیبات فعال
  descriptionFa: string;
  descriptionEn: string;
  price: number; // Toman (base)
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  sizes: ProductSize[];
  variants?: ProductVariant[]; // تنوع‌های گوناگون محصول (حجم، رنگ/شید، فرمول، رایحه)
  keyIngredients: {
    nameFa: string;
    nameEn: string;
    description: string;
    icon?: string;
  }[];
  usageRoutine: {
    morning: string;
    night: string;
  };
  badges: string[]; // e.g. ["۱۰۰٪ گیاهی", "تست‌شده توسط متخصصین پوست", "ارگانیک"]
  isBestSeller?: boolean;
  isNew?: boolean;
  inStock: boolean;
  stockCount: number; // تعداد موجودی در انبار
  authenticity?: string; // اصالت کالا
  sourcingOrigin?: string; // منبع تأمین
  expiryDate?: string; // تاریخ انقضا
  targetAudience?: string; // مناسب برای چه افرادی
  unsuitableFor?: string; // نامناسب برای چه پوست‌هایی و موارد منع مصرف
}

export interface CartItem {
  product: Product;
  selectedSize?: ProductSize;
  selectedVariant?: ProductVariant;
  quantity: number;
}

export interface QuizQuestion {
  id: number;
  titleFa: string;
  subtitleFa: string;
  options: {
    labelFa: string;
    subtitleFa?: string;
    value: string;
    iconName?: string;
  }[];
}

export interface QuizResultRecommendation {
  titleFa: string;
  descriptionFa: string;
  morningRoutine: string[];
  nightRoutine: string[];
  productIds: string[];
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethodType = 'online_gateway' | 'card_transfer';
export type ShippingMethodType = 'post_express' | 'courier_tehran';

export interface OrderItem {
  productId: string;
  nameFa: string;
  nameEn: string;
  sizeLabel: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "VARA-84920"
  userId?: string;
  userEmail?: string;
  checkoutOwnerVerified?: boolean;
  guestCheckoutDigest?: string;
  checkoutRequestDigest?: string;
  quoteRequired?: boolean;
  paymentAttempt?: {
    id: string;
    provider: 'zarinpal' | 'nextpay';
    amount: number;
    currency: 'IRT';
    merchantBinding: string;
    transactionId?: string;
    paymentUrl?: string;
  };
  refId?: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  shippingMethod: ShippingMethodType;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'paid' | 'pending_verification' | 'failed';
  hasPaymentReceipt?: boolean;
  paymentReceiptImage?: string; // base64 / url for card transfer receipts
  status: OrderStatus;
  postalTrackingCode?: string;
  createdAt: string; // ISO string
  updatedAt?: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  cancelled: number;
  revenue: number;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  paymentMethod: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  verificationCode?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt?: string;
  role?: 'customer' | 'admin';
  skinProfile?: UserSkinProfile;
}

