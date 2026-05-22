import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  AlertTriangle,
  Percent,
  CheckSquare,
  Sparkles,
  LogOut,
  ArrowLeft,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

// Defines navigation items for Seller
const sellerLinks = [
  { label: 'Dashboard', path: '/seller', icon: LayoutDashboard },
  { label: 'My Products', path: '/seller/products', icon: Package },
  { label: 'AI Add Product', path: '/seller/add-product', icon: PlusCircle },
  { label: 'Seller Orders', path: '/seller/orders', icon: ShoppingBag },
  { label: 'Low Stock Alerts', path: '/seller/low-stock', icon: AlertTriangle },
  { label: 'Earnings', path: '/seller/earnings', icon: DollarSign },
];

// Defines navigation items for Admin
const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Vendor Approvals', path: '/admin/approvals', icon: CheckSquare },
  { label: 'Refund Requests', path: '/admin/refunds', icon: AlertTriangle },
  { label: 'Commission Settings', path: '/admin/commissions', icon: Percent },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const links = isAdmin ? adminLinks : sellerLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 z-20">
      {/* Header Profile Info */}
      <div className="p-6 border-b border-slate-100">
        <Link to="/home" className="flex items-center gap-2 mb-6 group">
          <div className="w-8 h-8 rounded-lg bg-neon-gradient flex items-center justify-center text-white shadow-premium">
            <Sparkles className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <span className="font-display font-black text-base text-slate-900">
            Vendor<span className="bg-gradient-to-r from-[#ff007f] via-[#e1306c] to-[#00f0ff] bg-clip-text text-transparent glow-text-neon animate-pulse-glow">Hub</span>
          </span>
        </Link>

        {user && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-205 p-3 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold font-display shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-sm text-slate-800 truncate">{user.name}</h4>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {user.role} Portal
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Nav Actions */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] ${
                isActive
                  ? isAdmin
                    ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500 shadow-sm shadow-amber-500/10 translate-x-1'
                    : 'bg-violet-50 text-violet-800 border-l-4 border-violet-500 shadow-sm shadow-violet-500/10 translate-x-1'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:translate-x-0.5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? (isAdmin ? 'text-amber-600' : 'text-violet-600') : 'text-slate-400'}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
        <Link
          to="/home"
          className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to E-Commerce
        </Link>
        <button
          onClick={() => logout()}
          className="w-full btn-3d btn-3d-danger py-2 text-sm flex items-center justify-center gap-2"
        >
          <LogOut className="w-4.5 h-4.5 text-white" />
          Log Out
        </button>
      </div>
    </aside>
  );
};
