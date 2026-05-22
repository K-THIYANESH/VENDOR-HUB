import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, ShoppingCart, User, Package } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const BottomNav = () => {
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();
  const { items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const getPortalPath = () => {
    if (!isAuthenticated || !user) return '/role-selection';
    if (user.role === 'seller') return '/seller';
    if (user.role === 'admin') return '/admin';
    return '/profile';
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-205 px-6 py-2 flex items-center justify-between shadow-lg">
      <Link to="/home" className={`flex flex-col items-center gap-1 ${location.pathname === '/home' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-750'}`}>
        <Home className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold">Home</span>
      </Link>

      <Link to="/products" className={`flex flex-col items-center gap-1 ${location.pathname === '/products' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-750'}`}>
        <Package className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold">Products</span>
      </Link>

      {/* Floating Center AI Action */}
      <Link
        to="/ai-search"
        className="flex flex-col items-center justify-center -mt-6 w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 to-ai-500 text-white shadow-lg glow-hover border-4 border-white"
      >
        <Sparkles className="w-5.5 h-5.5 animate-pulse" />
      </Link>

      <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${location.pathname === '/cart' ? 'text-brand-600' : 'text-slate-500 hover:text-slate-750'}`}>
        <ShoppingCart className="w-5.5 h-5.5" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-brand-600 text-white text-[9px] font-black h-3.5 w-3.5 rounded-full flex items-center justify-center border border-white">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-semibold">Cart</span>
      </Link>

      <Link to={getPortalPath()} className={`flex flex-col items-center gap-1 ${location.pathname.startsWith('/seller') || location.pathname.startsWith('/admin') ? 'text-brand-600' : 'text-slate-500 hover:text-slate-750'}`}>
        <User className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold">Portal</span>
      </Link>
    </nav>
  );
};
