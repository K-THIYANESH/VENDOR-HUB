import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Sparkles, User, LogOut, Menu, X, Laptop } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getHomePath = () => {
    if (isAuthenticated && user) {
      if (user.role === 'seller') return '/seller';
      if (user.role === 'admin') return '/admin';
      return '/home';
    }
    return '/';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to={getHomePath()} className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-neon-gradient flex items-center justify-center text-white shadow-premium glow-hover">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-slate-900">
            Vendor<span className="bg-gradient-to-r from-[#ff007f] via-[#e1306c] to-[#00f0ff] bg-clip-text text-transparent glow-text-neon animate-pulse-glow">Hub</span>
          </span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search products, brands, smart AI queries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm text-slate-800 placeholder-slate-405 transition-all"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-450" />
        </form>

        {/* Actions Deck */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/products"
            className={`text-sm font-semibold transition-colors ${location.pathname === '/products' ? 'text-brand-650' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Explore
          </Link>
          <Link
            to="/ai-search"
            className="btn-3d btn-3d-ai text-xs px-3.5 py-1.5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '4s' }} />
            Smart AI Search
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <ShoppingCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-premium">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Dashboard route based on role */}
          {isAuthenticated && user && (
            <Link
              to={user.role === 'seller' ? '/seller' : user.role === 'admin' ? '/admin' : '/orders'}
              className="text-sm font-semibold text-slate-600 hover:text-brand-600 flex items-center gap-1 hover:bg-slate-105 p-1.5 rounded-lg transition-all"
            >
              <Laptop className="w-4 h-4 text-slate-500" />
              Portal
            </Link>
          )}

          {/* Authentication trigger */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-brand-600 font-bold font-display text-sm group-hover:bg-slate-200 transition-colors">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[80px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-1.5 text-slate-450 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/role-selection"
              className="btn-3d btn-3d-auth btn-shimmer-wrap px-5 py-2 text-sm flex items-center gap-1.5"
            >
              <User className="w-4 h-4" />
              Join Platform
            </Link>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center md:hidden gap-3">
          <Link to="/cart" className="relative p-1.5 text-slate-600">
            <ShoppingCart className="w-5.5 h-5.5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-black h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 px-4 py-4 bg-white/95 backdrop-blur-md flex flex-col gap-4 shadow-lg text-slate-800">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500/20 focus:bg-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-450" />
          </form>

          <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-slate-900 py-1">
            Explore products
          </Link>
          <Link
            to="/ai-search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn-3d btn-3d-ai btn-shimmer-wrap py-2 text-center text-sm flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            Smart AI Search
          </Link>

          {isAuthenticated && user ? (
            <>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-slate-600 hover:text-slate-900 py-1 flex items-center gap-2">
                <User className="w-4 h-4" /> My Profile
              </Link>
              <Link
                to={user.role === 'seller' ? '/seller' : user.role === 'admin' ? '/admin' : '/orders'}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-600 hover:text-slate-900 py-1 flex items-center gap-2"
              >
                <Laptop className="w-4 h-4" /> Portals / Dashboards
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                  navigate('/');
                }}
                className="text-base font-semibold text-rose-600 py-1 flex items-center gap-2 text-left w-full"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <Link
              to="/role-selection"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 btn-3d btn-3d-auth btn-shimmer-wrap py-2 text-center text-sm block"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
