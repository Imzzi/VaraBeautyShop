import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Sparkles, 
  Heart, 
  User 
} from 'lucide-react';
import { UserProfile } from '../types';

interface BottomNavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  cartItemCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenQuiz: () => void;
  onOpenAuth: () => void;
  user: UserProfile | null;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeSection,
  setActiveSection,
  cartItemCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenQuiz,
  onOpenAuth,
  user
}) => {
  const handleNav = (section: string) => {
    setActiveSection(section);
  };

  return (
    <nav aria-label="ناوبری فروشگاه"
      id="bottom-navigation-bar"
      className="min-[960px]:hidden fixed bottom-0 left-0 right-0 z-40 bg-vara-canvas/95 backdrop-blur-md border-t border-vara-line px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-around font-vazir text-center">
        
        {/* 1. Home */}
        <button
          onClick={() => handleNav('home')} aria-current={activeSection === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer ${
            activeSection === 'home' 
              ? 'text-vara-rose-ink font-semibold'
              : 'text-vara-muted hover:text-vara-rose-ink'
          }`}
        >
          <Home className={`w-5 h-5 mb-0.5 transition-transform ${activeSection === 'home' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] tracking-tight">خانه</span>
        </button>

        {/* 2. Shop */}
        <button
          onClick={() => handleNav('shop')} aria-current={activeSection === 'shop' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer ${
            activeSection === 'shop' 
              ? 'text-vara-rose-ink font-semibold'
              : 'text-vara-muted hover:text-vara-rose-ink'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 mb-0.5 transition-transform ${activeSection === 'shop' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          </div>
          <span className="text-[10px] tracking-tight">فروشگاه</span>
        </button>

        {/* 3. Skin Quiz (Center Berry Mauve Trigger) */}
        <button
          onClick={onOpenQuiz}
          className="flex flex-col items-center justify-center py-1 px-1 text-vara-rose-ink transition-colors cursor-pointer group"
        >
          <div className="w-9 h-9 -mt-3.5 bg-vara-rose text-white rounded-xl flex items-center justify-center border border-vara-rose shadow-shop-violet group-hover:bg-vara-rose-hover active:scale-95 transition-all">
            <Sparkles className="w-4 h-4 text-white stroke-[1.75]" />
          </div>
          <span className="text-[10px] font-medium text-vara-rose-ink mt-0.5">روتین پوست</span>
        </button>

        {/* 4. Cart */}
        <button
          onClick={onOpenCart} aria-label="سبد خرید"
          aria-description={cartItemCount ? `${cartItemCount.toLocaleString('fa-IR')} کالا در سبد` : undefined}
          className="flex flex-col items-center justify-center py-1 px-1 text-vara-muted hover:text-vara-rose-ink transition-colors cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 stroke-[1.75]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-vara-rose text-white text-[9px] font-bold font-jakarta w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount.toLocaleString('fa-IR')}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">سبد خرید</span>
        </button>

        {/* 5. Account / Profile */}
        <button
          onClick={user ? () => handleNav('profile') : onOpenAuth} aria-current={activeSection === 'profile' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center py-1 px-1 transition-colors cursor-pointer ${
            activeSection === 'profile' 
              ? 'text-vara-rose-ink font-semibold'
              : 'text-vara-muted hover:text-vara-rose-ink'
          }`}
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'پروفایل'}
              className="w-5 h-5 rounded-full object-cover border border-vara-line mb-0.5"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className={`w-5 h-5 mb-0.5 transition-transform ${activeSection === 'profile' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
          )}
          <span className="text-[10px] tracking-tight truncate max-w-[50px]">
            {user ? 'پروفایل' : 'حساب'}
          </span>
        </button>

      </div>
    </nav>
  );
};
