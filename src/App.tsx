import { CatalogNotice } from './components/CatalogNotice';
import { Modal } from './components/Modal';
import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { MessageSquareHeart } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BestSellersSection } from './components/BestSellersSection';
import { TrustBadges } from './components/TrustBadges';
import { FeaturedRoutinesAndLuxury } from './components/FeaturedRoutinesAndLuxury';
import { UserReviewsSection } from './components/UserReviewsSection';
import { Footer } from './components/Footer';
import { BottomNavigation } from './components/BottomNavigation';
import { NotificationToast } from './components/NotificationToast';
import { ProductLoading } from './components/ProductLoading';
import type { CheckoutDeliveryDraft } from './components/CheckoutModal';

// Code-split heavy & deferred components for optimal bundle size and fast initial load
const loadShopPage = () => import('./components/ShopPage');
const ShopPage = lazy(() => loadShopPage().then(m => ({ default: m.ShopPage })));
const loadProductDetailPage = () => import('./components/ProductDetailPage');
const ProductDetailPage = lazy(() => loadProductDetailPage().then(m => ({ default: m.ProductDetailPage })));
const ProfilePage = lazy(() => import('./components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminCMS = lazy(() => import('./components/AdminCMS').then(m => ({ default: m.AdminCMS })));
const PriceCalculatorPage = lazy(() => import('./components/PriceCalculatorPage').then(m => ({ default: m.PriceCalculatorPage })));
const loadCartDrawer = () => import('./components/CartDrawer');
const CartDrawer = lazy(() => loadCartDrawer().then(m => ({ default: m.CartDrawer })));
const WishlistDrawer = lazy(() => import('./components/WishlistDrawer').then(m => ({ default: m.WishlistDrawer })));
const SkincareQuizModal = lazy(() => import('./components/SkincareQuizModal').then(m => ({ default: m.SkincareQuizModal })));
const loadCheckoutModal = () => import('./components/CheckoutModal');
const CheckoutModal = lazy(() => loadCheckoutModal().then(m => ({ default: m.CheckoutModal })));
const GiftCardModal = lazy(() => import('./components/GiftCardModal').then(m => ({ default: m.GiftCardModal })));
const loadAIBeautyAdvisor = () => import('./components/AIBeautyAdvisor');
const AIBeautyAdvisor = lazy(() => loadAIBeautyAdvisor().then(m => ({ default: m.AIBeautyAdvisor })));
const OrderDetailPage = lazy(() => import('./components/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const LegalPoliciesPage = lazy(() => import('./components/LegalPoliciesPage').then(m => ({ default: m.LegalPoliciesPage })));
import { POLICY_DOCUMENTS } from './data/policies';

import { PRODUCTS as defaultProducts } from './data/products';
import { Product, ProductSize, ProductVariant, CartItem, Order, UserProfile, ShopFilterPreset } from './types';
import { getAdminPath, isAdminRoute } from './utils/adminRouteConfig';
import {
  CHECKOUT_PAYMENT_PATH, cartSignature, checkoutPaymentPath, forgetPaymentCart,
  getPaymentReturnIdentifier, isPendingOnlineCheckout, readPaymentCart, rememberPaymentCart,
} from './utils/checkoutReturn';
import { 
  subscribeToProducts,
  fetchProductsFromDb,
  refreshCatalog,
  type CatalogSnapshot, 
  getUserProfileFromDb, 
  subscribeToUserProfile,
  getCustomerAuthHeaders,
  getLocalUserSession
} from './lib/db';

const CART_STORAGE_KEY = 'vara_cart_items_v3';

function readStoredCart(): CartItem[] | undefined {
  try {
    const items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? 'null');
    if (Array.isArray(items)) {
      return items.filter((item) => item?.product?.id && typeof item.quantity === 'number' && item.quantity > 0);
    }
  } catch {}
}

type PaymentReturn =
  | { state: 'loading' }
  | { state: 'ready'; order: Order }
  | { state: 'error'; message: string };

function getProductRouteId() {
  if (typeof window === 'undefined') return '';
  const match = /^\/product\/([^/?#]+)/i.exec(window.location.pathname)
    || /^#\/product\/([^/?#]+)/i.exec(window.location.hash);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return '';
  }
}

function ModalLoading({ label, onClose, onRetry }: { label: string; onClose: () => void; onRetry?: () => void }) {
  return (
    <Modal label={label} onClose={onClose} className="fixed inset-0 z-[65] bg-black/25 flex items-end sm:items-center justify-center">
      <div className="w-full sm:w-96 bg-white p-5 rounded-t-xl sm:rounded-xl flex items-center justify-between gap-4" onClick={(event) => event.stopPropagation()}>
        <span className="text-sm text-vara-muted" role="status">{label}</span>
        {onRetry && <button type="button" className="text-sm font-bold text-vara-rose-ink" onClick={onRetry}>تلاش دوباره</button>}
        <button type="button" className="text-sm font-bold text-vara-rose-ink" onClick={onClose}>بستن</button>
      </div>
    </Modal>
  );
}

export default function App() {
  const [catalog, setCatalog] = useState<CatalogSnapshot>({ products: defaultProducts, status: 'loading' });
  const productsList = catalog.products;

  // User Profile synchronization
  const [user, setUser] = useState<UserProfile | null>(() => getLocalUserSession());

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const syncSession = async () => {
      const local = getLocalUserSession();
      if (local && local.uid) {
        const freshProfile = await getUserProfileFromDb(local.uid);
        setUser(freshProfile || local);

        if (unsubscribeProfile) unsubscribeProfile();
        unsubscribeProfile = subscribeToUserProfile(local.uid, (updatedProfile) => {
          if (updatedProfile) {
            setUser(updatedProfile);
          }
        });
      } else {
        setUser(null);
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = undefined;
        }
      }
    };

    syncSession();

    window.addEventListener('vara-auth-change', syncSession);
    return () => {
      window.removeEventListener('vara-auth-change', syncSession);
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  // Navigation State with URL Path Detection (/admin, /cms, /profile, /calculator, /product/:id, /shop)
  const getInitialOrderIdentifier = (): string => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.startsWith('/order/')) {
        return decodeURIComponent(path.substring('/order/'.length).split('/')[0].split('?')[0]);
      }
      if (hash.startsWith('#/order/')) {
        return decodeURIComponent(hash.substring('#/order/'.length).split('/')[0].split('?')[0]);
      }
    }
    return '';
  };

  const getInitialSection = (): 'home' | 'shop' | 'botanical' | 'about' | 'social' | 'product-detail' | 'admin' | 'profile' | 'calculator' | 'order-detail' | 'contact' | 'return-policy' | 'terms' => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (isAdminRoute(path) || isAdminRoute(hash)) {
        return 'admin';
      }
      if (path.startsWith('/order/') || hash.startsWith('#/order/')) {
        return 'order-detail';
      }
      if (path === '/profile' || path === '/account' || hash === '#/profile' || hash === '#profile' || hash === '#/account') {
        return 'profile';
      }
      if (path === '/calculator' || hash === '#/calculator' || hash === '#calculator') {
        return 'calculator';
      }
      if (path === '/contact' || hash === '#/contact' || hash === '#contact') {
        return 'contact';
      }
      if (path === '/return-policy' || hash === '#/return-policy' || hash === '#return-policy') {
        return 'return-policy';
      }
      if (path === '/terms' || hash === '#/terms' || hash === '#terms') {
        return 'terms';
      }
      if (path.startsWith('/product/') || hash.startsWith('#/product/')) {
        return 'product-detail';
      }
      if (path === CHECKOUT_PAYMENT_PATH || path === '/shop' || hash === '#/shop' || hash === '#shop') {
        return 'shop';
      }
    }
    return 'home';
  };

  const [activeSection, setActiveSection] = useState<'home' | 'shop' | 'botanical' | 'about' | 'social' | 'product-detail' | 'admin' | 'profile' | 'calculator' | 'order-detail' | 'contact' | 'return-policy' | 'terms'>(getInitialSection);
  const [selectedOrderIdentifier, setSelectedOrderIdentifier] = useState<string>(getInitialOrderIdentifier);
  const [searchQuery, setSearchQuery] = useState('');
  const isAdminCatalog = activeSection === 'admin';
  useEffect(() => subscribeToProducts(setCatalog, isAdminCatalog), [isAdminCatalog]);

  const [shopFilterPreset, setShopFilterPreset] = useState<ShopFilterPreset | null>(null);
  const [productRouteId, setProductRouteId] = useState(getProductRouteId);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() =>
    defaultProducts.find((product) => product.id === productRouteId) ?? null);
  const [productLoadError, setProductLoadError] = useState('');
  const [productRetry, setProductRetry] = useState(0);
  const [calculatorUrl, setCalculatorUrl] = useState('');

  // Sync URL changes with router state
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (isAdminRoute(path) || isAdminRoute(hash)) {
        setActiveSection('admin');
      } else if (path.startsWith('/order/') || hash.startsWith('#/order/')) {
        const orderId = path.startsWith('/order/')
          ? decodeURIComponent(window.location.pathname.substring('/order/'.length).split('/')[0].split('?')[0])
          : decodeURIComponent(window.location.hash.substring('#/order/'.length).split('/')[0].split('?')[0]);
        if (orderId) {
          setSelectedOrderIdentifier(orderId);
          setActiveSection('order-detail');
          return;
        }
      } else if (path === '/profile' || path === '/account' || hash === '#/profile' || hash === '#profile' || hash === '#/account') {
        setActiveSection('profile');
      } else if (path === '/calculator' || hash === '#/calculator' || hash === '#calculator') {
        setActiveSection('calculator');
      } else if (path === '/contact' || hash === '#/contact' || hash === '#contact') {
        setActiveSection('contact');
      } else if (path === '/return-policy' || hash === '#/return-policy' || hash === '#return-policy') {
        setActiveSection('return-policy');
      } else if (path === '/terms' || hash === '#/terms' || hash === '#terms') {
        setActiveSection('terms');
      } else if (path.startsWith('/product/') || hash.startsWith('#/product/')) {
        const id = getProductRouteId();
        loadProductDetailPage().catch(() => {});
        setProductRouteId(id);
        setSelectedProduct(productsList.find((product) => product.id === id) ?? null);
        setProductLoadError('');
        setActiveSection('product-detail');
      } else if (path === CHECKOUT_PAYMENT_PATH || path === '/shop' || hash === '#/shop' || hash === '#shop') {
        setActiveSection('shop');
      } else if (path === '/' && !hash) {
        setActiveSection('home');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, [productsList]);

  // A CMS-only deep link can start its scoped lookup alongside the route import.
  useEffect(() => {
    if (activeSection !== 'product-detail' || selectedProduct) return;
    if (!productRouteId) {
      setProductLoadError('محصول یافت نشد.');
      return;
    }
    loadProductDetailPage().catch(() => {});
    const controller = new AbortController();
    fetch(`/api/db/products/${encodeURIComponent(productRouteId)}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) throw new Error('محصول یافت نشد.');
        if (!response.ok) throw new Error('دریافت محصول موقتاً در دسترس نیست.');
        const { product } = await response.json();
        if (product?.id !== productRouteId) throw new Error('دریافت محصول موقتاً در دسترس نیست.');
        if (!controller.signal.aborted) setSelectedProduct((current) => current ?? product);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setProductLoadError(error instanceof Error ? error.message : 'دریافت محصول ناموفق بود.');
      });
    return () => controller.abort();
  }, [activeSection, productRouteId, productRetry, selectedProduct]);

  useEffect(() => {
    if (activeSection !== 'product-detail') return;
    const product = productsList.find((item) => item.id === productRouteId);
    if (product && catalog.status === 'current') setSelectedProduct(product);
  }, [activeSection, productRouteId, productsList, catalog.status]);

  const navigateToSection = (section: 'home' | 'shop' | 'botanical' | 'about' | 'social' | 'product-detail' | 'admin' | 'profile' | 'calculator' | 'order-detail' | 'contact' | 'return-policy' | 'terms', orderId?: string) => {
    if (section === 'shop') loadShopPage().catch(() => {});
    setActiveSection(section);
    if (typeof window !== 'undefined') {
      if (section === 'admin') {
        window.history.pushState(null, '', getAdminPath());
      } else if (section === 'order-detail') {
        const idToPush = orderId || selectedOrderIdentifier;
        if (idToPush) {
          setSelectedOrderIdentifier(idToPush);
          window.history.pushState(null, '', `/order/${encodeURIComponent(idToPush)}`);
        }
      } else if (section === 'profile') {
        window.history.pushState(null, '', '/profile');
      } else if (section === 'calculator') {
        window.history.pushState(null, '', '/calculator');
      } else if (section === 'contact') {
        window.history.pushState(null, '', '/contact');
      } else if (section === 'return-policy') {
        window.history.pushState(null, '', '/return-policy');
      } else if (section === 'terms') {
        window.history.pushState(null, '', '/terms');
      } else if (section === 'home') {
        window.history.pushState(null, '', '/');
      } else if (section === 'shop') {
        window.history.pushState(null, '', '/shop');
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cart State: Default empty for all customers & robust cross-tab sync
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readStoredCart() ?? []);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const openCart = () => {
    loadCartDrawer().catch(() => {});
    if (cartItems.length > 0) loadCheckoutModal().catch(() => {});
    setCartDrawerOpen(true);
  };

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('[Cart Save Error]:', e);
    }
  }, [cartItems]);

  // Sync cart state across open browser tabs
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Wishlist State with local storage persistence
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('vara_wishlist_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return [defaultProducts[0]?.id, defaultProducts[1]?.id].filter(Boolean) as string[];
  });
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('vara_wishlist_ids', JSON.stringify(wishlistProductIds));
    } catch (e) {}
  }, [wishlistProductIds]);

  const handleToggleWishlist = (productId: string) => {
    setWishlistProductIds((prev) => {
      const exists = prev.includes(productId);
      const updated = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(exists ? 'محصول از لیست علاقه‌مندی‌ها حذف شد.' : 'محصول به لیست علاقه‌مندی‌ها اضافه شد.');
      return updated;
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistProductIds((prev) => prev.filter((id) => id !== productId));
    showToast('محصول از لیست علاقه‌مندی‌ها حذف شد.');
  };

  const wishlistedProducts = productsList.filter((p) => wishlistProductIds.includes(p.id));

  const handleAddAllWishlistToCart = () => {
    wishlistedProducts.forEach((product) => {
      const variant = product.variants?.find((option) => option.stockCount > 0);
      if (product.variants?.length && !variant) return;
      if (!variant && !product.inStock) return;
      const size = variant ? { label: variant.name, labelEn: variant.nameEn || '', price: variant.price }
        : product.sizes?.[0] || { label: 'استاندارد', labelEn: 'Standard', price: product.price };
      handleAddToCart(product, size, 1, variant);
    });
    openCart();
  };

  // Modals State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutDeliveryDraft, setCheckoutDeliveryDraft] = useState<{
    userId: string | undefined;
    fields: CheckoutDeliveryDraft;
  } | null>(null);
  const [checkoutAttempt, setCheckoutAttempt] = useState<{ order: Order; items: CartItem[]; userId?: string } | null>(null);
  const [paymentReturn, setPaymentReturn] = useState<PaymentReturn | null>(null);
  const [paymentReturnRetry, retryPaymentReturn] = useState(0);
  const resumedOrder = paymentReturn?.state === 'ready' ? paymentReturn.order : null;
  const checkoutOrder = checkoutAttempt?.items === cartItems && checkoutAttempt?.userId === user?.uid
    ? checkoutAttempt.order : null;
  const cartIsEmpty = cartItems.length === 0;
  const initialCheckoutDeliveryDraft = checkoutDeliveryDraft && checkoutDeliveryDraft.userId === user?.uid
    ? checkoutDeliveryDraft.fields
    : null;
  const [giftCardModalOpen, setGiftCardModalOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [advisorTab, setAdvisorTab] = useState<'chat' | 'scan' | null>(null);
  const [advisorOpen, setAdvisorOpen] = useState(false);

  useEffect(() => {
    let controller: AbortController | undefined;

    const restorePayment = async () => {
      controller?.abort();
      const identifier = getPaymentReturnIdentifier();
      if (!identifier) {
        setPaymentReturn(null);
        return;
      }

      const request = new AbortController();
      controller = request;
      const isCurrent = () => !request.signal.aborted && getPaymentReturnIdentifier() === identifier;
      setCheckoutModalOpen(false);
      setCartDrawerOpen(false);
      setPaymentReturn({ state: 'loading' });
      try {
        const response = await fetch(`/api/db/orders/checkout/${encodeURIComponent(identifier)}`, {
          headers: getCustomerAuthHeaders(),
          cache: 'no-store',
          signal: request.signal,
        });
        if (!isCurrent()) return;
        if (response.status === 404 || response.status === 400) {
          const snapshot = readPaymentCart();
          if (snapshot?.orderId === identifier && snapshot.userId === user?.uid) {
            forgetPaymentCart(identifier);
            setCheckoutAttempt(null);
          }
          setPaymentReturn({ state: 'error', message: 'این پرداخت در نشست فعلی پیدا نشد. با همان حساب یا مرورگر دوباره تلاش کنید.' });
          return;
        }
        if (!response.ok) throw new Error('Checkout lookup failed');
        const { order }: { order: Order } = await response.json();
        if (!isCurrent()) return;

        if (order.paymentStatus === 'paid') {
          const snapshot = readPaymentCart();
          const storedCart = readStoredCart();
          if (snapshot?.orderId === order.id) {
            forgetPaymentCart(order.id);
            setCartItems((current) => {
              const latest = storedCart ?? current;
              return cartSignature(latest) === snapshot.signature ? [] : latest;
            });
          } else if (storedCart) {
            // A cached page may still have the old cart after another page handled the return.
            setCartItems(storedCart);
          }
          setCheckoutAttempt(null);
          setCheckoutDeliveryDraft(null);
          setSelectedOrderIdentifier(order.orderNumber);
          setActiveSection('order-detail');
          window.history.replaceState(null, '', `/order/${encodeURIComponent(order.orderNumber)}`);
          setPaymentReturn(null);
          return;
        }
        if (!isPendingOnlineCheckout(order)) {
          forgetPaymentCart(order.id);
          setCheckoutAttempt(null);
          window.history.replaceState(null, '', `/order/${encodeURIComponent(order.orderNumber)}`);
          setSelectedOrderIdentifier(order.orderNumber);
          setActiveSection('order-detail');
          setPaymentReturn(null);
          return;
        }
        window.history.replaceState(null, '', checkoutPaymentPath(order.id));
        setActiveSection('shop');
        setPaymentReturn({ state: 'ready', order });
      } catch {
        if (isCurrent()) setPaymentReturn({ state: 'error', message: 'دریافت وضعیت پرداخت انجام نشد. دوباره تلاش کنید.' });
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) void restorePayment();
    };
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', restorePayment);
    void restorePayment();
    return () => {
      controller?.abort();
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', restorePayment);
    };
  }, [paymentReturnRetry, user?.uid]);

  const closePaymentReturn = () => {
    window.history.replaceState(null, '', '/shop');
    setActiveSection('shop');
    setPaymentReturn(null);
  };

  useEffect(() => {
    if (activeSection === 'admin') {
      setAdvisorOpen(false);
      setAdvisorTab(null);
      return;
    }
    const openAdvisor = (event: Event) => {
      const detail = (event as CustomEvent<{ tab?: string }>).detail;
      loadAIBeautyAdvisor().catch(() => {});
      if (detail?.tab === 'scan' || detail?.tab === 'chat') setAdvisorTab(detail.tab);
      else setAdvisorTab((tab) => tab ?? 'chat');
      setAdvisorOpen(true);
    };
    window.addEventListener('vara-open-ai-advisor', openAdvisor);
    return () => window.removeEventListener('vara-open-ai-advisor', openAdvisor);
  }, [activeSection]);

  // Delivery details live only in this tab's current cart session.
  useEffect(() => {
    setCheckoutDeliveryDraft(null);
    setCheckoutAttempt(null);
  }, [cartIsEmpty, user?.uid]);

  // Global listener for gift card modal
  useEffect(() => {
    const handleOpenGiftCard = () => setGiftCardModalOpen(true);
    window.addEventListener('vara-open-gift-card', handleOpenGiftCard);
    return () => window.removeEventListener('vara-open-gift-card', handleOpenGiftCard);
  }, []);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Product Navigation
  const handleViewProductDetails = (product: Product) => {
    loadProductDetailPage().catch(() => {});
    setSelectedProduct(product);
    setProductRouteId(product.id);
    setProductLoadError('');
    setActiveSection('product-detail');
    if (typeof window !== 'undefined' && product?.id) {
      window.history.pushState(null, '', `/product/${encodeURIComponent(product.id)}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cart Actions
  const handleAddToCart = (
    product: Product,
    selectedSize: ProductSize,
    quantity: number = 1,
    selectedVariant?: ProductVariant
  ) => {
    const stock = selectedVariant?.stockCount ?? product.stockCount ?? (product.inStock ? 15 : 0);
    if (stock <= 0 || !product.inStock) {
      showToast('این گزینه در انبار موجود نیست.');
      return;
    }
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => {
        if (item.product?.id !== product.id) return false;
        if (selectedVariant || item.selectedVariant) {
          return item.selectedVariant?.id === selectedVariant?.id;
        }
        return (item.selectedSize?.label || '') === (selectedSize?.label || '');
      });

      if (existingIndex > -1) {
        return prev.map((item, index) => index === existingIndex
          ? { ...item, quantity: Math.min(stock, item.quantity + quantity) }
          : item);
      }

      return [...prev, { product, selectedSize, quantity: Math.min(stock, quantity), selectedVariant }];
    });

    loadCartDrawer().catch(() => {});
    const variantLabel = selectedVariant ? ` (${selectedVariant.name})` : '';
    showToast(`«${product.nameFa || 'محصول'}${variantLabel}» به سبد خرید شما اضافه گردید.`);
  };

  const handleAddMultipleToCart = (itemsToAdd: { product: Product; size: ProductSize }[]) => {
    itemsToAdd.forEach(({ product, size }) => {
      handleAddToCart(product, size);
    });
    openCart();
  };

  const handleUpdateQuantity = (productId: string, sizeOrVariantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          const match =
            item.product?.id === productId &&
            ((item.selectedVariant && (item.selectedVariant.id === sizeOrVariantId || item.selectedVariant.name === sizeOrVariantId)) ||
              (item.selectedSize?.label || '') === sizeOrVariantId);

          if (match) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string, sizeOrVariantId: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product?.id === productId &&
            ((item.selectedVariant && (item.selectedVariant.id === sizeOrVariantId || item.selectedVariant.name === sizeOrVariantId)) ||
              (item.selectedSize?.label || '') === sizeOrVariantId)
          )
      )
    );
    showToast('محصول از سبد خرید شما حذف گردید.');
  };

  const handleProceedToCheckout = async (discount: number) => {
    const savedPayment = readPaymentCart();
    if (savedPayment && savedPayment.userId === user?.uid && savedPayment.signature === cartSignature(cartItems)) {
      window.history.pushState(null, '', checkoutPaymentPath(savedPayment.orderId));
      retryPaymentReturn((attempt) => attempt + 1);
      return;
    }
    const catalogItems = cartItems.filter(({ product }) => product && !/^(gift-card|dubai)-/.test(product.id));
    if (!checkoutOrder && catalogItems.length) {
      const fresh = await fetchProductsFromDb().catch(() => {
        throw new Error('بررسی قیمت و موجودی انجام نشد. دوباره تلاش کنید.');
      });
      const freshById = new Map(fresh.map((product) => [product.id, product]));
      const updates = new Map<CartItem, CartItem>();
      for (const item of catalogItems) {
        const product = item.product && freshById.get(item.product.id);
        const variant = product?.variants?.find((option) => option.id === item.selectedVariant?.id);
        const size = product?.sizes?.find((option) => option.label === item.selectedSize?.label);
        const stock = variant?.stockCount ?? product?.stockCount ?? 0;
        const validOption = product?.variants?.length ? Boolean(variant)
          : product?.sizes?.length ? Boolean(size) : !item.selectedVariant;
        if (!product || !validOption || stock < item.quantity || !product.inStock) {
          throw new Error(`موجودی «${item.product?.nameFa}» یا گزینه انتخابی تغییر کرده است. تعداد را کم کنید یا آن را از سبد بردارید.`);
        }
        const price = variant?.price ?? size?.price ?? product.price;
        const previous = item.selectedVariant?.price ?? item.selectedSize?.price ?? item.product?.price;
        if (price !== previous) {
          updates.set(item, { ...item, product, selectedVariant: variant, selectedSize: size ?? { ...item.selectedSize, price } });
        }
      }
      if (updates.size) {
        setCartItems((current) => current.map((item) => updates.get(item) ?? item));
        throw new Error('قیمت بعضی اقلام تغییر کرد. مبلغ تازه سبد را مرور کنید و دوباره ادامه دهید.');
      }
    }
    loadCheckoutModal().catch(() => {});
    setAppliedDiscount(discount);
    setCheckoutModalOpen(true);
  };

  const handleClearCart = () => {
    setCartItems([]);
    setCartDrawerOpen(false);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Dynamic SEO Page Title, Meta Tags & Structured Data per activeSection
  const seoData = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://varabeauty.ir';
    let title = 'Vara Beauty - ورا بیوتی | فروشگاه تخصصی مراقبت پوست و زیبایی لوکس';
    let description = 'فروشگاه تخصصی محصولات مراقبت از پوست، سرم‌های درمانی، ضدآفتاب و روتین‌های زیبایی با اصالت تضمین‌شده و مشاوره هوشمند زیبایی.';
    let canonical: string | null = `${origin}/`;
    let ogType = 'website';
    let ogImage = `${origin}/og-image.jpg`;
    let schemaJson: any = null;
    let noIndex = false;

    // Common Organization Schema
    const organizationSchema = {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'Vara Beauty - ورا بیوتی',
      alternateName: 'Vara Luxury Skincare',
      url: origin,
      logo: `${origin}/vara-logo.svg`,
      description: 'فروشگاه تخصصی مراقبت پوست و زیبایی لوکس ورا بیوتی با محصولات اصل و مشاوره تخصصی',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+98-903-794-3125',
        contactType: 'customer service',
        availableLanguage: ['Persian', 'English'],
      },
    };

    let breadcrumbs: Array<{ name: string; url: string }> = [
      { name: 'صفحه اصلی', url: `${origin}/` },
    ];

    let productSchema: any = null;

    if (activeSection === 'shop') {
      title = 'Vara Beauty - Shop | فروشگاه و کاتالوگ محصولات تخصصی پوستی';
      description = 'مشاهده و خرید آنلاین انواع محصولات مراقبت از پوست، شوینده‌ها، سرم‌ها، ضدآفتاب و کرم‌های آبرسان معتبر در فروشگاه ورا بیوتی.';
      canonical = `${origin}/shop`;
      breadcrumbs.push({ name: 'فروشگاه محصولات', url: `${origin}/shop` });
    } else if (activeSection === 'product-detail' && selectedProduct) {
      title = `Vara Beauty - Product Detail | ${selectedProduct.nameFa} (${selectedProduct.brand || 'VARA'})`;
      description = selectedProduct.descriptionFa 
        ? `${selectedProduct.descriptionFa.slice(0, 150)}...`
        : `خرید آنلاین ${selectedProduct.nameFa} از برند ${selectedProduct.brand} با ضمانت کیفیت و اصالت ۱۰۰٪ در ورا بیوتی.`;
      canonical = `${origin}/product/${selectedProduct.id}`;
      ogType = 'product';
      if (selectedProduct.images?.[0]) {
        ogImage = selectedProduct.images[0];
      }
      const price = selectedProduct.price || 0;
      breadcrumbs.push({ name: 'فروشگاه', url: `${origin}/shop` });
      breadcrumbs.push({ name: selectedProduct.nameFa, url: canonical });

      productSchema = {
        '@type': 'Product',
        '@id': `${canonical}#product`,
        name: selectedProduct.nameFa,
        alternateName: selectedProduct.nameEn,
        image: selectedProduct.images || [ogImage],
        description: selectedProduct.descriptionFa || description,
        sku: selectedProduct.id,
        brand: {
          '@type': 'Brand',
          name: selectedProduct.brand || 'Vara Beauty',
        },
        offers: {
          '@type': 'Offer',
          url: canonical,
          priceCurrency: 'IRT',
          price: price,
          priceValidUntil: '2027-12-31',
          availability: selectedProduct.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@id': `${origin}/#organization`,
          },
        },
        ...(selectedProduct.rating
          ? {
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: selectedProduct.rating,
                reviewCount: selectedProduct.reviewsCount || 15,
              },
            }
          : {}),
      };
    } else if (activeSection === 'profile') {
      title = 'Vara Beauty - Profile | حساب کاربری و پیگیری سفارش‌ها';
      description = 'داشبورد کاربری ورا بیوتی، پیگیری وضعیت سفارش‌ها، مدیریت اطلاعات شخصی و مشاهده لیست علاقه‌مندی‌ها.';
      canonical = `${origin}/profile`;
      breadcrumbs.push({ name: 'حساب کاربری', url: `${origin}/profile` });
    } else if (activeSection === 'calculator') {
      title = 'Vara Beauty - Price Calculator | محاسبه‌گر قیمت خرید خارجی';
      description = 'محاسبه آنی قیمت تمام‌شده محصولات زیبایی و آرایشی از سفورا، آمازون امارات، لوک‌فنتستیک (Lookfantastic) و ترندیول (Trendyol) با نرخ لحظه‌ای ارز.';
      canonical = `${origin}/calculator`;
    } else if (activeSection === 'contact') {
      title = 'Vara Beauty - تماس با ما | پشتیبانی و مشاوره تخصصی ورا بیوتی';
      description = 'ارتباط مستقیم با پشتیبانی ورا بیوتی، مشاوره تخصصی خرید محصولات مراقبت از پوست از امارات و پیگیری سفارشات.';
      canonical = `${origin}/contact`;
      breadcrumbs.push({ name: 'تماس با ما', url: `${origin}/contact` });
    } else if (activeSection === 'return-policy') {
      title = POLICY_DOCUMENTS['return-policy'].pageTitle;
      description = POLICY_DOCUMENTS['return-policy'].metaDescription;
      canonical = `${origin}/return-policy`;
      breadcrumbs.push({ name: 'شرایط بازگشت و استرداد وجه', url: `${origin}/return-policy` });
    } else if (activeSection === 'terms') {
      title = POLICY_DOCUMENTS.terms.pageTitle;
      description = POLICY_DOCUMENTS.terms.metaDescription;
      canonical = `${origin}/terms`;
      breadcrumbs.push({ name: 'قوانین و مقررات خرید', url: `${origin}/terms` });
    } else if (activeSection === 'order-detail') {
      title = selectedOrderIdentifier
        ? `Vara Beauty - جزئیات سفارش ${selectedOrderIdentifier} | ورا بیوتی`
        : 'Vara Beauty - پیگیری و جزئیات سفارش | ورا بیوتی';
      description = 'پیگیری وضعیت سفارش و صورتحساب خرید از فروشگاه ورا بیوتی';
      canonical = null;
      noIndex = true;
      schemaJson = null;
    } else if (activeSection === 'admin') {
      // SECURITY: Admin panel must remain strictly hidden from search engines and casual crawlers.
      // Do NOT expose admin titles, descriptions, canonical admin URLs, or schema.org structured data.
      title = 'Vara Beauty - ورا بیوتی';
      description = 'فروشگاه تخصصی محصولات مراقبت از پوست و زیبایی لوکس';
      canonical = null;
      noIndex = true;
      schemaJson = null;
    }

    if (!noIndex) {
      const breadcrumbListSchema = {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      };

      const graph = [organizationSchema, breadcrumbListSchema];
      if (productSchema) {
        graph.push(productSchema);
      }

      schemaJson = {
        '@context': 'https://schema.org',
        '@graph': graph,
      };
    }

    return { title, description, canonical, ogType, ogImage, schemaJson, noIndex };
  }, [activeSection, selectedProduct]);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        {seoData.canonical && <link rel="canonical" href={seoData.canonical} />}

        {/* Search Engine Robots directives */}
        {seoData.noIndex ? (
          <>
            <meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />
            <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet" />
          </>
        ) : (
          <>
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
          </>
        )}

        {/* OpenGraph / Social Metadata (Only emitted for public pages) */}
        {!seoData.noIndex && (
          <>
            <meta property="og:type" content={seoData.ogType} />
            <meta property="og:title" content={seoData.title} />
            <meta property="og:description" content={seoData.description} />
            {seoData.canonical && <meta property="og:url" content={seoData.canonical} />}
            <meta property="og:site_name" content="Vara Beauty - ورا بیوتی" />
            <meta property="og:image" content={seoData.ogImage} />

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={seoData.title} />
            <meta name="twitter:description" content={seoData.description} />
            <meta name="twitter:image" content={seoData.ogImage} />
          </>
        )}

        {/* Structured Data JSON-LD */}
        {!seoData.noIndex && seoData.schemaJson && (
          <script type="application/ld+json">
            {JSON.stringify(seoData.schemaJson)}
          </script>
        )}
      </Helmet>

      <div className="vara-shell min-h-screen max-w-full overflow-x-hidden flex flex-col font-vazir antialiased selection:bg-vara-tint selection:text-vara-ink">
      
      {/* Header Navigation (Hidden on dedicated Admin CMS route for full-screen admin workspace, or visible with clean state) */}
      {activeSection !== 'admin' && (
        <Header
          cartItemCount={totalCartCount}
          wishlistCount={wishlistProductIds.length}
          onOpenCart={openCart}
          onOpenWishlist={() => setWishlistDrawerOpen(true)}
          onOpenQuiz={() => setQuizModalOpen(true)}
          onOpenAuth={() => navigateToSection('profile')}
          onOpenGiftCard={() => setGiftCardModalOpen(true)}
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={(q) => {
            setSearchQuery(q);
            if (q) {
              setShopFilterPreset({ timestamp: Date.now() });
              navigateToSection('shop');
            }
          }}
          onNavigateToShopWithFilter={(preset) => {
            setShopFilterPreset({ ...preset, timestamp: Date.now() });
            setSearchQuery(preset.searchQuery || '');
            navigateToSection('shop');
          }}
          activeSection={activeSection}
          setActiveSection={(sec) => navigateToSection(sec as any)}
        />
      )}

      {(activeSection === 'home' || activeSection === 'product-detail') && catalog.status === 'stale' &&
        <div className="vara-container pt-4"><CatalogNotice catalog={catalog} /></div>}
      {/* Main Content View Switcher */}
      <main className={`flex-1 w-full max-w-full ${activeSection === 'admin' ? 'pb-4' : 'pb-16 min-[960px]:pb-0'}`}>
        <div key={activeSection} className="w-full max-w-full flex-1 flex flex-col">
            {activeSection === 'admin' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-ink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری پنل مدیریت...</span>
                  </div>
                }
              >
                <AdminCMS
                  catalog={catalog}
                  products={productsList}
                  onBackToShop={() => navigateToSection('shop')}
                  onViewProduct={handleViewProductDetails}
                />
              </Suspense>
            ) : activeSection === 'profile' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-ink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری حساب کاربری...</span>
                  </div>
                }
              >
                <ProfilePage
                  user={user}
                  onLoginSuccess={(userProfile) => {
                    setUser(userProfile);
                    showToast(`«${userProfile.displayName}» عزیز، خوش آمدید!`);
                  }}
                  onLogoutSuccess={() => {
                    setUser(null);
                    showToast('از حساب کاربری خود خارج شدید.');
                  }}
                  onBackToShop={() => navigateToSection('shop')}
                  onNavigateToHome={() => navigateToSection('home')}
                  wishlistProducts={wishlistedProducts}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  onAddToCart={handleAddToCart}
                  onViewProduct={handleViewProductDetails}
                  onOpenQuiz={() => setQuizModalOpen(true)}
                  allProducts={productsList}
                />
              </Suspense>
            ) : activeSection === 'product-detail' ? (
              productLoadError && !selectedProduct ? (
                <div className="min-h-[60vh] p-8 text-center" role="status">
                  <p>{productLoadError}</p>
                  <button type="button" className="mt-4 text-vara-rose-ink font-bold" onClick={() => {
                    setProductLoadError('');
                    setProductRetry((attempt) => attempt + 1);
                  }}>تلاش دوباره</button>
                </div>
              ) : selectedProduct ? (
              <Suspense fallback={<ProductLoading product={selectedProduct} />}>
                <ProductDetailPage
                  key={selectedProduct.id}
                  product={selectedProduct}
                  allProducts={productsList}
                  onBack={() => navigateToSection('shop')}
                  onSelectProduct={handleViewProductDetails}
                  onAddToCart={handleAddToCart}
                  onOpenQuiz={() => setQuizModalOpen(true)}
                  isWishlisted={wishlistProductIds.includes(selectedProduct.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              </Suspense>
              ) : <ProductLoading />
            ) : activeSection === 'shop' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-ink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری فروشگاه...</span>
                  </div>
                }
              >
                <ShopPage
                  catalog={catalog}
                  products={productsList}
                  onQuickView={handleViewProductDetails}
                  onAddToCart={handleAddToCart}
                  onOpenQuiz={() => setQuizModalOpen(true)}
                  initialSearchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  initialFilterPreset={shopFilterPreset}
                />
              </Suspense>
            ) : activeSection === 'order-detail' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-ink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری جزئیات سفارش...</span>
                  </div>
                }
              >
                <OrderDetailPage
                  orderIdentifier={selectedOrderIdentifier}
                  onBackToHome={() => navigateToSection('home')}
                  onBackToShop={() => navigateToSection('shop')}
                />
              </Suspense>
            ) : activeSection === 'calculator' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-ink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری محاسبه‌گر...</span>
                  </div>
                }
              >
                <PriceCalculatorPage
                  initialUrl={calculatorUrl}
                  onBackToHome={() => navigateToSection('home')}
                  onAddToCart={handleAddToCart}
                  user={user}
                  onNavigateToProfile={() => navigateToSection('profile')}
                />
              </Suspense>
            ) : activeSection === 'contact' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-ink border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری صفحه تماس با ما...</span>
                  </div>
                }
              >
                <ContactPage
                  onBackToHome={() => navigateToSection('home')}
                  onNavigateToShop={() => navigateToSection('shop')}
                  onShowToast={showToast}
                />
              </Suspense>
            ) : activeSection === 'return-policy' || activeSection === 'terms' ? (
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-vara-muted">
                    <div className="w-7 h-7 border-2 border-vara-rose border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium font-vazir">در حال بارگذاری قوانین و شرایط...</span>
                  </div>
                }
              >
                <LegalPoliciesPage
                  activePolicy={activeSection}
                  onSwitchPolicy={(policy) => navigateToSection(policy)}
                  onBackToHome={() => navigateToSection('home')}
                  onNavigateToContact={() => navigateToSection('contact')}
                  onNavigateToProfile={() => navigateToSection('profile')}
                />
              </Suspense>
            ) : (
              <>
                {/* 1. Hero Section */}
                <Hero
                  onOpenAccount={() => navigateToSection('profile')}
                  onExploreClick={() => navigateToSection('shop')}
                  onQuizClick={() => setQuizModalOpen(true)}
                  onFlashSaleClick={() => navigateToSection('shop')}
                  onCalculatePrice={(url) => {
                    setCalculatorUrl(url);
                    navigateToSection('calculator');
                  }}
                />

                {/* 2. Best Sellers Section (محصولات پرفروش) */}
                <BestSellersSection
                  products={productsList}
                  onViewProduct={handleViewProductDetails}
                  onAddToCart={handleAddToCart}
                  onViewAllBestSellers={() => navigateToSection('shop')}
                />

                {/* 4. Trust Badges Row */}
                <TrustBadges />

                {/* 5. Complete Routines & The Luxury Edit */}
                <FeaturedRoutinesAndLuxury
                  products={productsList}
                  onViewProduct={handleViewProductDetails}
                  onViewAllProducts={() => navigateToSection('shop')}
                  onOpenQuiz={() => setQuizModalOpen(true)}
                />

                {/* 6. Real People. Real Results. (User Reviews) */}
                <UserReviewsSection />
              </>
            )}
        </div>
      </main>

      {/* Footer */}
      {activeSection !== 'admin' && (
        <Footer 
          onNavigateToAdmin={() => navigateToSection('admin')} 
          onNavigateToProfile={() => navigateToSection('profile')}
          onNavigateToCalculator={() => navigateToSection('calculator')}
          onNavigateToContact={() => navigateToSection('contact')}
          onNavigateToReturnPolicy={() => navigateToSection('return-policy')}
          onNavigateToTerms={() => navigateToSection('terms')}
          onNavigateToShopWithFilter={(preset) => {
            setShopFilterPreset(preset);
            setSearchQuery(preset.searchQuery || '');
            navigateToSection('shop');
          }}
        />
      )}

      {/* Skincare Ritual Quiz Modal */}
      {quizModalOpen && (
        <Suspense fallback={null}>
          <SkincareQuizModal
            isOpen={quizModalOpen}
            onClose={() => setQuizModalOpen(false)}
            products={productsList}
            onAddMultipleToCart={handleAddMultipleToCart}
          />
        </Suspense>
      )}

      {/* Cart Drawer Slide-over */}
      {cartDrawerOpen && (
        <Suspense fallback={<ModalLoading label="در حال بارگذاری سبد خرید..." onClose={() => setCartDrawerOpen(false)} />}>
          <CartDrawer
            isOpen={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </Suspense>
      )}

      {/* Wishlist Drawer Slide-over */}
      {wishlistDrawerOpen && (
        <Suspense fallback={null}>
          <WishlistDrawer
            isOpen={wishlistDrawerOpen}
            onClose={() => setWishlistDrawerOpen(false)}
            wishlistProducts={wishlistedProducts}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProductDetails}
            onAddAllToCart={handleAddAllWishlistToCart}
          />
        </Suspense>
      )}

      {/* Checkout & Pre-Invoice Modal */}
      {(paymentReturn?.state === 'loading' || paymentReturn?.state === 'error') && (
        <ModalLoading
          label={paymentReturn.state === 'error' ? paymentReturn.message : 'در حال بررسی وضعیت پرداخت...'}
          onClose={closePaymentReturn}
          onRetry={paymentReturn.state === 'error' ? () => retryPaymentReturn((attempt) => attempt + 1) : undefined}
        />
      )}
      {(checkoutModalOpen || resumedOrder) && (
        <Suspense fallback={<ModalLoading label="در حال بارگذاری تسویه حساب..." onClose={resumedOrder ? closePaymentReturn : () => setCheckoutModalOpen(false)} />}>
          <CheckoutModal
            key={resumedOrder?.id ?? user?.uid ?? 'guest'}
            isOpen
            initialDeliveryDraft={initialCheckoutDeliveryDraft}
            initialOrder={resumedOrder ?? checkoutOrder}
            onOrderPersisted={(order) => setCheckoutAttempt({ order, items: cartItems, userId: user?.uid })}
            onGatewayDeparture={(orderId) => {
              if (!resumedOrder) rememberPaymentCart(orderId, cartItems, user?.uid);
              window.history.replaceState(null, '', checkoutPaymentPath(orderId));
            }}
            onClose={(draft) => {
              if (resumedOrder) closePaymentReturn();
              else {
                setCheckoutDeliveryDraft(!cartIsEmpty && draft ? { userId: user?.uid, fields: draft } : null);
                setCheckoutModalOpen(false);
              }
            }}
            items={cartItems}
            discountAmount={appliedDiscount}
            onClearCart={handleClearCart}
            user={user}
          />
        </Suspense>
      )}

      {/* Gift Card Modal */}
      {giftCardModalOpen && (
        <Suspense fallback={null}>
          <GiftCardModal
            isOpen={giftCardModalOpen}
            onClose={() => setGiftCardModalOpen(false)}
            onAddToCart={handleAddToCart}
          />
        </Suspense>
      )}

      {/* Notification Toast */}
      <NotificationToast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* AI Skincare Advisor & Vision Photo Analyzer */}
      {activeSection !== 'admin' && !advisorOpen && (
        <div className="fixed bottom-20 min-[960px]:bottom-6 right-4 min-[960px]:right-6 z-30">
          <button
            type="button"
            id="ai-advisor-trigger-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('vara-open-ai-advisor'))}
            aria-label="مشاور هوشمند پوست"
            title="مشاور هوشمند پوست"
            className="group relative flex items-center h-12 max-w-[48px] hover:max-w-[210px] px-3.5 hover:px-4 bg-vara-rose hover:bg-vara-rose-hover text-white rounded-full shadow-vara-float transition-all duration-[750ms] hover:scale-[1.02] active:scale-95 cursor-pointer overflow-hidden border border-vara-rose"
          >
            <MessageSquareHeart className="w-5 h-5 text-white shrink-0" />
            <span className="whitespace-nowrap text-xs font-semibold text-white opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[150px] mr-0 group-hover:mr-2.5 transition-all duration-[750ms] overflow-hidden">
              مشاور هوشمند پوست
            </span>
          </button>
        </div>
      )}
      {activeSection !== 'admin' && advisorTab && (
        <Suspense fallback={advisorOpen ? <ModalLoading label="در حال بارگذاری مشاور هوشمند..." onClose={() => setAdvisorOpen(false)} /> : null}>
          <AIBeautyAdvisor
            isOpen={advisorOpen}
            onClose={() => setAdvisorOpen(false)}
            requestedTab={advisorTab}
            products={productsList}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleViewProductDetails}
            user={user}
          />
        </Suspense>
      )}

      {/* Mobile Bottom Navigation Bar */}
      {activeSection !== 'admin' && (
        <BottomNavigation
          activeSection={activeSection}
          setActiveSection={(sec) => navigateToSection(sec as any)}
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          wishlistCount={wishlistProductIds.length}
          onOpenCart={openCart}
          onOpenWishlist={() => setWishlistDrawerOpen(true)}
          onOpenQuiz={() => setQuizModalOpen(true)}
          onOpenAuth={() => navigateToSection('profile')}
          user={user}
        />
      )}

      </div>
    </HelmetProvider>
  );
}
